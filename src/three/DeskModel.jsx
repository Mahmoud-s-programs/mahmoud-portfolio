import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Preload, useGLTF } from '@react-three/drei'
import ModelLoader from './ModelLoader'

/**
 * The 3D computer desk from the original portfolio (public/desktop_pc).
 * Same staging as the source site: camera at [20,3,5] with a tight 25° fov,
 * hemisphere fill + shadow-casting spotlight, and OrbitControls locked to a
 * horizontal orbit (polar angle pinned at 90°) so you can spin the desk but
 * never flip under it.
 *
 * Lighting note: three r155+ uses physical light units, which would render
 * the original intensity values nearly black — decay={0} restores the
 * legacy falloff the model was staged for.
 */
function Desk() {
  const computer = useGLTF('/desktop_pc/scene.gltf')
  return (
    <group>
      <hemisphereLight intensity={1.2} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={2.2}
        decay={0}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1.4} decay={0} />
      <primitive
        object={computer.scene}
        scale={0.65}
        position={[0.0001, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </group>
  )
}

export default function DeskCanvas({ active = true }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={<ModelLoader />}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Desk />
      </Suspense>
      <Preload all />
    </Canvas>
  )
}

useGLTF.preload('/desktop_pc/scene.gltf')
