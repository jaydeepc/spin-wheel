'use client'

/**
 * Piramal Mind · its own chapter, after Priya's day · with the engineering team.
 *
 * The one idea: PIRAMAL MIND IS THE ENGINEERING TEAM'S MEMORY AND INTELLIGENCE.
 * Memory: every codebase, every Jira ticket and every discussion flows into it by itself
 * (the client's word: it is auto-ingested). Intelligence: it connects them, so it talks back
 * before something is built the old way.
 *
 * ONE IDEA PER REST (moments/README.md, THE BUDGET):
 *
 * Before   what was decided, and why, is scattered: an old ticket, old code, somebody's head,
 *          each with a loose end. (The headline is the frame's: `beforeHeadline`.)
 * Demo     IT TALKS BACK BEFORE ANYTHING IS BUILT. The engineer's one line, and Piramal Mind's
 *          reply with the one control. Nothing else: six rows of words. (Its memory is not
 *          shown here: it is the result's picture, and it is shown once.)
 * Run      touch "Use the new theme": Piramal Mind opens over the conversation from the very
 *          button that was pressed. Its memory arrives at the head of it, one strip: the
 *          three things that flow into it, and "Auto-ingested". From it one thread joins the
 *          request, the discussion and the code. Then the ONE move: the new theme sweeps
 *          across the header he asked for in blue, and it is stamped Built in the new theme.
 * Result   IT REMEMBERS, AND IT CONNECTS. That picture stays: the memory, and the three
 *          things it joined, each named in two words (no second lines). Under the headline,
 *          the other thing it does: a defect, traced (the one supporting line).
 * Stat     100 tiles of AI cost; 80 fall away
 *
 * There is no device frame here (device: 'none'): the Screen is the centrepiece itself, and it
 * takes the picture area's own box. Everything on it is sized from --m, the board's own unit
 * (the area is 46m wide and 42m tall at the least), so it is the same picture at every size.
 */

import gsap from 'gsap'
import type { MindProduct } from '../content'
import { TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './mind.css'

type P = PartProps<MindProduct>

const COST_COLS = 10
const COST_ROWS = 10
/** 80% lower: the top eight rows of ten fall away. */
const COST_GONE = 8

/** Each sentence on its own line. (No lookbehind: Safari before 16.4 cannot parse one.) */
const lines = (text: string): string[] => {
  const found = text.match(/[^.?!]+[.?!]*/g)
  const out = found ? found.map((s) => s.trim()).filter(Boolean) : []
  return out.length ? out : [text]
}

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
/**
 * The old way: the decision lives in an old ticket, old code and somebody's head. Three pieces,
 * each with a loose end, and nobody can say why. (25u × 20u; the headline is in the statement slot.)
 */
function Before({ product }: P) {
  const d = product.demo
  return (
    <div className="mind-b">
      <svg className="mind-b-ends" viewBox="0 0 250 200" aria-hidden="true">
        <path className="mind-b-tail" d="M62 80C57 87 67 91 63 98" />
        <path className="mind-b-tail" d="M190 124C184 131 195 135 190 142" />
        <path className="mind-b-tail" d="M150 157C158 151 164 163 172 157" />
        <circle className="mind-b-end" cx="63" cy="102" r="4" />
        <circle className="mind-b-end" cx="190" cy="146" r="4" />
        <circle className="mind-b-end" cx="176" cy="157" r="4" />
      </svg>
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
  return (
    <div className="mind-board">
      {/* ---------- DEMO: the engineer's one line, and Piramal Mind talks back ---------- */}
      <div className="mind-chat">
        <div className="mind-prompt" aria-label={d.developer}>
          <p className="mind-prompt-text">
            {lines(d.prompt).map((l) => (
              <span className="mind-prompt-line" key={l}>
                {l}
              </span>
            ))}
          </p>
          <i className="mind-who" aria-hidden="true">
            {d.developer[0]}
          </i>
        </div>

        <div className="mind-talk">
          <div className="mind-talk-in">
            <div className="mind-talk-head">
              <i className="mind-badge">
                <MindGlyph />
              </i>
              <b>{product.name}</b>
              <span className="mind-talk-lead">{tb.lead}</span>
            </div>
            <p className="mind-talk-text">{tb.text}</p>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- RESULT: Piramal Mind, opened. One thread joins the request, the discussion and the code ---------- */}
      <div className="mind-panel">
        <i className="mind-panel-light" />
        <i className="mind-thread">
          <i className="mind-thread-line" />
          <i className="mind-thread-bead" />
        </i>
        <div className="mind-links">
          {d.connects.map((c, i) => (
            <div className={`mind-link mind-link--${i}`} key={c}>
              <i className="mind-link-node">
                <Glyph kind={CONNECT_KIND[i] ?? 'ticket'} />
              </i>
              <i className="mind-link-stub" />
              <div className="mind-link-card">
                <b>{c}</b>
                {/* the request and the discussion are named, and no more; the code is the picture itself */}
                {i < d.connects.length - 1 ? null : (
                  <>
                    {/* the header he was about to build in the blue theme: the new theme sweeps across it */}
                    <i className="mind-app">
                      <i className="mind-app-band">
                        <i className="mind-app-new" />
                        <i className="mind-app-mark" />
                        <i className="mind-app-title" />
                      </i>
                      <i className="mind-app-step" />
                      <i className="mind-app-step mind-app-step--new" />
                    </i>
                    <div className="mind-stamp">
                      <i className="mind-stamp-burst" />
                      <b>{builtWord}</b>
                      <span>{builtRest.join(' ')}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- its memory: one strip, at the head of the opened Mind. It fills by itself, all the time ---------- */}
      <div className="mind-mem">
        <div className="mind-mem-in" data-ev-solid>
          <div className="mind-mem-top">
            <span className="mind-core">
              <i className="mind-core-take" />
              <i className="mind-core-burst" />
              <i className="mind-core-ring" />
              <span className="mind-core-face">
                <MindGlyph />
              </span>
            </span>
            {/* the client's own word for it */}
            <span className="mind-auto">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path className="mind-auto-in" d="M12 3.2v10M7.6 9.2l4.4 4.4 4.4-4.4" />
                <path d="M4.2 14.6v3.6a2 2 0 0 0 2 2h11.6a2 2 0 0 0 2-2v-3.6" />
              </svg>
              {d.ingested}
            </span>
            {/* quiet traffic toward the core, for as long as the board is up */}
            <i className="mind-flow">
              <i />
            </i>
          </div>
          <div className="mind-mem-items">
            {d.ingests.map((t, i) => (
              <span className="mind-in" style={{ ['--i' as string]: i }} key={t}>
                <i className="mind-in-ico">
                  <Glyph kind={INGEST_KIND[i] ?? 'ticket'} />
                </i>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ====================================================================== AROUND THE CENTREPIECE
/**
 * The one supporting line under the result headline: the other thing it does. A defect comes in,
 * and it is traced back to the change that caused it. The script's two halves (demo.defect.title,
 * demo.defect.text) are set as ONE sentence: the title, a comma, the text.
 */
function Proof({ product }: P) {
  const df = product.demo.defect
  return (
    <p className="mind-defect">
      <b>{df.title},</b> {df.text.charAt(0).toLowerCase() + df.text.slice(1)}
    </p>
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
  const { $, $$, U, ease: E, loc, before, demo, run, result, stat } = env
  const clipShut = 'inset(-12% 100% -12% 0%)'
  const clipOpen = 'inset(-12% -3% -12% 0%)'

  // ---------------------------------------------------------------- before: three pieces, three loose ends
  const bCards = $$('.mind-b-card')
  const bTails = $$<SVGPathElement>('.mind-b-tail')
  const bEnds = $$<SVGCircleElement>('.mind-b-end')
  const bQ = $('.mind-b-q')
  const tilt = [-5, 4, -3]
  gsap.set(bCards, { autoAlpha: 0, y: 2.2 * U, scale: 0.9, rotation: (i) => tilt[i] * 2.6 })
  gsap.set(bTails, { drawSVG: '0%' })
  gsap.set(bEnds, { scale: 0, transformOrigin: '50% 50%' })
  gsap.set(bQ, { scale: 0, rotation: -40 })
  before
    .to(bCards, { autoAlpha: 1, y: 0, scale: 1, rotation: (i) => tilt[i], duration: 0.5, ease: E.snap, stagger: 0.09 }, 0.06)
    .to(bTails, { drawSVG: '100%', duration: 0.26, ease: 'power1.inOut', stagger: 0.07 }, 0.36)
    .to(bEnds, { scale: 1, duration: 0.2, ease: 'back.out(3)', stagger: 0.07 }, 0.5)
    .to(bQ, { scale: 1, rotation: 8, duration: 0.3, ease: 'back.out(2.8)' }, 0.55)

  // ---------------------------------------------------------------- the cast of the board
  const chat = $('.mind-chat')
  const prompt = $('.mind-prompt')
  const promptLines = $$('.mind-prompt-line')
  const talk = $('.mind-talk')
  const talkText = $('.mind-talk-text')
  const ask = $('.mind-ask-q')
  const acceptWrap = $('.mind-acceptWrap')
  const control = $<HTMLElement>('[data-ev-control]')
  const panel = $('.mind-panel')
  const memIn = $('.mind-mem-in')
  const items = $$('.mind-in')
  const auto = $('.mind-auto')
  const flow = $('.mind-flow')
  const core = $('.mind-core')
  const burst = $('.mind-core-burst')

  // Measure first, as the stage stands during the demo.
  const pb = loc(panel)
  const press = loc(control)
  /** The Mind opens from the button that was pressed: a circle, from its centre to the farthest corner. */
  const from = { x: press.cx - pb.x, y: press.cy - pb.y }
  const reach = Math.hypot(Math.max(from.x, pb.w - from.x), Math.max(from.y, pb.h - from.y)) + 5 * U
  // Whole pixels, written as plain numbers: a value like "830.0px" (toFixed) cannot be tweened.
  // GSAP reads its unit as ".0px", writes "415.2.0px" on the way, the browser drops that, and the
  // Mind then opens in one jump at the end instead of growing from the button.
  const circle = (r: number) => `circle(${Math.round(r)}px at ${Math.round(from.x)}px ${Math.round(from.y)}px)`

  // ---------------------------------------------------------------- demo: his one line, and the Mind talks back
  gsap.set(prompt, { autoAlpha: 0, scale: 0.9, y: 0.8 * U, transformOrigin: '100% 100%' })
  gsap.set(promptLines, { clipPath: clipShut })
  gsap.set(talk, { autoAlpha: 0, y: 2.4 * U, scale: 0.95, transformOrigin: '0% 0%' })
  gsap.set(talkText, { autoAlpha: 0, y: 1 * U })
  gsap.set(ask, { autoAlpha: 0, y: 0.7 * U })
  gsap.set(acceptWrap, { autoAlpha: 0, scale: 0.6 })
  // (its memory is the result's picture: it arrives in the run, at the head of the opened Mind)
  gsap.set(memIn, { autoAlpha: 0, y: -1.6 * U })
  gsap.set(items, { autoAlpha: 0, scale: 1.14, y: 0.5 * U })
  gsap.set(auto, { autoAlpha: 0, x: -0.8 * U })
  gsap.set(flow, { autoAlpha: 0 })
  gsap.set(core, { scale: 0 })
  gsap.set(burst, { autoAlpha: 0, scale: 1 })

  demo
    // the engineer types what he wants (once the name has left the middle of the stage)
    .to(prompt, { autoAlpha: 1, scale: 1, y: 0, duration: 0.36, ease: E.snap }, 0.4)
    .to(promptLines, { clipPath: clipOpen, duration: 0.2, ease: 'none', stagger: 0.14 }, 0.48)
    // …and before anything is built, Piramal Mind talks back
    .to(talk, { autoAlpha: 1, duration: 0.16, ease: 'none' }, 0.54)
    .to(talk, { y: 0, scale: 1, duration: 0.46, ease: E.snap }, 0.54)
    .to(talkText, { autoAlpha: 1, y: 0, duration: 0.34 }, 0.7)
    .to(ask, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.84)
    .to(acceptWrap, { autoAlpha: 1, duration: 0.1, ease: 'none' }, 0.93)
    .to(acceptWrap, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, 0.93)

  // ---------------------------------------------------------------- run: the Mind opens, joins the three, and it is built in the new theme
  const face = $('.mind-accept-face')
  const swatch = $('.mind-accept-sw > i')
  const swTick = $<SVGPathElement>('.mind-accept-sw path')
  const threadLine = $('.mind-thread-line')
  const bead = $('.mind-thread-bead')
  const nodes = $$('.mind-link-node')
  const stubs = $$('.mind-link-stub')
  const cards = $$('.mind-link-card')
  const bandNew = $('.mind-app-new')
  const stepNew = $('.mind-app-step--new')
  const stamp = $('.mind-stamp')
  const stampBurst = $('.mind-stamp-burst')
  const threadLen = loc($('.mind-thread')).h

  gsap.set(swTick, { drawSVG: '0%' })
  gsap.set(panel, { autoAlpha: 0, clipPath: circle(0) })
  gsap.set(threadLine, { scaleY: 0, transformOrigin: '50% 0%' })
  gsap.set(bead, { autoAlpha: 0, y: 0 })
  gsap.set(nodes, { scale: 0 })
  gsap.set(stubs, { scaleX: 0, transformOrigin: '0% 50%' })
  gsap.set(cards, { autoAlpha: 0, x: -1.6 * U })
  gsap.set(bandNew, { clipPath: 'inset(0% 100% 0% 0%)' })
  gsap.set(stepNew, { autoAlpha: 0, scaleX: 0.7, transformOrigin: '0% 50%' })
  gsap.set(stamp, { autoAlpha: 0, scale: 2.6, rotation: -22 })
  gsap.set(stampBurst, { autoAlpha: 0 })

  const open = 0.14
  /** Its memory arrives at the head of the opened Mind, once the opening has reached it. */
  const remember = open + 0.46
  const join = 0.92
  const each = 0.22
  /** The one move: the new theme sweeps across the header he asked for in blue. */
  const sweep = join + each * 2 + 0.42
  const hit = sweep + 0.56
  run
    // the touch: yes, the new theme
    .to(face, { scale: 0.94, duration: 0.08, ease: 'power2.in' }, 0)
    .to(face, { scale: 1, duration: 0.36, ease: 'back.out(3.2)' }, 0.08)
    .to(swatch, { scale: 0, duration: 0.12, ease: 'power2.in' }, 0.02)
    .to(swTick, { drawSVG: '100%', duration: 0.22, ease: 'power2.out' }, 0.1)
    // Piramal Mind opens over the conversation, from the button itself…
    .to(panel, { autoAlpha: 1, duration: 0.01, ease: 'none' }, open)
    .to(panel, { clipPath: circle(reach), duration: 0.62, ease: 'power2.inOut' }, open)
    .to(chat, { autoAlpha: 0, duration: 0.01, ease: 'none' }, open + 0.62)
    // …and at the head of it, its memory: what flows into it by itself, all the time
    .to(memIn, { autoAlpha: 1, duration: 0.12, ease: 'none' }, remember)
    .to(memIn, { y: 0, duration: 0.4, ease: E.snap }, remember)
    .to(core, { scale: 1, duration: 0.34, ease: 'back.out(2.4)' }, remember + 0.06)
    .to(items, { autoAlpha: 1, scale: 1, y: 0, duration: 0.3, ease: E.snap, stagger: 0.07 }, remember + 0.1)
    // from here on the traffic never stops (CSS, idle): it is auto-ingested
    .to(auto, { autoAlpha: 1, x: 0, duration: 0.28 }, remember + 0.24)
    .to(flow, { autoAlpha: 1, duration: 0.25 }, remember + 0.28)
    .to(burst, { autoAlpha: 0.9, duration: 0.01, ease: 'none' }, join - 0.06)
    .to(burst, { scale: 2.2, autoAlpha: 0, duration: 0.45, ease: 'power2.out' }, join - 0.05)
    // one thread, from the memory, through the request, the discussion and the code
    .to(threadLine, { scaleY: 1, duration: each * 2 + 0.3, ease: 'power1.inOut' }, join)
  cards.forEach((c, k) => {
    const s = join + 0.14 + k * each
    run
      .to(nodes[k], { scale: 1, duration: 0.3, ease: 'back.out(3)' }, s)
      .to(stubs[k], { scaleX: 1, duration: 0.14, ease: 'power1.out' }, s + 0.08)
      .to(c, { autoAlpha: 1, duration: 0.12, ease: 'none' }, s + 0.1)
      .to(c, { x: 0, duration: 0.38, ease: E.snap }, s + 0.1)
  })
  run
    // BUILT IN THE NEW THEME: one sweep across the header, the new step with it, and the stamp
    .to(bandNew, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: E.inOut }, sweep)
    .to(stepNew, { autoAlpha: 1, scaleX: 1, duration: 0.32, ease: E.snap }, sweep + 0.2)
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.24)
    .to(stamp, { scale: 1, rotation: -6, duration: 0.24, ease: E.slam }, hit - 0.24)
    .to(stampBurst, { autoAlpha: 0.8, duration: 0.01, ease: 'none' }, hit)
    .to(stampBurst, { scale: 1.5, autoAlpha: 0, duration: 0.44, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, hit, 2.4)

  // ---------------------------------------------------------------- result: it connects them. One pulse runs the thread, as the headline says so
  result
    .to(bead, { autoAlpha: 1, duration: 0.08, ease: 'none' }, 0.22)
    .to(bead, { y: threadLen, duration: 0.56, ease: 'power1.inOut' }, 0.22)
    .to(bead, { autoAlpha: 0, duration: 0.1, ease: 'none' }, 0.74)
  nodes.forEach((n, k) => {
    const at = 0.3 + k * 0.18
    result.to(n, { scale: 1.16, duration: 0.09, ease: 'power2.out' }, at).to(n, { scale: 1, duration: 0.2, ease: 'back.out(2.6)' }, at + 0.09)
  })

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

  return { control, deviceLandsOn: $('.mind-cost-core') }
}

const mind: MomentModule<MindProduct> = {
  key: 'mind',
  device: 'none',
  // Her 'before' line sets up the request, not the problem: the old way is stated in the statement slot.
  beforeHeadline: true,
  highlight: 'it connects them',
  Before,
  Screen,
  Stat,
  Proof,
  animate,
}

export default mind
