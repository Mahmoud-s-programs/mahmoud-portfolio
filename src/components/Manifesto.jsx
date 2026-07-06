import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { MANIFESTO } from '../data/content'
import { EASE_OUT } from '../lib/easing'

/**
 * Manifesto — the statement assembles word by word: each token starts
 * ghosted (12% opacity, dropped, tilted, blurred) and settles into place
 * on a 45ms stagger once 40% of the block is on screen. Accent words glow
 * rose and cyan with their own text-shadows.
 */
const accentClass = {
  rose: 'not-italic text-rose [text-shadow:0_0_26px_rgba(255,122,195,0.5)]',
  cyan: 'not-italic text-neon [text-shadow:0_0_26px_rgba(99,242,255,0.5)]',
}

export default function Manifesto() {
  const { ref, inView } = useInView({ threshold: 0.4, triggerOnce: true })

  return (
    <section aria-label="Manifesto" className="px-[6vw] py-[18vh]">
      <div ref={ref} className="mx-auto max-w-[1100px]">
        <div className="eyebrow mono-label mb-9">The idea</div>
        <p className="font-display text-[clamp(1.6rem,4vw,3.2rem)] font-semibold leading-[1.25] tracking-[-0.01em]">
          {MANIFESTO.map((w, i) => (
            <motion.em
              key={i}
              className={`inline-block ${w.accent ? accentClass[w.accent] : 'not-italic'}`}
              initial={{
                opacity: 0.12,
                y: '0.35em',
                rotate: 2,
                filter: 'blur(4px)',
              }}
              animate={
                inView
                  ? { opacity: 1, y: 0, rotate: 0, filter: 'blur(0px)' }
                  : {}
              }
              transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.045 }}
            >
              {w.t}
              {/* preserve inter-word spacing */}
              {' '}
            </motion.em>
          ))}
        </p>
      </div>
    </section>
  )
}
