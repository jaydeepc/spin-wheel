'use client'

/**
 * EVERYDAY AI · the shell: everything that stays on screen through the whole film.
 * The light, the header (the clock of her Tuesday, or the engineering mark), Priya's
 * subtitle line, the two quiet controls and the rail. It only reads the store; the
 * director moves the film.
 */

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import gsap from 'gsap'
import { CLOSING, ENGINEERING, OPENING, PRIYA, PRODUCTS, PROMPTS, STEPS, productByKey, type Product, type ProductKey } from '../content'
import { director } from '../core/director'
import { INTRO_TIME } from '../core/timing'
import { CodeGlyph, withName } from '../moments/parts'
import { SCENES, isEngineering, isProduct, stepIndex, useEveryday, type SceneId } from '../store'

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
 * Top right: where the film is. Through her Tuesday, a clock and a place. In the engineering
 * chapter the clock gives way to a code mark, and the words are the chapter's own
 * ("Every day · With the engineering team"): it is not a time in her day. On the opening
 * screen there is no Priya yet, and so no clock.
 */
export function Header() {
  const scene = useEveryday((s) => s.scene)
  const product = isProduct(scene) ? productByKey(scene) : null
  const eng = isEngineering(scene)
  const chapter: Product | undefined = ENG[0]
  const minutes = eng ? 19 * 60 : product ? minutesOf(product.time) : scene === 'finale' ? 18 * 60 + 30 : 8 * 60 + 30
  const time = eng ? (product ?? chapter)?.time : product ? `Tuesday, ${product.time}` : scene === 'finale' ? 'Tuesday evening' : 'Tuesday'
  const place = eng ? (product ?? chapter)?.place : product ? product.place : 'Lucknow'
  return (
    <header className="ev-header">
      <div className="ev-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ev-logo" src="/brand/piramal-ai-lockup.png" alt="Piramal.ai" draggable={false} />
        <span className="ev-kicker">{OPENING.title}</span>
      </div>
      <div className="ev-clock" data-kind={eng ? 'engineering' : 'day'} aria-hidden={scene === 'intro'}>
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
        <div className="ev-clock-txt">
          <span className="ev-clock-swap" key={eng ? 'engineering' : scene}>
            <span className="ev-clock-time">{time}</span>
            <span className="ev-clock-place">{place}</span>
          </span>
        </div>
      </div>
    </header>
  )
}

// ---------------------------------------------------------------------- Priya's line
interface Line {
  key: string
  text: string
  name: string
}

/**
 * Her words for this step. In a product moment: before (and on while the name lands, for as
 * long as the line takes to read) · tool (the name and the demo) · after (the run, the result,
 * the stat). On the opening screen she has not come in yet.
 */
function lineFor(scene: SceneId, step: string, cue: string | null): Line | null {
  if (scene === 'intro') return null
  if (scene === 'priya') return step === 'out' ? null : { key: 'priya', text: PRIYA.said, name: '' }
  if (scene === 'engineering') return step === 'out' ? null : { key: 'engineering', text: ENGINEERING.said, name: '' }
  if (scene === 'finale') return { key: 'finale', text: CLOSING.said, name: '' }
  if (!isProduct(scene)) return null
  const p = productByKey(scene)
  const i = stepIndex(step)
  if (step === 'done') return null // the hand-over: the stage clears, and so does her line
  // The moment's timeline says which line it has reached (her 'before' line is still being read
  // while the name lands); until it has spoken, the step does.
  const which = cue === 'before' || cue === 'tool' || cue === 'after' ? cue : i <= 0 ? 'before' : i <= 2 ? 'tool' : 'after'
  return { key: `${scene}:${which}`, text: p.priya[which], name: p.name }
}

export function Subtitle() {
  const scene = useEveryday((s) => s.scene)
  const step = useEveryday((s) => s.step)
  const cue = useEveryday((s) => s.cue)
  const hold = useEveryday((s) => s.hold)
  const line = lineFor(scene, step, cue)
  const [cur, setCur] = useState<Line | null>(line)
  const [prev, setPrev] = useState<Line | null>(null)
  if ((line?.key ?? '') !== (cur?.key ?? '')) {
    setPrev(cur)
    setCur(line)
  }
  const curRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const inEl = curRef.current?.querySelector('.ev-rise') ?? null
    const outEl = prevRef.current?.querySelector('.ev-rise') ?? null
    if (hold) {
      if (inEl) gsap.set(inEl, { yPercent: 0 })
      if (outEl) gsap.set(outEl, { yPercent: -118 })
      return
    }
    const t = gsap.timeline()
    if (outEl) t.fromTo(outEl, { yPercent: 0 }, { yPercent: -118, duration: 0.3, ease: 'power3.in' }, 0)
    if (inEl) t.fromTo(inEl, { yPercent: 118 }, { yPercent: 0, duration: 0.7, ease: 'expo.out' }, outEl ? 0.24 : 0.12)
    return () => {
      t.progress(1).kill()
    }
  }, [cur?.key, hold])

  const render = (l: Line) => (
    <p>
      <span className="ev-mask">
        <span className="ev-rise">
          <span className="ev-sub-who">Priya</span>
          {l.name ? withName(l.text, l.name) : l.text}
        </span>
      </span>
    </p>
  )

  return (
    <div className="ev-sub">
      <div className="ev-sub-avatar" data-ev="avatar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PRIYA.portrait} alt="Priya" draggable={false} />
      </div>
      <div className="ev-sub-lines" aria-live="polite">
        {prev ? (
          <div className="ev-sub-line" key={prev.key} ref={prevRef} aria-hidden="true">
            {render(prev)}
          </div>
        ) : null}
        {cur ? (
          <div className="ev-sub-line" key={cur.key} ref={curRef}>
            {render(cur)}
          </div>
        ) : null}
      </div>
      <TapHint />
      <Controls />
    </div>
  )
}

// ---------------------------------------------------------------------- manual mode says what it wants
/**
 * In manual mode the film stops after every step. While it rests on one that a plain tap moves
 * on from, it says so, quietly, beside the two controls (on a phone on its side: at the end of
 * Priya's line). Not on the opening screen and not while a demo's control is waiting: there the
 * control itself, and "Your turn", are the prompt. The director decides when (`tapHint`).
 */
export function TapHint() {
  const on = useEveryday((s) => s.tapHint)
  return (
    <div className="ev-taphint" data-on={on ? '1' : '0'} role="status" aria-hidden={!on}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle className="ev-taphint-ring" cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.2" fill="currentColor" />
      </svg>
      <span>{PROMPTS.tapOn}</span>
    </div>
  )
}

// ---------------------------------------------------------------------- the two quiet controls
/**
 * One capsule, two halves: how the film plays (by itself, or a tap at every step), and start again.
 *
 * The first half works as a player's button does: its ICON is what pressing it will do (two bars
 * while the film plays by itself: press to hold it at every step; a triangle in manual: press to
 * let it play), and the WORD beside it is the state it is in now ("Auto" / "Manual"). On a phone
 * on its side there is no room for the word, and the icon alone still reads the way every player
 * does: bars while it is playing.
 */
export function Controls() {
  const mode = useEveryday((s) => s.mode)
  return (
    <div className="ev-ctl" data-own role="group" aria-label="Playback">
      <button
        type="button"
        className="ev-ctl-btn ev-ctl-mode"
        aria-label={mode === 'auto' ? 'Playing by itself. Switch to manual: wait for a tap at every step' : 'Manual: waiting for a tap at every step. Switch to auto: play by itself'}
        title={mode === 'auto' ? 'Playing by itself. Press for manual' : 'Manual. Press to play by itself'}
        onClick={own(() => useEveryday.getState().toggleMode())}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle className="ev-ctl-track" cx="20" cy="20" r="17" />
          <circle className="ev-ctl-ring" data-ev="ring" cx="20" cy="20" r="17" />
          {mode === 'auto' ? (
            <path d="M15.5 14v12M24.5 14v12" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          ) : (
            <path d="M16.2 13.4v13.2l10.8-6.6z" fill="currentColor" />
          )}
        </svg>
        <span className="ev-ctl-label">{mode === 'auto' ? 'Auto' : 'Manual'}</span>
      </button>
      <i className="ev-ctl-divider" />
      <button type="button" className="ev-ctl-btn ev-ctl-again" aria-label="Start again from the beginning" title="Start again" onClick={own(() => director.restart())}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.2 13.2a7 7 0 1 0 1.7-5.4" />
          <path d="M4.4 4.6v4h4" />
        </svg>
        <span className="ev-ctl-label">Start again</span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------- the rail
/**
 * The film as one line, in two tracks.
 *
 *   Everyday AI · SmartHelp · BYOT · BYOA · Prastuti  ╌╌  Piramal Mind · Five names
 *   └ the opening   └──────── her Tuesday ────────┘      └ engineering  └ the closing
 *
 * The four stops of her Tuesday carry their times. The line then breaks, and Piramal Mind
 * stands apart on its own stretch under an "Engineering" tag: it is not a time in her day.
 * Where the marker stands is handed to the CSS in column units (--a … --e), so the
 * stylesheet alone decides how wide a cap, a day, the break and the engineering stop are.
 */
function railPosition(scene: SceneId, step: string) {
  const si = Math.max(0, stepIndex(step)) / STEPS.length
  const dayAt = DAY.findIndex((p) => p.key === scene)
  const engAt = ENG.findIndex((p) => p.key === scene)
  // a: the opening cap · b: day columns · c: the break · d: engineering columns · e: the closing cap
  if (scene === 'intro') return { a: 0.5, b: 0, c: 0, d: 0, e: 0 }
  if (scene === 'priya') return { a: 1, b: 0.14, c: 0, d: 0, e: 0 }
  if (dayAt >= 0) return { a: 1, b: Math.min(DAY.length, dayAt + 0.5 + si * 0.8), c: 0, d: 0, e: 0 }
  if (scene === 'engineering') return { a: 1, b: DAY.length, c: 1, d: 0.06, e: 0 }
  if (engAt >= 0) return { a: 1, b: DAY.length, c: 1, d: Math.min(ENG.length, engAt + 0.5 + si * 0.48), e: 0 }
  return { a: 1, b: DAY.length, c: 1, d: ENG.length, e: 0.5 }
}

export function Rail() {
  const scene = useEveryday((s) => s.scene)
  const step = useEveryday((s) => s.step)
  const preview = useEveryday((s) => s.preview)
  const hold = useEveryday((s) => s.hold)
  const setPreview = useEveryday((s) => s.setPreview)
  const at = SCENES.indexOf(scene)
  const si = isProduct(scene) ? stepIndex(step) : -1
  const pos = railPosition(scene, step)
  const previewProduct = preview ? productByKey(preview) : null
  const stateOf = (stop: SceneId) => {
    const i = SCENES.indexOf(stop)
    return i === at ? 'current' : i < at ? 'past' : 'next'
  }

  // A preview holds the opening screen's own countdown, and closes by itself.
  useEffect(() => {
    if (!preview || hold) return
    director.suspend()
    const t = setTimeout(() => setPreview(null), INTRO_TIME.preview * 1000)
    return () => {
      clearTimeout(t)
      director.resume()
    }
  }, [preview, hold, setPreview])

  const onStop = (key: ProductKey) => {
    if (scene === 'intro') setPreview(preview === key ? null : key)
    else director.jump(key)
  }

  const vars = {
    '--a': pos.a,
    '--b': pos.b.toFixed(3),
    '--c': pos.c,
    '--d': pos.d.toFixed(3),
    '--e': pos.e,
    '--nd': DAY.length,
    '--ne': ENG.length,
  } as CSSProperties

  const stop = (p: Product, i: number, k: number) => {
    const state = stateOf(p.key)
    const engineering = p.track === 'engineering'
    return (
      <button
        type="button"
        key={p.key}
        className={engineering ? 'ev-stop ev-stop--eng' : 'ev-stop ev-stop--day'}
        data-own
        data-ev-rail={p.key}
        data-accent={p.accent}
        data-long={p.name.length > 9 ? '1' : '0'}
        data-state={state}
        data-steps={state === 'current' && si >= 0 ? '1' : '0'}
        data-preview={preview === p.key ? '1' : '0'}
        style={{ ['--i' as string]: i, ['--k' as string]: k } as CSSProperties}
        aria-label={engineering ? `${p.name}, engineering` : `${p.name}, ${p.time}`}
        onClick={own(() => onStop(p.key))}
      >
        {engineering ? (
          <span className="ev-stop-time ev-stop-tag">
            <span>
              <CodeGlyph />
              Engineering
            </span>
          </span>
        ) : (
          <span className="ev-stop-time">{p.time}</span>
        )}
        <i className="ev-stop-dot" />
        <span className="ev-stop-name">
          <span className="ev-stop-pop">{p.name}</span>
        </span>
        <span className="ev-pips" aria-hidden="true">
          {STEPS.map((s, n) => (
            <i key={s} data-on={state === 'current' && n <= si ? '1' : '0'} />
          ))}
        </span>
      </button>
    )
  }

  return (
    <nav className="ev-rail" style={vars} aria-label="The film: Everyday AI, Priya’s Tuesday, engineering, the five names">
      <div className="ev-rail-track">
        <i className="ev-rail-line" />
        <i className="ev-rail-fill" />
      </div>
      <i className="ev-rail-break" aria-hidden="true" />
      <div className="ev-rail-carrier">
        <i className="ev-rail-marker" />
      </div>

      <button
        type="button"
        className="ev-stop ev-stop--cap ev-stop--first"
        data-own
        data-state={stateOf('intro')}
        // while the first name of her day is the large one, the cap beside it is only its dot
        data-tight={DAY[0]?.key === scene ? '1' : '0'}
        aria-label={`${OPENING.title}: what it is`}
        onClick={own(() => {
          // back to the opening as the next visitor should find it (auto), like Start again
          if (scene !== 'intro') director.restart()
        })}
      >
        <span className="ev-stop-time">Start</span>
        <i className="ev-stop-dot" />
        <span className="ev-stop-name">{OPENING.title}</span>
      </button>

      {DAY.map((p, i) => stop(p, i, i))}
      {ENG.map((p, k) => stop(p, DAY.length + k, k))}

      <button
        type="button"
        className="ev-stop ev-stop--cap ev-stop--end"
        data-own
        data-state={stateOf('finale')}
        aria-label={CLOSING.recap}
        onClick={own(() => {
          if (scene !== 'finale') director.jump('finale')
        })}
      >
        <span className="ev-stop-time">Recap</span>
        <i className="ev-stop-dot" />
        <span className="ev-stop-name">Five names</span>
      </button>

      {previewProduct ? (
        <div
          className="ev-preview ev-acc"
          data-own
          data-accent={previewProduct.accent}
          key={previewProduct.key}
          onClick={own(() => director.jump(previewProduct.key))}
        >
          <p className="ev-preview-name">
            <b>{previewProduct.name}</b>
            {previewProduct.expansion ? (
              <span>{previewProduct.expansion.join(' ')}</span>
            ) : previewProduct.devanagari ? (
              <span>
                <span className="ev-hi" lang="hi">
                  {previewProduct.devanagari}
                </span>{' '}
                · {previewProduct.meaning}
              </span>
            ) : null}
          </p>
          <div className="ev-preview-txt">
            <p className="ev-preview-when">
              {previewProduct.track === 'engineering' ? previewProduct.place : `${previewProduct.time} · ${previewProduct.place}`}
            </p>
            <p className="ev-preview-promise">{previewProduct.promise}</p>
          </div>
          <button type="button" className="ev-preview-go" aria-label={`Play the ${previewProduct.name} moment`} onClick={own(() => director.jump(previewProduct.key))}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3.8v16.4L20 12z" fill="#ffffff" />
            </svg>
          </button>
        </div>
      ) : null}
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
