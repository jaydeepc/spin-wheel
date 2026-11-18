'use client'

/**
 * Slide 58 · everything that MOVES by itself, in three.js, on one canvas above the scene's DOM.
 *
 * THE TOKENS. Requests arrive from the left as a loose scatter of small grey tokens and gather
 * into "Every AI request". They leave it as one orderly band, enter "Smart routing", and come out
 * SORTED: blue tokens on a thin ribbon up to the Frontier band, flame tokens on a thicker ribbon
 * down to the in-house band. The ribbons' thicknesses are 36 and 64 of the band, and so are the
 * numbers of tokens on them (10 : 18). Nothing here is a number the slide does not print.
 *
 * THE FORK. From the in-house band tokens run down a fine line to its two homes.
 * THE RACK is the on-prem home: a small schematic server (navy chassis, four white units). Its
 * units push home, their lights come on, and each unit's training bar fills again and again.
 * THE SERVING LANE is the cloud's: streaks leave the cloud fast, along the foot of its panel.
 *
 * Everything is drawn from plain numbers in `state`, which the timeline tweens: every frame is
 * reachable by seeking. Only the drift of the tokens and the training bars is an idle clock, and
 * it stands still when the frame is held.
 */
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { F_TOP, FORK_LEFT, FORK_RIGHT, FRONTIER, G_TOP, LANE_H, LANE_X, MID, RACK_AT, REQ, ROU, SERVE_LANE, STREAM, TALL_DY } from './data'

export const KEYS = ['s0', 's1', 's2', 's3'] as const
type Four = Record<(typeof KEYS)[number], number>

export interface Flow {
  gl: SceneCanvas
  state: {
    /** how far below its final place the routing row stands, in --u */
    dy: number
    /** the scatter of requests has reached the first card, 0 … 1 */
    l: number
    /** the band has got from the request card to the router, 0 … 1 */
    a: number
    /** the two ribbons have got from the router to the bands, 0 … 1 */
    b: number
    /** the fork has got from the in-house band down to the two panels, 0 … 1 */
    d: number
    /** the rack has arrived, 0 … 1 (may overshoot a little) */
    rack: number
    /** each unit pushed home, each unit's lights on, 0 … 1 */
    seat: Four
    lit: Four
    /** the training pulse: a ring that opens once around the rack, 0 … 1 */
    pulse: number
    /** the cloud is serving: how far the streaks have got along their lane, 0 … 1 */
    s: number
  }
  dispose(): void
}

const SEGS = 36
const smooth = (k: number) => k * k * (3 - 2 * k)
const mix = (a: number, b: number, k: number) => a + (b - a) * k
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

function ribbon(rgb: string, alpha0: number, alpha1: number) {
  const geo = new THREE.BufferGeometry()
  const pos = new Float32Array((SEGS + 1) * 2 * 3)
  const col = new Float32Array((SEGS + 1) * 2 * 4)
  const c = new THREE.Color(rgb)
  for (let j = 0; j <= SEGS; j++) {
    const al = alpha0 + (alpha1 - alpha0) * (j / SEGS)
    for (let e = 0; e < 2; e++) col.set([c.r, c.g, c.b, al], (j * 2 + e) * 4)
  }
  const idx: number[] = []
  for (let j = 0; j < SEGS; j++) idx.push(j * 2, j * 2 + 1, j * 2 + 2, j * 2 + 1, j * 2 + 3, j * 2 + 2)
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(col, 4))
  geo.setIndex(idx)
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide }))
  mesh.frustumCulled = false
  return { mesh, pos, geo }
}

/** a square with rounded corners, one unit across: a token */
function tokenGeometry() {
  const r = 0.28
  const h = 0.5
  const s = new THREE.Shape()
  s.moveTo(-h + r, -h)
  s.lineTo(h - r, -h)
  s.quadraticCurveTo(h, -h, h, -h + r)
  s.lineTo(h, h - r)
  s.quadraticCurveTo(h, h, h - r, h)
  s.lineTo(-h + r, h)
  s.quadraticCurveTo(-h, h, -h, h - r)
  s.lineTo(-h, -h + r)
  s.quadraticCurveTo(-h, -h, -h + r, -h)
  return new THREE.ShapeGeometry(s, 5)
}

/** the centre lines and thicknesses of the two ribbons, at the router and at the bands */
const T_F = (STREAM * FRONTIER.share) / 100
const T_G = STREAM - T_F
const F_FROM = MID - STREAM / 2 + T_F / 2
const G_FROM = MID + STREAM / 2 - T_G / 2
const F_TO = F_TOP + LANE_H / 2
const G_TO = G_TOP + LANE_H / 2

interface Seg {
  /** length in --u (for the fades at its ends and for an even speed) */
  len: number
  /** --u per second */
  speed: number
  /** the point at k along it, v across it (both 0 … 1), in stage units; and the slope there */
  at(k: number, v: number): { x: number; y: number; angle: number }
  /** which number of the state is its front */
  front: 'l' | 'a' | 'b' | 'd' | 's'
  /** does it move with the row */
  row: boolean
  tone: string
  /** the token: its length and its thickness in --u */
  size: [number, number]
}

const curve = (x0: number, x1: number, y0: number, y1: number, thick: number) => (k: number, v: number) => {
  const span = x1 - x0
  const y = mix(y0, y1, smooth(k)) + (v - 0.5) * thick
  const slope = ((y1 - y0) * 6 * k * (1 - k)) / span
  return { x: x0 + span * k, y, angle: Math.atan(slope) }
}

const SEG: Seg[] = [
  // 0 · the scatter gathers into the first card
  {
    len: REQ[0] + 2,
    speed: 2.1,
    front: 'l',
    row: true,
    tone: '#7183b4',
    size: [0.46, 0.46],
    at(k) {
      const x0 = -1.6
      return { x: x0 + (REQ[0] + 0.5 - x0) * k, y: MID, angle: 0 }
    },
  },
  // 1 · one band, from the request to the router
  { len: ROU[0] - REQ[1], speed: 1.25, front: 'a', row: true, tone: '#5d70a6', size: [0.5, 0.42], at: curve(REQ[1] - 0.4, ROU[0] + 0.4, MID, MID, STREAM * 0.86) },
  // 2 · sorted: the Frontier ribbon
  { len: LANE_X - ROU[1], speed: 1.25, front: 'b', row: true, tone: '#3a7bd5', size: [0.5, 0.42], at: curve(ROU[1] - 0.4, LANE_X + 0.4, F_FROM, F_TO, T_F * 0.62) },
  // 3 · sorted: the in-house ribbon
  { len: LANE_X - ROU[1], speed: 1.25, front: 'b', row: true, tone: '#ec5a35', size: [0.5, 0.42], at: curve(ROU[1] - 0.4, LANE_X + 0.4, G_FROM, G_TO, T_G * 0.78) },
  // 4, 5 · down the fork to the two homes
  { len: FORK_LEFT.length, speed: 5.2, front: 'd', row: false, tone: '#ec5a35', size: [0.62, 0.36], at: (k) => FORK_LEFT.at(k) },
  { len: FORK_RIGHT.length, speed: 1.3, front: 'd', row: false, tone: '#ec5a35', size: [0.5, 0.36], at: (k) => FORK_RIGHT.at(k) },
  // 6 · served out of the cloud, fast
  {
    len: SERVE_LANE[1] - SERVE_LANE[0],
    speed: 15,
    front: 's',
    row: false,
    tone: '#ec5a35',
    size: [1.9, 0.2],
    at: (k, v) => ({ x: mix(SERVE_LANE[0], SERVE_LANE[1], k), y: SERVE_LANE[2] + (v - 0.5) * 0.4, angle: 0 }),
  },
]
/** tokens per segment: [rows across, tokens along]. 2 x 5 and 3 x 6 are 36 : 64. */
const COUNT: [number, number][] = [
  [1, 44],
  [5, 4],
  [2, 5],
  [3, 6],
  [1, 10],
  [1, 1],
  [3, 3],
]

export function makeFlow(ctx: SceneCtx): Flow {
  const gl = createSceneCanvas(ctx, { above: true })
  const state: Flow['state'] = {
    dy: TALL_DY,
    l: 0,
    a: 0,
    b: 0,
    d: 0,
    rack: 0,
    seat: { s0: 0, s1: 0, s2: 0, s3: 0 },
    lit: { s0: 0, s1: 0, s2: 0, s3: 0 },
    pulse: 0,
    s: 0,
  }
  const O = gl.at(0, 0)
  const wx = (u: number) => O.x + u
  const wy = (v: number) => O.y - v

  /* ------------------------------------------------------------- the ribbons */
  const rA = ribbon('#8fa2cb', 0.16, 0.3)
  const rF = ribbon('#8fbaf2', 0.3, 0.62)
  const rG = ribbon('#f8a88f', 0.34, 0.72)
  gl.scene.add(rA.mesh, rF.mesh, rG.mesh)
  const lay = (rb: ReturnType<typeof ribbon>, seg: Seg, thick: number, front: number) => {
    for (let j = 0; j <= SEGS; j++) {
      const k = (j / SEGS) * front
      const c = seg.at(k, 0.5)
      rb.pos.set([wx(c.x), wy(c.y - thick / 2 + state.dy), 0, wx(c.x), wy(c.y + thick / 2 + state.dy), 0], j * 6)
    }
    rb.geo.attributes.position.needsUpdate = true
    rb.mesh.visible = front > 0.001
  }

  /* -------------------------------------------------------------- the tokens */
  const rand = rng(58)
  const parts: { seg: number; phase: number; v: number; size: number }[] = []
  COUNT.forEach(([rows, along], seg) => {
    for (let r = 0; r < rows; r++) {
      const shift = rand()
      for (let i = 0; i < along; i++) {
        // the scatter is loose; everything after it runs in files
        const loose = seg === 0 || seg === 6
        parts.push({
          seg,
          phase: (i + shift + (rand() - 0.5) * (loose ? 0.9 : 0.22)) / along,
          v: loose ? rand() : (r + 0.5) / rows,
          size: seg === 6 ? 0.55 + rand() * 0.9 : 0.86 + rand() * 0.28,
        })
      }
    }
  })
  const tokens = new THREE.InstancedMesh(tokenGeometry(), new THREE.MeshBasicMaterial({ color: '#ffffff', depthTest: false }), parts.length)
  tokens.frustumCulled = false
  tokens.renderOrder = 2
  const tones = SEG.map((s) => new THREE.Color(s.tone))
  parts.forEach((p, i) => tokens.setColorAt(i, tones[p.seg]))
  gl.scene.add(tokens)

  /* ---------------------------------------------------------------- the rack */
  const rack = new THREE.Group()
  const turn = new THREE.Group()
  turn.rotation.set(0.15, 0.56, 0)
  rack.add(turn)
  gl.scene.add(rack)
  const navy = new THREE.MeshStandardMaterial({ color: '#0c2468', roughness: 0.55, metalness: 0.15 })
  const deep = new THREE.MeshStandardMaterial({ color: '#081a52', roughness: 0.7 })
  const white = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.45 })
  const track = new THREE.MeshBasicMaterial({ color: '#d5dcec' })
  const RW = 3.9
  const RH = 7.6
  const RD = 3.2
  turn.add(new THREE.Mesh(new THREE.BoxGeometry(RW, RH, RD), navy))
  const foot = new THREE.Mesh(new THREE.BoxGeometry(RW + 0.3, 0.22, RD + 0.3), deep)
  foot.position.y = -RH / 2 - 0.11
  turn.add(foot)
  const sledGeo = new THREE.BoxGeometry(RW - 0.5, 1.5, 0.3)
  const bodyGeo = new THREE.BoxGeometry(RW - 0.7, 1.3, 2.2)
  const TRACK_W = 1.7
  const trackGeo = new THREE.BoxGeometry(TRACK_W, 0.3, 0.05)
  const barGeo = new THREE.BoxGeometry(TRACK_W, 0.3, 0.07)
  const ledGeo = new THREE.BoxGeometry(0.26, 0.26, 0.08)
  const sleds: THREE.Group[] = []
  const leds: THREE.MeshBasicMaterial[] = []
  const bars: THREE.Mesh[] = []
  const barMat = new THREE.MeshBasicMaterial({ color: '#f16443' })
  for (let i = 0; i < 4; i++) {
    const sled = new THREE.Group()
    sled.position.y = (1.5 - i) * 1.78
    sled.add(new THREE.Mesh(sledGeo, white))
    const body = new THREE.Mesh(bodyGeo, deep)
    body.position.z = -1.2
    sled.add(body)
    const tr = new THREE.Mesh(trackGeo, track)
    tr.position.set(-0.62, 0, 0.16)
    sled.add(tr)
    // the training bar grows from the track's left end
    const bar = new THREE.Mesh(barGeo, barMat)
    bar.position.set(-0.62, 0, 0.17)
    sled.add(bar)
    bars.push(bar)
    const led = new THREE.MeshBasicMaterial({ color: '#c3cee6' })
    for (let l = 0; l < 2; l++) {
      const m = new THREE.Mesh(ledGeo, led)
      m.position.set(0.72 + l * 0.46, 0, 0.17)
      sled.add(m)
    }
    leds.push(led)
    sleds.push(sled)
    turn.add(sled)
  }
  const ledOff = new THREE.Color('#c3cee6')
  const ledOn = new THREE.Color('#2f7dff')
  const RACK_SCALE = 0.86

  // the training pulse: a ring that opens once around the rack
  const ringMat = new THREE.MeshBasicMaterial({ color: '#f16443', transparent: true, opacity: 0, depthTest: false, depthWrite: false })
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.93, 1, 72), ringMat)
  ring.position.set(wx(RACK_AT[0]), wy(RACK_AT[1]), 0)
  ring.renderOrder = 1
  gl.scene.add(ring)

  /* -------------------------------------------------------------- each frame */
  const m4 = new THREE.Matrix4()
  const p3 = new THREE.Vector3()
  const s3 = new THREE.Vector3()
  const q = new THREE.Quaternion()
  const zAxis = new THREE.Vector3(0, 0, 1)

  gl.onFrame((time) => {
    const t = ctx.held || ctx.reduced ? 0 : time
    lay(rA, SEG[1], STREAM, state.a)
    lay(rF, SEG[2], T_F, state.b)
    lay(rG, SEG[3], T_G, state.b)

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      const seg = SEG[p.seg]
      const front = state[seg.front]
      const k = (p.phase + (t * seg.speed) / seg.len) % 1
      const c = seg.at(k, p.v)
      // a token grows out of the edge it leaves and shrinks into the one it enters; nothing runs ahead of the front
      const edge = Math.min(0.45, 0.9 / seg.len)
      const env = clamp01(Math.min(k / edge, (1 - k) / edge, (front - k) / 0.06))
      // the scatter is wide while the row has the stage to itself, and narrower once the panels stand under it
      const off = p.seg === 0 ? (p.v - 0.5) * mix(10.5 + state.dy * 1.3, STREAM * 0.8, smooth(k)) : 0
      p3.set(wx(c.x), wy(c.y + off + (seg.row ? state.dy : 0)), 0.02)
      q.setFromAxisAngle(zAxis, -c.angle)
      s3.set(seg.size[0] * p.size * env, seg.size[1] * (p.seg === 6 ? 1 : p.size) * env, 1)
      tokens.setMatrixAt(i, m4.compose(p3, q, s3))
    }
    tokens.instanceMatrix.needsUpdate = true

    rack.position.set(wx(RACK_AT[0]), wy(RACK_AT[1]) + 0.1, 0)
    rack.scale.setScalar(Math.max(0.0001, RACK_SCALE * state.rack))
    rack.visible = state.rack > 0.001
    for (let i = 0; i < 4; i++) {
      const lit = state.lit[KEYS[i]]
      sleds[i].position.z = RD / 2 + 0.1 + (1 - state.seat[KEYS[i]]) * 1.5
      // the lights breathe a little while it trains
      leds[i].color.copy(ledOff).lerp(ledOn, lit * (0.8 + 0.2 * Math.sin(t * 5 + i * 1.7)))
      // each unit's training bar fills, again and again, out of step with its neighbours
      const fill = Math.max(0.0001, lit * (0.12 + 0.88 * ((0.2 + i * 0.27 + t * (0.3 + i * 0.045)) % 1)))
      bars[i].scale.x = fill
      bars[i].position.x = -0.62 - (TRACK_W * (1 - fill)) / 2
      bars[i].visible = lit > 0.01
    }
    const pz = state.pulse
    ring.scale.setScalar(1.9 + pz * 2.4)
    ringMat.opacity = pz <= 0 || pz >= 1 ? 0 : 0.55 * Math.sin(Math.PI * Math.min(1, pz * 1.6)) * (1 - pz)
    ring.visible = ringMat.opacity > 0.002
  })

  return { gl, state, dispose: gl.dispose }
}
