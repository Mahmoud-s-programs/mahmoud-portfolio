import Magnetic from './Magnetic'
import { LINKS } from '../data/content'
import { scrollToY } from '../lib/scrollControl'

export default function Footer() {
  return (
    <footer className="relative z-10 flex flex-wrap justify-between gap-5 px-[6vw] pb-[6vh] text-[0.78rem] tracking-[0.08em] text-dim">
      <span>
        © 2026 Mahmoud Alkwisem — engineered by hand, animated by obsession.
      </span>
      <span className="flex gap-1.5">
        <Magnetic strength={0.3}>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-300 hover:text-neon"
          >
            GitHub
          </a>
        </Magnetic>
        <span aria-hidden="true">·</span>
        <Magnetic strength={0.3}>
          <a
            href={LINKS.website}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-300 hover:text-neon"
          >
            mahmoudalkwisem.com
          </a>
        </Magnetic>
        <span aria-hidden="true">·</span>
        <Magnetic strength={0.3}>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              scrollToY(0)
            }}
            className="transition-colors duration-300 hover:text-neon"
          >
            Back to top ↑
          </a>
        </Magnetic>
      </span>
    </footer>
  )
}
