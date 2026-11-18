'use client'

/**
 * BYOT · Build Your Own Tech · 10:30 am, on a site visit.     THE REFERENCE MOMENT.
 *
 * THE BUDGET (moments/README.md): at every rest the screen holds the name, at most one
 * statement, Priya's bubble and ONE picture. The phone shows the REAL APP the collections team
 * built (content.ts → demo.shots, demo.clip: stills and a short muted clip from a screen
 * recording of it, cropped to the glass, the app's own title bar cut off):
 *
 * Before   a notebook page at 9:40 pm: the app's four fields, half of them forgotten
 * Demo     the app is there on the phone: its ready screen (shots.ask). The one control lies on the app's own
 *          "Start voice disposition" button.
 * Run      the real app at work (demo.clip, driven by the timeline: its currentTime is tweened,
 *          so every frame can be held): it listens, analyses, and the fields are filled. Under
 *          the clip stands a still of the listening screen, for a browser that cannot play it.
 *          Then the filled form (shots.done) and the stamp, Filed 10:42 am.
 * Result   the phone rests on the filled form, and the one stamp
 * Stat     634 tiles, one per employee-built tool; the phone flies into its own tile
 *
 * Everything here is BYOT's own. The name, the phone, the headline, the number, Priya's
 * bubble, the hand-over and the touch invitation come from the shared frame.
 */

import gsap from 'gsap'
import type { ByotProduct } from '../content'
import { Shot, TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './byot.css'

type P = PartProps<ByotProduct>

const TILE_COUNT = 634
const GRID_COLS = 32
const GRID_ROWS = Math.ceil(TILE_COUNT / GRID_COLS)
/** Which of the 634 is this team's app. */
const OUR_TILE = 7 * GRID_COLS + 20

/** "Built by the Lucknow sales team, on BYOT" → who built it: the line in the app's own header. */
const builtByTeam = (builtBy: string) => builtBy.split(',')[0]

// ====================================================================== BEFORE
/** A notebook page, late in the evening: the four fields of the app, written by hand after the visit, with gaps. */
function Before({ product }: P) {
  const { fields, beforeWhen } = product.demo
  // What is still remembered by the evening: who was met, the first word of the reason, and then it goes.
  const kept = [fields[0].v, fields[1].v.split(' ')[0], '', '']
  return (
    <div className="byot-b">
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
      {/* the hour it was written at lies over the corner of the page */}
      <div className="byot-b-night">
        <svg viewBox="0 0 125 80" aria-hidden="true">
          <path className="byot-b-moon" d="M110 60A15 15 0 0 1 92 42 15 15 0 1 0 110 60z" />
          {[
            [16, 54, 1.5],
            [34, 68, 1],
            [56, 50, 1.4],
            [70, 70, 1],
            [117, 34, 1.2],
            [48, 62, 0.8],
          ].map(([x, y, r], i) => (
            <circle className="byot-b-star" key={i} cx={x} cy={y} r={r} />
          ))}
        </svg>
        <span className="byot-b-time">{beforeWhen}</span>
      </div>
    </div>
  )
}

// ====================================================================== SCREEN
/**
 * The app the collections team built (demo.app), as it really is. Bottom to top of the stack:
 * its ready screen; the listening screen; the clip of it at work; the filled form. On the ready
 * screen, the one control lies on the app's own start button.
 */
function Screen({ product }: P) {
  const d = product.demo
  return (
    <div className="byot-app">
      <Shot shot={d.shots.ask} className="byot-shot byot-shot--ask" />
      <Shot shot={d.shots.listen} className="byot-shot byot-shot--listen" />
      {/* muted, no sound track, never played: the run timeline sets its currentTime */}
      <video className="byot-clip" src={d.clip.src} muted playsInline preload="auto" tabIndex={-1} aria-hidden="true" />
      <Shot shot={d.shots.done} className="byot-shot byot-shot--done" />
      <div className="byot-startWrap">
        <TouchControl label={`${d.start} in ${d.app}`} className="byot-start">
          <span className="byot-start-face" />
        </TouchControl>
      </div>
    </div>
  )
}

/** The ONE thing on the phone at the result: the stamp, low on the filled form. */
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
          <span>{builtByTeam(product.demo.builtBy)}</span>
        </div>
      </div>
    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<ByotProduct>) {
  const { $, $$, U, ease: E, loc, product, before, demo, run, stat } = env
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
  gsap.set(night, { autoAlpha: 0, y: -2 * U, rotation: 10 })
  gsap.set(moon, { scale: 0, rotation: -40, transformOrigin: '50% 50%' })
  gsap.set(stars, { scale: 0, transformOrigin: '50% 50%' })
  gsap.set(page, { autoAlpha: 0, y: 3 * U, rotation: -10 })
  gsap.set(rows, { autoAlpha: 0, x: -0.6 * U })
  gsap.set(inks, { clipPath: clipShut })
  gsap.set(gaps, { scaleX: 0, transformOrigin: '0 50%' })
  gsap.set(qs, { scale: 0, autoAlpha: 0 })
  before
    .to(page, { autoAlpha: 1, y: 0, rotation: -3, duration: 0.65, ease: E.snap }, 0.05)
    // the hour drops onto the corner of the page
    .to(night, { autoAlpha: 1, y: 0, rotation: 4, duration: 0.55, ease: E.snap }, 0.18)
    .to(moon, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }, 0.34)
    .to(stars, { scale: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(3)' }, 0.4)
    .to(rows, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05 }, 0.22)
    // she writes what she remembers…
    .to(inks, { clipPath: clipOpen, duration: 0.26, stagger: 0.1, ease: 'power1.inOut' }, 0.34)
    // …and the rest has slipped
    .to(gaps, { scaleX: 1, duration: 0.2, stagger: 0.05, ease: 'power2.out' }, 0.46)
    .to(qs, { scale: 1, autoAlpha: 1, duration: 0.22, stagger: 0.05, ease: 'back.out(3.5)' }, 0.5)

  // ---------------------------------------------------------------- demo: the team's app, on the phone
  const app = $('.byot-app')
  const startWrap = $('.byot-startWrap')
  const face = $('.byot-start-face')
  const listen = $('.byot-shot--listen')
  const clip = $<HTMLVideoElement>('.byot-clip')
  const done = $('.byot-shot--done')
  const stamp = $('.byot-stamp')
  const burst = $('.byot-stamp-burst')

  // ---- measured while the stage stands as it does during the demo, the run and the result ----
  const dev = loc(env.shared.device)
  /** how much the frame has enlarged the phone: a length on the glass is this many times its own */
  const zoom = dev.w / (env.shared.device.offsetWidth || 1)
  const glass = loc(app)
  // the stamp stands low on the filled form, clear of the note the app wrote, a little off the phone's right edge
  // (lower on a phone on its side: the wider glass shows the form from its top, larger)
  const stampBox = loc(stamp)
  const stampAt = { x: (glass.cx - stampBox.cx) / zoom + 1.1 * U, y: (glass.y + glass.h * (env.small ? 0.86 : 0.76) - stampBox.cy) / zoom }

  gsap.set(app, { autoAlpha: 0 })
  gsap.set(startWrap, { autoAlpha: 0 })
  // the app is simply there on the phone as it arrives, and its own start button is the one control
  demo.to(app, { autoAlpha: 1, duration: 0.35, ease: 'power1.inOut' }, 0.3).to(startWrap, { autoAlpha: 1, duration: 0.25 }, 0.7)

  // ---------------------------------------------------------------- run: she speaks, the app fills the form, the note is filed
  gsap.set(listen, { autoAlpha: 0 })
  gsap.set(clip, { autoAlpha: 0 })
  gsap.set(done, { autoAlpha: 0 })
  gsap.set(stamp, { x: stampAt.x, y: stampAt.y, autoAlpha: 0, scale: 2.7, rotation: -24 })
  gsap.set(burst, { autoAlpha: 0 })

  const rolls = 0.12 // the clip starts
  const filled = rolls + product.demo.clip.seconds // …and has ended on the filled form
  const hit = 2.34
  run
    // the start button is pressed, and the control leaves
    .to(face, { autoAlpha: 1, duration: 0.06, ease: 'none' }, 0)
    .to(startWrap, { autoAlpha: 0, duration: 0.14, ease: 'power2.in' }, 0.08)
    // the app listens: a still of it first (it stays under the clip, for a browser that cannot play the clip)…
    .to(listen, { autoAlpha: 1, duration: 0.14, ease: 'power1.inOut' }, 0.04)
    // …then the real app at work, at its own speed. The clip is never played: its time is a
    // property the timeline tweens, so a held frame and a step Back show the right picture.
    .to(clip, { autoAlpha: 1, duration: 0.1, ease: 'none' }, rolls)
    .to(clip, { currentTime: product.demo.clip.seconds, duration: product.demo.clip.seconds, ease: 'none' }, rolls)
    // the filled form, as the app shows it once the details are complete
    .to(done, { autoAlpha: 1, duration: 0.24, ease: 'power1.inOut' }, filled - 0.14)
    // Filed 10:42 am
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.24)
    .to(stamp, { scale: 1, rotation: -7, duration: 0.24, ease: E.slam }, hit - 0.24)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.5, autoAlpha: 0, duration: 0.44, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, hit, 3)

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
  highlight: 'on the spot',
  Before,
  Screen,
  Stat,
  OnDevice,
  animate,
}

export default byot
