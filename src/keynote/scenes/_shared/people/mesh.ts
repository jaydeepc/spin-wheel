'use client'

/**
 * THE MESH of slides 61 to 64: people, AI teammates and the team's achievements as ONE net.
 *
 * Every node is a DOM element (a real photograph must stay sharp and undistorted); the links
 * between them, the light that runs along the links and the empty rings of slide 61 are three.js,
 * drawn under the DOM in the stage's own space. Both are placed by ONE function, frame(), from
 * plain numbers that the scene's timeline tweens (so every frame can be held by a URL):
 *
 *   per node   a      opacity
 *              j      0 on its card … 1 at its place off the stage
 *              k      0 where j left it … 1 at its place in the mesh
 *              dx, dy moved by so many --u (an arrival, a leave, a card sliding aside)
 *              r      turned by so many degrees
 *              sc     an extra scale
 *   G          seed   the empty rings of slide 61          spread  how far apart they stand
 *              link   the links                            pulse   the light along them
 *              wave   0 … 1: one ring of light going out through the whole mesh
 *
 * The mesh turns a little in depth and breathes: an idle that is scaled by each node's k and is
 * still when the frame is held (ctx.held) or the visitor asked for less motion.
 */

import { THREE, type SceneCanvas, type SceneCtx } from '../../../kit'
import { ALL, CENTRE, LINKS, XYZ, type NodeDef } from './data'

export interface NodeState {
  a: number
  j: number
  k: number
  dx: number
  dy: number
  r: number
  sc: number
}

export interface MeshNode {
  def: NodeDef
  el: HTMLElement
  s: NodeState
  /** The element's own size in px (its largest). */
  w: number
  h: number
  /** Its place on a card (stage px), if it has one. */
  card: { x: number; y: number } | null
  /** Its place off the stage (stage px). */
  off: { x: number; y: number }
  /** Scale where k is 0 and it has no card. */
  s0: number
  ph: number
  /** Where it is now (stage px) and how far it has arrived (0 … 1). */
  x: number
  y: number
  arr: number
}

export interface Mesh {
  nodes: Record<string, MeshNode>
  list: MeshNode[]
  G: { seed: number; spread: number; link: number; pulse: number; wave: number }
  /** Place everything for idle time `t` (seconds). */
  frame(t: number): void
}

const D = 28.125 / Math.tan((30 * Math.PI) / 360) // the scene camera's distance (fov 30)
const NAVY = [0.027, 0.102, 0.314]
const AZURE = [0.176, 0.416, 0.82]
const FLAME = [0.929, 0.259, 0.141]

/* ------------------------------------------------------------------ the three.js half */

interface MeshGL {
  linkPos: Float32Array
  linkCol: Float32Array
  ptPos: Float32Array
  ptCol: Float32Array
  ptSize: Float32Array
  linkGeo: THREE.BufferGeometry
  ptGeo: THREE.BufferGeometry
}

const TAIL = 4
/** The frozen layout is fitted to the stage here: a little left and down, and taller. */
const FIT = { dx: -1.9, dy: 1.3, sy: 1.085 }
const place = (id: string): [number, number, number] => {
  const [x, y, z] = XYZ[id]
  return [x + FIT.dx, CENTRE[1] + (y - CENTRE[1]) * FIT.sy + FIT.dy, z]
}

/** Called from the scene's three() hook. Returns the canvas (dispose it) and leaves the buffers in ctx.bag. */
export function meshGL(ctx: SceneCtx, gl: SceneCanvas): void {
  const L = LINKS.length
  const linkPos = new Float32Array(L * 4 * 3)
  const linkCol = new Float32Array(L * 4 * 4)
  const side = new Float32Array(L * 4)
  const index: number[] = []
  for (let i = 0; i < L; i++) {
    side.set([-1, 1, -1, 1], i * 4)
    const o = i * 4
    index.push(o, o + 1, o + 2, o + 2, o + 1, o + 3)
  }
  const linkGeo = new THREE.BufferGeometry()
  linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3))
  linkGeo.setAttribute('aColor', new THREE.BufferAttribute(linkCol, 4))
  linkGeo.setAttribute('aSide', new THREE.BufferAttribute(side, 1))
  linkGeo.setIndex(index)
  const linkMat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: `attribute vec4 aColor; attribute float aSide; varying vec4 vC; varying float vS;
      void main(){ vC = aColor; vS = aSide; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec4 vC; varying float vS;
      void main(){ float e = 1.0 - smoothstep(0.3, 1.0, abs(vS)); gl_FragColor = vec4(vC.rgb, vC.a * e); }`,
  })
  const links = new THREE.Mesh(linkGeo, linkMat)
  links.frustumCulled = false
  gl.scene.add(links)

  const P = ALL.length + L * TAIL
  const ptPos = new Float32Array(P * 3)
  const ptCol = new Float32Array(P * 4)
  const ptSize = new Float32Array(P)
  const shape = new Float32Array(P)
  for (let i = 0; i < ALL.length; i++) shape[i] = 1
  const ptGeo = new THREE.BufferGeometry()
  ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPos, 3))
  ptGeo.setAttribute('aColor', new THREE.BufferAttribute(ptCol, 4))
  ptGeo.setAttribute('aSize', new THREE.BufferAttribute(ptSize, 1))
  ptGeo.setAttribute('aShape', new THREE.BufferAttribute(shape, 1))
  const ptMat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms: { uPx: { value: ctx.U * gl.renderer.getPixelRatio() } },
    vertexShader: `attribute vec4 aColor; attribute float aSize; attribute float aShape; uniform float uPx; varying vec4 vC; varying float vK;
      void main(){ vC = aColor; vK = aShape; gl_PointSize = aSize * uPx; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: `varying vec4 vC; varying float vK;
      void main(){ float d = length(gl_PointCoord * 2.0 - 1.0);
        float disc = 1.0 - smoothstep(0.25, 1.0, d);
        float ring = smoothstep(0.74, 0.8, d) * (1.0 - smoothstep(0.92, 1.0, d)) + 0.1 * (1.0 - smoothstep(0.7, 0.8, d));
        float a = mix(disc, ring, vK);
        if (a * vC.a < 0.004) discard;
        gl_FragColor = vec4(vC.rgb, vC.a * a); }`,
  })
  const pts = new THREE.Points(ptGeo, ptMat)
  pts.frustumCulled = false
  gl.scene.add(pts)

  const m: MeshGL = { linkPos, linkCol, ptPos, ptCol, ptSize, linkGeo, ptGeo }
  ctx.bag.meshGL = m
}

/* ------------------------------------------------------------------ the whole */

/** A small repeatable random number from a node's index. */
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}
/** A node's place in the mesh with nothing idling, in stage px. */
function still(id: string, U: number) {
  const [mx, my, mz] = place(id)
  const f = D / (D - mz)
  return { x: (50 + (mx - CENTRE[0]) * f) * U, y: (28.125 - (28.125 - my) * f) * U }
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * Called from build(), BEFORE anything is hidden or moved: it measures the nodes and the card
 * slots, and returns the mesh with every node hidden (a: 0).
 */
export function createMesh(ctx: SceneCtx): Mesh {
  const U = ctx.U
  const glb = ctx.bag.meshGL as MeshGL | undefined
  const cx = CENTRE[0]
  const cy = CENTRE[1]

  const list: MeshNode[] = ALL.map((def, i) => {
    const el = ctx.$(`[data-node="${def.id}"]`)
    const slot = ctx.root.querySelector(`[data-slot="${def.id}"]`)
    const box = slot ? ctx.loc(slot) : null
    const [mx, my] = place(def.id)
    // off the stage: out along the line from the mesh's centre through its place, past the edge
    let dx = mx - cx
    let dy = (my - cy) * 1.4
    const len = Math.hypot(dx, dy) || 1
    dx /= len
    dy /= len
    const reach = 80 + rnd(i, 1) * 24
    return {
      def,
      el,
      s: { a: 0, j: 0, k: 0, dx: 0, dy: 0, r: 0, sc: 1 },
      w: el.offsetWidth,
      h: el.offsetHeight,
      card: box ? { x: box.cx, y: box.cy } : null,
      // (an AI teammate does not fly in: it comes up where it stands)
      off: def.kind === 'ai' ? still(def.id, U) : { x: (cx + dx * reach) * U, y: (cy + dy * reach * 0.62) * U },
      s0: def.kind === 'ai' ? 0.25 : 0.62,
      ph: rnd(i, 2) * Math.PI * 2,
      x: 0,
      y: 0,
      arr: 0,
    }
  })
  const nodes: Record<string, MeshNode> = {}
  for (const n of list) nodes[n.def.id] = n
  const linkEnds = LINKS.map(([a, b]) => [nodes[a], nodes[b]] as const)
  const G = { seed: 0, spread: 1.22, link: 0, pulse: 0, wave: 0 }
  const calm = ctx.held || ctx.reduced

  const sx = new Float32Array(list.length) // seed places (stage px)
  const sy = new Float32Array(list.length)
  const sa = new Float32Array(list.length)

  function frame(time: number) {
    const t = calm ? 0 : time
    const yaw = 0.085 * Math.sin(t * 0.21)
    const pitch = 0.05 * Math.sin(t * 0.16 + 1.2)
    const breath = 1 + 0.012 * Math.sin(t * 0.55)
    const cyw = Math.cos(yaw)
    const syw = Math.sin(yaw)
    const cp = Math.cos(pitch)
    const sp = Math.sin(pitch)
    const waveR = G.wave * 62
    const waveS = Math.sin(Math.PI * G.wave)

    for (let i = 0; i < list.length; i++) {
      const n = list[i]
      const s = n.s
      const [mx, my, mz] = place(n.def.id)
      // the mesh place, turned about the mesh's centre and seen in perspective
      const idle = calm ? 0 : 1
      let X = (mx - cx) * breath + idle * 0.2 * Math.sin(t * 0.47 + n.ph)
      let Y = (cy - my) * breath + idle * 0.24 * Math.cos(t * 0.39 + n.ph * 1.7)
      let Z = mz
      const x1 = X * cyw + Z * syw
      const z1 = -X * syw + Z * cyw
      const y2 = Y * cp - z1 * sp
      const z2 = Y * sp + z1 * cp
      X = x1
      Y = y2
      Z = z2
      const f = D / (D - Z)
      const wy = 28.125 - cy // the mesh centre's height in the world
      const mu = 50 + X * f
      const mv = 28.125 - (Y + wy) * f
      // the ring of light passing
      const dist = Math.hypot(mx - cx, (my - cy) * 1.5)
      const bump = waveS * Math.exp(-(((dist - waveR) / 7) ** 2))

      // the empty ring of slide 61: the same place, spread out, away from the title in the middle
      const su = 50 + X * f * G.spread
      const sv = 28.125 - (Y * G.spread + wy) * f
      sx[i] = su * U
      sy[i] = sv * U
      const fromTitle = Math.hypot((su - 50) / 25, (sv - 27) / 9.5)
      sa[i] = G.seed * smooth(0.95, 1.5, fromTitle)

      const start = n.card ? { x: n.card.x + (n.off.x - n.card.x) * s.j, y: n.card.y + (n.off.y - n.card.y) * s.j } : n.off
      const k = s.k
      // a little swing on the way in, so that nobody flies in a straight line
      const swing = n.def.kind === 'ai' ? 0 : Math.sin(Math.PI * k) * (n.card ? 2.2 : 5) * U * (n.ph > Math.PI ? 1 : -1)
      const tx = mu * U
      const ty = mv * U
      const ddx = tx - start.x
      const ddy = ty - start.y
      const dl = Math.hypot(ddx, ddy) || 1
      n.x = start.x + ddx * k + (-ddy / dl) * swing + s.dx * U
      n.y = start.y + ddy * k + (ddx / dl) * swing + s.dy * U
      const meshScale = Math.min(1, ((n.def.mw * U * 0.93) / n.w) * f * (1 + 0.035 * bump))
      const startScale = n.card ? 1 : n.s0
      const scale = (startScale + (meshScale - startScale) * k) * s.sc
      n.arr = s.a * smooth(0.5, 1, k)

      const el = n.el
      if (s.a <= 0.001) {
        if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden'
      } else {
        el.style.visibility = 'visible'
        el.style.opacity = String(Math.min(1, s.a))
        el.style.zIndex = String(Math.round((n.card && k < 0.5 ? 40 : 20) + Z))
        el.style.transform = `translate3d(${(n.x - n.w / 2).toFixed(2)}px,${(n.y - n.h / 2).toFixed(2)}px,0) rotate(${s.r.toFixed(3)}deg) scale(${scale.toFixed(4)})`
      }
    }

    if (!glb) return
    const seeding = G.seed > 0.001
    const wx = (px: number) => px / U - 50
    const wyy = (px: number) => 28.125 - px / U
    // links
    for (let i = 0; i < linkEnds.length; i++) {
      const [a, b] = linkEnds[i]
      const ia = list.indexOf(a)
      const ib = list.indexOf(b)
      const ax = seeding ? sx[ia] : a.x
      const ay = seeding ? sy[ia] : a.y
      const bx = seeding ? sx[ib] : b.x
      const by = seeding ? sy[ib] : b.y
      const ai = a.def.kind === 'ai' || b.def.kind === 'ai'
      const pr = a.def.kind === 'print' || b.def.kind === 'print'
      const col = ai ? FLAME : pr ? AZURE : NAVY
      const base = ai ? 0.62 : pr ? 0.42 : 0.3
      const midD = Math.hypot((ax + bx) / 2 / U - cx, ((ay + by) / 2 / U - cy) * 1.5)
      const bump = waveS * Math.exp(-(((midD - waveR) / 7) ** 2))
      const alpha = seeding ? Math.min(sa[ia], sa[ib]) * 0.26 : Math.min(a.arr, b.arr) * G.link * Math.min(1, base + bump * 0.6)
      const half = (ai ? 0.11 : 0.085) * U * (1 + bump * 1.4)
      const dx = bx - ax
      const dy = by - ay
      const dl = Math.hypot(dx, dy) || 1
      const nx = (-dy / dl) * half
      const ny = (dx / dl) * half
      const o = i * 12
      glb.linkPos[o] = wx(ax + nx)
      glb.linkPos[o + 1] = wyy(ay + ny)
      glb.linkPos[o + 3] = wx(ax - nx)
      glb.linkPos[o + 4] = wyy(ay - ny)
      glb.linkPos[o + 6] = wx(bx + nx)
      glb.linkPos[o + 7] = wyy(by + ny)
      glb.linkPos[o + 9] = wx(bx - nx)
      glb.linkPos[o + 10] = wyy(by - ny)
      const mixc = seeding ? NAVY : col
      for (let v = 0; v < 4; v++) {
        const c = i * 16 + v * 4
        glb.linkCol[c] = mixc[0]
        glb.linkCol[c + 1] = mixc[1]
        glb.linkCol[c + 2] = mixc[2]
        glb.linkCol[c + 3] = alpha
      }
      // the light along this link: a head and a short tail
      const speed = 0.16 + rnd(i, 5) * 0.12
      const head = (t * speed + rnd(i, 6)) % 1
      const lit = seeding ? Math.min(sa[ia], sa[ib]) * 0.55 : Math.min(a.arr, b.arr) * G.pulse
      const flip = rnd(i, 7) > 0.5
      for (let q = 0; q < TAIL; q++) {
        const p = ALL.length + i * TAIL + q
        let u = head - q * 0.028
        if (u < 0) u += 1
        const fade = Math.sin(Math.PI * u) ** 0.6
        const uu = flip ? 1 - u : u
        glb.ptPos[p * 3] = wx(ax + dx * uu)
        glb.ptPos[p * 3 + 1] = wyy(ay + dy * uu)
        const pc = ai && !seeding ? FLAME : AZURE
        glb.ptCol[p * 4] = pc[0]
        glb.ptCol[p * 4 + 1] = pc[1]
        glb.ptCol[p * 4 + 2] = pc[2]
        glb.ptCol[p * 4 + 3] = lit * fade * (1 - q / TAIL) * 0.95
        glb.ptSize[p] = (ai ? 0.62 : 0.5) * (1 - q * 0.16)
      }
    }
    // the empty rings
    for (let i = 0; i < list.length; i++) {
      const n = list[i]
      const [, , mz] = place(n.def.id)
      const c = n.def.kind === 'ai' ? FLAME : n.def.kind === 'print' ? AZURE : NAVY
      glb.ptPos[i * 3] = wx(sx[i])
      glb.ptPos[i * 3 + 1] = wyy(sy[i])
      glb.ptCol[i * 4] = c[0]
      glb.ptCol[i * 4 + 1] = c[1]
      glb.ptCol[i * 4 + 2] = c[2]
      glb.ptCol[i * 4 + 3] = sa[i] * (n.def.kind === 'ai' ? 0.95 : 0.6)
      glb.ptSize[i] = (n.def.kind === 'ai' ? 3.4 : n.def.kind === 'print' ? 2.2 : 2.7) * (D / (D - mz))
    }
    for (const name of ['position', 'aColor'] as const) glb.linkGeo.attributes[name].needsUpdate = true
    for (const name of ['position', 'aColor', 'aSize'] as const) glb.ptGeo.attributes[name].needsUpdate = true
  }

  return { nodes, list, G, frame }
}
