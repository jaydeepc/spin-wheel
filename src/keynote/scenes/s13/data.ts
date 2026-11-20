/**
 * Slide 13 · the pack's values (exports/_rig/keynote-src/pack/13), copied, not retyped.
 * The deck's own wording is kept ("Kirana owners ,", "SMEs owners", "constitutes 75% bank txns").
 *
 * ONE CHANGE asked for by the presenter after the deck: the deck's "Thin document trail" reads
 * "Thin document" (the card's caption and the first reason of "Hard to underwrite"), and that
 * card opens into a panel of his own examples (THIN, below).
 */

/** text.json t01: the span "Bharat" is the deck's flame. */
export const FLAME = ['Bharat']

/** text.json t02, t03 */
export const BHARAT = {
  title: 'BHARAT',
  line: 'Kirana owners , Tailors, Small transporters, Textiles owners, Small dairy operator etc.',
}

/** text.json t04, t17 */
export const LIFE_KICKER = 'WHAT LIFE LOOKS LIKE'
export const PROBLEMS_KICKER = 'PROBLEMS FOR AI TO SOLVE'

export interface Life {
  /** images.json → pictures[].name */
  file: string
  /** images.json → px */
  px: [number, number]
  /** text.json t05, t07, t09, t11, t13, t15 */
  caption: string
  /** text.json t06, t08, t10, t12, t14, t16: the deck's own two lines */
  lines: [string, string]
  /** Where it floats before the grid forms: the photograph's middle on the stage (--u), its size against the grid's, its tilt (degrees), its turn in depth (degrees). */
  float: { x: number; y: number; s: number; tilt: number; turn: number }
}

/**
 * In the deck's order: the grid's first row, then its second. A photograph is 17.3u wide in
 * the grid (332 px on a 1920 stage); the largest floating one is 1.25 times that (415 px): no
 * file (500 to 527 px wide) is ever shown beyond its own pixels there.
 */
export const LIFE: Life[] = [
  { file: 'photo-kirana-owner.jpg', px: [527, 384], caption: 'Self employed dominated', lines: ['Bharat has more SMEs', 'owners and less salaried'], float: { x: 16.5, y: 26.6, s: 1.14, tilt: -3, turn: 7 } },
  { file: 'photo-pot-trader.jpg', px: [500, 333], caption: 'Many small incomes', lines: ['Not one formal income, but', 'several sources'], float: { x: 40.5, y: 23.2, s: 0.8, tilt: 2, turn: 3 } },
  { file: 'photo-tailor.jpg', px: [500, 333], caption: 'Cash is significant', lines: ['Low turnover,', 'no ITR or GST'], float: { x: 64.5, y: 25.6, s: 1.24, tilt: -1.5, turn: -4 } },
  { file: 'photo-dairy-owner.jpg', px: [527, 351], caption: 'Thin Documents', lines: ['Incomplete & single name,', 'weak 1/2 line addresses'], float: { x: 24.5, y: 41.6, s: 1.02, tilt: 2.5, turn: 5 } },
  { file: 'photo-whatsapp-voice.jpg', px: [523, 349], caption: 'Voice & WhatsApp first', lines: ['Speaks their own language,', 'WhatsApp is a way of life'], float: { x: 50, y: 42.2, s: 0.86, tilt: -2.5, turn: -2 } },
  { file: 'photo-upi-stall.jpg', px: [523, 349], caption: 'UPI everywhere', lines: ['Small, UPI payments', 'constitutes 75% bank txns'], float: { x: 80.5, y: 40.6, s: 1.25, tilt: 3, turn: -8 } },
]

export interface Problem {
  key: 'underwrite' | 'serve' | 'voice'
  /** text.json t18, t20, t22 */
  title: string
  /** text.json t19, t21, t23: the deck's own lines */
  lines: string[]
  /** The photograph (index into LIFE) each line is drawn from. */
  from: number[]
}

export const PROBLEMS: Problem[] = [
  { key: 'underwrite', title: 'Hard to underwrite', lines: ['Thin document,', 'many small incomes,', 'cash is still significant'], from: [3, 1, 2] },
  { key: 'serve', title: 'Costlier to serve', lines: ['Incomplete name and addresses,', 'needs assessment of stable income with', 'capability to read and understand UPI'], from: [3, 0, 5] },
  { key: 'voice', title: 'Voice-led', lines: ['Customers like to talk, not type', 'We understand them better by listening'], from: [4, 4] },
]

/** The card (index into LIFE) that opens into the panel of the last beat. */
export const THIN_CARD = 3

/**
 * The presenter's own examples for "Thin document", exactly as he gave them: every letter and
 * every capital is his. Nothing is added to them.
 */
export const THIN = {
  names: {
    title: 'Single name',
    items: ['NEETU', 'JAIGOPAL', 'HARIOM', 'ESHWAR', 'MOHILAL', 'SATHISHKUMAR', 'SUDINARAJ'],
  },
  addresses: {
    title: 'Weak address',
    caption: 'No flat name, no street name, very generic',
    items: [
      'Savithri Nilaya, Bank Colony Chitradurga CHITRADURGA',
      'Gandhi market Sonipat Charnjeet so shamlal HARYANA',
      'S/O Ramesh Kumar MUKTSAR Muktsar Punjab',
    ],
  },
}

/**
 * The labels of the forms the examples are set on (ours, not the presenter's): the field a
 * name fills and the one it leaves empty; the address line and the fields nothing was written in.
 */
export const FORM = {
  name: 'Name',
  surname: 'Surname',
  address: 'Address',
  missing: ['Flat', 'Street', 'Landmark', 'PIN'],
}

/* ---- the layout, in --u (scene.css has the same numbers) ---- */
/** A card of the grid. */
export const CARD = { w: 18, h: 15.55, gapX: 1.9, gapY: 0.9 }
/** How far right the grid stands while it has the stage to itself. */
export const SHIFT = 16.9
