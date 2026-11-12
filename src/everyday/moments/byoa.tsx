'use client'

/**
 * BYOA · Build Your Own Agents · 12:30 pm, over chai.
 *
 * The one idea: SHE BUILT AN AGENT HERSELF, by telling it what to check in plain words,
 * and now it works for her.
 *
 * THE BUDGET (moments/README.md): at every rest the screen holds the name, at most one
 * statement, Priya's bubble and ONE picture. So everything BYOA has to say is INSIDE the phone:
 *
 * Before   a pile of lead forms; she ticks the one on top by hand: 1 of 5
 * Demo     her three plain-word instructions fly out of B·Y·O and the agent itself out of A,
 *          and assemble on the phone into Lead Screener: its name and who built it, the three
 *          things she told it (large: they are the whole build), five new leads waiting, the control
 * Run      the build folds away: the three lines become one row of three lights. The five leads
 *          go into the agent in one sweep and come out sorted, one by one, the lights checking
 *          each: Ready to call (the names), Needs documents (the names, and the one thing to ask)
 * Result   the phone rests on the two lists, and ONE tag: 3 Ready to call
 * Stat     623 agents, each a small face; the phone flies into hers
 *
 * Everything here is BYOA's own. The name, the phone, the headline, the number, Priya's
 * bubble, the hand-over and the touch invitation come from the shared frame.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { productByKey, type ByoaProduct } from '../content'
import { TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './byoa.css'

type P = PartProps<ByoaProduct>
const BYOA = productByKey('byoa') as ByoaProduct

/** What she checks by hand on every form: the same three things she will tell the agent. */
const BY_HAND = ['Eligibility', 'Documents', 'What to ask']

// ---------------------------------------------------------------- the 623: a field of small agents, packed like a honeycomb
const BOT_COUNT = Number(BYOA.stat.value) || 623
const BOT_COLS = 32
const BOT_ROW_STEP = 0.87
const BOT_TOP = 1.2
const BOTS = (() => {
  const out: { x: number; y: number }[] = []
  for (let r = 0; out.length < BOT_COUNT; r++) {
    const odd = r % 2 === 1
    const n = odd ? BOT_COLS - 1 : BOT_COLS
    for (let c = 0; c < n && out.length < BOT_COUNT; c++) out.push({ x: c + (odd ? 0.5 : 0), y: BOT_TOP + r * BOT_ROW_STEP })
  }
  return out
})()
/** Which of the 623 is Lead Screener: row 9, the eleventh along. */
const OUR_BOT = 5 * BOT_COLS + 4 * (BOT_COLS - 1) + 10

const at = (x: number, y: number) => ({ ['--x' as string]: x, ['--y' as string]: y }) as CSSProperties

// ---------------------------------------------------------------- glyphs
const Tick = ({ stroke = '#fff', width = 3.2 }: { stroke?: string; width?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5 10 17.5 19 7.5" />
  </svg>
)
/** The agent: a small friendly head. Its eyes blink when a lead comes in. */
const Bot = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3.6v3.2" />
    <circle cx="12" cy="3.1" r="1.35" fill="#fff" stroke="none" />
    <rect x="3.6" y="6.8" width="16.8" height="12.8" rx="4.6" />
    <g className="byoa-eyes">
      <circle cx="9.1" cy="13.1" r="1.65" fill="#fff" stroke="none" />
      <circle cx="14.9" cy="13.1" r="1.65" fill="#fff" stroke="none" />
    </g>
  </svg>
)
/** Said, not coded: a speech mark. */
const Said = () => (
  <svg className="byoa-said" viewBox="0 0 20 18" aria-hidden="true">
    <path d="M3.4 1h13.2A2.4 2.4 0 0 1 19 3.4v7.2a2.4 2.4 0 0 1-2.4 2.4H9.2L4.6 17v-4H3.4A2.4 2.4 0 0 1 1 10.6V3.4A2.4 2.4 0 0 1 3.4 1z" />
  </svg>
)
/** "An agent built by Priya, on BYOA" → who built it: the line in the agent's own header. */
const builtByHer = (builtBy: string) => builtBy.split(',')[0]
const Handset = () => (
  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

// ====================================================================== BEFORE
/** A pile of lead forms on her desk. She ticks the one on top by hand: one of five. */
function Before({ product }: P) {
  const { leads } = product.demo
  const rest = leads.filter((l) => !l.ready)
  const front = rest[0]
  // back to front: the others wait their turn underneath
  const back = [...leads.filter((l) => l.ready), ...rest.slice(1)]
  return (
    <div className="byoa-b">
      {back.map((l, j) => (
        <div className="byoa-b-sheet" key={l.name} style={{ ['--j' as string]: j } as CSSProperties}>
          <p className="byoa-b-strip">
            <b>{l.name}</b>
          </p>
        </div>
      ))}
      <div className="byoa-b-sheet byoa-b-front" style={{ ['--j' as string]: back.length } as CSSProperties}>
        <p className="byoa-b-head">
          <b>{front.name}</b>
        </p>
        {BY_HAND.map((label, i) => (
          <p className="byoa-b-check" key={label}>
            <span>{label}</span>
            <i className="byoa-b-box">
              {i === 0 ? (
                <svg viewBox="0 0 30 30" fill="none" stroke="#15244b" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path className="byoa-b-tick" d="M5 15.5 12 23 28 3" />
                </svg>
              ) : null}
            </i>
          </p>
        ))}
        <span className="byoa-b-pencil" aria-hidden="true">
          <svg viewBox="0 0 60 10">
            <path d="M0 5 6.5 2.2v5.6z" fill="#15244b" />
            <path d="M6.5 2.2 13 0v10L6.5 7.8z" fill="#fbd6cd" />
            <rect x="13" y="0" width="36" height="10" fill="#4384d4" />
            <rect x="13" y="0" width="36" height="3.2" fill="#65a9f5" />
            <rect x="49" y="0" width="4.5" height="10" fill="#d7e2ee" />
            <rect x="53.5" y="0" width="6.5" height="10" rx="2.6" fill="#f8b9a6" />
          </svg>
        </span>
      </div>
      <div className="byoa-b-count">
        <span>By hand</span>
        <b>
          1<small> of {leads.length}</small>
        </b>
      </div>
    </div>
  )
}

// ====================================================================== SCREEN
/**
 * Lead Screener, the agent she built. As she built it: its name and who built it, the three
 * things she told it, five new leads waiting, the one control. As it runs: the three lines fold
 * into one row of lights, and the leads come out in two lists.
 */
function Screen({ product }: P) {
  const d = product.demo
  const ready = d.leads.map((l, k) => ({ ...l, k })).filter((l) => l.ready)
  const needs = d.leads.map((l, k) => ({ ...l, k })).filter((l) => !l.ready)
  return (
    <div className="byoa-app">
      <div className="byoa-slot byoa-slot--id">
        <i className="byoa-slot-outline" />
        <div className="byoa-block byoa-id">
          <span className="byoa-avatar">
            <i className="byoa-avatar-ring" />
            <Bot />
          </span>
          <span className="byoa-apptitle">
            <b>{d.agent}</b>
            <span className="byoa-appby">{builtByHer(d.builtBy)}</span>
          </span>
        </div>
      </div>

      {/* what she told it, in plain words: the agent's whole brain */}
      <div className="byoa-brain">
        <i className="byoa-brain-bg" />
        {/* the same three, folded into one row, once it runs */}
        <i className="byoa-fold" />
        {d.recipe.map((r, i) => (
          <div className="byoa-slot byoa-slot--step" key={r} style={{ ['--i' as string]: i } as CSSProperties}>
            <i className="byoa-slot-outline" />
            <div className="byoa-block byoa-step">
              <span className="byoa-step-t">{r}</span>
            </div>
            <span className="byoa-light">
              <i className="byoa-light-glow" />
              <i className="byoa-light-glow byoa-light-glow--warm" />
              <b>{i + 1}</b>
              <b className="byoa-light-on">{i + 1}</b>
            </span>
          </div>
        ))}
      </div>

      {/* the new leads, waiting, and the one control */}
      <div className="byoa-queue">
        <div className="byoa-pile" data-ev-solid aria-hidden="true">
          {d.leads.map((l, k) => (
            <i className="byoa-card" key={l.name} style={{ ['--k' as string]: k } as CSSProperties} />
          ))}
        </div>
        {/* (the words stand between the leads and the control: they belong to both) */}
        <p className="byoa-run-hint">Tap to run on {d.leads.length} new leads</p>
        <div className="byoa-runWrap">
          <TouchControl label={`Run ${d.agent} on ${d.leads.length} new leads`} className="byoa-run">
            <span className="byoa-run-face">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.6 5.4v13.2a.9.9 0 0 0 1.37.77l10.5-6.6a.9.9 0 0 0 0-1.54L9.97 4.63a.9.9 0 0 0-1.37.77z" fill="#fff" />
              </svg>
            </span>
          </TouchControl>
        </div>
      </div>

      {/* what comes out: two lists */}
      <div className="byoa-bins">
        <div className="byoa-bin byoa-bin--ready">
          <p className="byoa-bin-head">
            <span className="byoa-bin-icon">
              <Handset />
            </span>
            {d.readyLabel}
            <b className="byoa-bin-count">0</b>
          </p>
          <div className="byoa-bin-rows">
            {ready.map((l) => (
              <div className="byoa-place" key={l.name}>
                <i className="byoa-place-ghost" />
                <div className="byoa-row" data-lead={l.k}>
                  <i className="byoa-row-mark">
                    <Tick width={3.8} />
                  </i>
                  <span className="byoa-row-name">{l.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="byoa-bin byoa-bin--needs">
          <p className="byoa-bin-head">
            <span className="byoa-bin-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 3.5h7l4 4v13H7z" />
                <path d="M10 12.5h5M10 16h3" />
              </svg>
            </span>
            {d.needsLabel}
            <b className="byoa-bin-count">0</b>
          </p>
          <div className="byoa-bin-rows">
            {needs.map((l) => (
              <div className="byoa-place" key={l.name}>
                <i className="byoa-place-ghost" />
                <div className="byoa-row byoa-row--needs" data-lead={l.k}>
                  <span className="byoa-row-name">{l.name}</span>
                  <span className="byoa-row-ask">{l.ask}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** The ONE thing on the phone at the result: three calls worth making. It lands on the head of that list. */
function OnDevice({ product }: P) {
  const d = product.demo
  return (
    <div className="byoa-tag">
      <i className="byoa-tag-burst" />
      <span className="byoa-tag-icon">
        <Handset />
      </span>
      <b>{d.leads.filter((l) => l.ready).length}</b>
      <span className="byoa-tag-t">{d.readyLabel}</span>
    </div>
  )
}

// ====================================================================== THE THINGS THAT FLY
/** Her three instructions and the agent: out of the letters, into the phone. */
function Extras({ product }: P) {
  const d = product.demo
  return (
    <>
      {d.recipe.map((r) => (
        <div className="byoa-part" key={r} aria-hidden="true">
          <Said />
          {r}
        </div>
      ))}
      <div className="byoa-part byoa-part--agent" aria-hidden="true">
        <span className="byoa-part-bot">
          <Bot />
        </span>
        {d.agent}
      </div>
    </>
  )
}

// ====================================================================== STAT
/** 623 agents built by the business. One of them is hers. */
function Stat({ product }: P) {
  const ours = BOTS[OUR_BOT]
  return (
    <div className="byoa-field">
      {BOTS.map((b, i) => (
        <i className={i === OUR_BOT ? 'byoa-bot byoa-bot--ours' : 'byoa-bot'} key={i} style={at(b.x, b.y)} />
      ))}
      <div className="byoa-callout" style={at(ours.x, ours.y)}>
        <div className="byoa-callout-in">
          <b>{product.demo.agent}</b>
          <span>{builtByHer(product.demo.builtBy)}</span>
        </div>
      </div>
    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<ByoaProduct>) {
  const { $, $$, U, ease: E, loc, letters, before, demo, run, result, stat, product } = env
  const leads = product.demo.leads
  const clipShut = 'inset(0% 100% 0% 0%)'
  const clipOpen = 'inset(0% 0% 0% 0%)'

  // ---------------------------------------------------------------- before: the pile, one tick at a time
  const sheets = $$('.byoa-b-sheet')
  const tilt = [1.1, -0.8, 0.9, -1.2, -0.6]
  const strips = $$('.byoa-b-strip')
  const checks = $$('.byoa-b-check')
  const tick = $<SVGPathElement>('.byoa-b-tick')
  const pencil = $('.byoa-b-pencil')
  const counter = $('.byoa-b-count')
  /** one row of the form, in pixels: the pencil's tip moves from box to box by this */
  const rowH = checks[0].offsetHeight
  gsap.set(sheets, { autoAlpha: 0, y: 3 * U, rotation: (i) => tilt[i] * 3.5, transformOrigin: '12% 50%' })
  gsap.set(strips, { autoAlpha: 0 })
  gsap.set(checks, { autoAlpha: 0, x: -0.6 * U })
  gsap.set(tick, { drawSVG: '0%' })
  gsap.set(pencil, { autoAlpha: 0, x: 2.4 * U, y: -rowH - 2.6 * U, rotation: -14 })
  gsap.set(counter, { autoAlpha: 0, scale: 0.6, rotation: 14 })
  before
    // the pile is dealt, back to front
    .to(sheets, { autoAlpha: 1, y: 0, rotation: (i) => tilt[i], duration: 0.55, stagger: 0.05, ease: E.snap }, 0.04)
    .to(strips, { autoAlpha: 1, duration: 0.25, stagger: 0.05 }, 0.16)
    .to(checks, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05 }, 0.34)
    .to(counter, { autoAlpha: 1, scale: 1, rotation: 5, duration: 0.5, ease: E.snap }, 0.3)
    // she ticks the first box by hand…
    .to(pencil, { autoAlpha: 1, x: -0.45 * U, y: -rowH, rotation: 0, duration: 0.24, ease: 'power2.out' }, 0.26)
    .to(tick, { drawSVG: '100%', duration: 0.2, ease: 'power1.inOut' }, 0.5)
    .to(pencil, { x: 0.05 * U, y: -rowH + 0.45 * U, duration: 0.07, ease: 'power1.in' }, 0.5)
    .to(pencil, { x: 1.15 * U, y: -rowH - 1.1 * U, duration: 0.13, ease: 'power1.out' }, 0.57)
    // …and moves on to the next
    .to(pencil, { x: 0, y: 0, rotation: 4, duration: 0.15, ease: 'power2.inOut' }, 0.7)

  // ---------------------------------------------------------------- demo: three instructions and an agent leave the letters and become Lead Screener
  const parts = $$('.byoa-part') // B, Y, O: what she told it. A: the agent.
  const stepSlots = $$('.byoa-slot--step')
  const slots = [...stepSlots, $('.byoa-slot--id')]
  const blocks = slots.map((s) => s.querySelector('.byoa-block') as HTMLElement)
  const outlines = slots.map((s) => s.querySelector('.byoa-slot-outline') as HTMLElement)
  const lights = $$('.byoa-light')
  const brain = $('.byoa-brain')
  const brainBg = $('.byoa-brain-bg')
  const fold = $('.byoa-fold')
  const avatar = $('.byoa-avatar')
  const avatarRing = $('.byoa-avatar-ring')
  const eyes = $$('.byoa-avatar .byoa-eyes')
  const title = $('.byoa-apptitle b')
  const appby = $('.byoa-appby')
  const cards = $$('.byoa-card')
  const runWrap = $('.byoa-runWrap')
  const hint = $('.byoa-run-hint')
  const bins = $$('.byoa-bin')
  const readyHead = $('.byoa-bin--ready .byoa-bin-head')
  const tag = $('.byoa-tag')
  const burst = $('.byoa-tag-burst')

  // ---- measured while the stage stands as it does during the demo, the run and the result ----
  const dev = loc(env.shared.device)
  /** how much the frame has enlarged the phone: a length on the glass is this many times its own */
  const zoom = dev.w / (env.shared.device.offsetWidth || 1)
  const slotBox = slots.map((s) => loc(s))
  const partBox = parts.map((p) => ({ w: p.offsetWidth, h: p.offsetHeight }))
  // the fold: each light leaves its line for its place in the one row (lengths on the glass, before the enlargement)
  const foldY = fold.offsetTop + fold.offsetHeight / 2
  const foldStep = fold.offsetHeight * 1.55
  const foldTo = lights.map((l, i) => {
    const slot = stepSlots[i]
    return {
      x: brain.offsetWidth / 2 + (i - 1) * foldStep - (slot.offsetLeft + l.offsetLeft + l.offsetWidth / 2),
      y: foldY - (slot.offsetTop + l.offsetTop + l.offsetHeight / 2),
    }
  })
  // the five leads go into the agent
  const avatarBox = loc(avatar)
  const cardTo = cards.map((c) => {
    const b = loc(c)
    return { x: (avatarBox.cx - b.cx) / zoom, y: (avatarBox.cy - b.cy) / zoom }
  })
  // with its second line gone, the agent's name stands level with its face
  const titleY = (avatar.offsetHeight - title.offsetHeight) / 2 - title.offsetTop + avatar.offsetTop
  // the tag lands on the head of the list it counts, a little off the phone's right edge
  const headBox = loc(readyHead)
  const tagBox = loc(tag)
  const tagAt = { x: (headBox.cx - tagBox.cx) / zoom + 1.2 * U, y: (headBox.cy - tagBox.cy) / zoom }

  gsap.set(blocks, { autoAlpha: 0, scale: 0.94 })
  gsap.set(lights, { autoAlpha: 0, scale: 0.4 })
  gsap.set(fold, { autoAlpha: 0 })
  gsap.set(avatarRing, { autoAlpha: 0, scale: 0.8 })
  gsap.set(eyes, { transformOrigin: '50% 50%' })
  gsap.set(cards, { autoAlpha: 0, y: 1.6 * U, rotation: 0 })
  gsap.set(runWrap, { autoAlpha: 0, scale: 0 })
  gsap.set(hint, { autoAlpha: 0 })
  gsap.set(parts, { x: (i) => letters[i].cx, y: (i) => letters[i].cy, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
  parts.forEach((p, i) => {
    const from = { x: letters[i].cx, y: letters[i].cy }
    const to = { x: slotBox[i].cx, y: slotBox[i].cy }
    // a thrown arc: up and over, each on its own curve, then down into its place
    const over = { x: from.x + (to.x - from.x) * 0.55, y: Math.min(from.y, to.y) - (3.2 + (3 - i) * 1.2) * U }
    const born = 0.02 + i * 0.045
    const fly = 0.18 + i * 0.065
    const dur = 0.54
    const land = fly + dur
    demo
      .to(p, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(2.2)' }, born)
      .to(p, { motionPath: { path: [over, to], curviness: 1.25 }, duration: dur, ease: 'power2.inOut' }, fly)
      .to(p, { rotation: to.x > from.x ? 8 : -8, duration: dur * 0.45, ease: 'sine.out' }, fly)
      .to(p, { rotation: 0, duration: dur * 0.55, ease: 'sine.inOut' }, fly + dur * 0.45)
      .to(p, { scaleX: slotBox[i].w / partBox[i].w, scaleY: slotBox[i].h / partBox[i].h, autoAlpha: 0, duration: 0.2, ease: 'power2.out' }, land - 0.05)
      .to(outlines[i], { autoAlpha: 0, duration: 0.18 }, land - 0.05)
      .to(blocks[i], { autoAlpha: 1, scale: 1, duration: 0.32, ease: E.snap }, land - 0.05)
    if (lights[i]) demo.to(lights[i], { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2.6)' }, land + 0.04)
    env.bump(demo, land - 0.06)
  })
  demo
    // the agent wakes: it blinks, and is ready
    .to(avatarRing, { autoAlpha: 0.9, duration: 0.01 }, 0.9)
    .to(avatarRing, { scale: 1.9, autoAlpha: 0, duration: 0.34, ease: 'power2.out' }, 0.91)
    .to(eyes, { scaleY: 0.12, duration: 0.07, ease: 'power1.in' }, 0.92)
    .to(eyes, { scaleY: 1, duration: 0.14, ease: 'power2.out' }, 0.99)
    // this morning's five leads are dealt under it, and the control with them
    .to(cards, { autoAlpha: 1, y: 0, rotation: (i) => (i - 2) * 4, duration: 0.36, stagger: 0.04, ease: E.snap }, 0.66)
    .to(runWrap, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'back.out(2.4)' }, 0.8)
    .to(hint, { autoAlpha: 1, duration: 0.25 }, 0.95)

  // ---------------------------------------------------------------- run: the build folds away; five leads go in and come out sorted
  const face = $('.byoa-run-face')
  const stepTexts = stepSlots.map((s) => s.querySelector('.byoa-block') as HTMLElement)
  const lightsOn = $$('.byoa-light-on')
  const glows = $$('.byoa-light-glow:not(.byoa-light-glow--warm)')
  const warm = $$('.byoa-light-glow--warm')
  const counts = $$('.byoa-bin-count')

  gsap.set(lightsOn, { autoAlpha: 0 })
  gsap.set([...glows, ...warm], { autoAlpha: 0 })
  gsap.set(bins, { autoAlpha: 0, y: 1.6 * U })
  gsap.set($$('.byoa-row'), { autoAlpha: 0, y: -1.3 * U, scale: 0.94 })
  gsap.set($$('.byoa-row-mark'), { scale: 0 })
  gsap.set($$('.byoa-row-ask'), { clipPath: clipShut })
  gsap.set(tag, { x: tagAt.x, y: tagAt.y, autoAlpha: 0, scale: 1.9, rotation: -16 })
  gsap.set(burst, { autoAlpha: 0 })

  run
    // the press
    .to(face, { scale: 0.84, duration: 0.08, ease: 'power2.in' }, 0)
    .to(face, { scale: 1, duration: 0.3, ease: 'back.out(3.2)' }, 0.08)
    .to(hint, { autoAlpha: 0, y: -0.5 * U, duration: 0.14, ease: 'power2.in' }, 0)
    // the build folds away: her three lines leave, top to bottom, and their three lights gather into one row
    .to(stepTexts, { autoAlpha: 0, x: 0.8 * U, duration: 0.2, ease: 'power2.in', stagger: 0.04 }, 0.06)
    .to(appby, { autoAlpha: 0, y: -0.4 * U, duration: 0.2, ease: 'power2.in' }, 0.06)
    .to(title, { y: titleY, duration: 0.4, ease: E.snap }, 0.16)
    .to(brainBg, { autoAlpha: 0, scaleY: 0.3, duration: 0.34, ease: 'power2.inOut' }, 0.14)
    .to(fold, { autoAlpha: 1, duration: 0.24, ease: 'power1.out' }, 0.26)
    .to(runWrap, { scale: 0, autoAlpha: 0, duration: 0.24, ease: 'back.in(2)' }, 0.3)
  lights.forEach((l, i) => {
    run.to(l, { x: foldTo[i].x, y: foldTo[i].y, duration: 0.42, ease: E.inOut }, 0.14 + i * 0.04)
  })
  // the five leads go into the agent in one sweep; it blinks as it takes them
  cards.forEach((c, k) => {
    const go = 0.2 + k * 0.06
    run
      .to(c, { x: cardTo[k].x, duration: 0.4, ease: 'power1.in' }, go)
      .to(c, { y: cardTo[k].y, rotation: 0, scale: 0.3, duration: 0.4, ease: 'power2.inOut' }, go)
      .to(c, { autoAlpha: 0, duration: 0.1, ease: 'none' }, go + 0.32)
  })
  run
    .to(avatarRing, { autoAlpha: 0.9, scale: 0.8, duration: 0.01 }, 0.56)
    .to(avatarRing, { scale: 2.1, autoAlpha: 0, duration: 0.4, ease: 'power2.out' }, 0.57)
    .to(eyes, { scaleY: 0.12, duration: 0.06, ease: 'power1.in' }, 0.56)
    .to(eyes, { scaleY: 1, duration: 0.12, ease: 'power2.out' }, 0.62)
    // the two lists rise into the room the build has left
    .to(bins, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07, ease: E.snap }, 0.42)
  env.bump(run, 0.56, 1.2)

  const flash = (el: Element, when: number) =>
    run.fromTo(el, { scale: 0.8, autoAlpha: 0.95 }, { scale: 2.4, autoAlpha: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, when)
  const tally = { ready: 0, needs: 0 }
  let lit = [false, false, false]
  leads.forEach((lead, k) => {
    const check = 0.74 + k * 0.26
    const row = $(`.byoa-row[data-lead="${k}"]`)
    const ghost = row.previousElementSibling as HTMLElement
    const mark = row.querySelector('.byoa-row-mark') as HTMLElement | null
    const ask = row.querySelector('.byoa-row-ask') as HTMLElement | null
    const n = lead.ready ? ++tally.ready : ++tally.needs
    const count = counts[lead.ready ? 0 : 1]

    // its three checks, in the order she said them (the third, what to ask, only where something is missing)
    const steps = lead.ready ? [0, 1] : [0, 1, 2]
    steps.forEach((s) => {
      const t = check + s * 0.06
      flash(!lead.ready && s > 0 ? warm[s] : glows[s], t)
      if (!lit[s]) {
        run.to(lightsOn[s], { autoAlpha: 1, duration: 0.2 }, t)
        lit = lit.map((v, i) => v || i === s)
      }
    })
    run.to(eyes, { scaleY: 0.12, duration: 0.05, ease: 'power1.in' }, check).to(eyes, { scaleY: 1, duration: 0.11, ease: 'power2.out' }, check + 0.05)

    // …and it comes out sorted
    const out = check + 0.12
    run
      .to(ghost, { autoAlpha: 0, duration: 0.14 }, out + 0.08)
      .to(row, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: E.snap }, out)
      .set(count, { textContent: n }, out + 0.1)
      .fromTo(count, { scale: 1.5 }, { scale: 1, duration: 0.28, ease: 'power2.out', immediateRender: false }, out + 0.1)
    if (mark) run.to(mark, { scale: 1, duration: 0.3, ease: 'back.out(3.2)' }, out + 0.12)
    if (ask) run.to(ask, { clipPath: clipOpen, duration: 0.3, ease: 'power1.inOut' }, out + 0.16)
    env.bump(run, out + 0.02, 0.6)
  })

  const hit = 2.34
  run
    // three calls worth making: the tag lands on the head of that list, and takes its place
    .to(tag, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.24)
    .to(tag, { scale: 1, rotation: -3, duration: 0.24, ease: E.slam }, hit - 0.24)
    .to(readyHead, { autoAlpha: 0, duration: 0.12, ease: 'none' }, hit - 0.12)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.3, autoAlpha: 0, duration: 0.44, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, hit, 3)

  // ---------------------------------------------------------------- stat: one of 623
  const bots = $$('.byoa-bot')
  const callout = $('.byoa-callout-in')
  const ours = BOTS[OUR_BOT]
  const dist = BOTS.map((b) => Math.hypot(b.x - ours.x, (b.y - ours.y) * 1.15))
  const far = Math.max(...dist)
  gsap.set(bots, { autoAlpha: 0, scale: 0.2 })
  gsap.set(callout, { autoAlpha: 0, y: 1 * U, xPercent: -50 })
  stat
    .to(bots, { autoAlpha: 1, scale: 1, duration: 0.34, ease: 'back.out(2.2)', stagger: (i: number) => 0.5 * Math.pow(dist[i] / far, 1.5) }, 0.66)
    .to(callout, { autoAlpha: 1, y: 0, duration: 0.36, ease: E.snap }, 1.12)

  // (the result step adds nothing and takes nothing away: what the run leaves on the phone IS the resting screen)
  void result

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: bots[OUR_BOT] }
}

const byoa: MomentModule<ByoaProduct> = {
  key: 'byoa',
  device: 'phone',
  highlight: 'Her own agent',
  Before,
  Screen,
  Stat,
  Extras,
  OnDevice,
  animate,
}

export default byoa
