/** Slide 39. Every string is copied from exports/_rig/keynote-src/pack/39/text.json / data.json. */

export const FLAME = ['ABCD Banking agent', 'Composite AI']

export const NETWORK = [
  { icon: 'memory', title: 'Context & Memory', line: 'Bank Statement Analyser' }, // t03, t04
  { icon: 'llm', title: 'LLM & Reasoning', line: 'Banking Alerts & Triggers' }, // t06, t07
  { icon: 'ml', title: 'ML & Deep learning', line: 'Transaction Score' }, // t08, t09
  { icon: 'slm', title: 'SLM', line: 'Embeddings Transformer' }, // t10, t11
] as const

export const AGENT = ['ABCD', 'Banking Agent'] // t12

export const SCORE_TITLE = 'ABCD Banking Agent Score Output' // t05
export const ALERTS_TITLE = 'ABCD Banking Agent Alerts' // t13

/** the real chart screenshot (kind: chart-as-picture): shown as it is */
export const CHART = { name: 'chart-bad-rate-across-deciles.png', px: [902, 441] as const }

/**
 * t15, as the deck has them, slips included: the stray closing quote of line 2, "detecte" in line 3.
 * `flame`: the words the deck sets in flame; `bold`: whether those words are bold there.
 */
export const ALERTS: { text: string; flame: string; bold: boolean }[] = [
  { text: 'Visa Application payment found', flame: 'Visa Application', bold: true },
  { text: 'Frequent Gaming transactions found in banking.”', flame: 'Gaming transactions', bold: true },
  { text: 'Frequent Alcohol-linked merchant activity detecte', flame: 'Alcohol-linked', bold: true },
  { text: 'Daily - retail cash flow indicating running business', flame: 'Daily - retail cash flow', bold: true },
  { text: 'Thin ₹15.7k balance - normal for kirana store', flame: '₹15.7k balance - normal for kirana store', bold: false },
  { text: '2 fintech loans running', flame: '2 fintech loans', bold: true },
]
