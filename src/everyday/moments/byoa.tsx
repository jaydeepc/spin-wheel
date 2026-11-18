'use client'

/**
 * BYOA · Build Your Own Agents · 12:30 pm.      THE TEAM'S OWN AGENT ANSWERS THE QUESTION.
 *
 * The agent is REAL: Saathi, the invoice assistant the collections team built on BYOA, and the
 * film shows its REAL CHAT (content.ts → demo.shots; the supplier number and PAN are covered in
 * the pictures themselves).
 *
 * THE BUDGET (moments/README.md): at every rest the screen holds the name, at most one
 * statement, the speaker's bubble and ONE picture. What BYOA puts in that picture:
 *
 * Before   a mail to the central team asking whether a vendor's invoice is paid, and
 *          "Awaiting reply" stamped on it
 * Demo     a desktop window: Saathi with the question asked (shots.ask), and the one control:
 *          Ask Saathi
 * Run      he asks. Saathi looks it up (one sweep across the chat), the answer unrolls under the
 *          question (shots.done), the view closes in on the answer so that its rows can be read,
 *          and "Answered" is stamped on it.
 * Result   the window keeps the answer under its stamp
 * Stat     701 agents, each a small face; the window flies into Saathi's
 *
 * Everything here is BYOA's own. The name, the headline, the number, the speaker's bubble, the
 * hand-over and the touch come from the shared frame.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { productByKey, type ByoaProduct } from '../content'
import { DesktopWindow, Shot, TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './byoa.css'

type P = PartProps<ByoaProduct>
const BYOA = productByKey('byoa') as ByoaProduct

/** "Answered. No central team." → ["Answered", "No central team."] */
const lead = (text: string): [string, string] => {
  const [first, ...rest] = text.split('. ')
  return [first.replace(/\.$/, ''), rest.join('. ')]
}

/** How much of the chat is on screen before the answer: the header and the question (the top 26%). */
const ASKED = 'inset(0% 0% 74% 0%)'
const ANSWERED = 'inset(0% 0% 0% 0%)'
/** How far the view closes in on the answer card, so its rows can be read from across a room (about the card's lower left: byoa.css). */
const CLOSE_IN = 1.32

// ---------------------------------------------------------------- the 701: a field of small agents, packed like a honeycomb
const BOT_COUNT = Number(BYOA.stat.value) || 701
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
/** Which of them is Saathi: row 9, the eleventh along. */
const OUR_BOT = 5 * BOT_COLS + 4 * (BOT_COLS - 1) + 10

const at = (x: number, y: number) => ({ ['--x' as string]: x, ['--y' as string]: y }) as CSSProperties

// ---------------------------------------------------------------- glyphs
const stroke = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
const Hourglass = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M6.500 3h11M6.500 21h11M8 3v3.200c0 2.800 4 3.600 4 5.800s-4 3-4 5.800V21M16 3v3.200c0 2.800-4 3.600-4 5.800s4 3 4 5.800V21" />
  </svg>
)
const Envelope = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <rect x="3" y="5.500" width="18" height="13" rx="2.400" />
    <path d="M3.800 7.200 12 13.200l8.200-6" />
  </svg>
)
const Send = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M20.500 3.500 10.800 13.200M20.500 3.500l-6.200 17-3.500-7.300-7.300-3.500z" />
  </svg>
)

// ====================================================================== BEFORE
/** The old way: a mail to the central team, asking if the vendor's invoice is paid. No reply yet. */
function Before({ product }: P) {
  const { old } = product.demo
  return (
    <div className="byoa-b">
      <div className="byoa-b-mail">
        <div className="byoa-b-bar">
          <i>
            <Envelope />
          </i>
        </div>
        <p className="byoa-b-row">
          <span>To</span>
          <b className="byoa-b-chip">{old.to}</b>
        </p>
        <p className="byoa-b-row">
          <span>Subject</span>
          <b>{old.subject}</b>
        </p>
        <div className="byoa-b-body" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="byoa-b-still">
        <i>
          <Hourglass />
        </i>
        <span>{old.still}</span>
      </div>
    </div>
  )
}

// ====================================================================== SCREEN
/**
 * Saathi in a desktop window, cut to the chat itself so its words can be read: first the
 * question, asked; then the same chat with the answer under it.
 */
function Screen({ product }: P) {
  const d = product.demo
  return (
    <div className="byoa-app">
      <DesktopWindow title={d.title}>
        <div className="byoa-view">
          {/* (the two pictures move as one: the view closes in on the answer once it is there) */}
          <div className="byoa-zoom">
            <Shot shot={d.shots.ask} className="byoa-shot" />
            <Shot shot={d.shots.done} className="byoa-shot byoa-shot--done" />
          </div>
          <i className="byoa-scan" />
        </div>
      </DesktopWindow>

      {/* the one control */}
      <div className="byoa-askWrap">
        <TouchControl label={`${d.ask}: is this vendor’s invoice paid?`} className="byoa-ask">
          <span className="byoa-ask-face">
            <Send />
            {d.ask}
          </span>
        </TouchControl>
      </div>
    </div>
  )
}

/** The ONE thing on the window at the result rest: the stamp, on the answered chat. */
function OnDevice({ product }: P) {
  const [answered, how] = lead(product.demo.answered)
  return (
    <div className="byoa-stamp">
      <i className="byoa-stamp-burst" />
      <b>{answered}</b>
      <span>{how}</span>
    </div>
  )
}

// ====================================================================== STAT
/** 701 agents built by the business. One of them is Saathi. */
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
          <span>{product.demo.builtBy}</span>
        </div>
      </div>
    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<ByoaProduct>) {
  const { $, $$, U, ease: E, before, demo, run, stat } = env

  // ---------------------------------------------------------------- before: the mail is sent, and nothing comes back
  const mail = $('.byoa-b-mail')
  const still = $('.byoa-b-still')
  gsap.set(mail, { autoAlpha: 0, y: 2 * U, rotation: -1.5 })
  gsap.set(still, { autoAlpha: 0, scale: 2.1, rotation: -18 })
  before
    .to(mail, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.5, ease: E.snap }, 0.04)
    .to(still, { autoAlpha: 1, duration: 0.08, ease: 'none' }, 0.6)
    .to(still, { scale: 1, rotation: -5, duration: 0.2, ease: E.slam }, 0.6)

  // ---------------------------------------------------------------- demo: Saathi, the question asked, and the one control
  const askWrap = $('.byoa-askWrap')
  const face = $('.byoa-ask-face')
  gsap.set(askWrap, { autoAlpha: 0, scale: 0.4 })
  demo.to(askWrap, { autoAlpha: 1, scale: 1, duration: 0.36, ease: 'back.out(2.2)' }, 0.86)

  // ---------------------------------------------------------------- run: he asks, and the answer unrolls under the question
  const done = $('.byoa-shot--done')
  const zoom = $('.byoa-zoom')
  const scan = $('.byoa-scan')
  const stamp = $('.byoa-stamp')
  const burst = $('.byoa-stamp-burst')
  gsap.set(done, { autoAlpha: 0, clipPath: ASKED })
  gsap.set(scan, { xPercent: -105 })
  gsap.set(stamp, { autoAlpha: 0, scale: 2.7, rotation: -22 })
  gsap.set(burst, { autoAlpha: 0 })
  const answer = 0.8
  const closeIn = 1.5
  const hit = 2.4
  run
    // ask: the control is pressed, and leaves
    .to(face, { scale: 0.94, duration: 0.08, ease: 'power2.in' }, 0)
    .to(face, { scale: 1, duration: 0.2, ease: 'back.out(3.2)' }, 0.08)
    .to(askWrap, { autoAlpha: 0, scale: 0.86, y: 1 * U, duration: 0.2, ease: 'power2.in' }, 0.14)
    // Saathi looks it up…
    .to(scan, { xPercent: 105, duration: 0.7, ease: 'power2.inOut' }, 0.25)
    // …and the answer unrolls under the question, top to bottom
    .to(done, { autoAlpha: 1, duration: 0.12, ease: 'none' }, answer - 0.12)
    .to(done, { clipPath: ANSWERED, duration: 0.85, ease: 'power2.inOut' }, answer)
    // the view closes in on the answer: the header and the question have been read
    .to(zoom, { scale: CLOSE_IN, duration: 0.6, ease: 'power2.inOut' }, closeIn)
    // Answered. No central team.
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.22)
    .to(stamp, { scale: 1, rotation: -6, duration: 0.22, ease: E.slam }, hit - 0.22)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.5, autoAlpha: 0, duration: 0.38, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, answer + 0.1, 1.2)
  env.bump(run, hit, 2.6)

  // ---------------------------------------------------------------- stat: one of 701
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
  device: 'none',
  highlight: 'without the central team',
  Before,
  Screen,
  Stat,
  OnDevice,
  animate,
}

export default byoa
