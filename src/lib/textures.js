import * as THREE from 'three'

/**
 * Procedural radial-glow texture: white-hot core -> tinted halo -> transparent.
 * Used for skill nodes, jellyfish bells, and nebula puffs. Generating these on
 * a canvas keeps the app asset-free and lets every glow share one cheap
 * texture per color.
 */
export function makeGlowTexture(color, inner = '#ffffff') {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  )
  grad.addColorStop(0, inner)
  grad.addColorStop(0.25, color)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

/**
 * Big soft nebula puff — a wide, low-intensity radial wash used by the
 * volumetric cloud layer. Softer falloff than the node glow.
 */
export function makeNebulaTexture(color) {
  const size = 256
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  )
  grad.addColorStop(0, color)
  grad.addColorStop(0.4, color.replace(/[\d.]+\)$/, '0.35)'))
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}
