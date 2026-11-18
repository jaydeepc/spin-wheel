'use client'

/**
 * Slide 58 · "Our Hybrid approach to Frontier APIs vs Open Wt. using our own GPU Platform"
 * Rebuilt from the owner's picture of 18 Nov (the pack's page of this slide is superseded).
 *
 * THE IDEA. The slide is a routing story, so the requests are really there: small tokens arrive
 * as a loose scatter, gather into "Every AI request", run as one grey band into "Smart routing"
 * and come out SORTED, blue up to the Frontier band and flame down to the in-house band, on two
 * ribbons that are 36 and 64 of the band while the two figures count. Then the in-house band
 * opens downward into its two homes: the rack on our own floor (units push home, lights come on,
 * training bars run) and the cloud (tokens served out at speed).
 *
 *   route    headline; the scatter, the band, the router sorts, the two bands open; 36% / 64%
 *   homes    the row moves up; the fork runs down; "Train & Fine tune" with the rack, "Inference & Production" with the cloud
 *   why      the closing line
 *   gains    the four benefits
 *
 * Tokens, ribbons, the rack and the served streaks are three.js (flow.ts), on one canvas above
 * the DOM; every word is DOM. Without WebGL plain arrows and a server icon stand in.
 */

import gsap from 'gsap'
import { anim, Count, Headline, Words, type SceneModule } from '../../kit'
import {
  BENEFITS,
  CLOUD_NAME,
  F_TOP,
  FORK_LEFT,
  FORK_RIGHT,
  FORK_TIPS,
  FORK_Y1,
  FRONTIER,
  G_TOP,
  INHOUSE,
  LANE_H,
  LANE_X,
  MID,
  NODE_H,
  PUNCH,
  REQ,
  REQUEST,
  ROU,
  ROUTER,
  SERVE,
  TALL_DY,
  TRAIN,
} from './data'
import { KEYS, makeFlow, type Flow } from './flow'
import { ICONS } from './icons'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${n})`

/** a line with the part the picture sets in Bold */
const Line = ({ text, bold }: { text: string; bold: string }) => {
  const at = bold ? text.indexOf(bold) : -1
  return (
    <p className="s58-pline">
      {at < 0 ? (
        text
      ) : (
        <>
          {text.slice(0, at)}
          <b>{bold}</b>
          {text.slice(at + bold.length)}
        </>
      )}
    </p>
  )
}

const Lane = ({ kind, top, data, icon }: { kind: 'frontier' | 'inhouse'; top: number; data: typeof FRONTIER; icon: keyof typeof ICONS }) => (
  <div className={`s58-lane s58-lane--${kind}`} style={{ left: u(LANE_X), top: u(top), height: u(LANE_H) }}>
    <span className="s58-lbg" aria-hidden="true" />
    <span className="s58-ldisc">{ICONS[icon]}</span>
    <div className="s58-ltxt">
      <h3 className="s58-ltitle">{data.title}</h3>
      {data.lines.map((l) => (
        <p className="s58-lline" key={l}>
          {l}
        </p>
      ))}
    </div>
    <div className="s58-share">
      <b>
        <Count className="s58-pct" to={data.share} suffix="%" />
      </b>
      <span>{data.label}</span>
    </div>
  </div>
)

const scene: SceneModule = {
  beats: ['route', 'homes', 'why', 'gains'],

  Scene: ({ slide }) => (
    <div className="s58">
      <Headline text={slide.title} />

      {/* the routing row: laid out in its final place; build() lets it stand lower while it has the stage to itself */}
      <div className="s58-row">
        {/* plain arrows: only where there is no WebGL for the tokens */}
        <svg className="s58-arrows" viewBox="0 0 100 56.25" aria-hidden="true">
          <path className="s58-arrow--grey" d={`M${REQ[1] + 1.1} ${MID} H${ROU[0] - 1.3}`} />
          <path className="s58-arrow--blue" d={`M${ROU[1] + 1.1} ${MID - 0.5} L${LANE_X - 1.2} ${F_TOP + LANE_H / 2}`} />
          <path d={`M${ROU[1] + 1.1} ${MID + 0.5} L${LANE_X - 1.2} ${G_TOP + LANE_H / 2}`} />
        </svg>

        <div className="s58-node s58-node--req" style={{ left: u(REQ[0]), top: u(MID - NODE_H / 2) }}>
          <div className="s58-nhead">
            <span className="s58-ndisc">{ICONS.chat}</span>
            <h3 className="s58-ntitle">{REQUEST.title}</h3>
          </div>
          <p className="s58-ntext">{REQUEST.text}</p>
        </div>
        <div className="s58-node s58-node--rou" style={{ left: u(ROU[0]), top: u(MID - NODE_H / 2) }}>
          <div className="s58-nhead">
            <span className="s58-ndisc">{ICONS.shuffle}</span>
            <h3 className="s58-ntitle">{ROUTER.title}</h3>
          </div>
          <p className="s58-ntext">{ROUTER.text}</p>
        </div>

        <Lane kind="frontier" top={F_TOP} data={FRONTIER} icon="cloud" />
        <Lane kind="inhouse" top={G_TOP} data={INHOUSE} icon="server" />
      </div>

      {/* from the in-house band down to its two homes */}
      <svg className="s58-fork" viewBox="0 0 100 56.25" aria-hidden="true">
        <path className="s58-fline" d={FORK_LEFT.d} />
        <path className="s58-fline" d={FORK_RIGHT.d} />
        {FORK_TIPS.map((x) => (
          <path className="s58-ftip" key={x} d={`M${x - 0.5} ${FORK_Y1 - 0.5} L${x} ${FORK_Y1 + 0.08} L${x + 0.5} ${FORK_Y1 - 0.5}`} />
        ))}
      </svg>

      <h3 className="s58-ptitle s58-ptitle--train">{TRAIN.title}</h3>
      <div className="s58-panel s58-panel--train">
        <span className="s58-pbg" aria-hidden="true" />
        {/* the rack's place: the rack itself is three.js (flow.ts); without WebGL a server icon stands here */}
        <span className="s58-rackslot">{ICONS.server}</span>
        <div className="s58-plines">
          {TRAIN.lines.map((l) => (
            <Line key={l.text} {...l} />
          ))}
        </div>
      </div>

      <h3 className="s58-ptitle s58-ptitle--serve">{SERVE.title}</h3>
      <div className="s58-panel s58-panel--serve">
        <span className="s58-pbg" aria-hidden="true" />
        {/* a cloud we draw, with the three letters as plain text: no vendor's logo */}
        <span className="s58-cloud">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path className="s58-cfill" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            <path className="s58-cline" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
          </svg>
          <b>{CLOUD_NAME}</b>
        </span>
        <div className="s58-plines">
          {SERVE.lines.map((l) => (
            <Line key={l.text} {...l} />
          ))}
        </div>
        <span className="s58-track" aria-hidden="true" />
      </div>

      <p className="s58-punch">
        <Words text={PUNCH} />
      </p>

      <div className="s58-gains">
        {BENEFITS.map((b) => (
          <p className="s58-gain" key={b.text}>
            <span className="s58-gico">{ICONS[b.icon]}</span>
            {b.text}
          </p>
        ))}
      </div>
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
    const row = ctx.$('.s58-row')
    const lanes = ctx.$$('.s58-lane')

    // while the row has the stage to itself it stands lower, in the middle of the frame
    gsap.set(row, { y: TALL_DY * U })
    gsap.set(lanes, { autoAlpha: 0 })
    gsap.set(ctx.$$('.s58-lbg'), { clipPath: 'inset(0% 100% 0% 0%)' })
    if (st) {
      Object.assign(st, { dy: TALL_DY, l: 0, a: 0, b: 0, d: 0, rack: 0, pulse: 0, s: 0 })
      KEYS.forEach((k) => {
        st.seat[k] = 0
        st.lit[k] = 0
      })
    }

    /* ---------------------------------------------------------------- route */
    a.words('.kn-h', 0.1)
    a.rise('.s58-node--req', 0.45)
    a.pop('.s58-node--req .s58-ndisc', 0.7)
    // requests arrive: a loose scatter that gathers into the first card
    if (st) tl.to(st, { l: 1, duration: 1.1, ease: 'power1.inOut' }, 0.5)
    a.rise('.s58-node--rou', 1.0)
    a.pop('.s58-node--rou .s58-ndisc', 1.25)
    tl.to(fx, { glow: 0.26, focusX: -0.6, focusY: 0.1, duration: 1.4 }, 0.5)
    if (st) {
      // … one band leaves it and enters the router …
      tl.to(st, { a: 1, duration: 0.6, ease: 'power2.inOut' }, 1.35)
      // … the router works on it …
      if (!reduced) {
        const disc = ctx.$('.s58-node--rou .s58-ndisc')
        tl.to(ctx.$('.s58-node--rou .s58-ndisc svg'), { rotation: 360, duration: 0.95, ease: ease.inOut }, 1.8)
        tl.to(disc, { scale: 1.2, duration: 0.3, ease: 'power2.out' }, 1.85)
        tl.to(disc, { scale: 1, duration: 0.55, ease: 'power2.inOut' }, 2.15)
      }
      // … and it comes out sorted: 36 and 64 of the same band
      tl.to(st, { b: 1, duration: 0.75, ease: 'power2.inOut' }, 2.2)
    } else {
      a.draw('.s58-arrows path', 1.4, { stagger: 0.35 })
    }
    // the two bands open from the ribbons' ends, and the figures count as the tokens pour in
    const L = 2.7
    lanes.forEach((lane, i) => {
      const at = L + i * 0.18
      tl.to(lane, { autoAlpha: 1, duration: 0.01 }, at)
      tl.to(lane.querySelector('.s58-lbg'), { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: ease.inOut }, at)
      a.pop(lane.querySelector('.s58-ldisc'), at + 0.3)
      a.rise(lane.querySelector('.s58-ltxt'), at + 0.4, { y: 0.8 })
      a.rise(lane.querySelector('.s58-share'), at + 0.7, { y: 0.8 })
      a.count(lane.querySelector('.s58-pct'), at + 0.75, { duration: 1.4 })
    })
    tl.to(fx, { focusX: 0.45, warm: 0.25, glow: 0.32, duration: 1.6, ease: ease.inOut }, L)
    tl.addLabel('route', L + 2.4)

    /* ---------------------------------------------------------------- homes */
    // the row moves up; the in-house band opens downward into its two homes
    const H = L + 2.4
    tl.to(row, { y: 0, duration: 0.95, ease: ease.inOut }, H)
    if (st) tl.to(st, { dy: 0, duration: 0.95, ease: ease.inOut }, H)
    a.draw('.s58-fline', H + 0.75, { duration: 0.85, stagger: 0 })
    if (st) tl.to(st, { d: 1, duration: 1.0, ease: 'power1.inOut' }, H + 0.85)
    a.pop('.s58-ftip', H + 1.5, { stagger: -0.12 })
    tl.to(fx, { focusX: 0, focusY: 0.4, warm: 0.3, glow: 0.3, duration: 1.6, ease: ease.inOut }, H)

    // the cloud's panel is right under the band: it opens first; the rack's, at the end of the long arm, a breath later
    const S = H + 1.35
    a.rise('.s58-ptitle--serve', S, { y: 0.8 })
    a.rise('.s58-panel--serve', S + 0.1, { y: 1.2 })
    a.draw('.s58-cline', S + 0.4, { duration: 0.9 })
    a.fade('.s58-cfill', S + 0.8)
    a.fade('.s58-cloud b', S + 0.95)
    a.rise('.s58-panel--serve .s58-pline', S + 0.5, { y: 0.7, stagger: 0.12 })
    a.rule('.s58-track', S + 1.0, { duration: 0.7 })
    if (st) tl.to(st, { s: 1, duration: 0.7, ease: 'power2.out' }, S + 1.05)

    const R = H + 1.6
    a.rise('.s58-ptitle--train', R, { y: 0.8 })
    a.rise('.s58-panel--train', R + 0.1, { y: 1.2 })
    a.rise('.s58-panel--train .s58-pline', R + 0.5, { y: 0.7, stagger: 0.12 })
    if (st) {
      // the rack stands up, its units push home, their lights come on from the bottom, and it starts to train
      tl.to(st, { rack: 1, duration: 0.7, ease: reduced ? 'none' : ease.snap }, R + 0.35)
      KEYS.forEach((k, i) => {
        tl.to(st.seat, { [k]: 1, duration: 0.5, ease: ease.out }, R + 0.75 + i * 0.12)
        tl.to(st.lit, { [k]: 1, duration: 0.3, ease: 'power1.out' }, R + 1.2 + (3 - i) * 0.15)
      })
      tl.to(st, { pulse: 1, duration: 1.0, ease: 'power1.out' }, R + 1.5)
    } else {
      a.pop('.s58-rackslot', R + 0.45)
    }
    tl.addLabel('homes', R + 2.5)

    /* ------------------------------------------------------------------ why */
    const Y = R + 2.5
    a.words('.s58-punch', Y, { stagger: 0.035 })
    tl.to(fx, { focusY: 0.7, glow: 0.4, warm: 0.45, duration: 1.2, ease: ease.inOut }, Y)
    tl.addLabel('why', Y + 1.35)

    /* ---------------------------------------------------------------- gains */
    const G = Y + 1.35
    a.rise('.s58-gain', G, { y: 0.9, stagger: 0.18 })
    a.pop('.s58-gico', G + 0.1, { stagger: 0.18 })
    tl.addLabel('gains', G + 1.4)
    return tl
  },
}

export default scene
