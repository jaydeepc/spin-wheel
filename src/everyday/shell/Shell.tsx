'use client'

/**
 * EVERYDAY AI · the shell: THE QUIET FRAME, everything that stays on screen through the film.
 *
 *   the light        the soft haze behind everything
 *   the header       the logo, alone (top left); a one-line clock chip (top right)
 *   Priya's voice    her face and her line in a speech bubble: the bottom of the left half
 *   the strip        along the bottom: five small progress dots (left), Back and Next (right)
 *
 * Nothing here is a sentence except what Priya says. Next is the only control with visual
 * weight. The shell only reads the store; the director moves the film.
 */

import { useState, type MouseEvent } from 'react'
import { CLOSING, ENGINEERING, OPENING, PRIYA, PRODUCTS, PROMPTS, productByKey, type Product } from '../content'
import { director } from '../core/director'
import { CodeGlyph, withName } from '../moments/parts'
import { SCENES, isEngineering, isProduct, stepIndex, useEveryday, type SceneId } from '../store'

/** A press on a button of the shell is that button's alone: it is never also a tap on the stage. */
const own = (fn: () => void) => (e: MouseEvent) => {
  e.stopPropagation()
  fn()
}

/** Her Tuesday, and the engineering chapter after it. */
const DAY = PRODUCTS.filter((p) => p.track === 'day')
const ENG = PRODUCTS.filter((p) => p.track === 'engineering')

function minutesOf(time: string): number {
  const m = /(\d+):(\d+)\s*(am|pm)/i.exec(time)
  if (!m) return 0
  let h = Number(m[1]) % 12
  if (m[3].toLowerCase() === 'pm') h += 12
  return h * 60 + Number(m[2])
}

// ---------------------------------------------------------------------- light
export function Backdrop() {
  return (
    <div className="ev-light" aria-hidden="true">
      {(['warm', 'cool', 'flame', 'azure', 'navy'] as const).map((k) => (
        <div className={`ev-glow ev-glow--${k}`} key={k}>
          <i />
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------- header
/**
 * Top left: the logo, alone. Top right: where the film is, in one line. Through her Tuesday, a
 * small clock and "9:10 am · At the branch". In the engineering chapter the clock gives way to
 * a code mark and the words are the chapter's own ("Every day · With the engineering team").
 * On the opening and on the closing there is no chip (the stylesheet fades it out).
 */
export function Header() {
  const scene = useEveryday((s) => s.scene)
  const product = isProduct(scene) ? productByKey(scene) : null
  const eng = isEngineering(scene)
  const chapter: Product | undefined = ENG[0]
  const minutes = eng ? 19 * 60 : product ? minutesOf(product.time) : scene === 'finale' ? 18 * 60 + 30 : 8 * 60 + 30
  const time = eng ? (product ?? chapter)?.time : product ? product.time : 'Tuesday'
  const place = eng ? (product ?? chapter)?.place : product ? product.place : 'Lucknow'
  return (
    <header className="ev-header">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="ev-logo" src="/brand/piramal-ai-lockup.png" alt="Piramal.ai" draggable={false} />
      <div className="ev-clock" data-kind={eng ? 'engineering' : 'day'} aria-hidden={scene === 'intro' || scene === 'finale'}>
        <span className="ev-clock-dial">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle className="ev-clock-face" cx="20" cy="20" r="18" />
            <g className="ev-clock-hands">
              <line className="ev-clock-hand" x1="20" y1="20" x2="20" y2="11" style={{ transform: `rotate(${minutes * 0.5}deg)` }} />
              <line className="ev-clock-hand ev-clock-hand--m" x1="20" y1="20" x2="20" y2="6.5" style={{ transform: `rotate(${minutes * 6}deg)` }} />
              <circle cx="20" cy="20" r="1.8" fill="#071a50" />
            </g>
          </svg>
          <CodeGlyph className="ev-clock-code" />
        </span>
        <span className="ev-clock-txt">
          <span className="ev-clock-swap" key={eng ? 'engineering' : scene}>
            <b className="ev-clock-time">{time}</b>
            <i className="ev-clock-sep"> · </i>
            <span className="ev-clock-place">{place}</span>
          </span>
        </span>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------- Priya's voice
interface Line {
  key: string
  text: string
  name: string
}

/**
 * Her words for this instant, or null while she is not on screen.
 *
 * In a product moment: her 'before' line through the before step; NOTHING while the name lands
 * at centre stage (the name has the screen to itself); her 'tool' line from the device's arrival
 * through the demo; her 'after' line from late in the run through the result; NOTHING at the
 * number (the number has the screen). The moment's timeline says which (its cues: 'before',
 * 'tool', 'after', 'off'), so the line is right under a debug hold and when stepping back.
 * On the opening she has not come in yet.
 */
function lineFor(scene: SceneId, step: string, cue: string | null): Line | null {
  if (scene === 'intro') return null
  if (scene === 'priya') return step === 'out' ? null : { key: 'priya', text: PRIYA.said, name: '' }
  if (scene === 'engineering') return step === 'out' ? null : { key: 'engineering', text: ENGINEERING.said, name: '' }
  if (scene === 'finale') return { key: 'finale', text: CLOSING.said, name: '' }
  if (!isProduct(scene)) return null
  if (step === 'done' || cue === 'off') return null
  const p = productByKey(scene)
  const i = stepIndex(step)
  // until the timeline has spoken, the step does
  const which = cue === 'before' || cue === 'tool' || cue === 'after' ? cue : i <= 0 ? 'before' : i === 2 ? 'tool' : i === 3 ? 'after' : null
  if (!which) return null
  return { key: `${scene}:${which}`, text: p.priya[which], name: p.name }
}

/**
 * PRIYA'S VOICE: her face and her line in a speech bubble, always in the same place (the
 * bottom of the left half, above the strip), with a clear zone around it that nothing else
 * enters. It is the second most prominent text on screen, after the headline.
 *
 * The bubble is keyed by its line: when her line changes, the old bubble is gone and the new one
 * pops in, one small crisp move (a CSS animation: .ev-voice-card). When she has nothing to say
 * the block fades out whole, face and all, and the last line stays in it while it does.
 *
 * `[data-ev="avatar"]` is the hook the Meet Priya scene irises her photo into. On that scene the
 * bubble can be stood beside her photo from the scene's own stylesheet: see "Priya's voice" in
 * moments/README.md (--ev-vb-left, --ev-vb-bottom, --ev-vb-w on .ev-voice, and .ev-voice-tail).
 */
export function Voice() {
  const scene = useEveryday((s) => s.scene)
  const step = useEveryday((s) => s.step)
  const cue = useEveryday((s) => s.cue)
  const line = lineFor(scene, step, cue)
  const [shown, setShown] = useState<Line | null>(line)
  if (line && line.key !== shown?.key) setShown(line)
  const cur = line ?? shown

  return (
    <div className="ev-voice" data-on={line ? '1' : '0'} aria-live="polite">
      <div className="ev-voice-avatar" data-ev="avatar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PRIYA.portrait} alt="Priya" draggable={false} />
      </div>
      <div className="ev-voice-bubble" aria-hidden={!line}>
        {cur ? (
          <div className="ev-voice-card" key={cur.key}>
            <i className="ev-voice-tail" />
            <p className="ev-voice-text">{cur.name ? withName(cur.text, cur.name) : cur.text}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------- the strip: dots, Back, Next
/**
 * Five small dots: four for her day, a small gap, one for Piramal Mind. No words (the name is
 * the button's label and title). The current one is a slightly longer pill in the product's
 * accent, the visited ones are filled, the ones ahead are hollow. A dot jumps to its moment.
 * Hidden on the opening, on Meet Priya and on the closing (the stylesheet fades them).
 *
 * `data-ev-rail="<product key>"` is the hook core/buildMoment.ts aims the docked name at when a
 * moment hands over (`.ev-dot-mark` inside it is the dot that is drawn).
 */
function Dots() {
  const scene = useEveryday((s) => s.scene)
  const at = SCENES.indexOf(scene)
  const dot = (p: Product) => {
    const i = SCENES.indexOf(p.key)
    const state = i === at ? 'current' : i < at ? 'past' : 'next'
    return (
      <button
        type="button"
        key={p.key}
        className="ev-dot"
        data-own
        data-ev-rail={p.key}
        data-accent={p.accent}
        data-state={state}
        aria-label={p.name}
        aria-current={state === 'current' ? 'step' : undefined}
        title={p.name}
        onClick={own(() => director.jump(p.key))}
      >
        <i className="ev-dot-mark" />
      </button>
    )
  }
  return (
    <div className="ev-dots" role="group" aria-label="The five products">
      {DAY.map(dot)}
      <i className="ev-dots-gap" aria-hidden="true" />
      {ENG.map(dot)}
    </div>
  )
}

/**
 * One faint utility, on the OPENING only and on large screens only: the Auto-play switch (off
 * unless asked for; it shows on / off truthfully). Once the film is under way it is gone (the
 * stylesheet hides it, and it cannot be focused): the strip is the dots and the two buttons, and
 * nothing stands under Priya's bubble. There is no separate "Start again": the closing's Next
 * button is that, and the dots jump to any moment.
 */
function Utilities() {
  const mode = useEveryday((s) => s.mode)
  const scene = useEveryday((s) => s.scene)
  const on = mode === 'auto'
  const shown = scene === 'intro'
  return (
    <div className="ev-util" data-own aria-hidden={!shown}>
      <button
        type="button"
        className="ev-auto"
        role="switch"
        aria-checked={on}
        data-on={on ? '1' : '0'}
        title={PROMPTS.auto}
        tabIndex={shown ? 0 : -1}
        onClick={own(() => useEveryday.getState().toggleMode())}
      >
        <span className="ev-auto-track" aria-hidden="true">
          <i />
        </span>
        <span className="ev-auto-word">{PROMPTS.auto}</span>
      </button>
    </div>
  )
}

/**
 * NEXT, always in the same place (bottom right), and Back beside it. Next is how the film
 * moves: one press, one step (see "Manual first" in moments/README.md).
 *
 *   data-state="moving"   the film is travelling: Next is quiet (a press finishes the move)
 *   data-state="ready"    the film rests: Next is at full strength, pulses once as it arrives, and
 *                         breathes gently if nobody presses for about 4 s
 *
 * On the film's last frame it reads "Start again" and restarts. Neither button is shown on the
 * opening: the opening's own start button is the action there.
 */
function Nav() {
  const resting = useEveryday((s) => s.resting)
  const atEnd = useEveryday((s) => s.atEnd)
  const label = atEnd ? PROMPTS.again : PROMPTS.next
  return (
    <div className="ev-nav" data-own>
      <button type="button" className="ev-back" aria-label={PROMPTS.back} title={PROMPTS.back} onClick={own(() => director.press(-1))}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 5.5 8 12l6.5 6.5" />
        </svg>
      </button>
      <button type="button" className="ev-next" data-state={resting ? 'ready' : 'moving'} data-end={atEnd ? '1' : '0'} onClick={own(() => director.press(1))}>
        <i className="ev-next-halo" aria-hidden="true" />
        <span className="ev-next-word" key={label}>
          {label}
        </span>
        {atEnd ? (
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.2 13.2a7 7 0 1 0 1.7-5.4" />
            <path d="M4.4 4.6v4h4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 12h14" />
            <path d="M13 5.8 19.2 12 13 18.2" />
          </svg>
        )}
      </button>
    </div>
  )
}

/** The bottom strip: the dots on the left (on the opening, the Auto-play switch in their place), Back and Next on the right. No sentences. */
export function Strip() {
  return (
    <nav className="ev-strip" aria-label="The film">
      <Dots />
      <Utilities />
      <Nav />
    </nav>
  )
}

// ---------------------------------------------------------------------- portrait prompt
export function RotatePrompt() {
  return (
    <div className="ev-rotate" role="status">
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <g className="ev-rotate-phone">
          <rect x="30" y="12" width="36" height="72" rx="8" fill="#ffffff" stroke="#071a50" strokeWidth="4" />
          <rect x="42" y="18" width="12" height="3" rx="1.5" fill="#071a50" />
        </g>
        <path d="M80 30a36 36 0 0 1 6 18" fill="none" stroke="#f16443" strokeWidth="4" strokeLinecap="round" />
        <path d="M88 40l-2 9-8-4" fill="none" stroke="#f16443" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <b>Turn your device sideways</b>
      <span>{OPENING.title} plays in landscape.</span>
    </div>
  )
}
