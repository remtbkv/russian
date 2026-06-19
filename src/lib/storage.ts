// Tiny localStorage wrapper with JSON + a namespace.

const NS = 'ru:'

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key)
    return raw == null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}

export function save<T>(key: string, value: T): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value))
  } catch {
    // ignore quota / private-mode errors
  }
}
