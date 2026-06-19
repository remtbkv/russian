// Standard Russian ЙЦУКЕН layout, mapped by physical key position (event.code).
// Using event.code makes the trainer layout-independent: it works whether or not
// the OS Russian keyboard is installed, and can't get a layout mismatch.

export type KeyDef = { code: string; lower: string; upper: string }

// Letter/punctuation rows in physical order. The number row is omitted to keep
// the trainer focused on letters (plus ё, which sits on the backtick key).
const ROW_E: KeyDef[] = [{ code: 'Backquote', lower: 'ё', upper: 'Ё' }]

const ROW_TOP: KeyDef[] = [
  { code: 'KeyQ', lower: 'й', upper: 'Й' },
  { code: 'KeyW', lower: 'ц', upper: 'Ц' },
  { code: 'KeyE', lower: 'у', upper: 'У' },
  { code: 'KeyR', lower: 'к', upper: 'К' },
  { code: 'KeyT', lower: 'е', upper: 'Е' },
  { code: 'KeyY', lower: 'н', upper: 'Н' },
  { code: 'KeyU', lower: 'г', upper: 'Г' },
  { code: 'KeyI', lower: 'ш', upper: 'Ш' },
  { code: 'KeyO', lower: 'щ', upper: 'Щ' },
  { code: 'KeyP', lower: 'з', upper: 'З' },
  { code: 'BracketLeft', lower: 'х', upper: 'Х' },
  { code: 'BracketRight', lower: 'ъ', upper: 'Ъ' },
]

const ROW_HOME: KeyDef[] = [
  { code: 'KeyA', lower: 'ф', upper: 'Ф' },
  { code: 'KeyS', lower: 'ы', upper: 'Ы' },
  { code: 'KeyD', lower: 'в', upper: 'В' },
  { code: 'KeyF', lower: 'а', upper: 'А' },
  { code: 'KeyG', lower: 'п', upper: 'П' },
  { code: 'KeyH', lower: 'р', upper: 'Р' },
  { code: 'KeyJ', lower: 'о', upper: 'О' },
  { code: 'KeyK', lower: 'л', upper: 'Л' },
  { code: 'KeyL', lower: 'д', upper: 'Д' },
  { code: 'Semicolon', lower: 'ж', upper: 'Ж' },
  { code: 'Quote', lower: 'э', upper: 'Э' },
]

// Bottom row: on ЙЦУКЕН, comma/period live on the Slash key (. unshifted, , shifted);
// the physical comma/period keys carry б and ю.
const ROW_BOTTOM: KeyDef[] = [
  { code: 'KeyZ', lower: 'я', upper: 'Я' },
  { code: 'KeyX', lower: 'ч', upper: 'Ч' },
  { code: 'KeyC', lower: 'с', upper: 'С' },
  { code: 'KeyV', lower: 'м', upper: 'М' },
  { code: 'KeyB', lower: 'и', upper: 'И' },
  { code: 'KeyN', lower: 'т', upper: 'Т' },
  { code: 'KeyM', lower: 'ь', upper: 'Ь' },
  { code: 'Comma', lower: 'б', upper: 'Б' },
  { code: 'Period', lower: 'ю', upper: 'Ю' },
  { code: 'Slash', lower: '.', upper: ',' },
]

export const ROWS: KeyDef[][] = [ROW_E, ROW_TOP, ROW_HOME, ROW_BOTTOM]

// QWERTY letter at each physical position, for the small corner labels.
export const QWERTY: Record<string, string> = {
  Backquote: '`',
  KeyQ: 'Q', KeyW: 'W', KeyE: 'E', KeyR: 'R', KeyT: 'T', KeyY: 'Y',
  KeyU: 'U', KeyI: 'I', KeyO: 'O', KeyP: 'P', BracketLeft: '[', BracketRight: ']',
  KeyA: 'A', KeyS: 'S', KeyD: 'D', KeyF: 'F', KeyG: 'G', KeyH: 'H',
  KeyJ: 'J', KeyK: 'K', KeyL: 'L', Semicolon: ';', Quote: "'",
  KeyZ: 'Z', KeyX: 'X', KeyC: 'C', KeyV: 'V', KeyB: 'B', KeyN: 'N',
  KeyM: 'M', Comma: ',', Period: '.', Slash: '/',
}

const ALL_KEYS = [...ROW_E, ...ROW_TOP, ...ROW_HOME, ...ROW_BOTTOM]

// code -> KeyDef
const BY_CODE = new Map<string, KeyDef>(ALL_KEYS.map((k) => [k.code, k]))

// produced character -> how to type it (which key, shifted?)
const BY_CHAR = new Map<string, { code: string; shift: boolean }>()
for (const k of ALL_KEYS) {
  BY_CHAR.set(k.lower, { code: k.code, shift: false })
  if (k.upper !== k.lower) BY_CHAR.set(k.upper, { code: k.code, shift: true })
}
BY_CHAR.set(' ', { code: 'Space', shift: false })

/** Positional mode: translate a physical key press into the Cyrillic char it produces. */
export function codeToChar(code: string, shift: boolean): string | null {
  if (code === 'Space') return ' '
  const k = BY_CODE.get(code)
  if (!k) return null
  return shift ? k.upper : k.lower
}

/** Given the next required character, which physical key (and shift) types it. */
export function charToKey(ch: string): { code: string; shift: boolean } | null {
  return BY_CHAR.get(ch) ?? null
}
