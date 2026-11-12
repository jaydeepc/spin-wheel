'use client'

/**
 * The closing: the five names once more. The last frame of the film, and the one that gets
 * photographed. It is laid out the way every moment was: the words on the left, with Priya's
 * bubble under them (CLOSING.said, the shell's, in its usual place), and ONE picture on the right.
 *
 *   left     "That is Everyday AI"
 *   right    the five names, as one list: each a row of TWO things: the name, large (with what
 *            its letters stand for, or what the word means, small, where it has one), and its
 *            one-line promise. Ten lines in all. The five numbers are not repeated here: each
 *            had the whole screen a moment ago. Piramal Mind is the last row and stands a
 *            little apart, with a tiny "Engineering" label.
 *
 * Two steps (?scene=finale&at=say | names | done):
 *
 *   say    "That is Everyday AI" takes the whole stage. (Manual passes straight through.)
 *   done   it docks into the left column; the list opens on the right and the five names
 *          arrive, top to bottom. Every row replays its moment when pressed. The frame's Next
 *          button reads "Start again" here.
 *          (`names` is a frame on the way: the last rows are still arriving.)
 *
 * The natural layout of the markup IS the last frame. Every earlier frame is that layout
 * moved by measured transforms, so one timeline holds from a phone on its side to a wall.
 */

import { useRef } from 'react'
import gsap from 'gsap'
import { CLOSING, OPENING, PRODUCTS, type Product } from '../content'
import { director } from '../core/director'
import { FINALE_TIME } from '../core/timing'
import { useScene } from '../core/useScene'
import { CodeGlyph, Rise } from '../moments/parts'
import './Finale.css'

/**
 * "That is Everyday AI", on two lines: what leads up to the title, then the title (in flame)
 * and anything after it.
 */
const SAY: { word: string; em: boolean }[][] = (() => {
  const words = (text: string, em: boolean) =>
    text
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, em }))
  const at = CLOSING.eyebrow.indexOf(OPENING.title)
  if (at < 0) return [words(CLOSING.eyebrow, false)]
  const lead = words(CLOSING.eyebrow.slice(0, at), false)
  const rest = [...words(OPENING.title, true), ...words(CLOSING.eyebrow.slice(at + OPENING.title.length), false)]
  return lead.length ? [lead, rest] : [rest]
})()

/** Beside a name, small: what it stands for (BYOT, BYOA), what the word means (Prastuti), or whose it is (Piramal Mind). */
function Stands({ product }: { product: Product }) {
  if (product.expansion) {
    return (
      <span className="fin-stands">
        {product.expansion.map((word, i) => (
          <span key={word + i}>
            {i > 0 ? ' ' : null}
            <b>{word[0]}</b>
            {word.slice(1)}
          </span>
        ))}
      </span>
    )
  }
  if (product.meaning) return <span className="fin-stands">{product.meaning}</span>
  if (product.track === 'engineering') {
    return (
      <span className="fin-stands fin-stands--tag">
        <CodeGlyph />
        Engineering
      </span>
    )
  }
  return null
}

export default function Finale() {
  const ref = useRef<HTMLDivElement>(null)

  useScene('finale', ref, (root, stage, E) => {
    const U = stage.U
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
    const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as unknown as T[]
    const t = gsap.timeline({ paused: true, defaults: { ease: E.out, duration: 0.7 } })

    // ------------------------------------------------------------ the pieces
    const say = $('.fin-h')
    const words = $$('.fin-w')
    const emWords = $$('.fin-w--em')
    const sheet = $('.fin-sheet')
    const rows = $$('.fin-row')

    // ------------------------------------------------------------ measure the last frame, before anything is moved
    const sayBox = stage.loc(say)
    const room = stage.loc($('.fin-room'))
    // Alone on the stage, the line is as large as the stage allows, and stands in the middle of
    // the room above Priya's face (her bubble is on this screen from its first frame).
    const face = document.querySelector('[data-ev="avatar"]')
    const top = room.y
    const foot = face ? stage.loc(face).y - 2.4 * U : room.y + room.h - 9 * U
    const heroScale = Math.max(1, Math.min(1.8, (stage.hx * 2 * 0.86) / sayBox.w, (foot - top) / sayBox.h))
    const hero = {
      x: -(sayBox.w * heroScale) / 2 - sayBox.x,
      y: top + (foot - top - sayBox.h * heroScale) / 2 - sayBox.y,
      scale: heroScale,
    }

    // ------------------------------------------------------------ starting states
    gsap.set(words, { yPercent: 118 })
    gsap.set(say, { ...hero, transformOrigin: '0 0' })
    gsap.set(sheet, { autoAlpha: 0, x: 5 * U, scale: 0.96, transformOrigin: '100% 50%' })
    const parts = rows.map((row) => {
      const q = <T extends Element = HTMLElement>(sel: string) => row.querySelector(sel) as unknown as T | null
      const p = {
        rule: q('.fin-rule'),
        name: q('.fin-name-t'),
        stands: q('.fin-stands'),
        promise: q('.fin-promise .ev-rise'),
      }
      if (p.rule) gsap.set(p.rule, { scaleX: 0, transformOrigin: '0 50%' })
      gsap.set([p.name, p.promise], { yPercent: 118 })
      if (p.stands) gsap.set(p.stands, { autoAlpha: 0, x: -1.2 * U })
      return p
    })

    // ============================================================ SAY: the line takes the stage
    t.addLabel('start', 0)
      // (all of it is over by FINALE_TIME.say: the line rests whole, not caught in its own pulse)
      .to(words, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 0.06)
      .to(emWords, { scale: 1.05, duration: 0.18, ease: 'power2.out', transformOrigin: '50% 80%' }, 0.58)
      .to(emWords, { scale: 1, duration: 0.22, ease: 'power2.inOut' }, 0.76)
    const tS = FINALE_TIME.say
    t.addLabel('say', tS)

    // ============================================================ DONE: it docks left; the five names arrive on the right
    t.to(say, { x: 0, y: 0, scale: 1, duration: 0.8, ease: E.inOut }, tS)
      // the list opens as one sheet, from the right…
      .to(sheet, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, tS + 0.28)
      .to(sheet, { x: 0, scale: 1, duration: 0.7 }, tS + 0.28)
    // …and the five names arrive on it, top to bottom
    parts.forEach((p, i) => {
      const at = tS + 0.5 + i * 0.14
      if (p.rule) t.to(p.rule, { scaleX: 1, duration: 0.6, ease: E.inOut }, at - 0.06)
      t.to(p.name, { yPercent: 0, duration: 0.65 }, at).to(p.promise, { yPercent: 0, duration: 0.55 }, at + 0.16)
      if (p.stands) t.to(p.stands, { autoAlpha: 1, x: 0, duration: 0.45 }, at + 0.22)
    })
    t.addLabel('names', tS + 1.55)
    const tE = tS + 2.0
    t.addLabel('done', tE)

    return {
      tl: t,
      // Auto-play: say, a short rest, then the names; then it rests on the film's last frame and
      // after `idle` goes back to the opening screen by itself. Manual passes straight through
      // `say` (one press from Piramal Mind's number brings the whole closing), and the last frame
      // stays put under a stray tap (`stay`): its rows and the frame's "Start again" are the ways on.
      stops: [
        { label: 'say', step: 'fin-say', cap: FINALE_TIME.say, hold: FINALE_TIME.hold, pass: true },
        { label: 'done', step: 'fin-done', cap: FINALE_TIME.names, idle: FINALE_TIME.idle, stay: true },
      ],
    }
  })

  return (
    <div ref={ref} className="ev-scene ev-scene--finale">
      {/* ---- the left column: That is Everyday AI (Priya's bubble stands under it) ---- */}
      <h2 className="fin-h" aria-label={CLOSING.eyebrow}>
        {SAY.map((line, k) => (
          <span className="fin-line" key={k} aria-hidden="true">
            {line.map((w, i) => (
              <span key={w.word + i}>
                {i > 0 ? ' ' : null}
                <span className="ev-mask fin-wm">
                  <span className={w.em ? 'fin-w fin-w--em' : 'fin-w'}>{w.word}</span>
                </span>
              </span>
            ))}
          </span>
        ))}
      </h2>

      <i className="fin-room" aria-hidden="true" />

      {/* ---- the one picture: the five names, as one list ---- */}
      <div className="fin-names">
        <span className="fin-sheet" aria-hidden="true" />
        {PRODUCTS.map((p, i) => {
          return (
            <button
              type="button"
              className="fin-row ev-acc"
              data-own
              data-accent={p.accent}
              data-key={p.key}
              data-track={p.track}
              key={p.key}
              aria-label={`${p.name}: ${p.promise} Play this moment again`}
              onClick={(e) => {
                e.stopPropagation()
                director.jump(p.key)
              }}
            >
              {i > 0 ? <i className="fin-rule" aria-hidden="true" /> : null}
              <span className="fin-row-in">
                <span className="fin-top">
                  <span className="ev-mask fin-name">
                    <span className="fin-name-t">{p.name}</span>
                  </span>
                  <Stands product={p} />
                </span>
                <span className="fin-promise">
                  <Rise>{p.promise}</Rise>
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
