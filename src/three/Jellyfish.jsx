import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { makeGlowTexture } from '../lib/textures'

/**
 * Celestial jellyfish — procedural creatures drifting through the deep.
 *
 * Locomotion is the real thing: the bell contracts on a sine rhythm, and
 * upward thrust peaks just after each contraction (phase-lagged max()),
 * so they pulse-and-glide exactly like the real animal. Tentacles are a
 * THREE.Points ribbon whose vertices are re-simulated on the CPU each frame
 * with a phase delay down their length — the classic trailing-wave sway.
 * When one drifts off the top of the volume it respawns below.
 */
const TENTACLES = 8
const SEGMENTS = 13

const PALETTE = ['#63f2ff', '#a97bff', '#ff7ac3', '#5eead4']

function Jelly({ index }) {
  const group = useRef()
  const bell = useRef()
  const inner = useRef()

  const sim = useMemo(() => {
    const seed = Math.random()
    return {
      t: seed * 30,
      x: (Math.random() - 0.5) * 56,
      y: -26 + Math.random() * 44,
      z: -7 - Math.random() * 12,
      driftX: (0.15 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1),
      scale: 0.9 + Math.random() * 1.1,
      rate: 1.4 + Math.random() * 0.5, // pulse frequency
      color: new THREE.Color(PALETTE[index % PALETTE.length]),
      positions: new Float32Array(TENTACLES * SEGMENTS * 3),
    }
  }, [index])

  const glowTex = useMemo(
    () => makeGlowTexture(PALETTE[index % PALETTE.length]),
    [index]
  )

  const tentacleGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(sim.positions, 3))
    return g
  }, [sim])

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05)
    sim.t += dt
    const g = group.current
    if (!g) return

    // --- bell pulse: squash on contraction, stretch on release ---
    const pulse = Math.sin(sim.t * sim.rate)
    if (bell.current) {
      bell.current.scale.set(1 - pulse * 0.13, 1 + pulse * 0.22, 1 - pulse * 0.13)
    }
    if (inner.current) {
      const s = 1.9 + pulse * 0.35
      inner.current.scale.set(s, s, 1)
    }

    // --- locomotion: thrust peaks shortly AFTER the contraction ---
    const thrust = Math.max(0, Math.sin(sim.t * sim.rate - 0.7))
    sim.y += (0.10 + thrust * 0.5) * dt * sim.scale
    sim.x += sim.driftX * dt

    // respawn below once it exits the top; bounce at the side walls
    if (sim.y > 27) {
      sim.y = -28
      sim.x = (Math.random() - 0.5) * 56
      sim.z = -7 - Math.random() * 12
    }
    if (Math.abs(sim.x) > 36) sim.driftX *= -1

    g.position.set(sim.x, sim.y, sim.z)
    g.rotation.z = Math.sin(sim.t * 0.35) * 0.14 // lazy roll

    // --- tentacles: trailing wave, phase-delayed down each strand ---
    const pos = tentacleGeometry.attributes.position.array
    let k = 0
    for (let j = 0; j < TENTACLES; j++) {
      const a = (j / TENTACLES) * Math.PI * 2
      const bx = Math.cos(a) * 0.42
      const bz = Math.sin(a) * 0.42
      for (let i = 0; i < SEGMENTS; i++) {
        const lag = i * 0.45
        pos[k++] = bx + Math.sin(sim.t * 1.9 - lag + j) * 0.055 * i
        pos[k++] = -0.05 - i * 0.17 * (1 + 0.07 * pulse)
        pos[k++] = bz + Math.cos(sim.t * 1.5 - lag + j * 1.3) * 0.05 * i
      }
    }
    tentacleGeometry.attributes.position.needsUpdate = true
  })

  return (
    <group ref={group} scale={sim.scale}>
      {/* translucent bell (hemisphere, additive = self-luminous membrane) */}
      <mesh ref={bell}>
        <sphereGeometry args={[0.55, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color={sim.color}
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* inner bioluminescent core */}
      <sprite ref={inner}>
        <spriteMaterial
          map={glowTex}
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
      {/* tentacle ribbon */}
      <points geometry={tentacleGeometry} frustumCulled={false}>
        <pointsMaterial
          color={sim.color}
          size={0.055}
          sizeAttenuation
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

export default function JellyfishField({ count = 4 }) {
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <Jelly key={i} index={i} />
      ))}
    </group>
  )
}
