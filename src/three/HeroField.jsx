import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { pointer } from '../lib/pointer'

/**
 * Hero liquid field — the particle simulation living behind the headline.
 *
 * ~8k particles on a plane at z=0 (the camera's focus plane). All motion is
 * vertex displacement on the GPU:
 *   1. layered counter-phase sines produce a curl-like ambient swirl
 *   2. the cursor (projected into world space) applies radial repulsion
 *      plus a tangential component, so the liquid *swirls around* your
 *      hand and disperses on approach instead of just dodging.
 * The whole field fades out via uFade as the hero scrolls away.
 */
const COLS = 128
const ROWS = 64

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;   // cursor in world units on the z=0 plane
  uniform float uFade;
  attribute float aSeed;
  varying float vGlow;
  varying float vSeed;

  void main() {
    vSeed = aSeed;
    vec3 pos = position;

    // --- ambient liquid swirl (two incommensurate sine fields) ---
    pos.x += sin(pos.y * 0.42 + uTime * 0.55 + aSeed * 6.283)
           * cos(pos.x * 0.3 - uTime * 0.4) * 0.42;
    pos.y += sin(pos.x * 0.36 + uTime * 0.45)
           * cos(pos.y * 0.28 + uTime * 0.3 + aSeed * 3.0) * 0.36;

    // --- cursor proximity: disperse + orbital swirl ---
    vec2 d = pos.xy - uMouse;
    float dist = length(d);
    vec2 dir = d / max(dist, 0.0001);
    vec2 tangent = vec2(-dir.y, dir.x);
    float force = smoothstep(3.4, 0.0, dist); // 0 far -> 1 at cursor
    pos.xy += dir * force * 2.1 + tangent * force * 1.1;

    vGlow = force;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (1.4 + aSeed * 2.4 + force * 4.0) * (34.0 / -mv.z) * step(0.01, uFade);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uFade;
  varying float vGlow;
  varying float vSeed;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 2.0);

    // calm water = cyan; agitated water = violet/rose
    vec3 cyan = vec3(0.39, 0.95, 1.0);
    vec3 vio  = vec3(0.66, 0.48, 1.0);
    vec3 rose = vec3(1.0, 0.48, 0.76);
    vec3 col = mix(cyan, vio, clamp(vGlow * 1.4 + vSeed * 0.25, 0.0, 1.0));
    col = mix(col, rose, smoothstep(0.7, 1.0, vGlow));

    gl_FragColor = vec4(col, a * 0.5 * uFade);
  }
`

export default function HeroField() {
  const { viewport } = useThree()

  const { geometry, material } = useMemo(() => {
    const count = COLS * ROWS
    const positions = new Float32Array(count * 3)
    const seeds = new Float32Array(count)
    let i = 0
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        // jittered grid over a generous area around the viewport
        positions[i * 3] = (x / (COLS - 1) - 0.5) * 34 + (Math.random() - 0.5) * 0.5
        positions[i * 3 + 1] = (y / (ROWS - 1) - 0.5) * 15 + (Math.random() - 0.5) * 0.5
        positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5
        seeds[i] = Math.random()
        i++
      }
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uFade: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geometry, material }
  }, [])

  useFrame((_, dt) => {
    const u = material.uniforms
    u.uTime.value += dt
    // project smoothed cursor NDC onto the z=0 plane in world units
    u.uMouse.value.set(
      pointer.snx * (viewport.width / 2),
      pointer.sny * (viewport.height / 2)
    )
    // fade the liquid out over the first ~90vh of scroll
    const gone = Math.min(1, window.scrollY / (window.innerHeight * 0.9))
    u.uFade.value = 1 - gone
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
