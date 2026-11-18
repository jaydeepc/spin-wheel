'use client'

/**
 * THE STUB. Until a slide's scene is built, its folder holds this: the deck's own page of the
 * slide, shown whole on a card under the top bar, with a gentle arrival and one beat.
 *
 * (The page is the deck's picture of the slide. On the seven pages where the deck's authors left
 * review marks it was drawn again from the deck without them. See deck.ts → page, NOTED.)
 *
 * To build slide NN, replace scenes/sNN/index.tsx. Nothing else needs to change.
 */

import gsap from 'gsap'
import { slide as slideOf } from '../../deck'
import type { SceneModule } from '../../core/types'

export function stub(n: number): SceneModule {
  const s = slideOf(n)
  return {
    beats: ['page'],
    preload: [s.page],
    // the page carries its own logo and breadcrumb
    chrome: { logo: false, crumb: false },
    Scene: () => (
      <div className="kn-stub" data-stub="1">
        <figure className="kn-stub-card">
          <img src={s.page} alt={s.title} draggable={false} />
        </figure>
      </div>
    ),
    build(ctx) {
      const card = ctx.$('.kn-stub-card')
      gsap.set(card, { autoAlpha: 0, y: ctx.U * 1.4, scale: 0.985 })
      const tl = ctx.timeline()
      tl.to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8 }, 0.05)
      tl.addLabel('page')
      return tl
    },
  }
}
