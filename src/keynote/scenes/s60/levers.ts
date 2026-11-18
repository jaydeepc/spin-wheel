'use client'

/**
 * Slide 60's own three.js: ONE console. A deck of navy anodised metal runs under all four
 * cards; four levers stand in it, each in a steel-rimmed slot on its own inlaid plate; a fine
 * channel runs from every slot along the deck and out of its right end into the panel.
 * Off, a lever's arm leans down and its grip is bare steel. Pulled, it leans up, the grip turns
 * flame, the slot fills with light behind it, and the light runs on: up into the channel and
 * along it to the panel that measures.
 *
 * The camera is very long (a 3 degree lens): the four levers are seen exactly alike, head-on,
 * wherever on the stage they stand. The space is still the stage's own (one world unit is one
 * --u at z = 0).
 *
 * The timeline moves, per lever: `arm.rotation.x`, `state.on` (0 steel … 1 flame; over 1 a
 * flare) and `state.flow` (0 … 1: the light leaving the slot and running the channel); and
 * `deck.position.y` on arrival. What follows from them is worked out every frame from those
 * numbers, so a held frame is always whole.
 */

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { ARM, cardX, G, LEAN } from './data'

export interface LeverBuilt {
  /** The arm: `rotation.x` = +LEAN is off (down), -LEAN is on (up). */
  arm: THREE.Group
  /** on: 0 bare steel … 1 flame (more: a flare). flow: 0 … 1, the light on its way to the panel. */
  state: { on: number; flow: number }
}

export interface Levers {
  gl: SceneCanvas
  /** The whole console: `position.y` lifts it in with the cards. */
  deck: THREE.Group
  levers: LeverBuilt[]
  dispose(): void
}

/** A soft patch, white to nothing: a shade (tinted dark) or a light (added). */
function softTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 64
  const g = c.getContext('2d')
  if (g) {
    g.translate(64, 32)
    g.scale(1, 0.5)
    const grad = g.createRadialGradient(0, 0, 4, 0, 0, 64)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.5, 'rgba(255,255,255,0.4)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(-64, -64, 128, 128)
  }
  return new THREE.CanvasTexture(c)
}

const STEEL = new THREE.Color('#aeb8cc')
const FLAME = new THREE.Color('#f0572f')
const LIGHT = '#ff7a4d'

export function makeLevers(ctx: SceneCtx, count: number): Levers {
  const gl = createSceneCanvas(ctx, { fov: 3 })
  const { scene, renderer, camera } = gl
  // a long lens stands far away: keep the depth range tight around the stage's plane
  camera.near = camera.position.z - 60
  camera.far = camera.position.z + 60
  camera.updateProjectionMatrix()

  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, 0.03)
  scene.environment = env.texture
  scene.environmentIntensity = 0.6

  const X = (u: number) => u - 50
  const Y = (v: number) => 28.125 - v
  const deck = new THREE.Group()
  scene.add(deck)

  /* ---- the deck, and the tab that plugs it into the panel ---- */
  const deckMat = new THREE.MeshStandardMaterial({ color: '#04113a', roughness: 0.7, metalness: 0.2, envMapIntensity: 0.35 })
  const deckW = G.deckX1 - G.deckX0
  const deckH = G.deckBot - G.deckTop
  const slab = new THREE.Mesh(new RoundedBoxGeometry(deckW, deckH, 1.8, 5, 0.6), deckMat)
  slab.position.set(X((G.deckX0 + G.deckX1) / 2), Y((G.deckTop + G.deckBot) / 2), -0.9)
  const tab = new THREE.Mesh(new RoundedBoxGeometry(3, 2.2, 1.2, 4, 0.35), deckMat)
  tab.position.set(X(G.deckX1 + 0.6), Y(G.busV), -0.7)
  deck.add(slab, tab)

  /* ---- shared pieces ---- */
  const plateGeo = new RoundedBoxGeometry(11.2, 9.0, 0.3, 4, 0.55)
  const plateMat = new THREE.MeshStandardMaterial({ color: '#071a52', roughness: 0.55, metalness: 0.3, envMapIntensity: 0.5 })
  const rimGeo = new RoundedBoxGeometry(1.42, G.slotH + 0.28, 0.2, 4, 0.69)
  const steelMat = new THREE.MeshStandardMaterial({ color: '#e4e9f3', roughness: 0.22, metalness: 1 })
  const rimMat = new THREE.MeshStandardMaterial({ color: '#8793b4', roughness: 0.35, metalness: 0.9 })
  const slotGeo = new RoundedBoxGeometry(1.14, G.slotH, 0.2, 4, 0.55)
  const darkMat = new THREE.MeshStandardMaterial({ color: '#020820', roughness: 0.85, metalness: 0.1, envMapIntensity: 0.1 })
  const glowGeo = new THREE.PlaneGeometry(0.5, 1)
  glowGeo.translate(0, 0.5, 0)
  const tickGeo = new THREE.BoxGeometry(0.9, 0.1, 0.04)
  const tickMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.4 })
  const shaftGeo = new THREE.CylinderGeometry(0.3, 0.36, ARM, 28)
  shaftGeo.rotateX(Math.PI / 2)
  shaftGeo.translate(0, 0, ARM / 2)
  const bootGeo = new THREE.SphereGeometry(0.72, 28, 18)
  const bootMat = new THREE.MeshStandardMaterial({ color: '#1a2140', roughness: 0.5, metalness: 0.45 })
  const GRIP_R = 0.98
  const GRIP_L = 5.4
  const gripGeo = new THREE.CapsuleGeometry(GRIP_R, GRIP_L, 12, 36)
  gripGeo.rotateZ(Math.PI / 2)
  const collarGeo = new THREE.CylinderGeometry(GRIP_R + 0.07, GRIP_R + 0.07, 0.3, 36)
  collarGeo.rotateZ(Math.PI / 2)
  const unitGeo = new THREE.PlaneGeometry(1, 1)
  const soft = softTexture()

  /* ---- the channel: a dark groove along the deck, out through the tab ---- */
  const CH = 0.28
  const busEnd = X(G.panelX)
  const cx0 = X(cardX(0) + G.cardW / 2)
  const groove = new THREE.Mesh(unitGeo, new THREE.MeshBasicMaterial({ color: '#020820' }))
  groove.scale.set(busEnd - cx0 + CH, CH, 1)
  groove.position.set((busEnd + cx0) / 2, Y(G.busV), 0.02)
  deck.add(groove)

  const yPivot = Y(G.pivotV)
  const slotTop = yPivot + G.slotH / 2
  const stubLen = Y(G.busV) - slotTop + 0.2
  const levers: LeverBuilt[] = []
  const live: (() => void)[] = []

  for (let i = 0; i < count; i++) {
    const cx = X(cardX(i) + G.cardW / 2)
    const body = new THREE.Group()
    body.position.set(cx, yPivot, 0)
    deck.add(body)

    const plate = new THREE.Mesh(plateGeo, plateMat)
    const rim = new THREE.Mesh(rimGeo, rimMat)
    rim.position.z = 0.12
    const slot = new THREE.Mesh(slotGeo, darkMat)
    slot.position.z = 0.17
    body.add(plate, rim, slot)

    // the two ends of the travel, engraved on the plate
    for (const side of [-1, 1]) {
      for (const end of [-1, 1]) {
        const tick = new THREE.Mesh(tickGeo, tickMat)
        tick.position.set(side * 2.1, end * G.reach, 0.17)
        body.add(tick)
      }
    }

    // the groove from the slot's head up to the channel
    const stubGroove = new THREE.Mesh(unitGeo, groove.material)
    stubGroove.scale.set(CH, stubLen, 1)
    stubGroove.position.set(0, G.slotH / 2 + stubLen / 2 - 0.2, 0.16)
    body.add(stubGroove)

    // the light: in the slot behind the grip, then up the stub, then along the channel
    const lightMat = new THREE.MeshBasicMaterial({ color: LIGHT, transparent: true, opacity: 0 })
    const glow = new THREE.Mesh(glowGeo, lightMat)
    glow.position.set(0, -G.slotH / 2 + 0.3, 0.29)
    const runMat = new THREE.MeshBasicMaterial({ color: LIGHT })
    const stub = new THREE.Mesh(glowGeo, runMat)
    stub.scale.set(CH / 0.5, 0.001, 1)
    stub.position.set(0, G.slotH / 2 - 0.2, 0.3)
    stub.visible = false
    body.add(glow, stub)
    const runLen = busEnd - cx
    const run = new THREE.Mesh(unitGeo, runMat)
    run.position.set(cx, Y(G.busV), 0.05 + i * 0.002)
    run.visible = false
    const sparkMat = new THREE.MeshBasicMaterial({ map: soft, color: '#ffe1d2', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })
    const spark = new THREE.Mesh(unitGeo, sparkMat)
    spark.scale.set(7, 2.2, 1)
    spark.position.set(cx, Y(G.busV), 0.4)
    spark.renderOrder = 3
    deck.add(run, spark)

    const shadeMat = new THREE.MeshBasicMaterial({ map: soft, color: '#01061c', transparent: true, opacity: 0.7, depthWrite: false })
    const shade = new THREE.Mesh(unitGeo, shadeMat)
    shade.scale.set(9.6, 3.2, 1)
    shade.position.z = 0.33
    shade.renderOrder = 1
    body.add(shade)

    const arm = new THREE.Group()
    arm.position.z = 0.2
    arm.rotation.x = LEAN
    const gripMat = new THREE.MeshPhysicalMaterial({ color: STEEL.clone(), roughness: 0.3, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.16, emissive: FLAME.clone(), emissiveIntensity: 0 })
    const grip = new THREE.Mesh(gripGeo, gripMat)
    grip.position.z = ARM
    const collars = [-1, 1].map((s) => {
      const c = new THREE.Mesh(collarGeo, steelMat)
      c.position.set(s * (GRIP_L / 2 - 0.25), 0, ARM)
      return c
    })
    arm.add(new THREE.Mesh(shaftGeo, steelMat), grip, ...collars)
    const boot = new THREE.Mesh(bootGeo, bootMat)
    boot.position.z = 0.3
    body.add(boot, arm)

    const state = { on: 0, flow: 0 }
    levers.push({ arm, state })

    live.push(() => {
      const y = -Math.sin(arm.rotation.x) * ARM
      // the grip's shade lies on the plate, a little under the grip
      shade.position.y = y - 0.55
      const k = THREE.MathUtils.clamp((y + G.reach) / (2 * G.reach), 0, 1.06)
      glow.scale.y = Math.max(0.001, y + G.slotH / 2 - 0.3)
      lightMat.opacity = THREE.MathUtils.clamp(k * 1.6, 0, 1)
      const on = THREE.MathUtils.clamp(state.on, 0, 1)
      gripMat.color.copy(STEEL).lerp(FLAME, on)
      gripMat.metalness = 0.55 - 0.45 * on
      gripMat.emissiveIntensity = 0.1 * on + 0.5 * Math.max(0, state.on - 1)
      // the light leaves the slot: first the stub, then the channel
      const f = THREE.MathUtils.clamp(state.flow, 0, 1)
      const a = THREE.MathUtils.clamp(f / 0.16, 0, 1)
      const b = THREE.MathUtils.clamp((f - 0.16) / 0.84, 0, 1)
      stub.visible = a > 0
      stub.scale.set(CH / 0.5, Math.max(0.001, a * stubLen), 1)
      run.visible = b > 0
      run.scale.set(Math.max(0.001, b * runLen + CH * 0.5), CH, 1)
      run.position.x = cx + (b * runLen) / 2 - CH * 0.25
      spark.position.x = cx + b * runLen
      sparkMat.opacity = b > 0 && b < 1 ? Math.sin(Math.PI * b) ** 0.6 * 0.9 : 0
    })
  }

  gl.onFrame(() => {
    for (const fn of live) fn()
  })

  return {
    gl,
    deck,
    levers,
    dispose() {
      env.dispose()
      pmrem.dispose()
      room.dispose()
      gl.dispose()
    },
  }
}
