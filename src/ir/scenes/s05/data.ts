/**
 * /ir slide 05: every word and number, copied from exports/_rig/ir-src/deck-text.md and from
 * deck.pptx (python-pptx: the chart objects' own values and number formats).
 *
 * What the page PRINTS and what the file holds differ in precision: the charts' data labels are
 * formatted 0.0 (bars) and 0.0% (line), and the category axis is a date formatted mmm-yy. The
 * scene draws every height from the exact value and prints the label as the page prints it.
 */

export interface Result {
  beat: string
  n: number
  /** the deck's sentence, whole */
  text: string
  /** the figure inside it (an exact substring): it is set large and counts */
  figure: string
  count: { to: number; prefix?: string; suffix?: string }
}

export const RESULTS: Result[] = [
  { beat: 'productivity', n: 1, text: 'Improved productivity by ~30%', figure: '~30%', count: { to: 30, prefix: '~', suffix: '%' } },
  { beat: 'risk', n: 2, text: 'Reduced credit risk by 50%', figure: '50%', count: { to: 50, suffix: '%' } },
  {
    beat: 'new',
    n: 3,
    text: 'Created new lines of businesses that disburse ~₹4,000 Cr every quarter',
    figure: '~₹4,000 Cr',
    count: { to: 4000, prefix: '~₹', suffix: ' Cr' },
  },
]

export interface Productivity {
  title: string
  unit: string
  /**
   * deck-text.md: "trailing 12 months, three years ending Sep-24, Sep-25, Sep-26". (The chart object's
   * categories are dates of 1 October formatted mmm-yy, so the page prints Oct-24 / Oct-25 / Oct-26:
   * the owner to confirm; to follow the page, change these two arrays.)
   */
  labels: string[]
  /** the chart object's values, exact */
  values: number[]
  /** the callout: "<pct> yoy growth, with AI driving half the uplift" */
  pct: number
  growth: string
  ai: string
  rest: string
}

export const PRODUCTIVITY: Productivity[] = [
  {
    title: 'Monthly disb. per employee',
    unit: '₹ lakh',
    labels: ['Sep-24', 'Sep-25', 'Sep-26'],
    values: [18.28, 20.69, 27.49],
    pct: 33,
    growth: 'yoy growth, with',
    ai: 'AI driving half',
    rest: 'the uplift',
  },
  {
    title: 'AUM per employee',
    unit: '₹ Cr',
    labels: ['Sep-24', 'Sep-25', 'Sep-26'],
    values: [3.45, 4.1, 5.05],
    pct: 23,
    growth: 'yoy growth, with',
    ai: 'AI driving half',
    rest: 'the uplift',
  },
]

/** The word on the lit half of the uplift: the callout's own "AI". */
export const AI = 'AI'

export const RISK = {
  title: '90+ DPD for Retail unsecured',
  quarters: ['Q2', 'Q3', 'Q4', 'Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2'],
  /** the chart's second category level: FY25 from point 0, FY26 from 3, FY27 from 7 */
  groups: [
    { from: 0, to: 2, text: 'FY25' },
    { from: 3, to: 6, text: 'FY26' },
    { from: 7, to: 8, text: 'FY27' },
  ],
  /** the chart object's values (fractions x 100), exact */
  values: [1.65, 1.91, 1.85, 1.58, 1.34, 1.21, 0.9, 0.88, 0.86],
}

export const NEW_LINES = {
  text: 'Driving efficiencies in existing businesses while unlocking new business opportunities like:',
  navy: ['existing businesses'],
  flame: ['new business opportunities'],
  lines: ['Digital lending', 'Cross-sell'],
}

export const QUOTE = {
  text: "The internet wasn't just another technology. It fundamentally changed how businesses operated.",
  close: '“ GenAI is that foundational shift ”',
}

/** The data labels as the page prints them (format 0.0, round half up: 5.05 is printed 5.1). */
export const PRODUCTIVITY_TEXTS = [
  ['18.3', '20.7', '27.5'],
  ['3.5', '4.1', '5.1'],
]
/**
 * The line's data labels as the page prints them (format 0.0%), EXCEPT the two ends, which carry the
 * claim "50%" and are printed with the file's own two decimals (deck-text.md: 1.65%, 0.86%; the page
 * prints 1.7% and 0.9%).
 */
export const RISK_TEXTS = ['1.65%', '1.9%', '1.9%', '1.6%', '1.3%', '1.2%', '0.9%', '0.9%', '0.86%']
