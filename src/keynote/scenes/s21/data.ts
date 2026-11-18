/**
 * Slide 21: every word and number, copied from exports/_rig/keynote-src/pack/21/ (text.json,
 * data.json, images.json). Nothing here is retyped from the picture.
 */

/** text.json → t02: the deck's flame words of the headline */
export const FLAME = ['build what they used to buy']

/** data.json → flows (text.json t03 … t13) */
export const FROM = { label: 'FROM', steps: ['User', 'Screen', 'Bought software', 'Database'] }
export const TO = { label: 'TO', steps: ['User', 'A goal, in plain words', 'AI agent', 'In-house hosted systems'] }

/** text.json → t12 (data.json → quote): the first sentence bold, the rest regular; one space between them here */
export const QUOTE = { said: '“Raise this vendor\'s invoice.”', rest: 'Done, with no screen to click through.' }

/** data.json → stats[0] (text.json x01, x02, read by eye; checked against the page) */
export const SKIPPED = {
  to: 32,
  line: 'of companies skipped a software purchase this year because they could build it with AI.',
  bold: ['they could build it with AI'],
  tilt: 1.6,
}

/** data.json → clippings[0] (text.json x03 … x06, read by eye; checked against the page) */
export const CLIP = {
  date: 'JUL 2026',
  text: 'Agentic AI puts $234 bn of enterprise software spending at risk by 2030',
  source: 'Gartner, reported by CIO Dive',
  tape: 'flame' as const,
  tilt: -1.4,
}

/** data.json → billing (text.json t14, t15) */
export const BILLING = {
  label: 'BILLING CHANGES TOO',
  text: 'Vendors stop charging for seats and hours and start charging for results: $0.99 per solved ticket at Intercom.',
  bold: ['$0.99 per solved ticket'],
}

/** text.json → t16 */
export const SOURCES = 'Sources: McKinsey, The state of AI in 2026 (36% among financial institutions); Gartner (Jul 2026); Intercom Fin pricing'

/** images.json → illus-saas-blocks → placements[0].rect (the flat picture: the reference, and the stand-in where there is no WebGL) */
export const BLOCKS_RECT = [0.0338, 0.2867, 0.6452, 0.3868]
export const BLOCKS_PIC = 'illus-saas-blocks.png'

/* ---- the picture's layout on the stage, in --u (from the deck's picture) ---- */

/** The company's own grid: a panel of 4 x 4 tiles. */
export const PANEL = { x: 52.2, y: 22.9, size: 13.0 }
export const TILE = 2.36
const MARGIN = 0.92
const PITCH = (PANEL.size - 2 * MARGIN - TILE) / 3
/** The centre of grid cell (row, col) on the stage, in --u. */
export const cell = (row: number, col: number) => ({
  u: PANEL.x + MARGIN + TILE / 2 + col * PITCH,
  v: PANEL.y + MARGIN + TILE / 2 + row * PITCH,
})

/** The grid's tiles, row by row, in the picture's colours. The last one is the tile the picture shows landing. */
export const GRID: ('navy' | 'flame' | 'peach' | 'azure' | 'pale')[] = [
  'navy', 'navy', 'navy', 'navy',
  'flame', 'peach', 'azure', 'azure',
  'flame', 'peach', 'pale', 'azure',
  'navy', 'azure', 'pale', 'flame',
]
