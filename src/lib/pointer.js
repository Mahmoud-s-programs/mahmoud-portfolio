/**
 * Global pointer store — a single mutable object shared by the custom cursor,
 * the magnetic elements, and every Three.js scene. Reading a plain object in
 * a render loop avoids React re-renders entirely (zero reconciliation cost
 * for something that changes every frame).
 *
 * px/py  — raw pixel coordinates
 * nx/ny  — normalized device coordinates (-1..1, y up, like WebGL)
 * snx/sny — exponentially smoothed NDC, advanced by smoothPointer(dt).
 *           This is what the parallax rig and fluid field read, so the
 *           background trails the cursor with weightless inertia.
 */
export const pointer = {
  px: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  py: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  nx: 0,
  ny: 0,
  snx: 0,
  sny: 0,
}

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.px = e.clientX
      pointer.py = e.clientY
      pointer.nx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ny = -(e.clientY / window.innerHeight) * 2 + 1
    },
    { passive: true }
  )
}

/**
 * Frame-rate independent exponential smoothing.
 * ease ≈ how fast the smoothed value chases the target (higher = snappier).
 */
export function smoothPointer(dt, ease = 2.5) {
  const t = 1 - Math.exp(-ease * dt)
  pointer.snx += (pointer.nx - pointer.snx) * t
  pointer.sny += (pointer.ny - pointer.sny) * t
}
