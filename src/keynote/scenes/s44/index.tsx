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
 *   listen     THE CALL ITSELF: the figures under the line and the two bars step back, and a call
 *              card arrives under step 1 ("AI makes the first call") with the recording of a real
 *              cross-sell call. It never starts by itself: the presenter clicks its button or
 *              presses P; the same pauses it. See player() below.
 *
 * No canvas: lines, discs and bars are DOM and SVG. The deck's twelve icons are 18 to 48 px
 * pictures; they are redrawn as vector in icons.tsx.
 */

import gsap from 'gsap'
import type { ReactNode } from 'react'
import { anim, Headline, Words, type SceneCtx, type SceneModule } from '../../kit'
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

/** How many level bars the call card shows (an even number: they mirror about the middle). */
const BARS = 48

const mmss = (sec: number) => {
  const s = Math.max(0, Math.floor(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/**
 * THE CALL'S PLAYER. The one place in this keynote where sound is allowed, by the owner's
 * decision ("embed the call; it should play on demand, and I should be able to pause it").
 *
 * Nothing here is on the GSAP timeline: like an idle motion, playback is a state of its own, so
 * every hold URL and every Back lands on the card AT REST. The timeline only brings the card in.
 *
 *   · it never starts by itself: only the card's button (a real click) or the key P start it,
 *     and only while the card's beat ("listen") of this slide is on screen; the same pauses it
 *   · at its end it returns to the start, ready to play again
 *   · it stops and rewinds the moment the slide or the beat changes (Next, Back, a jump), and
 *     again when the scene is undone (it left, or the stage was resized and it is rebuilt)
 *   · the director's keys are untouched: only the button's own click is kept from travelling on
 *
 * The level bars follow the sound through a Web Audio analyser (the file is same-origin). The
 * recording is only routed through the analyser once the audio context is known to be running,
 * so a context the browser will not start can never silence the call; until then, and wherever
 * there is no Web Audio, the bars move by themselves while it plays. They move ONLY while it plays.
 */
/** The beat before the player's: pressing Next from it starts the call. */
const PREV_BEAT = 'takeaways'

function player(ctx: SceneCtx, beat: string): () => void {
  const card = ctx.$('.s44-call')
  const btn = ctx.$<HTMLButtonElement>('.s44-play')
  const seek = ctx.$('.s44-seek')
  const fill = ctx.$('.s44-seek-fill')
  const knob = ctx.$('.s44-seek-knob')
  const now = ctx.$('.s44-time--now')
  const total = ctx.$('.s44-time--total')
  const bars = ctx.$$('.s44-lv i')
  const kn = ctx.root.closest<HTMLElement>('.kn-root')
  const slideId = kn?.dataset.slide ?? ''

  const audio = document.createElement('audio')
  audio.preload = 'auto'
  audio.src = D.CALL.src
  audio.className = 's44-audio'
  card.appendChild(audio)

  let dead = false
  let raf = 0
  let actx: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let bins: Uint8Array<ArrayBuffer> | null = null
  const level = bars.map(() => 0)

  const length = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : D.CALL.seconds)
  const onStage = () => !kn || (kn.dataset.slide === slideId && kn.dataset.beat === beat)

  /** The progress line, the knob and the clock: where the call is now. */
  const draw = () => {
    const f = Math.min(1, Math.max(0, audio.currentTime / length()))
    fill.style.transform = `scaleX(${f.toFixed(4)})`
    knob.style.transform = `translateX(${(f * seek.clientWidth).toFixed(1)}px)`
    now.textContent = mmss(audio.currentTime)
    seek.setAttribute('aria-valuenow', String(Math.floor(audio.currentTime)))
    total.textContent = mmss(Math.round(length()))
  }
  const rest = () => {
    level.fill(0)
    for (const b of bars) b.style.transform = ''
  }
  const frame = (ms: number) => {
    if (dead || audio.paused) return
    const half = bars.length / 2
    if (analyser && bins) analyser.getByteFrequencyData(bins)
    for (let i = 0; i < bars.length; i++) {
      const k = i < half ? half - 1 - i : i - half // 0 in the middle … half-1 at either end
      let v: number
      if (analyser && bins) {
        // the voice's band, about 90 Hz to 4 kHz, low in the middle
        const a = 2 + Math.floor((k / half) ** 1.5 * 88)
        const b = 2 + Math.floor(((k + 1) / half) ** 1.5 * 88)
        let m = 0
        for (let j = a; j <= b; j++) m = Math.max(m, bins[j])
        v = Math.min(1, (m / 255) ** 1.6 * (1 + k / half))
      } else {
        const t = ms / 1000
        v = (0.5 + 0.5 * Math.sin(t * (5.3 + (i % 7) * 0.9) + i * 1.7)) * (0.55 + 0.45 * Math.sin(t * 1.9 + i * 0.35)) * (1 - 0.6 * (k / half))
        v = Math.max(0, v)
      }
      level[i] += (v - level[i]) * (v > level[i] ? 0.55 : 0.18)
      bars[i].style.transform = `scaleY(${(0.07 + 0.93 * level[i]).toFixed(3)})`
    }
    draw()
    raf = requestAnimationFrame(frame)
  }

  /** Route the sound through an analyser, but only through a context that is really running. */
  const listen = () => {
    if (analyser) return
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    try {
      const c = actx ?? (actx = new AC())
      const wire = () => {
        if (dead || analyser || c.state !== 'running') return
        try {
          const an = c.createAnalyser()
          an.fftSize = 1024
          an.smoothingTimeConstant = 0.72
          const src = c.createMediaElementSource(audio)
          src.connect(an)
          an.connect(c.destination)
          bins = new Uint8Array(an.frequencyBinCount)
          analyser = an
        } catch {
          /* the bars move by themselves instead */
        }
      }
      if (c.state === 'running') wire()
      else c.resume().then(wire, () => {})
    } catch {
      /* no Web Audio: the call still plays */
    }
  }

  const sync = () => {
    const on = !audio.paused
    card.classList.toggle('is-playing', on)
    btn.setAttribute('aria-pressed', on ? 'true' : 'false')
    btn.setAttribute('aria-label', on ? 'Pause the call' : 'Play the call')
    cancelAnimationFrame(raf)
    if (on) raf = requestAnimationFrame(frame)
    else rest()
    draw()
  }
  const toggle = () => {
    if (dead || !onStage()) return
    if (audio.paused) {
      listen()
      if (actx && actx.state === 'suspended') actx.resume().catch(() => {})
      audio.play().catch(() => sync())
    } else audio.pause()
  }
  /** Stop and rewind: the card is at rest again. */
  const stop = () => {
    audio.pause()
    try {
      audio.currentTime = 0
    } catch {
      /* nothing loaded yet */
    }
    sync()
  }

  const onClick = (e: MouseEvent) => {
    e.stopPropagation() // the button's own click, and nothing else
    btn.blur() // the keyboard's Space and Enter stay "Next"
    toggle()
  }
  const onSeekClick = (e: MouseEvent) => {
    const r = seek.getBoundingClientRect()
    if (!r.width || !onStage()) return
    audio.currentTime = Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width)) * length()
    draw()
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey || e.repeat) return
    if (e.key !== 'p' && e.key !== 'P') return
    const a = document.activeElement
    if (a instanceof HTMLElement && a.matches('input, textarea, [contenteditable]')) return
    toggle()
  }
  const onEnded = () => stop()

  btn.addEventListener('click', onClick)
  seek.addEventListener('click', onSeekClick)
  window.addEventListener('keydown', onKey)
  for (const ev of ['play', 'pause'] as const) audio.addEventListener(ev, sync)
  audio.addEventListener('ended', onEnded)
  audio.addEventListener('loadedmetadata', draw)
  audio.addEventListener('seeked', draw)

  // the slide or the beat changed under it: no sound may follow the presenter anywhere else
  // ...and it STARTS by itself when the presenter presses Next onto this beat (owner, 18 Nov): only when
  // the beat is reached from the beat before it on this slide, never on a jump, a hold URL or Back from 45.
  let lastBeat = kn?.dataset.beat ?? ''
  let lastSlide = kn?.dataset.slide ?? ''
  const watch = kn
    ? new MutationObserver(() => {
        const b = kn.dataset.beat ?? ''
        const sl = kn.dataset.slide ?? ''
        const cameForward = sl === slideId && lastSlide === slideId && b === beat && lastBeat === PREV_BEAT
        lastBeat = b
        lastSlide = sl
        if (!onStage()) {
          if (!audio.paused || audio.currentTime > 0) stop()
        } else if (cameForward && audio.paused && !ctx.held) toggle()
      })
    : null
  if (kn && watch) watch.observe(kn, { attributes: true, attributeFilter: ['data-slide', 'data-beat'] })

  draw()

  return () => {
    stop()
    dead = true
    cancelAnimationFrame(raf)
    watch?.disconnect()
    btn.removeEventListener('click', onClick)
    seek.removeEventListener('click', onSeekClick)
    window.removeEventListener('keydown', onKey)
    for (const ev of ['play', 'pause'] as const) audio.removeEventListener(ev, sync)
    audio.removeEventListener('ended', onEnded)
    audio.removeEventListener('loadedmetadata', draw)
    audio.removeEventListener('seeked', draw)
    card.classList.remove('is-playing')
    fill.style.transform = ''
    knob.style.transform = ''
    now.textContent = mmss(0)
    audio.removeAttribute('src')
    audio.load()
    audio.remove()
    actx?.close().catch(() => {})
  }
}

const scene: SceneModule = {
  beats: ['call', 'link', 'human', 'customise', 'payout', 'takeaways', 'listen'],

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

      {/* the call itself: a card under step 1, played on demand (see player()) */}
      <div className="s44-call">
        <span className="s44-call-tail" aria-hidden="true" />
        <button type="button" className="s44-play" aria-label="Play the call" aria-pressed="false">
          <span className="s44-play-halo" aria-hidden="true" />
          <svg className="s44-ico s44-ico--play" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.2 4.9v14.2c0 .8.9 1.300 1.600.8l10.600-7.100c.6-.4.6-1.200 0-1.600L9.800 4.100c-.7-.5-1.600 0-1.600.8Z" fill="currentColor" />
          </svg>
          <svg className="s44-ico s44-ico--pause" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5.600" y="4.300" width="4.600" height="15.400" rx="1.300" fill="currentColor" />
            <rect x="13.800" y="4.300" width="4.600" height="15.400" rx="1.300" fill="currentColor" />
          </svg>
        </button>
        <div className="s44-call-id">
          <span className="s44-call-k">{D.CALL.kicker}</span>
          <b className="s44-call-t">
            {D.CALL.title.map((l) => (
              <span className="s44-tl" key={l}>
                <Words text={l} />
              </span>
            ))}
          </b>
        </div>
        <div className="s44-deck">
          <span className="s44-lv" aria-hidden="true">
            {Array.from({ length: BARS }, (_, i) => (
              <i key={i} style={{ ['--s44-r' as string]: (0.07 + 0.2 * Math.abs(Math.sin(i * 0.83) * Math.sin(i * 0.21 + 0.6))).toFixed(3) }} />
            ))}
          </span>
          <span className="s44-seek" role="slider" aria-label="Where the call is" aria-valuemin={0} aria-valuemax={Math.round(D.CALL.seconds)} aria-valuenow={0}>
            <span className="s44-seek-base" />
            <span className="s44-seek-fill" />
            <span className="s44-seek-knob">
              <i />
            </span>
          </span>
          <span className="s44-time s44-time--now">{mmss(0)}</span>
          <span className="s44-time s44-time--total">{mmss(Math.round(D.CALL.seconds))}</span>
        </div>
        <p className="s44-point">
          <span>
            <Words text={D.CALL.point} flame={[D.CALL.pointFlame]} />
          </span>
        </p>
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

    /* ---------------------------------------------------------------- listen */
    t += 1.9
    // what hangs under the line and the two bars have done their work: they step back for the call
    tl.to($$('.s44-under, .s44-drop'), { autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, t)
    tl.to($$('.s44-bar, .s44-onward'), { autoAlpha: 0, y: calm ? 0 : 0.8 * U, duration: 0.4, ease: 'power2.in' }, t + 0.05)
    // the journey stays, quieter; step 1, the call, keeps its full voice
    tl.to([...steps.slice(1), ...seps, $('.s44-line')], { opacity: 0.55, duration: 0.7, ease: ease.inOut }, t + 0.1)
    tl.to(fx, { focusX: -0.5, focusY: 0.35, glow: 0.5, warm: 0.35, duration: 1.3, ease: ease.inOut }, t + 0.1)
    const card = $('.s44-call')
    gsap.set(card, { autoAlpha: 0, y: calm ? 0 : -2.2 * U, scale: calm ? 1 : 0.94, transformOrigin: '6% 0%' })
    tl.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: ease.out }, t + 0.4)
    a.pop('.s44-play', t + 0.75, { from: 0.4 })
    a.fade('.s44-call-k', t + 0.9)
    gsap.set($$('.s44-call-t .kn-wi'), { yPercent: 118 })
    tl.to($$('.s44-call-t .kn-wi'), { yPercent: 0, duration: ctx.T.word, stagger: 0.05, ease: ease.out }, t + 0.95)
    a.fade('.s44-lv', t + 1.1)
    a.rule('.s44-seek-base', t + 1.15, { duration: 0.8 })
    a.pop('.s44-seek-knob i', t + 1.3, { from: 0.2 })
    a.fade('.s44-time', t + 1.4)
    a.words('.s44-point', t + 1.25, { duration: 0.6, stagger: 0.04 })
    tl.addLabel('listen', t + 2.3)

    // The call's player lives beside the timeline, not on it. This nested context is undone with
    // the scene's own (the director reverts it when the scene leaves or is rebuilt): the sound
    // stops, rewinds, and every listener goes.
    gsap.context(() => player(ctx, 'listen'))
    return tl
  },
}

export default scene
