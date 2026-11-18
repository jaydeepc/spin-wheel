'use client'

/**
 * THE WORLD OF AI (slides 16 to 25) · the clipping is pinned.
 *
 * The family's last arrival on every slide: the news clipping drops onto the page with a little
 * weight, swings once about the point it hangs from, and its strip of tape is pressed on.
 *
 *   import { pinDrop } from '../_shared/world-of-ai/pin'
 *   …
 *   pinDrop(ctx, tl, '.s17-clip', '>')            // a kit <Clipping className="s17-clip" …>
 *   pinDrop(ctx, tl, '.s18-clip', 4, { swing: -3, drop: 2 })   // the first tilt in degrees; the height it falls from in --u
 *
 * It sets the hidden state now and adds the tweens at `at`, like the kit's moves; with
 * ctx.reduced the clipping fades in where it hangs. It returns the time the drop takes (seconds),
 * so a caller can place a label after it.
 */

import gsap from 'gsap'
import type { SceneCtx } from '../../../core/types'

export function pinDrop(ctx: SceneCtx, tl: gsap.core.Timeline, target: string | Element, at: gsap.Position = '>', o: { swing?: number; drop?: number } = {}): number {
  const el = typeof target === 'string' ? ctx.$(target) : target
  const tape = el.querySelector('.kn-clip-tape')
  const swing = o.swing ?? 3.2
  // a label of its own for this drop, counted on the scene's own bag (nothing is kept between builds)
  const n = (typeof ctx.bag.woaPin === 'number' ? ctx.bag.woaPin : 0) + 1
  ctx.bag.woaPin = n
  const L = `woaPin${n}`
  tl.addLabel(L, at)
  if (ctx.reduced) {
    gsap.set(el, { autoAlpha: 0 })
    tl.to(el, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, L)
    tl.removeLabel(L)
    return 0.5
  }
  // it hangs from the tape: everything turns about the top middle
  gsap.set(el, {
    autoAlpha: 0,
    y: -ctx.U * (o.drop ?? 3.4),
    scale: 1.07,
    rotation: swing,
    transformOrigin: '50% 0%',
  })
  if (tape) gsap.set(tape, { autoAlpha: 0, scaleX: 1.5, scaleY: 1.5 })
  tl.to(el, { autoAlpha: 1, duration: 0.22, ease: 'power1.out' }, L)
  // the fall gathers speed and stops dead on the page …
  tl.to(el, { y: 0, scale: 1, duration: 0.42, ease: 'power2.in' }, L)
  // … the paper swings once and settles; the tape is pressed on as it lands
  tl.to(el, { rotation: 0, duration: 1.15, ease: 'elastic.out(1.1, 0.42)' }, `${L}+=0.4`)
  if (tape)
    tl.to(
      tape,
      {
        autoAlpha: 0.82,
        scaleX: 1,
        scaleY: 1,
        duration: 0.22,
        ease: ctx.ease.slam,
      },
      `${L}+=0.42`,
    )
  tl.removeLabel(L)
  return 1.55
}
