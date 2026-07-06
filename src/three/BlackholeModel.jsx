import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF } from '@react-three/drei'
import ModelLoader from './ModelLoader'

/**
 * The 3D blackhole from the original portfolio (public/blackhole) — its
 * accretion ring is emissive, so it glows with no scene lights, exactly as
 * staged in the source site. Auto-rotates continuously; grab it to spin it
 * yourself (zoom disabled, polar clamped like the original).
 */
function Blackhole() {
  const model = useGLTF('/blackhole/scene.gltf')
  return (
    <primitive object={model.scene} scale={0.5} position-y={0} rotation-y={0} />
  )
}

export default function BlackholeCanvas({ active = true }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.5]}
      camera={{ fov: 45, near: 0.1, far: 200, position: [-2, 3, 2] }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={<ModelLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI}
          minPolarAngle={Math.PI / 4}
        />
        <Blackhole />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}

useGLTF.preload('/blackhole/scene.gltf')
