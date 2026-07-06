import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { makeNebulaTexture } from '../lib/textures'

/**
 * Volumetric nebula clouds: nine huge soft-particle planes with additive
 * radial washes. Each puff slowly rotates and "breathes" (scale oscillation
 * on independent rhythms), which reads as underwater currents folding the
 * cloud into itself. Cheap trick, volumetric feel.
 */
const PUFFS = [
  { color: 'rgba(99,242,255,0.9)', pos: [-22, 6, -30], scale: 34, o: 0.07 },
  { color: 'rgba(169,123,255,0.9)', pos: [18, 14, -34], scale: 42, o: 0.09 },
  { color: 'rgba(60,80,220,0.9)', pos: [4, -16, -28], scale: 38, o: 0.08 },
  { color: 'rgba(255,122,195,0.9)', pos: [-14, -6, -36], scale: 30, o: 0.05 },
  { color: 'rgba(20,184,166,0.9)', pos: [26, -10, -26], scale: 28, o: 0.06 },
  { color: 'rgba(169,123,255,0.9)', pos: [-30, 18, -40], scale: 44, o: 0.07 },
  { color: 'rgba(99,242,255,0.9)', pos: [10, 22, -38], scale: 36, o: 0.06 },
  { color: 'rgba(80,50,200,0.9)', pos: [30, 8, -42], scale: 46, o: 0.08 },
  { color: 'rgba(99,242,255,0.9)', pos: [-8, -20, -32], scale: 32, o: 0.05 },
]

function Puff({ color, pos, scale, o, seed }) {
  const mesh = useRef()
  const tex = useMemo(() => makeNebulaTexture(color), [color])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const m = mesh.current
    if (!m) return
    // slow roll + asymmetric breathing = undulating current
    m.rotation.z = seed * 6.28 + t * 0.02 * (seed > 0.5 ? 1 : -1)
    const s = scale * (1 + 0.08 * Math.sin(t * 0.14 + seed * 10))
    const sy = scale * (1 + 0.08 * Math.sin(t * 0.11 + seed * 17 + 1.7))
    m.scale.set(s, sy, 1)
    m.position.y = pos[1] + Math.sin(t * 0.07 + seed * 12) * 1.6
  })

  return (
    <mesh ref={mesh} position={pos}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={o}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function Nebula() {
  return (
    <group>
      {PUFFS.map((p, i) => (
        <Puff key={i} {...p} seed={(i + 1) / PUFFS.length} />
      ))}
    </group>
  )
}
