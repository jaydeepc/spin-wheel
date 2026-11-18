'use client'

/**
 * The two placeholder charts as objects: each column is a stack of small lacquered cubes, and
 * the blocks GATHER: they come out of the depth of the room, tumbling, and settle into their
 * columns from the first to the last, from the ground up. Real instanced meshes under real
 * lights, in the stage's own space (three/sceneCanvas.ts: one world unit is one --u), so the
 * columns stand exactly inside the cards the DOM lays out, and shrink and rise with them.
 *
 * Everything is a function of ONE number, `state.p` (0 nothing there … 1 all landed), which the
 * timeline tweens: any frame can be held.
 */

import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import type { PlaceholderChart } from './data'

/** One block, and the pitch of the stack, in --u (at the charts' full size). */
const BW = 0.76
const BH = 0.76
const BD = 0.76
const PX = 0.9
const PY = 0.9
const PZ = 0.9
/** A column is this many blocks wide and deep. */
const ACROSS = 3
const DEEP = 3
/** From one column to the next. */
const PITCH = 6.1
/** The charts are tipped back by this much, so the tops of the columns are seen. */
const TILT = 0.3
/** How much of `p` the last block still needs once it has set off. */
const FLIGHT = 0.4

export interface Charts {
  gl: SceneCanvas
  /** Both charts hang on this: its origin is the top centre of the DOM's chart row. Move and scale it with that row. */
  rig: THREE.Group
  /** 0 … 1: how far the blocks have gathered. Tween it, then call apply() (or tween with onUpdate: apply). */
  state: { p: number; sway: number }
  apply(): void
}

/** A small seeded generator: the same scatter on every visit, so a held frame is always the same frame. */
function seeded(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TONES: Record<PlaceholderChart['id'], { from: string; to: string; plate: string }> = {
  // PLACEHOLDERS: pale, as an unpainted model, not the brand's full colours (a real chart will be).
  // the people: a pale blue-grey rising into a soft blue
  people: { from: '#b6c6ee', to: '#7aa2f5', plate: '#e4ebf8' },
  // the agents: a pale peach rising into a soft coral
  agents: { from: '#f9d3c5', to: '#f79a80', plate: '#fdebe4' },
}

function contactShadow(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 128
  const g = c.getContext('2d')
  if (g) {
    const grad = g.createRadialGradient(256, 64, 4, 256, 64, 256)
    grad.addColorStop(0, 'rgba(7, 26, 80, 0.22)')
    grad.addColorStop(0.5, 'rgba(7, 26, 80, 0.08)')
    grad.addColorStop(1, 'rgba(7, 26, 80, 0)')
    g.setTransform(1, 0, 0, 0.25, 0, 48)
    g.fillStyle = grad
    g.fillRect(0, -200, 512, 600)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * @param charts  the two charts (their shapes are illustrative: see data.ts)
 * @param card    one card of the DOM row at full size, in --u: its width, its height, the gap between the two
 */
export function makeCharts(ctx: SceneCtx, charts: PlaceholderChart[], card: { w: number; h: number; gap: number }): Charts {
  const gl = createSceneCanvas(ctx, { above: true, lights: false })
  const rig = new THREE.Group()
  gl.scene.add(rig)
  // lights of our own: a key from the upper left that separates the tops from the fronts, a cool
  // rim from the right for the sides, and enough sky that no face goes dead
  gl.scene.add(new THREE.HemisphereLight(0xffffff, 0xe6ecf8, 0.85))
  const key = new THREE.DirectionalLight(0xfff6ef, 2.6)
  key.position.set(-26, 60, 44)
  gl.scene.add(key)
  const rim = new THREE.DirectionalLight(0xb9d4ff, 0.9)
  rim.position.set(60, 6, 24)
  gl.scene.add(rim)

  const geo = new RoundedBoxGeometry(BW, BH, BD, 4, 0.11)
  const shadowTex = contactShadow()
  const state = { p: 0, sway: 1 }
  const still = ctx.held || ctx.reduced
  const calm = ctx.reduced

  interface Unit {
    mesh: THREE.InstancedMesh
    inner: THREE.Group
    n: number
    /** Per block: where it rests, where it comes from, when it sets off, how it tumbles. */
    end: Float32Array
    start: Float32Array
    delay: Float32Array
    spin: Float32Array
  }

  const units: Unit[] = charts.map((chart, k) => {
    const rnd = seeded(77 + k * 131)
    const tone = TONES[chart.id]
    const n = chart.shape.reduce((s, rows) => s + rows * ACROSS * DEEP, 0)
    const mat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.34, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.22 })
    const mesh = new THREE.InstancedMesh(geo, mat, n)
    mesh.frustumCulled = false // the blocks move: the first frame's bounds mean nothing
    const end = new Float32Array(n * 3)
    const start = new Float32Array(n * 3)
    const delay = new Float32Array(n)
    const spin = new Float32Array(n * 3)
    const cFrom = new THREE.Color(tone.from)
    const cTo = new THREE.Color(tone.to)
    const white = new THREE.Color('#ffffff')
    const col = new THREE.Color()
    const cols = chart.shape.length
    const tallest = Math.max(...chart.shape)
    let i = 0
    chart.shape.forEach((rows, c) => {
      const cx = (c - (cols - 1) / 2) * PITCH
      for (let r = 0; r < rows; r++)
        for (let ax = 0; ax < ACROSS; ax++)
          for (let dz = 0; dz < DEEP; dz++) {
            const x = cx + (ax - (ACROSS - 1) / 2) * PX
            const y = BH / 2 + r * PY
            const z = (dz - (DEEP - 1) / 2) * PZ
            end.set([x, y, z], i * 3)
            // out of the depth of the room, wide, and not so high that they cross the headline: a crowd on its way in
            if (calm) start.set([x, y, z], i * 3)
            else {
              // the group is tipped back (TILT), which would lift far blocks high over the card's
              // title: so they start lower by as much, and come in from straight behind the columns
              const z0 = -34 - rnd() * 70
              start.set([x * 0.35 + (rnd() - 0.5) * 46, y + 1 + rnd() * 7 + z0 * Math.tan(TILT), z0], i * 3)
            }
            // column by column, each from the ground up
            delay[i] = (c / cols) * 0.44 + (r / tallest) * 0.13 + rnd() * 0.03
            spin.set([(rnd() - 0.5) * 7, (rnd() - 0.5) * 7, (rnd() - 0.5) * 5], i * 3)
            // the colour climbs along the chart, with a little life from block to block
            col.copy(cFrom).lerp(cTo, cols > 1 ? c / (cols - 1) : 1)
            col.lerp(white, rnd() * 0.07)
            mesh.setColorAt(i, col)
            i++
          }
    })
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

    // the ground the columns stand on, and its soft shadow on the card
    const plate = new THREE.Mesh(
      new RoundedBoxGeometry((cols - 1) * PITCH + ACROSS * PX + 2.2, 0.24, DEEP * PZ + 1.5, 3, 0.1),
      new THREE.MeshStandardMaterial({ color: tone.plate, roughness: 0.7 }),
    )
    plate.position.y = -0.14
    const shade = new THREE.Mesh(
      new THREE.PlaneGeometry((cols - 1) * PITCH + 12, 5),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
    )
    shade.position.set(0, -1.0, -1.2)
    shade.renderOrder = -1

    const inner = new THREE.Group()
    inner.add(shade, plate, mesh)
    const group = new THREE.Group()
    group.add(inner)
    // inside its card: centred, standing a little above the card's lower edge; tipped so the tops are seen
    group.position.set((k === 0 ? -1 : 1) * (card.w + card.gap) * 0.5, -(card.h - 2.9), 0)
    group.rotation.x = TILT
    rig.add(group)
    return { mesh, inner, n, end, start, delay, spin }
  })

  const m = new THREE.Matrix4()
  const pos = new THREE.Vector3()
  const quat = new THREE.Quaternion()
  const eul = new THREE.Euler()
  const scl = new THREE.Vector3()
  const apply = () => {
    const p = state.p
    for (const u of units) {
      for (let i = 0; i < u.n; i++) {
        const raw = Math.min(1, Math.max(0, (p - u.delay[i] * (1 - FLIGHT)) / FLIGHT))
        const e = 1 - Math.pow(1 - raw, 3)
        const j = i * 3
        pos.set(
          u.start[j] + (u.end[j] - u.start[j]) * e,
          u.start[j + 1] + (u.end[j + 1] - u.start[j + 1]) * e,
          u.start[j + 2] + (u.end[j + 2] - u.start[j + 2]) * e,
        )
        const turn = 1 - e
        eul.set(u.spin[j] * turn, u.spin[j + 1] * turn, u.spin[j + 2] * turn)
        quat.setFromEuler(eul)
        const s = raw <= 0 ? 0 : calm ? e : Math.min(1, 0.2 + raw * 2.4)
        scl.set(s, s, s)
        m.compose(pos, quat, scl)
        u.mesh.setMatrixAt(i, m)
      }
      u.mesh.instanceMatrix.needsUpdate = true
      // the ground comes with the first blocks
      const ground = Math.min(1, p * 5)
      u.inner.children[0].visible = u.inner.children[1].visible = ground > 0.001
      u.inner.children[1].scale.set(ground, 1, 1)
      ;((u.inner.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = ground
    }
  }
  apply()

  // while the room waits the two charts turn a very little, like things on a table
  gl.onFrame((time) => {
    const t0 = still ? 0 : time
    units.forEach((u, k) => {
      u.inner.rotation.y = Math.sin(t0 * 0.35 + k * 1.9) * 0.022 * state.sway
    })
  })

  return {
    gl: {
      ...gl,
      dispose() {
        for (const u of units) u.mesh.dispose()
        gl.dispose()
      },
    },
    rig,
    state,
    apply,
  }
}
