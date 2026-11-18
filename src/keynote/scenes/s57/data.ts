/**
 * Slide 57: every word and number is copied from exports/_rig/keynote-src/pack/57
 * (text.json / data.json).
 */

/** data.json → charts[0] "tokens" */
export const TOKENS_TITLE = 'Tokens (bn) processed Quarter on Quarter'
export const QUARTERS = ['FY25-Q3', 'FY25-Q4', 'FY26-Q1', 'FY26-Q2', 'FY26-Q3', 'FY26-Q4', 'FY27-Q1', 'FY27-Q2']
export const TOKENS = [23, 32, 63, 85, 119, 195, 320, 476]

/** data.json → charts[1] "cost" */
export const COST_TITLE = 'Cost per million tokens'
export const COST = [1.19, 1.16, 1.48, 0.84, 0.57, 0.71, 0.56, 0.64]
export const COST_PRINTED = ['$1.19', '$1.16', '$1.48', '$0.84', '$0.57', '$0.71', '$0.56', '$0.64']

/** data.json → stats (t38 … t43). `sub` is printed with an arrow between its two halves. */
export const STATS = [
  { key: 'usage', icon: 'layers', line: 'Increase in tokens processed per quarter', sub: ['23 bn', '476 bn'] as string[] },
  { key: 'cost', icon: 'arrowDown', line: 'Reduction in Cost per million tokens', sub: ['$1.19', '$0.64'] as string[] },
  { key: 'saved', icon: 'rupee', line: 'API spend avoided in 5 quarters*', sub: ['vs. paying FY25 unit cost'] as string[] },
] as const

/** t44 */
export const FOOTNOTE =
  'Cost per million = external API spend ÷ all tokens; excludes in-house GPU infrastructure cost. *Illustrative: FY26-Q2 to FY27-Q2 volumes priced at FY25-Q3 unit cost ($1.19/M), at each quarter’s USD/INR rate.'

/* ---- the layout of the token chart, in --u (shared by the DOM and the three.js tiles) ---- */
/** the plot's left edge and width; eight slots */
export const PLOT_X = 6.2
export const PLOT_W = 40.7
export const SLOT = PLOT_W / TOKENS.length
/** the baseline */
export const BASE_Y = 34.7
/** one full block stands for this many billion tokens (the top row of a bar is cut to the remainder: tokens.ts) */
export const PER_TILE = 2
/** tiles across a bar; the pitch of the grid */
export const COLS = 5
export const PITCH_X = 0.47
export const PITCH_Y = 0.297
/** a bar's height in --u, exact to its value */
export const barH = (v: number) => (v / PER_TILE / COLS) * PITCH_Y
export const barX = (i: number) => PLOT_X + SLOT * (i + 0.5)
export const BAR_W = COLS * PITCH_X - 0.06

/** while usage has the stage to itself: how far right of their final place the token chart and its figure stand, in --u */
export const CENTRE = 23.45
export const STAT_CENTRE = 31.2
