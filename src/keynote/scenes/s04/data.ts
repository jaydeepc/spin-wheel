/**
 * Slide 04: the words and numbers of the slide, copied from the source pack
 * (exports/_rig/keynote-src/pack/04/: text.json, data.json, vector/chart-growth-book.svg).
 * Copied and pasted, never retyped. The headline is deck.ts → title (text.json → t01).
 */

/** text.json → t02 (subhead, the deck's orange). */
export const SUB = 'Retail crossed 1 lakh Cr AUM mark'
/** text.json → t04 and t31. */
export const UNIT = 'In ₹ Cr.'
/** text.json → t15, t17 (and t34, t38): data.json → charts[].categories. */
export const WHEN = ['Mar-22', 'Sep-26'] as const

export interface Product {
  /** The legend's words: text.json → t18 … t28 (data.json → legendTopToBottom). */
  name: string
  /** data.json → sep26SharesTopToBottomPct: the share the deck prints for Sep-26, in %. */
  share: number
  /**
   * The segment's height in the DECK'S OWN DRAWING (pack/04/vector/chart-growth-book.svg, in the
   * chart's own units; one unit is about ₹493 Cr): what the columns are drawn from, so both stand
   * to scale and the thin, unnumbered slices of Mar-22 are the deck's, not ours. These are
   * never printed as figures.
   */
  sep: number
  mar: number
  /** The colour here. The deck's two purples (corporate, real estate) are navy tints: SCENES.md → Rulings. */
  color: string
}

/** The growth book's eleven lines of business, from the foot of the column up (the legend reads the other way). */
export const PRODUCTS: readonly Product[] = [
  { name: 'Housing loans', share: 31, sep: 69.6, mar: 29.4, color: '#071a50' },
  { name: 'Loan against property', share: 27, sep: 61.8, mar: 11.4, color: '#2c4f9a' },
  { name: 'Used car loans', share: 5, sep: 12.0, mar: 0.6, color: '#5f8fd6' },
  { name: 'Loan against securities', share: 2, sep: 3.6, mar: 0, color: '#a9c8f0' },
  { name: 'Salaried personal loans', share: 8, sep: 18.6, mar: 0, color: '#e8501f' },
  // the deck draws ONE 0.6-unit sliver here in Mar-22, with two colours on the same spot; the one on top is "rural micro"
  { name: 'Unsecured business loans', share: 6, sep: 13.2, mar: 0, color: '#f47a50' },
  { name: 'Rural micro loans', share: 2, sep: 3.6, mar: 0.6, color: '#f8a585' },
  { name: 'Digital loans', share: 6, sep: 13.2, mar: 0.6, color: '#fbc9b3' },
  { name: 'Other retail', share: 1, sep: 2.4, mar: 1.2, color: '#c5cad6' },
  { name: 'Corporate mid market loans', share: 4, sep: 9.0, mar: 0.6, color: '#5b6fa6' },
  { name: 'Real estate', share: 9, sep: 19.2, mar: 0, color: '#95a2c8' },
]

/** data.json → charts[0] ("growth-book"). */
export const GROWTH = {
  /** text.json → t03 */
  title: 'Growth book has grown 5x to ₹1.11 Lakh Cr',
  /** data.json → totals (printed as "22,010" and "1,11,440": text.json → t12, t06) */
  totals: [22010, 111440] as const,
  /** data.json → mar22SharesPrinted: the only two shares the deck prints for Mar-22 (text.json → t14, t13) */
  marPrinted: { 'Housing loans': '66%', 'Loan against property': '26%' } as Record<string, string>,
  /** data.json → callout (text.json → t05) */
  callout: '5x',
}

/** data.json → charts[1] ("legacy-book"). */
export const LEGACY = {
  /** text.json → t30 */
  title: 'Legacy book reduced by 96% to 1.5% of total AUM',
  /** data.json → values (printed as "43,175" and "1,673": text.json → t32, t36) */
  values: [43175, 1673] as const,
  /** data.json → shareOfTotalAumPrinted (text.json → t33, t37) */
  share: ['66%', '1.5%'] as const,
  /** data.json → callout "Down 96%" (text.json → t35): the word, the figure, the sign */
  callout: { word: 'Down', pct: 96, sign: '%' },
}

/** The deck's "good news" green (the arrow and the triangle): a signal, not a brand colour. vector/slide-art.svg → #00b050 */
export const GREEN = '#00b050'
