import { QWERTY, ROWS } from '../lib/keyboard'

type Props = {
  nextCode: string | null
  shiftNeeded?: boolean
  pressedCode?: string | null
  pressedCorrect?: boolean
}

export default function Keyboard({ nextCode, shiftNeeded, pressedCode, pressedCorrect }: Props) {
  return (
    <div className="mx-auto w-fit select-none space-y-1.5">
      {ROWS.map((row, i) => (
        // ё row (index 0) sits at the top-left corner, like a real ЙЦУКЕН keyboard
        <div key={i} className={'flex gap-1.5 ' + (i === 0 ? 'justify-start' : 'justify-center')}>
          {row.map((k) => {
            const isNext = k.code === nextCode
            const isPressed = k.code === pressedCode
            let cls =
              'relative flex h-11 w-11 items-center justify-center rounded-md border text-lg font-medium transition-colors'
            if (isPressed) {
              cls += pressedCorrect
                ? ' border-[var(--color-good)] bg-[var(--color-good)] text-white'
                : ' border-[var(--color-bad)] bg-[var(--color-bad)] text-white'
            } else if (isNext) {
              cls +=
                ' border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)] ring-2 ring-[var(--color-accent)]'
            } else {
              cls += ' border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-ink)]'
            }
            return (
              <div key={k.code} className={cls}>
                <span
                  className={
                    'absolute right-1 top-0.5 text-[9px] leading-none ' +
                    (isPressed || isNext ? 'opacity-70' : 'text-[var(--color-muted)] opacity-60')
                  }
                >
                  {QWERTY[k.code]}
                </span>
                {k.lower}
              </div>
            )
          })}
        </div>
      ))}
      <div className="flex justify-center pt-0.5">
        <div
          className={
            'flex h-9 w-72 items-center justify-center rounded-md border text-xs uppercase tracking-widest transition-colors ' +
            (nextCode === 'Space'
              ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]'
              : 'border-[var(--color-line)] bg-[var(--color-card)] text-[var(--color-muted)]')
          }
        >
          space
        </div>
      </div>
      {shiftNeeded && (
        <p className="pt-1 text-center text-xs text-[var(--color-muted)]">
          hold <kbd className="font-mono">Shift</kbd> for this character
        </p>
      )}
    </div>
  )
}
