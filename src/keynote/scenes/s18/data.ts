/**
 * Slide 18 · the words and rectangles of the deck, copied from
 * exports/_rig/keynote-src/pack/18/ (text.json, data.json, images.json). Nothing here is retyped.
 */

/** text.json → t02: the flame words of the headline. */
export const FLAME = ['they work as one']

/** images.json → photo-puzzle-hands: 1700 x 550, shown whole and as it is. */
export const PHOTO = {
  name: 'photo-puzzle-hands.jpg',
  px: [1700, 550] as const,
}

/** data.json → columns[] (text.json → t03 … t14). */
export const COLUMNS = [
  {
    key: 'pred',
    tone: 'flame',
    title: 'Predictive AI', // t03
    line: 'Predicts what is likely to happen.', // t04
    chips: ['Score', 'Forecast', 'Classify'], // t05, t06, t07
    toolsLabel: 'Tools:', // t08, the bold grey span
    tools: 'Scorecards, regression, tree models', // t08, the rest
  },
  {
    key: 'gen',
    tone: 'azure',
    title: 'GenAI', // t09
    line: 'Understands and creates content.', // t10
    chips: ['Read', 'Write', 'Converse'], // t11, t12, t13
    toolsLabel: 'Tools:', // t14
    tools: 'LLMs, prompts, vector search', // t14
  },
] as const

/** data.json → banner (text.json → t15: the second sentence is the flame span). */
export const BANNER = {
  text: 'Different strengths. Better outcomes together.',
  flame: ['Better outcomes together.'],
}

/** data.json → clippings[] (text.json → x01 … x10: read by eye, checked against the page). */
export const CLIP_A = {
  date: 'AUG 2026',
  headline: 'Banks that unlock value from AI make balanced investments across the entire AI capability stack',
  source: 'McKinsey & Company',
}
export const CLIP_B = {
  date: 'TWO CRUCIAL SUBLAYERS',
  columns: [
    {
      title: 'Industrial AI and machine learning',
      before: 'Reusable tools and pipelines with full MLOps ',
      bold: 'deploy and run LLMs at scale',
      after: ', cost-effectively.',
    },
    {
      title: 'Enterprise data',
      before: 'Stores, transforms and serves large unstructured data sets, ',
      bold: 'critical for training multi-agent systems',
      after: '.',
    },
  ],
  source: 'McKinsey & Company',
}

/** data.json → footnote (text.json → t16). */
export const SOURCE = 'Source: McKinsey & Company on the AI capability stack in banking (Aug 2026)'
