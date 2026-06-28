import { useState } from 'react'
import { lookup, wiktionaryUrl, type Lookup } from '../lib/dict'
import { addCard } from '../lib/vocabStore'
import { load, save } from '../lib/storage'

const SAMPLE = `Привет! Это пример текста. Вставьте сюда любую статью или текст на русском языке, а затем нажмите «Читать». В режиме чтения можно нажать на любое слово, чтобы увидеть его значение.`

export default function Read() {
  const [text, setText] = useState(() => load<string>('read.text', SAMPLE))
  const [reading, setReading] = useState(false)
  const [size, setSize] = useState(() => load<number>('read.size', 20))
  const [sel, setSel] = useState<{ word: string; defs: Lookup[] | null; loading: boolean } | null>(
    null,
  )
  const [added, setAdded] = useState(false)

  const start = () => {
    save('read.text', text)
    setReading(true)
  }

  async function onWord(word: string) {
    setAdded(false)
    setSel({ word, defs: null, loading: true })
    const defs = await lookup(word)
    setSel({ word, defs, loading: false })
  }

  function addToVocab() {
    const first = sel?.defs?.[0]?.defs?.[0] ?? ''
    if (sel) {
      addCard(sel.word, first, ['read'])
      setAdded(true)
    }
  }

  function setFont(next: number) {
    const v = Math.min(34, Math.max(14, next))
    setSize(v)
    save('read.size', v)
  }

  if (!reading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <p className="text-sm text-[var(--color-muted)]">
          Paste any Russian text — in reading view, tap a word for its definition.
        </p>
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-4 font-cyr text-lg leading-relaxed"
        />
        <button
          onClick={start}
          className="rounded-md bg-[var(--color-accent)] px-5 py-2 text-sm text-white"
        >
          Read →
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[1fr_18rem]">
      <div className="min-w-0 space-y-4 max-md:pb-[45vh]">
        <div className="flex items-center gap-3 text-sm">
          <button
            onClick={() => setReading(false)}
            className="rounded-md border border-[var(--color-line)] px-3 py-1"
          >
            ← Edit text
          </button>
          <div className="inline-flex items-center overflow-hidden rounded-md border border-[var(--color-line)]">
            <button
              onClick={() => setFont(size - 2)}
              className="px-3 py-1 text-base leading-none hover:bg-[var(--color-accent-soft)]"
              aria-label="Smaller text"
            >
              −
            </button>
            <span className="border-x border-[var(--color-line)] px-2.5 py-1 text-xs text-[var(--color-muted)]">
              Font
            </span>
            <button
              onClick={() => setFont(size + 2)}
              className="px-3 py-1 text-base leading-none hover:bg-[var(--color-accent-soft)]"
              aria-label="Larger text"
            >
              +
            </button>
          </div>
        </div>

        <div className="break-words font-cyr leading-relaxed" style={{ fontSize: size }}>
          {text.split('\n').map((para, pi) => (
            <p key={pi} className="mb-4">
              {tokenize(para).map((tok, i) =>
                tok.word ? (
                  <span
                    key={i}
                    onClick={() => onWord(tok.text)}
                    className="cursor-pointer rounded px-0.5 hover:bg-[var(--color-accent-soft)]"
                  >
                    {tok.text}
                  </span>
                ) : (
                  <span key={i}>{tok.text}</span>
                ),
              )}
            </p>
          ))}
        </div>
      </div>

      <aside
        className={
          'break-words rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-4 text-sm ' +
          'md:sticky md:top-4 md:h-fit ' +
          'max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-20 max-md:max-h-[45vh] ' +
          'max-md:overflow-auto max-md:rounded-b-none max-md:border-x-0 max-md:shadow-[0_-4px_16px_rgba(0,0,0,0.12)] ' +
          (sel ? '' : 'max-md:hidden')
        }
      >
        {!sel ? (
          <p className="text-[var(--color-muted)]">Tap a word to look it up.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <p className="min-w-0 break-words font-cyr text-xl">{sel.word}</p>
              <button
                onClick={() => setSel(null)}
                className="text-[var(--color-muted)] md:hidden"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {sel.loading && <p className="text-[var(--color-muted)]">Looking up…</p>}
            {!sel.loading && !sel.defs && (
              <p className="text-[var(--color-muted)]">
                No entry found.{' '}
                <a
                  href={wiktionaryUrl(sel.word)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--color-accent)] underline"
                >
                  Wiktionary
                </a>
              </p>
            )}
            {sel.defs?.map((entry, i) => (
              <div key={i}>
                {entry.pos && (
                  <p className="text-xs uppercase tracking-wide text-[var(--color-muted)]">
                    {entry.pos}
                  </p>
                )}
                <ol className="list-decimal space-y-1 pl-4">
                  {entry.defs.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ol>
              </div>
            ))}
            {sel.defs && (
              <button
                onClick={addToVocab}
                disabled={added}
                className="w-full rounded-md border border-[var(--color-line)] px-3 py-1.5 text-xs disabled:opacity-50"
              >
                {added ? 'Added to vocab ✓' : '+ Add to vocab'}
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}

type Tok = { text: string; word: boolean }
function tokenize(s: string): Tok[] {
  const out: Tok[] = []
  const re = /([а-яёА-ЯЁa-zA-Z]+(?:-[а-яёА-ЯЁa-zA-Z]+)*)/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ text: s.slice(last, m.index), word: false })
    out.push({ text: m[0], word: true })
    last = m.index + m[0].length
  }
  if (last < s.length) out.push({ text: s.slice(last), word: false })
  return out
}
