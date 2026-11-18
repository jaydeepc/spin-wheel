'use client'

/**
 * Slide 44 · "PIA is doing 100cr+ cross-sell, Humans steps in when needed"   (the deck's wording)
 *
 * A CALL IN PROGRESS. The deck's five-step line is walked one step a beat; under it PIA's flame
 * bar runs along with the journey, a live waveform at its head (the voice never leaves; there is
 * no sound, so the waveform is the voice). At the drop-off the navy human bar steps in beneath
 * it and the three circles close on "Context Shared". At payout the dashed ring fills.
 *
 *   call       step 1, and what PIA does on the call (pitches, switches language, captures interest)
 *   link       step 2, and the four states of a query being resolved
 *   human      step 3: the human bar steps in; PIA, customer and offer close on one shared context
 *   customise  step 4: the sliders move; PIA's bar reaches the end of the journey
 *   payout     step 5: the ring fills, the voice carries on to disbursal
 *   takeaways  the two conclusions
 *
 * No canvas: lines, discs and bars are DOM and SVG. The deck's twelve icons are 18 to 48 px
 * pictures; they are redrawn as vector in icons.tsx.
 */

import gsap from 'gsap'
import type { ReactNode } from 'react'
import { anim, Headline, Words, type SceneModule } from '../../kit'
import * as D from './data'
import { ChatLink, Check, Headset, Languages, Pause, PersonIcon, PhoneCall, Rupee, Sliders, Tag, Thumb } from './icons'
import './scene.css'

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`

const ICONS: ReactNode[] = [<PhoneCall key="a" />, <ChatLink key="b" />, <Headset key="c" />, <Sliders key="d" />, <Rupee key="e" />]
const DO_ICONS: ReactNode[] = [<Tag key="a" />, <Languages key="b" />, <Thumb key="c" />]

/** PIA's bar: from the left edge of the content to the end of step 4; the human bar: from the drop-off on. */
const PIA = { x0: 4.2, x1: 77.6 }
const HUM = { x0: D.SEP[1], x1: 77.6 }
/** How far PIA's bar has come at the rest of each step: its tip a little past the place between two steps. */
const TIP = [D.SEP[0] + 1, D.SEP[1] + 1, D.SEP[2] + 1, PIA.x1, PIA.x1]

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9.5 5 6 7-6 7" />
  </svg>
)

/** The live voice: a few bars that breathe (CSS; `still=1` stops them). */
const Voice = () => (
  <span className="s44-voice" aria-hidden="true">
    {[0.45, 0.8, 0.55, 1, 0.65, 0.9, 0.5, 0.75, 0.4].map((h, i) => (
      <i key={i} style={{ height: `${h * 100}%`, animationDelay: `${-((i * 0.29) % 1.4).toFixed(2)}s` }} />
    ))}
  </span>
)

const scene: SceneModule = {
  beats: ['call', 'link', 'human', 'customise', 'payout', 'takeaways'],

  Scene: ({ slide }) => (
    <div className="s44">
      <Headline text={slide.title} />

      {/* the journey's line */}
      <div className="s44-line" style={{ left: u(D.X[0]), width: u(D.X[4] - D.X[0]) }} aria-hidden="true">
        <span className="s44-line-base" />
        <span className="s44-line-fill" />
      </div>
      {D.SEP.map((x, i) => (
        <span className="s44-sep" key={i} style={{ left: u(x) }} aria-hidden="true">
          <Chevron />
        </span>
      ))}
      {D.SEP.slice(0, 3).map((x, i) => (
        <span className={`s44-drop s44-drop--${i}`} key={i} style={{ left: u(x) }} aria-hidden="true" />
      ))}

      {D.STEPS.map((s, i) => (
        <div className={`s44-step s44-step--${s.key}`} key={s.key} style={{ left: u(D.X[i]) }}>
          <span className="s44-stop" aria-hidden="true" />
          {i < 4 ? (
            <span className="s44-disc">{ICONS[i]}</span>
          ) : (
            <span className="s44-ringbox">
              <span className="s44-ring-fill" />
              <svg className="s44-ring-svg" viewBox="0 0 60 60" aria-hidden="true">
                <circle cx="30" cy="30" r="27.500" fill="none" stroke="#f2b600" strokeWidth="2" strokeDasharray="7 4.520" strokeLinecap="round" />
              </svg>
              <span className="s44-ring-icon">{ICONS[4]}</span>
            </span>
          )}
          {s.label ? <span className="s44-label">{s.label}</span> : null}
          <h3 className="s44-title">
            {s.lines.map((l) => (
              <span className="s44-tl" key={l}>
                <Words text={l} flame={s.flame ? [s.flame] : []} />
              </span>
            ))}
          </h3>
          <p className="s44-body">
            {s.body[0]}
            <br />
            {s.body[1]}
          </p>
        </div>
      ))}

      {/* what hangs between the steps */}
      <div className="s44-under s44-does" style={{ left: u(D.SEP[0]) }}>
        {D.DOES.map((d, i) => (
          <span className="s44-do" key={d[0]}>
            <span className="s44-do-ring">{DO_ICONS[i]}</span>
            <em>
              {d[0]}
              <br />
              {d[1]}
            </em>
          </span>
        ))}
      </div>

      <div className="s44-under s44-managed" style={{ left: u(D.SEP[1]) }}>
        <span className="s44-states">
          <span className="s44-st s44-st--grey">
            <PersonIcon />
          </span>
          <span className="s44-st s44-st--yellow">
            <Pause />
          </span>
          <span className="s44-st s44-st--navy">
            <Headset />
          </span>
          <span className="s44-st s44-st--green">
            <Check />
          </span>
        </span>
        <em className="s44-cap">
          {D.MANAGED[0]}
          <br />
          {D.MANAGED[1]}
        </em>
      </div>

      <div className="s44-under s44-shared" style={{ left: u(D.SEP[2]) }}>
        <span className="s44-venn">
          <span className="s44-vc s44-vc--pia">
            <b>{D.VENN[0]}</b>
          </span>
          <span className="s44-vc s44-vc--customer">
            <b>{D.VENN[1]}</b>
          </span>
          <span className="s44-vc s44-vc--offer">
            <b>{D.VENN[2]}</b>
          </span>
          <span className="s44-vdot" />
        </span>
        <em className="s44-cap">{D.SHARED}</em>
      </div>

      {/* PIA, all the way through */}
      <div className="s44-bar s44-bar--pia" style={{ left: u(PIA.x0), width: u(PIA.x1 - PIA.x0) }}>
        <span className="s44-bar-fill">
          <Voice />
        </span>
        <span className="s44-bar-text">
          <b className="s44-pia-a">{D.BAR_PIA.slice(0, D.BAR_PIA.indexOf(','))}</b>
          <b className="s44-pia-b">{D.BAR_PIA.slice(D.BAR_PIA.indexOf(','))}</b>
        </span>
      </div>
      <span className="s44-onward" style={{ left: u(PIA.x1 + 0.7), width: u(92.6 - PIA.x1 - 0.7) }} aria-hidden="true">
        <i />
        <svg viewBox="0 0 12 14">
          <path d="M0 0l12 7-12 7z" fill="currentColor" />
        </svg>
      </span>

      {/* the human, from the drop-off on */}
      <div className="s44-bar s44-bar--human" style={{ left: u(HUM.x0), width: u(HUM.x1 - HUM.x0) }}>
        <span className="s44-bar-fill" />
        <span className="s44-bar-text">
          <b className="s44-human-t">{D.BAR_HUMAN}</b>
        </span>
      </div>

      <div className="s44-takes">
        {D.TAKEAWAYS.map((t) => (
          <p className="s44-take" key={t.n}>
            <b className="s44-take-n">{t.n}</b>
            <span className="s44-take-t">
              <Words text={t.text} flame={[t.flame]} />
            </span>
          </p>
        ))}
      </div>
    </div>
  ),

  build(ctx) {
    const { ease, U } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const calm = ctx.reduced
    const $ = ctx.$
    const $$ = ctx.$$
    const steps = $$('.s44-step')
    const q = (root: Element, sel: string) => Array.from(root.querySelectorAll<HTMLElement>(sel))
    const seps = $$('.s44-sep')
    const drops = $$('.s44-drop')
    const lineFill = $('.s44-line-fill')
    const piaFill = $('.s44-bar--pia .s44-bar-fill')
    const humFill = $('.s44-bar--human .s44-bar-fill')
    const piaW = (PIA.x1 - PIA.x0) * U
    const span = D.X[4] - D.X[0]
    const lineTo = (x: number) => (x - D.X[0]) / span
    const piaAt = (x: number) => -(PIA.x1 - x) * U

    /* starting states */
    gsap.set(lineFill, { scaleX: 0, transformOrigin: '0% 50%' })
    gsap.set(piaFill, { x: -piaW })
    gsap.set(humFill, { x: -(HUM.x1 - HUM.x0) * U })
    gsap.set($$('.s44-disc, .s44-ringbox, .s44-label, .s44-body, .s44-sep'), { autoAlpha: 0 })
    gsap.set($$('.s44-disc .s44-ink, .s44-ring-icon .s44-ink'), { drawSVG: '0%', autoAlpha: 0 })
    gsap.set($$('.s44-knob'), { autoAlpha: 0 })
    gsap.set($$('.s44-title .kn-wi'), { yPercent: 118 })
    gsap.set($$('.s44-pia-a, .s44-pia-b, .s44-human-t, .s44-voice'), { autoAlpha: 0 })
    gsap.set(drops, { scaleY: 0, transformOrigin: '50% 0%' })

    /* the headline, the line and its five stops */
    a.words('.kn-h', 0.1)
    a.rule('.s44-line-base', 0.2, { duration: 1.1 })
    a.pop('.s44-stop', 0.4, { stagger: 0.1 })

    /** Step i lands at time t: the line arrives, the stop opens into its disc, its words come up, PIA's bar runs on. */
    const land = (i: number, t: number) => {
      const s = steps[i]
      if (i > 0) tl.to(lineFill, { scaleX: lineTo(D.X[i]), duration: 0.4, ease: 'power1.out' }, t)
      tl.to(fx, { focusX: (D.X[i] / 100) * 2 - 1, focusY: -0.3, glow: 0.36, warm: i === 2 ? -0.25 : 0.2, duration: 1.2, ease: ease.inOut }, t)
      const disc = q(s, i < 4 ? '.s44-disc' : '.s44-ringbox')
      gsap.set(disc, { scale: calm ? 1 : 0.4 })
      tl.to(q(s, '.s44-stop'), { scale: 0, autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, t + 0.25)
      tl.to(disc, { autoAlpha: 1, scale: 1, duration: 0.65, ease: ease.snap }, t + 0.3)
      const ink = q(s, '.s44-ink')
      if (ink.length) {
        tl.to(ink, { autoAlpha: 1, duration: 0.01, stagger: 0.08, ease: 'none' }, t + 0.5)
        tl.to(ink, { drawSVG: '100%', duration: 0.7, stagger: 0.08, ease: ease.glide }, t + 0.5)
      }
      if (s.querySelector('.s44-label')) tl.to(q(s, '.s44-label'), { autoAlpha: 1, duration: 0.4 }, t + 0.55)
      tl.to(q(s, '.s44-title .kn-wi'), { yPercent: 0, duration: ctx.T.word, stagger: 0.05, ease: ease.out }, t + 0.6)
      const body = q(s, '.s44-body')
      gsap.set(body, { y: calm ? 0 : 0.8 * U })
      tl.to(body, { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, t + 0.9)
      // the line runs on to the place between this step and the next
      if (i < 4) {
        tl.to(lineFill, { scaleX: lineTo(D.SEP[i]), duration: 0.8, ease: ease.glide }, t + 0.9)
        gsap.set(seps[i], { scale: 0.4 })
        tl.to(seps[i], { autoAlpha: 1, scale: 1, duration: 0.45, ease: ease.snap }, t + 1.5)
      }
      // and PIA is still on the call
      if (i < 4) tl.to(piaFill, { x: piaAt(TIP[i]), duration: i === 0 ? 1.3 : 1.2, ease: ease.inOut }, t + 0.6)
    }
    const hang = (i: number, t: number) => tl.to(drops[i], { scaleY: 1, duration: 0.6, ease: ease.glide }, t)

    /* ---------------------------------------------------------------- call */
    let t = 0.85
    land(0, t)
    tl.to($('.s44-voice'), { autoAlpha: 1, duration: 0.4 }, t + 1.2)
    tl.to($('.s44-pia-a'), { autoAlpha: 1, duration: 0.5 }, t + 1.3)
    hang(0, t + 1.6)
    const dos = $$('.s44-do')
    a.pop($$('.s44-do-ring'), t + 1.95, { stagger: 0.16, from: 0.4 })
    a.draw($$('.s44-do-ring .s44-ink'), t + 2.1, { stagger: 0.05, duration: 0.6 })
    a.fade(dos.map((d) => d.querySelector('em') as Element), t + 2.2, { stagger: 0.16 })
    tl.addLabel('call', t + 3.1)

    /* ---------------------------------------------------------------- link */
    t += 3.1
    land(1, t)
    a.wipe('.s44-pia-b', t + 0.75, { from: 'left', duration: 1.0, ease: ease.inOut })
    hang(1, t + 1.6)
    // a query on its way: the customer, a pause, an advisor, done
    a.pop('.s44-st', t + 1.95, { stagger: 0.22, from: 0.3 })
    a.fade('.s44-managed .s44-cap', t + 2.7)
    tl.addLabel('link', t + 3.3)

    /* ---------------------------------------------------------------- human */
    t += 3.3
    land(2, t)
    // the human steps in under the voice
    tl.to(humFill, { x: 0, duration: 1.1, ease: ease.inOut }, t + 0.9)
    tl.to($('.s44-human-t'), { autoAlpha: 1, duration: 0.5 }, t + 1.55)
    hang(2, t + 1.6)
    // three circles close on one shared context
    const vc = $$('.s44-vc')
    const apart = [
      { x: -2.6, y: -1.2 },
      { x: 2.6, y: -1.2 },
      { x: 0, y: 2.4 },
    ]
    vc.forEach((c, i) => {
      gsap.set(c, { autoAlpha: 0, x: calm ? 0 : apart[i].x * U, y: calm ? 0 : apart[i].y * U })
      tl.to(c, { autoAlpha: 1, duration: 0.4 }, t + 1.9 + i * 0.1)
      tl.to(c, { x: 0, y: 0, duration: 0.95, ease: ease.inOut }, t + 2.2)
    })
    a.pop('.s44-vdot', t + 3.0, { from: 0.2 })
    a.fade('.s44-shared .s44-cap', t + 3.05)
    tl.addLabel('human', t + 3.7)

    /* ---------------------------------------------------------------- customise */
    t += 3.7
    land(3, t)
    const knobs = $$('.s44-knob')
    tl.to(knobs, { autoAlpha: 1, duration: 0.3, stagger: 0.08 }, t + 0.9)
    if (!calm) {
      tl.to(knobs[0], { x: 5.5, duration: 0.8, ease: ease.inOut }, t + 1.1)
      tl.to(knobs[1], { x: -6, duration: 0.8, ease: ease.inOut }, t + 1.2)
      tl.to(knobs[2], { x: 7, duration: 0.8, ease: ease.inOut }, t + 1.3)
    }
    tl.addLabel('customise', t + 2.3)

    /* ---------------------------------------------------------------- payout */
    t += 2.3
    tl.to(lineFill, { scaleX: 1, duration: 0.45, ease: 'power1.out' }, t)
    const ringFill = $('.s44-ring-fill')
    const ringSvg = $('.s44-ring-svg')
    gsap.set(ringFill, { scale: 0, autoAlpha: 0 })
    gsap.set(ringSvg, { rotation: calm ? 0 : -120, transformOrigin: '50% 50%' })
    land(4, t + 0.05)
    tl.to(ringSvg, { rotation: 0, duration: 1.4, ease: ease.out }, t + 0.35)
    tl.to(ringFill, { autoAlpha: 1, scale: 1, duration: 0.9, ease: ease.out }, t + 1.0)
    // the voice carries on past the bar, all the way to disbursal
    a.wipe('.s44-onward', t + 1.1, { from: 'left', duration: 0.9, ease: ease.glide })
    tl.addLabel('payout', t + 2.4)

    /* ---------------------------------------------------------------- takeaways */
    t += 2.4
    tl.to(fx, { focusX: 0, focusY: 0.7, glow: 0.42, warm: 0.3, duration: 1.3, ease: ease.inOut }, t)
    const takes = $$('.s44-take')
    takes.forEach((p, i) => {
      a.pop(q(p, '.s44-take-n'), t + 0.1 + i * 0.5, { from: 0.4 })
      a.words(q(p, '.s44-take-t'), t + 0.2 + i * 0.5, { duration: 0.6, stagger: 0.035 })
    })
    tl.addLabel('takeaways', t + 1.9)
    return tl
  },
}

export default scene
