'use client'

/**
 * Slide 24's case, as a picture: THE SWARM and THE COVER-UP.
 *
 * Roughly 700 agents (700 points, one draw call, on the scene's own canvas: glass.ts) pour in
 * from the edge of the stage and from behind the chess photograph and close on one block, the
 * platform. Its guard ring holds them for a moment: they pile up against it. The ring gives and
 * they go in to the block's walls. Then a part of them drops to the record of their actions,
 * runs along it line by line and stays lying over what was written there.
 *
 * Every point is a pure function of three numbers the timeline tweens, so every frame can be
 * reached by seeking and two visits to one frame are identical:
 *
 *   swarm    0 … 1: the agents arriving (each with its own start, its own moment, its own curve)
 *   breach   0 the ring holds them out … 1 they are at the block
 *   wipe     0 … 1: the cover-up, line after line of the log
 *
 * The block, the ring and the log themselves are DOM (index.tsx): the scene measures them and
 * hands their places to `layout()`, so the points land on what the page laid out.
 */

import { THREE, type SceneCanvas, type SceneCtx } from '../../kit'

/** One point for every agent in the sentence. */
export const AGENTS = 700
/** How many of them go down to each line of the log. */
const PER_LINE = 40

/** The cover-up's own clock, as shares of `wipe`: when line k is run along, and how long that takes. */
export const WIPE = { first: 0.15, step: 0.135, run: 0.3, lead: 0.15 }
export const wipeStart = (k: number) => WIPE.first + k * WIPE.step

/** What the page laid out, in --u from the stage's top left. */
export interface Field {
  block: { cx: number; cy: number; half: number }
  /** the guard ring's radius, and how far out the swarm stands at the end */
  ring: number
  reach: number
  /** the log's lines: their two ends and their middle height */
  lines: { x0: number; x1: number; y: number }[]
}

export interface Swarm {
  sim: { swarm: number; breach: number; wipe: number }
  layout(field: Field): void
}

const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
const smooth = (x: number) => x * x * (3 - 2 * x)

/** How many agents the figure shows while `swarm` runs: it reaches 700 as the last one lands. */
export function landed(swarm: number): number {
  return Math.round(AGENTS * clamp((swarm - 0.3) / 0.7))
}

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

const VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aTone;
  uniform float uPx;
  varying float vA;
  varying float vT;
  void main() {
    vA = aAlpha;
    vT = aTone;
    gl_PointSize = aSize * uPx;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/** An agent: a small round point of flame. */
const FRAG = /* glsl */ `
  varying float vA;
  varying float vT;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float disc = smoothstep(1.0, 0.7, d);
    vec3 col = mix(vec3(0.945, 0.392, 0.263), vec3(0.82, 0.25, 0.1), vT);
    gl_FragColor = vec4(col, disc * vA);
  }
`

export function makeSwarm(ctx: SceneCtx, gl: SceneCanvas): Swarm {
  const sim = { swarm: 0, breach: 0, wipe: 0 }
  const rnd = seeded(700)
  const N = AGENTS

  // what never changes about an agent
  const ang = new Float32Array(N)
  const near = new Float32Array(N) // how close to the block it ends, 0 at the wall … 1 far out
  const wait = new Float32Array(N) // where it stops while the ring holds
  const late = new Float32Array(N) // when it sets off
  const hurry = new Float32Array(N) // when it goes in, once the ring has given
  const curl = new Float32Array(N) // how far its way in bends
  const gate = new Float32Array(N) // which edge it comes from
  const along = new Float32Array(N) // where on that edge
  const phase = new Float32Array(N)
  const lag = new Float32Array(N) // on a line of the log: how far behind the front it runs
  const lift = new Float32Array(N) // … and how far above or below the line
  const lie = new Float32Array(N) // … and where along the line it is left lying
  const line = new Int8Array(N).fill(-1)
  const sizes = new Float32Array(N)
  const tones = new Float32Array(N)
  for (let i = 0; i < N; i++) {
    ang[i] = rnd() * Math.PI * 2
    near[i] = Math.pow(rnd(), 1.7)
    wait[i] = rnd()
    late[i] = rnd()
    hurry[i] = rnd()
    curl[i] = (rnd() - 0.5) * 5
    gate[i] = rnd()
    along[i] = rnd()
    phase[i] = rnd() * Math.PI * 2
    lag[i] = Math.pow(rnd(), 1.4)
    lift[i] = rnd() + rnd() - 1
    lie[i] = rnd()
    sizes[i] = 0.19 + 0.2 * rnd() * rnd()
    tones[i] = rnd() < 0.3 ? 0.9 : rnd() * 0.25
  }

  const pos = new Float32Array(N * 3)
  const alpha = new Float32Array(N)
  const geo = new THREE.BufferGeometry()
  const posAttr = new THREE.BufferAttribute(pos, 3)
  const alphaAttr = new THREE.BufferAttribute(alpha, 1)
  geo.setAttribute('position', posAttr)
  geo.setAttribute('aAlpha', alphaAttr)
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  geo.setAttribute('aTone', new THREE.BufferAttribute(tones, 1))
  const points = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms: { uPx: { value: ctx.U * gl.renderer.getPixelRatio() } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    }),
  )
  points.frustumCulled = false
  points.renderOrder = 6
  points.visible = false
  gl.scene.add(points)

  let field: Field | null = null
  const still = ctx.held || ctx.reduced
  const calm = ctx.reduced

  gl.onFrame((time) => {
    const f = field
    if (!f) return
    const t = still ? 0 : time
    // less motion: nothing travels. The agents stand where they end and only fade in.
    const sw = calm ? 1 : sim.swarm
    const br = calm ? 1 : sim.breach
    const { cx, cy, half } = f.block
    for (let i = 0; i < N; i++) {
      // ---- around the block: held out by the ring, then at its walls
      const a = ang[i] + t * 0.05
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      const wall = half / Math.max(Math.abs(ca), Math.abs(sa))
      const rIn = Math.max(wall + 0.16, half * 1.08 + (f.reach - half * 1.08) * near[i])
      const rOut = Math.max(rIn, f.ring + 0.22 + (f.reach - f.ring - 0.22) * wait[i] * wait[i])
      const go = smooth(clamp((br - 0.45 * hurry[i]) / 0.55))
      const r = rOut + (rIn - rOut) * go
      let tx = cx + ca * r + Math.cos(t * 1.3 + phase[i]) * 0.07
      let ty = cy + sa * r + Math.sin(t * 1.1 + phase[i] * 1.7) * 0.07

      // ---- its way in: from the left edge, from behind the photograph, from below
      let sx: number
      let sy: number
      if (gate[i] < 0.56) {
        sx = -1.5 - along[i] * 3
        sy = cy - 5 + ((i * 0.618) % 1) * 22
      } else if (gate[i] < 0.84) {
        sx = cx - 4 + along[i] * 15
        sy = cy - 9.5 - (i % 5) * 0.5
      } else {
        sx = 1 + along[i] * 15
        sy = 57.5 + (i % 4) * 0.6
      }
      const tau = clamp((sw - 0.58 * late[i]) / 0.42)
      const e = 1 - Math.pow(1 - tau, 3)
      const dx = tx - sx
      const dy = ty - sy
      const len = Math.hypot(dx, dy) || 1
      const bend = Math.sin(Math.PI * e) * curl[i] * (1 - e * 0.4)
      let x = sx + dx * e + (-dy / len) * bend
      let y = sy + dy * e + (dx / len) * bend
      let al = calm ? sim.swarm : Math.min(1, tau * 7)

      // ---- the cover-up: down to its line, along it, and left lying over it
      const k = line[i]
      if (k >= 0 && k < f.lines.length && sim.wipe > 0) {
        const ln = f.lines[k]
        const a0 = wipeStart(k)
        const restX = ln.x0 + lie[i] * (ln.x1 - ln.x0)
        const restY = ln.y + lift[i] * 0.3
        if (calm) {
          // no travel: it goes out by the block and comes up on the line
          const w = clamp((sim.wipe - a0) / WIPE.run)
          if (w > 0.5) {
            x = restX
            y = restY
          }
          al *= Math.abs(w * 2 - 1)
        } else {
          const down = smooth(clamp((sim.wipe - (a0 - WIPE.lead)) / WIPE.lead))
          const run = clamp((sim.wipe - a0) / WIPE.run)
          const front = ln.x0 + (ln.x1 - ln.x0) * run
          // the front of the wipe is a clump; behind it the agents are dropped one by one
          const lx = Math.min(front + 0.25 - lag[i] * 1.1, restX)
          const ly = ln.y + lift[i] * (0.3 + 0.3 * (1 - run) * (lx < restX ? 1 : 0.4))
          tx = lx + Math.cos(t * 1.2 + phase[i]) * 0.04
          ty = ly + Math.sin(t * 1.0 + phase[i]) * 0.04
          x += (tx - x) * down
          y += (ty - y) * down
        }
      }

      pos[i * 3] = x - 50
      pos[i * 3 + 1] = 28.125 - y
      pos[i * 3 + 2] = 0
      alpha[i] = al * 0.92
    }
    posAttr.needsUpdate = true
    alphaAttr.needsUpdate = true
  })

  return {
    sim,
    layout(next) {
      field = next
      // the agents that go down to the log: the ones standing nearest to it (below the block),
      // dealt out to its lines in turn
      line.fill(-1)
      const order = Array.from({ length: N }, (_, i) => i).sort((p, q) => Math.sin(ang[q]) - Math.sin(ang[p]))
      const take = Math.min(N, PER_LINE * next.lines.length)
      for (let j = 0; j < take; j++) line[order[j]] = j % next.lines.length
      points.visible = true
    },
  }
}
