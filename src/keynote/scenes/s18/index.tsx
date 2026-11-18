'use client'

/**
 * Slide 18 · "Composite AI: Predictive AI and GenAI were two separate worlds, and now they work as one."
 *
 * The deck's photograph shows two hands bringing an orange and a blue jigsaw piece together. The
 * photograph stays exactly as it is; under it the slide's own two columns ARE the two pieces:
 * Predictive AI (flame) and GenAI (blue) are two cards cut like the photograph's pieces, and the
 * slide's point is the moment they lock.
 *
 *   apart   the headline; the photograph opens from its middle, in the middle of the stage; the
 *           two pieces come in from either side and wait at the two ends of the stage, each a
 *           little askew, with its three verbs: two separate worlds
 *   one     they cross the stage, level, stop with the knob at the mouth of the socket, and
 *           close: a ring leaves the joint, the two bands become one, a light crosses the
 *           photograph, and the banner slides out from under the composite and seals it:
 *           "Different strengths. Better outcomes together."
 *   news    the block makes room and the two clippings are pinned, one after the other
 *
 * No canvas: the pieces are SVG, moved by transforms. (The family's three.js moment is slide 17.)
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Clipping, Headline, Pic, pic, Pill, Words, type SceneModule } from '../../kit'
import { pinDrop } from '../_shared/world-of-ai/pin'
import { BANNER, CLIP_A, CLIP_B, COLUMNS, FLAME, PHOTO, SOURCE } from './data'
import './scene.css'

/*
 * The two pieces, in --u. Locked, they are exactly as wide as the photograph over them (44). The
 * seam stands a little right of the middle, so that the knob (which reaches 3.1u into the flame
 * piece) clears that piece's longest line.
 */
const WP = 23.4
const WG = 20.6
const H = 12.6
/** The knob: its middle from the piece's top, its radius, half the width of its neck, how far the neck runs. */
const CY = 5.0
const KR = 1.4
const NK = 0.7
const NL = 0.5
/** The knob's middle, left of the seam. */
const KX = NL + Math.sqrt(KR * KR - NK * NK)
const R = 1

/**
 * A piece's outline. The blue piece carries the knob on its left edge and the flame piece the
 * socket on its right, as in the photograph; the two edges are the same curve, so they close
 * without a gap, and the corners at the seam are square: locked, the two are ONE rounded card.
 */
function outline(kind: 'socket' | 'knob'): string {
  if (kind === 'socket') {
    const W = WP
    return (
      `M ${R} 0 L ${W} 0 L ${W} ${CY - NK - 0.2} Q ${W} ${CY - NK} ${W - 0.2} ${CY - NK} L ${W - NL} ${CY - NK} ` +
      `A ${KR} ${KR} 0 1 0 ${W - NL} ${CY + NK} L ${W - 0.2} ${CY + NK} Q ${W} ${CY + NK} ${W} ${CY + NK + 0.2} ` +
      `L ${W} ${H} L ${R} ${H} Q 0 ${H} 0 ${H - R} L 0 ${R} Q 0 0 ${R} 0 Z`
    )
  }
  const W = WG
  return (
    `M 0 0 L ${W - R} 0 Q ${W} 0 ${W} ${R} L ${W} ${H - R} Q ${W} ${H} ${W - R} ${H} L 0 ${H} ` +
    `L 0 ${CY + NK + 0.2} Q 0 ${CY + NK} -0.2 ${CY + NK} L ${-NL} ${CY + NK} A ${KR} ${KR} 0 1 1 ${-NL} ${CY - NK} ` +
    `L -0.2 ${CY - NK} Q 0 ${CY - NK} 0 ${CY - NK - 0.2} Z`
  )
}

const scene: SceneModule = {
  beats: ['apart', 'one', 'news'],
  preload: [pic(18, PHOTO.name)],

  Scene: ({ slide }) => (
    <div
      className="s18"
      style={
        {
          '--s18-wp': `calc(var(--u) * ${WP})`,
          '--s18-wg': `calc(var(--u) * ${WG})`,
          '--s18-h': `calc(var(--u) * ${H})`,
          '--s18-kx': `calc(var(--u) * ${(WP - KX).toFixed(3)})`,
          '--s18-ky': `calc(var(--u) * ${CY})`,
        } as CSSProperties
      }
    >
      <Headline text={slide.title} flame={FLAME} />

      {/* the picture and the two pieces: one block, in the middle of the stage until the clippings need the room */}
      <div className="s18-block">
        {/* the deck's photograph, whole and as it is, in its white frame */}
        <figure className="s18-photo">
          <Pic n={18} name={PHOTO.name} fit="contain" ratio={`${PHOTO.px[0]} / ${PHOTO.px[1]}`} />
          <span className="s18-glass" aria-hidden="true">
            <i className="s18-light" />
          </span>
        </figure>

        {/* the banner waits under the pieces and slides out from under them once they are one */}
        <div className="s18-banner">
          <p>
            <Words text={BANNER.text} flame={BANNER.flame} />
          </p>
        </div>

        <div className="s18-pair">
          {COLUMNS.map((c, i) => {
            const w = i === 0 ? WP : WG
            const d = outline(i === 0 ? 'socket' : 'knob')
            return (
              <div className={`s18-piece s18-piece--${c.key}`} key={c.key}>
                <div className="s18-float">
                  <svg className="s18-shape" viewBox={`0 0 ${w} ${H}`} aria-hidden="true">
                    <defs>
                      <clipPath id={`s18-cut-${c.key}`}>
                        <path d={d} />
                      </clipPath>
                      {/* each piece is deepest in its own colour at the joint: the knob is clearly blue, the socket's rim clearly flame */}
                      {i === 0 ? (
                        <linearGradient id="s18-tint-pred" gradientUnits="userSpaceOnUse" x1={WP} y1={0} x2={WP - 7} y2={0}>
                          <stop offset="0" stopColor="#f16443" stopOpacity="0.24" />
                          <stop offset="1" stopColor="#f16443" stopOpacity="0" />
                        </linearGradient>
                      ) : (
                        <linearGradient id="s18-tint-gen" gradientUnits="userSpaceOnUse" x1={-KX - KR} y1={0} x2={3.2} y2={0}>
                          <stop offset="0" stopColor="#4384d4" stopOpacity="0.62" />
                          <stop offset="0.55" stopColor="#4384d4" stopOpacity="0.34" />
                          <stop offset="1" stopColor="#4384d4" stopOpacity="0" />
                        </linearGradient>
                      )}
                    </defs>
                    <path className="s18-body" d={d} />
                    <path className="s18-tint" d={d} fill={`url(#s18-tint-${c.key})`} />
                    <rect className="s18-band" x={-4} y={0} width={w + 4} height={0.42} clipPath={`url(#s18-cut-${c.key})`} />
                    <path className="s18-edge" d={d} />
                  </svg>
                  <div className="s18-words">
                    <h2 className="s18-title">
                      <Words text={c.title} />
                    </h2>
                    <p className="s18-line">
                      <Words text={c.line} />
                    </p>
                    <div className="s18-chips">
                      {c.chips.map((chip) => (
                        <Pill key={chip} tone={c.tone} className="s18-chip">
                          {chip}
                        </Pill>
                      ))}
                    </div>
                    <p className="s18-tools">
                      <b>{c.toolsLabel}</b> {c.tools}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          {/* the click: a glint down the seam, a ring out of the joint (flame to its side, blue to the other), a light along the one band */}
          <span className="s18-click" aria-hidden="true" />
          <svg className="s18-ring" viewBox="-2 -2 4 4" aria-hidden="true">
            <path className="s18-ring-pred" d="M 0 -1.6 A 1.6 1.6 0 0 0 0 1.6" />
            <path className="s18-ring-gen" d="M 0 -1.6 A 1.6 1.6 0 0 1 0 1.6" />
          </svg>
          <span className="s18-seal s18-seal--pred" aria-hidden="true" />
          <span className="s18-seal s18-seal--gen" aria-hidden="true" />
        </div>
      </div>

      <Clipping className="s18-clip s18-clip--a" date={CLIP_A.date} tape="flame" source={CLIP_A.source} tilt={1} width={36.3}>
        {CLIP_A.headline}
      </Clipping>
      <Clipping className="s18-clip s18-clip--b" date={CLIP_B.date} tape="navy" source={CLIP_B.source} tilt={-0.9} width={36.3}>
        <span className="s18-two">
          {CLIP_B.columns.map((col) => (
            <span className="s18-sub" key={col.title}>
              <span className="s18-sub-title">{col.title}</span>
              <span className="s18-sub-text">
                {col.before}
                <b>{col.bold}</b>
                {col.after}
              </span>
            </span>
          ))}
        </span>
      </Clipping>

      <p className="s18-src">{SOURCE}</p>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const pred = ctx.$('.s18-piece--pred')
    const gen = ctx.$('.s18-piece--gen')
    const pair = ctx.$('.s18-pair')
    const click = ctx.$('.s18-click')
    const light = ctx.$('.s18-light')
    const photo = ctx.$('.s18-photo')
    const block = ctx.$('.s18-block')
    /** The block stands in the middle of the stage for the first two beats; this is how far that is from its place beside the clippings. */
    const MIDDLE = reduced ? 0 : 23.8 * U

    /** Two separate worlds: each piece stands off to its own side, a little askew. */
    const APART = reduced
      ? { pred: { x: 0, y: 0, rotation: 0 }, gen: { x: 0, y: 0, rotation: 0 } }
      : {
          pred: { x: -23.6 * U, y: 1.7 * U, rotation: -3 },
          gen: { x: 23.6 * U, y: 0.5 * U, rotation: 3.4 },
        }

    /* --------------------------------------------------------------- apart */
    gsap.set(block, { x: MIDDLE })
    a.words('.kn-h', 0.1)
    // the photograph opens from its middle, where the two pieces are about to meet
    if (reduced) a.fade(photo, 0.5)
    else {
      gsap.set(photo, {
        autoAlpha: 0,
        clipPath: 'inset(0% 46% 0% 46% round 1.2%)',
      })
      tl.to(photo, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, 0.5)
      tl.to(
        photo,
        {
          clipPath: 'inset(0% 0% 0% 0% round 1.2%)',
          duration: 1.25,
          ease: ease.inOut,
        },
        0.5,
      )
    }
    // the pieces come in from either side and stop short of each other
    gsap.set(pred, {
      autoAlpha: 0,
      x: APART.pred.x - (reduced ? 0 : 9 * U),
      y: APART.pred.y,
      rotation: APART.pred.rotation - (reduced ? 0 : 5),
      transformOrigin: '50% 50%',
    })
    gsap.set(gen, {
      autoAlpha: 0,
      x: APART.gen.x + (reduced ? 0 : 9 * U),
      y: APART.gen.y,
      rotation: APART.gen.rotation + (reduced ? 0 : 5),
      transformOrigin: '50% 50%',
    })
    tl.to(pred, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 1.0)
    tl.to(pred, { ...APART.pred, duration: 1.15, ease: ease.out }, 1.0)
    tl.to(gen, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, 1.2)
    tl.to(gen, { ...APART.gen, duration: 1.15, ease: ease.out }, 1.2)
    for (const [piece, at] of [
      [pred, 1.35],
      [gen, 1.55],
    ] as const) {
      a.words(piece.querySelector('.s18-title'), at)
      a.words(piece.querySelector('.s18-line'), at + 0.15, { stagger: 0.03 })
      a.pop(Array.from(piece.querySelectorAll('.s18-chip')), at + 0.45, {
        stagger: 0.09,
      })
      a.fade(piece.querySelector('.s18-tools'), at + 0.75)
    }
    a.fade('.s18-src', 2.3)
    tl.to(fx, { glow: 0.2, focusX: 0, focusY: 0.15, duration: 2 }, 0.6)
    tl.addLabel('apart', 3.0)

    /* ----------------------------------------------------------------- one */
    const A = 3.0
    // the two cross the stage toward each other, levelling as they come, and stop a breath apart, the knob at the mouth of the socket …
    const GAP = 0.75 * U
    tl.to(pred, { x: -GAP, duration: 1.25, ease: ease.inOut }, A)
    tl.to(gen, { x: GAP, duration: 1.25, ease: ease.inOut }, A)
    tl.to([pred, gen], { y: 0, rotation: 0, duration: 1.1, ease: 'power2.inOut' }, A + 0.1)
    // … and close, fast
    tl.to([pred, gen], { x: 0, duration: 0.15, ease: 'power3.in' }, A + 1.42)
    tl.to(ctx.$$('.s18-float'), { '--s18-drift': 0, duration: 0.9, ease: 'power1.inOut' }, A)
    const HIT = A + 1.57
    const banner = ctx.$('.s18-banner')
    if (!reduced) {
      // the click: the pair takes the knock as one piece …
      tl.to(pair, { scale: 1.03, duration: 0.08, ease: 'power2.out', transformOrigin: `${(WP / (WP + WG)) * 100}% 50%` }, HIT)
      tl.to(pair, { scale: 1, duration: 0.7, ease: ease.snap }, HIT + 0.08)
      // … a glint runs down the seam …
      gsap.set(click, { autoAlpha: 0, scaleY: 0.2, scaleX: 1 })
      tl.to(click, { autoAlpha: 1, scaleY: 1, duration: 0.12, ease: 'power2.out' }, HIT)
      tl.to(click, { autoAlpha: 0, scaleX: 6, duration: 0.7, ease: 'power2.out' }, HIT + 0.12)
      // … a ring leaves the joint, flame into the flame piece and blue into the blue …
      const ring = ctx.$('.s18-ring')
      gsap.set(ring, { autoAlpha: 0, scale: 0.55, transformOrigin: '50% 50%' })
      tl.to(ring, { autoAlpha: 1, duration: 0.08, ease: 'none' }, HIT)
      tl.to(ring, { scale: 4.4, duration: 0.95, ease: 'power3.out' }, HIT)
      tl.to(ring, { autoAlpha: 0, duration: 0.6, ease: 'power1.in' }, HIT + 0.3)
      // … and a light runs out along the two bands, now one
      for (const [sel, origin] of [
        ['.s18-seal--pred', '100% 50%'],
        ['.s18-seal--gen', '0% 50%'],
      ] as const) {
        const seal = ctx.$(sel)
        gsap.set(seal, { autoAlpha: 0, scaleX: 0, transformOrigin: origin })
        tl.to(seal, { autoAlpha: 1, duration: 0.06, ease: 'none' }, HIT)
        tl.to(seal, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, HIT)
        tl.to(seal, { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, HIT + 0.4)
      }
      // each outline lights up in its own colour as they meet, and cools to a hairline that stays: the cut is still seen
      for (const [piece, hot, cool] of [
        [pred, '#f16443', '#ee9c84'],
        [gen, '#4384d4', '#8bb6ea'],
      ] as const) {
        const edge = piece.querySelector('.s18-edge')
        tl.to(edge, { stroke: hot, strokeWidth: 0.3, duration: 0.12, ease: 'power2.out' }, HIT)
        tl.to(edge, { stroke: cool, strokeWidth: 0.14, duration: 1.1, ease: 'power1.inOut' }, HIT + 0.35)
      }
      // the same light crosses the photograph above
      gsap.set(light, { xPercent: -160, autoAlpha: 0 })
      tl.to(light, { autoAlpha: 1, duration: 0.2 }, HIT)
      tl.to(light, { xPercent: 340, duration: 1.25, ease: 'power1.inOut' }, HIT)
      tl.to(light, { autoAlpha: 0, duration: 0.3 }, HIT + 1.0)
    }
    // the room's light answers: one warm pulse under the joint
    tl.to(fx, { glow: 0.62, warm: 0.25, focusX: 0, focusY: 0.38, duration: 0.2, ease: 'power2.out' }, HIT)
    tl.to(fx, { glow: 0.24, duration: 1.2, ease: 'power1.inOut' }, HIT + 0.2)
    // the banner slides out from under the composite and seals it
    if (reduced) a.fade(banner, HIT + 0.2)
    else {
      gsap.set(banner, { autoAlpha: 0, y: -4.3 * U })
      tl.set(banner, { autoAlpha: 1 }, HIT + 0.1)
      tl.to(banner, { y: 0, duration: 0.75, ease: 'back.out(1.25)' }, HIT + 0.12)
    }
    a.words('.s18-banner', HIT + 0.5, { stagger: 0.05 })
    const B = HIT + 1.6
    tl.addLabel('one', B)

    /* ---------------------------------------------------------------- news */
    // the block makes room, and the two clippings are pinned beside it
    tl.to(block, { x: 0, duration: 0.95, ease: ease.inOut }, B)
    pinDrop(ctx, tl, '.s18-clip--a', B + (reduced ? 0 : 0.85), { drop: 1.9 })
    pinDrop(ctx, tl, '.s18-clip--b', B + (reduced ? 0.3 : 1.3), { swing: -3 })
    tl.to(fx, { focusX: 0.5, focusY: 0.1, glow: 0.2, duration: 1.6, ease: ease.inOut }, B)
    tl.addLabel('news', tl.duration())
    return tl
  },
}

export default scene
