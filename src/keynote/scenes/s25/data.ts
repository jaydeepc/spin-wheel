/**
 * Slide 25 · every word and number, copied from exports/_rig/keynote-src/pack/25/data.json.
 * Nothing here is retyped: the strings were written out of the pack by a script.
 *
 * The pack read these cards BY EYE (the PDF holds them as outlines). Every value below was
 * checked once more against public/keynote/pages/25.jpg at full size, card by card:
 *   9,000+ · 3x · Agent · 13% → 64% · $1.48 → $0.64 · 623 · 277 · 634 · 3.62 lakh · eight
 * all confirmed.
 *
 * The first card (Enough of Pilots) is NOT the pack's: the presenter replaced its figure and its
 * words ("80k → 800K+", voice calls done by AI), letter for letter as given. The pack printed
 * "2.3% → 0.57%" and the cost of acquiring a customer there.
 */

export interface Stat {
  /** The figure as the deck prints it. "a → b" is a pair: it counts from a to b. */
  value: string
  tone: 'flame' | 'navy' | 'azure'
  /** The words under this figure, where a card has several figures. */
  line?: string
  bold?: string
}

export interface LinkCard {
  key: string
  /** The world theme of slide 16 that this card answers. */
  label: string
  /** The round thumbnail: the same picture as on slide 16 (images.json → pictures[].name). */
  thumb: string
  tape: 'flame' | 'navy' | 'azure'
  /** images.json → placements[].rotation of the card's thumbnail: the card's own tilt, in degrees. */
  tilt: number
  sub?: string
  /** A small tag beside the card's first figure: the period the figure is for (asked for by the presenter, not in the pack). */
  tag?: string
  stats: Stat[]
  /** The words under the figure, where a card has one figure. */
  line?: string
  bold?: string
}

/** data.json → cards, in the deck's order: the top row, then the bottom row */
export const CARDS: LinkCard[] = [
  {
    key: 'pilots',
    label: "ENOUGH OF PILOTS",
    thumb: 'thumb-paper-plane.jpg',
    tape: 'flame',
    tilt: -0.8,
    tag: 'Monthly',
    stats: [
      { value: "80k → 800K+", tone: 'flame' },
    ],
    line: "Of Voice calls across customer lifecycle from Sales to Service to Collection done by AI",
    bold: "customer lifecycle from Sales to Service to Collection done by AI",
  },
  {
    key: 'composite',
    label: "COMPOSITE AI, IN ONE PIPELINE",
    thumb: 'thumb-puzzle.jpg',
    tape: 'navy',
    tilt: 0.8,
    sub: "One of our use-cases: Bank Statement",
    stats: [
      { value: "9,000+", tone: 'flame', line: "features GenAI extracts", bold: "features" },
      { value: "3x", tone: 'navy', line: "risk-score lift from ML", bold: "risk-score lift" },
      { value: "Agent", tone: 'azure', line: "puts both to work" },
    ],
  },
  {
    key: 'open',
    label: "OPEN WEIGHT MODELS",
    thumb: 'thumb-padlock.jpg',
    tape: 'navy',
    tilt: -0.8,
    stats: [
      { value: "13% → 64%", tone: 'navy', line: "of our tokens run on open-weight models", bold: "of our tokens" },
      { value: "$1.48 → $0.64", tone: 'flame', line: "cost per million tokens", bold: "cost" },
    ],
  },
  {
    key: 'agentic',
    label: "AGENTIC WORKFLOWS",
    thumb: 'thumb-kite.jpg',
    tape: 'navy',
    tilt: 0.8,
    stats: [
      { value: "623", tone: 'navy' },
    ],
    line: "agents at work, built by our own people. A person still decides.",
    bold: "agents at work",
  },
  {
    key: 'saas',
    label: "AI RESHAPES SAAS",
    thumb: 'thumb-building-blocks.jpg',
    tape: 'azure',
    tilt: -0.8,
    stats: [
      { value: "277", tone: 'navy' },
    ],
    line: "apps built in-house by 634 employees who had never coded.",
    bold: "apps built in-house",
  },
  {
    key: 'indic',
    label: "SOVEREIGN AND INDIC AI",
    thumb: 'thumb-grandmother-phone.jpg',
    tape: 'flame',
    tilt: 0.8,
    tag: 'Monthly',
    stats: [
      { value: "3.62 lakh", tone: 'flame' },
    ],
    line: "customers hear from our own voice platform in eight regional languages.",
    bold: "customers hear from our own voice platform",
  },
]

/** data.json → footnote (text.json t04) */
export const FOOTNOTE = "Source: Piramal internal data. Open-weight share and token cost compare the latest quarter with two years back."

/**
 * Slide 16's board, which this slide answers: the eight themes as they sat there.
 * Copied from exports/_rig/keynote-src/pack/16 (data.json → themes[].name and cardRect;
 * images.json → placements[0].unrotated.centre and rotation), the same values scenes/s16/data.ts holds.
 * `card` is the key of the card on THIS slide that the picture travels to; the two themes the
 * company has no card for (the power wall, the security race) have none: they step back and leave.
 */
export interface WorldTheme {
  name: string
  thumb: string
  /** data.json (16) → cardRect, [x, y, w, h] in fractions of the slide */
  rect: [number, number, number, number]
  /** images.json (16) → unrotated.centre of the round picture, fractions of the slide */
  centre: [number, number]
  tilt: number
  card: string | null
}

export const WORLD: WorldTheme[] = [
  { name: 'Enough Of Pilots', thumb: 'thumb-paper-plane.jpg', rect: [0.068, 0.289, 0.26, 0.178], centre: [0.1156, 0.3838], tilt: -2, card: 'pilots' },
  { name: 'Composite AI', thumb: 'thumb-puzzle.jpg', rect: [0.369, 0.279, 0.262, 0.176], centre: [0.417, 0.3615], tilt: 1.5, card: 'composite' },
  { name: 'Open Weight Models Catching Up', thumb: 'thumb-padlock.jpg', rect: [0.678, 0.298, 0.263, 0.205], centre: [0.7268, 0.3952], tilt: 2, card: 'open' },
  { name: 'Agentic Workflows', thumb: 'thumb-kite.jpg', rect: [0.045, 0.519, 0.261, 0.178], centre: [0.0931, 0.6028], tilt: 2, card: 'agentic' },
  { name: 'Ai Reshapes SAAS', thumb: 'thumb-building-blocks.jpg', rect: [0.071, 0.73, 0.262, 0.181], centre: [0.1193, 0.8238], tilt: -2, card: 'saas' },
  { name: 'Compute Hits A Power Wall', thumb: 'thumb-pylon.jpg', rect: [0.369, 0.751, 0.262, 0.181], centre: [0.417, 0.8465], tilt: -1.5, card: null },
  { name: 'Sovereign & Indic AI Enter Adolescence', thumb: 'thumb-grandmother-phone.jpg', rect: [0.67, 0.737, 0.262, 0.178], centre: [0.7193, 0.8202], tilt: 2, card: 'indic' },
  { name: 'AI Security Arms Race', thumb: 'thumb-vault.jpg', rect: [0.692, 0.53, 0.262, 0.172], centre: [0.7403, 0.6199], tilt: -1.5, card: null },
]

/** The round pictures on slide 16: 6.9u across (images.json (16) → unrotated.w = 0.069), never over their 202 px. */
export const WORLD_THUMB_U = 6.9
export const THUMB_PX = 202
