/**
 * Slide 19: every word and number, copied from exports/_rig/keynote-src/pack/19/ (text.json,
 * data.json, images.json). Nothing here is retyped from the picture.
 */

/** text.json → t02: the deck's flame words of the headline (two spans, one phrase). */
export const FLAME = ['7 in 10 developer tokens']

/** images.json → photo-padlock-open: px [550, 677]; the deck shows it 18.75u wide. */
export const PADLOCK = { name: 'photo-padlock-open.jpg', px: [550, 677] as const }

/** text.json → t11 (data.json → caption) */
export const CAPTION = { text: 'Open weights means anyone can download the model, run it and tune it.', bold: ['Open weights'] }

/** data.json → stats[0], charts[0] (share-of-tokens) */
export const SHARE = {
  to: 71.5,
  line: 'of tokens on a major developer gateway ran on open-weight models in September.',
  bold: ['open-weight models'],
  bars: [
    { label: 'Apr', value: 13, decimals: 0, tone: 'grey' },
    { label: 'Aug', value: 56, decimals: 0, tone: 'peach' },
    { label: 'Sep', value: 71.5, decimals: 1, tone: 'flame' },
  ],
}

/** data.json → stats[1], charts[1] (price-index; "Price index: Dec 2025 = 100.") */
export const PRICE = {
  to: 47,
  line: 'lower average price per token on that gateway than last December.',
  bold: ['lower average price'],
  bars: [
    { label: 'Dec 2025', value: 100, tone: 'grey' },
    { label: 'Sep 2026', value: 53, tone: 'navy' },
  ],
}

/** text.json → t18 (data.json → underCharts) */
export const UNDER = { text: 'In enterprises that run them, open weights carry 34% of AI tokens (23% a year ago).', bold: ['34% of AI tokens'] }

/** text.json → t19 */
export const WHY = 'WHY ENTERPRISES SWITCH'
/** data.json → whyEnterprisesSwitch; the outline colours are the page's (flame, navy, blue, flame, navy) */
export const PILLS: { text: string; tone: 'flame' | 'navy' | 'azure' }[] = [
  { text: 'Lower unit cost', tone: 'flame' },
  { text: 'Fine-tune freely', tone: 'navy' },
  { text: 'Full control of data and weights', tone: 'azure' },
  { text: 'No lock-in', tone: 'flame' },
  { text: 'Sovereignty', tone: 'navy' },
]

/** data.json → clippings (text.json x01 … x08, read by eye; checked against the page) */
export const CLIPS = [
  {
    date: 'OCT 2026',
    text: '42% of 200 enterprises now run open-weight models in production, up from 31% in July',
    source: 'Futurum Group',
    tape: 'flame' as const,
    tilt: 1.1,
  },
  {
    date: 'OCT 2026',
    text: 'Open weight takes 71.5% of tokens and 23% of spend',
    source: 'Vercel, AI Gateway Production Index',
    tape: 'navy' as const,
    tilt: -1.3,
  },
]

/** text.json → t23 */
export const SOURCES =
  'Sources: Vercel, AI Gateway Production Index (Oct 2026); Futurum Group, Enterprises Embrace Open Weights (27 Oct 2026). Price index: Dec 2025 = 100.'
