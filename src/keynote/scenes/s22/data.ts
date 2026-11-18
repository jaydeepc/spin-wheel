/**
 * Slide 22: every word and number, copied from exports/_rig/keynote-src/pack/22/ (text.json,
 * data.json, images.json). Nothing here is retyped from the picture.
 */

/** text.json → t02: the deck's flame word of the headline */
export const FLAME = ['electricity']

/** text.json → t03 "945 TWh" (data.json → stats[0]) */
export const POWER = {
  digits: 945,
  unit: 'TWh',
  line: "what the world's data centres will draw by 2030, about as much electricity as all of Japan uses today.",
  bold: ['as much electricity as all of Japan uses today'],
}

/** text.json → t05 "$600 bn+" (data.json → stats[1]) */
export const MONEY = {
  to: 600,
  prefix: '$',
  suffix: ' bn+',
  line: 'going into data centres this year. Power decides how fast it lands.',
  bold: ['Power decides how fast it lands.'],
}

/** text.json → t08, t09 (data.json → captions) */
export const READY = 'The chips are ready and waiting.'
export const NOT = 'The grid is not.'

/** images.json → photo-pylon: px [246, 438]; the deck shows it 8.4u wide, with rounded corners, on the wall */
export const PYLON = { name: 'photo-pylon.jpg', px: [246, 438] as const }

/** data.json → clippings (text.json x01 … x08, read by eye; checked against the page) */
export const CLIPS = [
  {
    date: 'NOV 2025',
    text: "Microsoft's CEO says the company has AI chips sitting in inventory that it cannot plug in",
    source: "Reported by Tom's Hardware",
    tape: 'flame' as const,
    tilt: -1.3,
    width: 26.2,
  },
  {
    date: 'IEA',
    text: 'One in five planned data-centre projects risks delay because the grid cannot connect them in time',
    source: 'IEA, Energy and AI',
    tape: 'navy' as const,
    tilt: 1,
    width: 25.2,
  },
]

/** text.json → t07 */
export const SOURCES = 'Sources: IEA, Energy and AI (2025) and Powering Artificial Intelligence (Oct 2026)'

/**
 * The row of chips, from the deck's picture (illus-chips-and-socket): four that wait, each a
 * little nearer and a little less faded than the one before, and the fifth, which lights.
 * `x` is the chip's centre and `size` its side with its pins, in --u; `dim` is how faded it waits.
 */
export const CHIPS = [
  { x: 26.8, size: 6.3, dim: 0.26 },
  { x: 37.2, size: 6.9, dim: 0.36 },
  { x: 48.0, size: 7.5, dim: 0.47 },
  { x: 59.3, size: 8.1, dim: 0.58 },
  { x: 71.4, size: 9.4, dim: 0.72 },
]
/** The row's centre line, in --u from the top. */
export const ROW = 41.2
