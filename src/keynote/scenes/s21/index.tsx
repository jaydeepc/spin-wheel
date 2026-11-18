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
 *
 * Without WebGL the deck's own flat picture stands in, from the first rest on.
 */

import gsap from 'gsap'
import { Fragment } from 'react'
import { anim, Clipping, Count, Headline, Kicker, Pic, pic, place, Words, type SceneCtx, type SceneModule } from '../../kit'
import { makeBlocks, type Blocks } from './blocks'
import { BILLING, BLOCKS_PIC, BLOCKS_RECT, CLIP, FLAME, FROM, GRID, PANEL, QUOTE, SKIPPED, SOURCES, TO, cell, TILE } from './data'
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

const scene: SceneModule = {
  beats: ['bought', 'build', 'news'],
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
      b.tile.forEach((s) => (s.p = 0))
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
