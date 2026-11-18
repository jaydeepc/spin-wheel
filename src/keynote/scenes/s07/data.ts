/**
 * Slide 07 · the pack's values, copied (never retyped) from exports/_rig/keynote-src/pack/07/.
 * Each block says where it came from.
 */

/** data.json → charts[0].title */
export const TITLE = 'After delivering 210% YoY profit growth last year, we have guided for 50% growth in profits this year'

/** data.json → charts[0].series[].name (text.json t03, t04) */
export const LEGEND_PAT = 'Company PAT (₹ Cr)'
export const LEGEND_PBT = 'Growth PBT (₹ Cr)'

export interface Year {
  /** data.json → charts[0].categories */
  label: string
  /** data.json → series[0] "Growth PBT (₹ Cr)": values, valuesAsPrinted (the orange bars) */
  pbt: number
  pbtText: string
  /** data.json → series[1] "Company PAT (₹ Cr)": valuesAsPrinted (the grey pills above the bars) */
  patText: string
}
export const YEARS: Year[] = [
  { label: 'FY23', pbt: 355, pbtText: '355', patText: '9,969' },
  { label: 'FY24', pbt: 798, pbtText: '798', patText: '-1,684' },
  { label: 'FY25', pbt: 780, pbtText: '780', patText: '485' },
  { label: 'FY26', pbt: 1516, pbtText: '1,516', patText: '1,506' },
  { label: 'FY27P', pbt: 990, pbtText: '990', patText: '1,006' },
]

/** data.json → charts[0].guidance.label (text.json t15), .tag (t16) */
export const GUIDANCE = '2,200-2,300'
export const GUIDANCE_TAG = '<< Guidance*'
/** The range the label names, for the height of the dashed box (the deck draws its top at 2,300 on the bars' own scale). */
export const GUIDANCE_RANGE = [2200, 2300] as const
/**
 * data.json → charts[0].fy27pBarTag (text.json t19). AS THE DECK PRINTS IT: the tag beside the
 * solid FY27P bar reads "H1 FY26A" (the pack's notes: "possibly meant as H1 FY27"). Kept, and
 * flagged for the owner.
 */
export const H1_TAG = '<< H1 FY26A'

/**
 * data.json → charts[0].callouts (text.json t06, t14). The words are the deck's; they are broken into lines here.
 * `on` says which figure of the year the note belongs to: 'pat' sits over the grey pill, 'pbt' stands beside the
 * orange bar and points at its figure (the ~₹250 Cr note is about the 780 of Growth PBT: the owner's ruling).
 */
export const CALLOUTS: { at: number; on: 'pat' | 'pbt'; text: string; lines: string[] }[] = [
  { at: 0, on: 'pat', text: 'Includes exceptional gain of ₹ 8,066 Cr from PPL demerger', lines: ['Includes exceptional', 'gain of ₹ 8,066 Cr from', 'PPL demerger'] },
  { at: 2, on: 'pbt', text: '~₹250 Cr impact on profits due to retail fee amortization', lines: ['~₹250 Cr', 'impact on', 'profits due', 'to retail fee', 'amortization'] },
]

/** data.json → charts[0].underChart (text.json t22) */
export const UNDER = 'Excluding POCI recovery related profits'
/** data.json → charts[0].footnote (text.json t26 + t27) */
export const FOOTNOTE = 'Note: (*) Guidance of FY27 total PAT of ₹ 2,200-2,300 Cr led primarily by Growth business PBT'
