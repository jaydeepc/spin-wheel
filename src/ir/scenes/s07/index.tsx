'use client'

/**
 * /ir slides 07 and 08 · THE CLOSE: "Thank You!" and "Q&A". Dark. ONE scene that spans both
 * slides (scenes/s08/index.tsx re-exports this one), because the two are one ground: the same
 * circuit lines, in the same places, never leave the stage at the change of slide.
 *
 *   thanks    (7) the circuit draws itself in from the edges of the stage, its dots light as the
 *                 drawing reaches them, a first pulse of light runs down every line; "Thank You!"
 *                 rises with weight, a line of first light under it
 *   contacts  (7) "Thank You!" lifts and makes room: "For Investors:", the address, the two names
 *   qa        (8) the words of slide 7 leave, the lines stay; a surge of light runs through them
 *                 and "Q&A" arrives large. The last rest of the session: after it only slow pulses
 *                 travel the lines and the light behind the letters breathes.
 *
 * The lines are SVG (circuit.tsx). What the timeline moves: the drawing, the pulses it sends
 * (stroke-dashoffset on paths of pathLength 100), the dots. What idles is CSS only (scene.css),
 * switched off by `ir07--still` when the frame is held or the visitor asked for less motion.
 */

import gsap from 'gsap'
import { anim, slide as slideOf, spanBeats, Words, type SceneModule } from '../../kit'
import { Circuit, PARK, TRACES, offsets } from './circuit'
import { FOR, MAIL, PEOPLE } from './data'
import './scene.css'

const SLIDES = { 7: ['thanks', 'contacts'], 8: ['qa'] }

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),
  chrome: { crumb: false },

  Scene: ({ slide }) => (
    <div className="ir07">
      <span className="ir07-glow" aria-hidden="true">
        <i />
      </span>
      <Circuit />

      {/* slide 7 */}
      <div className="ir07-hero">
        <h1 className="ir07-thanks">
          <Words text={slide.title} />
        </h1>
        <span className="ir07-dawn" aria-hidden="true" />
      </div>
      <div className="ir07-contact">
        <p className="ir07-for">{FOR}</p>
        <p className="ir07-mail">{MAIL}</p>
        <span className="ir07-sep" aria-hidden="true" />
        {PEOPLE.map((p, i) => (
          <div key={p.name} className={`ir07-person ir07-person--${i}`}>
            <b>{p.name}</b>
            <span>{p.role}</span>
          </div>
        ))}
      </div>

      {/* slide 8 */}
      <div className="ir07-qa">
        <h1 className="ir07-qa-word" aria-label={slideOf(8).title}>
          {[...slideOf(8).title].map((ch, i) => (
            <span key={i} className="ir07-qa-mask" aria-hidden="true">
              <span className={`ir07-qa-l${ch === '&' ? ' ir07-qa-l--amp' : ''}`}>{ch}</span>
            </span>
          ))}
        </h1>
        <span className="ir07-qa-rule" aria-hidden="true" />
      </div>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx

    // what idles is CSS: not while a frame is held, not for a visitor who asked for less motion
    ctx.$('.ir07').classList.toggle('ir07--still', ctx.held || reduced)

    const lines = ctx.$$('.ir07-line')
    const pulsesOf = (i: number) => ctx.$$(`.ir07-p${i}`)
    const dotsOf = (i: number) =>
      ctx.$$(`.ir07-d${i}`).map((g) => ({
        f: Number((g as HTMLElement | SVGElement).dataset.f),
        base: g.querySelector('.ir07-dot-base') as Element,
        lit: g.querySelector('.ir07-lit') as Element,
      }))

    /** A dot flares as light reaches it, and settles. */
    const flare = (lit: Element, at: number, hold = 0.6) => {
      tl.fromTo(lit, { opacity: 0 }, { opacity: 1, duration: 0.14, ease: 'power1.out', immediateRender: false }, Math.max(0, at - 0.07))
      tl.to(lit, { opacity: 0, duration: hold, ease: 'power2.out' }, at + 0.07)
    }
    /**
     * One pulse of light along trace i: its head is at the edge of the stage at `at`, and it takes
     * `duration` to cross what of the trace is on the stage (it then runs on, off the stage, to be
     * parked beyond the trace's end). Its dots flare as it passes.
     */
    const pulse = (i: number, at: number, duration: number) => {
      if (reduced) return
      const els = pulsesOf(i)
      if (!els.length) return
      const o = offsets(TRACES[i], TRACES[i].pl)
      const per = duration / (o.enter - o.gone) // seconds per hundredth of the trace
      tl.fromTo(els, { strokeDashoffset: o.enter }, { strokeDashoffset: o.gone, duration, ease: 'none', immediateRender: false }, at)
      // what is left of the trace lies off the stage (seen only on a screen that is not 16:9): quickly
      tl.to(els, { strokeDashoffset: PARK, duration: 0.2, ease: 'none' }, at + duration)
      dotsOf(i).forEach((d) => flare(d.lit, at + per * (o.enter - o.over(d.f))))
    }

    // ---------------------------------------------------------------- thanks (slide 7)
    // THE ROOM: from further back and darker, to the close's own look
    gsap.set(fx, { travel: reduced ? 0 : -46, wave: -0.5, glow: -0.35, energy: -0.3 })
    tl.to(fx, { travel: 0, duration: 3, ease: 'power3.out' }, 0)
    tl.to(fx, { wave: 0.1, glow: 0.05, energy: 0.1, duration: 2.4, ease: 'power2.out' }, 0.2)

    // THE CIRCUIT draws itself in from the edges; each dot lights as the drawing reaches it
    gsap.set(ctx.$$('.ir07-pulse'), { strokeDashoffset: PARK })
    gsap.set(ctx.$$('.ir07-lit'), { opacity: 0 })
    const drawEase = gsap.parseEase('power2.out')
    /** the time (0 … 1) at which the drawing has reached the fraction f of its trace */
    const reach = (f: number) => {
      let lo = 0
      let hi = 1
      for (let k = 0; k < 22; k++) {
        const mid = (lo + hi) / 2
        if (drawEase(mid) < f) lo = mid
        else hi = mid
      }
      return hi
    }
    TRACES.forEach((t, i) => {
      const line = lines[i]
      const t0 = i * 0.07
      // what is drawn is the part ON the stage (f0 to f1): the line is already at the stage's edge
      // when the move begins, so flame enters the frame at once
      const dur = 1.25 + (t.length * (t.f1 - t.f0)) / 70
      const dots = dotsOf(i)
      if (reduced) {
        gsap.set([line, ...dots.map((d) => d.base)], { autoAlpha: 0 })
        tl.to([line, ...dots.map((d) => d.base)], { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, 0.2)
        return
      }
      gsap.set(line, { drawSVG: `0% ${(t.f0 * 100).toFixed(3)}%`, autoAlpha: 0 })
      tl.to(line, { autoAlpha: 1, duration: 0.12, ease: 'none' }, t0)
      tl.to(line, { drawSVG: `0% ${(t.f1 * 100).toFixed(3)}%`, duration: dur, ease: 'power2.out' }, t0)
      // a trace that leaves the stage again runs on to the window's edge
      if (t.f1 < 1) tl.to(line, { drawSVG: '0% 100%', duration: 0.5, ease: 'none' }, t0 + dur)
      dots.forEach((d) => {
        const at = t0 + dur * reach((d.f - t.f0) / (t.f1 - t.f0))
        gsap.set(d.base, { scale: 0, autoAlpha: 0, transformOrigin: '50% 50%' })
        tl.to(d.base, { scale: 1, autoAlpha: 1, duration: 0.55, ease: 'back.out(2.6)' }, at - 0.05)
        flare(d.lit, at + 0.05, 0.7)
      })
    })

    // "Thank You!" rises with weight: the block comes forward and settles while the words come up
    const hero = ctx.$('.ir07-hero')
    gsap.set(hero, { transformOrigin: '50% 0%' })
    if (!reduced) {
      gsap.set(hero, { scale: 1.07 })
      tl.to(hero, { scale: 1, duration: 2.3, ease: 'power3.out' }, 0.35)
    }
    a.words('.ir07-thanks', 0.45, { stagger: 0.18, duration: 1.05 })
    a.rule('.ir07-dawn', 1.25, { from: 'center', duration: 1.2 })
    const glow = ctx.$('.ir07-glow')
    gsap.set(glow, { autoAlpha: 0, scale: 0.7 })
    tl.to(glow, { autoAlpha: 0.55, scale: 0.85, duration: 2, ease: 'power2.out' }, 1.1)

    // a first pulse of light down every line, one after another
    TRACES.forEach((t, i) => pulse(i, 2.0 + i * 0.08, 0.75 + (t.length * (t.f1 - t.f0)) / 70))

    // from here on the lines idle (CSS), softly
    const idle = ctx.$$('.ir07-idle')
    gsap.set(idle, { autoAlpha: 0 })
    tl.to(idle, { autoAlpha: 1, duration: 0.8, ease: 'power1.inOut' }, 3.0)
    tl.addLabel('thanks')

    // ---------------------------------------------------------------- contacts (slide 7)
    const C = tl.duration()
    if (reduced) tl.to(hero, { y: -9.4 * U, scale: 0.66, duration: 0.01 }, C)
    else tl.to(hero, { y: -9.4 * U, scale: 0.66, duration: 0.95, ease: ease.inOut }, C)
    a.rise('.ir07-for', C + 0.45, { y: 1.2 })
    a.rise('.ir07-mail', C + 0.6, { y: 1.4 })
    a.rule('.ir07-sep', C + 0.95, { from: 'center', duration: 0.7 })
    a.rise('.ir07-person--0', C + 1.0, { x: 1.4, y: 0 })
    a.rise('.ir07-person--1', C + 1.1, { x: -1.4, y: 0 })
    pulse(1, C + 0.2, 1.3)
    pulse(4, C + 0.35, 1.4)
    pulse(2, C + 0.6, 1.3)
    tl.addLabel('contacts')

    // ---------------------------------------------------------------- qa (slide 8)
    const Q = tl.duration()
    // the words of slide 7 leave; the lines stay where they are
    tl.to(hero, { autoAlpha: 0, y: (reduced ? -9.4 : -11) * U, duration: 0.45, ease: 'power2.in' }, Q)
    a.leave('.ir07-contact', Q + 0.05, { y: 1.4, duration: 0.45 })

    // a surge of light through every line, then a slower second wave
    TRACES.forEach((t, i) => pulse(i, Q + 0.15 + (i % 4) * 0.07, 0.65 + (t.length * (t.f1 - t.f0)) / 80))
    TRACES.forEach((t, i) => pulse(i, Q + 1.6 + (i % 4) * 0.12, 1.0 + (t.length * (t.f1 - t.f0)) / 65))

    // "Q&A", large: its letters rise through their masks while the word comes forward and settles
    const word = ctx.$('.ir07-qa-word')
    const letters = ctx.$$('.ir07-qa-l')
    if (reduced) {
      gsap.set(letters, { autoAlpha: 0 })
      tl.to(letters, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, Q + 0.5)
    } else {
      gsap.set(letters, { yPercent: 112 })
      gsap.set(word, { scale: 1.12, transformOrigin: '50% 55%' })
      tl.to(letters, { yPercent: 0, duration: 1.15, stagger: 0.14, ease: ease.out }, Q + 0.5)
      tl.to(word, { scale: 1, duration: 2.6, ease: 'power3.out' }, Q + 0.5)
    }
    a.rule('.ir07-qa-rule', Q + 1.35, { from: 'center', duration: 1.3 })
    // the light behind the letters opens; the room moves forward a little and comes to rest
    tl.to(glow, { autoAlpha: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, Q + 0.4)
    if (!reduced) tl.to(fx, { travel: 26, duration: 3, ease: 'power3.out' }, Q + 0.1)
    tl.to(fx, { glow: 0.22, wave: 0.25, duration: 2.4, ease: 'power2.out' }, Q + 0.3)
    tl.addLabel('qa')

    // Back runs the timeline fast in reverse: every pulse and flare would flash at once. While the
    // playhead moves backwards they are not shown (scene.css, ir07--back).
    const root = ctx.$('.ir07')
    let seen = 0
    tl.to({ v: 0 }, {
      v: 1,
      duration: tl.duration(),
      ease: 'none',
      onUpdate: () => {
        const now = tl.time()
        if (now !== seen) root.classList.toggle('ir07--back', now < seen)
        seen = now
      },
    }, 0)
    return tl
  },
}

export default scene
