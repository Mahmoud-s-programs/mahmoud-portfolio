import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * The abyss itself: a huge backdrop plane running a gradient shader that
 * blends deep abyssal blue (below) into cosmic purple (above), with a slow
 * sine "current" bending the boundary and a vignette pinning focus center.
 */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec3 deep   = vec3(0.010, 0.016, 0.055); // abyssal floor
    vec3 blue   = vec3(0.016, 0.075, 0.155); // mid-water blue
    vec3 purple = vec3(0.105, 0.045, 0.220); // cosmic ceiling

    // the blue->purple boundary undulates like a thermocline
    float wobble = 0.10 * sin(uTime * 0.05 + vUv.x * 4.0)
                 + 0.05 * sin(uTime * 0.08 + vUv.x * 9.0);

    vec3 col = mix(deep, blue, smoothstep(0.02, 0.5, vUv.y));
    col = mix(col, purple, smoothstep(0.48, 1.05, vUv.y + wobble));

    // vignette
    float d = distance(vUv, vec2(0.5, 0.55));
    col *= 1.0 - d * 0.65;

    gl_FragColor = vec4(col, 1.0);
  }
`

export default function GradientBackdrop() {
  const mat = useRef()
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  useFrame((_, dt) => {
    uniforms.uTime.value += dt
  })

  return (
    <mesh position={[0, 0, -70]} renderOrder={-10}>
      <planeGeometry args={[340, 200]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}
