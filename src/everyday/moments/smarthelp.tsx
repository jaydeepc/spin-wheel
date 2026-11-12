'use client'

/**
 * SmartHelp · 9:10 am, at the branch.      THE SUPPORT DESK THAT SOLVES THE TICKET ITSELF.
 *
 * Before   ticket #4821, "With the backend team": the to-and-fro piles up message by message,
 *          and the ticket is "Still open"
 * Demo     the name comes apart as it docks: out of "Smart" fly the two ways it resolves a
 *          ticket (they settle beside the phone); out of "Help" flies her ticket, into the
 *          support desk, written and ready. The one control: Raise ticket
 * Run      she raises it. It is "With SmartHelp" at once, and SmartHelp works it in front of
 *          you: Understood, Found, and then the hero: it RUNS A COMMAND ITSELF (a safe,
 *          pre-approved one), the ticket flips to Resolved and is stamped closed
 * Result   "With the backend team", struck through, becomes "No human needed."
 * Stat     a hundred tickets; fifteen close themselves as the number counts; the phone flies
 *          into the one that was hers
 *
 * Everything here is SmartHelp's own. The name, the phone, the headline, the number, the
 * hand-over and the touch invitation come from the shared frame.
 */

import gsap from 'gsap'
import { Fragment, type ReactNode } from 'react'
import { productByKey, type SmartHelpProduct } from '../content'
import { TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './smarthelp.css'

type P = PartProps<SmartHelpProduct>
const SH = productByKey('smarthelp') as SmartHelpProduct

/** Which letters of S·m·a·r·t the two ways are born from, and where "Help" begins. */
const SMART_LETTERS = [0, 4]
const HELP_FROM = 5

/** "Resolved. Please try eKYC again." → ["Resolved", "Please try eKYC again."] */
const lead = (text: string): [string, string] => {
  const [first, ...rest] = text.split('. ')
  return [first.replace(/\.$/, ''), rest.join('. ')]
}
/** A label that may wrap, but never inside a hyphenated word: "Safe, pre-approved command" keeps "pre-approved" whole. */
const unbroken = (text: string): ReactNode[] =>
  text.split(' ').map((word, i) => (
    <Fragment key={i}>
      {i ? ' ' : null}
      {word.includes('-') ? <span className="ev-nobreak">{word}</span> : word}
    </Fragment>
  ))
/** The last sentence of a line, without its full stop: "… No back-and-forth." → "No back-and-forth" */
const lastSentence = (text: string) => (text.split('. ').pop() ?? text).replace(/\.$/, '')

/** The two promises under the ticket. The demo ticks them off: the first when it finds the cause without asking her anything, the second when the ticket closes. */
const claimsOf = (p: SmartHelpProduct) => [lastSentence(p.priya.after), lastSentence(p.demo.closed)]

/** The stat's picture: a hundred tickets, ten by ten. Fifteen of them close themselves. */
const WALL_COLS = 10
const WALL_ROWS = 10
const CLOSED = [2, 9, 17, 21, 38, 40, 45, 53, 58, 64, 69, 72, 81, 87, 95]
/** The one that was Priya's ticket. */
const OURS = 45
const OURS_COL = OURS % WALL_COLS
const OURS_ROW = Math.floor(OURS / WALL_COLS)

// ---------------------------------------------------------------------- glyphs
const stroke = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const Spark = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.6c.7 4.9 3 7.500 8.400 8.400-5.400.900-7.700 3.500-8.400 8.400-.700-4.900-3-7.500-8.400-8.400 5.400-.900 7.700-3.500 8.400-8.400z" fill="#fff" />
    <circle cx="19.300" cy="4.700" r="1.500" fill="#fff" />
  </svg>
)
const Tick = ({ color = '#fff', width = 3.2 }: { color?: string; width?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5 10 17.5 19 7.5" />
  </svg>
)
/** A support ticket: a stub, a perforation. */
const TicketGlyph = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M3.500 8.500a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v1.700a1.900 1.900 0 0 0 0 3.600v1.700a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-1.700a1.900 1.900 0 0 0 0-3.600z" />
    <path d="M14.500 7v2M14.500 11v2M14.500 15v2" />
  </svg>
)
/** The backend team: a headset. */
const Headset = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M5 13.500v-2a7 7 0 0 1 14 0v2" />
    <rect x="3.400" y="12.600" width="3.600" height="5.600" rx="1.600" />
    <rect x="17" y="12.600" width="3.600" height="5.600" rx="1.600" />
    <path d="M18.800 18.200v.500a2.500 2.500 0 0 1-2.500 2.500H13.500" />
  </svg>
)
const Hourglass = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M6.500 3h11M6.500 21h11M8 3v3.200c0 2.800 4 3.600 4 5.800s-4 3-4 5.800V21M16 3v3.200c0 2.800-4 3.600-4 5.800s4 3 4 5.800V21" />
  </svg>
)
/** Safe: a shield. Its tick is drawn by the demo. */
const Shield = ({ check }: { check?: string }) => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M12 2.800 19.500 5.600v5.900c0 4.600-3.100 8.300-7.500 9.900-4.400-1.600-7.500-5.300-7.500-9.900V5.600z" />
    <path className={check} d="M8.600 11.900l2.400 2.400 4.400-4.700" />
  </svg>
)
/** A command line prompt. */
const Prompt = () => (
  <svg viewBox="0 0 24 24" {...stroke} strokeWidth={2.6} aria-hidden="true">
    <path d="M5 6.500l5.500 5.500L5 17.500M13 17.500h6" />
  </svg>
)
/** It guides (a route to the place in the app), it fixes (a spanner). */
const WAYS: ReactNode[] = [
  <svg key="g" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <circle cx="5.500" cy="18.500" r="2" />
    <path d="M5.500 16.500V10a4 4 0 0 1 4-4H19M15.500 2.500 19 6l-3.500 3.500" />
  </svg>,
  <svg key="f" viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M14.700 6.300a1 1 0 0 0 0 1.400l1.600 1.600a1 1 0 0 0 1.400 0l3.770-3.770a6 6 0 0 1-7.940 7.940l-6.910 6.910a2.120 2.120 0 0 1-3-3l6.910-6.910a6 6 0 0 1 7.940-7.940z" />
  </svg>,
]

// ====================================================================== BEFORE
/** The old way: the same ticket, with the backend team. A screenshot, a retry, and it is still open. */
function Before({ product }: P) {
  const { ticket, old } = product.demo
  return (
    <div className="smarthelp-b">
      <div className="smarthelp-b-ticket">
        <div className="smarthelp-b-paper">
          <span className="smarthelp-b-stub">
            <TicketGlyph />
          </span>
          <i className="smarthelp-b-perf" />
          <p className="smarthelp-b-eyebrow">Support ticket</p>
          <p className="smarthelp-b-id">
            <span>{ticket.id}</span>
          </p>
          <p className="smarthelp-b-status">
            <span className="smarthelp-b-dots">
              <i />
              <i />
              <i />
            </span>
            {old.status}
          </p>
        </div>
      </div>
      <div className="smarthelp-b-thread">
        {old.thread.map((m, i) => (
          <p className={`smarthelp-b-msg smarthelp-b-msg--${m.from}`} key={i}>
            {m.from === 'team' ? (
              <i className="smarthelp-b-av">
                <Headset />
              </i>
            ) : null}
            <span>{m.text}</span>
          </p>
        ))}
      </div>
      <div className="smarthelp-b-still">
        <i>
          <Hourglass />
        </i>
        <span>{old.still}</span>
      </div>
    </div>
  )
}

// ====================================================================== SCREEN
/** The support desk on her phone. Her ticket is written; she raises it; SmartHelp works it. */
function Screen({ product }: P) {
  const d = product.demo
  const [resolved, next] = lead(d.resolved)
  const last = d.steps.length - 1
  return (
    <div className="smarthelp-app">
      <div className="smarthelp-bar">
        <span className="smarthelp-icon">
          <Spark />
        </span>
        <span className="smarthelp-title">
          <b>{d.desk}</b>
          <span>
            {product.name} · {d.app}
          </span>
        </span>
      </div>

      {/* her ticket */}
      <div className="smarthelp-tkc">
        <i className="smarthelp-tkc-glow" />
        <div className="smarthelp-tkc-head">
          <span className="smarthelp-tkc-id">
            Ticket <b>{d.ticket.id}</b>
          </span>
          <span className="smarthelp-pill">
            <span className="smarthelp-pill--new">New</span>
            <span className="smarthelp-pill--with">With {product.name}</span>
            <span className="smarthelp-pill--done">
              <Tick width={3.8} />
              {resolved}
            </span>
          </span>
        </div>
        <div className="smarthelp-tkc-body">
          <p className="smarthelp-tkc-text">{d.ticket.text}</p>
          <i className="smarthelp-tkc-skel" />
          <i className="smarthelp-tkc-skel" />
          <i className="smarthelp-tkc-scan" />
        </div>
      </div>

      {/* the one control */}
      <div className="smarthelp-raisezone">
        <div className="smarthelp-raiseWrap">
          <TouchControl label={`${d.raise} ${d.ticket.id} on ${product.name}`} className="smarthelp-raise">
            <span className="smarthelp-raise-face">
              <TicketGlyph />
              {d.raise}
            </span>
          </TouchControl>
        </div>
        <p className="smarthelp-hint">Tap to raise it</p>
        <div className="smarthelp-hero">
          <span className="smarthelp-hero-mark">
            <Spark />
          </span>
          <p>{product.promise}</p>
        </div>
      </div>

      {/* SmartHelp works the ticket */}
      <div className="smarthelp-work">
        <p className="smarthelp-from">
          <i>
            <Spark />
          </i>
          {product.name}
          <span>now</span>
        </p>
        <div className="smarthelp-card">
          {d.steps.map((s, i) => (
            <div className={i === last ? 'smarthelp-step smarthelp-step--fix' : 'smarthelp-step'} key={s.k}>
              <i className="smarthelp-node">
                <i className="smarthelp-node-spin" />
                <b className="smarthelp-node-on">
                  <Tick width={3.8} />
                </b>
              </i>
              {i < last ? (
                <i className="smarthelp-link">
                  <i />
                </i>
              ) : null}
              <p className="smarthelp-step-k">
                <span>{s.k}</span>
                <b aria-hidden="true">{s.k}</b>
              </p>
              {i < last ? (
                <>
                  <p className="smarthelp-step-v">{s.v}</p>
                  <span className="smarthelp-step-skel">
                    <i />
                    <i />
                  </span>
                </>
              ) : (
                <>
                  <span className="smarthelp-step-skel">
                    <i />
                    <i />
                  </span>
                  {/* the hero: it runs a command itself */}
                  <div className="smarthelp-cmd">
                    <div className="smarthelp-cmd-line">
                      <Prompt />
                      <span className="smarthelp-cmd-code">
                        <i />
                        <i />
                        <i />
                      </span>
                      <i className="smarthelp-cmd-caret" />
                      <span className="smarthelp-cmd-shield">
                        <Shield />
                      </span>
                    </div>
                    <p className="smarthelp-cmd-out">{s.v}</p>
                    <i className="smarthelp-cmd-bar">
                      <i />
                    </i>
                    <i className="smarthelp-cmd-flash" />
                  </div>
                </>
              )}
              <i className="smarthelp-step-sweep" />
            </div>
          ))}
          <div className="smarthelp-done">
            <span className="smarthelp-done-bg" />
            <i>
              <Tick width={3.8} />
            </i>
            <p className="smarthelp-done-txt">
              <b>{resolved}.</b> {next}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/** On the phone's edge, travelling with it: the tag on the fix, and the stamp on the ticket. */
function OnDevice({ product }: P) {
  const d = product.demo
  const [closed, how] = lead(d.closed)
  return (
    <>
      <div className="smarthelp-safe">
        <i className="smarthelp-safe-ring" />
        <span className="smarthelp-safe-ico">
          <Shield check="smarthelp-safe-check" />
        </span>
        <span className="smarthelp-safe-txt">{unbroken(d.safe)}</span>
      </div>
      <div className="smarthelp-stamp">
        <i className="smarthelp-stamp-burst" />
        <b>{closed}</b>
        <span>{how}</span>
      </div>
    </>
  )
}

// ====================================================================== AROUND THE DEVICE
/** Beside the phone: the two ways SmartHelp resolves a ticket. The demo shows the second. */
function Beside({ product }: P) {
  const ways = product.demo.ways
  return (
    <div className="smarthelp-ways">
      <p className="smarthelp-ways-who">How it resolves a ticket</p>
      {ways.map((w, i) => (
        <div className="smarthelp-way-slot" key={w.title}>
          <div className={i === ways.length - 1 ? 'smarthelp-way smarthelp-way--shown' : 'smarthelp-way'}>
            <p className="smarthelp-way-head">
              <span className="smarthelp-way-ico">{WAYS[i]}</span>
              <b>{w.title}</b>
            </p>
            <p className="smarthelp-way-text">{w.text}</p>
            {i === ways.length - 1 ? (
              <>
                <i className="smarthelp-way-glow" />
                <span className="smarthelp-way-tag">
                  <Tick width={3.8} />
                  This ticket
                </span>
              </>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Left column: the two promises. Each is ticked off by the demo itself. */
function Under({ product }: P) {
  return (
    <div className="smarthelp-claims">
      {claimsOf(product).map((c) => (
        <span className="smarthelp-claim" key={c}>
          <i className="smarthelp-claim-ring" />
          {c}
          <span className="smarthelp-claim-on" aria-hidden="true">
            <i>
              <Tick width={3.6} />
            </i>
            {c}
          </span>
        </span>
      ))}
    </div>
  )
}

/** Under the result headline: the queue, struck through, and what replaced it. */
function Proof({ product }: P) {
  const d = product.demo
  return (
    <div className="smarthelp-compare">
      <span className="smarthelp-compare-old">
        <b>{d.ticket.id}</b>
        {d.old.status}
        <i />
      </span>
      <svg viewBox="0 0 40 20" fill="none" strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 10h34M28 3l8 7-8 7" />
      </svg>
      <span className="smarthelp-compare-new">{lead(d.closed)[1]}</span>
    </div>
  )
}

/** Things that fly: the two ways (out of "Smart") and her ticket (out of "Help"). */
function Extras({ product }: P) {
  const d = product.demo
  return (
    <>
      {d.ways.map((w, i) => (
        <div className="smarthelp-part" key={w.title} aria-hidden="true">
          {WAYS[i]}
          {w.title}
        </div>
      ))}
      <div className="smarthelp-ask" aria-hidden="true">
        <p className="smarthelp-ask-text">{d.ticket.text}</p>
      </div>
    </>
  )
}

// ====================================================================== STAT
/** A hundred support tickets. Fifteen close themselves. One of them was hers. */
function Stat({ product }: P) {
  const d = product.demo
  return (
    <div className="smarthelp-wall">
      {Array.from({ length: WALL_COLS * WALL_ROWS }, (_, i) => {
        const closed = CLOSED.includes(i)
        return (
          <span className={i === OURS ? 'smarthelp-cell smarthelp-cell--ours' : 'smarthelp-cell'} key={i}>
            <i className="smarthelp-tk">
              {closed ? (
                <b className="smarthelp-tk-on">
                  <Tick width={3.6} />
                </b>
              ) : null}
            </i>
            {i === OURS ? <i className="smarthelp-ours-ring" /> : null}
          </span>
        )
      })}
      <i className="smarthelp-land" />
      <div className="smarthelp-callout">
        <div className="smarthelp-callout-in">
          <b>Ticket {d.ticket.id}</b>
          <span>{lead(d.closed)[1]}</span>
        </div>
      </div>
    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<SmartHelpProduct>) {
  const { $, $$, U, hx, ease: E, loc, letters, before, demo, run, result, stat } = env
  const clipShut = 'inset(0% 100% 0% 0%)'
  const clipOpen = 'inset(0% 0% 0% 0%)'

  // ---------------------------------------------------------------- measure, while the stage is posed as in the demo
  const parts = $$('.smarthelp-part')
  const slots = $$('.smarthelp-way-slot')
  const wayCards = $$('.smarthelp-way')
  const ask = $('.smarthelp-ask')
  const askText = $('.smarthelp-ask-text')
  const tkText = $('.smarthelp-tkc-text')

  const slotBox = slots.map((s) => loc(s))
  const partBox = parts.map((p) => ({ w: p.offsetWidth, h: p.offsetHeight }))
  const textBox = loc(tkText)
  const askScale = textBox.w / (askText.offsetWidth || 1)

  // ---------------------------------------------------------------- before: the ticket goes back and forth, and is still open
  const ticket = $('.smarthelp-b-ticket')
  const ticketId = $('.smarthelp-b-id span')
  const eyebrow = $('.smarthelp-b-eyebrow')
  const status = $('.smarthelp-b-status')
  const msgs = $$('.smarthelp-b-msg')
  const still = $('.smarthelp-b-still')
  gsap.set(ticket, { autoAlpha: 0, y: 3 * U, rotation: -12 })
  gsap.set(ticketId, { yPercent: 110 })
  gsap.set(eyebrow, { autoAlpha: 0, x: -0.6 * U })
  gsap.set(status, { autoAlpha: 0, scale: 0.7, transformOrigin: '0 50%' })
  gsap.set(msgs, { autoAlpha: 0, scale: 0.6, y: 0.9 * U, transformOrigin: (i) => (msgs[i].classList.contains('smarthelp-b-msg--team') ? '0% 100%' : '100% 100%') })
  gsap.set(still, { autoAlpha: 0, scale: 1.9, rotation: -16 })
  // The whole to-and-fro is in place in the first half second: the card then rests, and that rest
  // is for reading it. Only "Still open" lands late, on what has piled up.
  before
    .to(ticket, { autoAlpha: 1, y: 0, rotation: -3, duration: 0.5, ease: E.snap }, 0)
    .to(eyebrow, { autoAlpha: 1, x: 0, duration: 0.24 }, 0.08)
    .to(ticketId, { yPercent: 0, duration: 0.34, ease: E.out }, 0.08)
    .to(status, { autoAlpha: 1, scale: 1, duration: 0.26, ease: 'back.out(2.4)' }, 0.12)
    // …message by message, each on the heels of the last
    .to(msgs, { autoAlpha: 1, scale: 1, y: 0, duration: 0.2, ease: 'back.out(2)', stagger: 0.045 }, 0.02)
    // still open
    .to(still, { autoAlpha: 1, duration: 0.08, ease: 'none' }, 0.5)
    .to(still, { scale: 1, rotation: -4, duration: 0.18, ease: E.slam }, 0.5)

  // ---------------------------------------------------------------- demo: "Smart" gives the two ways, "Help" gives her ticket
  const raiseWrap = $('.smarthelp-raiseWrap')
  const hint = $('.smarthelp-hint')
  const hero = $('.smarthelp-hero')
  const tkGlow = $('.smarthelp-tkc-glow')
  const tkSkels = $$('.smarthelp-tkc-skel')
  gsap.set(wayCards, { autoAlpha: 0, scale: 0.92 })
  gsap.set(hero, { autoAlpha: 0, scale: 0.8, y: 0.8 * U })
  gsap.set(tkText, { autoAlpha: 0 })
  gsap.set(tkGlow, { autoAlpha: 0 })
  gsap.set(raiseWrap, { autoAlpha: 0, scale: 0 })
  gsap.set(hint, { autoAlpha: 0 })
  const born = SMART_LETTERS.map((li) => letters[Math.min(li, letters.length - 1)])
  gsap.set(parts, { x: (i) => born[i].cx, y: (i) => born[i].cy, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
  parts.forEach((p, i) => {
    const from = { x: born[i].cx, y: born[i].cy }
    const to = { x: slotBox[i].cx, y: slotBox[i].cy }
    // thrown high over the phone, each on its own curve, down into its place beside it
    const over = { x: from.x + (to.x - from.x) * 0.58, y: Math.min(from.y, to.y) - (4.5 + (1 - i) * 1.8) * U }
    const birth = 0.02 + i * 0.06
    const fly = 0.24 + i * 0.09
    const dur = 0.56
    const land = fly + dur
    demo
      .to(p, { scale: 1, autoAlpha: 1, duration: 0.26, ease: 'back.out(2.2)' }, birth)
      .to(p, { motionPath: { path: [over, to], curviness: 1.25 }, duration: dur, ease: 'power2.inOut' }, fly)
      .to(p, { rotation: 8, duration: dur * 0.45, ease: 'sine.out' }, fly)
      .to(p, { rotation: 0, duration: dur * 0.55, ease: 'sine.inOut' }, fly + dur * 0.45)
      .to(p, { scaleX: slotBox[i].w / partBox[i].w, scaleY: slotBox[i].h / partBox[i].h, autoAlpha: 0, duration: 0.2, ease: 'power2.out' }, land - 0.05)
      .to(wayCards[i], { autoAlpha: 1, scale: 1, duration: 0.32, ease: E.snap }, land - 0.05)
  })
  // her ticket: out of "Help", into the support desk, written and ready
  const helpLetters = letters.slice(Math.min(HELP_FROM, letters.length - 1))
  const helpFrom = {
    x: (helpLetters[0].x + helpLetters[helpLetters.length - 1].x + helpLetters[helpLetters.length - 1].w) / 2,
    y: helpLetters[0].cy,
  }
  const askW = ask.offsetWidth
  const askFrom = { x: Math.min(helpFrom.x, hx - askW / 2), y: helpFrom.y }
  const askTo = { x: textBox.cx, y: textBox.cy }
  const askOver = { x: askFrom.x + (askTo.x - askFrom.x) * 0.3 + 3 * U, y: askFrom.y + (askTo.y - askFrom.y) * 0.45 }
  const askLand = 0.82
  gsap.set(ask, { x: askFrom.x, y: askFrom.y, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
  demo
    .to(ask, { scale: 1, autoAlpha: 1, duration: 0.26, ease: 'back.out(1.8)' }, 0)
    .to(ask, { motionPath: { path: [askOver, askTo], curviness: 1.2 }, scale: askScale, duration: 0.56, ease: 'power2.inOut' }, askLand - 0.56)
    .to(tkSkels, { autoAlpha: 0, duration: 0.1, ease: 'none' }, askLand - 0.08)
    .to(tkText, { autoAlpha: 1, duration: 0.1, ease: 'none' }, askLand - 0.07)
    .to(ask, { autoAlpha: 0, duration: 0.12, ease: 'none' }, askLand - 0.03)
    .to(tkGlow, { autoAlpha: 1, duration: 0.1, ease: 'none' }, askLand - 0.05)
    .to(tkGlow, { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, askLand + 0.08)
    .to(hero, { autoAlpha: 1, scale: 1, y: 0, duration: 0.42, ease: E.snap }, 0.7)
    .to(raiseWrap, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, askLand + 0.02)
    .to(hint, { autoAlpha: 1, duration: 0.22 }, askLand + 0.14)
  env.bump(demo, askLand - 0.03)

  // ---------------------------------------------------------------- run: she raises it, and SmartHelp solves it itself
  const face = $('.smarthelp-raise-face')
  const pills = $$('.smarthelp-pill > span')
  const scan = $('.smarthelp-tkc-scan')
  const work = $('.smarthelp-work')
  const from = $('.smarthelp-from')
  const card = $('.smarthelp-card')
  const spins = $$('.smarthelp-node-spin')
  const ons = $$('.smarthelp-node-on')
  const kOn = $$('.smarthelp-step-k b')
  const vs = $$('.smarthelp-step-v')
  const skels = $$('.smarthelp-step-skel')
  const sweeps = $$('.smarthelp-step-sweep')
  const links = $$('.smarthelp-link i')
  const cmd = $('.smarthelp-cmd')
  const code = $$('.smarthelp-cmd-code i')
  const caret = $('.smarthelp-cmd-caret')
  const cmdShield = $('.smarthelp-cmd-shield')
  const bar = $('.smarthelp-cmd-bar i')
  const out = $('.smarthelp-cmd-out')
  const cmdFlash = $('.smarthelp-cmd-flash')
  const doneBg = $('.smarthelp-done-bg')
  const doneTick = $('.smarthelp-done i')
  const doneText = $('.smarthelp-done-txt')
  const safe = $('.smarthelp-safe')
  const safeRing = $('.smarthelp-safe-ring')
  const safeCheck = $('.smarthelp-safe-check')
  const stamp = $('.smarthelp-stamp')
  const burst = $('.smarthelp-stamp-burst')
  const wayGlow = $('.smarthelp-way-glow')
  const wayTag = $('.smarthelp-way-tag')
  const wayIco = $('.smarthelp-way--shown .smarthelp-way-ico')
  const claims = $$('.smarthelp-claim-on')
  const fixRow = spins.length - 1

  gsap.set(pills[1], { autoAlpha: 0, y: 0.5 * U })
  gsap.set(pills[2], { autoAlpha: 0, scale: 0.4, transformOrigin: '100% 50%' })
  gsap.set(scan, { xPercent: -105 })
  gsap.set(work, { autoAlpha: 0 })
  gsap.set(from, { autoAlpha: 0, x: -0.5 * U })
  gsap.set(card, { autoAlpha: 0, y: 1.3 * U, scale: 0.94, transformOrigin: '0% 0%' })
  gsap.set(spins, { autoAlpha: 0 })
  gsap.set(ons, { autoAlpha: 0, scale: 0 })
  gsap.set(kOn, { clipPath: clipShut })
  gsap.set(vs, { clipPath: clipShut })
  gsap.set(sweeps, { xPercent: -105 })
  gsap.set(links, { scaleY: 0, transformOrigin: '50% 0%' })
  gsap.set(cmd, { autoAlpha: 0, y: 0.7 * U, scale: 0.94, transformOrigin: '50% 0%' })
  gsap.set(code, { scaleX: 0, transformOrigin: '0% 50%' })
  // the caret stands where the next word will be typed
  const caretAt = (k: number) => (k < code.length ? code[k].offsetLeft - caret.offsetLeft : 0)
  gsap.set(caret, { x: caretAt(0) })
  gsap.set(cmdShield, { autoAlpha: 0, scale: 0 })
  gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set(out, { clipPath: clipShut })
  gsap.set(cmdFlash, { autoAlpha: 0 })
  gsap.set(doneBg, { autoAlpha: 0 })
  gsap.set(doneTick, { autoAlpha: 0, scale: 0 })
  gsap.set(doneText, { clipPath: clipShut })
  gsap.set(safe, { autoAlpha: 0, scale: 0.4, x: -1.4 * U, transformOrigin: '0% 50%' })
  gsap.set(safeRing, { autoAlpha: 0 })
  gsap.set(safeCheck, { drawSVG: '0%' })
  gsap.set(stamp, { autoAlpha: 0, scale: 2.7, rotation: -22 })
  gsap.set(burst, { autoAlpha: 0 })
  gsap.set(wayGlow, { autoAlpha: 0 })
  gsap.set(wayTag, { autoAlpha: 0, scale: 0, transformOrigin: '100% 50%' })
  gsap.set(claims, { clipPath: clipShut })

  const picked = 0.3 // SmartHelp has the ticket
  run
    // raise
    .to(face, { scale: 0.94, duration: 0.08, ease: 'power2.in' }, 0)
    .to(face, { scale: 1, duration: 0.2, ease: 'back.out(3.2)' }, 0.08)
    .to(hint, { autoAlpha: 0, duration: 0.14 }, 0)
    .to(hero, { autoAlpha: 0, scale: 0.86, y: -1.2 * U, duration: 0.2, ease: 'power2.in' }, 0)
    // no queue: it is with SmartHelp at once
    .to(pills[0], { autoAlpha: 0, y: -0.4 * U, duration: 0.14, ease: 'power2.in' }, 0.06)
    .to(pills[1], { autoAlpha: 1, y: 0, duration: 0.26, ease: 'back.out(2.4)' }, 0.15)
    .to(tkGlow, { autoAlpha: 1, duration: 0.1, ease: 'none' }, 0.08)
    .to(tkGlow, { autoAlpha: 0, duration: 0.34, ease: 'power1.out' }, 0.26)
    .to(raiseWrap, { autoAlpha: 0, scale: 0.9, y: -0.7 * U, duration: 0.18, ease: 'power2.in' }, 0.14)
    // it reads the ticket…
    .to(scan, { xPercent: 105, duration: 0.5, ease: 'power2.inOut' }, 0.3)
    // …and works it, in the same chat
    .to(work, { autoAlpha: 1, duration: 0.01 }, picked)
    .to(from, { autoAlpha: 1, x: 0, duration: 0.25 }, picked)
    .to(card, { autoAlpha: 1, duration: 0.14, ease: 'none' }, picked)
    .to(card, { y: 0, scale: 1, duration: 0.42, ease: E.snap }, picked)
  env.bump(run, picked + 0.08, 1.2)

  // Understood, Found
  const goes = [0.46, 0.86]
  const dones = [0.8, 1.2]
  vs.forEach((v, k) => {
    run
      .to(spins[k], { autoAlpha: 1, duration: 0.1, ease: 'none' }, goes[k])
      .to(spins[k], { autoAlpha: 0, duration: 0.08, ease: 'none' }, dones[k])
      .to(skels[k], { autoAlpha: 0, duration: 0.12 }, dones[k] - 0.04)
      .to(sweeps[k], { xPercent: 105, duration: 0.5, ease: 'power2.inOut' }, dones[k] - 0.1)
      .to(v, { clipPath: clipOpen, duration: 0.3 }, dones[k] - 0.04)
      .to(kOn[k], { clipPath: clipOpen, duration: 0.24 }, dones[k] - 0.04)
      .to(ons[k], { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3.4)' }, dones[k])
      .to(links[k], { scaleY: 1, duration: 0.26, ease: 'power2.inOut' }, dones[k] + 0.04)
    env.bump(run, dones[k], 0.7)
  })
  // it found the cause without asking her for anything
  run.to(claims[0], { clipPath: clipOpen, duration: 0.4, ease: E.inOut }, dones[1] + 0.02)

  // Fixed: it runs a command itself. A safe, pre-approved one.
  const go = 1.26
  const fix = 2.0
  run
    .to(spins[fixRow], { autoAlpha: 1, duration: 0.1, ease: 'none' }, go)
    .to(skels[fixRow], { autoAlpha: 0, duration: 0.12 }, go)
    .to(cmd, { autoAlpha: 1, duration: 0.12, ease: 'none' }, go)
    .to(cmd, { y: 0, scale: 1, duration: 0.34, ease: E.snap }, go)
    .to(code, { scaleX: 1, duration: 0.09, stagger: 0.09, ease: 'power1.out' }, go + 0.16)
    .to(caret, { x: caretAt(1), duration: 0.09, ease: 'power1.out' }, go + 0.16)
    .to(caret, { x: caretAt(2), duration: 0.09, ease: 'power1.out' }, go + 0.25)
    .to(caret, { x: caretAt(3), duration: 0.09, ease: 'power1.out' }, go + 0.34)
    .to(bar, { scaleX: 1, duration: fix - go - 0.32, ease: 'power1.inOut' }, go + 0.3)
    .to(cmdShield, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, go + 0.26)
    // the tag on it: safe
    .to(safe, { autoAlpha: 1, duration: 0.1, ease: 'none' }, go + 0.2)
    .to(safe, { scale: 1, x: 0, duration: 0.4, ease: 'back.out(2)' }, go + 0.2)
    .to(safeCheck, { drawSVG: '100%', duration: 0.24, ease: 'power2.out' }, go + 0.44)
    // this is the second of its two ways
    .to(wayGlow, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, go + 0.2)
    .to(wayIco, { scale: 1.16, duration: 0.12, ease: 'power2.out' }, go + 0.2)
    .to(wayIco, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, go + 0.32)
    // FIXED
    .to(spins[fixRow], { autoAlpha: 0, duration: 0.08, ease: 'none' }, fix)
    .to(caret, { autoAlpha: 0, duration: 0.06, ease: 'none' }, fix - 0.08)
    .to(out, { clipPath: clipOpen, duration: 0.26, ease: 'power2.out' }, fix - 0.1)
    .to(cmdFlash, { autoAlpha: 0.55, duration: 0.06, ease: 'none' }, fix - 0.03)
    .to(cmdFlash, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, fix + 0.03)
    .to(cmd, { scale: 1.035, duration: 0.08, ease: 'power2.out' }, fix - 0.03)
    .to(cmd, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, fix + 0.05)
    .to(kOn[fixRow], { clipPath: clipOpen, duration: 0.2 }, fix - 0.04)
    .to(sweeps[fixRow], { xPercent: 105, duration: 0.5, ease: 'power2.inOut' }, fix - 0.1)
    .to(ons[fixRow], { autoAlpha: 1, duration: 0.06, ease: 'none' }, fix)
    .to(ons[fixRow], { scale: 1, duration: 0.34, ease: 'back.out(4)' }, fix)
    .to(safeRing, { autoAlpha: 0.8, duration: 0.01 }, fix)
    .to(safeRing, { scale: 1.3, autoAlpha: 0, duration: 0.42, ease: 'power2.out' }, fix + 0.01)
    .to(wayTag, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' }, fix + 0.04)
    // the ticket flips to resolved, in the same chat
    .to(pills[1], { autoAlpha: 0, duration: 0.1, ease: 'none' }, fix + 0.02)
    .to(pills[2], { autoAlpha: 1, duration: 0.08, ease: 'none' }, fix + 0.06)
    .to(pills[2], { scale: 1, duration: 0.34, ease: 'back.out(3.2)' }, fix + 0.06)
    .to(tkGlow, { autoAlpha: 1, duration: 0.1, ease: 'none' }, fix + 0.06)
    .to(tkGlow, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, fix + 0.22)
    .to(doneBg, { autoAlpha: 1, duration: 0.2, ease: 'power1.out' }, fix + 0.1)
    .to(doneTick, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3.4)' }, fix + 0.14)
    .to(doneText, { clipPath: clipOpen, duration: 0.32, ease: 'power2.out' }, fix + 0.16)
  env.bump(run, fix, 2.4)

  // Ticket closed. No human needed.
  const hit = 2.4
  run
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.22)
    // on a phone on its side it lands less askew: a tilted stamp is taller, and there it stands between the tag and the bar
    .to(stamp, { scale: 1, rotation: env.small ? -4 : -7, duration: 0.22, ease: E.slam }, hit - 0.22)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.6, autoAlpha: 0, duration: 0.39, ease: 'power2.out' }, hit + 0.01)
    .to(claims[1], { clipPath: clipOpen, duration: 0.38, ease: E.inOut }, hit - 0.02)
  env.bump(run, hit, 2.6)

  // ---------------------------------------------------------------- result: the queue, struck through
  const strike = $('.smarthelp-compare-old i')
  gsap.set(strike, { scaleX: 0 })
  result.to(strike, { scaleX: 1, duration: 0.26, ease: 'power2.inOut' }, 0.66)

  // ---------------------------------------------------------------- stat: fifteen in a hundred close themselves
  const cells = $$('.smarthelp-cell')
  const tks = $$('.smarthelp-tk')
  const tkOns = $$('.smarthelp-tk-on')
  const oursRing = $('.smarthelp-ours-ring')
  const callout = $('.smarthelp-callout-in')
  const dist = (i: number) => Math.hypot((i % WALL_COLS) - OURS_COL, Math.floor(i / WALL_COLS) - OURS_ROW)
  // nearest first, hers thirteenth (the phone has just landed in it), the farthest last
  const others = CLOSED.filter((i) => i !== OURS).sort((a, b) => dist(a) - dist(b))
  const order = [...others.slice(0, 12), OURS, ...others.slice(12)]
  const onOf = (i: number) => tkOns[CLOSED.indexOf(i)]
  gsap.set(cells, { autoAlpha: 0, scale: 0.3 })
  gsap.set(tkOns, { autoAlpha: 0, scale: 0.4 })
  gsap.set(oursRing, { autoAlpha: 0, scale: 1.6 })
  gsap.set(callout, { autoAlpha: 0, y: 1 * U, xPercent: -50 })
  stat.to(
    cells,
    {
      autoAlpha: 1,
      scale: 1,
      duration: 0.3,
      ease: 'back.out(1.8)',
      stagger: { grid: [WALL_ROWS, WALL_COLS], from: OURS, amount: 0.34, ease: 'power1.in' },
    },
    0.22,
  )
  order.forEach((i, n) => {
    // each one closes as the number beside it counts it: the count runs 0.35 → 1.3 on power2.out (a cubic)
    const at = 0.35 + 0.95 * (1 - Math.cbrt(1 - (n + 1) / order.length))
    stat
      .to(onOf(i), { autoAlpha: 1, duration: 0.08, ease: 'none' }, at)
      .to(onOf(i), { scale: 1, duration: 0.2, ease: 'back.out(3.2)' }, at)
      .to(tks[i], { scale: 1.16, duration: 0.09, ease: 'power2.out' }, at)
      .to(tks[i], { scale: 1, duration: 0.11, ease: 'power2.inOut' }, at + 0.09)
  })
  stat.to(oursRing, { autoAlpha: 1, scale: 1, duration: 0.3, ease: E.snap }, 0.9).to(callout, { autoAlpha: 1, y: 0, duration: 0.36, ease: E.snap }, 1.06)

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: $('.smarthelp-land') }
}

const smarthelp: MomentModule<SmartHelpProduct> = {
  key: 'smarthelp',
  device: 'phone',
  demoTitle: `Support ticket ${SH.demo.ticket.id}`,
  demoLine: SH.demo.ticket.text,
  highlight: 'Nobody had to pick it up',
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

export default smarthelp
