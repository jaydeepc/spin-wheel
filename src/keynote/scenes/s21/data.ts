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
export const QUOTE = { said: '“I want to manage all my vendors in one platform.”', rest: 'Done, with no screen to click through.' }

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

/* ---- the example (beat 'example'): NOT from the pack. The presenter asked for one written-out
        use case; the sentence is his, the screen is an illustration of generated software with
        generic labels only (no company, no person, no figure). ---- */

/** The presenter's sentence, typed out letter by letter. */
export const ASK = 'I want to manage all my vendors in one platform'

/** One line under it, in the slide's own vocabulary. */
export const CAPTION = { text: 'Described in a sentence. Built, not bought.', flame: ['Built, not bought.'] }

export type Status = 'Active' | 'Pending' | 'Renewal'
type Tone = 'navy' | 'flame' | 'azure' | 'peach' | 'pale'

/** The vendor-management screen. `tile` is the grid tile (GRID index) that becomes that piece. */
export const UI = {
  address: 'vendors',
  nav: ['Vendors', 'Contracts', 'Payments due', 'Onboarding'],
  search: 'Search vendors',
  add: 'Add vendor',
  head: ['Vendor', 'Status', 'Contract'],
  rows: [
    { name: 'Vendor A', tone: 'navy', tile: 2, status: 'Active', chipTile: 13, term: 34 },
    { name: 'Vendor B', tone: 'flame', tile: 8, status: 'Renewal', chipTile: -1, term: 92 },
    { name: 'Vendor C', tone: 'azure', tile: 7, status: 'Active', chipTile: -1, term: 58 },
    { name: 'Vendor D', tone: 'peach', tile: 5, status: 'Pending', chipTile: 9, term: 8 },
    { name: 'Vendor E', tone: 'pale', tile: 10, status: 'Active', chipTile: -1, term: 71 },
  ] as { name: string; tone: Tone; tile: number; status: Status; chipTile: number; term: number }[],
  /** Payments due: bars only, no scale and no figure. Heights in % of the plot. */
  bars: [
    { h: 36, tone: 'pale', tile: -1 },
    { h: 54, tone: 'azure', tile: 11 },
    { h: 42, tone: 'pale', tile: 14 },
    { h: 68, tone: 'azure', tile: -1 },
    { h: 50, tone: 'pale', tile: -1 },
    { h: 88, tone: 'flame', tile: 15 },
  ] as { h: number; tone: Tone; tile: number }[],
  /** Contracts: a ring in three parts (degrees, clockwise from the top), no figure. */
  ring: [
    { status: 'Active', from: 0, to: 206 },
    { status: 'Renewal', from: 218, to: 286 },
    { status: 'Pending', from: 298, to: 348 },
  ] as { status: Status; from: number; to: number }[],
}

/** The order in which the grid's tiles leave for the window: top bar, list, panels. */
export const TILE_ORDER = [0, 3, 1, 6, 4, 2, 13, 8, 7, 5, 9, 10, 11, 14, 15, 12]
