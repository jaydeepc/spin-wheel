'use client'

/**
 * Slide 21 · "AI is reshaping software: companies now build what they used to buy."
 *
 * THE IDEA: bought, then built. The bought software comes down as a stack of locked boxes and
 * the old way of working draws under it in grey; beside the stack waits one closed navy cube,
 * and an empty grid. Then the cube opens, and tile after tile tumbles out over an arc and lands
 * in the grid until the company has its own; the bought stack steps back, and the new way
 * draws under it in flame. Tiles keep coming over the arc for as long as the slide is up.
 * The boxes, the cube and the tiles are real objects (blocks.ts, scene-owned three.js).
 *
 *   bought   the headline; the locked boxes stack up; 32% is pinned up and counts; FROM draws
 *   build    the cube opens, sixteen tiles fly and land, the sparkle; TO draws; the example
 *   news     the clipping is pinned up; billing changes too
 *   example  the presenter's use case: the rest of the slide steps away, one sentence is typed
 *            into a prompt box, and the grid's tiles cross into a browser window and become a
 *            vendor-management screen (an illustration: generic labels only)
 *
 * Without WebGL the deck's own flat picture stands in, from the first rest on.
 */

import gsap from 'gsap'
import { Fragment } from 'react'
import { anim, BrowserFrame, Clipping, Count, Headline, Kicker, Pic, pic, place, Words, type SceneCtx, type SceneModule } from '../../kit'
import { makeBlocks, type Blocks } from './blocks'
import { ASK, BILLING, BLOCKS_PIC, BLOCKS_RECT, CAPTION, CLIP, FLAME, FROM, GRID, PANEL, QUOTE, SKIPPED, SOURCES, TILE_ORDER, TO, UI, cell, TILE } from './data'
import './scene.css'

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`

const Arrow = () => (
  <svg className="s21-arrow" viewBox="0 0 30 12" aria-hidden="true">
    <path d="M2 6 H25" />
    <path d="M20 1.8 L26 6 L20 10.2" />
  </svg>
)

function Flow({ kind, label, steps }: { kind: 'from' | 'to'; label: string; steps: string[] }) {
  return (
    <div className={`s21-flow s21-flow--${kind}`}>
      <span className="s21-flow-k">{label}</span>
      {steps.map((s, i) => (
        <Fragment key={s}>
          {i ? <Arrow /> : null}
          <span className="s21-slot">
            {kind === 'to' ? <span className="s21-ghost" aria-hidden="true" /> : null}
            <span className="s21-step">{s}</span>
          </span>
        </Fragment>
      ))}
    </div>
  )
}

/** A part of the ring: an arc from `from` to `to` degrees, clockwise from the top. */
function arc(from: number, to: number) {
  const pt = (deg: number) => {
    const r = ((deg - 90) * Math.PI) / 180
    return `${(30 + 21 * Math.cos(r)).toFixed(2)} ${(30 + 21 * Math.sin(r)).toFixed(2)}`
  }
  return `M${pt(from)} A21 21 0 ${to - from > 180 ? 1 : 0} 1 ${pt(to)}`
}

const tileOf = (i: number) => (i >= 0 ? { 'data-tile': i } : {})

/** The example's screen: what one sentence became. Generic labels only. */
function VendorScreen() {
  return (
    <div className="s21-ui">
      <div className="s21-ui-side">
        <svg className="s21-ui-mark" viewBox="0 0 20 20" aria-hidden="true" {...tileOf(0)}>
          <rect x="1" y="1" width="8" height="8" rx="2.2" fill="#f1663f" />
          <rect x="11" y="1" width="8" height="8" rx="2.2" fill="#62a6f4" />
          <rect x="1" y="11" width="8" height="8" rx="2.2" fill="#accffb" />
          <rect x="11" y="11" width="8" height="8" rx="2.2" fill="#fba688" />
        </svg>
        {UI.nav.map((n, i) => (
          <span key={n} className={`s21-ui-nav${i ? '' : ' s21-ui-nav--on'}`} {...tileOf(i ? -1 : 1)}>
            <i aria-hidden="true" />
            {n}
          </span>
        ))}
      </div>
      <div className="s21-ui-top">
        <b className="s21-ui-title" {...tileOf(3)}>
          {UI.nav[0]}
        </b>
        <span className="s21-ui-search" {...tileOf(6)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="8.6" cy="8.6" r="5.4" />
            <path d="M12.8 12.8 L17.4 17.4" />
          </svg>
          {UI.search}
        </span>
        <span className="s21-ui-add" {...tileOf(4)}>
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M10 4 V16 M4 10 H16" />
          </svg>
          {UI.add}
        </span>
      </div>
      <div className="s21-ui-card s21-ui-list">
        <div className="s21-ui-head">
          {UI.head.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {UI.rows.map((r) => (
          <div key={r.name} className="s21-ui-row">
            <span className="s21-ui-who">
              <i className={`s21-ui-av s21-ui-av--${r.tone}`} {...tileOf(r.tile)}>
                {r.name.slice(-1)}
              </i>
              <b className="s21-ui-name">{r.name}</b>
            </span>
            <span className="s21-ui-cell">
              <span className={`s21-ui-chip s21-ui-chip--${r.status.toLowerCase()}`} {...tileOf(r.chipTile)}>
                <i aria-hidden="true" />
                {r.status}
              </span>
            </span>
            <span className={`s21-ui-track s21-ui-track--${r.status.toLowerCase()}`} aria-hidden="true">
              <i style={{ width: `${r.term}%` }} />
            </span>
          </div>
        ))}
      </div>
      <div className="s21-ui-card s21-ui-pay">
        <b className="s21-ui-ct">{UI.nav[2]}</b>
        <div className="s21-ui-bars" aria-hidden="true">
          {UI.bars.map((b, i) => (
            <i key={i} className={`s21-ui-bar s21-ui-bar--${b.tone}`} style={{ height: `${b.h}%` }} {...tileOf(b.tile)} />
          ))}
        </div>
      </div>
      <div className="s21-ui-card s21-ui-con">
        <b className="s21-ui-ct">{UI.nav[1]}</b>
        <div className="s21-ui-con-row">
          <svg className="s21-ui-ring" viewBox="0 0 60 60" aria-hidden="true" {...tileOf(12)}>
            {UI.ring.map((p) => (
              <path key={p.status} className={`s21-ui-arc s21-ui-arc--${p.status.toLowerCase()}`} d={arc(p.from, p.to)} />
            ))}
          </svg>
          <ul className="s21-ui-legend">
            {UI.ring.map((p) => (
              <li key={p.status} className={`s21-ui-key s21-ui-key--${p.status.toLowerCase()}`}>
                <i aria-hidden="true" />
                {p.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const scene: SceneModule = {
  beats: ['bought', 'build', 'news', 'example'],
  preload: [pic(21, BLOCKS_PIC)],

  Scene: ({ slide }) => (
    <div className="s21">
      <Headline text={slide.title} flame={FLAME} />

      {/* only where there is no WebGL: the deck's own picture, whole */}
      <Pic className="s21-flat" n={21} name={BLOCKS_PIC} fit="contain" style={place(BLOCKS_RECT, { dy: -1.2 })} />

      {/* the ground the boxes stand on, and the company's own grid: its cells wait, empty */}
      <span className="s21-floor" aria-hidden="true" />
      <div className="s21-panel" aria-hidden="true" style={{ left: u(PANEL.x), top: u(PANEL.y), width: u(PANEL.size), height: u(PANEL.size) }}>
        {GRID.map((_, i) => {
          const c = cell(Math.floor(i / 4), i % 4)
          return <i key={i} style={{ left: u(c.u - PANEL.x - TILE / 2), top: u(c.v - PANEL.y - TILE / 2), width: u(TILE), height: u(TILE) }} />
        })}
      </div>
      <svg className="s21-spark" viewBox="0 0 60 60" aria-hidden="true" style={{ left: u(PANEL.x + PANEL.size - 2.1), top: u(PANEL.y - 2.9) }}>
        <path className="s21-spark-star" d="M26 6 C28 22 32 26 48 30 C32 34 28 38 26 54 C24 38 20 34 4 30 C20 26 24 22 26 6 Z" />
        <circle className="s21-spark-dot" cx="51" cy="10" r="3.4" />
      </svg>

      <Flow kind="from" label={FROM.label} steps={FROM.steps} />
      <Flow kind="to" label={TO.label} steps={TO.steps} />
      <p className="s21-quote">
        <b>
          <Words text={QUOTE.said} />
        </b>{' '}
        <Words text={QUOTE.rest} />
      </p>

      {/* 32%: the deck's tilted card with its strip of navy tape */}
      <div className="s21-card">
        <div className="s21-card-paper" style={{ transform: `rotate(${SKIPPED.tilt}deg)` }}>
          <span className="kn-clip-tape kn-clip-tape--navy" aria-hidden="true" />
          <b className="s21-num">
            <Count to={SKIPPED.to} suffix="%" />
          </b>
          <p className="s21-card-line">
            <Words text={SKIPPED.line} bold={SKIPPED.bold} />
          </p>
        </div>
      </div>

      <Clipping className="s21-clip" date={CLIP.date} tape={CLIP.tape} source={CLIP.source} tilt={CLIP.tilt} width={25.2}>
        {CLIP.text}
      </Clipping>

      <div className="s21-billing">
        <Kicker tone="flame" block className="s21-billing-k">
          {BILLING.label}
        </Kicker>
        <p className="s21-billing-line">
          <Words text={BILLING.text} bold={BILLING.bold} />
        </p>
      </div>

      <p className="s21-src">{SOURCES}</p>

      {/* ---- the example: one sentence, written ---- */}
      <div className="s21-ask">
        <Kicker tone="flame" block className="s21-ask-k">
          {TO.steps[1]}
        </Kicker>
        <div className="s21-ask-box">
          <span className="s21-ask-ring" aria-hidden="true" />
          <p className="s21-ask-text" aria-label={ASK}>
            {Array.from(ASK).map((c, i) => (
              <span key={i} className="s21-ask-c" aria-hidden="true">
                {c}
              </span>
            ))}
            <i className="s21-caret" aria-hidden="true" />
          </p>
          <span className="s21-send" aria-hidden="true">
            <svg viewBox="0 0 20 20">
              <path d="M10 15.5 V5 M5.4 9.4 L10 4.6 L14.6 9.4" />
            </svg>
          </span>
        </div>
      </div>
      {/* ---- … and the software it becomes ---- */}
      <BrowserFrame className="s21-win" ratio="510 / 296" width={51} address={UI.address}>
        <VendorScreen />
      </BrowserFrame>
      <p className="s21-cap">
        <Words text={CAPTION.text} flame={CAPTION.flame} bold={CAPTION.flame} />
      </p>
    </div>
  ),

  three(ctx) {
    const blocks = makeBlocks(ctx)
    ctx.bag.blocks = blocks
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      blocks.gl.dispose()
    }
  },

  build(ctx) {
    const { ease } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const b = ctx.bag.blocks as Blocks | undefined
    const calm = ctx.reduced

    // measured before anything is hidden or moved: where every letter of the sentence ends, and
    // where every piece of the example's screen sits (the tile that becomes it goes there)
    const askText = ctx.$('.s21-ask-text')
    const askAt = ctx.loc(askText)
    const letters = ctx.$$('.s21-ask-c')
    const letterEnd = letters.map((el) => {
      const l = ctx.loc(el)
      return l.x + l.w - askAt.x
    })
    const piece = new Map<number, Element>()
    ctx.$$('.s21-win [data-tile]').forEach((el) => {
      const i = Number(el.getAttribute('data-tile'))
      piece.set(i, el)
      if (b) {
        const l = ctx.loc(el)
        b.aim[i] = { u: l.cx / ctx.U, v: l.cy / ctx.U }
      }
    })

    /** One of the two flows draws: its label, then pill, arrow, pill … */
    const flow = (kind: 'from' | 'to', at: number, gap: number) => {
      const row = ctx.$(`.s21-flow--${kind}`)
      a.rise(row.querySelector('.s21-flow-k'), at, { y: 0, x: -1 })
      const steps = Array.from(row.querySelectorAll('.s21-step'))
      const arrows = Array.from(row.querySelectorAll('.s21-arrow'))
      steps.forEach((el, i) => {
        if (kind === 'to') {
          a.pop(el, at + 0.15 + i * gap, { from: 0.82 })
          const ghost = el.parentElement?.querySelector('.s21-ghost')
          if (ghost) tl.to(ghost, { autoAlpha: 0, duration: 0.3 }, at + 0.25 + i * gap)
        }
        else a.rise(el, at + 0.15 + i * gap, { y: 0, x: -1.2, duration: 0.6 })
        if (i) a.draw(Array.from(arrows[i - 1].querySelectorAll('path')), at + 0.05 + i * gap, { duration: 0.3, stagger: 0.12 })
      })
    }

    /* --------------------------------------------------------------- bought */
    a.words('.kn-h', 0.1)
    a.fade('.s21-floor', 0.4, { duration: 0.8 })
    if (b) {
      gsap.set(ctx.$('.s21-flat'), { autoAlpha: 0 })
      // the bought boxes come down and stack: the bottom row first
      b.box.forEach((s, i) => {
        s.t = calm ? 1 : 0
        if (!calm) tl.to(s, { t: 1, duration: 0.75, ease: ease.snap }, 0.45 + i * 0.1)
      })
      b.state.cube = calm ? 1 : 0
      b.state.lid = 0
      b.state.recede = 0
      b.state.stream = 0
      if (!calm) tl.to(b.state, { cube: 1, duration: 0.9, ease: ease.out }, 1.35)
      b.tile.forEach((s) => {
        s.p = 0
        s.q = 0
      })
      b.state.example = 0
      a.rise('.s21-panel', 1.5, { y: 1.6, duration: 0.8 })
      a.pop('.s21-panel i', 1.55, { stagger: 0.025, from: 0.7, duration: 0.4 })
    } else {
      gsap.set(ctx.$$('.s21-panel, .s21-spark'), { autoAlpha: 0 })
      a.wipe('.s21-flat', 0.5, { from: 'left', duration: 1.5 })
    }
    // 32% is pinned up, and counts
    pin(ctx, tl, ctx.$('.s21-card'), 1.5, 1)
    a.count('.s21-num .kn-count-n', 1.58)
    a.words('.s21-card-line', 2.1, { stagger: 0.025 })
    flow('from', 2.2, 0.22)
    // the row under it waits: four empty slots, a promise of the new way
    const ghosts = ctx.$$('.s21-ghost')
    gsap.set(ghosts, { autoAlpha: 0 })
    tl.to(ghosts, { autoAlpha: 1, duration: 0.5, stagger: 0.08 }, 2.75)
    a.fade('.s21-src', 2.6)
    tl.to(fx, { glow: 0.28, focusX: -0.6, focusY: 0.15, warm: -0.1, duration: 1.8 }, 0.5)
    tl.addLabel('bought', 3.7)

    /* ---------------------------------------------------------------- build */
    const B = 3.7
    let landed = B + 2.4
    if (b) {
      // the cube opens …
      tl.to(b.state, { lid: 1, duration: calm ? 0.01 : 0.7, ease: ease.snap }, B + 0.05)
      // … and tile after tile comes out, over the arc, into the grid
      b.tile.forEach((s, i) => {
        const at = B + 0.45 + i * 0.12
        if (calm) tl.to(s, { p: 1, duration: 0.01 }, B + 0.4 + i * 0.03)
        else tl.to(s, { p: 1, duration: 1.15, ease: 'sine.inOut' }, at)
        landed = Math.max(landed, at + 1.15)
      })
      tl.to(b.state, { recede: 1, duration: 1.8, ease: ease.inOut }, B + 0.6)
      tl.to(b.state, { stream: 1, duration: 1.2, ease: 'power1.inOut' }, landed - 0.9)
    }
    // the last tile lands: the sparkle
    const star = ctx.$('.s21-spark-star')
    const dot = ctx.$('.s21-spark-dot')
    if (b) {
      gsap.set(star, { autoAlpha: 0, scale: calm ? 1 : 0.2, rotation: calm ? 0 : -50, transformOrigin: '50% 50%' })
      gsap.set(dot, { autoAlpha: 0, scale: calm ? 1 : 0, transformOrigin: '50% 50%' })
      tl.to(star, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: ease.snap }, landed - 0.15)
      tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.45, ease: ease.snap }, landed + 0.15)
    }
    // the new way draws under the old, in flame, as the grid fills
    flow('to', B + 1.0, 0.42)
    a.words('.s21-quote', B + 2.7, { stagger: 0.035 })
    tl.to(fx, { focusX: 0.2, focusY: 0.1, glow: 0.34, warm: 0.35, duration: 2.2, ease: ease.inOut }, B + 0.3)
    tl.addLabel('build', Math.max(landed + 0.7, B + 3.9))

    /* ----------------------------------------------------------------- news */
    const N = Math.max(landed + 0.7, B + 3.9)
    pin(ctx, tl, ctx.$('.s21-clip'), N, -1)
    a.rise('.s21-billing-k', N + 0.7, { y: 1 })
    a.words('.s21-billing-line', N + 0.85, { stagger: 0.025 })
    tl.to(fx, { focusX: 0.62, focusY: 0.3, glow: 0.26, warm: 0.15, duration: 1.4, ease: ease.inOut }, N)
    tl.addLabel('news', N + 1.9)

    /* -------------------------------------------------------------- example */
    // the slide has made its point: its cards and its two flows step away, the blocks stay
    const E = N + 1.9
    a.leave(ctx.$$('.s21-card, .s21-clip, .s21-billing'), E, { y: 1.2, stagger: 0.06 })
    tl.to(ctx.$$('.s21-flow, .s21-quote, .s21-src'), { autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, E)

    // a prompt box where the flows were, and the sentence is typed into it
    a.rise('.s21-ask', E + 0.3, { y: 1.4, duration: 0.6 })
    const caret = ctx.$('.s21-caret')
    const ring = ctx.$('.s21-ask-ring')
    const send = ctx.$('.s21-send')
    gsap.set(ring, { autoAlpha: 0 })
    let typed = E + 0.85
    if (calm) {
      gsap.set(caret, { autoAlpha: 0 })
      a.fade(askText, typed, { duration: 0.6 })
      typed += 0.6
    } else {
      gsap.set(letters, { autoAlpha: 0 })
      letters.forEach((el, i) => {
        tl.set(el, { autoAlpha: 1 }, typed)
        tl.set(caret, { x: letterEnd[i] }, typed)
        // a hand, not a machine: a breath after each word, a little unevenness between letters
        typed += (el.textContent === ' ' ? 0.062 : 0.034) + 0.008 * Math.sin(i * 2.7)
      })
      tl.to(caret, { autoAlpha: 0, duration: 0.2 }, typed + 0.25)
    }
    // sent
    const S = typed + 0.15
    tl.to(send, { backgroundColor: '#f16443', color: '#ffffff', duration: 0.25 }, S)
    if (!calm) tl.to(send, { scale: 0.86, duration: 0.12, ease: 'power2.in' }, S).to(send, { scale: 1, duration: 0.4, ease: ease.snap }, S + 0.12)
    tl.to(ring, { autoAlpha: 1, duration: 0.4 }, S)

    // the window comes up where the grid stood; the grid's own panel goes, its tiles stay in the air
    const W = S + 0.2
    a.rise('.s21-win', W, { y: 2.2, duration: 0.8 })
    tl.to(ctx.$$('.s21-panel, .s21-spark-star, .s21-spark-dot'), { autoAlpha: 0, duration: 0.4 }, W + 0.1)
    if (!b) tl.to(ctx.$('.s21-flat'), { clipPath: 'inset(0% 45% 0% 0%)', duration: 0.6, ease: ease.inOut }, W - 0.1)
    a.wipe('.s21-ui-side', W + 0.3, { from: 'left', duration: 0.6 })
    a.rise('.s21-ui-card', W + 0.4, { y: 1.2, stagger: 0.1, duration: 0.6 })
    a.rise(ctx.$$('.s21-ui-nav').slice(1), W + 0.95, { y: 0, x: -0.8, stagger: 0.08, duration: 0.5 })

    // tile after tile crosses into the window and becomes a piece of the screen
    const land: number[] = []
    TILE_ORDER.forEach((i, k) => {
      const at = W + 0.55 + k * 0.07
      land[i] = at + (calm ? 0.1 : 0.7)
      if (b) tl.to(b.tile[i], { q: 1, duration: calm ? 0.01 : 0.95, ease: 'power2.inOut' }, at)
      const el = piece.get(i)
      if (el && !el.classList.contains('s21-ui-bar')) a.pop(el, land[i], { from: 0.5, duration: 0.5 })
    })
    if (b) tl.to(b.state, { example: 1, duration: 0.9, ease: ease.inOut }, W + 0.2)
    ctx.$$('.s21-ui-row').forEach((row, r) => {
      const t = land[UI.rows[r].tile]
      a.fade(row.querySelector('.s21-ui-name'), t + 0.08, { duration: 0.4 })
      if (UI.rows[r].chipTile < 0) a.pop(row.querySelector('.s21-ui-chip'), t + 0.22, { from: 0.6, duration: 0.45 })
      a.rule(row.querySelector('.s21-ui-track i'), t + 0.3, { from: 'left', duration: 0.6 })
    })
    a.rule('.s21-ui-bar', land[11] - 0.12, { from: 'bottom', stagger: 0.07, duration: 0.5 })
    a.rise('.s21-ui-key', land[12] + 0.05, { y: 0, x: -0.6, stagger: 0.08, duration: 0.45 })

    a.words('.s21-cap', land[12] + 0.15, { stagger: 0.04 })
    tl.to(fx, { focusX: 0.4, focusY: 0.05, glow: 0.32, warm: 0.3, duration: 1.6, ease: ease.inOut }, W)
    tl.addLabel('example', land[12] + 1.25)
    return tl
  },
}

/**
 * The family's last move (slides 16 to 25): a clipping is PINNED up. It comes down from a
 * little above, a touch large and askew, and settles with a small overshoot, as paper with
 * some weight does. The outer element moves; the clipping's own tilt is on its inner one.
 */
function pin(ctx: SceneCtx, tl: gsap.core.Timeline, el: Element, at: number, side: 1 | -1) {
  if (ctx.reduced) {
    gsap.set(el, { autoAlpha: 0 })
    tl.to(el, { autoAlpha: 1, duration: 0.5 }, at)
    return
  }
  gsap.set(el, { autoAlpha: 0, y: -ctx.U * 3.4, rotation: side * 3.2, scale: 1.07, transformOrigin: '50% 0%' })
  tl.to(el, { autoAlpha: 1, duration: 0.22, ease: 'power1.out' }, at)
  tl.to(el, { y: 0, scale: 1, duration: 0.5, ease: 'power3.in' }, at)
  tl.to(el, { rotation: side * -0.9, duration: 0.5, ease: 'power2.in' }, at)
  tl.to(el, { rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, at + 0.5)
}

export default scene
