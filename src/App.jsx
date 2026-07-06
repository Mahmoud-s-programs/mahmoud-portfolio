import { useCallback, useState } from 'react'
import Background from './three/Background'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import ProgressBar from './components/ProgressBar'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Skills from './components/Skills'
import Timeline from './components/Timeline'
import Projects from './components/Projects'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import useSmoothScroll from './hooks/useSmoothScroll'

/**
 * App — scroll orchestration and layer stack.
 *
 * z-order (back to front):
 *   0  Background — the persistent ocean-space Canvas (fixed, pointer-none)
 *   1  grain — film grain overlay unifying 3D and DOM layers
 *   10 main content — all sections scroll above the scene
 *   50+ nav / progress / cursor / loader chrome
 *
 * Scroll: useSmoothScroll() mounts the inertial wheel engine once; every
 * scroll-driven animation (Framer useScroll, IntersectionObserver reveals,
 * shader fade uniforms) reads the *native* window scroll it interpolates,
 * so the whole page shares one buttery timeline.
 */
export default function App() {
  const [booted, setBooted] = useState(false)
  useSmoothScroll()

  const handleLoaderDone = useCallback(() => setBooted(true), [])

  return (
    <div id="top">
      {/* deep scene */}
      <Background />
      {/* film grain sits between the scene and the content */}
      <div className="grain pointer-events-none fixed inset-0 z-[1] opacity-50" aria-hidden="true" />

      {/* chrome */}
      <Loader onDone={handleLoaderDone} />
      <Cursor />
      <ProgressBar />
      <Nav />

      {/* content */}
      <main className="relative z-10">
        <Hero started={booted} />
        <Manifesto />
        <Skills />
        <Timeline />
        <Projects />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
