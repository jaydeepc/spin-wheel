'use client'

/**
 * Slide 25 · "At Piramal, these shifts are already showing up in the numbers"
 *
 * THE IDEA: the world's board comes home. The slide opens on slide 16's own board: the eight
 * themes of the world where they hung there, each with its round picture. Then the world's
 * cards let go. The two themes the company has no number for (the power wall, the security
 * race) step back and leave; the other six pictures stay on stage and travel the short way to
 * a card of the company's own, which rises under each. On every card the company's number
 * lands, and as it lands the card is taped down, like the news of the slides before.
 *
 *   first    the headline; slide 16's board; six pictures travel to their cards; the top row
 *            lands, card by card: Enough of Pilots, Composite AI, Open Weight Models. The
 *            bottom row waits, pale and not yet taped.
 *   second   the bottom row comes forward, lands and is taped: Agentic Workflows, AI Reshapes
 *            SaaS, Sovereign and Indic AI.
 *
 * NO FALSE FIGURE IS EVER ON SCREEN. A rate, a price or a ratio ("2.3% → 0.57%", "$1.48 →
 * $0.64", "3x") never counts through values in between: the first value stands, the arrow
 * draws, the second rises whole through a mask. Only tallies (9,000+, 623, 277, 3.62 lakh)
 * count up, as a tally does.
 *
 * Every figure is the pack's string (data.ts). The pictures are the 202 px thumbnails of
 * src/16, never shown larger than their pixels; the grandmother is a photograph and is
 * untouched. The authors' yellow note on this slide is not shown.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Count, Headline, Pic, pic, Words, type SceneModule } from '../../kit'
import { CARDS, FOOTNOTE, THUMB_PX, WORLD, WORLD_THUMB_U, type LinkCard, type Stat } from './data'
import './scene.css'

/** A printed figure, taken apart: "$0.64" is prefix "$", 0.64 with two decimals; "9,000+" is 9000 and "+". */
function parse(text: string) {
  const m = /^([^\d]*)(\d[\d,]*(?:\.(\d+))?)(.*)$/.exec(text)
  if (!m) return null
  return { prefix: m[1], to: Number(m[2].replace(/,/g, '')), decimals: m[3]?.length ?? 0, suffix: m[4] }
}

const Arrow = () => (
  <svg className="s25-arrow" viewBox="0 0 20 12" aria-hidden="true">
    <path className="s25-arrow-line" d="M2 6H15.5" />
    <path className="s25-arrow-head" d="M11.4 1.9 16.4 6l-5 4.1" />
  </svg>
)

/** A value that arrives whole, rising through a mask: never a number in between. */
const Whole = ({ text, word }: { text: string; word?: boolean }) => (
  <span className="s25-mask">
    <span className={`s25-to s25-whole${word ? ' s25-word' : ''}`}>{text}</span>
  </span>
)

/** One figure: a pair (a stands, b arrives whole), a tally that counts up, or a ratio or word that arrives whole. */
function Figure({ stat }: { stat: Stat }) {
  const [a, b] = stat.value.split(' → ')
  if (b) {
    return (
      <b className={`s25-fig s25-fig--${stat.tone} s25-fig--pair`}>
        <span className="s25-from">{a}</span>
        <Arrow />
        <Whole text={b} />
      </b>
    )
  }
  const n = parse(a)
  const tally = n && n.suffix !== 'x'
  return (
    <b className={`s25-fig s25-fig--${stat.tone}`}>
      {tally ? <Count className="s25-to" to={n.to} decimals={n.decimals} prefix={n.prefix} suffix={n.suffix} /> : <Whole text={a} word={!n} />}
    </b>
  )
}

function LinkCardView({ card, i }: { card: LinkCard; i: number }) {
  const many = card.stats.length > 1
  return (
    <div className={`s25-cell s25-cell--${card.key}`} data-row={i < 3 ? 0 : 1} style={{ '--s25-col': i % 3, '--s25-row': Math.floor(i / 3) } as CSSProperties}>
      <div className="s25-tilt" style={{ transform: `rotate(${card.tilt}deg)` }}>
        <span className="s25-paper" aria-hidden="true">
          <span className={`kn-clip-tape kn-clip-tape--${card.tape}`} />
        </span>
        <span className="s25-thumb">
          <Pic n={16} name={card.thumb} ratio="1 / 1" />
        </span>
        <div className="s25-top">
          <span className="s25-label">{card.label}</span>
          {card.sub ? <span className="s25-sub">{card.sub}</span> : null}
        </div>
        <div className={`s25-stats s25-stats--${card.stats.length}`}>
          {card.stats.map((s, k) => (
            <div className="s25-stat" key={k}>
              {many && card.stats.length === 3 && k > 0 ? <Arrow /> : null}
              <Figure stat={s} />
              {s.line ? (
                <p className="s25-line">
                  <Words text={s.line} bold={s.bold ? [s.bold] : []} />
                </p>
              ) : null}
            </div>
          ))}
          {card.line ? (
            <p className="s25-line s25-line--wide">
              <Words text={card.line} bold={card.bold ? [card.bold] : []} />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const scene: SceneModule = {
  beats: ['first', 'second'],
  preload: WORLD.map((w) => pic(16, w.thumb)),

  Scene: ({ slide }) => (
    <div className="s25">
      <span className="s25-panel" aria-hidden="true" />
      <Headline text={slide.title} flame={['in the numbers']} />
      {/* slide 16's board: the world's eight cards where they hung (their pictures are the cards' own, below) */}
      {WORLD.map((w, i) => (
        <div
          className="s25-old"
          key={w.thumb}
          style={{
            left: `calc(var(--u) * ${(w.rect[0] * 100).toFixed(2)})`,
            top: `calc(var(--u) * ${(w.rect[1] * 56.25).toFixed(2)})`,
            width: `calc(var(--u) * ${(w.rect[2] * 100).toFixed(2)})`,
            height: `calc(var(--u) * ${(w.rect[3] * 56.25).toFixed(2)})`,
          }}
        >
          <span className="s25-old-paper" style={{ transform: `rotate(${w.tilt}deg)` }}>
            <span className="s25-old-name">{w.name}</span>
          </span>
          {w.card ? null : (
            <span
              className="s25-gone"
              data-i={i}
              style={{
                left: `calc(var(--u) * ${((w.centre[0] - w.rect[0]) * 100).toFixed(2)})`,
                top: `calc(var(--u) * ${((w.centre[1] - w.rect[1]) * 56.25).toFixed(2)})`,
              }}
            >
              <Pic n={16} name={w.thumb} ratio="1 / 1" />
            </span>
          )}
        </div>
      ))}
      {CARDS.map((card, i) => (
        <LinkCardView card={card} i={i} key={card.key} />
      ))}
      <p className="s25-src">{FOOTNOTE}</p>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const cells = ctx.$$('.s25-cell')
    const q = (cell: Element, sel: string) => Array.from(cell.querySelectorAll<HTMLElement>(sel))
    // a card may lack a part (no line, no arrow): say nothing when there is nothing to move
    const move = (targets: Element[], vars: gsap.TweenVars, at: gsap.Position) => {
      if (targets.length) tl.to(targets, vars, at)
    }
    const start = (targets: Element[], vars: gsap.TweenVars) => {
      if (targets.length) gsap.set(targets, vars)
    }

    /* ---- measure first: where each picture will sit on its card ---- */
    const thumbs = cells.map((c) => q(c, '.s25-thumb')[0])
    const home = thumbs.map((t) => ctx.loc(t))
    const olds = ctx.$$('.s25-old')

    /* ---- the starting states of everything a card holds ---- */
    cells.forEach((cell) => {
      start(q(cell, '.s25-paper'), { autoAlpha: 0, y: reduced ? 0 : 2.2 * U })
      start(q(cell, '.kn-clip-tape'), reduced ? { autoAlpha: 0 } : { autoAlpha: 0, y: -0.9 * U, scale: 1.3 })
      start(q(cell, '.s25-top'), { autoAlpha: 0 })
      start(q(cell, '.s25-fig, .s25-stat > .s25-arrow'), { autoAlpha: 0 })
      start(q(cell, '.s25-whole'), reduced ? { autoAlpha: 0 } : { yPercent: 112 })
      start(q(cell, '.s25-arrow-line'), { drawSVG: '0%', autoAlpha: 0 })
      start(q(cell, '.s25-arrow-head'), { autoAlpha: 0 })
      start(q(cell, '.s25-line .kn-wi'), reduced ? { autoAlpha: 0 } : { yPercent: 118 })
    })

    /* ================================================================ first */
    a.words('.kn-h', 0.1)
    a.fade('.s25-panel', 0.25, { duration: 0.9 })

    // SLIDE 16'S BOARD: the eight cards of the world, where they hung …
    const BOARD = 0.3 // the first card of the world
    const LETGO = 1.3 // the world's cards let go
    const big = Math.min(WORLD_THUMB_U * U, THUMB_PX)
    WORLD.forEach((w, k) => {
      const old = olds[k]
      const at = BOARD + k * 0.05
      gsap.set(old, { autoAlpha: 0, y: reduced ? 0 : 1.3 * U })
      tl.to(old, { autoAlpha: 1, y: 0, duration: 0.5, ease: ease.out }, at)
      const i = CARDS.findIndex((c) => c.key === w.card)
      if (i < 0) {
        // no card here for this theme: it steps back and leaves with its card
        tl.to(old, { autoAlpha: 0, scale: reduced ? 1 : 0.94, duration: 0.5, ease: 'power2.in' }, LETGO - 0.1)
        return
      }
      // the paper and its name go; the picture stays, and travels to the company's card
      tl.to(q(old, '.s25-old-paper'), { autoAlpha: 0, duration: 0.45, ease: 'power1.inOut' }, LETGO)
      const t = thumbs[i]
      const cell = cells[i]
      const tilt = (-CARDS[i].tilt * Math.PI) / 180 // the picture's own frame is turned by its card's tilt
      const dx = w.centre[0] * ctx.W - home[i].cx
      const dy = w.centre[1] * ctx.H - home[i].cy
      const x = dx * Math.cos(tilt) - dy * Math.sin(tilt)
      const y = dx * Math.sin(tilt) + dy * Math.cos(tilt)
      const scale = big / home[i].w
      if (reduced) {
        gsap.set(t, { autoAlpha: 0 })
        tl.to(t, { autoAlpha: 1, duration: 0.4 }, LETGO)
      } else {
        gsap.set(t, { autoAlpha: 0, x, y: y + 1.3 * U, scale })
        tl.to(t, { autoAlpha: 1, y, duration: 0.5, ease: ease.out }, at)
      }
      const deal = LETGO + 0.05 + i * 0.05
      if (!reduced) tl.fromTo(t, { x, y, scale }, { x: 0, y: 0, scale: 1, duration: 0.9, ease: ease.inOut, immediateRender: false }, deal)
      const waits = cell.dataset.row === '1'
      move(q(cell, '.s25-paper'), { autoAlpha: waits ? 0.46 : 1, y: 0, duration: 0.75, ease: ease.out }, deal + 0.25)
      move(q(cell, '.s25-top'), { autoAlpha: waits ? 0.6 : 1, duration: 0.45, ease: 'power1.out' }, deal + 0.7)
    })
    tl.to(fx, { glow: 0.3, focusX: 0, focusY: 0, warm: 0.2, duration: 1.6 }, 0.4)

    /** One card's figures land, starting at time t. Returns the time at which the last of them has landed. */
    const count = (cell: HTMLElement, t: number): number => {
      let at = t
      let end = t + 1
      const rise = (els: Element[], when: number) =>
        move(els, reduced ? { autoAlpha: 1, duration: 0.4 } : { yPercent: 0, duration: 0.6, ease: ease.out }, when)
      q(cell, '.s25-stat').forEach((stat) => {
        const fig = q(stat, '.s25-fig')[0]
        const lead = q(stat, ':scope > .s25-arrow')
        // the arrow that leads from the figure before (9,000+ → 3x → Agent)
        if (lead.length) {
          tl.to(lead, { autoAlpha: 1, duration: 0.01, ease: 'none' }, at - 0.15)
          move(q(lead[0], '.s25-arrow-line'), { autoAlpha: 1, duration: 0.01, ease: 'none' }, at - 0.15)
          move(q(lead[0], '.s25-arrow-line'), { drawSVG: '100%', duration: 0.3, ease: ease.glide }, at - 0.15)
          move(q(lead[0], '.s25-arrow-head'), { autoAlpha: 1, duration: 0.15 }, at + 0.05)
        }
        const whole = q(fig, '.s25-whole')
        if (fig.classList.contains('s25-fig--pair')) {
          // a → b: a stands, the arrow draws, b arrives whole
          gsap.set(fig, { y: reduced ? 0 : 1.1 * U })
          tl.to(fig, { autoAlpha: 1, y: 0, duration: 0.55, ease: ease.out }, at)
          move(q(fig, '.s25-arrow-line'), { autoAlpha: 1, duration: 0.01, ease: 'none' }, at + 0.3)
          move(q(fig, '.s25-arrow-line'), { drawSVG: '100%', duration: 0.3, ease: ease.glide }, at + 0.3)
          move(q(fig, '.s25-arrow-head'), { autoAlpha: 1, duration: 0.15 }, at + 0.48)
          rise(whole, at + 0.5)
          end = Math.max(end, at + 1.1)
        } else if (whole.length) {
          // a ratio or a word: whole
          tl.to(fig, { autoAlpha: 1, duration: 0.01, ease: 'none' }, at)
          rise(whole, at)
          end = Math.max(end, at + 0.6)
        } else {
          // a tally counts up
          gsap.set(fig, { y: reduced ? 0 : 1.1 * U })
          tl.to(fig, { autoAlpha: 1, y: 0, duration: 0.55, ease: ease.out }, at)
          a.count(q(fig, '.kn-count-n'), at + 0.05, { duration: 1 })
          end = Math.max(end, at + 1.05)
        }
        move(q(stat, '.s25-line .kn-wi'), reduced ? { autoAlpha: 1, duration: 0.4 } : { yPercent: 0, duration: ctx.T.word, stagger: 0.03, ease: ease.out }, at + 0.25)
        at += 0.3
      })
      // the card's own line, where it has one figure
      move(q(cell, '.s25-line--wide .kn-wi'), reduced ? { autoAlpha: 1, duration: 0.4 } : { yPercent: 0, duration: ctx.T.word, stagger: 0.025, ease: ease.out }, t + 0.3)
      // the number has landed: the card is taped down, and its picture answers
      move(q(cell, '.kn-clip-tape'), reduced ? { autoAlpha: 0.82, duration: 0.3 } : { autoAlpha: 0.82, y: 0, scale: 1, duration: 0.28, ease: ease.slam }, end - 0.3)
      if (!reduced) {
        const thumb = q(cell, '.s25-thumb')
        tl.to(thumb, { scale: 1.06, duration: 0.2, ease: 'power2.out' }, end - 0.3)
        tl.to(thumb, { scale: 1, duration: 0.4, ease: ease.snap }, end - 0.1)
        end += 0.3
      }
      return end
    }

    const t = LETGO + 0.8
    const FIRST = Math.max(...cells.slice(0, 3).map((cell, i) => count(cell, t + i * 0.3))) + 0.1
    a.fade('.s25-src', 2.9)
    tl.to(fx, { focusY: -0.15, glow: 0.36, duration: 1.4, ease: ease.inOut }, 2.3)
    tl.addLabel('first', FIRST)

    /* =============================================================== second */
    const SECOND =
      Math.max(
        ...cells.slice(3).map((cell, i) => {
          const at = FIRST + i * 0.4
          move(q(cell, '.s25-paper, .s25-top'), { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, at)
          return count(cell, at + 0.1)
        }),
      ) + 0.15
    tl.to(fx, { focusY: 0.5, warm: -0.1, duration: 1.4, ease: ease.inOut }, FIRST)
    tl.addLabel('second', SECOND)
    return tl
  },
}

export default scene
