import { useMemo, useState } from 'react'
import { dueCards, parseDeck, review, newCard, type Card } from '../lib/srs'
import { getCards, setCards } from '../lib/vocabStore'
import { STARTER_DECK } from '../lib/content'

export default function Vocab() {
  const [cards, setLocal] = useState<Card[]>(() => getCards())
  const [revealed, setRevealed] = useState(false)
  const [importText, setImportText] = useState('')
  const [importMsg, setImportMsg] = useState('')

  const persist = (next: Card[]) => {
    setCards(next)
    setLocal(next)
  }

  const due = useMemo(() => dueCards(cards), [cards])
  const current = due[0]

  function grade(correct: boolean) {
    if (!current) return
    const next = cards.map((c) => (c.id === current.id ? review(c, correct) : c))
    persist(next)
    setRevealed(false)
  }

  function loadStarter() {
    const additions = STARTER_DECK.filter(
      (s) => !cards.some((c) => c.id === `${s.front}|${s.back}`.toLowerCase()),
    ).map((s) => newCard(s.front, s.back, s.tags))
    persist([...cards, ...additions])
  }

  function doImport() {
    const pairs = parseDeck(importText)
    const existing = new Set(cards.map((c) => c.id))
    const additions = pairs
      .map((p) => newCard(p.front, p.back))
      .filter((c) => !existing.has(c.id))
    persist([...cards, ...additions])
    setImportText('')
    setImportMsg(
      pairs.length === 0
        ? 'No pairs found — use “word — translation”, one per line.'
        : `Added ${additions.length} card${additions.length === 1 ? '' : 's'}` +
            (additions.length < pairs.length ? ` (${pairs.length - additions.length} already in deck)` : ''),
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="text-right text-sm text-[var(--color-muted)]">
        {cards.length} cards · {due.length} due
      </div>

      {cards.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-6 text-center">
          <p className="mb-3 text-[var(--color-muted)]">No cards yet.</p>
          <button
            onClick={loadStarter}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm text-white"
          >
            Load starter deck
          </button>
        </div>
      ) : !current ? (
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-8 text-center">
          <p className="text-lg">All caught up 🎉</p>
          <p className="text-sm text-[var(--color-muted)]">Nothing due right now. Come back later.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-8 text-center">
          <p className="font-cyr text-3xl">{current.front}</p>
          {revealed ? (
            <>
              <p className="mt-4 text-lg text-[var(--color-muted)]">{current.back}</p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => grade(false)}
                  className="rounded-md border border-[var(--color-bad)] px-5 py-2 text-sm text-[var(--color-bad)]"
                >
                  Again
                </button>
                <button
                  onClick={() => grade(true)}
                  className="rounded-md border border-[var(--color-good)] bg-[var(--color-good)] px-5 py-2 text-sm text-white"
                >
                  Got it
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="mt-6 rounded-md border border-[var(--color-line)] px-5 py-2 text-sm"
            >
              Show answer
            </button>
          )}
        </div>
      )}

      <div className="space-y-2 border-t border-[var(--color-line)] pt-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">Import</h2>
          <span className="text-xs text-[var(--color-muted)]">one pair per line</span>
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          Paste <code>слово — word</code> per line (also accepts tab, comma, |, or " - "). Give me a
          file in chat and I’ll format it for this box.
        </p>
        <textarea
          value={importText}
          onChange={(e) => {
            setImportText(e.target.value)
            setImportMsg('')
          }}
          rows={6}
          placeholder={'привет — hello\nспасибо — thank you'}
          className="w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] p-3 font-cyr text-sm"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={doImport}
            disabled={!importText.trim()}
            className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm text-white disabled:opacity-40"
          >
            Add cards
          </button>
          {importMsg && <span className="text-xs text-[var(--color-muted)]">{importMsg}</span>}
        </div>
      </div>
    </div>
  )
}
