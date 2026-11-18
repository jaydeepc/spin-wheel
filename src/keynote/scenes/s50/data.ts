/**
 * Slide 50: every word and number, copied from exports/_rig/keynote-src/pack/50/
 * (text.json block ids and data.json fields in the comments). Nothing is retyped.
 *
 * NOT here, on purpose: t13 "Martin's photo goes here" and t17 "Martin's quote goes here" (the
 * deck's placeholders: data.json → person.placeholders). The portrait frame's tag below is ours.
 */

/** t02: the flame words of the headline */
export const FLAME = ['in their language']

export const PERSON = {
  /** t14 / person.name */
  name: 'Martin',
  /** t15, lines 1 and 2 / person.role */
  role: 'Geography Head, Credit Underwriting',
  /** t15, line 3 / person.unit */
  unit: 'Micro LAP · Coimbatore',
  /** t16 / person.line */
  line: 'He trains every new joiner who sources loans in rural markets.',
  /** OURS, not the deck's: the tag on the empty portrait frame (the deck has no photograph yet) */
  photoTag: 'Photo to come',
}

export const STEPS = [
  {
    key: 'challenge',
    /** t03 */ n: '1',
    /** t04 */ label: 'THE CHALLENGE',
    /** t05 */ title: 'English slides and jargon lose the room.',
    /** t18; its bold words are the spans of weight 700 */
    text: 'New joiners must learn what to source, how to source and where to source.',
    bold: ['what', 'how', 'where'],
  },
  {
    key: 'turn',
    /** t06 */ n: '2',
    /** t07 */ label: 'THE TURN',
    /** t08 */ title: 'Martin asks Prastuti for the same training in Tamil.',
    text: '',
    bold: [],
  },
  {
    key: 'result',
    /** t09 */ n: '3',
    /** t10 */ label: 'THE RESULT',
    /** t11 */ title: 'New joiners follow every idea and relate to it.',
    /** t27 */
    text: 'Rural sourcing, customer identification and Micro LAP, in the language they think in.',
    bold: ['in the language they think in'],
  },
] as const

/** t12 / steps[1].prompt */
export const PROMPT = '“Make my Micro LAP training deck in Tamil.”'

/** steps[1].deck (data.json: normalised Unicode; never split into letters) */
export const DECK = {
  /** t19 */ title: 'மைக்ரோ LAP பயிற்சி',
  tiles: [
    { /** t20 */ tamil: 'எதை?', /** t23 */ label: 'What to source', tone: 'flame' },
    { /** t21 */ tamil: 'எப்படி?', /** t24 */ label: 'How to source', tone: 'navy' },
    { /** t22 */ tamil: 'எங்கே?', /** t25 */ label: 'Where to source', tone: 'azure' },
  ],
  /** t26 */ mark: 'Made with Prastuti',
} as const

/** t28 / banner: "Martin is one of 2,469 colleagues who have built 25,289 decks on Prastuti." */
export const BANNER = {
  a: 'Martin is one of ',
  colleagues: 2469,
  b: ' colleagues',
  c: ' who have built ',
  decks: 25289,
  d: ' decks',
  e: ' on Prastuti.',
}

/** images.json: both 584 x 389, photographs of people: shown whole, never larger than their pixels at 1920 */
export const PHOTO = {
  before: 'photo-classroom-before.jpg',
  after: 'photo-classroom-after.jpg',
  ratio: '584 / 389',
  beforeAlt: 'A training room: new joiners at their desks, bored and puzzled.',
  afterAlt: 'The same training room: the same new joiners, now engaged, one with her hand up.',
}
