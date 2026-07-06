import { useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { voidState } from '../lib/voidSignal'

/**
 * Bioluminescent star-plankton: ~2600 particles rising slowly with
 * randomized drift, twinkling as they climb. One THREE.Points buffer =
 * one draw call; all motion lives in the vertex shader (GPU), so the CPU
 * cost per frame is a single uniform write.
 */
const COUNT = 2600
const HEIGHT = 60 // vertical wrap span

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uBurst;
  attribute float aSeed;
  attribute float aScale;
  varying float vSeed;
  varying float vTwinkle;
  varying float vBurst;

  void main() {
    vBurst = uBurst;
    vSeed = aSeed;
    vec3 pos = position;

    // continuous upward rise; mod() wraps particles back to the seafloor
    float rise = uTime * (0.22 + aSeed * 0.55);
    pos.y = mod(pos.y + rise + ${(HEIGHT / 2).toFixed(1)}, ${HEIGHT.toFixed(1)}) - ${(HEIGHT / 2).toFixed(1)};

    // randomized lateral drift — every seed sways on its own rhythm
    pos.x += sin(uTime * (0.12 + aSeed * 0.3) + aSeed * 40.0) * (0.7 + aSeed * 1.2);
    pos.z += cos(uTime * 0.1 + aSeed * 21.0) * 0.7;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // bioluminescent twinkle
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed * 2.4) + aSeed * 100.0);

    // supernova flare — stars swell briefly on a Konami-code unlock
    gl_PointSize = aScale * vTwinkle * (150.0 / -mv.z) * (1.0 + uBurst * 2.2);
    gl_Position = projectionMatrix * mv;
  }
`

const fragmentShader = /* glsl */ `
  varying float vSeed;
  varying float vTwinkle;
  varying float vBurst;

  void main() {
    // soft round sprite with a hot core
    float d = length(gl_PointCoord - 0.5);
    float glow = pow(smoothstep(0.5, 0.0, d), 2.2);

    vec3 cyan   = vec3(0.39, 0.95, 1.00);
    vec3 violet = vec3(0.66, 0.48, 1.00);
    vec3 teal   = vec3(0.16, 0.85, 0.72);

    vec3 col = mix(cyan, violet, smoothstep(0.25, 0.85, vSeed));
    if (vSeed > 0.9) col = teal; // rare deep-teal motes
    col = mix(col, vec3(1.0), vBurst * 0.6); // flare white at the burst's peak

    gl_FragColor = vec4(col, glow * vTwinkle * (0.85 + vBurst * 0.6));
  }
`

export default function Plankton() {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT)
    const scales = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110 // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * HEIGHT // y
      positions[i * 3 + 2] = -38 + Math.random() * 40 // z: -38..2
      seeds[i] = Math.random()
      scales[i] = 0.8 + Math.random() * 3.4
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 }, uBurst: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    return { geometry, material }
  }, [])

  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt

    // decay the flare over ~2.2s since the last Konami-code unlock
    const age = (performance.now() - voidState.burstAt) / 1000
    material.uniforms.uBurst.value =
      voidState.burstAt && age < 2.2 ? 1 - age / 2.2 : 0
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
