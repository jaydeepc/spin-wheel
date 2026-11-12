'use client'

/**
 * The opening screen: what Everyday AI is. The first thing a visitor reads, and the screen
 * that waits between visitors. It explains, and then it gets out of the way.
 *
 * On it, centred, and nothing else: the eyebrow; the title (the hero: "Everyday" rises letter
 * by letter, then "AI" is stamped beside it and the whole title takes the knock); the one
 * sentence, with "our own job" picked out; the three pillar titles as one quiet row; and the
 * start button, the one action, which pings softly while it waits.
 *
 * No Priya yet (she comes in on the next screen), no teaser, no previews, and no timer: in
 * manual the film waits here for the start button for as long as it takes (the director's rule).
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

/** "Everyday AI": the last word is the one in the brand's flame, and the one that is stamped. */
const TITLE = OPENING.title.split(' ')
const TITLE_LEAD = TITLE.slice(0, -1).join(' ')
const TITLE_LAST = TITLE[TITLE.length - 1]
/** The sentence, on two lines: its last two words before the emphasis ("to do") stay on the line of "our own job". */
const LEAD = OPENING.headline.lead.trim().split(' ')
const LEAD_HEAD = LEAD.slice(0, -2).join(' ')
const LEAD_TAIL = LEAD.slice(-2).join(' ')
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
    const rules = $$('.op-rule')
    const title = $('.op-title-in')
    const lead = SplitText.create($('.op-word--lead'), { type: 'chars', charsClass: 'op-ch' }).chars as HTMLElement[]
    const ai = SplitText.create($('.op-word--ai'), { type: 'chars', charsClass: 'op-ch' }).chars as HTMLElement[]
    const haze = $('.op-haze')
    const ring = $('.op-ring')
    const lines = $$('.op-h .ev-rise')
    const em = $('.op-h em')
    const underline = $('.op-h em path')
    const dots = $$('.op-dot')
    const pillars = $$('.op-pillar .ev-rise')
    const start = $('.ev-start')

    // ------------------------------------------------------------ starting states
    gsap.set([eyebrow, ...lines, ...pillars], { yPercent: 118 })
    gsap.set(rules, { scaleX: 0 })
    gsap.set(lead, { yPercent: 118 })
    gsap.set(ai, { autoAlpha: 0, scale: 2.5, yPercent: -16, transformOrigin: '50% 60%' })
    gsap.set(title, { transformOrigin: '50% 60%' })
    gsap.set(haze, { autoAlpha: 0, scale: 0.55 })
    gsap.set(ring, { autoAlpha: 0, scale: 0.4 })
    gsap.set(underline, { drawSVG: '0%' })
    gsap.set(em, { transformOrigin: '50% 80%' })
    gsap.set(dots, { scale: 0 })
    gsap.set(start, { autoAlpha: 0, y: 1.6 * U, scale: 0.9 })

    // ============================================================ the title arrives: the wow
    const hit = 0.98 // "AI" lands
    t.addLabel('start', 0)
      .to(eyebrow, { yPercent: 0, duration: 0.6 }, 0.05)
      .to(rules, { scaleX: 1, duration: 0.8, ease: E.inOut }, 0.1)
      // "Everyday" rises, letter by letter…
      .to(lead, { yPercent: 0, duration: 0.9, stagger: 0.04 }, 0.1)
      // …and "AI" is stamped beside it
      .to(ai, { autoAlpha: 1, duration: 0.1, ease: 'none', stagger: 0.09 }, hit - 0.3)
      .to(ai, { scale: 1, yPercent: 0, duration: 0.3, ease: E.slam, stagger: 0.09 }, hit - 0.3)
      // the whole title takes the knock, and a warm light opens behind it
      .to(title, { scale: 0.972, duration: 0.09, ease: 'power2.out' }, hit + 0.09)
      .to(title, { scale: 1, duration: 0.6, ease: E.snap }, hit + 0.18)
      .to(haze, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, hit + 0.06)
      .to(haze, { autoAlpha: 0.7, scale: 1.12, duration: 1.1, ease: 'power1.out' }, hit + 0.36)
      .to(ring, { autoAlpha: 0.9, duration: 0.08, ease: 'none' }, hit + 0.08)
      .to(ring, { scale: 1.5, duration: 0.7, ease: 'power2.out' }, hit + 0.08)
      .to(ring, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, hit + 0.28)
    t.addLabel('title', 1.3)

    // what it means, in one sentence
    t.to(lines, { yPercent: 0, duration: 0.85, stagger: 0.12 }, 0.95)
      .to(underline, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' }, 1.5)
      .to(em, { scale: 1.045, duration: 0.2, ease: 'power2.out' }, 1.58)
      .to(em, { scale: 1, duration: 0.3, ease: 'power2.inOut' }, 1.78)
    t.addLabel('say', 2.0)

    // the three pillars: one quiet row
    t.to(dots, { scale: 1, duration: 0.45, ease: E.snap, stagger: 0.12 }, 1.5).to(pillars, { yPercent: 0, duration: 0.6, stagger: 0.12 }, 1.54)
    t.addLabel('pillars', 2.3)

    // and the one thing to touch
    t.to(start, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: E.snap }, 1.8)
    const tI = 2.5
    t.addLabel('idle', tI)

    // ============================================================ start: the stage clears for Priya
    // the small things go first; the title is the last to leave, from its two ends inward
    t.to(start, { autoAlpha: 0, scale: 0.86, duration: 0.26, ease: 'power2.in' }, tI)
      .to(pillars, { yPercent: -118, duration: 0.3, ease: 'power3.in', stagger: 0.03 }, tI)
      .to(dots, { scale: 0, duration: 0.2, ease: 'power2.in', stagger: 0.03 }, tI)
      .to(underline, { autoAlpha: 0, duration: 0.14, ease: 'none' }, tI)
      .to(lines, { yPercent: -118, duration: 0.36, ease: 'power3.in', stagger: 0.04 }, tI + 0.03)
      .to(eyebrow, { yPercent: -118, duration: 0.3, ease: 'power3.in' }, tI + 0.06)
      .to(rules, { scaleX: 0, duration: 0.3, ease: 'power2.in' }, tI + 0.04)
      .to(lead, { yPercent: -118, duration: 0.4, ease: 'power3.in', stagger: { each: 0.016, from: 'end' } }, tI + 0.08)
      .to(ai, { autoAlpha: 0, scale: 0.7, duration: 0.24, ease: 'power2.in', stagger: 0.03 }, tI + 0.06)
      .to(haze, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, tI + 0.1)
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
        <p className="op-eyebrow">
          <i className="op-rule op-rule--l" />
          <Rise>{OPENING.eyebrow}</Rise>
          <i className="op-rule op-rule--r" />
        </p>

        <h1 className="op-title" aria-label={OPENING.title}>
          <i className="op-haze" aria-hidden="true" />
          <span className="op-title-in" aria-hidden="true">
            {TITLE_LEAD ? (
              <span className="ev-mask op-title-mask">
                <span className="op-word op-word--lead">{TITLE_LEAD}</span>
              </span>
            ) : null}
            <span className="op-ai">
              <i className="op-ring" />
              <span className="op-word op-word--ai">{TITLE_LAST}</span>
            </span>
          </span>
        </h1>

        <p className="op-h">
          <Rise>{LEAD_HEAD}</Rise>
          <Rise>
            {LEAD_TAIL}{' '}
            <em>
              {OPENING.headline.em}
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 13 C 60 5, 130 5, 180 10 S 270 15, 297 7" />
              </svg>
            </em>
            {OPENING.headline.tail}
          </Rise>
        </p>

        {/* the three pillars: their titles only, as one quiet row */}
        <ul className="op-pillars">
          {OPENING.pillars.map((p, i) => (
            <li className="op-pillar ev-acc" data-accent={PILLAR_ACCENT[i % PILLAR_ACCENT.length]} key={p.title}>
              <i className="op-dot" />
              <Rise>{p.title}</Rise>
            </li>
          ))}
        </ul>

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
      </div>
    </div>
  )
}
