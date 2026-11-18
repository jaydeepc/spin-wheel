'use client'

/**
 * Slide 24 · "AI now arms the attacker and the defender alike, and cybersecurity sits in the
 * boardroom."
 *
 * THE IDEA: the deck's chess game (orange attacks, navy defends) goes on in three dimensions
 * beside its photograph. The defender's navy king stands on his board in the middle of the
 * stage; the attacks are flame bolts that come out from behind the photograph.
 *
 *   stolen     the headline, the chess photograph, and ₹300 Cr counting up while bolt after
 *              bolt crosses the stage and goes straight through the unprotected king: he rocks.
 *   news       attack, attack, attack: the king gives ground and the three clippings are
 *              pinned one by one (the leap, the playbook, the damage); more bolts now come
 *              down on him from the open air above. NONE comes from the clippings: they name
 *              real organisations, and those are the reporters, not the attackers.
 *   response   the counter-move: a dome of glass rises over the king, panel by panel. From now
 *              on every bolt is turned away, and a ring runs across the glass from where it
 *              struck. Under it the navy card: THE RESPONSE, Project Glasswing.
 *
 * The king, the dome and the bolts are real meshes on a scene-owned canvas (glass.ts). Where
 * there is no WebGL a flat drawing of the king and his dome stands in their place.
 *
 * The photograph is the deck's file, whole, never restyled. The deck's 2 by 2 block of slips is
 * laid out again as one column, so that the living picture has the middle of the stage.
 */

import gsap from 'gsap'
import { anim, Card, Clipping, Count, Headline, Kicker, Pic, pic, Words, type SceneModule } from '../../kit'
import { CLIPS, FOOTNOTE, PHOTO, RESPONSE, STOLEN } from './data'
import { KING_PROFILE, makeGlass, type Glass } from './glass'
import './scene.css'

/** While the right of the stage is still empty the king stands this far (in --u) right of his final place. */
const OPEN = 13.5
/** … and a little larger: he is the only thing on that side. */
const BIG = 1.14

/** The king's outline as a flat path (the fallback where there is no WebGL): his profile, mirrored. */
const KING_PATH = (() => {
  const right = KING_PROFILE.map(([r, y]) => `${r.toFixed(2)} ${(-y).toFixed(2)}`)
  const left = [...KING_PROFILE].reverse().map(([r, y]) => `${(-r).toFixed(2)} ${(-y).toFixed(2)}`)
  return `M${[...right, ...left].join('L')}Z`
})()

const scene: SceneModule = {
  beats: ['stolen', 'news', 'response'],
  preload: [pic(24, PHOTO.name)],

  Scene: ({ slide }) => (
    <div className="s24">
      <Headline text={slide.title} flame={['in the boardroom']} />

      {/* the deck's picture: orange attacks, navy defends */}
      <div className="s24-photo">
        <Pic n={24} name={PHOTO.name} ratio={`${PHOTO.px[0]} / ${PHOTO.px[1]}`} fit="contain" alt="A chess game: orange pieces against navy pieces, a hand moving a navy piece" />
      </div>
      <b className="s24-num">
        <Count to={STOLEN.to} prefix={STOLEN.prefix} suffix={STOLEN.suffix} />
      </b>
      <p className="s24-line">
        <Words text={STOLEN.line} bold={[...STOLEN.bold]} />
      </p>

      {/* only where there is no WebGL: the king and his dome, flat */}
      <svg className="s24-flat" viewBox="-13 -15 26 17" aria-hidden="true">
        <ellipse className="s24-flat-board" cx="0" cy="0.2" rx="12.2" ry="1.5" />
        <g className="s24-flat-king">
          <path d={KING_PATH} />
          <rect x="-0.22" y="-10.4" width="0.44" height="1.5" />
          <rect x="-0.61" y="-10.02" width="1.22" height="0.42" />
        </g>
        <path className="s24-flat-dome" d="M-11 0C-11 -18.4 11 -18.4 11 0" />
      </svg>

      {CLIPS.map((c) => (
        <Clipping key={c.key} className={`s24-clip s24-clip--${c.key}`} date={c.date} tape={c.tape} source={c.source} tilt={c.tilt} width={29}>
          {c.headline}
        </Clipping>
      ))}

      <Card tone="navy" className="s24-answer">
        <Kicker className="s24-answer-k" block>
          {RESPONSE.label}
        </Kicker>
        <h2 className="s24-answer-t">
          <Words text={RESPONSE.title} />
        </h2>
        <p className="s24-answer-p">
          <Words text={RESPONSE.text} bold={[...RESPONSE.bold]} />
        </p>
      </Card>

      <p className="s24-src">{FOOTNOTE}</p>
    </div>
  ),

  three(ctx) {
    const glass = makeGlass(ctx)
    ctx.bag.glass = glass
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      glass.gl.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const glass = ctx.bag.glass as Glass | undefined

    /* =============================================================== stolen */
    a.words('.kn-h', 0.1)
    a.rise('.s24-photo', 0.2, { y: 2, duration: 1.0 })
    const photo = ctx.$('.s24-photo .kn-pic img')
    if (!reduced) {
      // a slow push out of the picture: it settles at its own size, never larger
      gsap.set(photo, { scale: 1.08, transformOrigin: '38% 60%' })
      tl.to(photo, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0.2)
    }
    if (glass) {
      // the king comes up on his board
      const { rig, sim, gl } = glass
      // he begins in the middle of the open stage; the news will push him to his place (below)
      if (!reduced) gsap.set(rig.position, { x: rig.position.x + OPEN })
      gsap.set(gl.canvas, { autoAlpha: 0 })
      tl.to(gl.canvas, { autoAlpha: 1, duration: 0.7, ease: 'power1.out' }, 0.4)
      if (!reduced) {
        const y = rig.position.y
        gsap.set(rig.position, { y: y - 3.5 })
        gsap.set(rig.scale, { x: 1, y: 1, z: 1 })
        tl.to(rig.position, { y, duration: 1.3, ease: ease.out }, 0.55)
        tl.to(rig.scale, { x: BIG, y: BIG, z: BIG, duration: 1.3, ease: ease.out }, 0.55)
      }
      // … and the attacks begin: from the orange side of the board
      tl.to(sim, { attack: 0.667, duration: 1.0, ease: 'power1.in' }, 1.15)
    } else {
      a.rise('.s24-flat-board', 0.6)
      a.rise('.s24-flat-king', 0.75, { y: 2.4 })
    }
    a.rise('.s24-num', 1.0, { y: 2.2 })
    a.count('.s24-num .kn-count-n', 1.1, { duration: 1.6 })
    a.words('.s24-line', 1.55, { stagger: 0.03 })
    a.fade('.s24-src', 2.0)
    tl.to(fx, { glow: 0.3, focusX: -0.3, focusY: 0.05, warm: 0.35, duration: 1.8 }, 0.5)
    tl.addLabel('stolen', 2.9)

    /* ================================================================= news */
    const L = 2.9
    ctx.$$('.s24-clip').forEach((clip, i) => {
      const at = L + 0.05 + i * 0.5
      gsap.set(clip, { autoAlpha: 0, y: reduced ? 0 : -1.5 * U, rotation: reduced ? 0 : i % 2 ? 2.4 : -2.4, transformOrigin: '50% 0%' })
      tl.to(clip, { autoAlpha: 1, duration: 0.22, ease: 'power1.out' }, at)
      tl.to(clip, { y: 0, duration: 0.42, ease: 'power2.in' }, at)
      tl.to(clip, { rotation: i % 2 ? -0.8 : 0.8, duration: 0.15, ease: 'power1.out' }, at + 0.42)
      tl.to(clip, { rotation: 0, duration: 0.5, ease: 'power2.inOut' }, at + 0.57)
    })
    if (glass) {
      // the king gives ground to the news: he moves to the middle, between his attackers
      if (!reduced) {
        tl.to(glass.rig.position, { x: glass.rig.position.x - OPEN, duration: 1.3, ease: ease.inOut }, L)
        tl.to(glass.rig.scale, { x: 1, y: 1, z: 1, duration: 1.3, ease: ease.inOut }, L)
      }
      tl.to(glass.sim, { attack: 1, duration: 1.2, ease: 'none' }, L + 0.6)
    }
    tl.to(fx, { focusX: 0.25, warm: 0.5, energy: 0.2, duration: 1.6, ease: ease.inOut }, L)
    tl.addLabel('news', L + 2.3)

    /* ============================================================= response */
    const M = L + 2.3
    if (glass) {
      tl.to(glass.sim, { rise: 1, duration: 1.25, ease: 'power2.inOut' }, M + 0.1)
      tl.to(glass.sim, { hold: 1, duration: 0.45, ease: 'power1.out' }, M + 0.45)
    } else {
      a.draw('.s24-flat-dome', M + 0.1, { duration: 1.2 })
    }
    a.rise('.s24-answer', M + 0.7, { y: 2.6, duration: 0.9 })
    a.fade('.s24-answer-k', M + 0.8)
    a.words('.s24-answer-t', M + 0.85)
    a.words('.s24-answer-p', M + 1.1, { stagger: 0.025 })
    tl.to(fx, { glow: 0.42, focusX: -0.03, focusY: 0.05, warm: -0.35, energy: 0.05, duration: 1.6, ease: ease.inOut }, M)
    const END = M + 2.5
    tl.addLabel('response', END)

    // the attack's own clock runs with the timeline (the idle loop adds the room's time to it)
    if (glass) tl.to(glass.sim, { clock: END * 0.7, duration: END, ease: 'none' }, 0)
    return tl
  },
}

export default scene
