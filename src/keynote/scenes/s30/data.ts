/**
 * Slide 30 · every word and number on the slide, copied from
 * exports/_rig/keynote-src/pack/30/text.json and data.json (the block id is beside each).
 *
 * NOT here, never shown: the authors' note (t01), the deck's placeholder text
 * "<< Chart on … >>" (t03, t04) and the yellow highlighter behind two of the numbers.
 */

export interface Tile {
  n: number
  /** The deck alternates pale blue and peach. */
  tone: 'blue' | 'peach'
  /** The figure that counts … */
  to: number
  prefix?: string
  suffix?: string
  /** … and the small unit the deck sets after it. */
  unit?: string
  /** The label, line by line as the deck breaks it. */
  label: string[]
}

export const TILES: Tile[] = [
  { n: 1, tone: 'blue', to: 70000, prefix: '~', unit: 'Sq ft', label: ['Space Bengaluru', 'Centre of Excellence'] }, // t07 "~70,000 Sq ft", t08
  { n: 2, tone: 'peach', to: 300, suffix: '+', label: ['Team of product engineering'] }, // t16, t17
  { n: 3, tone: 'blue', to: 200, suffix: '+', label: ['AI/Data scientists'] }, // t25, t26
  { n: 4, tone: 'peach', to: 20000, suffix: '+', label: ['Features analysed for', 'underwriting'] }, // t10, t11
  { n: 5, tone: 'blue', to: 400, suffix: '+', label: ['Internal dashboards'] }, // t19, t20
  { n: 6, tone: 'peach', to: 150, label: ['AI/ML/Agentic models*'] }, // t28, t29
  { n: 7, tone: 'blue', to: 45, suffix: '+', label: ['GenAI models*'] }, // t13, t14
  { n: 8, tone: 'peach', to: 40, suffix: '+', label: ['Tech products developed &', 'in action, 380+ microservices'] }, // t22, t23
  { n: 9, tone: 'blue', to: 150, unit: 'mn', label: ['API hits handled per day'] }, // t31 "150mn", t32
]

/**
 * THE TWO CHARTS ARE PLACEHOLDERS. The deck leaves two empty boxes here ("employee count
 * progression", "AI agents count progression") and prints no figure for either. What is drawn
 * is an illustrative shape only: column heights in blocks, chosen to look like "steady growth"
 * and "accelerating growth". They are NOT data and nothing is printed on them but the tag.
 */
export interface PlaceholderChart {
  id: 'people' | 'agents'
  title: string
  /** Column heights, in rows of blocks. Illustrative. */
  shape: number[]
}

export const CHARTS: PlaceholderChart[] = [
  { id: 'people', title: 'Employees working on AI', shape: [4, 5, 7, 8, 10, 12] }, // title: t05, the deck's own words in the box
  { id: 'agents', title: 'AI agents', shape: [1, 2, 3, 5, 8, 12] }, // title: ours, from the deck's "Chart on AI agents count progression"
]

/** The tag on each chart, as the owner asked for it. */
export const TAG = 'Placeholder chart, to be replaced'
