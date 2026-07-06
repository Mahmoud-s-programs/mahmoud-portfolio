import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE_OUT } from '../lib/easing'

/**
 * Boot loader: a gradient counter climbing to 100 in organic random steps,
 * then the whole screen dissolves and hands control to the hero entrance.
 */
export default function Loader({ onDone }) {
  const [value, setValue] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setGone(true)
      onDone()
      return
    }
    let v = 0
    let timeout
    const tick = () => {
      v = Math.min(100, v + Math.random() * 14 + 4)
      setValue(Math.floor(v))
      if (v < 100) {
        timeout = setTimeout(tick, 55)
      } else {
        timeout = setTimeout(() => {
          setGone(true)
          onDone()
        }, 350)
      }
    }
    tick()
    return () => clearTimeout(timeout)
  }, [onDone])

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-abyss"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          aria-hidden="true"
        >
          <div className="glow-word font-display text-[clamp(4rem,12vw,9rem)] font-extrabold">
            {value}
          </div>
          <div className="mono-label absolute bottom-[8vh] left-1/2 -translate-x-1/2">
            calibrating the field
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
