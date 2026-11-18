'use client'

/**
 * Slide 65 · the three.js of the ending.
 *
 * ONE STATE, ONE DRAW. The timeline tweens the plain numbers of `state`; `draw(time)` places
 * everything from them (and from the idle clock, which stands at 0 on a held frame). So every
 * frame is reachable by seeking, and Back retraces Next exactly.
 *
 *   arrive  the morning's cards fly in from the depth of the room to a curved wall around the viewer
 *   thread  threads of light draw between the cards that belong together
 *   morph   each card shrinks to a bright node and sinks onto the surface of the volume behind the wall
 *   pull    the camera pulls back (the zoom out)
 *   cloud   thousands of points gather into that volume: the mind
 *   spin    the mind turns a little and lives
 *   mx, my, ms   where the mind stands on the stage (in --u from its home) and how large
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { MEMORIES, THREADS, still } from './data'

export interface MindState {
  arrive: number
  labels: number
  thread: number
  morph: number
  pull: number
  cloud: number
  spin: number
  mx: number
  my: number
  ms: number
  /** 0 lively … 1 the calm of the last rest */
  calm: number
}

export interface Mind {
  state: MindState
  gl: SceneCanvas
}

/* ---- the wall of cards ---- */
const COLS = 6
const CARD_W = 12.6
const CARD_H = (CARD_W * 9) / 16
const COL_PITCH = 15
const ROW_V = [18.2, 29.9, 41.6] // the rows' centres, in --u from the top of the stage

/* ---- the mind: a volume behind the wall ---- */
const A = 44
const B = 33
const C = 32
const HOME = new THREE.Vector3(0, -1.6, -34)
/** how far the camera pulls back (times its own distance) */
const PULL = 1.75

const SURFACE = 13000
const INNER = 3600
const LINK_NODES = 900
const PULSES = 320
const THREAD_PTS = 96

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const outCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const inOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

/** A small seeded random: the mind is the same mind on every visit. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A point of the volume along the direction (dx, dy, dz): two soft halves, folded, flatter underneath. */
function shape(dx: number, dy: number, dz: number, shell: number, out: number[]) {
  const fold = Math.sin(9 * dx + 2.3 * Math.sin(7 * dy + 1.3)) * Math.sin(8 * dy + 2.1 * Math.sin(6 * dz)) + 0.5 * Math.sin(13 * dz + 4 * dx)
  let r = 1 + 0.045 * fold
  if (dy > 0.05) r *= 1 - 0.2 * Math.exp(-(dz * dz) / 0.012) * Math.min(1, (dy - 0.05) / 0.3)
  out[0] = A * dx * r * shell
  out[1] = B * dy * r * shell * (dy < 0 ? 0.8 : 1)
  out[2] = C * dz * r * shell
  out[3] = fold
}

const unjoin = (t: string) => t.replace(/([ft])(?=[fijlt])/g, '$1‌')

function discTexture(inner: string, outer: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, inner)
  grad.addColorStop(0.22, outer)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath()
  g.moveTo(x + r, y)
  g.arcTo(x + w, y, x + w, y + h, r)
  g.arcTo(x + w, y + h, x, y + h, r)
  g.arcTo(x, y + h, x, y, r)
  g.arcTo(x, y, x + w, y, r)
  g.closePath()
}

const POINT_VERT = /* glsl */ `
  attribute vec3 aFrom;
  attribute float aDelay;
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aPhase;
  uniform float uCloud;
  uniform float uTime;
  uniform float uPx;
  uniform float uAlpha;
  uniform float uCalm;
  varying vec3 vColor;
  varying float vA;
  void main() {
    float t = clamp(uCloud * 1.7 - aDelay * 0.7, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 p = mix(aFrom, position, t);
    p *= 1.0 + 0.014 * sin(uTime * 0.55 + aPhase * 6.2832) * t;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float tw = 1.0 - (0.34 - 0.16 * uCalm) * (0.5 + 0.5 * sin(uTime * (1.1 - 0.5 * uCalm) + aPhase * 37.0));
    gl_PointSize = min(aSize * uPx * (0.6 + 0.4 * t) / -mv.z, 64.0);
    vColor = aColor;
    vA = uAlpha * smoothstep(0.0, 0.3, t) * tw;
  }
`
const PULSE_VERT = /* glsl */ `
  attribute vec3 aTo;
  attribute float aPhase;
  attribute float aSpeed;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPx;
  uniform float uAlpha;
  varying vec3 vColor;
  varying float vA;
  void main() {
    float f = fract(uTime * aSpeed + aPhase);
    vec3 p = mix(position, aTo, f);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(1.25 * uPx / -mv.z, 48.0);
    vColor = aColor;
    vA = uAlpha * sin(3.14159 * f);
  }
`
const THREAD_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute vec3 aColor;
  uniform float uPx;
  varying vec3 vColor;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(aSize * uPx / -mv.z, 64.0);
    vColor = aColor;
    vA = aAlpha;
  }
`
const DISC_FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vColor, a * vA);
  }
`

export function createMind(ctx: SceneCtx): Mind {
  const gl = createSceneCanvas(ctx, { lights: false })
  const { scene, camera, renderer } = gl
  const z0 = camera.position.z
  const buffer = renderer.getDrawingBufferSize(new THREE.Vector2())
  const uPx = buffer.y / (2 * Math.tan((camera.fov * Math.PI) / 360))
  const still0 = ctx.held || ctx.reduced
  const fly = !ctx.reduced

  const state: MindState = { arrive: 0, labels: 0, thread: 0, morph: 0, pull: 0, cloud: 0, spin: 0, mx: 0, my: 0, ms: 1, calm: 0 }
  const rand = rng(65)
  const tmp: number[] = [0, 0, 0, 0]

  const additive = { transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending } as const

  /* ------------------------------------------------------------ the mind */
  const G = new THREE.Group()
  G.position.copy(HOME)
  scene.add(G)

  const glow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: discTexture('rgba(70,120,255,0.55)', 'rgba(47,107,255,0.26)'), ...additive, opacity: 0 }),
  )
  glow.scale.set(170, 130, 1)
  glow.renderOrder = 0
  G.add(glow)

  const total = SURFACE + INNER
  const pos = new Float32Array(total * 3)
  const from = new Float32Array(total * 3)
  const col = new Float32Array(total * 3)
  const size = new Float32Array(total)
  const delay = new Float32Array(total)
  const phase = new Float32Array(total)
  for (let i = 0; i < total; i++) {
    const u = rand() * 2 - 1
    const th = rand() * Math.PI * 2
    const s = Math.sqrt(1 - u * u)
    const inner = i >= SURFACE
    const shell = inner ? 0.3 + 0.66 * Math.pow(rand(), 0.6) : 1 - 0.035 * rand()
    shape(s * Math.cos(th), u, s * Math.sin(th), shell, tmp)
    pos[i * 3] = tmp[0]
    pos[i * 3 + 1] = tmp[1]
    pos[i * 3 + 2] = tmp[2]
    from[i * 3] = fly ? (rand() * 2 - 1) * 240 : tmp[0]
    from[i * 3 + 1] = fly ? (rand() * 2 - 1) * 140 : tmp[1]
    from[i * 3 + 2] = fly ? -170 + rand() * 330 : tmp[2]
    const ridge = smooth(-0.5, 0.7, tmp[3])
    const warm = rand() < 0.055
    const k = inner ? 0.4 : 0.28 + 0.72 * ridge
    const w = inner ? 0.15 : ridge * (0.4 + 0.6 * rand())
    if (warm) {
      col[i * 3] = 1.0 * k
      col[i * 3 + 1] = 0.62 * k
      col[i * 3 + 2] = 0.46 * k
    } else {
      // from the clear blue to a blue-white on the ridges
      col[i * 3] = (0.2 + 0.62 * w) * k
      col[i * 3 + 1] = (0.45 + 0.45 * w) * k
      col[i * 3 + 2] = 1.0 * k
    }
    size[i] = (inner ? 0.42 : 0.5) + rand() * (inner ? 0.4 : 0.75) + (rand() < 0.02 ? 1.1 : 0)
    delay[i] = rand()
    phase[i] = rand()
  }
  const cloudGeo = new THREE.BufferGeometry()
  cloudGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  cloudGeo.setAttribute('aFrom', new THREE.BufferAttribute(from, 3))
  cloudGeo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
  cloudGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  cloudGeo.setAttribute('aDelay', new THREE.BufferAttribute(delay, 1))
  cloudGeo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1))
  const cloudMat = new THREE.ShaderMaterial({
    vertexShader: POINT_VERT,
    fragmentShader: DISC_FRAG,
    uniforms: { uCloud: { value: 0 }, uTime: { value: 0 }, uPx: { value: uPx }, uAlpha: { value: 0.62 }, uCalm: { value: 0 } },
    ...additive,
  })
  const cloud = new THREE.Points(cloudGeo, cloudMat)
  cloud.frustumCulled = false
  cloud.renderOrder = 1
  G.add(cloud)

  // the links: each of a few hundred surface points to its two nearest neighbours
  const linkPos: number[] = []
  const pairs: [number, number][] = []
  {
    const stepN = Math.floor(SURFACE / LINK_NODES)
    const idx: number[] = []
    for (let i = 0; i < LINK_NODES; i++) idx.push(i * stepN)
    for (let a = 0; a < idx.length; a++) {
      let b1 = -1
      let b2 = -1
      let d1 = Infinity
      let d2 = Infinity
      const ia = idx[a] * 3
      for (let b = 0; b < idx.length; b++) {
        if (b === a) continue
        const ib = idx[b] * 3
        const d = (pos[ia] - pos[ib]) ** 2 + (pos[ia + 1] - pos[ib + 1]) ** 2 + (pos[ia + 2] - pos[ib + 2]) ** 2
        if (d < d1) {
          d2 = d1
          b2 = b1
          d1 = d
          b1 = b
        } else if (d < d2) {
          d2 = d
          b2 = b
        }
      }
      for (const b of [b1, b2]) {
        if (b < 0 || (b < a && rand() < 0.5)) continue
        const ib = idx[b] * 3
        linkPos.push(pos[ia], pos[ia + 1], pos[ia + 2], pos[ib], pos[ib + 1], pos[ib + 2])
        pairs.push([idx[a], idx[b]])
      }
    }
  }
  const linkGeo = new THREE.BufferGeometry()
  linkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linkPos), 3))
  const linkMat = new THREE.LineBasicMaterial({ color: 0x5f95ff, ...additive, opacity: 0 })
  const links = new THREE.LineSegments(linkGeo, linkMat)
  links.frustumCulled = false
  links.renderOrder = 1
  G.add(links)

  // the pulses that travel along the links
  const pA = new Float32Array(PULSES * 3)
  const pB = new Float32Array(PULSES * 3)
  const pPhase = new Float32Array(PULSES)
  const pSpeed = new Float32Array(PULSES)
  const pCol = new Float32Array(PULSES * 3)
  for (let i = 0; i < PULSES; i++) {
    const [a, b] = pairs[Math.floor(rand() * pairs.length)]
    const flip = rand() < 0.5
    const s = flip ? b : a
    const e = flip ? a : b
    for (let k = 0; k < 3; k++) {
      pA[i * 3 + k] = pos[s * 3 + k]
      pB[i * 3 + k] = pos[e * 3 + k]
    }
    pPhase[i] = rand()
    pSpeed[i] = 0.12 + rand() * 0.22
    const hot = rand() < 0.38
    pCol[i * 3] = hot ? 1.0 : 0.85
    pCol[i * 3 + 1] = hot ? 0.45 : 0.92
    pCol[i * 3 + 2] = hot ? 0.24 : 1.0
  }
  const pulseGeo = new THREE.BufferGeometry()
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pA, 3))
  pulseGeo.setAttribute('aTo', new THREE.BufferAttribute(pB, 3))
  pulseGeo.setAttribute('aPhase', new THREE.BufferAttribute(pPhase, 1))
  pulseGeo.setAttribute('aSpeed', new THREE.BufferAttribute(pSpeed, 1))
  pulseGeo.setAttribute('aColor', new THREE.BufferAttribute(pCol, 3))
  const pulseMat = new THREE.ShaderMaterial({
    vertexShader: PULSE_VERT,
    fragmentShader: DISC_FRAG,
    uniforms: { uTime: { value: 0 }, uPx: { value: uPx }, uAlpha: { value: 0 } },
    ...additive,
  })
  const pulses = new THREE.Points(pulseGeo, pulseMat)
  pulses.frustumCulled = false
  pulses.renderOrder = 2
  G.add(pulses)

  /* ------------------------------------------------------------ the cards */
  const font = getComputedStyle(ctx.root).fontFamily
  const loader = new THREE.TextureLoader()

  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = 512
  maskCanvas.height = 288
  {
    const g = maskCanvas.getContext('2d')!
    g.fillStyle = '#000'
    g.fillRect(0, 0, 512, 288)
    g.fillStyle = '#fff'
    roundRect(g, 1, 1, 510, 286, 22)
    g.fill()
  }
  const mask = new THREE.CanvasTexture(maskCanvas)

  const haloCanvas = document.createElement('canvas')
  haloCanvas.width = 512
  haloCanvas.height = 320
  {
    const g = haloCanvas.getContext('2d')!
    g.shadowColor = 'rgba(80,140,255,1)'
    g.shadowBlur = 44
    g.fillStyle = 'rgba(80,140,255,0.9)'
    roundRect(g, 64, 56, 384, 208, 20)
    g.fill()
    g.fill()
  }
  const haloTex = new THREE.CanvasTexture(haloCanvas)
  haloTex.colorSpace = THREE.SRGBColorSpace
  const nodeTex = [discTexture('rgba(255,255,255,1)', 'rgba(120,170,255,0.55)'), discTexture('rgba(255,244,236,1)', 'rgba(241,100,67,0.6)')]

  const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H)
  const haloGeo = new THREE.PlaneGeometry((CARD_W * 512) / 384, (CARD_H * 320) / 208)
  const LABEL_H = (CARD_W * 144) / 1024
  const labelGeo = new THREE.PlaneGeometry(CARD_W, LABEL_H)

  interface CardRig {
    n: number
    group: THREE.Group
    card: THREE.MeshBasicMaterial
    halo: THREE.MeshBasicMaterial
    label: THREE.MeshBasicMaterial
    node: THREE.Sprite
    wall: THREE.Vector3
    start: THREE.Vector3
    local: THREE.Vector3
    yaw: number
    delay: number
    ph: number
    now: THREE.Vector3
  }
  const rigs: CardRig[] = MEMORIES.map((m, i) => {
    const c = i % COLS
    const r = Math.floor(i / COLS)
    const x = (c - (COLS - 1) / 2) * COL_PITCH + (rand() - 0.5) * 1.0
    const y = 28.125 - ROW_V[r] + (rand() - 0.5) * 0.9
    const z = x * x * 0.0034 - 3.5 + (rand() - 0.5) * 5
    const wall = new THREE.Vector3(x, y, z)
    const start = fly ? new THREE.Vector3(x * 2.6 + (rand() - 0.5) * 60, y * 2.8 + (rand() - 0.5) * 40, -420 - rand() * 260) : wall.clone()

    // its place on the mind: straight behind it, on the front of the volume
    const lx = x * 0.98
    const ly = (y + 1.6) * 1.18
    const nx = lx / A
    const ny = ly / (B * (ly < 0 ? 0.8 : 1))
    const nz = Math.sqrt(Math.max(0.04, 1 - nx * nx - ny * ny))
    const local = new THREE.Vector3(lx, ly, C * nz * 1.01)

    const group = new THREE.Group()
    const tex = loader.load(still(m.n))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    const card = new THREE.MeshBasicMaterial({ map: tex, alphaMap: mask, color: 0xeef2ff, transparent: true, opacity: 0, depthWrite: false, depthTest: false, toneMapped: false })
    const halo = new THREE.MeshBasicMaterial({ map: haloTex, ...additive, opacity: 0, toneMapped: false })
    const haloMesh = new THREE.Mesh(haloGeo, halo)
    haloMesh.renderOrder = 4
    const cardMesh = new THREE.Mesh(cardGeo, card)
    cardMesh.renderOrder = 5

    const lc = document.createElement('canvas')
    lc.width = 1024
    lc.height = 144
    const g = lc.getContext('2d')!
    const text = unjoin(m.label)
    let px = 78
    g.font = `700 ${px}px ${font}`
    const wide = g.measureText(text).width
    if (wide > 980) {
      px = Math.floor((px * 980) / wide)
      g.font = `700 ${px}px ${font}`
    }
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillStyle = '#ffffff'
    g.fillText(text, 512, 76)
    const ltex = new THREE.CanvasTexture(lc)
    ltex.colorSpace = THREE.SRGBColorSpace
    ltex.anisotropy = 4
    const label = new THREE.MeshBasicMaterial({ map: ltex, transparent: true, opacity: 0, depthWrite: false, depthTest: false, toneMapped: false })
    const labelMesh = new THREE.Mesh(labelGeo, label)
    labelMesh.position.y = -(CARD_H / 2 + LABEL_H / 2 + 0.1)
    labelMesh.renderOrder = 6

    group.add(haloMesh, cardMesh, labelMesh)
    scene.add(group)

    const hot = i % 3 === 1
    const node = new THREE.Sprite(new THREE.SpriteMaterial({ map: nodeTex[hot ? 1 : 0], ...additive, opacity: 0 }))
    node.renderOrder = 3
    scene.add(node)

    return { n: m.n, group, card, halo, label, node, wall, start, local, yaw: -x / 190, delay: rand(), ph: rand() * Math.PI * 2, now: new THREE.Vector3() }
  })
  const byN = new Map(rigs.map((r) => [r.n, r]))

  /* ------------------------------------------------------------ the threads */
  const threads = THREADS.map(([a, b]) => ({ a: byN.get(a)!, b: byN.get(b)!, delay: rand(), ph: rand(), hot: rand() < 0.3 }))
  const per = THREAD_PTS + 1 // the last point of each is its travelling light
  const tPos = new Float32Array(threads.length * per * 3)
  const tAlpha = new Float32Array(threads.length * per)
  const tSize = new Float32Array(threads.length * per)
  const tCol = new Float32Array(threads.length * per * 3)
  threads.forEach((t, j) => {
    for (let k = 0; k < per; k++) {
      const i = (j * per + k) * 3
      const light = k === THREAD_PTS
      tCol[i] = light ? 1.0 : t.hot ? 1.0 : 0.62
      tCol[i + 1] = light ? 0.9 : t.hot ? 0.56 : 0.8
      tCol[i + 2] = light ? 0.82 : t.hot ? 0.4 : 1.0
    }
  })
  const threadGeo = new THREE.BufferGeometry()
  threadGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3))
  threadGeo.setAttribute('aAlpha', new THREE.BufferAttribute(tAlpha, 1))
  threadGeo.setAttribute('aSize', new THREE.BufferAttribute(tSize, 1))
  threadGeo.setAttribute('aColor', new THREE.BufferAttribute(tCol, 3))
  const threadMat = new THREE.ShaderMaterial({ vertexShader: THREAD_VERT, fragmentShader: DISC_FRAG, uniforms: { uPx: { value: uPx } }, ...additive })
  const threadPts = new THREE.Points(threadGeo, threadMat)
  threadPts.frustumCulled = false
  threadPts.renderOrder = 2
  scene.add(threadPts)

  /* ------------------------------------------------------------ the draw */
  const v = new THREE.Vector3()
  const mid = new THREE.Vector3()
  const ctl = new THREE.Vector3()
  const centre = new THREE.Vector3()

  const draw = (clock: number) => {
    const time = still0 ? 0 : clock
    const s = state
    const em = inOut(clamp01(s.morph))

    // the camera: it pulls back; before that it sways a very little, so the wall has depth
    const camZ = z0 * (1 + s.pull * (PULL - 1))
    const sway = 1 - smooth(0, 0.4, s.pull)
    camera.position.set(Math.sin(time * 0.11) * 1.4 * sway, Math.sin(time * 0.083 + 1) * 0.7 * sway, camZ)

    // the mind's place and turn
    const f = (camZ - HOME.z) / z0
    G.position.set(HOME.x + s.mx * f, HOME.y - s.my * f, HOME.z)
    G.scale.setScalar(s.ms)
    G.rotation.set(s.spin * (0.1 + 0.03 * Math.sin(time * 0.09)), s.spin * (0.3 + 0.3 * Math.sin(time * (0.1 - 0.035 * s.calm))), -0.05 * s.spin)
    G.updateMatrixWorld(true)
    centre.setFromMatrixPosition(G.matrixWorld)

    cloudMat.uniforms.uCloud.value = s.cloud
    cloudMat.uniforms.uTime.value = time
    cloudMat.uniforms.uCalm.value = s.calm
    const there = smooth(0.55, 1, s.cloud)
    glow.material.opacity = 0.5 * there * (1 + 0.06 * Math.sin(time * 0.5))
    linkMat.opacity = 0.2 * there
    pulseMat.uniforms.uTime.value = time * (1 - 0.35 * s.calm)
    pulseMat.uniforms.uAlpha.value = 0.95 * there

    // the cards, and the nodes they become
    const gone = smooth(0.18, 0.62, s.morph)
    const nodeIn = smooth(0.12, 0.6, s.morph)
    const cardScale = 1 - 0.93 * smooth(0, 0.7, s.morph)
    for (const r of rigs) {
      const a = outCubic(clamp01(s.arrive * 1.55 - r.delay * 0.55))
      const alpha = smooth(0, 0.35, a)
      const fl = (1 - em) * (still0 ? 0 : 1)
      v.lerpVectors(r.start, r.wall, a)
      v.x += Math.sin(time * 0.42 + r.ph) * 0.3 * fl
      v.y += Math.cos(time * 0.35 + r.ph * 1.7) * 0.28 * fl
      r.now.copy(r.local).applyMatrix4(G.matrixWorld)
      r.now.lerpVectors(v, r.now, em)
      r.group.position.copy(r.now)
      r.group.rotation.y = r.yaw * (1 - em)
      r.group.scale.setScalar(cardScale)
      r.group.visible = alpha * (1 - gone) > 0.002
      r.card.opacity = alpha * (1 - gone)
      r.halo.opacity = 0.5 * alpha * (1 - gone)
      r.label.opacity = alpha * s.labels
      const ns = (5.2 + 1.5 * s.pull) * s.ms * nodeIn * (1 + 0.12 * Math.sin(time * 1.1 + r.ph))
      r.node.position.copy(r.now)
      r.node.scale.set(ns, ns, 1)
      r.node.material.opacity = nodeIn
      r.node.visible = nodeIn > 0.002
    }

    // the threads: a string of light from one to the other, bowed toward the room, then round the mind
    const tsz = (0.36 + 0.5 * s.pull) * (0.6 + 0.4 * s.ms)
    threads.forEach((t, j) => {
      const p = clamp01(s.thread * 1.5 - t.delay * 0.5)
      const a = t.a.now
      const b = t.b.now
      mid.addVectors(a, b).multiplyScalar(0.5)
      const len = a.distanceTo(b)
      ctl.subVectors(mid, centre)
      const out = ctl.length() || 1
      ctl.multiplyScalar((len * 0.34 * em) / out)
      ctl.z += 5 * (1 - em)
      ctl.add(mid)
      const lightAt = (time * 0.16 + t.ph) % 1
      for (let k = 0; k < per; k++) {
        const light = k === THREAD_PTS
        const u = light ? lightAt : k / (THREAD_PTS - 1)
        const w = 1 - u
        const i = (j * per + k) * 3
        tPos[i] = w * w * a.x + 2 * w * u * ctl.x + u * u * b.x
        tPos[i + 1] = w * w * a.y + 2 * w * u * ctl.y + u * u * b.y
        tPos[i + 2] = w * w * a.z + 2 * w * u * ctl.z + u * u * b.z
        const on = u <= p ? 1 : 0
        tAlpha[j * per + k] = light ? on * 0.95 * Math.sin(Math.PI * u) * smooth(0.9, 1, p) : on * (0.5 - 0.14 * em)
        tSize[j * per + k] = light ? tsz * 3.4 : tsz
      }
    })
    threadGeo.attributes.position.needsUpdate = true
    threadGeo.attributes.aAlpha.needsUpdate = true
    threadGeo.attributes.aSize.needsUpdate = true
  }
  gl.onFrame(draw)

  return { state, gl }
}
