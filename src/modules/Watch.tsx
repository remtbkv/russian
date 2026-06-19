import { useState } from 'react'
import { load, save } from '../lib/storage'

function videoId(url: string): string | null {
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim()
  return null
}

export default function Watch() {
  const [url, setUrl] = useState(() => load<string>('watch.url', ''))
  const [id, setId] = useState<string | null>(() => videoId(load<string>('watch.url', '')))

  const go = () => {
    const v = videoId(url)
    setId(v)
    if (v) save('watch.url', url)
  }

  const src = id
    ? `https://www.youtube-nocookie.com/embed/${id}?cc_load_policy=1&cc_lang_pref=ru&hl=ru`
    : null

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <p className="text-sm text-[var(--color-muted)]">
        Paste a YouTube link — it embeds with captions on (Russian preferred). Use the CC button if
        the video offers other subtitle languages.
      </p>
      <div className="flex gap-2">
        <input
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && go()}
          placeholder="https://youtube.com/watch?v=…"
          className="flex-1 rounded-md border border-[var(--color-line)] bg-[var(--color-card)] px-3 py-2 text-sm"
        />
        <button onClick={go} className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm text-white">
          Load
        </button>
      </div>

      {url && !id && <p className="text-sm text-[var(--color-bad)]">Couldn’t find a video ID in that link.</p>}

      {src && (
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-[var(--color-line)]">
          <iframe
            src={src}
            title="YouTube"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}
