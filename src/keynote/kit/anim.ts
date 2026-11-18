'use client'

/**
 * THE MOVES. One small set of arrivals and exits, so 65 scenes move like one hand.
 *
 *   build(ctx) {
 *     const tl = ctx.timeline()
 *     const a = anim(ctx, tl)
 *     a.words('.kn-h', 0.1)                 // the headline, word by word
 *     a.rise('.s05-card', 0.6, { stagger: 0.08 })
 *     a.draw('.s05-line path', 0.4)
 *     a.count('.s05-big', 0.9)
 *     tl.addLabel('first')
 *     …
 *
 * Every move does two things: it SETS the hidden starting state now (gsap.set), and it adds the
 * tween that undoes it to the timeline at `at`. So a target is hidden from the first frame, and
 * every frame is reachable by seeking. `at` is a GSAP position: a time in seconds, a label, or
 * '<', '>', '>-0.2' and so on. Left out, the move follows whatever was added last.
 *
 * Targets are a selector (looked up inside the scene), an element, or a list of elements.
 * Measure with ctx.loc() BEFORE calling these: afterwards things are hidden or moved.
 */

import gsap from 'gsap'
import type { SceneCtx } from '../core/types'
import { formatCount, type CountProps } from './text'

type Target = string | Element | Element[] | null | undefined
type At = gsap.Position | undefined

export interface MoveOptions {
  duration?: number
  stagger?: number
  ease?: gsap.EaseFunction | string
}

export function anim(ctx: SceneCtx, tl: gsap.core.Timeline) {
  const { U, T, ease } = ctx
  /**
   * LESS MOTION (the visitor's system setting, ctx.reduced) is handled here, once: things still
   * arrive in the same order and at the same times, but they fade in where they stand. Nothing
   * travels, pops, wipes or staggers word by word. A scene only has to guard what it moves
   * itself: its own three.js and its moves of the backdrop (travel, yaw, pitch).
   */
  const calm = ctx.reduced
  const els = (t: Target): Element[] => (!t ? [] : typeof t === 'string' ? ctx.$$(t) : Array.isArray(t) ? t : [t])
  /** tl.to that says nothing when there is nothing to move. */
  const to = (targets: Element[], vars: gsap.TweenVars, at?: At) => (targets.length ? tl.to(targets, vars, at) : tl)
  const hide = (targets: Element[], vars: gsap.TweenVars) => {
    if (targets.length) gsap.set(targets, vars)
  }

  return {
    /** The elements a target stands for. */
    els,

    /** Words rise through their masks, one after another. Target: a <Headline>, or anything that holds <Words>. */
    words(target: Target, at?: At, o: MoveOptions = {}) {
      const inner = els(target).flatMap((el) => Array.from(el.querySelectorAll('.kn-wi')))
      if (!inner.length) return tl
      if (calm) {
        gsap.set(inner, { autoAlpha: 0 })
        return tl.to(inner, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, at)
      }
      gsap.set(inner, { yPercent: 118 })
      return tl.to(inner, { yPercent: 0, duration: o.duration ?? T.word, stagger: o.stagger ?? T.wordGap, ease: o.ease ?? ease.out }, at)
    },

    /**
     * One headline hands over to the next: the old words lift out through their masks together,
     * the new ones rise in. For a scene that spans several slides, where each slide has its own
     * headline at the same place (both are <Headline>s; give them different class names).
     *
     *   a.retitle('.s33-h--33', '.s33-h--34', '>')
     */
    retitle(from: Target, target: Target, at?: At, o: MoveOptions = {}) {
      const inner = (t: Target) => els(t).flatMap((el) => Array.from(el.querySelectorAll('.kn-wi')))
      const old = inner(from)
      const neu = inner(target)
      if (calm) {
        hide(neu, { autoAlpha: 0 })
        to(old, { autoAlpha: 0, duration: 0.3, ease: 'power1.in' }, at)
        return to(neu, { autoAlpha: 1, duration: 0.5, ease: 'power1.out' }, old.length ? '>' : at)
      }
      hide(neu, { yPercent: 118 })
      to(old, { yPercent: -118, duration: 0.42, stagger: 0.008, ease: 'power2.in' }, at)
      return to(neu, { yPercent: 0, duration: o.duration ?? T.word, stagger: o.stagger ?? T.wordGap, ease: o.ease ?? ease.out }, old.length ? '>-0.12' : at)
    },

    /** Fades in while rising `y` units (default 1.6u). The plain arrival of a card, a chip, a line of text. */
    rise(target: Target, at?: At, o: MoveOptions & { y?: number; x?: number; scale?: number } = {}) {
      const e = els(target)
      if (!e.length) return tl
      if (calm) {
        gsap.set(e, { autoAlpha: 0 })
        return tl.to(e, { autoAlpha: 1, duration: 0.5, stagger: o.stagger ?? T.stagger, ease: 'power1.out' }, at)
      }
      gsap.set(e, { autoAlpha: 0, y: (o.y ?? 1.6) * U, x: (o.x ?? 0) * U, scale: o.scale ?? 1 })
      return tl.to(e, { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: o.duration ?? T.enter, stagger: o.stagger ?? T.stagger, ease: o.ease ?? ease.out }, at)
    },

    /** Pops in from small with a little overshoot: a dot, a badge, a chip landing. */
    pop(target: Target, at?: At, o: MoveOptions & { from?: number } = {}) {
      const e = els(target)
      if (!e.length) return tl
      if (calm) {
        gsap.set(e, { autoAlpha: 0 })
        return tl.to(e, { autoAlpha: 1, duration: 0.4, stagger: o.stagger ?? T.stagger, ease: 'power1.out' }, at)
      }
      gsap.set(e, { autoAlpha: 0, scale: o.from ?? 0.6 })
      return tl.to(e, { autoAlpha: 1, scale: 1, duration: o.duration ?? 0.55, stagger: o.stagger ?? T.stagger, ease: o.ease ?? ease.snap }, at)
    },

    /** Fades in, nothing else. */
    fade(target: Target, at?: At, o: MoveOptions = {}) {
      const e = els(target)
      if (!e.length) return tl
      gsap.set(e, { autoAlpha: 0 })
      return tl.to(e, { autoAlpha: 1, duration: o.duration ?? 0.5, stagger: o.stagger ?? 0, ease: o.ease ?? 'power1.out' }, at)
    },

    /** Draws SVG strokes from nothing: paths, lines, circles, polylines (they need a stroke). */
    draw(target: Target, at?: At, o: MoveOptions = {}) {
      const e = els(target)
      if (!e.length) return tl
      // hidden as well as undrawn: a stroke of no length with a round cap would show as a dot
      gsap.set(e, { drawSVG: '0%', autoAlpha: 0 })
      const st = o.stagger ?? 0.06
      tl.to(e, { autoAlpha: 1, duration: 0.01, stagger: st, ease: 'none' }, at)
      return tl.to(e, { drawSVG: '100%', duration: o.duration ?? T.draw, stagger: st, ease: o.ease ?? ease.glide }, '<')
    },

    /** A rule (a thin div) grows from one end. `from`: 'left' (default), 'right', 'top', 'bottom', 'center'. */
    rule(target: Target, at?: At, o: MoveOptions & { from?: 'left' | 'right' | 'top' | 'bottom' | 'center' } = {}) {
      const e = els(target)
      if (!e.length) return tl
      const from = o.from ?? 'left'
      const vertical = from === 'top' || from === 'bottom'
      const origin = { left: '0% 50%', right: '100% 50%', top: '50% 0%', bottom: '50% 100%', center: '50% 50%' }[from]
      gsap.set(e, vertical ? { scaleY: 0, transformOrigin: origin } : { scaleX: 0, transformOrigin: origin })
      return tl.to(e, { ...(vertical ? { scaleY: 1 } : { scaleX: 1 }), duration: o.duration ?? T.draw, stagger: o.stagger ?? 0.06, ease: o.ease ?? ease.glide }, at)
    },

    /** Reveals through a straight edge (a picture, a screenshot, a logo). `from`: the side it opens from. */
    wipe(target: Target, at?: At, o: MoveOptions & { from?: 'left' | 'right' | 'top' | 'bottom' } = {}) {
      const e = els(target)
      if (!e.length) return tl
      if (calm) {
        gsap.set(e, { autoAlpha: 0 })
        return tl.to(e, { autoAlpha: 1, duration: 0.6, stagger: o.stagger ?? T.stagger, ease: 'power1.out' }, at)
      }
      const hidden = { left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)', top: 'inset(0% 0% 100% 0%)', bottom: 'inset(100% 0% 0% 0%)' }[o.from ?? 'left']
      gsap.set(e, { clipPath: hidden, autoAlpha: 1 })
      return tl.to(e, { clipPath: 'inset(0% 0% 0% 0%)', duration: o.duration ?? 0.9, stagger: o.stagger ?? T.stagger, ease: o.ease ?? ease.inOut }, at)
    },

    /** Counts a <Count> up to its number. */
    count(target: Target, at?: At, o: MoveOptions = {}) {
      for (const el of els(target) as HTMLElement[]) {
        const d = el.dataset
        const end = Number(d.to)
        const from = Number(d.from ?? 0)
        const decimals = Number(d.decimals ?? 0)
        const group = (d.group ?? 'en') as CountProps['group']
        const write = (v: number) => {
          el.textContent = `${d.prefix ?? ''}${formatCount(v, decimals, group)}${d.suffix ?? ''}`
        }
        const state = { v: from }
        write(from)
        tl.to(state, { v: end, duration: o.duration ?? T.count, ease: o.ease ?? 'power2.out', onUpdate: () => write(state.v) }, at)
      }
      return tl
    },

    /** Something that has done its work leaves: it lifts `y` units and fades. Stepping Back brings it back. */
    leave(target: Target, at?: At, o: MoveOptions & { y?: number } = {}) {
      const e = els(target)
      if (!e.length) return tl
      return tl.to(e, { autoAlpha: 0, y: calm ? 0 : -(o.y ?? 0.9) * U, duration: o.duration ?? T.leave, stagger: o.stagger ?? 0.045, ease: o.ease ?? 'power2.in' }, at)
    },

    /**
     * A <BarChart>, <MultiBarChart> or <HBarChart>: its axis draws, its bars grow from the
     * baseline (a stacked column as one piece), their figures and labels follow.
     */
    bars(target: Target, at?: At, o: MoveOptions = {}) {
      for (const chart of els(target)) {
        const q = (sel: string) => Array.from(chart.querySelectorAll(sel))
        const bars = q('.kn-bar')
        const across = chart.classList.contains('kn-hbarchart')
        const pos: gsap.Position = at ?? '>'
        const axis = q('.kn-chart-axis')
        const figures = [...q('.kn-bar-val'), ...q('.kn-bar-seg')]
        hide(axis, { drawSVG: '0%' })
        hide(bars, across ? { scaleX: 0, transformOrigin: '0% 50%' } : { scaleY: 0, transformOrigin: '50% 100%' })
        hide([...figures, ...q('.kn-bar-label')], { autoAlpha: 0 })
        const d = o.duration ?? 0.9
        const st = o.stagger ?? 0.09
        // one tween always anchors the chart at `pos`, so the '<' positions below have something to follow
        tl.to({}, { duration: 0.01 }, pos)
        to(axis, { drawSVG: '100%', duration: 0.6, ease: ease.glide }, '<')
        to(q('.kn-bar-label'), { autoAlpha: 1, duration: 0.4, stagger: st }, '<0.1')
        to(bars, { ...(across ? { scaleX: 1 } : { scaleY: 1 }), duration: d, stagger: st, ease: o.ease ?? ease.out }, '<0.05')
        to(figures, { autoAlpha: 1, duration: 0.35, stagger: figures.length > bars.length ? st / 2 : st }, `<${(d * 0.55).toFixed(2)}`)
      }
      return tl
    },

    /**
     * A <LineChart>: its axis and rules draw, each line draws from the left, its dots and figures
     * land as the line passes them, a band fades in behind.
     */
    line(target: Target, at?: At, o: MoveOptions = {}) {
      for (const chart of els(target)) {
        const q = (sel: string) => Array.from(chart.querySelectorAll(sel))
        const pos: gsap.Position = at ?? '>'
        const d = o.duration ?? 1.4
        const axis = [...q('.kn-chart-axis'), ...q('.kn-chart-tick')]
        const quiet = [...q('.kn-line-label'), ...q('.kn-chart-ticktext'), ...q('.kn-line-group')]
        const soft = [...q('.kn-line-area'), ...q('.kn-chart-band')]
        hide([...axis, ...q('.kn-line')], { drawSVG: '0%' })
        hide(q('.kn-line'), { autoAlpha: 0 }) // an undrawn stroke with a round cap would show as a dot
        hide(soft, { autoAlpha: 0 })
        hide(q('.kn-line-dot'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
        hide([...q('.kn-line-val'), ...quiet], { autoAlpha: 0 })
        // a label of the chart's own: every part below is placed against it, whether or not the parts before it exist
        const L = `knLine${++lineSeq}`
        tl.addLabel(L, pos)
        to(axis, { drawSVG: '100%', duration: 0.6, stagger: 0.03, ease: ease.glide }, L)
        to(quiet, { autoAlpha: 1, duration: 0.4, stagger: 0.02 }, `${L}+=0.1`)
        q('.kn-line').forEach((path, i) => {
          const start = 0.2 + i * 0.18
          tl.to(path, { autoAlpha: 1, duration: 0.01, ease: 'none' }, `${L}+=${start.toFixed(2)}`)
          tl.to(path, { drawSVG: '100%', duration: d, ease: 'power1.inOut' }, `${L}+=${start.toFixed(2)}`)
          // each dot and each figure lands as the line reaches its point
          const own = (cls: string) => q(`${cls}[data-series="${i}"]`) as HTMLElement[]
          const span = Math.max(1, ((path as SVGPathElement).getAttribute('d')?.split('L').length ?? 2) - 1)
          const when = (el: HTMLElement) => `${L}+=${(start + (Number(el.dataset.i ?? 0) / span) * d * 0.9).toFixed(2)}`
          own('.kn-line-dot').forEach((dot) => tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.35, ease: ease.snap }, when(dot)))
          own('.kn-line-val').forEach((val) => tl.to(val, { autoAlpha: 1, duration: 0.3 }, when(val)))
        })
        to(soft, { autoAlpha: 1, duration: 0.8 }, `${L}+=${(0.2 + d * 0.5).toFixed(2)}`)
        tl.removeLabel(L)
      }
      return tl
    },
  }
}

let lineSeq = 0

export type Anim = ReturnType<typeof anim>
