'use client'

/**
 * Slide 02's own three.js: six monoliths of glass standing on a floor that reflects them, in a
 * line that recedes from the left foreground into the room; a studio of soft boxes around
 * them; and a camera that begins close on A and draws back until the whole agenda stands in
 * the frame. The space is the stage's own (three/sceneCanvas.ts: one world unit is one --u at
 * z = 0), and the camera's last position is the stage's own camera, so that on the next beat a
 * letter block lands exactly on the row the DOM laid out for it.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { FOOT, makeStudio, MW, type MonoBuilt, type Studio } from './monolith'

export const FOV = 32
/** The stage camera's distance from the stage's plane. */
export const CAM = 28.125 / Math.tan((FOV * Math.PI) / 360)
/** The floor, in world units under the stage's centre line. */
const FLOOR = -10.5
/** The line-up: from A, near and to the left, to the last, far and to the right (world x and z). */
const FROM = { x: -29, z: 15 }
const TO = { x: 54.5, z: -11 }
/** A monolith's scale in the line-up (1 is 10u wide at the stage's plane). */
const SIZE = 1.2
/** THE FIRST REST'S CAMERA: above the line-up and a little to its left, looking down along it. */
const REST = { x: -12, y: 12.5, z: 97, lookX: 3.6, lookY: -2.6, lookZ: 0 }

/** Where a monolith stands at the first rest. */
export interface Stand {
  x: number
  y: number
  z: number
  ry: number
  s: number
}

export interface Stage {
  gl: SceneCanvas
  studio: Studio
  monos: MonoBuilt[]
  stands: Stand[]
  /** `p` 0 close on A … 1 the first rest, above the line-up; `q` 0 … 1 from there to the stage's own camera; `sway` how much it breathes while the room waits. */
  cam: { p: number; q: number; sway: number }
  /** `show` the floor (the shadows and reflections that lie on it), 0 … 1. */
  floor: { show: number }
  dispose(): void
}

function shadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 128
  const g = c.getContext('2d')
  if (g) {
    g.translate(128, 64)
    g.scale(1, 0.5)
    const grad = g.createRadialGradient(0, 0, 6, 0, 0, 128)
    // the shadow of coloured glass is coloured: a dark core, and round it the glass's own blue
    grad.addColorStop(0, 'rgba(10, 26, 90, 0.62)')
    grad.addColorStop(0.3, 'rgba(30, 70, 190, 0.3)')
    grad.addColorStop(0.65, 'rgba(47, 107, 255, 0.1)')
    grad.addColorStop(1, 'rgba(47, 107, 255, 0)')
    g.fillStyle = grad
    g.fillRect(-128, -128, 256, 256)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function makeStage(ctx: SceneCtx, items: { letter: string; name: string }[]): Stage {
  const gl = createSceneCanvas(ctx, { fov: FOV, above: true, lights: false })
  const studio = makeStudio(gl, 'light')
  const family = getComputedStyle(ctx.root).fontFamily
  const N = items.length

  // THE LINE-UP: evenly spaced along a line that recedes; each turned part of the way to the camera
  const base = Math.min(SIZE, (SIZE * 6.2) / N)
  const stands: Stand[] = items.map((_, i) => {
    const k = N > 1 ? i / (N - 1) : 0.5
    // further away the same step looks shorter: the steps grow a little, so the gaps on the screen stay even
    const x = FROM.x + (TO.x - FROM.x) * Math.pow(k, 1.08)
    const z = FROM.z + (TO.z - FROM.z) * k
    const ry = Math.atan2(REST.x - x, REST.z - z) * 0.45
    return { x, y: FLOOR + FOOT * base, z, ry, s: base }
  })

  const monos = items.map((item, i) => {
    const m = studio.mono({ letter: item.letter, name: item.name, family, mirror: true })
    const s = stands[i]
    m.group.position.set(s.x, s.y, s.z)
    m.group.rotation.y = s.ry
    m.group.scale.setScalar(s.s)
    gl.scene.add(m.group)
    return m
  })

  // THE FLOOR: it is not drawn; it is known by what lies on it
  const mirror = new THREE.Group()
  mirror.scale.y = -1
  mirror.position.y = FLOOR * 2
  gl.scene.add(mirror)
  const shadowGeo = new THREE.PlaneGeometry(1, 1)
  const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false })
  const shadows: THREE.Mesh[] = []
  monos.forEach((m, i) => {
    const s = stands[i]
    if (m.reflection) {
      m.reflection.position.set(s.x, s.y, s.z)
      m.reflection.rotation.y = s.ry
      m.reflection.scale.setScalar(s.s)
      mirror.add(m.reflection)
    }
    const sh = new THREE.Mesh(shadowGeo, shadowMat)
    sh.rotation.x = -Math.PI / 2
    sh.rotation.z = s.ry
    sh.position.set(s.x + 0.5 * s.s, FLOOR + 0.02, s.z - 0.4 * s.s)
    sh.scale.set(MW * 1.7 * s.s, 7.5 * s.s, 1)
    sh.renderOrder = -3
    shadows.push(sh)
    gl.scene.add(sh)
  })

  // THE CAMERA: close on A, a little to its left and low; then back, up and round to the first
  // rest's place above the line-up (p); and on the next beat down to the stage's own camera (q)
  const a = stands[0]
  const mid = a.y - (FOOT * base) / 2 + 2
  const path = new THREE.CatmullRomCurve3(
    [new THREE.Vector3(a.x - 7, mid - 4.5, a.z + 42), new THREE.Vector3(a.x + 2, mid + 4, a.z + 66), new THREE.Vector3(REST.x, REST.y, REST.z)],
    false,
    'centripetal',
  )
  const look0 = new THREE.Vector3(a.x + 4, mid - 0.6, a.z)
  const look1 = new THREE.Vector3(REST.lookX, REST.lookY, REST.lookZ)
  const home = new THREE.Vector3(0, 0, CAM)
  const origin = new THREE.Vector3(0, 0, 0)
  const cam = { p: 1, q: 0, sway: 0 }
  const floor = { show: 1 }
  const still = ctx.held || ctx.reduced
  const pos = new THREE.Vector3()
  const look = new THREE.Vector3()
  gl.onFrame((time) => {
    const p = Math.min(1, Math.max(0, cam.p))
    const q = Math.min(1, Math.max(0, cam.q))
    path.getPoint(p, pos)
    look.lerpVectors(look0, look1, p * p * (3 - 2 * p))
    const sw = still ? 0 : cam.sway
    pos.x += Math.sin(time * 0.23) * 1.3 * sw
    pos.y += Math.sin(time * 0.17 + 1) * 0.5 * sw
    pos.lerp(home, q)
    look.lerp(origin, q)
    gl.camera.position.copy(pos)
    gl.camera.lookAt(look)
    // the floor
    shadowMat.opacity = floor.show
    for (const sh of shadows) sh.visible = floor.show > 0.003
    for (const m of monos) m.reflect = floor.show
  })

  return {
    gl,
    studio,
    monos,
    stands,
    cam,
    floor,
    dispose() {
      studio.dispose()
      gl.dispose()
    },
  }
}
