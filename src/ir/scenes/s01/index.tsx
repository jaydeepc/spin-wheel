'use client'

/**
 * /ir slide 01 · the title. Dark.
 *
 *   Implications for Investors
 *
 * One beat. The deck's own dawn picture (public/ir/src/01/hero-dawn-2880.jpg: deep navy, an ember
 * light at the top right, a clear blue one at the bottom right) is the ground. It is shown whole
 * and in its own proportions (16:9, as the stage), a little larger than the stage so that it has
 * room to move: it comes in from further out and settles, and its edges are feathered so that on
 * a screen that is not 16:9 it melts into the live backdrop instead of ending in a line. The
 * backdrop stays alive through it: the camera flies in, the field of points rises under the
 * title. Then the title comes up word by word, a line of first light draws under it and a low
 * glow opens behind it. After that only the ground breathes.
 *
 * The logo is the chrome's (top right, where the deck has it). Nothing else is on the slide.
 */

import gsap from 'gsap'
import { anim, pic, Words, type SceneModule } from '../../kit'
import './scene.css'

const HERO = pic(1, 'hero-dawn-2880.jpg')

const scene: SceneModule = {
  beats: ['title'],
  preload: [HERO],
  chrome: { crumb: false, counter: false },

  Scene: ({ slide }) => (
    <div className="ir01">
      <div className="ir01-hero" aria-hidden="true">
        <img src={HERO} alt="" draggable={false} />
      </div>
      <span className="ir01-glow" aria-hidden="true" />
      <div className="ir01-lock">
        <h1 className="ir01-title">
          <Words text={slide.title} flame={[slide.title]} />
        </h1>
        <span className="ir01-dawn" aria-hidden="true" />
      </div>
    </div>
  ),

  build(ctx) {
    const { ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx

    // THE ROOM. Asleep before the first frame: the camera far back and looking down, no field, no light.
    gsap.set(fx, { travel: reduced ? 0 : -80, pitch: reduced ? 0 : -0.18, wave: -0.8, glow: -0.45, energy: -0.5 })
    tl.to(fx, { travel: 0, duration: 3, ease: 'power3.out' }, 0)
    tl.to(fx, { pitch: 0, duration: 2.7, ease: ease.inOut }, 0)
    tl.to(fx, { wave: 0.2, energy: 0.25, duration: 2.4, ease: 'power2.out' }, 0.1)
    // the light opens LOW and to the right, where the picture has its own blue; the logo's corner stays deep
    gsap.set(fx, { focusX: 0.35, focusY: 0.8 })
    tl.to(fx, { glow: 0, duration: 1.8, ease: 'power2.out' }, 1.1)

    // THE DAWN PICTURE: from further out, settling (the outer element; the inner one idles)
    const hero = ctx.$('.ir01-hero')
    gsap.set(hero, { autoAlpha: 0, scale: reduced ? 1 : 1.16 })
    tl.to(hero, { autoAlpha: 1, duration: 1.5, ease: 'power2.out' }, 0.05)
    if (!reduced) tl.to(hero, { scale: 1, duration: 3.2, ease: 'power3.out' }, 0.05)

    // THE TITLE: the block comes forward a little while its words rise
    if (!reduced) {
      const lock = ctx.$('.ir01-lock')
      gsap.set(lock, { scale: 0.94, transformOrigin: '50% 50%' })
      tl.to(lock, { scale: 1, duration: 2.5, ease: 'power3.out' }, 0.5)
    }
    a.words('.ir01-title', 0.7, { stagger: 0.14, duration: 1.05 })

    // first light: a line draws from its middle, a low glow opens behind the words
    a.rule('.ir01-dawn', 1.5, { from: 'center', duration: 1.2 })
    const glow = ctx.$('.ir01-glow')
    gsap.set(glow, { autoAlpha: 0, scale: 0.6 })
    tl.to(glow, { autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.out' }, 1.2)

    tl.addLabel('title', 3.3)
    return tl
  },
}

export default scene
