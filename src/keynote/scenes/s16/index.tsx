'use client'

/**
 * Slide 16 · "What happened in the world of AI in the past 12m?"
 *
 * The menu of the section: eight things happened, and each is a card pinned to a board (each
 * opens one of the slides 17 to 24). The deck's cards sit at slight tilts, like things pinned up;
 * here there is a board (a quiet field of peg holes), and the cards are thrown onto it from the
 * room, one after the other, in the order of the slides they open.
 *
 *   board   the headline; the board; "FROM: What can AI do?" stands in its middle; each card
 *           comes from the room in depth (large, turned, its shadow far off and faint), lands,
 *           its shadow tightens under it, the pin goes in, the card swings once and hangs; and
 *           as it is pinned its round picture, a small window onto its slide, settles: the paper
 *           plane noses up, the kite bobs, the padlock swings, the vault's wheel turns home
 *   value   "TO: How can AI create value?" lands and "create value" is underlined; the eight
 *           cards answer it in slide order (a nudge on the pin, a flame ring drawn round each
 *           window); last, the first card ("Enough Of Pilots") lifts a little off the board: it
 *           is the one that opens next
 *
 * The round pictures are the deck's own (202 px): shown at the deck's size, never larger than
 * their pixels, turned only about their own middle (a circle turned is still the whole circle).
 * The photograph of a person (the grandmother with the phone) is never moved. While the room
 * waits the cards sway a hair on their pins (a CSS idle). No canvas.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, cutWords, Headline, pic, type SceneModule } from '../../kit'
import { FLAME, QUESTION, THEMES, THUMB_PX, type Theme } from './data'
import './scene.css'

/** A card, in --u (the deck's cards are 26.2 wide; their boxes in the pack are of the TILTED card). */
const CARD_W = 26.2
const CARD_H = 9.6
/** The deck's page runs lower than the keynote's safe area: the whole board is lifted by this. */
const LIFT = 2.6

/**
 * How each window settles as its card is pinned: the turn it starts from (degrees), how long it
 * takes and its ease. Slide 23's picture is a photograph of a person: it is not moved.
 */
const SETTLE: Record<number, { from: number; duration: number; ease: string } | null> = {
  17: { from: -22, duration: 1.1, ease: 'power3.out' }, // the paper plane noses up
  18: { from: 12, duration: 0.7, ease: 'back.out(2.2)' }, // the two pieces click level
  19: { from: -14, duration: 1.5, ease: 'elastic.out(1, 0.34)' }, // the padlock swings on its hasp
  20: { from: 16, duration: 1.9, ease: 'elastic.out(1, 0.3)' }, // the kite bobs on its line
  21: { from: -7, duration: 0.9, ease: 'bounce.out' }, // the blocks settle
  22: { from: 6, duration: 1.0, ease: 'power2.out' }, // the pylon stands up straight
  23: null,
  24: { from: -64, duration: 1.4, ease: 'power3.inOut' }, // the vault's wheel turns home
}

/** A card's middle on the stage, from its box in the pack. */
const middle = (t: Theme) => ({
  x: (t.rect[0] + t.rect[2] / 2) * 100,
  y: (t.rect[1] + t.rect[3] / 2) * 56.25 - LIFT,
})

/** The card's line: navy bold words and blue italic words, as the deck sets them. */
function Line({ t }: { t: Theme }) {
  return (
    <>
      {cutWords(t.line, [], t.blue, t.bold).map((segs, i, all) => (
        <span key={i}>
          {segs.map((s, k) => (s.tone === 'azure' ? <i key={k}>{s.text}</i> : s.bold ? <b key={k}>{s.text}</b> : <span key={k}>{s.text}</span>))}
          {i < all.length - 1 ? ' ' : null}
        </span>
      ))}
    </>
  )
}

/** One line of the question: its small label, its words in masks, the marked words italic over a rule that draws. */
function Ask({ which }: { which: 'from' | 'to' }) {
  const q = QUESTION[which]
  const at = q.text.indexOf(q.mark)
  const before = q.text.slice(0, at).trim().split(' ')
  const after = q.text.slice(at + q.mark.length)
  return (
    <p className={`s16-q s16-q--${which}`}>
      <span className="s16-q-label">{q.label}</span>
      <span className="s16-q-text">
        {before.map((w, i) => (
          <span key={i}>
            <span className="kn-w">
              <span className="kn-wi">{w}</span>
            </span>{' '}
          </span>
        ))}
        <span className="kn-w s16-mark">
          <span className="kn-wi">
            <i>{q.mark}</i>
          </span>
          <span className="s16-rule" aria-hidden="true" />
        </span>
        <span className="kn-w">
          <span className="kn-wi">{after}</span>
        </span>
      </span>
    </p>
  )
}

const scene: SceneModule = {
  beats: ['board', 'value'],
  preload: THEMES.map((t) => pic(16, t.picture)),

  Scene: ({ slide }) => (
    <div
      className="s16"
      style={
        {
          '--s16-w': `calc(var(--u) * ${CARD_W})`,
          '--s16-h': `calc(var(--u) * ${CARD_H})`,
        } as CSSProperties
      }
    >
      <Headline text={slide.title} flame={FLAME} />

      {/* the board: a quiet field of peg holes that fades out toward the stage's edges */}
      <div className="s16-board" aria-hidden="true" />

      <div className="s16-ask">
        <Ask which="from" />
        <Ask which="to" />
      </div>

      {THEMES.map((t, i) => {
        const m = middle(t)
        return (
          <div
            className={`s16-card s16-card--${t.slide}`}
            key={t.slide}
            style={
              {
                left: `calc(var(--u) * ${(m.x - CARD_W / 2).toFixed(2)})`,
                top: `calc(var(--u) * ${(m.y - CARD_H / 2).toFixed(2)})`,
                '--s16-tilt': `${t.tilt}deg`,
                '--s16-sway': `${i % 2 ? -0.32 : 0.32}deg`,
                '--s16-pace': `${6.4 + ((i * 37) % 23) / 10}s`,
                '--s16-lag': `${-((i * 53) % 41) / 10}s`,
              } as CSSProperties
            }
          >
            <div className="s16-hang">
              <span className="s16-cast" aria-hidden="true" />
              <div className="s16-paper">
                <span className="s16-thumb">
                  <img src={pic(16, t.picture)} alt="" draggable={false} decoding="async" style={{ maxWidth: THUMB_PX, maxHeight: THUMB_PX }} />
                  <svg className="s16-ring" viewBox="-50 -50 100 100" aria-hidden="true">
                    <circle r="48.4" transform="rotate(-90)" />
                  </svg>
                </span>
                <span className="s16-words">
                  <b className="s16-name">{t.name}</b>
                  <span className="s16-line">
                    <Line t={t} />
                  </span>
                </span>
              </div>
              <span className="s16-pin" aria-hidden="true" />
            </div>
          </div>
        )
      })}
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const cards = ctx.$$('.s16-card')
    const from = ctx.$('.s16-q--from')
    const to = ctx.$('.s16-q--to')
    const words = (el: Element) => Array.from(el.querySelectorAll('.kn-wi'))
    const centre = { x: ctx.W / 2, y: ctx.H * 0.56 }
    const boxes = cards.map((c) => ctx.loc(c))

    /* --------------------------------------------------------------- board */
    a.words('.kn-h', 0.1)
    a.fade('.s16-board', 0.25, { duration: 1.4 })
    // the question the year began with, in the middle of the board
    a.fade(from.querySelector('.s16-q-label'), 0.55)
    gsap.set(words(from), reduced ? { autoAlpha: 0 } : { yPercent: 118 })
    tl.to(words(from), reduced ? { autoAlpha: 1, duration: 0.5 } : { yPercent: 0, duration: 0.7, stagger: 0.05, ease: ease.out }, 0.6)
    a.rule(from.querySelector('.s16-rule'), 1.1, { duration: 0.5 })
    tl.to(fx, { glow: 0.22, focusX: 0, focusY: 0.12, duration: 2 }, 0.4)

    // the eight cards, thrown onto the board from the room and pinned, one after the other
    const START = 0.85
    const GAP = 0.23
    const FLY = 0.62
    /** Where a card's shadow lies once the card hangs on the board. */
    const CAST = { x: 0.22 * U, y: 0.62 * U, scale: 1, opacity: 1 }
    cards.forEach((card, i) => {
      const pin = card.querySelector('.s16-pin')
      const thumb = card.querySelector('.s16-thumb img')
      const cast = card.querySelector('.s16-cast')
      const settle = SETTLE[THEMES[i].slide]
      const at = START + i * GAP
      const land = at + FLY
      gsap.set(cast, CAST)
      if (reduced) {
        gsap.set(card, { autoAlpha: 0 })
        tl.to(card, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, at)
        return
      }
      // it comes from the room: near the eye (so, large), from a little toward the middle and below, turned as a hand lets it go;
      // its shadow lies far off on the board, wide and faint, and closes in under it as it lands
      const b = boxes[i]
      const side = i % 2 ? -1 : 1
      gsap.set(card, {
        autoAlpha: 0,
        x: (centre.x - b.cx) * 0.22,
        y: (centre.y - b.cy) * 0.22 + 5 * U,
        z: 44 * U,
        rotationX: -26,
        rotationY: side * 24,
        rotation: side * 9,
        transformOrigin: `50% ${(0.85 / CARD_H) * 100}%`,
      })
      gsap.set(cast, { x: 4.2 * U, y: 6.4 * U, scale: 1.16, opacity: 0.12 })
      gsap.set(pin, { autoAlpha: 0, scale: 1.9, y: -1.2 * U })
      tl.to(card, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, at)
      tl.to(card, { x: 0, y: 0, z: 0, rotationX: 0, rotationY: 0, duration: FLY, ease: 'power3.out' }, at)
      tl.to(card, { rotation: side * 2.6, duration: FLY, ease: 'power2.out' }, at)
      tl.to(cast, { ...CAST, duration: FLY, ease: 'power3.out' }, at)
      // the pin goes in …
      tl.to(pin, { autoAlpha: 1, duration: 0.06, ease: 'none' }, land - 0.1)
      tl.to(pin, { scale: 1, y: 0, duration: 0.16, ease: ease.slam }, land - 0.1)
      // … the card swings once on it and hangs …
      tl.to(card, { rotation: 0, duration: 1.3, ease: 'elastic.out(1.15, 0.36)' }, land + 0.02)
      // … and its window settles
      if (settle) {
        gsap.set(thumb, { rotation: settle.from, transformOrigin: '50% 50%' })
        tl.to(thumb, { rotation: 0, duration: settle.duration, ease: settle.ease }, land - 0.05)
      }
    })
    tl.addLabel('board', START + (cards.length - 1) * GAP + FLY + 1.35)

    /* --------------------------------------------------------------- value */
    const B = tl.labels.board
    // the old question steps back (its words, not its label); the new one lands under it
    tl.to(from.querySelector('.s16-q-text'), { opacity: 0.55, duration: 0.6, ease: 'power1.inOut' }, B)
    a.fade(to.querySelector('.s16-q-label'), B + 0.1)
    gsap.set(words(to), reduced ? { autoAlpha: 0 } : { yPercent: 118 })
    tl.to(words(to), reduced ? { autoAlpha: 1, duration: 0.5 } : { yPercent: 0, duration: 0.75, stagger: 0.06, ease: ease.out }, B + 0.15)
    a.rule(to.querySelector('.s16-rule'), B + 0.75, { duration: 0.7 })
    tl.to(fx, { glow: 0.42, warm: 0.35, focusY: 0.16, duration: 1.2, ease: ease.inOut }, B)
    // the eight answer it, in the order of their slides: a nudge on the pin, a flame ring round each window
    const ANSWER = B + 0.95
    cards.forEach((card, i) => {
      const at = ANSWER + i * 0.11
      a.draw(card.querySelector('.s16-ring circle'), at, { duration: 0.8 })
      if (reduced) return
      const side = i % 2 ? -1 : 1
      const pin = card.querySelector('.s16-pin')
      tl.to(card, { rotation: side * 1.5, duration: 0.16, ease: 'power2.out' }, at)
      tl.to(card, { rotation: 0, duration: 1.1, ease: 'elastic.out(1.1, 0.4)' }, at + 0.16)
      tl.to(pin, { scale: 1.3, duration: 0.12, ease: 'power2.out' }, at)
      tl.to(pin, { scale: 1, duration: 0.4, ease: ease.snap }, at + 0.12)
    })
    // and the first of them comes a little off the board: it opens next
    const NEXT = ANSWER + cards.length * 0.11 + 0.55
    if (!reduced) {
      tl.to(cards[0], { z: 7.5 * U, duration: 0.7, ease: ease.inOut }, NEXT)
      tl.to(cards[0].querySelector('.s16-cast'), { x: 1.0 * U, y: 2.1 * U, scale: 1.05, opacity: 0.6, duration: 0.7, ease: ease.inOut }, NEXT)
    }
    tl.addLabel('value', NEXT + 0.75)
    return tl
  },
}

export default scene
