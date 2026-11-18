/**
 * Slide 65 · the ending: PIRAMAL MIND.
 *
 * THE MORNING. Eighteen small stills of the keynote's own scenes (public/keynote/gen/65/, taken
 * with the checker at 960 x 540 with the chrome hidden; local files, nothing uploaded). `n` is the
 * slide the still shows; `label` is two or three words of that slide's own headline.
 */
export interface Memory {
  n: number
  label: string
}

/** In the order of the morning: six to a row, three rows. */
export const MEMORIES: Memory[] = [
  { n: 5, label: 'Key milestones' },
  { n: 8, label: 'Top 5 outcomes' },
  { n: 10, label: 'Building AI for Bharat' },
  { n: 12, label: 'Middle India' },
  { n: 14, label: 'Building is our edge' },
  { n: 17, label: '6 in 100' },
  { n: 20, label: 'Agents on a string' },
  { n: 23, label: 'Indic AI' },
  { n: 28, label: 'Star agents' },
  { n: 34, label: 'The pit crew' },
  { n: 37, label: 'Banking agent' },
  { n: 41, label: 'The collection visit' },
  { n: 43, label: 'Arya guides the day' },
  { n: 49, label: 'AIDLC' },
  { n: 53, label: 'The wheel' },
  { n: 57, label: 'Tokens and cost' },
  { n: 59, label: 'Six pillars' },
  { n: 64, label: 'Our team' },
]

export const still = (n: number) => `/keynote/gen/65/still-${String(n).padStart(2, '0')}.jpg`

/** The threads of light: which memories belong together (slide numbers). */
export const THREADS: [number, number][] = [
  // the thesis: milestones, outcomes, the three words, Bharat, building
  [5, 8],
  [8, 10],
  [10, 12],
  [10, 14],
  // the world of AI
  [17, 20],
  [20, 23],
  [17, 8],
  [23, 14],
  // the agents at work
  [28, 34],
  [34, 37],
  [28, 41],
  [28, 43],
  [8, 28],
  [12, 43],
  [12, 41],
  [20, 34],
  // engineering and people
  [49, 53],
  [49, 64],
  [53, 64],
  // under the hood
  [57, 59],
  [14, 59],
  [14, 57],
  [59, 64],
  [23, 59],
  [43, 49],
  [37, 57],
]

/**
 * THE CRUX (the owner, 19 Nov): everything the morning spoke about lives inside Piramal Mind, and
 * every AI borrows from it: it gives them intelligence even when it is not asked, as a mind does.
 * One sentence in two parts: the first stands over the thumbnails, the second is written in under
 * it as the mind forms. The wording is the lead's, of the owner's thought; set exactly.
 */
export const RECALL = 'Everything we spoke about this morning\u2026'
export const LIVES = '\u2026lives inside one mind.'

export const MIND = {
  name: 'Piramal Mind',
  line: 'It gives intelligence to every AI, even when it is not asked. As a mind does.',
  lineFlame: 'even when it is not asked',
  promise: 'The mind behind every AI at Piramal.',
  motto: 'It remembers. And it connects.', // the Everyday AI film's line (src/everyday/content.ts, product 'mind')
  inKicker: 'Flows in',
  inTag: 'Organizational knowledge', // owner, 18 Nov: no tool names
  ins: ['Every document', 'Every decision', 'Every conversation'], // owner, 18 Nov: organizational knowledge
  outKicker: 'Every AI draws on it',
  memory: 'One connected memory',
}

/**
 * THE AIs OF THE MORNING, as names (slide 28's agents, and Prastuti). Small rings, not portraits:
 * the deck's marks for PIA and Arya carry lettering that is mush at this size, and Nivaaran and
 * Prastuti have none, so all five are drawn alike.
 */
export const AIS = ['PIA', 'Arya', 'ABCD', 'Nivaaran', 'Prastuti']

export const CLOSE = {
  thanks: 'Thank you', // the deck's page 65: "Thank You"
  questions: 'Questions?',
}
