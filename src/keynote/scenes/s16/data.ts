/**
 * Slide 16 · the words, pictures and rectangles of the deck, copied from
 * exports/_rig/keynote-src/pack/16/ (text.json, data.json, images.json). Nothing here is retyped.
 * The cards' words are outlines in the PDF (read by eye in the pack, checked against the page).
 *
 * Two lines are NOT the deck's any more, by the presenter's word (see PROGRESS.md):
 *   card 18 "Composite AI": the deck's "ML meets GenAI · Physical AI · JEV" is now "ML meets GenAI";
 *   card 21 "Ai Reshapes SAAS": the deck's "$285 bn left software in 2 weeks" is now a line with no
 *   figure, made of the words of slide 21's own headline (pack/21/text.json → t02).
 */

/** text.json → t02: the flame word of the headline. */
export const FLAME = ['world']

/** data.json → question (text.json → t03, t04): the underlined, italic words are `mark`. */
export const QUESTION = {
  from: { label: 'FROM:', text: 'What can AI do?', mark: 'do' },
  to: { label: 'TO:', text: 'How can AI create value?', mark: 'create value' },
}

export interface Theme {
  /** The slide this card opens (17 to 24). */
  slide: number
  name: string
  line: string
  /** data.json → boldPart: the navy bold words of the line. */
  bold: string[]
  /** The blue italic words of the line, as the page shows them (public/keynote/pages/16.jpg). */
  blue: string[]
  /** images.json → the card's round picture (202 x 202). */
  picture: string
  /** data.json → cardRect: the tilted card's box, [x, y, w, h] in fractions of the slide. */
  rect: [number, number, number, number]
  /** images.json → placements[0].rotation: the card's tilt, in degrees. */
  tilt: number
}

/** data.json → themes[], in the order of the slides they open (17 … 24). */
export const THEMES: Theme[] = [
  {
    slide: 17,
    name: 'Enough Of Pilots',
    line: 'From experimentation to ROI',
    bold: ['to ROI'],
    blue: [],
    picture: 'thumb-paper-plane.jpg',
    rect: [0.068, 0.289, 0.26, 0.178],
    tilt: -2,
  },
  {
    slide: 18,
    name: 'Composite AI',
    line: 'ML meets GenAI',
    bold: ['ML meets GenAI'],
    blue: [],
    picture: 'thumb-puzzle.jpg',
    rect: [0.369, 0.279, 0.262, 0.176],
    tilt: 1.5,
  },
  {
    slide: 19,
    name: 'Open Weight Models Catching Up',
    line: 'Lower cost per token, more SLMs',
    bold: ['Lower cost per token'],
    blue: [],
    picture: 'thumb-padlock.jpg',
    rect: [0.678, 0.298, 0.263, 0.205],
    tilt: 2,
  },
  {
    slide: 20,
    name: 'Agentic Workflows',
    line: 'Slow but steady enterprise adoption',
    bold: ['enterprise adoption'],
    blue: [],
    picture: 'thumb-kite.jpg',
    rect: [0.045, 0.519, 0.261, 0.178],
    tilt: 2,
  },
  {
    slide: 21,
    name: 'Ai Reshapes SAAS',
    line: 'Companies build what they used to buy',
    bold: ['build'],
    blue: [],
    picture: 'thumb-building-blocks.jpg',
    rect: [0.071, 0.73, 0.262, 0.181],
    tilt: -2,
  },
  {
    slide: 22,
    name: 'Compute Hits A Power Wall',
    line: 'Energy, not chips, is the limit',
    bold: ['is the limit'],
    blue: [],
    picture: 'thumb-pylon.jpg',
    rect: [0.369, 0.751, 0.262, 0.181],
    tilt: -1.5,
  },
  {
    slide: 23,
    name: 'Sovereign & Indic AI Enter Adolescence',
    line: 'Sarvam, BharatGen, Gnani',
    bold: [],
    blue: ['Sarvam'],
    picture: 'thumb-grandmother-phone.jpg',
    rect: [0.67, 0.737, 0.262, 0.178],
    tilt: 2,
  },
  {
    slide: 24,
    name: 'AI Security Arms Race',
    line: 'Cybersecurity in the boardroom',
    bold: ['Cybersecurity'],
    blue: [],
    picture: 'thumb-vault.jpg',
    rect: [0.692, 0.53, 0.262, 0.172],
    tilt: -1.5,
  },
]

/**
 * The order the cards arrive in: round the middle, clockwise from the top left (the slides they
 * open). The middle (the question) is there first.
 */
export const ROUND = [17, 18, 19, 24, 23, 22, 21, 20]

/** The round pictures are 202 px wide (images.json → px): never drawn larger than that. */
export const THUMB_PX = 202
