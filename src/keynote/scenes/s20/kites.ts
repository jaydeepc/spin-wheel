'use client'

/**
 * THE SKY OF SLIDE 20. The deck's kites are one flat picture; here every kite is an object:
 * four facets of paper folded over a spine and a cross spar (so the light changes on them as
 * they bank), a ribbon of a tail that the wind runs through, and a string that really runs from
 * its bridle down to ONE spool at the lower right. Everything is in the stage's own space
 * (three/sceneCanvas.ts: one world unit is one --u at z = 0).
 *
 * Nothing here moves by itself except the wind. The timeline tweens plain numbers (each kite's
 * `fly`, `alpha`, `cut`, `fall`, `grey`; the wind's `amp` and `taut`; the spool's `show` and
 * `spin`), and `update()` draws the whole sky from those numbers and the clock: so every frame
 * can be reached by seeking, and a held frame (clock at 0) is always the same picture.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'

/** The camera's distance from the stage (sceneCanvas: fov 30). */
const CAM = 28.125 / Math.tan((30 * Math.PI) / 360)
/** A kite's own height in its own units (the spine: 0.36 above the bridle, 0.74 below). */
const SPINE = 1.1
const SEG = 22

export interface KiteSpec {
  key: string
  /** Where it flies: its bridle on the stage, in --u. */
  u: number
  v: number
  /** Its depth: 0 the stage, negative further away. */
  z: number
  /** Its height as SEEN on the stage, in --u. */
  h: number
  /** Its two papers: the lighter facets, the darker facets. */
  tones: [string, string]
  /** How it leans while it flies, in radians. */
  tilt: number
  /** How strongly it and its string are drawn (the far ones are fainter). */
  alpha: number
  line: number
  /** Only for a kite whose string snaps: where it comes down, and how it lies there. */
  crash?: { u: number; v: number; rot: number }
}

export interface KiteState {
  /** 0 at the spool … 1 flying at its place. */
  fly: number
  alpha: number
  /** 0 … 1: its string has broken and whips back to the spool. (Not "snap": that word is GSAP's own.) */
  cut: number
  /** 0 … 1: it tumbles from its place to where it comes down. */
  fall: number
  /** 0 … 1: its colour drains. */
  grey: number
}

export interface Sky {
  gl: SceneCanvas
  kites: Record<string, KiteState>
  /** `amp` the wind (0 still … 1), `taut` the hand pulling every string in (0 … 1). */
  /** … and `yank`: the jerk of the pull itself (0 … 1 … 0): every kite is snatched toward the spool, nose down. */
  wind: { amp: number; taut: number; yank: number }
  /** The spool: `show` 0 … 1, `spin` its turn in radians (it pays the string out). */
  /** `grow`: 0 its size in the corner … 1 brought forward for the pull. */
  spool: { show: number; spin: number; grow: number }
}

/** The spool on the stage, and where the strings leave it, in --u. */
export const SPOOL = { u: 92.5, v: 46.0 }
const ANCHOR = { u: 91.7, v: 44.75 }

export const KITES: KiteSpec[] = [
  // far off, small and faint
  { key: 'f1', u: 9.6, v: 22.6, z: -62, h: 2.7, tones: ['#fbc9b7', '#f5a58b'], tilt: 0.1, alpha: 0.9, line: 0.3 },
  { key: 'f2', u: 20.6, v: 24.6, z: -70, h: 2.5, tones: ['#fde2d8', '#f8c8b8'], tilt: -0.32, alpha: 0.85, line: 0.26 },
  { key: 'f3', u: 19.4, v: 32.0, z: -56, h: 2.8, tones: ['#aeb6cf', '#818cb0'], tilt: 0.05, alpha: 0.9, line: 0.3 },
  { key: 'f4', u: 6.6, v: 30.4, z: -66, h: 2.3, tones: ['#d7e7fc', '#b1d0f6'], tilt: 0.0, alpha: 0.9, line: 0.26 },
  { key: 'f5', u: 51.6, v: 33.2, z: -58, h: 2.2, tones: ['#a2abc8', '#7682a8'], tilt: 0.14, alpha: 0.9, line: 0.3 },
  { key: 'f6', u: 70.4, v: 33.4, z: -66, h: 2.0, tones: ['#c9cfde', '#a5adc6'], tilt: -0.06, alpha: 0.85, line: 0.26 },
  { key: 'f7', u: 76.4, v: 37.6, z: -60, h: 2.2, tones: ['#c4dcfa', '#93bef2'], tilt: 0.2, alpha: 0.9, line: 0.28 },
  { key: 'f8', u: 93.4, v: 34.4, z: -58, h: 2.5, tones: ['#fbd3c5', '#f6b5a0'], tilt: -0.12, alpha: 0.85, line: 0.26 },
  // the three whose strings will snap: they fly LOW, in the papers of their clippings' tapes; when the
  // string goes, the wind takes each up and away, and it comes down on its clipping
  { key: 'd1', u: 14.2, v: 39.4, z: -10, h: 5.6, tones: ['#f9c0ab', '#f29d82'], tilt: 0.16, alpha: 1, line: 0.55, crash: { u: 23.4, v: 35.8, rot: -4.35 } },
  { key: 'd2', u: 42.6, v: 41.2, z: -8, h: 5.2, tones: ['#8f9bc0', '#5f6d9c'], tilt: -0.1, alpha: 1, line: 0.55, crash: { u: 40.6, v: 35.6, rot: 4.25 } },
  { key: 'd3', u: 66.4, v: 40.2, z: -9, h: 5.2, tones: ['#bfd9f8', '#8fbcee'], tilt: 0.1, alpha: 1, line: 0.55, crash: { u: 62.6, v: 35.7, rot: -4.2 } },
  // the three of the slide's numbers: large, and nearer than the stage
  { key: 'forty', u: 29.6, v: 26.4, z: 6, h: 12.0, tones: ['#ffa27c', '#ee5c34'], tilt: 0.2, alpha: 1, line: 0.7 },
  { key: 'bny', u: 58.4, v: 24.4, z: 4, h: 10.4, tones: ['#31539e', '#0a1c52'], tilt: -0.16, alpha: 1, line: 0.7 },
  { key: 'seven', u: 82.6, v: 26.0, z: 2, h: 8.0, tones: ['#b3d3fc', '#5a9ff0'], tilt: 0.09, alpha: 1, line: 0.7 },
]

const GREY: [string, string] = ['#d2d8e4', '#9da8be']

const smooth = (x: number) => {
  const t = x < 0 ? 0 : x > 1 ? 1 : x
  return t * t * (3 - 2 * t)
}

/* ---------------------------------------------------------------- geometry */

// the bridle (where spine and spar cross) is the kite's origin; the paper is bowed over it
const T = [0, 0.36, -0.04]
const L = [-0.42, 0, -0.15]
const R = [0.42, 0, -0.15]
const B = [0, -0.74, -0.04]
const C = [0, 0, 0.11]

/** The four facets (light, dark, dark, light, as the deck paints them), then the two spars in white. */
function kiteGeometry(): { geo: THREE.BufferGeometry; facet: number[] } {
  const pos: number[] = []
  const facet: number[] = [] // per vertex: 0 light paper, 1 dark paper, 2 spar
  const tri = (a: number[], b: number[], c: number[], f: number) => {
    pos.push(...a, ...b, ...c)
    facet.push(f, f, f)
  }
  tri(T, L, C, 0)
  tri(T, C, R, 1)
  tri(L, B, C, 1)
  tri(C, B, R, 0)
  const spar = (a: number[], b: number[]) => {
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const len = Math.hypot(dx, dy) || 1
    const nx = (-dy / len) * 0.0075
    const ny = (dx / len) * 0.0075
    const lift = 0.006
    const p = (q: number[], s: number) => [q[0] + nx * s, q[1] + ny * s, q[2] + lift]
    tri(p(a, 1), p(a, -1), p(b, -1), 2)
    tri(p(a, 1), p(b, -1), p(b, 1), 2)
  }
  spar(T, C)
  spar(C, B)
  spar(L, C)
  spar(C, R)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3))
  geo.computeVertexNormals()
  return { geo, facet }
}

/** A flat ribbon of `n` segments whose points are written every frame. */
function strip(n: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array((n + 1) * 6), 3))
  const idx: number[] = []
  for (let i = 0; i < n; i++) {
    const a = i * 2
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  geo.setIndex(idx)
  return geo
}

/** Writes a ribbon along `pts` (x, y, z triples), `w0` wide at its start and `w1` at its end, facing the camera. */
function ribbon(geo: THREE.BufferGeometry, pts: Float32Array, n: number, w0: number, w1: number) {
  const attr = geo.getAttribute('position') as THREE.BufferAttribute
  const out = attr.array as Float32Array
  for (let i = 0; i <= n; i++) {
    const a = Math.max(0, i - 1) * 3
    const b = Math.min(n, i + 1) * 3
    const tx = pts[b] - pts[a]
    const ty = pts[b + 1] - pts[a + 1]
    const len = Math.hypot(tx, ty) || 1
    const w = (w0 + (w1 - w0) * (i / n)) / 2
    const nx = (-ty / len) * w
    const ny = (tx / len) * w
    const p = i * 3
    const o = i * 6
    out[o] = pts[p] + nx
    out[o + 1] = pts[p + 1] + ny
    out[o + 2] = pts[p + 2]
    out[o + 3] = pts[p] - nx
    out[o + 4] = pts[p + 1] - ny
    out[o + 5] = pts[p + 2]
  }
  attr.needsUpdate = true
}

/** The spool's thread: wound a little on the slant, so that a turn of the spool is seen. */
function threadTexture(): THREE.CanvasTexture {
  const S = 256
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (g) {
    g.fillStyle = '#f26b42'
    g.fillRect(0, 0, S, S)
    // turns of thread: around the drum (u), climbing one pair of turns per lap, so the wrap has no seam
    for (let i = -4; i < 18; i++) {
      const y = i * 16
      g.strokeStyle = i % 2 ? 'rgba(255, 196, 168, 0.75)' : 'rgba(196, 64, 28, 0.55)'
      g.lineWidth = i % 2 ? 3.2 : 4.2
      g.beginPath()
      g.moveTo(0, y)
      g.lineTo(S, y + 32)
      g.stroke()
    }
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(1, 1)
  tex.anisotropy = 8
  return tex
}

/* --------------------------------------------------------------------- sky */

export function makeSky(ctx: SceneCtx): Sky {
  const gl = createSceneCanvas(ctx, { fov: 30, lights: false })
  // daylight: a bright sky all round and a sun high on the left, so the papers keep their colour
  gl.scene.add(new THREE.HemisphereLight(0xffffff, 0xffe9df, 1.2))
  const sun = new THREE.DirectionalLight(0xffffff, 2.5)
  sun.position.set(-70, 46, 44)
  gl.scene.add(sun)
  const fill = new THREE.DirectionalLight(0xffffff, 0.75)
  fill.position.set(60, -16, 40)
  gl.scene.add(fill)
  const wind = { amp: 1, taut: 0, yank: 0 }
  const spoolState = { show: 1, spin: 0, grow: 0 }
  const kites: Record<string, KiteState> = {}

  /** A stage point at depth z, in the world: further away, the same place on the stage is further from the axis. */
  const world = (u: number, v: number, z: number) => {
    const k = (CAM - z) / CAM
    return { x: (u - 50) * k, y: (28.125 - v) * k, z, k }
  }
  const anchor0 = world(ANCHOR.u, ANCHOR.v, 0)
  // where the strings leave the spool NOW (it comes forward, and it jerks with the pull)
  const anchor = { x: anchor0.x, y: anchor0.y }

  /* the spool: a drum of flame thread between two navy cheeks, on a navy axle; it leans as the deck's does */
  const spool = new THREE.Group()
  const drum = new THREE.Group()
  const navy = new THREE.MeshStandardMaterial({ color: 0x0c2059, roughness: 0.42, metalness: 0.1, transparent: true })
  const thread = new THREE.MeshStandardMaterial({ map: threadTexture(), roughness: 0.78, transparent: true })
  const along = (m: THREE.Mesh, x = 0) => {
    m.rotation.z = Math.PI / 2 // a cylinder stands on y: lay it along the axle
    m.position.x = x
    drum.add(m)
  }
  along(new THREE.Mesh(new THREE.CylinderGeometry(1.08, 1.08, 3.0, 48, 1, true), thread))
  along(new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.62, 0.3, 48), navy), -1.62)
  along(new THREE.Mesh(new THREE.CylinderGeometry(1.62, 1.62, 0.3, 48), navy), 1.62)
  along(new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5.9, 24), navy))
  along(new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 16), navy), -2.95)
  along(new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 16), navy), 2.95)
  spool.add(drum)
  const sp = world(SPOOL.u, SPOOL.v, 0)
  spool.position.set(sp.x, sp.y, 0)
  spool.rotation.set(0.32, -0.42, 0.44)
  gl.scene.add(spool)

  const lineColor = new THREE.Color('#1b2c63')
  const white = new THREE.Color('#ffffff')
  const grey = [new THREE.Color(GREY[0]), new THREE.Color(GREY[1])]
  const tmp = new THREE.Color()
  const pts = new Float32Array((SEG + 1) * 3)

  const built = KITES.map((spec, i) => {
    const s: KiteState = { fly: 1, alpha: spec.alpha, cut: 0, fall: 0, grey: 0 }
    kites[spec.key] = s
    const { geo, facet } = kiteGeometry()
    const paper = [new THREE.Color(spec.tones[0]), new THREE.Color(spec.tones[1])]
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, side: THREE.DoubleSide, roughness: 0.82, metalness: 0, flatShading: true, transparent: true })
    const body = new THREE.Mesh(geo, mat)
    const tailMat = new THREE.MeshBasicMaterial({ color: paper[1], side: THREE.DoubleSide, transparent: true, depthWrite: false })
    const tailGeo = strip(SEG)
    const tail = new THREE.Mesh(tailGeo, tailMat)
    tail.frustumCulled = false
    const group = new THREE.Group()
    group.add(tail, body)
    group.renderOrder = 2
    gl.scene.add(group)

    const lineMat = new THREE.MeshBasicMaterial({ color: lineColor, transparent: true, depthWrite: false, side: THREE.DoubleSide })
    const lineGeo = strip(SEG)
    const line = new THREE.Mesh(lineGeo, lineMat)
    line.frustumCulled = false
    line.renderOrder = 1
    gl.scene.add(line)
    // the end of string a kite keeps when it has broken away
    let stub: THREE.Mesh | null = null
    let stubGeo: THREE.BufferGeometry | null = null
    let stubMat: THREE.MeshBasicMaterial | null = null
    if (spec.crash) {
      stubMat = new THREE.MeshBasicMaterial({ color: lineColor, transparent: true, depthWrite: false, side: THREE.DoubleSide })
      stubGeo = strip(SEG)
      stub = new THREE.Mesh(stubGeo, stubMat)
      stub.frustumCulled = false
      stub.renderOrder = 1
      gl.scene.add(stub)
    }

    let painted = -1
    const paint = (g: number) => {
      if (g === painted) return
      painted = g
      const col = geo.getAttribute('color') as THREE.BufferAttribute
      for (let v = 0; v < facet.length; v++) {
        const f = facet[v]
        if (f === 2) tmp.copy(white)
        else tmp.copy(paper[f]).lerp(grey[f], g)
        col.setXYZ(v, tmp.r, tmp.g, tmp.b)
      }
      col.needsUpdate = true
      tailMat.color.copy(paper[1]).lerp(grey[1], g)
    }

    const phase = i * 2.399
    const home = world(spec.u, spec.v, spec.z)
    const down = spec.crash ? world(spec.crash.u, spec.crash.v, spec.z) : home
    const size = (spec.h / SPINE) * home.k
    const hw = spec.h * home.k // its height in the world, at its depth

    const update = (t: number) => {
      const e = s.fly
      const b = spec.crash ? smooth((s.fall - 0.18) / 0.82) : 0
      const free = spec.crash ? smooth(s.fall / 0.35) * (1 - b) : 0
      const wob = wind.amp * e * (1 - b)

      // from the spool up to its place, on a bowed path
      let x = anchor.x + (home.x - anchor.x) * e
      let y = anchor.y + (home.y - anchor.y) * e + Math.sin(e * Math.PI) * 2.2
      const z = home.z * e
      // the wind
      x += Math.sin(t * 0.5 + phase) * 0.05 * hw * wob
      y += Math.sin(t * 0.73 + phase * 1.7) * 0.034 * hw * wob
      // the hand pulls every string in a little
      const ax = anchor.x - x
      const ay = anchor.y - y
      const al = Math.hypot(ax, ay) || 1
      const pull = (wind.taut * 0.03 + wind.yank * 0.34) * hw * e * (1 - b)
      x += (ax / al) * pull
      y += (ay / al) * pull
      // its string has snapped: free for a moment (the wind takes it up and away), then it tumbles down
      x += -0.5 * hw * free + (down.x - home.x) * b + Math.sin(b * Math.PI * 2.5) * 0.3 * hw * (1 - b)
      y += 1.25 * hw * free + (down.y - home.y) * b

      let rz = spec.tilt - (1 - e) * 0.75 + Math.sin(t * 0.6 + phase * 1.3) * 0.07 * wob - (wind.taut * 0.05 + wind.yank * 0.3 * (1 - b)) * e
      let ry = -0.22 + Math.sin(t * 0.45 + phase) * 0.26 * wob
      let rx = -0.16 + Math.sin(t * 0.7 + phase * 0.7) * 0.09 * wob + (1 - e) * 0.3 + wind.yank * 0.6 * e * (1 - b)
      if (spec.crash) {
        rz += (spec.crash.rot - spec.tilt) * b + free * 0.5
        ry += Math.sin(b * Math.PI * 2 + 1) * 0.95 * (1 - b) * (b > 0 ? 1 : 0) + 0.3 * b
        rx += Math.sin(b * Math.PI * 3) * 0.7 * (1 - b) + 0.38 * b
      }
      const k = size * (0.25 + 0.75 * e)
      group.position.set(x, y, z)
      group.rotation.set(rx, ry, rz)
      group.scale.set(k, k, k)
      group.visible = s.alpha > 0.002
      mat.opacity = s.alpha
      tailMat.opacity = s.alpha
      paint(s.grey)

      // the tail: a ribbon the wind runs down (in the kite's own space, from the foot of its spine)
      const limp = 1 - 0.55 * b
      for (let n = 0; n <= SEG; n++) {
        const q = n / SEG
        const p = n * 3
        pts[p] = B[0] + Math.sin(q * 6.4 - t * 2.6 + phase) * 0.105 * Math.pow(q, 0.75) * limp + q * q * 0.09
        pts[p + 1] = B[1] - q * 0.92
        pts[p + 2] = B[2] + Math.cos(q * 4.6 - t * 2.1 + phase) * 0.05 * q
      }
      ribbon(tailGeo, pts, SEG, 0.03, 0.012)

      // the string: from the bridle down to the spool, sagging a little; taut when the hand pulls
      const q = s.cut
      const gone = smooth((q - 0.72) / 0.28)
      // a snapped string's end lets go of the kite's place and whips back to the spool
      const hx0 = home.x
      const hy0 = home.y
      const w = q * q
      const ex = q > 0 ? hx0 + (anchor.x - hx0) * w : x
      const ey = q > 0 ? hy0 + (anchor.y - hy0) * w - Math.sin(q * Math.PI) * 0.13 * Math.hypot(anchor.x - hx0, anchor.y - hy0) : y
      const ez = q > 0 ? home.z * (1 - w) : z
      const len = Math.hypot(anchor.x - ex, anchor.y - ey)
      const sag = len * ((0.15 + Math.sin(t * 0.55 + phase) * 0.035 * wind.amp) * (1 - wind.taut) + q * (1 - q) * 0.34)
      const mx = (ex + anchor.x) / 2
      const my = (ey + anchor.y) / 2 - sag
      for (let n = 0; n <= SEG; n++) {
        const f = n / SEG
        const g = 1 - f
        const p = n * 3
        pts[p] = g * g * ex + 2 * g * f * mx + f * f * anchor.x
        pts[p + 1] = g * g * ey + 2 * g * f * my + f * f * anchor.y
        pts[p + 2] = ez * g
      }
      const thick = spec.h > 6 ? 0.13 : spec.h > 3 ? 0.11 : 0.085
      // finer at the kite, two and a half times heavier where the hand holds it
      ribbon(lineGeo, pts, SEG, thick * home.k, thick * 2.5)
      lineMat.opacity = spec.line * Math.min(1, s.alpha / (spec.alpha || 1)) * (1 - gone)
      line.visible = lineMat.opacity > 0.002

      // … and the kite keeps a loose end of it
      if (stub && stubGeo && stubMat) {
        const sl = hw * 1.05
        for (let n = 0; n <= SEG; n++) {
          const f = n / SEG
          const p = n * 3
          pts[p] = x + (0.42 * f + Math.sin(f * 5.2 + phase + t * 0.8 * (1 - b)) * 0.13 * f) * sl
          pts[p + 1] = y - (0.25 * f + 0.55 * f * f) * sl + Math.sin(f * 3.1) * 0.08 * sl * (1 - b)
          pts[p + 2] = z
        }
        ribbon(stubGeo, pts, SEG, thick * home.k, thick * home.k)
        stubMat.opacity = spec.line * 1.2 * Math.min(1, q * 5) * s.alpha
        stub.visible = stubMat.opacity > 0.002
      }
    }
    return { update }
  })

  // the clock stands still on a held frame and for a visitor who asked for less motion
  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    const t = still ? 0 : time
    const show = spoolState.show
    const g = spoolState.grow
    const sc = (0.5 + 0.5 * show) * (1 + 0.5 * g)
    spool.scale.set(sc, sc, sc)
    // brought forward for the pull; and the pull itself jerks it down and away from the sky
    const jx = wind.yank * 1.5
    const jy = wind.yank * -1.1
    spool.position.set(sp.x - 2.3 * g + jx, sp.y + 0.9 * g + jy, 0)
    spool.rotation.set(0.32, -0.42, 0.44 + wind.yank * 0.22)
    spool.visible = show > 0.002
    navy.opacity = thread.opacity = Math.min(1, show * 1.4)
    drum.rotation.x = spoolState.spin
    anchor.x = spool.position.x + (anchor0.x - sp.x) * sc
    anchor.y = spool.position.y + (anchor0.y - sp.y) * sc
    for (const k of built) k.update(t)
  })

  return { gl, kites, wind, spool: spoolState }
}
