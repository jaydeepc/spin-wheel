/**
 * Slide 17 · the words, numbers and rectangles of the deck, copied from
 * exports/_rig/keynote-src/pack/17/ (text.json, data.json, images.json). Nothing here is retyped.
 */

/** text.json → t02: the flame words of the headline. */
export const FLAME = ['6 in 100']

/** data.json → stats[0..2] (text.json → t03 … t08: the bold words are the navy spans). */
export const STATS = [
  {
    key: 'grey',
    value: 63,
    line: 'see no impact on profit',
    bold: ['no impact on profit'],
  },
  { key: 'blue', value: 31, line: 'see a little', bold: ['a little'] },
  {
    key: 'flame',
    value: 6,
    line: 'earn 5% or more of profit from AI',
    bold: ['5% or more'],
  },
] as const

/** data.json → stats[3] (text.json → t09, t10, t11). */
export const WHY = {
  label: 'What the six do differently', // t09, printed in capitals: WHAT THE SIX DO DIFFERENTLY
  value: '3 in 4', // t10
  line: 'redesigned how the work gets done. Only 1 in 4 of everyone else did.', // t11
  bold: ['1 in 4'],
}

/** data.json → clippings[0] (text.json → x01 … x04, read by eye and checked against the page). */
export const CLIP = {
  date: 'AUG 2026',
  headline: 'Record AI spending cannot move the earnings needle for 94% of enterprises',
  source: "Tech Times, on McKinsey's State of AI 2026",
}

/** data.json → footnote (text.json → t12). */
export const SOURCE = 'Source: McKinsey, The state of AI in 2026 (1,719 executives, 97 countries). Each plane is one company in a hundred.'

/** data.json → planes: one plane is one company in a hundred. */
export const PLANES = { grey: 63, blue: 31, orange: 6 }

/** images.json → illus-paper-planes → placements[0].rect (the deck's flat picture: the layout reference, and the picture shown where there is no WebGL). */
export const PICTURE = [0.0338, 0.3708, 0.5701, 0.5335]

/**
 * Where the six hang in the air once they have left: the deck's fan (illus-paper-planes.png), opened
 * wide over the free half of the stage. The middle of each plane in --u from the stage's top left,
 * its length in --u, its depth toward the room, and the heading it arrives on (degrees above level).
 * A loose formation behind the first plane, each clear of the others' trails. Back row first.
 */
export const SIX = [
  { u: 60.0, v: 29.2, size: 7.2, z: 40, head: 48 },
  { u: 52.2, v: 31.6, size: 5.4, z: 28, head: 48 },
  { u: 47.2, v: 35.1, size: 4.2, z: 16, head: 48 },
  { u: 59.4, v: 38.1, size: 6.0, z: 34, head: 48 },
  { u: 47.2, v: 44.2, size: 4.2, z: 14, head: 48 },
  { u: 55.6, v: 46.1, size: 5.0, z: 24, head: 48 },
]

/** The stats over the wide field of the first rest: how far each stands from its place beside the field at the left, in --u. */
export const WIDE_STATS = { grey: { x: 3.6, y: -5.4 }, blue: { x: 29.6, y: -5.4 } }
