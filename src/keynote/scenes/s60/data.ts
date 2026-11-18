/**
 * Slide 60: the words of the slide, copied from the pack (pack/60/data.json; the same strings
 * as text.json t02 … t26). Nothing is retyped; nothing is added. The slide prints NO numbers
 * beside "01" … "04": the panel's traces carry none, and no scale either.
 */
import type { IconName } from './icons'

export interface Lever {
  key: string
  icon: IconName
  /** data.json → levers[i].n */
  n: string
  /** data.json → levers[i].title */
  title: string
  /** data.json → levers[i].promise (flame on the slide) */
  promise: string
  /** data.json → levers[i].text, or … */
  text?: string
  /** … data.json → levers[i].bullets */
  bullets?: string[]
}

export const LEVERS: Lever[] = [
  { key: 'hardware', icon: 'cpu', n: '01', title: 'Hardware', promise: 'Use capacity where it adds value', text: "Right GPU for each model's memory and compute" },
  { key: 'memory', icon: 'database', n: '02', title: 'Memory & caching', promise: 'More requests per GPU', bullets: ['PagedAttention cuts waste', 'Prefix caching reuses prompts'] },
  { key: 'runtime', icon: 'zap', n: '03', title: 'Inference runtime', promise: 'Faster answers under load', text: 'Continuous batching · FlashAttention · TensorRT-LLM · speculative decoding' },
  { key: 'footprint', icon: 'minimize', n: '04', title: 'Model footprint', promise: 'More specialised models per GPU', text: 'FP8 / INT4 shrink models · multi-LoRA shares one base' },
]

/**
 * data.json → panel. `better` is the way each measure improves (latency falls, the other two
 * rise): the only thing the traces show. Every pull moves all three by the same one step.
 */
export const PANEL = {
  label: 'MEASURE & IMPROVE',
  title: 'Full-stack observability',
  items: [
    { icon: 'timer' as IconName, title: 'Response latency', line: 'First token + token speed', better: 'down' as const },
    { icon: 'trending' as IconName, title: 'Serving throughput', line: 'Tokens/sec + cache hit rates', better: 'up' as const },
    { icon: 'gauge' as IconName, title: 'GPU utilisation', line: 'Compute + memory usage', better: 'up' as const },
  ],
}

/** data.json → banner, bannerFlame */
export const BANNER = 'Domain-specific models, efficient GPU serving and measurable platform performance.'
export const BANNER_FLAME = 'measurable platform performance'

/** THE LAYOUT, in stage units: one set of numbers for the DOM and for the three.js console. */
export const G = {
  x0: 4.2,
  cardW: 15.1,
  gap: 1.23,
  /** the cards: they stand ON the console deck (their feet overlap its top) */
  top: 13.6,
  cardBot: 31.1,
  /** the console deck under all four */
  deckTop: 29.7,
  deckBot: 43.9,
  deckX0: 4.2,
  deckX1: 68.3,
  /** the channel that runs along the deck into the panel */
  busV: 33.0,
  /** a lever: its pivot (the middle of its slot), how far the grip travels either way */
  pivotV: 38.15,
  reach: 2.55,
  slotH: 7.0,
  panelX: 69.8,
  panelW: 26,
  bottom: 43.9,
  /** the panel's three rows, from the panel's top; a row's disc is 2.9 across */
  rowTop: [8.0, 15.3, 22.6],
  disc: 2.9,
  bannerTop: 45.3,
  bannerH: 4.6,
} as const

export const cardX = (i: number) => G.x0 + i * (G.cardW + G.gap)
/** A lever's arm: its length, and how far it leans either way (radians) to give `reach`. */
export const ARM = 4.4
export const LEAN = Math.asin(G.reach / ARM)

/**
 * A TRACE of the panel, in tenths of a unit: a start, then one equal step per lever, down for
 * latency and up for the other two. No track, no end stop, no figure: only the way it goes.
 */
export const TRACE = { w: 190, h: 37, x0: 7, dx: 41, step: 6.6 } as const
export const tracePath = (better: 'up' | 'down') => {
  const s = better === 'up' ? -1 : 1
  const y0 = better === 'up' ? TRACE.h - 5 : 5
  let d = `M${TRACE.x0} ${y0}`
  for (let k = 1; k <= LEVERS.length; k++) {
    const xa = TRACE.x0 + (k - 1) * TRACE.dx
    const xb = xa + TRACE.dx
    const ya = y0 + s * (k - 1) * TRACE.step
    const yb = y0 + s * k * TRACE.step
    d += ` C${xa + TRACE.dx * 0.5} ${ya} ${xb - TRACE.dx * 0.5} ${yb} ${xb} ${yb}`
  }
  return { d, y0 }
}
