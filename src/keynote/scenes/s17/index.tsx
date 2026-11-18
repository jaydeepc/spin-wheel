'use client'

/**
 * Slide 17 · "Almost everyone uses AI now, but only 6 in 100 can see it in their profits."
 *
 * ENOUGH OF PILOTS. The deck's picture is a field of a hundred paper planes; here they are a
 * hundred real folded planes (field.ts: instanced meshes on a scene-owned canvas), one for each
 * company in a hundred, and the slide's point is what they do:
 *
 *   everyone   the headline; the hundred fill the stage: 63 grey planes glide in and park as
 *              "63%" counts over them, 31 blue ones as "31%" counts over them, and six plain
 *              paper ones settle at the ends of the rows
 *   six        the room steps back from the crowd (the field draws away to the left, the two
 *              numbers with it) and the six take their colour, leave the ends of their rows one
 *              after the other and climb out over the free half of the stage toward the room, on
 *              long dotted trails; their wake runs through the ninety-four left on the ground;
 *              "6%" lands as the first of them reaches its height; then the clipping is pinned
 *   why        what the six do differently: 3 in 4
 *
 * Where there is no WebGL the deck's own flat picture stands in (the parked planes, then the six),
 * with the numbers at the deck's own places (scene.css, .s17--flat).
 */

import gsap from 'gsap'
import { anim, Clipping, Count, Headline, Kicker, Pic, pic, place, Words, type SceneModule } from '../../kit'
import { pinDrop } from '../_shared/world-of-ai/pin'
import { CLIP, FLAME, PICTURE, SOURCE, STATS, WHY, WIDE_STATS } from './data'
import { makeField, type Field } from './field'
import './scene.css'

const scene: SceneModule = {
  beats: ['everyone', 'six', 'why'],
  preload: [pic(17, 'illus-paper-planes.png')],

  Scene: ({ slide }) => (
    <div className="s17">
      <Headline text={slide.title} flame={FLAME} />

      {STATS.map((s) => (
        <div className={`s17-stat s17-stat--${s.key}`} key={s.key}>
          <b className="s17-num">
            <Count to={s.value} suffix="%" />
          </b>
          <p>
            <Words text={s.line} bold={[...s.bold]} />
          </p>
        </div>
      ))}

      {/* only where there is no WebGL: the deck's one flat picture, as two windows (the parked planes, the six) */}
      <Pic className="s17-flat s17-flat--parked" n={17} name="illus-paper-planes.png" fit="contain" style={place(PICTURE, { dy: -1.75 })} />
      <Pic className="s17-flat s17-flat--six" n={17} name="illus-paper-planes.png" fit="contain" style={place(PICTURE, { dy: -1.75 })} />

      <Clipping className="s17-clip" date={CLIP.date} tape="flame" source={CLIP.source} tilt={1.4} width={27.4}>
        {CLIP.headline}
      </Clipping>

      <div className="s17-why">
        <Kicker tone="flame" block>
          {WHY.label}
        </Kicker>
        <b className="s17-34">
          <Count to={3} suffix=" in 4" />
        </b>
        <p>
          <Words text={WHY.line} bold={WHY.bold} />
        </p>
      </div>

      <p className="s17-src">{SOURCE}</p>
    </div>
  ),

  three(ctx) {
    const field = makeField(ctx)
    ctx.bag.field = field
    return () => field.gl.dispose()
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const field = ctx.bag.field as Field | undefined
    const s = field?.state
    const grey = ctx.$('.s17-stat--grey')
    const blue = ctx.$('.s17-stat--blue')
    // no canvas: the deck's flat picture, and the numbers where the deck has them
    ctx.$('.s17').classList.toggle('s17--flat', !field)

    /* ------------------------------------------------------------ everyone */
    a.words('.kn-h', 0.1)
    if (s && field) {
      // the hundred fill the stage, and the two numbers stand over their own colours
      gsap.set(grey, { x: WIDE_STATS.grey.x * U, y: WIDE_STATS.grey.y * U })
      gsap.set(blue, { x: WIDE_STATS.blue.x * U, y: WIDE_STATS.blue.y * U })
      if (reduced) {
        // less motion: the field is simply there
        gsap.set(s, { landG: 1, landB: 1, landS: 1 })
        a.fade(field.gl.canvas, 0.4, { duration: 0.8 })
      } else {
        tl.to(s, { landG: 1, duration: 1.7, ease: 'none' }, 0.45)
        tl.to(s, { landB: 1, duration: 1.25, ease: 'none' }, 1.5)
        tl.to(s, { landS: 1, duration: 0.85, ease: 'none' }, 2.25)
      }
    } else {
      a.wipe('.s17-flat--parked img', 0.5, { from: 'left', duration: 1.4 })
    }
    a.rise('.s17-stat--grey .s17-num', 0.85)
    a.count('.s17-stat--grey .kn-count-n', '<0.1')
    a.words('.s17-stat--grey p', '<0.25')
    a.rise('.s17-stat--blue .s17-num', 1.75)
    a.count('.s17-stat--blue .kn-count-n', '<0.1', { duration: 1 })
    a.words('.s17-stat--blue p', '<0.25')
    a.fade('.s17-src', 2.3)
    tl.to(fx, { glow: 0.16, focusX: -0.2, focusY: 0.45, duration: 2.4 }, 0.5)
    const A = 3.15
    tl.addLabel('everyone', A)

    /* ----------------------------------------------------------------- six */
    /** When the first of the six is at its height: "6%" has counted by then. */
    let UP = A + 1.6
    if (s && field) {
      tl.to(s, { hot: 1, duration: 0.5, ease: 'power1.inOut' }, A)
      if (reduced) {
        tl.to([field.gl.canvas, grey, blue], { autoAlpha: 0, duration: 0.25 }, A + 0.5)
        tl.set(s, { shift: 1 }, A + 0.76)
        tl.set(s.fly, { t: 1 }, A + 0.76)
        tl.set([grey, blue], { x: 0, y: 0 }, A + 0.76)
        tl.to([field.gl.canvas, grey, blue], { autoAlpha: 1, duration: 0.5 }, A + 0.8)
      } else {
        // the room steps back from the crowd …
        const SHIFT = { duration: 1.8, ease: 'power2.inOut' }
        tl.to(s, { shift: 1, ...SHIFT }, A + 0.15)
        tl.to([grey, blue], { x: 0, y: 0, ...SHIFT }, A + 0.15)
        // … and the six leave, one, two, three: the back row's plane has the longest climb and goes first
        const GO = A + 0.3
        s.fly.forEach((f, i) => tl.to(f, { t: 1, duration: 2.05 - i * 0.05, ease: 'power2.inOut' }, GO + i * 0.26))
        UP = GO + 2.05
        // their wake runs through the ninety-four on the ground
        tl.to(s, { gust: 1, duration: 2.0, ease: 'power1.inOut' }, GO + 0.6)
        tl.to(s, { idle: 1, duration: 1, ease: 'power1.inOut' }, UP)
      }
      const top = field.seen(0, 1)
      tl.to(
        fx,
        {
          glow: 0.36,
          warm: 0.3,
          focusX: (top.u - 50) / 50,
          focusY: (top.v - 28.125) / 28.125,
          duration: 2.3,
          ease: ease.inOut,
        },
        A + 0.3,
      )
    } else {
      a.wipe('.s17-flat--six img', A, { from: 'bottom', duration: 1.3 })
      tl.to(fx, { glow: 0.3, warm: 0.3, focusX: 0.1, focusY: -0.05, duration: 1.4 }, A)
    }
    // "6%" has counted exactly as the first of the six reaches its height
    a.rise('.s17-stat--flame .s17-num', UP - 1.15, { y: 2.6, duration: 0.9 })
    a.count('.s17-stat--flame .kn-count-n', UP - 1.0, { duration: 1 })
    a.words('.s17-stat--flame p', UP - 0.55)
    // last, with a little weight: the clipping is pinned
    pinDrop(ctx, tl, '.s17-clip', UP + 0.75)
    const B = tl.duration()
    tl.addLabel('six', B)

    /* ----------------------------------------------------------------- why */
    a.rise('.s17-why .kn-kicker', B)
    a.rise('.s17-34', '<0.12')
    a.count('.s17-34 .kn-count-n', '<0.05', {
      duration: 0.9,
      ease: 'power1.out',
    })
    a.words('.s17-why p', '<0.3')
    tl.to(
      fx,
      {
        focusX: 0.55,
        focusY: 0.3,
        glow: 0.26,
        duration: 1.2,
        ease: ease.inOut,
      },
      '<',
    )
    tl.addLabel('why')
    return tl
  },
}

export default scene
