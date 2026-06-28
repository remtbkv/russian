import { useEffect, useRef, useState } from 'react'

export type DropOption = { value: string; label: string }

type Props = {
  value: string
  options: DropOption[]
  onChange: (value: string) => void
  className?: string // applied to the wrapper (e.g. w-full / flex-1)
  ariaLabel?: string
}

// A small custom dropdown: instant open, no native popup lag, and no lingering
// focus outline after clicking (unlike a bare <select>).
export default function Dropdown({ value, options, onChange, className = '', ariaLabel }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={'relative ' + className}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-[var(--color-line)] bg-[var(--color-card)] py-1.5 pl-3 pr-2.5 text-left text-sm focus:outline-none"
      >
        <span className="truncate">{current?.label ?? ''}</span>
        <span
          className={'shrink-0 text-xs text-[var(--color-muted)] transition-transform ' + (open ? 'rotate-180' : '')}
        >
          ▾
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1 max-h-72 w-max min-w-full max-w-[min(22rem,88vw)] overflow-auto rounded-md border border-[var(--color-line)] bg-[var(--color-card)] py-1 shadow-lg"
        >
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
                className={
                  'block w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--color-accent-soft)] ' +
                  (o.value === value
                    ? 'bg-[var(--color-accent-soft)] font-medium text-[var(--color-accent)]'
                    : 'text-[var(--color-ink)]')
                }
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
