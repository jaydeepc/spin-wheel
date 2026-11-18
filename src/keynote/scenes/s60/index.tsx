'use client'

/**
 * Slide 60 · "Four levers help us utilize GPU efficiently"
 *
 * THE IDEA. The slide says "levers" and "measure", so it is ONE console. A deck of navy metal
 * runs under the four cards; each card stands on it over its own lever. A fine channel runs
 * from every lever along the deck and out of its end into the deck's navy panel, the
 * instrument that watches: response latency, serving throughput, GPU utilisation.
 *
 * A press pulls one lever. Its grip turns from bare steel to flame, the slot fills with light,
 * the card over it lights (edge, tile, number, promise), and the light runs on: along the
 * channel, into the panel, up to the three measures, and each of them takes one step the right
 * way: latency down, throughput and utilisation up. The slide prints no values, so the traces
 * carry none: no track, no end stop, no scale, and every lever moves all three by the same
 * one step. Only the direction is said.
 *
 *   console     the deck, four levers down, the promises unlit; the panel waiting
 *   hardware    lever 01 is pulled
 *   memory      lever 02
 *   runtime     lever 03
 *   footprint   lever 04
 *   measure     the deck's closing line
 *
 * The console is real (levers.ts: a scene-owned canvas under the DOM, in the stage's own
 * space). Without WebGL the same deck, slots and grips are flat DOM (.s60-flat).
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Card, Headline, Words, type SceneModule } from '../../kit'
import { BANNER, BANNER_FLAME, cardX, G, LEAN, LEVERS, PANEL, TRACE, tracePath } from './data'
import { Icon } from './icons'
import { makeLevers, type Levers } from './levers'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${n})`

/** The light's way inside the panel, in tenths of a unit from the panel's top left corner. */
const IN_Y = (G.busV - G.top) * 10
const TRUNK_X = 10.5
const DISC_X = 21
const discY = (k: number) => (G.rowTop[k] + G.disc / 2) * 10
const WAYS = [
  `M0 ${IN_Y}H${TRUNK_X}`,
  ...PANEL.items.map((_, k) => `M${TRUNK_X} ${IN_Y}V${discY(k)}H${DISC_X}`),
]

const Ways = ({ className }: { className: string }) => (
  <g className={className}>
    {WAYS.map((d) => (
      <path key={d} d={d} pathLength={1} />
    ))}
  </g>
)

const scene: SceneModule = {
  beats: ['console', ...LEVERS.map((l) => l.key), 'measure'],

  Scene: ({ slide }) => (
    <div
      className="s60"
      style={
        {
          '--s60-top': u(G.top),
          '--s60-card-h': u(G.cardBot - G.top),
          '--s60-panel-h': u(G.bottom - G.top),
          '--s60-card-w': u(G.cardW),
          '--s60-disc': u(G.disc),
        } as CSSProperties
      }
    >
      <Headline text={slide.title} />

      {/* the flat console: only where there is no WebGL */}
      <div
        className="s60-flat"
        aria-hidden="true"
        style={{ left: u(G.deckX0), top: u(G.deckTop), width: u(G.deckX1 - G.deckX0), height: u(G.deckBot - G.deckTop) }}
      >
        <span className="s60-flat-bus" style={{ left: u(G.cardW / 2), top: u(G.busV - G.deckTop) }} />
        {LEVERS.map((l, i) => (
          <span
            className="s60-flat-slot"
            key={l.key}
            style={{ left: u(cardX(i) + G.cardW / 2 - G.deckX0), top: u(G.pivotV - G.slotH / 2 - G.deckTop), height: u(G.slotH) }}
          >
            <span className="s60-flat-grip" />
          </span>
        ))}
      </div>

      {LEVERS.map((l, i) => (
        <Card className="s60-card" key={l.key} style={{ left: u(cardX(i)) }}>
          <span className="s60-edge" aria-hidden="true" />
          <span className="s60-n">{l.n}</span>
          <span className="s60-tile">
            <span className="s60-tile-on" aria-hidden="true" />
            <Icon name={l.icon} />
          </span>
          <h3 className="s60-title">{l.title}</h3>
          <p className="s60-promise">{l.promise}</p>
          <span className="s60-rule" aria-hidden="true" />
          {l.bullets ? (
            <ul className="s60-detail">
              {l.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          ) : (
            <p className="s60-detail">{l.text}</p>
          )}
        </Card>
      ))}

      <Card className="s60-panel" tone="navy" style={{ left: u(G.panelX), width: u(G.panelW) }}>
        <svg className="s60-ways" viewBox={`0 0 30 ${(G.bottom - G.top) * 10}`} aria-hidden="true">
          <Ways className="s60-ways-dim" />
          <Ways className="s60-ways-lit" />
          <Ways className="s60-ways-flash" />
        </svg>
        <span className="s60-panel-label">{PANEL.label}</span>
        <h3 className="s60-panel-title">
          <Words text={PANEL.title} />
        </h3>
        {PANEL.items.map((m, k) => {
          const { d, y0 } = tracePath(m.better)
          return (
            <div className="s60-meter" key={m.title} style={{ top: u(G.rowTop[k]) }}>
              <span className="s60-disc">
                <Icon name={m.icon} />
              </span>
              <b className="s60-meter-title">{m.title}</b>
              <span className="s60-meter-line">{m.line}</span>
              <svg className="s60-trace" viewBox={`0 0 ${TRACE.w} ${TRACE.h}`} aria-hidden="true">
                <path className="s60-trace-was" d={`M${TRACE.x0} ${y0}H${TRACE.w - 4}`} />
                <path className="s60-trace-line" d={d} />
                <circle className="s60-trace-start" cx={TRACE.x0} cy={y0} r="2.6" />
                <g className="s60-trace-head">
                  <circle r="5" />
                  <path d={m.better === 'up' ? 'M-2.1 1 0 -1.3 2.1 1' : 'M-2.1 -1 0 1.3 2.1 -1'} />
                </g>
              </svg>
            </div>
          )
        })}
      </Card>

      <div className="s60-banner" style={{ top: u(G.bannerTop), height: u(G.bannerH) }}>
        <p>
          <Words text={BANNER} flame={[BANNER_FLAME]} />
        </p>
      </div>
    </div>
  ),

  three(ctx) {
    const lv = makeLevers(ctx, LEVERS.length)
    ctx.bag.lv = lv
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      lv.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const lv = ctx.bag.lv as Levers | undefined
    const cards = ctx.$$('.s60-card')
    const q = (el: Element, s: string) => Array.from(el.querySelectorAll(s))
    const N = LEVERS.length

    const discs = ctx.$$('.s60-disc')
    const flat = ctx.$('.s60-flat')
    const flatGrips = ctx.$$('.s60-flat-grip')
    const flatTravel = 2 * G.reach * U

    /* ---- the traces: one number each, 0 … 1 along the whole line; drawn from that number ---- */
    const lines = ctx.$$<SVGPathElement>('.s60-trace-line')
    const heads = ctx.$$<SVGGElement>('.s60-trace-head')
    const lens = lines.map((l) => l.getTotalLength())
    const prog = lines.map(() => ({ p: 0 }))
    const drawTrace = (k: number) => {
      const p = prog[k].p
      const line = lines[k]
      line.style.strokeDasharray = `${lens[k]}`
      line.style.strokeDashoffset = `${lens[k] * (1 - p)}`
      line.style.opacity = p > 0.002 ? '1' : '0'
      const at = line.getPointAtLength(lens[k] * p)
      heads[k].setAttribute('transform', `translate(${at.x} ${at.y})`)
      heads[k].style.opacity = `${Math.min(1, p * 30)}`
    }
    prog.forEach((_, k) => drawTrace(k))
    ctx.onSeek(() => prog.forEach((_, k) => drawTrace(k)))

    /* ---- starting states: everything unlit, every lever down, the panel waiting ---- */
    gsap.set(ctx.$$('.s60-promise'), { color: '#8792ab' })
    gsap.set(ctx.$$('.s60-n'), { color: '#c5cddc' })
    gsap.set(ctx.$$('.s60-detail'), { opacity: 0.62 })
    gsap.set(ctx.$$('.s60-tile-on'), { autoAlpha: 0 })
    gsap.set(ctx.$$('.s60-edge'), { scaleX: 0, transformOrigin: '0% 50%' })
    gsap.set(flatGrips, { y: flatTravel })
    const lit = ctx.$$<SVGPathElement>('.s60-ways-lit path')
    const flash = ctx.$('.s60-ways-flash')
    gsap.set(lit, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 0 })
    gsap.set(flash, { autoAlpha: 0 })

    /* ------------------------------------------------------------ console */
    a.words('.kn-h', 0.1)
    // the deck and the cards on it come up as one piece, early: the stage is never left empty
    const IN = 0.22
    if (lv) {
      gsap.set(lv.gl.canvas, { autoAlpha: 0 })
      tl.to(lv.gl.canvas, { autoAlpha: 1, duration: 0.55, ease: 'power1.out' }, IN)
      lv.levers.forEach((l) => {
        l.arm.rotation.x = LEAN
        l.state.on = 0
        l.state.flow = 0
      })
      lv.deck.position.y = reduced ? 0 : -2
      if (!reduced) tl.to(lv.deck.position, { y: 0, duration: 0.9, ease: ease.out }, IN)
    }
    a.rise(flat, IN, { y: 2, duration: 0.9 })
    a.rise(cards, IN + 0.1, { stagger: 0.07, y: 2 })
    a.rise('.s60-panel', 0.6, { x: 2, y: 0 })
    a.fade('.s60-panel-label', 0.9)
    a.words('.s60-panel-title', 0.95)
    a.rise('.s60-meter', 1.2, { stagger: 0.12, y: 1 })
    a.fade('.s60-ways-dim', 1.5, { duration: 0.7 })
    a.fade('.s60-trace-was', 1.6, { stagger: 0.12, duration: 0.6 })
    a.pop('.s60-trace-start', 1.8, { stagger: 0.12 })
    tl.to(fx, { glow: 0.22, focusX: 0.5, focusY: 0, duration: 1.6, ease: ease.inOut }, 0.5)
    tl.addLabel('console', 2.6)

    /* ------------------------------------------------- one lever a press */
    let t = 2.6
    LEVERS.forEach((l, i) => {
      const card = cards[i]
      const P = t + 0.05
      const PULL = 0.8
      // the pull: a firm stroke that seats with a little follow-through
      if (lv) {
        const lever = lv.levers[i]
        tl.to(lever.arm.rotation, { x: -LEAN, duration: PULL, ease: reduced ? 'power1.inOut' : ease.snap }, P)
        tl.to(lever.state, { on: 1, duration: 0.45, ease: 'power2.out' }, P + 0.3)
        tl.to(lever.state, { on: 1.9, duration: 0.18, ease: 'power2.out' }, P + 0.55)
        tl.to(lever.state, { on: 1, duration: 0.7, ease: 'power2.inOut' }, P + 0.73)
        // the light leaves the slot and runs the channel to the panel
        tl.to(lever.state, { flow: 1, duration: 0.62, ease: 'power2.inOut' }, P + 0.5)
      }
      tl.to(flatGrips[i], { y: 0, duration: PULL, ease: ease.inOut }, P)
      // its card lights: the edge, the tile, the number, the promise, then the fine print
      const on = P + 0.42
      tl.to(q(card, '.s60-edge'), { scaleX: 1, duration: 0.7, ease: ease.glide }, on)
      tl.to(q(card, '.s60-tile-on'), { autoAlpha: 1, duration: 0.35, ease: 'power1.out' }, on)
      if (!reduced) {
        tl.to(q(card, '.s60-tile'), { scale: 1.14, duration: 0.2, ease: 'power2.out' }, on)
        tl.to(q(card, '.s60-tile'), { scale: 1, duration: 0.5, ease: ease.snap }, on + 0.2)
      }
      tl.to(q(card, '.s60-n'), { color: '#f16443', duration: 0.4 }, on + 0.05)
      tl.to(q(card, '.s60-promise'), { color: '#d9481f', duration: 0.5, ease: 'power1.out' }, on + 0.1)
      tl.to(q(card, '.s60-detail'), { opacity: 1, duration: 0.6, ease: 'power1.out' }, on + 0.3)
      // … into the panel: the way lights the first time and answers every time
      const A = P + 1.08
      if (i === 0) {
        tl.to(lit, { autoAlpha: 1, duration: 0.05 }, A)
        tl.to(lit[0], { strokeDashoffset: 0, duration: 0.12, ease: 'none' }, A)
        tl.to(lit.slice(1), { strokeDashoffset: 0, duration: 0.34, ease: 'power1.out' }, A + 0.12)
      }
      tl.to(flash, { autoAlpha: 1, duration: 0.14, ease: 'power2.out' }, A + 0.05)
      tl.to(flash, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, A + 0.3)
      // the three measures answer together, each by the same one step
      const M = A + 0.4
      if (!reduced) {
        tl.to(discs, { scale: 1.18, duration: 0.2, stagger: 0.06, ease: 'power2.out' }, M - 0.05)
        tl.to(discs, { scale: 1, duration: 0.6, stagger: 0.06, ease: ease.snap }, M + 0.15)
      }
      prog.forEach((o, k) => {
        tl.to(o, { p: (i + 1) / N, duration: 0.95, ease: ease.inOut, onUpdate: () => drawTrace(k) }, M + k * 0.07)
      })
      tl.to(fx, { focusX: -0.75 + i * 0.36, focusY: 0.3, glow: 0.3 + i * 0.04, warm: 0.08 * (i + 1), duration: 1.3, ease: ease.inOut }, P)
      t = M + 1.2
      tl.addLabel(l.key, t)
    })

    /* ------------------------------------------------------------ measure */
    const B = t + 0.05
    a.wipe('.s60-banner', B, { from: 'left', duration: 0.85 })
    a.words('.s60-banner p', B + 0.3, { stagger: 0.035 })
    // the whole console answers once: the four grips, the way, the three discs
    if (lv && !reduced) {
      lv.levers.forEach((l, i) => {
        tl.to(l.state, { on: 1.8, duration: 0.2, ease: 'power2.out' }, B + 0.5 + i * 0.09)
        tl.to(l.state, { on: 1, duration: 0.8, ease: 'power2.inOut' }, B + 0.7 + i * 0.09)
      })
    }
    tl.to(flash, { autoAlpha: 1, duration: 0.16, ease: 'power2.out' }, B + 0.85)
    tl.to(flash, { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, B + 1.05)
    if (!reduced) {
      tl.to(discs, { scale: 1.16, duration: 0.2, stagger: 0.09, ease: 'power2.out' }, B + 0.95)
      tl.to(discs, { scale: 1, duration: 0.6, stagger: 0.09, ease: ease.snap }, B + 1.15)
    }
    tl.to(fx, { focusX: 0.1, focusY: 0.6, glow: 0.42, duration: 1.3, ease: ease.inOut }, B)
    tl.addLabel('measure', B + 1.95)
    return tl
  },
}

export default scene
