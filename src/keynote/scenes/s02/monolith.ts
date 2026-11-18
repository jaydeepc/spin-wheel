'use client'

/**
 * THE AGENDA'S OBJECT: a block of clear glass with a navy plate cast inside it.
 *
 * A chapter of the keynote is one of these. On the agenda (slide 02) six of them stand on a
 * floor, each a letter block on a name block; on Next the name block folds away behind and the
 * letter block flies to its row. At every section divider (9, 15, 26, 31, 55) the same letter
 * block comes back, carrying the section that begins. One object, one material, one light.
 *
 * What it is made of:
 *   the glass   real transmission (MeshPhysicalMaterial): it refracts what stands behind it, its
 *               bevels catch the studio (makeStudio: a procedural environment of soft boxes, a
 *               flame strip and a clear-blue strip) and it is tinted a little where it is thick.
 *   the plate   an opaque sheet in the middle of the block: deep navy, a hairline of flame, the
 *               letter in white (the name on the lower block). It is OPAQUE on purpose: only
 *               opaque things are seen through transmission.
 *   the ink     `fill` 0 … 1: the plate starts as pale frosted glass and the navy rises through
 *               it from the floor behind a line of flame. That is how a chapter lights.
 *
 * Its own units: the letter block is MW x MW, the name block MW x ML, both MD deep. The group's
 * origin is the CENTRE OF THE LETTER BLOCK, so `group.position` lands the block on a DOM slot
 * and `group.scale = slot / MW` sizes it.
 */

import { THREE, type SceneCanvas } from '../../kit'

/** The letter block's side. */
export const MW = 10
/** The name block's height. */
export const ML = 6.4
/** The depth of both. */
export const MD = 2.3
/** The size of the name on the lower block, in the monolith's own units. */
const NAME = 1.06
/** The clear glass around the plate. */
const RIM = 0.6
/** The block's corner. */
const CORNER = 0.85
const BEVEL = 0.26
/** From the letter block's centre down to the floor the monolith stands on. */
export const FOOT = MW / 2 + ML

export type MonoTheme = 'light' | 'dark'

export interface Mono {
  /** Move, turn and scale THIS from the timeline. Its origin is the centre of the letter block. */
  group: THREE.Group
  /** Everything, inside the group: an idle float goes here, so it never fights the timeline. */
  body: THREE.Group
  /** 0 pale frosted glass … 1 the navy has risen through the whole monolith. */
  fill: number
  /** 0 … 1: the plate glows (the travelling light passes; "we start here"). */
  lit: number
  /** 0 standing … 1 the name block has swung up behind the letter block (and is put away). */
  fold: number
}

function roundedRect(w: number, h: number, r: number): THREE.Shape {
  const x = w / 2
  const y = h / 2
  const s = new THREE.Shape()
  s.moveTo(-x + r, -y)
  s.lineTo(x - r, -y)
  s.absarc(x - r, -y + r, r, -Math.PI / 2, 0, false)
  s.lineTo(x, y - r)
  s.absarc(x - r, y - r, r, 0, Math.PI / 2, false)
  s.lineTo(-x + r, y)
  s.absarc(-x + r, y - r, r, Math.PI / 2, Math.PI, false)
  s.lineTo(-x, -y + r)
  s.absarc(-x + r, -y + r, r, Math.PI, Math.PI * 1.5, false)
  return s
}

/** A block of glass w x h x MD, centred, with a fine bevel all round that catches the light. */
function blockGeo(w: number, h: number): THREE.ExtrudeGeometry {
  const g = new THREE.ExtrudeGeometry(roundedRect(w - BEVEL * 2, h - BEVEL * 2, CORNER - BEVEL), {
    depth: MD - BEVEL * 2,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL,
    bevelSegments: 6,
    curveSegments: 20,
  })
  g.translate(0, 0, -(MD - BEVEL * 2) / 2)
  return g
}

/** The plate: a flat sheet w x h whose texture covers it exactly. */
function sheetGeo(w: number, h: number): THREE.ShapeGeometry {
  const g = new THREE.ShapeGeometry(roundedRect(w, h, CORNER - RIM * 0.72), 20)
  const pos = g.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5
  }
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return g
}

/** Calibri joins "ti", "ft" and so on in a canvas too; the keynote sets them apart, as PowerPoint does. */
const unjoin = (t: string) => t.replace(/([ft])(?=[fijlt])/g, '$1‌')

const INK = {
  light: { a: '#12349c', b: '#06164c', glow: 'rgba(70, 120, 255, 0.24)', ghost: '#afcdfa', lit: '#2d6ad1' },
  // on the deck's navy the plate is a lit royal blue: it has to stand off the dark
  dark: { a: '#2a5bdc', b: '#0f2f9c', glow: 'rgba(140, 180, 255, 0.4)', ghost: '#13245f', lit: '#4384d4' },
}
const FLAME = '#f16443'
/** The glass's own colour laid over the page: `k` how dense. */
const VEIL = {
  light: { tint: '#1e74ff', k: 0.85 },
  dark: { tint: '#5d95ff', k: 0.16 },
}

function texture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Paints now, and again when the brand font has arrived. */
function paintWithFont(tex: THREE.CanvasTexture[], font: string, sample: string, paint: () => void) {
  paint()
  document.fonts?.load(font, sample).then(
    () => {
      paint()
      for (const t of tex) t.needsUpdate = true
    },
    () => {},
  )
}

/** The plate's picture: the navy, the hairline of flame, and what `draw` adds (the letter, the name). */
function plateArt(w: number, h: number, theme: MonoTheme, family: string, draw: (g: CanvasRenderingContext2D, W: number, H: number) => void, sample: string): THREE.CanvasTexture {
  const W = 1024
  const H = Math.round((W * h) / w)
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const tex = texture(c)
  const ink = INK[theme]
  const paint = () => {
    const g = c.getContext('2d')
    if (!g) return
    // the navy: a slow fall of light from the top left corner
    const grad = g.createLinearGradient(0, 0, W * 0.8, H)
    grad.addColorStop(0, ink.a)
    grad.addColorStop(1, ink.b)
    g.fillStyle = grad
    g.fillRect(0, 0, W, H)
    const halo = g.createRadialGradient(W * 0.2, 0, 0, W * 0.2, 0, W * 0.9)
    halo.addColorStop(0, ink.glow)
    halo.addColorStop(1, 'rgba(0, 0, 0, 0)')
    g.fillStyle = halo
    g.fillRect(0, 0, W, H)
    // the hairline of flame, just inside the plate's edge
    const inset = W * 0.034
    g.strokeStyle = FLAME
    g.lineWidth = W * 0.02
    g.beginPath()
    g.roundRect(inset, inset, W - inset * 2, H - inset * 2, W * 0.045)
    g.stroke()
    draw(g, W, H)
    tex.needsUpdate = true
  }
  paintWithFont([tex], `700 100px ${family}`, sample, paint)
  return tex
}

function letterArt(letter: string, theme: MonoTheme, family: string): THREE.CanvasTexture {
  const side = MW - RIM * 2
  return plateArt(
    side,
    side,
    theme,
    family,
    (g, W, H) => {
      g.font = `700 ${W * 0.6}px ${family}`
      g.textAlign = 'center'
      g.textBaseline = 'alphabetic'
      const m = g.measureText(letter)
      g.fillStyle = '#ffffff'
      g.fillText(letter, W / 2, H / 2 + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2)
    },
    letter,
  )
}

/** The section's name on the lower block: the brand font, white, centred, on as few even lines as fit. */
function nameArt(name: string, theme: MonoTheme, family: string): THREE.CanvasTexture {
  const w = MW - RIM * 2
  const h = ML - RIM * 2
  return plateArt(
    w,
    h,
    theme,
    family,
    (g, W, H) => {
      const size = (W * NAME) / w
      g.font = `400 ${size}px ${family}`
      g.textAlign = 'center'
      g.textBaseline = 'alphabetic'
      g.fillStyle = '#ffffff'
      const wrap = (max: number) => {
        const out: string[] = []
        let line = ''
        for (const word of unjoin(name).split(' ')) {
          const next = line ? `${line} ${word}` : word
          if (line && g.measureText(next).width > max) {
            out.push(line)
            line = word
          } else line = next
        }
        if (line) out.push(line)
        return out
      }
      const room = W * 0.86
      let lines = wrap(room)
      for (let max = room - 30; max > 300; max -= 30) {
        const tighter = wrap(max)
        if (tighter.length > lines.length) break
        lines = tighter
      }
      const lh = size * 1.14
      const top = H / 2 - (lines.length * lh) / 2 + size * 0.86
      lines.forEach((l, i) => g.fillText(l, W / 2, top + i * lh))
    },
    name,
  )
}

interface PlateUniforms {
  uFill: { value: number }
  uSpan: { value: THREE.Vector2 }
  uGhost: { value: THREE.Color }
  uFront: { value: THREE.Color }
  uLit: { value: number }
  uLitCol: { value: THREE.Color }
  uFade: { value: number }
}

const PARS = /* glsl */ `
uniform float uFill;
uniform vec2 uSpan;
uniform vec3 uGhost;
uniform vec3 uFront;
uniform float uLit;
uniform vec3 uLitCol;
uniform float uFade;
`
/** After the map: where the ink has not yet risen the plate is pale frosted glass. */
const INKED = /* glsl */ `
float s02y = mix(uSpan.x, uSpan.y, S02UV.y);
float s02edge = uFill * 1.14 - 0.07;
float s02in = 1.0 - smoothstep(s02edge - 0.01, s02edge + 0.01, s02y);
float s02band = exp(-pow((s02y - s02edge) / 0.022, 2.0)) * smoothstep(0.0, 0.04, uFill) * (1.0 - smoothstep(0.96, 1.0, uFill));
`

/**
 * The plate's material. Its picture is its own light (emissive): the navy is exactly the navy
 * that was painted, whatever the studio does; over it lies a clear coat that takes the studio's
 * soft boxes as a sheen. `mirror` gives the cheap version used for the reflection in the floor.
 */
function plateMaterial(art: THREE.CanvasTexture, theme: MonoTheme, span: [number, number], mirror: boolean, env: THREE.Texture | null = null): { mat: THREE.Material; u: PlateUniforms } {
  const ink = INK[theme]
  const u: PlateUniforms = {
    uFill: { value: 1 },
    uSpan: { value: new THREE.Vector2(span[0], span[1]) },
    uGhost: { value: new THREE.Color(ink.ghost) },
    uFront: { value: new THREE.Color(FLAME) },
    uLit: { value: 0 },
    uLitCol: { value: new THREE.Color(ink.lit) },
    uFade: { value: 1 },
  }
  if (mirror) {
    const mat = new THREE.MeshBasicMaterial({ map: art, transparent: true, depthWrite: false, side: THREE.DoubleSide })
    mat.onBeforeCompile = (sh) => {
      Object.assign(sh.uniforms, u)
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>\n#define S02UV vMapUv\n${PARS}`)
        .replace(
          '#include <map_fragment>',
          // a floor does not reflect like a mirror: the picture is taken soft (a mip level or two down) and it dies away with height
          `diffuseColor *= texture2D( map, vMapUv, 4.0 );\n${INKED}
diffuseColor.rgb = mix(uGhost, mix(diffuseColor.rgb, uLitCol, 0.4), s02in);
diffuseColor.rgb = mix(diffuseColor.rgb, uFront, s02band * 0.8);
diffuseColor.a *= uFade * mix(0.3, 0.6, s02in) * pow(clamp(1.0 - s02y * 1.3, 0.0, 1.0), 2.2);`,
        )
    }
    mat.customProgramCacheKey = () => 's02-plate-mirror'
    return { mat, u }
  }
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    emissive: 0xffffff,
    emissiveMap: art,
    emissiveIntensity: 1,
    roughness: 0.35,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    specularIntensity: 0.3,
    envMap: env,
    envMapIntensity: 1,
  })
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u)
    // THE PLATE IS DRAWN SHARP. Seen through transmission it would be a soft copy of itself (the
    // pass that refracts works from a smaller picture of the scene). So its depth is written as if
    // it lay just in front of its own block's face: its own glass does not cover it, the glass
    // shows round it as a clear rim, and a monolith standing in front still hides it.
    sh.vertexShader = sh.vertexShader.replace(
      '#include <project_vertex>',
      `#include <project_vertex>
{
  float s02s = length(modelMatrix[0].xyz);
  vec4 s02near = projectionMatrix * (mvPosition + vec4(0.0, 0.0, ${(MD / 2 + 0.3).toFixed(3)} * s02s, 0.0));
  gl_Position.z = s02near.z / s02near.w * gl_Position.w;
}`,
    )
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\n#define S02UV vEmissiveMapUv\n${PARS}`)
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
${INKED}
// the light is blue: it leaves the hairline of flame alone (blue over flame would be pink)
float s02ink = 1.0 - smoothstep(0.08, 0.3, totalEmissiveRadiance.r - totalEmissiveRadiance.b);
totalEmissiveRadiance = mix(uGhost, totalEmissiveRadiance * (1.0 + uLit * 0.25 * s02ink) + uLitCol * uLit * 0.5 * s02ink, s02in);
totalEmissiveRadiance = mix(totalEmissiveRadiance, uFront * 1.25, s02band);
{
  // THE SHEEN: a window of the studio lies across the face, cut on the diagonal; it slides as the block or the camera turns
  vec3 s02n = normalize(normal);
  vec3 s02view = normalize(vViewPosition);
  vec3 s02t = s02view - s02n * dot(s02n, s02view);
  float s02d = (1.0 - S02UV.x) * 0.75 + S02UV.y - 1.02 + clamp(s02t.x * 1.1 + s02t.y * 0.8, -0.3, 0.22);
  float s02sheen = smoothstep(-0.012, 0.012, s02d) * (0.55 + 0.45 * S02UV.y);
  totalEmissiveRadiance += vec3(0.5, 0.72, 1.0) * 0.13 * s02sheen;
}`,
      )
  }
  mat.customProgramCacheKey = () => 's02-plate'
  return { mat, u }
}

/**
 * The glass itself: real transmission, a little blue where it is thick.
 *
 * On a canvas that is itself transparent, three.js lets a clear block through at half strength,
 * which on a white page is a flat grey. Two corrections make it glass again: its colour is laid
 * over the page as light (so clear glass on white stays bright), and toward its edges, where
 * glass reflects more than it lets through, it turns solid: there the studio is seen in it,
 * its dark panels as fine dark lines, its soft boxes as bright ones. That edge is what draws
 * a piece of glass on a white ground.
 */
function glassMaterial(theme: MonoTheme): THREE.MeshPhysicalMaterial {
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.05,
    metalness: 0,
    transmission: 1,
    thickness: 1.6,
    ior: 1.52,
    attenuationColor: new THREE.Color(theme === 'dark' ? '#a8d4ff' : '#4d93ff'),
    attenuationDistance: theme === 'dark' ? 2.5 : 2.4,
    specularIntensity: 1,
    envMapIntensity: theme === 'dark' ? 1.5 : 2.0,
    transparent: true,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    emissive: new THREE.Color(VEIL[theme].tint),
    emissiveIntensity: 0,
  })
  // THE TINT. Over the empty page the glass has nothing to refract, and light laid over white is
  // white: the block would read as white plastic. So the glass also lays a veil of its own colour
  // over the page (denser toward its edges, where one looks through more of it): cobalt glass.
  const veil = { uVeil: { value: VEIL[theme].k }, uTint: { value: new THREE.Color(VEIL[theme].tint) } }
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, veil)
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uVeil;\nuniform vec3 uTint;').replace(
      '#include <opaque_fragment>',
      `#include <opaque_fragment>
{
  float s02f = pow(1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0), 2.4);
  gl_FragColor.a = mix(gl_FragColor.a, 1.0, clamp(s02f * 1.25, 0.0, 0.96));
  float s02v = uVeil * (0.22 + 0.78 * smoothstep(0.0, 0.55, s02f)) * (1.0 - gl_FragColor.a);
  gl_FragColor.rgb += uTint * s02v;
  gl_FragColor.a += s02v;
}`,
    )
  }
  mat.customProgramCacheKey = () => 's02-glass'
  return mat
}

export interface MonoOptions {
  letter: string
  /** The section's name: given, the monolith has its lower block. */
  name?: string
  theme: MonoTheme
  family: string
  /** The plate's own environment (the studio gives it). */
  plateEnv: THREE.Texture
  /** A reflection of the plates in the floor it stands on: the meshes to put under a mirrored group. */
  mirror?: boolean
}

export interface MonoBuilt extends Mono {
  /** The plates again, for the floor's reflection (only with `mirror`): add it to a group with scale.y = -1. */
  reflection: THREE.Group | null
  /** The reflection's strength, 0 … 1. */
  reflect: number
}

interface Geos {
  tile: THREE.ExtrudeGeometry
  flap: THREE.ExtrudeGeometry
  tileSheet: THREE.ShapeGeometry
  flapSheet: THREE.ShapeGeometry
}

/** The geometries are the same for every monolith of one canvas: made once per studio, freed with the canvas. */
function makeGeos(): Geos {
  return {
    tile: blockGeo(MW, MW),
    flap: blockGeo(MW, ML),
    tileSheet: sheetGeo(MW - RIM * 2, MW - RIM * 2),
    flapSheet: sheetGeo(MW - RIM * 2, ML - RIM * 2),
  }
}

function makeMono(g: Geos, o: MonoOptions): MonoBuilt {
  const H = MW + ML
  const group = new THREE.Group()
  const body = new THREE.Group()
  group.add(body)

  const glass = glassMaterial(o.theme)
  // with no lower block the plate fills over the letter block alone
  const tileSpan: [number, number] = o.name ? [(ML + RIM) / H, (H - RIM) / H] : [0, 1]
  const tileArt = letterArt(o.letter, o.theme, o.family)
  const tilePlate = plateMaterial(tileArt, o.theme, tileSpan, false, o.plateEnv)
  const plates: PlateUniforms[] = [tilePlate.u]

  // the letter block
  const tile = new THREE.Mesh(g.tile, glass)
  const front = new THREE.Mesh(g.tileSheet, tilePlate.mat)
  front.position.z = 0.03
  // the same plate on the back: a block that turns over is never blank
  const back = new THREE.Mesh(g.tileSheet, tilePlate.mat)
  back.position.z = -0.03
  back.rotation.y = Math.PI
  body.add(tile, front, back)

  // the name block, hinged along the back of the seam
  let hinge: THREE.Group | null = null
  let flapPlate: { mat: THREE.Material; u: PlateUniforms } | null = null
  let flapArt: THREE.CanvasTexture | null = null
  if (o.name) {
    hinge = new THREE.Group()
    hinge.position.set(0, -MW / 2, -MD / 2)
    flapArt = nameArt(o.name, o.theme, o.family)
    flapPlate = plateMaterial(flapArt, o.theme, [RIM / H, (ML - RIM) / H], false, o.plateEnv)
    plates.push(flapPlate.u)
    const flap = new THREE.Mesh(g.flap, glass)
    flap.position.set(0, -ML / 2, MD / 2)
    const ff = new THREE.Mesh(g.flapSheet, flapPlate.mat)
    ff.position.set(0, -ML / 2, MD / 2 + 0.03)
    hinge.add(flap, ff)
    body.add(hinge)
  }

  // the floor's reflection: the plates only, fading with their height
  let reflection: THREE.Group | null = null
  const mirrors: PlateUniforms[] = []
  const bodies: { uFade: { value: number } }[] = []
  if (o.mirror) {
    reflection = new THREE.Group()
    const mt = plateMaterial(tileArt, o.theme, tileSpan, true)
    mirrors.push(mt.u)
    const m1 = new THREE.Mesh(g.tileSheet, mt.mat)
    m1.renderOrder = -1
    reflection.add(m1)
    // … and the glass round them: its colour, dying away with height like the plates
    const body = (geo: THREE.BufferGeometry, y: number, lo: number, hi: number) => {
      const u = { uFade: { value: 1 }, uSpan: { value: new THREE.Vector2(lo, hi) }, uHalf: { value: (hi - lo) * H * 0.5 }, uTint: { value: new THREE.Color(VEIL[o.theme].tint) } }
      const mat = new THREE.ShaderMaterial({
        uniforms: u,
        transparent: true,
        depthWrite: false,
        vertexShader: /* glsl */ `uniform vec2 uSpan; uniform float uHalf; varying float vH;
void main() { vH = mix(uSpan.x, uSpan.y, position.y / (2.0 * uHalf) + 0.5); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `uniform float uFade; uniform vec3 uTint; varying float vH;
void main() { float a = uFade * 0.42 * pow(clamp(1.0 - vH * 1.3, 0.0, 1.0), 2.2); gl_FragColor = vec4(mix(uTint, vec3(1.0), 0.35) * a, a); }`,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
      })
      bodies.push(u)
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.y = y
      mesh.renderOrder = -2
      reflection?.add(mesh)
    }
    body(g.tile, 0, o.name ? ML / H : 0, 1)
    if (o.name) body(g.flap, -MW / 2 - ML / 2, 0, ML / H)
    if (flapArt) {
      const mf = plateMaterial(flapArt, o.theme, [RIM / H, (ML - RIM) / H], true)
      mirrors.push(mf.u)
      const m2 = new THREE.Mesh(g.flapSheet, mf.mat)
      m2.position.y = -MW / 2 - ML / 2
      m2.renderOrder = -1
      reflection.add(m2)
    }
  }

  let fill = 1
  let lit = 0
  let fold = 0
  let reflect = 1
  const mono: MonoBuilt = {
    group,
    body,
    reflection,
    get fill() {
      return fill
    },
    set fill(v: number) {
      fill = v
      for (const u of plates) u.uFill.value = v
      for (const u of mirrors) u.uFill.value = v
    },
    get lit() {
      return lit
    },
    set lit(v: number) {
      lit = v
      for (const u of plates) u.uLit.value = v
      glass.emissiveIntensity = v * 0.12
    },
    get fold() {
      return fold
    },
    set fold(v: number) {
      fold = v
      if (!hinge) return
      // it swings back and up behind the letter block, drawing in a little so that none of it shows round the plate
      hinge.rotation.x = v * Math.PI
      const k = 1 - v * 0.14
      hinge.scale.set(k, k, 1 - v * 0.5)
      hinge.visible = v < 0.995
    },
    get reflect() {
      return reflect
    },
    set reflect(v: number) {
      reflect = v
      for (const u of mirrors) u.uFade.value = v
      for (const u of bodies) u.uFade.value = v
      if (reflection) reflection.visible = v > 0.003
    },
  }
  return mono
}

export interface Studio {
  /** A warm light to carry about (the lamp that travels down the list). */
  lamp: THREE.PointLight
  /** A monolith for this studio's canvas. Add `mono.group` to the scene yourself. */
  mono(o: Omit<MonoOptions, 'theme' | 'plateEnv'>): MonoBuilt
  dispose(): void
}

/**
 * THE STUDIO the glass stands in: a procedural environment (soft boxes overhead and behind the
 * camera, a long flame strip on the left, a clear-blue strip on the right) baked once into an
 * environment map, and three real lights for the plates. No picture is loaded.
 */
export function makeStudio(gl: SceneCanvas, theme: MonoTheme): Studio {
  const dark = theme === 'dark'
  const hot = (hex: string, k: number) => {
    const c = new THREE.Color(hex)
    c.multiplyScalar(k)
    return new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide, toneMapped: false })
  }
  /** A room: a dome of three tones, and panels of light hung in it (azimuth 0 is behind the camera, 180 behind the glass). */
  const room = (tones: [string, string, string], hang: (panel: (w: number, h: number, mat: THREE.Material, az: number, el: number) => void) => void) => {
    const env = new THREE.Scene()
    const dome = new THREE.SphereGeometry(60, 32, 16)
    const cols = new Float32Array(dome.attributes.position.count * 3)
    const [top, mid, low] = tones.map((t) => new THREE.Color(t))
    const c = new THREE.Color()
    for (let i = 0; i < dome.attributes.position.count; i++) {
      const y = dome.attributes.position.getY(i) / 60
      if (y > 0) c.copy(mid).lerp(top, y)
      else c.copy(mid).lerp(low, -y)
      cols.set([c.r, c.g, c.b], i * 3)
    }
    dome.setAttribute('color', new THREE.BufferAttribute(cols, 3))
    env.add(new THREE.Mesh(dome, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, toneMapped: false })))
    hang((w, h, mat, az, el) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
      const a = (az * Math.PI) / 180
      const e = (el * Math.PI) / 180
      m.position.set(Math.sin(a) * Math.cos(e) * 40, Math.sin(e) * 40, Math.cos(a) * Math.cos(e) * 40)
      m.lookAt(0, 0, 0)
      env.add(m)
    })
    return env
  }
  const white = hot('#ffffff', dark ? 7 : 3.4)
  const soft = hot('#eaf1ff', dark ? 3 : 2.2)
  const navy = hot('#071a50', 1)
  // THE GLASS'S ROOM: soft boxes, a long flame strip on the left, a clear-blue one on the right
  const glassRoom = room(dark ? ['#16307e', '#0a1a55', '#040b2e'] : ['#d6e0f7', '#8ea8e0', '#3d5cb4'], (panel) => {
    panel(34, 12, white, 0, 62)
    panel(9, 44, white, -22, 4)
    panel(7, 44, soft, 12, 6)
    panel(10, 44, white, 44, 2)
    panel(5, 44, soft, -58, 0)
    panel(3.2, 50, hot('#ed4224', dark ? 10 : 4), -84, 0)
    panel(3.2, 50, hot('#2f6bff', dark ? 9 : 6), 86, 0)
    panel(4, 50, hot('#ed4224', dark ? 6 : 2.5), -150, 6)
    panel(26, 9, soft, 180, 50)
    if (!dark) {
      // on a white page glass is drawn by what is DARK around it
      panel(7, 44, navy, -40, 0)
      panel(6, 44, navy, 28, 0)
      panel(8, 44, navy, 66, 0)
      panel(60, 10, navy, 0, -38)
    }
  })
  // THE PLATE'S ROOM: dark and neutral, with a few narrow white strips. A plate seen square-on
  // stays the navy it was painted; a strip crosses it as a glint when it banks. No colour here:
  // flame mirrored in navy would be purple.
  const plateRoom = room(dark ? ['#1b2f6e', '#0b1746', '#050b2a'] : ['#39456f', '#222c54', '#161d3e'], (panel) => {
    panel(30, 8, white, 0, 68)
    panel(4, 44, white, -52, 2)
    panel(3, 44, soft, 40, 4)
    panel(4, 44, white, 74, 0)
    panel(3, 44, soft, -80, 0)
  })
  const pmrem = new THREE.PMREMGenerator(gl.renderer)
  const baked = pmrem.fromScene(glassRoom, 0.025)
  const bakedPlate = pmrem.fromScene(plateRoom, 0.02)
  gl.scene.environment = baked.texture
  for (const env of [glassRoom, plateRoom]) {
    env.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
    })
  }
  for (const m of [white, soft, navy]) m.dispose()
  pmrem.dispose()

  // the real lights: a soft sky, a warm key from the upper left, the flame rim from behind, a cool fill
  gl.scene.add(new THREE.HemisphereLight(0xffffff, dark ? 0x24408f : 0xdfe8f7, dark ? 1.0 : 1.5))
  const key = new THREE.DirectionalLight(0xfff3ea, dark ? 2.2 : 1.7)
  key.position.set(-40, 50, 70)
  gl.scene.add(key)
  const rim = new THREE.DirectionalLight(0xed4224, dark ? 2.4 : 1.0)
  rim.position.set(-60, 12, -50)
  gl.scene.add(rim)
  const fillLight = new THREE.DirectionalLight(0x9cc8ff, 0.9)
  fillLight.position.set(60, -10, 40)
  gl.scene.add(fillLight)
  const lamp = new THREE.PointLight(0xfff1e6, 0, 34, 1.5)
  gl.scene.add(lamp)

  // the transmission pass draws the scene a second time: half the pixels are plenty for refraction
  gl.renderer.transmissionResolutionScale = 0.5

  const geos = makeGeos()
  return {
    lamp,
    mono: (o) => makeMono(geos, { ...o, theme, plateEnv: bakedPlate.texture }),
    dispose() {
      gl.scene.environment = null
      baked.dispose()
      bakedPlate.dispose()
      for (const g of Object.values(geos)) (g as THREE.BufferGeometry).dispose()
    },
  }
}
