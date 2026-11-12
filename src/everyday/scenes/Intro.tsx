'use client'

/**
 * The opening screen: what Everyday AI is. The first thing a visitor reads, and the screen
 * that waits between visitors.
 *
 * The title, the one sentence that says what it means (with "our own job" picked out),
 * the three pillars arriving one by one, and the one thing to touch: the start control,
 * with the teaser beside it. No Priya yet: she comes in on the next screen.
 *
 * It stays gently alive while it waits (the start control pings, the pillars take turns
 * to lift, the five names on the rail take turns too), and every name on the rail can be
 * touched for a preview.
 *
 * Held frames: ?scene=intro&at=<title|say|pillars|idle|done>
 */

import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { OPENING, type Accent } from '../content'
import { director } from '../core/director'
import { INTRO_TIME } from '../core/timing'
import { useScene } from '../core/useScene'
import { Rise } from '../moments/parts'
import './Intro.css'

/** "Everyday AI": the last word is the one in the brand's flame. */
const TITLE = OPENING.title.split(' ')
/** The sentence: its last two words before the emphasis ("to do") stay on the line of "our own job". */
const LEAD = OPENING.headline.lead.trim().split(' ')
const LEAD_HEAD = LEAD.slice(0, -2).join(' ')
const LEAD_TAIL = LEAD.slice(-2).join(' ')
/** The teaser, a sentence to a line. (No lookbehind: Safari before 16.4 will not parse one.) */
const TEASER: string[] =
  OPENING.teaser
    .match(/[^.?!।]+[.?!।]*\s*/g)
    ?.map((s) => s.trim())
    .filter(Boolean) ?? [OPENING.teaser]
/** The three pillars wear the brand's three colours, in the order the film uses them. */
const PILLAR_ACCENT: Accent[] = ['flame', 'azure', 'navy']

export default function Intro() {
  const ref = useRef<HTMLDivElement>(null)

  useScene('intro', ref, (root, stage, E) => {
    const U = stage.U
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
    const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as unknown as T[]
    const t = gsap.timeline({ paused: true, defaults: { ease: E.out, duration: 0.7 } })

    const eyebrow = $('.op-eyebrow .ev-rise')
    const title = SplitText.create($$('.op-word'), { type: 'chars', charsClass: 'op-ch' })
    const chars = title.chars as HTMLElement[]
    const em = $('.op-h em')
    const underline = $('.op-h em path')
    const lines = SplitText.create($('.op-h'), { type: 'lines', mask: 'lines' }).lines as HTMLElement[]
    const cards = $$('.op-pillar')
    const badges = $$('.op-n')
    const pillarTitles = $$('.op-pillar-h .ev-rise')
    const pillarTexts = $$('.op-pillar-t')
    const start = $('.ev-start')
    const teaser = $('.op-teaser .ev-rise')
    const rule = $('.op-rule')

    // ------------------------------------------------------------ starting states
    gsap.set([eyebrow, teaser, ...pillarTitles], { yPercent: 118 })
    gsap.set(chars, { yPercent: 118 })
    gsap.set(lines, { yPercent: 118 })
    gsap.set(underline, { drawSVG: '0%' })
    gsap.set(em, { transformOrigin: '50% 80%' })
    gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' })
    gsap.set(cards, { autoAlpha: 0, x: 3 * U, scale: 0.94, transformOrigin: '50% 50%' })
    gsap.set(badges, { scale: 0 })
    gsap.set(pillarTexts, { autoAlpha: 0, y: 0.9 * U })
    gsap.set(start, { autoAlpha: 0, y: 1.4 * U, scale: 0.92 })

    // ============================================================ the screen arrives
    t.addLabel('start', 0)
      .to(eyebrow, { yPercent: 0, duration: 0.6 }, 0.05)
      .to(rule, { scaleX: 1, duration: 0.8, ease: E.inOut }, 0.1)
      .to(chars, { yPercent: 0, duration: 0.95, stagger: 0.035 }, 0.12)
    t.addLabel('title', 1.05)

    // what it means, in one sentence
    t.to(lines, { yPercent: 0, duration: 0.9, stagger: 0.11 }, 0.55)
      .to(underline, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' }, 1.2)
      .to(em, { scale: 1.045, duration: 0.2, ease: 'power2.out' }, 1.28)
      .to(em, { scale: 1, duration: 0.3, ease: 'power2.inOut' }, 1.48)
    t.addLabel('say', 1.8)

    // the three pillars, one by one
    cards.forEach((card, i) => {
      const at = 0.95 + i * 0.26
      t.to(card, { autoAlpha: 1, x: 0, scale: 1, duration: 0.7, ease: E.snap }, at)
        .to(badges[i], { scale: 1, duration: 0.5, ease: E.snap }, at + 0.12)
        .to(pillarTitles[i], { yPercent: 0, duration: 0.55 }, at + 0.16)
        .to(pillarTexts[i], { autoAlpha: 1, y: 0, duration: 0.5 }, at + 0.26)
    })
    t.addLabel('pillars', 2.25)

    // and the one thing to touch
    t.to(start, { autoAlpha: 1, y: 0, scale: 1, duration: 0.75, ease: E.snap }, 1.6).to(teaser, { yPercent: 0, duration: 0.6 }, 1.78)
    const tI = 2.45
    t.addLabel('idle', tI)

    // ============================================================ start: the stage clears for Priya
    t.to(eyebrow, { yPercent: -118, duration: 0.36, ease: 'power3.in' }, tI)
      .to(rule, { scaleX: 0, transformOrigin: '100% 50%', duration: 0.36, ease: 'power2.in' }, tI)
      .to(chars, { yPercent: -118, duration: 0.42, ease: 'power3.in', stagger: 0.012 }, tI)
      .to(underline, { autoAlpha: 0, duration: 0.16, ease: 'none' }, tI)
      .to(lines, { yPercent: -118, duration: 0.4, ease: 'power3.in', stagger: 0.035 }, tI + 0.04)
      .to(teaser, { yPercent: -118, duration: 0.3, ease: 'power3.in' }, tI)
      .to(start, { autoAlpha: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }, tI)
      .to(cards, { autoAlpha: 0, x: 4 * U, duration: 0.36, ease: 'power2.in', stagger: 0.04 }, tI + 0.02)
    t.addLabel('done', tI + INTRO_TIME.out)

    return {
      tl: t,
      stops: [
        { label: 'idle', cap: tI, control: start, ghostAfter: INTRO_TIME.attract },
        { label: 'done', step: 'out', cap: INTRO_TIME.out, exit: true },
      ],
    }
  })

  return (
    <div ref={ref} className="ev-scene ev-scene--intro">
      <div className="op-area">
        <div className="op-say">
          <p className="op-eyebrow">
            <Rise>{OPENING.eyebrow}</Rise>
            <i className="op-rule" />
          </p>
          <h1 className="op-title" aria-label={OPENING.title}>
            <span className="ev-mask" aria-hidden="true">
              {TITLE.map((word, i) => (
                <span key={word + i}>
                  {i > 0 ? ' ' : null}
                  <span className={i === TITLE.length - 1 ? 'op-word op-word--ai' : 'op-word'}>{word}</span>
                </span>
              ))}
            </span>
          </h1>
          <p className="op-h">
            {LEAD_HEAD}{' '}
            <span className="op-keep">
              {LEAD_TAIL}{' '}
              <em>
                {OPENING.headline.em}
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M3 13 C 60 5, 130 5, 180 10 S 270 15, 297 7" />
                </svg>
              </em>
              {OPENING.headline.tail}
            </span>
          </p>
          <div className="op-startrow">
            <button
              type="button"
              className="ev-start"
              data-own
              data-ev-control
              onClick={(e) => {
                e.stopPropagation()
                director.touch()
              }}
            >
              <i className="ev-start-ping" />
              <i className="ev-start-ping ev-start-ping--2" />
              <span className="ev-start-in">
                {OPENING.start}
                <span className="ev-start-arrow">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
                  </svg>
                </span>
              </span>
            </button>
            <p className="op-teaser">
              <Rise>
                <b>{TEASER[0]}</b>
                {TEASER.slice(1).join(' ')}
              </Rise>
            </p>
          </div>
        </div>

        <ol className="op-pillars">
          {OPENING.pillars.map((p, i) => (
            <li className="op-pillar ev-acc" data-accent={PILLAR_ACCENT[i % PILLAR_ACCENT.length]} style={{ ['--i' as string]: i }} key={p.title}>
              <span className="op-pillar-lift">
                <span className="op-pillar-bg" />
                <span className="op-n">{i + 1}</span>
                <span className="op-pillar-in">
                  <span className="op-pillar-h">
                    <Rise>{p.title}</Rise>
                  </span>
                  <span className="op-pillar-t">{p.text}</span>
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
