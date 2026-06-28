import { useEffect, useRef, useState } from 'react'
import Keyboard from '../components/Keyboard'
import { codeToChar } from '../lib/keyboard'
import { WRITING_PROMPTS } from '../lib/content'
import { load, save } from '../lib/storage'

const isCyrillic = (ch: string) => ch.length === 1 && /[а-яёА-ЯЁ]/.test(ch)
const IDLE_MS = 30000 // stop counting after 30s idle; that idle half-minute is erased

const todayKey = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const fmt = (sec: number) => {
  if (sec < 60) return `${sec}s`
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h) return `${h}h ${m}m`
  return `${m}m ${s}s`
}
const dayLabel = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Write() {
  const [idx, setIdx] = useState(() => load<number>('write.idx', 0))
  const [text, setText] = useState(() => load<string>('write.text', ''))
  const [copied, setCopied] = useState(false)

  const taRef = useRef<HTMLTextAreaElement>(null)
  const [pressed, setPressed] = useState<{ code: string } | null>(null)
  const [shiftHeld, setShiftHeld] = useState(false)
  const [capsOn, setCapsOn] = useState(false)
  const flashTimer = useRef<number | null>(null)

  // --- active-writing time tracking ---
  const [history, setHistory] = useState<Record<string, number>>(() =>
    load<Record<string, number>>('write.time', {}),
  )
  const lastActivity = useRef(0)
  const grace = useRef(0) // seconds counted since last activity (erased if you go idle)

  const markActivity = () => {
    lastActivity.current = Date.now()
    grace.current = 0
  }

  useEffect(() => {
    const tick = () => {
      if (document.hidden || !document.hasFocus()) return
      if (!lastActivity.current) return
      const gap = Date.now() - lastActivity.current
      setHistory((h) => {
        const d = todayKey()
        const cur = h[d] || 0
        let next: number
        if (gap < IDLE_MS) {
          next = cur + 1
          grace.current += 1
        } else if (grace.current > 0) {
          next = Math.max(0, cur - grace.current) // erase the trailing idle
          grace.current = 0
        } else return h
        const nh = { ...h, [d]: next }
        save('write.time', nh)
        return nh
      })
    }
    const id = window.setInterval(tick, 1000)
    // leaving the tab "commits" whatever is counted so far (don't erase it later)
    const onBlur = () => {
      grace.current = 0
    }
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onBlur)
    return () => {
      clearInterval(id)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onBlur)
    }
  }, [])

  const prompt = WRITING_PROMPTS[idx]

  const update = (v: string) => {
    setText(v)
    save('write.text', v)
    markActivity()
  }

  const setPrompt = (i: number) => {
    setIdx(i)
    save('write.idx', i)
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0

  const flash = (code: string) => {
    setPressed({ code })
    if (flashTimer.current) clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setPressed(null), 160)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    markActivity()
    const caps = e.getModifierState('CapsLock')
    setCapsOn(caps)
    if (e.key === 'Shift') return setShiftHeld(true)
    if (e.metaKey || e.ctrlKey || e.altKey) return
    if (isCyrillic(e.key)) return
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Tab') return
    const lower = codeToChar(e.code, false)
    if (lower == null) return
    const isLetter = /[а-яё]/.test(lower)
    const ch = codeToChar(e.code, isLetter ? e.shiftKey !== caps : e.shiftKey)
    if (ch == null) return
    e.preventDefault()
    const ta = taRef.current
    if (!ta) return
    const s = ta.selectionStart
    const end = ta.selectionEnd
    update(text.slice(0, s) + ch + text.slice(end))
    flash(e.code)
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = s + ch.length
    })
  }

  function onKeyUp(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Shift') setShiftHeld(false)
    setCapsOn(e.getModifierState('CapsLock'))
  }

  useEffect(() => {
    taRef.current?.focus()
  }, [idx])

  async function exportForGrading() {
    const payload =
      `Please grade my Russian writing. Mark every error (spelling, grammar, word choice, ` +
      `naturalness), explain each briefly, then give a corrected version and a level estimate.\n\n` +
      `Prompt: ${prompt.ru} (${prompt.en})\n\nMy writing:\n${text}`
    try {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const todaySec = history[todayKey()] || 0
  const recent = Object.keys(history)
    .filter((k) => k !== todayKey() && history[k] > 0)
    .sort()
    .reverse()
    .slice(0, 5)

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="relative">
        <select
          value={idx}
          onChange={(e) => setPrompt(Number(e.target.value))}
          className="w-full appearance-none rounded-md border border-[var(--color-line)] bg-[var(--color-card)] py-1.5 pl-3 pr-9 text-sm"
        >
          {WRITING_PROMPTS.map((p, i) => (
            <option key={i} value={i}>
              {p.ru}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--color-muted)]">
          ▾
        </span>
      </div>

      <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-accent-soft)] p-4">
        <p className="font-cyr text-lg">{prompt.ru}</p>
        <p className="text-sm text-[var(--color-muted)]">{prompt.en}</p>
      </div>

      <textarea
        ref={taRef}
        autoFocus
        value={text}
        onChange={(e) => update(e.target.value)}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={() => setShiftHeld(false)}
        rows={10}
        placeholder="Пишите здесь…"
        className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-4 font-cyr text-lg leading-relaxed"
      />

      <div className="flex items-center justify-between gap-3 text-sm text-[var(--color-muted)]">
        <span>{words} words · autosaved</span>
        <button
          onClick={exportForGrading}
          disabled={!text.trim()}
          className="shrink-0 rounded-md bg-[var(--color-accent)] px-4 py-2 text-white disabled:opacity-40"
          title="Copies your prompt + text formatted as a grading request — paste it to Claude."
        >
          {copied ? 'Copied — paste to chat ✓' : 'Export for grading'}
        </button>
      </div>

      {/* accountability: active writing time (counts only while focused + typing) */}
      <div className="rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-[var(--color-muted)]">Active writing today</span>
          <span className="font-cyr text-2xl text-[var(--color-ink)]">{fmt(todaySec)}</span>
        </div>
        {recent.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[var(--color-line)] pt-2 text-xs text-[var(--color-muted)]">
            {recent.map((k) => (
              <span key={k}>
                {dayLabel(k)} · {fmt(history[k])}
              </span>
            ))}
          </div>
        )}
        <p className="mt-2 text-xs text-[var(--color-muted)]/70">
          Counts only while this tab is focused and you’re typing; pauses over 30s aren’t counted.
        </p>
      </div>

      {/* ЙЦУКЕН reference — hidden on mobile (own keyboard) */}
      <div className="hidden pt-2 md:block">
        <Keyboard
          nextCode={null}
          shiftHeld={shiftHeld !== capsOn}
          pressedCode={pressed?.code ?? null}
          pressedCorrect={true}
        />
      </div>
    </div>
  )
}
