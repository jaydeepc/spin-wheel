'use client'

/**
 * Slides 42 and 43 · THE TOWN, as a real place: the deck's own map picture on the top of a
 * slab that leans back in perspective, the two routes as ribbons lying on its roads (drawn by
 * a shader, so they reveal themselves along their length and their dashes stay round), the
 * five numbered pins standing on their stops, and a marker that drives.
 *
 * Everything here is driven by plain numbers (`TownState`), which the timeline tweens: so every
 * frame can be held. The DOM (speech pills, tags, the manager's real photograph) is placed over
 * the 3D by `project()`.
 *
 * MAP UNITS: the map is 100 wide and MAP_H high, x right, y down from its upper left corner
 * (routes.ts). z is the height above the ground, in the same units.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { BLUE, DEST, MAP_H, RED_A, RED_B, RED_C, RED_S1, RED_S2, STOPS } from './routes'

/* ------------------------------------------------------------------ paths */

/** A smoothed polyline, sampled at even steps, that can be asked for a point at a distance. */
export class Path {
  readonly xs: number[] = []
  readonly ys: number[] = []
  readonly len: number
  readonly step = 0.1

  constructor(flat: number[]) {
    let pts: [number, number][] = []
    for (let i = 0; i < flat.length; i += 2) pts.push([flat[i], flat[i + 1]])
    // the deck's route is a chain of short strokes: where two of them overlap, the line steps back. Take those out.
    for (let pass = 0; pass < 2; pass++) {
      const keep: [number, number][] = [pts[0]]
      for (let i = 1; i < pts.length - 1; i++) {
        const a = keep[keep.length - 1]
        const b = pts[i]
        const c = pts[i + 1]
        const dot = (b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1])
        const l = Math.hypot(b[0] - a[0], b[1] - a[1]) * Math.hypot(c[0] - b[0], c[1] - b[1])
        if (l > 0 && dot / l < 0.05) continue
        keep.push(b)
      }
      keep.push(pts[pts.length - 1])
      pts = keep
    }
    // round the corners (Chaikin), keeping both ends
    for (let pass = 0; pass < 3; pass++) {
      const out: [number, number][] = [pts[0]]
      for (let i = 0; i < pts.length - 1; i++) {
        const [ax, ay] = pts[i]
        const [bx, by] = pts[i + 1]
        out.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25], [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75])
      }
      out.push(pts[pts.length - 1])
      pts = out
    }
    // even steps
    const cum = [0]
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
    this.len = cum[cum.length - 1]
    const n = Math.ceil(this.len / this.step)
    let j = 0
    for (let i = 0; i <= n; i++) {
      const d = Math.min(i * this.step, this.len)
      while (j < cum.length - 2 && cum[j + 1] < d) j++
      const span = cum[j + 1] - cum[j] || 1
      const f = (d - cum[j]) / span
      this.xs.push(pts[j][0] + (pts[j + 1][0] - pts[j][0]) * f)
      this.ys.push(pts[j][1] + (pts[j + 1][1] - pts[j][1]) * f)
    }
  }

  /** The point at distance d (it runs on straight beyond both ends), and the way the road points there. */
  at(d: number): { x: number; y: number; a: number } {
    const n = this.xs.length - 1
    const f = d / this.step
    const i = Math.min(Math.max(Math.floor(f), 0), n - 1)
    const k = f - i
    const i0 = Math.max(i - 2, 0)
    const i1 = Math.min(i + 3, n)
    return {
      x: this.xs[i] + (this.xs[i + 1] - this.xs[i]) * k,
      y: this.ys[i] + (this.ys[i + 1] - this.ys[i]) * k,
      a: Math.atan2(this.ys[i1] - this.ys[i0], this.xs[i1] - this.xs[i0]),
    }
  }

  /** The distance along the path of the point nearest to (x, y). */
  near(x: number, y: number): number {
    let best = 0
    let bd = Infinity
    for (let i = 0; i < this.xs.length; i++) {
      const d = (this.xs[i] - x) ** 2 + (this.ys[i] - y) ** 2
      if (d < bd) {
        bd = d
        best = i
      }
    }
    return Math.min(best * this.step, this.len)
  }
}

/**
 * The two journeys. RED is driven in this order: A, the spur S1 and back, B, the wrong turn S2
 * and back, C. `d` is the distance driven; the pieces know how much of each is drawn at `d`.
 */
export function makeRoutes() {
  const A = new Path(RED_A)
  const S1 = new Path(RED_S1)
  const B = new Path(RED_B)
  const S2 = new Path(RED_S2)
  const C = new Path(RED_C)
  const blue = new Path(BLUE)
  const oS1 = A.len
  const oB = oS1 + 2 * S1.len
  const oS2 = oB + B.len
  const oC = oS2 + 2 * S2.len
  const total = oC + C.len
  const pieces = [
    { path: A, from: 0 },
    { path: S1, from: oS1 },
    { path: B, from: oB },
    { path: S2, from: oS2 },
    { path: C, from: oC },
  ]
  /** Where the marker is after driving d, and the way it points. */
  const redAt = (d: number) => {
    if (d <= oS1) return A.at(Math.max(d, 0))
    if (d <= oS1 + S1.len) return S1.at(d - oS1)
    if (d <= oB) {
      const p = S1.at(oB - d)
      return { ...p, a: p.a + Math.PI }
    }
    if (d <= oS2) return B.at(d - oB)
    if (d <= oS2 + S2.len) return S2.at(d - oS2)
    if (d <= oC) {
      const p = S2.at(oC - d)
      return { ...p, a: p.a + Math.PI }
    }
    return C.at(Math.min(d - oC, C.len))
  }
  return {
    A,
    S1,
    B,
    S2,
    C,
    blue,
    pieces,
    total,
    redAt,
    /** Distances driven (red) at the places the story stops. */
    red: {
      spur1: oS1 + S1.len,
      back1: oB,
      stop1: oB + B.near(...STOPS[0]),
      loop: oB + B.near(24.2, 21.84),
      stop2: oB + B.near(...STOPS[1]),
      top: oB + B.near(40.5, 3.92),
      stop3: oB + B.near(...STOPS[2]),
      spur2: oS2 + S2.len,
      back2: oC,
      stop4: oC + C.near(...STOPS[3]),
      end: total,
    },
    /** Distances along the blue route. */
    blu: {
      stops: STOPS.map((s) => blue.near(s[0], s[1])),
      end: blue.len,
    },
  }
}
export type Routes = ReturnType<typeof makeRoutes>

/** The numbers the timeline tweens. */
export interface TownState {
  /** red: the distance driven */
  d: number
  /** red: 1 the route as he drove it (red dashes on a white bed) … 0 gone */
  red: number
  /** red: the thin white ghost it leaves behind on slide 43 */
  ghost: number
  /** blue: the distance drawn, and the marker's distance when it follows blue */
  b: number
  /** 0 the marker follows the red journey, 1 the blue route */
  onBlue: number
  /** the marker: 0 away … 1 there */
  mark: number
  /** the marker looks left and right (radians) */
  look: number
  /** the marker's colour: 0 flame red … 1 the clear blue (through white, never through purple) */
  tone: number
  /** the ghost: how far it lies (it stays where the red route was, when the red route is taken back) */
  gd: number
  /** the route Arya has planned: the distance drawn, and how strongly it shows */
  p: number
  plan: number
  /** 1 while the marker rides the red route backwards (it points the way it goes) */
  rev: number
  /** the view follows the marker: 0 not at all … 1 fully (a small turn and a small pan) */
  follow: number
  /** the view pushed in: 0 the whole town … 1 nearest */
  zoom: number
}
export const townState = (): TownState => ({ d: 0, red: 1, ghost: 0, b: 0, onBlue: 0, mark: 0, look: 0, tone: 0, gd: 0, p: 0, plan: 0, rev: 0, follow: 0, zoom: 0 })

/** Where the marker is, in map units, and its heading. */
export function markerAt(R: Routes, st: TownState) {
  return st.onBlue > 0.5 ? R.blue.at(Math.min(st.b, R.blue.len)) : R.redAt(st.d)
}

/* ------------------------------------------------------------------ the 3D town */

/** The town on the stage: the middle of the map (in --u), its width in --u, how far it leans back. */
export const TOWN = { cx: 50, cy: 28.6, width: 92, tilt: 0.66 }
/** A pin: how high its numbered head stands over its stop (map units), and the head's radius. */
export const PIN = { h: 8.8, r: 1.3 }
/** The view that follows the marker: the most it turns (radians), pans (--u) and comes nearer (world units). */
export const VIEW = { yaw: 0.05, pan: 1.3, push: 5.5 }
/** How high the manager's photograph is carried over the puck on the road (map units). */
export const CARRY = 2.4

const C_FLAME = '#f16443'
const C_RED = '#d8452c'
const C_BLUE = '#1f6feb'
const C_NAVY = '#0c2154'

const RIBBON_VERT = /* glsl */ `
  attribute float aS;
  attribute float aT;
  varying float vS;
  varying float vT;
  void main() {
    vS = aS;
    vT = aT;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const RIBBON_FRAG = /* glsl */ `
  uniform float uP;      // how much of the length is drawn
  uniform float uLen;
  uniform float uHalf;   // half the line's width
  uniform float uDash;   // 0: solid; else the dash's length (and the gap's)
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vS;
  varying float vT;
  float capsule(float a, float b) {
    float dx = max(max(a - vS, vS - b), 0.0);
    return length(vec2(dx, vT)) - uHalf;
  }
  void main() {
    float end = min(uP, uLen);
    if (end <= 0.0 || uOpacity <= 0.0) discard;
    float d = capsule(0.0, end);
    if (uDash > 0.0) {
      float per = 2.0 * uDash;
      float k = floor(vS / per);
      float dd = 1e3;
      for (int i = 0; i < 2; i++) {
        float a = (k + float(i)) * per;
        float b = min(a + uDash, end);
        if (a <= end) dd = min(dd, capsule(a, b));
      }
      d = max(d, dd);
    }
    float aa = max(fwidth(d), 1e-4);
    float alpha = (1.0 - smoothstep(-aa, aa, d)) * uOpacity;
    if (alpha <= 0.003) discard;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`

interface Ribbon {
  mesh: THREE.Mesh
  u: { uP: { value: number }; uOpacity: { value: number }; uHalf: { value: number } }
}

export interface Town3D {
  gl: SceneCanvas
  /** The whole town: the timeline leans it back and lets it settle. */
  town: THREE.Group
  /** What holds the town: the view that follows the marker turns and moves this, never the town itself. */
  rig: THREE.Group
  /** The five pins (their groups drop along z) and the six dots on the road (five stops and the destination). */
  pins: THREE.Group[]
  heads: THREE.Group[]
  dots: THREE.Mesh[]
  pinShadows: THREE.Mesh[]
  /** A ring that opens on the road at a stop when the marker gets there (scale and opacity are tweened). */
  rings: THREE.Mesh[]
  sync(st: TownState): void
  /** A point of the town (map units, z above the ground) on the stage, in stage px. */
  project(x: number, y: number, z?: number): { x: number; y: number }
  dispose(): void
}

export function makeTown3D(ctx: SceneCtx, R: Routes, mapUrl: string): Town3D {
  const gl = createSceneCanvas(ctx, { fov: 22, lights: false })
  gl.canvas.classList.add('s42-gl')
  const S = TOWN.width / 100

  const town = new THREE.Group()
  town.position.copy(gl.at(TOWN.cx, TOWN.cy))
  town.rotation.x = -TOWN.tilt
  town.scale.setScalar(S)
  const rig = new THREE.Group()
  rig.add(town)
  gl.scene.add(rig)
  /** Map units to the town's own space: x right, y UP, the middle of the map at the origin. */
  const L = (x: number, y: number, z = 0) => new THREE.Vector3(x - 50, MAP_H / 2 - y, z)

  /* ---- the slab: the map picture on top, a pale edge, a soft shadow on the page ---- */
  const rr = 0.9
  const hw = 50
  const hh = MAP_H / 2
  const shape = new THREE.Shape()
  shape.moveTo(-hw + rr, -hh)
  shape.lineTo(hw - rr, -hh)
  shape.quadraticCurveTo(hw, -hh, hw, -hh + rr)
  shape.lineTo(hw, hh - rr)
  shape.quadraticCurveTo(hw, hh, hw - rr, hh)
  shape.lineTo(-hw + rr, hh)
  shape.quadraticCurveTo(-hw, hh, -hw, hh - rr)
  shape.lineTo(-hw, -hh + rr)
  shape.quadraticCurveTo(-hw, -hh, -hw + rr, -hh)
  const THICK = 1.1
  const slabGeo = new THREE.ExtrudeGeometry(shape, { depth: THICK, bevelEnabled: false, curveSegments: 8 })
  slabGeo.translate(0, 0, -THICK)
  const tex = new THREE.TextureLoader().load(mapUrl, () => gl.render())
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = gl.renderer.capabilities.getMaxAnisotropy()
  tex.repeat.set(1 / 100, 1 / MAP_H)
  tex.offset.set(0.5, 0.5)
  const slab = new THREE.Mesh(slabGeo, [
    new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }),
    new THREE.MeshBasicMaterial({ color: '#d9c7ae', toneMapped: false }),
  ])
  town.add(slab)

  const shCan = document.createElement('canvas')
  shCan.width = 512
  shCan.height = 160
  const sc = shCan.getContext('2d')!
  // the blur is the canvas's own shadow (the rectangle itself is drawn outside the picture)
  sc.shadowColor = 'rgba(7, 26, 80, 1)'
  sc.shadowBlur = 30
  sc.shadowOffsetY = 400
  sc.fillRect(44, 40 - 400, 512 - 88, 160 - 80)
  const shTex = new THREE.CanvasTexture(shCan)
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry((100 * 512) / (512 - 88), (MAP_H * 160) / 80),
    new THREE.MeshBasicMaterial({ map: shTex, transparent: true, opacity: 0.3, depthWrite: false, toneMapped: false }),
  )
  shadow.position.set(0, -1.1, -THICK - 0.6)
  shadow.renderOrder = -1
  town.add(shadow)

  /* ---- the routes: ribbons on the roads ---- */
  let order = 1
  const ribbon = (path: Path, color: string, half: number, dash: number, opacity: number): Ribbon => {
    const w = half + 0.12
    const n = Math.ceil((path.len + 2 * w) / path.step)
    const pos = new Float32Array((n + 1) * 2 * 3)
    const aS = new Float32Array((n + 1) * 2)
    const aT = new Float32Array((n + 1) * 2)
    const idx: number[] = []
    for (let i = 0; i <= n; i++) {
      const d = -w + i * path.step
      const dc = Math.min(Math.max(d, 0), path.len)
      const p = path.at(dc)
      const tx = Math.cos(p.a)
      const ty = Math.sin(p.a)
      const x = p.x + tx * (d - dc)
      const y = p.y + ty * (d - dc)
      for (let s = 0; s < 2; s++) {
        const t = s ? w : -w
        const v = L(x - ty * t, y + tx * t, 0)
        pos.set([v.x, v.y, 0], (i * 2 + s) * 3)
        aS[i * 2 + s] = d
        aT[i * 2 + s] = t
      }
      if (i < n) idx.push(i * 2, i * 2 + 2, i * 2 + 1, i * 2 + 1, i * 2 + 2, i * 2 + 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aS', new THREE.BufferAttribute(aS, 1))
    geo.setAttribute('aT', new THREE.BufferAttribute(aT, 1))
    geo.setIndex(idx)
    const u = {
      uP: { value: 0 },
      uLen: { value: path.len },
      uHalf: { value: half },
      uDash: { value: dash },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }
    const mat = new THREE.ShaderMaterial({ uniforms: u, vertexShader: RIBBON_VERT, fragmentShader: RIBBON_FRAG, transparent: true, depthWrite: false, depthTest: false, side: THREE.DoubleSide })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.z = 0.02
    mesh.renderOrder = order++
    mesh.frustumCulled = false
    town.add(mesh)
    return { mesh, u }
  }
  // the deck's widths: a white bed 10.8 pt wide, the line 5.4 pt, dashes of 10.8 pt; the ghost 2.88 pt with dashes of 5.76 pt (959.76 pt = 100 units)
  const PT = 100 / 959.76
  const ghosts = R.pieces.map((p) => ribbon(p.path, '#ffffff', 1.44 * PT, 5.76 * PT, 0))
  const redBeds = R.pieces.map((p) => ribbon(p.path, '#ffffff', 5.4 * PT, 0, 0.92))
  const reds = R.pieces.map((p) => ribbon(p.path, C_RED, 2.7 * PT, 10.8 * PT, 1))
  const planBed = ribbon(R.blue, '#ffffff', 5.4 * PT, 0, 0)
  const plan = ribbon(R.blue, '#a9c9fb', 2.7 * PT, 0, 0)
  const blueBed = ribbon(R.blue, '#ffffff', 5.4 * PT, 0, 0.94)
  const blue = ribbon(R.blue, C_BLUE, 2.7 * PT, 0, 1)

  /* ---- the dots on the road, the pins over them ---- */
  const flat = (r: number, color: string, z: number, opacity = 1) => {
    const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthTest: false, depthWrite: false, toneMapped: false }))
    m.position.z = z
    m.renderOrder = order++
    return m
  }
  const family = getComputedStyle(ctx.root).fontFamily
  const dots: THREE.Mesh[] = []
  const rings: THREE.Mesh[] = []
  const pins: THREE.Group[] = []
  const heads: THREE.Group[] = []
  const pinShadows: THREE.Mesh[] = []
  const blobCan = document.createElement('canvas')
  blobCan.width = blobCan.height = 64
  const bc = blobCan.getContext('2d')!
  const grad = bc.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(7,26,80,0.55)')
  grad.addColorStop(1, 'rgba(7,26,80,0)')
  bc.fillStyle = grad
  bc.fillRect(0, 0, 64, 64)
  const blobTex = new THREE.CanvasTexture(blobCan)

  ;[...STOPS, DEST].forEach((s) => {
    const ringMesh = new THREE.Mesh(new THREE.RingGeometry(0.86, 1.0, 48), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false }))
    ringMesh.position.copy(L(s[0], s[1], 0.03))
    ringMesh.renderOrder = order++
    town.add(ringMesh)
    rings.push(ringMesh)
    // the deck's dot: navy, 5 pt in radius, a white rim
    const dot = flat(0.62, '#ffffff', 0)
    dot.add(flat(0.47, C_NAVY, 0.001))
    dot.position.copy(L(s[0], s[1], 0.04))
    town.add(dot)
    dots.push(dot)
  })

  STOPS.forEach((s) => {
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }))
    sh.position.copy(L(s[0] + 0.5, s[1] - 0.2, 0.035))
    sh.renderOrder = order++
    town.add(sh)
    pinShadows.push(sh)
  })
  STOPS.forEach((s, i) => {
    const pin = new THREE.Group()
    pin.position.copy(L(s[0], s[1], 0))
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.07, PIN.h, 10), new THREE.MeshBasicMaterial({ color: '#ffffff', depthTest: false, toneMapped: false }))
    stem.rotation.x = Math.PI / 2
    stem.position.z = PIN.h / 2
    stem.renderOrder = 200 + i * 4
    pin.add(stem)
    // the numbered head: it always faces the room
    const head = new THREE.Group()
    head.position.z = PIN.h
    const can = document.createElement('canvas')
    can.width = can.height = 256
    const c = can.getContext('2d')!
    c.fillStyle = '#ffffff'
    c.beginPath()
    c.arc(128, 128, 127, 0, Math.PI * 2)
    c.fill()
    const g = c.createLinearGradient(0, 20, 0, 236)
    g.addColorStop(0, '#f57652')
    g.addColorStop(1, '#ea5631')
    c.fillStyle = g
    c.beginPath()
    c.arc(128, 128, 110, 0, Math.PI * 2)
    c.fill()
    c.fillStyle = '#ffffff'
    c.font = `700 132px ${family}`
    c.textAlign = 'center'
    c.textBaseline = 'alphabetic'
    const m = c.measureText(String(i + 1))
    c.fillText(String(i + 1), 128, 128 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2)
    const t = new THREE.CanvasTexture(can)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    const back = new THREE.Mesh(new THREE.CircleGeometry(PIN.r * 1.02, 48), new THREE.MeshBasicMaterial({ color: '#0c2154', transparent: true, opacity: 0.22, depthTest: false, depthWrite: false, toneMapped: false }))
    back.position.set(0.12, -0.22, -0.01)
    back.renderOrder = 201 + i * 4
    const face = new THREE.Mesh(new THREE.CircleGeometry(PIN.r, 48), new THREE.MeshBasicMaterial({ map: t, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }))
    face.renderOrder = 202 + i * 4
    head.add(back, face)
    pin.add(head)
    town.add(pin)
    pins.push(pin)
    heads.push(head)
  })

  /* ---- the marker: a puck on the road with a wedge that points where it is going; the photograph is carried over it (DOM) ---- */
  const marker = new THREE.Group()
  marker.position.z = 0.06
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 7.2), new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.8, depthTest: false, depthWrite: false, toneMapped: false }))
  ground.position.set(0.5, -0.35, 0)
  ground.renderOrder = order++
  const halo = flat(2.5, C_FLAME, 0.0005, 0.2)
  const wedgeOf = (tip: number, half: number, back: number) => {
    const w = new THREE.Shape()
    w.moveTo(tip, 0)
    w.lineTo(back, half)
    w.lineTo(back, -half)
    w.closePath()
    return new THREE.ShapeGeometry(w)
  }
  const flatMesh = (geo: THREE.BufferGeometry, color: string, z: number) => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }))
    m.position.z = z
    m.renderOrder = order++
    return m
  }
  // ahead of the puck: a white-edged wedge in the marker's colour
  const wedgeRim = flatMesh(wedgeOf(3.7, 1.5, 0.3), '#ffffff', 0.001)
  const wedge = flatMesh(wedgeOf(3.05, 1.1, 0.6), C_FLAME, 0.002)
  const rim = flat(1.55, '#ffffff', 0.003)
  const core = flat(1.22, C_FLAME, 0.004)
  const spin = new THREE.Group()
  spin.add(wedgeRim, wedge)
  marker.add(ground, halo, spin, rim, core)
  town.add(marker)
  // the stem that carries the photograph
  const carry = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, CARRY, 8), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, depthTest: false, depthWrite: false, toneMapped: false }))
  carry.rotation.x = Math.PI / 2
  carry.position.z = CARRY / 2
  carry.renderOrder = order++
  marker.add(carry)
  const cFlame = new THREE.Color(C_RED)
  const cBlue = new THREE.Color(C_BLUE)
  const cWhite = new THREE.Color('#ffffff')
  const tint = new THREE.Color()

  const inv = new THREE.Quaternion()
  const v = new THREE.Vector3()
  const still = ctx.held || ctx.reduced
  let clock = 0
  gl.onFrame((time) => {
    clock = still ? 0 : time
    // the heads face the room, however the town leans
    inv.copy(rig.quaternion).multiply(town.quaternion).invert()
    for (const h of heads) h.quaternion.copy(inv)
    halo.scale.setScalar(1 + 0.1 * Math.sin(clock * 2.4))
  })

  return {
    gl,
    town,
    rig,
    pins,
    heads,
    dots,
    pinShadows,
    rings,
    sync(st) {
      R.pieces.forEach((p, i) => {
        const drawn = st.d - p.from
        redBeds[i].u.uP.value = drawn
        reds[i].u.uP.value = drawn
        ghosts[i].u.uP.value = Math.max(st.d, st.gd) - p.from
        redBeds[i].u.uOpacity.value = 0.92 * st.red
        reds[i].u.uOpacity.value = st.red
        ghosts[i].u.uOpacity.value = 0.95 * st.ghost
      })
      blue.u.uP.value = st.b
      blueBed.u.uP.value = st.b
      plan.u.uP.value = st.p
      planBed.u.uP.value = st.p
      plan.u.uOpacity.value = st.plan
      planBed.u.uOpacity.value = 0.94 * st.plan
      const m = markerAt(R, st)
      // the view follows him: a small turn toward his side of the town, a small pan, a push in
      const side = ((50 - m.x) / 50) * st.follow
      rig.rotation.y = VIEW.yaw * side
      rig.position.x = VIEW.pan * side
      rig.position.z = VIEW.push * st.zoom
      marker.position.copy(L(m.x, m.y, 0.06))
      marker.scale.setScalar(Math.max(st.mark, 0.0001))
      marker.visible = st.mark > 0.001
      spin.rotation.z = -m.a + st.look + Math.PI * st.rev
      if (st.tone < 0.5) tint.copy(cFlame).lerp(cWhite, st.tone * 2)
      else tint.copy(cWhite).lerp(cBlue, st.tone * 2 - 1)
      ;(core.material as THREE.MeshBasicMaterial).color.copy(tint)
      ;(wedge.material as THREE.MeshBasicMaterial).color.copy(tint)
      ;(halo.material as THREE.MeshBasicMaterial).color.copy(tint)
    },
    project(x, y, z = 0) {
      rig.updateMatrixWorld(true)
      v.copy(L(x, y, z)).applyMatrix4(town.matrixWorld).project(gl.camera)
      return { x: ((v.x + 1) / 2) * ctx.W, y: ((1 - v.y) / 2) * ctx.H }
    },
    dispose: gl.dispose,
  }
}
