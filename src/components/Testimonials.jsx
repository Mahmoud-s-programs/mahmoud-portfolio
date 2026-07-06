import { motion } from 'framer-motion'
import { TESTIMONIALS } from '../data/content'
import { EASE_OUT } from '../lib/easing'

/**
 * Testimonials — glass quote cards rising in on a stagger. Avatars are
 * gradient-initial coins (no external image dependencies), and each card
 * lifts with a violet bloom on hover.
 */
const COIN_GRADIENTS = [
  'linear-gradient(135deg, #63f2ff, #2b6f8a)',
  'linear-gradient(135deg, #a97bff, #5a3aa8)',
  'linear-gradient(135deg, #ff7ac3, #96366f)',
  'linear-gradient(135deg, #5eead4, #2a8577)',
]

export default function Testimonials() {
  return (
    <section id="signals" className="px-[6vw] py-[18vh]">
      <div className="mx-auto max-w-[1180px]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          <div className="eyebrow mono-label mb-9">Signals received</div>
          <h2 className="h-xl">
            Kind <span className="glow-word">words</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-8 max-[900px]:grid-cols-1">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              className="glass group rounded-[22px] p-8 transition-[border-color,box-shadow] duration-500 hover:border-vio/40 hover:shadow-[0_0_44px_rgba(169,123,255,0.18)]"
              initial={{ opacity: 0, y: 44 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: (i % 2) * 0.12 }}
            >
              <div
                aria-hidden="true"
                className="font-display text-4xl font-extrabold leading-none text-neon/60"
              >
                “
              </div>
              <blockquote className="mt-2 text-[0.98rem] leading-relaxed text-ink/90">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3.5">
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 flex-none place-items-center rounded-full font-display text-sm font-bold text-[#051019]"
                  style={{ background: COIN_GRADIENTS[i % COIN_GRADIENTS.length] }}
                >
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-[0.9rem] font-medium text-ink">
                    {t.name}
                  </span>
                  <span className="block text-[0.75rem] text-dim">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
