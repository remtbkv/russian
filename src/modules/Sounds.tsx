import { SOUND_GROUPS, forvoUrl } from '../lib/content'

function Word({ w }: { w: string }) {
  return (
    <a
      href={forvoUrl(w)}
      target="_blank"
      rel="noreferrer"
      className="font-cyr hover:text-[var(--color-accent)] hover:underline"
    >
      {w}
    </a>
  )
}

export default function Sounds() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <p className="text-sm text-[var(--color-muted)]">
        Pick a contrast and drill it. Tap any word for native audio on Forvo — say the pairs
        back-to-back, exaggerating the difference.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {SOUND_GROUPS.map((g) => (
          <section
            key={g.id}
            className="space-y-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-card)] p-4"
          >
            <h2 className="font-cyr text-xl font-medium">{g.title}</h2>
            <p className="text-sm leading-relaxed text-[var(--color-muted)]">{g.note}</p>

            {g.pairs && (
              <ul className="space-y-1.5 text-[15px]">
                {g.pairs.map((p) => (
                  <li key={p.a} className="flex items-baseline justify-between gap-3">
                    <span>
                      <Word w={p.a} /> <span className="text-[var(--color-muted)]">/</span>{' '}
                      <Word w={p.b} />
                    </span>
                    <span className="text-right text-xs text-[var(--color-muted)]">{p.note}</span>
                  </li>
                ))}
              </ul>
            )}

            {g.words && (
              <p className="flex flex-wrap gap-x-3 gap-y-1 text-[15px]">
                {g.words.map((w) => (
                  <Word key={w} w={w} />
                ))}
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
