import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * Tiny far-field constellations dusting the crepuscular zone — pin-prick
 * stars that barely twinkle. Kept deep (z -25..-60) so the parallax rig
 * separates them from the plankton layer and depth reads immediately.
 */
const COUNT = 750

const vertexShader = /* glsl */ `
  uniform float uTime;
  attribute float aSeed;
  varying float vAlpha;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    // slow twinkle, mostly-on so the sky feels stable
    vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.3 + aSeed) + aSeed * 80.0));
    gl_PointSize = (1.0 + aSeed * 2.2) * (60.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.05, d);
    gl_FragColor = vec4(vec3(0.75, 0.83, 1.0), a * vAlpha * 0.8);
  }
`

export default function Constellations() {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 150
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90
      positions[i * 3 + 2] = -60 + Math.random() * 35
      seeds[i] = Math.random()
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry, material }
  }, [])

  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
