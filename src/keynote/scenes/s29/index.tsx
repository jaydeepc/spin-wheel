'use client'

/**
 * Slide 29 · "AI is now part of how we lend, from Sales to Collections"
 *
 * THE IDEA: the headline's last four words are a line, and the slide walks it. A line of five
 * stops runs across the stage, one stop over each lending function; the deck's five rendered
 * scenes hang under it, whole. With every press the light runs on to the next stop and that
 * function LIGHTS UP: its card comes forward (the row makes room like an accordion, so nothing
 * overlaps and its agents are large enough to read from the back), a white panel rises over
 * the lower part of the picture as on the deck, its line is said, its agents cascade in, and
 * the starred ones take their star and turn warm. The functions still ahead wait, dimmed.
 *
 *   journey      the headline, the line, the five scenes
 *   sales        … each function in turn: light, panel, line, agents, stars
 *   credit
 *   operations
 *   experience
 *   collections
 *   support      the line has done its work and leaves; the five settle into one even row and
 *                the functions around lending rise underneath, the Everyday AI / AI
 *                infrastructure box last
 *
 * The star's legend (LEGEND, the presenter's words) sits beside the headline at the right; it
 * arrives with the first star and stays. EVERYDAY AI's heading carries the star too.
 *
 * No canvas: this is pictures and type, moved with GSAP. The five scenes and the three round
 * thumbnails are the deck's own art, as they are (never stretched; the panel covers the lower
 * part of each picture exactly as the deck's does).
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Headline, Kicker, Pic, pic, Words, type SceneModule } from '../../kit'
import { BASE, LEGEND, LENDING, SUPPORT, type Agent } from './data'
import './scene.css'

/* The row, in --u (the stylesheet has the same numbers). */
const X0 = 4.2
const W = 17.4
const G = 1.15
const TRACK = 91.6
/** While the journey is walked the row hangs this much lower, under the line. */
const DROP = 3.6
/** On the first rest, before any function is lit, the line and the row hang this much lower still: the frame is centred under the headline. */
const SHIFT = 3.2
/** A function that is lit comes forward; the other four step back by as much as it takes. */
const LIT = 1.28
const REST = 0.93

const Star = () => (
  <svg className="s29-star" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3l-6.1 3.5 1.4-6.8-5.1-4.7 6.9-.8z" fill="currentColor" />
  </svg>
)

const Pill = ({ a }: { a: Agent }) => (
  <span className="s29-pill" data-star={a.star ? '1' : undefined} data-tight={a.tight ? '1' : undefined}>
    {a.star ? <Star /> : null}
    <b>{a.name}</b>
    {a.note ? <i>{a.note}</i> : null}
  </span>
)

const Rows = ({ rows }: { rows: Agent[][] }) => (
  <>
    {rows.map((row, r) => (
      <span className="s29-prow" key={r}>
        {row.map((a) => (
          <Pill a={a} key={a.name} />
        ))}
      </span>
    ))}
  </>
)

const BEATS = ['journey', ...LENDING.map((f) => f.id), 'support']

const scene: SceneModule = {
  beats: BEATS,
  preload: [...LENDING.map((f) => pic(29, f.picture)), ...SUPPORT.map((f) => pic(29, f.picture))],

  Scene: ({ slide }) => (
    <div className="s29">
      <Headline text={slide.title} flame={['from Sales to Collections']} />

      {/* what the star means (the presenter's words): beside the headline, at the right */}
      <p className="s29-legend">
        <Star />
        <span>{LEGEND}</span>
      </p>

      {/* the line "from Sales to Collections": five stops, a light that runs along it */}
      <div className="s29-track" aria-hidden="true">
        <span className="s29-track-base" />
        <span className="s29-track-fill" />
        <span className="s29-comet" />
        <svg className="s29-tip" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m8 5 7 7-7 7" />
        </svg>
        {LENDING.map((f) => (
          <span className="s29-stop" key={f.id}>
            <span className="s29-stop-on" />
          </span>
        ))}
      </div>

      <div className="s29-row">
        {LENDING.map((f, i) => (
          <div className="s29-card" key={f.id} style={{ left: `calc(var(--u) * ${+(X0 + i * (W + G)).toFixed(3)})` }}>
            <div className="s29-shot">
              <Pic className="s29-pic" n={29} name={f.picture} ratio="643 / 1024" fit="cover" />
              <div className="s29-panel" style={{ '--s29-top': f.panelTop } as CSSProperties}>
                <p className="s29-line">
                  <Words text={f.line} />
                </p>
                <div className="s29-pills">
                  <Rows rows={f.rows} />
                </div>
              </div>
            </div>
            <span className="s29-chip">
              {f.label.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
            <span className="s29-veil" aria-hidden="true" />
            <span className="s29-ring" aria-hidden="true" />
          </div>
        ))}
      </div>

      {/* the functions around lending, and what all of it stands on */}
      <div className="s29-under">
        {SUPPORT.map((f) => (
          <div className="s29-sup" key={f.label}>
            <div className="s29-sup-head">
              <span className="s29-thumb">
                <img src={pic(29, f.picture)} alt="" draggable={false} decoding="async" />
              </span>
              <span className="s29-sup-label">{f.label}</span>
            </div>
            <div className="s29-pills s29-pills--left">
              <Rows rows={f.rows} />
            </div>
          </div>
        ))}
        <div className="s29-base">
          {BASE.map((b) => (
            <div className="s29-base-part" key={b.label}>
              <Kicker tone="flame" block className="s29-base-k">
                {b.star ? <Star /> : null}
                {b.label}
              </Kicker>
              <div className="s29-pills s29-pills--left">
                <Rows rows={b.rows} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const N = LENDING.length
    const cards = ctx.$$('.s29-card')
    const stops = ctx.$$('.s29-stop')
    const row = ctx.$('.s29-row')
    const track = ctx.$('.s29-track')
    const fill = ctx.$('.s29-track-fill')
    const comet = ctx.$('.s29-comet')
    const tip = ctx.$('.s29-tip')
    const lit = reduced ? 1 : LIT
    const rest = reduced ? 1 : REST
    const drop = reduced ? 0 : DROP
    const shift = reduced ? 0 : SHIFT
    const veils = ctx.$$('.s29-veil')

    /** The row with function k lit (k < 0: all five even): each card's left edge, scale and centre, in --u. */
    const layout = (k: number) => {
      let x = X0
      return LENDING.map((_, i) => {
        const s = k < 0 ? 1 : i === k ? lit : rest
        const o = { x, s, cx: x + (W * s) / 2 }
        x += W * s + G
        return o
      })
    }
    const home = (i: number) => X0 + i * (W + G)
    /** Moves the row (and the stops over it) to the layout with k lit. */
    const arrange = (k: number, t: number, duration = 0.95) => {
      layout(k).forEach((p, i) => {
        tl.to(cards[i], { x: (p.x - home(i)) * U, scale: p.s, duration, ease: ease.inOut }, t)
        tl.to(stops[i], { x: (p.cx - X0) * U, duration, ease: ease.inOut }, t)
      })
    }

    /* ---- hidden states ---- */
    gsap.set(cards, { transformOrigin: '0% 0%' })
    gsap.set(row, { y: (drop + shift) * U })
    gsap.set(track, { y: shift * U })
    gsap.set(veils, { autoAlpha: 0 })
    layout(-1).forEach((p, i) => gsap.set(stops[i], { x: (p.cx - X0) * U }))
    gsap.set(fill, { scaleX: 0, transformOrigin: '0% 50%' })
    gsap.set(comet, { x: 0, autoAlpha: 0 })
    gsap.set(ctx.$$('.s29-stop-on, .s29-ring'), { autoAlpha: 0 })
    gsap.set(ctx.$$('.s29-stop-on'), { scale: 0.2 })
    gsap.set(ctx.$$('.s29-panel'), { yPercent: 100 })
    gsap.set(ctx.$$('.s29-star'), { scale: 0, rotation: reduced ? 0 : -80, transformOrigin: '50% 50%' })

    /* ---------------------------------------------------------------- journey */
    a.words('.kn-h', 0.1)
    a.rule('.s29-track-base', 0.45, { duration: 1.3 })
    a.fade(tip, 1.55, { duration: 0.4 })
    // a first light runs the whole line, and the five scenes come up as it passes them
    tl.to(comet, { autoAlpha: 1, duration: 0.2 }, 0.5)
    tl.to(comet, { x: TRACK * U, duration: 1.3, ease: ease.glide }, 0.5)
    tl.to(comet, { autoAlpha: 0, duration: 0.25 }, 1.6)
    a.rise(cards, 0.6, { y: 2.6, stagger: 0.16, duration: 0.95 })
    a.pop('.s29-chip', 0.95, { stagger: 0.16 })
    a.pop(stops, 0.8, { stagger: 0.16 })
    tl.to(fx, { glow: 0.2, focusX: 0, focusY: 0.1, duration: 1.6 }, 0.3)
    tl.addLabel('journey', 2.5)

    /* ------------------------------------------- one function lights up */
    const light = (i: number, t: number): number => {
      const card = cards[i]
      const q = <E extends Element = HTMLElement>(s: string) => Array.from(card.querySelectorAll<E>(s))
      const here = layout(i)[i]
      const front = (here.cx - X0) * U

      // the row makes room; the functions still ahead wait in the half-light
      arrange(i, t)
      // (a cool veil over each, not a fade: the pictures keep their body and the chips stay legible)
      if (i === 0) {
        tl.to(veils.slice(1), { autoAlpha: 1, duration: 0.6, ease: 'power1.inOut' }, t)
        // the line and the row rise from the first rest's centred place to where the journey is walked
        tl.to(row, { y: drop * U, duration: 0.95, ease: ease.inOut }, t)
        tl.to(track, { y: 0, duration: 0.95, ease: ease.inOut }, t)
      } else {
        tl.to(veils[i], { autoAlpha: 0, duration: 0.6, ease: 'power1.inOut' }, t)
        tl.to(cards[i - 1].querySelector('.s29-ring'), { autoAlpha: 0, duration: 0.35 }, t)
      }

      // the light runs on to this stop
      tl.to(fill, { scaleX: front / (TRACK * U), duration: 0.95, ease: ease.inOut }, t)
      tl.set(comet, { x: i === 0 ? 0 : (layout(i - 1)[i - 1].cx - X0) * U }, t)
      tl.to(comet, { autoAlpha: 1, duration: 0.2 }, t + 0.02)
      tl.to(comet, { x: front, duration: 0.93, ease: ease.inOut }, t + 0.02)
      tl.to(comet, { autoAlpha: 0, duration: 0.3 }, t + 0.85)
      tl.to(stops[i].querySelector('.s29-stop-on'), { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.snap }, t + 0.7)
      tl.to(q('.s29-ring'), { autoAlpha: 1, duration: 0.5 }, t + 0.45)
      tl.to(fx, { glow: 0.34, focusX: (here.cx / 100) * 1.7 - 0.85, focusY: 0.15, warm: 0.12, duration: 1.2, ease: ease.inOut }, t)

      // the panel rises over the lower part of the picture; its line; its agents
      tl.to(q('.s29-panel'), { yPercent: 0, y: 0, duration: 0.9, ease: ease.out }, t + 0.5)
      // (the words travel up with the panel: it is never an empty white sheet)
      a.words(q('.s29-line'), t + 0.55, { stagger: 0.03, duration: 0.6 })
      const pills = q('.s29-pill')
      a.rise(pills, t + 0.7, { y: 0.9, stagger: 0.055, duration: 0.6 })
      // the starred ones take their star and turn warm
      pills.forEach((p, n) => {
        if (!p.dataset.star) return
        const at = t + 0.7 + n * 0.055 + 0.42
        tl.to(p, { backgroundColor: '#fff0e9', borderColor: '#f16443', duration: 0.4, ease: 'power1.out' }, at)
        tl.to(p.querySelector('.s29-star'), { scale: 1, rotation: 0, duration: 0.55, ease: ease.snap }, at)
      })
      return t + 0.7 + pills.length * 0.055 + 0.42 + 0.7
    }

    // what the star means: it arrives, quietly, with the first star, and stays
    const firstStar = 2.5 + 0.7 + 0.42
    a.fade('.s29-legend', firstStar, { duration: 0.6 })
    tl.to(ctx.$('.s29-legend .s29-star'), { scale: 1, rotation: 0, duration: 0.55, ease: ease.snap }, firstStar)

    let t = 2.5
    LENDING.forEach((f, i) => {
      t = light(i, t)
      // the last stop: the light runs out to the end of the line
      if (i === N - 1) {
        tl.to(fill, { scaleX: 1, duration: 0.6, ease: ease.glide }, t - 0.9)
        tl.to(tip, { color: '#f16443', duration: 0.3 }, t - 0.4)
      }
      tl.addLabel(f.id, t)
    })

    /* ---------------------------------------------------------------- support */
    // the line has done its work; the five settle into one even row, higher, and make room below
    tl.to(track, { autoAlpha: 0, y: -0.8 * U, duration: 0.4, ease: 'power2.in' }, t)
    tl.to(cards[N - 1].querySelector('.s29-ring'), { autoAlpha: 0, duration: 0.4 }, t)
    arrange(-1, t + 0.1, 1.0)
    tl.to(row, { y: 0, duration: 1.0, ease: ease.inOut }, t + 0.1)
    tl.to(fx, { glow: 0.26, focusX: 0, focusY: 0.6, warm: 0.05, duration: 1.4, ease: ease.inOut }, t)
    const sups = ctx.$$('.s29-sup')
    a.rise(sups, t + 0.65, { y: 2.4, stagger: 0.12 })
    a.pop('.s29-thumb', t + 0.9, { stagger: 0.12 })
    sups.forEach((s, i) => a.rise(Array.from(s.querySelectorAll('.s29-pill')), t + 1.05 + i * 0.12, { y: 0.8, stagger: 0.045, duration: 0.55 }))
    a.rise('.s29-base', t + 1.15, { y: 2.4 })
    a.rise('.s29-base-k, .s29-base .s29-pill', t + 1.5, { y: 0.7, stagger: 0.04, duration: 0.55 })
    // Everyday AI takes its star as the agents did: a moment after its heading has arrived
    tl.to(ctx.$$('.s29-base-k .s29-star'), { scale: 1, rotation: 0, duration: 0.55, ease: ease.snap }, t + 1.5 + 0.42)
    tl.addLabel('support', t + 2.4)

    return tl
  },
}

export default scene
