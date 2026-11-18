'use client'

/**
 * THE RUSH FORWARD. A tunnel of fine lights around the camera's own line of sight: while the
 * camera moves they are streaks that pour out of the vanishing point and past the room; as it
 * comes to rest they shorten into motes that keep drifting toward the room, slowly.
 *
 * One instanced mesh (one draw call), drawn under the scene's DOM, in the stage's own space
 * (three/sceneCanvas.ts): the camera looks down -z at the middle of the stage, so the tunnel's
 * vanishing point is the stage's centre, the same point the photographs of this slide come from
 * (scene.css → .s03-space has the same perspective).
 *
 * The timeline owns three plain numbers (`state`): how far the camera has flown, how long a
 * streak is (the speed, as the eye reads it) and how bright the field is. Every frame is a
 * function of those and nothing else, so any frame can be held by a URL.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'

export interface Streaks {
  gl: SceneCanvas
  /** Tween these on the timeline. */
  state: {
    /** How far the camera has flown, in --u. */
    dist: number
    /** The length of a streak, in --u: 0 is a mote at rest. */
    len: number
    /** 0 … 1: the whole field. */
    alpha: number
  }
}

const COUNT = 1300
/** The tunnel runs from FAR to FAR + DEPTH along z (the stage is z = 0, the camera z = +105). */
const FAR = -1000
const DEPTH = 1090

const VERT = /* glsl */ `
attribute vec4 aSeed;   // x, y across the tunnel; z along it; w the light's width
attribute vec3 aTone;
attribute float aGain;  // how much of the speed this one shows
uniform float uDist;
uniform float uLen;
uniform float uAlpha;
varying vec2 vUv;
varying vec3 vTone;
varying float vAlpha;
varying float vStretch;
void main() {
  float z = ${FAR.toFixed(1)} + mod(aSeed.z + uDist, ${DEPTH.toFixed(1)});
  float w = aSeed.w;
  float len = uLen * aGain;
  vec3 head = vec3(aSeed.xy, z);
  vec3 toCam = normalize(cameraPosition - head);
  vec3 side = normalize(cross(vec3(0.0, 0.0, 1.0), toCam));
  vec3 up = normalize(cross(toCam, side));
  // a small square that faces the camera (the mote), drawn out behind itself along the line of flight
  vec3 p = head + side * position.x * w + up * (0.5 - position.y) * w - vec3(0.0, 0.0, 1.0) * position.y * len;
  vUv = vec2(position.x * 2.0, position.y);
  vTone = aTone;
  vStretch = len / (len + w * 4.0);
  // out of the far haze, and gone before it reaches the lens
  float fade = smoothstep(${FAR.toFixed(1)}, ${(FAR + 420).toFixed(1)}, z) * (1.0 - smoothstep(10.0, 78.0, z));
  vAlpha = uAlpha * fade;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`

const FRAG = /* glsl */ `
precision mediump float;
uniform vec2 uRes;
varying vec2 vUv;
varying vec3 vTone;
varying float vAlpha;
varying float vStretch;
void main() {
  // at rest: a soft round mote
  float d = length(vec2(vUv.x, (vUv.y - 0.5) * 2.0));
  float mote = smoothstep(1.0, 0.0, d);
  // at speed: bright at the head, thinning to nothing along the tail
  float across = 1.0 - abs(vUv.x);
  float along = pow(1.0 - vUv.y, 1.6) * smoothstep(0.0, 0.02, vUv.y);
  float streak = across * across * along;
  float a = mix(mote * mote, streak, vStretch) * vAlpha;
  // the chrome keeps its corners: the light thins out over the section rail, the logo and Back / Next
  vec2 s = gl_FragCoord.xy / uRes;
  float top = smoothstep(0.82, 0.9, s.y) * (1.0 - smoothstep(0.36, 0.46, s.x) * (1.0 - smoothstep(0.74, 0.82, s.x)));
  float corner = smoothstep(0.74, 0.82, s.x) * (1.0 - smoothstep(0.1, 0.18, s.y));
  a *= 1.0 - 0.94 * max(top, corner);
  // premultiplied: mostly light added to what is behind it
  gl_FragColor = vec4(vTone * a, a * 0.6);
}
`

/** A small steady random source: the field is the same on every visit. */
function mulberry(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeStreaks(ctx: SceneCtx): Streaks {
  const gl = createSceneCanvas(ctx, { fov: 30, lights: false })
  const rnd = mulberry(20260303)

  const geo = new THREE.InstancedBufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-0.5, 0, 0, 0.5, 0, 0, 0.5, 1, 0, -0.5, 1, 0]), 3))
  geo.setIndex([0, 1, 2, 0, 2, 3])
  geo.instanceCount = COUNT

  const seed = new Float32Array(COUNT * 4)
  const tone = new Float32Array(COUNT * 3)
  const gain = new Float32Array(COUNT)
  // warm white, the flame, a pale blue white: never the flame and the blue on top of each other in numbers
  const TONES: [number, number, number][] = [
    [1.0, 0.84, 0.76],
    [1.0, 0.84, 0.76],
    [1.0, 0.84, 0.76],
    [0.95, 0.39, 0.26],
    [0.95, 0.39, 0.26],
    [0.78, 0.87, 1.0],
  ]
  for (let i = 0; i < COUNT; i++) {
    // across the tunnel: wider than the stage, and never down the middle of it (nothing flies through the words)
    let x = 0
    let y = 0
    do {
      x = (rnd() * 2 - 1) * 118
      y = (rnd() * 2 - 1) * 66
    } while ((x * x) / (15 * 15) + (y * y) / (9 * 9) < 1)
    seed[i * 4] = x
    seed[i * 4 + 1] = y
    seed[i * 4 + 2] = rnd() * DEPTH
    seed[i * 4 + 3] = 0.1 + rnd() * rnd() * 0.3
    const t = TONES[Math.floor(rnd() * TONES.length)]
    const k = 0.55 + rnd() * 0.45
    tone[i * 3] = t[0] * k
    tone[i * 3 + 1] = t[1] * k
    tone[i * 3 + 2] = t[2] * k
    gain[i] = 0.35 + rnd() * 0.65
  }
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 4))
  geo.setAttribute('aTone', new THREE.InstancedBufferAttribute(tone, 3))
  geo.setAttribute('aGain', new THREE.InstancedBufferAttribute(gain, 1))

  const uniforms = { uDist: { value: 0 }, uLen: { value: 0 }, uAlpha: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } }
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    // the quad is built toward the camera in the shader: its winding is not three's to judge
    side: THREE.DoubleSide,
    depthTest: false,
    depthWrite: false,
    blending: THREE.CustomBlending,
    blendEquation: THREE.AddEquation,
    // the colour is already multiplied by its alpha
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.frustumCulled = false
  gl.scene.add(mesh)

  const state = { dist: 0, len: 0, alpha: 0 }
  // While the room waits the motes keep coming, slowly. A held frame and a visitor who asked for less motion get the still field.
  const still = ctx.held || ctx.reduced
  gl.onFrame((time) => {
    uniforms.uDist.value = state.dist + (still ? 0 : time * 5)
    uniforms.uLen.value = state.len
    uniforms.uAlpha.value = state.alpha
    gl.renderer.getDrawingBufferSize(uniforms.uRes.value)
  })

  return { gl, state }
}
