/**
 * /ir slide 02 · every word and number, copied from exports/_rig/ir-src/deck-text.md (SLIDE 2).
 * Which sentences stand with which picture is settled by the page (p-2.jpg): the AUM picture
 * with the AUM sentences, the opex picture with the opex sentences.
 */

/* ---- AUM growth (the page's top half; deck-text "Right") ---- */
export const AUM = {
  /** Picture 4: last year's slide "We expect AUM growth momentum to sustain longer", 669 x 668, bottom 14.8% cropped by the deck */
  print: 'last-year-aum-growth.png',
  said: 'Last year, we guided Mar-26 AUM growth of 25% YoY and medium-term AUM growth of 20-25% CAGR',
  saidBold: ['25% YoY', '20-25% CAGR'],
  deliveredLanes: { mar: 'Mar-26', sep: 'Sep-26', total: 'Total AUM', growth: 'Growth AUM' },
  delivered: ['We ended Mar-26 with AUM growth of 25% YoY', 'Sep-26 Total AUM up 24% YoY and Growth AUM up 30% YoY'],
  /** the figures of the delivered sentences, set in the deck's green */
  deliveredGood: ['25% YoY', '24% YoY', '30% YoY'],
  /** "guided Mar-26 AUM growth of 25% YoY" */
  guided: 25,
  /** "medium-term AUM growth of 20-25% CAGR" */
  band: [20, 25] as const,
  /** "We ended Mar-26 with AUM growth of 25% YoY" */
  mar26: 25,
  /** "Sep-26 Total AUM up 24% YoY" */
  total: 24,
  /** "Growth AUM up 30% YoY" */
  growth: 30,
}

/* ---- Retail opex-to-AUM (the page's bottom half; deck-text "Left") ---- */
export const OPEX = {
  /** Picture 84: last year's slide "Revising Retail Opex-AUM outlook lower", 670 x 672, shown whole */
  print: 'last-year-opex-outlook.png',
  said: 'Last year, we lowered our Retail opex-to-AUM expectation range by 25 bps',
  saidBold: ['25 bps'],
  delivered: 'At 3.48%, Q2 FY27 retail opex-to-AUM is now below the lower end of the earlier guided range',
  deliveredGood: ['3.48%', 'below the lower end'],
  /** "At 3.48%, Q2 FY27 retail opex-to-AUM" */
  now: 3.48,
  /** "lowered … by 25 bps" */
  bps: 25,
  /**
   * WHERE THE TWO RANGES LIE on the gauge. The deck's words give "25 bps" and "below the lower end
   * of the earlier guided range"; the ends of the ranges themselves are not printed as text. They
   * are read off last year's slide shown beside the gauge (its hatched "Long range goal" band
   * between the 3.50% and 4.00% rules, and the lowered one between 3.25% and 3.75%). They are used
   * ONLY to place the bands; no figure of them is printed.
   */
  earlier: [3.5, 4.0] as const,
  lowered: [3.25, 3.75] as const,
}

/* ---- the gauges' scales, in --u inside a gauge 43.3u wide (one column of the slide) ---- */
export const GAUGE_W = 43.3

/** AUM growth, %: the plot runs from 18.5 at x = 9.6u to 34 at x = 43.3u (the ends are not printed) */
export const AUM_MIN = 18.5
export const AUM_X0 = 9.6
const AUM_K = (GAUGE_W - AUM_X0) / (34 - AUM_MIN)
export const ax = (v: number) => +(AUM_X0 + (v - AUM_MIN) * AUM_K).toFixed(3)

/** Opex to AUM, %: 3.20 at x = 0 to 4.05 at x = 43.3u (lower is to the left; the ends are not printed) */
export const OPEX_MIN = 3.2
export const OPEX_MAX = 4.05
const OPEX_K = GAUGE_W / (OPEX_MAX - OPEX_MIN)
export const ox = (v: number) => +((v - OPEX_MIN) * OPEX_K).toFixed(3)

/** The prints: their width while they are the hero of "said", and docked as a thumbnail afterwards (in --u). */
export const PRINTS = {
  /** 669 x 668, bottom 14.8% cropped by the deck: 669 x 569 is shown */
  aum: { big: 27, thumb: 11.6, ratio: '669 / 569' },
  /** 670 x 672, whole */
  opex: { big: 24.4, thumb: 10.4, ratio: '670 / 672' },
}
