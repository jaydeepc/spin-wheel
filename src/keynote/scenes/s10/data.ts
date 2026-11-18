/**
 * Slide 10 · the words (copied from exports/_rig/keynote-src/pack/10/text.json and data.json; block ids
 * in the comments). The phrase itself is the slide's title (deck.ts), split into its words.
 */

export type WordKey = 'building' | 'ai' | 'for' | 'bharat'

/** The four words of "Building AI for Bharat" (t01), in the phrase's order, each in the deck's colour. */
export const WORDS: { key: WordKey; colour: string }[] = [
  { key: 'building', colour: '#f16443' }, // flame (deck #ff7252)
  { key: 'ai', colour: '#071a50' }, // navy (deck #000e4f)
  { key: 'for', colour: '#b4bccc' }, // small and pale (deck #d1d1d1, a little firmer for a hall)
  { key: 'bharat', colour: '#4a98ec' }, // blue (deck #54b3fc)
]

export const SUB = 'Three words. Each one chosen deliberately.' // x01 (read by eye; checked against the page)

export interface Column {
  key: Exclude<WordKey, 'for'>
  /** The beat on which it lands: the order in which the words are explained. */
  beat: string
  /** The numbered word, exact. */
  head: string
  /** Its line: `italic` and `plain` runs as the deck sets them; "\n" is the deck's line break. */
  line: { text: string; italic: boolean }[]
  /** Its place: the left edge of its rule, in --u (the deck's three columns, left to right in the phrase's order). */
  x: number
  colour: string
  /** The heading's colour (the word's own, a little deeper for small type on the light page). */
  ink: string
}

/** The three columns, left to right as the deck has them: the phrase's order. The numbers give the order of telling. */
export const COLUMNS: Column[] = [
  {
    key: 'building',
    beat: 'building',
    head: '3. Building', // t02
    line: [{ text: 'Proprietary model with\ncontextual data', italic: true }], // t03
    x: 5.6,
    colour: '#f16443',
    ink: '#eb542c',
  },
  {
    key: 'ai',
    beat: 'ai',
    head: '1. AI', // t04
    line: [{ text: 'AI is much more than LLMs', italic: true }], // t05
    x: 36.05,
    colour: '#071a50',
    ink: '#071a50',
  },
  {
    key: 'bharat',
    beat: 'bharat',
    head: '2. Bharat', // t06
    // t07: "Middle India – " is italic in the deck, the trades are upright
    line: [
      { text: 'Middle India – ', italic: true },
      { text: 'Kirana, Tailor,\nTransporter, Dairy & more', italic: false },
    ],
    x: 66.5,
    colour: '#4a98ec',
    ink: '#3585de',
  },
]

/** A column's width (its rule), in --u. */
export const COL_W = 27.9

/** The order of telling: 1. AI, 2. Bharat, 3. Building (data.json → words[].order). */
export const ORDER: Column['key'][] = ['ai', 'bharat', 'building']

/** The first rest: the phrase stands in the middle of the stage, larger. Then it rises to make room. */
export const HERO = { dy: 9.6, scale: 1.17 }
