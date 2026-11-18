'use client'

/**
 * SCENE-OWNED three.js. A scene that wants real 3D of its own asks for a canvas here, inside
 * its `three(ctx)` hook, and returns the canvas's `dispose`:
 *
 *   three(ctx) {
 *     const gl = createSceneCanvas(ctx)
 *     const tile = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 1), new THREE.MeshStandardMaterial({ color: '#fff' }))
 *     tile.position.copy(gl.at(20, 30))      // 20u from the stage's left, 30u from its top
 *     gl.scene.add(tile)
 *     ctx.bag.tile = tile                    // build(ctx) tweens tile.position / tile.rotation on the timeline
 *     return gl.dispose
 *   }
 *
 * THE WORLD IS THE STAGE. At z = 0 one world unit is one --u, the origin is the stage's centre,
 * x runs right and y runs UP: the stage is 100 wide and 56.25 high. So a mesh at gl.at(u, v)
 * sits exactly over the DOM element at left: u, top: v, and a mesh 6 units wide is 6u wide.
 * Bring a mesh toward the camera (z > 0) and it grows; push it back and it shrinks: real
 * perspective.
 *
 * The canvas is transparent, covers the stage, takes no pointer events, and is drawn under the
 * scene's DOM unless you ask for `above`. It renders every frame while the page is visible
 * (cheap scenes only: a few dozen meshes), and is torn down completely on dispose: geometries,
 * materials, textures, the context itself.
 */

import * as THREE from 'three'
import gsap from 'gsap'
import type { SceneCtx } from '../core/types'

export interface SceneCanvasOptions {
  /** Where to put the canvas. Default: the scene's root. */
  into?: HTMLElement
  /** Draw over the scene's DOM instead of under it. */
  above?: boolean
  /** The camera's vertical field of view in degrees. Smaller is flatter. Default 30. */
  fov?: number
  /** Default true. */
  antialias?: boolean
  /** Add the keynote's standard lights (a soft sky light, a warm key, a cool rim). Default true. */
  lights?: boolean
}

export interface SceneCanvas {
  renderer: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  canvas: HTMLCanvasElement
  /** The stage point (u from the left, v from the top, both in --u) as a world position at depth z. */
  at(u: number, v: number, z?: number): THREE.Vector3
  /** Called before every frame is drawn: `time` in seconds since the canvas was made, `dt` since the last frame. */
  onFrame(fn: (time: number, dt: number) => void): void
  /** Draw one frame now (build() may call it after setting starting states). */
  render(): void
  dispose(): void
}

let webgl: boolean | null = null

/** Is there WebGL on this machine at all? Asked once, quietly (three.js would say so with an error in the console). */
export function hasWebGL(): boolean {
  if (webgl === null) {
    try {
      const probe = document.createElement('canvas')
      const gl = probe.getContext('webgl2') || probe.getContext('webgl')
      webgl = !!gl
      ;(gl as WebGLRenderingContext | null)?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      webgl = false
    }
  }
  return webgl
}

/** Thrown by createSceneCanvas() where there is no WebGL: the scene goes on with its DOM fallback. */
export class NoWebGL extends Error {
  constructor() {
    super('no WebGL here')
  }
}

export function createSceneCanvas(ctx: SceneCtx, opts: SceneCanvasOptions = {}): SceneCanvas {
  if (!hasWebGL()) throw new NoWebGL()
  const host = opts.into ?? ctx.root
  const canvas = document.createElement('canvas')
  canvas.className = 'kn-gl' + (opts.above ? ' kn-gl--above' : '')
  canvas.setAttribute('aria-hidden', 'true')
  if (opts.above) host.appendChild(canvas)
  else host.insertBefore(canvas, host.firstChild)

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: opts.antialias ?? true, premultipliedAlpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(ctx.W, ctx.H, false)
  renderer.setClearColor(0x000000, 0)

  const fov = opts.fov ?? 30
  const camera = new THREE.PerspectiveCamera(fov, 16 / 9, 1, 2000)
  camera.position.set(0, 0, 28.125 / Math.tan((fov * Math.PI) / 360))
  camera.lookAt(0, 0, 0)

  const scene = new THREE.Scene()
  if (opts.lights ?? true) {
    scene.add(new THREE.HemisphereLight(0xffffff, 0xdfe8f7, 1.5))
    const key = new THREE.DirectionalLight(0xfff1e8, 1.6)
    key.position.set(-30, 40, 60)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0x9cc8ff, 0.9)
    rim.position.set(50, -20, 30)
    scene.add(rim)
  }

  const fns: ((time: number, dt: number) => void)[] = []
  let time = 0
  let dead = false
  const render = () => {
    if (!dead) renderer.render(scene, camera)
  }
  const tick = (_t: number, deltaMs: number) => {
    if (dead || document.visibilityState !== 'visible') return
    const dt = Math.min(deltaMs, 100) / 1000
    time += dt
    for (const fn of fns) fn(time, dt)
    renderer.render(scene, camera)
  }
  gsap.ticker.add(tick)
  // when the director PUTS the playhead somewhere (an arrival, a hold URL, a resize) the canvas
  // is drawn at once, so it is never blank or a frame behind on its first paint
  ctx.onSeek(() => {
    if (dead) return
    for (const fn of fns) fn(time, 0)
    renderer.render(scene, camera)
  })

  return {
    renderer,
    scene,
    camera,
    canvas,
    at: (u, v, z = 0) => new THREE.Vector3(u - 50, 28.125 - v, z),
    onFrame: (fn) => {
      fns.push(fn)
    },
    render,
    dispose() {
      if (dead) return
      dead = true
      gsap.ticker.remove(tick)
      scene.traverse((o) => {
        const m = o as THREE.Mesh
        m.geometry?.dispose()
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
        for (const mat of mats) {
          for (const v of Object.values(mat)) if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose()
          mat.dispose()
        }
      })
      renderer.dispose()
      renderer.forceContextLoss()
      canvas.remove()
    },
  }
}

export { THREE }
