import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  resumeAmbientContext,
  suspendAmbientContext,
  toggleAmbient,
} from '../lib/ambientAudio'
import { EASE_OUT } from '../lib/easing'

/**
 * Fixed top-right glass toggle for the synthesized space-ocean ambient bed
 * (see lib/ambientAudio.js). Off by default — sound only ever starts from
 * this explicit click, respecting autoplay policy and the visitor's ears.
 */
export default function AmbientToggle({ started }) {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) suspendAmbientContext()
      else resumeAmbientContext()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  const handleClick = () => setOn(toggleAmbient())

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'}
      data-cursor
      className="fixed right-[6vw] top-[18px] z-50 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-abyss2/55 backdrop-blur-xl transition-colors duration-300 hover:border-neon/50"
      initial={{ opacity: 0, y: -14 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 1.1 }}
      whileTap={{ scale: 0.88 }}
    >
      <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
        {[0, 1, 2].map((i) =>
          on ? (
            <span
              key={i}
              className="eq-bar h-4 w-[3px] rounded-full bg-neon shadow-[0_0_6px_rgba(99,242,255,0.7)]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ) : (
            <span key={i} className="h-1.5 w-[3px] rounded-full bg-dim/60" />
          )
        )}
      </span>
    </motion.button>
  )
}
