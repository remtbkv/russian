import { useEffect, useRef, useState } from 'react'
import Keyboard from '../components/Keyboard'
import { charToKey, codeToChar } from '../lib/keyboard'
import { TYPING_LESSONS } from '../lib/content'
import { load, save } from '../lib/storage'

const isCyrillic = (ch: string) => ch.length === 1 && /[а-яёА-ЯЁ]/.test(ch)
const FREE = 'free'

export default function Type() {
  const [lessonId, setLessonId] = useState(TYPING_LESSONS[0].id)
  const [itemIdx, setItemIdx] = useState(0)
  const [best, setBest] = useState(() => load<number>('type.bestWpm', 0))

  const isFree = lessonId === FREE
  const lesson = TYPING_LESSONS.find((l) => l.id === lessonId)
  const target = lesson ? lesson.items[itemIdx] : ''

  const inputRef = useRef<HTMLInputElement>(null)

  // typing state (refs for handlers, mirrored to state for render)
  const pos = useRef(0)
  const errors = useRef(0)
  const startedAt = useRef<number | null>(null)
  const [, force] = useState(0)
  const rerender = () => force((n) => n + 1)

  const [pressed, setPressed] = useState<{ ok: boolean; code?: string } | null>(null)
  const [shiftHeld, setShiftHeld] = useState(false)
  const [capsOn, setCapsOn] = useState(false)
  const [done, setDone] = useState<{ wpm: number; acc: number } | null>(null)
  const [free, setFree] = useState('')
  const [copied, setCopied] = useState(false)

  // brief flash on a key, then clear so it doesn't linger
  const flashTimer = useRef<number | null>(null)
  const flash = (ok: boolean, code?: string) => {
    setPressed({ ok, code })
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setPressed(null), 160)
  }

  const reset = () => {
    pos.current = 0
    errors.current = 0
    startedAt.current = null
    setPressed(null)
    setDone(null)
    rerender()
  }

  useEffect(reset, [target])
  useEffect(() => {
    inputRef.current?.focus()
  }, [target, lessonId])

  // Stay ready to type: refocus when the tab/window regains focus, so coming
  // back to the page never needs a click.
  useEffect(() => {
    const refocus = () => inputRef.current?.focus()
    window.addEventListener('focus', refocus)
    document.addEventListener('visibilitychange', refocus)
    return () => {
      window.removeEventListener('focus', refocus)
      document.removeEventListener('visibilitychange', refocus)
    }
  }, [])

  function commit(ch: string, code?: string) {
    if (done) return
    if (startedAt.current == null) startedAt.current = performance.now()
    const ok = ch === target[pos.current]
    flash(ok, code)
    if (ok) {
      pos.current += 1
      if (pos.current >= target.length) {
        const mins = (performance.now() - (startedAt.current ?? 0)) / 60000
        const wpm = mins > 0 ? Math.round(target.length / 5 / mins) : 0
        const total = target.length + errors.current
        const acc = total > 0 ? Math.round((target.length / total) * 100) : 100
        setDone({ wpm, acc })
        if (wpm > best) {
          setBest(wpm)
          save('type.bestWpm', wpm)
        }
      }
    } else {
      errors.current += 1
    }
    rerender()
  }

  function back() {
    if (pos.current > 0) pos.current -= 1
    rerender()
  }

  // Auto-detect input: if the OS sends a real Cyrillic letter (Russian layout
  // installed) use it; otherwise map the physical key position to Cyrillic. Works
  // either way, no mode to toggle. Mobile soft keyboards fall through to onChange.
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Read the real Caps Lock state straight from the event, so it works no
    // matter which physical key is remapped to send Caps Lock.
    const caps = e.getModifierState('CapsLock')
    setCapsOn(caps)
    if (e.key === 'Shift') {
      setShiftHeld(true)
      return
    }
    if (e.key === 'CapsLock') return
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (isFree) {
        setFree((s) => s.slice(0, -1))
        flash(true, 'Backspace')
      } else back()
      return
    }
    let ch: string | null
    if (isCyrillic(e.key)) {
      ch = e.key // real Russian layout: OS already applied shift + caps lock
    } else {
      // Positional mode. Caps Lock only flips letters, not punctuation, so apply
      // the XOR to letter keys and leave symbol keys on plain shift.
      const lower = codeToChar(e.code, false)
      const isLetter = lower != null && /[а-яё]/.test(lower)
      ch = codeToChar(e.code, isLetter ? e.shiftKey !== caps : e.shiftKey)
    }
    if (ch == null) return // unknown key — let it through (e.g. mobile -> onChange)
    e.preventDefault()
    if (isFree) {
      setFree((s) => s + ch)
      setCopied(false)
      flash(true, e.code)
    } else {
      commit(ch, e.code)
    }
  }

  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Shift') setShiftHeld(false)
    setCapsOn(e.getModifierState('CapsLock'))
  }

  // Fallback for soft keyboards that don't report usable keydown events.
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (isFree) {
      setFree((s) => s + v)
      setCopied(false)
    } else {
      for (const ch of v) commit(ch)
    }
    // controlled value is always '' below, so the field clears after each char
  }

  const nextChar = target[pos.current] ?? ''
  const nextKey = nextChar ? charToKey(nextChar) : null

  const liveWpm =
    startedAt.current == null || pos.current === 0
      ? 0
      : Math.round(pos.current / 5 / ((performance.now() - startedAt.current) / 60000))

  const nextItem = () => setItemIdx((i) => (i + 1) % (lesson?.items.length ?? 1))

  async function copyFree() {
    try {
      await navigator.clipboard.writeText(free)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked — ignore */
    }
    inputRef.current?.focus()
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select
          value={lessonId}
          onChange={(e) => {
            setLessonId(e.target.value)
            setItemIdx(0)
          }}
          className="rounded-md border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1.5 text-sm"
        >
          {TYPING_LESSONS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
          <option value={FREE}>Free type</option>
        </select>

        {!isFree && (
          <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
            <span>
              WPM <b className="text-[var(--color-ink)]">{done ? done.wpm : liveWpm}</b>
            </span>
            <span>
              best <b className="text-[var(--color-ink)]">{best}</b>
            </span>
          </div>
        )}
      </div>

      {/* hidden input captures keystrokes (and opens the mobile keyboard) */}
      <input
        ref={inputRef}
        value=""
        onChange={onChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => setShiftHeld(false)}
        inputMode="text"
        lang="ru"
        autoFocus
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        aria-label={isFree ? 'Free typing' : 'Type the sentence'}
        className="sr-only"
      />

      {isFree ? (
        <div className="space-y-3">
          <div
            onClick={() => inputRef.current?.focus()}
            className="min-h-[8rem] cursor-text whitespace-pre-wrap break-words rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-5 font-cyr text-2xl leading-relaxed tracking-wide"
          >
            {free || (
              <span className="text-[var(--color-muted)]/60">
                Start typing — your keyboard becomes ЙЦУКЕН here. Type freely, then copy.
              </span>
            )}
            <span className="animate-pulse text-[var(--color-accent)]">|</span>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setFree('')
                inputRef.current?.focus()
              }}
              className="rounded-md border border-[var(--color-line)] px-4 py-2 text-sm"
            >
              Clear
            </button>
            <button
              onClick={copyFree}
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm text-white"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      ) : (
        <div
          className="cursor-text rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-6"
          onClick={() => inputRef.current?.focus()}
        >
          <p className="text-center font-cyr text-3xl leading-relaxed tracking-wide">
            {target.split('').map((c, i) => {
              let cls = 'text-[var(--color-muted)]/50'
              if (i < pos.current) cls = 'text-[var(--color-good)]'
              else if (i === pos.current)
                cls =
                  'text-[var(--color-ink)] underline decoration-[var(--color-accent)] decoration-2 underline-offset-4'
              return (
                <span key={i} className={c === ' ' ? 'px-1 ' + cls : cls}>
                  {c}
                </span>
              )
            })}
          </p>
        </div>
      )}

      {!isFree && done ? (
        <div className="space-y-3 text-center">
          <p className="text-lg">
            <b>{done.wpm} WPM</b> · {done.acc}% accuracy
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                reset()
                inputRef.current?.focus()
              }}
              className="rounded-md border border-[var(--color-line)] px-4 py-2 text-sm"
            >
              Retry
            </button>
            <button
              onClick={nextItem}
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm text-white"
            >
              Next →
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:block">
          <Keyboard
            nextCode={isFree ? null : nextKey?.code ?? null}
            shiftNeeded={!isFree && nextKey?.shift}
            shiftHeld={shiftHeld !== capsOn}
            pressedCode={pressed?.code ?? null}
            pressedCorrect={pressed?.ok}
          />
        </div>
      )}
    </div>
  )
}
