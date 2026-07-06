import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Magnetic from './Magnetic'
import useRipple from '../hooks/useRipple'
import { scrollToY } from '../lib/scrollControl'
import { EASE_OUT } from '../lib/easing'

// The 3D computer desk (25MB of GLTF + textures) loads in its own chunk so
// the typography and liquid field paint instantly.
const DeskCanvas = lazy(() => import('../three/DeskModel'))

/**
 * Hero — full-viewport. The liquid particle field lives in the shared
 * background canvas (HeroField.jsx); this layer is the typography choreography:
 * lines rise out of overflow-hidden masks, the gradient word carries a
 * soft neon pulse, then the sub and CTAs fade up in sequence.
 */
const lineTransition = (delay) => ({
  duration: 1.1,
  ease: EASE_OUT,
  delay,
})

export default function Hero({ started }) {
  const { spawnRipple, rippleNodes } = useRipple()
  // frameloop only runs while the hero is actually on screen
  const { ref: deskRef, inView: deskLive } = useInView({ threshold: 0 })

  const go = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 20)
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-[6vw] pt-[14vh]"
    >
      <div className="mono-label mb-8">Portfolio · 2026 · Ontario, Canada</div>

      <h1
        aria-label="Code that breathes."
        className="font-display text-[clamp(3rem,10vw,8.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em]"
      >
        {/* each line clips its child; the spans slide up out of the mask */}
        <span className="block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '115%' }}
            animate={started ? { y: '0%' } : {}}
            transition={lineTransition(0)}
          >
            Code that
          </motion.span>
        </span>
        <span className="block overflow-hidden">
          <motion.span
            className="relative inline-block"
            initial={{ y: '115%' }}
            animate={started ? { y: '0%' } : {}}
            transition={lineTransition(0.12)}
          >
            {/* pulsing neon halo lives on its own layer behind the glyphs */}
            <span aria-hidden="true" className="breath-glow" />
            <span className="glow-word relative inline-block">breathes.</span>
          </motion.span>
        </span>
      </h1>

      <motion.p
        className="mt-10 max-w-[520px] text-[1.05rem] text-dim"
        initial={{ opacity: 0, y: 24 }}
        animate={started ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.5 }}
      >
        I&apos;m Mahmoud Alkwisem — a software engineer working in Python and
        JavaScript, shipping with React, Node.js, and Three.js, and always
        building with AI. I like the projects others wouldn&apos;t dare touch.
      </motion.p>

      <motion.div
        className="mt-12 flex items-center gap-6"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.8 }}
      >
        <Magnetic>
          <motion.a
            href="#work"
            onClick={(e) => go(e, '#work')}
            onPointerDown={spawnRipple}
            whileTap={{ scale: 0.96 }}
            className="relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-neon to-[#8ef0ff] px-[30px] py-4 font-display text-[0.9rem] font-bold tracking-[0.05em] text-[#051019] shadow-[0_0_28px_rgba(99,242,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.4)] transition-shadow duration-500 hover:shadow-[0_0_44px_rgba(99,242,255,0.6),inset_0_0_0_1px_rgba(255,255,255,0.6)]"
          >
            See the work <span aria-hidden="true">↓</span>
            {rippleNodes}
          </motion.a>
        </Magnetic>
        <Magnetic strength={0.25}>
          <a
            href="#contact"
            onClick={(e) => go(e, '#contact')}
            className="border-b border-white/10 px-1 py-4 text-dim transition-colors duration-300 hover:border-neon hover:text-neon"
          >
            Start a project
          </a>
        </Magnetic>
      </motion.div>

      {/* the 3D computer desk — drag horizontally to orbit it */}
      <motion.div
        ref={deskRef}
        data-cursor
        className="absolute bottom-0 right-0 top-[26vh] w-[46vw] max-[1100px]:hidden"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, ease: EASE_OUT, delay: 1.0 }}
      >
        <Suspense fallback={null}>
          <DeskCanvas active={deskLive} />
        </Suspense>
      </motion.div>

      {/* scroll cue */}
      <div
        aria-hidden="true"
        className="absolute bottom-[34px] left-[6vw] flex items-center gap-3 text-[0.72rem] tracking-[0.22em] text-dim"
      >
        <div className="cue-drop relative h-9 w-[22px] rounded-full border border-white/10" />
        <span>SCROLL</span>
      </div>
    </section>
  )
}
