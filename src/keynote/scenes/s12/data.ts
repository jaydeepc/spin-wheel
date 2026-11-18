/**
 * Slide 12 · the pack's values (exports/_rig/keynote-src/pack/12), copied, not retyped.
 * The three photographs are of real people: shown whole, at their own proportions, and never
 * larger than their own pixels on a 1920 stage (px / 19.2 = the widest they may be, in --u).
 */

export interface Segment {
  key: 'a' | 'm' | 'r'
  /** images.json → pictures[].name */
  file: string
  /** images.json → px */
  px: [number, number]
  /** text.json t02 / t04 / t06 (the third reads "Poor, Rural" in the deck: the presenter asked for "Rural" alone) */
  name: string
  /** text.json t03 / t05 / t07 (the third is typed in mixed case with a hyphen: as the deck has it) */
  tag: string
  /** how high the portrait stands at the first rest, in --u: three cards at three distances */
  h: number
  /** how near it is at the first rest: the amount of its parallax drift */
  near: number
  /** its turn toward the middle at the first rest, in degrees (it faces the camera when the frame finds it) */
  turn: number
}

export const SEGMENTS: Segment[] = [
  { key: 'a', file: 'photo-affluent-urban.jpg', px: [708, 960], name: 'Affluent, Urban', tag: 'NOT OUR CUSTOMER', h: 26, near: 0.85, turn: 6 },
  { key: 'm', file: 'photo-middle-india.jpg', px: [769, 1022], name: 'Middle India', tag: 'OUR FOCUS', h: 27.5, near: 1.3, turn: 0 },
  { key: 'r', file: 'photo-poor-rural.png', px: [349, 463], name: 'Rural', tag: 'NOT YET- Biz in early days', h: 24, near: 0.5, turn: -6 },
]

/** text.json t01: the span "BHARAT" is the deck's flame. */
export const FLAME = ['BHARAT']

/**
 * The three stand on one floor line at three distances, so at three heights. The smallest file
 * (349 x 463) sets the far one: 24u high is 18.09u wide, 347 px on a 1920 stage. The other two
 * files are 708 and 769 px wide and stay far under their pixels even when the middle one comes
 * forward (30.8u high = 23.2u wide = 445 px). Nothing is enlarged.
 */
export const FLOOR = 42.4
export const widthOf = (s: Segment) => +((s.h * s.px[0]) / s.px[1]).toFixed(3)
