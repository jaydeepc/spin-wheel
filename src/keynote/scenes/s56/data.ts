/**
 * Slide 56: every word is copied from exports/_rig/keynote-src/pack/56 (text.json / data.json).
 */
export interface Part {
  /** text.json block of the title */
  title: string
  /** the deck's flame word in the title */
  flame: string
  text: string
  icon: 'handshake' | 'team' | 'layers' | 'compass' | 'brain' | 'tag'
}

/** data.json → left (t03/t04, t07/t08, t09/t10) */
export const LEFT: Part[] = [
  {
    title: 'Business sponsorship',
    flame: 'sponsorship',
    text: 'It starts when the business asks: How can AI solve this better?',
    icon: 'handshake',
  },
  {
    title: 'Our own team',
    flame: 'team',
    text: 'Applied AI scientists and AI engineers, close to the latest research.',
    icon: 'team',
  },
  {
    title: 'Our own platform',
    flame: 'platform',
    text: 'We own the source code. No black boxes.',
    icon: 'layers',
  },
]
/** data.json → right (t05/t06, t13/t14, t15/t16) */
export const RIGHT: Part[] = [
  {
    title: 'Open architecture',
    flame: 'architecture',
    text: 'GPU & SLMs, kept swappable.',
    icon: 'compass',
  },
  {
    title: 'Our own models',
    flame: 'models',
    text: 'ML and fine-tuned SLMs, trained on our data and context.',
    icon: 'brain',
  },
  {
    title: 'Annotation & hindsighting',
    flame: 'Annotation',
    text: 'Our own platform to label data and learn from what happened.',
    icon: 'tag',
  },
]
/** data.json → centre (t11, t12) */
export const PILL = 'UNDER THE HOOD OF AI'
export const LINE = 'The Engine that runs it all'

/* ---- the layout, in --u (the scene's own; the stylesheet repeats the card numbers) ---- */
/** the engine's centre and its orbit */
export const CX = 50
export const CY = 27.4
export const ORBIT = 11.4
/** the three rows of cards: their middles */
export const ROW_CY = [19.7, 31.3, 42.9]
/** the inner edges of the cards */
export const EDGE_L = 35.2
export const EDGE_R = 64.8
/**
 * THE SIX CONNECTORS ARE ONE FAMILY. Each leaves its card level, runs a short way, and makes ONE
 * rounded turn onto a radius of the orbit, so that it arrives pointing at the engine's centre.
 * `MEET`: where each row's connector meets the orbit, in degrees above the horizontal.
 * `LEAVE`: where it leaves the card, against the row's middle (the bottom row leaves higher, so
 * that its radius clears the pill by more than 2u).
 */
const MEET = [35, -17, -45]
const LEAVE = [0, 0, -2]
const TURN = [1.5, 1.3, 1.1]

type Pt = [number, number]
export interface Link {
  /** 0 … 5: left rows 0 1 2, then right rows 0 1 2 */
  k: number
  /** in --u: where it leaves the card; where the turn begins; the corner; where the turn ends; where it meets the orbit */
  start: Pt
  in: Pt
  corner: Pt
  out: Pt
  end: Pt
  /** the same as an SVG path */
  d: string
  /** the angle at which it meets the orbit, radians, y up */
  angle: number
}

export const LINKS: Link[] = [0, 1, 2, 3, 4, 5].map((k) => {
  const side = k < 3 ? -1 : 1
  const row = k % 3
  const a = (MEET[row] * Math.PI) / 180
  // the radius, pointing outward from the orbit (screen coordinates, y down)
  const rx = side * Math.cos(a)
  const ry = -Math.sin(a)
  const end: Pt = [CX + ORBIT * rx, CY + ORBIT * ry]
  const sx = side < 0 ? EDGE_L : EDGE_R
  const sy = ROW_CY[row] + LEAVE[row]
  // the corner: where the level line from the card crosses that radius
  const corner: Pt = [end[0] + ((sy - end[1]) / ry) * rx, sy]
  const r = TURN[row]
  const inn: Pt = [corner[0] + side * r, sy]
  const out: Pt = [corner[0] - r * rx, corner[1] - r * ry]
  const f = (p: Pt) => `${p[0].toFixed(3)} ${p[1].toFixed(3)}`
  return {
    k,
    start: [sx, sy],
    in: inn,
    corner,
    out,
    end,
    d: `M${f([sx, sy])} L${f(inn)} Q${f(corner)} ${f(out)} L${f(end)}`,
    angle: side < 0 ? Math.PI - a : a,
  }
})
