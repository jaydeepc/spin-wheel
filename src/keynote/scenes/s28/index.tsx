'use client'

/**
 * Slide 28 · "While we have multiple agents helping across functions, we have star agents shapes
 * our core lending functions"   (the headline is the deck's, slip and all: deck.ts)
 *
 * A CAST INTRODUCTION. The deck's four portraits are round badges, so every agent is a badge:
 * the many are small blank medallions far in the room (real meshes, medallions.ts), and four
 * larger ones wait in the cast's seats along the bottom. One press, one star: its medallion
 * lifts off its seat, banks, flies toward the room and lands on stage, its portrait appears on
 * its face, and its name comes up large with the lending function it works in and what it does.
 * At the next press it takes its seat, now with a face, and the next one comes up.
 *
 *   pia        the headline; the many arrive; four blank stars take their seats; PIA comes on stage
 *   arya       PIA takes its seat, Arya comes on stage
 *   abcd       … ABCD
 *   nivaaran   … Nivaaran (the deck has no portrait for it: emblem.tsx)
 *   together   the deck's own picture: all four in a row with their names; the many leave the edges
 *              and line up beside "and many more….", a queue that runs off into the distance
 *
 * The portraits are the deck's own files, as they are, never larger than the deck shows them
 * (16.2u). Each is ONE element that travels (stage, seat, row), so nothing is ever swapped.
 * Without WebGL the seats hold flat blank badges and the portraits simply arrive on stage.
 */

import gsap from 'gsap'
import { anim, Headline, Kicker, pic, Words, type SceneModule } from '../../kit'
import { AGENTS, SHOW_ROLES, TAIL } from './data'
import { NivaaranEmblem } from './emblem'
import { CROWD, HERO, HOME, ROW, SEAT } from './layout'
import { makeMedals, type Medals } from './medallions'
import './scene.css'

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`
const box = (cx: number, cy: number, d: number) => ({ left: u(cx - d / 2), top: u(cy - d / 2), width: u(d), height: u(d) })

/** How present the many are while one agent is on stage (1 when all four stand together). */
const QUIET = 0.46

const scene: SceneModule = {
  beats: [...AGENTS.map((a) => a.key), 'together'],
  preload: AGENTS.flatMap((a) => (a.picture ? [pic(28, a.picture)] : [])),

  Scene: ({ slide }) => (
    <div className="s28">
      <Headline text={slide.title} flame={['star agents']} />

      {/* the cast's seats */}
      {AGENTS.map((a, i) => (
        <div className="s28-seat" key={a.key} style={box(SEAT.xs[i], SEAT.y, SEAT.ring)}>
          <span className="s28-ring" aria-hidden="true" />
          <span className="s28-ring-on" aria-hidden="true" />
          <span className="s28-blank" aria-hidden="true" />
          <span className="s28-seat-name">{a.name}</span>
        </div>
      ))}

      {/* on stage: one agent at a time */}
      {AGENTS.map((a) => (
        <div className="s28-hero" key={a.key} style={{ left: u(HERO.textX), top: u(HERO.cy - HERO.rise) }}>
          <div className="s28-hero-in">
            {SHOW_ROLES ? (
              <span className="s28-hero-fn">
                <Kicker tone="flame">{a.fn}</Kicker>
              </span>
            ) : null}
            <h2 className="s28-hero-name">
              <Words text={a.name} />
            </h2>
            {SHOW_ROLES ? (
              <p className="s28-hero-does">
                <Words text={a.does} />
              </p>
            ) : null}
          </div>
        </div>
      ))}

      {/* all four together: the words under the deck's row */}
      {AGENTS.map((a, i) => (
        <div className="s28-col" key={a.key} style={{ left: u(ROW.xs[i] - ROW.colW / 2), top: u(ROW.textTop), width: u(ROW.colW) }}>
          <h3 className="s28-col-name">
            <Words text={a.name} />
          </h3>
          {SHOW_ROLES ? (
            <>
              <span className="s28-col-fn">
                <Kicker tone="flame">{a.fn}</Kicker>
              </span>
              <p className="s28-col-does">{a.does}</p>
            </>
          ) : null}
        </div>
      ))}
      <p className="s28-tail">
        <Words text={TAIL} />
      </p>

      {/* the portraits: each is one element, laid out on stage, that travels to its seat and into the row */}
      {AGENTS.map((a) => (
        <div className="s28-face" key={a.key} style={box(HERO.cx, HERO.cy, HERO.d)}>
          <span className="s28-halo" aria-hidden="true" />
          {a.picture ? <img className={`s28-pic s28-pic--${a.key}`} src={pic(28, a.picture)} alt={a.name} draggable={false} decoding="async" /> : <NivaaranEmblem />}
        </div>
      ))}
    </div>
  ),

  three(ctx) {
    const medals = makeMedals(ctx, HOME, CROWD, AGENTS.length)
    ctx.bag.medals = medals
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      medals.gl.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const medals = ctx.bag.medals as Medals | undefined
    const N = AGENTS.length
    const faces = ctx.$$('.s28-face')
    const heroes = ctx.$$('.s28-hero')
    const seats = ctx.$$('.s28-seat')
    const cols = ctx.$$('.s28-col')
    const q = (el: Element, sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel))

    /* ---- where a portrait can be: on stage (as laid out), in its seat, in the row ---- */
    const inSeat = (i: number) => ({ x: (SEAT.xs[i] - HERO.cx) * U, y: (SEAT.y - HERO.cy) * U, scale: SEAT.face / HERO.d })
    const inRow = (i: number) => ({ x: (ROW.xs[i] - HERO.cx) * U, y: (ROW.y - HERO.cy) * U, scale: ROW.d / HERO.d })
    /** A portrait goes somewhere. (Less motion: it fades out where it is and in where it belongs.) */
    const travel = (el: Element, to: { x: number; y: number; scale: number }, at: number, duration: number) => {
      if (reduced) {
        tl.to(el, { autoAlpha: 0, duration: 0.2, ease: 'power1.in' }, at)
        tl.set(el, to, at + 0.21)
        tl.to(el, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, at + 0.22)
      } else tl.to(el, { ...to, duration, ease: ease.inOut }, at)
    }

    /* ---- hidden starts ---- */
    gsap.set(faces, { autoAlpha: 0 })
    gsap.set(ctx.$$('.s28-halo'), { autoAlpha: 0, scale: 0.94 })
    gsap.set(ctx.$$('.s28-ring-on'), { autoAlpha: 0 })
    if (SHOW_ROLES) gsap.set(ctx.$$('.s28-hero-fn'), { autoAlpha: 0, y: 0.6 * U })
    gsap.set(ctx.$$('.s28-hero .kn-wi'), reduced ? { autoAlpha: 0 } : { yPercent: 118 })
    gsap.set(ctx.$$('.s28-seat-name'), { autoAlpha: 0, x: -0.8 * U })

    /* ---------------------------------------------------------------- the stage is set */
    a.words('.kn-h', 0.1, { stagger: 0.035 })
    tl.to(fx, { travel: reduced ? 0 : 22, duration: 2.4, ease: 'power3.out' }, 0)
    if (medals) {
      // the many arrive out of the depth of the room
      medals.field.gather = reduced ? 1 : 0
      // while one agent is on stage they stay quiet (half there); they come to full strength only when all four stand together
      medals.field.dim = reduced ? 0 : QUIET
      if (reduced) tl.to(medals.field, { dim: QUIET, duration: 0.8, ease: 'power1.out' }, 0.2)
      else tl.to(medals.field, { gather: 1, duration: 1.7, ease: 'power2.out' }, 0.1)
    }
    a.pop('.s28-ring', 0.5, { stagger: 0.09 })
    if (medals) {
      // four blank stars take their seats
      medals.stars.forEach((s, i) => {
        s.u = SEAT.xs[i]
        s.v = SEAT.y
        s.z = 0
        s.group.rotation.set(0, 0, 0)
        s.r = reduced ? SEAT.star : SEAT.star * 0.35
        s.opacity = 0
        s.float = 1
        s.spark = 1
        tl.to(s, { opacity: 1, duration: 0.35, ease: 'power1.out' }, 0.62 + i * 0.09)
        if (!reduced) tl.to(s, { r: SEAT.star, duration: 0.65, ease: ease.snap }, 0.62 + i * 0.09)
      })
    } else a.pop('.s28-blank', 0.62, { stagger: 0.09 })

    /** Agent i comes on stage, starting at time t. Returns the time at which the frame rests. */
    const introduce = (i: number, t: number): number => {
      const face = faces[i]
      const hero = heroes[i]
      const seat = seats[i]
      const star = medals?.stars[i]
      const warm = AGENTS[i].key === 'abcd' ? -0.25 : 0.2 // the robot's light is the cool one
      tl.to(q(seat, '.s28-ring-on'), { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, t)
      tl.to(fx, { glow: 0.42, focusX: (HERO.cx - 50) / 50, focusY: (HERO.cy - 28.125) / 28.125, warm, duration: 1.3, ease: ease.inOut }, t)
      let land = t + 0.25
      if (star && medals && !reduced) {
        // its medallion lifts off its seat, banks and flies toward the room, and lands on stage
        const D = 1.05
        const side = SEAT.xs[i] > HERO.cx ? 1 : -1
        tl.to(star, { float: 0, duration: 0.25, ease: 'power1.out' }, t)
        // up first, then across: an arc, not a straight line
        tl.to(star, { v: HERO.cy, duration: D, ease: 'power3.out' }, t)
        tl.to(star, { u: HERO.cx, duration: D, ease: ease.inOut }, t)
        tl.to(star, { z: 15, duration: D * 0.5, ease: 'power2.out' }, t)
        tl.to(star, { z: 0, duration: D * 0.5, ease: 'power2.inOut' }, t + D * 0.5)
        tl.to(star, { r: HERO.d / 2 - 0.1, duration: D, ease: ease.inOut }, t)
        // never edge-on: a banked turn of less than a quarter, and level again as it lands
        tl.to(star.group.rotation, { y: side * 0.8, x: -0.32, duration: D * 0.45, ease: 'power2.out' }, t)
        tl.to(star.group.rotation, { y: 0, x: 0, duration: D * 0.55, ease: 'power2.inOut' }, t + D * 0.45)
        // its spark goes on the way: it lands blank, and the portrait opens on a clean face
        tl.to(star, { spark: 0, duration: D * 0.4, ease: 'power1.in' }, t + D * 0.3)
        land = t + D - 0.14
        tl.to(star, { opacity: 0, duration: 0.25, ease: 'power1.in' }, land + 0.2)
      } else {
        if (star) tl.to(star, { opacity: 0, duration: 0.25, ease: 'power1.in' }, t)
        else tl.to(q(seat, '.s28-blank'), { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, t)
      }
      // its face appears on the medallion, and a ring of light leaves it
      if (!star && !reduced) gsap.set(face, { scale: 0.7 })
      tl.to(face, { autoAlpha: 1, scale: 1, duration: star ? 0.32 : 0.6, ease: star ? 'power2.out' : ease.snap }, land)
      const halo = q(face, '.s28-halo')
      if (!reduced) {
        tl.to(halo, { autoAlpha: 1, duration: 0.14, ease: 'none' }, land + 0.05)
        tl.to(halo, { scale: 1.24, duration: 0.8, ease: 'power2.out' }, land + 0.05)
        tl.to(halo, { autoAlpha: 0, duration: 0.55, ease: 'power1.in' }, land + 0.3)
      }
      // its words: the function it works in, its name, what it does
      const say = land + 0.08
      if (SHOW_ROLES) tl.to(q(hero, '.s28-hero-fn'), { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, say)
      const name = q(hero, '.s28-hero-name .kn-wi')
      const does = q(hero, '.s28-hero-does .kn-wi')
      // (a.leave, a.fade and a.rise below do nothing when given nothing: SHOW_ROLES false needs no guard there)
      if (reduced) tl.to([...name, ...does], { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, say)
      else {
        tl.to(name, { yPercent: 0, duration: 0.9, ease: ease.out }, say + 0.06)
        if (does.length) tl.to(does, { yPercent: 0, duration: ctx.T.word, stagger: 0.03, ease: ease.out }, say + 0.34)
      }
      return does.length ? say + 0.34 + ctx.T.word + does.length * 0.03 + 0.1 : say + 1.0
    }

    /** Agent i has been introduced: its words go, and it takes its seat (now with a face). */
    const seatIt = (i: number, t: number) => {
      const hero = heroes[i]
      a.leave([...q(hero, '.s28-hero-fn'), ...q(hero, '.s28-hero-name'), ...q(hero, '.s28-hero-does')], t, { stagger: 0.03 })
      travel(faces[i], inSeat(i), t + 0.05, 0.95)
      tl.to(q(seats[i], '.s28-ring-on'), { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, t + 0.7)
      tl.to(q(seats[i], '.s28-seat-name'), { autoAlpha: 1, x: 0, duration: 0.6, ease: ease.out }, t + 0.72)
    }

    let rest = introduce(0, 1.25)
    tl.addLabel(AGENTS[0].key, rest)
    for (let i = 1; i < N; i++) {
      seatIt(i - 1, rest)
      // the next one lifts off only when the one before has cleared its way to its seat
      rest = introduce(i, rest + 0.55)
      tl.addLabel(AGENTS[i].key, rest)
    }

    /* ---------------------------------------------------------------- all four together */
    const T0 = rest
    const last = heroes[N - 1]
    a.leave([...q(last, '.s28-hero-fn'), ...q(last, '.s28-hero-name'), ...q(last, '.s28-hero-does')], T0, { stagger: 0.03 })
    tl.to(ctx.$$('.s28-ring, .s28-ring-on, .s28-seat-name'), { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, T0)
    // the one on stage steps across to the end of the row first (its way is the longest and crosses the
    // others' places); then the seats empty into the deck's row
    faces.forEach((face, i) => (i === N - 1 ? travel(face, inRow(i), T0 + 0.05, 0.95) : travel(face, inRow(i), T0 + 0.42 + i * 0.09, 1.05)))
    tl.to(fx, { glow: 0.3, focusX: 0, focusY: -0.05, warm: 0.05, duration: 1.6, ease: ease.inOut }, T0)
    if (medals) {
      // the many leave the edges and line up beside the words
      if (reduced) {
        tl.to(medals.field, { dim: 0, duration: 0.25, ease: 'power1.in' }, T0)
        tl.set(medals.field, { crowd: 1 }, T0 + 0.26)
        tl.to(medals.field, { dim: 1, duration: 0.6, ease: 'power1.out' }, T0 + 0.3)
      } else {
        tl.to(medals.field, { crowd: 1, duration: 2.2, ease: 'power2.inOut' }, T0 + 0.2)
        tl.to(medals.field, { dim: 1, duration: 1.2, ease: 'power1.out' }, T0 + 0.05)
      }
    }
    cols.forEach((col, i) => {
      const at = T0 + 1.2 + i * 0.09
      a.words(q(col, '.s28-col-name'), at, { duration: 0.8 })
      a.fade(q(col, '.s28-col-fn'), at + 0.25, { duration: 0.5 })
      a.rise(q(col, '.s28-col-does'), at + 0.3, { y: 0.8 })
    })
    a.words('.s28-tail', T0 + 2.0, { stagger: 0.07 })
    tl.addLabel('together', T0 + 2.95)
    return tl
  },
}

export default scene
