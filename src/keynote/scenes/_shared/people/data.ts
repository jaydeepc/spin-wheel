/**
 * THE PEOPLE GROUP (slides 61 to 64): every picture of the team story, and where each one sits
 * in the mesh.
 *
 * Sources: pack/62/images.json, pack/63/images.json (name, px) for the achievements; the owner's
 * own material in public/keynote/owner/team/ for the people (his new grid of portraits, cut into
 * one file per circle), his portrait and the judges' page.
 *
 * `w` is the picture's LARGEST width on the stage in --u, `px` its own pixels: the element is
 * never wider than `px[0]` CSS pixels (a photograph is never drawn larger than itself).
 */

export type NodeKind = 'person' | 'ai' | 'print'

export interface NodeDef {
  id: string
  kind: NodeKind
  /** Slide whose public/keynote/src/NN/ folder holds the file. */
  n: number
  file: string
  /** The file's own pixels. */
  px: [number, number]
  /** Largest width on the stage, in --u (a card's size for the prints, the mesh size for faces). */
  w: number
  /** Width in the mesh, in --u, at depth 0. */
  mw: number
  /** The pixel cap, if it is not px[0] (a circle cut from inside a larger file). */
  cap?: number
  /** For the two portraits the deck holds as cut-outs with a baked shadow: the face's circle inside the file, in pixels [left, top, diameter]. */
  circle?: [number, number, number]
  /** A sheet of paper (a real document): drawn as a small stack. */
  paper?: boolean
  /** Not clipped to a circle (the PIA badge is a cut-out with its own ring). */
  whole?: boolean
  /** The picture's path from the site's root, when it is not a file of public/keynote/src/NN/ (the owner's ABCD logo). */
  src?: string
  /** A logo: shown WHOLE inside the circle on a white ground, with a margin (never cropped, stretched or recoloured). */
  logo?: boolean
  /** No picture in the deck: a drawn emblem (emblem.tsx) fills the circle. */
  emblem?: 'nivaaran'
}

const P = 4.9 // a face in the mesh, in --u (94 px at 1920: under the smallest cut's 110 px)
const TEAM = '/keynote/owner/team/'
/** One circle of the owner's grid (public/keynote/owner/team/portrait-grid-source.webp), cut at its own pixels. */
const person = (cell: string, px: number): NodeDef => ({
  id: cell,
  kind: 'person',
  n: 64,
  file: '',
  src: `${TEAM}p-${cell}.png`,
  px: [px, px],
  w: P,
  mw: P,
})

/**
 * The owner himself: his own portrait (1024 x 1024). The circle is the part of the file around his
 * face ([left, top, diameter] in the file's pixels: a crop, nothing else). It stands beside the
 * judges' page on slide 63 (10u) and then takes its place in the mesh like everyone else.
 */
export const OWNER: NodeDef = {
  id: 'jaydeep',
  kind: 'person',
  n: 63,
  file: '',
  src: `${TEAM}jaydeep.jpg`,
  px: [1024, 1024],
  w: 10,
  mw: P,
  circle: [162, 80, 720],
  cap: 720,
}

/**
 * The owner's new set: the 52 portraits of his grid, by row and column (12 columns, 5 rows), cut by
 * a script that finds every circle (centre, radius) and saves the square inside its ring. Left out:
 * the four empty circles (r2c11, r3c08 pale; r4c09, r5c07 navy); r5c01 does not exist. The grid's
 * three agent marks are with the AI teammates below. No names (the grid prints none).
 */
export const PEOPLE: NodeDef[] = [
  person('r1c01', 122),
  person('r1c02', 122),
  person('r1c03', 122),
  person('r1c04', 112),
  person('r1c05', 124),
  person('r1c06', 124),
  person('r1c07', 124),
  person('r1c08', 124),
  person('r1c09', 124),
  person('r1c11', 124),
  person('r1c12', 124),
  person('r2c01', 120),
  person('r2c02', 128),
  person('r2c03', 128),
  person('r2c04', 120),
  person('r2c05', 124),
  person('r2c06', 124),
  person('r2c07', 124),
  person('r2c08', 124),
  person('r2c09', 124),
  person('r2c10', 124),
  person('r3c01', 110),
  person('r3c02', 122),
  person('r3c03', 124),
  person('r3c04', 118),
  person('r3c05', 124),
  person('r3c06', 124),
  person('r3c09', 124),
  person('r3c10', 124),
  person('r3c11', 124),
  person('r3c12', 124),
  person('r4c01', 118),
  person('r4c02', 120),
  person('r4c03', 124),
  person('r4c04', 124),
  person('r4c05', 124),
  person('r4c06', 124),
  person('r4c07', 124),
  person('r4c08', 124),
  person('r4c10', 124),
  person('r4c11', 124),
  person('r4c12', 124),
  person('r5c02', 144),
  person('r5c03', 128),
  person('r5c04', 120),
  person('r5c05', 124),
  person('r5c06', 144),
  person('r5c08', 120),
  person('r5c09', 124),
  person('r5c10', 124),
  person('r5c11', 124),
  person('r5c12', 124),
  OWNER,
]

/**
 * The AI teammates. The avatar (grid r1c10) and the Investor Assistant badge (grid r3c07) are the
 * deck's own, larger files of the same marks; the Instant Assistant badge (grid r2c12) is cut from
 * the owner's grid; ABCD is the owner's logo (public/keynote/brand/); Nivaaran has no picture: the
 * emblem slide 28 designed for it (emblem.tsx).
 */
export const AGENTS: NodeDef[] = [
  { id: 'ai1', kind: 'ai', n: 64, file: 'teammate-ai-avatar-1.jpg', px: [173, 173], w: 5.6, mw: 5.6 },
  { id: 'pia', kind: 'ai', n: 64, file: 'teammate-ai-pia-investor-assistant.png', px: [172, 172], w: 5.6, mw: 5.6, whole: true },
  { id: 'pia2', kind: 'ai', n: 64, file: '', src: `${TEAM}agent-pia-instant.png`, px: [134, 134], w: 5.6, mw: 5.6 },
  { id: 'abcd', kind: 'ai', n: 64, file: '', src: '/keynote/brand/abcd-agent-512.png', px: [512, 512], w: 5.6, mw: 5.6, logo: true },
  { id: 'nivaaran', kind: 'ai', n: 64, file: '', px: [200, 200], w: 5.6, mw: 5.6, emblem: 'nivaaran' },
]

/**
 * The achievements (62, 63): real photographs and real documents, as prints ON THEIR CARDS. They do
 * not go into the mesh (the owner: only circles there), and the three group photographs are gone.
 */
export const PRINTS: NodeDef[] = [
  { id: 'authors', kind: 'print', n: 62, file: 'photo-authors-three.jpg', px: [614, 469], w: 16.6, mw: 7.4 },
  { id: 'paper1', kind: 'print', n: 62, file: 'doc-paper-toxicity-first-page.jpg', px: [563, 471], w: 15.16, mw: 6.2, paper: true },
  { id: 'arpit', kind: 'print', n: 62, file: 'photo-arpit-upadhyay.jpg', px: [271, 250], w: 12.6, mw: 5.6 },
  { id: 'paper2', kind: 'print', n: 62, file: 'doc-paper-semantic-density-first-page.jpg', px: [633, 469], w: 17.1, mw: 6.6, paper: true },
  { id: 'receipt', kind: 'print', n: 63, file: 'doc-patent-filing-receipt.png', px: [697, 360], w: 24, mw: 8.2, paper: true },
  { id: 'speaker', kind: 'print', n: 63, file: 'photo-speaker-mlds.jpg', px: [729, 330], w: 24, mw: 8.4 },
  { id: 'delegates', kind: 'print', n: 63, file: 'photo-delegates-world-summit-ai.jpg', px: [765, 357], w: 24, mw: 8.8 },
  // the judges' page: the first page of the owner's screenshot (owner/team/judges-panel-source.png), cropped, 580 px wide: never wider
  { id: 'judges', kind: 'print', n: 63, file: '', src: `${TEAM}judges-panel.png`, px: [580, 516], w: 30, mw: 8, paper: true },
]

const byId = (id: string) => AGENTS.find((d) => d.id === id)!
/** The five AI teammates in the order they come up: across the mesh, from the left to the right. */
export const TEAMMATES: NodeDef[] = ['nivaaran', 'ai1', 'pia', 'pia2', 'abcd'].map(byId)

export const ALL: NodeDef[] = [...PEOPLE, ...AGENTS, ...PRINTS]

/** The mesh's centre on the stage, in --u. */
export const CENTRE: [number, number] = [50, 26.8]

/**
 * Where every node of the mesh rests: [u from the left, v from the top, depth], all in --u (the
 * prints have no place: they stay on their cards). Laid out once offline for 53 people and 5 AI
 * teammates (an even lattice inside a soft outline, shaken and relaxed so that no two overlap; the
 * AI teammates are the hubs and sit nearest the room; the owner a little in front, near the middle)
 * and frozen here.
 */
export const XYZ: Record<string, [number, number, number]> = {
  ai1: [34.46, 19.33, 6.0],
  pia: [49.07, 28.02, 6.0],
  pia2: [67.46, 31.49, 6.0],
  abcd: [81.6, 18.46, 6.0],
  nivaaran: [27.86, 33.67, 6.0],
  jaydeep: [55.29, 21.8, 3.2],
  r1c01: [35.33, 10.78, -2.3],
  r1c02: [29.31, 26.27, -1.2],
  r1c03: [70.46, 24.88, 2.6],
  r1c04: [52.74, 40.73, -2.2],
  r1c05: [79.3, 25.41, -1.7],
  r1c06: [86.86, 24.38, -0.9],
  r1c07: [41.28, 10.21, -5.1],
  r1c08: [33.81, 32.96, -1.7],
  r1c09: [63.18, 26.68, -0.4],
  r1c11: [25.4, 19.86, 1.2],
  r1c12: [77.23, 18.35, -6.0],
  r2c01: [20.65, 28.47, -3.8],
  r2c02: [49.55, 16.88, -6.1],
  r2c03: [10.96, 27.43, 1.4],
  r2c04: [92.59, 32.08, 0.2],
  r2c05: [14.48, 13.41, -6.6],
  r2c06: [58.23, 40.02, 3.2],
  r2c07: [53.6, 11.4, 3.0],
  r2c08: [59.81, 10.93, -0.2],
  r2c09: [58.45, 16.49, -0.6],
  r2c10: [47.42, 10.13, -5.4],
  r3c01: [46.93, 41.32, -6.8],
  r3c02: [23.08, 12.08, -1.5],
  r3c03: [44.11, 22.22, -6.4],
  r3c04: [64.76, 41.02, -5.0],
  r3c05: [85.5, 31.26, -4.5],
  r3c06: [53.29, 34.59, -6.7],
  r3c09: [40.9, 29.86, -2.2],
  r3c10: [76.82, 32.59, -2.4],
  r3c11: [56.53, 28.09, 1.8],
  r3c12: [29.79, 40.14, -1.6],
  r4c01: [69.0, 17.54, -0.3],
  r4c02: [37.04, 24.86, -1.8],
  r4c03: [69.92, 40.19, -0.1],
  r4c04: [40.65, 17.09, -2.2],
  r4c05: [89.06, 37.33, -4.1],
  r4c06: [80.89, 38.41, 3.4],
  r4c07: [45.58, 34.22, 3.4],
  r4c08: [75.41, 39.53, 1.7],
  r4c10: [41.63, 40.35, 0.4],
  r4c11: [61.4, 34.06, -3.7],
  r4c12: [72.84, 10.65, -4.6],
  r5c02: [66.4, 10.45, -4.0],
  r5c03: [8.72, 18.76, -6.3],
  r5c04: [17.84, 22.7, 1.0],
  r5c05: [35.44, 40.63, -2.8],
  r5c06: [63.34, 20.94, 1.8],
  r5c08: [14.63, 33.94, -3.0],
  r5c09: [90.54, 17.8, 3.0],
  r5c10: [92.69, 25.01, 1.8],
  r5c11: [28.14, 10.47, -7.0],
  r5c12: [79.94, 11.34, -4.8],
}

/** The mesh's links: neighbours to neighbours, and each AI teammate to the five people around it. */
export const LINKS: [string, string][] = [
  ['ai1', 'r4c02'], ['ai1', 'r4c04'], ['ai1', 'r1c11'], ['ai1', 'r1c01'], ['ai1', 'r5c11'], ['pia', 'r3c03'],
  ['pia', 'r3c11'], ['pia', 'r4c07'], ['pia', 'r3c06'], ['pia', 'r3c09'], ['pia2', 'r1c09'], ['pia2', 'r4c11'],
  ['pia2', 'r3c10'], ['pia2', 'r1c03'], ['pia2', 'r4c03'], ['abcd', 'r1c12'], ['abcd', 'r1c06'], ['abcd', 'r5c12'],
  ['abcd', 'r5c09'], ['abcd', 'r1c05'], ['nivaaran', 'r3c12'], ['nivaaran', 'r2c01'], ['nivaaran', 'r1c08'], ['nivaaran', 'r1c02'],
  ['r1c04', 'r3c01'], ['r3c01', 'r4c10'], ['r1c04', 'r2c06'], ['r4c10', 'r5c05'], ['r3c04', 'r4c03'], ['r2c06', 'r3c04'],
  ['r3c12', 'r5c05'], ['r1c07', 'r2c10'], ['r4c03', 'r4c08'], ['r2c07', 'r2c10'], ['r2c08', 'r5c02'], ['r1c01', 'r5c11'],
  ['r1c01', 'r1c07'], ['r4c12', 'r5c02'], ['r2c07', 'r2c08'], ['r4c05', 'r4c06'], ['r4c06', 'r4c08'], ['r3c02', 'r5c11'],
  ['r2c08', 'r2c09'], ['jaydeep', 'r2c09'], ['r1c09', 'r5c06'], ['r4c01', 'r5c06'], ['r3c09', 'r4c02'], ['r3c09', 'r4c07'],
  ['r1c09', 'r3c11'], ['r3c03', 'r4c04'], ['r4c12', 'r5c12'], ['r1c06', 'r5c10'], ['r1c04', 'r3c06'], ['r1c12', 'r4c01'],
  ['r2c05', 'r3c02'], ['jaydeep', 'r3c11'], ['r2c04', 'r4c05'], ['r3c05', 'r4c05'], ['jaydeep', 'r2c02'], ['r2c02', 'r2c10'],
  ['r5c03', 'r5c04'], ['r2c01', 'r5c04'], ['r3c11', 'r4c11'], ['r1c06', 'r3c05'], ['r2c06', 'r4c11'], ['r2c04', 'r5c10'],
  ['r2c05', 'r5c03'], ['r1c08', 'r3c09'], ['r1c05', 'r1c06'], ['r3c06', 'r4c07'], ['r1c02', 'r4c02'], ['r3c10', 'r4c08'],
  ['r1c03', 'r1c05'], ['r3c05', 'r3c10'], ['r1c02', 'r2c01'], ['r1c03', 'r1c12'], ['r1c11', 'r5c04'], ['r1c08', 'r5c05'],
  ['r5c09', 'r5c10'], ['r2c01', 'r5c08'], ['r2c03', 'r5c08'], ['r2c03', 'r5c04'], ['r2c02', 'r4c04'], ['r1c11', 'r2c05'],
]

/**
 * The patent receipt carries the filing agent's name, street and e-mail in three lines. They are
 * covered: [left, top, width, height] as fractions of the picture (measured on the 697 x 360 file).
 */
export const RECEIPT_MASK: [number, number, number, number] = [0.046, 0.392, 0.345, 0.118]
