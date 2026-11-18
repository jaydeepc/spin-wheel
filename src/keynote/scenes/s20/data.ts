/**
 * Slide 20: every word and number, copied from exports/_rig/keynote-src/pack/20/ (text.json,
 * data.json, images.json). Nothing here is retyped from the picture.
 */

/** text.json → t02: the deck's flame words of the headline */
export const FLAME = ['firmly in human hands']

/** text.json → t03 (data.json → intro) */
export const INTRO = {
  text: 'A chatbot tells you how to book the ticket. An agent books it: it has a goal, tools and permission to act.',
  bold: ['An agent books it'],
}

/** data.json → stats (text.json t04 … t09) */
export const STATS = [
  { key: 'forty', to: 40, suffix: '%', tone: 'flame', line: 'of large companies now run agents at scale, up from 27%', bold: ['run agents at scale'] },
  { key: 'bny', to: 130, suffix: '+', tone: 'navy', line: 'digital employees at BNY, in a bank of 50,000 people', bold: ['digital employees'] },
  { key: 'seven', to: 7, suffix: '%', tone: 'azure', line: 'of buyers let an agent act fully on its own', bold: ['act fully on its own'] },
] as const

/** text.json → t10 */
export const SNAPS = 'When the string snaps'

/** data.json → whenTheStringSnaps (text.json x01 … x12, read by eye; checked against the page) */
export const CLIPS = [
  {
    date: 'APR 2026',
    text: "A coding agent wipes a startup's live database and its backups in 9 seconds",
    source: 'Reported by TechSpot',
    tape: 'flame' as const,
    tilt: -1.3,
  },
  {
    date: 'FEB 2026',
    text: "An inbox agent deletes its owner's entire mailbox after it forgets to ask first",
    source: 'Reported by ICAEW',
    tape: 'navy' as const,
    tilt: 0.9,
  },
  {
    date: 'DEC 2025',
    text: 'A coding assistant at a cloud giant knocks a billing system out for 13 hours',
    source: 'Reported by ICAEW',
    tape: 'azure' as const,
    tilt: -0.8,
  },
]

/** text.json → t11 */
export const SOURCES = 'Sources: McKinsey, The state of AI in 2026; Forrester on BNY (May 2026); G2 enterprise agent reviews (Oct 2026)'

/** images.json → illus-kites → placements[0].rect (the flat picture: the reference, and the stand-in where there is no WebGL) */
export const KITES_RECT = [0.0, 0.2534, 1.0, 0.7149]
export const KITES_PIC = 'illus-kites.png'
