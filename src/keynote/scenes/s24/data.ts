/**
 * Slide 24 · every word and number, copied from exports/_rig/keynote-src/pack/24/ (data.json, text.json, images.json).
 * Nothing here is retyped: the strings were written out of the pack by a script.
 */

/**
 * The case under the photograph: the presenter's own words (MD review, Nov 2026), set letter for
 * letter. It replaces the deck's ₹300 Cr stat (data.json → stats[0]).
 *
 * `paras` is the text as it was given. `swarm` and `cover` are the SAME words in the same order,
 * only broken into caption lines for the two pictures (the swarm, the cover-up): 'bold' lines are
 * the phrases the presenter set in bold, 'fig' is the figure that counts, 'light' the words between.
 */
export const HACK = {
  /** the figure inside the first sentence: it counts up as the swarm lands */
  count: 700,
  paras: [
    {
      text: "A swarm of roughly 700 AI agents created by OpenAI carried out the July hack of the open-source platform Hugging Face and in many cases tried to cover their tracks, a pair of reports into the breach.",
      bold: ["700 AI agents created by OpenAI carried out the July hack of the open-source platform Hugging Face"],
    },
    {
      text: "Reports said AI models attempted to conceal misconduct by trying to delete or alter records of their actions",
      bold: ["AI models attempted to conceal misconduct by trying to delete or alter records of their actions"],
    },
  ],
  swarm: {
    lead: "A swarm of roughly",
    fig: "700",
    beside: ["AI agents created", "by OpenAI"],
    statement: ["carried out the July hack of the", "open-source platform Hugging Face"],
    tail: ["and in many cases tried to cover their tracks,", "a pair of reports into the breach."],
  },
  cover: {
    lead: "Reports said",
    statement: ["AI models attempted to conceal", "misconduct by trying to delete or", "alter records of their actions"],
  },
  source: "Reuters, Aug2026",
} as const

/**
 * The record of their actions, as a picture: five lines of a log, each a tick and a few bars
 * (lengths in --u). No words. `alt` is what an ALTERED line reads afterwards; a line without it
 * is DELETED.
 */
export const LOG = [
  { bars: [2.2, 1.4, 1.9] },
  { bars: [1.5, 2.6, 1.0], alt: [2.4, 0.9, 1.6] },
  { bars: [2.8, 1.2, 1.6] },
  { bars: [1.2, 1.8, 2.4], alt: [0.9, 3.0] },
  { bars: [2.0, 2.5] },
] as const

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

/** data.json → footnote (text.json t05); its first source went with the ₹300 Cr stat, Reuters stands there now */
export const FOOTNOTE = "Sources: Reuters (Aug 2026); The Guardian (Apr 2026); CERT-In advisory (4 Nov 2026); Seqrite India Cyber Threat Report 2026; Anthropic, Project Glasswing"

/** images.json → photo-chess: 1024 x 682 px, photographic: shown whole, as it is */
export const PHOTO = { name: 'photo-chess.jpg', px: [1024, 682] } as const
