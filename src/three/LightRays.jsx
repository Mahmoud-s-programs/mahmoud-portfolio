import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * Crepuscular light rays — god-rays falling from the surface far above.
 * A single additive plane whose fragment shader carves animated beams out
 * of angular noise around a light source parked above the frame. The rays
 * fade as you scroll deeper into the page (descending into the abyss).
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
  uniform float uFade;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453); }
  float noise(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash(i), hash(i + 1.0), u);
  }

  void main() {
    // light source sits above the top edge of the plane
    vec2 p = vUv - vec2(0.5, 1.25);
    float ang = atan(p.x, -p.y);
    float r = length(p);

    // two octaves of angular noise, counter-drifting = shimmering shafts
    float rays = noise(ang * 9.0 + uTime * 0.14) * 0.62
               + noise(ang * 23.0 - uTime * 0.09) * 0.38;
    rays = pow(rays, 2.6);

    float fall = smoothstep(1.35, 0.18, r);      // fade with depth
    float topBias = smoothstep(0.0, 0.4, vUv.y); // die out near the bottom

    // sun-through-water tint drifting cyan -> violet across the frame
    vec3 col = mix(vec3(0.12, 0.52, 0.62), vec3(0.38, 0.32, 0.85), vUv.x * 0.6 + 0.2);

    float a = rays * fall * topBias * 0.55 * uFade;
    gl_FragColor = vec4(col * a, a);
  }
`

export default function LightRays() {
  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(150, 80)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 }, uFade: { value: 1 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry, material }
  }, [])

  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt
    // Descend into darkness: rays at 100% on the hero, ~30% two screens down
    const depth = Math.min(1, window.scrollY / (window.innerHeight * 2.2))
    material.uniforms.uFade.value = 1 - depth * 0.7
  })

  return (
    <mesh geometry={geometry} material={material} position={[0, 24, -34]} />
  )
}
