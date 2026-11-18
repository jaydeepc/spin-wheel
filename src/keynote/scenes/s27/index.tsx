'use client'

/**
 * Slide 27 · "What happened in Piramal.AI in the past 12m?"
 *
 * The company's own pin-board: THE SAME BOARD as slide 16 (the world), now with the eight themes
 * that emerged inside the company round the words in the middle. The board, the cards, their
 * places and the flame pins are slide 16's (its values copied here, nothing imported), so the room
 * reads "the world, then us".
 *
 * THE IDEA: the board fills, and then it closes into one thing. Each card flies to its own place,
 * a pin goes in, the card swings on the pin and hangs at the deck's own tilt; its object arrives
 * with a move of its own (the blocks drop on to the pile, the seedling grows from its bricks, the
 * magnifier sweeps in, the links turn shut, the phone stands up) and its words rise. When the
 * eighth is up, a flame thread runs clockwise from card to card, each card answering with a nudge
 * on its pin, until the ring is closed round the words in the middle, and the light comes home to
 * "Piramal.ai": eight themes, one company.
 *
 *   five   the headline, the board, the words in the middle, eight faint places; the top row and
 *          the two cards beside the words pin on
 *   all    the bottom row; then the thread ties the eight into one ring round the words
 *
 * The deck's flat icons are rebuilt as eight rendered objects of one family (public/keynote/gen/27,
 * prompts in GEN.md): each shows what its icon showed. Every object stands in front of a smaller
 * tinted disc, by the same proportion. Words and geometry: data.ts. No canvas.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, gen, Headline, Words, type SceneModule } from '../../kit'
import { CENTRE, THEMES, type Theme } from './data'
import './scene.css'

/** The deck's cards, in --u. */
const CARD_W = 26.2
const CARD_H = 9.6
/** The deck's page runs lower than the keynote's safe area: the whole board is lifted, as slide 16's is (its rows then sit where slide 16's sit). */
const DY = -2.9
/** Where the pin holds a card, from the card's top edge, in --u (slide 16's). */
const PIN = 0.85

const BEATS = ['five', 'all'] as const
/** Which cards each beat pins on, in the deck's reading order. */
const GROUPS = [
  [0, 1, 2, 3, 4],
  [5, 6, 7],
]
/** Round the board, clockwise from the first card: the way the thread runs. */
const ROUND = [0, 1, 2, 4, 7, 6, 5, 3]

/** A card's middle on the stage as it hangs: its box is turned by its tilt about its pin. */
function hung(t: Theme) {
  const a = (t.tilt * Math.PI) / 180
  const d = CARD_H / 2 - PIN
  const px = t.cx
  const py = t.cy + DY - d
  return { x: px - Math.sin(a) * d, y: py + Math.cos(a) * d, a }
}
/** Where the straight line from card `from` toward the point (tx, ty) leaves the card's edge. */
function edge(from: Theme, tx: number, ty: number) {
  const c = hung(from)
  const dx = tx - c.x
  const dy = ty - c.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  // the direction in the card's own (unturned) frame
  const lx = ux * Math.cos(-c.a) - uy * Math.sin(-c.a)
  const ly = ux * Math.sin(-c.a) + uy * Math.cos(-c.a)
  const k = Math.min(lx ? CARD_W / 2 / Math.abs(lx) : Infinity, ly ? CARD_H / 2 / Math.abs(ly) : Infinity)
  return { x: c.x + ux * k, y: c.y + uy * k }
}
/** The thread, piece by piece: from one card's edge to the next card's edge, bowed a little away from the middle of the board. */
const TIES = ROUND.map((i, k) => {
  const A = THEMES[i]
  const B = THEMES[ROUND[(k + 1) % ROUND.length]]
  const ca = hung(A)
  const cb = hung(B)
  let p = edge(A, cb.x, cb.y)
  let q = edge(B, ca.x, ca.y)
  // between two rows the thread meets the lower card where its pin is: there it is wound on the pin itself (no knot of its own)
  const upright = Math.abs(cb.y - ca.y) > Math.abs(cb.x - ca.x)
  const onPin = upright ? (cb.y > ca.y ? 'b' : 'a') : ''
  const toPin = (lower: Theme, other: { x: number; y: number }) => {
    const pin = { x: lower.cx, y: lower.cy + DY - CARD_H / 2 + PIN }
    const l = Math.hypot(other.x - pin.x, other.y - pin.y)
    return { x: pin.x + ((other.x - pin.x) / l) * 0.6, y: pin.y + ((other.y - pin.y) / l) * 0.6 }
  }
  if (onPin === 'b') q = toPin(B, p)
  if (onPin === 'a') p = toPin(A, q)
  const mx = (p.x + q.x) / 2
  const my = (p.y + q.y) / 2
  const ox = mx - 50
  const oy = my - (28.6 + DY)
  const ol = Math.hypot(ox, oy) || 1
  const bow = upright ? 0.3 : 0.55
  const f = (v: number) => v.toFixed(2)
  return { d: `M${f(p.x)} ${f(p.y)} Q${f(mx + (ox / ol) * bow)} ${f(my + (oy / ol) * bow)} ${f(q.x)} ${f(q.y)}`, p, q, onPin, to: ROUND[(k + 1) % ROUND.length] }
})

/** How each object comes on to its disc: where it starts (x, y in --u), and how long it takes. */
const ARRIVE: Record<string, { x?: number; y?: number; scale?: number; rotation?: number; origin?: string; duration?: number }> = {
  value: { y: -2.6, scale: 0.92, duration: 0.7 }, // the blocks drop on to the pile
  jugalbandi: { scale: 0.55, duration: 0.75 }, // the two step forward together
  workflow: { x: -2.4, scale: 0.9, duration: 0.8 }, // the steps run in along their line
  matured: { scale: 0.18, origin: '50% 96%', duration: 1.15 }, // the seedling grows from its bricks
  learn: { x: -2.2, y: 1.2, rotation: -32, duration: 1.0 }, // the magnifier sweeps across
  ecosystem: { scale: 0.45, rotation: -80, duration: 0.95 }, // the network turns open
  connected: { scale: 0.7, rotation: 48, duration: 0.95 }, // the links turn shut
  native: { y: 2.6, rotation: 9, origin: '50% 100%', duration: 0.8 }, // the phone stands up
}

/** Where each object's foot is, below the middle of its picture box, in --u (from the picture's own alpha box): its shadow lies there. */
const FOOT: Record<string, number> = { jugalbandi: 2.57, workflow: 1.6 }

const slotStyle = (t: Theme): CSSProperties => ({
  left: `calc(var(--u) * ${(t.cx - CARD_W / 2).toFixed(2)})`,
  top: `calc(var(--u) * ${(t.cy + DY - CARD_H / 2).toFixed(2)})`,
})

const scene: SceneModule = {
  beats: [...BEATS],
  preload: THEMES.map((t) => gen(27, t.icon)),

  Scene: ({ slide }) => (
    <div className="s27">
      <Headline text={slide.title} flame={['Piramal.AI']} />

      {/* the board: slide 16's quiet field of peg holes */}
      <div className="s27-board" aria-hidden="true" />

      <h2 className="s27-centre">
        <span className="s27-centre-line">
          <Words text={CENTRE[0]} />
        </span>
        <span className="s27-centre-line">
          <Words text={CENTRE[1]} flame={['Piramal.ai']} />
        </span>
      </h2>

      {THEMES.map((t, i) => (
        <div
          className="s27-slot"
          key={t.key}
          data-key={t.key}
          style={
            {
              ...slotStyle(t),
              '--s27-tilt': `${t.tilt}deg`,
              '--s27-sway': `${i % 2 ? -0.32 : 0.32}deg`,
              '--s27-pace': `${6.4 + ((i * 37) % 23) / 10}s`,
              '--s27-lag': `${-((i * 53) % 41) / 10}s`,
            } as CSSProperties
          }
        >
          <span className="s27-ghost" aria-hidden="true" />
          <div className="s27-card">
            <div className="s27-hang">
              <span className="s27-cast" aria-hidden="true" />
              <div className="s27-paper">
                <span className="s27-disc" data-tone={t.tone} aria-hidden="true" />
                <span className="s27-shade" aria-hidden="true" style={{ marginTop: `calc(var(--u) * ${((FOOT[t.key] ?? 3.59) - 0.9).toFixed(2)})` }} />
                <span className="s27-obj" aria-hidden="true">
                  <span className="s27-breath">
                    <img className="s27-img" src={gen(27, t.icon)} alt="" draggable={false} decoding="async" />
                  </span>
                </span>
                <div className="s27-text">
                  <p className="s27-name">
                    <Words text={t.name} />
                  </p>
                  {t.line ? <p className="s27-line">{t.line}</p> : null}
                </div>
              </div>
              <span className="s27-pin" aria-hidden="true" />
            </div>
          </div>
        </div>
      ))}

      {/* the thread that ties the eight into one ring (drawn in stage units) */}
      <svg className="s27-thread" viewBox="0 0 100 56.25" aria-hidden="true">
        {TIES.map((tie, k) => (
          <g className="s27-tie" key={k}>
            <path className="s27-tie-line" d={tie.d} />
            <circle className="s27-knot s27-knot--a" cx={tie.p.x.toFixed(2)} cy={tie.p.y.toFixed(2)} r={tie.onPin === 'a' ? 0 : 0.36} />
            <circle className="s27-knot s27-knot--b" cx={tie.q.x.toFixed(2)} cy={tie.q.y.toFixed(2)} r={tie.onPin === 'b' ? 0 : 0.36} />
          </g>
        ))}
      </svg>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const slots = ctx.$$('.s27-slot')
    const one = (slot: Element, sel: string) => slot.querySelector(sel) as HTMLElement
    const all = (slot: Element, sel: string) => Array.from(slot.querySelectorAll<HTMLElement>(sel))

    // every card turns about its pin (the tilt itself, and the idle sway, are on .s27-hang)
    slots.forEach((slot) => gsap.set(one(slot, '.s27-card'), { transformOrigin: `50% ${PIN * U}px` }))

    /** Card i pins on, starting at time t. Returns the time at which it has come to rest. */
    const pinOn = (i: number, t: number): number => {
      const th = THEMES[i]
      const slot = slots[i]
      const card = one(slot, '.s27-card')
      const ghost = one(slot, '.s27-ghost')
      const words = all(slot, '.s27-name .kn-wi')
      const line = all(slot, '.s27-line')
      tl.to(ghost, { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, t + 0.25)
      if (reduced) {
        gsap.set(card, { autoAlpha: 0 })
        tl.to(card, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, t)
        return t + 0.6
      }
      // it comes from its own side of the board, a little toward the room, turned too far
      const side = th.cx < 40 ? -1 : th.cx > 60 ? 1 : i % 2 ? 1 : -1
      gsap.set(card, { autoAlpha: 0, x: side * 3.4 * U, y: -3 * U, scale: 1.13, rotation: side * 6.5 })
      tl.to(card, { autoAlpha: 1, duration: 0.28, ease: 'power1.out' }, t)
      tl.to(card, { x: 0, y: 0, scale: 1, duration: 0.62, ease: ease.out }, t)
      // the pin goes in …
      const pin = one(slot, '.s27-pin')
      gsap.set(pin, { autoAlpha: 0, scale: 2.5, y: -1.7 * U })
      tl.to(pin, { autoAlpha: 1, duration: 0.1, ease: 'none' }, t + 0.34)
      tl.to(pin, { scale: 1, y: 0, duration: 0.2, ease: ease.slam }, t + 0.34)
      // … and the card swings on it until it hangs at its tilt
      tl.to(card, { rotation: 0, duration: 1.3, ease: 'elastic.out(1, 0.4)' }, t + 0.54)

      // its object: the disc opens, the object arrives with its own move
      const disc = one(slot, '.s27-disc')
      const obj = one(slot, '.s27-obj')
      const shade = one(slot, '.s27-shade')
      const how = ARRIVE[th.key] ?? {}
      const dur = how.duration ?? 0.8
      gsap.set(disc, { autoAlpha: 0, scale: 0.5 })
      tl.to(disc, { autoAlpha: 1, scale: 1, duration: 0.55, ease: ease.snap }, t + 0.42)
      gsap.set(obj, { autoAlpha: 0, x: (how.x ?? 0) * U, y: (how.y ?? 0) * U, scale: how.scale ?? 1, rotation: how.rotation ?? 0, transformOrigin: how.origin ?? '50% 50%' })
      gsap.set(shade, { autoAlpha: 0, scale: 0.5 })
      tl.to(obj, { autoAlpha: 1, duration: 0.22, ease: 'power1.out' }, t + 0.6)
      tl.to(obj, { x: 0, y: 0, scale: 1, rotation: 0, duration: dur, ease: th.key === 'matured' ? ease.out : ease.snap }, t + 0.6)
      tl.to(shade, { autoAlpha: 1, scale: 1, duration: dur * 0.8, ease: 'power2.out' }, t + 0.6 + dur * 0.2)

      // its words
      gsap.set(words, { yPercent: 118 })
      tl.to(words, { yPercent: 0, duration: ctx.T.word, stagger: 0.035, ease: ease.out }, t + 0.56)
      if (line.length) {
        gsap.set(line, { autoAlpha: 0, y: 0.5 * U })
        tl.to(line, { autoAlpha: 1, y: 0, duration: 0.55, ease: ease.out }, t + 0.95)
      }
      return t + 1.84
    }

    /* ------------------------------------------------------------------ five */
    a.words('.kn-h', 0.1)
    a.fade('.s27-board', 0.2, { duration: 1.4 })
    a.words('.s27-centre', 0.4, { stagger: 0.06 })
    a.fade('.s27-ghost', 0.5, { stagger: 0.05, duration: 0.7 })
    tl.to(fx, { glow: 0.24, focusX: 0, focusY: -0.2, duration: 1.8, ease: ease.inOut }, 0.4)

    const GAP = 0.42
    let rest = 0.95
    GROUPS[0].forEach((i, k) => (rest = pinOn(i, 0.95 + k * GAP)))
    tl.addLabel('five', rest + 0.14)

    /* ------------------------------------------------------------------ all */
    const A = tl.labels.five
    tl.to(fx, { focusY: 0.4, glow: 0.26, duration: 1.3, ease: ease.inOut }, A)
    GROUPS[1].forEach((i, k) => (rest = pinOn(i, A + k * GAP)))

    // the board is full. A thread runs round it, clockwise from the first card; each card it reaches
    // answers with a nudge on its pin and a breath of its object; the ring closes on the first card
    const B = rest + 0.2
    const ties = ctx.$$('.s27-tie')
    const STEP = 0.17
    const RUN = 0.42
    ties.forEach((tie, k) => {
      const at = B + k * STEP
      const line = tie.querySelector('.s27-tie-line')
      const ka = tie.querySelector('.s27-knot--a')
      const kb = tie.querySelector('.s27-knot--b')
      const slot = slots[TIES[k].to]
      if (reduced) {
        gsap.set([ka, kb], { autoAlpha: 0 })
        a.fade(line, at, { duration: 0.4 })
        tl.to([ka, kb], { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, at)
        return
      }
      gsap.set([ka, kb], { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
      tl.to(ka, { autoAlpha: 1, scale: 1, duration: 0.3, ease: ease.snap }, at)
      a.draw(line, at + 0.04, { duration: RUN, ease: 'power2.inOut' })
      tl.to(kb, { autoAlpha: 1, scale: 1, duration: 0.3, ease: ease.snap }, at + RUN - 0.06)
      const hit = at + RUN
      const side = k % 2 ? -1 : 1
      const card = one(slot, '.s27-card')
      const pin = one(slot, '.s27-pin')
      const obj = one(slot, '.s27-breath')
      tl.to(card, { rotation: side * 1.3, duration: 0.15, ease: 'power2.out' }, hit)
      tl.to(card, { rotation: 0, duration: 1.0, ease: 'elastic.out(1.1, 0.4)' }, hit + 0.15)
      tl.to(pin, { scale: 1.3, duration: 0.12, ease: 'power2.out' }, hit)
      tl.to(pin, { scale: 1, duration: 0.4, ease: ease.snap }, hit + 0.12)
      tl.to(obj, { scale: 1.08, duration: 0.2, ease: 'power2.out' }, hit)
      tl.to(obj, { scale: 1, duration: 0.5, ease: ease.snap }, hit + 0.2)
    })
    // the ring is closed: the light comes home to the words in the middle, and they answer once
    const C = B + (ties.length - 1) * STEP + RUN
    tl.to(fx, { focusX: 0, focusY: 0.02, glow: 0.62, warm: 0.3, duration: 1.1, ease: ease.inOut }, C - 0.5)
    if (!reduced) {
      const mid = ctx.$('.s27-centre')
      tl.to(mid, { scale: 1.06, duration: 0.3, ease: 'power2.out' }, C)
      tl.to(mid, { scale: 1, duration: 0.8, ease: ease.snap }, C + 0.3)
    }
    tl.addLabel('all', C + 1.2)
    return tl
  },
}

export default scene
