/**
 * Slide 30 · every word and number on the slide.
 *
 * SOURCE: the owner's UPDATED slide of the main track (given as a picture, read at full size),
 * which replaces what exports/_rig/keynote-src/pack/30/ still holds: the two chart boxes are
 * gone, the nine statistics are renumbered and three of them are new (see PACK-FIXES.md).
 * Set as the slide has it, letter for letter: "build by" and "Non- tech" on 8 are the deck's
 * own; the asterisk on 6 has no footnote on the slide and gets none here.
 *
 * NOT here, never shown: review notes, placeholder text, the yellow highlighter.
 */

export interface Tile {
  n: number
  /** The slide alternates pale blue and pale peach. */
  tone: 'blue' | 'peach'
  /** The figure that counts … */
  to: number
  prefix?: string
  suffix?: string
  /** … and the small unit the slide sets after it. */
  unit?: string
  /** The label, line by line as the slide breaks it. */
  label: string[]
}

export const TILES: Tile[] = [
  { n: 1, tone: 'blue', to: 300, suffix: '+', label: ['Team of product engineering'] },
  { n: 2, tone: 'peach', to: 200, suffix: '+', label: ['AI/Data scientists'] },
  { n: 3, tone: 'blue', to: 600, suffix: '+', label: ['AI models and agents'] },
  { n: 4, tone: 'peach', to: 20000, suffix: '+', label: ['Features analysed for', 'underwriting'] },
  { n: 5, tone: 'blue', to: 400, suffix: '+', label: ['Internal dashboards'] },
  { n: 6, tone: 'peach', to: 150, label: ['AI/ML/Agentic models*'] },
  { n: 7, tone: 'blue', to: 158, unit: 'mn', label: ['API hits handled per day'] },
  { n: 8, tone: 'peach', to: 260, suffix: '+', label: ['Tech products build by', 'Non- tech people'] },
  { n: 9, tone: 'blue', to: 70, prefix: '~', suffix: 'k', unit: 'Sq ft', label: ['Space Bengaluru', 'Centre of Excellence'] },
]
