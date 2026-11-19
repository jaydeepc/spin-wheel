/**
 * /ir slide 07 · WHERE THE POINTS STAND. Laid-out DOM is drawn once more onto an off-screen 2D
 * canvas (the stage at a few pixels per --u), and that picture is sampled for points:
 *
 *   paint(sheet, el)   draws what `el` shows: every word of text at the place the browser set it
 *                      (a Range per word, or per letter), every box with a background, every SVG
 *                      shape through its own matrix. Nothing is looked at, only measured, so it
 *                      works on a hidden element too.
 *   pick(sheet, n)     n places on what was painted, each with the colour it has there.
 *
 * Read-only: it never changes the elements it measures.
 */

export type Rand = () => number

/** A small seeded generator (mulberry32): the same field of points on every visit. */
export const rng = (seed: number): Rand => {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Sheet {
  g: CanvasRenderingContext2D
  w: number
  h: number
  /** sheet pixels per CSS pixel of the stage */
  k: number
  /** sheet pixels per --u */
  perU: number
  /** the stage's own corner in the window */
  ox: number
  oy: number
}

/** An empty sheet covering the stage, `perU` pixels to one --u. */
export function sheet(stage: DOMRect, perU: number): Sheet | null {
  const c = document.createElement('canvas')
  c.width = Math.round(100 * perU)
  c.height = Math.round(56.25 * perU)
  const g = c.getContext('2d', { willReadFrequently: true })
  if (!g || !stage.width) return null
  return { g, w: c.width, h: c.height, k: c.width / stage.width, perU, ox: stage.left, oy: stage.top }
}

const FLAME = 'rgb(241, 100, 67)'

/** 'rgb(1, 2, 3)' / 'rgba(1, 2, 3, 0.4)' → its alpha (1 when it cannot be read). */
const alphaOf = (c: string) => {
  if (c === 'transparent') return 0
  const m = /rgba?\(([^)]+)\)/.exec(c)
  if (!m) return 1
  const p = m[1].split(/[,\s/]+/).filter(Boolean)
  return p.length > 3 ? Number(p[3]) : 1
}
/** A paint the canvas can use: a gradient or a pattern (`url(#…)`) is taken as the flame it is here. */
const solid = (c: string) => (c.startsWith('url') ? FLAME : c)

export interface PaintOptions {
  /** Elements (and all inside them) that are not painted. */
  skip?: (el: Element) => boolean
  /** Text is set down letter by letter (exact for large type) instead of word by word. */
  letters?: boolean
}

/** Draws what `root` shows onto the sheet. */
export function paint(s: Sheet, root: Element, opts: PaintOptions = {}) {
  const { g, k } = s
  const flat = () => g.setTransform(1, 0, 0, 1, 0, 0)

  const words = (node: Text, cs: CSSStyleDeclaration, alpha: number) => {
    const text = node.data
    if (!text.trim()) return
    const px = parseFloat(cs.fontSize) * k
    if (!(px > 0)) return
    flat()
    g.font = `${cs.fontStyle} ${cs.fontWeight} ${px}px ${cs.fontFamily}`
    g.textAlign = 'left'
    g.textBaseline = 'alphabetic'
    g.fillStyle = cs.color
    g.globalAlpha = alpha * alphaOf(cs.color)
    const ascent = g.measureText('H').fontBoundingBoxAscent
    const range = document.createRange()
    const re = opts.letters ? /\S/g : /\S+/g
    for (let m = re.exec(text); m; m = re.exec(text)) {
      range.setStart(node, m.index)
      range.setEnd(node, m.index + m[0].length)
      const r = range.getClientRects()[0]
      if (!r || !r.width) continue
      g.fillText(m[0], (r.left - s.ox) * k, (r.top - s.oy) * k + ascent)
    }
  }

  const shape = (el: SVGGraphicsElement, cs: CSSStyleDeclaration, alpha: number) => {
    const m = el.getScreenCTM()
    if (!m) return
    g.setTransform(k * m.a, k * m.b, k * m.c, k * m.d, k * (m.e - s.ox), k * (m.f - s.oy))
    const num = (name: string) => Number(el.getAttribute(name)) || 0
    const tag = el.tagName.toLowerCase()
    if (tag === 'text') {
      g.font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize)}px ${cs.fontFamily}`
      const anchor = cs.textAnchor
      g.textAlign = anchor === 'middle' ? 'center' : anchor === 'end' ? 'right' : 'left'
      g.textBaseline = 'alphabetic'
      g.fillStyle = solid(cs.fill)
      g.globalAlpha = alpha
      g.fillText(el.textContent ?? '', num('x'), num('y'))
      return
    }
    let path: Path2D
    if (tag === 'path') path = new Path2D(el.getAttribute('d') ?? '')
    else {
      path = new Path2D()
      if (tag === 'rect') path.roundRect(num('x'), num('y'), num('width'), num('height'), Math.min(num('rx'), num('height') / 2))
      else if (tag === 'circle') path.arc(num('cx'), num('cy'), num('r'), 0, Math.PI * 2)
      else if (tag === 'line') {
        path.moveTo(num('x1'), num('y1'))
        path.lineTo(num('x2'), num('y2'))
      } else return
    }
    if (cs.fill !== 'none' && tag !== 'line') {
      g.fillStyle = solid(cs.fill)
      g.globalAlpha = alpha * (Number(cs.fillOpacity) || 0)
      g.fill(path)
    }
    const width = parseFloat(cs.strokeWidth)
    if (cs.stroke !== 'none' && width > 0) {
      g.strokeStyle = solid(cs.stroke)
      g.lineWidth = width
      g.lineCap = cs.strokeLinecap as CanvasLineCap
      const dash = cs.strokeDasharray === 'none' ? [] : cs.strokeDasharray.split(/[,\s]+/).map(parseFloat)
      g.setLineDash(dash.some((d) => !(d >= 0)) ? [] : dash)
      g.globalAlpha = alpha * (Number(cs.strokeOpacity) || 0)
      g.stroke(path)
      g.setLineDash([])
    }
  }

  const walk = (el: Element, alpha: number) => {
    if (opts.skip?.(el)) return
    const cs = getComputedStyle(el)
    if (cs.display === 'none') return
    const a = alpha * (Number(cs.opacity) || 0)
    if (a <= 0) return
    if (el instanceof SVGElement) {
      const tag = el.tagName.toLowerCase()
      if (tag === 'defs' || tag === 'clippath' || tag === 'lineargradient') return
      if (tag !== 'svg' && tag !== 'g') return shape(el as SVGGraphicsElement, cs, a)
    } else {
      // a box with a ground of its own
      const bg = alphaOf(cs.backgroundColor)
      const grad = cs.backgroundImage.includes('gradient')
      if (bg > 0.02 || grad) {
        const r = el.getBoundingClientRect()
        flat()
        g.fillStyle = grad && bg <= 0.02 ? FLAME : cs.backgroundColor
        g.globalAlpha = a * (grad && bg <= 0.02 ? 1 : bg)
        g.beginPath()
        g.roundRect((r.left - s.ox) * k, (r.top - s.oy) * k, r.width * k, r.height * k, Math.min(parseFloat(cs.borderTopLeftRadius) || 0, r.height / 2, r.width / 2) * k)
        g.fill()
      }
      for (const node of Array.from(el.childNodes)) if (node.nodeType === 3) words(node as Text, cs, a)
    }
    for (const child of Array.from(el.children)) walk(child, a)
  }

  g.save()
  walk(root, 1)
  g.restore()
  flat()
  g.globalAlpha = 1
}

export interface Picks {
  n: number
  /** places in --u from the stage's top left: x0, y0, x1, y1, … */
  at: Float32Array
  /** the colour there, 0 … 1: r0, g0, b0, … */
  rgb: Float32Array
}

/**
 * `n` places on what the sheet shows, each as likely as its pixel is opaque (times `weight`, if
 * given: a way to thin a large flat area). Null when nothing was painted.
 */
export function pick(s: Sheet, n: number, rand: Rand, weight?: (r: number, g: number, b: number) => number): Picks | null {
  const d = s.g.getImageData(0, 0, s.w, s.h).data
  const where: number[] = []
  const sum: number[] = []
  let total = 0
  for (let i = 0, p = 0; i < d.length; i += 4, p++) {
    const a = d[i + 3]
    if (a < 24) continue
    const w = (a / 255) * (weight ? weight(d[i], d[i + 1], d[i + 2]) : 1)
    if (w <= 0) continue
    total += w
    where.push(p)
    sum.push(total)
  }
  if (where.length < 16) return null
  const at = new Float32Array(n * 2)
  const rgb = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const t = rand() * total
    let lo = 0
    let hi = sum.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (sum[mid] < t) lo = mid + 1
      else hi = mid
    }
    const p = where[lo]
    at[i * 2] = ((p % s.w) + rand()) / s.perU
    at[i * 2 + 1] = (Math.floor(p / s.w) + rand()) / s.perU
    rgb[i * 3] = d[p * 4] / 255
    rgb[i * 3 + 1] = d[p * 4 + 1] / 255
    rgb[i * 3 + 2] = d[p * 4 + 2] / 255
  }
  return { n, at, rgb }
}
