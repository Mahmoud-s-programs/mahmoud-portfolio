# Mahmoud — Creative Engineer · Portfolio

An immersive ocean-space portfolio built with React, Three.js, and Framer Motion.
A persistent WebGL abyss — rising bioluminescent plankton, undulating nebulas,
crepuscular light rays, and drifting celestial jellyfish — lives behind every
section, leaning subtly toward your cursor.

## Stack

- **React 18 + Vite** — app framework and build
- **Tailwind CSS** — styling (design tokens in `tailwind.config.js`)
- **Three.js via @react-three/fiber + drei** — all 3D/particle rendering
- **Framer Motion** — scroll-triggered animation, morphing transitions, micro-interactions
- **react-intersection-observer** — viewport triggers for reveals and lazy 3D

## Run

```bash
npm install
npm run dev      # dev server
npm run build    # production build -> dist/
npm run preview  # serve the production build
```

## Architecture

```
src/
  App.jsx                  # layer stack + scroll orchestration
  lib/
    pointer.js             # shared mutable pointer store (zero re-renders)
    scrollControl.js       # inertial wheel-lerp smooth-scroll engine
    easing.js              # the three signature cubic-bezier curves
    textures.js            # procedural canvas glow/nebula textures
  three/
    Background.jsx         # persistent fixed Canvas + cursor parallax rig
    GradientBackdrop.jsx   # abyssal blue -> cosmic purple gradient shader
    Plankton.jsx           # 2600 GPU-animated rising particles (1 draw call)
    Constellations.jsx     # far-field twinkling stars
    Nebula.jsx             # additive soft-particle cloud layer
    LightRays.jsx          # crepuscular god-ray shader (fades with depth)
    Jellyfish.jsx          # procedural pulse-and-glide creatures
    HeroField.jsx          # hero liquid field w/ cursor repulsion + swirl
    Galaxy.jsx             # lazy-loaded interactive skills orbital system
  components/              # Hero, Manifesto, Skills, Timeline, Projects,
                           # Contact, Nav, Loader, Cursor, ProgressBar, ...
```

### Performance notes

- Background frameloop pauses when the tab is hidden; the galaxy's pauses
  whenever its section is off-screen.
- All particle layers are single `THREE.Points` buffers with shader-side
  motion — one draw call each, no per-particle objects.
- The skills galaxy chunk is code-split and mounted 300px before it scrolls
  into view.
- DPR capped (1.6 background / 1.75 galaxy), antialias off on the additive
  background where MSAA is invisible anyway.
