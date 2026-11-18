'use client'

/**
 * Slide 17 · the airfield: a hundred folded paper planes, one for each company in a hundred.
 *
 * Real meshes on a scene-owned canvas (one InstancedMesh for the planes, one for their soft
 * shadows, one for the dotted trails). The ground is a tilted plane in the stage's own space, and
 * every parking slot is the point of that ground seen at a chosen place ON THE STAGE, so the rows
 * stand exactly where the deck's picture has them while size and light are real perspective.
 *
 * The timeline never touches a mesh. It tweens the plain numbers of `state`; `update()` turns
 * them into a hundred matrices on every frame and on every seek, so any frame can be held.
 *
 *   landG, landB, landS   0 … 1   the 63 grey, the 31 blue, the six land (a wave along the rows)
 *   shift                 0 … 1   the whole field from its WIDE place (the first rest: a hundred planes
 *                                 across the stage) to its place at the left, smaller, as the room steps back
 *   gust                  0 … 1   the wake of the six leaving, running through the ninety-four on the ground
 *   hot                   0 … 1   the six take their colour
 *   fly[i].t              0 … 1   the i-th of the six along its climb (0 parked, 1 in the air)
 *   idle                  0 … 1   how much the six hover while the room waits
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { PLANES, SIX } from './data'

export interface FieldState {
  landG: number
  landB: number
  landS: number
  shift: number
  gust: number
  hot: number
  fly: { t: number }[]
  idle: number
}

export interface Field {
  gl: SceneCanvas
  state: FieldState
  /** Where the i-th of the six is on the stage at flight `t`, in --u (for the backdrop's light). */
  seen(i: number, t: number): { u: number; v: number }
}

/* ------------------------------------------------------------------ layout */

const ROWS = 6
/** Slots in a row: sixteen parked places and the one at the end that flies (the last two rows are one short, as in the deck). */
const COLS = 16
/**
 * The field as the room sees it, in --u: the front row runs from UL to UR at height VF, the back
 * row stands at height VB. Between them the rows are evenly spaced ON THE GROUND, so they close
 * up and grow smaller toward the back: real perspective.
 */
interface Lay {
  ul: number
  ur: number
  vf: number
  vb: number
}
/** The first rest: the hundred fill the stage. */
const WIDE: Lay = { ul: 9.6, ur: 84.0, vf: 46.6, vb: 27.9 }
/** From the second beat on: the field at the left, the air to its right free for the six. */
const LEFT: Lay = { ul: 5.0, ur: 39.6, vf: 46.9, vb: 35.4 }
/** How far the ground is tipped back from facing the room. */
const TILT = (52 * Math.PI) / 180
/** The camera's field of view: wider than the kit's 30, so that depth shows. */
const FOV = 42
/** The planes' heading on the ground: to the right and away. */
const HEADING = 0.74
/** A parked plane's length in --u is 2.15 times this. */
const SIZE = 0.98
/** Grey planes in each row, back row first (63); the rest of a row is blue (31); the last two rows are one short, as in the deck. */
const GREY = [11, 11, 11, 10, 10, 10]
const PARKED = [16, 16, 16, 16, 15, 15]

/** The six before they take their colour: warm paper, a shade apart from the grey. */
const PAPER = new THREE.Color('#f4c7b6')
const GREY_C = new THREE.Color('#93a3bd')
const BLUE_C = new THREE.Color('#4f98f0')
const FLAME_C = new THREE.Color('#f76e45')

/** A small repeatable random number: the same field on every visit. */
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453
  return x - Math.floor(x)
}
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (v: number) => {
  const t = clamp01(v)
  return t * t * (3 - 2 * t)
}
const outCubic = (v: number) => 1 - Math.pow(1 - clamp01(v), 3)

/** The folded dart: two wings and a keel, nose toward +x, up +y. Flat faces, so every fold catches the light on its own. */
function dart(): THREE.BufferGeometry {
  const N = [1.15, 0.02, 0]
  const WL = [-1, 0.18, -0.78]
  const WR = [-1, 0.18, 0.78]
  const CL = [-1, 0.03, -0.075]
  const CR = [-1, 0.03, 0.075]
  const K = [-0.92, -0.36, 0]
  const tris = [
    [N, CL, WL, 1], // left wing (the far one)
    [N, WR, CR, 0.93], // right wing: a touch deeper, so the fold reads in flat light
    [N, K, CL, 0.62], // the keel's two sides: a shade deeper, as the paper's inside fold
    [N, CR, K, 0.62],
  ] as const
  const pos: number[] = []
  const col: number[] = []
  for (const [a, b, c, shade] of tris) {
    pos.push(...a, ...b, ...c)
    for (let i = 0; i < 3; i++) col.push(shade, shade, shade)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.computeVertexNormals()
  return g
}

/** Soft round marks with their own strength each: the planes' shadows on the ground, the dots of a trail. */
function marks(count: number, color: string, soft: number): { mesh: THREE.InstancedMesh; alpha: THREE.InstancedBufferAttribute } {
  const geo = new THREE.PlaneGeometry(1, 1)
  const alpha = new THREE.InstancedBufferAttribute(new Float32Array(count), 1)
  alpha.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('aAlpha', alpha)
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uSoft: { value: soft },
    },
    vertexShader: `
      attribute float aAlpha;
      varying float vAlpha;
      varying vec2 vUv;
      void main() {
        vAlpha = aAlpha;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uSoft;
      varying float vAlpha;
      varying vec2 vUv;
      void main() {
        float r = length(vUv - 0.5) * 2.0;
        float a = smoothstep(1.0, uSoft, r);
        a = mix(a * a, a, step(0.01, uSoft)) * vAlpha;
        gl_FragColor = vec4(uColor * a, a);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    premultipliedAlpha: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const mesh = new THREE.InstancedMesh(geo, mat, count)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  return { mesh, alpha }
}

interface Plane {
  kind: 'grey' | 'blue' | 'six'
  /** Its order in its own group's wave, 0 … 1. */
  order: number
  /** Where it stands on the ground: in the wide field, and in the field at the left. */
  slotA: THREE.Vector3
  slot: THREE.Vector3
  sizeA: number
  /** Its place across the field, 0 the left end … 1 the right end. */
  nx: number
  /** Its heading on the ground. */
  dir: THREE.Vector3
  roll: number
  size: number
  /** Only the six: the climb, a cubic curve in the STAGE's space (x, y in --u from its top left; z the depth toward the room), how large it is at the end, and the places of its trail's dots along it. */
  path?: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3]
  dots?: number[]
  endSize?: number
  six?: number
}

/** The dots of one trail, at most; and how far apart they stand on the stage, in --u. */
const TRAIL = 46
const DOT_GAP = 0.66
const DOT = 0.42
/** How many dots of a trail stay behind a plane that hangs in the air (they fade toward the tail). */
const STAY = 15

export function makeField(ctx: SceneCtx): Field {
  const gl = createSceneCanvas(ctx, { lights: false, fov: FOV })
  const CAM = gl.camera.position.z

  // the light of a bright room: a soft sky, a key from the upper left, a cool fill from the right
  gl.scene.add(new THREE.HemisphereLight(0xffffff, 0xb9c5dd, 2.2))
  const key = new THREE.DirectionalLight(0xfff6ee, 2.3)
  key.position.set(-40, 70, 60)
  gl.scene.add(key)
  const fill = new THREE.DirectionalLight(0xcfe2ff, 0.8)
  fill.position.set(60, 10, 40)
  gl.scene.add(fill)

  /* ---- the ground, and the stage seen through it ---- */
  const ex = new THREE.Vector3(1, 0, 0)
  const ed = new THREE.Vector3(0, Math.cos(TILT), -Math.sin(TILT)) // away from the room, along the ground
  const up = new THREE.Vector3(0, Math.sin(TILT), Math.cos(TILT)) // the ground's normal
  const origin = gl.at(24, 41, 0)
  const eye = new THREE.Vector3(0, 0, CAM)
  /** The point of the ground that the room sees at (u, v) on the stage. */
  const onGround = (u: number, v: number) => {
    const ray = gl.at(u, v, 0).sub(eye)
    const k = origin.clone().sub(eye).dot(up) / ray.dot(up)
    return eye.clone().addScaledVector(ray, k)
  }
  /** The point at depth z that the room sees at (u, v) on the stage. */
  const inAir = (u: number, v: number, z: number) => {
    const k = (CAM - z) / CAM
    return new THREE.Vector3((u - 50) * k, (28.125 - v) * k, z)
  }
  const project = (p: THREE.Vector3) => {
    const k = CAM / (CAM - p.z)
    return { u: 50 + p.x * k, v: 28.125 - p.y * k }
  }

  /* ---- the hundred ---- */
  const planes: Plane[] = []
  /** A layout's measures on the ground. */
  const measure = (l: Lay) => {
    const frontL = onGround(l.ul, l.vf)
    const frontR = onGround(l.ur, l.vf)
    return { frontL, rowGap: onGround(25, l.vb).sub(frontL).dot(ed) / (ROWS - 1), colGap: (frontR.x - frontL.x) / COLS }
  }
  const mA = measure(WIDE)
  const mB = measure(LEFT)
  /** How much larger everything is in the wide field. */
  const GROW = mA.colGap / mB.colGap
  let six = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= PARKED[r]; c++) {
      const i = planes.length
      const flies = c === PARKED[r]
      const jx = (rnd(i, 1) - 0.5) * 0.18
      const jd = (rnd(i, 2) - 0.5) * 0.24
      const a = HEADING + (rnd(i, 3) - 0.5) * 0.26
      const size = SIZE * (0.94 + rnd(i, 5) * 0.12)
      const stand = (m: typeof mA, s: number) =>
        m.frontL
          .clone()
          .addScaledVector(ex, (c + (r % 2 ? 0.3 : 0) + jx) * m.colGap)
          .addScaledVector(ed, (ROWS - 1 - r + jd) * m.rowGap)
          // it rests on its keel
          .addScaledVector(up, 0.36 * s)
      const p: Plane = {
        kind: flies ? 'six' : c < GREY[r] ? 'grey' : 'blue',
        order: 0,
        slotA: stand(mA, size * GROW),
        slot: stand(mB, size),
        sizeA: size * GROW,
        nx: c / COLS,
        dir: ex.clone().multiplyScalar(Math.cos(a)).addScaledVector(ed, Math.sin(a)).normalize(),
        roll: 0.16 + (rnd(i, 4) - 0.5) * 0.2,
        size,
      }
      if (flies) p.six = six++
      planes.push(p)
    }
  }
  // the wave of each group runs along the rows, left to right, the back row a touch ahead
  const groupOf = (kind: Plane['kind']) => planes.filter((p) => p.kind === kind)
  for (const kind of ['grey', 'blue', 'six'] as const) {
    const g = groupOf(kind)
    const xs = g.map((p) => p.slot.x)
    const lo = Math.min(...xs)
    const span = Math.max(1, Math.max(...xs) - lo)
    g.forEach((p, k) => {
      p.order = kind === 'six' ? k / Math.max(1, g.length - 1) : clamp01(((p.slot.x - lo) / span) * 0.9 + rnd(k, 6) * 0.1)
    })
  }
  if (planes.length !== PLANES.grey + PLANES.blue + PLANES.orange) console.warn('s17: the field does not hold a hundred planes')

  // the six: from the end of each row (in the field at the left) out into the free air at its right,
  // nearer the room as they climb. The climb is drawn on the stage, with depth added.
  const scratch = new THREE.Vector3()
  const curve = (p: NonNullable<Plane['path']>, t: number, out: THREE.Vector3) => {
    const k = 1 - t
    scratch
      .set(0, 0, 0)
      .addScaledVector(p[0], k * k * k)
      .addScaledVector(p[1], 3 * k * k * t)
      .addScaledVector(p[2], 3 * k * t * t)
      .addScaledVector(p[3], t * t * t)
    const w = (CAM - scratch.z) / CAM
    return out.set((scratch.x - 50) * w, (28.125 - scratch.y) * w, scratch.z)
  }
  for (const p of planes) {
    if (p.six === undefined) continue
    const t = SIX[p.six]
    const from = project(p.slot)
    const start = new THREE.Vector3(from.u, from.v, p.slot.z)
    const end = new THREE.Vector3(t.u, t.v, t.z)
    const reach = Math.hypot(end.x - start.x, end.y - start.y)
    const h = (t.head * Math.PI) / 180
    // along the ground first, then up; it arrives on its own heading
    p.path = [
      start,
      new THREE.Vector3(start.x + reach * 0.42, start.y - reach * 0.03, start.z + 0.6),
      new THREE.Vector3(end.x - reach * 0.5 * Math.cos(h), end.y + reach * 0.5 * Math.sin(h), t.z * 0.8),
      end,
    ]
    p.endSize = t.size / (2.15 * (CAM / (CAM - t.z))) / 0.86
    // the dots of its trail stand evenly along the arc as the room sees it
    p.dots = []
    let gone = 0
    let last = start.clone()
    for (let n = 1; n <= 600 && p.dots.length < TRAIL; n++) {
      const s = n / 600
      const k = 1 - s
      scratch
        .set(0, 0, 0)
        .addScaledVector(p.path[0], k * k * k)
        .addScaledVector(p.path[1], 3 * k * k * s)
        .addScaledVector(p.path[2], 3 * k * s * s)
        .addScaledVector(p.path[3], s * s * s)
      gone += Math.hypot(scratch.x - last.x, scratch.y - last.y)
      last = scratch.clone()
      if (gone >= DOT_GAP) {
        gone = 0
        if (s > 0.1 && s < 0.9) p.dots.push(s)
      }
    }
  }

  const mesh = new THREE.InstancedMesh(
    dart(),
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      side: THREE.DoubleSide,
      roughness: 0.95,
      metalness: 0,
    }),
    planes.length,
  )
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  planes.forEach((_, i) => mesh.setColorAt(i, PAPER))
  mesh.instanceColor?.setUsage(THREE.DynamicDrawUsage)

  const shade = marks(planes.length, '#2b4a7c', 0)
  shade.mesh.renderOrder = -2
  const trail = marks(PLANES.orange * TRAIL, '#f2805e', 0.72)
  trail.mesh.renderOrder = -1
  gl.scene.add(shade.mesh, trail.mesh, mesh)

  const state: FieldState = {
    landG: 0,
    landB: 0,
    landS: 0,
    shift: 0,
    gust: 0,
    hot: 0,
    fly: SIX.map(() => ({ t: 0 })),
    idle: 0,
  }

  /* ---- numbers → matrices ---- */
  const m = new THREE.Matrix4()
  const f = new THREE.Vector3()
  const u = new THREE.Vector3()
  const r = new THREE.Vector3()
  const hint = new THREE.Vector3()
  const pos = new THREE.Vector3()
  const tmp = new THREE.Vector3()
  const col = new THREE.Color()
  const hide = new THREE.Matrix4().makeScale(0, 0, 0)
  const airUp = new THREE.Vector3(-0.3, 0.52, 0.8).normalize()

  /** A plane's matrix from where it is, where it heads, which way is up for it, its roll, its pitch and its size. */
  const pose = (i: number, at: THREE.Vector3, fwd: THREE.Vector3, upHint: THREE.Vector3, roll: number, pitch: number, size: number) => {
    f.copy(fwd).normalize()
    r.crossVectors(f, upHint).normalize()
    u.crossVectors(r, f)
    if (pitch) {
      f.multiplyScalar(Math.cos(pitch)).addScaledVector(u, Math.sin(pitch)).normalize()
      u.crossVectors(r, f)
    }
    if (roll) {
      u.multiplyScalar(Math.cos(roll)).addScaledVector(r, Math.sin(roll)).normalize()
      r.crossVectors(f, u)
    }
    m.makeBasis(f, u, r)
    m.scale(tmp.set(size, size, size))
    m.setPosition(at)
    mesh.setMatrixAt(i, m)
  }
  /** A shadow lying on the ground under `at`. */
  const shadow = (i: number, at: THREE.Vector3, size: number, strength: number) => {
    const h = tmp.copy(at).sub(origin).dot(up)
    pos.copy(at).addScaledVector(up, -h + 0.02)
    // the light comes from the upper left: the shadow falls a little to the right and toward the room
    pos.addScaledVector(ex, 0.25 * size + h * 0.5).addScaledVector(ed, -0.12 * size - h * 0.25)
    const w = size * (2.5 + h * 0.5)
    m.makeBasis(tmp.copy(ex).multiplyScalar(w), r.copy(ed).multiplyScalar(w * 0.62), up)
    m.setPosition(pos)
    shade.mesh.setMatrixAt(i, m)
    shade.alpha.setX(i, strength / (1 + h * 0.5))
  }
  const ahead = new THREE.Vector3()
  /** Where a plane is at `t` of its climb, and which way it is heading there. */
  const bezier = (p: NonNullable<Plane['path']>, t: number, out: THREE.Vector3, tangent: THREE.Vector3) => {
    const a = Math.max(0, t - 0.004)
    const b = Math.min(1, t + 0.004)
    curve(p, a, tangent)
    curve(p, b, ahead)
    tangent.subVectors(ahead, tangent)
    // it climbs toward the room, but it is always shown from its side: never nose-on, never a sliver
    tangent.z *= 0.16
    curve(p, t, out)
  }

  const still = ctx.held || ctx.reduced
  const tangent = new THREE.Vector3()
  const at = new THREE.Vector3()

  const here = new THREE.Vector3()
  const update = (time: number) => {
    const clock = still ? 0 : time
    const shift = clamp01(state.shift)
    planes.forEach((p, i) => {
      const land = p.kind === 'grey' ? state.landG : p.kind === 'blue' ? state.landB : state.landS
      // each plane's own part of its group's wave
      const local = clamp01((land - p.order * 0.6) / 0.4)
      if (local <= 0) {
        mesh.setMatrixAt(i, hide)
        shade.alpha.setX(i, 0)
        shade.mesh.setMatrixAt(i, hide)
        return
      }
      const e = outCubic(local)
      // where it stands now: between the wide field and the field at the left
      here.copy(p.slotA).lerp(p.slot, shift)
      const stood = p.sizeA + (p.size - p.sizeA) * shift
      const size = stood * smooth(local / 0.35)
      const t = p.six === undefined ? 0 : clamp01(state.fly[p.six].t)
      if (p.path && t > 0) {
        // in the air: along its climb, banking into the turn, levelling out as it arrives
        bezier(p.path, t, at, tangent)
        // (it left while the field was still moving: that offset fades in the first part of the climb)
        const carry = 1 - smooth(t / 0.45)
        if (carry > 0) at.addScaledVector(tmp.copy(here).sub(p.slot), carry)
        const lift = smooth(t / 0.3)
        hint.copy(up).lerp(airUp, lift).normalize()
        const hover = state.idle * smooth((t - 0.8) / 0.2)
        if (hover > 0) {
          const k = p.six ?? 0
          at.y += Math.sin(clock * 0.9 + k * 1.7) * 0.3 * hover
          at.x += Math.cos(clock * 0.6 + k * 2.3) * 0.14 * hover
        }
        // it banks TOWARD the room in the climb (its whole back is seen, never its edge), then settles a little the other way
        const bank = Math.sin(Math.PI * t) * 0.3 - (0.2 + Math.sin(clock * 0.7 + (p.six ?? 0) * 2.1) * 0.07 * hover) * smooth((t - 0.45) / 0.55)
        const grown = stood + ((p.endSize ?? p.size) - stood) * smooth(t)
        pose(i, at, tangent, hint, p.roll * (1 - lift) + bank, 0, grown)
        shadow(i, at, grown, 0.2 * (1 - 0.55 * smooth(t / 0.5)))
      } else {
        // gliding in along its heading and settling on its keel
        const back = (1 - e) * 9 * (stood / SIZE)
        const high = Math.pow(1 - e, 1.6) * 4.2 * (stood / SIZE)
        // the wake of the six: a gust runs through the field from the end they left, and each plane lifts a wing
        const g = state.gust * 1.55 - (1 - p.nx) * 0.55
        const gust = g > 0 && g < 1 ? Math.pow(Math.sin(Math.PI * g), 2) : 0
        at.copy(here)
          .addScaledVector(p.dir, -back)
          .addScaledVector(up, high + gust * 0.55 * stood)
        pose(i, at, p.dir, up, p.roll + (1 - e) * 0.5 + gust * (0.42 + rnd(i, 7) * 0.25), -(1 - e) * 0.2 + gust * 0.14, size)
        shadow(i, at, size, 0.2 * smooth(local / 0.35))
      }
      // its colour: the six stay paper white until they are the ones that fly
      if (p.kind === 'grey') col.copy(GREY_C)
      else if (p.kind === 'blue') col.copy(BLUE_C)
      else col.copy(PAPER).lerp(FLAME_C, clamp01(state.hot))
      mesh.setColorAt(i, col)

      // the dotted trail behind each of the six: the last stretch of its climb
      if (p.path && p.dots && p.six !== undefined) {
        for (let k = 0; k < TRAIL; k++) {
          const n = p.six * TRAIL + k
          const s = p.dots[k]
          // the whole arc while it climbs; once it hangs in the air only the last stretch stays, fading at its tail
          const first = (p.dots.length - STAY) * smooth((t - 0.6) / 0.4) - 6 * (1 - smooth((t - 0.6) / 0.4))
          const strength = s === undefined ? 0 : smooth((t - 0.07 - s) / 0.03) * smooth((k - first) / 8)
          if (strength <= 0.001) {
            trail.alpha.setX(n, 0)
            trail.mesh.setMatrixAt(n, hide)
            continue
          }
          curve(p.path, s, pos)
          // the same size on the stage wherever it hangs
          const d = (DOT * (0.8 + 0.5 * s) * (CAM - pos.z)) / CAM
          m.makeScale(d, d, d)
          m.setPosition(pos)
          trail.mesh.setMatrixAt(n, m)
          trail.alpha.setX(n, 0.9 * strength)
        }
      }
    })
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    shade.mesh.instanceMatrix.needsUpdate = true
    shade.alpha.needsUpdate = true
    trail.mesh.instanceMatrix.needsUpdate = true
    trail.alpha.needsUpdate = true
  }
  for (let n = 0; n < PLANES.orange * TRAIL; n++) trail.mesh.setMatrixAt(n, hide)
  update(0)
  gl.onFrame(update)

  const flyers = planes.filter((p) => p.path)
  return {
    gl,
    state,
    seen(i, t) {
      const p = flyers[i]?.path
      if (!p) return { u: 50, v: 28 }
      bezier(p, clamp01(t), at, tangent)
      return project(at)
    },
  }
}
