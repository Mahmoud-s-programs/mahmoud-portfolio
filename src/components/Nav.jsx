import { useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { scrollToY } from '../lib/scrollControl'
import { EASE_OUT } from '../lib/easing'

const LINKS = [
  { label: 'Orbit', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Glass pill navigation. Hidden over the hero, slides down once you've
 * scrolled ~70vh. Links route through the smooth-scroll engine so nav
 * jumps glide with the same inertia as the wheel.
 */
export default function Nav() {
  const [show, setShow] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setShow(y > window.innerHeight * 0.7)
  })

  const go = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 20)
  }

  return (
    <motion.nav
      aria-label="Sections"
      className="fixed left-1/2 top-[18px] z-50 flex items-center gap-1.5 rounded-full border border-white/10 bg-abyss2/55 px-2.5 py-2 backdrop-blur-xl"
      initial={{ y: '-140%', x: '-50%' }}
      animate={{ y: show ? '0%' : '-140%', x: '-50%' }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
    >
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault()
          scrollToY(0)
        }}
        className="pr-1.5 font-display text-base font-extrabold text-ink"
      >
        M<em className="not-italic text-neon">.</em>
      </a>
      {LINKS.map((l) => (
        <a
          key={l.href}
          href={l.href}
          onClick={(e) => go(e, l.href)}
          className="rounded-full px-4 py-2 text-[0.8rem] tracking-[0.06em] text-dim transition-colors duration-300 hover:bg-white/5 hover:text-ink"
        >
          {l.label}
        </a>
      ))}
    </motion.nav>
  )
}
