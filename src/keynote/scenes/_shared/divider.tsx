'use client'

/**
 * THE SECTION DIVIDER. The deck opens each section with one big line on a quiet page (slides
 * 9, 15, 26, 31 and 55). Here that page says where we are as well:
 *
 *   left    the agenda in small, every part in its own words (deck.ts → AGENDA). A light runs down its thread
 *           from the section we are leaving to the one we are entering, and that row lights up.
 *           (The chrome's rail at the top moves on at the same moment.)
 *   right   the slide's own line, large, word by word; behind it the section's letter, very
 *           large, in outline, swinging round in depth.
 *   over it THE AGENDA'S OBJECT COMES BACK: the block of glass that carried this chapter's letter
 *           on slide 02 (scenes/s02/monolith.ts: the same glass, the same navy plate, the same
 *           studio) flies in out of the depth of the room as the camera rushes to meet it, and
 *           comes to stand over the line; the navy rises through it behind its line of flame and
 *           the letter is there. Real three.js on a canvas of the scene's own; where there is no
 *           WebGL a flat tile stands in its place.
 *   behind  the backdrop's strong moment: the camera rushes forward through the particles and
 *           swings to face the new section, and a light opens behind the line.
 *
 * One beat. A scene folder uses it in two lines:
 *
 *   import { divider } from '../_shared/divider'
 *   export default divider(15)
 *   export default divider(55, { sub: { text: 'The Tech & People behind our AI', flame: ['The', '&', 'behind our AI'], azure: ['People'] } })
 */

import gsap from 'gsap'
import { AGENDA, section as sectionOf, slide as slideOf } from '../../deck'
import type { SceneModule } from '../../core/types'
import { anim } from '../../kit/anim'
import { Words, type WordsProps } from '../../kit/text'
import { createSceneCanvas, type SceneCanvas } from '../../three/sceneCanvas'
import { makeStudio, MW, type MonoBuilt, type Studio } from '../s02/monolith'
import './divider.css'

/** What three() hands to build(). */
interface Glass {
  gl: SceneCanvas
  studio: Studio
  mono: MonoBuilt
  /** How much the block floats while the room waits: the timeline brings it up when the block has landed. */
  idle: { amp: number }
}

export interface DividerOptions {
  /** The slide's second line, if it has one, exact. */
  sub?: WordsProps & { italic?: boolean }
}

export function divider(n: number, opts: DividerOptions = {}): SceneModule {
  const s = slideOf(n)
  const sec = sectionOf(s.section)
  const at = sec ? AGENDA.findIndex((a) => a.letter === sec.letter) : 0
  const from = Math.max(0, at - 1)
  const letter = sec?.letter ?? ''

  return {
    beats: ['title'],

    Scene: () => (
      <div className="kn-div" data-theme={s.theme}>
        <div className="kn-div-giant" aria-hidden="true">
          <div className="kn-div-letter">
            <span>{letter}</span>
            <span>{letter}</span>
            <span>{letter}</span>
            <span>{letter}</span>
          </div>
        </div>

        <ol className="kn-div-agenda" aria-label="Agenda">
          <span className="kn-div-thread" aria-hidden="true" />
          <span className="kn-div-spark" aria-hidden="true" />
          {AGENDA.map((a, i) => (
            <li key={a.letter} className="kn-div-row" data-on={i === at ? 1 : 0} data-done={i < at ? 1 : 0}>
              <span className="kn-div-dot">
                <span className="kn-div-dot-on" />
                <b>{a.letter}</b>
              </span>
              <span className="kn-div-name">
                {a.name}
                {i === at ? <span className="kn-div-name-on">{a.name}</span> : null}
              </span>
            </li>
          ))}
        </ol>

        <div className="kn-div-main">
          <span className="kn-div-slot" aria-hidden="true">
            <span className="kn-div-key">{letter}</span>
          </span>
          <h1 className="kn-div-title">
            <Words text={s.title} flame={[s.title]} />
          </h1>
          {opts.sub ? (
            <p className="kn-div-sub" data-italic={opts.sub.italic ? 1 : 0}>
              <Words text={opts.sub.text} flame={opts.sub.flame} azure={opts.sub.azure} />
            </p>
          ) : null}
          <span className="kn-div-rule" aria-hidden="true" />
        </div>
      </div>
    ),

    three(ctx) {
      const gl = createSceneCanvas(ctx, { fov: 32, lights: false })
      const studio = makeStudio(gl, s.theme)
      const mono = studio.mono({ letter, family: getComputedStyle(ctx.root).fontFamily })
      gl.scene.add(mono.group)
      const idle = { amp: 0 }
      const still = ctx.held || ctx.reduced
      gl.onFrame((time) => {
        const t = still ? 0 : time
        mono.body.position.y = Math.sin(t * 0.7) * 0.22 * idle.amp
        mono.body.rotation.y = Math.sin(t * 0.43 + 1) * 0.07 * idle.amp
        mono.body.rotation.x = Math.cos(t * 0.37) * 0.035 * idle.amp
      })
      const glass: Glass = { gl, studio, mono, idle }
      ctx.bag.glass = glass
      ctx.root.dataset.gl = '1'
      return () => {
        delete ctx.root.dataset.gl
        studio.dispose()
        gl.dispose()
      }
    },

    build(ctx) {
      const { U, ease, reduced } = ctx
      const tl = ctx.timeline()
      const a = anim(ctx, tl)
      const fx = ctx.backdrop.fx
      const glass = ctx.bag.glass as Glass | undefined
      // where the block comes to stand: measured before anything is hidden
      const slot = ctx.loc(ctx.$('.kn-div-slot'))
      const rows = ctx.$$('.kn-div-row')
      const dots = ctx.$$('.kn-div-dot').map((el) => ctx.loc(el))
      const agenda = ctx.loc(ctx.$('.kn-div-agenda'))
      const spark = ctx.$('.kn-div-spark')
      const here = rows[at]

      // THE BACKDROP'S MOMENT: a rush forward, a swing of the camera, a light behind the line
      gsap.set(fx, { yaw: reduced ? 0 : 0.16, pitch: reduced ? 0 : -0.05, glow: -0.2 })
      tl.to(fx, { travel: reduced ? 0 : 78, duration: 2.8, ease: 'power3.out' }, 0)
      tl.to(fx, { yaw: 0, pitch: 0, duration: 2.6, ease: 'power3.out' }, 0)
      tl.to(fx, { glow: 0.5, focusX: 0.3, focusY: 0.02, energy: 0.3, wave: 0.12, duration: 2.2, ease: 'power2.out' }, 0.15)

      // the agenda, quietly
      a.rule('.kn-div-thread', 0.15, { from: 'top', duration: 1.0 })
      a.rise(rows, 0.2, { y: 0.9, stagger: 0.045, duration: 0.7 })

      // the light runs from the section we leave to the one we enter
      const y0 = dots[from].cy - agenda.y
      const y1 = dots[at].cy - agenda.y
      gsap.set(spark, { x: dots[at].cx - agenda.x, y: y0, autoAlpha: 0, scale: 0.4 })
      tl.to(spark, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 0.75)
      tl.to(spark, { y: y1, duration: at === from ? 0.01 : 0.75, ease: ease.inOut }, 0.85)
      tl.to(spark, { scale: 2.6, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, 1.55)
      // … and that row lights up
      const on = here.querySelector('.kn-div-dot-on')
      const nameOn = here.querySelector('.kn-div-name-on')
      gsap.set(on, { scale: 0, autoAlpha: 0 })
      gsap.set(nameOn, { autoAlpha: 0 })
      gsap.set(here.querySelector('b'), { color: 'inherit' })
      tl.to(on, { scale: 1, autoAlpha: 1, duration: 0.6, ease: ease.snap }, 1.5)
      tl.to(here.querySelector('b'), { color: '#ffffff', duration: 0.25 }, 1.5)
      tl.to(nameOn, { autoAlpha: 1, duration: 0.45 }, 1.5)
      tl.to(here, { x: U * 0.5, duration: 0.7, ease: ease.out }, 1.5)

      // the letter, very large, swings round in depth
      const big = ctx.$('.kn-div-letter')
      gsap.set(big, { rotationY: reduced ? -18 : -78, rotationX: 6, x: U * 14, autoAlpha: 0, transformOrigin: '50% 50%' })
      tl.to(big, { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, 0.35)
      tl.to(big, { rotationY: -18, rotationX: 2, x: 0, duration: 2.5, ease: 'power3.out' }, 0.35)

      // THE BLOCK OF GLASS: out of the depth of the room, turning, to its place over the line
      if (glass) {
        const { mono, idle, gl } = glass
        const p = gl.at(slot.cx / U, slot.cy / U, 0)
        const k = slot.w / U / MW
        // at rest it is turned a little: a block, not a card
        const REST = { x: 0.07, y: -0.3, z: 0 }
        gsap.set(idle, { amp: 0 })
        gsap.set(mono.group.scale, { x: k, y: k, z: k })
        if (reduced) {
          gsap.set(mono.group.position, { x: p.x, y: p.y, z: p.z })
          gsap.set(mono.group.rotation, REST)
          mono.fill = 1
          mono.lit = 0.2
        } else {
          mono.fill = 0
          mono.lit = 0
          gsap.set(mono.group.position, { x: p.x + 46, y: p.y - 13, z: -330 })
          gsap.set(mono.group.rotation, { x: 0.5, y: -1.05, z: 0.18 })
          tl.to(mono.group.position, { x: p.x, y: p.y, z: 0, duration: 2.0, ease: 'power3.out' }, 0.2)
          tl.to(mono.group.rotation, { ...REST, duration: 2.3, ease: 'power3.out' }, 0.2)
          // the navy rises through it as it arrives, and the letter is there
          tl.to(mono, { fill: 1, duration: 1.0, ease: 'power2.inOut' }, 1.0)
          tl.to(mono, { lit: 1, duration: 0.3, ease: 'power2.out' }, 1.75)
          tl.to(mono, { lit: 0.2, duration: 0.9, ease: 'power2.inOut' }, 2.05)
          tl.to(idle, { amp: 1, duration: 0.9, ease: 'power1.inOut' }, 2.2)
        }
      } else {
        a.pop('.kn-div-key', 1.0)
      }

      // the line itself
      a.words('.kn-div-title', 0.95, { stagger: 0.09, duration: 1.05 })
      a.rule('.kn-div-rule', 1.5, { duration: 1.0 })
      if (ctx.root.querySelector('.kn-div-sub')) a.words('.kn-div-sub', 1.65, { stagger: 0.045, duration: 0.8 })

      tl.addLabel('title', 3.1)
      return tl
    },
  }
}
