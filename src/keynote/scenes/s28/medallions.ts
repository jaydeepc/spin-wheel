'use client'

/**
 * THE MANY AGENTS, as objects. The deck's four portraits are round badges; so every other agent
 * is a badge too, still blank: a thin cream medallion with a coloured rim, a real mesh in the
 * stage's own space (three/sceneCanvas.ts: at z = 0 one world unit is one --u).
 *
 *   field   some thirty of them, far in the room at the edges of the stage while one agent is
 *           being introduced; in the last beat they leave the edges and line up beside the words
 *           "and many more….", a queue that runs off into the distance.
 *   stars   four larger ones that wait in the cast's seats. Each in turn lifts off its seat,
 *           banks, flies toward the room and lands where the portrait then appears on its face.
 *
 * Everything the timeline drives is a plain number (Star.r, Star.opacity, Star.float, a group's
 * rotation, Field.gather / crowd / dim), so every frame is reachable by seeking.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'

const DEPTH = 0.07
const BEVEL = 0.1

export interface Star {
  /** Turn THIS from the timeline (its rotation). Its place is u, v, z below. */
  group: THREE.Group
  /** Where it is SEEN on the stage, in --u from the left and from the top, whatever its depth. */
  u: number
  v: number
  /** How far it has come toward the room, in world units (it grows as it comes). */
  z: number
  /** The medallion's radius, in --u (at z = 0). */
  r: number
  /** 0 … 1 */
  opacity: number
  /** 0 … 1: how much it floats while it waits in its seat. */
  float: number
  /** 0 … 1: the spark on its face (it goes before the portrait comes, so the two are never seen through each other). */
  spark: number
}

export interface Field {
  /** 0 … 1: the many arrive out of the depth of the room. */
  gather: number
  /** 0 at the edges of the stage … 1 in the queue. */
  crowd: number
  /** 0 … 1: how present they are. */
  dim: number
}

export interface Medals {
  gl: SceneCanvas
  stars: Star[]
  field: Field
}

/** Where a medallion of the field stands: a point on the stage (u, v in --u), how far behind it (z, world units), its radius as seen (in --u), how opaque. */
export interface Spot {
  u: number
  v: number
  z: number
  r: number
  o: number
}

/** A badge's ring and the tint of its face: flame on peach, the clear blue on ice, navy on a pale navy. */
const TONES = [
  { rim: 0xf16443, face: 0xfddccd },
  { rim: 0x4384d4, face: 0xd5e6fb },
  { rim: 0x10277a, face: 0xdde3f5 },
] as const

/** The deck's own sign for an AI agent (the four-point spark of its icons), cut as a shape of radius 1. */
function spark(): THREE.ShapeGeometry {
  const w = 0.17
  const sh = new THREE.Shape()
  sh.moveTo(0, 1)
  sh.quadraticCurveTo(w, w, 1, 0)
  sh.quadraticCurveTo(w, -w, 0, -1)
  sh.quadraticCurveTo(-w, -w, -1, 0)
  sh.quadraticCurveTo(-w, w, 0, 1)
  return new THREE.ShapeGeometry(sh, 10)
}

function disc(): THREE.ExtrudeGeometry {
  const shape = new THREE.Shape()
  shape.absarc(0, 0, 1 - BEVEL, 0, Math.PI * 2, false)
  // the bevel belongs to the "side" material: seen from the front it is the badge's coloured ring
  const g = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: true, bevelThickness: 0.04, bevelSize: BEVEL, bevelSegments: 6, curveSegments: 80 })
  g.translate(0, 0, -DEPTH / 2)
  return g
}

/** A small repeatable random: the field is the same on every visit and after every resize. */
function seeded(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

interface Body {
  group: THREE.Group
  body: THREE.Group
  face: THREE.MeshStandardMaterial
  rim: THREE.MeshStandardMaterial
  line: THREE.MeshBasicMaterial
  shade: THREE.MeshBasicMaterial
}

/** A soft shadow under a badge: it floats a little off the page. */
function shadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  if (g) {
    const grad = g.createRadialGradient(64, 64, 22, 64, 64, 64)
    grad.addColorStop(0, 'rgba(20, 36, 96, 0.3)')
    grad.addColorStop(0.5, 'rgba(20, 36, 96, 0.12)')
    grad.addColorStop(1, 'rgba(20, 36, 96, 0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 128, 128)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makeMedals(ctx: SceneCtx, home: Spot[], crowd: Spot[], stars: number): Medals {
  const gl = createSceneCanvas(ctx, { fov: 30 })
  const CAM = gl.camera.position.z
  const geo = disc()
  const sparkGeo = spark()
  const shadeGeo = new THREE.PlaneGeometry(3.1, 3.1)
  const shadeTex = shadowTexture()
  // a little light of the room on every face, so that no badge is ever grey
  gl.scene.add(new THREE.AmbientLight(0xffffff, 0.55))

  const make = (tone: (typeof TONES)[number]): Body => {
    const face = new THREE.MeshStandardMaterial({ color: tone.face, roughness: 0.7, metalness: 0, transparent: true, emissive: tone.face, emissiveIntensity: 0.22 })
    const rim = new THREE.MeshStandardMaterial({ color: tone.rim, roughness: 0.34, metalness: 0.08, transparent: true, emissive: tone.rim, emissiveIntensity: 0.3 })
    const line = new THREE.MeshBasicMaterial({ color: tone.rim, transparent: true, depthWrite: false })
    const group = new THREE.Group()
    const body = new THREE.Group()
    const mesh = new THREE.Mesh(geo, [face, rim])
    const ring = new THREE.Mesh(sparkGeo, line)
    ring.scale.setScalar(0.4)
    ring.position.z = DEPTH / 2 + 0.04 + 0.006
    body.add(mesh, ring)
    const shade = new THREE.MeshBasicMaterial({ map: shadeTex, transparent: true, depthWrite: false })
    const shadow = new THREE.Mesh(shadeGeo, shade)
    shadow.position.set(0.05, -0.2, -0.3)
    shadow.renderOrder = -1
    group.add(shadow, body)
    gl.scene.add(group)
    return { group, body, face, rim, line, shade }
  }
  const show = (b: Body, o: number, spark = 1) => {
    b.face.opacity = b.rim.opacity = o
    b.line.opacity = o * 0.92 * spark
    b.shade.opacity = o * o
    b.group.visible = o > 0.004
  }

  /* ---- the field ---- */
  const rnd = seeded(2806)
  const n = Math.min(home.length, crowd.length)
  const many = Array.from({ length: n }, (_, i) => ({
    b: make(TONES[i % 5 === 0 ? 2 : i % 2]),
    late: rnd() * 0.45,
    p1: rnd() * Math.PI * 2,
    p2: rnd() * Math.PI * 2,
    speed: 0.7 + rnd() * 0.6,
  }))
  const field: Field = { gather: 0, crowd: 0, dim: 1 }
  /** A spot as a world position and a world radius: what is seen at (u, v) with radius r, from z behind the stage. */
  const world = (s: Spot) => {
    const k = (CAM - s.z) / CAM
    return { x: (s.u - 50) * k, y: (28.125 - s.v) * k, z: s.z, r: s.r * k, o: s.o }
  }
  const A = home.slice(0, n).map(world)
  const B = crowd.slice(0, n).map(world)

  /* ---- the four stars ---- */
  const starBodies = Array.from({ length: stars }, () => make(TONES[0]))
  const starList: Star[] = starBodies.map((b) => {
    let r = 1
    let opacity = 0
    let sparkOn = 1
    const at = { u: 50, v: 28.125, z: 0 }
    // the place it is seen at stays (u, v) while it comes toward the room: a path drawn on the stage is the path flown
    const put = () => {
      const k = (CAM - at.z) / CAM
      b.group.position.set((at.u - 50) * k, (28.125 - at.v) * k, at.z)
    }
    show(b, 0)
    return {
      group: b.group,
      float: 1,
      get u() {
        return at.u
      },
      set u(x: number) {
        at.u = x
        put()
      },
      get v() {
        return at.v
      },
      set v(x: number) {
        at.v = x
        put()
      },
      get z() {
        return at.z
      },
      set z(x: number) {
        at.z = x
        put()
      },
      get r() {
        return r
      },
      set r(v: number) {
        r = v
        b.group.scale.setScalar(Math.max(v, 0.0001))
      },
      get opacity() {
        return opacity
      },
      set opacity(v: number) {
        opacity = v
        show(b, v, sparkOn)
      },
      get spark() {
        return sparkOn
      },
      set spark(v: number) {
        sparkOn = v
        show(b, opacity, v)
      },
    }
  })

  // A held frame (a hold URL) and a visitor who asked for less motion get the still pose.
  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    const t0 = still ? 0 : time
    many.forEach((m, i) => {
      const a = A[i]
      const c = B[i]
      const g = smooth(field.gather * 1.45 - m.late)
      const k = smooth(field.crowd * 1.45 - m.late)
      const z = a.z + (c.z - a.z) * k - (1 - g) * 120
      const r = a.r + (c.r - a.r) * k
      // on the way from the edge to its place in the queue it comes a little toward the room
      const arc = Math.sin(k * Math.PI)
      m.b.group.position.set(a.x + (c.x - a.x) * k, a.y + (c.y - a.y) * k - (1 - g) * 5, z + arc * 9)
      m.b.group.scale.setScalar(r)
      m.b.body.position.y = Math.sin(t0 * 0.55 * m.speed + m.p1) * 0.16
      m.b.body.rotation.y = Math.sin(t0 * 0.42 * m.speed + m.p2) * 0.42
      m.b.body.rotation.x = Math.cos(t0 * 0.36 * m.speed + m.p1) * 0.2
      show(m.b, (a.o + (c.o - a.o) * k) * g * field.dim)
    })
    starBodies.forEach((b, i) => {
      const f = starList[i].float
      b.body.position.y = Math.sin(t0 * 0.9 + i * 1.7) * 0.05 * f
      b.body.rotation.y = Math.sin(t0 * 0.6 + i * 2.1) * 0.3 * f
      b.body.rotation.x = Math.cos(t0 * 0.5 + i * 1.3) * 0.12 * f
    })
  })

  return { gl, stars: starList, field }
}
