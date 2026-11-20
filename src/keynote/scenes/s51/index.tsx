'use client'

/**
 * Slides 51 to 54 · the BYOT | BYOA wheel. ONE scene for the four slides.
 *
 * THE IDEA. The deck shows four flat screenshots of this site's own wheel. Here the wheel is on
 * stage on a kiosk screen, and the presenter works it with the same key as every other slide:
 *
 *   51  wheel      the screen arrives; the wheel drifts and comes to a stop, waiting
 *   52  spinning   Next is the red button: the cap goes down, the wheel winds back and runs up to
 *                  full speed, and then it simply keeps turning for as long as the presenter talks
 *   53  landed     Next is the button again: the wheel coasts, ticks past the last segments and
 *                  stops on 01, "LI & GI Surrender Verification"; the result is held
 *   54  page       Next: the wheel docks in the corner and the use case page opens
 *
 * The picture is the REAL tool, recorded frame-exact so that the result is the same at every
 * rehearsal (exports/_rig/wheel-deck/RECORDING.md). Nothing of it is redrawn: the four clips play
 * at their own ratio and their own pixels; the scene adds only the screen they play on, a light
 * behind it, and the backdrop's answer to the spin.
 *
 * Video is not a GSAP tween, so player.ts makes it follow the timeline: the timeline carries one
 * linear stretch per clip (so Next, Back, a finished move and hold URLs all know where the picture
 * should be), the player plays the clip while the playhead runs, and puts a still and then the
 * exact frame on screen whenever the playhead is put somewhere. See player.ts.
 *
 * The headline of 51 to 53 and the title of 54 are inside the picture, as in the deck (these
 * four slides have no breadcrumb and carry the tool's own logo), so the chrome keeps only its
 * counter and Back / Next here.
 */

import gsap from 'gsap'
import { spanBeats, type SceneModule } from '../../kit'
import { ALT, CLIP, FACE, FPS, PX, STILL, STOP } from './data'
import { createPlayer, type Plan, type Player } from './player'
import './scene.css'

const SLIDES = { 51: ['wheel'], 52: ['spinning'], 53: ['landed'], 54: ['page'] }

/** The idle drift of 01-wheel, eased to a stop: full speed for 1.6 s, then slowing over 1 s. */
const DRIFT = { run: 1.6, slow: 1.0, floor: 0.2 }
const driftSeconds = DRIFT.run + DRIFT.slow
const drift = (local: number): { time: number; rate: number } => {
  if (local <= DRIFT.run) return { time: local, rate: 1 }
  const x = Math.min(1, (local - DRIFT.run) / DRIFT.slow)
  const k = 1 - DRIFT.floor
  // rate = 1 - k x, so time = run + slow (x - k x² / 2); with these numbers it ends on 2.2 s exactly
  return { time: DRIFT.run + DRIFT.slow * (x - (k * x * x) / 2), rate: 1 - k * x }
}

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),
  // the picture is the tool's own page: its own logo, its own title, no breadcrumb in the deck either
  chrome: { rail: false, crumb: false, logo: false },
  // the stills of the rests; coast / touch / dock are only ever seen under a held frame and load by themselves
  preload: [STILL.wheel0, STILL.wheel1, STILL.loop0, STILL.landed, STILL.page, FACE.src],

  Scene: () => (
    <div className="s51">
      <span className="s51-halo s51-halo--cool" aria-hidden="true" />
      <span className="s51-halo s51-halo--warm" aria-hidden="true" />
      <div className="s51-kiosk">
        <div className="s51-bezel">
          <div className="s51-screen" role="img" aria-label={ALT} style={{ aspectRatio: `${PX.w} / ${PX.h}` }}>
            <img className="s51-still" data-poster="wheel0" src={STILL.wheel0} alt="" draggable={false} />
            <img className="s51-still" data-poster="wheel1" src={STILL.wheel1} alt="" draggable={false} />
            <img className="s51-still" data-poster="loop0" src={STILL.loop0} alt="" draggable={false} />
            <img className="s51-still" data-poster="coast" src={STILL.coast} alt="" draggable={false} />
            <img className="s51-still" data-poster="touch" src={STILL.touch} alt="" draggable={false} />
            <img className="s51-still" data-poster="landed" src={STILL.landed} alt="" draggable={false} />
            <img className="s51-still" data-poster="dock" src={STILL.dock} alt="" draggable={false} />
            <img className="s51-still" data-poster="page" src={STILL.page} alt="" draggable={false} />
            <video className="s51-clip" data-clip="wheel" src={CLIP.wheel.src} muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} />
            <video className="s51-clip" data-clip="up" src={CLIP.up.src} muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} />
            <video className="s51-clip" data-clip="loop" src={CLIP.loop.src} muted playsInline preload="auto" loop disablePictureInPicture tabIndex={-1} />
            <video className="s51-clip" data-clip="stop" src={CLIP.stop.src} muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} />
            {/* 54: the builder's own photograph, laid over the page's empty portrait once the card has settled */}
            <img className="s51-face" src={FACE.src} alt={FACE.alt} draggable={false} />
          </div>
        </div>
      </div>
    </div>
  ),

  /** Not WebGL: the hook is used because it runs before build() and its return is the scene's dispose. */
  three(ctx) {
    const player = createPlayer(ctx.root, ctx.held)
    ctx.bag.player = player
    return player.dispose
  },

  build(ctx) {
    const { ease } = ctx
    const tl = ctx.timeline()
    const fx = ctx.backdrop.fx
    const U = ctx.U
    const kiosk = ctx.$('.s51-kiosk')
    const cool = ctx.$('.s51-halo--cool')
    const warm = ctx.$('.s51-halo--warm')
    const calm = ctx.reduced

    // the timeline's stretches: one per clip, each as long as the clip it carries
    const A0 = 0.35
    const A1 = A0 + driftSeconds
    const B1 = A1 + CLIP.up.seconds
    const C1 = B1 + STOP.landed
    const D1 = C1 + (STOP.page - STOP.landed)
    const span = { v: 0 }
    tl.to(span, { v: 1, duration: D1, ease: 'none' }, 0)

    // the screen arrives
    gsap.set(kiosk, calm ? { autoAlpha: 0 } : { autoAlpha: 0, y: U * 2.2, scale: 0.965, transformOrigin: '50% 60%' })
    gsap.set([cool, warm], { autoAlpha: 0, scale: 0.92 })
    tl.to(kiosk, { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: ease.out }, 0.1)
    tl.to(cool, { autoAlpha: 1, scale: 1, duration: 1.4, ease: ease.out }, 0.25)
    tl.to(fx, { glow: 0.22, focusX: -0.32, focusY: 0.05, duration: 1.6, ease: ease.inOut }, 0.2)
    tl.addLabel('wheel', A1)

    // 52: the red button. The room answers the spin: the light warms, the air comes alive.
    tl.to(warm, { autoAlpha: 0.55, scale: 1, duration: 1.5, ease: 'power2.in' }, A1 + 0.35)
    tl.to(fx, { energy: 0.5, warm: 0.3, glow: 0.42, duration: 1.6, ease: 'power2.in' }, A1 + 0.35)
    if (!calm) tl.to(fx, { travel: 34, duration: CLIP.up.seconds - 0.3, ease: 'power2.in' }, A1 + 0.3)
    tl.addLabel('spinning', B1)

    // 53: the coast. Everything winds down with the wheel, and the light lands where it stops.
    tl.to(fx, { energy: 0, warm: 0.12, glow: 0.3, duration: STOP.touchdown - 0.2, ease: 'power2.out' }, B1 + 0.2)
    if (!calm) tl.to(fx, { travel: 46, duration: STOP.touchdown, ease: 'power3.out' }, B1)
    tl.to(warm, { autoAlpha: 0.2, duration: STOP.touchdown - 0.2, ease: 'power2.out' }, B1 + 0.2)
    tl.to(warm, { autoAlpha: 0.75, duration: 0.35, ease: 'power2.out' }, B1 + STOP.touchdown)
    tl.to(warm, { autoAlpha: 0.32, duration: 1.4, ease: 'power2.inOut' }, B1 + STOP.touchdown + 0.35)
    tl.to(fx, { glow: 0.5, focusX: -0.3, focusY: -0.2, duration: 0.5, ease: 'power2.out' }, B1 + STOP.touchdown)
    tl.to(fx, { glow: 0.3, duration: 1.6, ease: 'power2.inOut' }, B1 + STOP.touchdown + 0.5)
    tl.addLabel('landed', C1)

    // 54: the page opens; the room goes quiet so the page can be read
    tl.to(warm, { autoAlpha: 0, duration: 1.6, ease: 'power2.inOut' }, C1 + 0.1)
    tl.to(fx, { glow: 0.14, warm: 0, focusX: 0, focusY: 0, duration: 2.4, ease: ease.inOut }, C1 + 0.1)
    // the builder's photograph comes in once his card stands still (frame 620 of the clip)
    const face = ctx.$('.s51-face')
    gsap.set(face, { autoAlpha: 0 })
    tl.to(face, { autoAlpha: 1, duration: 0.55, ease: 'power2.out' }, C1 + (FACE.frame / FPS - STOP.landed))
    tl.addLabel('page', D1)

    const near = (a: number, b: number) => Math.abs(a - b) < 1e-4
    // `exact`: the still is the very frame (the rests, and the first frame before the drift begins)
    const planOf = (t: number): Plan => {
      if (t < A0) return { clip: 'wheel', time: 0, rate: 1, run: false, stopAt: CLIP.wheel.seconds, loop: false, poster: 'wheel0', exact: true }
      if (t < A1 && !near(t, A1)) {
        const d = drift(t - A0)
        return { clip: 'wheel', time: d.time, rate: d.rate, run: true, stopAt: CLIP.wheel.seconds, loop: false, poster: d.time < 1.1 ? 'wheel0' : 'wheel1', exact: false }
      }
      if (near(t, A1)) return { clip: 'wheel', time: CLIP.wheel.seconds, rate: 1, run: true, stopAt: CLIP.wheel.seconds, loop: false, poster: 'wheel1', exact: true }
      if (t < B1 && !near(t, B1)) {
        const time = t - A1
        return { clip: 'up', time, rate: 1, run: true, stopAt: CLIP.up.seconds, loop: false, poster: time < 1 ? 'wheel1' : 'loop0', exact: false }
      }
      if (near(t, B1)) return { clip: 'loop', time: 0, rate: 1, run: false, stopAt: 0, loop: true, poster: 'loop0', exact: true }
      if (t < C1 || near(t, C1)) {
        const time = Math.min(STOP.landed, t - B1)
        const poster = time < 1.2 ? 'loop0' : time < STOP.touchdown - 0.5 ? 'coast' : time < STOP.touchdown + 0.4 ? 'touch' : 'landed'
        return { clip: 'stop', time, rate: 1, run: true, stopAt: STOP.landed, loop: false, poster, exact: near(t, C1) }
      }
      const time = Math.min(STOP.page, STOP.landed + (t - C1))
      const poster = time < STOP.landed + 0.5 ? 'landed' : time < STOP.landed + 2.4 ? 'dock' : 'page'
      return { clip: 'stop', time, rate: 1, run: true, stopAt: CLIP.stop.seconds, loop: false, poster, exact: near(t, D1) }
    }

    const player = ctx.bag.player as Player | undefined
    if (player) {
      player.attach(tl, planOf, [A1, B1, C1, D1])
      ctx.onSeek(() => player.force())
    }
    return tl
  },
}

export default scene
