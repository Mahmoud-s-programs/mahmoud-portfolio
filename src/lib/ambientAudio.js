/**
 * Procedurally synthesized ambient bed — no audio file, just the Web Audio
 * API — so the "space-ocean" sound matches the same hand-built, asset-free
 * philosophy as the procedural shaders and textures elsewhere in the scene.
 *
 * Two layers, both amplitude/filter-modulated by slow LFOs so nothing ever
 * loops audibly:
 *   - "space": two detuned low sines (a few cents apart) beating softly
 *     through a lowpass, plus a quiet octave-up shimmer — a cosmic drone.
 *   - "ocean": brownian noise (integrated white noise, softer than hiss)
 *     through a lowpass whose cutoff and gain both breathe on independent
 *     ~11-15s cycles, reading as slow swells rather than static.
 *
 * Lazily creates the AudioContext on first start (required by browser
 * autoplay policy — this only ever runs from a click). Every start/stop
 * ramps the master gain instead of snapping, so there's never a click/pop.
 */
let ctx = null
let nodes = null
let playing = false

const TARGET_GAIN = 0.3

function makeBrownNoiseBuffer(audioCtx) {
  const length = audioCtx.sampleRate * 4
  const buffer = audioCtx.createBuffer(1, length, audioCtx.sampleRate)
  const data = buffer.getChannelData(0)
  let last = 0
  for (let i = 0; i < length; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.5
  }
  return buffer
}

function buildGraph(audioCtx) {
  const master = audioCtx.createGain()
  master.gain.value = 0
  master.connect(audioCtx.destination)

  // --- space drone ---
  const droneFilter = audioCtx.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = 380
  droneFilter.connect(master)

  const droneGain = audioCtx.createGain()
  droneGain.gain.value = 0.4
  droneGain.connect(droneFilter)

  const osc1 = audioCtx.createOscillator()
  osc1.type = 'sine'
  osc1.frequency.value = 55
  osc1.connect(droneGain)

  const osc2 = audioCtx.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = 55 * 1.006 // a few cents sharp -> slow natural beating
  osc2.connect(droneGain)

  const shimmer = audioCtx.createOscillator()
  shimmer.type = 'triangle'
  shimmer.frequency.value = 110.3
  const shimmerGain = audioCtx.createGain()
  shimmerGain.gain.value = 0.1
  shimmer.connect(shimmerGain)
  shimmerGain.connect(droneFilter)

  // breathing LFO on the drone's own gain
  const breathLFO = audioCtx.createOscillator()
  breathLFO.frequency.value = 0.05 // ~20s cycle
  const breathDepth = audioCtx.createGain()
  breathDepth.gain.value = 0.15
  breathLFO.connect(breathDepth)
  breathDepth.connect(droneGain.gain)

  // --- ocean wash ---
  const noise = audioCtx.createBufferSource()
  noise.buffer = makeBrownNoiseBuffer(audioCtx)
  noise.loop = true

  const noiseFilter = audioCtx.createBiquadFilter()
  noiseFilter.type = 'lowpass'
  noiseFilter.frequency.value = 500
  noiseFilter.Q.value = 0.6
  noise.connect(noiseFilter)

  const noiseGain = audioCtx.createGain()
  noiseGain.gain.value = 0.35
  noiseFilter.connect(noiseGain)
  noiseGain.connect(master)

  // swell LFOs — deliberately off-ratio frequencies so cutoff and volume
  // never crest at the same instant (reads as organic, not metronomic)
  const swellFilterLFO = audioCtx.createOscillator()
  swellFilterLFO.type = 'sine'
  swellFilterLFO.frequency.value = 0.09 // ~11s
  const swellFilterDepth = audioCtx.createGain()
  swellFilterDepth.gain.value = 260
  swellFilterLFO.connect(swellFilterDepth)
  swellFilterDepth.connect(noiseFilter.frequency)

  const swellGainLFO = audioCtx.createOscillator()
  swellGainLFO.type = 'sine'
  swellGainLFO.frequency.value = 0.067 // ~15s
  const swellGainDepth = audioCtx.createGain()
  swellGainDepth.gain.value = 0.12
  swellGainLFO.connect(swellGainDepth)
  swellGainDepth.connect(noiseGain.gain)

  const sources = [osc1, osc2, shimmer, breathLFO, noise, swellFilterLFO, swellGainLFO]
  sources.forEach((s) => s.start())

  return { master, sources }
}

/** Fades the ambient bed in, creating the graph on first call. */
export function startAmbient() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  if (ctx.state === 'suspended') ctx.resume()
  if (!nodes) nodes = buildGraph(ctx)

  const now = ctx.currentTime
  nodes.master.gain.cancelScheduledValues(now)
  nodes.master.gain.setValueAtTime(nodes.master.gain.value, now)
  nodes.master.gain.linearRampToValueAtTime(TARGET_GAIN, now + 1.8)
  playing = true
}

/** Fades the ambient bed out; the graph keeps running silently underneath. */
export function stopAmbient() {
  playing = false
  if (!ctx || !nodes) return
  const now = ctx.currentTime
  nodes.master.gain.cancelScheduledValues(now)
  nodes.master.gain.setValueAtTime(nodes.master.gain.value, now)
  nodes.master.gain.linearRampToValueAtTime(0, now + 1.2)
}

export function toggleAmbient() {
  if (playing) stopAmbient()
  else startAmbient()
  return playing
}

export function isAmbientPlaying() {
  return playing
}

/** Suspends/resumes the underlying context — used when the tab hides. */
export function suspendAmbientContext() {
  if (ctx && ctx.state === 'running') ctx.suspend()
}
export function resumeAmbientContext() {
  if (ctx && playing && ctx.state === 'suspended') ctx.resume()
}
