/**
 * Slides 36 to 39: every word and number on screen. Source: the owner's four pictures of
 * 18 Nov and a fifth of 19 Nov, slide 38 (they supersede the pack for these four slides: see
 * PACK-FIXES.md). Nothing here
 * comes from the pack, and no picture of public/keynote/src/36..39 is used.
 */

export type Tone = 'good' | 'mid' | 'bad'

/** The signal colours of the pictures (they carry the meaning; everything else is the brand's). */
export const TONE: Record<Tone, { ink: string; soft: string; line: string }> = {
  good: { ink: '#1f9d63', soft: '#cfeedd', line: '#8fd3b1' },
  mid: { ink: '#e08a00', soft: '#fbe6bd', line: '#f1c36d' },
  bad: { ink: '#dc3a2c', soft: '#fbd3cd', line: '#f0a297' },
}

/* ------------------------------------------------------------------ the agent (all four) */
export const AGENT = {
  name: 'ABCD Banking Agent',
  /** slide 36 */
  reads: 'reads every line of the statement',
  /** slides 37 to 39 */
  composite: 'Composite AI: GenAI + ML',
}
export const STEPS = [
  { n: '1', name: 'GenAI', does: 'extracts and creates the categories' },
  { n: '2', name: 'ML', does: 'builds the features and the score' },
]

/* ------------------------------------------------------------------ slide 36 */
export const ASIDE = 'Three statements that look alike, until every line is read'
export const DOC_HEAD = 'ACCOUNT STATEMENT'
export const DOC_BALANCE = 'BALANCE OVER THE PERIOD'

export interface Statement {
  tone: Tone
  verdict: string
  findings: string[]
  /** the balance line, in a 184 x 22 box */
  balance: string
}
export const STATEMENTS: Statement[] = [
  {
    tone: 'good',
    verdict: 'Healthy and stable',
    findings: ['Low financial commitments', 'Low third-party transfers', 'Healthy liquidity', 'Low reliance on multiple loan disbursements', 'Low trading velocity'],
    balance: 'M2 15.5 C 30 15.2 46 16 66 14.4 S 104 14 126 12.6 S 164 11.6 182 10.4',
  },
  {
    tone: 'mid',
    verdict: 'Average',
    findings: ['A few charges transactions', 'Limited cheque outflows', 'Average balance and liquidity', 'Higher EMI obligations'],
    balance: 'M2 11.5 L 22 13.6 L 42 10.2 L 62 14 L 82 10.8 L 102 14.2 L 122 11 L 142 13.6 L 162 10.6 L 182 12.4',
  },
  {
    tone: 'bad',
    verdict: 'Fragile and dependent',
    findings: ['Low balance and liquidity', 'High variability in cash', 'Business transactions on non-business days', 'High volatility in transaction frequency', 'Visa application detected'],
    balance: 'M2 14 L 22 4 L 42 18.5 L 62 9 L 82 19.5 L 102 4.5 L 122 17 L 142 10.5 L 162 19.5 L 182 15.5',
  },
]

/* ------------------------------------------------------------------ slide 37 */
export const HEADS = ['AS THE BANK WRITES IT', 'THE TRADITIONAL WAY', 'ABCD, WITH GENAI']

/** [before, what GenAI picks out, after], the traditional label, ABCD's category */
export const ROWS: { raw: [string, string, string]; old: string; cat: string }[] = [
  { raw: ['NEFT/P2M/367276705881/', 'FINTECH', ''], old: 'Expense', cat: 'Loans' },
  { raw: ['UPI-', 'SAI OM DAIRY', '-PAYTMQR5EH3YT@PTYS-YESB0PTMU'], old: 'No Category', cat: 'Groceries & Essentials' },
  { raw: ['UPI/DR/430208222489/', 'Lovely Hair Cutting Saloon', '/okbi/gpay-112'], old: 'Expense', cat: 'Personal care & Services (non-business)' },
  { raw: ['UPI/767280097900/DR/', 'VFS', '/ICIC/vfsglobal@icici'], old: 'No Category', cat: 'Visa' },
  { raw: ['UPI/DR/429229079585/', 'Zerodha', '/yesb/zerodhabroking@yesbank/0560'], old: 'No Category', cat: 'Trading / Brokerage' },
]

export const FOOT = {
  old: { n: 100, title: 'basic features the traditional way', sub: 'Number of credits and debits, and balances' },
  abcd: { n: 9000, prefix: '~', suffix: '+', title: 'features with ABCD', sub: 'Built by ML on these categories' },
}

/* ------------------------------------------------------------------ slide 38 (the owner's fifth picture, 19 Nov) */
export const ML = {
  card: { n: 9000, prefix: '~', title: 'features', sub: 'built from the categories' },
  /** six of the nine thousand; the grey rows above and below stand for the rest */
  features: [
    'Fintech loans in the last 3 months',
    'Visa payment made in last 1m',
    'Velocity in trading transactions',
    'Non-business to business expense ratio',
    'Percentage of Charges/Penalties',
    'Frequency of non-business transactions',
  ],
  /** grey rows: one above the six, three below (widths in --u, as drawn in the picture) */
  above: [14.7],
  below: [9.5, 21, 20],
  model: 'ML Model',
  /** nodes per layer, input to output */
  layers: [5, 6, 6, 4, 1],
  score: { label: 'BANKING SCORE', n: 10, unit: 'bands' },
  caption: ['One score for this customer,', 'with the agent\u2019s reasons'],
}

/* ------------------------------------------------------------------ slide 39 */
export const CHART = {
  kicker: 'ABCD BANKING AGENT SCORE OUTPUT',
  title: 'The bad rate falls steadily as the score rises',
  yName: 'Bad rate',
  ticks: [0, 2, 4, 6, 8, 10, 12, 14],
  caption: 'Customers in ten equal groups by score: 1 is the lowest score, 10 the highest',
  /**
   * Bad rate, %, for scores 1 to 10. READ FROM THE PICTURE BY EYE (it prints no values; only
   * the callouts "5X lift" and "1.5%" are printed): approximate, to be replaced by the real ones.
   */
  values: [12, 10, 7.5, 6, 5, 4, 3, 2, 1.8, 1.5],
  high: 'High Risk – 5X lift',
  low: 'Lowest Risk – 1.5%',
}

export const WHY = {
  kicker: 'ABCD BANKING AGENT REASONING',
  /** followed by the score */
  title: 'Why this customer scores',
  bar: 'BANKING SCORE',
  low: { score: 2, reasons: ['High velocity of trading transactions', '5 loans in last 1 month', 'Irregular salary credit frequency', 'Multiple bounce charges every month'] },
  high: {
    score: 10,
    reasons: ['Daily retail cash flow, which shows a running business', 'High liquidity and a good balance', 'No fintech loans running', 'A good ratio of cash credit to cash debit'],
  },
}

/** The headlines' flame words (the headlines themselves are deck.ts). */
export const FLAME = {
  36: ['Every bank statement tells a different story'],
  37: ['GenAI reads every transaction', 'granular, contextual categories'],
  38: ['about 9,000 features', 'one score'],
  39: ['ranks customers by risk', 'explains every score'],
}
