'use client'

/**
 * /ir slide 02 · "Last year we spoke of AI impact on AUM growth and operating efficiency"
 *
 * THE IDEA: a promise kept, twice. The stage is two columns, one promise each.
 *
 *   said    the headline; last year's two slides are laid down LARGE, as the evidence, each with
 *           the sentence we said under it. Nothing else.                          (plays on arrival)
 *   aum     the left print docks as a thumbnail with its sentence beside it, and the space it
 *           leaves becomes a gauge: the guided 25% ring and the 20-25% range stand first; Mar-26
 *           runs up and docks in the ring; Sep-26 Total AUM docks inside the range; Growth AUM
 *           runs on a lane of its own; the seal comes down on the print
 *   opex    the right print docks; the earlier guided range, the range lowered out of it by
 *           25 bps, the lower end marked with a solid line; a marker comes down from the right,
 *           crosses the range and the line, the far side lights green and 3.48% lands THERE; the seal
 *
 * Every word is the deck's (data.ts). The gauges are drawn from its numbers; each figure is said
 * once, large, on its gauge. Green is the deck's own colour for what was delivered.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Count, Headline, Pic, pic, Words, type SceneModule } from '../../kit'
import { AUM, AUM_MIN, AUM_X0, ax, GAUGE_W, OPEX, ox, PRINTS } from './data'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${+n.toFixed(3)})`
const at = (left: number, width?: number): CSSProperties => ({ left: u(left), ...(width === undefined ? null : { width: u(width) }) })

/** where a docked print's top left corner sits in its column, and where its sentence waits under the large print (in --u) */
const DOCK = { x: 0.3, y: 0.7 }
const SAID_UNDER = { dx: -7.3, dy: 25.6 }

const Seal = () => (
  <span className="ir02-seal" aria-hidden="true">
    <span className="ir02-seal-ring" />
    <span className="ir02-seal-disc">
      <svg viewBox="0 0 48 48" fill="none">
        <path className="ir02-seal-tick" d="M13.5 24.8 21 32.2 35 16.6" stroke="#fff" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  </span>
)

const Print = ({ which }: { which: 'aum' | 'opex' }) => {
  const p = PRINTS[which]
  return (
    <div className={`ir02-print ir02-print--${which}`} style={{ left: u((GAUGE_W - p.big - 0.56) / 2) }} data-thumb={p.thumb}>
      <div className="ir02-print-in">
        <span className="ir02-tape" aria-hidden="true" />
        {/* the deck crops the bottom 14.8% of the AUM picture: so do we. The opex picture is whole. */}
        {which === 'aum' ? (
          <Pic n={2} name={AUM.print} fit="cover" focus="50% 0%" ratio={p.ratio} width={p.big} />
        ) : (
          <Pic n={2} name={OPEX.print} fit="contain" ratio={p.ratio} width={p.big} />
        )}
      </div>
    </div>
  )
}

const scene: SceneModule = {
  beats: ['said', 'aum', 'opex'],
  preload: [pic(2, AUM.print), pic(2, OPEX.print)],

  Scene: ({ slide }) => (
    <div className="ir02">
      <Headline className="ir02-h" text={slide.title} />
      <span className="ir02-sep" aria-hidden="true" />

      {/* ------------------------------------------------ AUM growth */}
      <section className="ir02-col ir02-col--aum">
        <Print which="aum" />
        <Seal />
        <div className="ir02-said">
          <p>
            <Words text={AUM.said} bold={AUM.saidBold} />
          </p>
        </div>

        <div className="ir02-gauge ir02-gauge--aum">
          {/* lane 1: Mar-26 against the guided 25% */}
          <span className="ir02-lane ir02-lane--a">{AUM.deliveredLanes.mar}</span>
          <span className="ir02-base ir02-base--a" style={at(AUM_X0, ax(AUM.guided) - AUM_X0)} />
          <span className="ir02-guide" style={at(ax(AUM.guided))}>
            <span className="ir02-guide-in">guided {AUM.guided}% YoY</span>
          </span>
          <span className="ir02-run ir02-run--mar" style={at(AUM_X0, ax(AUM.mar26) - AUM_X0)} />
          <span className="ir02-target" style={at(ax(AUM.guided))} />
          <span className="ir02-ping ir02-ping--mar" style={at(ax(AUM.mar26))} />
          <span className="ir02-dot ir02-dot--mar" style={at(ax(AUM.mar26))} />
          <span className="ir02-fig ir02-fig--mar" style={at(ax(AUM.mar26) + 1.9)}>
            <Count to={AUM.mar26} from={AUM_MIN} suffix="%" />
            <small>YoY</small>
          </span>

          {/* lane 2: Sep-26 Total AUM against the medium-term range */}
          <span className="ir02-lane ir02-lane--b">
            {AUM.deliveredLanes.sep}
            <i>{AUM.deliveredLanes.total}</i>
          </span>
          <span className="ir02-base ir02-base--b" style={at(AUM_X0, ax(AUM.band[1]) - AUM_X0)} />
          <span className="ir02-band ir02-band--cagr" style={at(ax(AUM.band[0]), ax(AUM.band[1]) - ax(AUM.band[0]))} />
          <span className="ir02-bandcap" style={at(ax(AUM.band[0]))}>
            medium-term {AUM.band[0]}-{AUM.band[1]}% CAGR
          </span>
          <span className="ir02-run ir02-run--total" style={at(AUM_X0, ax(AUM.total) - AUM_X0)} />
          <span className="ir02-ping ir02-ping--total" style={at(ax(AUM.total))} />
          <span className="ir02-dot ir02-dot--total" style={at(ax(AUM.total))} />
          <span className="ir02-fig ir02-fig--total" style={at(ax(AUM.band[1]) + 1.1)}>
            <Count to={AUM.total} from={AUM_MIN} suffix="%" />
            <small>YoY</small>
          </span>

          {/* lane 3: Sep-26 Growth AUM, on a lane of its own: the range was not given for it */}
          <span className="ir02-lane ir02-lane--c">
            {AUM.deliveredLanes.sep}
            <i>{AUM.deliveredLanes.growth}</i>
          </span>
          <span className="ir02-base ir02-base--c" style={at(AUM_X0, ax(AUM.growth) - AUM_X0)} />
          <span className="ir02-run ir02-run--growth" style={at(AUM_X0, ax(AUM.growth) - AUM_X0)} />
          <span className="ir02-dot ir02-dot--growth" style={at(ax(AUM.growth))} />
          <span className="ir02-fig ir02-fig--growth" style={at(ax(AUM.growth) + 1.4)}>
            <Count to={AUM.growth} from={AUM_MIN} suffix="%" />
            <small>YoY</small>
          </span>
        </div>

        <div className="ir02-dels">
          {AUM.delivered.map((line, i) => (
            <p className={`ir02-del ir02-del--${i}`} key={line}>
              <Words text={line} bold={AUM.deliveredGood} />
            </p>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ Retail opex-to-AUM */}
      <section className="ir02-col ir02-col--opex">
        <Print which="opex" />
        <Seal />
        <div className="ir02-said">
          <p>
            <Words text={OPEX.said} bold={OPEX.saidBold} />
          </p>
        </div>

        <div className="ir02-gauge ir02-gauge--opex">
          <span className="ir02-axis" style={at(ox(OPEX.earlier[0]), GAUGE_W - ox(OPEX.earlier[0]))} />
          {/* the far side of the lower end: it lights when the marker crosses */}
          <span className="ir02-wash" style={at(0, ox(OPEX.earlier[0]))} />
          <span className="ir02-band ir02-band--earlier" style={at(ox(OPEX.earlier[0]), ox(OPEX.earlier[1]) - ox(OPEX.earlier[0]))} />
          <span className="ir02-bandcap ir02-bandcap--earlier" style={at(ox(OPEX.earlier[0]), ox(OPEX.earlier[1]) - ox(OPEX.earlier[0]))}>
            earlier guided range
          </span>
          <span className="ir02-lowered" style={at(ox(OPEX.lowered[0]), ox(OPEX.lowered[1]) - ox(OPEX.lowered[0]))}>
            <em>lowered by {OPEX.bps} bps</em>
          </span>
          <span className="ir02-floor" style={at(ox(OPEX.earlier[0]))} />
          <span className="ir02-floorcap" style={at(ox(OPEX.earlier[0]) + 0.75)}>
            lower end of the earlier guided range
          </span>

          <span className="ir02-trail" style={at(ox(OPEX.now), GAUGE_W - ox(OPEX.now))} />
          <span className="ir02-ping ir02-ping--now" style={at(ox(OPEX.now))} />
          <span className="ir02-dot ir02-dot--now" style={at(ox(OPEX.now))} />
          <span className="ir02-now" style={at(0, ox(OPEX.now) - 1.15)}>
            <i>Q2 FY27</i>
            <b>{OPEX.now.toFixed(2)}%</b>
          </span>
        </div>

        <div className="ir02-dels">
          <p className="ir02-del ir02-del--0">
            <Words text={OPEX.delivered} bold={OPEX.deliveredGood} />
          </p>
        </div>
      </section>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const col = (name: string) => {
      const el = ctx.$(`.ir02-col--${name}`)
      return (sel: string) => Array.from(el.querySelectorAll(sel)) as HTMLElement[]
    }
    const A = col('aum')
    const O = col('opex')

    // measure first: the large prints as laid out, in their columns
    const dockOf = (q: (sel: string) => HTMLElement[], name: string) => {
      const p = q('.ir02-print')[0]
      const c = ctx.loc(ctx.$(`.ir02-col--${name}`))
      const b = ctx.loc(p)
      const s = (Number(p.dataset.thumb) * U) / b.w
      return {
        scale: s,
        x: c.x + DOCK.x * U + (b.w * s) / 2 - b.cx,
        y: c.y + DOCK.y * U + (b.h * s) / 2 - b.cy,
      }
    }
    const dockA = dockOf(A, 'aum')
    const dockO = dockOf(O, 'opex')

    /** A ring goes out once from a point that has just been reached. */
    const ping = (els: Element[], t: number, to = 3.4) => {
      if (!els.length) return
      gsap.set(els, { autoAlpha: 0, scale: 1 })
      if (reduced) return
      tl.to(
        els,
        {
          keyframes: [
            { autoAlpha: 0.85, scale: 1.1, duration: 0.05, ease: 'none' },
            { autoAlpha: 0, scale: to, duration: 0.8, ease: 'power2.out' },
          ],
        },
        t,
      )
    }

    /** A figure answers its landing. */
    const bump = (els: Element[], t: number, origin = '0% 60%') => {
      if (reduced || !els.length) return
      tl.to(els, { scale: 1.12, duration: 0.14, ease: 'power2.out', transformOrigin: origin }, t)
      tl.to(els, { scale: 1, duration: 0.5, ease: 'back.out(2.6)' }, t + 0.14)
    }

    /** The seal comes down like a stamp: fast into the hit, a little give, a ring from under it, the tick drawn. */
    const stamp = (q: (sel: string) => Element[], t: number) => {
      const seal = q('.ir02-seal-disc')
      const ring = q('.ir02-seal-ring')
      const tick = q('.ir02-seal-tick')
      gsap.set(q('.ir02-seal'), { autoAlpha: 1 })
      gsap.set(tick, { drawSVG: '0%', autoAlpha: 0 })
      gsap.set(ring, { autoAlpha: 0, scale: 1 })
      if (reduced) {
        gsap.set(seal, { autoAlpha: 0 })
        tl.to(seal, { autoAlpha: 1, duration: 0.4 }, t)
      } else {
        gsap.set(seal, { autoAlpha: 0, scale: 2.5, rotation: -24 })
        tl.to(seal, { autoAlpha: 1, duration: 0.14, ease: 'none' }, t)
        tl.to(seal, { scale: 1, rotation: -8, duration: 0.34, ease: ease.slam }, t)
        tl.to(seal, { scale: 0.92, duration: 0.07, ease: 'power1.out' }, t + 0.34)
        tl.to(seal, { scale: 1, duration: 0.45, ease: 'back.out(3.2)' }, t + 0.41)
        tl.to(
          ring,
          {
            keyframes: [
              { autoAlpha: 0.7, scale: 1.02, duration: 0.05, ease: 'none' },
              { autoAlpha: 0, scale: 1.9, duration: 0.8, ease: 'power2.out' },
            ],
          },
          t + 0.34,
        )
      }
      tl.to(tick, { autoAlpha: 1, duration: 0.01, ease: 'none' }, t + 0.3)
      tl.to(tick, { drawSVG: '100%', duration: 0.4, ease: ease.glide }, t + 0.3)
    }

    /** The large print gives up the stage: it docks as a thumbnail, its sentence comes up beside it. */
    const dock = (q: (sel: string) => HTMLElement[], d: { scale: number; x: number; y: number }, t: number) => {
      tl.to(q('.ir02-print'), { x: d.x, y: d.y, scale: d.scale, duration: 0.95, ease: ease.inOut }, t)
      tl.to(q('.ir02-said'), { x: 0, y: 0, duration: 0.95, ease: ease.inOut }, t + 0.05)
    }

    /* ================================================= said: last year's two slides, large */
    a.words('.ir02-h', 0.1)
    a.rule('.ir02-sep', 0.9, { from: 'top', duration: 1.1 })

    ctx.$$('.ir02-print').forEach((p, i) => {
      const t = 0.5 + i * 0.4
      if (reduced) {
        a.fade(p, t)
      } else {
        gsap.set(p, { autoAlpha: 0, y: -3.6 * U, rotation: i ? 6 : -6, scale: 1.1 })
        tl.to(p, { autoAlpha: 1, duration: 0.3, ease: 'none' }, t)
        tl.to(p, { y: 0, rotation: 0, scale: 1, duration: 0.9, ease: ease.out }, t)
      }
      a.pop(p.querySelector('.ir02-tape'), t + 0.5, { from: 0.3 })
    })
    gsap.set(ctx.$$('.ir02-said'), { x: SAID_UNDER.dx * U, y: SAID_UNDER.dy * U })
    a.words(A('.ir02-said'), 1.15, { stagger: 0.028 })
    a.words(O('.ir02-said'), 1.55, { stagger: 0.028 })

    tl.to(fx, { glow: 0.22, focusX: 0, focusY: 0, duration: 2, ease: ease.inOut }, 0.4)
    tl.addLabel('said', 3)

    /* ================================================= aum: 25% guided, 25% delivered */
    let t = 3.05
    tl.to(fx, { glow: 0.34, focusX: -0.5, focusY: 0.15, warm: -0.12, duration: 1.4, ease: ease.inOut }, t)
    dock(A, dockA, t)

    // the gauge shows the guidance first: the 25% ring, the 20-25% range
    a.fade(A('.ir02-lane'), t + 0.55, { stagger: 0.1 })
    a.rule(A('.ir02-base'), t + 0.55, { stagger: 0.1, duration: 0.8 })
    a.pop(A('.ir02-target'), t + 1.0, { from: 0.2 })
    a.rise(A('.ir02-guide-in'), t + 1.05, { y: 0.7, duration: 0.5 })
    a.wipe(A('.ir02-band--cagr'), t + 1.1, { duration: 0.7 })
    a.rise(A('.ir02-bandcap'), t + 1.3, { y: 0.7, duration: 0.5 })

    /** A dot runs up its lane to its own place, its reading with it; the line behind it is `run`. */
    const runUp = (name: string, to: number, when: number, duration: number) => {
      const dot = A(`.ir02-dot--${name}`)
      const line = A(`.ir02-run--${name}`)
      const fig = A(`.ir02-fig--${name}`)
      gsap.set(line, { scaleX: 0, transformOrigin: '0% 50%' })
      tl.to(line, { scaleX: 1, duration, ease: 'power2.inOut' }, when)
      gsap.set(dot, { autoAlpha: 0, x: reduced ? 0 : -(to - AUM_X0) * U })
      tl.to(dot, { autoAlpha: 1, duration: 0.2, ease: 'none' }, when)
      if (!reduced) tl.to(dot, { x: 0, duration, ease: 'power2.inOut' }, when)
      // the reading is what the dot's place says, and is shown only as the dot comes in to land
      a.fade(fig, when + duration * 0.8, { duration: 0.22 })
      a.count(A(`.ir02-fig--${name} .kn-count-n`), when, { duration, ease: 'power2.inOut' })
      bump(fig, when + duration + 0.02)
    }

    // Mar-26 runs up and docks in the ring
    const t1 = t + 1.5
    runUp('mar', ax(AUM.mar26), t1, 1.05)
    ping(A('.ir02-ping--mar'), t1 + 1.05)
    a.words(A('.ir02-del--0'), t1 + 0.85, { stagger: 0.03 })

    // Sep-26: Total AUM docks inside the range, and the range answers
    const t2 = t1 + 1.2
    runUp('total', ax(AUM.total), t2, 0.95)
    ping(A('.ir02-ping--total'), t2 + 0.95)
    if (!reduced) {
      const band = A('.ir02-band--cagr')
      tl.to(band, { scaleY: 1.22, duration: 0.14, ease: 'power2.out' }, t2 + 0.95)
      tl.to(band, { scaleY: 1, duration: 0.5, ease: 'back.out(2.6)' }, t2 + 1.09)
    }
    // Growth AUM: its own lane
    runUp('growth', ax(AUM.growth), t2 + 0.35, 1.15)
    a.words(A('.ir02-del--1'), t2 + 0.9, { stagger: 0.03 })

    stamp(A, t2 + 1.6)
    t = t2 + 2.55
    tl.addLabel('aum', t)

    /* ================================================= opex: below the lower end */
    t += 0.05
    tl.to(fx, { glow: 0.34, focusX: 0.5, focusY: 0.15, warm: 0.1, duration: 1.4, ease: ease.inOut }, t)
    dock(O, dockO, t)

    // the earlier guided range; the range lowered out of it by 25 bps
    a.rule(O('.ir02-axis'), t + 0.55, { duration: 0.8 })
    a.wipe(O('.ir02-band--earlier'), t + 0.6, { duration: 0.7 })
    a.rise(O('.ir02-bandcap--earlier'), t + 0.9, { y: 0.6, duration: 0.45 })
    const lowered = O('.ir02-lowered')
    const from = ctx.loc(O('.ir02-band--earlier')[0])
    const here = ctx.loc(lowered[0])
    gsap.set(lowered, { autoAlpha: 0, x: reduced ? 0 : from.x - here.x, y: reduced ? 0 : from.y + from.h - here.h - here.y })
    tl.to(lowered, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, t + 1.0)
    if (!reduced) {
      tl.to(lowered, { y: 0, duration: 0.45, ease: 'power2.inOut' }, t + 1.1)
      tl.to(lowered, { x: 0, duration: 0.75, ease: ease.inOut }, t + 1.3)
    }
    a.fade(O('.ir02-lowered em'), t + 1.8, { duration: 0.35 })

    // the lower end of the earlier range: a solid line
    a.rule(O('.ir02-floor'), t + 1.7, { from: 'top', duration: 0.55 })
    a.rise(O('.ir02-floorcap'), t + 1.9, { y: 0.6, duration: 0.45 })

    // Q2 FY27 comes down from the right, through the earlier range, and over the line
    const tn = t + 2.2
    const dn = 1.6
    const cross = tn + dn * 0.868 // where a power2.inOut run is over the line (96.5% of the way)
    const dot = O('.ir02-dot--now')
    const trail = O('.ir02-trail')
    gsap.set(dot, { autoAlpha: 0, x: reduced ? 0 : (GAUGE_W - ox(OPEX.now)) * U })
    gsap.set(trail, { scaleX: 0, transformOrigin: '100% 50%' })
    tl.to(dot, { autoAlpha: 1, duration: 0.25, ease: 'none' }, tn)
    tl.to(trail, { scaleX: 1, duration: dn, ease: 'power2.inOut' }, tn)
    if (!reduced) tl.to(dot, { x: 0, duration: dn, ease: 'power2.inOut' }, tn)

    // the crossing: the line answers, the far side lights
    const floor = O('.ir02-floor')
    if (!reduced) {
      tl.to(floor, { scaleX: 3.2, duration: 0.12, ease: 'power2.out' }, cross)
      tl.to(floor, { scaleX: 1, duration: 0.55, ease: 'power2.out' }, cross + 0.12)
    }
    a.wipe(O('.ir02-wash'), cross, { from: 'right', duration: 0.7 })
    ping(O('.ir02-ping--now'), tn + dn, 4)

    // and the figure lands there, whole
    const now = O('.ir02-now')
    if (reduced) {
      a.fade(now, tn + dn)
    } else {
      gsap.set(now, { autoAlpha: 0, x: 1.4 * U, scale: 0.86, transformOrigin: '100% 60%' })
      tl.to(now, { autoAlpha: 1, duration: 0.2, ease: 'none' }, tn + dn - 0.05)
      tl.to(now, { x: 0, scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, tn + dn - 0.05)
    }
    a.words(O('.ir02-del--0'), tn + dn + 0.1, { stagger: 0.026 })

    stamp(O, tn + dn + 0.65)
    tl.to(fx, { glow: 0.24, focusX: 0, focusY: 0.1, warm: 0, duration: 1, ease: ease.inOut }, tn + dn + 0.7)
    tl.addLabel('opex', tn + dn + 1.7)
    return tl
  },
}

export default scene
