'use client'

/**
 * /ir slide 07 · THE CLOSE: "Thank You!", the invitation to questions, the contacts. Dark. The
 * last slide of the deck, and the frame that stays on the wall for the whole question session.
 *
 *   thanks   slide 6 comes apart. Its last rest (the big AI line, the tiles, the RoE track) is
 *            there once more as sixteen thousand points, in its own colours, on its own light
 *            page; they come loose, spiral into one orb at the middle of the stage; the orb takes
 *            light (an ember's warm halo while the page is still light) and the dark opens from
 *            it across the page; a held breath; it bursts, and the
 *            points fly out past their places and settle into the letters "Thank You!". As they
 *            settle the real headline takes over exactly in place: sharp type, a few points still
 *            drifting off it.                                               (plays on arrival)
 *   close    "Thank You!" lifts and makes room; the points leave the letters and flow as a slow
 *            ribbon behind everything; half of them gather once more, into "Q&A", and the real
 *            letters take over; a line of first light, and the contacts settle under it. THE LAST
 *            REST: only the ribbon moves, slowly.
 *
 * THE HAND-OVER FROM SLIDE 6, as the engine runs it (core/director.ts) and what this scene does
 * with it:
 *
 *   1. Next on slide 6's last rest. This scene is mounted AT ONCE, unseen (its layer waits), and
 *      slide 6's layer fades for 0.36 s. The points live on a canvas that is NOT in this scene's
 *      layer but in the stage, under every layer (field.ts): so while slide 6 fades, the same
 *      picture made of points is already standing behind it, and slide 6 turns into them.
 *   2. Slide 6 has gone; the engine now lets the theme change (light to dark: the backdrop's own
 *      directed move, the new theme opening from the middle of the stage) and plays this timeline
 *      from 0. This scene holds that move back with its own `fx.dark` (−1: the backdrop's
 *      darkness is base + fx, so the page stays light, the real one, not a copy of it), and
 *      gives it back on the timeline when the orb takes light: so it is the backdrop's own iris,
 *      from the orb's place, that carries the stage into the dark. No cover, no second ground.
 *      While the page is still light the counter and the pills keep the light page's dress
 *      (`data-page` on `.ir07`, set on the timeline; the rule is in scene.css), and the backdrop
 *      follows the timeline's wish for the dark no faster than a third of a second: a second
 *      press of Next in mid-move is then still an iris, not a cut.
 *   3. Arriving any other way the picture is the same from the first rest on: a hold URL shows
 *      the move exactly as Next plays it; a jump from a dark slide keeps the page dark and lets
 *      the points arrive as light.
 *
 * The points are drawn by one shader from plain numbers the timeline tweens (field.ts); where
 * they stand is measured from laid-out DOM (sample.ts): from this scene's own headline and "Q&A",
 * and from slide 6's own markup, set once more, hidden, in `.ir07-ghost` (never seen: only
 * measured, so whatever slide 6 becomes, its points stand where it does).
 *
 * Without WebGL, and for a visitor who asked for less motion: the same two rests, cross-faded.
 */

import gsap from 'gsap'
import { anim, slide as slideOf, type SceneModule } from '../../kit'
import s06 from '../s06'
import { FOR, MAIL, PEOPLE, QA } from './data'
import { createField, N, type Field, type FieldU } from './field'
import { paint, pick, rng, sheet } from './sample'
import './scene.css'

const Six = s06.Scene

const scene: SceneModule = {
  beats: ['thanks', 'close'],
  chrome: { crumb: false },

  Scene: ({ slide }) => (
    <div className="ir07">
      {/* slide 6's last rest, laid out and never shown: where the points begin (see three()) */}
      <div className="ir07-ghost" aria-hidden="true">
        <Six slide={slideOf(6)} />
      </div>

      <h1 className="ir07-thanks">{slide.title}</h1>

      <p className="ir07-qa" aria-label={QA}>
        {[...QA].map((ch, i) => (
          <span key={i} className={ch === '&' ? 'ir07-amp' : undefined} aria-hidden="true">
            {ch}
          </span>
        ))}
      </p>
      <span className="ir07-dawn" aria-hidden="true" />

      <div className="ir07-contact">
        <div className="ir07-col ir07-col--for">
          <p className="ir07-for">{FOR}</p>
          <p className="ir07-mail">{MAIL}</p>
        </div>
        {PEOPLE.map((p) => (
          <div key={p.name} className="ir07-col ir07-person">
            <b>{p.name}</b>
            <span>{p.role}</span>
          </div>
        ))}
      </div>
    </div>
  ),

  three(ctx) {
    if (ctx.reduced) return
    const stage = ctx.root.closest<HTMLElement>('.kn-stage')
    if (!stage) return
    const box = stage.getBoundingClientRect()
    const rand = rng(20261119)

    // slide 6's last rest: everything of its markup but the chart, which has left by then.
    // (Its SVG ids would be in the document twice: the copy needs none of them.)
    const ghost = ctx.$('.ir07-ghost')
    ghost.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'))
    const page = sheet(box, 12)
    const words = sheet(box, 16)
    const letters = sheet(box, 16)
    if (!page || !words || !letters) return
    paint(page, ghost, { skip: (el) => el.classList.contains('ir06-chart') })
    // the white tiles are large and white on white: a thin dust, so the points go to what is read
    const seed = pick(page, N, rand, (r, g, b) => (r > 238 && g > 238 && b > 238 ? 0.14 : 1))
    paint(words, ctx.$('.ir07-thanks'), { letters: true })
    const text = pick(words, N, rand)
    paint(letters, ctx.$('.ir07-qa'), { letters: true })
    const qa = pick(letters, N, rand)
    if (!seed || !text || !qa) return

    // The page the points begin on. Light: slide 6 is leaving (or a held frame shows that move).
    // Dark: a jump from a dark slide, or a rebuild at a rest: the page stays as it is.
    const root = ctx.root.closest('.kn-root')
    const ink = ctx.held || root?.getAttribute('data-theme') === 'light'
    const behind = ink && !ctx.held && !!stage.querySelector('.kn-scene.kn-ir06')
    ctx.bag.field = createField(ctx, stage, { seed, text, qa }, behind)
    ctx.bag.ink = ink
    ctx.bag.behind = behind
    return (ctx.bag.field as Field).dispose
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const field = ctx.bag.field as Field | undefined
    const hero = ctx.$('.ir07-thanks')
    const qa = ctx.$('.ir07-qa')
    const own = ctx.$('.ir07')
    gsap.set(hero, { autoAlpha: 0, transformOrigin: '50% 50%' })
    gsap.set(qa, { autoAlpha: 0, transformOrigin: '50% 56%' })

    /** "Thank You!" at the close: smaller, at the head of the stage */
    const small = { y: -13.3 * U, scale: 0.66 }
    const WAVE = -0.3
    let C: number

    if (field) {
      const u = field.u
      const to = (k: keyof FieldU, value: number, duration: number, at: number, e = 'power1.inOut') => tl.to(u[k], { value, duration, ease: e }, at)
      const ink = !!ctx.bag.ink

      // ============================================================== thanks
      // What the timeline asks of the page: −1 the light page held, 0 the slide's own dark. The
      // backdrop follows it on every frame, at once when the playhead is PUT somewhere, but never
      // faster than a third of a second for the whole way: so a second press of Next during the
      // move (the engine then jumps to the rest) is still an iris, not a cut from white to navy.
      const page = { dark: 0 }
      if (ink) {
        // the page stays light until the orb takes light (see "the hand-over", 2.)
        page.dark = -1
        gsap.set(fx, { dark: -1 })
        ctx.onSeek(() => {
          fx.dark = page.dark
        })
        field.gl.onFrame((_time, dt) => {
          const step = ctx.held ? 2 : dt / 0.34
          fx.dark += Math.max(-step, Math.min(step, page.dark - fx.dark))
        })
        // … and the chrome keeps its light dress until the dark has reached it (scene.css)
        gsap.set(own, { attr: { 'data-page': 'light' } })
        // … and as quiet as a light page is, while the engine's look glides to the close's
        const quiet = { wave: -0.64, energy: -0.43, glow: -0.15 }
        if (ctx.held) gsap.set(fx, quiet)
        else tl.to(fx, { ...quiet, duration: 0.9, ease: 'power2.out' }, 0)
        // slide 6 is not there to turn into points (a jump): they arrive
        if (!ctx.bag.behind && !ctx.held) {
          u.uIn.value = 0
          to('uIn', 1, 0.5, 0.05, 'power1.out')
        }
      } else {
        u.uHeat.value = 1
        u.uIn.value = 0
        to('uIn', 1, 0.6, 0.05, 'power1.out')
      }

      // loose from slide 6's shapes, and into the orb
      to('uLift', 1, 0.55, 0, 'power2.out')
      to('uGather', 1, 1.2, 0.04, 'none')
      to('uSpin', 5.6, 2.6, 0, 'power2.in')

      // the orb takes light as the last points reach it (on the light page: an ember's warm halo
      // and the orb drawing tighter), and the dark opens from it
      const IGN = 1.0
      if (ink) {
        to('uHalo', 1, 0.55, 0.55, 'power2.out')
        to('uHalo', 0, 0.5, IGN + 0.15, 'power1.in')
      }
      to('uOrbR', 3.0, 0.5, 0.8, 'power2.inOut')
      to('uHeat', 1, 0.36, IGN + 0.2, 'power1.in')
      to('uGlow', 1, 0.6, IGN, 'power2.out')
      if (ink) {
        tl.to(page, { dark: 0, duration: 1.05, ease: 'power1.out' }, IGN)
        tl.set(own, { attr: { 'data-page': 'dark' } }, IGN + 0.72)
        tl.to(fx, { wave: 0, energy: 0, glow: 0.1, duration: 1.2, ease: 'power1.inOut' }, IGN + 0.15)
      } else tl.to(fx, { glow: 0.1, duration: 1.2, ease: 'power1.inOut' }, IGN + 0.15)

      // a held breath: the orb draws in
      to('uOrbR', 2.2, 0.45, 2.15)
      to('uGlow', 0.72, 0.45, 2.15)

      // it bursts: a ring of light leaves it, the points fly out and settle into the letters
      const BURST = 2.6
      to('uBurst', 1, 1.7, BURST, 'power1.out')
      to('uGlow', 1.6, 0.1, BURST, 'power2.out')
      to('uGlow', 0, 1.3, BURST + 0.1, 'power2.out')
      to('uRingA', 0.9, 0.06, BURST, 'none')
      to('uRing', 1, 1.2, BURST, 'power2.out')
      to('uRingA', 0, 1.05, BURST + 0.1, 'power2.out')
      tl.to(fx, { travel: 26, duration: 2.0, ease: 'power3.out' }, BURST)
      tl.to(fx, { glow: 0.02, duration: 1.6, ease: 'power2.out' }, BURST + 0.3)

      // the real headline takes over, exactly in place; a few points drift off it
      tl.to(hero, { autoAlpha: 1, duration: 0.55, ease: 'power1.inOut' }, 3.85)
      to('uTextFade', 1, 0.7, 3.95)
      to('uDrift', 1, 0.75, 3.9, 'power1.out')
      tl.addLabel('thanks', 4.7)

      // ============================================================== close
      C = 4.7
      // the headline makes room; each point shows again as it leaves the place its letter had
      tl.to(hero, { ...small, duration: 1.15, ease: ease.inOut }, C + 0.05)
      to('uRibbon', 1, 1.7, C + 0.1)
      // half of them gather once more
      to('uQa', 1, 1.5, C + 1.15)
      gsap.set(qa, { scale: 1.035 })
      tl.to(qa, { autoAlpha: 1, duration: 0.6, ease: 'power1.inOut' }, C + 2.3)
      tl.to(qa, { scale: 1, duration: 1.6, ease: 'power3.out' }, C + 2.3)
      to('uQaFade', 1, 0.65, C + 2.4)
      tl.to(fx, { travel: 40, glow: 0.08, duration: 3, ease: 'power3.out' }, C + 0.2)
      // the last rest is read for a whole question session: the backdrop's field of points lies low
      tl.to(fx, { wave: WAVE, duration: 2.4, ease: 'power1.inOut' }, C + 0.2)
      C += 2.55
    } else {
      // ============================================================== the calm version
      tl.to(hero, { autoAlpha: 1, duration: 0.8, ease: 'power1.inOut' }, 0.25)
      tl.addLabel('thanks', 1.3)
      C = 1.3
      if (reduced) {
        tl.to(hero, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, C)
        tl.set(hero, small, C + 0.3)
        tl.to(hero, { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }, C + 0.3)
      } else tl.to(hero, { ...small, duration: 1.0, ease: ease.inOut }, C)
      tl.to(qa, { autoAlpha: 1, duration: 0.7, ease: 'power1.inOut' }, C + 0.55)
      tl.to(fx, { wave: WAVE, duration: 0.9, ease: 'power1.inOut' }, C)
      C += 0.9
    }

    // a line of first light, and the contacts settle under it
    a.rule('.ir07-dawn', C, { from: 'center', duration: 1.1 })
    a.rise('.ir07-col', C + 0.15, { y: 1.2, stagger: 0.12 })
    tl.addLabel('close', C + 1.15)
    return tl
  },
}

export default scene
