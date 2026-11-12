'use client'

/**
 * The closing: the five names once more. The last frame of the film, and the one that gets
 * photographed. Short: what Everyday AI is was the first screen.
 *
 * Two steps, each a held frame (?scene=finale&at=say | names | done):
 *
 *   say    "That is Everyday AI" takes the whole stage.
 *   done   it docks to the top; the five names lift off the rail, in the film's order, each
 *          into a card: when in her day (Piramal Mind's says Engineering instead, and stands
 *          a little apart), the name, what it stands for, what it does, its number. Every
 *          card replays its moment; "Watch again" starts the film over.
 *          (`names` is a frame on the way: the names have landed, the numbers are still counting.)
 *
 * The natural layout of the markup IS the last frame. Every earlier frame is that layout
 * moved by measured transforms, so one timeline holds from a phone on its side to a wall.
 *
 * One thing reaches into the shell: the rail's names are measured (never moved), because
 * the names lift off from there.
 */

import { useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { CLOSING, OPENING, PRODUCTS, type Product } from '../content'
import { director } from '../core/director'
import { FINALE_TIME } from '../core/timing'
import { useScene } from '../core/useScene'
import { CodeGlyph, Rise } from '../moments/parts'
import './Finale.css'

/** "That is Everyday AI", word by word; the words of the title are the ones in flame. */
const SAY = (() => {
  const at = CLOSING.eyebrow.indexOf(OPENING.title)
  if (at < 0) return CLOSING.eyebrow.split(' ').map((word) => ({ word, em: false }))
  const words = (text: string, em: boolean) =>
    text
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, em }))
  return [...words(CLOSING.eyebrow.slice(0, at), false), ...words(OPENING.title, true), ...words(CLOSING.eyebrow.slice(at + OPENING.title.length), false)]
})()

/** "~15%" → "~", 15, "%": the number counts up, what is around it stays put. */
function statParts(value: string) {
  const m = /^(\D*)(\d+)(.*)$/.exec(value)
  return m ? { pre: m[1], n: m[2], post: m[3] } : { pre: '', n: '', post: value }
}

/** Under each name: what it stands for (BYOT, BYOA) or what the word means (Prastuti). */
function Stands({ product }: { product: Product }) {
  if (product.expansion) {
    return (
      <>
        {product.expansion.map((word, i) => (
          <span key={word + i}>
            {i > 0 ? ' ' : null}
            <b>{word[0]}</b>
            {word.slice(1)}
          </span>
        ))}
      </>
    )
  }
  return <>{product.meaning ?? ' '}</>
}

export default function Finale() {
  const ref = useRef<HTMLDivElement>(null)

  useScene('finale', ref, (root, stage, E) => {
    const U = stage.U
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
    const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as unknown as T[]
    const t = gsap.timeline({ paused: true, defaults: { ease: E.out, duration: 0.7 } })

    // ------------------------------------------------------------ the pieces
    const area = $('.fin-area')
    const say = $('.fin-h')
    const words = $$('.fin-w')
    const emWords = $$('.fin-w--em')
    const barTitle = $('.fin-bar-h .ev-rise')
    const barRule = $('.fin-bar-rule')
    const hint = $('.fin-hint')
    const again = $('.fin-again')
    const divider = $('.fin-divider')
    const cardBgs = $$('.fin-card-bg')
    const whens = $$('.fin-when')
    const names = $$('.fin-name-t')
    const stands = $$('.fin-stands .ev-rise')
    const promises = $$('.fin-promise')
    const stats = $$('.fin-stat')
    const nums = $$('.fin-num')
    const plays = $$('.fin-play')

    // ------------------------------------------------------------ measure the last frame, before anything is moved
    const A = stage.loc(area)
    const sayBox = stage.loc(say)
    /** Alone on the stage, the line is as large as the stage allows, and stands in its middle. */
    const heroScale = Math.max(1, Math.min(2.1, (A.w * 0.96) / sayBox.w, (A.h * 0.5) / sayBox.h))
    const hero = {
      x: A.x + (A.w - sayBox.w * heroScale) / 2 - sayBox.x,
      y: A.y + (A.h - sayBox.h * heroScale) * 0.46 - sayBox.y,
      scale: heroScale,
    }

    // the five names, and the places on the rail they lift off from
    const lifts = names.map((el, i) => {
      const b = stage.loc(el)
      const stop = document.querySelector(`[data-ev-rail="${PRODUCTS[i].key}"] .ev-stop-pop`)
      if (!stop) return { x: 0, y: 6 * U, scale: 0.6 }
      const rb = stage.loc(stop)
      const railFont = parseFloat(getComputedStyle(stop).fontSize) / stage.Z
      const myFont = parseFloat(getComputedStyle(el).fontSize) || railFont
      return { x: rb.cx - b.cx, y: rb.cy - b.cy, scale: railFont / myFont }
    })

    // ------------------------------------------------------------ starting states
    gsap.set([barTitle, ...stands], { yPercent: 118 })
    gsap.set(words, { yPercent: 118 })
    gsap.set(say, { ...hero, transformOrigin: '0 0' })
    gsap.set(barRule, { scaleX: 0, transformOrigin: '0 50%' })
    gsap.set(hint, { autoAlpha: 0, x: -1.2 * U })
    gsap.set(again, { autoAlpha: 0, scale: 0.8 })
    if (divider) gsap.set(divider, { scaleY: 0, transformOrigin: '50% 0%' })
    gsap.set(cardBgs, { autoAlpha: 0, scale: 0.88, y: 1.8 * U, transformOrigin: '50% 100%' })
    names.forEach((el, i) => gsap.set(el, { ...lifts[i], autoAlpha: 0, transformOrigin: '50% 50%' }))
    gsap.set(whens, { autoAlpha: 0, y: 0.6 * U })
    gsap.set(promises, { autoAlpha: 0, y: 0.8 * U })
    gsap.set(stats, { autoAlpha: 0, y: 0.8 * U })
    gsap.set(nums, { textContent: 0 })
    gsap.set(plays, { scale: 0 })

    // ============================================================ SAY: the line takes the stage
    t.addLabel('start', 0)
      // (all of it is over by FINALE_TIME.say: the line rests whole, not caught in its own pulse)
      .to(words, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 0.06)
      .to(emWords, { scale: 1.05, duration: 0.18, ease: 'power2.out', transformOrigin: '50% 80%' }, 0.58)
      .to(emWords, { scale: 1, duration: 0.22, ease: 'power2.inOut' }, 0.76)
    const tS = FINALE_TIME.say
    t.addLabel('say', tS)

    // ============================================================ DONE: it docks; the five names lift off the rail
    t.to(say, { x: 0, y: 0, scale: 1, duration: 0.85, ease: E.inOut }, tS)
      .to(barTitle, { yPercent: 0, duration: 0.55 }, tS + 0.5)
      .to(barRule, { scaleX: 1, duration: 0.9, ease: E.inOut }, tS + 0.52)
    names.forEach((el, i) => {
      const at = tS + 0.42 + i * 0.19
      t.to(el, { autoAlpha: 1, duration: 0.1, ease: 'none' }, at)
        .to(el, { y: 0, duration: 0.78 }, at)
        .to(el, { x: 0, duration: 0.78, ease: 'power2.inOut' }, at)
        .to(el, { scale: 1, duration: 0.78, ease: E.snap }, at)
        .to(cardBgs[i], { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: E.snap }, at + 0.22)
        .to(whens[i], { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.42)
        .to(stands[i], { yPercent: 0, duration: 0.5 }, at + 0.5)
        .to(promises[i], { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.58)
        .to(stats[i], { autoAlpha: 1, y: 0, duration: 0.45 }, at + 0.68)
        .to(nums[i], { textContent: Number(nums[i].dataset.n) || 0, snap: { textContent: 1 }, duration: 0.7, ease: 'power2.out' }, at + 0.68)
    })
    if (divider) t.to(divider, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, tS + 1.5)
    t.addLabel('names', tS + 2.1)
    // last, the invitation: a play button on every card, left to right, and the way to start over
    t.to(plays, { scale: 1, duration: 0.5, ease: E.snap, stagger: 0.07 }, tS + 2.3)
      .to(hint, { autoAlpha: 1, x: 0, duration: 0.5 }, tS + 2.45)
      .to(again, { autoAlpha: 1, scale: 1, duration: 0.5, ease: E.snap }, tS + 2.55)
    const tE = tS + FINALE_TIME.names
    t.addLabel('done', tE)

    return {
      tl: t,
      // say + hold + names = 5.5 s unattended, then it rests: the last frame stays put under a
      // stray tap (`stay`), and its cards and "Watch again" are the ways on. After `idle` it goes
      // back to the opening screen by itself.
      stops: [
        { label: 'say', step: 'fin-say', cap: FINALE_TIME.say, hold: FINALE_TIME.hold },
        { label: 'done', step: 'fin-done', cap: FINALE_TIME.names, idle: FINALE_TIME.idle, stay: true },
      ],
    }
  })

  return (
    <div ref={ref} className="ev-scene ev-scene--finale">
      <div className="fin-area">
        {/* ---- that is Everyday AI ---- */}
        <div className="fin-head">
          <h2 className="fin-h" aria-label={CLOSING.eyebrow}>
            {SAY.map((w, i) => (
              <span key={w.word + i} aria-hidden="true">
                {i > 0 ? ' ' : null}
                <span className="ev-mask fin-wm">
                  <span className={w.em ? 'fin-w fin-w--em' : 'fin-w'}>{w.word}</span>
                </span>
              </span>
            ))}
          </h2>
          <button
            type="button"
            className="fin-again"
            data-own
            onClick={(e) => {
              e.stopPropagation()
              director.restart()
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5.2 13.2a7 7 0 1 0 1.7-5.4" />
              <path d="M4.4 4.6v4h4" />
            </svg>
            {CLOSING.again}
          </button>
        </div>

        {/* ---- five names to remember ---- */}
        <div className="fin-bar">
          <p className="fin-bar-h">
            <Rise>{CLOSING.recap}</Rise>
          </p>
          <i className="fin-bar-rule" />
          <p className="fin-hint">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle className="fin-hint-ring" cx="12" cy="12" r="9.5" />
              <circle cx="12" cy="12" r="4.6" />
            </svg>
            {CLOSING.hint}
          </p>
        </div>

        <div className="fin-names">
          {PRODUCTS.map((p, i) => {
            const s = statParts(p.stat.value)
            const engineering = p.track === 'engineering'
            return (
              <button
                type="button"
                className="fin-card ev-acc"
                data-own
                data-accent={p.accent}
                data-key={p.key}
                data-track={p.track}
                style={{ ['--i' as string]: i } as CSSProperties}
                key={p.key}
                aria-label={`${p.name}: ${p.promise} ${p.stat.value} ${p.stat.label}. Play this moment again`}
                onClick={(e) => {
                  e.stopPropagation()
                  director.jump(p.key)
                }}
              >
                {engineering ? <i className="fin-divider" aria-hidden="true" /> : null}
                <span className="fin-card-lift">
                  <span className="fin-card-bg" />
                  <span className="fin-play" aria-hidden="true">
                    <i className="fin-play-ping" />
                    <svg viewBox="0 0 24 24">
                      <path d="M8.2 5.4v13.2L19.4 12z" />
                    </svg>
                  </span>
                  <span className="fin-card-in">
                    <span className="fin-when">
                      {engineering ? (
                        <span className="fin-tag">
                          <CodeGlyph />
                          Engineering
                        </span>
                      ) : (
                        p.time
                      )}
                    </span>
                    <span className="fin-name">
                      <span className="fin-name-t">{p.name}</span>
                    </span>
                    <span className="fin-stands">
                      <Rise>
                        <Stands product={p} />
                      </Rise>
                    </span>
                    <span className="fin-promise">{p.promise}</span>
                    <span className="fin-stat">
                      <b className="fin-v">
                        {s.pre}
                        <span className="fin-num" data-n={s.n} style={{ ['--d' as string]: s.n.length } as CSSProperties}>
                          {s.n}
                        </span>
                        {s.post ? <span className={s.post.trim().length > 1 ? 'fin-post fin-post--word' : 'fin-post'}>{s.post}</span> : null}
                      </b>
                      <span className="fin-label">{p.stat.label}</span>
                    </span>
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
