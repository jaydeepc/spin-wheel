'use client'

/**
 * BYOT · Build Your Own Tech · 10:30 am, on a site visit.     THE REFERENCE MOMENT.
 *
 * Before   a notebook page at 11:40 pm: the same four fields, half of them forgotten
 * Demo     the four parts her team put together fly out of B·Y·O·T and become the app
 * Run      she speaks; the key phrases of her note lift off as chips and fly into the
 *          fields they fill; the note is stamped Filed 10:42 am
 * Result   11:40 pm, struck through, becomes Filed 10:42 am
 * Stat     634 tiles, one per employee-built tool; the phone flies into its own tile
 *
 * Everything here is BYOT's own. The name, the phone, the photo, the headline, the
 * number, the hand-over and the touch invitation come from the shared frame.
 */

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { productByKey, type ByotProduct } from '../content'
import { TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './byot.css'

type P = PartProps<ByotProduct>
const BYOT = productByKey('byot') as ByotProduct

/** The words of the spoken note that fill each field: Customer, Property, Stage, Next step. */
const PHRASES = [
  [1, 2],
  [5, 6],
  [8, 9, 10, 11],
  [15, 16, 17, 18],
]
/** Field rows grouped into the parts her team assembled: Customer / Property (+ Stage) / Next step. */
const FIELD_GROUPS = [[0], [1, 2], [3]]

const TILE_COUNT = 634
const GRID_COLS = 32
const GRID_ROWS = Math.ceil(TILE_COUNT / GRID_COLS)
/** Which of the 634 is Visit Notes. */
const OUR_TILE = 7 * GRID_COLS + 20

const WAVE = [0.5, 0.9, 0.35, 0.7, 1, 0.45, 0.8, 0.3, 0.95, 0.6, 0.4, 0.85, 0.55, 1, 0.38, 0.72, 0.9, 0.5, 0.33, 0.8, 0.62, 0.95, 0.42, 0.7]

const phraseText = (spoken: string, idx: number[]) =>
  idx
    .map((i) => spoken.split(' ')[i])
    .join(' ')
    .replace(/[.,]$/, '')

// ====================================================================== BEFORE
/** A notebook page, late at night: the four fields of the app, written from memory, with gaps. */
function Before({ product }: P) {
  const { fields, beforeWhen } = product.demo
  // What she still remembers at 11:40 pm: the name, half the address, and then it goes.
  const kept = [fields[0].v, `${fields[1].v.split(',')[0]},`, '', '']
  return (
    <div className="byot-b">
      <div className="byot-b-night">
        <svg viewBox="0 0 115 86" aria-hidden="true">
          <path className="byot-b-moon" d="M105 27A15 15 0 0 1 87 9 15 15 0 1 0 105 27z" />
          {[
            [111, 40, 1.5],
            [79, 34, 1],
            [104, 50, 1.4],
            [88, 62, 1],
            [106, 76, 1.2],
            [98, 68, 0.8],
          ].map(([x, y, r], i) => (
            <circle className="byot-b-star" key={i} cx={x} cy={y} r={r} />
          ))}
        </svg>
        <span className="byot-b-time">{beforeWhen}</span>
      </div>
      <div className="byot-b-page">
        <i className="byot-b-holes" />
        {fields.map((f, i) => (
          <p className="byot-b-row" key={f.k}>
            <span className="byot-b-k">{f.k}</span>
            <span className="byot-b-v">
              {kept[i] ? <span className="byot-b-ink">{kept[i]}</span> : null}
              {i > 0 ? (
                <>
                  <i className="byot-b-gap" />
                  <b className="byot-b-q">?</b>
                </>
              ) : null}
            </span>
          </p>
        ))}
      </div>
    </div>
  )
}

// ====================================================================== SCREEN
/** Visit Notes, the app her team built: a voice note and the fields it fills. */
function Screen({ product }: P) {
  const d = product.demo
  return (
    <div className="byot-app">
      <div className="byot-appbar">
        <span className="byot-appicon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 4h9l4 4v12H6z" />
            <path d="M9.500 12.500h6M9.500 16h4" />
          </svg>
        </span>
        <span className="byot-apptitle">
          <b>{d.app}</b>
          <span>New note · Tuesday</span>
        </span>
        <span className="byot-appbadge">on {product.name}</span>
      </div>

      <div className="byot-slot byot-slot--voice">
        <i className="byot-slot-outline" />
        <div className="byot-block byot-voice">
          <div className="byot-voice-head">
            <span>{d.blocks[0]}</span>
            <span className="byot-voice-state">Listening</span>
            <span className="byot-voice-state">0:08</span>
          </div>
          <div className="byot-voice-body">
            <p className="byot-voice-ph">Speak right after the visit. The note fills itself in.</p>
            <div className="byot-wave">
              {WAVE.map((_, i) => (
                <i key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="byot-fields">
        {FIELD_GROUPS.map((group) => (
          <div className="byot-slot" key={group.join('-')}>
            <i className="byot-slot-outline" />
            <div className="byot-block">
              {group.map((fi) => (
                <div className="byot-field" key={d.fields[fi].k}>
                  <span className="byot-field-k">{d.fields[fi].k}</span>
                  <span className="byot-field-v">{d.fields[fi].v}</span>
                  <i className="byot-field-skel" />
                  <i className="byot-field-sweep" />
                  <i className="byot-field-tick">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#c8431c" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.500 10 17.500 19 7.500" />
                    </svg>
                  </i>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="byot-miczone">
        <div className="byot-micWrap">
          <TouchControl label="Speak a visit note" className="byot-mic">
            <span className="byot-mic-face">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <g className="byot-mic-g--mic">
                <rect x="9" y="2.500" width="6" height="11.500" rx="3" fill="#fff" stroke="none" />
                <path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3.500" />
              </g>
              <rect className="byot-mic-g--stop" x="7" y="7" width="10" height="10" rx="2.400" fill="#fff" stroke="none" />
              <path className="byot-mic-g--check" d="M5 12.500 10 17.500 19.500 7" strokeWidth="2.800" />
            </svg>
            </span>
          </TouchControl>
        </div>
        <div className="byot-mic-hint">
          <span>Tap to speak</span>
          <span>Listening</span>
          <span>Saved to {d.app}</span>
        </div>
      </div>
    </div>
  )
}

/** The stamp sits on the phone's edge and travels with it. */
function OnDevice({ product }: P) {
  const [word, ...rest] = product.demo.filed.split(' ')
  return (
    <div className="byot-stamp">
      <i className="byot-stamp-burst" />
      <b>{word}</b>
      <span>{rest.join(' ')}</span>
    </div>
  )
}

// ====================================================================== AROUND THE DEVICE
/** Left column: the parts the team put together. */
function Under({ product }: P) {
  return (
    <div className="byot-kit">
      {product.demo.blocks.map((b) => (
        <span className="byot-kit-chip" key={b}>
          {b}
        </span>
      ))}
      <span className="byot-kit-chip byot-kit-chip--solid">No code</span>
    </div>
  )
}

/** Under the photo: what she says into the phone. */
function Beside({ product }: P) {
  return (
    <div className="byot-said">
      <p className="byot-said-who">Priya says</p>
      <p className="byot-said-text">{product.demo.spoken}</p>
    </div>
  )
}

/** Under the result headline: the old time, struck through, and the new one. */
function Proof({ product }: P) {
  return (
    <div className="byot-compare">
      <span className="byot-compare-old">
        {product.demo.beforeWhen}
        <i />
      </span>
      <svg viewBox="0 0 40 20" fill="none" stroke="#c8431c" strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 10h34M28 3l8 7-8 7" />
      </svg>
      <span className="byot-compare-new">{product.demo.filed}</span>
    </div>
  )
}

/** Things that fly: the four parts (letters → phone) and the four phrases (her words → the fields). */
function Extras({ product }: P) {
  return (
    <>
      {product.demo.blocks.map((b) => (
        <div className="byot-part" key={b} aria-hidden="true">
          <svg viewBox="0 0 6 10">
            {[1.2, 5, 8.8].flatMap((y) => [1.2, 4.8].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.2" />))}
          </svg>
          {b}
        </div>
      ))}
      {PHRASES.map((idx) => (
        <span className="byot-phrase" key={idx.join('-')} aria-hidden="true">
          {phraseText(product.demo.spoken, idx)}
        </span>
      ))}
    </>
  )
}

// ====================================================================== STAT
/** 634 tools built by employees. One of them is hers. */
function Stat({ product }: P) {
  return (
    <div className="byot-grid">
      {Array.from({ length: TILE_COUNT }, (_, i) => (
        <i className={i === OUR_TILE ? 'byot-tile byot-tile--ours' : 'byot-tile'} key={i} />
      ))}
      <div className="byot-callout">
        <div className="byot-callout-in">
          <b>{product.demo.app}</b>
          <span>Lucknow sales team</span>
        </div>
      </div>
    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<ByotProduct>) {
  const { $, $$, U, hx, ease: E, loc, letters, before, demo, run, result, stat } = env
  const clipShut = 'inset(0% 100% 0% 0%)'
  const clipOpen = 'inset(0% 0% 0% 0%)'

  // ---------------------------------------------------------------- before: the page at night
  const night = $('.byot-b-night')
  const moon = $('.byot-b-moon')
  const stars = $$('.byot-b-star')
  const page = $('.byot-b-page')
  const rows = $$('.byot-b-row')
  const inks = $$('.byot-b-ink')
  const gaps = $$('.byot-b-gap')
  const qs = $$('.byot-b-q')
  gsap.set(night, { autoAlpha: 0, y: 2 * U, rotation: 9 })
  gsap.set(moon, { scale: 0, rotation: -40, transformOrigin: '50% 50%' })
  gsap.set(stars, { scale: 0, transformOrigin: '50% 50%' })
  gsap.set(page, { autoAlpha: 0, y: 3 * U, rotation: -12 })
  gsap.set(rows, { autoAlpha: 0, x: -0.6 * U })
  gsap.set(inks, { clipPath: clipShut })
  gsap.set(gaps, { scaleX: 0, transformOrigin: '0 50%' })
  gsap.set(qs, { scale: 0, autoAlpha: 0 })
  before
    .to(night, { autoAlpha: 1, y: 0, rotation: 4, duration: 0.6, ease: E.snap }, 0.05)
    .to(page, { autoAlpha: 1, y: 0, rotation: -4, duration: 0.65, ease: E.snap }, 0.12)
    .to(moon, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }, 0.3)
    .to(stars, { scale: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(3)' }, 0.38)
    .to(rows, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05 }, 0.26)
    // she writes what she remembers…
    .to(inks, { clipPath: clipOpen, duration: 0.26, stagger: 0.1, ease: 'power1.inOut' }, 0.36)
    // …and the rest has slipped
    .to(gaps, { scaleX: 1, duration: 0.2, stagger: 0.05, ease: 'power2.out' }, 0.48)
    .to(qs, { scale: 1, autoAlpha: 1, duration: 0.22, stagger: 0.05, ease: 'back.out(3.5)' }, 0.52)

  // ---------------------------------------------------------------- demo: four parts leave the letters and become the app
  const parts = $$('.byot-part')
  const slots = $$('.byot-slot')
  const blocks = $$('.byot-block')
  const outlines = $$('.byot-slot-outline')
  const micWrap = $('.byot-micWrap')
  const hints = $$('.byot-mic-hint span')
  const slotBox = slots.map((s) => loc(s))
  const partBox = parts.map((p) => ({ w: p.offsetWidth, h: p.offsetHeight }))
  gsap.set(blocks, { autoAlpha: 0, scale: 0.94 })
  gsap.set(micWrap, { autoAlpha: 0, scale: 0 })
  gsap.set(hints, { autoAlpha: 0 })
  gsap.set(parts, { x: (i) => letters[i].cx, y: (i) => letters[i].cy, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
  parts.forEach((p, i) => {
    const from = { x: letters[i].cx, y: letters[i].cy }
    const to = { x: slotBox[i].cx, y: slotBox[i].cy }
    // a thrown arc: up and over, each part on its own curve, then down into its slot
    const over = { x: from.x + (to.x - from.x) * 0.55, y: Math.min(from.y, to.y) - (3.5 + (3 - i) * 1.3) * U }
    const born = 0.02 + i * 0.045
    const fly = 0.18 + i * 0.065
    const dur = 0.54
    const land = fly + dur
    demo
      .to(p, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(2.2)' }, born)
      .to(p, { motionPath: { path: [over, to], curviness: 1.25 }, duration: dur, ease: 'power2.inOut' }, fly)
      .to(p, { rotation: to.x > from.x ? 9 : -9, duration: dur * 0.45, ease: 'sine.out' }, fly)
      .to(p, { rotation: 0, duration: dur * 0.55, ease: 'sine.inOut' }, fly + dur * 0.45)
      .to(p, { scaleX: slotBox[i].w / partBox[i].w, scaleY: slotBox[i].h / partBox[i].h, autoAlpha: 0, duration: 0.2, ease: 'power2.out' }, land - 0.05)
      .to(outlines[i], { autoAlpha: 0, duration: 0.18 }, land - 0.05)
      .to(blocks[i], { autoAlpha: 1, scale: 1, duration: 0.32, ease: E.snap }, land - 0.05)
    env.bump(demo, land - 0.06)
  })
  demo.to(micWrap, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'back.out(2.4)' }, 0.78).to(hints[0], { autoAlpha: 1, duration: 0.25 }, 0.95)

  // ---------------------------------------------------------------- run: she speaks, her words fly into the fields, the note is filed
  const mic = $('.byot-mic-face')
  const micGlyph = $('.byot-mic-g--mic')
  const stopGlyph = $('.byot-mic-g--stop')
  const checkGlyph = $('.byot-mic-g--check')
  const placeholder = $('.byot-voice-ph')
  const wave = $('.byot-wave')
  const bars = $$('.byot-wave i')
  const states = $$('.byot-voice-state')
  const said = $('.byot-said')
  const words = SplitText.create($('.byot-said-text'), { type: 'words' }).words as HTMLElement[]
  const phrases = $$('.byot-phrase')
  const values = $$('.byot-field-v')
  const skels = $$('.byot-field-skel')
  const sweeps = $$('.byot-field-sweep')
  const ticks = $$('.byot-field-tick')
  const stamp = $('.byot-stamp')
  const burst = $('.byot-stamp-burst')

  // where each phrase lifts from (her words) and where it lands (its field), as the stage is during the run
  const phraseFrom = PHRASES.map((idx) => loc(words[idx[0]]))
  const phraseTo = values.map((v) => loc(v))
  const phraseH = phrases[0].offsetHeight
  const padX = parseFloat(getComputedStyle(phrases[0]).paddingLeft)
  const fit = parseFloat(getComputedStyle(values[0]).fontSize) / parseFloat(getComputedStyle(phrases[0]).fontSize)
  const landScale = fit * (phraseTo[0].h / (values[0].offsetHeight || 1))
  // a lifted phrase is one line; one that starts near the right edge is drawn back inside the field
  const liftX = phrases.map((p, k) => Math.min(phraseFrom[k].x - padX, hx - p.offsetWidth * 1.08))

  gsap.set(stopGlyph, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
  gsap.set(micGlyph, { transformOrigin: '50% 50%' })
  gsap.set(checkGlyph, { drawSVG: '0%' })
  gsap.set(states, { autoAlpha: 0 })
  gsap.set(wave, { autoAlpha: 0.35 })
  gsap.set(said, { autoAlpha: 0 })
  gsap.set(words, { autoAlpha: 0, y: 0.4 * U })
  gsap.set(phrases, { x: (i) => liftX[i], y: (i) => phraseFrom[i].cy - phraseH / 2, transformOrigin: '0 50%', autoAlpha: 0 })
  gsap.set(values, { clipPath: clipShut })
  gsap.set(sweeps, { xPercent: -105 })
  gsap.set(ticks, { autoAlpha: 0, scale: 0 })
  gsap.set(stamp, { autoAlpha: 0, scale: 2.7, rotation: -24 })
  gsap.set(burst, { autoAlpha: 0 })

  const wordAt = (i: number) => 0.16 + i * 0.058
  run
    .to(mic, { scale: 0.84, duration: 0.08, ease: 'power2.in' }, 0)
    .to(mic, { scale: 1, duration: 0.4, ease: 'back.out(3.2)' }, 0.08)
    .to(micGlyph, { autoAlpha: 0, scale: 0.4, duration: 0.16, ease: 'power2.in' }, 0.03)
    .to(stopGlyph, { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'back.out(2.4)' }, 0.14)
    .to([hints[0], placeholder], { autoAlpha: 0, duration: 0.14 }, 0)
    .to([hints[1], states[0]], { autoAlpha: 1, duration: 0.2 }, 0.1)
    .to(wave, { autoAlpha: 1, duration: 0.2 }, 0.05)
    .to(said, { autoAlpha: 1, duration: 0.25 }, 0.05)
  bars.forEach((b, i) => {
    run.to(b, { scaleY: WAVE[i % WAVE.length], duration: 0.15, repeat: 7, yoyo: true, ease: 'sine.inOut' }, 0.08 + (i % 6) * 0.025)
  })
  words.forEach((w, i) => {
    run.to(w, { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out' }, wordAt(i))
  })
  PHRASES.forEach((idx, k) => {
    const spoken = wordAt(idx[idx.length - 1])
    const lift = spoken + 0.1
    const fly = lift + 0.14
    const land = fly + 0.5
    const from = { x: liftX[k], y: phraseFrom[k].cy - phraseH / 2 }
    const to = { x: phraseTo[k].x - padX * landScale, y: phraseTo[k].cy - phraseH / 2 }
    // each phrase leaves on its own arc: up off the line, across, and down into its field
    const over = { x: from.x + (to.x - from.x) * 0.4, y: Math.min(from.y, to.y) - (1.6 + k * 0.5) * U }
    run
      .to(
        idx.map((i) => words[i]),
        { color: '#c8431c', duration: 0.16 },
        spoken,
      )
      .to(phrases[k], { autoAlpha: 1, duration: 0.01 }, lift)
      .fromTo(phrases[k], { scale: 0.96 }, { scale: 1.08, duration: 0.14, ease: 'back.out(3)', immediateRender: false }, lift)
      .to(phrases[k], { motionPath: { path: [over, to], curviness: 1.3 }, scale: landScale, duration: 0.5, ease: 'power2.inOut' }, fly)
      .to(phrases[k], { autoAlpha: 0, duration: 0.12, ease: 'none' }, land - 0.06)
      .to(skels[k], { autoAlpha: 0, duration: 0.12 }, land - 0.04)
      .to(sweeps[k], { xPercent: 105, duration: 0.5, ease: 'power2.inOut' }, land - 0.1)
      .to(values[k], { clipPath: clipOpen, duration: 0.36 }, land - 0.04)
      .to(ticks[k], { autoAlpha: 1, scale: 1, duration: 0.32, ease: 'back.out(3)' }, land + 0.1)
    env.bump(run, land - 0.04, 0.6)
  })
  const heard = wordAt(words.length - 1) + 0.3
  const hit = 2.34
  run
    // the recording stays in the note as a quiet waveform
    .to(bars, { scaleY: (i) => 0.2 + WAVE[i % WAVE.length] * 0.6, duration: 0.3, ease: 'power2.out', stagger: 0.006 }, heard)
    .to(wave, { autoAlpha: 0.5, duration: 0.3 }, heard)
    .to(stopGlyph, { autoAlpha: 0, scale: 0.4, duration: 0.14, ease: 'power2.in' }, heard)
    .to(checkGlyph, { drawSVG: '100%', duration: 0.32, ease: 'power2.out' }, heard + 0.1)
    .to([hints[1], states[0]], { autoAlpha: 0, duration: 0.14 }, heard)
    .to([hints[2], states[1]], { autoAlpha: 1, duration: 0.2 }, heard + 0.1)
    // Filed 10:42 am
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.24)
    .to(stamp, { scale: 1, rotation: -8, duration: 0.24, ease: E.slam }, hit - 0.24)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.7, autoAlpha: 0, duration: 0.44, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, hit, 3)

  // ---------------------------------------------------------------- result: 11:40 pm, struck through
  const strike = $('.byot-compare-old i')
  gsap.set(strike, { scaleX: 0 })
  result.to(strike, { scaleX: 1, duration: 0.26, ease: 'power2.inOut' }, 0.66)

  // ---------------------------------------------------------------- stat: one of 634
  const tiles = $$('.byot-tile')
  const callout = $('.byot-callout-in')
  gsap.set(tiles, { autoAlpha: 0, scale: 0.2 })
  gsap.set(callout, { autoAlpha: 0, y: 1 * U, xPercent: -50 })
  stat
    .to(
      tiles,
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.34,
        ease: 'back.out(2.2)',
        stagger: { grid: [GRID_ROWS, GRID_COLS], from: OUR_TILE, amount: 0.5, ease: 'power1.in' },
      },
      0.66,
    )
    .to(callout, { autoAlpha: 1, y: 0, duration: 0.36, ease: E.snap }, 1.12)

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: tiles[OUR_TILE] }
}

const byot: MomentModule<ByotProduct> = {
  key: 'byot',
  device: 'phone',
  demoTitle: BYOT.demo.app,
  demoLine: BYOT.demo.builtBy,
  highlight: 'on the spot',
  clock: '10:41',
  Before,
  Screen,
  Stat,
  Under,
  Beside,
  Proof,
  Extras,
  OnDevice,
  animate,
}

export default byot
