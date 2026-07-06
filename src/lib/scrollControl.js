/**
 * Custom scroll-smoothing engine.
 *
 * Strategy: intercept wheel events, accumulate a target scroll position, and
 * lerp window.scrollTo toward it every frame with an exponential ease. Because
 * the *real* window scroll position is what animates, everything downstream —
 * Framer Motion's useScroll, IntersectionObserver reveals, position:sticky —
 * keeps working natively; they simply receive buttery interpolated values.
 * Touch and keyboard scrolling stay fully native (we resync to them).
 */

const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

let target = 0
let current = 0
let rafId = null
let locked = false
let lastTime = 0

const maxScroll = () =>
  document.documentElement.scrollHeight - window.innerHeight

function loop(now) {
  const dt = Math.min((now - lastTime) / 1000 || 0.016, 0.05)
  lastTime = now

  // Exponential approach: frame-rate independent, eases out naturally.
  // (equivalent to a cubic-bezier-style decay rather than a linear tween)
  const t = 1 - Math.exp(-6 * dt)
  current += (target - current) * t

  if (Math.abs(target - current) < 0.2) {
    // Settled — snap and stop the loop until the next wheel impulse.
    current = target
    window.scrollTo(0, current)
    rafId = null
    return
  }
  window.scrollTo(0, current)
  rafId = requestAnimationFrame(loop)
}

function kick() {
  if (rafId == null) {
    lastTime = performance.now()
    rafId = requestAnimationFrame(loop)
  }
}

function onWheel(e) {
  // Let pinch-zoom through untouched
  if (e.ctrlKey) return
  e.preventDefault()
  if (locked) return
  // deltaMode 1 = "lines" (Firefox with a mouse) — normalize to pixels
  const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
  target = clamp(target + dy, 0, maxScroll())
  kick()
}

function onNativeScroll() {
  // A scroll we didn't write (touch drag, keyboard, hash jump, restore):
  // adopt it as the new baseline so we never fight the user.
  if (Math.abs(window.scrollY - current) > 1.5 && rafId == null) {
    target = current = window.scrollY
  }
}

function onResize() {
  target = clamp(target, 0, maxScroll())
}

/** Start the engine. Returns a cleanup function. */
export function initSmoothScroll() {
  target = current = window.scrollY
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onNativeScroll, { passive: true })
  window.addEventListener('resize', onResize)
  return () => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onNativeScroll)
    window.removeEventListener('resize', onResize)
    if (rafId != null) cancelAnimationFrame(rafId)
    rafId = null
  }
}

/** Animate to an absolute Y (used by nav links / CTAs). */
export function scrollToY(y) {
  target = clamp(y, 0, maxScroll())
  kick()
}

/** Freeze wheel scrolling (used while the project overlay is open). */
export function lockScroll(v) {
  locked = v
}
