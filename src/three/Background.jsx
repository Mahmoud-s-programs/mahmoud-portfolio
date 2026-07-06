import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { pointer, smoothPointer } from '../lib/pointer'
import GradientBackdrop from './GradientBackdrop'
import Constellations from './Constellations'
import Nebula from './Nebula'
import LightRays from './LightRays'
import Plankton from './Plankton'
import JellyfishField from './Jellyfish'
import HeroField from './HeroField'

/**
 * ParallaxRig — wraps the whole deep-scene in a group that leans toward the
 * cursor with heavy inertia. Reading the shared pointer store inside useFrame
 * (instead of React state) means zero re-renders; the smoothing turns raw
 * mouse motion into the weightless drift of floating in a space-ocean.
 */
function ParallaxRig({ children }) {
  const group = useRef()
  useFrame((_, dt) => {
    smoothPointer(dt) // advance the global smoothed pointer once per frame
    const g = group.current
    if (!g) return
    g.position.x = pointer.snx * 0.9
    g.position.y = pointer.sny * 0.55
    g.rotation.y = pointer.snx * 0.045
    g.rotation.x = -pointer.sny * 0.03
  })
  return <group ref={group}>{children}</group>
}

/**
 * The persistent full-screen background Canvas, fixed behind all content.
 * Perf notes:
 *  - frameloop flips to 'never' when the tab is hidden (zero GPU while away)
 *  - dpr capped at 1.6, antialias off — additive glows don't need MSAA
 *  - every particle layer is a single draw call (THREE.Points buffers)
 */
export default function Background() {
  const [frameloop, setFrameloop] = useState('always')

  useEffect(() => {
    const onVis = () => setFrameloop(document.hidden ? 'never' : 'always')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.6]}
        camera={{ fov: 60, position: [0, 0, 10], near: 0.1, far: 160 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => gl.setClearColor('#060812')}
      >
        <ParallaxRig>
          <GradientBackdrop />
          <Constellations />
          <Nebula />
          <LightRays />
          <Plankton />
          <JellyfishField />
        </ParallaxRig>
        {/* Hero fluid sits outside the rig so cursor->world mapping stays exact */}
        <HeroField />
      </Canvas>
    </div>
  )
}
