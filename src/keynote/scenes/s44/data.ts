/**
 * Slide 44: every word, copied from pack/44 (text.json block ids / data.json fields in the comments).
 * The line breaks of the step titles are the deck's.
 */

export interface Step {
  key: string
  /** The title's two lines, as the deck breaks them. */
  lines: [string, string]
  /** The flame words of the title (text.json spans, #f26841). */
  flame: string
  body: [string, string]
  /** Step 5 only: the label over its title. */
  label?: string
}

export const STEPS: Step[] = [
  { key: 'call', lines: ['AI makes the', 'first call'], flame: 'first call', body: ['Pitches offer &', 'Handles Objection'] }, // t03, t04
  { key: 'link', lines: ['Shares Journey', 'link on WhatsApp'], flame: 'WhatsApp', body: ['Real time sharing', 'while on the call'] }, // t05, t06
  { key: 'human', lines: ['Drop-off:', 'Human assists'], flame: 'Human assists', body: ['An advisor helps to', 'continue the journey'] }, // t07, t08
  { key: 'customise', lines: ['Customise', 'every call'], flame: 'every call', body: ['Shaped by the customer’s', 'offer and profile.'] }, // t09, t10
  { key: 'payout', lines: ['Stay through', 'payout'], flame: '', body: ['Voice support, all', 'the way to disbursal.'], label: '05 DISBURSE' }, // t12, t13, t11
]

/** Under the line, hanging between the steps (data.json → under). */
export const DOES = [
  ['Pitches', 'the offer'], // t14
  ['Switches', 'language'], // t15
  ['Captures', 'interest'], // t16
] as const
export const MANAGED = ['Query resolution &', 'Drop-offs managed'] as const // t17
export const VENN = ['PIA', 'Customer', 'Offer'] as const // data.json → under[2].venn
export const SHARED = 'Context Shared' // t18

export const BAR_PIA = 'PIA · Voice AI, with the customer all the way through' // t19
export const BAR_HUMAN = 'Human–in-the-loop · steps in at drop-off' // t21

export const TAKEAWAYS = [
  { n: '1', text: 'Voice stays with the customer, start to finish.', flame: 'start to finish.' }, // t20
  { n: '2', text: 'Voice AI plus a human in the loop: more productivity, lower cost.', flame: 'more productivity, lower cost.' }, // t22
]

/** Where the five steps stand on the stage (centre x, in --u), and the four places between them. */
export const X = [13, 32, 51, 70, 88.6]
export const SEP = [22.5, 41.5, 60.5, 79.4]
