/**
 * Slide 14 · the pack's values (exports/_rig/keynote-src/pack/14), copied, not retyped.
 * Blocks x01 … x13 are outlines in the PDF, read by eye in the pack and checked once more
 * against public/keynote/pages/14.jpg. Not shown: t08 "The commitment" (role hidden, a leftover).
 */

import type { IconName } from './icons'

/** text.json t01: the span "3 · BUILDING " is the deck's flame. */
export const FLAME = ['3 · BUILDING']

/** text.json t02, x05, t06 */
export const BUILD_KICKER = 'WE BUILD'
export const BUY_KICKER = 'WE BUY'
export const PLUS = '+'

export interface BuildRow {
  key: 'strategy' | 'models' | 'platform' | 'team'
  icon: IconName
  /** text.json t03, t04, t05, t07 */
  title: string
  /** the spans the deck sets in flame */
  flame: string[]
  /** text.json x01 … x04 (italic) */
  lines: string[]
}

export const BUILD: BuildRow[] = [
  {
    key: 'strategy',
    icon: 'sliders',
    title: 'Our own AI strategy',
    flame: ['AI strategy'],
    lines: ['No consultants, no ‘best practice’ implementations.', 'Our customers, our use cases, our strategy'],
  },
  { key: 'models', icon: 'brain', title: 'Our own AI models (ML & fine-tuned SLMs)', flame: ['AI models (ML &', 'SLMs)'], lines: ['We build proprietary models on our data and context'] },
  { key: 'platform', icon: 'layers', title: 'Our own Platform and Software', flame: ['Platform and Software'], lines: ['We own Source Codes'] },
  // the deck's line ends on a comma (it was cut off there): shown as it is
  { key: 'team', icon: 'team', title: 'Our own Team', flame: ['Team'], lines: ['Skilled, close to the latest research,'] },
]

export interface BuyRow {
  icon: IconName
  /** text.json x06, x08, x10 */
  title: string
  /** text.json x07, x09, x11 */
  line: string
}

export const BUY: BuyRow[] = [
  { icon: 'server', title: 'GPU', line: 'Rent capacity to suit our needs' },
  { icon: 'cloud', title: 'Cloud', line: 'Licenses & Infrastructure as a Service' },
  { icon: 'chat', title: 'LLMs', line: 'General-purpose frontier models' },
]

/** text.json t09 */
export const LEADS_KICKER = 'WHERE IT LEADS: COMPETITIVE ADVANTAGE'

export interface Step {
  /** text.json t10, t11, t12 */
  title: string
  flame: string[]
  /** text.json x12, x13, t13 */
  lines: string[]
  /** x12's note: these words are bold flame inside the italic lines */
  strong?: string[]
  /** where its dot sits on the line, 0 … 1 */
  at: number
}

export const STEPS: Step[] = [
  {
    title: 'AI Moats',
    flame: ['AI Moats'],
    lines: ['Proprietary models, trained on', 'proprietary data, running on', 'proprietary software'],
    strong: ['Proprietary', 'proprietary data', 'proprietary software'],
    at: 0,
  },
  { title: 'Evolving & Compounding assets', flame: ['Evolving & Compounding'], lines: ['Built in house for the long run'], at: 0.34 },
  { title: 'Creating Capability,', flame: ['Creating Capability'], lines: ['not just capacity'], at: 0.7 },
]

/* ---- the layout, in --u (scene.css has the same numbers) ---- */
/** The line of "where it leads": from its first dot to the glowing end, which lies under the structure. */
export const TRACK = { x0: 4.9, x1: 86.4, y: 42.2 }
/**
 * The structure: its middle on the stage, and the height of its ground. Its moat (7.6 wide at
 * scale 1) must stay inside the safe edge (95.8u) and its top light well under the logo.
 */
export const SITE = { x: 86.4, ground: 37.4, scale: 1.05 }
/** While it is being built (the first four beats) it has the stage: larger, and nearer the middle. At "buy" it steps to SITE. */
export const EARLY = { x: 70.5, ground: 37.6, scale: 1.6 }
/** Until "where it leads" comes in under them, the lists and the structure stand this much lower: the stage is theirs. */
export const DROP = 3.4
