'use client'

/**
 * /ir slide 03 · "On track to meet all FY27 targets…"
 *
 * THE IDEA: "on track" is drawn as tracks. Each of the three measures is a pair of lanes on its
 * own scale. The upper lane is last year's run: from the Q2 FY26 reading to where FY26 ended.
 * The lower lane is this year's: a marker runs up to the Q2 FY27 reading, and the stretch that is
 * left to the FY27 target's gate is drawn as a dashed line. For PAT the marker goes THROUGH the
 * gate, and the gate fills as it is passed. The two figures of the deck's columns stand at the
 * right: each arrives whole, FY26 as last year's run ends, the target as its gate answers. No
 * figure counts through values the deck does not print. The deck's green tick is stamped on the row. The ROE banner is the conclusion: one more track, on navy.
 *
 *   aum     the headline, the three rows and their lanes; row 1 runs      (plays on arrival)
 *   pat     row 2
 *   roaum   row 3
 *   roe     the banner: Q2 FY27 7.7%, the gate at 10%
 *
 * Every word and number is the deck's (data.ts). Each row has its own scale (they are three
 * different measures); inside a row the four readings stand where their values put them.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Headline, Words, type SceneModule } from '../../kit'
import { HEAD, MEASURES, ROE, ROE_W, TRACK_W, type Measure } from './data'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${+n.toFixed(3)})`
const at = (left: number, width?: number): CSSProperties => ({ left: u(left), ...(width === undefined ? null : { width: u(width) }) })
const pos = (m: { min: number; max: number }, v: number, w = TRACK_W) => ((v - m.min) / (m.max - m.min)) * w
const fmt = (v: number, d: number) => v.toFixed(d)

const Tick = () => (
  <span className="ir03-tick" aria-hidden="true">
    <span className="ir03-tick-ring" />
    <svg viewBox="0 0 48 48" fill="none">
      <circle className="ir03-tick-o" cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="3.4" />
      <path className="ir03-tick-v" d="M14.5 24.6 21.4 31.4 36.5 12.5" stroke="currentColor" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

/** A gate that has been passed: filled, with a tick. */
const GateOn = ({ left, at: part }: { left: number; at: number }) => (
  <span className="ir03-gate-on" style={at(left)} data-at={part}>
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6.6 12.4 10.4 16 17.6 8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
)

const Row = ({ m, i }: { m: Measure; i: number }) => {
  const x = (v: number) => pos(m, v)
  const passed = m.q2fy27 >= m.target
  return (
    <section className="ir03-row" style={{ top: u(16.4 + i * 9.5) }}>
      <span className="ir03-no">{m.n}</span>
      <div className="ir03-name">
        <b>
          <Words text={m.name} bold={m.bold ? [m.bold] : undefined} />
        </b>
        {m.sub ? <small>{m.sub}</small> : null}
      </div>

      <div className="ir03-track">
        {/* the two lanes, named once each */}
        <span className="ir03-tag ir03-tag--26">{HEAD.fy26}</span>
        <span className="ir03-tag ir03-tag--27">{HEAD.fy27}</span>

        {/* last year's run: Q2 FY26 to FY26 */}
        <span className="ir03-lane ir03-lane--26" />
        <span className="ir03-run26" style={at(x(m.q2fy26), x(m.fy26) - x(m.q2fy26))} />
        <span className="ir03-q26" style={at(x(m.q2fy26))} />
        <span className="ir03-end26" style={at(x(m.fy26))} />
        <span className="ir03-cap ir03-cap--26" style={at(x(m.q2fy26))}>
          <span className="ir03-cap-in">
            Q2 FY26: {fmt(m.q2fy26, m.decimals)}%
          </span>
        </span>

        {/* this year's: up to Q2 FY27, the rest of the way to the target dashed */}
        <span className="ir03-lane ir03-lane--27" />
        <span className="ir03-run27" style={at(0, x(m.q2fy27))} />
        {passed ? null : <span className="ir03-togo" style={at(x(m.q2fy27), x(m.target) - x(m.q2fy27))} />}
        <span className="ir03-gate" style={at(x(m.target))} />
        {passed ? <GateOn left={x(m.target)} at={x(m.target) / x(m.q2fy27)} /> : null}
        <span className="ir03-ping" style={at(x(m.target))} />
        <span className="ir03-mark" style={at(x(m.q2fy27))} data-far={x(m.q2fy27)} />
        <span className="ir03-cap ir03-cap--27" style={at(x(m.q2fy27))}>
          <span className="ir03-cap-in">
            Q2 FY27: {fmt(m.q2fy27, m.decimals)}%
          </span>
        </span>
      </div>

      <b className="ir03-fig ir03-fig--26">
        {fmt(m.fy26, m.decimals)}%
      </b>
      <b className="ir03-fig ir03-fig--27">
        ~{fmt(m.target, m.decimals)}%
      </b>
      <Tick />
    </section>
  )
}

/** how strongly a row's gate shows before its own beat */
const WAIT = 0.35

const scene: SceneModule = {
  beats: [...MEASURES.map((m) => m.beat), 'roe'],

  Scene: ({ slide }) => (
    <div className="ir03">
      <Headline text={slide.title} flame={['FY27 targets…']} />

      <span className="ir03-head ir03-head--26">{HEAD.fy26}</span>
      <span className="ir03-head ir03-head--27">{HEAD.target}</span>

      {MEASURES.map((m, i) => (
        <Row m={m} i={i} key={m.beat} />
      ))}

      <div className="ir03-roe">
        <p className="ir03-roe-text">
          <Words text={ROE.text} bold={ROE.bold} />
        </p>
        <div className="ir03-roe-track">
          <span className="ir03-lane ir03-roe-lane" />
          <span className="ir03-run27 ir03-roe-run" style={at(0, pos(ROE, ROE.q2fy27, ROE_W))} />
          <span className="ir03-togo ir03-roe-togo" style={at(pos(ROE, ROE.q2fy27, ROE_W), pos(ROE, ROE.target, ROE_W) - pos(ROE, ROE.q2fy27, ROE_W))} />
          <span className="ir03-gate ir03-roe-gate" style={at(pos(ROE, ROE.target, ROE_W))} />
          <span className="ir03-ping ir03-roe-ping" style={at(pos(ROE, ROE.target, ROE_W))} />
          <span className="ir03-mark ir03-roe-mark" style={at(pos(ROE, ROE.q2fy27, ROE_W))} data-far={pos(ROE, ROE.q2fy27, ROE_W)} />
          <span className="ir03-cap ir03-roe-cap" style={at(pos(ROE, ROE.q2fy27, ROE_W))}>
            <span className="ir03-cap-in">
              Q2 FY27: {fmt(ROE.q2fy27, 1)}%
            </span>
          </span>
          <b className="ir03-roe-goal" style={at(pos(ROE, ROE.target, ROE_W) + 1.5)}>
            {ROE.target}%
          </b>
        </div>
      </div>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const rows = ctx.$$('.ir03-row')

    const ping = (els: Element[], t: number, to = 3.2, dur = 0.8) => {
      if (!els.length) return
      gsap.set(els, { autoAlpha: 0, scale: 1 })
      if (reduced) return
      tl.to(
        els,
        {
          keyframes: [
            { autoAlpha: 0.9, scale: 1.1, duration: 0.05, ease: 'none' },
            { autoAlpha: 0, scale: to, duration: dur, ease: 'power2.out' },
          ],
        },
        t,
      )
    }

    /**
     * This year's lane: the marker runs up to its reading; its caption arrives, whole, as it lands.
     * Short of the target, the rest of the way is dashed and the gate answers. Through the target,
     * the gate fills as the marker passes it. Returns { hit: when the gate answers, done }.
     */
    const runTo = (q: (sel: string) => Element[], t: number): { hit: number; done: number } => {
      const mark = q('.ir03-mark') as HTMLElement[]
      const far = Number(mark[0]?.dataset.far ?? 0) * U
      const run = q('.ir03-run27')
      const on = q('.ir03-gate-on')
      const gate = q('.ir03-gate')
      const d = 1.25
      gsap.set(run, { scaleX: 0, transformOrigin: '0% 50%' })
      gsap.set(mark, { autoAlpha: 0, x: reduced ? 0 : -far })
      tl.to(mark, { autoAlpha: 1, duration: 0.2, ease: 'none' }, t)
      tl.to(run, { scaleX: 1, duration: d, ease: 'power2.inOut' }, t)
      if (!reduced) tl.to(mark, { x: 0, duration: d, ease: 'power2.inOut' }, t)
      a.rise(q('.ir03-cap--27 .ir03-cap-in, .ir03-roe-cap .ir03-cap-in'), t + d - 0.1, { y: 0.6, duration: 0.45 })

      let hit: number
      if (on.length) {
        // through the gate: where a power2.inOut run is over it
        const p = Math.min(0.98, Math.max(0.02, Number((on[0] as HTMLElement).dataset.at ?? 0.5)))
        hit = t + d * (p < 0.5 ? Math.sqrt(p / 2) : 1 - Math.sqrt((1 - p) / 2))
        gsap.set(on, { autoAlpha: 0, scale: reduced ? 1 : 0.3 })
        tl.to(on, { autoAlpha: 1, duration: 0.12, ease: 'none' }, hit)
        if (!reduced) tl.to(on, { scale: 1, duration: 0.55, ease: 'back.out(3)' }, hit)
        ping(q('.ir03-ping'), hit, 4.2, 1.2)
      } else {
        a.wipe(q('.ir03-togo'), t + d - 0.05, { from: 'left', duration: 0.7 })
        hit = t + d + 0.55
        ping(q('.ir03-ping'), hit)
        if (!reduced) {
          tl.to(gate, { scale: 1.35, duration: 0.14, ease: 'power2.out' }, hit)
          tl.to(gate, { scale: 1, duration: 0.5, ease: 'back.out(2.6)' }, hit + 0.14)
        }
      }
      return { hit, done: t + d + 0.7 }
    }

    /* ---- the frame: headline, column heads, the three rows with their lanes and gates ---- */
    a.words('.kn-h', 0.1)
    a.rise('.ir03-head', 0.55, { y: 0.8, stagger: 0.1, duration: 0.6 })
    a.pop('.ir03-no', 0.5, { stagger: 0.12 })
    rows.forEach((r, i) => a.words(r.querySelector('.ir03-name'), 0.6 + i * 0.12, { stagger: 0.03 }))
    a.rise('.ir03-name small', 0.95, { y: 0.5, duration: 0.5 })
    a.rule('.ir03-row .ir03-lane', 0.75, { stagger: 0.05, duration: 0.9 })
    a.fade('.ir03-tag', 0.95, { stagger: 0.04, duration: 0.5 })
    // the gates stand ready; those whose row has not begun wait at a third of their strength
    rows.forEach((r, i) => {
      const gate = r.querySelector('.ir03-gate')
      gsap.set(gate, { autoAlpha: 0, scale: reduced ? 1 : 0.2 })
      tl.to(gate, { autoAlpha: i ? WAIT : 1, scale: 1, duration: 0.5, ease: reduced ? 'none' : 'back.out(2.4)' }, 1.25 + i * 0.12)
    })
    gsap.set(ctx.$('.ir03-roe'), { autoAlpha: 0 })

    let t = 1.5
    MEASURES.forEach((m, i) => {
      const row = rows[i]
      const q = (sel: string) => Array.from(row.querySelectorAll(sel))
      tl.to(fx, { glow: 0.3, focusX: 0.1, focusY: -0.35 + i * 0.3, warm: i % 2 ? 0.1 : -0.1, duration: 1.1, ease: ease.inOut }, t)

      if (i) tl.to(q('.ir03-gate'), { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, t)

      // last year's run: from its Q2 reading to where the year ended; the FY26 figure arrives with its end
      a.pop(q('.ir03-q26'), t, { from: 0.2 })
      a.rise(q('.ir03-cap--26 .ir03-cap-in'), t + 0.1, { y: 0.5, duration: 0.45 })
      a.rule(q('.ir03-run26'), t + 0.25, { duration: 0.85 })
      a.pop(q('.ir03-end26'), t + 0.95, { from: 0.2 })
      a.rise(q('.ir03-fig--26'), t + 0.85, { y: 0.9, duration: 0.5 })

      // this year's; the target arrives, whole, as its gate answers
      const { hit, done } = runTo(q, t + 0.9)
      a.rise(q('.ir03-fig--27'), Math.min(hit, done - 0.5), { y: 0.9, duration: 0.5 })

      // the deck's tick, stamped
      const tick = q('.ir03-tick')
      const ring = q('.ir03-tick-ring')
      gsap.set(q('.ir03-tick-o, .ir03-tick-v'), { drawSVG: '0%', autoAlpha: 0 })
      gsap.set(ring, { autoAlpha: 0, scale: 1 })
      const s = done + 0.05
      if (reduced) {
        a.fade(tick, s)
      } else {
        gsap.set(tick, { autoAlpha: 0, scale: 1.9, rotation: -16 })
        tl.to(tick, { autoAlpha: 1, duration: 0.1, ease: 'none' }, s)
        tl.to(tick, { scale: 1, rotation: 0, duration: 0.32, ease: ease.slam }, s)
        tl.to(tick, { scale: 0.93, duration: 0.07 }, s + 0.32)
        tl.to(tick, { scale: 1, duration: 0.4, ease: 'back.out(3)' }, s + 0.39)
        tl.to(ring, { keyframes: [{ autoAlpha: 0.7, scale: 1.02, duration: 0.05, ease: 'none' }, { autoAlpha: 0, scale: 1.9, duration: 0.7, ease: 'power2.out' }] }, s + 0.32)
      }
      tl.to(q('.ir03-tick-o, .ir03-tick-v'), { autoAlpha: 1, duration: 0.01, ease: 'none' }, s)
      tl.to(q('.ir03-tick-o'), { drawSVG: '100%', duration: 0.3, ease: 'none' }, s)
      tl.to(q('.ir03-tick-v'), { drawSVG: '100%', duration: 0.35, ease: ease.glide }, s + 0.22)

      t = s + 1.0
      tl.addLabel(m.beat, t)
      t += 0.05
    })

    /* ---- the conclusion: 10% ROE by Q4 FY27 ---- */
    const roe = ctx.$('.ir03-roe')
    const rq = (sel: string) => Array.from(roe.querySelectorAll(sel))
    tl.to(fx, { glow: 0.34, focusX: 0, focusY: 0.7, warm: 0.2, duration: 1.2, ease: ease.inOut }, t)
    gsap.set(roe, { autoAlpha: 0, y: reduced ? 0 : 2.4 * U, scale: reduced ? 1 : 0.97 })
    tl.to(roe, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: ease.out }, t)
    a.words(rq('.ir03-roe-text'), t + 0.3, { stagger: 0.05 })
    a.rule(rq('.ir03-roe-lane'), t + 0.4, { duration: 0.8 })
    a.pop(rq('.ir03-roe-gate'), t + 0.9, { from: 0.2 })
    a.rise(rq('.ir03-roe-goal'), t + 1.0, { y: 0.6, duration: 0.5 })
    const { done: end } = runTo(rq, t + 1.0)
    tl.to(fx, { glow: 0.22, focusY: 0.3, warm: 0, duration: 1, ease: ease.inOut }, end)
    tl.addLabel('roe', end + 0.9)
    return tl
  },
}

export default scene
