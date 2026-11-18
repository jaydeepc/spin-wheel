/**
 * Slide 06 · the pack's values, copied (never retyped) from exports/_rig/keynote-src/pack/06/.
 * Each block says where it came from.
 */

/* ------------------------------------------------------------------ chart 1: the AUM race */

/** data.json → charts[0].title */
export const RACE_TITLE = 'We are one of the fastest among retail NBFCs* to grow AUM from ₹20k Cr to ₹100k Cr…'
/** data.json → charts[0].yAxis.label, .ticks ; text.json t58 is the "-" the deck prints at zero */
export const RACE_Y_LABEL = 'AUM ₹ k Cr'
export const RACE_Y_TICKS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
export const RACE_Y_ZERO = '-'
/** data.json → charts[0].xAxis.label, .ticks */
export const RACE_X_LABEL = 'Years'
export const RACE_X_TICKS = ['Y0', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8', 'Y9', 'Y10', 'Y11', 'Y12']
/** text.json t06: the word under the logo that labels the orange curve */
export const RACE_RETAIL = 'Retail'
/** data.json → charts[0].series[].label, by marker number (text.json t49, t53, t55, t57) */
export const RACE_LABELS: Record<number, string> = {
  1: 'Piramal Finance in 4.5 yrs',
  2: 'NBFC A in ~6 yrs',
  3: 'NBFC B in ~8 yrs',
  4: 'NBFC C in ~10 yrs',
}
/** Where the deck sets each numbered marker on its finish line, as AUM on the chart's own scale (text.json t48, t52, t54, t56 → rect). */
export const RACE_MARKER_AT: Record<number, number> = { 1: 32.6, 2: 23.6, 3: 15.3, 4: 6.9 }

/**
 * THE CURVES. The deck prints no points: these are the paths of pack/06/vector/chart-aum-race.svg,
 * as they are (PDF points of the slide, y up): x0, y0, then six numbers per cubic segment
 * (c1x, c1y, c2x, c2y, x, y). One knot a year. Seven curves: ours and the six peers of the footnote.
 * Three of the peers are the ones the deck labels (their finish lines are in the SVG at
 * x = 230.04, 293.4, 326.52; ours at 206.28).
 */
export interface RaceCurve {
  who: 'us' | 'peer'
  /** The deck's numbered marker, where it has one. */
  marker?: number
  pts: number[]
}
/** The SVG's frame, measured from it: Y0 at x = 99, one year = 23.58 pt, AUM 0 at y = 72.243 (the axis), AUM 100 at y = 364.64 (the top of the finish lines). */
export const RACE_FRAME = { x0: 99, perYear: 23.58, y0: 72.243, y100: 364.64 }
export const RACE_CURVES: RaceCurve[] = [
  // NBFC A
  { ...{ who: 'peer', marker: 2 }, pts: [99, 124.1, 106.68, 130.34, 114.36, 135.72, 122.04, 142.82, 129.96, 150.1, 137.88, 157.45, 145.8, 167.31, 153.72, 177.14, 161.64, 188.33, 169.56, 201.88, 177.48, 215.45, 185.4, 230.03, 193.32, 248.69, 201, 267.46, 208.68, 286.87, 216.36, 314.22, 224.28, 341.2, 236.16, 395.24, 240.12, 411.45] },
  // NBFC C
  { ...{ who: 'peer', marker: 4 }, pts: [99, 129.86, 106.68, 134.42, 114.36, 140.23, 122.04, 143.54, 129.96, 146.63, 137.88, 146.37, 145.8, 149.3, 153.72, 152.34, 161.64, 157.18, 169.56, 161.55, 177.48, 165.83, 185.4, 168.86, 193.32, 175.23, 201, 181.77, 208.68, 189.36, 216.36, 200.44, 224.28, 211.27, 232.2, 229.52, 240.12, 240.77, 248.04, 252.4, 255.96, 259.39, 263.88, 268.85, 271.8, 278.12, 279.72, 289.14, 287.64, 296.94, 293.8, 303, 305.24, 301.89, 311.4, 315.66, 319.08, 333.29, 330.6, 388.28, 334.44, 402.81] },
  // an unlabelled peer
  { ...{ who: 'peer' }, pts: [99, 129.86, 106.68, 133.46, 114.36, 136.06, 122.04, 140.66, 129.96, 145.39, 137.88, 151.63, 145.8, 157.94, 153.72, 164.13, 161.64, 172.76, 169.56, 178.11, 177.48, 183.59, 185.4, 183.63, 193.32, 190.35, 201, 196.9, 208.68, 211.51, 216.36, 217.72, 224.28, 224.04, 232.2, 223.18, 240.12, 227.8, 248.04, 232.51, 255.96, 235.98, 263.88, 245.81, 271.8, 255.31, 279.72, 275.91, 287.64, 285.42, 295.56, 295.24, 303.48, 292.15, 311.4, 303.42, 319.08, 314.38, 326.76, 339.21, 334.44, 351.67, 342.36, 364.19, 354.24, 373.88, 358.2, 378.32] },
  // an unlabelled peer
  { ...{ who: 'peer' }, pts: [99, 129.86, 106.68, 136.58, 114.36, 143.91, 122.04, 150.02, 129.96, 156.16, 137.88, 162.53, 145.8, 166.59, 153.72, 170.71, 161.64, 171.55, 169.56, 174.51, 177.48, 177.33, 185.4, 179.79, 193.32, 183.87, 201, 188.14, 208.68, 192.99, 216.36, 199.71, 224.28, 206.24, 232.2, 213.92, 240.12, 223.48, 248.04, 233.11, 255.96, 249.31, 263.88, 257.33, 271.8, 265.42, 279.72, 270.81, 287.64, 271.73, 295.56, 272.45, 303.48, 264.5, 311.4, 263.09, 319.08, 261.65, 326.76, 254.45, 334.44, 263.09, 342.36, 271.85, 350.28, 297.17, 358.2, 315.66, 366.12, 334.14, 378, 364.28, 381.96, 374] },
  // NBFC B
  { ...{ who: 'peer', marker: 3 }, pts: [99, 124.82, 106.68, 131.78, 114.36, 138.63, 122.04, 145.7, 129.96, 152.56, 137.88, 159.88, 145.8, 166.59, 153.72, 173.57, 161.64, 179.82, 169.56, 186.75, 177.48, 193.51, 185.4, 196.87, 193.32, 207.64, 201, 218.28, 208.68, 242.99, 216.36, 250.85, 224.15, 258.77, 232.33, 245.81, 240.12, 254.91, 248.04, 264.48, 255.96, 291.03, 263.88, 307.02, 271.8, 322.96, 279.72, 331.92, 287.64, 350.95, 295.56, 369.87, 307.44, 409.17, 311.4, 420.81] },
  // Piramal Finance (Retail), the orange curve
  { ...{ who: 'us', marker: 1 }, pts: [98.64, 135.98, 106.56, 146.3, 114.48, 154.09, 122.4, 166.95, 130.32, 179.78, 138.24, 197.22, 146.16, 213.04, 153.84, 228.9, 161.52, 243.48, 169.2, 262.01, 177.12, 280.46, 185.04, 299.47, 192.96, 323.95, 200.88, 348.65, 212.76, 395.36, 216.72, 409.65] },
  // an unlabelled peer (it ends just under 100)
  { ...{ who: 'peer' }, pts: [99, 125.54, 106.68, 129.38, 114.36, 130.82, 122.04, 137.06, 129.96, 143.3, 137.88, 156.74, 145.8, 162.99, 153.72, 169.62, 161.64, 171.66, 169.56, 175.23, 177.48, 178.59, 185.4, 179.07, 193.32, 183.87, 201, 188.67, 208.68, 197.79, 216.36, 204.04, 224.28, 210.54, 232.2, 212.04, 240.12, 222.04, 248.04, 231.81, 255.96, 256.25, 263.88, 263.09, 271.8, 269.57, 279.72, 255.89, 287.64, 262.71, 295.56, 269.81, 303.48, 296.99, 311.4, 303.42, 318.78, 309.9, 327.06, 292.62, 334.44, 301.82, 342.36, 311.41, 354.24, 350.59, 358.2, 360.32] },
]

/* ------------------------------------------------------------------ chart 2: opex to AUM */

/** data.json → charts[1].title */
export const OPEX_TITLE = '…while reducing our opex-to-AUM by ~300 bps over last 14 quarters, and…'
/** data.json → charts[1].quarters (the axis runs on to Q4 FY27: "axisRunsTo") */
export const OPEX_QUARTERS = ['Q4 FY23', 'Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24', 'Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26', 'Q2 FY26', 'Q3 FY26', 'Q4 FY26', 'Q1 FY27', 'Q2 FY27', 'Q3 FY27', 'Q4 FY27']
/** data.json → charts[1].valuesPct */
export const OPEX_VALUES = [6.5, 5.8, 5.8, 5.5, 5.3, 4.9, 4.7, 4.5, 4.3, 4.2, 3.9, 3.8, 3.59, 3.54, 3.48]
/** text.json t14 … t21: the figures as the deck prints them */
export const OPEX_TEXTS = ['6.5%', '5.8%', '5.8%', '5.5%', '5.3%', '4.9%', '4.7%', '4.5%', '4.3%', '4.2%', '3.9%', '3.8%', '3.59%', '3.54%', '3.48%']
/** data.json → charts[1].yAxis.ticksPct. The deck prints all sixteen at 0.75u; at the keynote's type floor every second one fits (see index.tsx). */
export const OPEX_TICKS = [3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75]
/** text.json t13: a tick as the deck prints it */
export const opexTick = (v: number) => `${v.toFixed(2)}%`
/** data.json → charts[1].annotations ; text.json t22, t23 */
export const OPEX_GOAL = 'Long range goal'
export const OPEX_GUIDANCE = '25 bps reduction in Opex guidance'
/**
 * The hatched band, measured from pack/06/vector/chart-opex-to-aum.svg (its two pattern rects
 * against the axis ticks): 3.50% to 4.00% from the axis' start to half way between Q1 and Q2
 * FY26, then 25 bps lower, 3.25% to 3.75%, to the axis' end.
 */
export const OPEX_BANDS = [
  { from: 3.5, to: 4.0, q0: -0.5, q1: 9.5 },
  { from: 3.25, to: 3.75, q0: 9.5, q1: 16.5 },
]

/* ------------------------------------------------------------------ chart 3: retail 90+ DPD */

/** data.json → charts[2].title */
export const DPD_TITLE = '…keeping a tight control on retail 90+ DPD'
/** data.json → charts[2].quarters */
export const DPD_QUARTERS = ['Q1 FY23', 'Q2 FY23', 'Q3 FY23', 'Q4 FY23', 'Q1 FY24', 'Q2 FY24', 'Q3 FY24', 'Q4 FY24', 'Q1 FY25', 'Q2 FY25', 'Q3 FY25', 'Q4 FY25', 'Q1 FY26', 'Q2 FY26', 'Q3 FY26', 'Q4 FY26', 'Q1 FY27', 'Q2 FY27']
/** data.json → charts[2].valuesPct */
export const DPD_VALUES = [0.7, 1.1, 1.1, 0.7, 0.8, 0.7, 0.6, 0.6, 0.6, 0.7, 0.8, 0.8, 0.8, 0.8, 0.8, 0.6, 0.7, 0.7]
/** text.json t75 … t79 */
export const DPD_TEXTS = ['0.7%', '1.1%', '1.1%', '0.7%', '0.8%', '0.7%', '0.6%', '0.6%', '0.6%', '0.7%', '0.8%', '0.8%', '0.8%', '0.8%', '0.8%', '0.6%', '0.7%', '0.7%']

/** data.json → footnote */
export const FOOTNOTE = 'Source : Company data; (*) 6 peers across Diversified and Vehicle financiers'
