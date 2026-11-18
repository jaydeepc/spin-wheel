'use client'

/**
 * The moves of the outcomes diagram, shared by slides 8 and 32. A scene asks for the rig once in
 * build() (everything of the diagram is then hidden) and composes its beats from these:
 *
 *   hub(t)          the white disc arrives (slide 8 first shows it large, in the middle: `hero`)
 *   settle(t)       … and goes up to its place
 *   bloom(i, t)     slide 8: the light walks the ring to badge i, the badge lands, the petal comes
 *                   out from under the disc and opens like a petal does, its words rise
 *   fan(t)          slide 32: the five petals open as one fan from the bottom of the disc
 *   pass(i, t)      slide 32: the light reaches petal i; it answers, and its story's tag appears
 *   begin(i, t)     slide 32: petal i comes forward, the others stand back
 *
 * Every move returns the time at which it rests. With WebGL the petals are meshes (petals.ts);
 * without, the flat petals of the DOM do the same in two dimensions.
 */

import gsap from 'gsap'
import { anim, type SceneCtx } from '../../../kit'
import { DISC, OUTCOMES } from './data'
import { makePetals, type Petals } from './petals'

/** The three() hook of both slides. Where there is no WebGL it ends quietly and the DOM tells the story. */
export function outcomesThree(ctx: SceneCtx): () => void {
  const set = makePetals(ctx)
  ctx.bag.outcomes = set
  ctx.root.dataset.gl = '1'
  return () => {
    delete ctx.root.dataset.gl
    set.dispose()
  }
}

/** How far the disc's centre is from the middle of the stage, in --u: the hero pose of slide 8. */
const HERO_Y = 28.125 - DISC.cy + 0.6
const HERO_SCALE = 0.8

export function outcomesRig(ctx: SceneCtx, tl: gsap.core.Timeline) {
  const { U, ease, reduced } = ctx
  const a = anim(ctx, tl)
  const fx = ctx.backdrop.fx
  const set = ctx.bag.outcomes as Petals | undefined

  const hubEl = ctx.$('.oc-hub')
  const title = ctx.$('.oc-title')
  const spark = ctx.$<SVGGElement>('.oc-spark')
  const arcs = ctx.$$<SVGPathElement>('.oc-arc')
  const seeds = ctx.$$<SVGCircleElement>('.oc-seed')
  const flats = ctx.$$<SVGPathElement>('.oc-flat-petal')
  const ghosts = ctx.$$<SVGPathElement>('.oc-ghost')
  const items = ctx.$$('.oc-item').map((el, i) => {
    const q = <E extends Element = HTMLElement>(s: string) => Array.from(el.querySelectorAll<E>(s))
    return {
      o: OUTCOMES[i],
      badge: q('.oc-badge'),
      halo: q('.oc-halo'),
      ink: q<SVGElement>('.oc-ink'),
      dots: q<SVGElement>('.oc-dot'),
      words: q('.oc-label .kn-wi'),
      group: q('.oc-words'),
      tag: q('.oc-tag'),
      go: q<SVGElement>('.oc-tag-go'),
      arc: arcs[i],
      seed: seeds[i],
      flat: flats[i],
      ghost: ghosts[i],
      petal: set?.petals[i],
    }
  })
  const A0 = OUTCOMES[0].angle
  /** gsap.set / tl.to that say nothing when there is nothing to move (a petal without a tag, an icon without dots). */
  const put = (targets: Element[], vars: gsap.TweenVars) => {
    if (targets.length) gsap.set(targets, vars)
  }
  const to = (targets: Element[], vars: gsap.TweenVars, at: number) => {
    if (targets.length) tl.to(targets, vars, at)
  }
  // measured before anything is moved: how far the title is from the middle of the hero disc
  const heroTitle = (DISC.cy + HERO_Y) * U - ctx.loc(title).cy

  /* ------------------------------------------------ everything starts hidden */
  gsap.set(hubEl, { autoAlpha: 0, transformOrigin: '50% 50%' })
  gsap.set(arcs, { drawSVG: '0%', autoAlpha: 0 })
  gsap.set(seeds, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
  gsap.set(ghosts, { autoAlpha: 0 })
  // the spark stands at the first badge's angle; it is turned about the disc's centre from there
  gsap.set(spark, { autoAlpha: 0, rotation: 20, svgOrigin: '0 0' })
  for (const it of items) {
    gsap.set(it.badge, { autoAlpha: 0, scale: reduced ? 1 : 0.3 })
    gsap.set(it.halo, { autoAlpha: 0 })
    put(it.ink, { drawSVG: '0%', autoAlpha: 0 })
    put(it.dots, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
    gsap.set(it.words, reduced ? { autoAlpha: 0 } : { yPercent: 118 })
    put(it.tag, { autoAlpha: 0, y: reduced ? 0 : U * 0.9 })
    gsap.set(it.flat, { autoAlpha: 0, scale: reduced ? 1 : 0.6, svgOrigin: `${it.o.badge[0]} ${it.o.badge[1]}` })
    if (it.petal) Object.assign(it.petal.s, { opacity: 0, slide: 0, tilt: 0, twist: 0, fan: 0, back: 0, scale: 1, lit: 0, dim: 0 })
  }
  if (set) {
    gsap.set(set.idle, { amp: 1 })
    gsap.set(set.lamp, { x: OUTCOMES[0].centroid[0], y: OUTCOMES[0].centroid[1], power: 0 })
  }

  /** Where the backdrop's light sits for petal i. */
  const focus = (i: number) => ({ focusX: ((OUTCOMES[i].centroid[0] - 50) / 50) * 0.9, focusY: ((OUTCOMES[i].centroid[1] - 28.125) / 28.125) * 0.8 })

  /** A ring leaves badge i. */
  const ripple = (i: number, t: number) => {
    if (reduced) return
    const halo = items[i].halo
    tl.set(halo, { scale: 1, autoAlpha: 0.9 }, t)
    tl.to(halo, { scale: 1.9, autoAlpha: 0, duration: 0.95, ease: 'power2.out' }, t)
  }

  /** Badge i lands on the ring and draws its icon; the words of its petal rise `wordsAfter` later. */
  const land = (i: number, t: number, wordsAfter: number) => {
    const it = items[i]
    tl.to(it.badge, { autoAlpha: 1, scale: 1, duration: 0.6, ease: ease.snap }, t)
    tl.to(it.ink, { autoAlpha: 1, duration: 0.01, stagger: 0.05, ease: 'none' }, t + 0.18)
    tl.to(it.ink, { drawSVG: '100%', duration: 0.7, stagger: 0.05, ease: ease.glide }, t + 0.18)
    to(it.dots, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: ease.snap }, t + 0.6)
    if (reduced) tl.to(it.words, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, t + wordsAfter)
    else tl.to(it.words, { yPercent: 0, duration: ctx.T.word, stagger: 0.07, ease: ease.out }, t + wordsAfter)
  }

  /** The light walks the ring to badge i, drawing the ring's line behind it. */
  const walk = (i: number, t: number, d: number) => {
    const it = items[i]
    tl.to(it.arc, { autoAlpha: 1, duration: 0.01, ease: 'none' }, t)
    tl.to(it.arc, { drawSVG: '100%', duration: d, ease: ease.glide }, t)
    if (reduced) return
    tl.to(spark, { autoAlpha: 1, duration: 0.15, ease: 'power1.out' }, t)
    tl.to(spark, { rotation: it.o.angle - A0, duration: d, ease: ease.glide }, t)
    tl.to(spark, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, t + d - 0.08)
  }

  return {
    set,
    items,
    ripple,

    /**
     * The disc arrives. `hero`: large-hearted, in the middle of the stage, the title in it, five
     * seeds on its ring (slide 8's first rest). Otherwise at its place, at once.
     */
    hub(t: number, o: { hero?: boolean } = {}): number {
      // (slide 32 follows a dark divider: it calls this late enough for the stage to be light,
      //  so the white disc is never seen as a grey plate over navy)
      if (o.hero) {
        gsap.set(hubEl, { y: U * HERO_Y, scale: reduced ? HERO_SCALE : HERO_SCALE * 0.9 })
        // the title is part of the disc: it is as much smaller as the disc is, and grows with it
        gsap.set(title, { y: heroTitle, scale: HERO_SCALE, transformOrigin: '50% 50%' })
        tl.to(hubEl, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, t)
        tl.to(hubEl, { scale: HERO_SCALE, duration: 1.5, ease: 'power3.out' }, t)
        a.words(title, t + 0.35, { duration: 0.9, stagger: 0.07 })
        tl.to(seeds, { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.09, ease: ease.snap }, t + 1.05)
        tl.to(fx, { glow: 0.3, focusX: 0, focusY: 0.05, warm: 0.1, duration: 1.8, ease: 'power2.out' }, t)
        return t + 1.95
      }
      gsap.set(hubEl, { scale: reduced ? 1 : 0.93 })
      tl.to(hubEl, { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }, t)
      tl.to(hubEl, { scale: 1, duration: 1.3, ease: 'power3.out' }, t)
      a.words(title, t + 0.2, { duration: 0.85, stagger: 0.06 })
      return t + 1.1
    },

    /**
     * The disc goes up to its place (after `hub(t, { hero: true })`). As it arrives the places of
     * the petals still to come show, very faintly: the room sees that there are five, and the
     * frames with one or two petals are not lopsided. (The first petal blooms at once: no place.)
     */
    settle(t: number): number {
      tl.to(ghosts.slice(1), { autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: 'power1.inOut' }, t + 0.75)
      tl.to(hubEl, { y: 0, scale: 1, duration: 1.15, ease: ease.inOut }, t)
      tl.to(title, { y: 0, scale: 1, duration: 1.15, ease: ease.inOut }, t)
      tl.to(fx, { focusY: -0.5, glow: 0.2, duration: 1.15, ease: ease.inOut }, t)
      return t + 1.15
    },

    /** SLIDE 8. Petal i blooms. */
    bloom(i: number, t: number): number {
      const it = items[i]
      const p = it.petal
      walk(i, t, 0.6)
      tl.to(it.seed, { scale: 0, autoAlpha: 0, duration: 0.2, ease: 'power2.in' }, t + 0.45)
      land(i, t + 0.5, 0.75)
      ripple(i, t + 0.55)
      const P = t + 0.55
      // its waiting place has done its work
      tl.to(it.ghost, { autoAlpha: 0, duration: 0.45, ease: 'power1.out' }, P)
      if (p) {
        // out from under the disc, standing toward the room, and it lays itself down
        if (!reduced) Object.assign(p.s, { slide: 9.5, tilt: -1.12, twist: i % 2 ? -0.32 : 0.32, scale: 0.9 })
        tl.to(p.s, { opacity: 1, duration: 0.3, ease: 'power1.out' }, P)
        if (!reduced) {
          tl.to(p.s, { slide: 0, duration: 1.05, ease: 'power3.out' }, P)
          tl.to(p.s, { tilt: 0, duration: 1.35, ease: 'back.out(1.25)' }, P)
          tl.to(p.s, { twist: 0, scale: 1, duration: 1.25, ease: 'power3.out' }, P)
        }
      } else {
        tl.to(it.flat, { autoAlpha: 1, scale: 1, duration: 0.9, ease: ease.snap }, P)
      }
      tl.to(fx, { ...focus(i), glow: 0.34, warm: it.o.tone === 'peach' ? 0.22 : -0.22, duration: 1.3, ease: ease.inOut }, t)
      return t + 2.15
    },

    /** SLIDE 32. All five open as one fan from the bottom of the disc; then the badges, then the words. */
    fan(t: number): number {
      items.forEach((it, i) => {
        const p = it.petal
        const k = Math.abs(i - 2) // 0 the middle petal, 2 the outer pair
        if (p) {
          // stacked on the middle petal's place like the leaves of a fan, the outer ones deepest
          if (!reduced) Object.assign(p.s, { fan: ((it.o.angle - 90) * Math.PI) / 180, slide: 4.5 + k * 0.6, scale: 0.92, back: k * 1.1 })
          tl.to(p.s, { opacity: 1, duration: 0.4, ease: 'power1.out' }, t + 0.05 * k)
          if (!reduced) {
            tl.to(p.s, { fan: 0, duration: 1.2 + k * 0.12, ease: 'power3.inOut' }, t + 0.1)
            tl.to(p.s, { back: 0, duration: 0.5, ease: 'power2.inOut' }, t + 0.95 + k * 0.12)
            tl.to(p.s, { slide: 0, scale: 1, duration: 1.25, ease: 'power3.out' }, t + 0.3 + k * 0.06)
            // flat while they overlap (leaves that tilt would cut through one another); a small lift as each comes free
            tl.to(p.s, { tilt: -0.16, duration: 0.3, ease: 'power2.out' }, t + 1.0 + k * 0.1)
            tl.to(p.s, { tilt: 0, duration: 0.8, ease: 'back.out(1.6)' }, t + 1.3 + k * 0.1)
          }
        } else {
          tl.to(it.flat, { autoAlpha: 1, scale: 1, duration: 0.9, ease: ease.snap }, t + 0.2 + k * 0.12)
        }
        land(i, t + 1.2 + i * 0.09, 0.2)
      })
      tl.to(fx, { glow: 0.26, focusX: 0, focusY: 0.2, duration: 1.6, ease: 'power2.out' }, t)
      return t + 2.75
    },

    /** SLIDE 32. The light reaches petal i: the petal answers and its tag appears. `d`: the time to the next petal. */
    pass(i: number, t: number, d: number): number {
      const it = items[i]
      const p = it.petal
      walk(i, t, d)
      const hit = t + d - 0.12
      ripple(i, hit)
      if (!reduced) {
        tl.to(it.badge, { scale: 1.14, duration: 0.22, ease: 'power2.out' }, hit)
        tl.to(it.badge, { scale: 1, duration: 0.6, ease: ease.snap }, hit + 0.22)
        tl.to(it.group, { scale: 1.045, duration: 0.3, ease: 'power2.out' }, hit)
        tl.to(it.group, { scale: 1, duration: 0.7, ease: 'power2.inOut' }, hit + 0.34)
      }
      if (p) {
        tl.to(p.s, { lit: 1, duration: 0.3, ease: 'power2.out' }, hit)
        tl.to(p.s, { lit: 0, duration: 0.85, ease: 'power2.inOut' }, hit + 0.34)
        if (!reduced) {
          tl.to(p.s, { scale: 1.045, tilt: -0.1, duration: 0.3, ease: 'power2.out' }, hit)
          tl.to(p.s, { scale: 1, tilt: 0, duration: 0.7, ease: 'power2.inOut' }, hit + 0.34)
        }
      }
      if (set) tl.to(set.lamp, { x: it.o.centroid[0], y: it.o.centroid[1], duration: i ? d : 0.01, ease: ease.glide }, t)
      to(it.tag, { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, hit + 0.12)
      tl.to(fx, { ...focus(i), glow: 0.36, warm: it.o.tone === 'peach' ? 0.2 : -0.2, duration: d, ease: ease.glide }, t)
      return hit + 0.8
    },

    /** SLIDE 32. Petal i comes forward: we begin here. The others stand back. */
    begin(i: number, t: number, glint: [number, number] = [0, 0]): number {
      items.forEach((it, k) => {
        const p = it.petal
        if (k === i) {
          ripple(k, t + 0.45)
          if (p) {
            tl.to(p.s, { lit: 0.85, duration: 0.8, ease: 'power2.out' }, t + 0.2)
            if (!reduced) tl.to(p.s, { scale: 1.07, tilt: -0.07, duration: 0.9, ease: ease.snap }, t + 0.2)
          }
          if (!reduced) {
            tl.to(it.group, { scale: 1.07, duration: 0.9, ease: ease.snap }, t + 0.2)
            tl.to(it.badge, { scale: 1.12, duration: 0.7, ease: ease.snap }, t + 0.3)
          }
          // its tag fills: this is the next thing on the screen
          to(it.tag, { backgroundColor: it.o.tone === 'peach' ? '#e9542c' : '#2f6fd6', color: '#ffffff', duration: 0.5, ease: 'power1.inOut' }, t + 0.45)
          to(it.go, { color: '#ffffff', duration: 0.5, ease: 'power1.inOut' }, t + 0.45)
        } else {
          if (p) tl.to(p.s, { dim: 1, duration: 0.7, ease: 'power2.out' }, t)
          else tl.to(it.flat, { autoAlpha: 0.4, duration: 0.7, ease: 'power2.out' }, t)
          tl.to([...it.group, ...it.badge], { autoAlpha: 0.36, duration: 0.7, ease: 'power2.out' }, t)
          tl.to(it.arc, { autoAlpha: 0.3, duration: 0.7, ease: 'power2.out' }, t)
        }
      })
      if (set) {
        // the light crosses the petal once more, over its shoulder (its glint keeps off the words),
        // and is gone before the rest: held still, a glint is a smudge on the acrylic
        const [cx, cy] = OUTCOMES[i].centroid
        tl.set(set.lamp, { x: cx - glint[0], y: cy + glint[1] }, t)
        tl.to(set.lamp, { x: cx + glint[0], duration: 1.15, ease: 'power1.inOut' }, t + 0.1)
        tl.to(set.lamp, { power: 0.8, duration: 0.4, ease: 'power1.out' }, t + 0.15)
        tl.to(set.lamp, { power: 0, duration: 0.45, ease: 'power1.in' }, t + 0.8)
      }
      tl.to(fx, { ...focus(i), glow: 0.5, warm: OUTCOMES[i].tone === 'peach' ? 0.3 : -0.3, duration: 1.1, ease: ease.inOut }, t)
      return t + 1.35
    },

    /** The travelling light on and off (slide 32, around the passes). */
    lamp(power: number, t: number, duration = 0.5) {
      if (set) tl.to(set.lamp, { power, duration, ease: 'power1.inOut' }, t)
    },
  }
}

export type OutcomesRig = ReturnType<typeof outcomesRig>
