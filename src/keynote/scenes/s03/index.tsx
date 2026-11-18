'use client'

/**
 * Slide 03 · "The Year That Moved Us Forward" · section A opens. Dark navy.
 *
 * THE IDEA: the slide says "forward", so the room moves forward. The camera flies through a
 * tunnel of light toward the vanishing point while the headline comes up; the light slows from
 * streaks to drifting motes as the words settle. Then the three photographs of the year come
 * out of that same vanishing point, from far down the room, and land in a row with weight, in
 * front of a wall that is only light (a fine line of light above the row, its wash, faint joints). After that the room only breathes:
 * the motes keep coming, and the camera trucks a hand's width from side to side, so the prints
 * slide a little against the wall and the wall against the room (depth you can see).
 *
 *   year      the rush forward; the headline word by word, the deck's line under it
 *   moments   the title lifts to the deck's place; the three photographs arrive from the depth
 *
 * THE PHOTOGRAPHS ARE REAL and are shown as they are: the files of public/keynote/src/03, whole
 * (the box has each picture's own 3:2), never wider than their own pixels (data.ts → px), and
 * only ever MOVED: toward the room along the camera's line of sight (a uniform change of size,
 * always at or under the resting size), and sideways with the camera. No turn, no tilt, no
 * filter. The light that crosses a print as it lands is a narrow, faint band of white.
 *
 * The streaks are a scene-owned canvas (streaks.ts, one draw call). Without WebGL the same
 * story is told by the DOM alone: the photographs still come out of the depth (CSS perspective).
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Headline, Pic, pic, Words, type SceneModule } from '../../kit'
import { PHOTOS, SUB } from './data'
import { makeStreaks, type Streaks } from './streaks'
import './scene.css'

/** The photographs' row, in --u: each print's width, the gap between two, the row's centre line from the top. */
const WIDE = 27.6
const GAP = 2.6
const ROW = 40.5
/** No print is drawn wider than the narrowest photograph's own pixels: the three stay one size, none enlarged. */
const CAP = Math.min(...PHOTOS.map((p) => p.px[0]))
/** How far down the room a photograph starts, in --u (the camera stands 105u from the stage). */
const DEEP = 640
/** Where the title waits on the first beat: this much lower than the deck's place, in --u. */
const LOW = 8.2
/** How far behind the prints the glass wall stands, in --u (scene.css sizes it for this depth). */
const WALL = -30

const scene: SceneModule = {
  beats: ['year', 'moments'],
  preload: PHOTOS.map((p) => pic(3, p.name)),

  Scene: ({ slide }) => (
    <div className="s03" style={{ '--s03-wide': WIDE, '--s03-gap': GAP, '--s03-row': ROW, '--s03-cap': `${CAP}px` } as CSSProperties}>
      <div className="s03-title">
        <Headline className="s03-h" size="xl" text={slide.title} flame={[slide.title]} />
        <p className="s03-sub">
          <Words text={SUB} />
        </p>
      </div>

      <div className="s03-space">
        <div className="s03-world">
          <span className="s03-wall" aria-hidden="true" />
          {PHOTOS.map((p, i) => (
            <figure
              className="s03-frame"
              key={p.name}
              style={{ '--s03-i': i - (PHOTOS.length - 1) / 2 } as CSSProperties}
            >
              <span className="s03-glow" aria-hidden="true" />
              <div className="s03-print">
                <Pic n={3} name={p.name} alt={p.alt} ratio={`${p.px[0]} / ${p.px[1]}`} fit="contain" />
                <span className="s03-sheen" aria-hidden="true">
                  <i />
                </span>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </div>
  ),

  three(ctx) {
    const set = makeStreaks(ctx)
    ctx.bag.streaks = set
    return set.gl.dispose
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const streaks = ctx.bag.streaks as Streaks | undefined
    const title = ctx.$('.s03-title')
    const frames = ctx.$$('.s03-frame')

    // a held frame holds still: the camera's slow truck (a CSS animation) waits at its middle
    if (ctx.held || reduced) gsap.set(ctx.$('.s03-world'), { animationPlayState: 'paused' })

    /* ----------------------------------------------------------------- year */
    // THE ROOM: the camera is already flying when the slide opens, and comes to rest with the words
    if (!reduced) {
      tl.to(fx, { travel: 62, duration: 3.1, ease: 'power3.out' }, 0)
      gsap.set(fx, { yaw: -0.05 })
      tl.to(fx, { yaw: 0, duration: 3.1, ease: 'power2.out' }, 0)
    }
    // a low light, under the words: the far end of the room, where the year's pictures will come from
    gsap.set(fx, { focusX: 0.5, focusY: 0.85, glow: -0.3 })
    tl.to(fx, { glow: 0.14, duration: 2.2, ease: 'power2.out' }, 0.5)
    if (streaks) {
      const s = streaks.state
      gsap.set(s, { dist: 0, len: reduced ? 0 : 54, alpha: 0 })
      tl.to(s, { alpha: 1, duration: 0.5, ease: 'power1.out' }, 0.12)
      if (!reduced) {
        tl.to(s, { dist: 1150, duration: 3.1, ease: 'power3.out' }, 0)
        tl.to(s, { len: 0, duration: 2.5, ease: 'power2.out' }, 0.15)
      }
    }

    // THE TITLE waits low, in the middle of the room, and comes toward it as its words rise
    gsap.set(title, { y: U * LOW })
    if (!reduced) {
      gsap.set(title, { scale: 0.93, transformOrigin: '50% 45%' })
      tl.to(title, { scale: 1, duration: 2.7, ease: 'power3.out' }, 0.3)
    }
    a.words('.s03-h', 0.4, { stagger: 0.1, duration: 1.0 })
    a.words('.s03-sub', 1.5, { stagger: 0.035, duration: 0.8 })
    tl.addLabel('year', 3.1)

    /* -------------------------------------------------------------- moments */
    const M = 3.1
    // the title lifts to the deck's place and the camera pushes on once more
    tl.to(title, { y: 0, duration: 1.15, ease: ease.inOut }, M)
    if (!reduced) tl.to(fx, { travel: 96, duration: 2.8, ease: ease.inOut }, M)
    tl.to(fx, { focusY: 0.75, glow: 0.2, warm: 0.1, duration: 2.2, ease: ease.inOut }, M)
    if (streaks && !reduced) {
      const s = streaks.state
      tl.to(s, { dist: 1150 + 560, duration: 2.9, ease: 'power2.inOut' }, M)
      tl.to(s, { len: 17, duration: 0.9, ease: 'power2.in' }, M)
      tl.to(s, { len: 0, duration: 1.7, ease: 'power2.out' }, M + 0.9)
    }

    // THE WALL the year hangs on: a line of light and its wash, well behind the prints, come up out of the dark
    const wall = ctx.$('.s03-wall')
    gsap.set(wall, { autoAlpha: 0, z: (reduced ? WALL : WALL - 90) * U })
    tl.to(wall, { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, M + 0.35)
    if (!reduced) tl.to(wall, { z: WALL * U, duration: 1.7, ease: 'power3.out' }, M + 0.35)

    // THE PHOTOGRAPHS: out of the vanishing point, the outer two and then the middle one, and down with weight.
    // (In that order a print that is further away is never in front of one that is nearer.)
    let rest = M
    const ORDER = [0, 2, 1]
    frames.forEach((frame, i) => {
      const q = (sel: string) => Array.from(frame.querySelectorAll(sel))
      const print = q('.s03-print')
      const at = M + 0.5 + ORDER.indexOf(i) * 0.26
      gsap.set([...print, ...q('.s03-glow')], { autoAlpha: 0 })
      gsap.set(q('.s03-sheen i'), { xPercent: -130 })
      if (reduced) {
        tl.to(print, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, at)
        tl.to(q('.s03-glow'), { autoAlpha: 1, duration: 0.6 }, at)
        rest = Math.max(rest, at + 1.0)
        return
      }
      // from far down the room toward it: a uniform change of size and nothing else, never past its own place
      gsap.set(frame, { z: -DEEP * U, y: -U * 0.9 })
      tl.to(print, { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, at)
      tl.to(frame, { z: 0, duration: 1.55, ease: 'power3.out' }, at)
      // it lands: sinks a little under its own weight, and comes to rest
      tl.to(frame, { y: U * 0.42, duration: 0.5, ease: 'power2.out' }, at + 0.95)
      tl.to(frame, { y: 0, duration: 0.75, ease: 'sine.inOut' }, at + 1.45)
      tl.to(q('.s03-glow'), { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, at + 0.95)
      // one band of light crosses the print
      tl.to(q('.s03-sheen i'), { xPercent: 430, duration: 1.15, ease: 'power2.inOut' }, at + 1.05)
      rest = Math.max(rest, at + 2.25)
    })
    tl.addLabel('moments', rest)
    return tl
  },
}

export default scene
