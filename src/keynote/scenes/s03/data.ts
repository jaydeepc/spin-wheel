/**
 * Slide 03: the words and pictures of the slide, copied from the source pack
 * (exports/_rig/keynote-src/pack/03/). Copied and pasted, never retyped.
 *
 * The headline is deck.ts → title (pack text.json → t01), all of it in the deck's flame.
 */

/** text.json → t02 (subhead, white). The deck's own words, as they are ("our customer"). */
export const SUB = 'Our journey of AI strengthening financial services and serving our customer better'

export interface Photo {
  /** images.json → pictures[].name + its extension: a file in public/keynote/src/03/. */
  name: string
  /** images.json → px: the photograph's own pixels. It is never drawn wider than `px[0]` CSS pixels. */
  px: readonly [number, number]
  /** What it shows (images.json → description), for the alt text. */
  alt: string
}

/**
 * The three real event photographs, left to right as the deck places them
 * (images.json → placements[].rect x: 0.03, 0.3511, 0.6647). Shown whole, as they are.
 */
export const PHOTOS: readonly Photo[] = [
  { name: 'photo-leadership-four.jpg', px: [888, 592], alt: 'Four colleagues standing in front of a Piramal.ai standee' },
  { name: 'photo-townhall-standing.jpg', px: [873, 582], alt: 'Colleagues standing on the office floor, watching a presenter beside the screens' },
  { name: 'photo-townhall-seated.jpg', px: [873, 582], alt: 'A full room of colleagues seated at long tables, listening' },
]
