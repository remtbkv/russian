import { useMemo, useRef, useState } from 'react'
import { GRAMMAR, type Block } from '../lib/grammar'

// Tiny inline formatter: **bold** segments only.
function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('**') && p.endsWith('**') ? (
          <strong key={i} className="font-semibold text-[var(--color-ink)]">
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

function BlockView({ block }: { block: Block }) {
  if ('p' in block)
    return (
      <p className="text-[15px] leading-relaxed text-[var(--color-ink)]/90">
        <RichText text={block.p} />
      </p>
    )

  if ('list' in block)
    return (
      <ul className="space-y-1.5 pl-1">
        {block.list.map((item, i) => (
          <li key={i} className="flex gap-2 text-[15px] leading-relaxed text-[var(--color-ink)]/90">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
            <span>
              <RichText text={item} />
            </span>
          </li>
        ))}
      </ul>
    )

  if ('note' in block)
    return (
      <div className="rounded-lg border-l-2 border-[var(--color-accent)] bg-[var(--color-accent-soft)] px-3 py-2 text-sm text-[var(--color-ink)]/85">
        <RichText text={block.note} />
      </div>
    )

  if ('ex' in block)
    return (
      <div className="space-y-1.5">
        {block.ex.map((e, i) => (
          <div key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="font-cyr text-lg text-[var(--color-ink)]">{e.ru}</span>
            <span className="text-sm text-[var(--color-muted)]">{e.en}</span>
            {e.note && (
              <span className="text-xs italic text-[var(--color-muted)]/80">— {e.note}</span>
            )}
          </div>
        ))}
      </div>
    )

  // table
  const t = block.table
  return (
    <div className="space-y-1">
      {t.caption && <p className="text-xs italic text-[var(--color-muted)]">{t.caption}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {t.headers.map((h, i) => (
                <th
                  key={i}
                  className="border-b border-[var(--color-line)] px-2.5 py-1.5 text-left font-semibold text-[var(--color-muted)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className={
                      'border-b border-[var(--color-line)]/60 px-2.5 py-1.5 align-top ' +
                      (ci === 0
                        ? 'font-medium text-[var(--color-muted)]'
                        : 'font-cyr text-[var(--color-ink)]')
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Grammar() {
  const [activeGroup, setActiveGroup] = useState(GRAMMAR[0].id)
  const [query, setQuery] = useState('')
  const contentRef = useRef<HTMLDivElement>(null)

  const q = query.trim().toLowerCase()

  // Filter topics by query (search title + all text). Empty query → just the
  // selected group.
  const visible = useMemo(() => {
    if (!q) {
      const g = GRAMMAR.find((g) => g.id === activeGroup) ?? GRAMMAR[0]
      return [{ group: g, topics: g.topics }]
    }
    const matchText = (block: Block): string => {
      if ('p' in block) return block.p
      if ('list' in block) return block.list.join(' ')
      if ('note' in block) return block.note
      if ('ex' in block) return block.ex.map((e) => `${e.ru} ${e.en} ${e.note ?? ''}`).join(' ')
      return [block.table.caption ?? '', ...block.table.headers, ...block.table.rows.flat()].join(' ')
    }
    return GRAMMAR.map((g) => ({
      group: g,
      topics: g.topics.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.blocks.some((b) => matchText(b).toLowerCase().includes(q)),
      ),
    })).filter((x) => x.topics.length > 0)
  }, [q, activeGroup])

  return (
    <div className="mx-auto max-w-5xl">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search grammar (e.g. genitive, aspect, plural)…"
        className="mb-5 w-full rounded-lg border border-[var(--color-line)] bg-[var(--color-card)] px-4 py-2.5 text-sm"
      />

      <div className="grid gap-6 md:grid-cols-[13rem_1fr]">
        {/* group nav — hidden while searching across all groups */}
        {!q && (
          <nav className="flex gap-2 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible">
            {GRAMMAR.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setActiveGroup(g.id)
                  contentRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
                }}
                className={
                  'shrink-0 rounded-md px-3 py-1.5 text-left text-sm transition-colors ' +
                  (g.id === activeGroup
                    ? 'bg-[var(--color-accent-soft)] font-medium text-[var(--color-accent)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]')
                }
              >
                {g.title}
              </button>
            ))}
          </nav>
        )}

        <div ref={contentRef} className={'space-y-10 ' + (q ? 'md:col-span-2' : '')}>
          {visible.length === 0 && (
            <p className="text-sm text-[var(--color-muted)]">No grammar matches “{query}”.</p>
          )}
          {visible.map(({ group, topics }) => (
            <section key={group.id} className="space-y-8">
              {q && (
                <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
                  {group.title}
                </h2>
              )}
              {topics.map((topic) => (
                <article key={topic.id} className="space-y-3 scroll-mt-20">
                  <h3 className="font-cyr text-xl font-bold text-[var(--color-ink)]">
                    {topic.title}
                  </h3>
                  <div className="space-y-3">
                    {topic.blocks.map((b, i) => (
                      <BlockView key={i} block={b} />
                    ))}
                  </div>
                </article>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
