'use client'

/**
 * Slide 07 · THE GUIDANCE, as a volume of light.
 *
 * The solid bars are what was earned. The dashed box over FY27P is what was guided: not solid
 * yet. So it holds a BODY OF LIGHT, not a bar: a column that glows strongest where it stands on
 * the H1 bar and thins to nothing at the top of the box, with slow bands of brightness rising
 * through it and a few large, soft motes drifting up in front (three.js: one shaded quad and
 * some eighty points).
 *
 * Everything is a function of two numbers only: `fill` (how far up the box the light has come,
 * on the timeline) and the canvas's own clock (the slow rise while the slide rests; 0 when the
 * frame is held). Nothing is simulated, so any frame can be reached by seeking.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'

export interface Volume {
  gl: SceneCanvas
  /** What the timeline moves: `fill` 0 … 1 up the box, `alpha` 0 … 1 the whole volume. */
  state: { fill: number; alpha: number }
}

const MOTES = 84

/* ---------------------------------------------------------------- the column */
const COL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const COL_FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform float uFill;
  uniform float uAlpha;
  uniform float uAspect;   // the box's height / width
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.1, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float up = vUv.y;
    float x = vUv.x;
    // the light has come up as far as uFill, with a long soft front
    float front = 1.0 - smoothstep(uFill - 0.3, uFill, up);
    // strongest on the bar it stands on, gone where the range begins: less and less certain
    float body = pow(1.0 - up, 1.25);
    // slow wisps rising through it (isotropic in the box: the box is uAspect times taller than wide)
    vec2 q = vec2(x, up * uAspect);
    float wisp = fbm(vec2(q.x * 2.1, q.y * 1.5 - uTime * 0.16));
    float fine = noise(vec2(q.x * 4.6 + 3.7, q.y * 3.4 - uTime * 0.27));
    // broad bands of brightness that climb, bent a little by the wisps
    float band = sin((up * 2.2 - uTime * 0.085 + wisp * 0.45) * 6.2831853) * 0.5 + 0.5;
    band = smoothstep(0.35, 1.0, band);
    // a round column: a little fuller in the middle than at its sides
    float round = 0.74 + 0.26 * sin(x * 3.14159265);
    float a = body * round * (0.3 + 0.8 * wisp + 0.12 * fine + 0.42 * band);
    // a warm foot where it leaves the bar
    float foot = 1.0 - smoothstep(0.0, 0.5, up);
    a += 0.2 * foot * foot;
    a *= front * 0.82;
    // flame, lighter (toward peach) where the bands pass and higher up; no other hue
    vec3 flame = vec3(0.945, 0.392, 0.263);
    vec3 light = vec3(0.992, 0.690, 0.565);
    vec3 col = mix(flame, light, clamp(up * 0.55 + band * 0.22 + wisp * 0.12, 0.0, 1.0));
    gl_FragColor = vec4(col, clamp(a, 0.0, 0.9) * uAlpha);
  }
`

/* ---------------------------------------------------------------- the motes */
const MOTE_VERT = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uTime;
  uniform float uFill;
  uniform float uPx;
  uniform vec4 uBox;      // left, bottom, width, height in world units
  varying float vAlpha;
  varying float vTone;
  void main() {
    // large and soft: 1.1u to 3u across (the falloff leaves about half of that seen), kept wholly inside the dashed box
    float size = mix(1.1, 3.0, aSeed.z * aSeed.z);
    float speed = 0.012 + aSeed.w * 0.022;
    float up = fract(aSeed.y + uTime * speed);
    float sway = sin(uTime * (0.22 + aSeed.z * 0.3) + aSeed.x * 6.2831853) * 0.16;
    float x = uBox.x + size * 0.5 + clamp(aSeed.x + sway * 0.12, 0.0, 1.0) * (uBox.z - size);
    float y = uBox.y + size * 0.5 + up * (uBox.w - size);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, 0.0, 1.0);
    gl_PointSize = size * uPx;
    float front = 1.0 - smoothstep(uFill - 0.2, uFill, up);
    float foot = smoothstep(0.0, 0.08, up);
    float top = 1.0 - smoothstep(0.82, 1.0, up);
    float thin = mix(1.0, 0.35, up);
    // the larger a mote, the fainter: out of focus
    vAlpha = front * foot * top * thin * mix(0.42, 0.2, aSeed.z * aSeed.z) * mix(0.5, 1.0, aSeed.w);
    vTone = fract(aSeed.x * 7.13 + aSeed.y * 3.71);
  }
`
const MOTE_FRAG = /* glsl */ `
  precision mediump float;
  uniform float uAlpha;
  varying float vAlpha;
  varying float vTone;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    // no edge at all: a soft falloff from the centre to nothing at the rim
    float disc = smoothstep(0.5, 0.0, d);
    disc *= disc;
    // warm white: glints of light in front of the column (never darker than it: dark dots read as grain)
    vec3 col = mix(vec3(1.0, 0.955, 0.92), vec3(1.0, 0.86, 0.78), vTone);
    gl_FragColor = vec4(col, disc * vAlpha * uAlpha);
  }
`

/**
 * The volume over the box whose corners on the stage are (left, top) … (left + width, top + height), in --u.
 * Throws where there is no WebGL (createSceneCanvas does): the scene then shows the box with its soft fill alone.
 */
export function makeVolume(ctx: SceneCtx, box: { left: number; top: number; width: number; height: number }): Volume {
  const gl = createSceneCanvas(ctx, { above: true, lights: false })
  const foot = gl.at(box.left, box.top + box.height)
  const mid = gl.at(box.left + box.width / 2, box.top + box.height / 2)

  // the column: one quad exactly over the box
  const colUniforms = {
    uTime: { value: 0 },
    uFill: { value: 0 },
    uAlpha: { value: 0 },
    uAspect: { value: box.height / box.width },
  }
  const column = new THREE.Mesh(
    new THREE.PlaneGeometry(box.width, box.height),
    new THREE.ShaderMaterial({ uniforms: colUniforms, vertexShader: COL_VERT, fragmentShader: COL_FRAG, transparent: true, depthTest: false, depthWrite: false }),
  )
  column.position.copy(mid)
  column.renderOrder = 1
  column.frustumCulled = false
  gl.scene.add(column)

  // the motes: a fixed sequence, so the same ones stand at the same places on every visit
  const seeds = new Float32Array(MOTES * 4)
  let s = 20260607
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
  for (let i = 0; i < seeds.length; i++) seeds[i] = rnd()
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(MOTES * 3), 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4))
  const moteUniforms = {
    uTime: { value: 0 },
    uFill: { value: 0 },
    uAlpha: { value: 0 },
    uPx: { value: ctx.U * gl.renderer.getPixelRatio() },
    uBox: { value: new THREE.Vector4(foot.x, foot.y, box.width, box.height) },
  }
  const motes = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({ uniforms: moteUniforms, vertexShader: MOTE_VERT, fragmentShader: MOTE_FRAG, transparent: true, depthTest: false, depthWrite: false }),
  )
  motes.renderOrder = 2
  motes.frustumCulled = false
  gl.scene.add(motes)

  const state = { fill: 0, alpha: 0 }
  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    const t = still ? 0 : time
    colUniforms.uTime.value = t
    moteUniforms.uTime.value = t
    // past 1 so that the soft front has left the box when the fill is complete
    colUniforms.uFill.value = state.fill * 1.3
    moteUniforms.uFill.value = state.fill * 1.2
    colUniforms.uAlpha.value = state.alpha
    moteUniforms.uAlpha.value = state.alpha
    column.visible = motes.visible = state.alpha > 0.001
  })
  return { gl, state }
}
