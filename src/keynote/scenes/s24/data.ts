/**
 * Slide 24 · every word and number, copied from exports/_rig/keynote-src/pack/24/ (data.json, text.json, images.json).
 * Nothing here is retyped: the strings were written out of the pack by a script.
 */

/** data.json → stats[0] (text.json t03, t04) */
export const STOLEN = {
  to: 300,
  prefix: '₹',
  suffix: ' Cr',
  line: "stolen from smaller Indian NBFCs in about two months of AI-assisted attacks.",
  /** text.json t04 → the span set in Bold */
  bold: ['stolen from smaller Indian NBFCs'],
} as const

/**
 * data.json → clippings (read by eye in the pack; checked against pages/24.jpg at full size).
 * `tilt` is measured from the page: the deck turns the first slip left, the other two right.
 */
export const CLIPS = [
  { key: 'leap', date: "THE CAPABILITY LEAP · APR 2026", headline: "Anthropic says its Mythos model can find and exploit zero-day flaws in every major operating system and browser", source: "The Guardian", tape: 'flame', tilt: -1.4 },
  { key: 'playbook', date: "THE PLAYBOOK · NOV 2026", headline: "CERT-In names four public AI tools that run whole attack chains against banks, NBFCs and fintechs", source: "CERT-In advisory, reported by Inc42", tape: 'navy', tilt: 1.4 },
  { key: 'damage', date: "THE DAMAGE · 2026", headline: "Healthcare, education and manufacturing take nearly half of all cyberattack detections in India", source: "Seqrite, India Cyber Threat Report 2026", tape: 'azure', tilt: 1.2 },
] as const

/** data.json → response (text.json t06, t07, t08) */
export const RESPONSE = {
  label: "THE RESPONSE",
  title: "Project Glasswing",
  text: "The industry turns the same capability to defence, and finds thousands of high-severity flaws before attackers do.",
  /** text.json t08 → the span set in Bold */
  bold: ['finds thousands of high-severity flaws'],
} as const

/** data.json → footnote (text.json t05) */
export const FOOTNOTE = "Sources: Economic Times (Oct 2026); The Guardian (Apr 2026); CERT-In advisory (4 Nov 2026); Seqrite India Cyber Threat Report 2026; Anthropic, Project Glasswing"

/** images.json → photo-chess: 1024 x 682 px, photographic: shown whole, as it is */
export const PHOTO = { name: 'photo-chess.jpg', px: [1024, 682] } as const
