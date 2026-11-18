'use client'

/**
 * Slide 30 · "Our AI, Tech & data science capabilities have achieved massive scale"
 *
 * THE IDEA: scale is a board that fills. Nine numbered capsules, three by three, have the whole
 * stage. They arrive in number order, a row to a breath; each figure counts up to its value as
 * its capsule comes in, its numbered disc drops onto it with a little weight (a ring goes out
 * from where it lands), a sheen runs once along the capsule, and the backdrop's light steps
 * from capsule to capsule, warm on the peach ones, cool on the blue.
 *
 *   people     the headline; 1 to 3: engineers, scientists, models and agents   (plays on arrival)
 *   models     4 to 6: features, dashboards, models
 *   platform   7 to 9: API hits, products, the centre
 *
 * The board is laid out in its final place. While only one or two rows are there it hangs lower,
 * so every rest is centred on the stage, and it steps up as each next row comes in.
 *
 * All of it is DOM on the one timeline: no canvas of its own (the two placeholder charts and
 * their blocks are gone with the owner's updated slide).
 */

import gsap from 'gsap'
import { anim, Count, Headline, Words, type SceneModule } from '../../kit'
import { TILES } from './data'
import './scene.css'

const ROWS = ['people', 'models', 'platform']
/** From one row to the next, in --u (the stylesheet's tile height + row gap). */
const STEP = 12.3
/** Where the backdrop's light sits across the three columns. */
const FOCUS_X = [-0.6, 0, 0.6]

/** A figure counts from the smallest number with as many digits, so its width never changes while it counts. */
const startOf = (to: number) => 10 ** (String(to).length - 1)

const scene: SceneModule = {
  beats: ROWS,

  Scene: ({ slide }) => (
    <div className="s30">
      <Headline className="s30-h" text={slide.title} />

      <div className="s30-grid">
        {TILES.map((t) => (
          <div className="s30-tile" data-tone={t.tone} key={t.n}>
            <span className="s30-shine" aria-hidden="true">
              <span className="s30-sheen" />
            </span>
            <span className="s30-ring" aria-hidden="true" />
            <span className="s30-badge">{t.n}</span>
            <div className="s30-body">
              <b className="s30-num">
                <Count to={t.to} from={startOf(t.to)} prefix={t.prefix} suffix={t.suffix} />
                {t.unit ? <small className={t.unit.length > 2 ? 's30-unit s30-unit--word' : 's30-unit'}>{t.unit}</small> : null}
              </b>
              <p className="s30-label">
                {t.label.map((line) => (
                  <span className="s30-label-line" key={line}>
                    <Words text={line} />
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const grid = ctx.$('.s30-grid')
    const tiles = ctx.$$('.s30-tile')
    const tileW = tiles.length ? ctx.loc(tiles[0]).w : 0 // measured before anything is hidden or moved

    /** How far the board hangs below its final place while only rows 0 … r are on it. */
    const hang = (r: number) => (reduced ? 0 : ((2 - r) * STEP * U) / 2)

    /* ---- starting states ---- */
    gsap.set(grid, { y: hang(0) })

    a.words('.kn-h', 0.1)
    if (!reduced) tl.to(fx, { travel: 18, duration: 2.6, ease: 'power3.out' }, 0.2)

    let t = 0.55
    ROWS.forEach((name, r) => {
      // the board steps up to make room, then the row comes in
      if (r > 0 && !reduced) tl.to(grid, { y: hang(r), duration: 0.95, ease: ease.inOut }, t)
      const lead = r === 0 ? 0 : 0.4

      tiles.slice(r * 3, r * 3 + 3).forEach((tile, i) => {
        const s = t + lead + i * 0.22
        const q = (sel: string) => tile.querySelector(sel)
        const badge = q('.s30-badge')
        const ring = q('.s30-ring')
        const sheen = q('.s30-sheen')
        const peach = tile.getAttribute('data-tone') === 'peach'

        a.rise(tile, s, { y: 2.6, scale: 0.965, duration: 0.8 })
        a.count(q('.kn-count-n'), s + 0.12, { duration: 1.35 })
        a.rise(q('.s30-unit'), s + 0.5, { y: 0.5, duration: 0.5 })
        a.words(q('.s30-label'), s + 0.45, { stagger: 0.035, duration: 0.6 })

        if (reduced) {
          a.fade(badge, s + 0.2)
        } else {
          // the disc drops onto its capsule, gives a little, and stands
          gsap.set(badge, { autoAlpha: 0, y: -2.3 * U, scale: 1.22, transformOrigin: '50% 100%' })
          tl.to(badge, { autoAlpha: 1, duration: 0.14, ease: 'none' }, s + 0.3)
          tl.to(badge, { y: 0, scale: 1, duration: 0.3, ease: 'power2.in' }, s + 0.3)
          tl.to(badge, { scaleX: 1.1, scaleY: 0.86, duration: 0.08, ease: 'power1.out' }, s + 0.6)
          tl.to(badge, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'back.out(3.2)' }, s + 0.68)
          // a ring goes out from where it landed
          gsap.set(ring, { autoAlpha: 0, scale: 1 })
          tl.to(
            ring,
            {
              keyframes: [
                { autoAlpha: 0.8, scale: 1.04, duration: 0.05, ease: 'none' },
                { autoAlpha: 0, scale: 1.85, duration: 0.75, ease: 'power2.out' },
              ],
            },
            s + 0.6,
          )
          // one sheen along the capsule; it begins and ends outside it
          gsap.set(sheen, { x: -0.5 * tileW })
          tl.to(sheen, { x: 1.15 * tileW, duration: 1.0, ease: 'power1.inOut' }, s + 0.4)
        }

        // the backdrop's light answers: it steps to this capsule, warm for peach, cool for blue
        tl.to(fx, { glow: 0.36, focusX: FOCUS_X[i], focusY: 0.1 + r * 0.22, warm: peach ? 0.16 : -0.1, energy: 0.3, duration: 0.5, ease: ease.inOut }, s + 0.1)
      })

      t += lead + 2.25
      // … and settles behind the middle of the board for the rest
      tl.to(fx, { glow: 0.22, focusX: 0, focusY: 0.1, warm: 0, energy: 0.15, duration: 0.7, ease: ease.inOut }, t - 0.75)
      tl.addLabel(name, t)
    })

    return tl
  },
}

export default scene
