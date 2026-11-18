/**
 * Slides 33, 34, 35 · the pit lane. Every word, number and rectangle here is copied from the
 * source pack (pack/33, pack/34, pack/35): the block id or the field is named beside each.
 */

/* ------------------------------------------------------------------ headlines: the deck's flame words (text.json → t02 spans) */
export const FLAME_33 = ['five checks, one after another', 'a mountain of documents']
export const FLAME_34 = ['ABCD', '15 specialist agents', 'at the same time']
export const FLAME_35 = ['with its reasons on all five Cs', 'Sushil makes the call']

/* ------------------------------------------------------------------ slide 33 */
/** pack/33 text.json t03, t04 · data.json → person */
export const SUSHIL = { name: 'Sushil Pange', role: 'Credit Manager, Nashik, Maharashtra', photo: 'photo-sushil-pange.jpg', px: 110 }
/** pack/33 t05 · data.json → pile */
export const PILE_33 = 'One more pile for every C'
/** pack/33 t06 · data.json → lights.caption */
export const SEQUENCE = 'All in sequence. All on one person.'
/** pack/33 t07 */
export const HELD = 'HELD IN HIS HEAD'
/** pack/33 t08 to t12 · data.json → heldInHisHead */
export const FIVE = ['Character', 'Capacity', 'Capital', 'Collateral', 'Conditions']
/** pack/33 t14 · data.json → fiveCs[].label */
export const READS = 'SUSHIL READS'
/** pack/33 t15, t18, t21, t24, t27 · data.json → fiveCs[].text */
export const READS_TEXT = [
  'Bureau, KYC, fraud checks, PD visits',
  'Bank statements, ITR, GST, salary slips',
  'Customer’s savings, net worth, LTV',
  'Valuation, CERSAI, litigation',
  'Loan purpose, policy fit, risk offsets',
]

/* ------------------------------------------------------------------ slide 34 */
/** pack/34 t14, t15 · data.json → agent */
export const ABCD = { name: 'ABCD', role: 'AI-Based Credit Decisioning', photo: 'agent-abcd-face.jpg', px: 110 }
/** pack/34 t13 · data.json → pile */
export const PILE_34 = 'The same mountain of documents'

export interface Team {
  key: 'documents' | 'policy' | 'collateral' | 'fraud'
  /** pack/34 t10, t16, t34, t36 */
  team: string
  /** pack/34 t11, t17, t35, t37 */
  question: string
  /** The wheel this crew works at: r = rear, f = front, t = the upper side of the picture, b = the lower. */
  wheel: 'rt' | 'ft' | 'rb' | 'fb'
  /** pack/34 data.json → teams[].agents and .numbers */
  agents: { n: number; name: string }[]
}

export const TEAMS: Team[] = [
  {
    key: 'documents',
    team: 'Documents',
    question: 'What do the documents say?',
    wheel: 'rt',
    agents: [
      { n: 1, name: 'Consumer Bureau Agent' },
      { n: 2, name: 'Financials Agent' },
      { n: 3, name: 'Banking Agent' },
      { n: 4, name: 'Commercial Bureau Agent' },
    ],
  },
  {
    key: 'collateral',
    team: 'Collateral',
    question: 'Is the collateral sound?',
    wheel: 'rb',
    agents: [
      { n: 5, name: 'Collateral Agent' },
      { n: 6, name: 'Collateral Quality Agent' },
      { n: 7, name: 'Collateral Profile Alignment Agent' },
    ],
  },
  {
    key: 'policy',
    team: 'Policy',
    question: 'Does it fit within our rules?',
    wheel: 'ft',
    agents: [
      { n: 8, name: 'Scorecard Agent' },
      { n: 9, name: 'Eligibility Agent' },
      { n: 10, name: 'Policy Deviation Agent' },
      { n: 11, name: 'Employer Agent' },
    ],
  },
  {
    key: 'fraud',
    team: 'Fraud & Verifications',
    question: 'Is the case genuine?',
    wheel: 'fb',
    agents: [
      { n: 12, name: 'Personal Discussion Agent' },
      { n: 13, name: 'Credit Alerts' },
      { n: 14, name: 'Fraud Agent' },
      { n: 15, name: 'Field Investigation Agent' },
    ],
  },
]

/** pack/34 t22, t23 · data.json → badge */
export const BADGE = { value: 15, unit: 'specialists', line1: '4 teams, 1 case,', line2: 'all at the same time' }

/* ------------------------------------------------------------------ slide 35 */
/** pack/35 t05, t06, t07 · data.json → verdict */
export const VERDICT = { label: 'ABCD RECOMMENDS, WITH REASONING', value: 'APPROVED', line: 'with one condition to check' }
/** pack/35 x01 (read by eye, checked against pages/35.jpg) · data.json → stamp */
export const STAMP = 'VALIDATED'
/** pack/35 t11 · data.json → fiveCs[].label */
export const FINDS = 'ABCD FINDS'
/** pack/35 t12, t15, t18, t21, t24 · data.json → fiveCs[].text and .bold */
export const FINDS_TEXT = [
  { text: 'One 32-day delinquency in a year.', bold: 'One 32-day delinquency' },
  { text: 'Steady inflows, repayment comfortable.', bold: 'Steady inflows' },
  { text: 'Moderate LTV of 68%.', bold: 'LTV of 68%' },
  { text: 'Multi dwelling unit. Property is highly marketable.', bold: 'Property is highly marketable.' },
  { text: 'Residence is rented, low stability. Conduct a field investigation.', bold: 'Conduct a field investigation.' },
]

/* ------------------------------------------------------------------ the car and its crew
 * The deck's cut-outs, each at its own pixels. The deck draws all of them at one scale
 * (29.3 picture pixels to one stage unit), so a part's size on stage is its pixels / PPU.
 * `at` is the top left corner of the part ON THE ASSEMBLED CAR, in the deck's own stage units
 * (pack/34 images.json → placements[].rect: x * 100, y * 56.25). `off` is how far the deck
 * moves it away on slide 33, where the car is in pieces (pack/33 rect minus pack/34 rect).
 */
export const PPU = 29.3
/** The assembled car's middle in the deck's stage units: the chassis' vertical middle, the middle of rear wing to nose. */
export const DECK_CAR = { cx: 49.78, cy: 33.61 }

export interface Part {
  key: string
  file: string
  shadow: string
  px: [number, number]
  at: [number, number]
  off: [number, number]
}

export const PARTS: Part[] = [
  { key: 'chassis', file: 'illus-f1-chassis.png', shadow: 'shadow-chassis.png', px: [710, 294], at: [36.98, 28.581], off: [0, 0] },
  { key: 'shell', file: 'illus-f1-body-shell.png', shadow: 'shadow-shell.png', px: [348, 239], at: [36.38, 29.559], off: [-3.15, 0] },
  { key: 'rear-wing', file: 'illus-f1-rear-wing.png', shadow: 'shadow-rear-wing.png', px: [134, 249], at: [31.28, 29.256], off: [-7.12, 0] },
  { key: 'front-wing', file: 'illus-f1-front-wing.png', shadow: 'shadow-front-wing.png', px: [354, 338], at: [56.19, 27.906], off: [5.63, 0] },
  { key: 'tyre-rt', file: 'illus-f1-tyre-rear-top.png', shadow: 'shadow-tyre.png', px: [137, 108], at: [35.33, 26.854], off: [-2.1, -1.8] },
  { key: 'tyre-ft', file: 'illus-f1-tyre-front-top.png', shadow: 'shadow-tyre.png', px: [137, 108], at: [57.54, 26.854], off: [2.1, -1.8] },
  { key: 'tyre-rb', file: 'illus-f1-tyre-rear-bottom.png', shadow: 'shadow-tyre.png', px: [137, 106], at: [35.26, 36.984], off: [-2.1, 1.8] },
  { key: 'tyre-fb', file: 'illus-f1-tyre-front-bottom.png', shadow: 'shadow-tyre.png', px: [137, 106], at: [57.61, 36.984], off: [2.1, 1.8] },
]

/** The fifteen helmets round the four wheels (pack/34 images.json → illus-helmet placements, x * 100, y * 56.25), 79 x 92 px each. */
export const HELMET_PX: [number, number] = [79, 92]
export const HELMETS: { wheel: Team['wheel']; at: [number, number] }[] = [
  { wheel: 'rt', at: [32.86, 27.304] },
  { wheel: 'rt', at: [34.06, 24.458] },
  { wheel: 'rt', at: [37.06, 23.783] },
  { wheel: 'rt', at: [39.61, 24.756] },
  { wheel: 'ft', at: [61.97, 27.231] },
  { wheel: 'ft', at: [60.77, 24.379] },
  { wheel: 'ft', at: [57.76, 23.704] },
  { wheel: 'ft', at: [55.21, 24.683] },
  { wheel: 'rb', at: [32.78, 37.058] },
  { wheel: 'rb', at: [33.98, 39.909] },
  { wheel: 'rb', at: [36.98, 40.584] },
  { wheel: 'fb', at: [62.04, 37.136] },
  { wheel: 'fb', at: [60.84, 39.983] },
  { wheel: 'fb', at: [57.84, 40.663] },
  { wheel: 'fb', at: [55.29, 39.684] },
]

/** The other cut-outs: [pixels wide, pixels high]. */
export const STACK_PX: [number, number] = [286, 290] // pack/33 illus-paper-stack
export const MINI_PX: [number, number] = [110, 112] // pack/34 illus-paper-stack-mini
