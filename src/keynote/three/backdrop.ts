'use client'

/**
 * THE BACKDROP. One WebGL canvas behind the stage for the whole deck: a calm field of light.
 *
 *   1. a wash of colour (white paper with peach and pale blue on the light pages; the deck's deep
 *      navy with an ember haze and a blue glow on the dark ones), drifting very slowly. It is
 *      drawn into a small off-screen target (384 x 216) and stretched: the wash is smooth, so
 *      this costs almost nothing however large the screen is.
 *   2. a surface of points that recedes to the horizon (strong on the dark pages, a whisper on
 *      the light ones),
 *   3. fine particles through the depth of the room, which the camera can fly through.
 *
 * Its LOOK is ten numbers (core/types.ts → Look). The director sets the base look per slide;
 * a scene adds its own `fx` on top from its timeline. Nothing here listens to the scene: the
 * numbers are read every frame.
 */

import * as THREE from 'three'
import gsap from 'gsap'
import type { Look } from '../core/types'
import type { Slide } from '../deck'

export const ZERO_LOOK: Look = { dark: 0, warm: 0, energy: 0, glow: 0, focusX: 0, focusY: 0, wave: 0, travel: 0, yaw: 0, pitch: 0 }
const KEYS = Object.keys(ZERO_LOOK) as (keyof Look)[]

const SECTION_LOOK: Record<Slide['section'], Partial<Look>> = {
  open: { warm: 0.6, focusX: -0.15, focusY: -0.2 },
  A: { warm: 0.72, focusX: -0.5, focusY: -0.3 },
  B: { warm: 0.55, focusX: 0.15, focusY: -0.3 },
  C: { warm: 0.3, focusX: 0.5, focusY: 0.25 },
  D: { warm: 0.66, focusX: -0.3, focusY: 0.3 },
  E: { warm: 0.45, focusX: 0.45, focusY: -0.3 },
  F: { warm: 0.24, focusX: -0.45, focusY: 0.3 },
  close: { warm: 0.5, focusX: 0, focusY: -0.1 },
}

/** The base look of a slide: from its theme and its section. */
export function baseLook(slide: Slide): Look {
  const dark = slide.theme === 'dark'
  return {
    ...ZERO_LOOK,
    dark: dark ? 1 : 0,
    energy: dark ? 0.85 : 0.42,
    glow: dark ? 0.45 : 0.3,
    wave: dark ? 0.8 : 0.16,
    ...SECTION_LOOK[slide.section],
  }
}

const SIMPLEX = /* glsl */ `
vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}`

const FULL_VERT = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`

const WASH_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime, uDark, uDir, uWarm, uGlow, uAspect;
uniform vec2 uFocus;
${SIMPLEX}
void main(){
  vec2 p = vUv;
  vec2 q = vec2((p.x - 0.5) * uAspect, p.y - 0.5);
  float t = uTime * 0.03;
  float n1 = snoise(q * 0.8 + vec2(t, -t * 0.6));
  float n2 = snoise(q * 1.3 + vec2(-t * 0.8, t * 0.5) + n1 * 0.4);
  vec2 w = vec2(n1, n2);
  float g = smoothstep(0.8, 0.0, length((p - uFocus) * vec2(uAspect, 1.0)) + n2 * 0.06);
  g = g * g * uGlow;

  // the light page: white paper, a peach wash from the top left, pale blue from the bottom right
  vec3 paper = vec3(1.0, 0.994, 0.99);
  vec3 peach = vec3(0.992, 0.812, 0.752);
  vec3 sky = vec3(0.682, 0.851, 1.0);
  float a = smoothstep(1.02, 0.02, length((p - vec2(0.0, 1.06) + w * 0.07) * vec2(1.0, 1.3)));
  float b = smoothstep(0.98, 0.0, length((p - vec2(1.04, -0.08) - w * 0.07) * vec2(1.0, 1.25)));
  vec3 light = paper;
  light = mix(light, peach, clamp(a * a * mix(0.5, 1.05, uWarm), 0.0, 1.0));
  light = mix(light, sky, clamp(b * b * mix(1.15, 0.55, uWarm), 0.0, 1.0));
  light = mix(light, mix(vec3(0.84, 0.92, 1.0), vec3(1.0, 0.9, 0.86), uWarm), g * 0.55);

  // the dark page: the deck's navy, an ember haze from the top right, a blue glow from below
  vec3 deep = vec3(0.012, 0.043, 0.2);
  vec3 navy = vec3(0.016, 0.07, 0.3);
  vec3 ember = vec3(0.52, 0.2, 0.2);
  vec3 royal = vec3(0.02, 0.14, 0.58);
  vec3 dk = mix(deep, navy, smoothstep(-0.7, 0.7, n1 * 0.8 + (0.5 - p.y)));
  float e = smoothstep(0.95, 0.0, length((p - vec2(1.02, 1.08) + w * 0.08) * vec2(1.0, 1.35)));
  dk = mix(dk, ember, e * e * mix(0.5, 1.0, uWarm));
  float r = smoothstep(0.95, 0.0, length((p - vec2(0.28, -0.3) - w * 0.1) * vec2(0.7, 1.15)));
  dk = mix(dk, royal, r * r * mix(1.0, 0.6, uWarm));
  dk += mix(vec3(0.05, 0.2, 0.66), vec3(0.1, 0.27, 0.74), uWarm) * g * 0.6; // the light on navy is blue: never violet

  // LIGHT AND DARK ARE NEVER BLENDED (peach into navy is a dusty mauve). The change of theme is
  // one directed move: the new theme opens from the middle of the stage, behind an edge of
  // clear blue. uDark is how far the move has come; uDir says which theme is opening.
  vec2 c = mix(vec2(0.5), uFocus, 0.45);
  float reach = length(max(c, 1.0 - c) * vec2(uAspect, 1.0));
  float dist = length((p - c) * vec2(uAspect, 1.0)) + n2 * 0.05;
  float soft = 0.42;
  float prog = uDir > 0.0 ? uDark : 1.0 - uDark;
  float k = smoothstep(0.0, soft, prog * (reach + soft) - dist);
  float m = uDir > 0.0 ? k : 1.0 - k; // 0 the light page … 1 the navy
  vec3 edge = vec3(0.16, 0.42, 0.92);
  vec3 col = mix(light, edge, smoothstep(0.0, 0.5, m) * 0.92);
  col = mix(col, dk, smoothstep(0.3, 1.0, m));
  gl_FragColor = vec4(col, 1.0);
}`

const BLIT_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main(){
  vec3 c = texture2D(uTex, vUv).rgb;
  c += (hash(gl_FragCoord.xy) - 0.5) / 160.0; // a grain finer than a colour step: no banding
  gl_FragColor = vec4(c, 1.0);
}`

const DUST_VERT = /* glsl */ `
attribute vec3 aSeed;
uniform float uTime, uTravel, uScale;
varying float vAlpha;
varying float vTint;
void main(){
  vec3 p = position;
  p.z = mod(p.z + uTravel, 150.0) - 130.0;
  p.x += sin(uTime * 0.11 * (0.5 + aSeed.x) + aSeed.x * 40.0) * 1.6;
  p.y += cos(uTime * 0.09 * (0.5 + aSeed.y) + aSeed.y * 40.0) * 1.2;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = -mv.z;
  gl_PointSize = clamp(uScale * (0.1 + aSeed.y * aSeed.y * 0.42) / d, 1.0, 90.0);
  vAlpha = smoothstep(1.0, 16.0, d) * (1.0 - smoothstep(95.0, 150.0, d)) * (0.45 + 0.55 * aSeed.x);
  vTint = aSeed.z;
}`

const DUST_FRAG = /* glsl */ `
precision highp float;
uniform float uDark, uEnergy, uWarm;
varying float vAlpha;
varying float vTint;
void main(){
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, r);
  a *= a;
  float warm = step(1.0 - mix(0.3, 0.6, uWarm), vTint);
  vec3 onLight = mix(vec3(0.26, 0.52, 0.86), vec3(0.95, 0.42, 0.28), warm);
  vec3 onDark = mix(vec3(0.55, 0.78, 1.0), vec3(1.0, 0.66, 0.52), warm);
  gl_FragColor = vec4(mix(onLight, onDark, uDark), a * vAlpha * uEnergy * mix(0.3, 0.9, uDark));
}`

const WAVE_VERT = /* glsl */ `
uniform float uTime, uTravel, uScale, uStep;
varying float vAlpha;
varying float vHeight;
void main(){
  vec3 p = position;
  p.z += mod(uTravel, uStep);
  float zw = p.z - uTravel; // the ground itself, which the camera flies over
  float h = sin(p.x * 0.07 + uTime * 0.3) * 1.7 + sin(zw * 0.11 - uTime * 0.22) * 1.5 + sin((p.x + zw) * 0.045 + uTime * 0.15) * 2.1;
  p.y += h;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = -mv.z;
  gl_PointSize = clamp(uScale * 0.2 / d, 1.0, 14.0);
  vAlpha = smoothstep(6.0, 30.0, d) * (1.0 - smoothstep(70.0, 150.0, d));
  vHeight = h / 5.3;
}`

const WAVE_FRAG = /* glsl */ `
precision highp float;
uniform float uDark, uWave, uWarm;
varying float vAlpha;
varying float vHeight;
void main(){
  float r = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.15, r);
  float crest = smoothstep(0.1, 0.9, vHeight) * mix(0.55, 1.0, uWarm);
  vec3 onLight = mix(vec3(0.42, 0.66, 0.95), vec3(0.96, 0.5, 0.36), crest);
  vec3 onDark = mix(vec3(0.3, 0.56, 1.0), vec3(1.0, 0.5, 0.34), crest);
  gl_FragColor = vec4(mix(onLight, onDark, uDark), a * vAlpha * uWave * mix(0.45, 0.85, uDark));
}`

interface Layer {
  fx: Look
  weight: number
}

/** A change of theme (light to dark, dark to light) takes this long, in seconds. */
const THEME = 0.62

export class Backdrop {
  /** Stop the backdrop's own clock (hold URLs with &still=1): two shots of one frame are identical. */
  still = false
  /** The gaps between the last animation frames, in ms (for measuring). */
  readonly frames: number[] = []

  private renderer: THREE.WebGLRenderer
  private target: THREE.WebGLRenderTarget
  private washScene = new THREE.Scene()
  private scene = new THREE.Scene()
  private flat = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.5, 400)
  private wash: THREE.ShaderMaterial
  private dust: THREE.ShaderMaterial
  private wave: THREE.ShaderMaterial
  private base: Look = { ...ZERO_LOOK }
  /** A look that waits for releaseBase(): the next slide's, while a scene of the other theme is still leaving. */
  private pending: Look | null = null
  /** The change of theme: how far it has come (0 light … 1 dark, linear in time) and which way it is going. */
  private darkNow = 0
  private darkDir = 1
  private cur: Look = { ...ZERO_LOOK }
  private out: Look = { ...ZERO_LOOK }
  private layers = new Map<string, Layer>()
  private baked = 0
  private time = 0
  private last = 0
  private raf = 0
  private running = false
  private snapNext = true
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  private reduced = false

  constructor(private canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.autoClear = false
    this.target = new THREE.WebGLRenderTarget(384, 216, { depthBuffer: false })
    this.target.texture.minFilter = THREE.LinearFilter
    this.target.texture.magFilter = THREE.LinearFilter
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const quad = new THREE.PlaneGeometry(2, 2)
    this.wash = new THREE.ShaderMaterial({
      vertexShader: FULL_VERT,
      fragmentShader: WASH_FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uDark: { value: 0 },
        uDir: { value: 1 },
        uWarm: { value: 0.5 },
        uGlow: { value: 0 },
        uAspect: { value: 16 / 9 },
        uFocus: { value: new THREE.Vector2(0.5, 0.5) },
      },
    })
    this.washScene.add(new THREE.Mesh(quad, this.wash))

    const blit = new THREE.Mesh(
      quad,
      new THREE.ShaderMaterial({
        vertexShader: FULL_VERT,
        fragmentShader: BLIT_FRAG,
        depthTest: false,
        depthWrite: false,
        uniforms: { uTex: { value: this.target.texture } },
      }),
    )
    blit.frustumCulled = false
    blit.renderOrder = 0
    this.scene.add(blit)

    // the surface of points
    const GX = 150
    const GZ = 58
    const step = 160 / GZ
    const wp = new Float32Array(GX * GZ * 3)
    let k = 0
    for (let j = 0; j < GZ; j++) {
      for (let i = 0; i < GX; i++) {
        wp[k++] = (i / (GX - 1) - 0.5) * 260 + (j % 2 ? 0.87 : 0)
        wp[k++] = -17
        wp[k++] = -150 + j * step
      }
    }
    const wg = new THREE.BufferGeometry()
    wg.setAttribute('position', new THREE.BufferAttribute(wp, 3))
    const shared = { uTime: { value: 0 }, uTravel: { value: 0 }, uScale: { value: 800 }, uDark: { value: 0 }, uWarm: { value: 0.5 } }
    this.wave = new THREE.ShaderMaterial({
      vertexShader: WAVE_VERT,
      fragmentShader: WAVE_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: { ...shared, uStep: { value: step }, uWave: { value: 0 } },
    })
    const wavePts = new THREE.Points(wg, this.wave)
    wavePts.frustumCulled = false
    wavePts.renderOrder = 1
    this.scene.add(wavePts)

    // the particles
    const N = 950
    const dp = new Float32Array(N * 3)
    const ds = new Float32Array(N * 3)
    let seed = 20261118
    const rnd = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 4294967296
    }
    for (let i = 0; i < N; i++) {
      dp[i * 3] = (rnd() - 0.5) * 190
      dp[i * 3 + 1] = (rnd() - 0.5) * 100
      dp[i * 3 + 2] = rnd() * 150
      ds[i * 3] = rnd()
      ds[i * 3 + 1] = rnd()
      ds[i * 3 + 2] = rnd()
    }
    const dg = new THREE.BufferGeometry()
    dg.setAttribute('position', new THREE.BufferAttribute(dp, 3))
    dg.setAttribute('aSeed', new THREE.BufferAttribute(ds, 3))
    this.dust = new THREE.ShaderMaterial({
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: { ...shared, uEnergy: { value: 0 } },
    })
    const dustPts = new THREE.Points(dg, this.dust)
    dustPts.frustumCulled = false
    dustPts.renderOrder = 2
    this.scene.add(dustPts)

    this.camera.position.set(0, 0, 30)
    this.resize()
    window.addEventListener('resize', this.resize)
    window.addEventListener('pointermove', this.onPointer, { passive: true })
    document.addEventListener('visibilitychange', this.onVisibility)
  }

  /**
   * The director calls this on every slide: the look glides there (or is there at once, if
   * `snap`). With `hold` the look waits until releaseBase(): between a light slide and a dark
   * one nothing changes while the old scene is still on its way out.
   */
  setBase(look: Look, snap = false, hold = false) {
    if (hold && !snap) {
      this.pending = { ...look }
      return
    }
    this.pending = null
    this.base = { ...look }
    if (snap) {
      this.snapNext = true
      this.darkNow = look.dark >= 0.5 ? 1 : 0
    }
  }

  /** The old scene has gone: the look that was waiting is taken up. */
  releaseBase() {
    if (!this.pending) return
    this.base = this.pending
    this.pending = null
  }

  /** Changes parts of the current base (a scene's ctx.backdrop.mood()). */
  nudgeBase(look: Partial<Look>) {
    Object.assign(this.pending ?? this.base, look)
  }

  /** A scene's own additive layer: plain numbers, all zero, to tween on its timeline. */
  addLayer(key: string): Look {
    const layer: Layer = { fx: { ...ZERO_LOOK }, weight: 1 }
    this.layers.set(key, layer)
    return layer.fx
  }

  /** The scene is leaving: its layer fades out over `seconds`. What the camera has travelled stays travelled. */
  releaseLayer(key: string, seconds = 0.6) {
    const layer = this.layers.get(key)
    if (!layer) return
    this.baked += layer.fx.travel
    layer.fx.travel = 0
    if (seconds <= 0) {
      this.layers.delete(key)
      return
    }
    gsap.to(layer, { weight: 0, duration: seconds, ease: 'power2.out', onComplete: () => this.layers.delete(key) })
  }

  start() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)
  }

  stop() {
    this.running = false
    cancelAnimationFrame(this.raf)
  }

  dispose() {
    this.stop()
    window.removeEventListener('resize', this.resize)
    window.removeEventListener('pointermove', this.onPointer)
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      ;(m.material as THREE.Material | undefined)?.dispose?.()
    })
    this.wash.dispose()
    this.target.dispose()
    this.renderer.dispose()
  }

  /** Draws one frame now (used when the clock is stopped, and by the first paint). */
  renderNow() {
    this.draw(0)
  }

  private resize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.wash.uniforms.uAspect.value = w / h
    const px = h * this.renderer.getPixelRatio()
    const scale = px / (2 * Math.tan((this.camera.fov * Math.PI) / 360))
    this.dust.uniforms.uScale.value = scale
    this.wave.uniforms.uScale.value = scale
    if (!this.running) this.draw(0)
  }

  private onPointer = (e: PointerEvent) => {
    this.pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    this.pointer.ty = (e.clientY / window.innerHeight) * 2 - 1
  }

  private onVisibility = () => {
    if (document.visibilityState === 'visible') {
      if (this.running) {
        this.last = performance.now()
        cancelAnimationFrame(this.raf)
        this.raf = requestAnimationFrame(this.frame)
      }
    } else {
      cancelAnimationFrame(this.raf)
    }
  }

  private frame = (now: number) => {
    if (!this.running) return
    const gap = now - this.last
    this.last = now
    this.frames.push(gap)
    if (this.frames.length > 600) this.frames.shift()
    this.draw(Math.min(gap, 100) / 1000)
    this.raf = requestAnimationFrame(this.frame)
  }

  private draw(dt: number) {
    if (!this.still) this.time += dt * (this.reduced ? 0.25 : 1)

    // the base glides; a scene's fx is taken exactly as its timeline left it
    const k = this.snapNext ? 1 : 1 - Math.exp(-dt * 3.2)
    this.snapNext = false
    for (const key of KEYS) {
      this.cur[key] += (this.base[key] - this.cur[key]) * k
      this.out[key] = this.cur[key]
    }
    // the theme does not glide: it crosses in THEME seconds, one way or the other
    const to = this.base.dark >= 0.5 ? 1 : 0
    if (this.darkNow !== to) {
      this.darkDir = to > this.darkNow ? 1 : -1
      const stepBy = dt / THEME
      this.darkNow = this.darkDir > 0 ? Math.min(1, this.darkNow + stepBy) : Math.max(0, this.darkNow - stepBy)
    }
    const dn = this.darkNow
    this.out.dark = dn * dn * (3 - 2 * dn)
    this.cur.dark = this.out.dark
    this.layers.forEach((layer) => {
      for (const key of KEYS) this.out[key] += layer.fx[key] * layer.weight
    })
    const o = this.out
    const travel = o.travel + this.baked
    const dark = Math.min(1, Math.max(0, o.dark))
    const warm = Math.min(1, Math.max(0, o.warm))

    const p = this.pointer
    p.x += (p.tx - p.x) * Math.min(1, dt * 2)
    p.y += (p.ty - p.y) * Math.min(1, dt * 2)
    const t = this.time
    this.camera.rotation.set(
      0.1 + o.pitch + Math.sin(t * 0.05) * 0.012 - p.y * 0.012,
      o.yaw + Math.sin(t * 0.07) * 0.02 - p.x * 0.02,
      0,
      'YXZ',
    )

    const wu = this.wash.uniforms
    wu.uTime.value = t
    wu.uDark.value = dark
    wu.uDir.value = this.darkDir
    wu.uWarm.value = warm
    wu.uGlow.value = Math.max(0, o.glow)
    ;(wu.uFocus.value as THREE.Vector2).set(0.5 + o.focusX * 0.5, 0.5 - o.focusY * 0.5)
    for (const m of [this.dust, this.wave]) {
      m.uniforms.uTime.value = t
      m.uniforms.uTravel.value = travel
      m.uniforms.uDark.value = dark
      m.uniforms.uWarm.value = warm
    }
    this.dust.uniforms.uEnergy.value = Math.min(1.4, Math.max(0, o.energy))
    this.wave.uniforms.uWave.value = Math.min(1.2, Math.max(0, o.wave))

    this.renderer.setRenderTarget(this.target)
    this.renderer.render(this.washScene, this.flat)
    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.camera)
  }
}
