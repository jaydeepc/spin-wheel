'use client'

/**
 * SmartHelp · 9:10 am, at the branch.      THE SUPPORT DESK THAT SOLVES THE TICKET ITSELF.
 *
 * THE BUDGET (moments/README.md): at every rest the screen holds the name, at most one
 * statement, Priya's bubble and ONE picture. What SmartHelp puts in that picture:
 *
 * Before   the old way, as light as it reads: ticket #4821, "With the backend team", four
 *          messages to and fro, and "Still open" stamped on it
 * Demo     her ticket flies out of the name into the support desk, written and ready, with
 *          the one control under it: Raise ticket. Nothing else is on the glass.
 * Run      she raises it. The ticket goes up, it is "With SmartHelp" at once, and SmartHelp
 *          works it in front of you: Understood, Found, and then the hero: it RUNS A COMMAND
 *          ITSELF (a safe, pre-approved one: the tag is inside the Fixed row). The ticket's
 *          words give way, and "Ticket closed" is stamped across it.
 * Result   on the glass: Support desk · #4821 under its stamp · Understood · Found · Fixed, and
 *          what the fix was. Six rows of words: as the headline arrives, the two lines of detail
 *          under Understood and Found lift out and the two ticked words grow into their place.
 *          The stamp says it is closed, so the chat's own "Resolved" line (demo.resolved) is not
 *          shown. Under the headline, the one supporting line: the two ways it resolves a ticket
 *          (demo.twoWays).
 * Stat     a hundred tickets; fifteen close themselves as the number counts; the phone flies
 *          into the one that was hers
 *
 * Everything here is SmartHelp's own. The name, the phone, the headline, the number, Priya's
 * bubble, the hand-over and the touch come from the shared frame.
 */

import gsap from 'gsap'
import { Fragment, type ReactNode } from 'react'
import type { SmartHelpProduct } from '../content'
import { TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './smarthelp.css'

type P = PartProps<SmartHelpProduct>

/** Where "Help" begins in the name: her ticket is born from those letters. */
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
/** The same sentence, with the words that carry it set in bold: "It guides her in the app, or fixes …" */
const stressed = (text: string, words: string[]): ReactNode[] =>
  text.split(' ').map((word, i) => (
    <Fragment key={i}>
      {i ? ' ' : null}
      {words.includes(word.replace(/[.,]/g, '')) ? <b>{word}</b> : word}
    </Fragment>
  ))

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

// ====================================================================== BEFORE
/** The old way: the ticket is with the backend team. A to-and-fro, and it is still open. */
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
          <p className="smarthelp-b-id">
            <span>{ticket.id}</span>
          </p>
          <div className="smarthelp-b-status">
            <span className="smarthelp-b-dots">
              <i />
              <i />
              <i />
            </span>
            {old.status}
          </div>
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
/**
 * The support desk on her phone. At the demo rest: the desk's name, her ticket, the one control.
 * At the result rest, five rows: the desk's name, her ticket (under its stamp), Understood, Found
 * and Fixed (with the "safe, pre-approved" tag inside it).
 */
function Screen({ product }: P) {
  const d = product.demo
  const last = d.steps.length - 1
  return (
    <div className="smarthelp-app">
      <div className="smarthelp-bar">
        <span className="smarthelp-icon">
          <Spark />
        </span>
        <b className="smarthelp-title">{d.desk}</b>
      </div>

      {/* her ticket */}
      <div className="smarthelp-tkc">
        <i className="smarthelp-tkc-glow" />
        <div className="smarthelp-tkc-head">
          <b className="smarthelp-tkc-id">{d.ticket.id}</b>
          <span className="smarthelp-pill">
            <span className="smarthelp-pill--new">New</span>
            <span className="smarthelp-pill--with">With {product.name}</span>
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
      <div className="smarthelp-raiseWrap">
        <TouchControl label={`${d.raise} ${d.ticket.id} on ${product.name}`} className="smarthelp-raise">
          <span className="smarthelp-raise-face">
            <TicketGlyph />
            {d.raise}
          </span>
        </TouchControl>
      </div>

      {/* SmartHelp works the ticket, in the same chat */}
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
                <p className="smarthelp-step-v">{unbroken(s.v)}</p>
                <span className="smarthelp-step-skel">
                  <i />
                  <i />
                </span>
              </>
            ) : (
              /* the hero: it runs a command itself. The command is typed by nobody, runs, and
                 gives way to what it did; the tag that says it is a safe one is part of the row. */
              <>
              <span className="smarthelp-step-skel">
                <i />
              </span>
              <div className="smarthelp-cmd">
                <span className="smarthelp-cmd-code">
                  <Prompt />
                  <i />
                  <i />
                  <i />
                  <i className="smarthelp-cmd-caret" />
                </span>
                <p className="smarthelp-cmd-out">{unbroken(s.v)}</p>
                <div className="smarthelp-cmd-safe">
                  <span className="smarthelp-cmd-shield">
                    <Shield check="smarthelp-safe-check" />
                  </span>
                  <span>{unbroken(d.safe)}</span>
                </div>
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
      </div>
    </div>
  )
}

/** The ONE thing on the device at the result rest: the stamp, across her ticket. */
function OnDevice({ product }: P) {
  const [closed, how] = lead(product.demo.closed)
  return (
    <div className="smarthelp-stamp">
      <i className="smarthelp-stamp-burst" />
      <b>{closed}</b>
      <span>{how}</span>
    </div>
  )
}

/** The one supporting line under the result headline: the two ways it resolves a ticket. */
function Proof({ product }: P) {
  return <p className="smarthelp-two">{stressed(product.demo.twoWays, ['guides', 'fixes'])}</p>
}

/** The one thing that flies: her ticket, out of "Help" and into the support desk. */
function Extras({ product }: P) {
  return (
    <div className="smarthelp-ask" aria-hidden="true">
      <p className="smarthelp-ask-text">{product.demo.ticket.text}</p>
    </div>
  )
}

// ====================================================================== STAT
/** A hundred support tickets. Fifteen close themselves. One of them was hers: the phone lands in it. */
function Stat() {
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
    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<SmartHelpProduct>) {
  const { $, $$, U, hx, ease: E, loc, letters, before, demo, run, result, stat } = env
  const clipShut = 'inset(0% 100% 0% 0%)'
  const clipOpen = 'inset(0% 0% 0% 0%)'

  // ---------------------------------------------------------------- the cast
  const tkc = $('.smarthelp-tkc')
  const tkText = $('.smarthelp-tkc-text')
  const tkGlow = $('.smarthelp-tkc-glow')
  const tkSkels = $$('.smarthelp-tkc-skel')
  const pills = $$('.smarthelp-pill > span')
  const scan = $('.smarthelp-tkc-scan')
  const raiseWrap = $('.smarthelp-raiseWrap')
  const face = $('.smarthelp-raise-face')
  const ask = $('.smarthelp-ask')
  const askText = $('.smarthelp-ask-text')
  const stamp = $('.smarthelp-stamp')
  const burst = $('.smarthelp-stamp-burst')

  // ---------------------------------------------------------------- measure, while the stage is posed as in the demo
  // How much the frame has enlarged the phone: a distance on the stage, divided by this, is a distance on its glass.
  const zoom = loc(env.shared.device).w / (env.shared.device.offsetWidth || 1) || 1
  // The stamp lands across her ticket, a little to the right, so that it hangs over the phone's edge.
  const cardAt = loc(tkc)
  const stampAt = loc(stamp)
  const stampTo = {
    x: (cardAt.cx - stampAt.cx) / zoom + 2.3 * U,
    y: (cardAt.cy - stampAt.cy) / zoom + 0.65 * U,
  }
  // At the demo rest her ticket stands lower, just over the one control: the two are the whole
  // screen. When she raises it, it goes up to where it rests, and SmartHelp answers under it.
  const lift = Math.max(0, raiseWrap.offsetTop - tkc.offsetTop - tkc.offsetHeight - 1.2 * U)
  gsap.set(tkc, { y: lift })
  const textBox = loc(tkText)
  const askScale = textBox.w / (askText.offsetWidth || 1)

  // ---------------------------------------------------------------- before: the ticket goes back and forth, and is still open
  const ticket = $('.smarthelp-b-ticket')
  const ticketId = $('.smarthelp-b-id span')
  const status = $('.smarthelp-b-status')
  const msgs = $$('.smarthelp-b-msg')
  const still = $('.smarthelp-b-still')
  gsap.set(ticket, { autoAlpha: 0, y: 3 * U, rotation: -10 })
  gsap.set(ticketId, { yPercent: 110 })
  gsap.set(status, { autoAlpha: 0, scale: 0.7, transformOrigin: '0 50%' })
  gsap.set(msgs, { autoAlpha: 0, scale: 0.6, y: 0.9 * U, transformOrigin: (i) => (msgs[i].classList.contains('smarthelp-b-msg--team') ? '0% 100%' : '100% 100%') })
  gsap.set(still, { autoAlpha: 0, scale: 2.1, rotation: -18 })
  // The ticket, then the to-and-fro: one from them, one from her, one from them, one from her.
  // Only "Still open" lands late, on the ticket itself.
  before
    .to(ticket, { autoAlpha: 1, y: 0, rotation: -2, duration: 0.5, ease: E.snap }, 0)
    .to(ticketId, { yPercent: 0, duration: 0.34, ease: E.out }, 0.08)
    .to(status, { autoAlpha: 1, scale: 1, duration: 0.26, ease: 'back.out(2.4)' }, 0.14)
    .to(msgs, { autoAlpha: 1, scale: 1, y: 0, duration: 0.22, ease: 'back.out(2)', stagger: 0.08 }, 0.16)
    .to(still, { autoAlpha: 1, duration: 0.08, ease: 'none' }, 0.6)
    .to(still, { scale: 1, rotation: -5, duration: 0.2, ease: E.slam }, 0.6)

  // ---------------------------------------------------------------- demo: out of "Help" comes her ticket, into the support desk
  gsap.set(tkText, { autoAlpha: 0 })
  gsap.set(tkGlow, { autoAlpha: 0 })
  gsap.set(raiseWrap, { autoAlpha: 0, scale: 0.4 })
  const helpLetters = letters.slice(Math.min(HELP_FROM, letters.length - 1))
  const helpFrom = {
    x: (helpLetters[0].x + helpLetters[helpLetters.length - 1].x + helpLetters[helpLetters.length - 1].w) / 2,
    y: helpLetters[0].cy,
  }
  const askW = ask.offsetWidth
  const askFrom = { x: Math.min(helpFrom.x, hx - askW / 2), y: helpFrom.y }
  const askTo = { x: textBox.cx, y: textBox.cy }
  const askOver = { x: askFrom.x + (askTo.x - askFrom.x) * 0.45, y: Math.min(askFrom.y, askTo.y) - 4 * U }
  const askLand = 0.84
  gsap.set(ask, { x: askFrom.x, y: askFrom.y, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })
  demo
    .to(ask, { scale: 1, autoAlpha: 1, duration: 0.26, ease: 'back.out(1.8)' }, 0)
    .to(ask, { motionPath: { path: [askOver, askTo], curviness: 1.2 }, scale: askScale, duration: 0.58, ease: 'power2.inOut' }, askLand - 0.58)
    .to(tkSkels, { autoAlpha: 0, duration: 0.1, ease: 'none' }, askLand - 0.08)
    .to(tkText, { autoAlpha: 1, duration: 0.1, ease: 'none' }, askLand - 0.07)
    .to(ask, { autoAlpha: 0, duration: 0.08, ease: 'none' }, askLand - 0.04)
    .to(tkGlow, { autoAlpha: 1, duration: 0.1, ease: 'none' }, askLand - 0.05)
    .to(tkGlow, { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, askLand + 0.08)
    // …and the one control, under it
    .to(raiseWrap, { autoAlpha: 1, scale: 1, duration: 0.36, ease: 'back.out(2.2)' }, askLand + 0.02)
  env.bump(demo, askLand - 0.03)

  // ---------------------------------------------------------------- run: she raises it, and SmartHelp solves it itself
  const card = $('.smarthelp-card')
  const spins = $$('.smarthelp-node-spin')
  const ons = $$('.smarthelp-node-on')
  const kOn = $$('.smarthelp-step-k b')
  const vs = $$('.smarthelp-step-v')
  const skels = $$('.smarthelp-step-skel')
  const sweeps = $$('.smarthelp-step-sweep')
  const links = $$('.smarthelp-link i')
  const cmd = $('.smarthelp-cmd')
  const code = $$('.smarthelp-cmd-code > i:not(.smarthelp-cmd-caret)')
  const codeRow = $('.smarthelp-cmd-code')
  const caret = $('.smarthelp-cmd-caret')
  const safe = $('.smarthelp-cmd-safe')
  const safeCheck = $('.smarthelp-safe-check')
  const bar = $('.smarthelp-cmd-bar')
  const barFill = $('.smarthelp-cmd-bar i')
  const out = $('.smarthelp-cmd-out')
  const cmdFlash = $('.smarthelp-cmd-flash')
  const fixRow = spins.length - 1

  gsap.set(pills[1], { autoAlpha: 0, y: 0.5 * U })
  gsap.set(scan, { xPercent: -105 })
  gsap.set(card, { autoAlpha: 0, y: 2.2 * U, scale: 0.94, transformOrigin: '50% 0%' })
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
  gsap.set(safe, { autoAlpha: 0, x: -0.8 * U })
  gsap.set(safeCheck, { drawSVG: '0%' })
  gsap.set(barFill, { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set(out, { clipPath: clipShut })
  gsap.set(cmdFlash, { autoAlpha: 0 })
  gsap.set(stamp, { x: stampTo.x, y: stampTo.y, autoAlpha: 0, scale: 2.7, rotation: -22 })
  gsap.set(burst, { autoAlpha: 0 })

  const picked = 0.42 // SmartHelp has the ticket
  run
    // raise: the control is pressed and leaves; the ticket goes up to the top of the chat
    .to(face, { scale: 0.94, duration: 0.08, ease: 'power2.in' }, 0)
    .to(face, { scale: 1, duration: 0.2, ease: 'back.out(3.2)' }, 0.08)
    .to(raiseWrap, { autoAlpha: 0, scale: 0.86, y: 1 * U, duration: 0.2, ease: 'power2.in' }, 0.14)
    .to(tkc, { y: 0, duration: 0.46, ease: E.inOut }, 0.12)
    // no queue: it is with SmartHelp at once
    .to(pills[0], { autoAlpha: 0, y: -0.4 * U, duration: 0.14, ease: 'power2.in' }, 0.08)
    .to(pills[1], { autoAlpha: 1, y: 0, duration: 0.26, ease: 'back.out(2.4)' }, 0.18)
    .to(tkGlow, { autoAlpha: 1, duration: 0.1, ease: 'none' }, 0.14)
    .to(tkGlow, { autoAlpha: 0, duration: 0.34, ease: 'power1.out' }, 0.5)
    // it reads the ticket…
    .to(scan, { xPercent: 105, duration: 0.5, ease: 'power2.inOut' }, 0.4)
    // …and works it, in the same chat
    .to(card, { autoAlpha: 1, duration: 0.14, ease: 'none' }, picked)
    .to(card, { y: 0, scale: 1, duration: 0.42, ease: E.snap }, picked)
  env.bump(run, picked + 0.1, 1.2)

  // Understood, Found
  const goes = [0.56, 0.92]
  const dones = [0.86, 1.22]
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

  // Fixed: it runs a command itself. A safe, pre-approved one: the tag is part of the row.
  const go = 1.28
  const fix = 1.98
  run
    .to(spins[fixRow], { autoAlpha: 1, duration: 0.1, ease: 'none' }, go)
    .to(skels[fixRow], { autoAlpha: 0, duration: 0.12 }, go)
    .to(cmd, { autoAlpha: 1, duration: 0.12, ease: 'none' }, go)
    .to(cmd, { y: 0, scale: 1, duration: 0.34, ease: E.snap }, go)
    .to(code, { scaleX: 1, duration: 0.09, stagger: 0.09, ease: 'power1.out' }, go + 0.16)
    .to(caret, { x: caretAt(1), duration: 0.09, ease: 'power1.out' }, go + 0.16)
    .to(caret, { x: caretAt(2), duration: 0.09, ease: 'power1.out' }, go + 0.25)
    .to(caret, { x: caretAt(3), duration: 0.09, ease: 'power1.out' }, go + 0.34)
    .to(barFill, { scaleX: 1, duration: fix - go - 0.34, ease: 'power1.inOut' }, go + 0.3)
    // safe: the tag comes in under the command while it runs, and its shield is ticked
    .to(safe, { autoAlpha: 1, x: 0, duration: 0.3, ease: E.out }, go + 0.24)
    .to(safeCheck, { drawSVG: '100%', duration: 0.24, ease: 'power2.out' }, go + 0.44)
    // FIXED: the command gives way to what it did
    .to(spins[fixRow], { autoAlpha: 0, duration: 0.08, ease: 'none' }, fix)
    .to(codeRow, { autoAlpha: 0, x: 0.8 * U, duration: 0.12, ease: 'power2.in' }, fix - 0.16)
    .to(out, { clipPath: clipOpen, duration: 0.28, ease: 'power2.out' }, fix - 0.08)
    .to(bar, { autoAlpha: 0, duration: 0.2, ease: 'none' }, fix + 0.04)
    .to(cmdFlash, { autoAlpha: 0.55, duration: 0.06, ease: 'none' }, fix - 0.03)
    .to(cmdFlash, { autoAlpha: 0, duration: 0.4, ease: 'power1.out' }, fix + 0.03)
    .to(cmd, { scale: 1.035, duration: 0.08, ease: 'power2.out' }, fix - 0.03)
    .to(cmd, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, fix + 0.05)
    .to(kOn[fixRow], { clipPath: clipOpen, duration: 0.2 }, fix - 0.04)
    .to(sweeps[fixRow], { xPercent: 105, duration: 0.5, ease: 'power2.inOut' }, fix - 0.1)
    .to(ons[fixRow], { autoAlpha: 1, duration: 0.06, ease: 'none' }, fix)
    .to(ons[fixRow], { scale: 1, duration: 0.34, ease: 'back.out(4)' }, fix)
  env.bump(run, fix, 2.4)

  // Ticket closed. No human needed. The ticket's own words have done their work: they give
  // way, one after the other, and the stamp comes down across the ticket.
  const hit = 2.4
  env.leave(run, [pills[1], tkText], fix + 0.1, { stagger: 0.06, dy: 0.6 })
  run
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.22)
    .to(stamp, { scale: 1, rotation: -6, duration: 0.22, ease: E.slam }, hit - 0.22)
    .to(tkGlow, { autoAlpha: 1, duration: 0.06, ease: 'none' }, hit - 0.02)
    .to(tkGlow, { autoAlpha: 0, duration: 0.34, ease: 'power1.out' }, hit + 0.04)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.5, autoAlpha: 0, duration: 0.38, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, hit, 2.6)

  // ---------------------------------------------------------------- result: the two lines of detail leave; three ticked words stay
  // What the run used has already gone inside the run (the control, the typed command and its
  // progress, the ticket's words under the stamp). What is left to clear is what SmartHelp said
  // under Understood and under Found: it was read as it was worked out, and the resting screen
  // has room for about six rows. They lift out, and the two ticked words take the room they
  // leave: each moves to the middle of its row and grows, so the phone reads as a checklist:
  // Understood. Found. Fixed (and what the fix was, which nothing else on screen says).
  const steps = $$('.smarthelp-step')
  const ks = $$('.smarthelp-step-k')
  const nodes = $$('.smarthelp-node')
  const linkWraps = $$('.smarthelp-link')
  // (Fixed keeps its place over what the fix was; its word grows a little, with the other two)
  const rowsOf = steps.map((step, k) => {
    const moves = k < vs.length
    const room = step.clientWidth - ks[k].offsetLeft
    const grow = Math.max(1, Math.min(moves ? 1.45 : 1.2, (room * 0.94) / Math.max(1, ks[k].offsetWidth)))
    const dy = moves ? step.offsetHeight / 2 - (ks[k].offsetTop + ks[k].offsetHeight / 2) : 0
    const node = 1 + (grow - 1) * 0.6
    return { grow, dy, node, half: (nodes[k].offsetHeight * (node - 1)) / 2 }
  })
  env.leave(result, vs, 0, { stagger: 0.06, dy: 0.4 })
  rowsOf.forEach((r, k) => {
    const at = 0.1 + k * 0.06
    result
      .to(ks[k], { y: r.dy, scale: r.grow, transformOrigin: '0% 50%', duration: 0.44, ease: E.inOut }, at)
      .to(nodes[k], { y: r.dy, scale: r.node, duration: 0.44, ease: E.inOut }, at)
    // the link under this mark still runs from it to the next one, wherever the two now stand
    const next = rowsOf[k + 1]
    if (!next || !linkWraps[k]) return
    const len = Math.max(1, linkWraps[k].offsetHeight)
    result.to(
      linkWraps[k],
      { y: r.dy + r.half, scaleY: Math.max(0.05, (len - r.dy - r.half + next.dy - next.half) / len), transformOrigin: '50% 0%', duration: 0.44, ease: E.inOut },
      at,
    )
  })

  // ---------------------------------------------------------------- stat: fifteen in a hundred close themselves
  const cells = $$('.smarthelp-cell')
  const tks = $$('.smarthelp-tk')
  const tkOns = $$('.smarthelp-tk-on')
  const oursRing = $('.smarthelp-ours-ring')
  const dist = (i: number) => Math.hypot((i % WALL_COLS) - OURS_COL, Math.floor(i / WALL_COLS) - OURS_ROW)
  // nearest first, hers thirteenth (the phone has just landed in it), the farthest last
  const others = CLOSED.filter((i) => i !== OURS).sort((a, b) => dist(a) - dist(b))
  const order = [...others.slice(0, 12), OURS, ...others.slice(12)]
  const onOf = (i: number) => tkOns[CLOSED.indexOf(i)]
  gsap.set(cells, { autoAlpha: 0, scale: 0.3 })
  gsap.set(tkOns, { autoAlpha: 0, scale: 0.4 })
  gsap.set(oursRing, { autoAlpha: 0, scale: 1.6 })
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
  // hers: ringed as the phone lands in it
  stat.to(oursRing, { autoAlpha: 1, scale: 1, duration: 0.3, ease: E.snap }, 0.9)

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: $('.smarthelp-land') }
}

const smarthelp: MomentModule<SmartHelpProduct> = {
  key: 'smarthelp',
  device: 'phone',
  highlight: 'Nobody had to pick it up',
  Before,
  Screen,
  Stat,
  Proof,
  Extras,
  OnDevice,
  animate,
}

export default smarthelp
