'use client'

/**
 * /ir slide 05 · "What has AI delivered for us in the past 12 months?"
 *
 * THE IDEA: three answers, each proved on the same stage. On the left the three results stand
 * as a ledger (the deck's own sentences, their figures set large and counting); on the right one
 * card is the stage, and each press clears it and draws the proof of the next answer:
 *
 *   productivity   two sets of three bars grow from the baseline; the last year's bar first
 *                  reaches where the year before stood, then lifts, and half of that lift lights
 *                  up in flame: "AI driving half the uplift"                    (plays on arrival)
 *   risk           nine quarters of 90+ DPD: the level it began at runs on as a dashed line
 *                  while the curve itself falls away under it; an arrow measures the drop
 *   new            the stream of the existing businesses, and two new lines branching off it:
 *                  Digital lending, Cross-sell
 *   shift          the card turns to night and the deck's quote is said on it
 *
 * Everything is drawn from data.ts (the chart objects' own values); nothing is a picture.
 * Labels are printed as the page prints them (one decimal), heights come from the exact values.
 */

import gsap from 'gsap'
import { anim, Card, Count, Headline, Words, type SceneModule } from '../../kit'
import { B, barHeights, Bars, Branches, Fall, L, lx, N } from './chart'
import { NEW_LINES, PRODUCTIVITY, PRODUCTIVITY_TEXTS, QUOTE, RESULTS, RISK } from './data'
import './scene.css'

/** The deck's sentence around its figure. */
const around = (text: string, figure: string) => {
  const i = text.indexOf(figure)
  return { before: text.slice(0, i).trim(), after: text.slice(i + figure.length).trim() }
}

const scene: SceneModule = {
  beats: [...RESULTS.map((r) => r.beat), 'shift'],

  Scene: ({ slide }) => (
    <div className="ir05">
      <Headline text={slide.title} />

      <div className="ir05-rail">
        <span className="ir05-spine" aria-hidden="true">
          <span className="ir05-spine-fill" />
        </span>
        {RESULTS.map((r, k) => {
          const { before, after } = around(r.text, r.figure)
          return (
            <div className="ir05-row" data-k={k} key={r.beat}>
              <span className="ir05-idx">
                <span className="ir05-idx-ghost">{r.n}</span>
                <span className="ir05-idx-on">{r.n}</span>
              </span>
              <div className="ir05-body">
                <p className="ir05-lead">
                  <Words text={before} />
                </p>
                <p className="ir05-fig">
                  <Count to={r.count.to} prefix={r.count.prefix} suffix={r.count.suffix} />
                </p>
                {after ? (
                  <p className="ir05-after">
                    <Words text={after} />
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <Card className="ir05-card">
        <span className="ir05-night" aria-hidden="true" />

        <div className="ir05-panel ir05-panel--1">
          {PRODUCTIVITY.map((d, k) => (
            <div className="ir05-block" data-k={k} key={d.title}>
              <p className="ir05-title">
                {d.title}
                <i className="ir05-unit">{d.unit}</i>
              </p>
              <Bars k={k} />
              <p className="ir05-call">
                <svg className="ir05-tri" viewBox="0 0 12 10" aria-hidden="true">
                  <path d="M6 0.6 11.6 9.6H0.4Z" />
                </svg>
                <b className="ir05-pct">
                  <Count to={d.pct} suffix="%" />
                </b>{' '}
                {d.growth}
                <br />
                <em>{d.ai}</em> {d.rest}
              </p>
            </div>
          ))}
          <span className="ir05-split" aria-hidden="true" />
        </div>

        <div className="ir05-panel ir05-panel--2">
          <p className="ir05-title">{RISK.title}</p>
          <Fall />
        </div>

        <div className="ir05-panel ir05-panel--3">
          <p className="ir05-say">
            <Words text={NEW_LINES.text} bold={NEW_LINES.navy} flame={NEW_LINES.flame} />
          </p>
          <Branches figure={RESULTS[2].figure} after={around(RESULTS[2].text, RESULTS[2].figure).after} />
        </div>

        <div className="ir05-panel ir05-panel--4">
          <svg className="ir05-mark" viewBox="0 0 60 44" aria-hidden="true">
            <path d="M4 40V24C4 11 11 4 24 4v8c-6 0-9 3-9 9h9v19ZM34 40V24c0-13 7-20 20-20v8c-6 0-9 3-9 9h9v19Z" />
          </svg>
          <p className="ir05-quote">
            <Words text={QUOTE.text} />
          </p>
          <p className="ir05-close">
            <Words text={QUOTE.close} flame={[QUOTE.close]} />
          </p>
          <span className="ir05-under" aria-hidden="true" />
        </div>
      </Card>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const q = <E extends Element = SVGElement>(sel: string, within: Element = ctx.root) => Array.from(within.querySelectorAll<E>(sel))

    /* ------------------------------------------------------------- measure first */
    const rows = ctx.$$('.ir05-row')
    const spine = ctx.loc(ctx.$('.ir05-spine'))
    const stops = rows.map((r) => (ctx.loc(r.querySelector('.ir05-idx') as Element).cy - spine.y) / spine.h)
    const fill = ctx.$('.ir05-spine-fill')
    const bodies = ctx.$$('.ir05-body')

    /* ------------------------------------------------------------- the ledger */
    gsap.set(fill, { scaleY: 0, transformOrigin: '50% 0%' })
    gsap.set(ctx.$$('.ir05-idx-on'), { autoAlpha: 0, scale: reduced ? 1 : 0.4 })
    gsap.set(ctx.$$('.ir05-fig'), { autoAlpha: 0, y: reduced ? 0 : 1.1 * U })

    /** Result k lands in the ledger at t: the flame line runs down to it, its disc lights, its words come up. Its figure counts at `countAt`. */
    const land = (k: number, t: number, countAt: number, countFor: number) => {
      const row = rows[k]
      if (stops[k] > 0) tl.to(fill, { scaleY: stops[k], duration: 0.7, ease: ease.glide }, t)
      tl.to(q('.ir05-idx-on', row), { autoAlpha: 1, scale: 1, duration: 0.55, ease: ease.snap }, t + 0.25)
      a.words(q('.ir05-lead', row), t + 0.3, { stagger: 0.04 })
      tl.to(q('.ir05-fig', row), { autoAlpha: 1, y: 0, duration: 0.7, ease: ease.out }, countAt - 0.1)
      a.count(q('.kn-count-n', row), countAt, { duration: countFor })
      a.words(q('.ir05-after', row), countAt + 0.5, { stagger: 0.05 })
      // what was said before steps back
      if (k > 0) tl.to(bodies.slice(0, k), { opacity: 0.4, duration: 0.5, ease: 'power1.out' }, t)
    }

    /* =================================================================== productivity */
    a.words('.kn-h', 0.1)
    a.rise('.ir05-card', 0.35, { y: 2.2 })
    a.rule('.ir05-spine', 0.5, { from: 'top', duration: 0.9 })
    a.pop('.ir05-idx-ghost', 0.6, { stagger: 0.12 })
    land(0, 0.55, 1.0, 1.5)
    a.rise('.ir05-panel--1 .ir05-title', 0.7, { y: 0.8, stagger: 0.2 })
    a.rule('.ir05-split', 0.8, { from: 'top' })

    PRODUCTIVITY.forEach((d, k) => {
      const block = ctx.$$('.ir05-block')[k]
      const s = 0.95 + k * 0.28
      const { h, up } = barHeights(k)
      const bars = q('.ir05-bar', block)
      const vals = q<SVGTextElement>('.ir05-val', block)
      const texts = PRODUCTIVITY_TEXTS[k]
      a.draw(q('.ir05-axis', block), s - 0.15, { duration: 0.6 })
      a.fade(q('.ir05-lab', block), s, { stagger: 0.1 })
      /** the figure over bar i counts with its bar; it ends on the page's own print */
      const counter = (i: number) => {
        const state = { v: 0 }
        const write = () => {
          vals[i].textContent = Math.abs(state.v - d.values[i]) < 1e-6 ? texts[i] : (Math.round(state.v * 10 + 1e-6) / 10).toFixed(1)
        }
        write()
        return { state, write }
      }
      // the two years before
      for (let i = 0; i < 2; i++) {
        const at = s + i * 0.16
        const c = counter(i)
        gsap.set(bars[i], { scaleY: 0, svgOrigin: `${B.CX[i]} ${B.BASE}` })
        gsap.set(vals[i], { autoAlpha: 0, y: h[i] })
        tl.to(bars[i], { scaleY: 1, duration: 0.9, ease: ease.out }, at)
        tl.to(vals[i], { y: 0, duration: 0.9, ease: ease.out }, at)
        tl.to(vals[i], { autoAlpha: 1, duration: 0.25 }, at + 0.05)
        tl.to(c.state, { v: d.values[i], duration: 0.9, ease: ease.out, onUpdate: c.write }, at)
      }
      // the last year: up to where the year before stood …
      const at = s + 0.32
      const c = counter(2)
      const upG = q('.ir05-up', block)
      const prev = q('.ir05-prev', block)
      gsap.set(bars[2], { scaleY: 0, svgOrigin: `${B.CX[2]} ${B.BASE}` })
      gsap.set(vals[2], { autoAlpha: 0, y: h[2] })
      gsap.set(upG, { scaleY: 0, svgOrigin: `${B.CX[2]} ${B.BASE - h[1]}` })
      gsap.set(prev, { scaleX: 0, autoAlpha: 0, svgOrigin: `${B.CX[1] + B.BW / 2 + 3} ${B.BASE - h[1]}` })
      tl.to(bars[2], { scaleY: 1, duration: 0.8, ease: ease.out }, at)
      tl.to(vals[2], { y: up, duration: 0.8, ease: ease.out }, at)
      tl.to(vals[2], { autoAlpha: 1, duration: 0.25 }, at + 0.05)
      tl.to(c.state, { v: d.values[1], duration: 0.8, ease: ease.out, onUpdate: c.write }, at)
      tl.to(prev, { autoAlpha: 1, duration: 0.15 }, at + 0.55)
      tl.to(prev, { scaleX: 1, duration: 0.45, ease: ease.glide }, at + 0.55)
      // … then the uplift
      const lift = at + 0.95
      tl.to(upG, { scaleY: 1, duration: 0.95, ease: ease.inOut }, lift)
      tl.to(vals[2], { y: 0, duration: 0.95, ease: ease.inOut }, lift)
      tl.to(c.state, { v: d.values[2], duration: 0.95, ease: ease.inOut, onUpdate: c.write }, lift)
      // the growth is named, and half of the uplift lights up
      a.rise(q('.ir05-call', block), lift + 0.55, { y: 0.9 })
      a.count(q('.ir05-pct .kn-count-n', block), lift + 0.6, { duration: 0.9 })
      const lit = q('.ir05-up-ai, .ir05-ai', block)
      gsap.set(lit, { autoAlpha: 0 })
      tl.to(lit, { autoAlpha: 1, duration: 0.55, ease: 'power2.out' }, lift + 1.15)
    })
    tl.to(fx, { glow: 0.3, focusX: 0.35, focusY: 0.15, warm: 0.25, duration: 1.6, ease: ease.inOut }, 0.5)
    tl.addLabel('productivity', 4.1)

    /* =================================================================== risk */
    const P = 4.1
    const panel = (n: number) => ctx.$(`.ir05-panel--${n}`)
    gsap.set([panel(2), panel(3), panel(4)], { autoAlpha: 0 })
    a.leave(panel(1), P)
    tl.set(panel(2), { autoAlpha: 1 }, P + 0.12)
    const D = 1.9
    const start = P + 0.95
    land(1, P + 0.1, start + 0.25, D)
    a.rise('.ir05-panel--2 .ir05-title', P + 0.15, { y: 0.8 })
    a.draw('.ir05-panel--2 .ir05-axis', P + 0.25, { duration: 0.6 })
    a.fade('.ir05-q', P + 0.35, { stagger: 0.03 })
    a.fade('.ir05-group', P + 0.5, { stagger: 0.1 })
    // the curve and the level it began at are uncovered by the same edge, left to right
    const edge = ctx.$<SVGRectElement>('.ir05-reveal-rect')
    const level = ctx.$<SVGRectElement>('.ir05-level-rect')
    gsap.set(edge, { scaleX: 0, svgOrigin: '0 0' })
    gsap.set(level, { scaleX: 0, svgOrigin: `${lx(0)} 0` })
    tl.to(edge, { scaleX: 1, duration: D, ease: 'power1.inOut' }, start)
    tl.to(level, { scaleX: 1, duration: D, ease: 'power1.inOut' }, start + 0.1)
    /** when that edge passes point i (the inverse of power1.inOut) */
    const when = (i: number) => {
      const f = lx(i) / L.W
      return start + D * (f < 0.5 ? Math.sqrt(f / 2) : 1 - Math.sqrt((1 - f) / 2))
    }
    const dots = ctx.$$<SVGCircleElement>('.ir05-dot')
    const pts = ctx.$$<SVGTextElement>('.ir05-pt')
    gsap.set(dots, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
    gsap.set(pts, { autoAlpha: 0, y: reduced ? 0 : 6 })
    dots.forEach((dot, i) => {
      tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.4, ease: ease.snap }, when(i) - 0.05)
      tl.to(pts[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: ease.out }, when(i))
    })
    // how far it has come down
    const drop = ctx.$('.ir05-drop')
    const head = ctx.$('.ir05-drop-head')
    gsap.set(drop, { drawSVG: '0%', autoAlpha: 0 })
    gsap.set(head, { autoAlpha: 0, y: reduced ? 0 : -8 })
    tl.to(drop, { autoAlpha: 1, duration: 0.01, ease: 'none' }, start + D + 0.05)
    tl.to(drop, { drawSVG: '100%', duration: 0.6, ease: ease.inOut }, start + D + 0.05)
    tl.to(head, { autoAlpha: 1, y: 0, duration: 0.35, ease: ease.out }, start + D + 0.4)
    tl.to(fx, { focusX: 0.5, focusY: 0.3, warm: 0.05, glow: 0.34, duration: 2.2, ease: ease.inOut }, P + 0.2)
    tl.addLabel('risk', start + D + 0.95)

    /* =================================================================== new */
    const Q = start + D + 0.95
    a.leave(panel(2), Q)
    tl.set(panel(3), { autoAlpha: 1 }, Q + 0.12)
    land(2, Q + 0.1, Q + 2.45, 1.3)
    a.words('.ir05-say', Q + 0.15, { stagger: 0.03 })
    const trunk = ctx.$('.ir05-trunk')
    const trunkHead = ctx.$('.ir05-trunk-head')
    gsap.set(trunk, { drawSVG: '0%', autoAlpha: 0 })
    gsap.set(trunkHead, { autoAlpha: 0, x: reduced ? 0 : -10 })
    tl.to(trunk, { autoAlpha: 1, duration: 0.01, ease: 'none' }, Q + 0.6)
    tl.to(trunk, { drawSVG: '100%', duration: 1.0, ease: ease.glide }, Q + 0.6)
    tl.to(trunkHead, { autoAlpha: 1, x: 0, duration: 0.3, ease: ease.out }, Q + 1.45)
    const nodes = ctx.$$('.ir05-node')
    const branches = ctx.$$('.ir05-branch')
    const merges = ctx.$$('.ir05-merge')
    const pills = ctx.$$('.ir05-pill')
    gsap.set(nodes, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
    gsap.set([...branches, ...merges], { drawSVG: '0%', autoAlpha: 0 })
    gsap.set(pills, { autoAlpha: 0, scale: reduced ? 1 : 0.8, transformOrigin: '50% 50%' })
    branches.forEach((br, i) => {
      const t = Q + 0.95 + i * 0.35
      tl.to(nodes[i], { autoAlpha: 1, scale: 1, duration: 0.4, ease: ease.snap }, t)
      tl.to(br, { autoAlpha: 1, duration: 0.01, ease: 'none' }, t + 0.1)
      tl.to(br, { drawSVG: '100%', duration: 0.7, ease: ease.glide }, t + 0.1)
      tl.to(pills[i], { autoAlpha: 1, scale: 1, duration: 0.55, ease: ease.snap }, t + 0.65)
      // … and on, into the one outlet
      tl.to(merges[i], { autoAlpha: 1, duration: 0.01, ease: 'none' }, t + 1.05)
      tl.to(merges[i], { drawSVG: '100%', duration: 0.55, ease: ease.glide }, t + 1.05)
    })
    // the outlet lands as the branches reach it, and the deck's figure counts on it (with the ledger's)
    const OUT_AT = Q + 2.4
    const out = ctx.$('.ir05-out')
    const outFig = ctx.$<SVGTextElement>('.ir05-out-fig')
    gsap.set(out, { autoAlpha: 0, scale: reduced ? 1 : 0.7, svgOrigin: `${N.OUT_X} ${N.OUT_Y}` })
    tl.to(out, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, OUT_AT)
    tl.to(out, { scale: 1, duration: 0.7, ease: ease.snap }, OUT_AT)
    {
      const r = RESULTS[2]
      const state = { v: 0 }
      const write = () => {
        outFig.textContent = Math.abs(state.v - r.count.to) < 0.5 ? r.figure : `${r.count.prefix ?? ''}${Math.round(state.v).toLocaleString('en-IN')}${r.count.suffix ?? ''}`
      }
      write()
      tl.to(state, { v: r.count.to, duration: 1.3, ease: ease.out, onUpdate: write }, OUT_AT + 0.05)
    }
    a.fade('.ir05-flow', Q + 3.0, { duration: 0.8 })
    tl.to(fx, { focusX: 0.3, focusY: 0.45, warm: 0.3, glow: 0.3, duration: 2, ease: ease.inOut }, Q + 0.2)
    tl.addLabel('new', Q + 4.0)

    /* =================================================================== shift */
    const R = Q + 4.0
    a.leave(panel(3), R)
    // the card turns to night, from its lower left corner
    const night = ctx.$('.ir05-night')
    if (reduced) {
      gsap.set(night, { autoAlpha: 0 })
      tl.to(night, { autoAlpha: 1, duration: 0.6 }, R + 0.02)
    } else {
      gsap.set(night, { clipPath: 'circle(0% at 0% 100%)' })
      tl.to(night, { clipPath: 'circle(150% at 0% 100%)', duration: 1.1, ease: ease.inOut }, R + 0.02)
    }
    tl.set(panel(4), { autoAlpha: 1 }, R + 0.3)
    a.pop('.ir05-mark', R + 0.6, { from: 0.5 })
    a.words('.ir05-quote', R + 0.75, { stagger: 0.05 })
    a.words('.ir05-close', R + 1.75, { stagger: 0.1, duration: 0.9 })
    a.rule('.ir05-under', R + 2.35, { duration: 0.9 })
    // all three answers stand again
    tl.to(bodies, { opacity: 1, duration: 0.6, ease: 'power1.out' }, R + 0.5)
    tl.to(fill, { scaleY: 1, duration: 0.5, ease: ease.glide }, R + 0.5)
    tl.to(fx, { focusX: 0.4, focusY: 0.0, warm: -0.1, glow: 0.42, duration: 2.2, ease: ease.inOut }, R + 0.2)
    tl.addLabel('shift', R + 3.2)

    return tl
  },
}

export default scene
