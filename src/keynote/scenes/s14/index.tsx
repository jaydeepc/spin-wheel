'use client'

/**
 * Slide 14 · "3 · BUILDING – is our EDGE."
 *
 * The slide's word is BUILDING, so something is built while it is said. Every line of "we
 * build" becomes a tier of one structure at the right of the stage; what "we buy" is slid in
 * UNDER it, grey and alike; and "where it leads" happens to that structure.
 *
 *   strategy   the headline, WE BUILD, the plot where the structure will stand; the first row's
 *              block lifts off its icon, turns once in the room and sets down, and the row's
 *              words are written in its wake
 *   models     the second tier, a little smaller, on a seam of flame
 *   platform   the third
 *   team       the fourth: the structure stands, and begins to sway very slightly
 *   buy        the plus; WE BUY, quiet and grey; the structure rises and three plain slabs slide
 *              in under it from outside: GPU, Cloud, LLMs. It settles on them.
 *   leads      the line of "where it leads" draws through its three dots to the glowing end,
 *              which lies under the structure: a moat draws round it (AI Moats), the next two
 *              tiers appear in outline above it (Evolving & Compounding), a light opens at the
 *              top (Creating Capability)
 *
 * The structure is real meshes (works.ts). Without WebGL the lists and the line tell the same
 * thing by themselves; nothing is missing from the words.
 *
 * AS THE DECK HAS IT: "Our own Team" ends "Skilled, close to the latest research," on a comma
 * (the deck's line is cut there); it is shown as it is. The deck's hidden leftover "The
 * commitment" is not shown.
 */

import gsap from 'gsap'
import { anim, Headline, Words, type SceneModule } from '../../kit'
import { BUILD, BUILD_KICKER, BUY, BUY_KICKER, DROP, EARLY, FLAME, LEADS_KICKER, PLUS, SITE, STEPS, TRACK } from './data'
import { Icon } from './icons'
import { makeWorks, RAISE, TIER, TILT, TURN, type Works } from './works'
import './scene.css'

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`

const scene: SceneModule = {
  beats: [...BUILD.map((r) => r.key), 'buy', 'leads'],

  Scene: ({ slide }) => (
    <div className="s14">
      <Headline text={slide.title} flame={FLAME} />

      {/* the two lists: they stand a little lower until "where it leads" comes in under them */}
      <div className="s14-upper">
        <span className="s14-kick s14-kick--build">{BUILD_KICKER}</span>
        {BUILD.map((r) => (
          <div className={`s14-row s14-row--${r.key}`} key={r.key}>
            <span className="s14-disc">
              <Icon name={r.icon} />
            </span>
            <div>
              <p className="s14-row-t">
                <Words text={r.title} flame={r.flame} />
              </p>
              {r.lines.map((line) => (
                <span className="s14-row-s" key={line}>
                  {line}
                </span>
              ))}
            </div>
          </div>
        ))}

        <span className="s14-plus" role="img" aria-label={PLUS} />

        <span className="s14-kick s14-kick--buy">{BUY_KICKER}</span>
        {BUY.map((r, j) => (
          <div className={`s14-buy s14-buy--${j}`} key={r.title}>
            <span className="s14-buy-disc">
              <Icon name={r.icon} />
            </span>
            <div>
              <b className="s14-buy-t">{r.title}</b>
              <span className="s14-buy-s">{r.line}</span>
            </div>
          </div>
        ))}
      </div>

      <span className="s14-kick s14-kick--leads">{LEADS_KICKER}</span>
      <span className="s14-track" aria-hidden="true" style={{ left: u(TRACK.x0), width: u(TRACK.x1 - TRACK.x0) }} />
      {STEPS.map((s, i) => (
        <div className={`s14-step s14-step--${i}`} key={s.title} style={{ left: u(TRACK.x0 + s.at * (TRACK.x1 - TRACK.x0)) }}>
          <i className="s14-dot" aria-hidden="true" />
          <p className="s14-step-t">
            <Words text={s.title} flame={s.flame} />
          </p>
          <span className="s14-step-s">
            {s.lines.map((line) => (
              <span key={line}>{s.strong ? <Words text={line} flame={s.strong} bold={s.strong} /> : line}</span>
            ))}
          </span>
        </div>
      ))}
      <span className="s14-end" aria-hidden="true" style={{ left: u(TRACK.x1) }}>
        <i className="s14-end-halo" />
        <i className="s14-end-core" />
      </span>
    </div>
  ),

  three(ctx) {
    const works = makeWorks(
      ctx,
      BUILD.map((r) => r.icon),
      BUY.map((r) => r.icon),
    )
    ctx.bag.works = works
    return works.dispose
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const works = ctx.bag.works as Works | undefined
    const rows = ctx.$$('.s14-row')
    const q = (el: Element, sel: string) => Array.from(el.querySelectorAll(sel))
    // measured before anything is hidden: where each block lifts off
    const discs = rows.map((r) => ctx.loc(r.querySelector('.s14-disc') as Element))

    /* ---- hidden states ---- */
    const allDiscs = ctx.$$('.s14-disc')
    gsap.set(allDiscs, { autoAlpha: 0, scale: 0.6 })
    gsap.set(ctx.$$('.s14-ink'), { drawSVG: '0%', autoAlpha: 0 })
    const upper = ctx.$('.s14-upper')
    gsap.set(upper, { y: DROP * U })
    if (works) {
      works.site.position.y = -DROP
      // while it is built it has the stage: larger, nearer the middle (it steps aside at "buy")
      works.rig.position.copy(works.gl.at(EARLY.x, EARLY.ground))
      works.rig.scale.setScalar(EARLY.scale)
      works.plan.forEach((p) => (p.opacity = 0))
      works.plot.opacity = 0
      works.idle.amp = 0
      works.tiers.forEach((t, i) => {
        t.opacity = 0
        t.glow = i === 0 ? 0 : 1
      })
      works.slabs.forEach((s) => (s.opacity = 0))
    }

    /* ---- the headline, WE BUILD, the four places, the plot ---- */
    a.words('.kn-h', 0.1)
    a.rise('.s14-kick--build', 0.45, { y: 0.8 })
    tl.to(
      allDiscs,
      {
        autoAlpha: 0.5,
        scale: 0.86,
        duration: 0.6,
        stagger: 0.08,
        ease: ease.out,
      },
      0.55,
    )
    if (works) {
      tl.to(works.plot, { opacity: 1, duration: 0.9, ease: 'power1.out' }, 0.5)
      // the plan: the four tiers in outline, from the ground up
      tl.to(works.plan, { opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power1.out' }, 0.7)
    }
    tl.to(fx, { glow: 0.24, focusX: 0.72, focusY: 0.1, warm: 0.2, duration: 1.6 }, 0.3)

    /** Row i lands at time t: its icon, its words, and its block flies to the structure. Returns its rest. */
    const land = (i: number, t: number): number => {
      const row = rows[i]
      tl.to(allDiscs[i], { autoAlpha: 1, scale: 1, duration: 0.55, ease: ease.snap }, t)
      const ink = q(row, '.s14-ink')
      tl.to(ink, { autoAlpha: 1, duration: 0.01, stagger: 0.05, ease: 'none' }, t + 0.1)
      tl.to(ink, { drawSVG: '100%', duration: 0.7, stagger: 0.05, ease: ease.glide }, t + 0.1)
      // the block leaves its icon FIRST and the row's words are written in its wake, so that it
      // never passes over words that are being read
      const wake = works && !reduced ? 0.6 : 0
      a.words(row.querySelector('.s14-row-t'), t + 0.15 + wake)
      a.rise(q(row, '.s14-row-s'), t + 0.45 + wake, { y: 0.7, stagger: 0.1 })
      if (!works) return t + 1.4

      const piece = works.tiers[i]
      const g = piece.group
      const at = t + 0.3
      const D = 1.5
      // its outline in the plan goes as it is built
      tl.to(works.plan[i], { opacity: 0, duration: 0.5, ease: 'power1.in' }, at + (reduced ? 0 : D - 0.45))
      if (reduced) {
        tl.to(piece, { opacity: 1, duration: 0.5, ease: 'power1.out' }, at)
        return t + 1.4
      }
      // it starts on its icon, flat to the room and small; it turns once on the way
      // (the lists stand DROP lower than they were measured, and the site with them)
      const from = works.local(discs[i].cx / U, discs[i].cy / U + DROP, 0.6)
      const s0 = ((discs[i].w / U / TIER.w[i]) * 0.55) / EARLY.scale
      gsap.set(g.position, { x: from.x, y: from.y, z: from.z })
      gsap.set(g.rotation, { x: -TILT, y: -TURN + Math.PI * 2, z: 0 })
      gsap.set(g.scale, { x: s0, y: s0, z: s0 })
      tl.to(piece, { opacity: 1, duration: 0.25, ease: 'power1.out' }, at)
      // it lifts off its icon first, then goes
      tl.to(g.scale, { x: s0 * 1.5, y: s0 * 1.5, z: s0 * 1.5, duration: 0.4, ease: 'power2.out' }, at)
      tl.to(g.scale, { x: 1, y: 1, z: 1, duration: D - 0.3, ease: ease.inOut }, at + 0.3)
      tl.to(g.rotation, { x: 0, y: 0, duration: D - 0.2, ease: ease.inOut }, at + 0.2)
      // across the stage and a little toward the room, then down onto the tier below
      const over = piece.slot.clone().addScaledVector(works.toRoom, 9)
      over.y += 3.2
      tl.to(g.position, { x: over.x, z: over.z, duration: D * 0.72 - 0.25, ease: 'power3.inOut' }, at + 0.25)
      tl.to(g.position, { y: over.y, duration: D * 0.72 - 0.25, ease: 'power2.inOut' }, at + 0.25)
      tl.to(
        g.position,
        {
          x: piece.slot.x,
          y: piece.slot.y,
          z: piece.slot.z,
          duration: D * 0.42,
          ease: 'power2.inOut',
        },
        at + D * 0.6,
      )
      // it lands: the tier under it answers, its own seam flares
      if (i > 0) {
        tl.to(piece, { glow: 2.4, duration: 0.2, ease: 'power2.out' }, at + D - 0.06)
        tl.to(piece, { glow: 1, duration: 0.7, ease: 'power2.inOut' }, at + D + 0.14)
      }
      tl.to(fx, { glow: 0.3, focusY: 0.2 - i * 0.12, duration: 1.2, ease: ease.inOut }, at)
      return at + D + 0.35
    }

    let t = 1.0
    BUILD.forEach((r, i) => {
      // the rows wait their turn a little dimmer; each comes fully in as it lands
      t = land(i, t)
      tl.addLabel(r.key, t)
    })
    // the structure stands: from here it sways, very slightly
    if (works && !reduced) tl.to(works.idle, { amp: 1, duration: 0.5, ease: 'power1.inOut' }, t - 0.5)

    /* -------------------------------------------------------------- buy */
    const B = t
    const plus = ctx.$('.s14-plus')
    gsap.set(plus, { autoAlpha: 0, scale: 0.3, rotation: reduced ? 0 : -90 })
    tl.to(plus, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: ease.snap }, B)
    // the structure steps aside, to where it will stay, and WE BUY takes the room it leaves
    const K = works ? 0.45 : 0
    if (works) {
      const home = works.gl.at(SITE.x, SITE.ground)
      tl.to(works.rig.position, { x: home.x, y: home.y, z: home.z, duration: 1.1, ease: ease.inOut }, B)
      tl.to(works.rig.scale, { x: SITE.scale, y: SITE.scale, z: SITE.scale, duration: 1.1, ease: ease.inOut }, B)
    }
    a.rise('.s14-kick--buy', B + 0.25 + K, { y: 0.8 })
    const buys = ctx.$$('.s14-buy')
    a.rise(buys, B + 0.4 + K, { y: 0, x: 1.8, stagger: 0.14 })
    buys.forEach((row, j) => {
      const ink = q(row, '.s14-ink')
      tl.to(ink, { autoAlpha: 1, duration: 0.01, stagger: 0.05, ease: 'none' }, B + 0.55 + K + j * 0.14)
      tl.to(ink, { drawSVG: '100%', duration: 0.6, stagger: 0.05, ease: ease.glide }, B + 0.55 + K + j * 0.14)
    })
    tl.to(fx, { warm: -0.1, focusX: 0.5, glow: 0.22, duration: 1.4, ease: ease.inOut }, B)
    let rest = B + 1.6
    if (works) {
      // the structure rises; three plain slabs come in under it from outside the stage; it settles on them
      tl.to(works.stack.position, { y: RAISE + 0.9, duration: 0.8, ease: ease.inOut }, B + 0.3 + K)
      works.slabs.forEach((s, j) => {
        const at = B + 0.7 + K + j * 0.13
        if (!reduced) gsap.set(s.group.position, { x: s.slot.x + 15 })
        tl.to(s, { opacity: 1, duration: 0.35, ease: 'power1.out' }, at)
        tl.to(s.group.position, { x: s.slot.x, duration: 1.0, ease: ease.out }, at)
      })
      tl.to(works.stack.position, { y: RAISE, duration: 0.5, ease: 'power2.in' }, B + 1.75 + K)
      tl.to(works.tiers[0], { glow: 2.2, duration: 0.2, ease: 'power2.out' }, B + 2.2 + K)
      tl.to(works.tiers[0], { glow: 1, duration: 0.7, ease: 'power2.inOut' }, B + 2.4 + K)
      rest = B + 2.75 + K
    }
    tl.addLabel('buy', rest)

    /* ------------------------------------------------------------ leads */
    // the lists and the structure make room: they rise as one
    const R = rest
    tl.to(upper, { y: 0, duration: 0.9, ease: ease.inOut }, R)
    if (works) {
      tl.to(works.site.position, { y: 0, duration: 0.9, ease: ease.inOut }, R)
      tl.to(works.plot, { opacity: 0.55, duration: 0.9 }, R)
    }
    const W = R + 0.45
    a.rise('.s14-kick--leads', W, { y: 0.8 })
    const track = ctx.$('.s14-track')
    gsap.set(track, { scaleX: 0, transformOrigin: '0% 50%' })
    const steps = ctx.$$('.s14-step')
    const SEG = 0.64
    let at = W + 0.3
    const when: number[] = []
    STEPS.forEach((s, i) => {
      if (i > 0) {
        tl.to(track, { scaleX: s.at, duration: SEG, ease: ease.glide }, at)
        at += SEG - 0.08
      }
      when.push(at)
      a.pop(steps[i].querySelector('.s14-dot'), at, { from: 0.2 })
      a.words(steps[i].querySelector('.s14-step-t'), at + 0.08)
      a.rise(q(steps[i], '.s14-step-s > span'), at + 0.32, {
        y: 0.7,
        stagger: 0.09,
      })
      at += 0.22
    })
    // on to the end of the line, which glows
    tl.to(track, { scaleX: 1, duration: SEG, ease: ease.glide }, at)
    const end = at + SEG - 0.1
    a.pop('.s14-end-core', end, { from: 0.2 })
    const halo = ctx.$('.s14-end-halo')
    gsap.set(halo, { autoAlpha: 0, scale: 0.4 })
    tl.to(halo, { autoAlpha: 1, scale: 1.25, duration: 0.9, ease: ease.out }, end + 0.05)
    tl.to(
      fx,
      {
        focusX: 0.78,
        focusY: 0.1,
        glow: 0.5,
        warm: 0.5,
        duration: 1.6,
        ease: ease.inOut,
      },
      end - 0.6,
    )
    if (works) {
      // AI Moats: the moat draws round it
      tl.to(works.moat, { drawn: 1, duration: 1.3, ease: 'power2.inOut' }, when[0] + 0.1)
      // Evolving & Compounding: the seams burn up from the ground, and the next two tiers appear in outline
      works.tiers.forEach((p, i) => {
        tl.to(p, { glow: 2.6, duration: 0.3, ease: 'power2.out' }, when[1] + i * 0.12)
        tl.to(p, { glow: 1.5, duration: 0.8, ease: 'power2.inOut' }, when[1] + 0.3 + i * 0.12)
      })
      works.next.forEach((n, k) => {
        tl.to(n, { opacity: 1, duration: 0.5, ease: 'power1.out' }, when[1] + 0.45 + k * 0.22)
        tl.to(n, { risen: 1, duration: 0.9, ease: ease.out }, when[1] + 0.45 + k * 0.22)
      })
      // Creating Capability: the light at the top
      tl.to(works.light, { on: 1.25, duration: 0.45, ease: 'power2.out' }, end)
      tl.to(works.light, { on: 1, duration: 0.6, ease: 'power2.inOut' }, end + 0.45)
    }
    tl.addLabel('leads', end + 1.0)
    return tl
  },
}

export default scene
