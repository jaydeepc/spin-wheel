'use client'

/**
 * Slide 01 · the title. Dark navy.
 *
 *   the lock-up  |  Building AI for Bharat
 *        Investor and Analyst Day 2026
 *
 * One beat. The room wakes first: the camera flies in through the particles and lifts to the
 * horizon, the field of points rises. Then the lock-up opens from its mark, a sheen crosses it,
 * the rule draws, the theme comes up line by line, and the day arrives word by word with a low
 * light opening behind it. After that only the backdrop moves, for as long as the room takes to
 * settle.
 *
 * THE LOCK-UP IS THE DECK'S OWN. "Building AI for Bharat" is brand lettering, not a font: it is
 * shown from the deck's picture (public/keynote/src/01/lockup-…png), each line through its own
 * window, at exactly the deck's size and place. The logo beside it is the brand's file (the same
 * artwork, sharper), sized and placed as the picture has it; the rule between them is drawn.
 * The numbers in scene.css are the picture's own pixels (measured), so nothing is guessed.
 */

import gsap from 'gsap'
import { anim, BRAND, Logo, pic, Words, type SceneModule } from '../../kit'
import './scene.css'

const LOCKUP = pic(1, 'lockup-piramal-ai-building-ai-for-bharat.png')

const scene: SceneModule = {
  beats: ['title'],
  preload: [BRAND.lockup, LOCKUP],
  // the title is the logo: nothing of the chrome but Back / Next
  chrome: { logo: false, rail: false, crumb: false, counter: false },

  Scene: ({ slide }) => (
    <div className="s01">
      <div className="s01-lock">
        <div className="s01-logo">
          <Logo height={11.016} />
          <span className="s01-sheen" style={{ WebkitMaskImage: `url(${BRAND.lockup})`, maskImage: `url(${BRAND.lockup})` }} aria-hidden="true">
            <i />
          </span>
        </div>
        <span className="s01-bar" aria-hidden="true" />
        <p className="s01-theme" role="img" aria-label="Building AI for Bharat">
          <span className="s01-line s01-line--1">
            <i style={{ backgroundImage: `url(${LOCKUP})` }} />
          </span>
          <span className="s01-line s01-line--2">
            <i style={{ backgroundImage: `url(${LOCKUP})` }} />
          </span>
        </p>
      </div>
      <h1 className="s01-day">
        <Words text={slide.title} flame={[slide.title]} />
      </h1>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx

    // THE ROOM. Before the first frame it is asleep: the camera far back and looking down, no field, no light.
    gsap.set(fx, { travel: reduced ? 0 : -85, pitch: reduced ? 0 : -0.2, wave: -0.8, glow: -0.45, energy: -0.55 })
    tl.to(fx, { travel: 0, duration: 2.9, ease: 'power3.out' }, 0)
    tl.to(fx, { pitch: 0, duration: 2.7, ease: ease.inOut }, 0)
    tl.to(fx, { wave: 0.15, energy: 0.1, duration: 2.4, ease: 'power2.out' }, 0.1)
    // the light opens LOW, behind the day: the lock-up stays on deep navy, as the deck has it
    gsap.set(fx, { focusX: 0.15, focusY: 0.75 })
    tl.to(fx, { glow: -0.05, duration: 1.6, ease: 'power2.out' }, 1.3)

    // THE LOCK-UP: it opens from its mark, settles, and a sheen crosses it once
    const logo = ctx.$('.s01-logo .kn-logo')
    const lock = ctx.$('.s01-lock')
    if (!reduced) {
      gsap.set(lock, { scale: 0.95, transformOrigin: '50% 34%' })
      tl.to(lock, { scale: 1, duration: 2.3, ease: 'power3.out' }, 0.4)
      gsap.set(ctx.$('.s01-logo'), { y: U * 1.2 })
      tl.to(ctx.$('.s01-logo'), { y: 0, duration: 1.4 }, 0.45)
    }
    a.wipe(logo, 0.45, { duration: 1.2, from: 'left' })
    gsap.set(ctx.$('.s01-sheen i'), { xPercent: -160 })
    tl.to(ctx.$('.s01-sheen i'), { xPercent: 260, duration: 1.4, ease: 'power2.inOut' }, 1.3)

    // the rule, then the theme: each line comes up through its own window
    a.rule('.s01-bar', 1.15, { from: 'center', duration: 0.7 })
    const lines = ctx.$$('.s01-line i')
    if (reduced) a.fade(lines, 1.3)
    else {
      gsap.set(lines, { yPercent: 104 })
      tl.to(lines, { yPercent: 0, duration: 0.95, stagger: 0.14, ease: ease.out }, 1.3)
    }

    // THE DAY
    a.words('.s01-day', 1.75, { stagger: 0.07, duration: 0.95 })
    tl.addLabel('title', 2.95)
    return tl
  },
}

export default scene
