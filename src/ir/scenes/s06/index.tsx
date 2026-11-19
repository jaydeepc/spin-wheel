'use client'

/**
 * /ir slide 06 · "We are working towards 20-25% AUM CAGR along with RoE of 15%+"
 *
 * THE IDEA: the ambition has two halves, and the slide is laid out as the sentence is said. On
 * the left the growth, on the right the return; under both, what the peers average; last, what
 * drives it.
 *
 *   growth   "At PFL, we are working towards 20-25% AUM CAGR…": ten quarters of Growth AUM rise
 *            from the baseline, and the YoY growth line is drawn over them      (plays on arrival)
 *   roe      "…along with 15%+ RoE": the formula assembles: ~3% RoAUM, the sign, ~5x Leverage,
 *            the sign, and 15%+ ROE lands in flame; under each, the reading the page prints
 *   peers    the FY26 average of the diversified upper layer NBFCs is set as a tick on two
 *            tracks (20%, 15.3%), and our own ambition runs along them in flame (20-25%, 15%+)
 *   ai       the close. The chart has said its part and leaves; where it stood the driver is
 *            said large: "AI to drive maximum impact across operating efficiencies and credit
 *            costs". On the RoE track the way there is travelled: 7.7% today, the next stop
 *            "Working towards 10% ROE in Q4 FY27", and on into 15%+; the ROE tile answers.
 *
 * The small readings under the formula are set exactly as the page prints them ("Q2 FY26: 2.0%",
 * "Sep-26: 3.6%", "Q2 FY26: 7.7%"): see the report, they look like slips of the deck.
 */

import gsap from 'gsap'
import { anim, Count, Headline, Words, type SceneModule } from '../../kit'
import { barH, G, GrowthChart, gx, K, kx, Track } from './chart'
import { AI_LINE, GROWTH, PEERS, ROE, WAY } from './data'
import './scene.css'

const scene: SceneModule = {
  beats: ['growth', 'roe', 'peers', 'ai'],

  Scene: ({ slide }) => (
    <div className="ir06">
      <Headline text={slide.title} />

      {/* the growth */}
      <div className="ir06-col ir06-col--growth">
        <p className="ir06-title">
          <Words text={GROWTH.title} flame={['20-25% AUM CAGR']} />
        </p>
        <GrowthChart />
      </div>

      <span className="ir06-divide" aria-hidden="true" />

      {/* the return */}
      <div className="ir06-col ir06-col--roe">
        <p className="ir06-title">
          <Words text={ROE.title} flame={['15%+ RoE']} />
        </p>
        <div className="ir06-formula">
          {ROE.terms.map((t, i) => (
            <div className="ir06-term" data-i={i} key={t.word}>
              <div className="ir06-tile">
                <b className="ir06-fig">
                  <Count to={t.count.to} prefix={t.count.prefix} suffix={t.count.suffix} />
                </b>
                <span className="ir06-word">{t.word}</span>
              </div>
              <p className="ir06-reading">{t.reading}</p>
            </div>
          ))}
          <svg className="ir06-op ir06-op--times" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6 18 18" />
            <path d="M18 6 6 18" />
          </svg>
          <svg className="ir06-op ir06-op--equals" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 8.5H19" />
            <path d="M5 15.5H19" />
          </svg>
        </div>
      </div>

      {/* what the peers average */}
      <span className="ir06-floor" aria-hidden="true" />
      <p className="ir06-peers-title">
        <i className="ir06-key ir06-key--peer" aria-hidden="true" />
        <span className="ir06-peers-words">{PEERS.title}</span>
        <i className="ir06-key ir06-key--us" aria-hidden="true" />
        <span className="ir06-peers-us">{PEERS.us}</span>
      </p>
      {PEERS.rows.map((r, k) => (
        <div className="ir06-bench" data-k={k} key={r.label}>
          <span className="ir06-bench-label">{r.label}</span>
          <Track k={k} />
        </div>
      ))}

      {/* what drives it */}
      <p className="ir06-ai">
        <span className="ir06-ai-rule" aria-hidden="true" />
        <Words text={AI_LINE} flame={[AI_LINE]} />
      </p>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx

    /* =================================================================== growth */
    // alone on the stage the chart stands in the middle, larger; it steps aside when the return is spoken of
    const growth = ctx.$('.ir06-col--growth')
    if (!reduced) gsap.set(growth, { x: 24.4 * U, scale: 1.2, transformOrigin: '50% 0%' })
    a.words('.kn-h', 0.1)
    a.words('.ir06-col--growth .ir06-title', 0.12, { stagger: 0.03 })
    a.draw('.ir06-axis', 0.15, { duration: 0.7 })
    a.fade('.ir06-q', 0.2, { stagger: 0.03 })
    a.fade('.ir06-group', 0.3, { stagger: 0.1 })
    a.fade('.ir06-legend', 0.3)
    const bars = ctx.$$<SVGRectElement>('.ir06-bar')
    const vals = ctx.$$<SVGTextElement>('.ir06-val')
    bars.forEach((bar, i) => {
      const t = 0.3 + i * 0.075
      const h = barH(GROWTH.aum[i])
      const state = { v: 0 }
      const write = () => {
        vals[i].textContent = String(Math.round(state.v))
      }
      write()
      gsap.set(bar, { scaleY: 0, svgOrigin: `${gx(i)} ${G.BASE}` })
      gsap.set(vals[i], { autoAlpha: 0, y: reduced ? 0 : h - 16 })
      tl.to(bar, { scaleY: 1, duration: 0.95, ease: ease.out }, t)
      tl.to(vals[i], { y: 0, duration: 0.95, ease: ease.out }, t)
      tl.to(vals[i], { autoAlpha: 1, duration: 0.3 }, t + 0.3)
      tl.to(state, { v: GROWTH.aum[i], duration: 0.95, ease: ease.out, onUpdate: write }, t)
    })
    // the growth line, uncovered from the left; each point lands as the edge passes it
    const D = 1.5
    const start = 1.3
    const edge = ctx.$<SVGRectElement>('.ir06-reveal-rect')
    gsap.set(edge, { scaleX: 0, svgOrigin: '0 0' })
    tl.to(edge, { scaleX: 1, duration: D, ease: 'power1.inOut' }, start)
    const when = (i: number) => {
      const f = gx(i) / G.W
      return start + D * (f < 0.5 ? Math.sqrt(f / 2) : 1 - Math.sqrt((1 - f) / 2))
    }
    const dots = ctx.$$<SVGCircleElement>('.ir06-dot')
    const pcts = ctx.$$<SVGTextElement>('.ir06-pct')
    gsap.set(dots, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
    gsap.set(pcts, { autoAlpha: 0, y: reduced ? 0 : 5 })
    dots.forEach((dot, i) => {
      tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.4, ease: ease.snap }, when(i) - 0.05)
      tl.to(pcts[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: ease.out }, when(i))
    })
    tl.to(fx, { glow: 0.3, focusX: -0.45, focusY: 0.05, warm: 0.2, duration: 1.6, ease: ease.inOut }, 0.5)
    tl.addLabel('growth', start + D + 0.5)

    /* =================================================================== roe */
    const P = start + D + 0.5
    if (!reduced) tl.to(growth, { x: 0, scale: 1, duration: 1.0, ease: ease.inOut }, P)
    a.rule('.ir06-divide', P + 0.5, { from: 'top', duration: 0.8 })
    a.words('.ir06-col--roe .ir06-title', P + 0.6, { stagger: 0.05 })
    const terms = ctx.$$('.ir06-term')
    const ops = [ctx.$('.ir06-op--times'), ctx.$('.ir06-op--equals')]
    const sign = (svg: Element, t: number) => {
      const strokes = Array.from(svg.querySelectorAll('path'))
      gsap.set(strokes, { drawSVG: '0%', autoAlpha: 0 })
      tl.to(strokes, { autoAlpha: 1, duration: 0.01, stagger: 0.12, ease: 'none' }, t)
      tl.to(strokes, { drawSVG: '100%', duration: 0.35, stagger: 0.12, ease: ease.glide }, t)
    }
    const tile = (i: number, t: number, big = false) => {
      const el = terms[i].querySelector('.ir06-tile') as Element
      gsap.set(el, { autoAlpha: 0, y: reduced ? 0 : 1.8 * U, scale: reduced ? 1 : big ? 0.8 : 0.94 })
      tl.to(el, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, t)
      tl.to(el, { y: 0, scale: 1, duration: big ? 0.8 : 0.7, ease: big ? ease.snap : ease.out }, t)
      a.count(el.querySelector('.kn-count-n'), t + 0.05, { duration: big ? 1.1 : 0.8 })
      a.fade(terms[i].querySelector('.ir06-reading'), t + (big ? 0.9 : 0.6))
    }
    tile(0, P + 0.9)
    sign(ops[0], P + 1.45)
    tile(1, P + 1.7)
    sign(ops[1], P + 2.25)
    tile(2, P + 2.55, true)
    tl.to(fx, { focusX: 0.5, focusY: -0.05, warm: 0.4, glow: 0.38, duration: 2, ease: ease.inOut }, P + 0.2)
    tl.addLabel('roe', P + 3.9)

    /* =================================================================== peers */
    const Q = P + 3.9
    a.rule('.ir06-floor', Q, { duration: 1.0 })
    a.rise('.ir06-peers-title', Q + 0.2, { y: 0.8 })
    ctx.$$('.ir06-bench').forEach((bench, k) => {
      const t = Q + 0.55 + k * 0.35
      const q = (sel: string) => Array.from(bench.querySelectorAll(sel))
      const r = PEERS.rows[k]
      a.rise(q('.ir06-bench-label'), t, { y: 0, x: -0.8 })
      const rail = q('.ir06-rail')
      gsap.set(rail, { scaleX: 0, svgOrigin: `0 ${K.Y}` })
      tl.to(rail, { scaleX: 1, duration: 0.8, ease: ease.glide }, t)
      // the peers' average is set down as a tick
      const peer = q('.ir06-peer')
      const peerText = q('.ir06-peer-text') as SVGTextElement[]
      gsap.set(peer, { autoAlpha: 0, scaleY: reduced ? 1 : 0, svgOrigin: `${kx(k, r.peer)} ${K.Y}` })
      // (its figure does not count: a quoted average never shows another value)
      gsap.set(peerText, { autoAlpha: 0, y: reduced ? 0 : -5 })
      tl.to(peer, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: ease.snap }, t + 0.55)
      tl.to(peerText, { autoAlpha: 1, y: 0, duration: 0.45, ease: ease.out }, t + 0.75)
      // ours runs on from there in flame
      const ours = q('.ir06-ours')
      gsap.set(ours, { scaleX: 0, autoAlpha: 0, svgOrigin: `${kx(k, r.from)} ${K.Y}` })
      tl.to(ours, { autoAlpha: 1, duration: 0.15 }, t + 1.15)
      tl.to(ours, { scaleX: 1, duration: 0.9, ease: ease.inOut }, t + 1.15)
      const oursText = q('.ir06-ours-text')
      gsap.set(oursText, { autoAlpha: 0, y: reduced ? 0 : 6 })
      tl.to(oursText, { autoAlpha: 1, y: 0, duration: 0.5, ease: ease.out }, t + 1.5)
    })
    tl.to(fx, { focusX: 0, focusY: 0.55, warm: 0.1, glow: 0.3, duration: 2, ease: ease.inOut }, Q + 0.2)
    tl.addLabel('peers', Q + 3.1)

    /* =================================================================== ai */
    const R = Q + 3.1
    // the chart has said its part: the driver is said where it stood
    a.leave('.ir06-chart', R)
    a.rule('.ir06-ai-rule', R + 0.15, { from: 'top', duration: 0.7 })
    a.words('.ir06-ai', R + 0.2, { stagger: 0.07, duration: 0.85 })
    // the way to the return, travelled on the RoE track
    const kNow = kx(1, WAY.now)
    const kNext = kx(1, WAY.next)
    const wayA = ctx.$('.ir06-way-a')
    const wayB = ctx.$('.ir06-way-b')
    const nowDot = ctx.$('.ir06-way-now')
    const nextDot = ctx.$('.ir06-way-next')
    const nowText = ctx.$('.ir06-way-now-text')
    const nextText = ctx.$('.ir06-way-next-text')
    const caption = ctx.$('.ir06-way-caption')
    gsap.set([nowDot, nextDot], { autoAlpha: 0, scale: reduced ? 1 : 0, transformOrigin: '50% 50%' })
    gsap.set([nowText, nextText], { autoAlpha: 0, y: reduced ? 0 : 6 })
    gsap.set(caption, { autoAlpha: 0, y: reduced ? 0 : -6 })
    gsap.set(wayA, { scaleX: 0, autoAlpha: 0, svgOrigin: `${kNow} ${K.Y}` })
    gsap.set(wayB, { scaleX: 0, autoAlpha: 0, svgOrigin: `${kNext} ${K.Y}` })
    const W = R + 1.1
    tl.to(nowDot, { autoAlpha: 1, scale: 1, duration: 0.45, ease: ease.snap }, W)
    tl.to(nowText, { autoAlpha: 1, y: 0, duration: 0.45, ease: ease.out }, W + 0.1)
    tl.to(wayA, { autoAlpha: 1, duration: 0.1 }, W + 0.35)
    tl.to(wayA, { scaleX: 1, duration: 0.7, ease: ease.inOut }, W + 0.35)
    tl.to(nextDot, { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.snap }, W + 0.95)
    tl.to(nextText, { autoAlpha: 1, y: 0, duration: 0.45, ease: ease.out }, W + 1.0)
    tl.to(caption, { autoAlpha: 1, y: 0, duration: 0.5, ease: ease.out }, W + 1.15)
    tl.to(wayB, { autoAlpha: 1, duration: 0.1 }, W + 1.55)
    tl.to(wayB, { scaleX: 1, duration: 0.8, ease: ease.inOut }, W + 1.55)
    // … and the return answers
    const goal = ctx.$('.ir06-term[data-i="2"] .ir06-tile')
    if (!reduced) {
      tl.to(goal, { scale: 1.06, duration: 0.3, ease: 'power2.out' }, W + 2.3)
      tl.to(goal, { scale: 1, duration: 0.55, ease: 'power2.inOut' }, W + 2.6)
    }
    tl.to(fx, { focusX: 0.45, focusY: 0.35, warm: 0.6, glow: 0.46, duration: 2.4, ease: ease.inOut }, R)
    tl.addLabel('ai', W + 3.2)

    return tl
  },
}

export default scene
