'use client'

/**
 * The railway's own WebGL, drawn over the landscape band: the steam of the second engine and
 * the air that streaks past the high-speed train. Both are drawn from plain numbers that the
 * timeline tweens (a clock for the steam; a distance, a strength and a length for the streaks),
 * so every frame is reachable by seeking, Back unwinds them and nothing runs by itself.
 *
 * The world is the stage (three/sceneCanvas.ts): one unit is one --u at z = 0.
 */

import { createSceneCanvas, THREE, type SceneCtx } from '../../kit'

export interface RailFx {
  /** The steam's clock in seconds (tween `t`). `chimney(t)` says where the chimney is at that time, in --u. */
  steam: { t: number }
  chimney: (t: number) => [number, number]
  /** The streaks: `phase` the distance run in --u (negative runs them to the right), `amt` 0…1, `len` 0…1. */
  streak: { phase: number; amt: number; len: number }
  /** The train's body in --u: the streaks keep off it. */
  body: { x0: number; x1: number; y0: number; y1: number }
  dispose(): void
}

/** A small repeatable random: the same field on every build, so a held frame is the same on every visit. */
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

/** The steam is born between these two times of its clock. */
export const STEAM_FROM = 0.75
export const STEAM_TO = 5.6
const PUFFS = 260

const STEAM_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  uniform float uPx;
  varying float vA;
  void main() {
    vA = aAlpha;
    gl_Position = aAlpha > 0.001 ? projectionMatrix * modelViewMatrix * vec4(position, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = max(aSize * uPx, 1.0);
  }
`
const STEAM_FRAG = /* glsl */ `
  varying float vA;
  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.15, r);
    float shade = smoothstep(-0.6, 0.7, gl_PointCoord.y - 0.5);
    gl_FragColor = vec4(mix(vec3(1.0, 0.99, 0.97), vec3(0.74, 0.78, 0.86), shade * 0.75), a * a * vA);
  }
`

const STREAKS = 300
const SPAN = 124

const STREAK_VERT = /* glsl */ `
  attribute vec4 aSeed;     // x0 (0…1), y (0…1), speed, length
  attribute vec2 aCorner;
  uniform float uPhase;
  uniform float uLen;
  uniform float uAmt;
  uniform vec2 uBand;       // the band's top and height, in --u
  uniform vec4 uBody;       // the train's body: left, right, top, bottom in --u (the air goes round it)
  varying vec2 vUv;
  varying float vA;
  void main() {
    float x = mod(aSeed.x * ${SPAN.toFixed(1)} - uPhase * aSeed.z, ${SPAN.toFixed(1)}) - 12.0;
    float y = uBand.x + aSeed.y * uBand.y;
    float L = 0.5 + uLen * 22.0 * aSeed.w * aSeed.z;
    float th = 0.03 + 0.045 * fract(aSeed.w * 7.31);
    vec2 p = vec2(x + aCorner.x * 0.5 * L, y + aCorner.y * th);
    vUv = aCorner;
    float inBody = smoothstep(uBody.x - 3.0, uBody.x + 1.0, p.x) * (1.0 - smoothstep(uBody.y - 2.0, uBody.y + 6.0, p.x))
      * smoothstep(uBody.z - 0.6, uBody.z + 0.6, y) * (1.0 - smoothstep(uBody.w - 0.5, uBody.w + 0.3, y));
    vA = uAmt * (0.25 + 0.55 * fract(aSeed.x * 13.7 + aSeed.y * 5.1)) * (1.0 - 0.94 * inBody);
    gl_Position = uAmt > 0.002 ? projectionMatrix * modelViewMatrix * vec4(p.x - 50.0, 28.125 - p.y, 0.0, 1.0) : vec4(2.0, 2.0, 2.0, 1.0);
  }
`
const STREAK_FRAG = /* glsl */ `
  varying vec2 vUv;
  varying float vA;
  void main() {
    float along = 1.0 - abs(vUv.x);
    float across = 1.0 - abs(vUv.y);
    float a = smoothstep(0.0, 0.7, along) * smoothstep(0.0, 0.8, across) * vA;
    gl_FragColor = vec4(1.0, 1.0, 1.0, a);
  }
`

export function createRailFx(ctx: SceneCtx, band: { top: number; height: number }): RailFx {
  const gl = createSceneCanvas(ctx, { above: true, lights: false, antialias: false })
  const px = gl.renderer.getPixelRatio() * ctx.U

  /* ---- steam ---- */
  const r = rand(4507)
  const puffs = Array.from({ length: PUFFS }, (_, i) => ({
    born: STEAM_FROM + ((i + r() * 0.8) / PUFFS) * (STEAM_TO - STEAM_FROM),
    life: 1.6 + r() * 1.3,
    drift: 0.5 + r() * 1.1,
    rise: 2.6 + r() * 2.2,
    wob: r() * 6.28,
    size: 1.15 + r() * 1.1,
  }))
  const pos = new Float32Array(PUFFS * 3)
  const size = new Float32Array(PUFFS)
  const alpha = new Float32Array(PUFFS)
  const sg = new THREE.BufferGeometry()
  sg.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  sg.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
  sg.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1))
  const steamMat = new THREE.ShaderMaterial({
    vertexShader: STEAM_VERT,
    fragmentShader: STEAM_FRAG,
    uniforms: { uPx: { value: px } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })
  const steamPts = new THREE.Points(sg, steamMat)
  steamPts.frustumCulled = false
  gl.scene.add(steamPts)

  /* ---- streaks ---- */
  const r2 = rand(4609)
  const seed = new Float32Array(STREAKS * 4 * 4)
  const corner = new Float32Array(STREAKS * 4 * 2)
  const index: number[] = []
  const quad = [-1, -1, 1, -1, 1, 1, -1, 1]
  for (let i = 0; i < STREAKS; i++) {
    const s = [r2(), Math.pow(r2(), 0.8), 0.7 + r2() * 1.1, 0.35 + r2() * 0.65]
    for (let k = 0; k < 4; k++) {
      seed.set(s, (i * 4 + k) * 4)
      corner.set([quad[k * 2], quad[k * 2 + 1]], (i * 4 + k) * 2)
    }
    index.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3)
  }
  const qg = new THREE.BufferGeometry()
  qg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(STREAKS * 4 * 3), 3))
  qg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 4))
  qg.setAttribute('aCorner', new THREE.BufferAttribute(corner, 2))
  qg.setIndex(index)
  const streakMat = new THREE.ShaderMaterial({
    vertexShader: STREAK_VERT,
    fragmentShader: STREAK_FRAG,
    uniforms: {
      uPhase: { value: 0 },
      uLen: { value: 0 },
      uAmt: { value: 0 },
      uBand: { value: new THREE.Vector2(band.top, band.height) },
      uBody: { value: new THREE.Vector4(-200, -200, 0, 0) },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
  })
  const streaks = new THREE.Mesh(qg, streakMat)
  streaks.frustumCulled = false
  gl.scene.add(streaks)

  const fx: RailFx = {
    steam: { t: 0 },
    chimney: () => [-50, -50],
    streak: { phase: 0, amt: 0, len: 0 },
    body: { x0: -200, x1: -200, y0: 0, y1: 0 },
    dispose: gl.dispose,
  }

  gl.onFrame(() => {
    const t = fx.steam.t
    let any = false
    for (let i = 0; i < PUFFS; i++) {
      const p = puffs[i]
      const age = t - p.born
      if (age <= 0 || age >= p.life || t <= 0.001) {
        alpha[i] = 0
        continue
      }
      any = true
      const k = age / p.life
      const [cx, cy] = fx.chimney(p.born)
      const up = p.rise * (1 - Math.exp(-1.5 * age))
      const u = cx - p.drift * age + Math.sin(p.wob + age * 2.2) * 0.22 * k
      const v = cy - up
      pos[i * 3] = u - 50
      pos[i * 3 + 1] = 28.125 - v
      pos[i * 3 + 2] = 0
      size[i] = p.size * (1 + 2.6 * k)
      alpha[i] = 0.92 * Math.min(1, age / 0.07) * Math.pow(1 - k, 1.4)
    }
    steamPts.visible = any
    sg.attributes.position.needsUpdate = true
    sg.attributes.aSize.needsUpdate = true
    sg.attributes.aAlpha.needsUpdate = true
    streakMat.uniforms.uPhase.value = fx.streak.phase
    streakMat.uniforms.uLen.value = fx.streak.len
    streakMat.uniforms.uAmt.value = fx.streak.amt
    streakMat.uniforms.uBody.value.set(fx.body.x0, fx.body.x1, fx.body.y0, fx.body.y1)
    streaks.visible = fx.streak.amt > 0.002
  })

  return fx
}
