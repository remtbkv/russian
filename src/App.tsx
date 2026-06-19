import { useEffect, useState } from 'react'
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

export default function App() {
  const [tab, setTab] = useState<TabId>(currentTab)
  const [dark, setDark] = useState(() => load<boolean>('dark', false))

  useEffect(() => {
    const onHash = () => setTab(currentTab())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transition')
    root.classList.toggle('dark', dark)
    save('dark', dark)
    const t = setTimeout(() => root.classList.remove('theme-transition'), 400)
    return () => clearTimeout(t)
  }, [dark])

  const active = TABS.find((t) => t.id === tab)!

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-[var(--color-line)] bg-[var(--color-paper)]/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <span className="hidden shrink-0 font-cyr text-xl font-bold sm:block">Русский</span>
          <nav className="-mx-1 flex flex-1 gap-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
          <button
            onClick={() => setDark((d) => !d)}
            className="shrink-0 rounded-md border border-[var(--color-line)] px-2 py-1 text-sm"
            title="Toggle dark mode"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀' : '☾'}
          </button>
        </div>
      </header>

      <main className="px-4 py-8">{active.el}</main>
    </div>
  )
}
