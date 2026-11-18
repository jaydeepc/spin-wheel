/**
 * Slide 58: every word and number is copied from exports/_rig/keynote-src/pack/58
 * (text.json / data.json). Lines broken as the deck breaks them.
 */

/** data.json → routing.in (t02, t03) and routing.router (t04, t05) */
export const REQUEST = { title: 'Every AI request', text: 'Customer journeys, operations, risk, documents' }
export const ROUTER = { title: 'Smart routing', text: 'Picks the right model for each task, by complexity and cost' }

/** data.json → routing.out (t06 … t13) */
export const FRONTIER = { title: 'Frontier APIs', lines: ['Anthropic · Google · OpenAI', 'Complex reasoning, new use cases'], share: 36, label: 'of tokens' }
export const GPU = { title: 'Our own GPU platform', lines: ['Fine-tuned open-source models', 'High-volume, repeatable tasks'], share: 64, label: 'of tokens' }

/** t14 */
export const PUNCH = 'Frontier APIs for the hardest problems, our own GPUs for high-volume everyday work'

/** t17, and data.json → inside.steps (t15/t16, t18/t19, t20/t21, t22/t23). `bold`: the deck's bold word in the line. */
export const INSIDE = 'Inside our GPU platform'
export const STEPS = [
  { n: 1, title: 'Open Source Model', lines: ['Best open-source models:', 'Gemma 4, Qwen, Llama'], icon: 'search', bold: '' },
  { n: 2, title: 'Fine-tune', lines: ['Train them on our own', 'domain data'], icon: 'sliders', bold: '' },
  { n: 3, title: 'Host', lines: ['On our NVIDIA H100 and', 'RTX PRO 6000 clusters'], icon: 'chip', bold: 'NVIDIA' },
  { n: 4, title: 'Serve', lines: ['Small language and vision models at', 'scale'], icon: 'bolt', bold: '' },
]

/** data.json → benefits (t24 … t27) */
export const BENEFITS = [
  { text: 'Lower cost per token', icon: 'chartLine' },
  { text: 'Data stays in-house', icon: 'shield' },
  { text: 'No single-vendor lock-in', icon: 'unlock' },
  { text: 'Faster, tuned responses', icon: 'gauge' },
]

/* ---- the layout of the routing row, in --u (shared by the scene, its stylesheet's numbers and flow.ts) ----
 *
 * The row has TWO states. TALL: while it has the stage to itself (route, why) the two lanes stand
 * 25u high and the row sits in the middle of the frame. COMPACT: when "Inside our GPU platform"
 * needs the room (inside, gains) the lanes draw in and the row moves up. In both, the lanes'
 * heights are 36 : 64. `tall` (1 … 0) is one number on the timeline.
 */
/** the request card, the router card: left, right; their height */
export const REQ = [4.2, 21.7]
export const ROU = [28.2, 45.7]
export const NODE_H = 13.8
/** the lanes: left edge, width, corner radius, the gap between the two */
export const LANE_X = 52.2
export const LANE_W = 43.6
export const LANE_R = 1.2
export const LANE_GAP = 0.9
/** top and bottom of the pair of lanes: [compact, tall] */
const TOP = [15.2, 16.8]
const BOT = [33.2, 43.2]
/** the thickness of the stream between the cards */
export const STREAM = 3.6

const mix = (a: number, b: number, k: number) => a + (b - a) * k

export interface Row {
  /** the row's middle line (the cards' centre, the stream's centre) */
  mid: number
  fTop: number
  fH: number
  gTop: number
  gH: number
}
/** THE SPLIT IS THE PICTURE: the lanes' heights are their shares of the tokens, at every `tall` */
export function row(tall: number): Row {
  const top = mix(TOP[0], TOP[1], tall)
  const bot = mix(BOT[0], BOT[1], tall)
  const room = bot - top - LANE_GAP
  const fH = (room * FRONTIER.share) / 100
  const gH = (room * GPU.share) / 100
  return { mid: (top + bot) / 2, fTop: top, fH, gTop: bot - gH, gH }
}
/** the rack in the GPU lane: the width of its place when compact, and how much larger it stands when tall */
export const RACK_W = 5.8
export const RACK_TALL = 1.28
