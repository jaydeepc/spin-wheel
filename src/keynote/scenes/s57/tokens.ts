'use client'

/**
 * Slide 57 · the bars of the token chart are MADE of tokens: blocks stacked five across (a full
 * block stands for two billion tokens), each bar raining into its column from above. One number
 * per bar (`p`, 0 … 1) drives its rain; the timeline tweens those.
 *
 * EVERY COLUMN ENDS FLAT AT ITS EXACT HEIGHT. A value is rarely a whole number of rows, so the
 * top row is cut to the remainder (or, when the remainder is a sliver, the row under it is made
 * that much taller): the top of each column is barH(value), to the deck's printed figure.
 *
 * The blocks have depth and stand behind the plane of the page (their front faces are at z = 0,
 * exactly where the DOM's baseline and figures are), so the camera's own perspective shows a
 * side and a top of every column: objects, not a flat wall.
 */
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { BASE_Y, COLS, PER_TILE, PITCH_X, PITCH_Y, TOKENS, barX } from './data'

export interface TokenField {
  gl: SceneCanvas
  /** per bar: 0 nothing … 1 every block has landed */
  p: number[]
  /** `sheen`: a light that runs up the bars once they stand, 0 … 1 (past the top). `shift`: the whole chart moved right, in u. */
  state: { sheen: number; shift: number }
  dispose(): void
}

interface Tile {
  bar: number
  x: number
  y: number
  /** its height, in rows (1 a full block) */
  tall: number
  /** when it leaves, within its bar's progress: 0 … 0.72 */
  d: number
  /** sideways start, in u */
  sx: number
  /** 0 the baseline … 1 the top of the tallest bar */
  h: number
  base: THREE.Color
}

const GAP = 0.065
const DEPTH = 1.5

// a small seeded generator: the rain is the same on every visit
const rng = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

/** the rows of one bar, bottom to top, each as a height in rows: they add up to value / (PER_TILE * COLS) exactly */
export function rowsOf(value: number): number[] {
  const exact = value / (PER_TILE * COLS)
  const full = Math.floor(exact + 1e-9)
  const rest = exact - full
  const rows = Array.from({ length: full }, () => 1)
  if (rest > 1e-6) {
    if (rest < 0.4 && rows.length) rows[rows.length - 1] += rest
    else rows.push(rest)
  }
  return rows
}

export function makeTokens(ctx: SceneCtx): TokenField {
  const gl = createSceneCanvas(ctx, { above: true, fov: 30, lights: false })
  gl.scene.add(new THREE.HemisphereLight(0xffffff, 0xffd9cc, 1.55))
  const key = new THREE.DirectionalLight(0xffffff, 1.75)
  key.position.set(-18, 34, 60)
  gl.scene.add(key)

  const rand = rng(57)
  const tiles: Tile[] = []
  const tallest = Math.max(...TOKENS) / PER_TILE / COLS
  const deep = new THREE.Color('#e9502c')
  const light = new THREE.Color('#f7805f')
  TOKENS.forEach((v, bar) => {
    const rows = rowsOf(v)
    let foot = 0
    rows.forEach((tall, row) => {
      for (let c = 0; c < COLS; c++) {
        const p = gl.at(barX(bar) + (c - (COLS - 1) / 2) * PITCH_X, BASE_Y - (foot + tall / 2) * PITCH_Y)
        const h = (foot + tall / 2) / tallest
        const base = deep.clone().lerp(light, Math.min(1, h * 1.1))
        base.offsetHSL(0, 0, (rand() - 0.5) * 0.04)
        tiles.push({ bar, x: p.x, y: p.y, tall, d: (row / Math.max(1, rows.length)) * 0.62 + rand() * 0.1, sx: (rand() - 0.5) * 1.6, h, base })
      }
      foot += tall
    })
  })

  const group = new THREE.Group()
  gl.scene.add(group)
  const mat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.6, metalness: 0 })
  // a unit block: scaled per tile, so that the gap between rows stays the same whatever a row's height
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, tiles.length)
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(tiles.length * 3), 3)
  mesh.frustumCulled = false
  group.add(mesh)

  const p = TOKENS.map(() => 0)
  const state = { sheen: 0, shift: 0 }
  const m4 = new THREE.Matrix4()
  const pos = new THREE.Vector3()
  const scl = new THREE.Vector3()
  const rot = new THREE.Quaternion()
  const eul = new THREE.Euler()
  const col = new THREE.Color()
  const white = new THREE.Color('#fff6f1')

  gl.onFrame(() => {
    group.position.x = state.shift
    for (let i = 0; i < tiles.length; i++) {
      const t = tiles[i]
      // this block's own fall: it leaves at d and takes 0.28 of the bar's time
      const k = Math.max(0, Math.min(1, (p[t.bar] - t.d) / 0.28))
      const e = 1 - (1 - k) ** 3
      const drop = (1 - e) * (5 + t.h * 5)
      pos.set(t.x + t.sx * (1 - e), t.y + drop, -DEPTH / 2 + (1 - e) * 2.4)
      eul.set((1 - e) * 1.4, (1 - e) * 0.9, (1 - e) * t.sx)
      rot.setFromEuler(eul)
      const s = k <= 0 ? 0 : 0.35 + 0.65 * Math.min(1, k * 3)
      scl.set((PITCH_X - 0.07) * s, Math.max(0.02, t.tall * PITCH_Y - GAP) * s, DEPTH * s)
      mesh.setMatrixAt(i, m4.compose(pos, rot, scl))
      // the light that runs up the standing bars
      const w = Math.max(0, 1 - Math.abs(t.h - (state.sheen * 1.3 - 0.15)) / 0.12)
      col.copy(t.base).lerp(white, w * 0.55)
      mesh.setColorAt(i, col)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  })

  return { gl, p, state, dispose: gl.dispose }
}
