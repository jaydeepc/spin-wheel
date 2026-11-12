'use client'

/**
 * The chapter card between her Tuesday and Piramal Mind: the people who build the apps she
 * works in. About four seconds.
 *
 * Her day closes: the four names of her Tuesday lift off the rail and gather into one card,
 * which steps back. Then the engineering team's panel arrives under it, in navy, joined to
 * it by a line: they build what she works in. The headline says the rest, and Priya's
 * subtitle keeps her as the thread.
 *
 * Held frames: ?scene=engineering&at=<day|in|done>
 *   day   her Tuesday has gathered; the engineering panel is still to come
 *   in    the whole card
 */

import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ENGINEERING, OPENING, PRODUCTS } from '../content'
import { CHAPTER_TIME } from '../core/timing'
import { useScene } from '../core/useScene'
import { CodeGlyph, Rise } from '../moments/parts'
import './Engineering.css'

const DAY = PRODUCTS.filter((p) => p.track === 'day')
/** The chapter's own words (where, and when) come from its product: Piramal Mind. */
const CHAPTER = PRODUCTS.find((p) => p.track === 'engineering')

/** The tail of the headline, with the name "Everyday AI" kept on one line. */
const TAIL = ENGINEERING.headline.tail.split(OPENING.title)

export default function Engineering() {
  const ref = useRef<HTMLDivElement>(null)

  useScene('engineering', ref, (root, stage, E) => {
    const U = stage.U
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
    const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as unknown as T[]
    const t = gsap.timeline({ paused: true, defaults: { ease: E.out, duration: 0.7 } })

    // ------------------------------------------------------------ the pieces
    const eyebrow = $('.eng-eyebrow .ev-rise')
    const em = $('.eng-h em')
    const underline = $('.eng-h em path')
    const leadLines = SplitText.create($('.eng-lead'), { type: 'lines', mask: 'lines' }).lines as HTMLElement[]
    const lines = SplitText.create($('.eng-h'), { type: 'lines', mask: 'lines' }).lines as HTMLElement[]

    const pic = $('.eng-pic')
    const day = $('.eng-day')
    const dayBg = $('.eng-day-bg')
    const dayHead = $('.eng-day-head .ev-rise')
    const tick = $('.eng-day-tick')
    const tickPath = $('.eng-day-tick path')
    const chipBgs = $$('.eng-chip-bg')
    const chipTimes = $$('.eng-chip-time')
    const chipNames = $$('.eng-chip-t')
    const linkLine = $('.eng-link-line')
    const linkDot = $('.eng-link-dot')
    const team = $('.eng-team')
    const mark = $('.eng-team-mark')
    const markPaths = $$('.eng-team-mark path')
    const teamRise = $$('.eng-team-txt .ev-rise')

    // ------------------------------------------------------------ measure, before anything is moved
    // the four names of her day, and the places on the rail they lift off from
    const lifts = chipNames.map((el, i) => {
      const b = stage.loc(el)
      const stop = document.querySelector(`[data-ev-rail="${DAY[i].key}"] .ev-stop-pop`)
      if (!stop) return { x: 0, y: 6 * U, scale: 0.7 }
      const rb = stage.loc(stop)
      const railFont = parseFloat(getComputedStyle(stop).fontSize) / stage.Z
      const myFont = parseFloat(getComputedStyle(el).fontSize) || railFont
      return { x: rb.cx - b.cx, y: rb.cy - b.cy, scale: railFont / myFont }
    })

    // ------------------------------------------------------------ starting states
    gsap.set([eyebrow, dayHead, ...teamRise], { yPercent: 118 })
    gsap.set([...leadLines, ...lines], { yPercent: 118 })
    gsap.set(underline, { drawSVG: '0%' })
    gsap.set(em, { transformOrigin: '50% 80%' })
    gsap.set(dayBg, { autoAlpha: 0, scale: 0.9, y: 1.6 * U, transformOrigin: '50% 100%' })
    gsap.set(chipBgs, { autoAlpha: 0, scale: 0.86 })
    gsap.set(chipTimes, { autoAlpha: 0, y: 0.5 * U })
    chipNames.forEach((el, i) => gsap.set(el, { ...lifts[i], autoAlpha: 0, transformOrigin: '50% 50%' }))
    gsap.set(tick, { scale: 0 })
    gsap.set(tickPath, { drawSVG: '0%' })
    gsap.set(day, { transformOrigin: '50% 100%' })
    gsap.set(linkLine, { scaleY: 0, transformOrigin: '50% 0%' })
    gsap.set(linkDot, { scale: 0 })
    gsap.set(team, { autoAlpha: 0, y: 3.2 * U, scale: 0.94, transformOrigin: '50% 100%' })
    gsap.set(mark, { scale: 0.5 })
    gsap.set(markPaths, { drawSVG: '0%' })

    // ============================================================ DAY: her Tuesday closes, and gathers
    t.addLabel('start', 0)
      .to(eyebrow, { yPercent: 0, duration: 0.55 }, 0.04)
      .to(leadLines, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 0.12)
      .to(dayBg, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: E.snap }, 0.02)
      .to(dayHead, { yPercent: 0, duration: 0.5 }, 0.2)
    chipNames.forEach((el, i) => {
      const at = 0.04 + i * 0.07
      t.to(el, { autoAlpha: 1, duration: 0.08, ease: 'none' }, at)
        .to(el, { y: 0, duration: 0.62 }, at)
        .to(el, { x: 0, duration: 0.62, ease: 'power2.inOut' }, at)
        .to(el, { scale: 1, duration: 0.62, ease: E.snap }, at)
        .to(chipBgs[i], { autoAlpha: 1, scale: 1, duration: 0.45, ease: E.snap }, at + 0.22)
        .to(chipTimes[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.34)
    })
    t.to(tick, { scale: 1, duration: 0.4, ease: E.snap }, 0.6).to(tickPath, { drawSVG: '100%', duration: 0.26, ease: 'power2.out' }, 0.7)
    const tD = 0.86
    t.addLabel('day', tD)

    // ============================================================ IN: behind it, the engineering team
    t.to(lines, { yPercent: 0, duration: 0.8, stagger: 0.09 }, 0.42)
      .to(underline, { drawSVG: '100%', duration: 0.42, ease: 'power2.inOut' }, 0.92)
      .to(em, { scale: 1.045, duration: 0.18, ease: 'power2.out' }, 0.98)
      .to(em, { scale: 1, duration: 0.26, ease: 'power2.inOut' }, 1.16)
      // her day steps back…
      .to(day, { scale: 0.93, duration: 0.6, ease: E.inOut }, tD - 0.1)
      // …and the people who build her apps step in under it
      .to(linkLine, { scaleY: 1, duration: 0.36, ease: 'power2.inOut' }, tD - 0.06)
      .to(linkDot, { scale: 1, duration: 0.3, ease: E.snap }, tD + 0.24)
      .to(team, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: E.snap }, tD - 0.02)
      .to(mark, { scale: 1, duration: 0.5, ease: E.snap }, tD + 0.1)
      .to(markPaths, { drawSVG: '100%', duration: 0.34, ease: 'power2.out', stagger: 0.07 }, tD + 0.16)
      .to(teamRise, { yPercent: 0, duration: 0.5, stagger: 0.07 }, tD + 0.14)
    const tI = CHAPTER_TIME.in
    t.addLabel('in', tI)

    // ============================================================ the card clears for Piramal Mind
    t.to(eyebrow, { yPercent: -118, duration: 0.3, ease: 'power3.in' }, tI)
      .to(underline, { autoAlpha: 0, duration: 0.14, ease: 'none' }, tI)
      .to([...leadLines, ...lines], { yPercent: -118, duration: 0.34, ease: 'power3.in', stagger: 0.025 }, tI)
      .to(pic, { autoAlpha: 0, y: -1.6 * U, scale: 0.97, duration: 0.36, ease: 'power2.in' }, tI + 0.04)
    t.addLabel('done', tI + CHAPTER_TIME.out)

    return {
      tl: t,
      stops: [
        { label: 'in', cap: CHAPTER_TIME.in, hold: CHAPTER_TIME.hold },
        { label: 'done', step: 'out', cap: CHAPTER_TIME.out, exit: true },
      ],
    }
  })

  return (
    <div ref={ref} className="ev-scene ev-scene--eng ev-acc" data-accent="navy">
      <div className="eng-area">
        <div className="eng-say">
          <p className="eng-eyebrow">
            <Rise>{ENGINEERING.eyebrow}</Rise>
          </p>
          <p className="eng-lead">{ENGINEERING.headline.lead.trim()}</p>
          <h2 className="eng-h">
            <em>
              {ENGINEERING.headline.em}
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 13 C 60 5, 130 5, 180 10 S 270 15, 297 7" />
              </svg>
            </em>
            {TAIL.map((part, i) => (
              <span key={i}>
                {part}
                {i < TAIL.length - 1 ? <span className="eng-nobreak">{OPENING.title}</span> : null}
              </span>
            ))}
          </h2>
        </div>

        <div className="eng-pic" aria-hidden="true">
          {/* her Tuesday, gathered */}
          <div className="eng-day">
            <span className="eng-day-bg" />
            <p className="eng-day-head">
              <Rise>Priya’s Tuesday</Rise>
              <span className="eng-day-tick">
                <svg viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 12.6 10.3 17 18.2 8" />
                </svg>
              </span>
            </p>
            <ul className="eng-chips">
              {DAY.map((p) => (
                <li className="eng-chip ev-acc" data-accent={p.accent} key={p.key}>
                  <span className="eng-chip-bg" />
                  <span className="eng-chip-time">{p.time}</span>
                  <span className="eng-chip-name">
                    <span className="eng-chip-t">{p.name}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* the line between them: they build what she works in */}
          <div className="eng-link">
            <i className="eng-link-line" />
            <i className="eng-link-dot" />
          </div>

          {/* the people who build her apps */}
          <div className="eng-team">
            <span className="eng-team-mark">
              <CodeGlyph />
            </span>
            <span className="eng-team-txt">
              <b>
                <Rise>{CHAPTER?.place ?? 'Engineering'}</Rise>
              </b>
              <span>
                <Rise>{CHAPTER?.time ?? ''}</Rise>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
