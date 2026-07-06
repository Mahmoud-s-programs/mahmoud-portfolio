/**
 * Minimal pub/sub for the Konami-code easter egg. `voidState` is read
 * directly inside Three.js frame loops (see three/Plankton.jsx) so the
 * background can flare on trigger without a React re-render; `onSignal`
 * lets DOM components (the overlay) react to the same event.
 */
export const voidState = { burst: 0, burstAt: 0 }

const listeners = new Set()

export function emitSupernova() {
  voidState.burst += 1
  voidState.burstAt = performance.now()
  listeners.forEach((fn) => fn())
}

export function onSignal(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
