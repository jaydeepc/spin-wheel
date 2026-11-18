'use client'

/**
 * THE CUSTOMER'S WORDS, as a few thousand points of light (slides 40 and 41).
 *
 * On 40 they stand in the speech bubble as a waveform (the customer is talking), then scatter
 * and are gone: the conversation is not captured. On 41 THE SAME points come back from where
 * they went and settle into the bars of the recording: Nivaaran captures it.
 *
 * Everything is a function of four numbers the timeline tweens (`state`), so every frame is
 * reachable by seeking. One Points object, one draw call.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'

export interface VoiceFx {
  /** speak: the waveform stands in the bubble · lost: it scatters · back: it returns into the bars · done: it gives way to the DOM bars */
  state: { speak: number; lost: number; back: number; done: number }
  dispose(): void
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
}

const COUNT = 3200

/** A deterministic random stream (the picture must be the same on every visit). */
const stream = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

/**
 * @param bubble where the waveform stands on 40, in stage units (u)
 * @param bars   the bars of the recording on 41, in stage units
 * @param flame  which of those bars are flame
 */
export function makeVoice(ctx: SceneCtx, bubble: Rect, bars: Rect[], flame: number[]): VoiceFx {
  const gl: SceneCanvas = createSceneCanvas(ctx, { above: true, lights: false })
  const rnd = stream(4041)

  const home = new Float32Array(COUNT * 3)
  const away = new Float32Array(COUNT * 3)
  const bar = new Float32Array(COUNT * 3)
  const seed = new Float32Array(COUNT)
  const tone = new Float32Array(COUNT)

  // the waveform in the bubble: 26 columns whose heights rise and fall like speech
  const COLS = 24
  const colH = Array.from({ length: COLS }, (_, i) => {
    const t = i / (COLS - 1)
    const env = Math.sin(Math.PI * t) ** 0.6
    return (0.16 + 0.84 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.61 + 0.4))) * env
  })
  const totalBar = bars.reduce((s, b) => s + b.h, 0)

  for (let i = 0; i < COUNT; i++) {
    const s = rnd()
    seed[i] = s
    // home
    const c = Math.floor(rnd() * COLS)
    const cw = bubble.w / COLS
    const hx = bubble.x + (c + 0.33 + rnd() * 0.34) * cw
    const hh = Math.max(0.06, colH[c]) * bubble.h
    const hy = bubble.y + bubble.h / 2 + (rnd() - 0.5) * hh
    const h = gl.at(hx, hy)
    home.set([h.x, h.y, 0], i * 3)
    // away: up and off to the right, spreading, a little toward the camera
    const ang = -0.25 + rnd() * 1.5 // radians above the horizontal, mostly up and right
    const far = 9 + rnd() * 22
    away.set([h.x + Math.cos(ang) * far * (rnd() < 0.3 ? -0.6 : 1), h.y + Math.sin(ang) * far * 0.75 + 2, (rnd() - 0.3) * 30], i * 3)
    // its bar on 41 (taller bars take more points)
    let pick = rnd() * totalBar
    let b = 0
    while (b < bars.length - 1 && pick > bars[b].h) pick -= bars[b++].h
    const r = bars[b]
    const p = gl.at(r.x + rnd() * r.w, r.y + rnd() * r.h)
    bar.set([p.x, p.y, 0], i * 3)
// a point has the colour of the bar it will end in: navy, with the flame ones scattered through the bubble
    tone[i] = flame.includes(b) ? 1 : 0
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(home, 3))
  geo.setAttribute('aAway', new THREE.BufferAttribute(away, 3))
  geo.setAttribute('aBar', new THREE.BufferAttribute(bar, 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
  geo.setAttribute('aTone', new THREE.BufferAttribute(tone, 1))

  const state = { speak: 0, lost: 0, back: 0, done: 0 }
  const uniforms = {
    uSpeak: { value: 0 },
    uLost: { value: 0 },
    uBack: { value: 0 },
    uDone: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: ctx.U * 0.16 * gl.renderer.getPixelRatio() },
  }
  const mat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    vertexShader: /* glsl */ `
      attribute vec3 aAway;
      attribute vec3 aBar;
      attribute float aSeed;
      attribute float aTone;
      uniform float uSpeak, uLost, uBack, uDone, uTime, uSize;
      varying float vA;
      varying float vTone;
      float outCubic(float t) { float u = 1.0 - t; return 1.0 - u * u * u; }
      void main() {
        float d = aSeed * 0.5;
        vec3 p;
        float a;
        float z = fract(aSeed * 91.7);
        if (uBack > 0.0) {
          // they come back: late ones first out are first home
          float t = clamp(uBack * 1.5 - d, 0.0, 1.0);
          float e = outCubic(t);
          p = mix(aAway, aBar, e);
          // a slow curl on the way in
          p.x += sin(t * 3.1416) * (z - 0.5) * 5.0;
          p.y += sin(t * 3.1416) * 2.0 * (fract(aSeed * 37.1) - 0.3);
          a = smoothstep(0.0, 0.3, t) * (1.0 - uDone);
        } else {
          float born = clamp(uSpeak * 1.5 - d, 0.0, 1.0);
          float t = clamp(uLost * 1.5 - d, 0.0, 1.0);
          float e = t * t * (3.0 - 2.0 * t);
          p = mix(position, aAway, e);
          p.y += (1.0 - born) * -1.2;
          // while it speaks, the waveform breathes
          float live = (1.0 - e) * born;
          p.y += sin(uTime * 2.6 + position.x * 1.3 + aSeed * 6.0) * 0.13 * live;
          a = born * (1.0 - smoothstep(0.25, 1.0, t));
        }
        vA = a * (0.55 + 0.45 * z);
        vTone = aTone;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * (0.55 + 0.9 * fract(aSeed * 7.31));
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vA;
      varying float vTone;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float r = length(c);
        float m = smoothstep(0.5, 0.28, r);
        if (m * vA < 0.01) discard;
        vec3 navy = vec3(0.027, 0.102, 0.314);
        vec3 flame = vec3(0.945, 0.392, 0.263);
        gl_FragColor = vec4(mix(navy, flame, vTone), m * vA);
      }
    `,
  })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  gl.scene.add(points)

  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    uniforms.uSpeak.value = state.speak
    uniforms.uLost.value = state.lost
    uniforms.uBack.value = state.back
    uniforms.uDone.value = state.done
    uniforms.uTime.value = still ? 0 : time
  })

  return { state, dispose: gl.dispose }
}
