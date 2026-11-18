'use client'

/**
 * Slide 20 · "Everyone expected agents to fly free this year, but the string stayed firmly in
 * human hands."
 *
 * THE IDEA: a sky of kites, and every string runs to one spool. The deck's kites are one flat
 * picture; here they are objects in a wind (kites.ts, scene-owned three.js): they leave the
 * spool, climb as it pays the string out, and sway. Then the hand shows itself: every string is
 * pulled taut at once and the whole sky answers. And when a string snaps, the kite is free for
 * one moment, then tumbles, its colour draining, as its clipping is pinned up under it.
 *
 *   fly     the headline and the line that says what an agent is; the spool; the sky fills;
 *           40% and 130+ count beside their kites
 *   hands   the blue kite and 7%; the hand pulls: every string goes taut together
 *   snaps   "When the string snaps": three strings break, three kites come down, three clippings
 *
 * Without WebGL the deck's own flat picture of the kites stands in, from the first rest on.
 */

import gsap from 'gsap'
import { anim, Clipping, Count, Headline, Pic, pic, place, Words, type SceneCtx, type SceneModule } from '../../kit'
import { CLIPS, FLAME, INTRO, KITES_PIC, KITES_RECT, SNAPS, SOURCES, STATS } from './data'
import { KITES, makeSky, type Sky } from './kites'
import './scene.css'

const scene: SceneModule = {
  beats: ['fly', 'hands', 'snaps'],
  preload: [pic(20, KITES_PIC)],

  Scene: ({ slide }) => (
    <div className="s20">
      {/* only where there is no WebGL: the deck's own picture, whole, refitted inside the safe area */}
      <Pic className="s20-flat" n={20} name={KITES_PIC} fit="contain" style={place(KITES_RECT, { scale: 0.84, dy: -2.6 })} />

      <Headline text={slide.title} flame={FLAME} />
      <p className="s20-intro">
        <Words text={INTRO.text} bold={INTRO.bold} />
      </p>

      {STATS.map((s) => (
        <div className={`s20-stat s20-stat--${s.key}`} key={s.key} data-tone={s.tone}>
          <b className="s20-num">
            <Count to={s.to} suffix={s.suffix} />
          </b>
          <p className="s20-line">
            <Words text={s.line} bold={[...s.bold]} />
          </p>
        </div>
      ))}

      <p className="s20-snaps">{SNAPS}</p>
      {CLIPS.map((c, i) => (
        <Clipping key={c.text} className={`s20-clip s20-clip--${i + 1}`} date={c.date} tape={c.tape} source={c.source} tilt={c.tilt} width={21.6}>
          {c.text}
        </Clipping>
      ))}

      <p className="s20-src">{SOURCES}</p>
    </div>
  ),

  three(ctx) {
    const sky = makeSky(ctx)
    ctx.bag.sky = sky
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      sky.gl.dispose()
    }
  },

  build(ctx) {
    const { ease } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const sky = ctx.bag.sky as Sky | undefined
    const calm = ctx.reduced
    const stat = (key: string) => ctx.$(`.s20-stat--${key}`)
    const number = (key: string, at: number) => {
      const el = stat(key)
      a.rise(el.querySelector('.s20-num'), at, { y: 2 })
      a.count(el.querySelector('.kn-count-n'), at + 0.1)
      a.words(el.querySelector('.s20-line'), at + 0.3, { stagger: 0.03 })
    }
    /** A kite leaves the spool and climbs to its place. */
    const launch = (key: string, at: number, d: number) => {
      if (!sky) return
      const k = sky.kites[key]
      const to = k.alpha
      k.alpha = 0
      k.fly = calm ? 1 : 0
      tl.to(k, { alpha: to, duration: calm ? 0.6 : 0.45, ease: 'power1.out' }, at)
      if (!calm) tl.to(k, { fly: 1, duration: d, ease: 'power3.out' }, at)
    }

    /* ------------------------------------------------------------------ fly */
    a.words('.kn-h', 0.1)
    a.words('.s20-intro', 0.6, { stagger: 0.018 })
    if (sky) {
      gsap.set(ctx.$('.s20-flat'), { autoAlpha: 0 })
      sky.wind.amp = 0
      sky.wind.taut = 0
      sky.wind.yank = 0
      sky.spool.grow = 0
      sky.spool.show = 0
      sky.spool.spin = 0
      tl.to(sky.spool, { show: 1, duration: 0.7, ease: ease.snap }, 0.4)
      // the spool pays out as the sky fills, and the wind comes up
      if (!calm) tl.to(sky.spool, { spin: -16, duration: 3.6, ease: 'power2.out' }, 0.7)
      tl.to(sky.wind, { amp: 1, duration: 2.2, ease: 'power1.inOut' }, 1.2)
      const far = KITES.filter((k) => k.key[0] === 'f')
      far.forEach((k, i) => launch(k.key, 0.75 + i * 0.09, 2.3))
      ;['d1', 'd2', 'd3'].forEach((key, i) => launch(key, 1.0 + i * 0.14, 2.1))
      launch('forty', 1.3, 2.0)
      launch('bny', 1.85, 2.0)
      // the blue one waits for its beat
      sky.kites.seven.alpha = 0
      sky.kites.seven.fly = calm ? 1 : 0
    } else {
      a.wipe('.s20-flat', 0.6, { from: 'right', duration: 1.6 })
    }
    number('forty', 2.1)
    number('bny', 2.65)
    a.fade('.s20-src', 2.4)
    tl.to(fx, { glow: 0.26, focusX: -0.3, focusY: -0.1, warm: 0.25, energy: 0.2, duration: 2.2 }, 0.6)
    tl.addLabel('fly', 4.3)

    /* ---------------------------------------------------------------- hands */
    const H = 4.3
    if (sky) {
      const seven = sky.kites.seven
      tl.to(seven, { alpha: 1, duration: 0.45, ease: 'power1.out' }, H)
      if (!calm) {
        tl.to(seven, { fly: 1, duration: 1.9, ease: 'power3.out' }, H)
        tl.to(sky.spool, { spin: -19.5, duration: 1.6, ease: 'power2.out' }, H)
        // the spool is brought forward: this is the hand
        tl.to(sky.spool, { grow: 1, duration: 1.3, ease: ease.inOut }, H + 0.2)
        // ONE PULL. Every string in the sky snaps straight, every kite is snatched toward the
        // spool with its nose down, the spool jerks and reels in; then the kites ride back up on
        // the elastic, and the strings stay straight: held.
        const P = H + 1.9
        tl.to(sky.wind, { taut: 1, duration: 0.2, ease: 'power3.out' }, P)
        tl.to(sky.wind, { yank: 1, duration: 0.22, ease: 'power3.out' }, P)
        tl.to(sky.spool, { spin: -15.6, duration: 0.3, ease: 'power3.out' }, P)
        tl.to(sky.wind, { yank: 0, duration: 1.7, ease: 'elastic.out(1, 0.36)' }, P + 0.22)
        tl.to(sky.wind, { taut: 0.86, duration: 1.2, ease: 'power2.inOut' }, P + 0.4)
        // "firmly in human hands" answers on the same frame
        const flame = ctx.$$('.kn-h .kn-flame')
        if (flame.length) {
          tl.to(flame, { color: '#ff4a1c', duration: 0.16, ease: 'power2.out' }, P)
          tl.to(flame, { color: '#eb542c', duration: 1.1, ease: 'power2.out' }, P + 0.22)
        }
        tl.to(fx, { glow: 0.62, duration: 0.22, ease: 'power2.out' }, P)
        tl.to(fx, { glow: 0.36, duration: 1.4, ease: 'power2.out' }, P + 0.24)
      } else {
        tl.to(sky.spool, { grow: 1, duration: 0.6 }, H + 0.4)
        tl.to(sky.wind, { taut: 0.86, duration: 0.6 }, H + 0.6)
      }
    }
    number('seven', H + 0.7)
    tl.to(fx, { focusX: 0.8, focusY: 0.6, glow: 0.36, warm: 0.1, duration: 1.7, ease: ease.inOut }, H)
    tl.addLabel('hands', H + 4.0)

    /* ---------------------------------------------------------------- snaps */
    const S = H + 4.0
    a.rise('.s20-snaps', S, { y: 0, x: -1.2 })
    ;['d1', 'd2', 'd3'].forEach((key, i) => {
      const at = S + 0.25 + i * 0.8
      if (sky) {
        const k = sky.kites[key]
        tl.to(k, { cut: 1, duration: calm ? 0.4 : 1.0, ease: 'power1.in' }, at)
        tl.to(k, { fall: 1, duration: calm ? 0.4 : 1.7, ease: 'power1.inOut' }, at)
        tl.to(k, { grey: 1, duration: calm ? 0.4 : 1.2, ease: 'power1.in' }, at + 0.3)
      }
      pin(ctx, tl, ctx.$(`.s20-clip--${i + 1}`), at + 0.85, i % 2 ? 1 : -1)
    })
    tl.to(fx, { focusX: -0.1, focusY: 0.6, glow: 0.24, warm: 0, energy: 0, duration: 1.6, ease: ease.inOut }, S)
    tl.addLabel('snaps', S + 0.25 + 1.6 + 1.9)
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
