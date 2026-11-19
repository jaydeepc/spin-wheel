'use client'

/**
 * THE STUB OF /ir. Until a slide's scene is built its folder holds this. For slides 1 to 6: the
 * deck's own page of the slide on a card (public/ir/pages/NN.jpg). For 7, which the source
 * deck does not have: the slide's words on the dark ground. It is also what a slide shows if its
 * scene fails to load, to render or to build.
 *
 * To build slide NN, replace scenes/sNN/index.tsx. Nothing else needs to change.
 */

import gsap from 'gsap'
import type { SceneModule } from '../../../keynote/core/types'
import { slide as slideOf } from '../../deck'

export function stub(n: number): SceneModule {
  const s = slideOf(n)
  if (!s.page)
    return {
      beats: ['page'],
      chrome: { crumb: false },
      Scene: () => (
        <div className="kn-stub" data-stub="1">
          <h1
            className="ir-stub-words"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 'calc(var(--u) * 22)',
              margin: 0,
              textAlign: 'center',
              fontSize: 'calc(var(--u) * 7)',
              lineHeight: 1.1,
              fontWeight: 700,
              color: 'var(--kn-fg)',
              visibility: 'hidden',
            }}
          >
            {s.title}
          </h1>
        </div>
      ),
      build(ctx) {
        const words = ctx.$('.ir-stub-words')
        gsap.set(words, { autoAlpha: 0, y: ctx.U * 1.4 })
        const tl = ctx.timeline()
        tl.to(words, { autoAlpha: 1, y: 0, duration: 0.8 }, 0.05)
        tl.addLabel('page')
        return tl
      },
    }
  return {
    beats: ['page'],
    preload: [s.page],
    // the page carries its own logo
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
