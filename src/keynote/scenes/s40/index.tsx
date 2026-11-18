'use client'

/**
 * Slides 40 and 41 · ONE COLLECTION VISIT, before and after Nivaaran (s41 re-exports this scene).
 *
 * The three cards (before, during, after the visit) and their three objects never leave the
 * stage. Slide 40 walks the visit as it is run today; slide 41 changes the SAME things in place.
 *
 *   40  visit     the frame: Sagar, the three cards as the agent finds them. In the speech
 *                 bubble the customer is talking: a waveform of points of light (three.js).
 *       before    what is missing: three empty pills, the note of what never reaches the agent.
 *       during    the dropdown opens, "Promise to pay" is picked and recorded, and the customer's
 *                 words scatter and are gone: the conversation is not captured.
 *       after     the fixed date is stamped on the month; the days customers get paid land elsewhere.
 *   41  insights  Nivaaran takes the chip, a light crosses the cards; the three empty pills open
 *                 into three insights, the 7 drops into "Visit on the 7th". The other two cards wait.
 *       listen    the SAME points come back and settle into the recording; the transcript writes
 *                 itself (Hindi, word by word, never cut into letters); two findings come out of it.
 *       decide    the fixed date walks to the 7th and becomes the strategy's badge; what we now
 *                 know flies in from the two cards before; Call and Field become three ways to collect.
 *
 * Words: data.ts (copied from the pack). Objects: three generated cut-outs of the deck's own
 * three objects (GEN.md). Sagar's photograph is the deck's file, as it is, never above its 97 px.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, gen, Headline, Kicker, Person, pic, slide as slideOf, spanBeats, Words, type SceneModule } from '../../kit'
import * as D from './data'
import { makeVoice, type VoiceFx } from './particles'
import './scene.css'

const SLIDES = { 40: ['visit', 'before', 'during', 'after'], 41: ['insights', 'listen', 'decide'] }

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`

/** The month grid: a cell and its gap, in --u. */
const CELL = 1.55
const GAP = 0.33
const STEP = CELL + GAP
const dayAt = (d: number) => ({ col: (d - 1) % 7, row: Math.floor((d - 1) / 7) })
const dayStyle = (d: number): CSSProperties => ({ left: u(dayAt(d).col * STEP), top: u(dayAt(d).row * STEP) })

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9.5 6 6 6-6 6" />
  </svg>
)

/** The little page of a calendar with a 7 on it (the deck's badge on 41). */
const Cal7 = ({ className }: { className: string }) => (
  <span className={`s40-cal ${className}`}>
    <i />
    <b>{D.AFTER_41.badge}</b>
  </span>
)

/** Three small calendar pages: "allocated by hand" (the deck's glyphs beside Call and Field). */
const MiniCals = () => (
  <span className="s40-minis" aria-hidden="true">
    {[0, 1, 2].map((k) => (
      <span className="s40-mini" key={k}>
        <i />
        <em />
        <em />
      </span>
    ))}
  </span>
)

const Mic = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" stroke="none" />
    <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21M8.5 21h7" />
  </svg>
)

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),
  preload: [pic(40, D.WHO_40.photo), ...D.STAGES.map((s) => gen(40, s.object))],

  Scene: () => (
    <div className="s40">
      <Headline className="s40-h s40-h--40" text={slideOf(40).title} flame={D.FLAME_40} />
      <Headline className="s40-h s40-h--41" text={slideOf(41).title} flame={D.FLAME_41} />

      {/* who runs the visit: Sagar on 40, Nivaaran on 41, in the same chip */}
      <div className="s40-who">
        <span className="s40-who-a">
          <Person src={pic(40, D.WHO_40.photo)} name={D.WHO_40.name} role={D.WHO_40.role} size={2.9} ring="flame" maxPx={D.WHO_40.photoPx} />
        </span>
        <span className="s40-who-b">
          <span className="s40-n">{D.WHO_41.initial}</span>
          <span className="s40-who-t">
            <b>{D.WHO_41.name}</b>
            <small>{D.WHO_41.role}</small>
          </span>
        </span>
      </div>
      <p className="s40-cap s40-cap--40">{D.WHO_40.caption}</p>
      <p className="s40-cap s40-cap--41">{D.WHO_41.caption}</p>

      {D.STAGES.map((s, i) => (
        <section className={`s40-card s40-card--${s.key}`} key={s.key}>
          <span className="s40-top" aria-hidden="true" />
          <span className="s40-obj" style={{ aspectRatio: `${s.ratio[0]} / ${s.ratio[1]}` }}>
            <img src={gen(40, s.object)} alt="" draggable={false} />
          </span>
          <Kicker tone="flame" className="s40-label">
            {s.label}
          </Kicker>
          <h3 className="s40-title s40-title--40">
            <Words text={s.title40} />
          </h3>
          <h3 className="s40-title s40-title--41">
            <Words text={s.title41} />
          </h3>
          <span className="s40-rule" aria-hidden="true" />

          <div className="s40-body">
            {i === 0 ? (
              <>
                <div className="s40-old">
                  <div className="s40-hand">
                    <span className="s40-hand-bg" />
                    <Kicker className="s40-k">{D.BEFORE_40.label}</Kicker>
                    <div className="s40-pills">
                      {D.BEFORE_40.pills.map((p) => (
                        <span className="s40-pill s40-pill--has" key={p}>
                          {p}
                        </span>
                      ))}
                      {D.BEFORE_40.empty.map((p, k) => (
                        <span className="s40-pill s40-pill--empty" key={k}>
                          {p}
                        </span>
                      ))}
                    </div>
                    <p className="s40-note">{D.BEFORE_40.note}</p>
                  </div>
                  <p className="s40-sticky">
                    <b>{D.BEFORE_40.calloutBold}</b>
                    {D.BEFORE_40.callout.slice(D.BEFORE_40.calloutBold.length)}
                  </p>
                  <p className="s40-foot">{D.BEFORE_40.footer}</p>
                </div>
                <div className="s40-new">
                  {D.BEFORE_41.insights.map((r) => (
                    <div className="s40-ins" key={r.title}>
                      <span className="s40-ins-in">
                        <span className="s40-ins-b">{r.badge}</span>
                        <b>{r.title}</b>
                        <small>{r.line}</small>
                      </span>
                    </div>
                  ))}
                  <div className="s40-visit">
                    <span className="s40-visit-bg" />
                    <Cal7 className="s40-visit-7" />
                    <b className="s40-visit-t">{D.BEFORE_41.footer}</b>
                  </div>
                </div>
              </>
            ) : null}

            {i === 1 ? (
              <>
                <div className="s40-old">
                  <div className="s40-bubble">
                    <span className="s40-bubble-box" />
                    <span className="s40-bubble-tail" />
                    <p className="s40-bubble-t">
                      {D.DURING_40.bubble[0]}
                      <br />
                      {D.DURING_40.bubble[1]}
                    </p>
                  </div>
                  <span className="s40-arrow">
                    <Chevron />
                  </span>
                  <div className="s40-dd">
                    <div className="s40-dd-head">
                      {D.DURING_40.dropdown}
                      <svg viewBox="0 0 12 8" aria-hidden="true">
                        <path d="M0 0h12L6 8z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="s40-dd-list">
                      <span className="s40-pick" />
                      {D.DURING_40.options.map((o) => (
                        <span className="s40-opt" key={o}>
                          {o}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="s40-rec">
                    <Kicker className="s40-k s40-rec-k">{D.DURING_40.recordedLabel}</Kicker>
                    <span className="s40-pill s40-pill--has s40-rec-pill">{D.DURING_40.recorded}</span>
                  </div>
                  <p className="s40-note s40-note--during">{D.DURING_40.note}</p>
                  <p className="s40-foot">{D.DURING_40.footer}</p>
                </div>
                <div className="s40-new">
                  <span className="s40-mic">
                    <Mic />
                  </span>
                  <div className="s40-wave" aria-hidden="true">
                    {D.WAVE.map((h, k) => (
                      <span className={`s40-wbar ${D.WAVE_FLAME.includes(k) ? 's40-wbar--flame' : ''}`} key={k} style={{ height: `${Math.round(h * 100)}%` }}>
                        <i style={{ animationDelay: `${-((k * 0.37) % 1.6).toFixed(2)}s` }} />
                      </span>
                    ))}
                  </div>
                  <div className="s40-says">
                    <p lang="hi">
                      {D.DURING_41.transcript.split(' ').map((w, k) => (
                        <span key={k}>
                          <span className="s40-word">{w}</span>{' '}
                        </span>
                      ))}
                    </p>
                    <span className="s40-says-tail" />
                  </div>
                  <Kicker tone="flame" className="s40-k s40-takes">
                    {D.DURING_41.label}
                  </Kicker>
                  <div className="s40-take-row">
                    {D.DURING_41.pills.map((p) => (
                      <span className="s40-pill s40-pill--peach s40-take" key={p}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {i === 2 ? (
              <>
                <div className="s40-old">
                  <Kicker className="s40-k s40-alloc-k">{D.AFTER_40.byHand}</Kicker>
                  {D.AFTER_40.ways.map((w) => (
                    <div className="s40-way" key={w}>
                      <b>{w}</b>
                      <MiniCals />
                    </div>
                  ))}
                  <Kicker className="s40-k s40-month-k">{D.AFTER_40.everyMonth}</Kicker>
                  <div className="s40-grid" aria-hidden="true">
                    {Array.from({ length: D.AFTER_40.days }, (_, k) => (
                      <span className="s40-day" key={k} style={dayStyle(k + 1)} />
                    ))}
                    {D.AFTER_40.paid.map((d) => (
                      <span className={`s40-paid ${d === 7 ? 's40-paid--7' : ''}`} key={d} style={dayStyle(d)} />
                    ))}
                    <span className="s40-fixed" style={dayStyle(D.AFTER_40.fixed)} />
                  </div>
                  <p className="s40-legend s40-legend--fixed">
                    <i />
                    {D.AFTER_40.legend[0]}
                  </p>
                  <p className="s40-legend s40-legend--paid">
                    <i />
                    {D.AFTER_40.legend[1]}
                  </p>
                  <p className="s40-foot">{D.AFTER_40.footer}</p>
                </div>
                <div className="s40-new">
                  <Kicker className="s40-k s40-know-k">{D.AFTER_41.label}</Kicker>
                  <div className="s40-know-row">
                    <span className="s40-pill s40-pill--ice s40-know">{D.AFTER_41.pills[0]}</span>
                    <span className="s40-pill s40-pill--peach s40-know">{D.AFTER_41.pills[1]}</span>
                  </div>
                  <span className="s40-know-tail" />
                  <div className="s40-strat">
                    <span className="s40-strat-bg" />
                    <Kicker className="s40-k s40-strat-k">{D.AFTER_41.strategyLabel}</Kicker>
                    <b className="s40-strat-t">{D.AFTER_41.strategy}</b>
                    <small className="s40-strat-l">{D.AFTER_41.strategyLine}</small>
                    <Cal7 className="s40-strat-7" />
                  </div>
                  <Kicker className="s40-k s40-ways-k">{D.AFTER_41.waysLabel}</Kicker>
                  <div className="s40-collect-row">
                    {D.AFTER_41.ways.map((w, k) => (
                      <span className={`s40-pill s40-collect ${k === 2 ? 's40-collect--on' : 's40-pill--line'}`} key={w}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      ))}

      <span className="s40-next s40-next--1" aria-hidden="true">
        <Chevron />
      </span>
      <span className="s40-next s40-next--2" aria-hidden="true">
        <Chevron />
      </span>

      {/* the light that crosses the cards when Nivaaran arrives */}
      <span className="s40-sweep" aria-hidden="true" />
    </div>
  ),

  three(ctx) {
    // measured now, in final layout, before build() hides or moves anything
    const U = ctx.U
    const b = ctx.loc(ctx.$('.s40-bubble-box'))
    const bubble = { x: b.x / U + 1.1, y: b.y / U + (b.h / U) * 0.14, w: b.w / U - 2.2, h: (b.h / U) * 0.72 }
    const bars = ctx.$$('.s40-wbar').map((el) => {
      const r = ctx.loc(el)
      return { x: r.x / U, y: r.y / U, w: r.w / U, h: r.h / U }
    })
    const fx = makeVoice(ctx, bubble, bars, D.WAVE_FLAME)
    ctx.bag.voice = fx
    return fx.dispose
  },

  build(ctx) {
    const { ease, U, T } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const voice = ctx.bag.voice as VoiceFx | undefined
    const $ = ctx.$
    const $$ = ctx.$$
    const cards = $$('.s40-card')
    const [c1, c2, c3] = cards
    const q = (root: Element, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))
    const calm = ctx.reduced

    /* ---------------------------------------------------- measure first (rule 5) */
    const loc = (el: Element) => ctx.loc(el)
    const empties = q(c1, '.s40-pill--empty')
    const rows = q(c1, '.s40-ins')
    const emptyBox = empties.map(loc)
    const rowBox = rows.map(loc)
    const badge7 = loc(q(rows[1], '.s40-ins-b')[0])
    const visit7 = $('.s40-visit-7')
    const visit7Box = loc(visit7)
    const opt0 = loc(q(c2, '.s40-opt')[0])
    const recPill = $('.s40-rec-pill')
    const recBox = loc(recPill)
    const saysBox = loc($('.s40-says'))
    const takes = q(c2, '.s40-take')
    const takeBox = takes.map(loc)
    const knows = q(c3, '.s40-know')
    const knowBox = knows.map(loc)
    const waysOld = q(c3, '.s40-way')
    const waysOldBox = waysOld.map(loc)
    const collect = q(c3, '.s40-collect')
    const collectBox = collect.map(loc)
    const fixed = $('.s40-fixed')
    const fixedBox = loc(fixed)
    const strat7 = $('.s40-strat-7')
    const strat7Box = loc(strat7)

    /* ================================================================ 40 · visit */
    a.words('.s40-h--40', 0.1)
    a.rise('.s40-who', 0.25, { y: 1 })
    a.fade('.s40-cap--40', 0.55)
    gsap.set($$('.s40-who-b, .s40-cap--41'), { autoAlpha: 0 })

    a.rise(cards, 0.2, { y: 2.6, stagger: 0.13, duration: 0.95 })
    a.rule('.s40-top', 0.55, { stagger: 0.13, duration: 0.8 })
    a.pop('.s40-obj', 0.65, { stagger: 0.13, from: 0.7, duration: 0.7 })
    a.fade('.s40-label', 0.75, { stagger: 0.13 })
    cards.forEach((c, i) => a.words(q(c, '.s40-title--40'), 0.8 + i * 0.13, { duration: 0.6 }))
    gsap.set($$('.s40-title--41 .kn-wi'), { yPercent: 118 })
    a.rule('.s40-rule', 0.95, { stagger: 0.13, duration: 0.7 })
    a.pop('.s40-next', 1.5, { stagger: 0.13 })

    // the cards as the agent finds them
    a.fade(q(c1, '.s40-hand-bg, .s40-hand .s40-k'), 1.45)
    a.pop(q(c1, '.s40-pill--has'), 1.6, { stagger: 0.07, from: 0.8 })
    a.fade(empties, 1.9, { stagger: 0.07 })
    a.fade(q(c2, '.s40-bubble-box, .s40-bubble-tail'), 1.6)
    a.rise(q(c2, '.s40-dd-head'), 1.7, { y: 0.8 })
    a.fade(q(c3, '.s40-alloc-k, .s40-month-k'), 1.75)
    a.rise(waysOld, 1.8, { y: 0.9, stagger: 0.1 })
    a.pop(q(c3, '.s40-day'), 1.8, { stagger: 0.012, from: 0.4, duration: 0.4 })
    // in the bubble the customer is talking
    if (voice) tl.to(voice.state, { speak: 1, duration: 1.3, ease: 'power1.out' }, 1.75)
    tl.to(fx, { glow: 0.22, focusX: 0, focusY: 0.25, duration: 1.6 }, 0.6)
    tl.addLabel('visit', 3.15)

    /* ================================================================ 40 · before */
    let t = 3.15
    tl.to(fx, { focusX: -0.62, warm: 0.15, glow: 0.34, duration: 1.1, ease: ease.inOut }, t)
    // the three empty ones are looked at, one by one
    tl.to(empties, { scale: 1.09, duration: 0.22, stagger: 0.14, ease: 'power2.out' }, t + 0.1)
    tl.to(empties, { scale: 1, duration: 0.4, stagger: 0.14, ease: 'power2.inOut' }, t + 0.32)
    a.fade(q(c1, '.s40-note'), t + 0.65)
    // what never reaches him
    const sticky = q(c1, '.s40-sticky')
    gsap.set(sticky, { autoAlpha: 0, y: -1.6 * U, rotation: calm ? -1.2 : -5, scale: 1.04 })
    tl.to(sticky, { autoAlpha: 1, y: 0, rotation: -1.2, scale: 1, duration: 0.7, ease: ease.snap }, t + 0.95)
    a.rise(q(c1, '.s40-foot'), t + 1.5, { y: 1 })
    tl.addLabel('before', t + 2.25)

    /* ================================================================ 40 · during */
    t += 2.25
    tl.to(fx, { focusX: 0, warm: 0, duration: 1.1, ease: ease.inOut }, t)
    // the dropdown opens; one option is taken
    a.wipe(q(c2, '.s40-dd-list'), t + 0.05, { from: 'top', duration: 0.6 })
    a.fade(q(c2, '.s40-arrow'), t + 0.3)
    const pick = q(c2, '.s40-pick')
    gsap.set(pick, { autoAlpha: 0, scale: 1.08 })
    tl.to(pick, { autoAlpha: 1, scale: 1, duration: 0.4, ease: ease.snap }, t + 0.85)
    // …and that one word is all that is recorded
    a.fade(q(c2, '.s40-rec-k'), t + 1.15)
    gsap.set(recPill, { autoAlpha: 0, x: calm ? 0 : opt0.x - recBox.x, y: calm ? 0 : opt0.cy - recBox.cy, scale: 0.9 })
    tl.to(recPill, { autoAlpha: 1, duration: 0.25 }, t + 1.2)
    tl.to(recPill, { x: 0, y: 0, scale: 1, duration: 0.75, ease: ease.inOut }, t + 1.2)
    // while what the customer said scatters and is gone
    if (voice) tl.to(voice.state, { lost: 1, duration: 2.0, ease: 'power1.inOut' }, t + 1.0)
    a.fade(q(c2, '.s40-bubble-t'), t + (voice ? 2.25 : 0.5), { duration: 0.7 })
    a.fade(q(c2, '.s40-note--during'), t + 2.1)
    a.rise(q(c2, '.s40-foot'), t + 2.5, { y: 1 })
    tl.addLabel('during', t + 3.25)

    /* ================================================================ 40 · after */
    t += 3.25
    tl.to(fx, { focusX: 0.62, warm: -0.1, duration: 1.1, ease: ease.inOut }, t)
    // the same date, stamped on the month
    gsap.set(fixed, { autoAlpha: 0, scale: calm ? 1 : 2.6 })
    tl.to(fixed, { autoAlpha: 1, duration: 0.12 }, t + 0.2)
    tl.to(fixed, { scale: 1, duration: 0.34, ease: ease.slam }, t + 0.2)
    if (!calm) {
      const grid = q(c3, '.s40-grid')
      tl.to(grid, { y: 0.14 * U, duration: 0.07, ease: 'power2.out' }, t + 0.54)
      tl.to(grid, { y: 0, duration: 0.4, ease: 'elastic.out(1, 0.45)' }, t + 0.61)
    }
    a.fade(q(c3, '.s40-legend--fixed'), t + 0.7)
    // the days customers are actually paid: somewhere else
    a.pop(q(c3, '.s40-paid'), t + 1.15, { stagger: 0.2, from: 0.2 })
    a.fade(q(c3, '.s40-legend--paid'), t + 1.75)
    a.rise(q(c3, '.s40-foot'), t + 2.1, { y: 1 })
    tl.addLabel('after', t + 2.85)

    /* ================================================================ 41 · insights */
    t += 2.85
    a.retitle('.s40-h--40', '.s40-h--41', t)
    // the chip changes hands
    tl.to($('.s40-who-a'), { autoAlpha: 0, y: calm ? 0 : -0.8 * U, duration: 0.35, ease: 'power2.in' }, t + 0.1)
    gsap.set($('.s40-who-b'), { y: calm ? 0 : 0.9 * U })
    tl.to($('.s40-who-b'), { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, t + 0.42)
    gsap.set($('.s40-n'), { scale: calm ? 1 : 0.3 })
    tl.to($('.s40-n'), { scale: 1, duration: 0.6, ease: ease.snap }, t + 0.42)
    tl.to($('.s40-cap--40'), { autoAlpha: 0, duration: 0.3 }, t + 0.2)
    tl.to($('.s40-cap--41'), { autoAlpha: 1, duration: 0.5 }, t + 0.55)
    // a light crosses the three cards
    const sweep = $('.s40-sweep')
    gsap.set(sweep, { autoAlpha: 0, x: -34 * U })
    if (!calm) {
      tl.to(sweep, { autoAlpha: 1, duration: 0.3 }, t + 0.5)
      tl.to(sweep, { x: 104 * U, duration: 1.7, ease: 'power1.inOut' }, t + 0.5)
      tl.to(sweep, { autoAlpha: 0, duration: 0.35 }, t + 1.85)
    }
    tl.to(fx, { focusX: -0.62, warm: 0.4, glow: 0.46, energy: 0.3, duration: 1.4, ease: ease.inOut }, t + 0.3)
    // the two cards that are not yet their turn wait
    const waiting = [...q(c2, '.s40-old'), ...q(c3, '.s40-old')]
    tl.to(waiting, { opacity: 0.34, duration: 0.6 }, t + 0.5)

    // card 1: what he had in hand gives way…
    a.retitle(q(c1, '.s40-title--40'), q(c1, '.s40-title--41'), t + 0.7, { duration: 0.6 })
    a.leave([...q(c1, '.s40-hand .s40-k'), ...q(c1, '.s40-pill--has'), ...q(c1, '.s40-note'), ...q(c1, '.s40-sticky'), ...q(c1, '.s40-foot')], t + 0.75, { stagger: 0.03 })
    tl.to(q(c1, '.s40-hand-bg'), { autoAlpha: 0, duration: 0.4 }, t + 0.8)
    // …and each empty pill opens into what Nivaaran knows
    rows.forEach((row, i) => {
      const from = emptyBox[i]
      const to = rowBox[i]
      const at = t + 1.15 + i * 0.16
      const inner = q(row, '.s40-ins-in')
      gsap.set(inner, { autoAlpha: 0 })
      if (calm) {
        gsap.set(row, { autoAlpha: 0 })
        tl.to(row, { autoAlpha: 1, duration: 0.5 }, at)
      } else {
        gsap.set(row, { autoAlpha: 0, x: from.x - to.x, y: from.y - to.y, scaleX: from.w / to.w, scaleY: from.h / to.h, transformOrigin: '0% 0%' })
        tl.to(row, { autoAlpha: 1, duration: 0.2 }, at)
        tl.to(row, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.8, ease: ease.inOut }, at)
      }
      tl.to(empties[i], { autoAlpha: 0, duration: 0.25 }, at + 0.05)
      tl.to(inner, { autoAlpha: 1, duration: 0.45 }, at + 0.55)
      const b = q(row, '.s40-ins-b')
      gsap.set(b, { scale: calm ? 1 : 0.4 })
      tl.to(b, { scale: 1, duration: 0.55, ease: ease.snap }, at + 0.55)
    })
    // the 7 drops into the visit
    a.wipe(q(c1, '.s40-visit-bg'), t + 2.25, { from: 'left', duration: 0.7 })
    gsap.set(visit7, { autoAlpha: 0, x: calm ? 0 : badge7.cx - visit7Box.cx, y: calm ? 0 : badge7.cy - visit7Box.cy, scale: 0.6 })
    tl.to(visit7, { autoAlpha: 1, duration: 0.2 }, t + 2.3)
    tl.to(visit7, { x: 0, y: 0, scale: 1, duration: 0.8, ease: ease.inOut }, t + 2.3)
    a.fade(q(c1, '.s40-visit-t'), t + 2.75)
    tl.addLabel('insights', t + 3.4)

    /* ================================================================ 41 · listen */
    t += 3.4
    tl.to(fx, { focusX: 0, warm: 0.25, duration: 1.2, ease: ease.inOut }, t)
    tl.to(q(c2, '.s40-old'), { opacity: 1, duration: 0.3 }, t)
    a.retitle(q(c2, '.s40-title--40'), q(c2, '.s40-title--41'), t + 0.1, { duration: 0.6 })
    // the dropdown and its one word are put away
    a.leave([...q(c2, '.s40-dd'), ...q(c2, '.s40-arrow'), ...q(c2, '.s40-rec'), ...q(c2, '.s40-note--during'), ...q(c2, '.s40-foot'), ...q(c2, '.s40-bubble')], t + 0.15, { stagger: 0.04 })
    // the same words come back, and this time they are kept
    a.pop(q(c2, '.s40-mic'), t + 0.55, { from: 0.3, duration: 0.7 })
    const wbars = q(c2, '.s40-wbar')
    gsap.set(wbars, { autoAlpha: 0, scaleY: voice && !calm ? 0.6 : 0.1 })
    if (voice) {
      tl.to(voice.state, { back: 1, duration: 1.9, ease: 'none' }, t + 0.45)
      tl.to(voice.state, { done: 1, duration: 0.5, ease: 'power1.in' }, t + 2.15)
      tl.to(wbars, { autoAlpha: 1, scaleY: 1, duration: 0.5, stagger: 0.012, ease: ease.out }, t + 2.05)
    } else {
      tl.to(wbars, { autoAlpha: 1, scaleY: 1, duration: 0.6, stagger: 0.03, ease: ease.snap }, t + 0.8)
    }
    // the transcript writes itself, word by word
    const says = q(c2, '.s40-says')
    a.rise(says, t + 1.7, { y: 1.2 })
    const words = q(c2, '.s40-word')
    gsap.set(words, { autoAlpha: 0 })
    tl.to(words, { autoAlpha: 1, duration: 0.25, stagger: 0.055, ease: 'none' }, t + 2.3)
    const wEnd = t + 2.3 + words.length * 0.055
    // two findings come out of it
    a.fade(q(c2, '.s40-says-tail'), wEnd)
    a.fade(q(c2, '.s40-takes'), wEnd + 0.1)
    takes.forEach((p, i) => {
      gsap.set(p, { autoAlpha: 0, y: calm ? 0 : saysBox.y + saysBox.h - takeBox[i].y - takeBox[i].h, scale: 0.85 })
      tl.to(p, { autoAlpha: 1, duration: 0.25 }, wEnd + 0.25 + i * 0.18)
      tl.to(p, { y: 0, scale: 1, duration: 0.7, ease: ease.snap }, wEnd + 0.25 + i * 0.18)
    })
    tl.addLabel('listen', wEnd + 1.3)

    /* ================================================================ 41 · decide */
    t = wEnd + 1.3
    tl.to(fx, { focusX: 0.62, warm: 0.1, glow: 0.5, duration: 1.2, ease: ease.inOut }, t)
    tl.to(q(c3, '.s40-old'), { opacity: 1, duration: 0.3 }, t)
    a.retitle(q(c3, '.s40-title--40'), q(c3, '.s40-title--41'), t + 0.1, { duration: 0.6 })
    // the fixed date walks to the day he is paid
    const d7 = dayAt(7)
    const d18 = dayAt(D.AFTER_40.fixed)
    const toSeven = { x: (d7.col - d18.col) * STEP * U, y: (d7.row - d18.row) * STEP * U }
    tl.to(fixed, { ...toSeven, duration: calm ? 0.01 : 0.9, ease: ease.inOut }, t + 0.25)
    tl.to(q(c3, '.s40-paid--7'), { scale: 1.9, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, t + 1.0)
    // what the month was gives way
    a.leave([...q(c3, '.s40-alloc-k, .s40-month-k'), ...q(c3, '.s40-legend'), ...q(c3, '.s40-foot'), ...q(c3, '.s40-paid:not(.s40-paid--7)')], t + 0.9, { stagger: 0.03 })
    tl.to(q(c3, '.s40-day'), { autoAlpha: 0, duration: 0.4, stagger: { each: 0.01, from: 'end' } }, t + 1.25)
    // what we now know arrives from the two cards before
    a.fade(q(c3, '.s40-know-k'), t + 1.2)
    const src = [rowBox[1], takeBox[1]]
    knows.forEach((p, i) => {
      const at = t + 1.2 + i * 0.22
      gsap.set(p, { autoAlpha: 0, x: calm ? 0 : src[i].cx - knowBox[i].cx, y: calm ? 0 : src[i].cy - knowBox[i].cy, scale: 0.9 })
      tl.to(p, { autoAlpha: 1, duration: 0.25 }, at)
      tl.to(p, { x: 0, y: 0, scale: 1, duration: 1.05, ease: ease.inOut }, at)
    })
    a.fade(q(c3, '.s40-know-tail'), t + 2.4)
    // the date flies to where the strategy will stand, the strategy opens out from it, and the date becomes its badge
    a.wipe(q(c3, '.s40-strat-bg'), t + 2.1, { from: 'right', duration: 0.7 })
    a.fade(q(c3, '.s40-strat-k'), t + 2.55)
    a.rise(q(c3, '.s40-strat-t'), t + 2.6, { y: 0.8 })
    a.fade(q(c3, '.s40-strat-l'), t + 2.85)
    gsap.set(strat7, { autoAlpha: 0, scale: 0.5 })
    if (!calm) {
      tl.to(fixed, { x: strat7Box.cx - fixedBox.cx, y: strat7Box.cy - fixedBox.cy, scale: strat7Box.w / fixedBox.w, duration: 0.8, ease: ease.inOut }, t + 1.4)
    }
    tl.to(fixed, { autoAlpha: 0, duration: 0.25 }, t + 2.75)
    tl.to(strat7, { autoAlpha: 1, scale: 1, duration: 0.55, ease: ease.snap }, t + 2.65)
    // Call and Field become two of three ways to collect (early, before the strategy covers their place); the third is chosen last
    a.fade(q(c3, '.s40-ways-k'), t + 1.6)
    waysOld.forEach((w, i) => {
      const at = t + 0.95 + i * 0.12
      const p = collect[i]
      if (!calm) {
        tl.to(w, { x: collectBox[i].cx - waysOldBox[i].cx, y: collectBox[i].cy - waysOldBox[i].cy, scaleX: collectBox[i].w / waysOldBox[i].w, scaleY: collectBox[i].h / waysOldBox[i].h, duration: 0.8, ease: ease.inOut }, at)
      }
      tl.to(w, { autoAlpha: 0, duration: 0.3 }, at + 0.5)
      gsap.set(p, { autoAlpha: 0 })
      tl.to(p, { autoAlpha: 1, duration: 0.35 }, at + 0.5)
    })
    a.pop(collect[2], t + 3.65, { from: 0.5, duration: 0.7 })
    tl.to(fx, { energy: 0.45, glow: 0.56, duration: 1.0 }, t + 3.5)
    tl.addLabel('decide', t + 4.5)
    return tl
  },
}

export default scene
