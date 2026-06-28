import { useEffect, useRef, useState } from 'react'
import Type from './modules/Type'
import Read from './modules/Read'
import Watch from './modules/Watch'
import Write from './modules/Write'
import Vocab from './modules/Vocab'
import Sounds from './modules/Sounds'
import Grammar from './modules/Grammar'
import { load, save } from './lib/storage'

const TABS = [
  { id: 'type', label: 'Type', el: <Type /> },
  { id: 'read', label: 'Read', el: <Read /> },
  { id: 'watch', label: 'Watch', el: <Watch /> },
  { id: 'write', label: 'Write', el: <Write /> },
  { id: 'grammar', label: 'Grammar', el: <Grammar /> },
  { id: 'vocab', label: 'Vocab', el: <Vocab /> },
  { id: 'sounds', label: 'Sounds', el: <Sounds /> },
] as const

type TabId = (typeof TABS)[number]['id']

function currentTab(): TabId {
  const h = location.hash.replace('#', '') as TabId
  return TABS.some((t) => t.id === h) ? h : 'type'
}

const tabIndex = (id: TabId) => TABS.findIndex((t) => t.id === id)

export default function App() {
  const [tab, setTab] = useState<TabId>(currentTab)
  const [dir, setDir] = useState<'next' | 'prev'>('next')
  const [dark, setDark] = useState(() => load<boolean>('dark', false))
  const tabRef = useRef(tab)
  tabRef.current = tab

  useEffect(() => {
    const onHash = () => {
      const next = currentTab()
      setDir(tabIndex(next) >= tabIndex(tabRef.current) ? 'next' : 'prev')
      setTab(next)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Mobile swipe to switch tabs (swipe left → next, right → previous)
  const touch = useRef<{ x: number; y: number; skip: boolean } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    // don't hijack a horizontally-scrollable element (tables, the nav strip)
    let el = e.target as HTMLElement | null
    let skip = false
    while (el && el !== document.body) {
      const ox = getComputedStyle(el).overflowX
      if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 2) {
        skip = true
        break
      }
      el = el.parentElement
    }
    touch.current = { x: t.clientX, y: t.clientY, skip }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touch.current
    touch.current = null
    if (!s || s.skip) return
    const t = e.changedTouches[0]
    const dx = t.clientX - s.x
    const dy = t.clientY - s.y
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return
    const i = tabIndex(currentTab())
    if (dx < 0 && i < TABS.length - 1) location.hash = '#' + TABS[i + 1].id
    else if (dx > 0 && i > 0) location.hash = '#' + TABS[i - 1].id
  }

  // ← / → switch header tabs (ignored while typing in a field)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return
      const el = document.activeElement as HTMLElement | null
      const tag = el?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el?.isContentEditable) return
      e.preventDefault()
      const i = TABS.findIndex((t) => t.id === currentTab())
      const next = e.key === 'ArrowRight' ? (i + 1) % TABS.length : (i - 1 + TABS.length) % TABS.length
      location.hash = '#' + TABS[next].id
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transition')
    root.classList.toggle('dark', dark)
    save('dark', dark)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', dark ? '#16161a' : '#faf9f6')
    const t = setTimeout(() => root.classList.remove('theme-transition'), 400)
    return () => clearTimeout(t)
  }, [dark])

  const active = TABS.find((t) => t.id === tab)!

  return (
    <div className="min-h-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <header className="sticky top-0 z-10 border-b border-[var(--color-line)] bg-[var(--color-paper)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <span className="hidden shrink-0 font-cyr text-xl font-bold sm:block">Русский</span>
          <nav className="-mx-1 flex flex-1 select-none gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className={
                  'shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors ' +
                  (t.id === tab
                    ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]')
                }
              >
                {t.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="px-4 py-8">
        <div key={tab} className={dir === 'next' ? 'slide-next' : 'slide-prev'}>
          {active.el}
        </div>
      </main>

      <button
        onClick={() => setDark((d) => !d)}
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
        className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-card)] text-lg shadow-lg active:scale-95"
      >
        {dark ? '☀' : '☾'}
      </button>
    </div>
  )
}
