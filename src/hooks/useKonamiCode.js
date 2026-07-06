import { useEffect, useRef } from 'react'

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

/** Classic Konami code (↑↑↓↓←→←→BA) — calls onUnlock the moment it lands. */
export default function useKonamiCode(onUnlock) {
  const progress = useRef(0)

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const expected = SEQUENCE[progress.current]

      if (key === expected) {
        progress.current += 1
        if (progress.current === SEQUENCE.length) {
          progress.current = 0
          onUnlock()
        }
      } else {
        // a mismatch might still be a fresh start (e.g. re-pressing Up)
        progress.current = key === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onUnlock])
}
