import { Suspense, lazy } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { SERVICES, SKILLS } from '../data/content'
import { EASE_OUT } from '../lib/easing'

// Heavy 3D module stays out of the main bundle until the section approaches.
const Galaxy = lazy(() => import('../three/Galaxy'))

const STATS = [
  { b: '25', s: 'devs led at Vosyn' },
  { b: String(SKILLS.length), s: 'core technologies' },
  { b: '∞', s: 'curiosity' },
]

/**
 * Skills Galaxy section. Two lazy/visibility layers:
 *  - `mountView` (rootMargin 300px, once): mounts the 3D canvas just
 *    before it scrolls in — below-the-fold lazy-loading.
 *  - `liveView` (continuous): drives the canvas frameloop, so the galaxy
 *    stops burning GPU the moment it leaves the screen.
 */
export default function Skills() {
  const { ref: mountRef, inView: mounted } = useInView({
    rootMargin: '300px 0px',
    triggerOnce: true,
  })
  const { ref: liveRef, inView: live } = useInView({ threshold: 0 })

  return (
    <section id="skills" className="px-[6vw] py-[18vh]">
      <div className="grid items-center gap-[5vw] max-[900px]:grid-cols-1 min-[901px]:grid-cols-[minmax(280px,420px)_1fr]">
        {/* copy column */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          <div className="eyebrow mono-label mb-9">Orbit of craft</div>
          <h2 className="h-xl">
            A galaxy of
            <br />
            <span className="glow-word">skills</span>
          </h2>
          <p className="mt-6 max-w-[46ch] text-dim">
            Every glowing node is a tool I ship with. Drag the field to spin
            it; hover a star to name it. The closer to the core, the more
            hours it has absorbed.
          </p>
          {/* the four disciplines */}
          <div className="mt-7 flex flex-wrap gap-2.5">
            {SERVICES.map((s) => (
              <span
                key={s}
                className="glass rounded-full px-4 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ink/80"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-9">
            {STATS.map((s) => (
              <div key={s.s}>
                <b className="block font-display text-[2rem] font-extrabold text-neon [text-shadow:0_0_18px_rgba(99,242,255,0.45)]">
                  {s.b}
                </b>
                <span className="text-[0.8rem] text-dim">{s.s}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* galaxy panel */}
        <div
          ref={(el) => {
            mountRef(el)
            liveRef(el)
          }}
          data-cursor
          className="relative h-[min(72vh,680px)] overflow-hidden rounded-[28px] border border-white/10 bg-abyss2 max-[900px]:h-[60vh]"
          style={{
            backgroundImage:
              'radial-gradient(120% 120% at 50% 0%, rgba(169,123,255,.07), transparent 60%)',
          }}
        >
          {mounted && (
            <Suspense fallback={null}>
              <Galaxy active={live} />
            </Suspense>
          )}
          <div className="mono-label pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-70">
            drag to rotate · hover a node
          </div>
        </div>
      </div>
    </section>
  )
}
