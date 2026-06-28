import { useEffect, useRef, useState } from 'react'
import Keyboard from '../components/Keyboard'
import Dropdown from '../components/Dropdown'
import { charToKey, codeToChar } from '../lib/keyboard'
import { TYPING_LESSONS } from '../lib/content'
import { load, save } from '../lib/storage'

const isCyrillic = (ch: string) => ch.length === 1 && /[а-яёА-ЯЁ]/.test(ch)
const FREE = 'free'

export default function Type() {
  const [lessonId, setLessonId] = useState(TYPING_LESSONS[0].id)
  const [itemIdx, setItemIdx] = useState(() => {
    const n = TYPING_LESSONS[0].items.length
    return n > 1 ? Math.floor(Math.random() * n) : 0
  })
  const recent = useRef<number[]>([]) // recently shown indices, to avoid repeats
  const [autoNext, setAutoNext] = useState(() => load<boolean>('type.autoNext', false))
  const [correctLetters, setCorrectLetters] = useState(() => load<number>('type.correctLetters', 0))
  const [correctWords, setCorrectWords] = useState(() => load<number>('type.correctWords', 0))

  const isFree = lessonId === FREE
  const lesson = TYPING_LESSONS.find((l) => l.id === lessonId)
  const target = lesson ? lesson.items[itemIdx] : ''

  const inputRef = useRef<HTMLInputElement>(null)

  // per-word typing state (refs for handlers, mirrored to render via force)
  const pos = useRef(0)
  const errors = useRef(0)
  const startedAt = useRef<number | null>(null)
  const [, force] = useState(0)
  const rerender = () => force((n) => n + 1)

  const [pressed, setPressed] = useState<{ ok: boolean; code?: string } | null>(null)
  const [shiftHeld, setShiftHeld] = useState(false)
  const [capsOn, setCapsOn] = useState(false)
  const [wrongCh, setWrongCh] = useState<string | null>(null)
  const shakeKey = useRef(0)
  const [done, setDone] = useState<{ wpm: number; acc: number } | null>(null)
  const [lastStats, setLastStats] = useState<{ wpm: number; acc: number } | null>(null)
  const [free, setFree] = useState('')
  const [copied, setCopied] = useState(false)

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
    setWrongCh(null)
    setDone(null)
    rerender()
  }

  useEffect(reset, [target])
  useEffect(() => {
    inputRef.current?.focus()
  }, [target, lessonId])

  useEffect(() => {
    const refocus = () => inputRef.current?.focus()
    window.addEventListener('focus', refocus)
    document.addEventListener('visibilitychange', refocus)
    return () => {
      window.removeEventListener('focus', refocus)
      document.removeEventListener('visibilitychange', refocus)
    }
  }, [])

  const bumpLetters = () =>
    setCorrectLetters((n) => {
      const v = n + 1
      save('type.correctLetters', v)
      return v
    })
  const bumpWords = () =>
    setCorrectWords((n) => {
      const v = n + 1
      save('type.correctWords', v)
      return v
    })

  function finishWord() {
    const mins = (performance.now() - (startedAt.current ?? performance.now())) / 60000
    const wpm = mins > 0 ? Math.round(target.length / 5 / mins) : 0
    const total = target.length + errors.current
    const acc = total > 0 ? Math.round((target.length / total) * 100) : 100
    setLastStats({ wpm, acc })
    bumpWords()
    if (autoNext) advance()
    else setDone({ wpm, acc })
  }

  // Pick a random next item, avoiding the current one and the last few shown so
  // consecutive drills aren't the same or too close together.
  function advance() {
    const n = lesson?.items.length ?? 1
    if (n <= 1) {
      setItemIdx(0)
      return
    }
    const k = Math.max(0, Math.min(n - 2, 4))
    const avoid = new Set<number>([itemIdx, ...recent.current.slice(-k)])
    let c = itemIdx
    while (avoid.has(c)) c = Math.floor(Math.random() * n)
    recent.current.push(c)
    if (recent.current.length > 20) recent.current.shift()
    setItemIdx(c)
  }

  function commit(ch: string, code?: string) {
    if (done) return
    if (startedAt.current == null) startedAt.current = performance.now()
    const ok = ch === target[pos.current]
    flash(ok, code)
    if (ok) {
      setWrongCh(null)
      bumpLetters()
      pos.current += 1
      if (pos.current >= target.length) finishWord()
    } else {
      errors.current += 1
      setWrongCh(ch)
      shakeKey.current += 1
    }
    rerender()
  }

  function back() {
    if (wrongCh != null) {
      setWrongCh(null)
    } else if (pos.current > 0) {
      pos.current -= 1
    }
    rerender()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
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
      ch = e.key
    } else {
      const lower = codeToChar(e.code, false)
      const isLetter = lower != null && /[а-яё]/.test(lower)
      ch = codeToChar(e.code, isLetter ? e.shiftKey !== caps : e.shiftKey)
    }
    if (ch == null) return
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

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value
    if (isFree) {
      setFree((s) => s + v)
      setCopied(false)
    } else {
      for (const ch of v) commit(ch)
    }
  }

  const nextChar = target[pos.current] ?? ''
  const nextKey = nextChar ? charToKey(nextChar) : null

  const liveWpm =
    startedAt.current == null || pos.current === 0
      ? 0
      : Math.round(pos.current / 5 / ((performance.now() - startedAt.current) / 60000))
  const liveAcc =
    pos.current + errors.current === 0
      ? 100
      : Math.round((pos.current / (pos.current + errors.current)) * 100)

  // What to show in the header: the just-finished word's stats until you start the
  // next one (so auto-next still surfaces them), otherwise the live numbers.
  const fresh = pos.current === 0 && wrongCh == null
  const showWpm = done ? done.wpm : fresh && lastStats ? lastStats.wpm : liveWpm
  const showAcc = done ? done.acc : fresh && lastStats ? lastStats.acc : liveAcc

  const nextItem = () => advance()

  async function copyFree() {
    try {
      await navigator.clipboard.writeText(free)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked */
    }
    inputRef.current?.focus()
  }

  const toggleAutoNext = () =>
    setAutoNext((v) => {
      save('type.autoNext', !v)
      return !v
    })

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Dropdown
          ariaLabel="Lesson"
          value={lessonId}
          options={[
            ...TYPING_LESSONS.map((l) => ({ value: l.id, label: l.title })),
            { value: FREE, label: 'Free type' },
          ]}
          onChange={(v) => {
            setLessonId(v)
            const n = TYPING_LESSONS.find((l) => l.id === v)?.items.length ?? 1
            const start = n > 1 ? Math.floor(Math.random() * n) : 0
            recent.current = [start]
            setItemIdx(start)
          }}
        />

        {!isFree && (
          <div className="flex items-center gap-4 text-sm text-[var(--color-muted)]">
            <span>
              WPM <b className="text-[var(--color-ink)]">{showWpm}</b>
            </span>
            <span>
              acc <b className="text-[var(--color-ink)]">{showAcc}%</b>
            </span>
            <label className="flex cursor-pointer select-none items-center gap-1.5">
              <input
                type="checkbox"
                checked={autoNext}
                onChange={toggleAutoNext}
                className="accent-[var(--color-accent)]"
              />
              auto-next
            </label>
          </div>
        )}
      </div>

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
        aria-label={isFree ? 'Free typing' : 'Type the text'}
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
              const isCur = i === pos.current
              if (isCur && wrongCh != null) {
                return (
                  <span
                    key={`w${shakeKey.current}`}
                    className={'shake text-[var(--color-bad)] ' + (c === ' ' ? 'px-1' : '')}
                  >
                    {wrongCh === ' ' ? c : wrongCh}
                  </span>
                )
              }
              let cls = 'text-[var(--color-muted)]/50'
              if (i < pos.current) cls = 'text-[var(--color-good)]'
              else if (isCur)
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

      {!isFree && (
        <p className="text-center text-xs text-[var(--color-muted)]">
          {correctLetters.toLocaleString()} letters · {correctWords.toLocaleString()} words typed
          correctly
        </p>
      )}
    </div>
  )
}
