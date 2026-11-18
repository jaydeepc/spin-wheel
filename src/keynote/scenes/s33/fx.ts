'use client'

/**
 * The pit lane's own WebGL: the sparks of four wheel guns going at once, and the tyre smoke the
 * car leaves in its box when it goes. Both are fields of points whose whole flight is computed
 * in the vertex shader from ONE number each (a clock in seconds), and the timeline tweens that
 * number: so every frame is reachable by seeking, Back unwinds them, and nothing runs by itself.
 *
 * The world is the stage (see three/sceneCanvas.ts): one unit is one --u at z = 0.
 */

import { createSceneCanvas, THREE, type SceneCtx } from '../../kit'

export interface PitFx {
  /** The sparks' clock, in seconds: tween `value` from 0 to SPARK_END. */
  sparks: { value: number }
  /** The smoke's clock, in seconds: tween `value` from 0 to SMOKE_END. The car leaves at SMOKE_GO. */
  smoke: { value: number }
  dispose(): void
}

export const SPARK_END = 1.8
/** Seconds between two pushes of the wheel guns (the timeline's GUN). */
export const SPARK_GAP = 0.24
export const SMOKE_GO = 0.3
export const SMOKE_END = 2.3

/** A small repeatable random: the same field on every build, so a held frame is the same frame on every visit. */
function rand(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const VERT = /* glsl */ `
  attribute vec3 aVel;
  attribute vec4 aMeta;            // delay, life, size (in --u), a random number
  uniform float uT;
  uniform float uPx;               // device pixels to one --u
  uniform float uDrag;
  uniform vec2 uGrow;              // size at birth and at the end, as factors
  varying float vK;
  varying float vSeed;
  varying float vAlive;
  void main() {
    float tau = uT - aMeta.x;
    float k = tau / aMeta.y;
    float alive = step(0.0, tau) * step(k, 1.0) * step(0.0001, uT);
    vec3 p = position + aVel * (1.0 - exp(-uDrag * max(tau, 0.0))) / uDrag;
    vK = clamp(k, 0.0, 1.0);
    vSeed = aMeta.w;
    vAlive = alive;
    // a point that is not in flight is put outside the picture (a point of size 0 is still a pixel on some GPUs)
    gl_Position = alive > 0.5 ? projectionMatrix * modelViewMatrix * vec4(p, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = max(aMeta.z * uPx * mix(uGrow.x, uGrow.y, vK), 1.0);
  }
`

const SPARK_FRAG = /* glsl */ `
  varying float vK;
  varying float vSeed;
  varying float vAlive;
  void main() {
    if (vAlive < 0.5) discard;
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float halo = smoothstep(1.0, 0.0, r);
    float core = smoothstep(0.42, 0.12, r);
    vec3 hot = vec3(1.0, 0.97, 0.80);
    vec3 amber = vec3(1.0, 0.66, 0.16);
    vec3 flame = vec3(0.93, 0.26, 0.14);
    float age = clamp(vK + vSeed * 0.2, 0.0, 1.0);
    vec3 body = mix(amber, flame, smoothstep(0.15, 0.75, age));
    vec3 col = mix(body, hot, core * (1.0 - age));
    float a = (halo * halo * 0.9 + core) * (1.0 - vK * vK * vK);
    gl_FragColor = vec4(col, min(a, 1.0));
  }
`

/* the light a wheel gun throws on the ground and on the car at each push: warm, soft, brief */
const GLOW_FRAG = /* glsl */ `
  varying float vK;
  varying float vSeed;
  varying float vAlive;
  void main() {
    if (vAlive < 0.5) discard;
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float soft = smoothstep(1.0, 0.0, r);
    float core = smoothstep(0.45, 0.0, r);
    vec3 col = mix(vec3(1.0, 0.62, 0.2), vec3(1.0, 0.95, 0.82), core);
    float a = (soft * soft * 0.62 + core * 0.5) * (1.0 - vK) * (1.0 - vK);
    gl_FragColor = vec4(col, min(a, 1.0));
  }
`

const SMOKE_FRAG = /* glsl */ `
  varying float vK;
  varying float vSeed;
  varying float vAlive;
  void main() {
    if (vAlive < 0.5) discard;
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float puff = smoothstep(1.0, 0.0, r);
    float a = puff * puff * smoothstep(0.0, 0.14, vK) * (1.0 - vK) * (1.0 - vK);
    vec3 col = mix(vec3(0.985, 0.99, 1.0), vec3(0.62, 0.65, 0.70), step(0.8, vSeed));
    gl_FragColor = vec4(col, a * mix(0.2, 0.34, vSeed));
  }
`

/**
 * @param host    the element the canvas is put into (it covers the stage, over the lane and under the cards)
 * @param wheels  the four hubs on the stage, in --u: [u, v, the side of the car it is on (-1 the upper, +1 the lower)]
 * @param rear    the two rear hubs, in --u
 * @param run     how far the car has gone (in --u) `t` seconds after it lets go: the smoke is laid along its first metres
 */
export function makePitFx(ctx: SceneCtx, host: HTMLElement, wheels: [number, number, number][], rear: [number, number][], run: (t: number) => number): PitFx {
  const gl = createSceneCanvas(ctx, { into: host, above: true, lights: false })
  const px = gl.renderer.getDrawingBufferSize(new THREE.Vector2()).y / 56.25

  const field = (count: number, frag: string, drag: number, grow: [number, number], fill: (i: number, r: () => number) => number[], clock: { value: number } = { value: 0 }) => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const meta = new Float32Array(count * 4)
    const r = rand(count * 7 + 3)
    for (let i = 0; i < count; i++) {
      const [x, y, vx, vy, delay, life, size] = fill(i, r)
      const o = gl.at(x, y, 0)
      pos.set([o.x, o.y, o.z], i * 3)
      vel.set([vx, -vy, 0], i * 3) // the stage's y runs down, the world's up
      meta.set([delay, life, size, r()], i * 4)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aVel', new THREE.BufferAttribute(vel, 3))
    geo.setAttribute('aMeta', new THREE.BufferAttribute(meta, 4))
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: frag,
      uniforms: {
        uT: clock,
        uPx: { value: px },
        uDrag: { value: drag },
        uGrow: { value: new THREE.Vector2(grow[0], grow[1]) },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    gl.scene.add(points)
    return clock
  }

  /* ---- sparks: three short bursts at each of the four wheels, thrown away from the car */
  /* A spark is a short streak: LINK points that leave one after another on the same path, the head
     the largest. Each wheel throws TRAILS of them, in three bursts (the three pushes of the gun). */
  const TRAILS = 44
  const LINK = 22
  const PER = TRAILS * LINK
  const BURSTS = 4
  const tr = rand(4099)
  const trails = Array.from({ length: wheels.length * TRAILS }, () => {
    const burst = Math.floor(tr() * BURSTS)
    const ang = (tr() - 0.5) * 2.7 // a wide fan about "away from the car"
    return {
      burst,
      ang,
      speed: 18 + tr() * tr() * 60,
      start: tr() * 0.09,
      life: 0.32 + tr() * 0.5,
      size: 0.5 + tr() * 0.7,
      dx: (tr() - 0.5) * 1.3,
      dy: 0.9 + tr() * 0.5,
    }
  })
  // the glow first: the sparks fly over it
  const GLOWS = BURSTS * 2
  const sparkClock = { value: 0 }
  field(
    GLOWS * wheels.length,
    GLOW_FRAG,
    4,
    [0.7, 1.15],
    (i, r) => {
      const [x, y, side] = wheels[Math.floor(i / GLOWS)]
      const burst = Math.floor((i % GLOWS) / 2)
      return [x + (r() - 0.5) * 0.8, y + side * 1.3, 0, 0, 0.02 + burst * SPARK_GAP, 0.3, i % 2 ? 6 : 10.5]
    },
    sparkClock,
  )
  const sparks = field(
    PER * wheels.length,
    SPARK_FRAG,
    4.4,
    [1, 0.4],
    (i) => {
      const wheel = Math.floor(i / PER)
      const [x, y, side] = wheels[wheel]
      const t = trails[wheel * TRAILS + Math.floor((i % PER) / LINK)]
      const m = (i % LINK) / LINK // 0 the head … 1 the tail
      return [x + t.dx, y + side * t.dy, Math.sin(t.ang) * t.speed, side * Math.cos(t.ang) * t.speed * 0.8, 0.02 + t.burst * SPARK_GAP + t.start + m * 0.075, t.life * (1 - m * 0.35), t.size * (1 - m * 0.7)]
    },
    sparkClock,
  )

  /* ---- smoke: from the two rear tyres as they spin up, laid along the first metres of the run */
  const HALF = 1300
  /** … and a thin wisp that is still hanging at the box's way out when the scene comes to rest. */
  const WISP = 0
  const EACH = HALF + WISP
  const smoke = field(EACH * rear.length, SMOKE_FRAG, 1.7, [0.3, 1], (i, r) => {
    const [x, y] = rear[Math.floor(i / EACH)]
    if (i % EACH >= HALF) {
      const along = 2 + r() * 20
      const ang = Math.PI + (r() - 0.5) * 2.6
      return [x - 1 + along, y + (r() - 0.5) * 3.2, Math.cos(ang) * 1.6, Math.sin(ang) * 1.3, 0.4 + r() * 0.6, 7 + r() * 5, 11 + r() * 9]
    }
    const delay = r() * 0.8
    const gone = run(Math.min(Math.max(delay - SMOKE_GO, 0), 0.5))
    const ang = Math.PI + (r() - 0.5) * 2.2 // backward, fanning out
    const speed = 1.5 + r() * 8
    return [x + gone + (r() - 0.5) * 2.2, y + (r() - 0.5) * 2.6, Math.cos(ang) * speed, Math.sin(ang) * speed * 0.7, delay, 0.7 + r() * 0.75, 2.2 + r() * 3.4]
  })

  return { sparks, smoke, dispose: gl.dispose }
}
