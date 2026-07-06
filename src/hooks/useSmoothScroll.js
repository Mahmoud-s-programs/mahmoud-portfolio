import { useEffect } from 'react'
import { initSmoothScroll } from '../lib/scrollControl'

/**
 * Mounts the inertial wheel-scroll engine for the lifetime of the app.
 * Skipped entirely for users who prefer reduced motion — they get the
 * browser's native scrolling.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    return initSmoothScroll()
  }, [])
}
