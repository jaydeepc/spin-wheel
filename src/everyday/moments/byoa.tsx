'use client'

/**
 * BYOA · Build Your Own Agents · 12:30 pm, over chai.
 *
 * The one idea: SHE BUILT AN AGENT HERSELF, by telling it what to check in plain words,
 * and now it works for her.
 *
 * Before   a pile of lead forms, ticked off by hand; the three who are ready wait at the back
 * Demo     her three plain-word instructions fly out of B·Y·O and the agent itself out of A,
 *          and assemble on the phone into Lead Screener
 * Run      five new leads leave the list beside the phone, pass through the agent one by one
 *          (its three checks light for each) and come out sorted: Ready to call, Needs documents
 * Result   5 leads → 3 Ready to call, 2 Needs documents
 * Stat     623 agents, each a small face; the phone flies into hers
 *
 * Everything here is BYOA's own. The name, the phone, the photo, the headline, the number,
 * the hand-over and the touch invitation come from the shared frame.
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
const Handset = () => (
  <svg viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

// ====================================================================== BEFORE
/** A pile of lead forms on her desk. She ticks the top one by hand; the ready ones are underneath. */
function Before({ product }: P) {
  const { leads, readyLabel } = product.demo
  const waiting = leads.filter((l) => l.ready)
  const rest = leads.filter((l) => !l.ready)
  const front = rest[0]
  // back to front: the three who are ready lie at the very back of the pile
  const back = [...waiting, ...rest.slice(1)]
  return (
    <div className="byoa-b">
      {back.map((l, j) => (
        <div className="byoa-b-sheet" key={l.name} style={{ ['--j' as string]: j } as CSSProperties}>
          <p className="byoa-b-strip">
            <b>{l.name}</b>
            {l.ready ? (
              <span className="byoa-b-ready">
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="6" cy="6" r="4.6" />
                  <path d="M6 3.4V6l1.8 1.3" />
                </svg>
                {readyLabel}
              </span>
            ) : null}
          </p>
        </div>
      ))}
      <div className="byoa-b-sheet byoa-b-front" style={{ ['--j' as string]: back.length } as CSSProperties}>
        <p className="byoa-b-head">
          <b>{front.name}</b>
          <span>{front.amount}</span>
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
/** Lead Screener, the agent she built: what she told it, and the two piles it sorts leads into. */
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
            <span>Built by Priya</span>
          </span>
          <span className="byoa-appbadge">on {product.name}</span>
        </div>
      </div>

      <div className="byoa-brain">
        <i className="byoa-brain-sweep" />
        <p className="byoa-brain-head">
          <Said />
          Told in plain words
        </p>
        {d.recipe.map((r, i) => (
          <div className="byoa-slot byoa-slot--step" key={r}>
            <i className="byoa-slot-outline" />
            <div className="byoa-block byoa-step">
              <span className="byoa-step-n">{i + 1}</span>
              <span className="byoa-step-t">{r}</span>
              <i className="byoa-light">
                <i className="byoa-light-glow" />
                <i className="byoa-light-glow byoa-light-glow--warm" />
                <i className="byoa-light-on">
                  <Tick width={3.6} />
                </i>
              </i>
            </div>
          </div>
        ))}
      </div>

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
                  <span className="byoa-row-amt">{l.amount}</span>
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
                  <i className="byoa-row-mark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.8" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5.5v8M12 18.3v.2" />
                    </svg>
                  </i>
                  <span className="byoa-row-name">{l.name}</span>
                  <span className="byoa-row-amt">{l.amount}</span>
                  <span className="byoa-row-ask">
                    <Said />
                    <span>{l.ask}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="byoa-runzone">
        <div className="byoa-runWrap">
          <TouchControl label={`Run ${d.agent} on ${d.leads.length} new leads`} className="byoa-run">
            <span className="byoa-run-face">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path className="byoa-run-g--play" d="M8.6 5.4v13.2a.9.9 0 0 0 1.37.77l10.5-6.6a.9.9 0 0 0 0-1.54L9.97 4.63a.9.9 0 0 0-1.37.77z" fill="#fff" stroke="none" />
                <g className="byoa-run-g--dots" fill="#fff" stroke="none">
                  <circle cx="5.5" cy="12" r="2.1" />
                  <circle cx="12" cy="12" r="2.1" />
                  <circle cx="18.5" cy="12" r="2.1" />
                </g>
                <path className="byoa-run-g--check" d="M5 12.5 10 17.5 19.5 7" />
              </svg>
            </span>
          </TouchControl>
        </div>
        <div className="byoa-run-hint">
          <span>Tap to run on {d.leads.length} new leads</span>
          <span>Screening</span>
          <span>{d.leads.length} leads screened</span>
        </div>
      </div>
    </div>
  )
}

/** The pay-off sits on the phone's edge and travels with it: three calls worth making. */
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

// ====================================================================== AROUND THE DEVICE
/** Left column: the whole build. Three things said in plain words. */
function Under({ product }: P) {
  return (
    <div className="byoa-kit">
      {product.demo.recipe.map((r) => (
        <span className="byoa-kit-chip" key={r}>
          <Said />
          {r}
        </span>
      ))}
      <span className="byoa-kit-chip byoa-kit-chip--solid">In plain words</span>
    </div>
  )
}

/** Under the photo: this morning's new leads, waiting. */
function Beside({ product }: P) {
  const { leads } = product.demo
  return (
    <div className="byoa-inbox">
      <p className="byoa-inbox-head">
        New leads
        <b>{leads.length}</b>
      </p>
      {leads.map((l) => (
        <div className={l.ready ? 'byoa-in-row' : 'byoa-in-row byoa-in-row--needs'} key={l.name}>
          <span className="byoa-in-body">
            <span className="byoa-in-name">{l.name}</span>
            <span className="byoa-in-amt">{l.amount}</span>
          </span>
          <i className="byoa-in-mark">
            {l.ready ? (
              <Tick width={3.8} />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.8" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5.5v8M12 18.3v.2" />
              </svg>
            )}
          </i>
        </div>
      ))}
    </div>
  )
}

/** Under the result headline: five leads in, three calls worth making. */
function Proof({ product }: P) {
  const { leads, readyLabel, needsLabel } = product.demo
  const ready = leads.filter((l) => l.ready).length
  return (
    <div className="byoa-proof">
      <span className="byoa-proof-item byoa-proof-in">
        <b>{leads.length}</b> leads
      </span>
      <svg className="byoa-proof-item" viewBox="0 0 40 20" fill="none" stroke="#2d6ad1" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 10h34M28 3l8 7-8 7" />
      </svg>
      <span className="byoa-proof-item byoa-proof-ready">
        <b>{ready}</b> {readyLabel}
      </span>
      <span className="byoa-proof-item byoa-proof-needs">
        <b>{leads.length - ready}</b> {needsLabel}
      </span>
    </div>
  )
}

/** Things that fly: her three instructions and the agent (letters → phone), and the five leads (the list → the agent). */
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
      {d.leads.map((l) => (
        <div className="byoa-lead" key={l.name} aria-hidden="true">
          <span className="byoa-in-name">{l.name}</span>
          <span className="byoa-in-amt">{l.amount}</span>
        </div>
      ))}
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
          <span>Built by Priya</span>
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
  const readyTabs = $$('.byoa-b-ready')
  const checks = $$('.byoa-b-check')
  const tick = $<SVGPathElement>('.byoa-b-tick')
  const pencil = $('.byoa-b-pencil')
  const counter = $('.byoa-b-count')
  gsap.set(sheets, { autoAlpha: 0, y: 3 * U, rotation: (i) => tilt[i] * 3.5, transformOrigin: '12% 50%' })
  gsap.set(strips, { autoAlpha: 0 })
  gsap.set(readyTabs, { autoAlpha: 0, scale: 0.5, transformOrigin: '0 50%' })
  gsap.set(checks, { autoAlpha: 0, x: -0.6 * U })
  gsap.set(tick, { drawSVG: '0%' })
  gsap.set(pencil, { autoAlpha: 0, x: 2.4 * U, y: -5 * U, rotation: -14 })
  gsap.set(counter, { autoAlpha: 0, scale: 0.6, rotation: 14 })
  before
    // the pile is dealt, back to front
    .to(sheets, { autoAlpha: 1, y: 0, rotation: (i) => tilt[i], duration: 0.55, stagger: 0.05, ease: E.snap }, 0.04)
    .to(strips, { autoAlpha: 1, duration: 0.25, stagger: 0.05 }, 0.16)
    .to(checks, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05 }, 0.34)
    .to(counter, { autoAlpha: 1, scale: 1, rotation: 5, duration: 0.5, ease: E.snap }, 0.3)
    // she ticks the first box by hand…
    .to(pencil, { autoAlpha: 1, x: -0.45 * U, y: -2.4 * U, rotation: 0, duration: 0.24, ease: 'power2.out' }, 0.26)
    .to(tick, { drawSVG: '100%', duration: 0.2, ease: 'power1.inOut' }, 0.5)
    .to(pencil, { x: 0.05 * U, y: -1.95 * U, duration: 0.07, ease: 'power1.in' }, 0.5)
    .to(pencil, { x: 1.15 * U, y: -3.5 * U, duration: 0.13, ease: 'power1.out' }, 0.57)
    // …and moves on to the next. The ready ones are still underneath.
    .to(pencil, { x: 0, y: 0, rotation: 4, duration: 0.15, ease: 'power2.inOut' }, 0.7)
    .to(readyTabs, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.06, ease: 'back.out(2.6)' }, 0.42)

  // ---------------------------------------------------------------- demo: three instructions and an agent leave the letters and become Lead Screener
  const parts = $$('.byoa-part') // B, Y, O: what she told it. A: the agent.
  const slots = [...$$('.byoa-slot--step'), $('.byoa-slot--id')]
  const blocks = slots.map((s) => s.querySelector('.byoa-block') as HTMLElement)
  const outlines = slots.map((s) => s.querySelector('.byoa-slot-outline') as HTMLElement)
  const brainHead = $('.byoa-brain-head')
  const bins = $$('.byoa-bin')
  const avatarRing = $('.byoa-avatar-ring')
  const eyes = $$('.byoa-avatar .byoa-eyes')
  const runWrap = $('.byoa-runWrap')
  const hints = $$('.byoa-run-hint span')
  const inboxHead = $('.byoa-inbox-head')
  const inRows = $$('.byoa-in-row')

  // measure while the stage stands as it will during the demo and the run
  const slotBox = slots.map((s) => loc(s))
  const partBox = parts.map((p) => ({ w: p.offsetWidth, h: p.offsetHeight }))
  const brain = $('.byoa-brain')
  const brainBox = loc(brain)
  const zoom = brainBox.w / (brain.offsetWidth || 1)
  const rowBox = inRows.map((r) => loc(r))
  const chips = $$('.byoa-lead')
  const chipW = chips.map((c) => c.offsetWidth)

  gsap.set(blocks, { autoAlpha: 0, scale: 0.94 })
  gsap.set(brainHead, { autoAlpha: 0 })
  gsap.set(bins, { autoAlpha: 0, y: 0.8 * U })
  gsap.set(avatarRing, { autoAlpha: 0, scale: 0.8 })
  gsap.set(eyes, { transformOrigin: '50% 50%' })
  gsap.set(runWrap, { autoAlpha: 0, scale: 0 })
  gsap.set(hints, { autoAlpha: 0 })
  gsap.set(inboxHead, { autoAlpha: 0 })
  gsap.set(inRows, { autoAlpha: 0, x: 1.4 * U })
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
    env.bump(demo, land - 0.06)
  })
  demo
    .to(brainHead, { autoAlpha: 1, duration: 0.3 }, 0.5)
    .to(bins, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07 }, 0.62)
    // the agent wakes: it blinks, and is ready
    .to(avatarRing, { autoAlpha: 0.9, duration: 0.01 }, 0.9)
    .to(avatarRing, { scale: 1.9, autoAlpha: 0, duration: 0.34, ease: 'power2.out' }, 0.91)
    .to(eyes, { scaleY: 0.12, duration: 0.07, ease: 'power1.in' }, 0.92)
    .to(eyes, { scaleY: 1, duration: 0.14, ease: 'power2.out' }, 0.99)
    // this morning's leads arrive beside it
    .to(inboxHead, { autoAlpha: 1, duration: 0.3 }, 0.55)
    .to(inRows, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05 }, 0.6)
    .to(runWrap, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'back.out(2.4)' }, 0.78)
    .to(hints[0], { autoAlpha: 1, duration: 0.25 }, 0.95)

  // ---------------------------------------------------------------- run: five leads pass through the agent and come out sorted
  const face = $('.byoa-run-face')
  const playGlyph = $('.byoa-run-g--play')
  const dotsGlyph = $('.byoa-run-g--dots')
  const dots = $$('.byoa-run-g--dots circle')
  const checkGlyph = $('.byoa-run-g--check')
  const sweep = $('.byoa-brain-sweep')
  const lightsOn = $$('.byoa-light-on')
  const glows = $$('.byoa-light-glow:not(.byoa-light-glow--warm)')
  const warm = $$('.byoa-light-glow--warm')
  const inBodies = $$('.byoa-in-body')
  const inMarks = $$('.byoa-in-mark')
  const counts = $$('.byoa-bin-count')
  const tag = $('.byoa-tag')
  const burst = $('.byoa-tag-burst')

  gsap.set(playGlyph, { transformOrigin: '50% 50%' })
  gsap.set(dotsGlyph, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
  gsap.set(checkGlyph, { drawSVG: '0%' })
  gsap.set(sweep, { yPercent: -105 })
  gsap.set(lightsOn, { scale: 0, autoAlpha: 0 })
  gsap.set([...glows, ...warm], { autoAlpha: 0 })
  gsap.set(inMarks, { scale: 0, autoAlpha: 0 })
  gsap.set($$('.byoa-row'), { autoAlpha: 0, y: -1.3 * U, scale: 0.94 })
  gsap.set($$('.byoa-row-mark'), { scale: 0 })
  gsap.set($$('.byoa-row-ask'), { clipPath: clipShut })
  gsap.set(chips, { x: (i) => rowBox[i].x + chipW[i] / 2, y: (i) => rowBox[i].cy, xPercent: -50, yPercent: -50, autoAlpha: 0 })
  gsap.set(tag, { autoAlpha: 0, scale: 1.9, rotation: -18 })
  gsap.set(burst, { autoAlpha: 0 })

  run
    .to(face, { scale: 0.84, duration: 0.08, ease: 'power2.in' }, 0)
    .to(face, { scale: 1, duration: 0.4, ease: 'back.out(3.2)' }, 0.08)
    .to(playGlyph, { autoAlpha: 0, scale: 0.4, duration: 0.16, ease: 'power2.in' }, 0.03)
    .to(dotsGlyph, { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'back.out(2.4)' }, 0.14)
    .to(hints[0], { autoAlpha: 0, duration: 0.14 }, 0)
    .to(hints[1], { autoAlpha: 1, duration: 0.2 }, 0.1)

  dots.forEach((d, j) => {
    run.to(d, { y: -3.4, duration: 0.15, repeat: 9, yoyo: true, ease: 'sine.inOut' }, 0.22 + j * 0.07)
  })

  const flash = (el: Element, when: number) =>
    run.fromTo(el, { scale: 0.8, autoAlpha: 0.95 }, { scale: 2.5, autoAlpha: 0, duration: 0.3, ease: 'power2.out', immediateRender: false }, when)
  const tally = { ready: 0, needs: 0 }
  let lit = [false, false, false]
  leads.forEach((lead, k) => {
    const lift = 0.1 + k * 0.3
    const fly = lift + 0.1
    const dur = 0.42
    const land = fly + dur
    const from = { x: rowBox[k].x + chipW[k] / 2, y: rowBox[k].cy }
    // in at the top of the agent; from there it goes down through the three checks
    const to = { x: brainBox.x + brainBox.w * 0.66, y: brainBox.y + 0.85 * U * zoom }
    // a low arc through the open space between the phone and the photo
    const over = { x: from.x + (to.x - from.x) * 0.56, y: from.y + (to.y - from.y) * 0.46 - (1.2 + (k % 3) * 0.6) * U }
    const row = $(`.byoa-row[data-lead="${k}"]`)
    const ghost = row.previousElementSibling as HTMLElement
    const mark = row.querySelector('.byoa-row-mark') as HTMLElement
    const ask = row.querySelector('.byoa-row-ask') as HTMLElement | null
    const n = lead.ready ? ++tally.ready : ++tally.needs
    const count = counts[lead.ready ? 0 : 1]

    run
      // the lead lifts off the list…
      .to(inBodies[k], { autoAlpha: 0.3, duration: 0.16 }, lift)
      .to(chips[k], { autoAlpha: 1, duration: 0.01 }, lift)
      .fromTo(chips[k], { scale: 0.96 }, { scale: 1.07, duration: 0.12, ease: 'back.out(3)', immediateRender: false }, lift)
      // …and flies into the agent
      .to(chips[k], { motionPath: { path: [over, to], curviness: 1.3 }, scale: 0.62 * zoom, duration: dur, ease: 'power2.inOut' }, fly)
      .to(chips[k], { y: `+=${0.9 * U * zoom}`, autoAlpha: 0, scale: 0.4 * zoom, duration: 0.13, ease: 'power1.in' }, land - 0.03)
      .fromTo(sweep, { yPercent: -105 }, { yPercent: 105, duration: 0.28, ease: 'power1.inOut', immediateRender: false }, land - 0.02)
      .to(eyes, { scaleY: 0.12, duration: 0.05, ease: 'power1.in' }, land)
      .to(eyes, { scaleY: 1, duration: 0.11, ease: 'power2.out' }, land + 0.05)
    env.bump(run, land, 0.6)

    // its three checks, in the order she said them
    const steps = lead.ready ? [0, 1] : [0, 1, 2]
    steps.forEach((s) => {
      const t = land + 0.02 + s * 0.065
      flash(!lead.ready && s > 0 ? warm[s] : glows[s], t)
      if (!lit[s]) {
        run.to(lightsOn[s], { scale: 1, autoAlpha: 1, duration: 0.26, ease: 'back.out(3)' }, t)
        lit = lit.map((v, i) => v || i === s)
      }
    })

    // …and it comes out sorted
    const out = land + 0.14
    run
      .to(ghost, { autoAlpha: 0, duration: 0.14 }, out + 0.08)
      .to(row, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: E.snap }, out)
      .to(mark, { scale: 1, duration: 0.3, ease: 'back.out(3.2)' }, out + 0.12)
      .set(count, { textContent: n }, out + 0.1)
      .fromTo(count, { scale: 1.5 }, { scale: 1, duration: 0.28, ease: 'power2.out', immediateRender: false }, out + 0.1)
      // back on the list, it now carries its verdict
      .to(inBodies[k], { autoAlpha: 1, duration: 0.26 }, out + 0.06)
      .to(inMarks[k], { scale: 1, autoAlpha: 1, duration: 0.28, ease: 'back.out(3)' }, out + 0.1)
    if (ask) run.to(ask, { clipPath: clipOpen, duration: 0.3, ease: 'power1.inOut' }, out + 0.16)
  })

  const hit = 2.34
  run
    // all five are through
    .to(dotsGlyph, { autoAlpha: 0, scale: 0.4, duration: 0.14, ease: 'power2.in' }, hit - 0.3)
    .to(checkGlyph, { drawSVG: '100%', duration: 0.3, ease: 'power2.out' }, hit - 0.2)
    .to(hints[1], { autoAlpha: 0, duration: 0.14 }, hit - 0.3)
    .to(hints[2], { autoAlpha: 1, duration: 0.2 }, hit - 0.2)
    // three calls worth making
    .to(tag, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.24)
    .to(tag, { scale: 1, rotation: -5, duration: 0.24, ease: E.slam }, hit - 0.24)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.6, autoAlpha: 0, duration: 0.44, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, hit, 3)

  // ---------------------------------------------------------------- result: five leads in, three calls
  const proof = $$('.byoa-proof-item')
  gsap.set(proof, { autoAlpha: 0, y: 0.7 * U })
  result.to(proof, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: E.snap }, 0.44)

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

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: bots[OUR_BOT] }
}

const byoa: MomentModule<ByoaProduct> = {
  key: 'byoa',
  device: 'phone',
  demoTitle: BYOA.demo.agent,
  demoLine: BYOA.demo.builtBy,
  highlight: 'Her own agent',
  clock: '12:34',
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

export default byoa
