/**
 * Slides 36, 37, 38: the ABCD Banking Agent reads three customers' statements.
 * Every string is copied from exports/_rig/keynote-src/pack/NN/text.json / data.json (block ids in
 * the comments). Rectangles of the EXTRA privacy masks are in the pixels of the statement picture.
 */

export type Accent = 'flame' | 'azure'

export interface Finding {
  /** the cut-out narration line (a real document: shown as it is, at the width the deck shows it) */
  cut: string
  /** its pixels */
  px: [number, number]
  /** the chip it resolves into */
  chip: string
  /** EXTRA masks over the cut-out itself: [x, y, w, h] in the cut-out's pixels */
  masks?: [number, number, number, number][]
}

export interface Customer {
  n: 36 | 37 | 38
  accent: Accent
  /** headline words the deck sets in flame */
  flame: string[]
  /** the name exactly as the deck types it, with its block characters */
  name: string
  desc: [string, string]
  descBold: string[]
  photo: string
  photoPx: [number, number]
  statement: string
  statementPx: [number, number]
  pages: number
  /** EXTRA masks laid over what the deck's own masks leave readable: [x, y, w, h] in the picture's pixels */
  masks: [number, number, number, number][]
  /** the same kind of extra mask on the statement's red header chip (red ground, pale dots) */
  masksOnRed?: [number, number, number, number][]
  /**
   * The rows of the page the scanning light passes: each one glints as the light crosses it and
   * goes dark again. Every row of the table, not chosen ones: NO row of page 1 is claimed to be
   * a finding (the lines that are found come out of the stack: they are on later pages).
   */
  reads: [number, number, number, number][]
  /** an alert: the card speaks only AFTER the line has been found (36 states a task, so it speaks first) */
  alert: boolean
  cardLabel: string
  cardText: string
  findings: Finding[]
  says: string
  saysBold: string[]
}

export const CUSTOMERS: Customer[] = [
  {
    n: 36,
    accent: 'flame',
    flame: ['ABCD Banking Agent', 'Cashflows of long and UPI heavy statements'],
    name: 'Vi█████ay R███t', // t03
    desc: ['Kirana store owner in Dwarka', 'Applied for UBL'], // t04
    descBold: ['UBL'],
    photo: 'photo-kirana-store-owner.jpg',
    photoPx: [629, 746],
    statement: 'doc-bank-statement-axis-masked.png',
    statementPx: [802, 1131],
    pages: 54, // t05 "54 pages"
    masks: [
      [50, 205, 60, 16], // a remnant of the holder's address under the deck's mask
      [352, 296, 44, 20], // the last five digits of the account number
      // the Particulars cell of every row that names a person (15 rows)
      [177, 382, 252, 39],
      [177, 422, 252, 29],
      [177, 512, 252, 29],
      [177, 542, 252, 40],
      [177, 583, 252, 29],
      [177, 613, 252, 28],
      [177, 713, 252, 28],
      [177, 742, 252, 29],
      [177, 772, 252, 28],
      [177, 801, 252, 28],
      [177, 830, 252, 28],
      [177, 859, 252, 28],
      [177, 888, 252, 28],
      [177, 917, 252, 29],
      [177, 947, 252, 29],
    ],
    reads: [382, 422, 452, 512, 542, 583, 613, 642, 684, 713, 742, 772, 801, 830, 859, 888, 917, 947, 977].map((y) => [177, y, 252, 27] as [number, number, number, number]),
    alert: false,
    cardLabel: 'IDENTIFIES', // t06 "ABCD IDENTIFIES"
    cardText: '90% UPI heavy transaction activity – Categorise them into meaningful category & Generate Insights', // t07
    findings: [
      { cut: 'doc-upi-line-1-pharmacy.png', px: [659, 96], chip: 'Pharmacy' }, // t08
      {
        cut: 'doc-upi-line-2-utility.png',
        px: [597, 92],
        chip: 'Utiliity', // t09 (the deck's spelling)
        // EXTRA masks: the payee of this line may be a person's given name, with a handle that
        // carries digits. Delete the two lines to show the cut-out bare.
        masks: [
          [64, 15, 318, 30], // the payee and its handle in line 1
          [341, 53, 88, 29], // the payee again at the end of line 2
        ],
      },
      { cut: 'doc-upi-line-3-furniture.png', px: [678, 99], chip: 'Funiture' }, // t10 (the deck's spelling)
      { cut: 'doc-upi-line-4-offline-shopping.png', px: [600, 91], chip: 'Offline Shopping' }, // t11
    ],
    says: '“Kirana store - steady inflows, regular transactions, daily - retail cash flow. Thin ₹15.7k balance - normal for kirana store.”', // t12
    saysBold: ['steady inflows, regular transactions'],
  },
  {
    n: 37,
    accent: 'azure',
    flame: ['ABCD Banking Agent', 'Flight risk, Visa activity'],
    name: 'De████li U██a', // t03
    desc: ['Salaried in local Karimnagar firm', 'Applied for PL'], // t04
    descBold: [],
    photo: 'photo-salaried-applicant.jpg',
    photoPx: [616, 736],
    statement: 'doc-bank-statement-sbi-masked.png',
    statementPx: [805, 1129],
    pages: 14, // t08 "14 pages"
    masks: [
      [440, 55, 312, 140], // branch name, branch address, pin code, branch code, branch e-mail, branch phone
      [300, 150, 20, 26], // a remnant beside the deck's mask of the holder's address
      // the Description cell of every row that carries a name or an account-like number (7 rows)
      [190, 558, 188, 38],
      [190, 598, 188, 38],
      [190, 758, 188, 38],
      [190, 798, 188, 37],
      [190, 837, 188, 38],
      [190, 877, 188, 38],
      [190, 917, 188, 38],
    ],
    reads: [558, 598, 638, 678, 718, 758, 798, 837, 877, 917].map((y) => [190, y, 188, 36] as [number, number, number, number]),
    alert: true,
    cardLabel: 'RAISES ALERT', // t05 "ABCD RAISES ALERT"
    cardText: 'Visa Application detected', // t06
    findings: [{ cut: 'doc-upi-line-visa.png', px: [256, 74], chip: 'VISA application' }], // t07
    says: '“Visa application detected recently – Customer might be at flight risk”', // t09
    saysBold: ['Visa application detected'],
  },
  {
    n: 38,
    accent: 'flame',
    flame: ['ABCD Banking Agent', 'Gaming & Crypto'],
    name: 'Ma████ha G██a', // t03
    // t04. The deck has a second, overlapping description (t05 "Applied for UBL Garage owner in
    // Nasik"): an unresolved edit. t04 matches the photograph (a produce vendor) and is shown.
    desc: ['Food vendor in Nashik', 'Applied for UBL'],
    descBold: [],
    photo: 'photo-food-vendor.jpg',
    photoPx: [600, 753],
    statement: 'doc-bank-statement-indusind-masked.png',
    statementPx: [804, 1130],
    pages: 27, // t09 "27 pages"
    masks: [
      [330, 320, 84, 22], // the customer ID in "Relationship Summary for Customer ID - …"
      [696, 772, 22, 18], // a stray digit beside the deck's mask
      // the Particulars cell of the three transaction rows (names and UPI handles)
      [178, 888, 166, 62],
      [178, 960, 166, 44],
      [178, 1014, 166, 26],
    ],
    masksOnRed: [[70, 88, 110, 18]], // the account number in the red header chip
    reads: [
      [84, 888, 630, 62],
      [84, 960, 630, 44],
      [84, 1014, 630, 26],
    ],
    alert: true,
    cardLabel: 'RAISES ALERT', // t07 "ABCD RAISES ALERT"
    cardText: 'Gaming transactions detected', // t08
    findings: [
      { cut: 'doc-upi-line-gaming-1.png', px: [282, 54], chip: 'Gaming' }, // t10
      { cut: 'doc-upi-line-gaming-2.png', px: [286, 56], chip: 'Gaming' }, // t11
    ],
    says: '“Frequent Gaming transactions found in banking.”', // t12
    saysBold: ['Gaming transactions'],
  },
]

/** 38/t06: the deck prints it on 38 only; here it stays under the customer on all three slides */
export const FOOTNOTE = '*Masked for customer privacy'

/** the statement page on the stage, in --u (22u wide is 422 px at 1920: under the pictures' 802 px) */
export const PAGE = { left: 28.6, top: 16.2, width: 22 }

/**
 * The cut-out lines at the width the deck shows them (images.json placements, rect[2] * 100):
 * 36: 22.5u, 20.3u, 23.2u, 20.4u (still under the pictures' pixels at 1920);
 * 37: 22.9u; 38: 19.6u and 19.9u (256 to 286 px pictures: the deck itself shows them 1.3 to 1.7
 * times their pixels, and at any smaller size the finding is the smallest thing on the slide).
 */
export const CUT_W: Record<number, number[]> = { 36: [22.5, 20.3, 23.2, 20.4], 37: [22.9], 38: [19.6, 19.9] }

/**
 * Where each found line comes out of the fanned stack: `depth` how far down the stack (0 the
 * top page, 1 the last sheet), `y` how far down the page's height.
 */
export const FROM: Record<number, { depth: number; y: number }[]> = {
  36: [
    { depth: 0.22, y: 0.2 },
    { depth: 0.48, y: 0.4 },
    { depth: 0.72, y: 0.6 },
    { depth: 0.95, y: 0.8 },
  ],
  37: [{ depth: 0.75, y: 0.5 }],
  38: [
    { depth: 0.45, y: 0.4 },
    { depth: 0.9, y: 0.64 },
  ],
}
