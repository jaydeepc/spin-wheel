'use client'

/**
 * SmartHelp · 9:10 am, at the branch.      THE SUPPORT DESK THAT SOLVES THE TICKET ITSELF.
 *
 * SmartHelp is a DESKTOP application, and the film shows its REAL SCREENS: three screenshots
 * (content.ts → demo.shots). Until a file is supplied, a labelled placeholder stands in its
 * place and says what the picture must show.
 *
 * THE BUDGET (moments/README.md): at every rest the screen holds the name, at most one
 * statement, Priya's bubble and ONE picture. What SmartHelp puts in that picture:
 *
 * Before   the old help desk (demo.old.desk) in a desktop window: a real screenshot of a ticket
 *          that is still with the backend team, and "Still open" stamped on it
 * Demo     a desktop window: SmartHelp with her issue typed in (shots.ask), and the one control:
 *          Raise ticket
 * Run      she raises it. SmartHelp reads it (one sweep across the screen), the same chat
 *          comes back solved (shots.done), and "Ticket closed" is stamped on it.
 * Result   the window keeps the solved chat under its stamp. Under the headline, the one
 *          supporting line: the two ways it resolves a ticket (demo.twoWays).
 * Stat     a hundred tickets; fifteen close themselves as the number counts; the window flies
 *          into the one that was hers
 *
 * Everything here is SmartHelp's own. The name, the headline, the number, Priya's
 * bubble, the hand-over and the touch come from the shared frame.
 */

import gsap from 'gsap'
import { Fragment, type ReactNode } from 'react'
import type { SmartHelpProduct } from '../content'
import { DesktopWindow, Shot, TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './smarthelp.css'

type P = PartProps<SmartHelpProduct>

/** "Ticket closed. No human needed." → ["Ticket closed", "No human needed."] */
const lead = (text: string): [string, string] => {
  const [first, ...rest] = text.split('. ')
  return [first.replace(/\.$/, ''), rest.join('. ')]
}
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
const Hourglass = () => (
  <svg viewBox="0 0 24 24" {...stroke} aria-hidden="true">
    <path d="M6.500 3h11M6.500 21h11M8 3v3.200c0 2.800 4 3.600 4 5.800s-4 3-4 5.800V21M16 3v3.200c0 2.800-4 3.600-4 5.800s4 3 4 5.800V21" />
  </svg>
)

// ====================================================================== BEFORE
/** The old way: the old help desk, in a desktop window. The ticket is with the backend team, and it is still open. */
function Before({ product }: P) {
  const { old, shots } = product.demo
  return (
    <div className="smarthelp-b">
      <div className="smarthelp-b-win">
        <DesktopWindow title={old.desk}>
          <Shot shot={shots.before} />
        </DesktopWindow>
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
 * SmartHelp in a desktop window as wide as the picture area (a laptop's frame would cost a
 * quarter of the size, and the real screen must be read): the real screen, zoomed in on the
 * part that is read. At the demo
 * rest: her issue typed in, and the one control. At the result rest: the same chat, solved.
 */
function Screen({ product }: P) {
  const d = product.demo
  return (
    <div className="smarthelp-app">
      <DesktopWindow title={`${product.name} · ${d.desk}`}>
        <div className="smarthelp-view">
          <Shot shot={d.shots.ask} className="smarthelp-shot" />
          <Shot shot={d.shots.done} className="smarthelp-shot smarthelp-shot--done" />
          <i className="smarthelp-scan" />
        </div>
      </DesktopWindow>

      {/* the one control */}
      <div className="smarthelp-raiseWrap">
        <TouchControl label={`${d.raise} ${d.ticket.id} on ${product.name}`} className="smarthelp-raise">
          <span className="smarthelp-raise-face">
            <TicketGlyph />
            {d.raise}
          </span>
        </TouchControl>
      </div>
    </div>
  )
}

/** The ONE thing on the device at the result rest: the stamp, on the solved chat. */
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

// ====================================================================== STAT
/** A hundred support tickets. Fifteen close themselves. One of them was hers: the window lands in it. */
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
  const { $, $$, U, ease: E, before, demo, run, stat } = env

  // ---------------------------------------------------------------- before: the old help desk, and the ticket is still open
  const still = $('.smarthelp-b-still')
  gsap.set(still, { autoAlpha: 0, scale: 2.1, rotation: -18 })
  before.to(still, { autoAlpha: 1, duration: 0.08, ease: 'none' }, 0.6).to(still, { scale: 1, rotation: -5, duration: 0.2, ease: E.slam }, 0.6)

  // ---------------------------------------------------------------- demo: SmartHelp, her issue typed in, and the one control
  const raiseWrap = $('.smarthelp-raiseWrap')
  const face = $('.smarthelp-raise-face')
  gsap.set(raiseWrap, { autoAlpha: 0, scale: 0.4 })
  demo.to(raiseWrap, { autoAlpha: 1, scale: 1, duration: 0.36, ease: 'back.out(2.2)' }, 0.86)

  // ---------------------------------------------------------------- run: she raises it, and SmartHelp solves it in the same chat
  const done = $('.smarthelp-shot--done')
  const scan = $('.smarthelp-scan')
  const stamp = $('.smarthelp-stamp')
  const burst = $('.smarthelp-stamp-burst')
  gsap.set(done, { autoAlpha: 0 })
  gsap.set(scan, { xPercent: -105 })
  gsap.set(stamp, { autoAlpha: 0, scale: 2.7, rotation: -22 })
  gsap.set(burst, { autoAlpha: 0 })
  const solved = 1.15
  const hit = 1.9
  run
    // raise: the control is pressed, and leaves
    .to(face, { scale: 0.94, duration: 0.08, ease: 'power2.in' }, 0)
    .to(face, { scale: 1, duration: 0.2, ease: 'back.out(3.2)' }, 0.08)
    .to(raiseWrap, { autoAlpha: 0, scale: 0.86, y: 1 * U, duration: 0.2, ease: 'power2.in' }, 0.14)
    // it reads the ticket…
    .to(scan, { xPercent: 105, duration: 0.8, ease: 'power2.inOut' }, 0.3)
    // …and the same chat comes back solved
    .to(done, { autoAlpha: 1, duration: 0.4, ease: 'power1.inOut' }, solved - 0.3)
    // Ticket closed. No human needed.
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.22)
    .to(stamp, { scale: 1, rotation: -6, duration: 0.22, ease: E.slam }, hit - 0.22)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.5, autoAlpha: 0, duration: 0.38, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, solved, 1.2)
  env.bump(run, hit, 2.6)

  // ---------------------------------------------------------------- stat: fifteen in a hundred close themselves
  const cells = $$('.smarthelp-cell')
  const tks = $$('.smarthelp-tk')
  const tkOns = $$('.smarthelp-tk-on')
  const oursRing = $('.smarthelp-ours-ring')
  const dist = (i: number) => Math.hypot((i % WALL_COLS) - OURS_COL, Math.floor(i / WALL_COLS) - OURS_ROW)
  // nearest first, hers thirteenth (the window has just landed in it), the farthest last
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
  // hers: ringed as the window lands in it
  stat.to(oursRing, { autoAlpha: 1, scale: 1, duration: 0.3, ease: E.snap }, 0.9)

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: $('.smarthelp-land') }
}

const smarthelp: MomentModule<SmartHelpProduct> = {
  key: 'smarthelp',
  device: 'none',
  highlight: 'Nobody had to pick it up',
  Before,
  Screen,
  Stat,
  Proof,
  OnDevice,
  animate,
}

export default smarthelp
