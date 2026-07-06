import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { SKILLS } from '../data/content'
import { makeGlowTexture } from '../lib/textures'

/**
 * Skills Galaxy — an interactive 3D orbital system.
 *
 * Every skill is a glowing sprite orbiting the core on its own ring radius,
 * inclination and angular velocity (inner rings orbit faster, like real
 * orbital mechanics). The whole system:
 *   - auto-rotates gently,
 *   - can be grabbed and thrown (drag velocity with exponential damping),
 *   - raycasts hover -> node inflates with a springy lerp and a
 *     glassmorphism tooltip appears above it.
 *
 * This module is lazy-loaded (below the fold) and its frameloop pauses
 * whenever the section scrolls out of view.
 */

const PALETTE = ['#63f2ff', '#a97bff', '#ff7ac3']

function Node({ skill, index, tex, registerHover }) {
  const sprite = useRef()
  const [hovered, setHovered] = useState(false)

  const orbit = useMemo(
    () => ({
      angle: Math.random() * Math.PI * 2,
      speed: (0.14 / skill.r) * (index % 2 ? 1 : -1) * 4, // inner = faster
      incl: (Math.random() - 0.5) * 0.9,
      baseScale: 0.55 - (skill.r - 1.6) * 0.05,
    }),
    [skill, index]
  )

  useFrame((_, dt) => {
    const s = sprite.current
    if (!s) return
    orbit.angle += orbit.speed * dt
    // orbital path with a gentle vertical figure-weave (incl offset)
    s.position.set(
      Math.cos(orbit.angle) * skill.r,
      Math.sin(orbit.angle * 1.3 + orbit.incl) * skill.r * 0.28,
      Math.sin(orbit.angle) * skill.r
    )
    // springy inflate on hover
    const target = hovered ? orbit.baseScale * 1.85 : orbit.baseScale
    const next = THREE.MathUtils.lerp(s.scale.x, target, 1 - Math.exp(-12 * dt))
    s.scale.setScalar(next)
  })

  return (
    <sprite
      ref={sprite}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        registerHover(true)
      }}
      onPointerOut={() => {
        setHovered(false)
        registerHover(false)
      }}
    >
      <spriteMaterial
        map={tex}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
      {hovered && (
        <Html center position={[0, 0.55, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[20, 10]}>
          {/* glassmorphism tooltip */}
          <div className="whitespace-nowrap rounded-full border border-neon/45 bg-abyss2/70 px-4 py-2 font-mono text-[0.72rem] tracking-[0.12em] text-ink shadow-[0_0_22px_rgba(99,242,255,0.35)] backdrop-blur-md">
            {skill.name}
          </div>
        </Html>
      )}
    </sprite>
  )
}

/** Faint local starfield inside the galaxy panel */
function GalaxyStars() {
  const geometry = useMemo(() => {
    const N = 350
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18
      pos[i * 3 + 2] = (Math.random() - 0.5) * 26
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [])
  return (
    <points geometry={geometry}>
      <pointsMaterial color="#8a93ad" size={0.02} transparent opacity={0.7} />
    </points>
  )
}

function GalaxyScene({ onHoverChange }) {
  const root = useRef()
  const { gl } = useThree()
  const drag = useRef({ active: false, px: 0, py: 0, vx: 0, vy: 0 })

  const textures = useMemo(() => PALETTE.map((c) => makeGlowTexture(c)), [])
  const coreTex = useMemo(() => makeGlowTexture('#9fe8ff'), [])

  // Drag-to-rotate: listeners on the canvas element, velocity applied with
  // damping in the frame loop so a flick keeps the galaxy spinning.
  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'pan-y'
    const down = (e) => {
      drag.current.active = true
      drag.current.px = e.clientX
      drag.current.py = e.clientY
    }
    const move = (e) => {
      if (!drag.current.active) return
      drag.current.vy = (e.clientX - drag.current.px) * 0.004
      drag.current.vx = (e.clientY - drag.current.py) * 0.004
      drag.current.px = e.clientX
      drag.current.py = e.clientY
    }
    const up = () => (drag.current.active = false)
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [gl])

  useFrame((_, dt) => {
    const g = root.current
    if (!g) return
    const d = drag.current
    g.rotation.y += d.vy + dt * 0.05 // flick velocity + idle auto-spin
    g.rotation.x += d.vx
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x, -0.7, 0.7)
    d.vx *= 0.92
    d.vy *= 0.92
  })

  return (
    <>
      <group ref={root}>
        {/* luminous core */}
        <sprite scale={[2.4, 2.4, 2.4]}>
          <spriteMaterial
            map={coreTex}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>

        {/* orbit rings */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation-x={Math.PI / 2 + (i - 1.5) * 0.12}>
            <torusGeometry args={[1.8 + i * 0.85, 0.004, 8, 120]} />
            <meshBasicMaterial color="#63f2ff" transparent opacity={0.12} />
          </mesh>
        ))}

        {/* skill nodes */}
        {SKILLS.map((skill, i) => (
          <Node
            key={skill.name}
            skill={skill}
            index={i}
            tex={textures[i % 3]}
            registerHover={onHoverChange}
          />
        ))}
      </group>
      <GalaxyStars />
    </>
  )
}

export default function Galaxy({ active = true }) {
  const [hovering, setHovering] = useState(false)
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ fov: 55, position: [0, 1.2, 9], near: 0.1, far: 100 }}
      gl={{ alpha: true, antialias: true }}
      style={{ cursor: hovering ? 'pointer' : 'grab' }}
    >
      <GalaxyScene onHoverChange={setHovering} />
    </Canvas>
  )
}
