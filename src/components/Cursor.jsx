import { useEffect, useRef } from 'react'
import { pointer } from '../lib/pointer'

/**
 * Custom neon cursor: a hot cyan dot glued to the pointer plus a lagging
 * ring that inflates (and warms to rose) over any interactive element.
 * Driven by rAF + direct style writes — no React state per mousemove.
 * Fully disabled on coarse pointers.
 */
export default function Cursor() {
  const dot = useRef()
  const ring = useRef()

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    document.body.classList.add('custom-cursor')

    let rx = pointer.px
    let ry = pointer.py
    let raf

    const tick = () => {
      // ring trails the dot with a lerp for the elastic feel
      rx += (pointer.px - rx) * 0.16
      ry += (pointer.py - ry) * 0.16
      if (dot.current)
        dot.current.style.transform = `translate(${pointer.px}px, ${pointer.py}px) translate(-50%,-50%)`
      if (ring.current)
        ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // event delegation: any interactive ancestor puffs the ring up
    const over = (e) => {
      if (e.target.closest('a,button,[data-cursor],canvas')) {
        ring.current?.classList.add('cursor-ring-big')
      }
    }
    const out = (e) => {
      if (e.target.closest('a,button,[data-cursor],canvas')) {
        ring.current?.classList.remove('cursor-ring-big')
      }
    }
    document.addEventListener('pointerover', over)
    document.addEventListener('pointerout', out)

    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('custom-cursor')
      document.removeEventListener('pointerover', over)
      document.removeEventListener('pointerout', out)
    }
  }, [])

  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null
  }

  return (
    <>
      <div
        ref={dot}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[99] h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_12px_#63f2ff]"
      />
      <div
        ref={ring}
        aria-hidden="true"
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[99] h-9 w-9 rounded-full border border-neon/50 transition-[width,height,border-color,background-color] duration-300 ease-spring"
      />
      <style>{`
        .cursor-ring-big {
          width: 72px !important;
          height: 72px !important;
          border-color: rgba(255,122,195,.8) !important;
          background: rgba(255,122,195,.06);
        }
      `}</style>
    </>
  )
}
