'use client'

/**
 * Slide 56 · the engine: a chip of three layers seen from above and to one side, the beaded
 * orbit around it, and the streams that run in along the six connectors. Everything here is
 * driven by the plain numbers of `state` (the timeline tweens them) plus a slow idle clock.
 */
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { CX, CY, LINKS, ORBIT } from './data'

export interface Layer {
  group: THREE.Group
  mats: THREE.Material[]
  /** z when seated */
  rest: number
  /** 0 seated … 1 lifted off (the exploded view) */
  lift: number
  /** 0 … 1 */
  show: number
}

export interface Engine {
  gl: SceneCanvas
  layers: Layer[]
  state: {
    /** the beads of the orbit: 0 none … 1 all there */
    orbit: number
    /** how much the engine idles (float, turn of the orbit): 0 … 1 */
    idle: number
    /** the die's light: 0 … 1 */
    power: number
    /** the finale: one bright stream that goes once round the whole orbit, 0 … 1 */
    lap: number
    /** per link: its sector of the orbit is flame, 0 … 1 */
    lit: number[]
    /** per link: how far the stream has run from the card to the orbit, 0 … 1 */
    front: number[]
  }
  dispose(): void
}

const NAVY = '#0c2466'
const FLAME = '#f16443'
const BEADS = 60
const PER_LINK = 3

function slab(size: number, thick: number, radius: number): THREE.ExtrudeGeometry {
  const h = size / 2
  const s = new THREE.Shape()
  s.moveTo(-h + radius, -h)
  s.lineTo(h - radius, -h)
  s.quadraticCurveTo(h, -h, h, -h + radius)
  s.lineTo(h, h - radius)
  s.quadraticCurveTo(h, h, h - radius, h)
  s.lineTo(-h + radius, h)
  s.quadraticCurveTo(-h, h, -h, h - radius)
  s.lineTo(-h, -h + radius)
  s.quadraticCurveTo(-h, -h, -h + radius, -h)
  const bevel = Math.min(0.06, thick / 4)
  const g = new THREE.ExtrudeGeometry(s, { depth: thick - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 10 })
  g.translate(0, 0, bevel)
  return g
}

export function makeEngine(ctx: SceneCtx): Engine {
  const gl = createSceneCanvas(ctx, { above: true, fov: 30 })
  const state = { orbit: 0, idle: 0, power: 0, lap: 0, lit: [0, 0, 0, 0, 0, 0], front: [0, 0, 0, 0, 0, 0] }

  /* ------------------------------------------------------------ the chip */
  const tilt = new THREE.Group()
  tilt.position.copy(gl.at(CX, CY - 3.9, 0))
  tilt.rotation.set(-0.9, 0, Math.PI / 4)
  tilt.scale.setScalar(1.5)
  gl.scene.add(tilt)
  const float = new THREE.Group()
  tilt.add(float)

  const mat = (color: string, o: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.1, transparent: true, ...o })
  const layers: Layer[] = []
  const layer = (rest: number, mats: THREE.Material[], ...objects: THREE.Object3D[]): Layer => {
    const group = new THREE.Group()
    group.position.z = rest
    for (const o of objects) group.add(o)
    float.add(group)
    const l = { group, mats, rest, lift: 0, show: 1 }
    layers.push(l)
    return l
  }

  // 1 the board: navy, its pins, its traces
  const S = 5.8
  const boardMat = mat(NAVY, { roughness: 0.34, metalness: 0.25 })
  const pinMat = mat('#f4dccf', { roughness: 0.3, metalness: 0.15 })
  const traceMat = new THREE.MeshBasicMaterial({ color: '#5f7fd0', transparent: true })
  const board = new THREE.Mesh(slab(S, 0.42, 0.5), boardMat)
  const pins = new THREE.InstancedMesh(new THREE.BoxGeometry(0.3, 0.62, 0.16), pinMat, 32)
  const traces = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.72, 0.02), traceMat, 32)
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const one = new THREE.Vector3(1, 1, 1)
  let n = 0
  for (let side = 0; side < 4; side++) {
    q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), (side * Math.PI) / 2)
    for (let i = 0; i < 8; i++) {
      const along = (i - 3.5) * 0.56
      const p = new THREE.Vector3(along, S / 2 + 0.2, 0.14).applyQuaternion(q)
      pins.setMatrixAt(n, m4.compose(p, q, one))
      const tp = new THREE.Vector3(along, S / 2 - 0.5, 0.43).applyQuaternion(q)
      traces.setMatrixAt(n, m4.compose(tp, q, one))
      n++
    }
  }
  layer(0, [boardMat, pinMat, traceMat], board, pins, traces)

  // 2 the carrier: white ceramic
  const carrierMat = mat('#ffffff', { roughness: 0.5 })
  const rimMat = mat('#dfe7f6', { roughness: 0.5 })
  const carrier = new THREE.Mesh(slab(4.0, 0.3, 0.34), carrierMat)
  const rim = new THREE.Mesh(slab(4.24, 0.12, 0.4), rimMat)
  layer(0.42, [carrierMat, rimMat], rim, carrier)

  // 3 the die: flame, lit from inside, with the deck's chip mark on it
  const dieMat = mat(FLAME, { roughness: 0.3, emissive: new THREE.Color('#ed4224'), emissiveIntensity: 0.2 })
  const markMat = new THREE.MeshBasicMaterial({ color: '#fff3ee', transparent: true })
  const die = new THREE.Mesh(slab(2.7, 0.36, 0.3), dieMat)
  const mark = new THREE.Group()
  const bar = (w: number, h: number, x: number, y: number) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), markMat)
    b.position.set(x, y, 0.375)
    mark.add(b)
  }
  bar(1.3, 0.11, 0, 0.6)
  bar(1.3, 0.11, 0, -0.6)
  bar(0.11, 1.3, 0.6, 0)
  bar(0.11, 1.3, -0.6, 0)
  bar(0.46, 0.46, 0, 0)
  layer(0.72, [dieMat, markMat], die, mark)

  /* ----------------------------------------------------------- the orbit */
  const beadMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true })
  const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.17, 12, 10), beadMat, BEADS)
  beads.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(BEADS * 3), 3)
  gl.scene.add(beads)
  const centre = gl.at(CX, CY, 0)
  const cold = new THREE.Color('#b9c6e0')
  const hot = new THREE.Color(FLAME)
  const glow = new THREE.Color('#ffd9c9')
  const col = new THREE.Color()
  const angles = LINKS.map((l) => l.angle)
  const near = (a: number) => {
    let best = 0
    let d = 9
    angles.forEach((b, k) => {
      const x = Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)))
      if (x < d) {
        d = x
        best = k
      }
    })
    return best
  }

  /* --------------------------------------------------------- the streams */
  const curves = LINKS.map((l) => {
    const [a, b, c, d, f] = [l.start, l.in, l.corner, l.out, l.end].map(([u, v]) => gl.at(u, v, 0.2))
    const path = new THREE.CurvePath<THREE.Vector3>()
    path.add(new THREE.LineCurve3(a, b))
    path.add(new THREE.QuadraticBezierCurve3(b, c, d))
    path.add(new THREE.LineCurve3(d, f))
    return path
  })
  const pulseMat = new THREE.MeshBasicMaterial({ color: FLAME, transparent: true })
  const pulses = new THREE.InstancedMesh(new THREE.SphereGeometry(0.2, 12, 10), pulseMat, LINKS.length * PER_LINK)
  gl.scene.add(pulses)
  const v = new THREE.Vector3()
  const sc = new THREE.Vector3()
  const noRot = new THREE.Quaternion()

  gl.onFrame((time) => {
    const t = ctx.held || ctx.reduced ? 0 : time
    // the chip
    for (const l of layers) {
      l.group.position.z = l.rest + l.lift
      l.group.visible = l.show > 0.004
      for (const m of l.mats) m.opacity = l.show
    }
    float.position.z = Math.sin(t * 0.9) * 0.14 * state.idle
    tilt.rotation.z = Math.PI / 4 + Math.sin(t * 0.33) * 0.07 * state.idle
    dieMat.emissiveIntensity = 0.18 + state.power * (0.95 + Math.sin(t * 1.7) * 0.12) + state.lap * 0.5
    // the orbit: the beads walk round; a bead is flame while it is in a lit sector
    const turn = t * 0.045 * state.idle
    for (let i = 0; i < BEADS; i++) {
      const a = (i / BEADS) * Math.PI * 2 + turn
      const k = near(a)
      const s = Math.max(0, Math.min(1, state.orbit * 1.6 - (i / BEADS) * 0.6))
      // the finale's stream: a head that has gone `lap` of the way round from the top, with a tail behind it
      const round = (((Math.PI / 2 - a) / (Math.PI * 2)) % 1 + 1) % 1
      const behind = state.lap * 1.25 - round
      const head = state.lap > 0 && state.lap < 1 ? Math.max(0, 1 - Math.abs(behind - 0.06) / (behind > 0.06 ? 0.2 : 0.05)) : 0
      const big = 1 + state.lit[k] * (0.22 + state.lap * 0.16) + head * 0.75
      v.set(centre.x + Math.cos(a) * ORBIT, centre.y + Math.sin(a) * ORBIT, 0)
      sc.setScalar(s * big)
      beads.setMatrixAt(i, m4.compose(v, noRot, sc))
      col.copy(cold).lerp(hot, state.lit[k]).lerp(glow, head * 0.7)
      beads.setColorAt(i, col)
    }
    beads.instanceMatrix.needsUpdate = true
    if (beads.instanceColor) beads.instanceColor.needsUpdate = true
    // the streams: three drops on every connector, never past the head of the stream
    let j = 0
    for (let k = 0; k < LINKS.length; k++) {
      for (let i = 0; i < PER_LINK; i++) {
        const s = (i / PER_LINK + 0.17 + k * 0.11 + t * 0.3) % 1
        const on = s <= state.front[k] ? 1 : 0
        const env = Math.sin(Math.PI * s) ** 0.6
        curves[k].getPoint(s, v)
        sc.setScalar(on * env)
        pulses.setMatrixAt(j++, m4.compose(v, noRot, sc))
      }
    }
    pulses.instanceMatrix.needsUpdate = true
  })

  return { gl, layers, state, dispose: gl.dispose }
}
