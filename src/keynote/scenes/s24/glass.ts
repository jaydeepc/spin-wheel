'use client'

/**
 * Slide 24's living picture: the deck's chess game, continued in three dimensions.
 *
 * The defender's navy king stands on a small board. Attacks (flame bolts) come out from behind
 * the chess photograph, and later down out of the open air above him (never from the clippings). While nothing protects him
 * they go straight through him: he rocks on his foot. Then a dome of glass rises over him, panel
 * by panel, and from that moment every bolt is turned away where it strikes, and a ring runs
 * across the glass from the place it was hit.
 *
 * Everything that moves is a pure function of ONE clock and three numbers the timeline tweens
 * (`sim`), so every frame can be reached by seeking and two visits to one frame are identical:
 *
 *   clock    seconds of attack; the timeline runs it, the idle loop adds the room's own time
 *   attack   0 … 1: how many of the bolts are flying (the left ones first, then the right)
 *   hold     0 the king is open … 1 the glass turns every bolt away
 *   rise     0 … 1: the dome, risen from its foot to its crown
 *
 * The world is the stage (three/sceneCanvas.ts): one unit is one --u, y runs up.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'

/** The dome: its radius at the foot and its height, in --u. */
const R = 11
const RY = 12.9
/** Where the middle of the board's top sits on the stage, in --u. */
export const BOARD = { u: 48.2, v: 34.0 }
/** How far the whole piece is tipped toward the room, so the board's top is seen. */
const TIP = 0.22

const LEFT = 18
const RIGHT = 9
const N = LEFT + RIGHT

/** A bolt's flight, as shares of its period: the approach, then what happens after it strikes. */
const APPROACH = 0.27
const AFTER = 0.2

export interface Glass {
  gl: SceneCanvas
  /** What the timeline drives. */
  sim: { clock: number; attack: number; hold: number; rise: number }
  /** The king, his board and his dome: scale and move THIS for the entrance. */
  rig: THREE.Group
}

/** A small seeded generator: the same bolts on every visit. */
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

/** The king's outline, foot to crown: [radius, height] in his own units (he is 10.4 tall with his cross). */
export const KING_PROFILE: [number, number][] = [
  [0, 0],
  [2.62, 0],
  [2.8, 0.22],
  [2.8, 0.62],
  [2.5, 0.9],
  [2.12, 1.02],
  [2.2, 1.32],
  [1.95, 1.68],
  [1.42, 2.25],
  [1.1, 3.3],
  [0.94, 4.6],
  [0.88, 5.5],
  [1.3, 5.78],
  [1.5, 6.02],
  [1.26, 6.26],
  [0.98, 6.42],
  [1.02, 6.75],
  [1.36, 7.55],
  [1.58, 8.18],
  [1.52, 8.44],
  [1.08, 8.62],
  [0.62, 8.76],
  [0.44, 8.94],
  [0, 9.0],
]

function kingGeometry(): THREE.LatheGeometry {
  // each stretch of the outline is cut finely, so the light runs over curves, not over facets
  const pts: THREE.Vector2[] = []
  for (let i = 0; i < KING_PROFILE.length - 1; i++) {
    const [r0, y0] = KING_PROFILE[i]
    const [r1, y1] = KING_PROFILE[i + 1]
    const steps = 5
    for (let k = 0; k < steps; k++) {
      const f = k / steps
      // a soft shoulder between two points: ease the radius, keep the height even
      const e = f * f * (3 - 2 * f)
      pts.push(new THREE.Vector2(r0 + (r1 - r0) * e, y0 + (y1 - y0) * f))
    }
  }
  pts.push(new THREE.Vector2(0, 9.0))
  return new THREE.LatheGeometry(pts, 72)
}

/** The top of his board: pale squares, as quiet as the page. */
function boardTexture(): THREE.CanvasTexture {
  const S = 1024
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (g) {
    g.fillStyle = '#fbf8f4'
    g.fillRect(0, 0, S, S)
    const n = 8
    const q = S / n
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if ((i + j) % 2) {
          g.fillStyle = '#cdd8ea'
          g.fillRect(i * q, j * q, q, q)
        }
      }
    }
    // a soft light from the upper left, a navy hairline at the rim
    const shade = g.createRadialGradient(S * 0.36, S * 0.34, S * 0.05, S * 0.5, S * 0.5, S * 0.56)
    shade.addColorStop(0, 'rgba(255,255,255,0.5)')
    shade.addColorStop(1, 'rgba(160,178,210,0.28)')
    g.fillStyle = shade
    g.fillRect(0, 0, S, S)
    g.strokeStyle = 'rgba(13,31,87,0.55)'
    g.lineWidth = S * 0.006
    g.beginPath()
    g.arc(S / 2, S / 2, S * 0.487, 0, Math.PI * 2)
    g.stroke()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/**
 * The king's lacquer, as a matcap: a ball of deep navy under a studio's light, painted once. A
 * broad soft light from the upper left, a hard small one inside it, a cool rim from the lower
 * right. The shader that reads it is tiny, and it needs no lights and no environment.
 */
function lacquerTexture(): THREE.CanvasTexture {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (g) {
    g.fillStyle = '#040d33'
    g.fillRect(0, 0, S, S)
    const ball = g.createRadialGradient(S * 0.4, S * 0.34, S * 0.02, S * 0.5, S * 0.5, S * 0.52)
    ball.addColorStop(0, '#2c4fc4')
    ball.addColorStop(0.28, '#1a3aa3')
    ball.addColorStop(0.62, '#0c2270')
    ball.addColorStop(0.88, '#071650')
    ball.addColorStop(1, '#040d33')
    g.fillStyle = ball
    g.fillRect(0, 0, S, S)
    // the cool rim, lower right
    const rim = g.createRadialGradient(S * 0.8, S * 0.8, S * 0.02, S * 0.8, S * 0.8, S * 0.34)
    rim.addColorStop(0, 'rgba(120, 168, 255, 0.62)')
    rim.addColorStop(0.5, 'rgba(70, 120, 240, 0.22)')
    rim.addColorStop(1, 'rgba(70, 120, 240, 0)')
    g.fillStyle = rim
    g.fillRect(0, 0, S, S)
    // the broad soft light, upper left
    const soft = g.createRadialGradient(S * 0.33, S * 0.27, S * 0.01, S * 0.33, S * 0.27, S * 0.26)
    soft.addColorStop(0, 'rgba(255, 255, 255, 0.5)')
    soft.addColorStop(0.45, 'rgba(190, 210, 255, 0.2)')
    soft.addColorStop(1, 'rgba(190, 210, 255, 0)')
    g.fillStyle = soft
    g.fillRect(0, 0, S, S)
    // … and the hard small one inside it: the lacquer's gloss
    const hard = g.createRadialGradient(S * 0.3, S * 0.23, 0, S * 0.3, S * 0.23, S * 0.075)
    hard.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    hard.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
    hard.addColorStop(1, 'rgba(255, 255, 255, 0)')
    g.fillStyle = hard
    g.fillRect(0, 0, S, S)
    // a long quiet reflection across the top, as from a window
    const band = g.createLinearGradient(0, S * 0.1, 0, S * 0.22)
    band.addColorStop(0, 'rgba(200, 220, 255, 0)')
    band.addColorStop(0.5, 'rgba(200, 220, 255, 0.16)')
    band.addColorStop(1, 'rgba(200, 220, 255, 0)')
    g.fillStyle = band
    g.fillRect(S * 0.18, S * 0.1, S * 0.64, S * 0.12)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** The board's edge: pale stone, lit from above. */
function stoneTexture(): THREE.CanvasTexture {
  const S = 128
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  if (g) {
    const grad = g.createLinearGradient(0, 0, 0, S)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(0.45, '#e9eef6')
    grad.addColorStop(1, '#b9c6dc')
    g.fillStyle = grad
    g.fillRect(0, 0, S, S)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function shadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  if (g) {
    const grad = g.createRadialGradient(128, 128, 20, 128, 128, 128)
    grad.addColorStop(0, 'rgba(7, 26, 80, 0.3)')
    grad.addColorStop(0.5, 'rgba(7, 26, 80, 0.12)')
    grad.addColorStop(1, 'rgba(7, 26, 80, 0)')
    g.fillStyle = grad
    g.fillRect(0, 0, 256, 256)
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const DOME_VERT = /* glsl */ `
  varying vec3 vP;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vP = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`

/** What the glass and its lattice share: how far it has risen, and where it was struck. */
const HITS = /* glsl */ `
  uniform float uRise;
  uniform vec3 uHit[${N}];
  uniform float uAge[${N}];
  uniform float uAmp[${N}];
  varying vec3 vP;
  // the rings that run across the glass from every place it was struck
  float struck(vec3 d) {
    float sum = 0.0;
    for (int i = 0; i < ${N}; i++) {
      float age = uAge[i];
      if (age >= 0.0) {
        float ang = acos(clamp(dot(d, uHit[i]), -1.0, 1.0));
        float fade = 1.0 - age;
        float ring = smoothstep(0.075, 0.0, abs(ang - age * 0.8)) * fade;
        float spot = smoothstep(0.34, 0.0, ang) * fade * fade * 0.5;
        sum += (ring + spot) * uAmp[i];
      }
    }
    return sum;
  }
  // 1 where the dome has risen; the lip is the band at its growing edge
  float risen(out float lip) {
    float edge = uRise * 1.12 - vP.y;
    lip = smoothstep(0.1, 0.0, edge) * (1.0 - smoothstep(0.86, 1.0, uRise));
    return step(0.0, edge) * step(0.0, vP.y);
  }
`

const DOME_FRAG = /* glsl */ `
  ${HITS}
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float lip;
    if (risen(lip) < 0.5) discard;
    float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.3);
    float hit = struck(normalize(vP));
    float a = 0.05 + 0.6 * fres + hit * 0.62 + lip * 0.5;
    // the clear blue; deeper where a ring passes (the page is light: light on light would not be seen)
    vec3 col = mix(vec3(0.184, 0.42, 1.0), vec3(0.09, 0.3, 0.92), clamp(hit, 0.0, 1.0));
    gl_FragColor = vec4(col, clamp(a, 0.0, 0.92));
  }
`

const LATTICE_VERT = /* glsl */ `
  varying vec3 vP;
  void main() {
    vP = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const LATTICE_FRAG = /* glsl */ `
  ${HITS}
  void main() {
    float lip;
    if (risen(lip) < 0.5) discard;
    float hit = struck(normalize(vP));
    gl_FragColor = vec4(0.184, 0.42, 1.0, clamp(0.2 + hit * 0.5 + lip * 0.6, 0.0, 0.9));
  }
`

const BOLT_VERT = /* glsl */ `
  attribute float aAlpha;
  varying vec2 vUv;
  varying float vA;
  void main() {
    vUv = uv;
    vA = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

/** A bolt: a flame streak, fine at its tail, with a hot point at its head. */
const BOLT_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying float vA;
  void main() {
    float along = vUv.x;
    float across = abs(vUv.y - 0.5) * 2.0;
    float w = mix(0.16, 0.9, along * along);
    float body = smoothstep(w, w * 0.25, across) * pow(along, 1.15);
    float head = smoothstep(1.0, 0.95, along);
    float core = smoothstep(0.8, 0.98, along) * smoothstep(0.55, 0.0, across);
    vec3 col = mix(vec3(0.93, 0.26, 0.14), vec3(1.0, 0.66, 0.46), core);
    gl_FragColor = vec4(col, body * head * vA);
  }
`

const FLASH_VERT = /* glsl */ `
  attribute float aAlpha;
  attribute float aTone;
  varying vec2 vUv;
  varying float vA;
  varying float vT;
  void main() {
    vUv = uv;
    vA = aAlpha;
    vT = aTone;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

/** Where a bolt strikes: a flame bloom on the king, a blue one on the glass. */
const FLASH_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying float vA;
  varying float vT;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float glow = smoothstep(1.0, 0.0, d);
    vec3 col = mix(vec3(0.95, 0.36, 0.2), vec3(0.184, 0.42, 1.0), vT);
    gl_FragColor = vec4(col, glow * glow * vA);
  }
`

interface Bolt {
  /** Where it starts (behind the photograph, or in the air above), where it meets the dome, where it would reach the king. */
  from: THREE.Vector3
  hit: THREE.Vector3
  core: THREE.Vector3
  /** Its way in, and its way out when the glass turns it. */
  dirIn: THREE.Vector3
  dirOut: THREE.Vector3
  reach: number
  period: number
  offset: number
  /** -1 from the left, +1 from the right: which way it rocks the king. */
  side: number
}

export function makeGlass(ctx: SceneCtx): Glass {
  // no lights of the kit's and no environment: the lacquer is a painted matcap and everything else
  // is unlit or a shader of its own, so the slide comes up without a pause for heavy programs
  const gl = createSceneCanvas(ctx, { fov: 26, lights: false })
  const sim = { clock: 0, attack: 0, hold: 0, rise: 0 }
  const rnd = seeded(2406)

  /* ---- the king on his board ---- */
  const rig = new THREE.Group()
  rig.position.copy(gl.at(BOARD.u, BOARD.v))
  gl.scene.add(rig)
  const tipped = new THREE.Group()
  tipped.rotation.x = TIP
  rig.add(tipped)

  const lacquer = new THREE.MeshMatcapMaterial({ matcap: lacquerTexture() })
  const king = new THREE.Group()
  const body = new THREE.Mesh(kingGeometry(), lacquer)
  const up = new THREE.Mesh(new THREE.BoxGeometry(0.44, 1.5, 0.38), lacquer)
  up.position.y = 9.7
  const across = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.42, 0.38), lacquer)
  across.position.y = 9.82
  king.add(body, up, across)
  king.scale.setScalar(1.06)
  tipped.add(king)

  const boardR = R + 1.1
  const slab = new THREE.Mesh(new THREE.CylinderGeometry(boardR, boardR * 0.985, 0.9, 96), new THREE.MeshMatcapMaterial({ matcap: stoneTexture() }))
  slab.position.y = -0.46
  const top = new THREE.Mesh(new THREE.CircleGeometry(boardR, 96), new THREE.MeshBasicMaterial({ map: boardTexture() }))
  top.rotation.x = -Math.PI / 2
  top.position.y = 0
  tipped.add(slab, top)

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(boardR * 3, boardR * 0.72), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }))
  shadow.position.set(0.4, -3.5, -6)
  shadow.renderOrder = -1
  rig.add(shadow)

  // his own soft shadow on the board
  const foot = new THREE.Mesh(new THREE.CircleGeometry(4.6, 48), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, opacity: 0.9 }))
  foot.rotation.x = -Math.PI / 2
  foot.position.set(0.5, 0.02, 0.3)
  tipped.add(foot)

  /* ---- the dome ---- */
  const hitDir = Array.from({ length: N }, () => new THREE.Vector3(0, 1, 0))
  const shared = {
    uRise: { value: 0 },
    uHit: { value: hitDir },
    uAge: { value: new Array<number>(N).fill(-1) },
    uAmp: { value: new Array<number>(N).fill(0) },
  }
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 48, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.ShaderMaterial({ uniforms: shared, vertexShader: DOME_VERT, fragmentShader: DOME_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
  )
  dome.scale.set(R, RY, R)
  dome.renderOrder = 2
  const lattice = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1, 2), 1),
    new THREE.ShaderMaterial({ uniforms: shared, vertexShader: LATTICE_VERT, fragmentShader: LATTICE_FRAG, transparent: true, depthWrite: false }),
  )
  lattice.scale.set(R * 1.002, RY * 1.002, R * 1.002)
  lattice.renderOrder = 3
  const rimMat = new THREE.MeshBasicMaterial({ color: 0x2f6bff, transparent: true, opacity: 0 })
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R, 0.13, 12, 128), rimMat)
  rim.rotation.x = Math.PI / 2
  rim.position.y = 0.1
  tipped.add(dome, lattice, rim)

  /* ---- the bolts ---- */
  rig.updateMatrixWorld(true)
  const toLocal = (w: THREE.Vector3) => tipped.worldToLocal(w.clone())
  const bolts: Bolt[] = []
  for (let i = 0; i < N; i++) {
    const left = i < LEFT
    // it starts hidden behind the chess photograph on the left (the orange side of the deck's board);
    // the later ones come down out of the open air above the king. Never from the news clippings:
    // they name real organisations, and a bolt leaving one would read as an attack from it
    const from = left ? gl.at(23 + rnd() * 6.5, 17.5 + rnd() * 14.5, -3 + rnd() * 7) : gl.at(54 + rnd() * 8.5, 14.8 + rnd() * 2.5, -3 + rnd() * 7)
    // … and is aimed at the king himself, somewhere along his height
    const core = tipped.localToWorld(new THREE.Vector3((rnd() - 0.5) * 0.6, 2.4 + rnd() * 6.4, -1.2 - rnd() * 0.8))
    // where that line meets the dome: on the unit sphere, in the dome's own space
    const o = toLocal(from)
    const c = toLocal(core)
    o.set(o.x / R, o.y / RY, o.z / R)
    c.set(c.x / R, c.y / RY, c.z / R)
    const d = c.clone().sub(o)
    const A = d.dot(d)
    const B = 2 * o.dot(d)
    const C = o.dot(o) - 1
    const t = (-B - Math.sqrt(Math.max(0, B * B - 4 * A * C))) / (2 * A)
    const unit = o.clone().addScaledVector(d, t)
    hitDir[i].copy(unit).normalize()
    const hit = tipped.localToWorld(new THREE.Vector3(unit.x * R, unit.y * RY, unit.z * R))
    const normal = new THREE.Vector3(unit.x / R, unit.y / RY, unit.z / R).normalize().transformDirection(tipped.matrixWorld)
    const dirIn = core.clone().sub(from).normalize()
    // turned away: mirrored in the glass, thrown a little wide, and always outward
    const dirOut = dirIn.clone().addScaledVector(normal, -2 * dirIn.dot(normal))
    dirOut.x += (rnd() - 0.5) * 0.5
    dirOut.y += (rnd() - 0.2) * 0.5
    dirOut.z = dirOut.z * 0.3 + 0.1
    dirOut.addScaledVector(normal, 0.55).normalize()
    bolts.push({ from, hit, core, dirIn, dirOut, reach: 6 + rnd() * 5, period: 1.9 + rnd() * 1.1, offset: rnd(), side: left ? -1 : 1 })
  }

  const boltGeo = new THREE.PlaneGeometry(1, 1)
  boltGeo.translate(-0.5, 0, 0)
  const boltAlpha = new THREE.InstancedBufferAttribute(new Float32Array(N), 1)
  boltGeo.setAttribute('aAlpha', boltAlpha)
  const boltMesh = new THREE.InstancedMesh(boltGeo, new THREE.ShaderMaterial({ vertexShader: BOLT_VERT, fragmentShader: BOLT_FRAG, transparent: true, depthWrite: false }), N)
  boltMesh.frustumCulled = false
  boltMesh.renderOrder = 4
  gl.scene.add(boltMesh)

  const flashGeo = new THREE.PlaneGeometry(1, 1)
  const flashAlpha = new THREE.InstancedBufferAttribute(new Float32Array(N), 1)
  const flashTone = new THREE.InstancedBufferAttribute(new Float32Array(N), 1)
  flashGeo.setAttribute('aAlpha', flashAlpha)
  flashGeo.setAttribute('aTone', flashTone)
  const flashMesh = new THREE.InstancedMesh(flashGeo, new THREE.ShaderMaterial({ vertexShader: FLASH_VERT, fragmentShader: FLASH_FRAG, transparent: true, depthWrite: false, depthTest: false }), N)
  flashMesh.frustumCulled = false
  flashMesh.renderOrder = 5
  gl.scene.add(flashMesh)

  /* ---- one frame, from the clock and the three numbers ---- */
  const head = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  const m = new THREE.Matrix4()
  const quat = new THREE.Quaternion()
  const size = new THREE.Vector3()
  const Z = new THREE.Vector3(0, 0, 1)
  const out = (x: number) => 1 - (1 - x) * (1 - x)
  /** Where the bolts were aimed: the piece at rest. The timeline may stand it elsewhere (it starts further right). */
  const rest = rig.position.clone()
  const off = new THREE.Vector3()
  const hit = new THREE.Vector3()
  const core = new THREE.Vector3()

  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    const t = sim.clock + (still ? 0 : time)
    const hold = sim.hold
    const flying = sim.attack * N
    let rock = 0
    off.copy(rig.position).sub(rest)
    for (let i = 0; i < N; i++) {
      const bolt = bolts[i]
      const on = Math.min(1, Math.max(0, flying - i))
      hit.copy(bolt.hit).add(off)
      core.copy(bolt.core).add(off)
      const p = (((t / bolt.period + bolt.offset) % 1) + 1) % 1
      let alpha = 0
      let len = 1
      let flash = 0
      let age = -1
      if (on > 0 && p < APPROACH) {
        const s = p / APPROACH
        head.lerpVectors(bolt.from, hit, Math.pow(s, 1.55))
        dir.copy(hit).sub(bolt.from).normalize()
        len = 2 + 7.5 * s
        alpha = Math.min(1, s * 5) * on
      } else if (on > 0 && p < APPROACH + AFTER) {
        const q = (p - APPROACH) / AFTER
        age = q
        // open: on through the king and out the other side. Held: away from the glass.
        dir.copy(hit).sub(bolt.from).normalize()
        a.copy(hit).addScaledVector(dir, (hit.distanceTo(core) + 9) * (0.55 * q + 0.45 * out(q)))
        b.copy(hit).addScaledVector(bolt.dirOut, bolt.reach * out(q))
        head.lerpVectors(a, b, hold)
        dir.lerp(bolt.dirOut, hold).normalize()
        len = 0.5 + (9 - 3.4 * hold) * (1 - q)
        alpha = Math.pow(1 - q, 1.3) * on
        flash = (1 - q) * (1 - q) * on * hold
        rock += (1 - hold) * on * bolt.side * Math.exp(-3.2 * q) * Math.sin(q * 10)
      }
      // the streak lies along its way, in the plane of the page
      quat.setFromAxisAngle(Z, Math.atan2(dir.y, dir.x))
      size.set(len, 0.9, 1)
      m.compose(head, quat, size)
      boltMesh.setMatrixAt(i, m)
      boltAlpha.setX(i, alpha)
      // the bloom where it strikes the glass
      a.copy(hit)
      quat.identity()
      const bloom = 2.2 + (age < 0 ? 0 : age) * 3.4
      size.set(bloom, bloom, 1)
      a.z += 1.5
      m.compose(a, quat, size)
      flashMesh.setMatrixAt(i, m)
      flashAlpha.setX(i, flash * 0.5)
      flashTone.setX(i, 1)
      shared.uAge.value[i] = age
      shared.uAmp.value[i] = on * hold
    }
    boltMesh.instanceMatrix.needsUpdate = true
    flashMesh.instanceMatrix.needsUpdate = true
    boltAlpha.needsUpdate = true
    flashAlpha.needsUpdate = true
    flashTone.needsUpdate = true

    shared.uRise.value = sim.rise
    rimMat.opacity = Math.min(1, sim.rise * 5)
    rim.visible = sim.rise > 0.001
    dome.visible = lattice.visible = sim.rise > 0.001
    // struck, he rocks on his foot; under glass he stands
    king.rotation.z = rock * 0.05
    king.rotation.x = Math.abs(rock) * 0.015
  })

  // THE PROGRAMS ARE COMPILED OFF THE MAIN THREAD. Compiled on the first draw they hold the page
  // still for a good part of a second the first time this slide is shown (the glass's shader
  // most of all), exactly while the director is cross-fading into it. So nothing is drawn until
  // the driver says they are ready; the canvas is still transparent then (it fades in at 0.55 s).
  gl.scene.visible = false
  const ready = () => {
    gl.scene.visible = true
    gl.render()
  }
  gl.renderer.compileAsync(gl.scene, gl.camera).then(ready, ready)

  return { gl, sim, rig }
}
