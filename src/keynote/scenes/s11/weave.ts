'use client'

/**
 * THE WOVEN RINGS as real objects. Each ring is two satin ribbons
 *
 *     r = R + aA·cos(n(t − phase))        ribbon A
 *     r = R − aB·cos(n(t − phase))        ribbon B (a lighter tint)
 *
 * that cross `lobes` times. At every crossing one of them really passes OVER the other: ribbon A
 * rides at z = +h·sin(n(t − phase)) and B at the opposite height, so they alternate exactly as in
 * the approved picture (exports/_rig/build_weave.py), but with depth, light and a soft shadow.
 *
 * A ribbon DRAWS ITSELF: its tube exists whole, and a number (0 … END) says how far its rounded
 * head has run round the ring; everything ahead of the head is folded onto the centre line in the
 * vertex shader. So the timeline only tweens numbers, and any frame can be held.
 *
 * The world is the stage (three/sceneCanvas.ts): one unit is one --u.
 */

import { createSceneCanvas, THREE, type SceneCanvas, type SceneCtx } from '../../kit'
import { angColour, dotRadius, FAMILIES, HOW_RING, tint, WHAT_RING, type Family, type Item, type RGB, type RingSpec } from './data'

const SEG = 960
const RAD = 18
/** The page the rings fade toward when they step back (beat 3): the backdrop's paper. */
const PAPER = new THREE.Color(0xfbf7f6)

export interface Bead {
  family: Family
  item: Item
  mesh: THREE.Mesh
  /** 0 the bead as it is … 1 faded into the page. */
  fade: { value: number }
}

export interface WovenRing {
  spec: RingSpec
  /** The timeline turns and scales THIS (the entrance). */
  pose: THREE.Group
  /** How far ribbon A / ribbon B has drawn: 0 … END. */
  a: { value: number }
  b: { value: number }
  /** A ribbon may also grow BACKWARD from its start (counter-clockwise): where that back stretch begins, BACK0 (none) … lower. */
  backA: { value: number }
  backB: { value: number }
  /** The value at which a ribbon has no back stretch. */
  BACK0: number
  /** The value at which a ribbon is whole and closed. */
  END: number
  /** 0 the ribbons as they are … 1 faded into the page. */
  fade: { value: number }
  beads: Bead[]
  /** Two bands of light on the ribbons (x: the story's lap, y: the idle one): where they are (0 … 1 round the ring) and how strong. */
  gPos: { value: THREE.Vector2 }
  gPow: { value: THREE.Vector2 }
}

export interface Weave {
  gl: SceneCanvas
  what: WovenRing
  how: WovenRing
  /** A band of light that runs a lap round a ring (beat 3). `ring` 0 WHAT, 1 HOW; `lap` 0 … 1; `power` its strength, 0 … 1. */
  glint: { lap: number; power: number; ring: number }
}

const lin = (c: RGB) => new THREE.Color().setRGB(c[0] / 255, c[1] / 255, c[2] / 255, THREE.SRGBColorSpace)

/** A standard material that can fade into the page, and (for a ribbon) fold away what is not yet drawn. */
function satin(opts: { ribbon?: { uP: { value: number }; uB: { value: number }; uLen: number; gPos: { value: THREE.Vector2 }; gPow: { value: THREE.Vector2 } }; fade: { value: number }; color?: THREE.Color; roughness?: number }) {
  const m = new THREE.MeshStandardMaterial({
    color: opts.color ?? 0xffffff,
    vertexColors: !!opts.ribbon,
    roughness: opts.roughness ?? 0.46,
    metalness: 0,
  })
  m.onBeforeCompile = (shader) => {
    shader.uniforms.uFade = opts.fade
    shader.uniforms.uPaper = { value: PAPER }
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uFade;\nuniform vec3 uPaper;')
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\n/*s11-glint*/\ngl_FragColor.rgb = mix(gl_FragColor.rgb, uPaper, uFade);')
    if (opts.ribbon) {
      // a band of light on the satin: the colour lifts toward white where it passes
      shader.uniforms.uGPos = opts.ribbon.gPos
      shader.uniforms.uGPow = opts.ribbon.gPow
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying float vU;\nuniform vec2 uGPos;\nuniform vec2 uGPow;')
        .replace(
          '/*s11-glint*/',
          [
            'vec2 gd = abs(fract(vec2(vU) - uGPos + 0.5) - 0.5);',
            'vec2 gg = exp(-gd * gd / (2.0 * 0.03 * 0.03)) * uGPow;',
            'gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), clamp(gg.x + gg.y, 0.0, 0.5));',
          ].join('\n'),
        )
      shader.uniforms.uP = opts.ribbon.uP
      shader.uniforms.uB = opts.ribbon.uB
      shader.uniforms.uLen = { value: opts.ribbon.uLen }
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aU;\nattribute vec3 aCentre;\nuniform float uP;\nuniform float uB;\nuniform float uLen;\nvarying float vU;')
        .replace(
          '#include <begin_vertex>',
          [
            'vec3 transformed = vec3(position);',
            'vU = aU;',
            // the head: a rounded tip that runs ahead; behind it the ribbon is whole
            'float kd = clamp((uP - aU) / uLen, 0.0, 1.0);',
            'float head = sqrt(1.0 - (1.0 - kd) * (1.0 - kd));',
            // the tail: rounded too, until the head comes round and the ring closes
            'float k0 = clamp(aU / uLen, 0.0, 1.0);',
            // … or until a stretch grows backward from the start (uB falls below 1): that one has a rounded tip of its own
            'float joined = max(smoothstep(1.0 - uLen, 1.0 + uLen, uP), 1.0 - smoothstep(1.0 - uLen, 1.0 + uLen, uB));',
            'float tail = mix(sqrt(1.0 - (1.0 - k0) * (1.0 - k0)), 1.0, joined);',
            'float kb = clamp((aU - uB) / uLen, 0.0, 1.0);',
            'float back = sqrt(1.0 - (1.0 - kb) * (1.0 - kb));',
            'transformed = aCentre + (transformed - aCentre) * max(head * tail, back);',
          ].join('\n'),
        )
    }
  }
  // one program for the ribbons, one for the beads
  m.customProgramCacheKey = () => (opts.ribbon ? 's11-ribbon' : 's11-bead')
  return m
}

/** One ribbon as a flattened tube round the ring, in the ring's own plane (y up), drawn clockwise from spec.start. */
function ribbonGeometry(spec: RingSpec, sign: 1 | -1, lift: number, thick: number) {
  const n = spec.lobes / 2
  const amp = sign > 0 ? spec.aA : spec.aB
  const ph = (spec.phase * Math.PI) / 180
  const count = (SEG + 1) * RAD
  const pos = new Float32Array(count * 3)
  const nor = new Float32Array(count * 3)
  const col = new Float32Array(count * 3)
  const ctr = new Float32Array(count * 3)
  const aU = new Float32Array(count)
  const K = 0.72 // the cross-section: between an ellipse (1) and a rounded strap (0.5)
  const T = new THREE.Vector3()
  const N = new THREE.Vector3()
  const B = new THREE.Vector3()
  const Z = new THREE.Vector3(0, 0, 1)
  const c = new THREE.Color()
  let length = 0
  let px = 0
  let py = 0
  for (let i = 0; i <= SEG; i++) {
    const u = i / SEG
    const th = (spec.start * Math.PI) / 180 - u * Math.PI * 2
    const wave = n * (th - ph)
    const r = spec.R + sign * amp * Math.cos(wave)
    const dr = -sign * amp * n * Math.sin(wave)
    const x = r * Math.cos(th)
    const y = r * Math.sin(th)
    const zn = sign * Math.sin(wave) // +1 on top at a crossing, −1 underneath
    const z = lift * zn
    if (i > 0) length += Math.hypot(x - px, y - py)
    px = x
    py = y
    // the tangent (clockwise: th falls as u grows)
    T.set(-(dr * Math.cos(th) - r * Math.sin(th)), -(dr * Math.sin(th) + r * Math.cos(th)), -(lift * sign * n * Math.cos(wave))).normalize()
    N.crossVectors(Z, T).normalize()
    B.crossVectors(T, N).normalize()
    // its colour by angle; ribbon B is the lighter tint; a ribbon is a little darker where it dives under the other
    const deg = (th * 180) / Math.PI
    const base = angColour(deg, spec.stops)
    const rgb = sign > 0 ? base : tint(base, 0.34)
    const under = Math.max(0, -zn)
    const shade = 1 - 0.2 * under * under * under
    c.setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, THREE.SRGBColorSpace).multiplyScalar(shade)
    for (let j = 0; j < RAD; j++) {
      const k = (i * RAD + j) * 3
      const f = (j / RAD) * Math.PI * 2
      const cf = Math.cos(f)
      const sf = Math.sin(f)
      const ex = Math.sign(cf) * Math.pow(Math.abs(cf), K)
      const ez = Math.sign(sf) * Math.pow(Math.abs(sf), K)
      const ox = (spec.w / 2) * ex
      const oz = (thick / 2) * ez
      pos[k] = x + N.x * ox + B.x * oz
      pos[k + 1] = y + N.y * ox + B.y * oz
      pos[k + 2] = z + N.z * ox + B.z * oz
      // the normal of that cross-section
      const nx = (Math.sign(cf) * Math.pow(Math.abs(cf), 2 - K)) / (spec.w / 2)
      const nz = (Math.sign(sf) * Math.pow(Math.abs(sf), 2 - K)) / (thick / 2)
      const l = Math.hypot(nx, nz) || 1
      nor[k] = (N.x * nx + B.x * nz) / l
      nor[k + 1] = (N.y * nx + B.y * nz) / l
      nor[k + 2] = (N.z * nx + B.z * nz) / l
      col[k] = c.r
      col[k + 1] = c.g
      col[k + 2] = c.b
      ctr[k] = x
      ctr[k + 1] = y
      ctr[k + 2] = z
      aU[i * RAD + j] = u
    }
  }
  const idx = new Uint32Array(SEG * RAD * 6)
  let q = 0
  for (let i = 0; i < SEG; i++) {
    for (let j = 0; j < RAD; j++) {
      const a = i * RAD + j
      const b = i * RAD + ((j + 1) % RAD)
      const d = (i + 1) * RAD + j
      const e = (i + 1) * RAD + ((j + 1) % RAD)
      // wound so that the faces look outward (N × B = T)
      idx[q++] = a
      idx[q++] = b
      idx[q++] = d
      idx[q++] = b
      idx[q++] = e
      idx[q++] = d
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  g.setAttribute('color', new THREE.BufferAttribute(col, 3))
  g.setAttribute('aCentre', new THREE.BufferAttribute(ctr, 3))
  g.setAttribute('aU', new THREE.BufferAttribute(aU, 1))
  g.setIndex(new THREE.BufferAttribute(idx, 1))
  return { geometry: g, length }
}

/** The soft shadow both ribbons throw on the page: their two paths, blurred, drawn once. */
function shadowTexture(spec: RingSpec, half: number): THREE.CanvasTexture {
  const S = 512
  const cv = document.createElement('canvas')
  cv.width = cv.height = S
  const g = cv.getContext('2d')
  if (g) {
    const k = S / (2 * half)
    const OFF = S * 3
    g.lineWidth = spec.w * k * 0.9
    g.lineJoin = 'round'
    g.strokeStyle = '#000'
    g.shadowColor = 'rgba(0, 0, 0, 0.9)'
    g.shadowBlur = S * 0.022
    g.shadowOffsetX = OFF
    for (const sign of [1, -1] as const) {
      const n = spec.lobes / 2
      const amp = sign > 0 ? spec.aA : spec.aB
      g.beginPath()
      for (let i = 0; i <= 360; i++) {
        const th = (i / 360) * Math.PI * 2
        const r = spec.R + sign * amp * Math.cos(n * (th - (spec.phase * Math.PI) / 180))
        const x = S / 2 + r * Math.cos(th) * k - OFF
        const y = S / 2 - r * Math.sin(th) * k
        if (i === 0) g.moveTo(x, y)
        else g.lineTo(x, y)
      }
      g.closePath()
      g.stroke()
    }
  }
  return new THREE.CanvasTexture(cv)
}

function makeRing(gl: SceneCanvas, spec: RingSpec): { ring: WovenRing; sway: THREE.Group; shadow: THREE.ShaderMaterial } {
  const pose = new THREE.Group()
  pose.position.copy(gl.at(spec.cx, spec.cy))
  const sway = new THREE.Group()
  pose.add(sway)
  gl.scene.add(pose)

  const thick = spec.w * 0.4
  const lift = thick * 0.5 + spec.w * 0.05
  const fade = { value: 0 }
  const a = { value: 0 }
  const b = { value: 0 }
  const backA = { value: 2 }
  const backB = { value: 2 }
  const gPos = { value: new THREE.Vector2(0, 0) }
  const gPow = { value: new THREE.Vector2(0, 0) }
  let uLen = 0.01
  for (const sign of [1, -1] as const) {
    const { geometry, length } = ribbonGeometry(spec, sign, lift, thick)
    uLen = (spec.w * 0.62) / length
    const mesh = new THREE.Mesh(geometry, satin({ ribbon: { uP: sign > 0 ? a : b, uB: sign > 0 ? backA : backB, uLen, gPos, gPow }, fade }))
    mesh.frustumCulled = false
    sway.add(mesh)
  }

  // the shadow on the page under them: it appears as the ribbons pass over it
  const half = (spec.R + Math.max(spec.aA, spec.aB) + spec.w) * 1.2
  const shadow = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uMap: { value: shadowTexture(spec, half) }, uP: { value: 0 }, uB: { value: 2 }, uStart: { value: (spec.start * Math.PI) / 180 }, uFade: fade },
    vertexShader: 'varying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}',
    fragmentShader: [
      'uniform sampler2D uMap;',
      'uniform float uP;',
      'uniform float uB;',
      'uniform float uStart;',
      'uniform float uFade;',
      'varying vec2 vUv;',
      'void main() {',
      '  vec2 p = vUv - 0.5;',
      '  float u = mod(uStart - atan(p.y, p.x), 6.2831853) / 6.2831853;',
      '  float drawn = uP >= 1.0 ? 1.0 : max(1.0 - smoothstep(uP - 0.05, uP, u), smoothstep(uB, uB + 0.05, u));',
      '  float alpha = texture2D(uMap, vUv).a * drawn * 0.2 * (1.0 - uFade);',
      '  gl_FragColor = vec4(0.05, 0.1, 0.32, alpha);',
      '}',
    ].join('\n'),
  })
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(half * 2, half * 2), shadow)
  plane.position.set(spec.w * 0.18, -spec.w * 0.42, -thick * 2.2)
  plane.renderOrder = -1
  pose.add(plane)

  // the dots, as beads in the family's colour
  const beadGeo = new THREE.SphereGeometry(1, 36, 24)
  const beads: Bead[] = []
  for (const family of FAMILIES) {
    if (family.ring !== spec.key) continue
    for (const item of family.items) {
      const f = { value: 0 }
      const mesh = new THREE.Mesh(beadGeo, satin({ fade: f, color: lin(family.colour), roughness: 0.34 }))
      const r = dotRadius(family, item)
      const t = (item.deg * Math.PI) / 180
      mesh.position.set(r * Math.cos(t), r * Math.sin(t), 0)
      mesh.scale.setScalar(0.0001)
      sway.add(mesh)
      beads.push({ family, item, mesh, fade: f })
    }
  }

  const BACK0 = 1 + 2 * uLen
  backA.value = backB.value = BACK0
  return { ring: { spec, pose, a, b, backA, backB, BACK0, END: 1 + 2 * uLen, fade, beads, gPos, gPow }, sway, shadow }
}

export function makeWeave(ctx: SceneCtx): Weave {
  const gl = createSceneCanvas(ctx, { fov: 24, lights: false })
  // light: mostly even, so the colours stay the brand's; one key from the upper left for the satin edge
  gl.scene.add(new THREE.AmbientLight(0xffffff, 2.05))
  const key = new THREE.DirectionalLight(0xfff6ee, 1.55)
  key.position.set(-26, 46, 80)
  gl.scene.add(key)
  const rim = new THREE.DirectionalLight(0xcfe0ff, 0.5)
  rim.position.set(40, -30, 40)
  gl.scene.add(rim)

  const w = makeRing(gl, WHAT_RING)
  const h = makeRing(gl, HOW_RING)
  const glint = { lap: 0, power: 0, ring: 0 }

  const still = ctx.held || ctx.reduced
  // the idle light: how strongly it shows on each ring (it comes up gently once a ring is whole)
  const idle = [0, 0]
  gl.onFrame((time, dt) => {
    const t0 = still ? 0 : time
    // the rings breathe: they tilt a few degrees, so the over-and-under of the weave catches the light
    w.sway.rotation.set(Math.sin(t0 * 0.42) * 0.085, (Math.cos(t0 * 0.33) - 1) * 0.1, 0)
    h.sway.rotation.set((Math.sin(t0 * 0.38 + 2) - Math.sin(2)) * 0.085, (Math.cos(t0 * 0.3 + 1) - Math.cos(1)) * 0.1, 0)
    ;[w, h].forEach((r, i) => {
      r.shadow.uniforms.uP.value = Math.min(r.ring.a.value, r.ring.b.value)
      r.shadow.uniforms.uB.value = Math.max(r.ring.backA.value, r.ring.backB.value)
      // the story's lap of light (beat 3), clockwise from the ring's start
      const mine = (glint.ring < 0.5 ? 0 : 1) === i
      r.ring.gPos.value.x = glint.lap
      r.ring.gPow.value.x = mine ? glint.power : 0
      // while the room waits a soft band of light travels round each whole ring, about every nine seconds
      const whole = Math.min(r.ring.a.value, r.ring.b.value) >= r.ring.END - 1e-4
      const want = still || !whole ? 0 : 0.36 * Math.max(0, 1 - r.ring.fade.value * 1.25)
      idle[i] = still ? 0 : idle[i] + (want - idle[i]) * Math.min(1, dt * 1.6)
      r.ring.gPos.value.y = (t0 / 9 + i * 0.45) % 1
      r.ring.gPow.value.y = idle[i]
    })
  })

  return { gl, what: w.ring, how: h.ring, glint }
}
