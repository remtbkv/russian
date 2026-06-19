import { useEffect, useMemo, useRef, useState } from 'react'
import Keyboard from '../components/Keyboard'
import { charToKey, codeToChar } from '../lib/keyboard'
import { TYPING_LESSONS } from '../lib/content'
import { load, save } from '../lib/storage'

const isCyrillic = (ch: string) => ch.length === 1 && /[а-яёА-ЯЁ]/.test(ch)

export default function Type() {
  const isTouch = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches,
    [],
  )

  const [lessonId, setLessonId] = useState(TYPING_LESSONS[0].id)
  const [itemIdx, setItemIdx] = useState(0)
  const [best, setBest] = useState(() => load<number>('type.bestWpm', 0))

  const lesson = TYPING_LESSONS.find((l) => l.id === lessonId)!
  const target = lesson.items[itemIdx]

  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  // typing state (refs for handlers, mirrored to state for render)
  const pos = useRef(0)
  const errors = useRef(0)
  const startedAt = useRef<number | null>(null)
  const [, force] = useState(0)
  const rerender = () => force((n) => n + 1)

  const [pressed, setPressed] = useState<{ ok: boolean; code?: string } | null>(null)
  const [done, setDone] = useState<{ wpm: number; acc: number } | null>(null)

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
  }, [target])

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
    setPressed({ ok, code })
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
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (e.key === 'Backspace') {
      e.preventDefault()
      back()
      return
    }
    const ch = isCyrillic(e.key) ? e.key : codeToChar(e.code, e.shiftKey)
    if (ch == null) return // unknown key — let it through (e.g. mobile -> onChange)
    e.preventDefault()
    commit(ch, e.code)
  }

  // Fallback for soft keyboards that don't report usable keydown events.
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    for (const ch of e.target.value) commit(ch)
    // controlled value is always '' below, so the field clears after each char
  }

  const nextChar = target[pos.current] ?? ''
  const nextKey = nextChar ? charToKey(nextChar) : null

  const liveWpm =
    startedAt.current == null || pos.current === 0
      ? 0
      : Math.round(pos.current / 5 / ((performance.now() - startedAt.current) / 60000))

  const nextItem = () => setItemIdx((i) => (i + 1) % lesson.items.length)

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
        </select>

        <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
          <span>
            WPM <b className="text-[var(--color-ink)]">{done ? done.wpm : liveWpm}</b>
          </span>
          <span>
            best <b className="text-[var(--color-ink)]">{best}</b>
          </span>
        </div>
      </div>

      {/* practice card — tapping focuses the hidden input (opens the mobile keyboard) */}
      <div
        className="relative cursor-text rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-6"
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          value=""
          onChange={onChange}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          inputMode="text"
          lang="ru"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          aria-label="Type the sentence"
          className="absolute inset-0 h-full w-full cursor-text opacity-0"
        />
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
        {!focused && !done && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[var(--color-card)] text-sm text-[var(--color-muted)]">
            {isTouch ? 'Tap to type' : 'Click here to type'}
          </div>
        )}
      </div>

      {done ? (
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
            nextCode={nextKey?.code ?? null}
            shiftNeeded={nextKey?.shift}
            pressedCode={pressed?.code ?? null}
            pressedCorrect={pressed?.ok}
          />
        </div>
      )}
    </div>
  )
}
