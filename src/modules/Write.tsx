import { useEffect, useRef, useState } from 'react'
import Keyboard from '../components/Keyboard'
import { codeToChar } from '../lib/keyboard'
import { WRITING_PROMPTS } from '../lib/content'
import { load, save } from '../lib/storage'

const isCyrillic = (ch: string) => ch.length === 1 && /[а-яёА-ЯЁ]/.test(ch)

export default function Write() {
  const [idx, setIdx] = useState(() => load<number>('write.idx', 0))
  const [text, setText] = useState(() => load<string>('write.text', ''))
  const [copied, setCopied] = useState(false)

  const taRef = useRef<HTMLTextAreaElement>(null)
  const [pressed, setPressed] = useState<{ code: string } | null>(null)
  const [shiftHeld, setShiftHeld] = useState(false)
  const [capsOn, setCapsOn] = useState(false)
  const flashTimer = useRef<number | null>(null)

  const prompt = WRITING_PROMPTS[idx]

  const update = (v: string) => {
    setText(v)
    save('write.text', v)
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

  // Positional ЙЦУКЕН input: on a US layout the physical key produces the Cyrillic
  // letter in its ЙЦУКЕН position. If the OS already sends Cyrillic (Russian layout
  // or a phone keyboard), we let it through untouched.
  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const caps = e.getModifierState('CapsLock')
    setCapsOn(caps)
    if (e.key === 'Shift') return setShiftHeld(true)
    if (e.metaKey || e.ctrlKey || e.altKey) return // shortcuts (copy/paste/etc.)
    if (isCyrillic(e.key)) return // OS already produced Cyrillic
    if (e.code === 'Space' || e.code === 'Enter' || e.code === 'Tab') return
    const lower = codeToChar(e.code, false)
    if (lower == null) return // unmapped (digits, arrows, etc.) — normal behavior
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
    // restore caret right after the inserted char once React re-renders
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

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <select
        value={idx}
        onChange={(e) => setPrompt(Number(e.target.value))}
        className="w-full rounded-md border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-1.5 text-sm"
      >
        {WRITING_PROMPTS.map((p, i) => (
          <option key={i} value={i}>
            {p.ru}
          </option>
        ))}
      </select>

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

      {/* ЙЦУКЕН reference — your physical keys map here; hidden on mobile (own keyboard) */}
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
