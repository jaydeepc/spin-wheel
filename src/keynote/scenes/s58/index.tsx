'use client'

/**
 * Slide 58 · "Our Hybrid approach to Frontier APIs vs Open wt using our Own GPU Platform"
 *
 * THE IDEA. The split IS the picture: one stream that divides. A band of requests leaves "Every
 * AI request" and enters "Smart routing"; it comes out as two ribbons whose thicknesses are 36
 * and 64 of that band, and each widens into its lane. The two lanes are not two equal boxes with
 * numbers on them: their HEIGHTS are 36 and 64, so the eye has the answer before the figures
 * have finished counting. Under the hood of the larger lane stands the hardware: a small rack
 * whose sleds push home and light up as the 64% arrives.
 *
 *   route    headline; the stream runs, the router sorts it, the two lanes open; 36% / 64%; the rack
 *   why      the punchline
 *   inside   the row draws in and moves up; "Inside our GPU platform": four steps, left to right
 *   gains    the four benefits
 *
 * While the row has the stage to itself (route, why) it stands TALL; for "inside" it becomes
 * COMPACT (data.ts → row(tall)). The ribbons, the dashes in them and the rack are three.js
 * (flow.ts), on one canvas above the DOM. Without WebGL the deck's own arrows and its server icon
 * stand in.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Count, Headline, Words, type SceneModule } from '../../kit'
import { ICONS } from '../s56/icons'
import { BENEFITS, FRONTIER, GPU, INSIDE, LANE_R, LANE_W, LANE_X, NODE_H, PUNCH, RACK_TALL, RACK_W, REQ, REQUEST, ROU, ROUTER, row, STEPS } from './data'
import { KEYS, makeFlow, type Flow } from './flow'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${n})`
const TALL = row(1)
const SMALL = row(0)

/** the deck's arrows, for one state of the row: only where there is no WebGL for the flow */
const Arrows = ({ r, className }: { r: typeof TALL; className: string }) => (
  <svg className={`s58-arrows ${className}`} viewBox="0 0 100 56.25" aria-hidden="true">
    <path className="s58-arrow--grey" d={`M${REQ[1] + 1.2} ${r.mid} H${ROU[0] - 1.6}`} />
    <path d={`M${ROU[1] + 1} ${r.mid} L${LANE_X - 1.2} ${r.fTop + r.fH / 2}`} />
    <path d={`M${ROU[1] + 1} ${r.mid} L${LANE_X - 1.2} ${r.gTop + r.gH / 2}`} />
  </svg>
)

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 5.5 6.5 6.5L9 18.5" />
  </svg>
)

const scene: SceneModule = {
  beats: ['route', 'why', 'inside', 'gains'],

  Scene: ({ slide }) => (
    <div className="s58">
      <Headline text={slide.title} flame={['Frontier APIs vs Open wt using our Own GPU Platform']} />

      <Arrows r={TALL} className="s58-arrows--tall" />
      <Arrows r={SMALL} className="s58-arrows--small" />

      {/* the two cards and the two lanes are laid out in their COMPACT place (cards) and at their TALL size (lanes); build() does the rest */}
      <div className="s58-nodes">
        <div className="s58-node s58-node--req" style={{ left: u(REQ[0]), top: u(SMALL.mid - NODE_H / 2) }}>
          <span className="s58-ndisc">{ICONS.chat}</span>
          <h3 className="s58-ntitle">{REQUEST.title}</h3>
          <p className="s58-ntext">{REQUEST.text}</p>
        </div>
        <div className="s58-node s58-node--rou" style={{ left: u(ROU[0]), top: u(SMALL.mid - NODE_H / 2) }}>
          <span className="s58-ndisc">{ICONS.shuffle}</span>
          <h3 className="s58-ntitle">{ROUTER.title}</h3>
          <p className="s58-ntext">{ROUTER.text}</p>
        </div>
      </div>

      <div className="s58-lane s58-lane--frontier" style={{ left: u(LANE_X), top: u(TALL.fTop), height: u(TALL.fH) }}>
        <span className="s58-lbg" aria-hidden="true" />
        <div className="s58-fit s58-fit--l">
          <span className="s58-ldisc">{ICONS.cloud}</span>
          <div className="s58-ltxt">
            <h3 className="s58-ltitle">{FRONTIER.title}</h3>
            {FRONTIER.lines.map((l) => (
              <p className="s58-lline" key={l}>
                {l}
              </p>
            ))}
          </div>
        </div>
        <div className="s58-fit s58-fit--r">
          <div className="s58-share">
            <b>
              <Count className="s58-pct" to={FRONTIER.share} suffix="%" />
            </b>
            <span>{FRONTIER.label}</span>
          </div>
        </div>
      </div>
      <div className="s58-lane s58-lane--gpu" style={{ left: u(LANE_X), top: u(TALL.gTop), height: u(TALL.gH) }}>
        <span className="s58-lbg" aria-hidden="true" />
        {/* the rack's place: the rack itself is three.js (flow.ts); without WebGL the deck's server icon stands here */}
        <span className="s58-rackslot" style={{ width: u(RACK_W) }}>
          <span className="s58-ldisc s58-ldisc--server">{ICONS.server}</span>
        </span>
        <div className="s58-fit s58-fit--l">
          <div className="s58-ltxt">
            <h3 className="s58-ltitle">{GPU.title}</h3>
            {GPU.lines.map((l) => (
              <p className="s58-lline" key={l}>
                {l}
              </p>
            ))}
          </div>
        </div>
        <div className="s58-fit s58-fit--r">
          <div className="s58-share">
            <b>
              <Count className="s58-pct" to={GPU.share} suffix="%" />
            </b>
            <span>{GPU.label}</span>
          </div>
        </div>
      </div>

      <div className="s58-punch">
        <p>
          <Words text={PUNCH} />
        </p>
      </div>

      <h3 className="s58-inside">
        <span className="s58-irule s58-irule--l" aria-hidden="true" />
        <span className="s58-itext">{INSIDE}</span>
        <span className="s58-irule s58-irule--r" aria-hidden="true" />
      </h3>
      {STEPS.map((s, i) => (
        <div className="s58-step" key={s.n} style={{ '--s58-i': i } as CSSProperties}>
          <span className="s58-sdisc">{ICONS[s.icon]}</span>
          <div>
            <h4 className="s58-stitle">
              {s.n}. {s.title}
            </h4>
            <p className="s58-stext">
              {s.lines.map((l, k) => {
                const at = s.bold ? l.indexOf(s.bold) : -1
                return (
                  <span key={k}>
                    {at < 0 ? (
                      l
                    ) : (
                      <>
                        {l.slice(0, at)}
                        <b>{s.bold}</b>
                        {l.slice(at + s.bold.length)}
                      </>
                    )}
                    {k < s.lines.length - 1 ? <br /> : null}
                  </span>
                )
              })}
            </p>
          </div>
          {i < STEPS.length - 1 ? (
            <span className="s58-chev" aria-hidden="true">
              <Chevron />
            </span>
          ) : null}
        </div>
      ))}
      {BENEFITS.map((b, i) => (
        <p className="s58-gain" key={b.text} style={{ '--s58-i': i } as CSSProperties}>
          <span className="s58-gico">{ICONS[b.icon]}</span>
          {b.text}
        </p>
      ))}
    </div>
  ),

  three(ctx) {
    const flow = makeFlow(ctx)
    ctx.bag.flow = flow
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      flow.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const flow = ctx.bag.flow as Flow | undefined
    const st = flow?.state
    const nodes = ctx.$('.s58-nodes')
    const lanes = ctx.$$('.s58-lane')
    const punch = ctx.$('.s58-punch')

    /* ---- the TALL row: while it has the stage to itself ---- */
    const DROP = (TALL.mid - SMALL.mid) * U
    const laneW = LANE_W * U
    const rad = LANE_R * U
    /** per lane: how far it moves up and how much it draws in when the row becomes compact */
    const fold = [
      {
        dy: (SMALL.fTop + SMALL.fH / 2 - (TALL.fTop + TALL.fH / 2)) * U,
        d: ((TALL.fH - SMALL.fH) / 2) * U,
        growL: 1.25,
        growR: 1.25,
      },
      {
        dy: (SMALL.gTop + SMALL.gH / 2 - (TALL.gTop + TALL.gH / 2)) * U,
        d: ((TALL.gH - SMALL.gH) / 2) * U,
        growL: 1,
        growR: 1.1,
      },
    ]
    const clip = (d: number, right: number) => `inset(${d}px ${right}px ${d}px 0px round ${rad}px)`
    const PUNCH_Y = (TALL.gTop + TALL.gH - (SMALL.gTop + SMALL.gH)) * U
    gsap.set(nodes, { y: DROP })
    gsap.set(punch, { y: PUNCH_Y, scale: 1.15, transformOrigin: '50% 50%' })
    gsap.set(lanes, { autoAlpha: 0 })
    lanes.forEach((lane, i) => {
      gsap.set(lane.querySelector('.s58-lbg'), { clipPath: clip(0, laneW) })
      gsap.set(lane.querySelector('.s58-fit--l'), {
        scale: fold[i].growL,
        x: i === 1 ? RACK_W * (RACK_TALL - 1) * U : 0,
        transformOrigin: '0% 50%',
      })
      gsap.set(lane.querySelector('.s58-fit--r'), {
        scale: fold[i].growR,
        transformOrigin: '100% 50%',
      })
    })
    if (st) Object.assign(st, { tall: 1, a: 0, b: 0, rack: 0 })

    /* ---------------------------------------------------------------- route */
    a.words('.kn-h', 0.1)
    a.rise('.s58-node--req', 0.5)
    a.pop('.s58-node--req .s58-ndisc', 0.75)
    a.rise('.s58-node--rou', 0.8)
    a.pop('.s58-node--rou .s58-ndisc', 1.05)
    tl.to(fx, { glow: 0.28, focusX: -0.55, focusY: 0.05, warm: 0.1, duration: 1.4 }, 0.5)
    if (st) {
      // one stream leaves the request card and enters the router …
      tl.to(st, { a: 1, duration: 0.6, ease: 'power2.inOut' }, 1.0)
      // … the router works on it …
      if (!reduced) {
        tl.to(ctx.$('.s58-node--rou .s58-ndisc svg'), { rotation: 360, duration: 0.9, ease: ease.inOut }, 1.45)
        tl.to(ctx.$('.s58-node--rou .s58-ndisc'), { scale: 1.18, duration: 0.3, ease: 'power2.out' }, 1.5)
        tl.to(ctx.$('.s58-node--rou .s58-ndisc'), { scale: 1, duration: 0.5, ease: 'power2.inOut' }, 1.8)
      }
      // … and it comes out as two: 36 and 64 of the same stream
      tl.to(st, { b: 1, duration: 0.7, ease: 'power2.inOut' }, 1.85)
    } else {
      a.draw('.s58-arrows--tall path', 1.2, { stagger: 0.3 })
    }
    // the two lanes open from the ribbons' ends: their heights are the split
    const L = 2.3
    lanes.forEach((lane, i) => {
      const at = L + i * 0.15
      tl.to(lane, { autoAlpha: 1, duration: 0.01 }, at)
      tl.to(lane.querySelector('.s58-lbg'), { clipPath: clip(0, 0), duration: 0.9, ease: ease.inOut }, at)
      a.rise(Array.from(lane.querySelectorAll('.s58-ldisc, .s58-ltxt')), at + 0.4, { y: 0.9, stagger: 0.08 })
      // the figure arrives once the edge has passed it, and counts there
      a.rise(lane.querySelector('.s58-share'), at + 0.8, { y: 0.9 })
      a.count(lane.querySelector('.s58-pct'), at + 0.85, { duration: 1.3 })
    })
    if (st) {
      // under the hood: the rack stands up, its sleds push home, its lights come on as the 64% arrives
      tl.to(st, { rack: 1, duration: 0.7, ease: reduced ? 'none' : ease.snap }, L + 0.55)
      KEYS.forEach((k, i) => {
        tl.to(st.seat, { [k]: 1, duration: 0.55, ease: ease.out }, L + 1.0 + i * 0.13)
        tl.to(st.lit, { [k]: 1, duration: 0.3, ease: 'power1.out' }, L + 1.45 + (3 - i) * 0.16)
      })
    }
    tl.to(fx, { focusX: 0.5, warm: 0.4, glow: 0.34, duration: 1.6, ease: ease.inOut }, L)
    tl.addLabel('route', L + 2.4)

    /* ------------------------------------------------------------------ why */
    const Y = L + 2.4
    a.words('.s58-punch', Y, { stagger: 0.035 })
    tl.to(fx, { focusY: 0.45, glow: 0.4, duration: 1.2, ease: ease.inOut }, Y)
    tl.addLabel('why', Y + 1.4)

    /* --------------------------------------------------------------- inside */
    // the row draws in and moves up: the lanes stay 36 : 64, the ribbons and the rack follow
    const I = Y + 1.4
    const fold1 = { duration: 1.0, ease: ease.inOut }
    tl.to(nodes, { y: 0, ...fold1 }, I)
    tl.to(punch, { y: 0, scale: 1, ...fold1 }, I)
    lanes.forEach((lane, i) => {
      tl.to(lane, { y: fold[i].dy, ...fold1 }, I)
      tl.to(lane.querySelector('.s58-lbg'), { clipPath: clip(fold[i].d, 0), ...fold1 }, I)
      tl.to(lane.querySelectorAll('.s58-fit'), { scale: 1, x: 0, ...fold1 }, I)
    })
    if (st) tl.to(st, { tall: 0, ...fold1 }, I)
    else {
      tl.to(ctx.$('.s58-arrows--tall'), { autoAlpha: 0, duration: 0.3 }, I)
      a.fade('.s58-arrows--small', I + 0.8)
    }
    a.rise('.s58-itext', I + 0.55)
    a.rule('.s58-irule--l', I + 0.7, { from: 'right', duration: 0.8 })
    a.rule('.s58-irule--r', I + 0.7, { from: 'left', duration: 0.8 })
    ctx.$$('.s58-step').forEach((step, i) => {
      const at = I + 0.95 + i * 0.42
      a.rise(step, at, { x: -1.6, y: 0 })
      a.pop(step.querySelector('.s58-sdisc'), at + 0.15)
      a.pop(step.querySelector('.s58-chev'), at + 0.45, { from: 0.3 })
    })
    tl.to(
      fx,
      {
        focusX: 0,
        focusY: 0.6,
        warm: -0.1,
        glow: 0.3,
        duration: 1.6,
        ease: ease.inOut,
      },
      I,
    )
    tl.addLabel('inside', I + 3.1)

    /* ---------------------------------------------------------------- gains */
    const G = I + 3.1
    a.rise('.s58-gain', G, { y: 0.9, stagger: 0.2 })
    a.pop('.s58-gico', G + 0.1, { stagger: 0.2 })
    tl.addLabel('gains', G + 1.5)
    return tl
  },
}

export default scene
