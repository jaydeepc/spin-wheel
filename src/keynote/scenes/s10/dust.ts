'use client'

/**
 * THE POINTS of slide 10. The room behind every slide is full of fine points; here they do the
 * telling:
 *
 *   form   THE CURTAIN: a sheet of them rises from the stage floor along its whole width, as one
 *          front (uRise), and out of that sheet the points gather into the words "Building AI for
 *          Bharat", each word in its own colour, exactly where the page sets it (the words are
 *          drawn once to a canvas in the page's own font, and every point is given a place inside
 *          a letter). The solid words then take over.
 *   motes  a few hundred points of the sheet never land: they stay around their word and drift
 *          very slowly for as long as the presenter talks (uTime; frozen on a held frame).
 *   pour   when a word is explained it lets a stream of its points go: they fall, narrow to a
 *          neck, and run out along the line that heads its column. The word pours its column.
 *
 * Every point's whole journey is computed in the vertex shader from ONE number per cloud (uP),
 * so the timeline only tweens numbers and any frame can be held.
 *
 * The world is the stage (three/sceneCanvas.ts): one unit is one --u.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { COLUMNS, HERO, WORDS, type Column, type WordKey } from './data'

export interface Cloud {
  /** 0 … 1: the cloud's journey. */
  p: { value: number }
  /** 0 … 1: the points let go and fade (the solid thing has taken over). */
  out: { value: number }
}

export interface Dust {
  gl: SceneCanvas
  form: Record<WordKey, Cloud>
  /** `land`: where the stream meets the column's rule, 0 (its left end) … 1 (its right end). */
  pour: Record<Column['key'], Cloud & { land: number }>
  /** 0 … 1: the curtain. The whole sheet of points rises from the floor, a touch earlier on the left. */
  rise: { value: number }
  /** 0 the phrase stands large in the middle (the first rest) … 1 it has risen to its place: the motes go with it. */
  shift: { value: number }
  /** The motes that stay around each word: `a` is their strength (1 lit … 0.25 stepped back). */
  motes: Record<Column['key'], { a: { value: number } }>
}

const VERT = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aAlt;   // form: its place in the rising sheet; motes: its home while the phrase stands large
attribute vec3 aRnd;   // x: when it leaves (0 first … 1 last), y: its size, z: a random phase
uniform float uP;
uniform float uOut;
uniform float uPx;     // one --u in device pixels
uniform float uCam;
uniform float uMode;   // 0 form, 1 pour, 2 motes
uniform float uRise;   // the curtain: 0 under the floor … 1 risen
uniform float uShift;
uniform float uTime;
uniform float uA;
uniform float uLand;   // pour: the x where the stream meets the rule
uniform float uSize;
varying float vA;

// the sheet rises as one front, the left a touch ahead of the right
float riseOf(float x) {
  float r = clamp(uRise * 1.15 - (x + 50.0) / 100.0 * 0.15, 0.0, 1.0);
  return 1.0 - pow(1.0 - r, 3.0);
}

void main() {
  float spread = 1.0;
  float t = clamp(uP * (1.0 + spread) - aRnd.x * spread, 0.0, 1.0);
  vec3 p;
  float size = uSize * aRnd.y;
  if (uMode < 0.5) {
    // FORM: up with the sheet, then out of it: a turn on the way, a long soft landing inside the letter
    float r = riseOf(aFrom.x);
    float e = 1.0 - pow(1.0 - t, 3.0);
    p = mix(mix(aFrom, aAlt, r), position, e);
    float sw = sin(t * 3.14159) * (1.0 - t);
    float a = aRnd.z * 6.2832 + t * 5.0;
    p.xy += vec2(cos(a), sin(a)) * sw * 2.6;
    // … and when the solid word takes over, the dust lifts off it
    p.y += uOut * (0.4 + aRnd.z) * 1.1;
    p.x += uOut * (aRnd.y - 1.0) * 1.6;
    size *= mix(1.45, 1.0, e);
    vA = smoothstep(0.0, 0.07, r) * mix(0.8, 1.0, e) * (1.0 - uOut);
  } else if (uMode > 1.5) {
    // MOTES: up with the sheet to a place near their word, and there they drift
    float r = riseOf(aFrom.x);
    p = mix(aFrom, mix(aAlt, position, uShift), r);
    float ph = aRnd.z * 6.2832;
    p.x += sin(uTime * (0.16 + aRnd.x * 0.12) + ph) * 0.9;
    p.y += cos(uTime * (0.13 + aRnd.x * 0.09) + ph * 1.7) * 0.6;
    float tw = 0.66 + 0.34 * sin(uTime * (0.45 + aRnd.x * 0.8) + ph * 3.0);
    vA = smoothstep(0.0, 0.1, r) * mix(1.0, 0.62, r) * tw * uA;
  } else {
    // POUR: fall and narrow to a neck on the rule, then run out along it
    float fall = 1.0 - pow(1.0 - clamp(t / 0.62, 0.0, 1.0), 2.2);
    float neck = mix(uLand, aFrom.x, 0.1);
    float x = mix(aFrom.x, neck, smoothstep(0.0, 0.62, t));
    x = mix(x, position.x, smoothstep(0.46, 1.0, t));
    float y = mix(aFrom.y, position.y, fall);
    float a = aRnd.z * 6.2832 + t * 7.0;
    x += cos(a) * 0.22 * sin(t * 3.14159);
    p = vec3(x, y, position.z);
    size *= mix(1.25, 0.95, t);
    vA = smoothstep(0.0, 0.07, t) * (1.0 - uOut);
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.0, uPx * size * (uCam / -mv.z));
}
`

const FRAG = /* glsl */ `
uniform vec3 uColour;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.34, 0.5, d)) * vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(uColour, a);
}
`

interface Sampled {
  key: WordKey
  /** Points inside the word's letters, in --u on the stage, as the page lays the word out (the final pose). */
  pts: Float32Array
  x0: number
  w: number
}

/** A word drawn once in the page's own font: the places inside its letters, on a jittered grid. */
function sample(ctx: SceneCtx, key: WordKey, family: string, baseline: number, step: number): Sampled {
  const el = ctx.$(`.s10-word--${key}`)
  const box = ctx.loc(el)
  const cs = getComputedStyle(el)
  const fontU = parseFloat(cs.fontSize) / ctx.U
  const Q = 30 // canvas pixels per --u
  const pad = 8
  const W = Math.ceil((box.w / ctx.U) * Q) + pad * 2
  const H = Math.ceil(fontU * Q * 1.5)
  const y0 = Math.round(fontU * Q * 1.05)
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const g = cv.getContext('2d', { willReadFrequently: true })
  const out: number[] = []
  if (g) {
    g.font = `${cs.fontStyle} ${cs.fontWeight} ${fontU * Q}px ${family}`
    g.textBaseline = 'alphabetic'
    g.fillStyle = '#000'
    g.fillText(el.textContent ?? '', pad, y0)
    const data = g.getImageData(0, 0, W, H).data
    const s = step * Q
    // a seeded jitter, so that two builds of the scene give the same cloud
    let seed = 1234567 + key.length * 7919
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)
    for (let y = s / 2; y < H; y += s) {
      for (let x = s / 2; x < W; x += s) {
        const px = Math.min(W - 1, Math.max(0, Math.round(x + (rnd() - 0.5) * s * 0.7)))
        const py = Math.min(H - 1, Math.max(0, Math.round(y + (rnd() - 0.5) * s * 0.7)))
        if (data[(py * W + px) * 4 + 3] > 140) out.push(box.x / ctx.U + (px - pad) / Q, baseline + (py - y0) / Q)
      }
    }
  }
  return { key, pts: new Float32Array(out), x0: box.x / ctx.U, w: box.w / ctx.U }
}

export function makeDust(ctx: SceneCtx): Dust {
  // measure FIRST: the page as it is laid out (nothing is hidden or moved yet)
  const family = getComputedStyle(ctx.root).fontFamily
  const base = ctx.loc(ctx.$('.s10-base'))
  const baseline = (base.y + base.h) / ctx.U
  const hero = ctx.loc(ctx.$('.s10-hero'))
  const hx = hero.cx / ctx.U
  const hy = hero.cy / ctx.U
  const words = WORDS.map((w) => sample(ctx, w.key, family, baseline, 0.1))
  const sub = ctx.loc(ctx.$('.s10-sub'))
  const boxes = WORDS.map((w) => ({ key: w.key, box: ctx.loc(ctx.$(`.s10-word--${w.key}`)) }))
  const rules = COLUMNS.map((c) => ({ c, box: ctx.loc(ctx.$(`.s10-col--${c.key} .s10-col-rule`)) }))

  const gl = createSceneCanvas(ctx, { lights: false })
  const uPx = { value: ctx.U * gl.renderer.getPixelRatio() }
  const uCam = { value: gl.camera.position.z }
  const rise = { value: 0 }
  const shift = { value: 0 }
  const uTime = { value: 0 }
  let seed = 987654321
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)

  const cloud = (colour: string, mode: 0 | 1 | 2, land: number, size: number, position: Float32Array, from: Float32Array, rndAttr: Float32Array, alt?: Float32Array): Cloud & { a: { value: number } } => {
    const p = { value: 0 }
    const out = { value: 0 }
    const a = { value: 1 }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(position, 3))
    geo.setAttribute('aFrom', new THREE.BufferAttribute(from, 3))
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rndAttr, 3))
    geo.setAttribute('aAlt', new THREE.BufferAttribute(alt ?? from, 3))
    const c = new THREE.Color(colour)
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uP: p,
        uOut: out,
        uPx,
        uCam,
        uMode: { value: mode },
        uLand: { value: land },
        uSize: { value: size },
        uRise: rise,
        uShift: shift,
        uTime,
        uA: a,
        // the colour as the page writes it (sRGB), straight to the screen
        uColour: { value: new THREE.Vector3().fromArray(c.convertLinearToSRGB().toArray()) },
      },
    })
    const points = new THREE.Points(geo, mat)
    points.frustumCulled = false
    gl.scene.add(points)
    return { p, out, a }
  }
  /** A point of the page's final layout as it stands on the first rest (the phrase larger and lower). */
  const heroAt = (xu: number, yu: number) => gl.at(hx + (xu - hx) * HERO.scale, hy + (yu - hy) * HERO.scale + HERO.dy)

  /* FORM: every place inside a letter gets a point that starts under the stage floor, somewhere along its whole width */
  const form = {} as Dust['form']
  for (const w of words) {
    const n = w.pts.length / 2
    const position = new Float32Array(n * 3)
    const from = new Float32Array(n * 3)
    const r = new Float32Array(n * 3)
    const alt = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const xu = w.pts[i * 2]
      const yu = w.pts[i * 2 + 1]
      // the first rest shows the phrase larger and lower (data.ts → HERO): the same transform the page applies
      const to = heroAt(xu, yu)
      position.set([to.x, to.y, 0], i * 3)
      // under the floor, spread so that the four words together cover the stage from edge to edge
      const fx = to.x * 1.24 + (rnd() - 0.5) * 12
      const fz = (rnd() - 0.5) * 16
      from.set([fx, -29.4 - rnd() * 2.4, fz], i * 3)
      // its place in the risen sheet: anywhere between the floor and the line the phrase stands on
      alt.set([fx + (to.x - fx) * 0.45 + (rnd() - 0.5) * 5, -27 + (to.y + 26) * Math.pow(rnd(), 0.75), fz * 0.5], i * 3)
      // left to right through the word, a little shuffled
      r.set([Math.min(1, Math.max(0, ((xu - w.x0) / w.w) * 0.72 + rnd() * 0.28)), 0.82 + rnd() * 0.36, rnd()], i * 3)
    }
    form[w.key] = cloud(WORDS.find((x) => x.key === w.key)?.colour ?? '#071a50', 0, 0, 0.155, position, from, r, alt)
  }

  /* POUR: a stream from each of the three words to the rule of its column */
  const pour = {} as Dust['pour']
  for (const { c, box } of rules) {
    const w = words.find((x) => x.key === c.key)
    if (!w || !w.pts.length) continue
    const total = w.pts.length / 2
    const n = 3000
    const rx0 = box.x / ctx.U
    const rw = box.w / ctx.U
    const ry = box.cy / ctx.U
    const land = Math.min(0.94, Math.max(0.06, (w.x0 + w.w / 2 - rx0) / rw))
    const landX = rx0 + land * rw
    const far = Math.max(land, 1 - land) * rw
    const position = new Float32Array(n * 3)
    const from = new Float32Array(n * 3)
    const r = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const k = Math.floor(rnd() * total)
      const a = gl.at(w.pts[k * 2], w.pts[k * 2 + 1])
      const tx = rx0 + rnd() * rw
      const b = gl.at(tx, ry + (rnd() - 0.5) * 0.16)
      from.set([a.x, a.y, 0], i * 3)
      position.set([b.x, b.y, 0], i * 3)
      // the places nearest the neck are reached first: the line runs out from where the stream lands
      r.set([Math.min(1, (Math.abs(tx - landX) / far) * 0.86 + rnd() * 0.14), 0.8 + rnd() * 0.4, rnd()], i * 3)
    }
    pour[c.key] = { ...cloud(c.colour, 1, gl.at(landX, 0).x, 0.185, position, from, r), land }
  }

  /* MOTES: a few hundred points of the sheet that never land. They stay near their word and drift. */
  const motes = {} as Dust['motes']
  const sx0 = sub.x / ctx.U - 0.8
  const sx1 = (sub.x + sub.w) / ctx.U + 0.8
  const sy0 = sub.y / ctx.U - 0.5
  const sy1 = (sub.y + sub.h) / ctx.U + 0.5
  for (const c of COLUMNS) {
    const b = boxes.find((x) => x.key === c.key)?.box
    if (!b) continue
    const n = 230
    const position = new Float32Array(n * 3)
    const from = new Float32Array(n * 3)
    const alt = new Float32Array(n * 3)
    const r = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      let xu = 0
      let yu = 0
      for (let tries = 0; tries < 12; tries++) {
        xu = b.x / ctx.U - 5 + rnd() * (b.w / ctx.U + 10)
        // most of them close above and below the word, a few further out
        const g = (rnd() + rnd() + rnd()) / 3 - 0.5
        yu = b.cy / ctx.U + g * 15
        const inSub = xu > sx0 && xu < sx1 && yu > sy0 && yu < sy1
        if (!inSub && yu > 7.2 && xu > 3 && xu < 97) break
      }
      const home = gl.at(xu, yu)
      const big = heroAt(xu, yu)
      position.set([home.x, home.y, 0], i * 3)
      alt.set([big.x, big.y, 0], i * 3)
      from.set([big.x * 1.2 + (rnd() - 0.5) * 14, -29.4 - rnd() * 2.4, 0], i * 3)
      r.set([rnd(), 0.5 + Math.pow(rnd(), 1.6) * 1.3, rnd()], i * 3)
    }
    motes[c.key] = { a: cloud(c.key === 'ai' ? '#3b4f8f' : c.colour, 2, 0, 0.17, position, from, r, alt).a }
  }

  // the motes drift while the room waits; a held frame (and less motion) keeps them where they are
  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    uTime.value = still ? 0 : time
  })

  return { gl, form, pour, rise, shift, motes }
}
