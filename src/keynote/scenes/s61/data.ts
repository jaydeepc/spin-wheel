/**
 * Slides 61 to 64: the words, copied from the pack (never retyped).
 *   62: pack/62/text.json t02 … t11 and data.json → papers
 *   63: pack/63/text.json t05 … t19 and data.json → cards
 *   64: pack/64/text.json t04, t05 (the legend)
 * Never shown: 61 t01 and t03 (notes to the authors), 63 t02 to t04 ("Add photo"), 64 t02, t03.
 */

export interface CardText {
  id: string
  /** The node ids of its pictures (scenes/_shared/people/data.ts). */
  prints: string[]
  tag: string
  title: string
  who: string
  where: string
}

export const PAPERS: CardText[] = [
  {
    id: 'icon',
    prints: ['authors', 'paper1'],
    tag: 'RESEARCH PAPER · ICON 2026', // t02
    title: 'Toxicity Detection in Romanized Indic Languages', // t03
    who: 'Annanya Agrawal · Parag Bajaj · Akshaay Kumar', // t04
    where: '20–23 Dec 2026', // t06, the date only (the owner: no university)
  },
  {
    id: 'neurips',
    prints: ['arpit', 'paper2'],
    tag: 'WORKSHOP PAPER · NEURIPS 2026', // t07
    title: 'Semantic Density Does Not Predict Agent-Memory Collapse', // t08
    who: 'Arpit Upadhyay', // t09
    where: 'PALM Workshop · NeurIPS 2026, Paris', // t11
  },
]

/** 62 t05: "2,28,198 messages in 8 Indian languages" is bold; 2,28,198 and 81.4% count. */
export const ICON_TEXT = {
  count: 228198,
  boldRest: ' messages in 8 Indian languages',
  a: '. Catches toxic messages with ',
  pct: 81.4,
  b: ' accuracy, and is live in Arya. One of 38 oral papers out of 148 accepted.',
}
/** 62 t10 */
export const NEURIPS_TEXT = {
  a: 'Studies why AI agents lose their long-term memory, and finds that ',
  bold: 'semantic density alone does not predict memory collapse',
  b: ". Accepted at NeurIPS, the world's premier AI conference.",
}

export const SHARED: CardText[] = [
  {
    id: 'patent',
    prints: ['receipt'],
    tag: 'PATENT FILING', // t05
    title: 'Data Insights Retrieval with Graph Databases and LLMs', // t06
    who: 'Filed by Piramal Finance', // t07
    where: 'App. no. 202521005092 · Jan 2025 · Pending', // t09
  },
  {
    id: 'speaker',
    prints: ['speaker'],
    tag: 'SPEAKER · MLDS 2026', // t10
    title: 'The LLMOps Backbone for Agentic AI', // t11
    who: 'Kaushik Deb', // t12
    where: 'NIMHANS, Bengaluru · 26–27 Mar 2026', // t14
  },
  {
    id: 'delegates',
    prints: ['delegates'],
    tag: 'DELEGATES · WORLD SUMMIT AI', // t15
    title: 'World Summit AI 2025, Amsterdam', // t16
    who: 'Kaushik Deb · Abhinav Dubey · Tushar Satish', // t17
    where: 'Amsterdam · 8–9 Oct 2025', // t19
  },
]
/** 63 t08 */
export const PATENT_TEXT = { a: 'Ask business data questions in ', bold: 'plain English', b: ' and get clear answers.' }
/** 63 t13 */
export const SPEAKER_TEXT = 'Build, Monitor, Govern: three pillars for running AI agents safely at scale.'
/** 63 t18 */
export const DELEGATES_TEXT = "The world's leading AI summit. Theme: “Back to the Future: It's About Time”."

/**
 * 63, the judges' page (the owner's own document, public/keynote/owner/team/judges-panel.png): the
 * title is the award as the owner named it (19 Nov); the other lines are the words printed on that page.
 */
export const JUDGES = {
  title: 'Gartner - Eye of Innovation 2026' /* owner, 19 Nov: the award's name */,
  who: 'Jaydeep Chakrabarty',
  role: 'Senior Vice President - Head of AI',
  org: 'Piramal Finance',
}

/** 64 t04, t05: the legend. The closing word is slide 64's own title (deck.ts). */
export const LEGEND = { people: 'Our people', ai: 'Our AI teammates' }
