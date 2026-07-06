import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Scroll progress: a 2px gradient filament across the top. The raw scroll
 * fraction runs through a spring so the bar glides instead of stuttering.
 */
export default function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-gradient-to-r from-neon via-vio to-rose shadow-[0_0_14px_rgba(99,242,255,0.7)]"
      style={{ scaleX }}
    />
  )
}
