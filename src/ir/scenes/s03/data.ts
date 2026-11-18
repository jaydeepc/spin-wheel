/**
 * /ir slide 03 · every word and number, copied from exports/_rig/ir-src/deck-text.md (SLIDE 3).
 * Which "Q2" pair belongs to which row is settled by the page (p-3.jpg): it is the file's order.
 */

export interface Measure {
  beat: string
  n: number
  /** the row's name; `bold` is the part the deck sets in Bold where the rest is Regular */
  name: string
  bold?: string
  sub?: string
  decimals: number
  /** column "FY26" */
  fy26: number
  /** column "FY27 Target", printed with "~" */
  target: number
  /** "Q2 FY26: …" under the FY26 figure */
  q2fy26: number
  /** "Q2 FY27: …" under the target */
  q2fy27: number
  /** the ends of this row's own scale (not printed): chosen so that its four readings stand apart */
  min: number
  max: number
}

/** the deck's two column heads; `fy27` is the lane's own short name, cut from "FY27 Target" */
export const HEAD = { fy26: 'FY26', target: 'FY27 Target', fy27: 'FY27' }

export const MEASURES: Measure[] = [
  { beat: 'aum', n: 1, name: 'Total AUM - YoY growth', decimals: 0, fy26: 25, target: 25, q2fy26: 22, q2fy27: 24, min: 20, max: 26 },
  { beat: 'pat', n: 2, name: 'Consol. PAT - YoY growth', decimals: 0, fy26: 210, target: 50, q2fy26: 101, q2fy27: 67, min: 0, max: 215 },
  { beat: 'roaum', n: 3, name: 'RoAUM, Annualized', bold: 'RoAUM', sub: 'Exit quarter (Q4)', decimals: 1, fy26: 2.1, target: 2.5, q2fy26: 1.7, q2fy27: 2.0, min: 1.5, max: 2.6 },
]

/** The banner: "Expect to reach 10% ROE by Q4 FY27" / "Q2 FY27: 7.7%" */
export const ROE = {
  text: 'Expect to reach 10% ROE by Q4 FY27',
  bold: ['10% ROE'],
  target: 10,
  q2fy27: 7.7,
  min: 6,
  max: 10.6,
}

/** the tracks' lengths, in --u */
export const TRACK_W = 40
export const ROE_W = 34
