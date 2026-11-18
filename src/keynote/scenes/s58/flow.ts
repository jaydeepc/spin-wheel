'use client'

/**
 * Slide 58 · the flow and the rack, in three.js, on one canvas above the scene's DOM.
 *
 * THE FLOW is one stream that divides. A band as thick as STREAM leaves "Every AI request" and
 * enters "Smart routing"; on the other side it comes out as two ribbons whose thicknesses are 36
 * and 64 of that band, and each widens until it ends flush against the straight edge of its
 * lane. Requests run inside the ribbons as short dashes. Nothing here is a number the deck does
 * not print: the proportions are its 36% / 64%.
 *
 * THE RACK is what is under the hood: a small schematic server (navy chassis, four white sleds)
 * standing in the GPU lane. Its sleds push home and their lights come on as the 64% arrives.
 *
 * Everything is drawn from plain numbers in `state`, which the timeline tweens: every frame is
 * reachable by seeking. Only the dashes' drift along the ribbons is an idle clock.
 */
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { FRONTIER, LANE_R, LANE_X, RACK_TALL, RACK_W, REQ, ROU, row, STREAM } from './data'

export interface Flow {
  gl: SceneCanvas
  state: {
    /** 1 the tall row (route, why) … 0 the compact row (inside, gains) */
    tall: number
    /** how far the stream has got from the request card to the router, 0 … 1 */
    a: number
    /** how far the two ribbons have got from the router to the lanes, 0 … 1 */
    b: number
    /** the rack has arrived, 0 … 1 (may overshoot a little) */
    rack: number
    /** each sled pushed home, 0 … 1 */
    seat: { s0: number; s1: number; s2: number; s3: number }
    /** each sled's lights on, 0 … 1 */
    lit: { s0: number; s1: number; s2: number; s3: number }
  }
  dispose(): void
}

const SEGS = 40
export const KEYS = ['s0', 's1', 's2', 's3'] as const
const smooth = (k: number) => k * k * (3 - 2 * k)
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

/** a band between two x, whose top and bottom edges ease from one pair of heights to another */
interface Band {
  x0: number
  x1: number
  /** top and bottom at x0, top and bottom at x1 (stage units, y down) */
  ends: [number, number, number, number]
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
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide }))
  mesh.frustumCulled = false
  return { mesh, pos, geo }
}

export function makeFlow(ctx: SceneCtx): Flow {
  const gl = createSceneCanvas(ctx, { above: true })
  const state: Flow['state'] = { tall: 1, a: 0, b: 0, rack: 0, seat: { s0: 0, s1: 0, s2: 0, s3: 0 }, lit: { s0: 0, s1: 0, s2: 0, s3: 0 } }
  const O = gl.at(0, 0)
  const wx = (u: number) => O.x + u
  const wy = (v: number) => O.y - v

  /* ------------------------------------------------------------- the ribbons */
  const rA = ribbon('#8fa2cb', 0.3, 0.5)
  const rF = ribbon('#f7bfab', 0.55, 0.95)
  const rG = ribbon('#f16443', 0.5, 1)
  gl.scene.add(rA.mesh, rF.mesh, rG.mesh)

  const bands = (tall: number): [Band, Band, Band] => {
    const r = row(tall)
    const t0 = r.mid - STREAM / 2
    const cut = t0 + (STREAM * FRONTIER.share) / 100
    return [
      { x0: REQ[1], x1: ROU[0], ends: [t0, t0 + STREAM, t0, t0 + STREAM] },
      { x0: ROU[1], x1: LANE_X + 0.12, ends: [t0, cut, r.fTop + LANE_R, r.fTop + r.fH - LANE_R] },
      { x0: ROU[1], x1: LANE_X + 0.12, ends: [cut, t0 + STREAM, r.gTop + LANE_R, r.gTop + r.gH - LANE_R] },
    ]
  }
  const edge = (b: Band, k: number, v: number) => {
    const e = smooth(k)
    const top = b.ends[0] + (b.ends[2] - b.ends[0]) * e
    const bot = b.ends[1] + (b.ends[3] - b.ends[1]) * e
    return top + (bot - top) * v
  }
  const lay = (rb: ReturnType<typeof ribbon>, b: Band, front: number) => {
    for (let j = 0; j <= SEGS; j++) {
      const k = (j / SEGS) * front
      const x = wx(b.x0 + (b.x1 - b.x0) * k)
      rb.pos.set([x, wy(edge(b, k, 0)), 0, x, wy(edge(b, k, 1)), 0], j * 6)
    }
    rb.geo.attributes.position.needsUpdate = true
    rb.mesh.visible = front > 0.001
  }

  /* -------------------------------------------------------------- the dashes */
  // orderly files of dashes, not confetti: each ribbon carries rows in proportion to its share
  const rand = rng(58)
  const ROWS = [5, 3, 5]
  const PER = [4, 7, 7]
  const parts: { seg: number; phase: number; v: number; size: number }[] = []
  ROWS.forEach((rows, seg) => {
    for (let r = 0; r < rows; r++) {
      const shift = rand()
      for (let i = 0; i < PER[seg]; i++) parts.push({ seg, phase: (i + shift + (rand() - 0.5) * 0.25) / PER[seg], v: (r + 0.5) / rows, size: 0.85 + rand() * 0.3 })
    }
  })
  const dash = new THREE.InstancedMesh(new THREE.CircleGeometry(0.5, 14), new THREE.MeshBasicMaterial({ color: '#ffffff' }), parts.length)
  dash.frustumCulled = false
  dash.renderOrder = 2
  const tones = [new THREE.Color('#5b6fa6'), new THREE.Color('#12307f'), new THREE.Color('#ffffff')]
  parts.forEach((p, i) => dash.setColorAt(i, tones[p.seg]))
  gl.scene.add(dash)

  /* ---------------------------------------------------------------- the rack */
  const rack = new THREE.Group()
  const turn = new THREE.Group()
  turn.rotation.set(0.16, 0.6, 0)
  rack.add(turn)
  gl.scene.add(rack)
  const navy = new THREE.MeshStandardMaterial({ color: '#0c2468', roughness: 0.55, metalness: 0.15 })
  const deep = new THREE.MeshStandardMaterial({ color: '#081a52', roughness: 0.7 })
  const white = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.45 })
  const grille = new THREE.MeshStandardMaterial({ color: '#c3cee6', roughness: 0.8 })
  const RW = 3.9
  const RH = 7.6
  const RD = 3.2
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(RW, RH, RD), navy)
  turn.add(chassis)
  const foot = new THREE.Mesh(new THREE.BoxGeometry(RW + 0.3, 0.22, RD + 0.3), deep)
  foot.position.y = -RH / 2 - 0.11
  turn.add(foot)
  const sledGeo = new THREE.BoxGeometry(RW - 0.5, 1.5, 0.3)
  const bodyGeo = new THREE.BoxGeometry(RW - 0.7, 1.3, 2.2)
  const grilleGeo = new THREE.BoxGeometry(1.5, 0.16, 0.06)
  const ledGeo = new THREE.BoxGeometry(0.24, 0.24, 0.08)
  const sleds: THREE.Group[] = []
  const leds: THREE.MeshBasicMaterial[] = []
  for (let i = 0; i < 4; i++) {
    const sled = new THREE.Group()
    sled.position.y = (1.5 - i) * 1.78
    sled.add(new THREE.Mesh(sledGeo, white))
    const body = new THREE.Mesh(bodyGeo, deep)
    body.position.z = -1.2
    sled.add(body)
    for (let g = 0; g < 3; g++) {
      const bar = new THREE.Mesh(grilleGeo, grille)
      bar.position.set(-0.75, (g - 1) * 0.36, 0.16)
      sled.add(bar)
    }
    const led = new THREE.MeshBasicMaterial({ color: '#c3cee6' })
    for (let l = 0; l < 3; l++) {
      const m = new THREE.Mesh(ledGeo, led)
      m.position.set(0.55 + l * 0.42, 0, 0.17)
      sled.add(m)
    }
    leds.push(led)
    sleds.push(sled)
    turn.add(sled)
  }
  const ledOff = new THREE.Color('#c3cee6')
  const ledOn = new THREE.Color('#2f7dff')

  /* -------------------------------------------------------------- each frame */
  const m4 = new THREE.Matrix4()
  const p3 = new THREE.Vector3()
  const s3 = new THREE.Vector3()
  const q = new THREE.Quaternion()
  const zAxis = new THREE.Vector3(0, 0, 1)

  gl.onFrame((time) => {
    const t = ctx.held || ctx.reduced ? 0 : time
    const B = bands(state.tall)
    lay(rA, B[0], state.a)
    lay(rF, B[1], state.b)
    lay(rG, B[2], state.b)

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i]
      const b = B[p.seg]
      const front = p.seg === 0 ? state.a : state.b
      const k = (p.phase + t * (p.seg === 0 ? 0.16 : 0.13)) % 1
      const span = b.x1 - b.x0
      const y = edge(b, k, p.v)
      const slope = (edge(b, Math.min(1, k + 0.02), p.v) - edge(b, Math.max(0, k - 0.02), p.v)) / (span * (Math.min(1, k + 0.02) - Math.max(0, k - 0.02)))
      const env = Math.max(0, Math.min(1, k / 0.07, (1 - k) / 0.07, (front - k) / 0.05))
      p3.set(wx(b.x0 + span * k), wy(y), 0.02)
      q.setFromAxisAngle(zAxis, -Math.atan(slope))
      s3.set(1.0 * p.size * env, 0.25 * env, 1)
      dash.setMatrixAt(i, m4.compose(p3, q, s3))
    }
    dash.instanceMatrix.needsUpdate = true

    // the rack stands in its place at the left of the GPU lane
    const r = row(state.tall)
    const size = 1 + (RACK_TALL - 1) * state.tall
    rack.position.set(wx(LANE_X + 1.5 + (RACK_W * size) / 2), wy(r.gTop + r.gH / 2) + 0.1 * size, 0)
    rack.scale.setScalar(Math.max(0.0001, size * state.rack))
    rack.visible = state.rack > 0.001
    for (let i = 0; i < 4; i++) {
      sleds[i].position.z = RD / 2 + 0.1 + (1 - state.seat[KEYS[i]]) * 1.5
      leds[i].color.copy(ledOff).lerp(ledOn, state.lit[KEYS[i]])
    }
  })

  return { gl, state, dispose: gl.dispose }
}
