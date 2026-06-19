// Minimal spaced repetition (Leitner boxes). Good enough for a personal deck;
// no need for full SM-2 here.

export type Card = {
  id: string
  front: string // Russian
  back: string // English / note
  box: number // 0..5
  due: number // epoch ms
  tags?: string[]
}

// Interval per box, in days. Box 0 = relearn (a few minutes).
const INTERVAL_DAYS = [0, 1, 3, 7, 16, 40]
const MIN = 60 * 1000
const DAY = 24 * 60 * 60 * 1000

export function newCard(front: string, back: string, tags?: string[]): Card {
  return {
    id: `${front}|${back}`.toLowerCase(),
    front,
    back,
    box: 0,
    due: Date.now(),
    tags,
  }
}

export function review(card: Card, correct: boolean): Card {
  if (!correct) {
    return { ...card, box: 0, due: Date.now() + 3 * MIN }
  }
  const box = Math.min(card.box + 1, INTERVAL_DAYS.length - 1)
  const due = box === 0 ? Date.now() + 3 * MIN : Date.now() + INTERVAL_DAYS[box] * DAY
  return { ...card, box, due }
}

export function dueCards(cards: Card[], now = Date.now()): Card[] {
  return cards.filter((c) => c.due <= now).sort((a, b) => a.due - b.due)
}

/** Parse pasted text into cards. Accepts "front — back", "front - back",
 *  "front | back", "front\tback", or "front, back" (one pair per line). */
export function parseDeck(text: string): { front: string; back: string }[] {
  const out: { front: string; back: string }[] = []
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t) continue
    const m = t.match(/^(.*?)\s*(?:\t|—|\||\s-\s|,)\s*(.*)$/)
    if (m && m[1] && m[2]) out.push({ front: m[1].trim(), back: m[2].trim() })
  }
  return out
}
