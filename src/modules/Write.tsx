import { useState } from 'react'
import { WRITING_PROMPTS } from '../lib/content'
import { load, save } from '../lib/storage'

export default function Write() {
  const [idx, setIdx] = useState(() => load<number>('write.idx', 0))
  const [text, setText] = useState(() => load<string>('write.text', ''))
  const [copied, setCopied] = useState(false)

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
        autoFocus
        value={text}
        onChange={(e) => update(e.target.value)}
        rows={12}
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
    </div>
  )
}
