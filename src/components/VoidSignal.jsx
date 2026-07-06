import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useKonamiCode from '../hooks/useKonamiCode'
import { emitSupernova } from '../lib/voidSignal'
import { LINKS } from '../data/content'
import { EASE_OUT, EASE_SNAP } from '../lib/easing'

/**
 * Hidden Konami-code easter egg (↑↑↓↓←→←→BA). On unlock: the plankton
 * layer flares white for ~2s (see three/Plankton.jsx, which reads
 * voidState.burst directly) while this decoded "transmission" from the
 * void surfaces over everything else.
 */
export default function VoidSignal() {
  const [open, setOpen] = useState(false)

  const unlock = useCallback(() => {
    emitSupernova()
    setOpen(true)
  }, [])

  useKonamiCode(unlock)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center p-[6vw]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          {/* the flash — a single radial pulse behind the card, synced to the plankton flare */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.9), rgba(99,242,255,0.5) 30%, rgba(169,123,255,0.25) 55%, transparent 75%)',
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 2.6, 3.2] }}
            transition={{ duration: 1.3, ease: EASE_SNAP }}
          />

          <div
            className="absolute inset-0 bg-abyss/70 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          />

          <motion.div
            role="dialog"
            aria-label="Hidden transmission"
            className="glass relative max-w-[560px] rounded-[26px] p-10 text-center"
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.6, ease: EASE_SNAP, delay: 0.15 }}
          >
            <div className="mono-label mb-6 flex justify-center !text-rose">
              signal decoded · frequency locked
            </div>
            <h3 className="glow-word font-display text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold">
              You found the void.
            </h3>
            <p className="mt-5 text-[0.98rem] leading-relaxed text-ink/90">
              Between every section of this site there&apos;s empty space —
              most people scroll straight through it. You didn&apos;t. That
              kind of attention is exactly what I look for in the people I
              build with.
            </p>
            <p className="mt-4 text-[0.9rem] text-dim">
              Say hi properly:{' '}
              <a
                href={`mailto:${LINKS.email}`}
                className="text-neon transition-colors duration-300 hover:text-rose"
              >
                {LINKS.email}
              </a>
            </p>
            <button
              onClick={() => setOpen(false)}
              className="mt-8 rounded-full border border-white/15 px-6 py-2.5 text-[0.8rem] tracking-[0.1em] text-dim transition-colors duration-300 hover:border-neon hover:text-neon"
            >
              close transmission
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
