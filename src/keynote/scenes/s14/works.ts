'use client'

/**
 * THE STRUCTURE of slide 14: what "we build" and "we buy" add up to, as an object.
 *
 *   four tiers    navy glass with a seam of flame under each and its row's icon on its face:
 *                 strategy, models, platform and software, team. Ours: each is a different size.
 *   three slabs   plain grey, all alike, side by side: GPU, cloud, LLMs. Bought. They go UNDER.
 *   a moat        a ring of clear blue on the ground around it ("AI Moats")
 *   two outlines  the next two tiers, drawn in flame and not yet built ("Evolving & Compounding")
 *   a light       at the very top ("Creating Capability")
 *
 * Real meshes on a scene-owned canvas whose space is the stage's (three/sceneCanvas.ts: one
 * world unit is one --u). Everything hangs in `rig`, which is turned and tilted so that the
 * front, one side and the top of each block are seen. The timeline moves each piece's `group`
 * (in the rig's own space) and the plain numbers on the pieces; nothing here moves by itself
 * except a slow sway of the whole, which the timeline switches on once the tiers are home.
 */

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { SITE } from './data'
import { paintIcon, type IconName } from './icons'

/** The rig: tilted toward the room, turned a little to the left. */
export const TILT = 0.36
export const TURN = -0.6
/** A tier: its side (they taper upward), its height, the seam between two. */
export const TIER = { w: [7.6, 7.1, 6.6, 6.1], h: 3.5, gap: 0.3 }
/** A bought slab. */
export const SLAB = { w: 2.42, h: 2.4, d: 7.6, gap: 0.17 }
/** How far the tiers stand above the ground once the slabs are under them. */
export const RAISE = SLAB.h + TIER.gap

export interface Piece {
  /** Move, turn and scale THIS from the timeline (its rotation is ordered YXZ). */
  group: THREE.Group
  /** Where it belongs, in the space it lives in. */
  slot: THREE.Vector3
  /** 0 … 1 */
  opacity: number
  /** the flame seam under a tier: 0 dark … 1 lit … more, burning */
  glow: number
}

export interface Works {
  gl: SceneCanvas
  /** Everything stands in here: the timeline lowers and raises the whole site with the lists beside it. */
  site: THREE.Group
  /** The turned and tilted frame the structure hangs in: the timeline moves and scales it between its two stands (data.ts: EARLY, SITE). */
  rig: THREE.Group
  /** The four tiers live in here: it rises by RAISE when the slabs go under. */
  stack: THREE.Group
  /** The plan: each tier in outline where it will stand, until it is built. 0 … 1 each. */
  plan: { opacity: number }[]
  tiers: Piece[]
  slabs: Piece[]
  /** The plot on the ground, before anything stands on it. 0 … 1 */
  plot: { opacity: number }
  /** The moat: 0 not there … 1 drawn all the way round. */
  moat: { drawn: number }
  /** The next tiers, in outline: each 0 … 1, and how far it has risen into place (0 … 1). */
  next: { opacity: number; risen: number }[]
  /** The light at the top. 0 … 1 */
  light: { on: number }
  /** `amp`: how much the whole sways (0 while pieces fly: the timeline says). */
  idle: { amp: number }
  /** The direction of the room (the camera) in the stack's own space: a piece flies out toward it. */
  toRoom: THREE.Vector3
  /** A stage point (in --u) as a position in the stack's own space, `z` units toward the room. */
  local(u: number, v: number, z?: number): THREE.Vector3
  dispose(): void
}

function iconTexture(name: IconName, colour: string): THREE.CanvasTexture {
  const S = 384
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (g) paintIcon(g, name, S, colour, 1.5)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** The plot: a soft contact shadow and a hairline square, where the structure will stand. */
function plotTexture(): THREE.CanvasTexture {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (g) {
    const grad = g.createRadialGradient(S / 2, S / 2, S * 0.08, S / 2, S / 2, S / 2)
    grad.addColorStop(0, 'rgba(7, 26, 80, 0.17)')
    grad.addColorStop(0.45, 'rgba(7, 26, 80, 0.08)')
    grad.addColorStop(0.8, 'rgba(7, 26, 80, 0.02)')
    grad.addColorStop(1, 'rgba(7, 26, 80, 0)')
    g.fillStyle = grad
    g.fillRect(0, 0, S, S)
    g.strokeStyle = 'rgba(7, 26, 80, 0.34)'
    g.lineWidth = 2.5
    g.setLineDash([10, 9])
    const m = S * 0.19
    g.beginPath()
    g.roundRect(m, m, S - 2 * m, S - 2 * m, 22)
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function glowTexture(): THREE.CanvasTexture {
  const S = 256
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (g) {
    const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
    grad.addColorStop(0, 'rgba(255, 244, 236, 1)')
    grad.addColorStop(0.12, 'rgba(255, 170, 130, 0.95)')
    grad.addColorStop(0.4, 'rgba(241, 100, 67, 0.32)')
    grad.addColorStop(1, 'rgba(241, 100, 67, 0)')
    g.fillStyle = grad
    g.fillRect(0, 0, S, S)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

class Circle extends THREE.Curve<THREE.Vector3> {
  constructor(private readonly radius: number) {
    super()
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    // it starts at the front left, nearest the lists, and runs round clockwise from above
    const a = Math.PI * 0.75 + t * Math.PI * 2
    return target.set(Math.cos(a) * this.radius, 0, Math.sin(a) * this.radius)
  }
}

export function makeWorks(ctx: SceneCtx, build: IconName[], buy: IconName[]): Works {
  // a long lens: the structure stands near the edge of the stage, and a wide one would make it lean
  const gl = createSceneCanvas(ctx, { above: true, fov: 11, lights: false })
  const { scene } = gl
  scene.add(new THREE.HemisphereLight(0xe6eeff, 0xcfdcf2, 0.6))
  const key = new THREE.DirectionalLight(0xffffff, 2.3)
  key.position.set(-50, 70, 90)
  const rimLight = new THREE.DirectionalLight(0xa8c8ff, 0.7)
  rimLight.position.set(70, 10, 30)
  scene.add(key, rimLight)

  // the room the glass reflects: three's own studio, no picture needed
  const pmrem = new THREE.PMREMGenerator(gl.renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, 0.04)
  scene.environment = env.texture
  scene.environmentIntensity = 0.24

  const site = new THREE.Group()
  const rig = new THREE.Group()
  rig.position.copy(gl.at(SITE.x, SITE.ground))
  rig.rotation.set(TILT, TURN, 0)
  rig.scale.setScalar(SITE.scale)
  const sway = new THREE.Group()
  rig.add(sway)
  site.add(rig)
  scene.add(site)

  /* ---- the plot ---- */
  const plotMat = new THREE.MeshBasicMaterial({ map: plotTexture(), transparent: true, depthWrite: false, opacity: 0 })
  const plotMesh = new THREE.Mesh(new THREE.PlaneGeometry(17, 17), plotMat)
  plotMesh.rotation.x = -Math.PI / 2
  plotMesh.position.y = 0.01
  plotMesh.renderOrder = -2
  sway.add(plotMesh)

  /* ---- the four tiers ---- */
  const stack = new THREE.Group()
  sway.add(stack)
  const tiers: Piece[] = build.map((name, i) => {
    const w = TIER.w[i]
    const glass = new THREE.MeshPhysicalMaterial({ color: 0x06174f, roughness: 0.28, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.16, transparent: true })
    const flame = new THREE.MeshStandardMaterial({ color: 0xf16443, roughness: 0.45, emissive: 0xf16443, emissiveIntensity: 0.6, transparent: true })
    const mark = new THREE.MeshBasicMaterial({ map: iconTexture(name, '#ffe3d6'), transparent: true, depthWrite: false })
    const group = new THREE.Group()
    group.rotation.order = 'YXZ'
    const body = new THREE.Mesh(new RoundedBoxGeometry(w, TIER.h, w, 6, 0.42), glass)
    const seam = new THREE.Mesh(new THREE.BoxGeometry(w - 0.95, TIER.gap, w - 0.95), flame)
    seam.position.y = -(TIER.h + TIER.gap) / 2
    // the first tier stands on the ground until the slabs go under it: its seam comes with them
    if (i === 0) seam.visible = false
    const face = new THREE.Mesh(new THREE.PlaneGeometry(2.25, 2.25), mark)
    face.position.set(0, 0, w / 2 + 0.012)
    face.renderOrder = 2
    group.add(body, seam, face)
    stack.add(group)
    const slot = new THREE.Vector3(0, i * (TIER.h + TIER.gap) + TIER.h / 2, 0)
    group.position.copy(slot)
    let opacity = 1
    let glow = 1
    return {
      group,
      slot,
      get opacity() {
        return opacity
      },
      set opacity(v: number) {
        opacity = v
        glass.opacity = flame.opacity = mark.opacity = v
        group.visible = v > 0.002
      },
      get glow() {
        return glow
      },
      set glow(v: number) {
        glow = v
        flame.emissiveIntensity = 0.6 * v
        if (i === 0) seam.visible = v > 0.01
      },
    }
  })

  /* ---- the plan: each tier in outline, where it will stand ---- */
  const plan = build.map((_, i) => {
    const w = TIER.w[i]
    const mat = new THREE.LineBasicMaterial({ color: 0x071a50, transparent: true, opacity: 0 })
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w - 0.2, TIER.h - 0.1, w - 0.2)), mat)
    lines.position.set(0, i * (TIER.h + TIER.gap) + TIER.h / 2, 0)
    stack.add(lines)
    return {
      get opacity() {
        return mat.opacity / 0.3
      },
      set opacity(v: number) {
        mat.opacity = v * 0.3
        lines.visible = v > 0.002
      },
    }
  })

  /* ---- the three bought slabs ---- */
  const slabs: Piece[] = buy.map((name, j) => {
    const stone = new THREE.MeshStandardMaterial({ color: 0x9ea9bb, roughness: 0.8, metalness: 0.02, transparent: true })
    const mark = new THREE.MeshBasicMaterial({ map: iconTexture(name, '#f4f6fa'), transparent: true, depthWrite: false })
    const group = new THREE.Group()
    group.rotation.order = 'YXZ'
    const body = new THREE.Mesh(new RoundedBoxGeometry(SLAB.w, SLAB.h, SLAB.d, 4, 0.22), stone)
    const face = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 1.45), mark)
    face.position.set(0, 0, SLAB.d / 2 + 0.012)
    face.renderOrder = 2
    group.add(body, face)
    sway.add(group)
    const slot = new THREE.Vector3((j - 1) * (SLAB.w + SLAB.gap), SLAB.h / 2, 0)
    group.position.copy(slot)
    let opacity = 1
    return {
      group,
      slot,
      get opacity() {
        return opacity
      },
      set opacity(v: number) {
        opacity = v
        stone.opacity = mark.opacity = v
        group.visible = v > 0.002
      },
      glow: 0,
    }
  })

  /* ---- the moat ---- */
  const R = 7.6
  const SEG = 160
  const water = new THREE.Mesh(new THREE.RingGeometry(R - 1.15, R, SEG, 1, Math.PI * 0.75, Math.PI * 2), new THREE.MeshBasicMaterial({ color: 0x4384d4, transparent: true, opacity: 0.26, depthWrite: false, side: THREE.DoubleSide }))
  // a ring lies in XY: laid flat, its angle runs the other way round, so it is mirrored to run with the rim
  water.rotation.x = Math.PI / 2
  water.position.y = 0.03
  water.renderOrder = -1
  const rim = new THREE.Mesh(new THREE.TubeGeometry(new Circle(R), SEG, 0.075, 6, false), new THREE.MeshBasicMaterial({ color: 0x2d6ad1 }))
  rim.position.y = 0.06
  sway.add(water, rim)
  const moat = {
    _d: 0,
    get drawn() {
      return this._d
    },
    set drawn(v: number) {
      this._d = v
      const n = Math.round(Math.max(0, Math.min(1, v)) * SEG)
      water.geometry.setDrawRange(0, n * 6)
      rim.geometry.setDrawRange(0, n * 6 * 6)
      water.visible = rim.visible = n > 0
    },
  }
  moat.drawn = 0

  /* ---- the next tiers, in outline ---- */
  const top = TIER.w.length * (TIER.h + TIER.gap)
  const next = [5.6, 5.1].map((w, n) => {
    const h = 2.9
    const box = new THREE.BoxGeometry(w, h, w)
    const lines = new THREE.LineSegments(new THREE.EdgesGeometry(box), new THREE.LineBasicMaterial({ color: 0xf16443, transparent: true }))
    const fill = new THREE.Mesh(box, new THREE.MeshBasicMaterial({ color: 0xf16443, transparent: true, depthWrite: false }))
    const group = new THREE.Group()
    group.add(fill, lines)
    stack.add(group)
    const y = top + n * (h + TIER.gap) + h / 2
    const state = { o: 0, r: 0 }
    const apply = () => {
      ;(lines.material as THREE.LineBasicMaterial).opacity = state.o * 0.95
      ;(fill.material as THREE.MeshBasicMaterial).opacity = state.o * 0.045
      group.visible = state.o > 0.002
      group.position.y = y - (1 - state.r) * 2.2
    }
    apply()
    return {
      get opacity() {
        return state.o
      },
      set opacity(v: number) {
        state.o = v
        apply()
      },
      get risen() {
        return state.r
      },
      set risen(v: number) {
        state.r = v
        apply()
      },
    }
  })

  /* ---- the light at the top ---- */
  const glowMat = new THREE.SpriteMaterial({ map: glowTexture(), transparent: true, depthWrite: false, depthTest: false, opacity: 0 })
  const beacon = new THREE.Sprite(glowMat)
  beacon.position.y = top + 2 * (2.9 + TIER.gap) + 0.6
  beacon.renderOrder = 5
  stack.add(beacon)
  const light = {
    _on: 0,
    get on() {
      return this._on
    },
    set on(v: number) {
      this._on = v
      glowMat.opacity = Math.min(1, v)
      const s = 0.01 + v * 7.5
      beacon.scale.set(s, s, 1)
      beacon.visible = v > 0.002
    },
  }
  light.on = 0

  const plot = {
    get opacity() {
      return plotMat.opacity
    },
    set opacity(v: number) {
      plotMat.opacity = v
    },
  }

  site.updateMatrixWorld(true)
  const inverse = rig.quaternion.clone().invert()
  const toRoom = new THREE.Vector3(0, 0, 1).applyQuaternion(inverse)
  const local = (u: number, v: number, z = 0) => {
    site.updateMatrixWorld(true)
    return stack.worldToLocal(gl.at(u, v, z))
  }

  // the slow sway of the finished thing; a held frame and a visitor who asked for less motion get it still
  const idle = { amp: 0 }
  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    const t = still ? 0 : time
    sway.rotation.y = Math.sin(t * 0.32) * 0.07 * idle.amp
  })

  return {
    gl,
    site,
    rig,
    stack,
    plan,
    tiers,
    slabs,
    plot,
    moat,
    next,
    light,
    idle,
    toRoom,
    local,
    dispose() {
      env.texture.dispose()
      env.dispose()
      room.dispose()
      pmrem.dispose()
      gl.dispose()
    },
  }
}
