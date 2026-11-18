/**
 * THE PEOPLE GROUP (slides 61 to 64): every picture of the team story, and where each one sits
 * in the mesh.
 *
 * Sources: pack/62/images.json, pack/63/images.json, pack/64/images.json (name, px), and
 * pack/64/data.json → grid (which cells are AI teammates, which are empty). The four empty
 * cells of the deck's grid (r4c5, r5c3, r5c7, r5c8) have no picture and are left out.
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

const P = 4.9 // a face in the mesh, in --u
const person = (cell: string, px: [number, number], ext = 'jpg', extra: Partial<NodeDef> = {}): NodeDef => ({
  id: cell,
  kind: 'person',
  n: 64,
  file: `portrait-${cell}.${ext}`,
  px,
  w: P,
  mw: P,
  ...extra,
})

/** pack/64/images.json: the 33 portraits, by grid cell (the slide prints no names: none are added). */
export const PEOPLE: NodeDef[] = [
  person('r1c1', [172, 172]),
  person('r1c2', [172, 172]),
  person('r1c3', [173, 172]),
  person('r1c4', [171, 172]),
  person('r1c5', [171, 170], 'png'),
  person('r1c7', [172, 172]),
  person('r1c8', [172, 172]),
  person('r2c1', [172, 172]),
  person('r2c2', [93, 94]),
  person('r2c3', [172, 172]),
  person('r2c4', [172, 172]),
  person('r2c5', [172, 172]),
  person('r2c6', [172, 172]),
  person('r2c7', [172, 163], 'jpg', { cap: 163 }),
  person('r3c1', [168, 172]),
  person('r3c2', [172, 172]),
  person('r3c4', [172, 172]),
  person('r3c5', [172, 173]),
  person('r3c6', [172, 172]),
  person('r3c7', [172, 172]),
  person('r3c8', [168, 172]),
  person('r4c1', [172, 172]),
  person('r4c2', [172, 172]),
  person('r4c3', [168, 167], 'jpg', { cap: 167 }),
  person('r4c4', [171, 172]),
  person('r4c6', [172, 172]),
  person('r4c7', [172, 172]),
  person('r4c8', [172, 172]),
  person('r5c1', [167, 172]),
  // the two cut-outs: the face is a circle of 93 px and of 78 px inside the file (measured from the alpha)
  person('r5c2', [163, 189], 'png', { circle: [35, 2, 93], cap: 93 }),
  person('r5c4', [157, 170], 'png', { circle: [39, 1.5, 78], cap: 78 }),
  person('r5c5', [172, 172]),
  person('r5c6', [171, 172]),
]

/** pack/64/data.json → grid.aiTeammates: the three AI teammates the deck pictures. */
export const AGENTS: NodeDef[] = [
  { id: 'ai1', kind: 'ai', n: 64, file: 'teammate-ai-avatar-1.jpg', px: [173, 173], w: 5.6, mw: 5.6 },
  { id: 'pia', kind: 'ai', n: 64, file: 'teammate-ai-pia-investor-assistant.png', px: [172, 172], w: 5.6, mw: 5.6, whole: true },
  { id: 'ai2', kind: 'ai', n: 64, file: 'teammate-ai-avatar-2.jpg', px: [172, 172], w: 5.6, mw: 5.6 },
]

/** The achievements (62, 63) and the group photographs (64): real photographs and real documents, as prints. */
export const PRINTS: NodeDef[] = [
  { id: 'authors', kind: 'print', n: 62, file: 'photo-authors-three.jpg', px: [614, 469], w: 16.6, mw: 7.4 },
  { id: 'paper1', kind: 'print', n: 62, file: 'doc-paper-toxicity-first-page.jpg', px: [563, 471], w: 15.16, mw: 6.2, paper: true },
  { id: 'arpit', kind: 'print', n: 62, file: 'photo-arpit-upadhyay.jpg', px: [271, 250], w: 12.6, mw: 5.6 },
  { id: 'paper2', kind: 'print', n: 62, file: 'doc-paper-semantic-density-first-page.jpg', px: [633, 469], w: 17.1, mw: 6.6, paper: true },
  { id: 'receipt', kind: 'print', n: 63, file: 'doc-patent-filing-receipt.png', px: [697, 360], w: 24, mw: 8.2, paper: true },
  { id: 'speaker', kind: 'print', n: 63, file: 'photo-speaker-mlds.jpg', px: [729, 330], w: 24, mw: 8.4 },
  { id: 'delegates', kind: 'print', n: 63, file: 'photo-delegates-world-summit-ai.jpg', px: [765, 357], w: 24, mw: 8.8 },
  { id: 'team1', kind: 'print', n: 64, file: 'photo-team-1.jpg', px: [482, 482], w: 8.4, mw: 8.4 },
  { id: 'team2', kind: 'print', n: 64, file: 'photo-team-2.jpg', px: [481, 481], w: 8.4, mw: 8.4 },
  { id: 'team3', kind: 'print', n: 64, file: 'photo-team-3.jpg', px: [970, 528], w: 13.5, mw: 13.5 },
]

/**
 * Two more AI teammates, asked for by the owner: the ABCD agent (the owner's logo, public/keynote/brand/)
 * and Nivaaran (no picture in the deck: the emblem slide 28 designed for it, see emblem.tsx). Same
 * family as the three above. (They stand LAST in ALL, so every other node keeps its index and with
 * it the way it flies in and idles.)
 */
export const AGENTS_MORE: NodeDef[] = [
  { id: 'abcd', kind: 'ai', n: 64, file: '', src: '/keynote/brand/abcd-agent-512.png', px: [512, 512], w: 5.6, mw: 5.6, logo: true },
  { id: 'nivaaran', kind: 'ai', n: 64, file: '', px: [200, 200], w: 5.6, mw: 5.6, emblem: 'nivaaran' },
]
const byId = (id: string) => [...AGENTS, ...AGENTS_MORE].find((d) => d.id === id)!
/** The five AI teammates in the order they come up: across the mesh, from the left to the right. */
export const TEAMMATES: NodeDef[] = ['nivaaran', 'ai1', 'pia', 'ai2', 'abcd'].map(byId)

export const ALL: NodeDef[] = [...PEOPLE, ...AGENTS, ...PRINTS, ...AGENTS_MORE]

/** The mesh's centre on the stage, in --u. */
export const CENTRE: [number, number] = [50, 26.8]

/**
 * Where every node rests in the mesh: [u from the left, v from the top, depth], all in --u.
 * Laid out once by a relaxation (no two overlap, the three AI teammates are the hubs and sit
 * nearest the room, the prints sit behind) and frozen here. ABCD and Nivaaran were placed later, in
 * the two open places that balance the three hubs (upper right, lower left); r2c4 and r3c1 stepped
 * aside by about one --u to make room, nobody else moved.
 */
export const XYZ: Record<string, [number, number, number]> = {
  r1c1: [45.07, 12.32, 2.2],
  r1c2: [65.01, 18.04, -1.8],
  r1c3: [49.97, 18.1, -6.3],
  r1c4: [16.88, 30.74, 0.1],
  r1c5: [12.5, 22.72, 2.0],
  r1c7: [22.18, 16.68, -2.8],
  r1c8: [42.27, 39.79, -6.8],
  r2c1: [29.47, 14.54, -5.2],
  r2c2: [63.6, 38.32, -6.4],
  r2c3: [57.47, 18.39, -5.6],
  r2c4: [86.87, 9.89, -2.7],
  r2c5: [76.3, 20.14, -6.1],
  r2c6: [37.54, 13.08, -1.0],
  r2c7: [36.9, 33.96, 2.0],
  r3c1: [24.62, 29.1, -3.9],
  r3c2: [62.55, 25.1, -3.1],
  r3c4: [52.54, 11.05, 3.5],
  r3c5: [19.91, 23.89, -5.1],
  r3c6: [69.87, 23.83, -4.4],
  r3c7: [39.76, 26.53, -0.5],
  r3c8: [42.52, 19.46, -7.0],
  r4c1: [71.2, 38.16, -2.9],
  r4c2: [32.31, 27.98, 3.5],
  r4c3: [51.81, 32.36, -1.3],
  r4c4: [71.53, 14.27, 0.4],
  r4c6: [92.33, 16.22, 2.9],
  r4c7: [44.28, 32.56, 2.6],
  r4c8: [27.19, 22.38, -2.7],
  r5c1: [10.53, 35.71, -5.9],
  r5c2: [75.02, 29.37, -6.3],
  r5c4: [83.06, 23.34, -4.7],
  r5c5: [59.4, 32.0, -3.3],
  r5c6: [55.28, 25.62, -7.0],
  ai1: [34.69, 20.43, 6.0],
  ai2: [67.31, 31.31, 6.0],
  pia: [47.64, 25.54, 6.0],
  abcd: [84.34, 17.16, 6.0],
  nivaaran: [29.73, 34.26, 6.0],
  authors: [18.11, 37.45, -8.3],
  paper1: [9.84, 29.2, -9.4],
  arpit: [80.31, 13.67, -5.0],
  paper2: [90.24, 22.48, -7.6],
  receipt: [34.49, 40.0, -9.5],
  speaker: [60.61, 12.25, -8.7],
  delegates: [83.6, 39.69, -9.2],
  team1: [12.45, 14.64, -5.2],
  team2: [87.55, 31.43, -9.3],
  team3: [52.69, 40.09, -9.9],
}

/** The mesh's links: every node to its nearest neighbours, each AI teammate to the five people around it, each paper to its authors. */
export const LINKS: [string, string][] = [
  ['r1c1', 'r2c6'], ['r1c1', 'r3c4'], ['r1c2', 'r3c2'], ['r1c2', 'r4c4'], ['r1c2', 'speaker'], ['r1c3', 'r2c3'],
  ['r1c3', 'r3c4'], ['r1c3', 'r3c8'], ['r1c3', 'pia'], ['r1c4', 'r3c5'], ['r1c4', 'authors'], ['r1c4', 'paper1'],
  ['r1c5', 'paper1'], ['r1c5', 'team1'], ['r1c7', 'r2c1'], ['r1c7', 'r3c5'], ['r1c7', 'r4c8'], ['r1c7', 'team1'],
  ['r1c8', 'r4c7'], ['r1c8', 'receipt'], ['r1c8', 'team3'], ['r2c1', 'ai1'], ['r2c2', 'r4c1'], ['r2c2', 'r5c5'],
  ['r2c2', 'ai2'], ['r2c3', 'speaker'], ['r2c4', 'r4c6'], ['r2c4', 'arpit'], ['r2c5', 'r3c6'], ['r2c5', 'r4c4'],
  ['r2c5', 'r5c4'], ['r2c5', 'arpit'], ['r2c6', 'ai1'], ['r2c7', 'r4c2'], ['r2c7', 'r4c7'], ['r2c7', 'receipt'],
  ['r3c1', 'r3c5'], ['r3c1', 'r4c8'], ['r3c2', 'r3c6'], ['r3c2', 'r5c5'], ['r3c2', 'r5c6'], ['r3c2', 'ai2'],
  ['r3c4', 'speaker'], ['r3c5', 'r4c8'], ['r3c6', 'r5c2'], ['r3c6', 'ai2'], ['r3c7', 'r4c7'], ['r3c7', 'ai1'],
  ['r3c7', 'pia'], ['r3c8', 'ai1'], ['r3c8', 'pia'], ['r4c1', 'ai2'], ['r4c1', 'delegates'], ['r4c2', 'ai1'],
  ['r4c3', 'r4c7'], ['r4c3', 'team3'], ['r4c6', 'paper2'], ['r4c7', 'pia'], ['r4c8', 'ai1'], ['r5c1', 'authors'],
  ['r5c1', 'paper1'], ['r5c2', 'ai2'], ['r5c4', 'paper2'], ['r5c5', 'ai2'], ['r5c6', 'pia'], ['authors', 'paper1'],
  ['arpit', 'paper2'], ['paper2', 'team2'], ['delegates', 'team2'],
  // ABCD and Nivaaran: each to the four people around it
  ['r2c4', 'abcd'], ['r4c6', 'abcd'], ['r5c4', 'abcd'], ['r2c5', 'abcd'],
  ['r3c1', 'nivaaran'], ['r4c2', 'nivaaran'], ['r2c7', 'nivaaran'], ['r1c4', 'nivaaran'],
]

/**
 * The patent receipt carries the filing agent's name, street and e-mail in three lines. They are
 * covered: [left, top, width, height] as fractions of the picture (measured on the 697 x 360 file).
 */
export const RECEIPT_MASK: [number, number, number, number] = [0.046, 0.392, 0.345, 0.118]
