'use client'

/**
 * The chapter card between her Tuesday and Piramal Mind: the people who build the apps she
 * works in. A rest: one press of Next moves on.
 *
 * On it, and nothing else: the headline (its lead sentence small, "Our engineers…" large), in
 * the left column; Priya's bubble in its usual place under it (ENGINEERING.said: the shell's);
 * and ONE picture on the right, with no words in it: her phone, with the four apps of her day
 * as four tiles, and, stepping out from behind it, the engineers' screen, in navy, where the
 * code is written. Behind her apps, the engineers.
 *
 * Held frames: ?scene=engineering&at=<day|in|done>
 *   day   her phone has arrived; the engineers' screen is still behind it
 *   in    the whole chapter card
 */

import { useRef, type CSSProperties } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ENGINEERING, OPENING, PRODUCTS } from '../content'
import { CHAPTER_TIME } from '../core/timing'
import { useScene } from '../core/useScene'
import { CodeGlyph, Rise } from '../moments/parts'
import './Engineering.css'

const DAY = PRODUCTS.filter((p) => p.track === 'day')

/**
 * The headline, a phrase to a line: "Our engineers" / "have an Everyday AI" / "of their own."
 * (the tail is cut around the name "Everyday AI", which is never broken).
 */
const TAIL = ENGINEERING.headline.tail.split(OPENING.title)
const HEAD_LINES: { text: string; name?: boolean }[] =
  TAIL.length === 2
    ? [{ text: TAIL[0].trim(), name: true }, { text: TAIL[1].trim() }].filter((l) => l.text || l.name)
    : [{ text: ENGINEERING.headline.tail.trim() }]

/** The code on the engineers' screen: no words, only the shape of it. Indent and length, in units of the picture. */
const CODE: { indent: number; w: number; tone?: 'flame' | 'sky' }[] = [
  { indent: 0, w: 9, tone: 'sky' },
  { indent: 1.6, w: 13 },
  { indent: 1.6, w: 7.5, tone: 'flame' },
  { indent: 3.2, w: 11 },
  { indent: 1.6, w: 5.5 },
  { indent: 0, w: 3.2, tone: 'sky' },
]

export default function Engineering() {
  const ref = useRef<HTMLDivElement>(null)

  useScene('engineering', ref, (root, stage, E) => {
    const U = stage.U
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
    const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as unknown as T[]
    const t = gsap.timeline({ paused: true, defaults: { ease: E.out, duration: 0.7 } })

    // ------------------------------------------------------------ the pieces
    const leadLines = SplitText.create($('.eng-lead'), { type: 'lines', mask: 'lines' }).lines as HTMLElement[]
    const lines = $$('.eng-h .ev-rise')
    const em = $('.eng-h em')
    const underline = $('.eng-h em path')

    const pic = $('.eng-pic')
    const app = $('.eng-app')
    const tiles = $$('.eng-tile')
    const code = $('.eng-code')
    const mark = $('.eng-code-mark')
    const markPaths = $$('.eng-code-mark path')
    const codeLines = $$('.eng-code-line')
    const caret = $('.eng-caret')

    // ------------------------------------------------------------ starting states
    gsap.set([...leadLines, ...lines], { yPercent: 118 })
    gsap.set(underline, { drawSVG: '0%' })
    gsap.set(em, { transformOrigin: '50% 80%' })
    gsap.set(app, { autoAlpha: 0, y: 3.4 * U, scale: 0.92, transformOrigin: '50% 100%' })
    gsap.set(tiles, { scale: 0, transformOrigin: '50% 50%' })
    // the engineers' screen starts behind her phone
    gsap.set(code, { autoAlpha: 0, x: -7 * U, y: 3 * U, scale: 0.8, transformOrigin: '0% 100%' })
    gsap.set(mark, { scale: 0.5, transformOrigin: '50% 50%' })
    gsap.set(markPaths, { drawSVG: '0%' })
    gsap.set(codeLines, { scaleX: 0, transformOrigin: '0 50%' })
    gsap.set(caret, { autoAlpha: 0 })

    // ============================================================ DAY: her phone, and the apps she works in
    t.addLabel('start', 0)
      .to(leadLines, { yPercent: 0, duration: 0.7, stagger: 0.08 }, 0.06)
      .to(app, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: E.snap }, 0.02)
      .to(tiles, { scale: 1, duration: 0.42, ease: E.snap, stagger: 0.06 }, 0.24)
    const tD = 0.72
    t.addLabel('day', tD)

    // ============================================================ IN: from behind it, the engineers
    t.to(lines, { yPercent: 0, duration: 0.8, stagger: 0.09 }, 0.38)
      .to(underline, { drawSVG: '100%', duration: 0.42, ease: 'power2.inOut' }, 0.86)
      .to(em, { scale: 1.045, duration: 0.18, ease: 'power2.out' }, 0.92)
      .to(em, { scale: 1, duration: 0.26, ease: 'power2.inOut' }, 1.1)
      // the one confident move: their screen steps out from behind her phone
      .to(code, { autoAlpha: 1, duration: 0.14, ease: 'none' }, tD)
      .to(code, { x: 0, y: 0, scale: 1, duration: 0.58, ease: E.inOut }, tD)
      .to(mark, { scale: 1, duration: 0.38, ease: E.snap }, tD + 0.26)
      .to(markPaths, { drawSVG: '100%', duration: 0.28, ease: 'power2.out', stagger: 0.05 }, tD + 0.28)
      .to(codeLines, { scaleX: 1, duration: 0.26, ease: 'power2.out', stagger: 0.03 }, tD + 0.26)
      .to(caret, { autoAlpha: 1, duration: 0.08, ease: 'none' }, tD + 0.58)
    const tI = CHAPTER_TIME.in
    t.addLabel('in', tI)

    // ============================================================ the card clears for Piramal Mind
    // the words leave through their own lines; their screen goes back behind her phone, and the two lift away together
    t.to(underline, { autoAlpha: 0, duration: 0.14, ease: 'none' }, tI)
      .to([...leadLines, ...lines], { yPercent: -118, duration: 0.34, ease: 'power3.in', stagger: 0.025 }, tI)
      .to(code, { x: -3.5 * U, y: 1.5 * U, scale: 0.9, duration: 0.36, ease: 'power2.in' }, tI)
      .to(pic, { autoAlpha: 0, y: -1.8 * U, duration: 0.3, ease: 'power2.in' }, tI + 0.1)
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
      {/* ---- the headline: the left column, above Priya's bubble ---- */}
      <div className="eng-say">
        <p className="eng-lead">{ENGINEERING.headline.lead.trim()}</p>
        <h2 className="eng-h" aria-label={`${ENGINEERING.headline.em}${ENGINEERING.headline.tail}`}>
          <span className="ev-mask" aria-hidden="true">
            <span className="ev-rise">
              <em>
                {ENGINEERING.headline.em}
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 13 C 60 5, 130 5, 180 10 S 270 15, 297 7" />
                </svg>
              </em>
            </span>
          </span>
          {HEAD_LINES.map((l, i) => (
            <Rise key={i}>
              {l.text}
              {l.name ? ` ${OPENING.title}` : null}
            </Rise>
          ))}
        </h2>
      </div>

      {/* ---- the one picture: behind her apps, the engineers. No words. ---- */}
      <div className="eng-pic" aria-hidden="true">
        {/* the engineers' screen: it steps out from behind her phone */}
        <div className="eng-code">
          <span className="eng-code-bar">
            <i />
            <i />
            <i />
          </span>
          <span className="eng-code-mark">
            <CodeGlyph />
          </span>
          <span className="eng-code-lines">
            {CODE.map((l, i) => (
              <i className="eng-code-line" data-tone={l.tone} style={{ ['--in' as string]: l.indent, ['--w' as string]: l.w } as CSSProperties} key={i} />
            ))}
            <i className="eng-caret" />
          </span>
        </div>

        {/* her phone: the four apps of her day */}
        <div className="eng-app">
          <i className="eng-app-island" />
          <span className="eng-tiles">
            {DAY.map((p) => (
              <span className="eng-tile ev-acc" data-accent={p.accent} key={p.key}>
                <i />
              </span>
            ))}
          </span>
          <i className="eng-app-home" />
        </div>
      </div>
    </div>
  )
}
