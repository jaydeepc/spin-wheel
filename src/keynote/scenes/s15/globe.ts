/**
 * THE GLOBE of slide 15: this chapter is about AI in the world.
 *
 * A sphere of fine points where the land is (land.ts: coastlines only, no borders), a dark body
 * that holds the backdrop's stars back, a thin atmosphere in the clear blue at its limb, and a
 * few arcs of light travelling over it. It lives in the divider's own canvas (one canvas a
 * scene), behind the block of glass and under the words.
 *
 *   root   where it stands and how large: the timeline moves it
 *   tilt   the axis, leaning
 *   spin   the turn about that axis: the timeline's `turn` plus the slow idle turn
 */

import { THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { landMask } from './land'

/** Where it stands (stage units) and its radius: large, at the right, running off the stage. */
export const GLOBE = { u: 81, v: 31.5, r: 21.5 }
/** The longitude that faces the room at rest, in degrees east. */
const FACE = 66
/** The idle turn, radians a second: one turn in about four minutes. */
const IDLE = 0.026

const AZURE = new THREE.Color('#4384d4')
const SKY = new THREE.Color('#8fc2ff')
const DEEP = new THREE.Color('#040d33')

/** Points on land the arcs run between: [lat, lon]. Places on the map, not countries; nothing is named. */
const ARCS: [[number, number], [number, number]][] = [
  [[48, 8], [22, 78]],
  [[22, 78], [35, 110]],
  [[5, 22], [48, 8]],
  [[35, 110], [-25, 134]],
  [[56, 44], [22, 78]],
  [[40, -98], [48, 8]],
  [[-12, -52], [5, 22]],
  [[40, -98], [-12, -52]],
  [[36, 138], [40, -120]],
  [[-25, 134], [-30, 24]],
]

function onSphere(lat: number, lon: number, r = 1): THREE.Vector3 {
  const p = (lat * Math.PI) / 180
  const l = (lon * Math.PI) / 180
  return new THREE.Vector3(Math.cos(p) * Math.sin(l) * r, Math.sin(p) * r, Math.cos(p) * Math.cos(l) * r)
}

/** A repeatable 0 … 1 from an index: nothing here may differ between two visits. */
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

export interface Globe {
  root: THREE.Group
  /** Numbers the timeline tweens. */
  state: { show: number; turn: number; arcs: number; idle: number }
  /** The turn at rest. */
  rest: number
}

export function makeGlobe(ctx: SceneCtx, gl: SceneCanvas): Globe {
  const root = new THREE.Group()
  const tilt = new THREE.Group()
  const spin = new THREE.Group()
  tilt.rotation.set(0.34, 0, -0.2)
  root.add(tilt)
  tilt.add(spin)
  root.position.copy(gl.at(GLOBE.u, GLOBE.v))
  root.scale.setScalar(GLOBE.r)

  const px = gl.renderer.getPixelRatio() * (ctx.H / 1080)
  const uShow = { value: 0 }
  const uTime = { value: 0 }
  const uArcs = { value: 0 }
  const flat = { transparent: true, depthTest: false, depthWrite: false }

  // ---- the atmosphere: a shell a little larger than the body, brightest where it meets the limb
  const SHELL = 1.2
  const edge = Math.sqrt(1 - 1 / (SHELL * SHELL))
  const air = new THREE.Mesh(
    new THREE.SphereGeometry(SHELL, 72, 48),
    new THREE.ShaderMaterial({
      ...flat,
      blending: THREE.AdditiveBlending,
      uniforms: { uShow, uColor: { value: AZURE }, uEdge: { value: edge } },
      vertexShader: `
        varying vec3 vN; varying vec3 vV;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal); vV = -mv.xyz;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uShow; uniform vec3 uColor; uniform float uEdge;
        varying vec3 vN; varying vec3 vV;
        void main() {
          vec3 n = normalize(vN);
          float f = dot(n, normalize(vV));
          float a = pow(clamp(f / uEdge, 0.0, 1.0), 3.2) * (1.0 - smoothstep(uEdge, uEdge + 0.3, f));
          // the light comes from the upper left: the far side of the limb is quieter
          float lit = 0.5 + 0.5 * clamp(dot(n, normalize(vec3(-0.55, 0.6, 0.35))) + 0.35, 0.0, 1.0);
          gl_FragColor = vec4(uColor, a * 0.62 * lit * uShow);
        }`,
    }),
  )
  air.renderOrder = -6
  root.add(air)

  // ---- the body: deep navy, nearly opaque, a blue edge
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 64),
    new THREE.ShaderMaterial({
      ...flat,
      uniforms: { uShow, uDeep: { value: DEEP }, uRim: { value: AZURE } },
      vertexShader: `
        varying vec3 vN; varying vec3 vV;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal); vV = -mv.xyz;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uShow; uniform vec3 uDeep; uniform vec3 uRim;
        varying vec3 vN; varying vec3 vV;
        void main() {
          vec3 n = normalize(vN);
          float f = 1.0 - clamp(dot(n, normalize(vV)), 0.0, 1.0);
          float day = clamp(dot(n, normalize(vec3(-0.55, 0.6, 0.55))), 0.0, 1.0);
          vec3 c = uDeep + uRim * (0.10 * day + 0.07) + uRim * pow(f, 3.0) * (0.35 + 0.65 * day);
          float a = 0.66 + 0.3 * pow(f, 2.0);
          gl_FragColor = vec4(c, a * uShow);
        }`,
    }),
  )
  body.renderOrder = -5
  root.add(body)

  // ---- the land, in fine points (and the sea, in very few and very faint ones: the round of it)
  const isLand = landMask()
  const N = 46000
  const pos: number[] = []
  const kk: number[] = []
  const sz: number[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < N; i++) {
    const y = 1 - ((i + 0.5) / N) * 2
    const rad = Math.sqrt(1 - y * y)
    const th = i * golden
    const x = Math.sin(th) * rad
    const z = Math.cos(th) * rad
    const lat = (Math.asin(y) * 180) / Math.PI
    const lon = (Math.atan2(x, z) * 180) / Math.PI
    const land = isLand(lat, lon)
    if (!land && i % 5 !== 0) continue
    pos.push(x, y, z)
    kk.push(land ? 0.78 + 0.22 * rnd(i) : 0.13)
    sz.push(land ? 1.0 + 0.4 * rnd(i + 7) : 0.75)
  }
  const dotsGeo = new THREE.BufferGeometry()
  dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  dotsGeo.setAttribute('aK', new THREE.Float32BufferAttribute(kk, 1))
  dotsGeo.setAttribute('aS', new THREE.Float32BufferAttribute(sz, 1))
  const dots = new THREE.Points(
    dotsGeo,
    new THREE.ShaderMaterial({
      ...flat,
      uniforms: { uShow, uPx: { value: px * 2.5 }, uColor: { value: SKY } },
      vertexShader: `
        attribute float aK; attribute float aS;
        uniform float uPx;
        varying float vA;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float f = dot(normalize(normalMatrix * position), normalize(-mv.xyz));
          // only the side that faces the room, thinning out toward the limb
          vA = aK * smoothstep(0.02, 0.3, f) * (0.6 + 0.4 * f);
          gl_PointSize = uPx * aS * (0.75 + 0.25 * f);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uShow; uniform vec3 uColor;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = 1.0 - smoothstep(0.55, 1.0, d);
          if (a * vA < 0.004) discard;
          gl_FragColor = vec4(uColor, a * vA * uShow);
        }`,
    }),
  )
  dots.frustumCulled = false
  dots.renderOrder = -4
  spin.add(dots)

  // ---- the arcs: a faint dotted track from place to place, and a light that travels along it
  const ap: number[] = []
  const at: number[] = []
  const aph: number[] = []
  const asp: number[] = []
  const STEPS = 260
  ARCS.forEach(([from, to], n) => {
    const a = onSphere(from[0], from[1])
    const b = onSphere(to[0], to[1])
    const ang = a.angleTo(b)
    const lift = 0.025 + 0.13 * (ang / Math.PI)
    const phase = 0.3 + 0.45 * rnd(n * 3 + 1)
    const speed = 0.085 + 0.05 * rnd(n * 5 + 2)
    for (let i = 0; i <= STEPS; i++) {
      const t = i / STEPS
      const p = a
        .clone()
        .multiplyScalar(Math.sin((1 - t) * ang) / Math.sin(ang))
        .add(b.clone().multiplyScalar(Math.sin(t * ang) / Math.sin(ang)))
        .multiplyScalar(1 + lift * Math.sin(Math.PI * t))
      ap.push(p.x, p.y, p.z)
      at.push(t)
      aph.push(phase)
      asp.push(speed)
    }
    // the two places it joins: aT < 0 marks them
    for (const e of [a, b]) {
      ap.push(e.x, e.y, e.z)
      at.push(-1)
      aph.push(phase)
      asp.push(speed)
    }
  })
  const arcGeo = new THREE.BufferGeometry()
  arcGeo.setAttribute('position', new THREE.Float32BufferAttribute(ap, 3))
  arcGeo.setAttribute('aT', new THREE.Float32BufferAttribute(at, 1))
  arcGeo.setAttribute('aPh', new THREE.Float32BufferAttribute(aph, 1))
  arcGeo.setAttribute('aSp', new THREE.Float32BufferAttribute(asp, 1))
  const arcs = new THREE.Points(
    arcGeo,
    new THREE.ShaderMaterial({
      ...flat,
      blending: THREE.AdditiveBlending,
      uniforms: { uShow, uTime, uArcs, uPx: { value: px * 2.6 }, uColor: { value: new THREE.Color('#cfe4ff') } },
      vertexShader: `
        attribute float aT; attribute float aPh; attribute float aSp;
        uniform float uPx; uniform float uTime; uniform float uArcs;
        varying float vA;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float f = dot(normalize(normalMatrix * position), normalize(-mv.xyz));
          float face = smoothstep(0.24, 0.52, f);
          float size = 1.0;
          if (aT < 0.0) {
            vA = 0.85 * uArcs;
            size = 2.1;
          } else {
            // the light: a head with a tail behind it, running from 0 to 1 and round again
            float head = fract(uTime * aSp + aPh) * 1.5 - 0.2;
            float d = head - aT;
            float glow = d > 0.0 ? exp(-d * 6.5) : exp(d * 70.0);
            float drawn = 1.0 - smoothstep(uArcs * 1.15 - 0.15, uArcs * 1.15, aT);
            vA = (0.16 + 0.95 * glow) * drawn;
            size = 0.62 + 1.3 * glow;
          }
          vA *= face;
          gl_PointSize = uPx * size;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform float uShow; uniform vec3 uColor;
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float a = 1.0 - smoothstep(0.35, 1.0, d);
          if (a * vA < 0.004) discard;
          gl_FragColor = vec4(uColor, a * vA * uShow);
        }`,
    }),
  )
  arcs.frustumCulled = false
  arcs.renderOrder = -3
  spin.add(arcs)

  const rest = (-FACE * Math.PI) / 180
  const state = { show: 0, turn: rest, arcs: 0, idle: 0 }
  const still = ctx.held || ctx.reduced
  let drift = 0
  gl.onFrame((time, dt) => {
    if (!still) drift += dt * IDLE * state.idle
    uShow.value = state.show
    uArcs.value = state.arcs
    uTime.value = still ? 0 : time
    spin.rotation.y = state.turn + drift
  })

  gl.scene.add(root)
  return { root, state, rest }
}
