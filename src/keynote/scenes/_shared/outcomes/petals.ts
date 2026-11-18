'use client'

/**
 * The five petals as objects: slabs of frosted acrylic, peach and pale blue, cut to the deck's
 * own outlines, with a polished bevel that catches the room's light and a soft shadow under
 * each. Real meshes in the stage's own space (three/sceneCanvas.ts: one world unit is one --u),
 * on a canvas UNDER the scene's DOM: the white disc, the badges and the words are DOM and lie
 * over them, so a petal can come out from under the disc.
 *
 * A petal's FRONT FACE lies exactly on the stage's plane (z = 0) when it rests, so the DOM words
 * set over it are in register at every screen size.
 *
 * The timeline never touches a mesh. It tweens the plain numbers in `petal.s`; every frame (and
 * every time the director puts the playhead somewhere) they are applied to the objects.
 */

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../../kit'
import { DISC, OUTCOMES, type Outcome } from './data'

/** The slab: how thick, and how wide its polished edge is, in --u. */
// The straight wall between the two bevels is kept almost nil: a wall of any height is seen from
// the middle of the stage as a dark sliver along every edge that faces the centre (the camera
// looks from there), a pixel or two wide and stair-stepped. The slab's body is its two round
// bevels, back to back: a lens of acrylic, about half a unit thick.
const DEPTH = 0.03
const BEVEL = 0.34
const BEVEL_DEPTH = 0.26
/** A resting petal lets a little of the room through. */
const BODY = 0.94

export interface PetalState {
  /** 0 … 1: the petal and its shadow. */
  opacity: number
  /** How far it is still drawn in under the disc, along its own radius, in --u. 0 when it rests. */
  slide: number
  /** Its tip lifted off the stage about the hinge at the ring, in radians: negative toward the room. 0 when it rests. */
  tilt: number
  /** A turn about its own radius, in radians. 0 when it rests. */
  twist: number
  /** The whole petal turned about the disc's centre, in radians (the fan of slide 32). 0 when it rests. */
  fan: number
  /** How far behind the stage's plane it lies, in --u (the fan's leaves lie under one another). 0 when it rests. */
  back: number
  /** Its size about its own centre. 1 when it rests. */
  scale: number
  /** 0 … 1: it has the word: its colour deepens and the room's reflections in it grow. */
  lit: number
  /** 0 … 1: it stands back (another petal has the word). */
  dim: number
}

export interface Petal {
  outcome: Outcome
  /** What the timeline tweens. */
  s: PetalState
}

export interface Petals {
  gl: SceneCanvas
  petals: Petal[]
  /** `amp`: how much the petals breathe while the room waits (0 … 1). */
  idle: { amp: number }
  /** The light that travels over the petals: where it is (stage --u) and how strong (0 … 1). */
  lamp: { x: number; y: number; power: number }
  dispose(): void
}

const TONES = {
  peach: { near: '#ffd3c1', mid: '#ffb79d', far: '#ffa082', deep: [1, 0.84, 0.77], shade: 'rgba(120, 52, 30, 0.36)' },
  ice: { near: '#d6edff', mid: '#b3dcfc', far: '#94c9f6', deep: [0.78, 0.9, 1], shade: 'rgba(24, 58, 120, 0.33)' },
} as const

interface Local {
  /** The outline about the hinge, x right, y UP. */
  pts: THREE.Vector2[]
  minX: number
  minY: number
  w: number
  h: number
  /** The outward radius, as a unit vector (y up). */
  rx: number
  ry: number
}

function local(o: Outcome): Local {
  const [bx, by] = o.badge
  const pts: THREE.Vector2[] = []
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (let i = 0; i < o.outline.length; i += 2) {
    const x = o.outline[i] - bx
    const y = -(o.outline[i + 1] - by)
    pts.push(new THREE.Vector2(x, y))
    minX = Math.min(minX, x)
    maxX = Math.max(maxX, x)
    minY = Math.min(minY, y)
    maxY = Math.max(maxY, y)
  }
  const a = (o.angle * Math.PI) / 180
  return { pts, minX, minY, w: maxX - minX, h: maxY - minY, rx: Math.cos(a), ry: -Math.sin(a) }
}

/** The slab, its front face on z = 0, its silhouette exactly the outline. */
function slab(l: Local): THREE.BufferGeometry {
  const shape = new THREE.Shape(l.pts)
  const raw = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL_DEPTH,
    bevelSize: BEVEL,
    bevelOffset: -BEVEL,
    bevelSegments: 5,
    curveSegments: 1,
  })
  raw.translate(0, 0, -(DEPTH + BEVEL_DEPTH))
  // one picture over the whole petal: u, v from the outline's own box
  const pos = raw.attributes.position
  const uv = raw.attributes.uv
  for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) - l.minX) / l.w, (pos.getY(i) - l.minY) / l.h)
  // a round bevel, a crisp rim: smooth normals except across a real crease
  const smooth = toCreasedNormals(raw, Math.PI / 3.2)
  raw.dispose()
  return smooth
}

/** The petal's colour: lightest where it meets the ring (the light comes from the centre), full at its tip. */
function colourMap(l: Local, tone: keyof typeof TONES): THREE.CanvasTexture {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  const t = TONES[tone]
  if (g) {
    const px = (x: number) => ((x - l.minX) / l.w) * S
    const py = (y: number) => (1 - (y - l.minY) / l.h) * S
    const reach = Math.max(l.w, l.h) * 1.02
    const grad = g.createLinearGradient(px(0), py(0), px(l.rx * reach), py(l.ry * reach))
    grad.addColorStop(0, t.near)
    grad.addColorStop(0.42, t.mid)
    grad.addColorStop(1, t.far)
    g.fillStyle = grad
    g.fillRect(0, 0, S, S)
    // the light through it: a soft bloom a third of the way out
    const cx = px(l.rx * reach * 0.3)
    const cy = py(l.ry * reach * 0.3)
    const bloom = g.createRadialGradient(cx, cy, 0, cx, cy, S * 0.55)
    bloom.addColorStop(0, 'rgba(255, 255, 255, 0.22)')
    bloom.addColorStop(1, 'rgba(255, 255, 255, 0)')
    g.fillStyle = bloom
    g.fillRect(0, 0, S, S)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/** How much room the shadow's picture leaves around the outline, in --u. */
const PAD = 3.2

/** The petal's own silhouette, blurred: a contact shadow that keeps the petal's shape. */
function shadowMap(l: Local, tone: keyof typeof TONES): THREE.CanvasTexture {
  const W = l.w + PAD * 2
  const H = l.h + PAD * 2
  const k = 256 / Math.max(W, H)
  const c = document.createElement('canvas')
  c.width = Math.ceil(W * k)
  c.height = Math.ceil(H * k)
  const g = c.getContext('2d')
  if (g) {
    // the shape is drawn far off the canvas; only its blurred shadow falls on it
    const OFF = 4000
    g.shadowColor = TONES[tone].shade
    g.shadowBlur = 2.1 * k
    g.shadowOffsetX = OFF
    g.shadowOffsetY = 0
    g.fillStyle = '#000'
    g.beginPath()
    l.pts.forEach((p, i) => {
      const x = (p.x - l.minX + PAD) * k - OFF
      const y = (l.h - (p.y - l.minY) + PAD) * k
      if (i) g.lineTo(x, y)
      else g.moveTo(x, y)
    })
    g.closePath()
    g.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makePetals(ctx: SceneCtx): Petals {
  const gl = createSceneCanvas(ctx, { lights: false })
  const { scene, renderer } = gl
  // The petals' rims lie beside the DOM's perfectly clean disc and badges, so they are drawn
  // finer than the screen where the screen is coarse: twice over on a 1920 or 1366 screen, never
  // more than 3840 across, never more than the keynote's cap of 2.
  renderer.setPixelRatio(Math.min(2, Math.max(window.devicePixelRatio || 1, 3840 / ctx.W)))
  renderer.setSize(ctx.W, ctx.H, false)

  // THE ROOM'S LIGHT. A soft sky, a warm key from the upper left, a cool rim from the lower
  // right; and a studio around it, so that the polished bevels have something to reflect.
  scene.add(new THREE.HemisphereLight(0xffffff, 0xf3e9e4, 1.45))
  const key = new THREE.DirectionalLight(0xfff4ec, 1.0)
  key.position.set(-40, 55, 80)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xbfdcff, 0.4)
  rim.position.set(60, -30, 40)
  scene.add(rim)
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, 0.04)
  room.dispose()

  // the travelling light
  const bulb = new THREE.PointLight(0xfff6ef, 0, 70, 1.6)
  scene.add(bulb)
  const lamp = { x: 50, y: 28, power: 0 }

  const idle = { amp: 0 }
  const origin = gl.at(DISC.cx, DISC.cy)

  const parts = OUTCOMES.map((o, i) => {
    const l = local(o)
    const phi = Math.atan2(l.ry, l.rx)
    const t = TONES[o.tone]
    const mat = new THREE.MeshPhysicalMaterial({
      map: colourMap(l, o.tone),
      roughness: 0.34,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.3,
      envMap: env.texture,
      envMapIntensity: 0.22,
      transparent: true,
      opacity: 0,
    })
    const shade = new THREE.MeshBasicMaterial({ map: shadowMap(l, o.tone), transparent: true, depthWrite: false, opacity: 0 })

    // orbit (the disc's centre) → hinge (the badge, on the ring; +x is the petal's own radius)
    //   → flap (the tilt about the hinge) → body (the idle breath) → the slab, turned back upright
    const orbit = new THREE.Group()
    orbit.position.copy(origin)
    const hinge = new THREE.Group()
    hinge.rotation.z = phi
    const flap = new THREE.Group()
    const body = new THREE.Group()
    const mesh = new THREE.Mesh(slab(l), mat)
    mesh.rotation.z = -phi
    mesh.renderOrder = 1
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(l.w + PAD * 2, l.h + PAD * 2), shade)
    shadow.rotation.z = -phi
    shadow.renderOrder = 0
    body.add(mesh)
    flap.add(body)
    hinge.add(shadow, flap)
    orbit.add(hinge)
    scene.add(orbit)

    // in the hinge's own frame: the petal's centre, and where the shadow's picture belongs
    const turn = (x: number, y: number) => new THREE.Vector2(x * Math.cos(-phi) - y * Math.sin(-phi), x * Math.sin(-phi) + y * Math.cos(-phi))
    const centre = turn(o.centroid[0] - o.badge[0], -(o.centroid[1] - o.badge[1]))
    const box = turn(l.minX + l.w / 2, l.minY + l.h / 2)
    const drop = turn(0.3, -0.95)
    const hx = o.badge[0] - DISC.cx
    const hy = -(o.badge[1] - DISC.cy)

    const s: PetalState = { opacity: 0, slide: 0, tilt: 0, twist: 0, fan: 0, back: 0, scale: 1, lit: 0, dim: 0 }
    const apply = (time: number) => {
      const on = s.opacity > 0.002
      orbit.visible = on
      if (!on) return
      orbit.rotation.z = s.fan
      orbit.position.z = origin.z - s.back
      // the hinge slides along its own radius; the fan turns the whole petal about the disc's centre
      hinge.position.set(hx - l.rx * s.slide, hy - l.ry * s.slide, 0)
      flap.rotation.set(s.twist, s.tilt, 0)
      flap.scale.setScalar(s.scale)
      flap.position.set(centre.x * (1 - s.scale), centre.y * (1 - s.scale), 0)
      // the breath: a few hundredths of a turn, enough for the light to move on the bevel
      const a = idle.amp
      body.rotation.set(Math.sin(time * 0.52 + i * 1.7) * 0.05 * a, Math.cos(time * 0.43 + i * 2.3) * 0.06 * a, 0)
      const flat = Math.max(0, 1 - Math.abs(s.tilt) * 0.95)
      mat.opacity = BODY * s.opacity * (1 - 0.55 * s.dim)
      // lit: its own colour, deeper (a pastel that is simply made brighter turns to cream)
      mat.color.setRGB(1 + (t.deep[0] - 1) * s.lit, 1 + (t.deep[1] - 1) * s.lit, 1 + (t.deep[2] - 1) * s.lit)
      mat.envMapIntensity = 0.22
      shade.opacity = s.opacity * (1 - 0.7 * s.dim) * flat * (0.9 + 0.5 * s.lit)
      const grow = 1 + (s.scale - 1) * 2.4
      shadow.scale.setScalar(grow)
      shadow.position.set(box.x + drop.x * grow, box.y + drop.y * grow, -(DEPTH + BEVEL_DEPTH) - 0.25)
    }
    return { petal: { outcome: o, s } as Petal, apply }
  })

  // Everything is compiled and uploaded NOW, while the stage is still changing scenes, and not
  // on the frame a petal first shows (slide 32 shows all five at once, in the middle of a move).
  renderer.compile(scene, gl.camera)

  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    const t0 = still ? 0 : time
    for (const p of parts) p.apply(t0)
    // low over the petals and not strong: it barely brightens them, but their clear coat throws
    // it back as one small, sharp glint that travels with it
    bulb.position.copy(gl.at(lamp.x, lamp.y, 8))
    bulb.intensity = lamp.power * 15
  })

  return {
    gl,
    petals: parts.map((p) => p.petal),
    idle,
    lamp,
    dispose() {
      env.dispose()
      pmrem.dispose()
      gl.dispose()
    },
  }
}
