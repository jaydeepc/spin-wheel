/**
 * /ir slide 04 · every word and number, copied from exports/_rig/ir-src/deck-text.md, from the
 * chart objects of deck.pptx (read with python-pptx: ppt/charts/chart1…4.xml, full precision) and,
 * for the line chart only, from the text of its preview (ppt/media/image7.emf) checked against
 * the page picture p-4.jpg. Nothing here is estimated.
 */

/* ---- the words ---- */

/** TextBox 15: "Growth business RoAUM, annualized" (the page sets ", annualized" small and light) */
export const SUB_BOLD = 'Growth business RoAUM'
export const SUB_LIGHT = ', annualized'
/** TextBox 17: "Excluding POCI# recovery related profits" (the # is a superscript on the page) */
export const EXCL = ['Excluding POCI', '#', ' recovery related profits'] as const
/** Content Placeholder 46087: "Long range goal*" */
export const GOAL = ['Long range goal', '*'] as const
/** TextBox 29: "Q4 FY27 target as disclosed at end-FY26" (two lines on the page, broken after "as") */
export const TARGET_LINES = ['Q4 FY27 target as', 'disclosed at end-FY26'] as const
/** TextBox 27 */
export const NOTE_HEAD = 'Note:'
export const NOTE =
  '(*) Long range goals as disclosed in August 2023; (#) POCI (purchased or originated credit impaired) recoveries represent recoveries from the acquired stressed retail book from DHFL'

/* ---- the line chart (Object 9: a LINKED chart, so the file holds no values; these are the
        figures the page prints at each point, read from the preview's own text) ---- */

export const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'] as const

export interface Track {
  name: string
  /** the printed figure at each point, as a number: the point is drawn at this height */
  values: number[]
  /** the figure exactly as the page prints it */
  texts: string[]
}

export const TRACKS: Track[] = [
  { name: 'FY25', values: [1.1, 1.0, 1.1, 1.7], texts: ['1.1%', '1.0%', '1.1%', '1.7%'] },
  { name: 'FY26', values: [1.5, 1.6, 1.8, 2.1], texts: ['1.5%', '1.6%', '1.8%', '2.1%'] },
  { name: 'FY27', values: [1.8, 2.0], texts: ['1.8%', '2.0%'] },
]

/** the target's marker: at Q4, at 2.5% on the page's axis; printed "2.5%" */
export const TARGET = { quarter: 3, value: 2.5, text: '2.5%' }
/** the hatched band of the long range goal: between the axis figures 3.00% and 3.25% on the page */
export const GOAL_BAND = { from: 3.0, to: 3.25 }
/** the axis figures of the page that this scene rules (the page prints 0.00% to 3.25% in steps of 0.25%) */
export const TICKS = [
  { v: 1.0, text: '1.00%' },
  { v: 1.5, text: '1.50%' },
  { v: 2.0, text: '2.00%' },
  { v: 2.5, text: '2.50%' },
  { v: 3.0, text: '3.00%' },
]

/* ---- the four column charts (chart objects: exact values; the page prints one decimal) ---- */

export const PERIODS = ['FY25', 'FY26', 'H1FY26', 'H1FY27'] as const

export interface Term {
  key: 'nim' | 'opex' | 'credit' | 'roaum'
  /** the label on the page (TextBox 26, 28, 32, 34) */
  name: string
  /** the chart object's values, as fractions */
  values: number[]
  /** as the page prints them on the bars */
  texts: string[]
}

export const TERMS: Term[] = [
  // Chart 36 (beside "NIM")
  { key: 'nim', name: 'NIM', values: [0.0724933, 0.0692673, 0.0687, 0.0682], texts: ['7.2%', '6.9%', '6.9%', '6.8%'] },
  // Chart 10 (beside "Opex/AUM")
  { key: 'opex', name: 'Opex/AUM', values: [0.0424274145365269, 0.0356237091226314, 0.0374, 0.033], texts: ['4.2%', '3.6%', '3.7%', '3.3%'] },
  // Chart 40 (beside "Credit cost")
  { key: 'credit', name: 'Credit cost', values: [0.0158085081335338, 0.0153994565632524, 0.0154, 0.0158], texts: ['1.6%', '1.5%', '1.5%', '1.6%'] },
  // Chart 43 (beside "ROAUM")
  { key: 'roaum', name: 'ROAUM', values: [0.0142573391666161, 0.0182518536087966, 0.016, 0.0194], texts: ['1.4%', '1.8%', '1.6%', '1.9%'] },
]

/** TextBox 45 and 49, each with the page's green triangle: FY25 to FY26, H1FY26 to H1FY27 */
export const LIFTS = [
  { from: 0, to: 1, bps: 40, text: '+40bps' },
  { from: 2, to: 3, bps: 34, text: '+34bps' },
]
