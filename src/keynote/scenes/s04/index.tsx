'use client'

/**
 * Slide 04 · "We have built a large, diversified retail-led business"
 *
 * THE IDEA: two books, then and now, and every figure on screen is the height you are looking
 * at. Both cards open on March 2022: a small growth book beside the legacy book (each card keeps
 * its own scale, as the deck does: the two are not drawn against each other).
 * Then the growth book's own column comes out from behind itself, walks to September 2026 and GROWS
 * there, line of business by line of business, while its total counts with it (the number over
 * the column is always the column's height) and the deck's green arrow sweeps from the old top
 * to the new one: 5x. The column then opens into its eleven lines, each with the share the deck
 * prints. Last, the legacy book: the tall bar walks across and comes down to a sliver, its
 * figure counting down with it: "Down 96%".
 *
 *   mar22        headline, the deck's line, both cards; where each book stood in Mar-22
 *   grown        the growth book grows to 1,11,440; the 5x arrow
 *   diversified  the chart makes room; eleven lines of business, each tied to its slice
 *   legacy       the legacy book comes down: 43,175 to 1,673, Down 96%, 1.5%
 *
 * THE CHARTS are the kit's (MultiBarChart: axis, columns, figures, labels) drawn from data.ts;
 * the scene only moves what the kit has drawn (each slice's y and height, the figure's place and
 * its digits) through one plain object on the timeline, so any frame can be held. The legend,
 * the leader lines, the arrow and "Down 96%" are the scene's own SVG inside the kit's charts.
 *
 * Colour: the deck's blues and oranges, its two purples as navy tints; the arrow and the
 * triangle keep the deck's green (a signal for good news, as the ruling allows).
 */

import gsap from 'gsap'
import { anim, Card, formatCount, Headline, MultiBarChart, Words, type BarColumn, type SceneModule } from '../../kit'
import { GREEN, GROWTH, LEGACY, PRODUCTS, SUB, UNIT, WHEN } from './data'
import './scene.css'

/* ---- the charts' geometry: the kit's own arithmetic (kit/charts.tsx → MultiBarChart), in 1/10 u ---- */
const TYPE = 12
const HIGH = 27
const BASE = HIGH * 10 - TYPE * 1.9 // the baseline's y
const PLOT = HIGH * 10 - TYPE * 1.7 - TYPE * 1.9 // the tallest column's height
const FILL = 0.5
/** The growth chart: 26u wide, two slots. */
const GW = 26
const G_SLOT = (GW * 10) / 2
const G_BW = G_SLOT * FILL
const G_X = [0, 1].map((i) => G_SLOT * i + (G_SLOT - G_BW) / 2)
/** The legacy chart: 24u wide. */
const LW = 24
const L_SLOT = (LW * 10) / 2
const L_BW = L_SLOT * FILL
const L_X = [0, 1].map((i) => L_SLOT * i + (L_SLOT - L_BW) / 2)

const SUM_SEP = PRODUCTS.reduce((s, p) => s + p.sep, 0)
const SUM_MAR = PRODUCTS.reduce((s, p) => s + p.mar, 0)
/** One unit of the deck's drawing, here. */
const K = PLOT / SUM_SEP
const N = PRODUCTS.length

/** A slice as the kit draws it: a hair's gap under the next one. */
const sliceH = (h: number) => (h <= 0 ? 0 : Math.max(Math.min(0.5, h), h - 0.8))

/** The legend: one row per line of business, top to bottom as the deck lists them (the column's order, from its top). */
const ROW_PITCH = 19.6
const rowY = (k: number) => BASE - PLOT / 2 + (N - 1 - k - (N - 1) / 2) * ROW_PITCH
const LEGEND_X = 262
const SHARE_X = 444
/** Where slice k of the Sep-26 column has its middle. */
const sliceMid = (k: number) => BASE - (PRODUCTS.slice(0, k).reduce((s, p) => s + p.sep, 0) + PRODUCTS[k].sep / 2) * K

const growthData: BarColumn[] = [
  {
    label: WHEN[0],
    total: formatCount(GROWTH.totals[0], 0, 'in'),
    parts: PRODUCTS.filter((p) => p.mar > 0).map((p) => ({ value: p.mar, color: p.color, text: GROWTH.marPrinted[p.name] })),
  },
  {
    label: WHEN[1],
    total: formatCount(GROWTH.totals[1], 0, 'in'),
    // the two lines that carried the book in Mar-22 keep their figure in the column, so 66% and 26% can be read against 31% and 27%
    parts: PRODUCTS.map((p) => ({ value: p.sep, color: p.color, text: GROWTH.marPrinted[p.name] ? `${p.share}%` : undefined })),
  },
]

const legacyData: BarColumn[] = [
  { label: WHEN[0], total: formatCount(LEGACY.values[0], 0, 'in'), parts: [{ value: LEGACY.values[0], color: 'navy', text: LEGACY.share[0] }] },
  { label: WHEN[1], total: formatCount(LEGACY.values[1], 0, 'in'), parts: [{ value: LEGACY.values[1], color: 'navy' }] },
]

/** The deck's green arrow, as one sweep from the old column's figure to the new column's top. */
const ARC = 'M65 180 C67 112 104 50 149 32'
const legacyH = (v: number) => (v / LEGACY.values[0]) * PLOT
/** The middle of the legacy book's Sep-26 sliver, above the baseline. */
const TINY_MID = legacyH(LEGACY.values[1]) / 2

const scene: SceneModule = {
  beats: ['mar22', 'grown', 'diversified', 'legacy'],

  Scene: ({ slide }) => (
    <div className="s04">
      <Headline text={slide.title} />
      <p className="s04-sub">
        <Words text={SUB} flame={[SUB]} />
      </p>

      <Card className="s04-card s04-card--growth" tone="peach">
        <h2 className="s04-title">{GROWTH.title}</h2>
        <p className="s04-unit">{UNIT}</p>
        <MultiBarChart className="s04-chart s04-growth" width={GW} height={HIGH} fill={FILL} type={TYPE} data={growthData}>
          {/* the Sep-26 column leaves from BEHIND the Mar-22 column: only what has cleared it is drawn */}
          <clipPath id="s04-clip-growth" clipPathUnits="userSpaceOnUse">
            <rect className="s04-clip-g" x={G_X[0] + G_BW} y={-40} width={GW * 10 + 300} height={HIGH * 10 + 80} />
          </clipPath>
          {/* the deck's green arrow and its "5x" */}
          <g className="s04-five">
            <path className="s04-arc" d={ARC} stroke={GREEN} />
            <path className="s04-head" d="M0 0 L-13 -6.4 L-10.4 0 L-13 6.4 Z" transform="translate(158.5 28.4) rotate(-21.5)" fill={GREEN} />
            <text className="s04-x" x={60} y={104} textAnchor="middle">
              {GROWTH.callout}
            </text>
          </g>
          {/* the eleven lines of business: each slice tied to its name and the share the deck prints */}
          {PRODUCTS.map((p, k) => {
            const y = rowY(k)
            const m = sliceMid(k)
            return (
              <g className="s04-row" key={p.name} data-k={k}>
                <path className="s04-lead" d={`M${(G_X[1] + G_BW + 2.5).toFixed(1)} ${m.toFixed(1)} H${(G_X[1] + G_BW + 9).toFixed(1)} L${LEGEND_X - 12} ${y.toFixed(1)} H${LEGEND_X - 4}`} stroke={p.color} />
                <g className="s04-row-in">
                  <rect x={LEGEND_X} y={y - 2.6} width={13} height={5.2} rx={1.2} fill={p.color} />
                  <text className="s04-name" x={LEGEND_X + 18} y={y + 3.7}>
                    {p.name}
                  </text>
                  <text className="s04-share" x={SHARE_X} y={y + 3.9} textAnchor="end">
                    {p.share}%
                  </text>
                </g>
              </g>
            )
          })}
        </MultiBarChart>
      </Card>

      <Card className="s04-card s04-card--legacy" tone="ice">
        <h2 className="s04-title">{LEGACY.title}</h2>
        <p className="s04-unit">{UNIT}</p>
        <MultiBarChart className="s04-chart s04-legacy" width={LW} height={HIGH} fill={FILL} type={TYPE} max={LEGACY.values[0]} data={legacyData}>
          <clipPath id="s04-clip-legacy" clipPathUnits="userSpaceOnUse">
            <rect className="s04-clip-l" x={L_X[0] + L_BW} y={-40} width={LW * 10 + 300} height={HIGH * 10 + 80} />
          </clipPath>
          {/* the sliver's share of total AUM: the deck prints it inside the bar; here it stands beside it, clear of
              the axis, tied to the sliver by a short tick (the bar is to scale) */}
          <path className="s04-tick" d={`M${L_X[1] + L_BW + 2.5} ${(BASE - TINY_MID).toFixed(1)} l7 -9.5 h5`} />
          <text className="s04-tiny" x={L_X[1] + L_BW + 17.5} y={(BASE - TINY_MID - 5.6).toFixed(1)}>
            {LEGACY.share[1]}
          </text>
          <g className="s04-down">
            <path className="s04-tri" d="M126 138 L147 138 L136.5 157 Z" fill={GREEN} />
            <text className="s04-downtext" x={155} y={158}>
              {LEGACY.callout.word} <tspan className="s04-pct">{LEGACY.callout.pct}</tspan>
              {LEGACY.callout.sign}
            </text>
          </g>
        </MultiBarChart>
      </Card>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx

    const growth = ctx.$<SVGSVGElement>('.s04-growth')
    const legacy = ctx.$<SVGSVGElement>('.s04-legacy')
    const one = <E extends Element>(root: Element, sel: string) => {
      const el = root.querySelector<E>(sel)
      if (!el) throw new Error(`[s04] nothing matches ${sel}`)
      return el
    }
    const all = (root: Element, sel: string) => Array.from(root.querySelectorAll(sel))

    // what the kit drew: column 0 is Mar-22, column 1 is Sep-26
    const gMar = { bar: one<SVGGElement>(growth, 'g[data-i="0"] > .kn-bar'), total: one<SVGTextElement>(growth, 'g[data-i="0"] > .kn-bar-val'), segs: all(growth, 'g[data-i="0"] > .kn-bar-seg') }
    const gSep = { bar: one<SVGGElement>(growth, 'g[data-i="1"] > .kn-bar'), total: one<SVGTextElement>(growth, 'g[data-i="1"] > .kn-bar-val'), segs: all(growth, 'g[data-i="1"] > .kn-bar-seg') }
    const gSlices = all(gSep.bar, 'rect')
    const lMar = { bar: one<SVGGElement>(legacy, 'g[data-i="0"] > .kn-bar'), total: one<SVGTextElement>(legacy, 'g[data-i="0"] > .kn-bar-val'), segs: all(legacy, 'g[data-i="0"] > .kn-bar-seg') }
    const lSep = { bar: one<SVGGElement>(legacy, 'g[data-i="1"] > .kn-bar'), total: one<SVGTextElement>(legacy, 'g[data-i="1"] > .kn-bar-val') }
    const lSlice = one<SVGRectElement>(lSep.bar, 'rect')
    const pct = one<SVGTSpanElement>(legacy, '.s04-pct')

    /**
     * EVERYTHING THAT COUNTS is drawn from these four numbers, and from nothing else:
     *   m   0 … 1   the growth book's Mar-22 column standing up
     *   r   0 … 1   the legacy book's Mar-22 bar standing up
     *   p   0 … 1   the growth book's Sep-26 column: 0 is the Mar-22 column again, 1 is Sep-26
     *   v   ₹ Cr    the legacy book's Sep-26 bar: 43,175 down to 1,673
     */
    const st = { m: 0, r: 0, p: 0, v: LEGACY.values[0] }
    const grow = gsap.parseEase('power2.inOut')
    const SPAN = 0.52 // the share of the move one slice takes; the slices start one after another, from the foot
    const LAG = (1 - SPAN) / (N - 1)
    const draw = () => {
      // Mar-22, both books: the figure rides on the column and says its height
      gMar.total.setAttribute('y', (BASE - st.m * SUM_MAR * K - TYPE * 0.5).toFixed(2))
      gMar.total.textContent = formatCount(Math.round(st.m * GROWTH.totals[0]), 0, 'in')
      lMar.total.setAttribute('y', (BASE - st.r * PLOT - TYPE * 0.5).toFixed(2))
      lMar.total.textContent = formatCount(Math.round(st.r * LEGACY.values[0]), 0, 'in')

      // the growth book's Sep-26 column: every slice between what it was and what it is
      let y = BASE
      let sum = 0
      PRODUCTS.forEach((prod, k) => {
        const e = grow(Math.min(1, Math.max(0, (st.p - k * LAG) / SPAN)))
        const units = prod.mar + (prod.sep - prod.mar) * e
        const h = units * K
        sum += units
        y -= h
        const rect = gSlices[k]
        rect.setAttribute('y', y.toFixed(2))
        rect.setAttribute('height', sliceH(h).toFixed(2))
      })
      const t = (sum - SUM_MAR) / (SUM_SEP - SUM_MAR)
      gSep.total.setAttribute('y', (y - TYPE * 0.5).toFixed(2))
      gSep.total.textContent = formatCount(Math.round(GROWTH.totals[0] + (GROWTH.totals[1] - GROWTH.totals[0]) * t), 0, 'in')

      // the legacy book's Sep-26 bar, and how far it has come down
      const h = legacyH(st.v)
      lSlice.setAttribute('y', (BASE - h).toFixed(2))
      lSlice.setAttribute('height', sliceH(h).toFixed(2))
      lSep.total.setAttribute('y', (BASE - h - TYPE * 0.5).toFixed(2))
      lSep.total.textContent = formatCount(Math.round(st.v), 0, 'in')
      pct.textContent = String(Math.round((1 - st.v / LEGACY.values[0]) * 100))
    }

    /* ---------------------------------------------------------------- mar22 */
    a.words('.kn-h', 0.1)
    a.words('.s04-sub', 0.5, { stagger: 0.04 })
    a.rise('.s04-card', 0.6, { y: 2.2, stagger: 0.12, duration: 0.9 })
    a.rise('.s04-title', 0.95, { y: 0.8, stagger: 0.12 })
    a.fade('.s04-unit', 1.2)
    // the growth chart stands in the middle of its card until the legend needs the room
    const SHIFT = 9.6 * U
    gsap.set(growth, { x: SHIFT })
    a.draw('.s04-chart .kn-chart-axis', 1.2, { duration: 0.7, stagger: 0.1 })
    a.fade('.s04-chart .kn-bar-label', 1.35, { stagger: 0.06 })

    // everything that comes later starts hidden
    gsap.set([gMar.total, lMar.total, gSep.total, lSep.total, gSep.bar, lSep.bar, ...gMar.segs, ...gSep.segs, ...lMar.segs], { autoAlpha: 0 })
    gsap.set(ctx.$$('.s04-x, .s04-head, .s04-row-in, .s04-tiny, .s04-down'), { autoAlpha: 0 })
    gsap.set(ctx.$$('.s04-arc, .s04-lead, .s04-tick'), { drawSVG: '0%', autoAlpha: 0 })
    gsap.set([gMar.bar, lMar.bar], { scaleY: 0, transformOrigin: '50% 100%' })

    // where each book stood in Mar-22: the columns stand up, their figures count with them
    const stand = (col: { bar: Element; total: Element; segs: Element[] }, key: 'm' | 'r', at: number, d: number) => {
      tl.to(col.total, { autoAlpha: 1, duration: 0.25 }, at)
      tl.to(col.bar, { scaleY: 1, duration: d, ease: ease.out }, at)
      tl.to(st, { [key]: 1, duration: d, ease: ease.out, onUpdate: draw }, at)
      if (col.segs.length) tl.to(col.segs, { autoAlpha: 1, duration: 0.4, stagger: 0.1 }, at + d * 0.45)
    }
    stand(gMar, 'm', 1.5, 1.0)
    stand(lMar, 'r', 1.7, 1.3)
    tl.to(fx, { glow: 0.12, focusX: 0.5, focusY: 0.2, duration: 1.6 }, 0.6)
    tl.addLabel('mar22', 3.1)

    /* ---------------------------------------------------------------- grown */
    const G = 3.1
    tl.to(fx, { focusX: 0.25, focusY: 0.1, glow: 0.3, warm: 0.15, duration: 1.6, ease: ease.inOut }, G)
    // the Mar-22 column's twin comes out from BEHIND it and walks to Sep-26: the clip (in the twin's own
    // space, so it is moved the other way) keeps it under the Mar-22 column and its "66%" and "26%" until it is clear
    gsap.set([gSep.bar, gSep.total], { x: reduced ? 0 : -G_SLOT })
    gSep.bar.setAttribute('clip-path', 'url(#s04-clip-growth)')
    if (!reduced) {
      const clip = one<SVGRectElement>(growth, '.s04-clip-g')
      gsap.set(clip, { attr: { x: G_X[0] + G_BW + G_SLOT } })
      tl.to(clip, { attr: { x: G_X[0] + G_BW }, duration: 0.8, ease: ease.inOut }, G + 0.1)
    }
    tl.to(gSep.bar, { autoAlpha: 1, duration: reduced ? 0.4 : 0.05, ease: 'none' }, G)
    // (its figure joins once the two columns stand apart, so the same digits are never printed over each other)
    tl.to(gSep.total, { autoAlpha: 1, duration: 0.3, ease: 'none' }, reduced ? G : G + 0.55)
    if (!reduced) tl.to([gSep.bar, gSep.total], { x: 0, duration: 0.8, ease: ease.inOut }, G + 0.1)
    // … and grows there, slice by slice from the foot; the figure over it is its height at every instant
    tl.to(st, { p: 1, duration: 2.1, ease: 'none', onUpdate: draw }, G + 0.8)
    tl.to(gSep.segs, { autoAlpha: 1, duration: 0.4, stagger: 0.12 }, G + 2.3)
    // the deck's green arrow sweeps from the old top to the new one, and lands with the column
    const arc = ctx.$('.s04-arc')
    const head = ctx.$('.s04-head')
    tl.to(arc, { autoAlpha: 1, duration: 0.01, ease: 'none' }, G + 1.75)
    tl.to(arc, { drawSVG: '100%', duration: 1.0, ease: ease.glide }, G + 1.75)
    gsap.set(head, { scale: 0.3, transformOrigin: '100% 50%' })
    tl.to(head, { autoAlpha: 1, scale: 1, duration: 0.4, ease: ease.snap }, G + 2.55)
    a.pop('.s04-x', G + 2.65, { from: 0.5, duration: 0.6 })
    tl.addLabel('grown', G + 3.4)

    /* ---------------------------------------------------------- diversified */
    const D = G + 3.4
    // the chart makes room, and the column opens into its eleven lines: from the foot up, as it grew
    tl.to(growth, { x: 0, duration: 0.95, ease: ease.inOut }, D)
    tl.to(fx, { focusX: -0.15, glow: 0.24, duration: 1.4, ease: ease.inOut }, D)
    ctx.$$('.s04-row').forEach((row) => {
      const k = Number((row as HTMLElement).dataset.k)
      const at = D + 0.55 + k * 0.11
      const lead = row.querySelector('.s04-lead')
      const inner = row.querySelector('.s04-row-in')
      tl.to(lead, { autoAlpha: 0.8, duration: 0.01, ease: 'none' }, at)
      tl.to(lead, { drawSVG: '100%', duration: 0.5, ease: ease.glide }, at)
      if (!reduced) gsap.set(inner, { x: -7 })
      tl.to(inner, { autoAlpha: 1, x: 0, duration: 0.5, ease: ease.out }, at + 0.28)
    })
    tl.addLabel('diversified', D + 0.55 + (N - 1) * 0.11 + 0.28 + 0.5 + 0.25)

    /* --------------------------------------------------------------- legacy */
    const L = D + 0.55 + (N - 1) * 0.11 + 0.28 + 0.5 + 0.25
    tl.to(fx, { focusX: 1.1, focusY: 0.15, warm: -0.45, glow: 0.3, duration: 1.6, ease: ease.inOut }, L)
    // the tall bar's twin comes out from behind it (and from behind its "66%") and walks to Sep-26 …
    gsap.set([lSep.bar, lSep.total], { x: reduced ? 0 : -L_SLOT })
    lSep.bar.setAttribute('clip-path', 'url(#s04-clip-legacy)')
    if (!reduced) {
      const clip = one<SVGRectElement>(legacy, '.s04-clip-l')
      gsap.set(clip, { attr: { x: L_X[0] + L_BW + L_SLOT } })
      tl.to(clip, { attr: { x: L_X[0] + L_BW }, duration: 0.8, ease: ease.inOut }, L + 0.1)
    }
    tl.to(lSep.bar, { autoAlpha: 1, duration: reduced ? 0.4 : 0.05, ease: 'none' }, L)
    tl.to(lSep.total, { autoAlpha: 1, duration: 0.3, ease: 'none' }, reduced ? L : L + 0.55)
    if (!reduced) tl.to([lSep.bar, lSep.total], { x: 0, duration: 0.8, ease: ease.inOut }, L + 0.1)
    // … and comes down. Its figure, and "Down n%", count with its height
    tl.to(st, { v: LEGACY.values[1], duration: 1.7, ease: 'power3.inOut', onUpdate: draw }, L + 0.85)
    const down = ctx.$('.s04-down')
    if (!reduced) gsap.set(down, { y: -14 })
    // (it comes in as the bar's top passes under its place, so the two never cross)
    tl.to(down, { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, L + 1.9)
    const tick = ctx.$('.s04-tick')
    tl.to(tick, { autoAlpha: 0.7, duration: 0.01, ease: 'none' }, L + 2.45)
    tl.to(tick, { drawSVG: '100%', duration: 0.35, ease: ease.glide }, L + 2.45)
    a.fade('.s04-tiny', L + 2.6)
    tl.addLabel('legacy', L + 3.1)

    draw()
    return tl
  },
}

export default scene
