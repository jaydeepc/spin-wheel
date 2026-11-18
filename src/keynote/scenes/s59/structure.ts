'use client'

/**
 * Slide 59's own three.js: a ground slab, six piers of pale stone with a band of flame at the
 * head, and the beam they carry. The space is the stage's own (one world unit is one --u at
 * z = 0) and every pier's FACE lies in the stage's plane, so the words the DOM sets on it sit
 * exactly on the stone. The piers come up THROUGH the top of the slab (a clipping plane at its
 * surface), so they are seen to rise out of it, not to slide in front of it.
 */

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { colX, L, RISE } from './data'

export interface PierBuilt {
  /** Moves the whole pier: y = -RISE is under the slab, y = 0 is standing. */
  group: THREE.Group
  /** The flame band at its head: `emissiveIntensity` is its glow. */
  cap: THREE.MeshStandardMaterial
  /** The soft shade it throws on the slab at its foot. */
  foot: THREE.MeshBasicMaterial
}

export interface Structure {
  gl: SceneCanvas
  piers: PierBuilt[]
  base: THREE.Group
  roof: THREE.Group
  /** The slabs' own materials: `opacity` lets each arrive out of the air instead of from off stage. */
  baseMat: THREE.MeshStandardMaterial
  roofMat: THREE.MeshStandardMaterial
  /** The sockets on the ground slab where piers are still to rise (one per pier): `opacity`. */
  sockets: THREE.MeshBasicMaterial[]
  /** The shade the beam throws on the heads of the piers once it lies on them. */
  under: THREE.MeshBasicMaterial
  dispose(): void
}

/** A soft dark patch: white to nothing, tinted by the material's colour. */
function softTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 128
  const g = c.getContext('2d')
  if (g) {
    const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.45, 'rgba(255,255,255,0.45)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 128, 128)
  }
  return new THREE.CanvasTexture(c)
}

/** Top to bottom: dark to nothing. The shade under the beam. */
function fallTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = 4
  c.height = 64
  const g = c.getContext('2d')
  if (g) {
    const grad = g.createLinearGradient(0, 0, 0, 64)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.35, 'rgba(255,255,255,0.4)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 4, 64)
  }
  return new THREE.CanvasTexture(c)
}

export function makeStructure(ctx: SceneCtx, count: number): Structure {
  const gl = createSceneCanvas(ctx)
  const { scene, renderer } = gl
  renderer.localClippingEnabled = true

  // a quiet studio for the navy slabs to pick up: three's own room, no picture
  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, 0.04)
  scene.environment = env.texture
  scene.environmentIntensity = 0.1

  const yBase = 28.125 - L.baseTop
  const yRoof = 28.125 - L.roofBot
  // everything under the slab's surface is not drawn: the piers come up through it
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -yBase)

  const stone = new THREE.MeshStandardMaterial({ color: '#f3f6fc', roughness: 0.62, metalness: 0, clippingPlanes: [ground] })
  const navyOf = () => new THREE.MeshStandardMaterial({ color: '#081d63', roughness: 0.9, metalness: 0, envMapIntensity: 0, transparent: true, opacity: 1 })
  const baseMat = navyOf()
  const roofMat = navyOf()
  const soft = softTexture()

  const shaftH = L.baseTop - L.roofBot - L.capH
  const shaftGeo = new RoundedBoxGeometry(L.colW, shaftH + 0.6, L.depth, 3, 0.22)
  const capGeo = new RoundedBoxGeometry(L.colW + 0.24, L.capH, L.depth + 0.24, 3, 0.14)
  const footGeo = new THREE.PlaneGeometry(1, 1)

  const base = new THREE.Group()
  const piers: PierBuilt[] = []
  const sockets: THREE.MeshBasicMaterial[] = []
  for (let i = 0; i < count; i++) {
    const group = new THREE.Group()
    const cx = colX(i) + L.colW / 2 - 50
    const shaft = new THREE.Mesh(shaftGeo, stone)
    // 0.6 of it stays in the ground, so its rounded foot is never seen
    shaft.position.set(cx, yBase + shaftH / 2 - 0.3, -L.depth / 2)
    const cap = new THREE.MeshStandardMaterial({ color: '#f16443', roughness: 0.38, metalness: 0.05, emissive: '#f16443', emissiveIntensity: 0, clippingPlanes: [ground] })
    const head = new THREE.Mesh(capGeo, cap)
    head.position.set(cx, yRoof - L.capH / 2, -L.depth / 2)
    group.add(shaft, head)
    group.position.y = -RISE
    scene.add(group)

    // its shade on the slab: lies on the surface, round the foot
    const foot = new THREE.MeshBasicMaterial({ map: soft, color: '#0a1c56', transparent: true, opacity: 0, depthWrite: false, clippingPlanes: [ground] })
    const shade = new THREE.Mesh(footGeo, foot)
    shade.rotation.x = -Math.PI / 2
    shade.position.set(cx, yBase + 0.02, -L.depth / 2 + 0.6)
    shade.scale.set(L.colW + 3.4, L.depth + 5, 1)
    shade.renderOrder = 1
    scene.add(shade)
    // and the shade it holds in the air behind it: what lifts pale stone off a pale page
    const halo = new THREE.Mesh(footGeo, foot)
    halo.position.set(cx + 0.5, yBase + shaftH / 2 - 0.5, -L.depth - 0.4)
    halo.scale.set(L.colW + 7, shaftH + 9, 1)
    halo.renderOrder = -1
    group.add(halo)
    // the socket it will rise from: a paler inset on the slab's top, seen while the pier is still to come
    const socket = new THREE.MeshBasicMaterial({ color: '#4384d4', transparent: true, opacity: 0, depthWrite: false })
    const inset = new THREE.Mesh(footGeo, socket)
    inset.rotation.x = -Math.PI / 2
    inset.position.set(cx, yBase + 0.03, -L.depth / 2)
    inset.scale.set(L.colW - 0.5, L.depth - 0.6, 1)
    inset.renderOrder = 1
    base.add(inset)
    sockets.push(socket)
    piers.push({ group, cap, foot })
  }

  const slabW = L.slabX1 - L.slabX0
  const slabZ = L.slabFront - L.slabDepth / 2
  const baseH = L.baseBot - L.baseTop
  const baseMesh = new THREE.Mesh(new RoundedBoxGeometry(slabW, baseH, L.slabDepth, 3, 0.2), baseMat)
  baseMesh.position.set((L.slabX0 + L.slabX1) / 2 - 50, yBase - baseH / 2, slabZ)
  base.add(baseMesh)
  scene.add(base)

  const roofH = L.roofBot - L.roofTop
  const roof = new THREE.Group()
  const roofMesh = new THREE.Mesh(new RoundedBoxGeometry(slabW, roofH, L.slabDepth, 3, 0.2), roofMat)
  roofMesh.position.set((L.slabX0 + L.slabX1) / 2 - 50, yRoof + roofH / 2, slabZ)
  roof.add(roofMesh)
  scene.add(roof)

  // the beam's shade on the faces of the piers, just under it
  const fall = fallTexture()
  const under = new THREE.MeshBasicMaterial({ map: fall, color: '#0a1c56', transparent: true, opacity: 0, depthWrite: false })
  const span = colX(count - 1) + L.colW - colX(0)
  const band = new THREE.Mesh(new THREE.PlaneGeometry(span + 0.5, 2.6), under)
  band.position.set(colX(0) + span / 2 - 50, yRoof - 1.3, 0.3)
  band.renderOrder = 2
  scene.add(band)

  return {
    gl,
    piers,
    base,
    roof,
    baseMat,
    roofMat,
    sockets,
    under,
    dispose() {
      env.dispose()
      pmrem.dispose()
      room.dispose()
      gl.dispose()
    },
  }
}
