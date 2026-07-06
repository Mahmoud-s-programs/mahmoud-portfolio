import { Html, useProgress } from '@react-three/drei'

/**
 * Suspense fallback shown inside a model canvas while its GLTF streams in —
 * a mono percentage readout in the site's telemetry voice.
 */
export default function ModelLoader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <span className="mono-label whitespace-nowrap">
        materializing · {progress.toFixed(0)}%
      </span>
    </Html>
  )
}
