import { useCallback, useState } from 'react'

let rippleId = 0

/**
 * Click micro-interaction: spawns an expanding ring at the exact pointer
 * position inside the element. Render `ripples` inside a relatively
 * positioned, overflow-hidden container.
 */
export default function useRipple() {
  const [ripples, setRipples] = useState([])

  const spawnRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = ++rippleId
    setRipples((r) => [
      ...r,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ])
    // remove after the CSS animation (0.7s) finishes
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 750)
  }, [])

  const rippleNodes = ripples.map((r) => (
    <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
  ))

  return { spawnRipple, rippleNodes }
}
