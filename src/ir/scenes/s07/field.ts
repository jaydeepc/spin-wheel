'use client'

/**
 * /ir slide 07 · THE FIELD: some sixteen thousand points of light, ONE THREE.Points, moved
 * entirely in its vertex shader. Each point knows four places:
 *
 *   position   where it stands on slide 6's last rest (a letter of the big AI line, a tile, the
 *              RoE track …), with the colour slide 6 has there
 *   the orb    a place on a small turning sphere at the middle of the stage
 *   aText      a place on the letters "Thank You!"
 *   aQa        a place on the letters "Q&A" (half of the points), or none: those stay in the ribbon
 *
 * The timeline never touches a point. It tweens the plain numbers of `u` (each a uniform), and the
 * shader turns them into sixteen thousand places on every frame and on every seek:
 *
 *   uIn        0 … 1   the field is there at all
 *   uLift      0 … 1   the points come loose from slide 6's shapes
 *   uGather    0 … 1   they spiral into the orb (those nearest first)
 *   uSpin              the orb's own turn, in radians
 *   uOrbR              the orb's radius, in --u
 *   uHeat      0 … 1   ink on paper (slide 6's colours, drawn over) … light (white, peach, sky, added)
 *   uBurst     0 … 1   out of the orb, past their letters, and back onto them
 *   uTextFade  0 … 1   the letters of points give way to the real headline; a few stay
 *   uDrift     0 … 1   … and those few drift off it
 *   uRibbon    0 … 1   off the letters into a slow ribbon behind everything
 *   uQa        0 … 1   half of them gather once more, into "Q&A"
 *   uQaFade    0 … 1   and give way to the real letters
 *   uGlow, uRing, uRingA   the light at the orb, and the ring that leaves it when it bursts
 *   uHalo      0 … 1   the orb's warmth while the page is still light: an ember's halo, drawn over
 *
 * What idles (the orb's shimmer, the ribbon's flow, the drifting few, a slow twinkle) runs on the
 * canvas's own clock, which stands still while a frame is held (ctx.held).
 *
 * THE CANVAS IS IN THE STAGE, under every scene's layer, not inside this scene's own: so that it
 * is already there, behind slide 6, while slide 6 fades. See index.tsx, "the hand-over".
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import type { Picks } from './sample'
import { rng } from './sample'

export const N = 16000

/** The orb's place on the stage, in --u. Also where the backdrop's own change of theme opens from. */
export const ORB = { u: 50, v: 27 }

const U0 = {
  uTime: 0,
  uIn: 1,
  uLift: 0,
  uGather: 0,
  uSpin: 0,
  uOrbR: 3.6,
  uHeat: 0,
  uBurst: 0,
  uTextFade: 0,
  uDrift: 0,
  uRibbon: 0,
  uQa: 0,
  uQaFade: 0,
  uGlow: 0,
  uRing: 0,
  uRingA: 0,
  uHalo: 0,
}
export type FieldU = { [K in keyof typeof U0]: { value: number } }

export interface Field {
  gl: SceneCanvas
  u: FieldU
  dispose(): void
}

const VERT = /* glsl */ `
attribute vec3 aCol;
attribute vec3 aHot;
attribute vec2 aText;
attribute vec3 aQa;
attribute vec4 aRnd;
attribute vec2 aRnd2;
uniform float uTime, uIn, uLift, uGather, uSpin, uOrbR, uHeat, uBurst, uTextFade, uDrift, uRibbon, uQa, uQaFade, uPx, uCam;
uniform vec2 uC;
uniform vec4 uQaBox;
varying vec3 vCol;
varying float vA;

float ph(float u, float delay, float w){ return clamp((u - delay * (1.0 - w)) / w, 0.0, 1.0); }
float ss(float x){ return x * x * (3.0 - 2.0 * x); }
mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, s, -s, c); }

void main(){
  vec3 seed = position;
  vec3 c3 = vec3(uC, 0.0);

  // its place on the orb: a sphere that turns, the inner shells a little faster
  float az = aRnd.x * 6.2832;
  float ct = 2.0 * aRnd.y - 1.0;
  float st = sqrt(1.0 - ct * ct);
  vec3 dir = vec3(st * cos(az), ct, st * sin(az));
  dir.xz = rot((uSpin + uTime * 0.5) * (0.7 + 0.6 * aRnd.z)) * dir.xz;
  dir.xy = rot(0.35) * dir.xy;
  vec3 orb = c3 + dir * uOrbR * (0.25 + 0.75 * sqrt(aRnd.w));

  // 1. loose from slide 6, and in a spiral to the orb
  vec2 v = seed.xy - uC;
  float e1 = ss(ph(uGather, clamp(length(v) / 58.0 * 0.7 + aRnd.z * 0.3, 0.0, 1.0), 0.55));
  vec3 p = vec3(uC + rot((1.1 + 1.5 * aRnd.w) * e1) * v * (1.0 - e1), 0.0) + (orb - c3) * e1;
  float lift = uLift * (1.0 - e1);
  p.xy += (vec2(aRnd.x - 0.5, aRnd.y - 0.3) * 1.5 + 0.45 * vec2(sin(uTime * 1.3 + aRnd.z * 30.0), cos(uTime * 1.1 + aRnd.w * 30.0))) * lift;
  p.z += lift * aRnd.w * 5.0;

  // 2. out of the orb toward its letter, past it, and back onto it
  float settled = 0.0;
  if (uBurst > 0.0) {
    float e2 = ph(uBurst, aRnd.z, 0.5);
    vec2 tv = aText - uC;
    float tl = length(tv) + 0.001;
    vec2 td = tv / tl;
    vec3 far = vec3(uC + td * (tl * (1.1 + 0.55 * aRnd.w) + 2.0 + 5.0 * aRnd.x) + vec2(-td.y, td.x) * (aRnd.y - 0.5) * 9.0, (aRnd.w - 0.3) * 16.0);
    float eo = 1.0 - pow(1.0 - e2, 3.0);
    settled = ss(smoothstep(0.25, 1.0, e2));
    p = mix(mix(orb, far, eo), vec3(aText, 0.0), settled);
  }

  // the few that stay when the real headline has taken over drift up off it, and fade
  float few = step(0.93, aRnd2.x);
  float life = fract(uTime * 0.045 * (0.5 + aRnd2.y) + aRnd.z);

  // 3. off the letters into the ribbon: a band that flows to the right, swells and thins
  float e4 = ss(ph(uRibbon, aRnd.y, 0.55));
  float big = 0.0;
  float inQa = 0.0;
  if (e4 > 0.0) {
    float x = (fract(aRnd.x + uTime * 0.0055 * (0.6 + 0.8 * aRnd2.y)) - 0.5) * 134.0;
    float w = x * 0.045;
    float mid = 0.085 * x + 4.6 * sin(w * 1.25 + 0.4 + uTime * 0.05) + 1.8 * sin(w * 2.9 - uTime * 0.08) - 2.0;
    float g = aRnd.y + aRnd.z + aRnd2.x - 1.5;
    float thick = 2.6 + 2.1 * sin(w * 1.7 + 2.0 + uTime * 0.04);
    vec3 r = vec3(x, mid + g * thick, (aRnd.w - 0.5) * 14.0);
    p = mix(p, r, e4);
    p.z += sin(3.14159 * e4) * 7.0 * (aRnd.x - 0.3);
    // where the ribbon passes behind "Q&A" it lies low: the letters are read, not the points
    inQa = (1.0 - smoothstep(0.85, 1.6, length((r.xy - uQaBox.xy) / uQaBox.zw))) * uQa;
    big = step(0.972, aRnd2.y) * e4 * (1.0 - inQa);
  }
  p.xy += vec2((aRnd.w - 0.5) * 2.5 + sin(life * 6.2832 + aRnd.y * 20.0) * 0.7, life * 6.5) * uDrift * few * (1.0 - e4);

  // 4. half of them once more: into "Q&A"
  float e5 = ss(ph(uQa, aRnd.w, 0.5)) * aQa.z;
  p = mix(p, vec3(aQa.xy, 0.0), e5);

  float a = uIn;
  a *= mix(1.0, few * sin(3.14159 * life) * 0.9, uTextFade * (1.0 - smoothstep(0.0, 0.14, e4)));
  float rib = e4 * (1.0 - e5);
  a *= mix(1.0, mix(0.5, 0.2, big) * (1.0 - 0.72 * inQa), rib);
  a *= 1.0 - uQaFade * e5;
  a *= 0.78 + 0.22 * sin(uTime * (0.8 + 2.0 * aRnd2.x) + aRnd.y * 40.0);
  vA = a;
  vCol = mix(aCol, aHot, uHeat);

  float size = mix(0.215, 0.3, uHeat) * (0.65 + 0.7 * aRnd2.x);
  size *= 1.0 - 0.18 * max(settled * (1.0 - e4), e5);
  size *= 1.0 + big * 3.2;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.0, size * uPx * uCam / (-mv.z));
}`

const FRAG = /* glsl */ `
precision highp float;
uniform float uHeat;
varying vec3 vCol;
varying float vA;
void main(){
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (r > 1.0) discard;
  float disc = smoothstep(1.0, 0.72, r);
  float glow = exp(-r * r * 3.6) - 0.027;
  float a = mix(disc, max(glow, 0.0), uHeat) * vA;
  // ink is drawn OVER the page, light is ADDED to the dark: one premultiplied blend does both
  gl_FragColor = vec4(vCol * a, a * (1.0 - uHeat));
}`

const GLOW_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

const GLOW_FRAG = /* glsl */ `
precision highp float;
uniform float uGlow, uRing, uRingA, uHalo, uTime;
varying vec2 vUv;
void main(){
  float d = length(vUv - 0.5) * 2.0;
  float breath = 1.0 + 0.06 * sin(uTime * 2.1);
  float core = exp(-d * d * 150.0) * 0.9 + exp(-d * d * 26.0) * 0.42 + exp(-d * d * 5.0) * 0.12;
  vec3 col = mix(vec3(1.0, 0.56, 0.36), vec3(1.0, 0.95, 0.9), exp(-d * d * 60.0)) * core * uGlow * breath;
  float ring = exp(-pow((d - uRing) / (0.02 + 0.05 * uRing), 2.0)) * uRingA;
  col += vec3(1.0, 0.8, 0.66) * ring;
  col *= smoothstep(1.0, 0.8, d);
  // on the light page light cannot be added: the ember's warmth is drawn over it instead
  float halo = (exp(-d * d * 240.0) * 0.5 + exp(-d * d * 55.0) * 0.26) * uHalo * breath;
  gl_FragColor = vec4(col + vec3(1.0, 0.5, 0.3) * halo, halo);
}`

const blend = (m: THREE.ShaderMaterial) => {
  m.transparent = true
  m.depthTest = false
  m.depthWrite = false
  m.blending = THREE.CustomBlending
  m.blendEquation = THREE.AddEquation
  m.blendSrc = THREE.OneFactor
  m.blendDst = THREE.OneMinusSrcAlphaFactor
  m.blendSrcAlpha = THREE.OneFactor
  m.blendDstAlpha = THREE.OneMinusSrcAlphaFactor
}

export interface FieldData {
  /** on slide 6's last rest, with its colours there */
  seed: Picks
  /** on "Thank You!" */
  text: Picks
  /** on "Q&A" */
  qa: Picks
}

/**
 * @param host    the stage (the canvas goes under every scene's layer)
 * @param ghost   slide 6 is on the stage, leaving: the canvas shows from the start, behind it
 */
export function createField(ctx: SceneCtx, host: HTMLElement, data: FieldData, ghost: boolean): Field {
  const gl = createSceneCanvas(ctx, { into: host, lights: false, antialias: false })
  const rand = rng(20261119)
  const at = (u: number, v: number) => [u - 50, 28.125 - v] as const

  const pos = new Float32Array(N * 3)
  const col = new Float32Array(N * 3)
  const hot = new Float32Array(N * 3)
  const text = new Float32Array(N * 2)
  const qa = new Float32Array(N * 3)
  const rnd = new Float32Array(N * 4)
  const rnd2 = new Float32Array(N * 2)
  const HOT = [
    [1, 0.95, 0.9],
    [1, 0.56, 0.38],
    [0.56, 0.78, 1],
  ]
  for (let i = 0; i < N; i++) {
    const s = at(data.seed.at[i * 2], data.seed.at[i * 2 + 1])
    pos[i * 3] = s[0]
    pos[i * 3 + 1] = s[1]
    // slide 6's white tiles are white on white: as points they are a pale dust
    const r = data.seed.rgb[i * 3]
    const g = data.seed.rgb[i * 3 + 1]
    const b = data.seed.rgb[i * 3 + 2]
    const white = r > 0.93 && g > 0.93 && b > 0.93
    col[i * 3] = white ? 0.8 : r
    col[i * 3 + 1] = white ? 0.86 : g
    col[i * 3 + 2] = white ? 0.97 : b
    const pickHot = rand()
    const h = HOT[pickHot < 0.6 ? 0 : pickHot < 0.83 ? 1 : 2]
    hot.set(h, i * 3)
    const t = at(data.text.at[i * 2], data.text.at[i * 2 + 1])
    text[i * 2] = t[0]
    text[i * 2 + 1] = t[1]
    const toQa = i % 2 === 0
    const q = at(data.qa.at[i * 2], data.qa.at[i * 2 + 1])
    qa[i * 3] = q[0]
    qa[i * 3 + 1] = q[1]
    qa[i * 3 + 2] = toQa ? 1 : 0
    for (let k = 0; k < 4; k++) rnd[i * 4 + k] = rand()
    rnd2[i * 2] = rand()
    rnd2[i * 2 + 1] = rand()
  }
  // the box "Q&A" stands in (its middle and half its size, in world units)
  let x0 = Infinity
  let x1 = -Infinity
  let y0 = Infinity
  let y1 = -Infinity
  for (let i = 0; i < N; i++) {
    x0 = Math.min(x0, qa[i * 3])
    x1 = Math.max(x1, qa[i * 3])
    y0 = Math.min(y0, qa[i * 3 + 1])
    y1 = Math.max(y1, qa[i * 3 + 1])
  }
  const qaBox = new THREE.Vector4((x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2 + 1, (y1 - y0) / 2 + 1)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aCol', new THREE.BufferAttribute(col, 3))
  geo.setAttribute('aHot', new THREE.BufferAttribute(hot, 3))
  geo.setAttribute('aText', new THREE.BufferAttribute(text, 2))
  geo.setAttribute('aQa', new THREE.BufferAttribute(qa, 3))
  geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 4))
  geo.setAttribute('aRnd2', new THREE.BufferAttribute(rnd2, 2))

  const u = Object.fromEntries(Object.entries(U0).map(([k, value]) => [k, { value }])) as FieldU
  const c = at(ORB.u, ORB.v)
  const points = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      ...u,
      uC: { value: new THREE.Vector2(c[0], c[1]) },
      uPx: { value: gl.canvas.width / 100 },
      uCam: { value: gl.camera.position.z },
      uQaBox: { value: qaBox },
    },
  })
  blend(points)
  const cloud = new THREE.Points(geo, points)
  cloud.frustumCulled = false
  cloud.renderOrder = 2

  const glowMat = new THREE.ShaderMaterial({
    vertexShader: GLOW_VERT,
    fragmentShader: GLOW_FRAG,
    uniforms: { uGlow: u.uGlow, uRing: u.uRing, uRingA: u.uRingA, uHalo: u.uHalo, uTime: u.uTime },
  })
  blend(glowMat)
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMat)
  glow.scale.set(120, 120, 1)
  glow.position.set(c[0], c[1], 0)
  glow.frustumCulled = false
  glow.renderOrder = 1
  gl.scene.add(glow, cloud)

  // The canvas is outside this scene's layer, so it follows the layer by hand: unseen until the
  // layer has arrived (unless slide 6 is leaving above it: then it is the picture behind slide 6),
  // and from then on exactly as opaque as the layer, so it leaves with it.
  const layer = ctx.root.parentElement
  let arrived = false
  const follow = () => {
    const o = layer?.style.opacity ?? ''
    if (o !== '') arrived = true
    gl.canvas.style.opacity = arrived ? o || '0' : ghost ? '1' : '0'
  }
  follow()
  gl.onFrame((time) => {
    u.uTime.value = ctx.held ? 0 : time
    follow()
  })

  return { gl, u, dispose: gl.dispose }
}
