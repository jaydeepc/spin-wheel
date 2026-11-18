/**
 * Slides 42 and 43 · the words and numbers, copied from the pack
 * (exports/_rig/keynote-src/pack/42 and /43: text.json, data.json). Nothing here is retyped
 * from the picture. The routes are in routes.ts.
 */

/** 42 t02: the flame phrases of the headline. */
export const FLAME_42 = ['plans from memory,', 'asks around', 'loses business on the way']
/** 43 t02. */
export const FLAME_43 = ['Arya', 'AI guides every turn']

/** 42 data.json → person (t03, t04); the photograph is 110 x 110 px. */
export const KRISHN = { name: 'Krishn Sharma', role: 'Branch Sales Manager, Lucknow, Gomti Nagar', photo: 'photo-krishn-sharma.jpg', px: 110 }
/** 43 data.json → agent (t03, t04). The larger cut-out of the character is slide 28's (477 px). */
export const ARYA = { name: 'Arya', role: 'Employee digital assistant, coach and work friend', photo: 'agent-arya.png', photoSlide: 28 }

/** 42 t05, t14, t08, t15: what he does at each hesitation (the deck prints "? " in flame before each). */
export const SPEECH = { asks: 'Asks around', calls: 'Calls from memory', digs: 'Digs through notes', wrong: 'Wrong turn' }
/** 42 t12, t13: the two tags where he ends. */
export const END_TAGS = ['Missed by 2 cases', 'First incentive slab']
/** 43 t20. */
export const RANK = 'RANK #1'

/** 43 t11 to t15: the navigation banner's five instructions, one for each stop (the deck stacks them in one place; data.json → goal is the last). */
export const NAV = [
  'Head to Kisan Path and the Ayodhya-Juggaur belt',
  'Call Monika Sharma today',
  '2 leads need you today',
  'Chandra P is ready to sign',
  'Disburse ₹1.07 Cr and reach Rank #1',
]

/** 43 t23: the label over each instruction. */
export const SAYS = 'ARYA SAYS'

export interface Step {
  n: number
  /** 42 t17, t20, t25, t28, t31 */
  title: string
  /** 42 data.json → steps[].text, its bold words, its verdict */
  before: string
  beforeBold: string[]
  verdict: string
  /** 43 data.json → steps[].text and its bold words */
  after: string
  afterBold: string[]
}

export const STEPS: Step[] = [
  {
    n: 1,
    title: 'Market intelligence',
    before: 'He calls contacts at other lenders and guesses which areas are doing well.',
    beforeBold: ['guesses'],
    verdict: 'A judgement call',
    after: 'A big opportunity is waiting in Kisan Path and the Ayodhya-Juggaur belt. Empanel new partners there.',
    afterBold: ['Kisan Path and the Ayodhya-Juggaur belt'],
  },
  {
    n: 2,
    title: 'Activate partners',
    before: 'He tries to recall which partners there are active or inactive, then starts calling.',
    beforeBold: ['recall'],
    verdict: 'Depends on memory',
    after: 'Your top partner, Monika Sharma, has not sent a case in 12 days. Call her today.',
    afterBold: ['Monika Sharma', '12 days'],
  },
  {
    n: 3,
    title: 'Plan the day',
    before: 'He has 5 to 6 warm leads. He digs through his notes and works on only one.',
    beforeBold: ['works on only one'],
    verdict: 'Only one lead worked',
    after: '2 leads to work on today. Follow up one at credit appraisal. Re-engage one that was cancelled.',
    afterBold: ['2 leads'],
  },
  {
    n: 4,
    title: 'Disburse more',
    before: 'A loan is sanctioned but not disbursed. He does not know where it is stuck.',
    beforeBold: ['does not know where it is stuck'],
    verdict: 'The case stays stuck',
    after: 'Chandra P’s loan is legal and tech approved. He only needs to sign. Call him and fix a time.',
    afterBold: ['Chandra P’s loan'],
  },
  {
    n: 5,
    title: 'Earn more incentive',
    before: 'He misses the first incentive slab by 2 cases. Both sat sanctioned for 5 days.',
    beforeBold: ['misses the first incentive slab by 2 cases'],
    verdict: 'The slab is missed',
    after: '₹1.07 Cr is sanctioned and waiting. Disburse it, earn ₹13,463 and jump to Rank #1.',
    afterBold: ['₹1.07 Cr', '₹13,463', 'Rank #1'],
  },
]
