import { SOUND_GROUPS } from '../lib/content'

function speak(text: string) {
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ru-RU'
    u.rate = 0.9
    const ru = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('ru'))
    if (ru) u.voice = ru
    synth.speak(u)
  } catch {
    /* speech not available */
  }
}

const Speaker = () => (
  <svg
    viewBox="0 0 24 24"
    width="12"
    height="12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 opacity-50"
    aria-hidden="true"
  >
    <path d="M11 5 6 9H3v6h3l5 4V5z" />
    <path d="M15.5 8.5a4 4 0 0 1 0 7" />
  </svg>
)

function Word({ w }: { w: string }) {
  return (
    <button
      type="button"
      onClick={() => speak(w)}
      className="inline-flex items-center gap-1 font-cyr hover:text-[var(--color-accent)]"
      aria-label={`Play ${w}`}
    >
      {w}
      <Speaker />
    </button>
  )
}

export default function Sounds() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <p className="text-sm text-[var(--color-muted)]">
        Pick a contrast and drill it. Tap any word to hear it — say the pairs back-to-back,
        exaggerating the difference.
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
                    <span className="flex items-baseline gap-1.5">
                      <Word w={p.a} /> <span className="text-[var(--color-muted)]">/</span>{' '}
                      <Word w={p.b} />
                    </span>
                    <span className="text-right text-xs text-[var(--color-muted)]">{p.note}</span>
                  </li>
                ))}
              </ul>
            )}

            {g.words && (
              <p className="flex flex-wrap gap-x-3 gap-y-1.5 text-[15px]">
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
