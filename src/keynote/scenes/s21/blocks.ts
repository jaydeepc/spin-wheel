'use client'

/**
 * THE BLOCKS OF SLIDE 21. The deck's picture is flat; here it is built: the stack of bought
 * software (pale boxes, each with its padlock), the navy cube that opens, and the tiles that
 * come out of it, tumble over in an arc and land as the company's own grid. Everything is in the
 * stage's own space (three/sceneCanvas.ts: one world unit is one --u at z = 0), so a tile lands
 * exactly on the cell the DOM panel has laid out for it.
 *
 * The timeline tweens plain numbers (`box[i].t`, `tile[i].p`, `state.*`); `update()` draws the
 * picture from them and the clock. The tiles are ONE instanced mesh.
 */

import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { cell, GRID, PANEL, TILE } from './data'

const BOX = 4.25
const CUBE = 5.3
/** Tiles that keep coming over the arc once the grid is full. */
const STREAM = 9

const PAPER: Record<string, string> = { navy: '#0f2463', flame: '#f1663f', peach: '#fba688', azure: '#62a6f4', pale: '#accffb' }
const STREAM_TONES = ['flame', 'azure', 'peach', 'navy', 'pale', 'flame', 'azure', 'peach', 'pale']

export interface Blocks {
  gl: SceneCanvas
  /** Each bought box: 0 above the stack … 1 in its place. */
  box: { t: number }[]
  /** Each tile of the grid: 0 inside the cube … 1 landed in its cell. */
  tile: { p: number }[]
  state: {
    /** The cube: 0 not there … 1 standing beside the stack. */
    cube: number
    /** Its lid: 0 shut … 1 open. */
    lid: number
    /** The bought stack steps back: 0 … 1. */
    recede: number
    /** The tiles that keep coming over the arc: 0 none … 1 all. */
    stream: number
  }
}

const smooth = (x: number) => {
  const t = x < 0 ? 0 : x > 1 ? 1 : x
  return t * t * (3 - 2 * t)
}

/** A padlock, as the deck draws it on every bought box: a shackle and a body, nothing more. */
function padlockTexture(): THREE.CanvasTexture {
  const S = 256
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (g) {
    g.strokeStyle = '#8b97b3'
    g.fillStyle = '#8b97b3'
    g.lineWidth = 20
    g.lineCap = 'round'
    g.beginPath()
    g.moveTo(88, 128)
    g.lineTo(88, 96)
    g.arc(128, 96, 40, Math.PI, 0)
    g.lineTo(168, 128)
    g.stroke()
    g.beginPath()
    g.roundRect(62, 118, 132, 104, 20)
    g.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export function makeBlocks(ctx: SceneCtx): Blocks {
  // above the DOM: the tiles land ON the panel that the DOM draws
  const gl = createSceneCanvas(ctx, { fov: 30, above: true, lights: false })
  // an even, white studio light: the tiles keep the deck's colours, the boxes keep their three tones
  gl.scene.add(new THREE.HemisphereLight(0xffffff, 0xf4f1f2, 1.9))
  const key = new THREE.DirectionalLight(0xffffff, 1.5)
  key.position.set(-30, 60, 80)
  gl.scene.add(key)
  const fill = new THREE.DirectionalLight(0xfff3ea, 0.5)
  fill.position.set(60, 10, 60)
  gl.scene.add(fill)
  const state = { cube: 1, lid: 0, recede: 0, stream: 0 }

  /* ---- the stack of bought software: 3, 3 and 2, seen a little from above and from the left ---- */
  const stack = new THREE.Group()
  stack.position.copy(gl.at(13.9, 35.9))
  stack.rotation.set(0.3, -0.36, 0)
  gl.scene.add(stack)
  const boxGeo = new RoundedBoxGeometry(BOX, BOX, BOX, 4, 0.16)
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xe4e8f1, roughness: 0.92, metalness: 0 })
  const boxTone = new THREE.Color(0xe4e8f1)
  const boxPale = new THREE.Color(0xf3f5fa)
  const lockMat = new THREE.MeshBasicMaterial({ map: padlockTexture(), transparent: true, depthWrite: false })
  const lockGeo = new THREE.PlaneGeometry(BOX * 0.42, BOX * 0.42)
  const pitch = BOX + 0.2
  const spots: [number, number, number][] = [
    [-pitch, 0, 0],
    [0, 0, 0],
    [pitch, 0, 0],
    [-pitch + 0.5, 1, -0.5],
    [0.5, 1, -0.5],
    [pitch + 0.5, 1, -0.5],
    [-pitch * 0.5 + 0.3, 2, -1],
    [pitch * 0.5 + 0.3, 2, -1],
  ]
  const boxes = spots.map(([x, row, z]) => {
    const g = new THREE.Group()
    const m = new THREE.Mesh(boxGeo, boxMat)
    const lock = new THREE.Mesh(lockGeo, lockMat)
    lock.position.z = BOX / 2 + 0.02
    lock.renderOrder = 1
    g.add(m, lock)
    stack.add(g)
    return { g, x, y: BOX / 2 + row * (BOX + 0.06), z, s: { t: 1 } }
  })

  /* ---- the navy cube: tipped toward the grid, its lid on a hinge ---- */
  const cube = new THREE.Group()
  cube.position.copy(gl.at(29.8, 35.9))
  cube.rotation.set(0.3, -0.5, -0.2)
  gl.scene.add(cube)
  const navy = new THREE.MeshStandardMaterial({ color: 0x10266a, roughness: 0.5, metalness: 0.05 })
  const navyTop = new THREE.MeshStandardMaterial({ color: 0x2a4a92, roughness: 0.5, metalness: 0.05 })
  // its top is the dark of its inside: a tile that rises through it comes "out of the box"
  const inside = new THREE.MeshBasicMaterial({ color: 0x050d2c })
  const body = new THREE.Mesh(new THREE.BoxGeometry(CUBE, CUBE, CUBE), [navy, navy, inside, navy, navy, navy])
  body.position.y = CUBE / 2
  const hinge = new THREE.Group()
  hinge.position.set(CUBE / 2, CUBE, 0)
  const lid = new THREE.Mesh(new THREE.BoxGeometry(CUBE, 0.26, CUBE), [navy, navy, navyTop, navy, navy, navy])
  lid.position.set(-CUBE / 2, 0.13, 0)
  hinge.add(lid)
  cube.add(body, hinge)
  cube.updateMatrixWorld(true)
  // where the tiles start (the middle of the cube) and where they come out (the middle of its top)
  const heart = cube.localToWorld(new THREE.Vector3(0, CUBE * 0.5, 0))
  const mouth = cube.localToWorld(new THREE.Vector3(0, CUBE, 0))
  const cubeHome = cube.position.clone()

  /* ---- the tiles: one instanced mesh ---- */
  const N = GRID.length
  const tileGeo = new RoundedBoxGeometry(TILE, TILE, 0.72, 5, 0.5)
  const tileMat = new THREE.MeshStandardMaterial({ roughness: 0.42, metalness: 0.02 })
  const tiles = new THREE.InstancedMesh(tileGeo, tileMat, N + STREAM)
  tiles.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  tiles.frustumCulled = false
  const col = new THREE.Color()
  GRID.forEach((tone, i) => tiles.setColorAt(i, col.set(PAPER[tone])))
  STREAM_TONES.forEach((tone, i) => tiles.setColorAt(N + i, col.set(PAPER[tone])))
  if (tiles.instanceColor) tiles.instanceColor.needsUpdate = true
  gl.scene.add(tiles)

  const tile = GRID.map(() => ({ p: 1 }))
  const targets = GRID.map((_, i) => {
    const c = cell(Math.floor(i / 4), i % 4)
    return gl.at(c.u, c.v, 0.2)
  })
  // every tile tumbles its own way, and the same way every time
  const spin = GRID.map((_, i) => {
    const r = (k: number) => {
      const x = Math.sin((i + 1) * 12.9898 * k) * 43758.5453
      return x - Math.floor(x) - 0.5
    }
    return [r(1) * 7, r(2) * 7, r(3) * 5 - 2.5]
  })
  const streamEnd = gl.at(PANEL.x - 0.6, PANEL.y + PANEL.size * 0.62, 0.4)

  const dummy = new THREE.Object3D()
  const put = (i: number, x: number, y: number, z: number, rx: number, ry: number, rz: number, s: number) => {
    dummy.position.set(x, y, z)
    dummy.rotation.set(rx, ry, rz)
    dummy.scale.setScalar(Math.max(0.0001, s))
    dummy.updateMatrix()
    tiles.setMatrixAt(i, dummy.matrix)
  }

  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    const t = still ? 0 : time

    // the stack: each box comes down into its place; later the whole stack steps back
    const back = state.recede
    stack.position.z = -9 * back
    boxMat.color.copy(boxTone).lerp(boxPale, back)
    lockMat.opacity = 1 - 0.45 * back
    for (const b of boxes) {
      const e = b.s.t
      b.g.position.set(b.x, b.y + (1 - e) * 7, b.z)
      const k = Math.min(1, e * 3.5)
      b.g.scale.setScalar(Math.max(0.0001, k))
      b.g.visible = e > 0.001
    }

    // the cube slides in beside the stack; its lid swings open
    const ce = state.cube
    cube.position.set(cubeHome.x - (1 - ce) * 5, cubeHome.y, cubeHome.z)
    cube.scale.setScalar(Math.max(0.0001, Math.min(1, ce * 2.5)))
    cube.visible = ce > 0.001
    hinge.rotation.z = -state.lid * 2.05

    // the tiles: out of the cube, over the arc, into the grid
    for (let i = 0; i < N; i++) {
      const p = tile[i].p
      const to = targets[i]
      const row = Math.floor(i / 4)
      const f = p
      const g = 1 - f
      // a throw: up out of the mouth, over, and down into its cell
      const cx = (heart.x + to.x) / 2 - 1.5
      const cy = Math.max(mouth.y, to.y) + 11.5 - row * 0.9
      const cz = 4
      const x = g * g * heart.x + 2 * g * f * cx + f * f * to.x
      const y = g * g * heart.y + 2 * g * f * cy + f * f * to.y
      const z = g * g * heart.z + 2 * g * f * cz + f * f * to.z
      const turn = 1 - smooth(p)
      // small inside the cube, full size by the top of the arc, and a breath of overshoot as it lands
      const land = Math.sin(Math.PI * Math.min(1, Math.max(0, (p - 0.86) / 0.14)))
      const s = (p <= 0 ? 0 : 0.42 + 0.58 * smooth(p / 0.55)) * (1 + 0.1 * land)
      put(i, x, y, z + land * 0.9, spin[i][0] * turn, spin[i][1] * turn, spin[i][2] * turn, s)
    }
    // … and more keep coming, as long as the slide is up
    const ex = (mouth.x + streamEnd.x) / 2 - 1.5
    const ey = mouth.y + 12.5
    for (let i = 0; i < STREAM; i++) {
      const q = (i / STREAM + 0.07 + t * 0.085) % 1
      const g = 1 - q
      const x = g * g * heart.x + 2 * g * q * ex + q * q * streamEnd.x
      const y = g * g * heart.y + 2 * g * q * ey + q * q * streamEnd.y
      const z = 2 * g * q * 4 + q * q * streamEnd.z
      const env = state.stream * smooth((q - 0.11) / 0.14) * (1 - smooth((q - 0.8) / 0.16))
      const s = env < 0.12 ? 0 : env * 0.86 // never a speck: it is there or it is not
      // it turns over in the plane of the picture and only rocks on its other axes: never seen edge-on
      put(N + i, x, y, z, Math.sin(q * 5 + i * 1.7) * 0.5, Math.cos(q * 4 + i * 2.3) * 0.55, -q * 3.4 + i * 0.9, s)
    }
    tiles.instanceMatrix.needsUpdate = true
  })

  return { gl, box: boxes.map((b) => b.s), tile, state }
}
