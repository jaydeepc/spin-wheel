/**
 * Slide 58: every word and number is copied from THE OWNER'S PICTURE of 18 Nov, which supersedes
 * the pack for this slide (see PACK-FIXES.md). The owner's wording is kept as it stands,
 * including "fine tunning", "( SLMs)", "data,cost", "deployment run" and (in the headline, which
 * lives in deck.ts) "Open Wt.".
 */

export const REQUEST = { title: 'Every AI request', text: 'Customer journeys, operations, risk, documents' }
export const ROUTER = { title: 'Smart routing', text: 'Picks the right model for each task, by complexity and cost' }

export const FRONTIER = { title: 'Frontier APIs', lines: ['Anthropic · Google · OpenAI', 'Complex reasoning, new use cases'], share: 36, label: 'of tokens' }
export const INHOUSE = { title: 'In house Models - SLM', lines: ['Fine-tuned open-source models', 'High-volume, repeatable tasks'], share: 64, label: 'of tokens' }

/** the two homes of the in-house models. `bold`: the part of the line the picture sets in Bold. */
export const TRAIN = {
  title: 'Train & Fine tune (on Prem GPU)',
  lines: [
    { text: 'Model training & fine tunning ( SLMs)', bold: 'Model training & fine tunning ( SLMs)' },
    { text: 'Runs on our in house GPU cluster', bold: 'in house GPU cluster' },
    { text: '(NVIDIA H100/RTX PRO 6000)', bold: '' },
    { text: 'Full control over data,cost and iteration', bold: '' },
  ],
}
export const SERVE = {
  title: 'Inference & Production (on Cloud)',
  lines: [
    { text: 'All production deployment run on Cloud', bold: 'production deployment run on Cloud' },
    { text: 'Scalable high availability and low latency', bold: '' },
    { text: 'Handles enterprise-scale and peak demand', bold: '' },
  ],
}
/** the letters beside the cloud we draw: plain text, never the vendor's logo */
export const CLOUD_NAME = '' // owner, 18 Nov: the cloud is not named

export const PUNCH = 'Frontier APIs for the hardest problems, our own GPUs for high-volume everyday work'

export const BENEFITS = [
  { text: 'Lower cost per token', icon: 'chartLine' },
  { text: 'Data stays in-house', icon: 'shield' },
  { text: 'No single-vendor lock-in', icon: 'unlock' },
  { text: 'Faster, tuned responses', icon: 'gauge' },
] as const

/* ---- the layout, in --u: shared by the markup, the stylesheet's numbers and flow.ts ---------- */

/** the routing row's middle line in its final place, and how far below it the row stands while it has the stage to itself */
export const MID = 21.2
export const TALL_DY = 8.6
/** the request card and the router card: left, right; their height */
export const REQ = [9.2, 24.8]
export const ROU = [29.6, 45.2]
export const NODE_H = 11.2
/** the two bands: left edge, right edge, height, the gap between them, corner radius */
export const LANE_X = 52
export const LANE_X1 = 95.8
export const LANE_H = 5.65
export const LANE_GAP = 0.7
export const LANE_R = 1.1
export const F_TOP = MID - LANE_GAP / 2 - LANE_H
export const G_TOP = MID + LANE_GAP / 2
/** the stream between the cards: its thickness; the two ribbons are 36 and 64 of it */
export const STREAM = 3.4

/** the two panels: [left, right], top, height */
export const PANEL_Y = 32.5
export const PANEL_H = 9
export const PANEL_L = [4.2, 49.1]
export const PANEL_R = [50.9, 95.8]
export const TITLE_Y = 30.05
/** the rack's place in the left panel (centre), the cloud's in the right */
export const RACK_AT = [9.9, PANEL_Y + PANEL_H / 2]
/** the lane of served tokens along the foot of the right panel: from, to, height */
export const SERVE_LANE = [62.1, 94.4, PANEL_Y + PANEL_H - 1.15]

/* ---- the fork that leads from the in-house band down to its two homes ------------------------ */

const TRUNK_X = (PANEL_R[0] + PANEL_R[1]) / 2
const LEFT_X = (PANEL_L[0] + PANEL_L[1]) / 2
const FORK_Y0 = G_TOP + LANE_H + 0.15
const FORK_YJ = 28.3
export const FORK_Y1 = 29.45
export const FORK_TIPS = [LEFT_X, TRUNK_X]

type Pt = [number, number]
export interface Route {
  /** the SVG path, in stage units */
  d: string
  /** its length in stage units */
  length: number
  /** the point at k (0 … 1) along it, and the direction there */
  at(k: number): { x: number; y: number; angle: number }
}

/** a polyline with rounded corners: as an SVG path and as something a token can run along */
function route(pts: Pt[], r: number): Route {
  const dense: Pt[] = [pts[0]]
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i]
    if (i === pts.length - 1) {
      dense.push(p)
      d += ` L${p[0]} ${p[1]}`
      break
    }
    const a = pts[i - 1]
    const b = pts[i + 1]
    const la = Math.hypot(p[0] - a[0], p[1] - a[1])
    const lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const p0: Pt = [p[0] + ((a[0] - p[0]) / la) * r, p[1] + ((a[1] - p[1]) / la) * r]
    const p1: Pt = [p[0] + ((b[0] - p[0]) / lb) * r, p[1] + ((b[1] - p[1]) / lb) * r]
    d += ` L${p0[0]} ${p0[1]} Q${p[0]} ${p[1]} ${p1[0]} ${p1[1]}`
    for (let s = 0; s <= 8; s++) {
      const t = s / 8
      dense.push([(1 - t) * (1 - t) * p0[0] + 2 * t * (1 - t) * p[0] + t * t * p1[0], (1 - t) * (1 - t) * p0[1] + 2 * t * (1 - t) * p[1] + t * t * p1[1]])
    }
  }
  const acc = [0]
  for (let i = 1; i < dense.length; i++) acc.push(acc[i - 1] + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]))
  const length = acc[acc.length - 1]
  return {
    d,
    length,
    at(k) {
      const s = Math.max(0, Math.min(1, k)) * length
      let i = 1
      while (i < acc.length - 1 && acc[i] < s) i++
      const t = (s - acc[i - 1]) / Math.max(1e-6, acc[i] - acc[i - 1])
      const a = dense[i - 1]
      const b = dense[i]
      return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, angle: Math.atan2(b[1] - a[1], b[0] - a[0]) }
    },
  }
}

/** to the rack's panel (the long arm) and to the cloud's panel (straight down) */
export const FORK_LEFT = route(
  [
    [TRUNK_X, FORK_Y0],
    [TRUNK_X, FORK_YJ],
    [LEFT_X, FORK_YJ],
    [LEFT_X, FORK_Y1],
  ],
  0.55,
)
export const FORK_RIGHT = route(
  [
    [TRUNK_X, FORK_Y0],
    [TRUNK_X, FORK_Y1],
  ],
  0,
)
