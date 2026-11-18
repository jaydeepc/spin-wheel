'use client'

/**
 * Slide 12 · "2 · BHARAT, our focus is serving Middle India"
 *
 * Three Indias, three photographs, ONE choice. The slide's own word is "focus", so the scene
 * is a camera finding its subject: a focus frame (four corner marks) looks at each portrait in
 * turn, lets two of them go, and locks on the middle one.
 *
 *   three      the three portraits arrive out of the depth, a light crossing each; their names
 *   affluent   the frame finds "Affluent, Urban": NOT OUR CUSTOMER. It steps back and pales.
 *   rural      the frame crosses the stage to "Poor, Rural": NOT YET- Biz in early days. It steps back.
 *   middle     the frame comes home to "Middle India", turns flame and locks; the portrait
 *              comes forward, the light crosses it, OUR FOCUS lights.
 *
 * THE PHOTOGRAPHS ARE REAL: the deck's own files, whole, at their own proportions, never larger
 * than their pixels on a 1920 stage (data.ts). Nothing is done to them: a veil of the page's
 * white is laid OVER the two that step back, and a band of light passes over them.
 *
 * Depth without a canvas: the three stand on one floor line at THREE distances from the first
 * rest on (three heights, the outer two turned a little toward the middle), and every portrait
 * drifts in one phase by an amount that follows how near it is (--s12-near, which the timeline
 * moves): the parallax of a camera tracking slowly past three cards, so they slide against each
 * other. A portrait turns to face the camera when the focus frame finds it.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Headline, Pic, pic, Words, type Box, type SceneModule } from '../../kit'
import { FLAME, FLOOR, SEGMENTS, widthOf } from './data'
import './scene.css'

/** Where each portrait's middle stands, in --u from the left. */
const CX = { a: 22, m: 50, r: 78 }
const CORNERS = ['tl', 'tr', 'bl', 'br'] as const

const scene: SceneModule = {
  beats: ['three', 'affluent', 'rural', 'middle'],
  preload: SEGMENTS.map((s) => pic(12, s.file)),

  Scene: ({ slide }) => (
    <div className="s12">
      <Headline text={slide.title} flame={FLAME} />

      {SEGMENTS.map((s) => {
        const w = widthOf(s)
        return (
          <figure
            className={`s12-col s12-col--${s.key}`}
            key={s.key}
            style={{ left: `calc(var(--u) * ${CX[s.key] - w / 2})`, top: `calc(var(--u) * ${FLOOR - s.h})`, width: `calc(var(--u) * ${w})`, '--s12-h': `calc(var(--u) * ${s.h})` } as CSSProperties}
          >
            <div className="s12-card">
              <div className="s12-drift" style={{ '--s12-near': s.near } as CSSProperties}>
                <span className="s12-lift" aria-hidden="true" />
                <Pic className="s12-photo" n={12} name={s.file} fit="contain" alt={s.name} />
                <span className="s12-fx" aria-hidden="true" style={s.file.endsWith('.png') ? ({ '--s12-mask': `url(${pic(12, s.file)})` } as CSSProperties) : undefined}>
                  <i className="s12-veil" />
                  <i className="s12-sheen" />
                </span>
              </div>
            </div>
            <figcaption className="s12-cap">
              <b className="s12-name">
                <Words text={s.name} />
              </b>
              <span className="s12-tag">{s.tag}</span>
            </figcaption>
          </figure>
        )
      })}

      {/* the focus frame: four corner marks, moved as one by the timeline */}
      <div className="s12-focus s12-drift" aria-hidden="true">
        {CORNERS.map((c) => (
          <i className={`s12-fc s12-fc--${c}`} key={c} />
        ))}
      </div>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx

    const col = (k: string) => ctx.$(`.s12-col--${k}`)
    const part = (k: string, sel: string) => col(k).querySelector(sel) as HTMLElement
    // measured before anything is moved or hidden
    const box = { a: ctx.loc(part('a', '.s12-card')), m: ctx.loc(part('m', '.s12-card')), r: ctx.loc(part('r', '.s12-card')) }
    const focus = ctx.$('.s12-focus')
    const marks = CORNERS.map((c) => ctx.$(`.s12-fc--${c}`))
    const arm = ctx.loc(marks[0]).w

    /** A portrait's box when it is scaled by `s` about its middle and moved by (dx, dy) units. */
    const moved = (b: Box, s: number, dx = 0, dy = 0): Box => {
      const w = b.w * s
      const h = b.h * s
      const cx = b.cx + dx * U
      const cy = b.cy + dy * U
      return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy }
    }
    /** The four corner marks around a box, `gap` units outside it. */
    const around = (b: Box, gap: number) => {
      const g = gap * U
      return [
        { x: b.x - g, y: b.y - g },
        { x: b.x + b.w + g - arm, y: b.y - g },
        { x: b.x - g, y: b.y + b.h + g - arm },
        { x: b.x + b.w + g - arm, y: b.y + b.h + g - arm },
      ]
    }
    const frameTo = (b: Box, gap: number, at: number, duration: number, e: gsap.EaseFunction | string) => {
      around(b, gap).forEach((p, i) => tl.to(marks[i], { x: p.x, y: p.y, duration, ease: e }, at))
    }

    // the two that step back, and the one that comes forward
    const BACK = 0.78
    const FRONT = 1.12
    const FRONT_DY = -0.35
    const FAR = 0.3
    const NEAR = 1.8
    const nearOf = { a: SEGMENTS[0].near, m: SEGMENTS[1].near, r: SEGMENTS[2].near }
    /** both that step back rise by the same amount at their foot, so their names stay on one line */
    const RISE = 3.4
    const dyOf = (k: 'a' | 'r') => -(RISE - ((1 - BACK) * box[k].h) / U / 2)
    const away = { a: moved(box.a, BACK, -1.5, dyOf('a')), r: moved(box.r, BACK, 1.5, dyOf('r')) }
    const near = moved(box.m, FRONT, 0, FRONT_DY)

    /* ------------------------------------------------------------ three */
    a.words('.kn-h', 0.1)
    tl.to(fx, { glow: 0.28, focusX: 0, focusY: 0.05, duration: 1.8 }, 0.2)
    SEGMENTS.forEach((s, i) => {
      const at = 0.4 + i * 0.17
      const card = part(s.key, '.s12-card')
      gsap.set(card, { autoAlpha: 0, scale: reduced ? 1 : 0.8, y: reduced ? 0 : U * 3, rotationY: reduced ? 0 : s.turn, transformPerspective: U * 90, transformOrigin: '50% 50%' })
      tl.to(card, { autoAlpha: 1, duration: 0.55, ease: 'power1.out' }, at)
      tl.to(card, { scale: 1, y: 0, duration: 1.25, ease: ease.out }, at)
      // a band of light crosses it as it lands
      const sheen = part(s.key, '.s12-sheen')
      gsap.set(sheen, { xPercent: -130 })
      tl.to(sheen, { xPercent: 330, duration: 1.15, ease: 'power2.inOut' }, at + 0.45)
      a.words(part(s.key, '.s12-name'), at + 0.6)
      gsap.set(part(s.key, '.s12-tag'), { autoAlpha: 0, y: U * 0.7 })
      gsap.set(part(s.key, '.s12-veil'), { autoAlpha: 0 })
      gsap.set(part(s.key, '.s12-lift'), { autoAlpha: 0 })
    })
    tl.addLabel('three', 2.45)

    /* --------------------------------------------- affluent, then rural */
    gsap.set(focus, { autoAlpha: 0, '--s12-near': nearOf.a })
    around(moved(box.a, 1.16), 0.8).forEach((p, i) => gsap.set(marks[i], { x: p.x, y: p.y }))

    /** The frame is on portrait `k` at time `t`: its verdict comes up, and it steps back. */
    const letGo = (k: 'a' | 'r', t: number, focusX: number): number => {
      tl.to(part(k, '.s12-tag'), { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, t)
      const card = part(k, '.s12-card')
      const b = away[k]
      const dx = (b.cx - box[k].cx) / U
      tl.to(card, { scale: BACK, x: dx * U, y: dyOf(k) * U, duration: 1.05, ease: ease.inOut }, t + 0.5)
      tl.to(card.querySelector('.s12-drift'), { '--s12-near': FAR, duration: 1.05, ease: ease.inOut }, t + 0.5)
      tl.to(focus, { '--s12-near': FAR, duration: 1.05, ease: ease.inOut }, t + 0.5)
      tl.to(part(k, '.s12-veil'), { autoAlpha: 0.5, duration: 1.05, ease: ease.inOut }, t + 0.5)
      // the frame goes with it, and its name with its picture
      frameTo(b, 0.8, t + 0.5, 1.05, ease.inOut)
      tl.to(part(k, '.s12-cap'), { x: dx * U, y: -RISE * U, duration: 1.05, ease: ease.inOut }, t + 0.5)
      tl.to(fx, { focusX, glow: 0.2, warm: -0.15, duration: 1.3, ease: ease.inOut }, t)
      return t + 1.6
    }

    let t = 2.45
    tl.to(focus, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, t)
    frameTo(box.a, 0.8, t, 0.65, ease.out)
    tl.to(part('a', '.s12-card'), { rotationY: 0, duration: 0.65, ease: ease.out }, t)
    t = letGo('a', t + 0.4, -0.5)
    tl.addLabel('affluent', t)

    // across the stage, over the middle portrait, to the third
    tl.to(focus, { '--s12-near': nearOf.r, duration: 1.0, ease: ease.inOut }, t)
    frameTo(box.r, 0.8, t, 1.0, ease.inOut)
    tl.to(part('r', '.s12-card'), { rotationY: 0, duration: 0.8, ease: ease.inOut }, t + 0.2)
    t = letGo('r', t + 0.85, 0.5)
    tl.addLabel('rural', t)

    /* ----------------------------------------------------------- middle */
    // home: the frame finds the middle one, turns flame, and locks as it comes forward
    tl.to(focus, { '--s12-near': nearOf.m, duration: 0.85, ease: ease.inOut }, t)
    frameTo(box.m, 0.8, t, 0.85, ease.inOut)
    tl.to(marks, { color: '#f16443', duration: 0.4, ease: 'power1.out' }, t + 0.55)
    const M = t + 0.75
    const cardM = part('m', '.s12-card')
    tl.to(cardM, { scale: FRONT, y: FRONT_DY * U, duration: 1.15, ease: ease.inOut }, M)
    tl.to(cardM.querySelector('.s12-drift'), { '--s12-near': NEAR, duration: 1.15, ease: ease.inOut }, M)
    tl.to(focus, { '--s12-near': NEAR, duration: 1.15, ease: ease.inOut }, M)
    tl.to(part('m', '.s12-lift'), { autoAlpha: 1, duration: 1.15, ease: ease.inOut }, M)
    frameTo(near, 0.8, M, 1.15, ease.inOut)
    tl.to(part('m', '.s12-cap'), { y: (FRONT - 1) * box.m.h * 0.5 + (FRONT_DY + 0.15) * U, duration: 1.15, ease: ease.inOut }, M)
    // the lock: the corners close on the picture
    frameTo(near, 0.34, M + 1.1, 0.5, ease.snap)
    tl.to(part('m', '.s12-sheen'), { xPercent: -130, duration: 0.01, ease: 'none' }, M + 0.2)
    tl.to(part('m', '.s12-sheen'), { xPercent: 330, duration: 1.3, ease: 'power2.inOut' }, M + 0.55)
    // OUR FOCUS lights
    const tag = part('m', '.s12-tag')
    tl.to(tag, { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, M + 0.9)
    tl.to(tag, { backgroundColor: '#f16443', color: '#ffffff', duration: 0.45, ease: 'power1.out' }, M + 1.25)
    tl.to(fx, { focusX: 0, focusY: 0, glow: 0.5, warm: 0.5, duration: 1.6, ease: ease.inOut }, t + 0.2)
    tl.addLabel('middle', M + 1.85)
    return tl
  },
}

export default scene
