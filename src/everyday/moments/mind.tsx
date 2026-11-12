'use client'

/**
 * Piramal Mind · its own chapter, after Priya's day · with the engineering team.
 *
 * The one idea: PIRAMAL MIND IS THE ENGINEERING TEAM'S MEMORY AND INTELLIGENCE.
 * Memory: every codebase, every Jira ticket and every discussion flows into it by itself.
 * Intelligence: it connects them, so it talks back before something is built the old way.
 *
 * Before   what was decided, and why, is scattered: an old ticket, old code, somebody's head,
 *          each with a loose end
 * Demo     the request from Priya's team has reached an engineer who is coding with AI. His
 *          prompt is typed. Beside the session, Piramal Mind: the three streams leave the
 *          letters of its name and settle into it. Then it TALKS BACK: the blue theme he
 *          asked for was replaced, in a ticket from three weeks ago
 * Run      touch "Use the new theme": the step is written, the header turns from the blue
 *          theme to the new one, it is stamped Built in the new theme; and Piramal Mind shows
 *          what it joined up to know: the request, the discussion, the code, on one thread
 * Result   the picture stays; under the headline, the other thing it does: a defect, traced
 * Stat     100 tiles of AI cost; 80 fall away
 *
 * There is no device frame here (device: 'none'): the Screen is the centrepiece itself, a
 * board of 56u × 31.6u with the coding session on the left and Piramal Mind on the right.
 */

import gsap from 'gsap'
import { productByKey, type MindProduct } from '../content'
import { Rise, TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './mind.css'

type P = PartProps<MindProduct>
const MIND = productByKey('mind') as MindProduct

/** The board, in units of --u. Its wires are an SVG laid over it at 10 units per u. */
const BOARD_W = 56
const BOARD = { w: 560, h: 316 }
/** The thread inside Piramal Mind: what flows in runs down it to the core; what it connects hangs from it. */
const SPINE = 394
const IN_Y = [67, 90, 113]
const CORE = { y: 150, r: 19 }
const LINK_Y = [201.5, 230.5, 259.5]
/** Where the Mind's answer enters the session: the edge of the talk-back card. */
const TALK_X = 333
/** The file the header lives in (illustrative, like the ticket numbers). */
const CODE_FILE = 'Header.tsx'

const COST_COLS = 10
const COST_ROWS = 10
/** 80% lower: the top eight rows of ten fall away. */
const COST_GONE = 8

const lines = (text: string) => text.split(/(?<=[.?!])\s+/)

// ====================================================================== GLYPHS
type GlyphKind = 'code' | 'ticket' | 'talk'
/** The three kinds of thing Piramal Mind holds: code, tickets, discussions. */
function Glyph({ kind }: { kind: GlyphKind }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.3, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const
  if (kind === 'code')
    return (
      <svg {...common}>
        <path d="M8.6 6.8 3.6 12l5 5.2M15.4 6.8l5 5.2-5 5.2" />
      </svg>
    )
  if (kind === 'ticket')
    return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" rx="3.6" />
        <path d="M8.4 12.3l2.5 2.5 4.8-5.3" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M5.2 5h13.6a1.7 1.7 0 0 1 1.7 1.7v8a1.7 1.7 0 0 1-1.7 1.7h-6.3L8.3 20.2v-3.8H5.2a1.7 1.7 0 0 1-1.7-1.7v-8A1.7 1.7 0 0 1 5.2 5z" />
      <path d="M8 9.3h8M8 12.5h5" />
    </svg>
  )
}
/** In the order of demo.ingests (codebase, Jira ticket, discussion) and demo.connects (request, discussion, code). */
const INGEST_KIND: GlyphKind[] = ['code', 'ticket', 'talk']
const CONNECT_KIND: GlyphKind[] = ['ticket', 'talk', 'code']

/** The mark of the Mind: three things, joined to each other and to one centre. */
function MindGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 4.6 4.9 17.3h14.2zM12 12.8V4.6M12 12.8 4.9 17.3M12 12.8l7.1 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.6"
      />
      <circle cx="12" cy="4.6" r="2.3" fill="currentColor" />
      <circle cx="4.9" cy="17.3" r="2.3" fill="currentColor" />
      <circle cx="19.1" cy="17.3" r="2.3" fill="currentColor" />
      <circle cx="12" cy="12.8" r="2.7" fill="currentColor" />
    </svg>
  )
}

function Tick() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5 10 17.5 19 7.5" />
    </svg>
  )
}

// ====================================================================== BEFORE
/** The old way: the decision lives in an old ticket, old code and somebody's head. Three pieces, each with a loose end. */
function Before({ product }: P) {
  const d = product.demo
  return (
    <div className="mind-b">
      <svg className="mind-b-ends" viewBox="0 0 250 200" aria-hidden="true">
        <path className="mind-b-tail" d="M54 110C50 116 58 119 55 124" />
        <path className="mind-b-tail" d="M178 135C173 141 182 144 177 150" />
        <path className="mind-b-tail" d="M141 170C148 165 153 175 160 170" />
        <circle className="mind-b-end" cx="55" cy="127.5" r="3.6" />
        <circle className="mind-b-end" cx="177" cy="153.5" r="3.6" />
        <circle className="mind-b-end" cx="163.5" cy="170" r="3.6" />
      </svg>
      <p className="mind-b-what">{product.before.headline}</p>
      <div className="mind-b-card mind-b-card--ticket">
        <p className="mind-b-cap">
          <Glyph kind="ticket" />
          Old tickets
        </p>
        <p className="mind-b-id">{d.talksBack.source.id}</p>
        <i className="mind-b-skel" />
      </div>
      <div className="mind-b-card mind-b-card--code">
        <p className="mind-b-cap">
          <Glyph kind="code" />
          Old code
        </p>
        <p className="mind-b-code">
          theme=<b>&quot;blue&quot;</b>
        </p>
        <i className="mind-b-skel" />
      </div>
      <div className="mind-b-card mind-b-card--head">
        <p className="mind-b-cap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="8.4" r="3.9" />
            <path d="M4.6 20.2c.8-3.9 3.8-5.9 7.4-5.9s6.6 2 7.4 5.9" />
          </svg>
          People’s heads
        </p>
        <span className="mind-b-think">
          <i />
          <i />
          <i />
        </span>
        <i className="mind-b-skel" />
      </div>
      <i className="mind-b-q">
        <b>?</b>
      </i>
    </div>
  )
}

// ====================================================================== THE CENTREPIECE
function Screen({ product }: P) {
  const d = product.demo
  const tb = d.talksBack
  const [builtWord, ...builtRest] = d.built.split(' ')
  const ids = [d.request.id, tb.source.id, CODE_FILE]
  return (
    <div className="mind-board">
      <i className="mind-panel-bg">
        <i className="mind-panel-light" />
      </i>

      {/* ---------- the engineer's session: he is coding with AI ---------- */}
      <div className="mind-win">
        <div className="mind-win-bar">
          <i className="mind-win-dot" />
          <i className="mind-win-dot" />
          <i className="mind-win-dot" />
          <span className="mind-win-who">
            <i>{d.developer[0]}</i>
            {d.developer}
          </span>
          <span className="mind-win-tag">Coding with AI</span>
        </div>

        {/* what he typed */}
        <div className="mind-prompt">
          <p className="mind-prompt-text">
            {lines(d.prompt).map((l) => (
              <span className="mind-prompt-line" key={l}>
                {l}
              </span>
            ))}
          </p>
          <span className="mind-id">{d.request.id}</span>
        </div>

        {/* Piramal Mind talks back, before anything is built */}
        <div className="mind-talk">
          <i className="mind-talk-port" />
          <div className="mind-talk-head">
            <i className="mind-badge">
              <MindGlyph />
            </i>
            <b>{product.name}</b>
            <span className="mind-talk-lead">{tb.lead}</span>
          </div>
          <p className="mind-talk-text">{tb.text}</p>
          <div className="mind-src">
            <i className="mind-src-ico">
              <Glyph kind="talk" />
            </i>
            <div className="mind-src-txt">
              <b>{tb.source.title}</b>
              <span>
                <span className="mind-id">{tb.source.id}</span>
                {tb.source.when}
              </span>
            </div>
          </div>
          <div className="mind-ask">
            <p className="mind-ask-q">{tb.ask}</p>
            <div className="mind-acceptWrap">
              <TouchControl label={d.accept} className="mind-accept">
                <span className="mind-accept-face">
                  <i className="mind-accept-sw">
                    <i />
                    <Tick />
                  </i>
                  {d.accept}
                </span>
              </TouchControl>
              <div className="mind-stamp">
                <i className="mind-stamp-burst" />
                <b>{builtWord}</b>
                <span>{builtRest.join(' ')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* the code, and the app it makes */}
        <div className="mind-work">
          <div className="mind-code">
            <div className="mind-code-tab">
              <Glyph kind="code" />
              {CODE_FILE}
            </div>
            <div className="mind-code-line">
              <i className="mind-code-mark mind-code-mark--chg" />
              <span className="mind-code-no">1</span>
              <span className="mind-code-txt">
                <em>&lt;Header</em> <u>theme</u>=
                <span className="mind-tok">
                  <span className="mind-tok-old">
                    <s>&quot;blue&quot;</s> <em>/&gt;</em>
                  </span>
                  <span className="mind-tok-new">
                    <b>&quot;new&quot;</b> <em>/&gt;</em>
                  </span>
                </span>
              </span>
            </div>
            <div className="mind-code-line">
              <span className="mind-code-no">2</span>
              <span className="mind-code-txt">
                <em>&lt;Step</em> <u>name</u>=<q>&quot;applicant&quot;</q> <em>/&gt;</em>
              </span>
            </div>
            <div className="mind-code-line">
              <i className="mind-code-mark mind-code-mark--add" />
              <span className="mind-code-no">3</span>
              <span className="mind-code-txt mind-code-typed">
                <em>&lt;Step</em> <u>name</u>=<q>&quot;co-applicant&quot;</q> <em>/&gt;</em>
              </span>
              <i className="mind-code-slot" />
            </div>
          </div>
          <div className="mind-pre">
            <p className="mind-pre-strip">Preview</p>
            <div className="mind-pre-band">
              <i className="mind-pre-band-new" />
              <span>Home loan</span>
            </div>
            <div className="mind-pre-row">
              <i className="mind-pre-dot">
                <Tick />
              </i>
              Applicant
            </div>
            <div className="mind-pre-row mind-pre-row--new">
              <i className="mind-pre-slot" />
              <span className="mind-pre-rowin">
                <i className="mind-pre-dot">
                  <Tick />
                </i>
                Co-applicant
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- the thread: what flows in, what it says, what it joins ---------- */}
      <svg className="mind-wires" viewBox={`0 0 ${BOARD.w} ${BOARD.h}`} aria-hidden="true">
        <path className="mind-spine" d={`M${SPINE} ${IN_Y[0]}V${CORE.y - CORE.r}`} />
        <path className="mind-spine-flow" d={`M${SPINE} ${IN_Y[0]}V${CORE.y - CORE.r}`} />
        <path className="mind-spine mind-spine--low" d={`M${SPINE} ${CORE.y + CORE.r}V${LINK_Y[LINK_Y.length - 1]}`} />
        <path className="mind-wire" d={`M${SPINE - CORE.r - 3} ${CORE.y}H${TALK_X + 3}`} />
        <circle className="mind-wire-pulse" cx={SPINE - CORE.r - 3} cy={CORE.y} r="4.4" />
        {LINK_Y.map((y, i) => (
          <path className={`mind-chain mind-chain--${i}`} key={y} d={`M${SPINE} ${i === 0 ? CORE.y + CORE.r : LINK_Y[i - 1]}V${y}`} />
        ))}
      </svg>

      {/* ---------- Piramal Mind: memory above the core, intelligence below it ---------- */}
      <div className="mind-panel">
        <p className="mind-panel-name">
          <MindGlyph />
          {product.name}
        </p>
        <p className="mind-eyebrow mind-eyebrow--mem">Memory</p>
        {d.ingests.map((t, i) => (
          <div className="mind-in" style={{ ['--i' as string]: i }} key={t}>
            <i className="mind-in-node" />
            <span className="mind-in-pill">
              <Glyph kind={INGEST_KIND[i] ?? 'ticket'} />
              {t}
            </span>
          </div>
        ))}
        <div className="mind-core">
          <i className="mind-core-halo" />
          <i className="mind-core-burst" />
          <i className="mind-core-ring" />
          <span className="mind-core-face">
            <MindGlyph />
          </span>
        </div>
        <p className="mind-eyebrow mind-eyebrow--int">Intelligence</p>
        {d.connects.map((c, i) => (
          <div className={`mind-link mind-link--${i}`} style={{ ['--i' as string]: i }} key={c}>
            <i className="mind-link-slot" />
            <i className="mind-link-hole" />
            <i className="mind-link-node">
              <Glyph kind={CONNECT_KIND[i] ?? 'ticket'} />
            </i>
            <span className="mind-link-card">
              <b>{c}</b>
              <span>{ids[i]}</span>
            </span>
          </div>
        ))}
        <p className="mind-close">
          {lines(d.line).map((l) => (
            <Rise key={l}>{l}</Rise>
          ))}
        </p>
      </div>
    </div>
  )
}

// ====================================================================== AROUND THE CENTREPIECE
/** Left column: the request is a ticket, and it is on its way to an engineer. */
function Under({ product }: P) {
  return (
    <div className="mind-req">
      <p className="mind-req-from">{product.demo.request.from}</p>
      <div className="mind-req-row">
        <span className="mind-req-chip">
          <Glyph kind="ticket" />
          <span>Jira ticket</span>
          <b>{product.demo.request.id}</b>
        </span>
        <svg className="mind-req-arrow" viewBox="0 0 64 20" fill="none" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 10h56M50 3l8 7-8 7" />
        </svg>
      </div>
    </div>
  )
}

/** Under the result headline: the other thing it does. A defect comes in, and it is traced back to the change that caused it. */
function Proof({ product }: P) {
  const df = product.demo.defect
  return (
    <div className="mind-defect">
      <p className="mind-defect-h">
        <svg className="mind-defect-pic" viewBox="0 0 76 24" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle className="mind-defect-cause" cx="11" cy="12" r="7" />
          <path className="mind-defect-pm" d="M7.6 12h6.8M11 8.6v6.8" />
          <path className="mind-defect-trace" d="M52 12H22M28.5 6.5 22 12l6.5 5.5" />
          <rect className="mind-defect-tk" x="55" y="2.5" width="19" height="19" rx="4.6" />
          <path className="mind-defect-bang" d="M64.5 7.5v6M64.5 17.2v.2" />
        </svg>
        {df.title}
      </p>
      <p className="mind-defect-p">{df.text}</p>
    </div>
  )
}

/** In flight: what flows into it by itself. Born from the letters of the name, settling into the Mind. */
function Extras({ product }: P) {
  return (
    <>
      {product.demo.ingests.map((t, i) => (
        <span className="mind-fly" key={t} aria-hidden="true">
          <Glyph kind={INGEST_KIND[i] ?? 'ticket'} />
          {t}
        </span>
      ))}
    </>
  )
}

// ====================================================================== STAT
/** A hundred tiles of AI cost. Eighty fall away. */
function Stat({ product }: P) {
  return (
    <div className="mind-cost">
      <span className="mind-cost-label">AI cost</span>
      <svg className="mind-cost-arrow" viewBox="0 0 20 160" aria-hidden="true">
        <path className="mind-cost-line" d="M10 3V151" />
        <path className="mind-cost-head" d="M3 142 10 153 17 142" />
      </svg>
      <div className="mind-cost-tag">
        <div className="mind-cost-tag-in">
          <i className="mind-cost-core">
            <MindGlyph />
          </i>
          <b>{product.name}</b>
        </div>
      </div>
      <div className="mind-tiles">
        {Array.from({ length: COST_COLS * COST_ROWS }, (_, i) => (
          <i className={Math.floor(i / COST_COLS) >= COST_GONE ? 'mind-tile mind-tile--kept' : 'mind-tile'} key={i}>
            <i />
          </i>
        ))}
      </div>
    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<MindProduct>) {
  const { $, $$, U, hx, ease: E, loc, letters, before, demo, run, result, stat } = env
  const clipShut = 'inset(-12% 100% -12% 0%)'
  const clipOpen = 'inset(-12% -3% -12% 0%)'

  // The board keeps clear of the docked name and its caption (the promise, which is a long line here):
  // it stands at the right edge of the content, and on a squarer screen it is drawn a little smaller.
  const boardW = BOARD_W * U
  const cap = loc($('.ev-dockcap'))
  const capRight = cap.w > 0 ? cap.x + cap.w : 35 * U - hx
  const room = hx - Math.max(capRight, 31 * U - hx) - 1.5 * U
  const fit = Math.min(1, room / boardW)
  gsap.set($('.mind-board'), { scale: fit, transformOrigin: '100% 50%' })

  // ---------------------------------------------------------------- before: three pieces, three loose ends
  const bCards = $$('.mind-b-card')
  const bTails = $$<SVGPathElement>('.mind-b-tail')
  const bEnds = $$<SVGCircleElement>('.mind-b-end')
  const bQ = $('.mind-b-q')
  const bWhat = $('.mind-b-what')
  const tilt = [-5, 4, -3]
  gsap.set(bCards, { autoAlpha: 0, y: 2.2 * U, scale: 0.9, rotation: (i) => tilt[i] * 2.6 })
  gsap.set(bTails, { drawSVG: '0%' })
  gsap.set(bEnds, { scale: 0, transformOrigin: '50% 50%' })
  gsap.set(bQ, { scale: 0, rotation: -40 })
  gsap.set(bWhat, { autoAlpha: 0, y: 0.8 * U })
  before
    .to(bWhat, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.1)
    .to(bCards, { autoAlpha: 1, y: 0, scale: 1, rotation: (i) => tilt[i], duration: 0.5, ease: E.snap, stagger: 0.09 }, 0.06)
    .to(bTails, { drawSVG: '100%', duration: 0.26, ease: 'power1.inOut', stagger: 0.07 }, 0.36)
    .to(bEnds, { scale: 1, duration: 0.2, ease: 'back.out(3)', stagger: 0.07 }, 0.5)
    .to(bQ, { scale: 1, rotation: 8, duration: 0.3, ease: 'back.out(2.8)' }, 0.55)

  // ---------------------------------------------------------------- demo: the session, the Mind filling up, and the Mind talking back
  const pills = $$('.mind-in-pill')
  const inNodes = $$('.mind-in-node')
  const flies = $$('.mind-fly')
  const spineFlow = $<SVGPathElement>('.mind-spine-flow')
  const spine = $<SVGPathElement>('.mind-spine')
  const core = $('.mind-core')
  const halo = $('.mind-core-halo')
  const burst = $('.mind-core-burst')
  const prompt = $('.mind-prompt')
  const promptLines = $$('.mind-prompt-line')
  const wire = $<SVGPathElement>('.mind-wire')
  const wirePulse = $<SVGCircleElement>('.mind-wire-pulse')
  const port = $('.mind-talk-port')
  const talk = $('.mind-talk')
  const src = $('.mind-src')
  const ask = $('.mind-ask-q')
  const acceptWrap = $('.mind-acceptWrap')
  const spineLow = $<SVGPathElement>('.mind-spine--low')
  const eyebrowInt = $('.mind-eyebrow--int')
  const linkSlots = $$('.mind-link-slot')
  const linkHoles = $$('.mind-link-hole')

  // measure first: where each stream settles, as the stage stands during the demo
  const slots = pills.map((p) => loc(p))
  const flyBox = flies.map((f) => ({ w: f.offsetWidth, h: f.offsetHeight }))
  /** The letters of the name the three are born from, spread along the word. */
  const birth = flies.map((_, i) => letters[Math.round(((i + 0.5) * (letters.length - 1)) / flies.length)] ?? { cx: 0, cy: -3 * U })
  /** How far the answer travels along its wire, in the wire's own units. */
  const wireLen = SPINE - CORE.r - 3 - (TALK_X + 3)

  gsap.set(pills, { autoAlpha: 0, scale: 1.1 })
  gsap.set(inNodes, { scale: 0 })
  gsap.set([spine, spineLow], { drawSVG: '0%' })
  gsap.set(eyebrowInt, { autoAlpha: 0, y: 0.5 * U })
  gsap.set(linkSlots, { autoAlpha: 0, x: -0.8 * U })
  gsap.set(linkHoles, { scale: 0 })
  gsap.set(spineFlow, { autoAlpha: 0 })
  gsap.set(core, { scale: 0, autoAlpha: 0 })
  gsap.set(halo, { autoAlpha: 0, scale: 0.6 })
  gsap.set(burst, { autoAlpha: 0, scale: 1 })
  gsap.set(prompt, { autoAlpha: 0, scale: 0.9, y: 0.6 * U, transformOrigin: '100% 100%' })
  gsap.set(promptLines, { clipPath: clipShut })
  gsap.set(wire, { drawSVG: '0%' })
  gsap.set(wirePulse, { autoAlpha: 0 })
  gsap.set(port, { scale: 0 })
  gsap.set(talk, { autoAlpha: 0, x: 2.2 * U, scale: 0.94, transformOrigin: '100% 50%' })
  gsap.set([src, ask], { autoAlpha: 0, y: 0.6 * U })
  gsap.set(acceptWrap, { autoAlpha: 0, scale: 0.6 })
  gsap.set(flies, { x: (i) => birth[i].cx, y: (i) => birth[i].cy, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 })

  flies.forEach((f, i) => {
    const from = { x: birth[i].cx, y: birth[i].cy }
    const to = { x: slots[i].cx, y: slots[i].cy }
    // a drift, not a throw: each one swings out on its own curve and settles into the Mind
    const mid = { x: from.x + (to.x - from.x) * 0.5, y: Math.min(from.y, to.y) - (2.4 + (2 - i) * 1.5) * U }
    const born = 0.03 + i * 0.05
    const fly = 0.2 + i * 0.07
    const dur = 0.52
    const land = fly + dur
    demo
      .to(f, { scale: 1, autoAlpha: 1, duration: 0.3, ease: 'back.out(2.2)' }, born)
      .to(f, { motionPath: { path: [mid, to], curviness: 1.3 }, duration: dur, ease: 'power2.inOut' }, fly)
      .to(f, { rotation: 7, duration: dur * 0.45, ease: 'sine.out' }, fly)
      .to(f, { rotation: 0, duration: dur * 0.55, ease: 'sine.inOut' }, fly + dur * 0.45)
      .to(f, { scaleX: slots[i].w / (flyBox[i].w || 1), scaleY: slots[i].h / (flyBox[i].h || 1), autoAlpha: 0, duration: 0.18, ease: 'power2.out' }, land - 0.05)
      .to(pills[i], { autoAlpha: 1, scale: 1, duration: 0.3, ease: E.snap }, land - 0.06)
      .to(inNodes[i], { scale: 1, duration: 0.26, ease: 'back.out(3)' }, land - 0.02)
    env.bump(demo, land - 0.06, 0.6)
  })
  demo
    // the core, and the thread that carries everything down into it
    .to(core, { autoAlpha: 1, duration: 0.1, ease: 'none' }, 0.5)
    .to(core, { scale: 1, duration: 0.4, ease: 'back.out(2.2)' }, 0.5)
    .to(halo, { autoAlpha: 1, scale: 1, duration: 0.45 }, 0.52)
    .to(spine, { drawSVG: '100%', duration: 0.3, ease: 'power2.inOut' }, 0.66)
    .to(spineFlow, { autoAlpha: 1, duration: 0.25 }, 0.86)
    // below the core: room for what it will join up
    .to(spineLow, { drawSVG: '100%', duration: 0.34, ease: 'power2.inOut' }, 0.72)
    .to(eyebrowInt, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.74)
    .to(linkHoles, { scale: 1, duration: 0.24, ease: 'back.out(3)', stagger: 0.06 }, 0.8)
    .to(linkSlots, { autoAlpha: 1, x: 0, duration: 0.28, stagger: 0.06 }, 0.82)
    // the engineer types what he wants
    .to(prompt, { autoAlpha: 1, scale: 1, y: 0, duration: 0.34, ease: E.snap }, 0.32)
    .to(promptLines, { clipPath: clipOpen, duration: 0.2, ease: 'none', stagger: 0.17 }, 0.42)
    // …and before anything is built, the Mind talks back
    .to(burst, { autoAlpha: 0.9, duration: 0.01 }, 0.8)
    .to(burst, { scale: 2.1, autoAlpha: 0, duration: 0.42, ease: 'power2.out' }, 0.81)
    .to(wire, { drawSVG: '100%', duration: 0.16, ease: 'power1.in' }, 0.8)
    .to(wirePulse, { autoAlpha: 1, duration: 0.03, ease: 'none' }, 0.8)
    .to(wirePulse, { x: -wireLen, duration: 0.16, ease: 'power1.in' }, 0.8)
    .to(wirePulse, { autoAlpha: 0, duration: 0.06, ease: 'none' }, 0.95)
    .to(port, { scale: 1, duration: 0.24, ease: 'back.out(3)' }, 0.94)
    .to(talk, { autoAlpha: 1, x: 0, scale: 1, duration: 0.34, ease: E.snap }, 0.88)
    .to([src, ask], { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.05 }, 0.94)
    .to(acceptWrap, { autoAlpha: 1, duration: 0.1, ease: 'none' }, 0.98)
    .to(acceptWrap, { scale: 1, duration: 0.27, ease: 'back.out(2.4)' }, 0.98)

  // ---------------------------------------------------------------- run: built in the new theme; and how it knew
  const face = $('.mind-accept-face')
  const swatch = $('.mind-accept-sw > i')
  const swTick = $<SVGPathElement>('.mind-accept-sw path')
  const slot = $('.mind-code-slot')
  const typed = $('.mind-code-typed')
  const markAdd = $('.mind-code-mark--add')
  const markChg = $('.mind-code-mark--chg')
  const tokOld = $('.mind-tok-old')
  const tokNew = $('.mind-tok-new')
  const preSlot = $('.mind-pre-slot')
  const preRow = $('.mind-pre-rowin')
  const bandNew = $('.mind-pre-band-new')
  const stamp = $('.mind-stamp')
  const stampBurst = $('.mind-stamp-burst')
  const coreFace = $('.mind-core-face')
  const chains = $$<SVGPathElement>('.mind-chain')
  const linkNodes = $$('.mind-link-node')
  const linkCards = $$('.mind-link-card')
  const closeLines = $$('.mind-close .ev-rise')

  gsap.set(swTick, { drawSVG: '0%' })
  gsap.set(typed, { clipPath: clipShut })
  gsap.set([markAdd, markChg], { autoAlpha: 0 })
  gsap.set(tokNew, { yPercent: 118 })
  gsap.set(preRow, { autoAlpha: 0, scale: 0.9 })
  gsap.set(bandNew, { clipPath: 'inset(0% 100% 0% 0%)' })
  gsap.set(stamp, { autoAlpha: 0, scale: 2.6, rotation: -22, xPercent: -50, yPercent: -50 })
  gsap.set(stampBurst, { autoAlpha: 0 })
  gsap.set(chains, { drawSVG: '0%' })
  gsap.set(linkNodes, { scale: 0 })
  gsap.set(linkCards, { autoAlpha: 0, x: -1 * U })

  const hit = 1.3
  run
    // the touch: yes, the new theme
    .to(face, { scale: 0.94, duration: 0.08, ease: 'power2.in' }, 0)
    .to(face, { scale: 1, duration: 0.4, ease: 'back.out(3.2)' }, 0.08)
    .to(swatch, { scale: 0, duration: 0.14, ease: 'power2.in' }, 0.03)
    .to(swTick, { drawSVG: '100%', duration: 0.26, ease: 'power2.out' }, 0.14)
    .to(ask, { autoAlpha: 0.62, duration: 0.2 }, 0.1)
    // the step is written…
    .to(slot, { autoAlpha: 0, duration: 0.14 }, 0.26)
    .to(markAdd, { autoAlpha: 1, duration: 0.2 }, 0.26)
    .to(typed, { clipPath: clipOpen, duration: 0.4, ease: 'none' }, 0.3)
    .to(preSlot, { autoAlpha: 0, duration: 0.14 }, 0.5)
    .to(preRow, { autoAlpha: 1, scale: 1, duration: 0.3, ease: E.snap }, 0.52)
    // …and the header is built in the new theme, not the blue one
    .to(markChg, { autoAlpha: 1, duration: 0.2 }, 0.66)
    .to(tokOld, { yPercent: -118, duration: 0.24, ease: 'power3.in' }, 0.68)
    .to(tokNew, { yPercent: 0, duration: 0.34, ease: 'power3.out' }, 0.84)
    .to(bandNew, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.46, ease: E.inOut }, 0.8)
    // Built in the new theme
    .to(face, { autoAlpha: 0, duration: 0.16, ease: 'power1.in' }, hit - 0.26)
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.24)
    .to(stamp, { scale: 1, rotation: -6, duration: 0.24, ease: E.slam }, hit - 0.24)
    .to(stampBurst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(stampBurst, { scale: 1.5, autoAlpha: 0, duration: 0.44, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, hit, 2.4)
  // how it knew: the request, the discussion and the code, on one thread
  const join = 1.52
  run
    .to(coreFace, { scale: 1.12, duration: 0.1, ease: 'power2.out' }, join - 0.06)
    .to(coreFace, { scale: 1, duration: 0.3, ease: 'back.out(2.6)' }, join + 0.04)
    .to(burst, { scale: 1, autoAlpha: 0.9, duration: 0.01 }, join - 0.06)
    .to(burst, { scale: 2.1, autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, join - 0.05)
  chains.forEach((c, k) => {
    const s = join + k * 0.22
    run
      .to(c, { drawSVG: '100%', duration: 0.2, ease: 'power1.inOut' }, s)
      .to(linkNodes[k], { scale: 1, duration: 0.3, ease: 'back.out(3)' }, s + 0.16)
      .to(linkSlots[k], { autoAlpha: 0, duration: 0.16 }, s + 0.2)
      .to(linkCards[k], { autoAlpha: 1, x: 0, duration: 0.34, ease: E.snap }, s + 0.2)
  })
  run.to(closeLines, { yPercent: 0, duration: 0.46, stagger: 0.12 }, 2.2)

  // ---------------------------------------------------------------- result: the other thing it does, a defect traced back
  const trace = $<SVGPathElement>('.mind-defect-trace')
  const cause = $$<SVGElement>('.mind-defect-cause, .mind-defect-pm')
  gsap.set(trace, { drawSVG: '0%' })
  gsap.set(cause, { scale: 0, transformOrigin: '50% 50%' })
  result.to(trace, { drawSVG: '100%', duration: 0.3, ease: 'power2.inOut' }, 0.56).to(cause, { scale: 1, duration: 0.26, ease: 'back.out(3)' }, 0.68)

  // ---------------------------------------------------------------- stat: 80 of every 100 fall away
  const tiles = $$('.mind-tile')
  const fills = $$('.mind-tile > i')
  const goneFills = fills.slice(0, COST_GONE * COST_COLS)
  const keptFills = fills.slice(COST_GONE * COST_COLS)
  const costLabel = $('.mind-cost-label')
  const costLine = $<SVGPathElement>('.mind-cost-line')
  const costHead = $<SVGPathElement>('.mind-cost-head')
  const tag = $('.mind-cost-tag-in')
  const tileH = loc(tiles[0]).h || U
  gsap.set(tiles, { autoAlpha: 0 })
  gsap.set(fills, { scale: 0.3, autoAlpha: 0 })
  gsap.set(costLabel, { autoAlpha: 0, y: 0.6 * U })
  gsap.set(costLine, { drawSVG: '0%' })
  gsap.set(costHead, { y: -136, autoAlpha: 0 })
  gsap.set(tag, { autoAlpha: 0, x: -1.4 * U })
  const rowOf = (i: number) => Math.floor(i / COST_COLS)
  const colOf = (i: number) => i % COST_COLS
  /** The number counts fast and then settles; the rows fall the same way: quickly at first, the last one as it lands. */
  const fallAt = (row: number) => 0.5 + 0.56 * Math.pow(row / (COST_GONE - 1), 1.6)
  const build = (i: number) => (COST_ROWS - 1 - rowOf(i)) * 0.012 + colOf(i) * 0.003
  stat
    // the whole cost, built from the ground up
    .to(tiles, { autoAlpha: 1, duration: 0.12, ease: 'none', stagger: build }, 0.2)
    .to(fills, { scale: 1, autoAlpha: 1, duration: 0.16, ease: 'back.out(2)', stagger: build }, 0.2)
    .to(costLabel, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.3)
    // and then eighty of every hundred fall away, row by row, as the number counts
    .to(goneFills, { scale: 0.25, autoAlpha: 0, y: tileH * 0.5, duration: 0.24, ease: 'power2.in', stagger: (i: number) => fallAt(rowOf(i)) - 0.5 + colOf(i) * 0.007 }, 0.5)
    .to(costHead, { autoAlpha: 1, duration: 0.1, ease: 'none' }, 0.5)
    .to(costHead, { y: 0, duration: 0.8, ease: 'sine.out' }, 0.5)
    .to(costLine, { drawSVG: '100%', duration: 0.8, ease: 'sine.out' }, 0.5)
    // what is left
    .to(tag, { autoAlpha: 1, x: 0, duration: 0.4, ease: E.snap }, 0.86)
    .to(keptFills, { scale: 1.14, duration: 0.09, ease: 'power2.out', stagger: { each: 0.004, from: 'start' } }, 1.2)
    .to(keptFills, { scale: 1, duration: 0.14, ease: 'power2.inOut', stagger: { each: 0.004, from: 'start' } }, 1.28)

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: $('.mind-cost-core') }
}

const mind: MomentModule<MindProduct> = {
  key: 'mind',
  device: 'none',
  // Priya's side of it: what her team asked for. "The request" is also the first thing the Mind joins up.
  demoTitle: MIND.demo.connects[0],
  demoLine: MIND.demo.request.text,
  highlight: 'it connects them',
  Before,
  Screen,
  Stat,
  Under,
  Proof,
  Extras,
  animate,
}

export default mind
