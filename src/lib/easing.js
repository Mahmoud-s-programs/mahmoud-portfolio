/**
 * The three signature easing curves from the design tokens, as Framer Motion
 * cubic-bezier arrays. Never animate with `linear` — every tween in the app
 * routes through one of these.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] // long silky deceleration
export const EASE_SNAP = [0.85, 0, 0.15, 1] // dramatic in-out (card flips, clip reveals)
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] // playful overshoot (hover pops)
