'use client'

/**
 * Slide 23 · "Sovereign and Indic AI enter adolescence: India's own models grew up and found
 * their voice this year."
 *
 * THE IDEA: growing up, three times over, and then a voice. Each lab is a before and an after
 * on one line, and the after GROWS OUT OF the before:
 *
 *   ago      the headline; the three labs as they were a year ago: a small grey 24B, two
 *            language pills, a faint flat waveform. The photograph of the singers stands on the
 *            right: the chorus that is to come. Under a pale TODAY the places it will fill
 *            stand empty, in dashes: a ring, 22 pills, a flat line.
 *   today    one cascade down the page. A flame circle leaves the grey one, travels the arrow
 *            and swells to scale while it counts 24B to 105B ("4x" lands whole beside it); the 22
 *            language names fly out of the arrow's tip, script by script, into their four
 *            lines; the waveform opens from its middle into 22 living bars and "1 million+"
 *            rises whole beside it.
 *   chorus   "मिले सुर मेरा तुम्हारा": the line arrives under the singers, a wave of sound runs
 *            through the 22 names (each lights and stays lit) and through the waveform, and the
 *            clipping drops in last, as if pinned.
 *
 * The 22 names are whole strings from the pack (data.ts), set in var(--kn-font-indic), never
 * split into letters. The photograph is the deck's file, whole, at the deck's size. No map.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Clipping, Count, Headline, Kicker, Pic, pic, Words, type SceneModule } from '../../kit'
import { BHARATGEN, CLIP, COLUMNS, FOOTNOTE, GNANI, PHOTO, QUOTE, QUOTE_BOLD, QUOTE_LINE, SARVAM, WAVE_AGO, WAVE_NOW } from './data'
import './scene.css'

/** The deck outlines its pills flame, navy, blue, flame, navy, blue … through all 22. */
const TONES = ['flame', 'navy', 'azure'] as const

/** The pills, cut into the deck's four lines (6, 5, 5, 6). */
const PILL_LINES = (() => {
  const lines: { text: string; i: number }[][] = []
  let i = 0
  for (const n of BHARATGEN.pillRows) {
    lines.push(BHARATGEN.pills.slice(i, i + n).map((text, k) => ({ text, i: i + k })))
    i += n
  }
  return lines
})()

const Arrow = ({ tone }: { tone: (typeof TONES)[number] }) => (
  <svg className={`s23-arrow s23-arrow--${tone}`} viewBox="0 0 30 8" aria-hidden="true">
    <path className="s23-arrow-line" d="M1 4H25.5" />
    <path className="s23-arrow-head" d="M22.6 1.2 28.6 4l-6 2.8Z" />
  </svg>
)

const scene: SceneModule = {
  beats: ['ago', 'today', 'chorus'],
  preload: [pic(23, PHOTO.name)],

  Scene: ({ slide }) => (
    <div className="s23">
      <Headline text={slide.title} flame={['grew up and found their voice']} />

      <Kicker className="s23-head s23-head--ago">{COLUMNS[0]}</Kicker>
      <Kicker className="s23-head s23-head--now" tone="flame">
        {COLUMNS[1]}
      </Kicker>

      {/* ------------------------------------------------ Sarvam: a circle that grows, to scale */}
      <section className="s23-row s23-row--a">
        <div className="s23-lab">
          <h2 className="s23-name s23-name--flame">{SARVAM.name}</h2>
          <p className="s23-line">
            <Words text={SARVAM.line} />
          </p>
        </div>
        <span className="s23-small">
          {SARVAM.before.value}
          {SARVAM.before.suffix}
        </span>
        <p className="s23-cap s23-cap--a">{SARVAM.before.caption}</p>
        <Arrow tone="flame" />
        {/* the place "today" will fill: an empty outline until the circle has grown into it */}
        <span className="s23-slot s23-slot--a" aria-hidden="true" />
        <span className="s23-ring" aria-hidden="true" />
        <span className="s23-big">
          <Count from={SARVAM.before.value} to={SARVAM.after.value} suffix={SARVAM.after.suffix} />
        </span>
        <b className="s23-x">
          <span className="s23-x-in">
            {SARVAM.stat.to}
            {SARVAM.stat.suffix}
          </span>
        </b>
        <p className="s23-stat s23-stat--a">
          <Words text={SARVAM.statLine} bold={[...SARVAM.statBold]} />
        </p>
      </section>
      <span className="s23-rule s23-rule--1" aria-hidden="true" />

      {/* ------------------------------------------------ BharatGen: two languages become 22 */}
      <section className="s23-row s23-row--b">
        <div className="s23-lab">
          <h2 className="s23-name">{BHARATGEN.name}</h2>
          <p className="s23-line">
            <Words text={BHARATGEN.line} />
          </p>
        </div>
        <div className="s23-two">
          {BHARATGEN.before.pills.map((p) => (
            <span className="s23-old" key={p}>
              {p}
            </span>
          ))}
        </div>
        <p className="s23-cap s23-cap--b">{BHARATGEN.before.caption}</p>
        <Arrow tone="navy" />
        {/* 22 empty places, each the width of the name that will land in it */}
        <div className="s23-cloud s23-cloud--slots" aria-hidden="true">
          {PILL_LINES.map((line, r) => (
            <div className="s23-cloud-line" key={r}>
              {line.map((p) => (
                <span className="s23-pill s23-pill--slot" key={p.i}>
                  <span className="s23-pill-text">{p.text}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="s23-cloud s23-cloud--real">
          {PILL_LINES.map((line, r) => (
            <div className="s23-cloud-line" key={r}>
              {line.map((p) => (
                <span className={`s23-pill s23-pill--${TONES[p.i % 3]}`} key={p.i}>
                  <span className="s23-pill-lit" aria-hidden="true" />
                  <span className="s23-pill-text">{p.text}</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="s23-stat s23-stat--b">
          <Words text={BHARATGEN.caption} bold={[...BHARATGEN.captionBold]} />
        </p>
      </section>
      <span className="s23-rule s23-rule--2" aria-hidden="true" />

      {/* ------------------------------------------------ Gnani.ai: a faint wave finds its voice */}
      <section className="s23-row s23-row--c">
        <div className="s23-lab">
          <h2 className="s23-name s23-name--azure">{GNANI.name}</h2>
          <p className="s23-line">
            <Words text={GNANI.line} />
          </p>
        </div>
        <div className="s23-wave s23-wave--ago" aria-hidden="true">
          {WAVE_AGO.map((h, i) => (
            <i key={i} style={{ height: `${h * 100}%` }} />
          ))}
        </div>
        <p className="s23-cap s23-cap--c">{GNANI.before.caption}</p>
        <Arrow tone="azure" />
        <span className="s23-slot s23-slot--c" aria-hidden="true" />
        <div className="s23-wave s23-wave--now" aria-hidden="true">
          {WAVE_NOW.map((h, i) => (
            <span className="s23-bar" key={i} style={{ height: `${h * 100}%` }}>
              <i style={{ '--s23-d': `${-((i * 0.37) % 1.9).toFixed(2)}s`, '--s23-t': `${(1.5 + ((i * 7) % 5) * 0.16).toFixed(2)}s` } as CSSProperties} />
            </span>
          ))}
        </div>
        <b className="s23-mil">{GNANI.stat}</b>
        <p className="s23-stat s23-stat--c">
          <Words text={GNANI.statLine} bold={[...GNANI.statBold]} />
        </p>
      </section>

      {/* ------------------------------------------------ the chorus */}
      <div className="s23-photo">
        <Pic n={23} name={PHOTO.name} ratio={`${PHOTO.px[0]} / ${PHOTO.px[1]}`} fit="contain" alt="People in the dress of many regions of India, singing together" />
      </div>
      <p className="s23-quote" lang="hi">
        {QUOTE}
      </p>
      <p className="s23-para">
        <Words text={QUOTE_LINE} bold={QUOTE_BOLD} />
      </p>
      <Clipping className="s23-clip" date={CLIP.date} tape="flame" source={CLIP.source} tilt={-1.6} width={22.6}>
        {CLIP.headline}
      </Clipping>

      <p className="s23-src">{FOOTNOTE}</p>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const q = <E extends Element = HTMLElement>(sel: string) => ctx.$$<E>(sel)

    /* ---- measure first: where things stand, before anything is moved or hidden ---- */
    const small = ctx.loc(ctx.$('.s23-small'))
    const big = ctx.loc(ctx.$('.s23-big'))
    const pills = q('.s23-cloud--real .s23-pill')
    const pillAt = pills.map((p) => ctx.loc(p))
    const tip = ctx.loc(ctx.$('.s23-row--b .s23-arrow'))

    /* ================================================================ ago */
    a.words('.kn-h', 0.1)
    a.fade('.s23-head--ago', 0.55)
    a.rule('.s23-rule', 0.6, { duration: 1.0, stagger: 0.14 })
    // the three labs, top to bottom: a name, what happened to its model
    ;['a', 'b', 'c'].forEach((r, i) => {
      const at = 0.6 + i * 0.16
      a.rise(`.s23-row--${r} .s23-name`, at, { y: 1.2 })
      a.words(`.s23-row--${r} .s23-line`, at + 0.12, { stagger: 0.03 })
    })
    // … and what each was a year ago: small, few, faint
    a.pop('.s23-small', 0.95)
    a.pop('.s23-old', 1.1, { stagger: 0.1 })
    const agoBars = q('.s23-wave--ago i')
    gsap.set(agoBars, { scaleY: 0 })
    tl.to(agoBars, { scaleY: 1, duration: 0.6, stagger: 0.04, ease: ease.out }, 1.25)
    a.fade('.s23-cap', 1.2, { stagger: 0.12 })
    // the singers: the picture arrives on the right and settles
    a.rise('.s23-photo', 0.7, { y: 2, duration: 1.1 })
    const photo = ctx.$('.s23-photo .kn-pic img')
    if (!reduced) {
      gsap.set(photo, { scale: 1.07 })
      tl.to(photo, { scale: 1, duration: 2.0, ease: 'power2.out' }, 0.7)
    }
    a.fade('.s23-src', 1.5)
    // what today will fill: empty places, and a pale TODAY over them. The frame says "about to grow"
    const now = ctx.$('.s23-head--now')
    gsap.set(now, { autoAlpha: 0 })
    tl.to(now, { autoAlpha: 0.4, duration: 0.6, ease: 'power1.out' }, 1.3)
    const slots = q('.s23-slot, .s23-pill--slot')
    gsap.set(slots, { autoAlpha: 0 })
    tl.to(slots, { autoAlpha: 1, duration: 0.7, stagger: 0.02, ease: 'power1.out' }, 1.3)
    tl.to(fx, { glow: 0.22, focusX: -0.35, focusY: 0.1, duration: 1.6 }, 0.4)
    tl.addLabel('ago', 2.1)

    /* ============================================================== today */
    const T0 = 2.1
    tl.to(now, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, T0)

    // SARVAM: a flame circle leaves the grey one, travels the arrow and swells, to scale
    a.draw('.s23-row--a .s23-arrow-line', T0 + 0.05, { duration: 0.5 })
    a.pop('.s23-row--a .s23-arrow-head', T0 + 0.4, { duration: 0.3 })
    const bigEl = ctx.$('.s23-big')
    const k = small.w / big.w
    gsap.set(bigEl, { autoAlpha: 0, x: reduced ? 0 : small.cx - big.cx, y: reduced ? 0 : small.cy - big.cy, scale: reduced ? 1 : k })
    tl.to(bigEl, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, T0 + 0.15)
    tl.to(bigEl, { x: 0, y: 0, duration: 1.0, ease: ease.inOut }, T0 + 0.2)
    tl.to(bigEl, { scale: 1, duration: 1.15, ease: 'power3.inOut' }, T0 + 0.25)
    a.count('.s23-big .kn-count-n', T0 + 0.35, { duration: 1.05, ease: 'power2.inOut' })
    // it lands: one ring leaves it
    const ring = ctx.$('.s23-ring')
    gsap.set(ring, { autoAlpha: 0, scale: 0.92 })
    if (!reduced) {
      tl.to(ring, { autoAlpha: 0.55, duration: 0.12, ease: 'none' }, T0 + 1.3)
      tl.to(ring, { scale: 1.42, duration: 0.9, ease: 'power2.out' }, T0 + 1.3)
      tl.to(ring, { autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, T0 + 1.5)
    }
    tl.to(ctx.$('.s23-slot--a'), { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, T0 + 0.95)
    // "4x" arrives whole, as the circle lands: it never reads 1x, 2x, 3x
    const x = ctx.$('.s23-x-in')
    gsap.set(x, reduced ? { autoAlpha: 0 } : { yPercent: 110 })
    tl.to(x, reduced ? { autoAlpha: 1, duration: 0.4 } : { yPercent: 0, duration: 0.7, ease: ease.out }, T0 + 1.05)
    a.words('.s23-stat--a', T0 + 1.15, { stagger: 0.03 })
    tl.to(fx, { glow: 0.34, focusX: -0.05, focusY: -0.25, warm: 0.25, duration: 1.2, ease: ease.inOut }, T0)

    // BHARATGEN: the 22 names fly out of the arrow's tip, script by script, into their lines
    const T1 = T0 + 0.95
    a.draw('.s23-row--b .s23-arrow-line', T1, { duration: 0.5 })
    a.pop('.s23-row--b .s23-arrow-head', T1 + 0.35, { duration: 0.3 })
    pills.forEach((p, i) => {
      const at = T1 + 0.3 + i * 0.05
      const from = pillAt[i]
      const ox = tip.x + tip.w
      gsap.set(p, { autoAlpha: 0, x: reduced ? 0 : (ox - from.cx) * 0.78, y: reduced ? 0 : (tip.cy - from.cy) * 0.78, scale: reduced ? 1 : 0.35 })
      tl.to(p, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, at)
      tl.to(p, { x: 0, y: 0, duration: 0.8, ease: ease.out }, at)
      tl.to(p, { scale: 1, duration: 0.7, ease: ease.snap }, at + 0.05)
    })
    // each empty place goes as its name lands in it
    q('.s23-pill--slot').forEach((slot, i) => tl.to(slot, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, T1 + 0.7 + i * 0.05))
    a.words('.s23-stat--b', T1 + 1.5, { stagger: 0.03 })
    tl.to(fx, { focusY: 0.2, warm: 0, duration: 1.1, ease: ease.inOut }, T1 + 0.2)

    // GNANI: the wave opens from its middle into 22 bars, and they keep moving
    const T2 = T1 + 1.3
    a.draw('.s23-row--c .s23-arrow-line', T2, { duration: 0.5 })
    a.pop('.s23-row--c .s23-arrow-head', T2 + 0.35, { duration: 0.3 })
    const bars = q('.s23-bar')
    const mid = (bars.length - 1) / 2
    gsap.set(bars, { scaleY: 0, autoAlpha: 0 })
    bars.forEach((b, i) => {
      const at = T2 + 0.35 + Math.abs(i - mid) * 0.035
      tl.to(b, { autoAlpha: 1, duration: 0.1, ease: 'none' }, at)
      tl.to(b, { scaleY: 1, duration: 0.75, ease: ease.snap }, at)
    })
    tl.to(ctx.$('.s23-slot--c'), { autoAlpha: 0, duration: 0.35, ease: 'power1.in' }, T2 + 0.35)
    // "1 million+" arrives whole, as the wave opens: the deck's words, never a fraction on the way
    a.rise('.s23-mil', T2 + 0.5, { y: 1.4, duration: 0.8 })
    a.words('.s23-stat--c', T2 + 0.95, { stagger: 0.03 })
    tl.to(fx, { focusY: 0.55, warm: -0.25, duration: 1.1, ease: ease.inOut }, T2)
    tl.addLabel('today', T2 + 1.75)

    /* ============================================================= chorus */
    const T3 = T2 + 1.75
    a.rise('.s23-quote', T3 + 0.05, { y: 1.4, duration: 0.9 })
    a.words('.s23-para', T3 + 0.45, { stagger: 0.03 })
    tl.to(fx, { glow: 0.42, focusX: 0.55, focusY: 0.05, warm: 0.45, duration: 1.4, ease: ease.inOut }, T3)
    // the wave of sound: every name lights in turn, lifts a little, and stays lit
    const lit = q('.s23-pill-lit')
    gsap.set(lit, { autoAlpha: 0 })
    pills.forEach((p, i) => {
      const at = T3 + 0.25 + i * 0.055
      tl.to(lit[i], { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, at)
      if (!reduced) {
        tl.to(p, { y: -0.34 * U, duration: 0.2, ease: 'power2.out' }, at)
        tl.to(p, { y: 0, duration: 0.45, ease: 'power2.inOut' }, at + 0.2)
      }
    })
    // … and it runs on through the waveform
    if (!reduced) {
      bars.forEach((b, i) => {
        const at = T3 + 0.9 + i * 0.03
        tl.to(b, { scaleY: 1.22, duration: 0.2, ease: 'power2.out' }, at)
        tl.to(b, { scaleY: 1, duration: 0.5, ease: 'power2.inOut' }, at + 0.2)
      })
    }
    // the clipping, last, with a little weight
    const clip = ctx.$('.s23-clip')
    gsap.set(clip, { autoAlpha: 0, y: reduced ? 0 : -3.2 * U, rotation: reduced ? 0 : -2.2, transformOrigin: '50% 0%' })
    tl.to(clip, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, T3 + 1.25)
    tl.to(clip, { y: 0, duration: 0.55, ease: 'power2.in' }, T3 + 1.25)
    tl.to(clip, { rotation: 0.9, duration: 0.16, ease: 'power1.out' }, T3 + 1.8)
    tl.to(clip, { rotation: 0, duration: 0.5, ease: 'power2.inOut' }, T3 + 1.96)
    tl.addLabel('chorus', T3 + 2.5)
    return tl
  },
}

export default scene
