import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Magnetic from './Magnetic'
import useRipple from '../hooks/useRipple'
import { LINKS } from '../data/content'
import { EASE_OUT } from '../lib/easing'

// The 3D blackhole (13MB GLTF) mounts shortly before the section scrolls in.
const BlackholeCanvas = lazy(() => import('../three/BlackholeModel'))

/**
 * Contact — centered transmission. The mail pill is glass, magnetic,
 * ripples on click, and blooms violet on hover; the rose dot pulses like
 * an open channel.
 */
export default function Contact() {
  const { spawnRipple, rippleNodes } = useRipple()
  // mount the model just before arrival; run its frameloop only while visible
  const { ref: mountRef, inView: mounted } = useInView({
    rootMargin: '400px 0px',
    triggerOnce: true,
  })
  const { ref: liveRef, inView: live } = useInView({ threshold: 0 })

  return (
    <section id="contact" className="px-[6vw] pb-[10vh] pt-[10vh] text-center">
      {/* the blackhole — the transmission source, auto-rotating above the sign-off */}
      <div
        ref={(el) => {
          mountRef(el)
          liveRef(el)
        }}
        data-cursor
        className="mx-auto -mb-[4vh] h-[42vh] w-full max-w-[900px]"
      >
        {mounted && (
          <Suspense fallback={null}>
            <BlackholeCanvas active={live} />
          </Suspense>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        <div className="eyebrow mono-label mb-9 justify-center">
          Transmission open
        </div>
        <h2 className="mb-12 font-display text-[clamp(2.6rem,8vw,6.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
          Let&apos;s build something
          <br />
          <span className="relative inline-block">
            <span aria-hidden="true" className="breath-glow" />
            <span className="glow-word relative">alive.</span>
          </span>
        </h2>
        <Magnetic strength={0.3}>
          <motion.a
            href={`mailto:${LINKS.email}`}
            onPointerDown={spawnRipple}
            whileTap={{ scale: 0.97 }}
            className="glass relative inline-flex items-center gap-[18px] overflow-hidden rounded-full px-[52px] py-[26px] font-display text-[clamp(1rem,2.4vw,1.5rem)] font-bold transition-[border-color,box-shadow] duration-500 hover:border-vio hover:shadow-[0_0_60px_rgba(169,123,255,0.4)]"
          >
            <span
              aria-hidden="true"
              className="pulse-dot h-2.5 w-2.5 rounded-full bg-rose shadow-[0_0_14px_#ff7ac3]"
            />
            {LINKS.email}
            {rippleNodes}
          </motion.a>
        </Magnetic>
      </motion.div>
    </section>
  )
}
