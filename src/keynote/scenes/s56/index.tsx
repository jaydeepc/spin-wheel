'use client'

/**
 * Slide 56 · "At Piramal, we have built an AI ecosystem"
 *
 * THE IDEA. The deck's centre is a chip icon in a disc with a dotted orbit: "the engine that runs
 * it all". Here the engine is a real object: a chip of three layers (board, carrier, die) that
 * hangs apart in an exploded view and then seats itself, layer on layer, inside an orbit of
 * beads. Then the six parts of the ecosystem dock around it in pairs. Each one sends a stream
 * down its connector into the orbit; where it arrives, that stretch of the orbit turns flame and
 * the die burns a little brighter. By the last pair the whole orbit is alight and turning.
 *
 *   engine   headline; the chip assembles; the orbit; the new logo, the pill, the line
 *   build    Our own team · Our own models
 *   learn    Our own platform · Annotation & hindsighting
 *   open     Open architecture, alone: five sectors of the orbit burn, one is still cold
 *   ask      Business sponsorship, alone and last: the orbit closes, the engine runs, the card
 *            that asked the question takes the flame
 *
 * Without WebGL the deck's flat chip disc stands in the centre and the orbit is a dotted ring.
 */

import gsap from 'gsap'
import { anim, Headline, Logo, Words, type SceneModule } from '../../kit'
import { LAST, LEFT, LINE, LINKS, PILL, RIGHT, type Part } from './data'
import { makeEngine, type Engine } from './engine'
import { ICONS } from './icons'
import './scene.css'

const PARTS: Part[] = [...LEFT, ...RIGHT]

function PartCard({ part, k }: { part: Part; k: number }) {
  const i = part.title.indexOf(part.flame)
  const q = part.quote ? part.text.indexOf(part.quote) : -1
  return (
    <div className={`s56-card s56-card--${k < 3 ? 'l' : 'r'}${k === LAST ? ' s56-card--last' : ''}`} data-k={k} data-row={k % 3}>
      {k === LAST && <span className="s56-seal" aria-hidden="true" />}
      <span className="s56-ico">{ICONS[part.icon]}</span>
      <div className="s56-txt">
        <h3 className="s56-title">
          {part.title.slice(0, i)}
          <em>{part.flame}</em>
          {part.title.slice(i + part.flame.length)}
        </h3>
        <p className="s56-body">
          {q < 0 ? (
            part.text
          ) : (
            <>
              {part.text.slice(0, q)}
              <q className="s56-quote">{part.quote}</q>
              {part.text.slice(q + (part.quote ?? '').length)}
            </>
          )}
        </p>
      </div>
    </div>
  )
}

const scene: SceneModule = {
  beats: ['engine', 'build', 'learn', 'open', 'ask'],

  Scene: ({ slide }) => (
    <div className="s56">
      <Headline text={slide.title} />

      <span className="s56-halo" aria-hidden="true" />
      <span className="s56-disc" aria-hidden="true" />
      <span className="s56-shadow" aria-hidden="true" />
      {/* the stand-ins where there is no WebGL */}
      <svg className="s56-ring" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="49.2" />
      </svg>
      <span className="s56-flat" aria-hidden="true">
        {ICONS.chip}
      </span>

      <svg className="s56-links" viewBox="0 0 100 56.25" aria-hidden="true">
        {LINKS.map((l) => (
          <g key={l.k}>
            <path className="s56-link" data-k={l.k} d={l.d} />
            <circle className="s56-plug" data-k={l.k} cx={l.start[0]} cy={l.start[1]} r="0.42" />
          </g>
        ))}
      </svg>

      <Logo className="s56-logo" height={3.3} />
      <span className="s56-pill">{PILL}</span>
      <p className="s56-line">
        <Words text={LINE} />
      </p>

      {PARTS.map((p, k) => (
        <PartCard key={p.title} part={p} k={k} />
      ))}
    </div>
  ),

  three(ctx) {
    const engine = makeEngine(ctx)
    ctx.bag.engine = engine
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      engine.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const engine = ctx.bag.engine as Engine | undefined
    const cards = ctx.$$('.s56-card')
    const links = ctx.$$<SVGPathElement>('.s56-link')
    const plugs = ctx.$$<SVGCircleElement>('.s56-plug')
    const halo = ctx.$('.s56-halo')
    const icos = ctx.$$('.s56-ico')

    gsap.set(links, { drawSVG: '0%', autoAlpha: 0 })
    gsap.set(plugs, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
    gsap.set(halo, { autoAlpha: 0, scale: 0.7 })

    /* --------------------------------------------------------------- engine */
    a.words('.kn-h', 0.1)
    a.pop('.s56-disc', 0.3, { from: 0.5, duration: 0.9, ease: ease.out })
    a.fade('.s56-shadow', 1.5, { duration: 0.8 })
    tl.to(fx, { glow: 0.3, focusX: 0, focusY: 0, warm: 0.2, duration: 1.6 }, 0.3)
    if (engine) {
      const { layers, state } = engine
      // the exploded view: three layers hanging apart, then seating themselves one on another
      layers.forEach((l, i) => {
        l.lift = reduced ? 0 : 2.2 + i * 2.6
        l.show = 0
        tl.to(l, { show: 1, duration: 0.5, ease: 'power1.out' }, 0.45 + i * 0.16)
        tl.to(l, { lift: i * 1.5, duration: 0.8, ease: ease.out }, 0.45 + i * 0.16)
        tl.to(l, { lift: 0, duration: 0.6, ease: 'power3.inOut' }, 1.5 + i * 0.22)
      })
      state.orbit = 0
      state.idle = 0
      state.power = 0
      state.lap = 0
      state.lit.fill(0)
      state.front.fill(0)
      tl.to(state, { orbit: 1, duration: 1.5, ease: ease.inOut }, 0.7)
      tl.to(state, { power: 0.22, duration: 0.5, ease: 'power2.out' }, 2.5)
      tl.to(state, { idle: 1, duration: 1.2, ease: 'power1.inOut' }, 2.6)
    } else {
      a.draw('.s56-ring circle', 0.6, { duration: 1.4 })
      a.pop('.s56-flat', 0.9)
    }
    tl.to(halo, { autoAlpha: 0.35, scale: 0.8, duration: 0.7, ease: 'power2.out' }, 2.5)
    a.wipe('.s56-logo', 2.3, { duration: 0.8 })
    a.pop('.s56-pill', 2.75, { from: 0.8 })
    a.words('.s56-line', 3.0)
    tl.addLabel('engine', 3.9)

    /* ------------- they dock: two pairs, then Open architecture, then the one that closes it */
    const last = cards[LAST]
    const seal = ctx.$('.s56-seal')
    const pill = ctx.$('.s56-pill')
    gsap.set(last, { '--s56-on': 0 })
    gsap.set(seal, { autoAlpha: 0 })
    const steps: { beat: string; ks: number[]; power: number }[] = [
      { beat: 'build', ks: [0, 3], power: 0.44 },
      { beat: 'learn', ks: [1, 4], power: 0.66 },
      { beat: 'open', ks: [2], power: 0.8 },
      { beat: 'ask', ks: [LAST], power: 1 },
    ]
    let t = 3.9
    steps.forEach(({ beat, ks, power }) => {
      const closing = beat === 'ask'
      ks.forEach((k, j) => {
        const at = t + j * 0.32
        const side = k < 3 ? -1 : 1
        const card = cards[k]
        if (reduced) gsap.set(card, { autoAlpha: 0 })
        else gsap.set(card, { autoAlpha: 0, x: side * (closing ? 4.4 : 3.2) * U })
        tl.to(card, { autoAlpha: 1, x: 0, duration: closing ? 1.05 : 0.85, ease: ease.out }, at)
        a.pop(icos[k], at + 0.3)
        // it plugs in: the connector runs to the orbit …
        tl.to(plugs[k], { autoAlpha: 1, scale: 1, duration: 0.4, ease: ease.snap }, at + 0.55)
        tl.to(links[k], { autoAlpha: 1, duration: 0.01, ease: 'none' }, at + 0.6)
        tl.to(links[k], { drawSVG: '100%', duration: 0.75, ease: ease.glide }, at + 0.6)
        if (engine) {
          // … a stream runs down it, and where it arrives the orbit takes fire
          tl.to(engine.state.front, { [k]: 1, duration: 0.9, ease: 'power1.inOut' }, at + 0.75)
          tl.to(engine.state.lit, { [k]: 1, duration: 0.7, ease: 'power2.out' }, at + 1.45)
        }
      })
      if (engine) tl.to(engine.state, { power, duration: 0.9, ease: 'power2.out' }, t + 1.6)
      tl.to(
        halo,
        {
          autoAlpha: 0.35 + power * 0.65,
          scale: 0.8 + power * 0.2,
          duration: 1.0,
          ease: 'power2.out',
        },
        t + 1.6,
      )
      tl.to(
        fx,
        {
          glow: 0.3 + power * 0.25,
          warm: 0.2 + power * 0.25,
          energy: power * 0.3,
          duration: 1.2,
        },
        t + 1.2,
      )
      if (closing) {
        // the sixth is in: the orbit closes and the engine runs. One bright stream goes once round the whole orbit, the halo
        // opens, the pill answers; and the card that asked the question takes the flame: its rim, its icon, its question
        if (engine && !reduced) tl.to(engine.state, { lap: 1, duration: 1.0, ease: 'power1.inOut' }, t + 1.7)
        tl.to(halo, { autoAlpha: 1, scale: 1.14, duration: 0.9, ease: 'power2.out' }, t + 1.8)
        tl.to(pill, { scale: 1.07, duration: 0.3, ease: 'power2.out' }, t + 1.9)
        tl.to(pill, { scale: 1, duration: 0.55, ease: ease.snap }, t + 2.2)
        tl.to(seal, { autoAlpha: 1, duration: 0.7, ease: 'power2.out' }, t + 2.5)
        tl.to(last, { '--s56-on': 1, duration: 0.7, ease: 'power2.out' }, t + 2.5)
        if (!reduced) {
          tl.to(last, { scale: 1.03, duration: 0.35, ease: 'power2.out' }, t + 2.5)
          tl.to(last, { scale: 1, duration: 0.6, ease: ease.snap }, t + 2.85)
        }
        t += 3.5
      } else t += ks.length > 1 ? 2.6 : 2.3
      tl.addLabel(beat, t)
    })
    return tl
  },
}

export default scene
