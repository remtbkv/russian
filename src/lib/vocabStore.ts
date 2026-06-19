import { load, save } from './storage'
import { newCard, type Card } from './srs'

const KEY = 'vocab.cards'

export function getCards(): Card[] {
  return load<Card[]>(KEY, [])
}

export function setCards(cards: Card[]): void {
  save(KEY, cards)
}

/** Add a card if its id isn't already present. Returns true if added. */
export function addCard(front: string, back: string, tags?: string[]): boolean {
  const cards = getCards()
  const card = newCard(front, back, tags)
  if (cards.some((c) => c.id === card.id)) return false
  cards.push(card)
  setCards(cards)
  return true
}
