/**
 * /ir slide 06: every word and number, copied from exports/_rig/ir-src/deck-text.md, from
 * deck.pptx (python-pptx) and, for the chart, from the text records of its own preview
 * (ppt/media/image10.emf: the chart is a linked Excel object, the file holds no values for it;
 * its printed labels are in the EMF as text, digit for digit, and agree with the page picture).
 */

/** The orange line under the headline on the page. */
export const AI_LINE = 'AI to drive maximum impact across operating efficiencies and credit costs'

export const GROWTH = {
  title: 'At PFL, we are working towards 20-25% AUM CAGR…',
  legend: { bars: 'Growth AUM (₹ K Cr)', line: 'YoY growth' },
  quarters: ['1Q', '2Q', '3Q', '4Q', '1Q', '2Q', '3Q', '4Q', '1Q', '2Q'],
  groups: [
    { from: 0, to: 3, text: 'FY25' },
    { from: 4, to: 7, text: 'FY26' },
    { from: 8, to: 9, text: 'FY27' },
  ],
  aum: [58, 63, 68, 74, 79, 86, 91, 98, 104, 111],
  yoy: [51, 45, 40, 36, 38, 37, 34, 33, 32, 30],
}

export const ROE = {
  title: '…along with 15%+ RoE',
  /** figure, word, the small reading under it: paired as the page prints them (p-6.jpg; TextBox 7, 13, 15) */
  terms: [
    { figure: '~3%', count: { to: 3, prefix: '~', suffix: '%' }, word: 'RoAUM', reading: 'Q2 FY26: 2.0%' },
    { figure: '~5x', count: { to: 5, prefix: '~', suffix: 'x' }, word: 'Leverage', reading: 'Sep-26: 3.6%' },
    { figure: '15%+', count: { to: 15, suffix: '%+' }, word: 'ROE', reading: 'Q2 FY26: 7.7%' },
  ],
  next: 'Working towards 10% ROE in Q4 FY27',
}

export const PEERS = {
  title: 'FY26 avg AUM growth and ROE for diversified upper layer NBFCs',
  /** the word for our own marks: the chart title's "At PFL" */
  us: 'PFL',
  rows: [
    // lo/hi: the ends of the unlabelled track (the RoE one reaches down far enough to hold today's reading)
    { label: 'AUM growth', peer: 20, peerText: '20%', decimals: 0, ours: '20-25%', from: 20, to: 25, lo: 10, hi: 30 },
    { label: 'RoE', peer: 15.3, peerText: '15.3%', decimals: 1, ours: '15%+', from: 15, to: null, lo: 5, hi: 20 },
  ],
}

/**
 * The way to the return, on the RoE track, from the page's own figures: today's reading under the
 * ROE tile ("Q2 FY26: 7.7%"), the next stop ("Working towards 10% ROE in Q4 FY27"), then 15%+.
 */
const NOW = ROE.terms[2].reading // 'Q2 FY26: 7.7%'
export const WAY = {
  now: 7.7,
  nowText: NOW.slice(NOW.indexOf(': ') + 2), // '7.7%'
  next: 10,
  nextText: ROE.next.slice(ROE.next.indexOf('10%'), ROE.next.indexOf('10%') + 3), // '10%'
  caption: ROE.next,
}
