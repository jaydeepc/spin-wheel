'use client'

/**
 * Slide 22 · "AI's bottleneck has moved from chips to electricity."
 *
 * THE IDEA: a lead that is too short. The chips arrive one after another and wait, dim; the
 * last one lights, its lead runs for the wall, pulls taut a hand's breadth from the socket, tries
 * again, and stays there: the plug does not go in. Over it, 945 TWh is read off an electricity
 * meter: three drums of digits that roll up to the figure.
 *
 *   power   the headline; the meter rolls to 945 TWh; the wall with its socket and the deck's
 *           photograph of the pylon; the chips slide in and wait. "The chips are ready and waiting."
 *   grid    $600 bn+; the last chip lights, its lead reaches for the socket and stops short.
 *           "The grid is not."
 *   news    the two clippings are pinned up over the waiting chips
 *
 * The chip, the plug and the socket are generated pictures (GEN.md); the pylon is the deck's
 * photograph, as it is, never larger than its own pixels. No canvas: this slide is DOM and GSAP.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Clipping, Count, gen, Headline, Pic, pic, Words, type SceneCtx, type SceneModule } from '../../kit'
import { CHIPS, CLIPS, FLAME, MONEY, NOT, POWER, PYLON, READY, ROW, SOURCES } from './data'
import './scene.css'

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`
const DRUM = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
const DIGITS = String(POWER.digits).split('')

/* the lead of the lit chip, in --u: where it leaves the chip, how long the plug is, how far its pins get */
const LAST = CHIPS[CHIPS.length - 1]
const LEAD_X = LAST.x + LAST.size / 2 - 0.5
const PLUG_W = 4.9
const SOCKET = { x: 91.4, size: 5.6 }
/** The pins' tip: tucked against the chip, at full stretch (a hair from the plate), and where it comes to rest. */
const TIP0 = LEAD_X + PLUG_W
const TIP1 = SOCKET.x - SOCKET.size / 2 - 0.3
const REST = 0.86
const LEAD_W = TIP1 - PLUG_W + 0.5 - LEAD_X

const scene: SceneModule = {
  beats: ['power', 'grid', 'news'],
  preload: [gen(22, 'chip.png'), gen(22, 'plug.png'), gen(22, 'socket.png'), pic(22, PYLON.name)],

  Scene: ({ slide }) => (
    <div className="s22">
      {/* the wall: a ground, so it may run to the stage's edge and under the chrome */}
      <div className="s22-wall" aria-hidden="true" />

      <Headline text={slide.title} flame={FLAME} />

      <div className="s22-fact s22-fact--power">
        <b className="s22-meter" aria-label={`${POWER.digits} ${POWER.unit}`}>
          <span className="s22-drums" aria-hidden="true">
            {DIGITS.map((d, i) => (
              <span className="s22-drum" key={i}>
                <span className="s22-strip">
                  {DRUM.map((n, k) => (
                    <i key={k}>{n}</i>
                  ))}
                </span>
              </span>
            ))}
            {/* the meter's disc: it keeps turning for as long as the slide is up */}
            <span className="s22-disc">
              <i />
            </span>
          </span>
          <span className="s22-unit" aria-hidden="true">
            {POWER.unit}
          </span>
        </b>
        <p className="s22-line">
          <Words text={POWER.line} bold={POWER.bold} />
        </p>
      </div>

      <div className="s22-fact s22-fact--money">
        <b className="s22-num">
          <Count to={MONEY.to} prefix={MONEY.prefix} suffix={MONEY.suffix} />
        </b>
        <p className="s22-line">
          <Words text={MONEY.line} bold={MONEY.bold} />
        </p>
      </div>

      {/* the deck's photograph of the pylon, on the wall: as it is, never larger than its 246 pixels */}
      <div className="s22-pylon">
        <span className="s22-pylon-frame">
          <Pic n={22} name={PYLON.name} fit="cover" ratio={`${PYLON.px[0]} / ${PYLON.px[1]}`} />
        </span>
      </div>
      <img className="s22-socket" src={gen(22, 'socket.png')} alt="" draggable={false} style={{ left: u(SOCKET.x - SOCKET.size / 2), top: u(ROW - SOCKET.size / 2), width: u(SOCKET.size) }} />

      {/* the lead of the last chip: it lies under the chip and comes out as the plug travels */}
      <span className="s22-lead" aria-hidden="true" style={{ left: u(LEAD_X), top: u(ROW - 0.2), width: u(LEAD_W) }} />
      <img className="s22-plug" src={gen(22, 'plug.png')} alt="" draggable={false} style={{ left: u(LEAD_X), top: u(ROW - PLUG_W * (351 / 720) * 0.5), width: u(PLUG_W) }} />
      <svg className="s22-miss" viewBox="0 0 30 30" aria-hidden="true" style={{ left: u(TIP1 - 1.75), top: u(ROW - 4.1) }}>
        <path d="M6 20 L3 8" />
        <path d="M15 17 L15 3" />
        <path d="M24 20 L27 8" />
      </svg>

      {CHIPS.map((c, i) => {
        const last = i === CHIPS.length - 1
        return (
          <span
            className={`s22-chip ${last ? 's22-chip--last' : ''}`}
            key={i}
            data-dim={c.dim}
            style={{ left: u(c.x - c.size / 2), top: u(ROW - c.size / 2), width: u(c.size), height: u(c.size) } as CSSProperties}
          >
            {last ? <span className="s22-glow" aria-hidden="true" /> : null}
            {last ? null : (
              <svg className="s22-tail" viewBox="0 0 16 24" aria-hidden="true">
                <path d="M0 4 H7 A8 8 0 0 1 7 20 H5" />
              </svg>
            )}
            <img src={gen(22, 'chip.png')} alt="" draggable={false} />
            {last ? (
              <span className="s22-core" aria-hidden="true">
                <span className="s22-core-hot" />
              </span>
            ) : null}
          </span>
        )
      })}

      <p className="s22-cap s22-cap--ready">{READY}</p>
      <p className="s22-cap s22-cap--not">{NOT}</p>

      {CLIPS.map((c, i) => (
        <Clipping key={c.text} className={`s22-clip s22-clip--${i + 1}`} date={c.date} tape={c.tape} source={c.source} tilt={c.tilt} width={c.width}>
          {c.text}
        </Clipping>
      ))}

      <p className="s22-src">{SOURCES}</p>
    </div>
  ),

  build(ctx) {
    const { U, ease } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const calm = ctx.reduced

    /* ---------------------------------------------------------------- power */
    a.words('.kn-h', 0.1)

    // the wall comes in from the right, with the pylon's photograph and the socket on it
    const wall = ctx.$('.s22-wall')
    gsap.set(wall, { x: calm ? 0 : U * 15, autoAlpha: calm ? 0 : 1 })
    tl.to(wall, { x: 0, autoAlpha: 1, duration: 1.1, ease: ease.out }, 0.3)
    a.rise('.s22-pylon', 0.75, { y: 2.2, duration: 0.9 })
    a.pop('.s22-socket', 1.0, { from: 0.8, duration: 0.6 })

    // the meter: three drums of digits roll up to 945
    const strips = ctx.$$('.s22-strip')
    const meter = { v: 0 }
    const roll = () => {
      // an odometer: the units drum turns all the time, every other drum only while the one after it passes 9
      let pos = meter.v
      for (let k = strips.length - 1, p = 0; k >= 0; k--, p++) {
        const turn = p === 0 ? meter.v : Math.floor(meter.v / 10 ** p) + Math.max(0, (pos % 10) - 9)
        pos = turn
        gsap.set(strips[k], { yPercent: (-(turn % 10) * 100) / DRUM.length })
      }
    }
    roll()
    a.rise('.s22-meter', 0.6, { y: 2.2 })
    tl.to(meter, { v: POWER.digits, duration: 2.1, ease: 'power3.out', onUpdate: roll }, 0.75)
    a.words('.s22-fact--power .s22-line', 1.3, { stagger: 0.028 })
    tl.to(fx, { glow: 0.3, focusX: -0.55, focusY: -0.2, warm: 0.3, duration: 1.8 }, 0.5)

    // the chips slide in one after another, and wait
    const chips = ctx.$$<HTMLElement>('.s22-chip')
    chips.forEach((chip, i) => {
      const at = 1.7 + i * 0.2
      gsap.set(chip, { autoAlpha: 0, x: calm ? 0 : -U * 2, y: calm ? 0 : U * 1.2 })
      tl.to(chip, { autoAlpha: Number(chip.dataset.dim), duration: 0.5, ease: 'power1.out' }, at)
      tl.to(chip, { x: 0, y: 0, duration: 0.9, ease: ease.out }, at)
    })
    a.draw('.s22-tail path', 2.5, { stagger: 0.2, duration: 0.5 })
    a.rise('.s22-cap--ready', 3.0, { y: 1 })
    a.fade('.s22-src', 2.4)
    tl.addLabel('power', 3.8)

    /* ----------------------------------------------------------------- grid */
    const G = 3.8
    a.rise('.s22-fact--money .s22-num', G, { y: 2 })
    a.count('.s22-fact--money .kn-count-n', G + 0.1)
    a.words('.s22-fact--money .s22-line', G + 0.35, { stagger: 0.028 })

    // the last chip lights
    const last = ctx.$('.s22-chip--last')
    const core = ctx.$('.s22-core')
    const glow = ctx.$('.s22-glow')
    gsap.set(core, { autoAlpha: 0, scale: calm ? 1 : 0.7 })
    gsap.set(glow, { autoAlpha: 0, scale: calm ? 1 : 0.6 })
    const L = G + 0.9
    tl.to(last, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, L)
    tl.to(core, { autoAlpha: 1, scale: 1, duration: 0.7, ease: ease.snap }, L + 0.1)
    tl.to(glow, { autoAlpha: 1, scale: 1, duration: 1.1, ease: ease.out }, L + 0.1)
    tl.to(fx, { focusX: 0.5, focusY: 0.45, glow: 0.34, warm: 0.5, duration: 1.6, ease: ease.inOut }, L)

    // its lead runs for the wall … and is too short: it pulls taut just before the socket, tries again, and stays there
    const lead = ctx.$('.s22-lead')
    const plug = ctx.$('.s22-plug')
    const reach = { p: 0 }
    const stretch = () => {
      const tip = TIP0 + (TIP1 - TIP0) * reach.p
      gsap.set(plug, { x: (tip - TIP0) * U })
      const shown = (tip - PLUG_W + 0.5 - LEAD_X) / LEAD_W
      gsap.set(lead, { clipPath: `inset(0% ${((1 - Math.min(1, Math.max(0, shown))) * 100).toFixed(2)}% 0% 0%)` })
    }
    gsap.set([plug, lead], { autoAlpha: 0 })
    stretch()
    const R = L + 0.75
    tl.to([plug, lead], { autoAlpha: 1, duration: 0.25 }, R)
    if (calm) {
      tl.to(reach, { p: REST, duration: 0.6, onUpdate: stretch }, R)
    } else {
      tl.to(reach, { p: 1, duration: 1.15, ease: 'power2.inOut', onUpdate: stretch }, R)
      // it falls well back, gathers, and lunges again to full stretch: still short
      tl.to(reach, { p: 0.6, duration: 0.5, ease: 'power2.out', onUpdate: stretch }, R + 1.15)
      tl.to(reach, { p: 1, duration: 0.3, ease: 'power3.in', onUpdate: stretch }, R + 1.7)
      tl.to(reach, { p: REST, duration: 0.8, ease: 'elastic.out(1, 0.45)', onUpdate: stretch }, R + 2.0)
      // the chip is tugged by its own lead each time it pulls taut
      tl.to(last, { x: U * 0.28, duration: 0.14, ease: 'power2.out' }, R + 1.1)
      tl.to(last, { x: 0, duration: 0.5, ease: ease.snap }, R + 1.24)
      tl.to(last, { x: U * 0.45, duration: 0.12, ease: 'power2.out' }, R + 1.97)
      tl.to(last, { x: 0, duration: 0.6, ease: ease.snap }, R + 2.09)
    }
    a.draw('.s22-miss path', R + 2.1, { stagger: 0.06, duration: 0.3 })
    a.rise('.s22-cap--not', R + 2.2, { y: 1 })
    tl.addLabel('grid', R + 3.1)

    /* ----------------------------------------------------------------- news */
    const N = R + 3.1
    pin(ctx, tl, ctx.$('.s22-clip--1'), N, -1)
    pin(ctx, tl, ctx.$('.s22-clip--2'), N + 0.4, 1)
    tl.to(fx, { focusX: -0.1, focusY: 0.2, glow: 0.26, warm: 0.2, duration: 1.3, ease: ease.inOut }, N)
    tl.addLabel('news', N + 1.65)
    return tl
  },
}

/**
 * The family's last move (slides 16 to 25): a clipping is PINNED up. It comes down from a
 * little above, a touch large and askew, and settles with a small overshoot, as paper with
 * some weight does. The outer element moves; the clipping's own tilt is on its inner one.
 */
function pin(ctx: SceneCtx, tl: gsap.core.Timeline, el: Element, at: number, side: 1 | -1) {
  if (ctx.reduced) {
    gsap.set(el, { autoAlpha: 0 })
    tl.to(el, { autoAlpha: 1, duration: 0.5 }, at)
    return
  }
  gsap.set(el, { autoAlpha: 0, y: -ctx.U * 3.4, rotation: side * 3.2, scale: 1.07, transformOrigin: '50% 0%' })
  tl.to(el, { autoAlpha: 1, duration: 0.22, ease: 'power1.out' }, at)
  tl.to(el, { y: 0, scale: 1, duration: 0.5, ease: 'power3.in' }, at)
  tl.to(el, { rotation: side * -0.9, duration: 0.5, ease: 'power2.in' }, at)
  tl.to(el, { rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, at + 0.5)
}

export default scene
