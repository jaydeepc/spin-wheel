/**
 * Slide 28 · where things stand, in --u (the stage is 100 x 56.25). One place for the numbers
 * that the markup, the timeline and the meshes all need.
 */
import type { Spot } from './medallions'

/** On stage: the portrait of the agent being introduced, and where its words begin. */
/** `rise`: how far above the portrait's middle the words begin. The label and the name stand at ONE place for all four; what the agent does grows downward from there. */
export const HERO = { cx: 29, cy: 28.2, d: 16, textX: 41.4, rise: 7.5 }

/** The cast's seats along the bottom: a ring each, the portrait inside it once the agent has been introduced. */
export const SEAT = { xs: [7.6, 27.6, 47.6, 67.6], y: 45.5, ring: 6.6, face: 5.5, star: 2.5 }

/** All four together: the deck's row. The portraits are a little smaller than the deck's 16.2u, never larger. */
export const ROW = { xs: [15.5, 38.5, 61.5, 84.5], y: 26.5, d: 13.4, textTop: 34.5, colW: 22 }

/** A small repeatable random (the field is the same on every visit). */
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * WHILE ONE AGENT IS ON STAGE the many keep to the edges: a band at the right of the stage and a
 * narrower one at the left, clear of the headline, the words, the seats and Back / Next.
 */
function edges(): Spot[] {
  const rnd = seeded(41)
  const out: Spot[] = []
  const band = (count: number, u0: number, u1: number, v0: number, v1: number) => {
    let tries = 0
    let placed = 0
    while (placed < count && tries++ < 4000) {
      const near = rnd() // 0 far … 1 near
      // the far ones are smaller and paler: depth, not a pattern
      const s: Spot = { u: u0 + rnd() * (u1 - u0), v: v0 + rnd() * (v1 - v0), z: -84 + near * 72, r: 0.5 + near * near * 1.25, o: 0.26 + near * 0.64 }
      if (out.every((p) => Math.hypot(p.u - s.u, p.v - s.v) > p.r + s.r + 0.7)) {
        out.push(s)
        placed++
      }
    }
  }
  // fewer than there could be, and none in the outer 2u of the stage: a quiet company at the sides, not confetti
  band(15, 85.2, 95.9, 16.5, 40)
  band(8, 4.1, 11.2, 18, 38)
  return out
}

/**
 * ALL FOUR TOGETHER: the many leave the edges and line up beside "and many more….": a queue that
 * begins at the words and runs off to the left along the bottom of the stage, each one a little
 * smaller, higher and paler than the one before it, as a line of people seen into the distance.
 */
function queue(count: number): Spot[] {
  const out: Spot[] = []
  const q = 0.952
  let u = 73.3
  for (let k = 0; k < count; k++) {
    const f = Math.pow(q, k)
    const r = 1.34 * f
    out.push({ u, v: 48.15 - (1 - f) * 1.5, z: -k * 4, r, o: 0.3 + 0.68 * Math.pow(f, 0.9) })
    u -= r * 2.62
  }
  return out
}

const byU = (a: Spot, b: Spot) => a.u - b.u
/** Paired left to right, so that on the way from the edges to their rows the many do not all cross each other. */
export const HOME: Spot[] = edges().sort(byU)
export const CROWD: Spot[] = queue(HOME.length).sort(byU)
