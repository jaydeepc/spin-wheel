'use client'

/**
 * Slide 07 · "Growth business profitability is now driving company performance."
 *
 * The deck's one chart, built in the order the sentence over it is said: what the growth
 * business earned, what the company made of it, where this year stands, and what was guided.
 *
 *   bars       the headline; the card, its axis; Growth PBT rises out of the baseline year by
 *              year, FY23 to FY26, each figure counting on its bar; the deck's note about the
 *              ~₹250 Cr impact arrives beside the 780 it explains
 *   pat        Company PAT lands as a pill over each bar, with the deck's note on 9,969; the step
 *              from 485 to 1,506 is drawn, and "210% YoY profit growth" is underlined
 *   h1         a dashed line sets FY27P apart; its bar rises to 990, its pill 1,006, the deck's
 *              tag beside it
 *   guidance   over that bar the guidance draws itself as a dashed box up to 2,300 and fills
 *              with light (volume.ts: a three.js column of rising light, thinner toward the top: guided,
 *              not earned yet); 2,200-2,300 lands, "50% growth" is underlined
 *
 * The tag beside the solid FY27P bar reads "<< H1 FY26A" in the deck; it is kept as printed
 * (see data.ts) and flagged for the owner.
 */

import gsap from 'gsap'
import { anim, Card, formatCount, Headline, Words, type SceneModule } from '../../kit'
import { BOX, BOX_HALF, G, GLINT, ProfitChart } from './chart'
import { FOOTNOTE, TITLE, UNDER, YEARS } from './data'
import { makeVolume, type Volume } from './volume'
import './scene.css'

/** The card on the stage, in --u (the chart's SVG covers it: 1/10 u per unit). */
const CARD = { left: 4.2, top: 12.5, width: G.W / 10, height: G.H / 10 }

const scene: SceneModule = {
  beats: ['bars', 'pat', 'h1', 'guidance'],

  Scene: ({ slide }) => (
    <div className="s07">
      <Headline text={slide.title} />
      <Card
        className="s07-card"
        tone="peach"
        style={{ left: `calc(var(--u) * ${CARD.left})`, top: `calc(var(--u) * ${CARD.top})`, width: `calc(var(--u) * ${CARD.width})`, height: `calc(var(--u) * ${CARD.height})` }}
      >
        <ProfitChart />
        <p className="s07-title">
          <Words text={TITLE} />
        </p>
        <span className="s07-mark" data-for="210" aria-hidden="true" />
        <span className="s07-mark" data-for="50" aria-hidden="true" />
      </Card>
      <p className="s07-under">{UNDER}</p>
      <p className="s07-src">{FOOTNOTE}</p>
    </div>
  ),

  three(ctx) {
    // the light inside the guidance box, exactly over the box the SVG draws
    const vol = makeVolume(ctx, { left: CARD.left + BOX.x / 10, top: CARD.top + BOX.y / 10, width: BOX.w / 10, height: BOX.h / 10 })
    ctx.bag.vol = vol
    return vol.gl.dispose
  },

  build(ctx) {
    const { ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const vol = ctx.bag.vol as Volume | undefined
    const q = <E extends Element = SVGElement>(sel: string) => ctx.$$<E>(sel)
    const one = <E extends Element = SVGElement>(sel: string) => ctx.$<E>(sel)

    /* ------------------------------------------------------------- measure first */
    // a stroke under the words of the card's title that each move is about
    const card = ctx.loc(one<HTMLElement>('.s07-card'))
    const words = q<HTMLElement>('.s07-title .kn-w')
    const under = (phrase: string[]) => {
      const texts = words.map((w) => (w.textContent ?? '').trim())
      const i = texts.findIndex((_, k) => phrase.every((p, n) => texts[k + n] === p))
      if (i < 0) return null
      const first = ctx.loc(words[i])
      const last = ctx.loc(words[i + phrase.length - 1])
      if (Math.abs(first.y - last.y) > 2) return null // the phrase broke over two lines: no stroke
      const fs = parseFloat(getComputedStyle(words[i]).fontSize)
      return { x: first.x - card.x + fs * 0.02, y: first.y - card.y + fs * 1.26, w: last.x + last.w - first.x - fs * 0.1 }
    }
    const marks = [
      { el: one<HTMLElement>('.s07-mark[data-for="210"]'), at: under(['210%', 'YoY', 'profit', 'growth']) },
      { el: one<HTMLElement>('.s07-mark[data-for="50"]'), at: under(['50%', 'growth']) },
    ]
    for (const m of marks) if (m.at) gsap.set(m.el, { x: m.at.x, y: m.at.y, width: m.at.w, scaleX: 0, transformOrigin: '0% 50%' })

    /* ------------------------------------------------------------- pieces and their hidden states */
    const bars = q('.s07-bar')
    const vals = q<SVGTextElement>('.s07-val')
    const years = q('.s07-year')
    const pills = q('.s07-pill')
    const calls = q('.s07-call')
    const LAST = YEARS.length - 1
    /** Strokes draw from nothing (hidden as well as undrawn: a stroke of no length with a round cap shows as a dot). */
    const draw = (els: Element[], at: number, duration: number) => {
      if (!els.length) return
      gsap.set(els, { drawSVG: '0%', visibility: 'hidden' })
      tl.set(els, { visibility: 'inherit' }, at)
      tl.to(els, { drawSVG: '100%', duration, ease: ease.glide }, at)
    }
    /** Bar i rises out of the baseline at time t, its figure counting on it. */
    const rise = (i: number, t: number) => {
      const h = YEARS[i].pbt * G.perUnit + 4
      const state = { v: 0 }
      const write = () => {
        vals[i].textContent = formatCount(state.v, 0, 'en')
      }
      if (reduced) {
        gsap.set(bars[i], { autoAlpha: 0 })
        tl.to(bars[i], { autoAlpha: 1, duration: 0.5 }, t)
        return
      }
      gsap.set(bars[i], { y: h })
      write()
      tl.to(bars[i], { y: 0, duration: 1.05, ease: ease.out }, t)
      tl.to(state, { v: YEARS[i].pbt, duration: 1.0, ease: 'power2.out', onUpdate: write }, t)
      // a light runs up it once as it lands
      const glint = bars[i].querySelector('.s07-glint')
      if (glint) tl.to(glint, { y: -(h + GLINT), duration: 0.7, ease: 'power1.inOut' }, t + 0.4)
    }
    /** Pill i comes down onto its place. */
    const land = (i: number, t: number) => {
      gsap.set(pills[i], { autoAlpha: 0, y: reduced ? 0 : -16, scale: reduced ? 1 : 0.9, transformOrigin: '50% 50%' })
      tl.to(pills[i], { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, t)
      tl.to(pills[i], { y: 0, scale: 1, duration: 0.6, ease: ease.snap }, t)
    }
    /** A note comes in at the figure it explains: the leader first, then the box. */
    const note = (k: number, t: number) => {
      const lead = Array.from(calls[k].querySelectorAll('.s07-lead'))
      const rest = Array.from(calls[k].querySelectorAll('rect, text'))
      draw(lead, t, 0.35)
      gsap.set(rest, { autoAlpha: 0, y: reduced ? 0 : 5 })
      tl.to(rest, { autoAlpha: 1, y: 0, duration: 0.55, ease: ease.out }, t + 0.15)
    }
    /** A stroke with an arrow head (the head is the path's last sub-path) draws itself. */
    const arc = (sel: string, t: number) => draw(q(sel), t, 0.8)

    /* =================================================================== bars */
    a.words('.kn-h', 0.1)
    a.rise('.s07-card', 0.4, { y: 2.2 })
    a.words('.s07-title', 0.75, { stagger: 0.022 })
    // the axis first
    draw(q('.s07-axis'), 1.05, 0.9)
    gsap.set(years, { autoAlpha: 0 })
    tl.to(years.slice(0, LAST), { autoAlpha: 1, duration: 0.4, stagger: 0.1 }, 1.2)
    // the whole legend from the first rest: Company PAT waits, quiet, until its beat; so does the year still to come
    const legendPat = one('.s07-legend--pat')
    gsap.set(legendPat, { autoAlpha: 0 })
    tl.to(legendPat, { autoAlpha: 0.4, duration: 0.5 }, 1.4)
    tl.to(years[LAST], { autoAlpha: 0.38, duration: 0.5 }, 1.7)
    a.fade('.s07-legend--pbt', 1.3)
    a.fade('.s07-under', 1.5)
    // then the four years of the growth business
    for (let i = 0; i < LAST; i++) rise(i, 1.5 + i * 0.24)
    // the note on FY25's 780 comes with its bar, once the bar has landed
    note(1, 2.7)
    tl.to(fx, { glow: 0.3, focusX: -0.45, focusY: 0.35, warm: 0.3, duration: 1.0 }, 0.6)
    tl.to(fx, { focusX: 0.2, duration: 1.8, ease: ease.inOut }, 1.5)
    tl.addLabel('bars', 3.4)

    /* =================================================================== pat */
    const P = 3.4
    tl.to(legendPat, { autoAlpha: 1, duration: 0.5 }, P)
    for (let i = 0; i < LAST; i++) land(i, P + 0.2 + i * 0.2)
    note(0, P + 0.75)
    // last year's step: 485 to 1,506
    arc('.s07-arc--210', P + 1.5)
    if (marks[0].at) tl.to(marks[0].el, { scaleX: 1, duration: 0.8, ease: ease.glide }, P + 1.6)
    tl.to(fx, { focusX: 0.18, focusY: 0.0, glow: 0.36, duration: 1.6, ease: ease.inOut }, P)
    tl.addLabel('pat', P + 2.5)

    /* =================================================================== h1 */
    const H = P + 2.5
    const divider = one('.s07-divider')
    gsap.set(divider, { scaleY: 0, svgOrigin: `${G.divider} ${G.dividerTop}` })
    tl.to(divider, { scaleY: 1, duration: 0.8, ease: ease.glide }, H)
    tl.to(years[LAST], { autoAlpha: 1, duration: 0.4 }, H + 0.35)
    rise(LAST, H + 0.45)
    land(LAST, H + 1.1)
    a.rise('.s07-tag--h1', H + 1.0, { y: 0, x: 1.2 })
    tl.to(fx, { focusX: 0.52, focusY: 0.3, duration: 1.4, ease: ease.inOut }, H)
    tl.addLabel('h1', H + 1.9)

    /* =================================================================== guidance */
    const Q = H + 1.9
    // the box rises from the bar's shoulders in the deck's dashes and closes in the middle of its top
    const outline = q<SVGPathElement>('.s07-box')
    const box = { p: reduced ? 1 : 0 }
    const dashes = () => {
      let rest = box.p * BOX_HALF
      const parts: number[] = []
      while (rest > 0.01) {
        const on = Math.min(7, rest)
        parts.push(on)
        rest -= on
        if (rest <= 0.01) break
        const off = Math.min(5, rest)
        parts.push(off)
        rest -= off
      }
      if (!parts.length) parts.push(0)
      if (parts.length % 2 === 0) parts.push(0)
      parts.push(BOX_HALF * 2)
      const d = parts.map((n) => n.toFixed(2)).join(' ')
      for (const o of outline) o.style.strokeDasharray = d
    }
    dashes()
    ctx.onSeek(dashes)
    gsap.set(outline, { autoAlpha: 0 })
    tl.to(outline, { autoAlpha: 1, duration: reduced ? 0.5 : 0.05 }, Q)
    if (!reduced) tl.to(box, { p: 1, duration: 1.3, ease: ease.glide, onUpdate: dashes }, Q)
    // … and fills with light from the bar upward
    const haze = one('.s07-haze')
    gsap.set(haze, { autoAlpha: 0, scaleY: reduced ? 1 : 0, svgOrigin: `${BOX.x} ${BOX.y + BOX.h}` })
    tl.to(haze, { autoAlpha: 1, duration: 0.3 }, Q + 0.1)
    tl.to(haze, { scaleY: 1, duration: 1.3, ease: ease.glide }, Q + 0.1)
    if (vol) {
      vol.state.fill = 0
      vol.state.alpha = 0
      tl.to(vol.state, { alpha: 1, duration: 0.4, ease: 'power1.out' }, Q + 0.1)
      tl.to(vol.state, { fill: 1, duration: reduced ? 0.01 : 1.9, ease: 'power2.out' }, Q + 0.1)
    }
    a.fade('.s07-range', Q + 1.0, { duration: 0.6 })
    // the number the slide is about
    const number = one('.s07-guidance')
    gsap.set(number, { autoAlpha: 0, scale: reduced ? 1 : 0.7, y: reduced ? 0 : 6, transformOrigin: '0% 100%' })
    tl.to(number, { autoAlpha: 1, duration: 0.3 }, Q + 1.05)
    tl.to(number, { scale: 1, y: 0, duration: 0.7, ease: ease.snap }, Q + 1.05)
    a.rise('.s07-tag--guidance', Q + 1.3, { y: 0, x: 1.2 })
    arc('.s07-arc--50', Q + 1.35)
    if (marks[1].at) tl.to(marks[1].el, { scaleX: 1, duration: 0.8, ease: ease.glide }, Q + 1.5)
    a.fade('.s07-src', Q + 1.6)
    tl.to(fx, { focusX: 0.55, focusY: -0.15, glow: 0.46, warm: 0.45, duration: 1.8, ease: ease.inOut }, Q)
    tl.addLabel('guidance', Q + 2.5)
    // the light keeps rising while the presenter talks (volume.ts idles by its own clock, and not when the frame is held)
    return tl
  },
}

export default scene
