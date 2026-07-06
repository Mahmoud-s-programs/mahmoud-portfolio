import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TIMELINE } from '../data/content'
import { EASE_OUT, EASE_SNAP } from '../lib/easing'

/**
 * Timeline — parallax-scrolling flip cards along a gradient spine.
 *
 * Per card, three motion layers compose:
 *  1. Parallax: each card's scroll progress maps to a vertical drift scaled
 *     by its `depth` sign/magnitude, so alternating cards slide against each
 *     other while you scroll.
 *  2. Entrance: the card flips in around Y (rotateY -80 -> 0) as it enters
 *     the viewport, with the snap curve for a decisive landing.
 *  3. Interaction: hover or click/keyboard flips the inner shell 180° to
 *     the glowing back face — true 3D via preserve-3d + backface-hidden.
 */
function Card({ item, i }) {
  const wrap = useRef(null)
  const [flipped, setFlipped] = useState(false)
  const [hovered, setHovered] = useState(false)

  // Parallax drift driven by this card's own journey across the viewport
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [item.depth * 900, item.depth * -900]
  )

  const showBack = flipped || hovered

  return (
    <motion.div
      ref={wrap}
      style={{ y }}
      className={`relative mb-32 w-[min(440px,86vw)] max-[900px]:w-full max-[900px]:pl-[34px] ${
        i % 2 === 0 ? 'mr-auto' : 'ml-auto'
      }`}
    >
      <motion.div
        className="perspective-1400 h-[250px]"
        initial={{ opacity: 0, rotateY: -80, y: 60 }}
        whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        <motion.div
          role="button"
          tabIndex={0}
          aria-label={`${item.year} — ${item.title}. Press to flip.`}
          data-cursor
          className="preserve-3d relative h-full w-full outline-none"
          animate={{ rotateY: showBack ? 180 : 0 }}
          transition={{ duration: 0.9, ease: EASE_SNAP }}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={() => setFlipped((f) => !f)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setFlipped((f) => !f)
            }
          }}
        >
          {/* FRONT — big gradient year + subtle corner glow */}
          <div className="backface-hidden glass absolute inset-0 flex flex-col justify-end overflow-hidden rounded-[22px] p-[30px]">
            <span className="absolute right-6 top-[22px] text-[0.68rem] tracking-[0.2em] text-dim">
              HOVER ↻
            </span>
            {/* corner bloom */}
            <span
              aria-hidden="true"
              className="absolute -top-[40%] right-[-30%] aspect-square w-[70%] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(99,242,255,.14), transparent 70%)',
              }}
            />
            <div className="bg-gradient-to-r from-neon to-vio bg-clip-text font-display text-[4rem] font-extrabold leading-none tracking-[-0.03em] text-transparent">
              {item.year}
            </div>
            <h3 className="mt-2.5 text-[1.3rem] font-semibold">{item.title}</h3>
          </div>

          {/* BACK — rotated 180 so it reads correctly mid-flip */}
          <div
            className="backface-hidden absolute inset-0 flex flex-col justify-center rounded-[22px] border border-rose/35 p-[30px] backdrop-blur-xl"
            style={{
              transform: 'rotateY(180deg)',
              background:
                'linear-gradient(150deg, rgba(255,122,195,.08), rgba(169,123,255,.06))',
            }}
          >
            <div className="mono-label mb-3 !text-rose">{item.meta}</div>
            <p className="text-[0.9rem] leading-relaxed text-ink">{item.body}</p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function Timeline() {
  return (
    <section id="journey" className="px-[6vw] py-[18vh]">
      <div className="mx-auto max-w-[1180px]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          <div className="eyebrow mono-label mb-9">Trajectory</div>
          <h2 className="h-xl">
            The <span className="glow-word">journey</span> so far
          </h2>
        </motion.div>

        {/* the spine */}
        <div className="relative mt-24 before:absolute before:bottom-0 before:left-1/2 before:top-0 before:w-px before:bg-[linear-gradient(180deg,transparent,rgba(99,242,255,.5)_12%,rgba(169,123,255,.5)_60%,transparent)] before:content-[''] max-[900px]:before:left-2">
          {TIMELINE.map((item, i) => (
            <Card key={`${item.year}-${item.title}`} item={item} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
