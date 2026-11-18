/**
 * Slide 11 · the words (copied from exports/_rig/keynote-src/pack/11/text.json, block ids in the
 * comments) and the geometry of the two woven rings (the approved redesign: exports/_rig/build_weave.py).
 *
 * THE TEXT OF THIS SLIDE IS NOT TO BE CHANGED. A "\n" is the deck's own line break inside a label;
 * `line` sets the label on one line where the approved design does (the words stay the same).
 */

export type RGB = [number, number, number]

/* The Piramal AI Day colours of the approved rings (build_weave.py). */
export const FLAME: RGB = [239, 65, 35]
export const AMBER: RGB = [245, 140, 40]
export const BLUE: RGB = [47, 107, 255]
export const DEEP: RGB = [18, 48, 127]

const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
export const tint = (c: RGB, t: number): RGB => mix(c, [255, 255, 255], t)
export const css = (c: RGB) => `rgb(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])})`

export type Stop = [deg: number, colour: RGB]

/** The colour of a ring at an angle: each family holds its colour and blends into the next only near the boundary. */
export function angColour(deg: number, stops: Stop[]): RGB {
  const d0 = ((deg % 360) + 360) % 360
  const s = [...stops].sort((p, q) => p[0] - q[0])
  for (let i = 0; i < s.length; i++) {
    const [a0, c0] = s[i]
    const [n1, c1] = s[(i + 1) % s.length]
    const a1 = n1 <= a0 ? n1 + 360 : n1
    const d = d0 >= a0 ? d0 : d0 + 360
    if (d >= a0 && d <= a1) {
      let t = (d - a0) / (a1 - a0)
      t = Math.min(1, Math.max(0, (t - 0.32) / 0.36))
      t = t * t * (3 - 2 * t)
      return mix(c0, c1, t)
    }
  }
  return s[0][1]
}

/* ------------------------------------------------------------------ the rings */

export interface RingSpec {
  key: 'what' | 'how'
  /** The centre on the stage, in --u. */
  cx: number
  cy: number
  /** Two ribbons: r = R + aA·cos(n(t − phase)) and r = R − aB·cos(n(t − phase)), n = lobes / 2. */
  R: number
  aA: number
  aB: number
  /** The ribbon's width, in --u. */
  w: number
  lobes: number
  /** In degrees. */
  phase: number
  stops: Stop[]
  /** Where the ribbons begin to draw (degrees, counter-clockwise from the right, as in the generator); they run clockwise. */
  start: number
}

export const WHAT_RING: RingSpec = {
  key: 'what',
  cx: 29.6,
  cy: 27.5,
  R: 6.9,
  aA: 1.32,
  aB: 1.8,
  w: 1.07,
  lobes: 12,
  phase: 0,
  stops: [
    [90, FLAME],
    [0, AMBER],
    [270, BLUE],
    [180, DEEP],
  ],
  start: 135,
}

export const HOW_RING: RingSpec = {
  key: 'how',
  cx: 75.9,
  cy: 27.5,
  R: 5.5,
  aA: 1.18,
  aB: 1.18,
  w: 0.94,
  lobes: 8,
  phase: 22.5,
  stops: [
    [90, BLUE],
    [270, DEEP],
    [0, mix(BLUE, DEEP, 0.5)],
    [180, mix(BLUE, DEEP, 0.5)],
  ],
  start: 180,
}

/** A point of a ring's plane, in --u on the stage (angles as in the generator: counter-clockwise, y up). */
export const polar = (ring: RingSpec, r: number, deg: number): [number, number] => {
  const t = (deg * Math.PI) / 180
  return [ring.cx + r * Math.cos(t), ring.cy - r * Math.sin(t)]
}

/** The centre line of ribbon A (sign +1) or B (sign −1) at an angle, in the ring's own plane (y up). */
export const ribbonR = (ring: RingSpec, sign: 1 | -1, deg: number): number => {
  const n = ring.lobes / 2
  const amp = sign > 0 ? ring.aA : ring.aB
  return ring.R + sign * amp * Math.cos((n * (deg - ring.phase) * Math.PI) / 180)
}

/* ------------------------------------------------------------------ the words */

export interface Item {
  /** The label, exact; "\n" is the deck's line break. */
  text: string
  /** Set on one line (the approved design does). */
  line?: boolean
  deg: number
  /** Its dot sits outside a far lobe (ribbon B's) or a near one (ribbon A's). */
  far: boolean
}

export interface Family {
  ring: 'what' | 'how'
  key: string
  /** The family's name, exact. */
  name: string
  colour: RGB
  /** A deeper shade of the same colour for the small spaced capitals (legibility on the light page). */
  ink: string
  /** Where its name stands. */
  side: 'top' | 'right' | 'bottom' | 'left'
  /** In the order the ribbon's head passes them (clockwise). */
  items: Item[]
}

const far = (deg: number) => Math.round(deg / 30) % 2 !== 0

export const FAMILIES: Family[] = [
  {
    ring: 'what',
    key: 'predictive',
    name: 'PREDICTIVE', // x01 (read by eye; checked against the page)
    colour: FLAME,
    ink: '#d9481f',
    side: 'top',
    items: [
      { text: 'ML\nModels', line: true, deg: 120, far: far(120) }, // t02
      { text: 'Anomaly\nDetection', deg: 90, far: far(90) }, // t03
      { text: 'Neural\nNetworks', deg: 60, far: far(60) }, // t06
    ],
  },
  {
    ring: 'what',
    key: 'perception',
    name: 'PERCEPTION', // x02
    colour: AMBER,
    ink: '#c9660a',
    side: 'right',
    items: [
      { text: 'Computer\nVision', deg: 30, far: far(30) }, // t04
      { text: 'Speech\n& Text', line: true, deg: 0, far: far(0) }, // t05
      { text: 'Document\nProcessing', deg: 330, far: far(330) }, // t09
    ],
  },
  {
    ring: 'what',
    key: 'generative',
    name: 'GENERATIVE', // x03
    colour: BLUE,
    ink: '#2a5ee6',
    side: 'bottom',
    items: [
      { text: 'Image/ Video\nGeneration', deg: 300, far: far(300) }, // t12
      { text: 'Code\nGeneration', deg: 270, far: far(270) }, // t11
      { text: 'Text\nGeneration', deg: 240, far: far(240) }, // t07
    ],
  },
  {
    ring: 'what',
    key: 'language',
    name: 'LANGUAGE', // x04
    colour: DEEP,
    ink: '#12307f',
    side: 'left',
    items: [
      { text: 'RAG,\nSemantics', deg: 210, far: far(210) }, // t14
      { text: 'SLMs', deg: 180, far: far(180) }, // t13
      { text: 'LLMs', deg: 150, far: far(150) }, // t10
    ],
  },
  {
    ring: 'how',
    key: 'agentic',
    name: 'AGENTIC', // t15
    colour: BLUE,
    ink: '#2a5ee6',
    side: 'top',
    items: [
      { text: 'AI\nAgents', line: true, deg: 157.5, far: false }, // t16
      { text: 'AI\nCoach', line: true, deg: 112.5, far: false }, // t17
      { text: 'Chat/Voice\nBOTS', deg: 67.5, far: false }, // t19
      { text: 'Co Pilots', deg: 22.5, far: false }, // t20
    ],
  },
  {
    ring: 'how',
    key: 'products',
    name: 'PRODUCTS & SYSTEMS', // t21
    colour: DEEP,
    ink: '#12307f',
    side: 'bottom',
    items: [
      { text: 'Agentic\nOPS', line: true, deg: 202.5, far: false }, // t22
      { text: 'Feature Store\n& MLOPS', deg: 247.5, far: false }, // t23
      { text: 'Annotation &\nHindsighting', deg: 292.5, far: false }, // t24
      { text: 'Platform &\nJourneys', deg: 337.5, far: false }, // t25
    ],
  },
]

export const CORE = { what: 'WHAT', how: 'HOW' } // t08, t18
export const CLOSING = 'AI is much more than LLMs' // t26
export const CLOSING_SUB = 'an interconnected ecosystem of specialized intelligences' // t27

/** The one label the closing line is about. */
export const THE_ONE = 'LLMs'

export const ringOf = (key: 'what' | 'how') => (key === 'what' ? WHAT_RING : HOW_RING)

/** How far outside its lobe a dot sits, and where its label's nearest edge is (--u from the lobe's centre line). */
export const DOT_GAP = 1.3
export const LABEL_GAP = 2.25
export const DOT_R = 0.42

/** The radius of an item's dot from its ring's centre. */
export const dotRadius = (f: Family, it: Item): number => {
  const ring = ringOf(f.ring)
  return ring.R + (it.far ? ring.aB : ring.aA) + DOT_GAP
}
export const labelRadius = (f: Family, it: Item): number => dotRadius(f, it) - DOT_GAP + LABEL_GAP

/** The middle of the WHAT picture with its words (LANGUAGE on the left … PERCEPTION on the right), in --u:
 *  on the first rest the WHAT ring stands alone, and THIS point is put on the stage's centre line. */
export const WHAT_SOLO_CX = 30.1
/** … and it stands there LARGER and a little lower, filling the stage; it comes down to its own size as it steps aside. */
export const WHAT_SOLO = { scale: 1.2, dy: 3.0 }
