'use client'

/**
 * THE PAPER STACKS of slides 36 to 38, in three.js: one white sheet for every page of each
 * customer's statement (54, 14, 27), minus the top page, which is the real document and stays in
 * the DOM. A stack is as thick as the statement is long, so the length is seen, not only read.
 *
 * Each stack is ONE instanced mesh and three plain numbers that the timeline tweens:
 *   in   0 → 1   the sheets are dealt onto the desk, the bottom one first. They come from the
 *                camera's side and fade in on the way: nothing ever crosses the headline above
 *   out  0 → 1   they are swept away to the left, the top one first, fading as they go
 *   fan  0 → 1   the stack opens a little while the agent reads it
 * Every sheet's place is computed from those numbers on every frame: seekable, and Back unwinds it.
 *
 * The sheets are blank paper with faint rules: no customer's page is drawn here.
 */

import { createSceneCanvas, THREE, type SceneCtx } from '../../kit'

export interface StackParams {
  in: number
  out: number
  fan: number
}

export interface Stacks {
  p: Record<number, StackParams>
  dispose(): void
}

/** the step from one sheet to the next, in --u: 54 pages make a stack 2.4u thick, 14 pages 0.6u */
export const STEP = 0.045

/**
 * How far the stack opens while it is read: a thin statement opens to about 3u as well, so the
 * fan is seen on 14 pages as on 54. The offset of sheet k is k * STEP * (1 + fan * fanOf(count)).
 */
export const fanOf = (count: number) => Math.max(0.85, 3 / (count * STEP) - 1)

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)

/** a small repeatable random, so a held frame is the same on every visit */
const hash = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function sheetTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 400
  c.height = 564
  const g = c.getContext('2d')!
  g.fillStyle = '#ffffff'
  g.fillRect(0, 0, c.width, c.height)
  // a letterhead and a table of rules, as faint as a page seen in passing
  g.fillStyle = 'rgba(7, 26, 80, 0.07)'
  g.fillRect(34, 40, 120, 16)
  g.fillRect(34, 70, 200, 8)
  g.fillRect(34, 86, 160, 8)
  g.strokeStyle = 'rgba(7, 26, 80, 0.10)'
  g.lineWidth = 1
  for (let y = 150; y < 520; y += 17) {
    g.beginPath()
    g.moveTo(34, y + 0.5)
    g.lineTo(366, y + 0.5)
    g.stroke()
  }
  for (const x of [34, 96, 240, 300, 366]) {
    g.beginPath()
    g.moveTo(x + 0.5, 150)
    g.lineTo(x + 0.5, 507)
    g.stroke()
  }
  // the paper's edge
  g.strokeStyle = 'rgba(7, 26, 80, 0.20)'
  g.lineWidth = 1.5
  g.strokeRect(1, 1, c.width - 2, c.height - 2)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function shadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 160
  const g = c.getContext('2d')!
  g.filter = 'blur(12px)'
  g.fillStyle = 'rgba(7, 26, 80, 1)'
  g.fillRect(24, 24, 80, 112)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/**
 * @param slot the top page on the stage, in --u (left, top, width, height)
 * @param pages the number of pages of each statement, by slide
 */
export function makeStacks(ctx: SceneCtx, slot: { left: number; top: number; width: number; height: number }, pages: Record<number, number>): Stacks {
  const gl = createSceneCanvas(ctx, { lights: false })
  const centre = gl.at(slot.left + slot.width / 2, slot.top + slot.height / 2)
  const geo = new THREE.PlaneGeometry(slot.width, slot.height)
  const map = sheetTexture()

  const p: Record<number, StackParams> = {}
  const meshes: { n: number; count: number; mesh: THREE.InstancedMesh; alpha: THREE.InstancedBufferAttribute; fan: number; geo: THREE.BufferGeometry; mat: THREE.Material }[] = []
  for (const key of Object.keys(pages)) {
    const n = Number(key)
    const count = Math.max(1, pages[n] - 1)
    // every sheet has its own opacity (an instanced attribute); the sheets are drawn bottom first,
    // without a depth test, so a half-arrived sheet shows the pile under it and not the room
    const g = geo.clone()
    const alpha = new THREE.InstancedBufferAttribute(new Float32Array(count).fill(0), 1)
    alpha.setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('aAlpha', alpha)
    const mat = new THREE.MeshBasicMaterial({ map, transparent: true, depthTest: false, depthWrite: false })
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', 'attribute float aAlpha;\nvarying float vAlpha;\n#include <common>')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvAlpha = aAlpha;')
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', 'varying float vAlpha;\n#include <common>')
        .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= vAlpha;')
    }
    const mesh = new THREE.InstancedMesh(g, mat, count)
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    mesh.frustumCulled = false
    for (let i = 0; i < count; i++) mesh.setColorAt(i, new THREE.Color(1, 1, 1))
    gl.scene.add(mesh)
    meshes.push({ n, count, mesh, alpha, fan: fanOf(count), geo: g, mat })
    p[n] = { in: 0, out: 0, fan: 0 }
  }

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(slot.width + 9, slot.height + 9),
    new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, opacity: 0, depthWrite: false }),
  )
  shadow.position.set(centre.x + 1.4, centre.y - 2.2, -4)
  shadow.renderOrder = -1
  gl.scene.add(shadow)

  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const pos = new THREE.Vector3()
  const scl = new THREE.Vector3()
  const col = new THREE.Color()
  const SPREAD_IN = 2.2 // how far apart the sheets are dealt (in flights)
  const SPREAD_OUT = 1.4

  gl.onFrame(() => {
    let shade = 0
    for (const { n, count, mesh, alpha, fan } of meshes) {
      const s = p[n]
      shade = Math.max(shade, clamp01(s.in * 1.4 - 0.4) * (1 - clamp01(s.out * 1.6)) * (0.5 + 0.5 * Math.min(1, count / 40)))
      const span = Math.max(1, count - 1)
      for (let i = 0; i < count; i++) {
        const k = count - i // instance 0 is the bottom of the stack (drawn first); k = 1 is the sheet under the top page
        const tin = clamp01(s.in * (1 + SPREAD_IN) - ((count - k) / span) * SPREAD_IN)
        const tout = clamp01(s.out * (1 + SPREAD_OUT) - ((k - 1) / span) * SPREAD_OUT)
        const al = clamp01(tin * 3.5) * (1 - clamp01((tout - 0.3) / 0.55))
        alpha.setX(i, al)
        if (al <= 0) {
          m.makeScale(0, 0, 0)
          mesh.setMatrixAt(i, m)
          continue
        }
        const a = 1 - (1 - tin) * (1 - tin) * (1 - tin) // lands softly
        const far = 1 - a
        const o = tout * tout // leaves gathering speed
        const side = hash(k + n) - 0.5
        const off = k * STEP * (1 + s.fan * fan)
        // dealt from the camera's side (a little right and low, tilted), swept off to the left and low
        pos.set(centre.x + off + far * (3.5 + side * 5) - o * 64, centre.y - off - far * 1.2 + o * (-1.5 + side * 3), -k * 0.03 + far * 9 + o * 6)
        e.set(-far * 0.45, -o * 0.5, side * 0.012 + far * side * 0.6 + o * 0.3)
        q.setFromEuler(e)
        scl.set(1, 1, 1)
        m.compose(pos, q, scl)
        mesh.setMatrixAt(i, m)
        // paper in flight is in less light; sheets alternate a little so the stack's edge reads as pages
        const v = (k % 2 ? 1 : 0.972) - far * 0.1 - o * 0.08
        col.setRGB(v, v, Math.min(1, v + 0.012))
        mesh.setColorAt(i, col)
      }
      mesh.instanceMatrix.needsUpdate = true
      alpha.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
    ;(shadow.material as THREE.MeshBasicMaterial).opacity = 0.2 * shade
  })

  return {
    p,
    dispose() {
      for (const x of meshes) {
        x.geo.dispose()
        x.mat.dispose()
      }
      gl.dispose()
    },
  }
}
