/**
 * THE DECK OF /ir. "Implications for Investors": the section presented after lunch at the
 * Investor and Analyst Day. Seven slides: the title, the five content slides of the source deck
 * (exports/_rig/ir-src/deck.pptx; its words are in exports/_rig/ir-src/deck-text.md), and the one
 * closing slide the owner added: "Thank You!", which also holds the invitation to questions and
 * the contacts (scenes/s07).
 *
 * `title` is the slide's own headline, word for word. This deck has no sections: the chrome draws
 * no rail, only a quiet breadcrumb on the content slides.
 *
 * KEEP THIS FILE FREE OF IMPORTS (types apart): the checker (walk_all.mjs --route ir) reads it
 * as it stands.
 */

import type { Slide } from '../keynote/deck'

export const CRUMB = 'IMPLICATIONS FOR INVESTORS'

type Row = [title: string, theme: Slide['theme'], crumb: string[]]

/** Slide n is ROWS[n - 1]. */
const ROWS: Row[] = [
  /* 01 */ ['Implications for Investors', 'dark', []],
  /* 02 */ ['Last year we spoke of AI impact on AUM growth and operating efficiency', 'light', [CRUMB]],
  /* 03 */ ['On track to meet all FY27 targets…', 'light', [CRUMB]],
  /* 04 */ ['…driven by improving operating leverage', 'light', [CRUMB]],
  /* 05 */ ['What has AI delivered for us in the past 12 months?', 'light', [CRUMB]],
  /* 06 */ ['We are working towards 20-25% AUM CAGR along with RoE of 15%+', 'light', [CRUMB]],
  /* 07 */ ['Thank You!', 'dark', []],
]

export const pad = (n: number) => String(n).padStart(2, '0')

/** The slides of the source deck that have a page picture (public/ir/pages/NN.jpg). 7 is new. */
export const PAGES = 6

export const SLIDES: Slide[] = ROWS.map(([title, theme, crumb], i) => {
  const n = i + 1
  return {
    n,
    // 'ir01' to 'ir07': the prefix of everything global in the scene (its folder is scenes/sNN)
    id: `ir${pad(n)}`,
    // no sections: the backdrop's look is the opening's, and the close's on the last one
    section: n > PAGES ? 'close' : 'open',
    crumb,
    title,
    theme,
    // the deck's own page (2880 x 1620); '' for the closing slide, which has none
    page: n <= PAGES ? `/ir/pages/${pad(n)}.jpg` : '',
    thumb: `/ir/thumbs/${pad(n)}.jpg`,
  }
})

export const COUNT = SLIDES.length

export const slide = (n: number): Slide => SLIDES[Math.min(COUNT, Math.max(1, Math.round(n))) - 1]
