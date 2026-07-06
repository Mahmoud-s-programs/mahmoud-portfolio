import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ARCHIVE, PROJECTS } from '../data/content'
import { EASE_OUT, EASE_SNAP } from '../lib/easing'
import { lockScroll } from '../lib/scrollControl'

/**
 * Projects — full-bleed art cards with two signature behaviors:
 *
 * 1. MAGNETIC TILT: pointer position over the card maps to rotateX/rotateY
 *    (clamped ±7°) plus a small translation toward the cursor. Motion values
 *    run through springs, so the card floats after your hand like it's
 *    suspended in fluid, and settles elastically on leave.
 *
 * 2. MORPHING EXPANSION: clicking a card hands its `layoutId` to a
 *    full-width overlay. Framer Motion computes the shared-layout transform
 *    and the card physically *becomes* the expanded panel (no cut), while a
 *    backdrop-blur veil melts the rest of the page away underneath.
 *
 * Cards also clip-reveal on scroll entry: clip-path animates from an inset
 * window to full frame with the snap curve — the design's signature reveal.
 */
function ProjectCard({ p, i, onOpen }) {
  const ref = useRef(null)
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.18,
    triggerOnce: true,
  })

  // --- magnetic tilt state (springs for the fluid follow/settle) ---
  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const tx = useMotionValue(0)
  const ty = useMotionValue(0)
  const sRotX = useSpring(rotX, { stiffness: 150, damping: 18 })
  const sRotY = useSpring(rotY, { stiffness: 150, damping: 18 })
  const sTx = useSpring(tx, { stiffness: 120, damping: 16 })
  const sTy = useSpring(ty, { stiffness: 120, damping: 16 })

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5 // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rotY.set(px * 14) // tilt toward the cursor
    rotX.set(-py * 14)
    tx.set(px * 14) // magnetic pull within bounds
    ty.set(py * 14)
  }
  const onLeave = () => {
    rotX.set(0)
    rotY.set(0)
    tx.set(0)
    ty.set(0)
  }

  return (
    <motion.article
      ref={(el) => {
        ref.current = el
        inViewRef(el)
      }}
      className={`group relative ${i % 2 === 1 ? 'min-[901px]:translate-y-[4.5rem]' : ''}`}
      style={{
        rotateX: sRotX,
        rotateY: sRotY,
        x: sTx,
        y: sTy,
        transformPerspective: 1100,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span className="absolute -top-6 right-1 font-display text-base font-extrabold text-dim opacity-70">
        {p.idx}
      </span>

      <motion.div
        layoutId={`proj-media-${p.id}`}
        data-cursor
        onClick={() => onOpen(p.id)}
        className="relative h-[clamp(300px,42vh,460px)] cursor-pointer overflow-hidden rounded-3xl border border-white/10"
        // scroll-entry clip reveal (windowed -> full bleed)
        animate={{
          clipPath: inView
            ? 'inset(0% 0% 0% 0% round 24px)'
            : 'inset(12% 8% 12% 8% round 24px)',
        }}
        initial={false}
        transition={{ duration: 1.1, ease: EASE_SNAP }}
        whileTap={{ scale: 0.985 }}
      >
        {/* gradient underlay + real screenshot when one exists, slow ken-burns on hover */}
        <div
          className={`art ${p.art} transition-transform duration-1000 ease-out group-hover:scale-[1.07]`}
        />
        {p.image && (
          <img
            src={p.image}
            alt={`${p.title} screenshot`}
            className="art object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.07]"
            loading="lazy"
          />
        )}
        {/* scanlines live on an overlay div — ::after doesn't render on <img> */}
        <div className="scanlines pointer-events-none absolute inset-0" />
        {/* bottom veil for text legibility */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,8,18,.85))]" />

        <div className="absolute left-[18px] top-[18px] flex gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-abyss/55 px-3.5 py-1.5 font-mono text-[0.66rem] tracking-[0.14em] backdrop-blur-md"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="absolute bottom-[22px] left-6 right-6 flex items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-[clamp(1.4rem,2.4vw,2rem)] font-bold">
              {p.title}
            </h3>
            <p className="max-w-[34ch] text-[0.86rem] text-dim">{p.blurb}</p>
          </div>
          {/* arrow chip: opens the GitHub repo, rotates 45° and ignites on hover */}
          <a
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            aria-label={`${p.title} source code on GitHub`}
            onClick={(e) => e.stopPropagation()}
            className="grid h-[52px] w-[52px] flex-none place-items-center rounded-full border border-neon/50 bg-abyss/50 text-xl text-neon backdrop-blur-md transition-all duration-500 ease-spring group-hover:rotate-45 group-hover:bg-neon group-hover:text-[#051019] group-hover:shadow-[0_0_26px_rgba(99,242,255,0.6)]"
          >
            ↗
          </a>
        </div>
      </motion.div>
    </motion.article>
  )
}

/** Full-width expanded reveal, morphed from the clicked card via layoutId. */
function Expanded({ p, onClose }) {
  useEffect(() => {
    lockScroll(true)
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-[4vw]">
      {/* the veil that blurs the page beneath the morph */}
      <motion.div
        className="absolute inset-0 bg-abyss/60 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.45, ease: EASE_OUT }}
        onClick={onClose}
      />

      <motion.div
        layoutId={`proj-media-${p.id}`}
        transition={{ duration: 0.6, ease: EASE_SNAP }}
        className="relative max-h-[88vh] w-full max-w-[1100px] overflow-hidden rounded-3xl border border-white/10"
      >
        <div className={`art ${p.art}`} />
        {p.image && (
          <img
            src={p.image}
            alt={`${p.title} screenshot`}
            className="art object-cover"
          />
        )}
        <div className="scanlines pointer-events-none absolute inset-0" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,18,.25),rgba(6,8,18,.92)_65%)]" />

        {/* content fades up after the morph lands */}
        <motion.div
          className="relative flex min-h-[60vh] flex-col justify-end p-[clamp(24px,4vw,56px)]"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
        >
          <div className="mb-4 flex gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-abyss/55 px-3.5 py-1.5 font-mono text-[0.66rem] tracking-[0.14em] backdrop-blur-md"
              >
                {t}
              </span>
            ))}
          </div>
          <h3 className="font-display text-[clamp(2rem,5vw,3.6rem)] font-extrabold">
            {p.title}
          </h3>
          <p className="mt-4 max-w-[62ch] text-[1.02rem] leading-relaxed text-ink/90">
            {p.detail}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {p.stack.map((s) => (
              <span
                key={s}
                className="glass rounded-full px-4 py-2 text-[0.78rem] text-dim"
              >
                {s}
              </span>
            ))}
            <a
              href={p.repo}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-neon/50 bg-abyss/50 px-5 py-2 font-display text-[0.82rem] font-bold text-neon transition-all duration-300 hover:bg-neon hover:text-[#051019] hover:shadow-[0_0_26px_rgba(99,242,255,0.6)]"
            >
              View source ↗
            </a>
          </div>
        </motion.div>

        <motion.button
          onClick={onClose}
          aria-label="Close project"
          className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-abyss/60 text-ink backdrop-blur-md transition-colors duration-300 hover:border-rose hover:text-rose"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.4, ease: EASE_OUT }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </motion.button>
      </motion.div>
    </div>
  )
}

export default function Projects() {
  const [openId, setOpenId] = useState(null)
  const open = PROJECTS.find((p) => p.id === openId)

  return (
    <section id="work" className="px-[6vw] py-[18vh]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.18 }}
        transition={{ duration: 1, ease: EASE_OUT }}
      >
        <div className="eyebrow mono-label mb-9">Selected work</div>
        <h2 className="h-xl">
          Things I&apos;ve <span className="glow-word">built</span>
        </h2>
      </motion.div>

      <div className="mt-20 grid grid-cols-2 gap-14 max-[900px]:grid-cols-1">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} p={p} i={i} onOpen={setOpenId} />
        ))}
      </div>

      {/* ARCHIVE — the rest of the GitHub profile as compact glass cards */}
      <motion.div
        className="mt-32"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        <div className="eyebrow mono-label mb-4">From the lab</div>
        <p className="max-w-[52ch] text-dim">
          Smaller experiments, tools, and systems programming from the rest of
          the GitHub shelf — every card opens its repo.
        </p>
      </motion.div>

      <div className="mt-10 grid grid-cols-3 gap-5 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
        {ARCHIVE.map((a, i) => (
          <motion.a
            key={a.repo}
            href={a.repo}
            target="_blank"
            rel="noreferrer"
            className="glass group/archive flex flex-col rounded-[18px] p-6 transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-neon/40 hover:shadow-[0_0_34px_rgba(99,242,255,0.14)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: (i % 3) * 0.08 }}
          >
            <span className="flex items-start justify-between gap-3">
              <span className="font-display text-[1.05rem] font-bold">
                {a.name}
              </span>
              <span
                aria-hidden="true"
                className="text-neon transition-transform duration-300 ease-spring group-hover/archive:rotate-45"
              >
                ↗
              </span>
            </span>
            <span className="mt-2 flex-1 text-[0.84rem] leading-relaxed text-dim">
              {a.desc}
            </span>
            <span className="mt-5 self-start rounded-full border border-white/10 bg-abyss/50 px-3 py-1 font-mono text-[0.62rem] tracking-[0.14em] text-ink/70">
              {a.lang.toUpperCase()}
            </span>
          </motion.a>
        ))}
      </div>

      <AnimatePresence>
        {open && <Expanded p={open} onClose={() => setOpenId(null)} />}
      </AnimatePresence>
    </section>
  )
}
