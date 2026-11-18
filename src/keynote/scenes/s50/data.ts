/**
 * Slide 50: every word and number, copied from exports/_rig/keynote-src/pack/50/
 * (text.json block ids and data.json fields in the comments). Nothing is retyped.
 *
 * NOT here, on purpose: t13 "Martin's photo goes here" and t17 "Martin's quote goes here" (the
 * deck's placeholders: data.json → person.placeholders), and the deck's small drawn Tamil slide
 * (t19 to t22): the owner's ACTUAL Tamil slide (a real screenshot) takes its place.
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
  /**
   * GENERATED (public/keynote/gen/50/martin.jpg, prompt in GEN.md): a stand-in for Martin's own
   * photograph, which has not arrived. 800 x 800.
   */
  photo: 'martin.jpg',
  photoPx: 800,
}

/** t18 / steps[0].text; its bold words are the spans of weight 700 */
export const INTRO = {
  text: 'New joiners must learn what to source, how to source and where to source.',
  bold: ['what', 'how', 'where'],
}

export const STEPS = [
  {
    key: 'challenge',
    /** t03 */ n: '1',
    /** t04 */ label: 'THE CHALLENGE',
    /** t05 */ title: 'English slides and jargon lose the room.',
  },
  {
    key: 'turn',
    /** t06 */ n: '2',
    /** t07 */ label: 'THE TURN',
    /** t08 */ title: 'Martin asks Prastuti for the same training in Tamil.',
  },
  {
    key: 'result',
    /** t09 */ n: '3',
    /** t10 */ label: 'THE RESULT',
    /** t11 */ title: 'New joiners follow every idea and relate to it.',
  },
] as const

/** t27 / steps[2].text */
export const RESULT = {
  text: 'Rural sourcing, customer identification and Micro LAP, in the language they think in.',
  bold: ['in the language they think in'],
}

/** t12 / steps[1].prompt */
export const PROMPT = '“Make my Micro LAP training deck in Tamil.”'

/** t23, t24, t25 / steps[1].deck.tiles: the only words on the drawn ENGLISH slide; the rest of it is grey lines */
export const ENGLISH = ['What to source', 'How to source', 'Where to source'] as const

/** t26 / steps[1].deck.mark */
export const MARK = 'Made with Prastuti'

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

/** The owner's material, public/keynote/owner/50/ (URLs; these are not pack pictures). */
const owner = (name: string) => `/keynote/owner/50/${name}`

/**
 * The ACTUAL slide Prastuti made in Tamil: a real screenshot, shown whole and undistorted.
 * tamil-slide.png is tamil-slide-source.webp cropped to the slide itself, box (0, 0, 2000, 1126):
 * only the viewer's 4 px bottom edge is cut.
 */
export const TAMIL = { src: owner('tamil-slide.png'), ratio: '2000 / 1126', alt: 'The slide Prastuti made in Tamil: a red flag in a property title, explained in Tamil.' }

/**
 * The owner's classroom photographs: real photographs of real people, cropped only (boxes in the
 * source collage), never larger than their pixels.
 */
export const ROOM = {
  /** classroom-b-source.jpg (19, 651, 941, 1261): 922 x 610 */
  back: { src: owner('classroom-b2.jpg'), ratio: '922 / 610', alt: 'A training room seen from the back: colleagues seated, a trainer beside a projected slide.' },
  /** classroom-b-source.jpg (19, 19, 941, 478): 922 x 459; the GPS stamp lies below the crop */
  board: { src: owner('classroom-b1.jpg'), ratio: '922 / 459', alt: 'A trainer at a whiteboard, colleagues seated in front of him.' },
  /** classroom-a-source.jpg (8, 8, 1192, 794): 1184 x 786 */
  screen: { src: owner('classroom-a1.jpg'), ratio: '1184 / 786', alt: 'A trainer presenting at a screen to colleagues along a long table.' },
  /** classroom-a-source.jpg (8, 806, 1192, 1592): 1184 x 786 */
  group: { src: owner('classroom-a2.jpg'), ratio: '1184 / 786', alt: 'The group round the table, looking up at the camera.' },
} as const
