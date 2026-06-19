// Client-side word lookup via the (CORS-enabled) Wiktionary REST API.
// No API key, no backend.

export type Lookup = {
  word: string
  pos: string
  defs: string[]
}

const stripHtml = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z]+;/g, (m) => ({ '&amp;': '&', '&quot;': '"', '&#39;': "'" }[m] ?? ' '))
    .trim()

export function normalize(raw: string): string {
  return raw.toLowerCase().replace(/[^а-яёa-z-]/gi, '')
}

export function wiktionaryUrl(word: string): string {
  return `https://ru.wiktionary.org/wiki/${encodeURIComponent(word)}`
}

export async function lookup(word: string): Promise<Lookup[] | null> {
  const w = normalize(word)
  if (!w) return null
  try {
    const res = await fetch(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(w)}`,
      { headers: { accept: 'application/json' } },
    )
    if (!res.ok) return null
    const data = (await res.json()) as Record<
      string,
      { partOfSpeech?: string; definitions?: { definition?: string }[] }[]
    >
    const ru = data['ru']
    if (!ru || !ru.length) return null
    return ru
      .map((entry) => ({
        word: w,
        pos: entry.partOfSpeech ?? '',
        defs: (entry.definitions ?? [])
          .map((d) => stripHtml(d.definition ?? ''))
          .filter(Boolean)
          .slice(0, 4),
      }))
      .filter((e) => e.defs.length)
  } catch {
    return null
  }
}
