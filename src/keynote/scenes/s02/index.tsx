'use client'

/**
 * Slide 02 · the agenda: the parts of the keynote, in the agenda's own words (deck.ts → AGENDA).
 *
 * THE IDEA. A chapter is an object: a block of clear glass with a navy plate cast inside it,
 * its letter above, its name below. Six of them stand on a floor that reflects them, in a line
 * that recedes into the room.
 *
 *   path    we begin close on A, pale frosted glass. The navy rises through it behind a line of
 *           flame and its letter is there. The camera draws back, up and round, and as it does
 *           B, C, D, E, F light one after another, until the whole agenda stands in the frame
 *           under its title, seen from a little above. The camera breathes while the room waits.
 *   list    the camera comes down to the stage's own; each name block folds up and away behind
 *           its letter block; the letter block lifts, banks and flies to its row; as it lands
 *           its rule draws and its name rises word by word, large. A light travels down the
 *           list, each block takes it in turn, and it comes to rest on A: we start here.
 *
 * The glass is real (monolith.ts: transmission, a procedural studio, a reflecting floor) on a
 * scene-owned canvas whose space is the stage's and whose camera ends as the stage's own, so a
 * block lands exactly on the row the DOM has laid out for it. Without WebGL the rows show flat
 * letters instead (.s02-key), from the first rest on, and the scene still tells the same thing.
 *
 * Everything is laid out from AGENDA.length: six parts or seven, nothing here changes.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { AGENDA, anim, Headline, Words, type SceneModule } from '../../kit'
import { MW } from './monolith'
import { makeStage, type Stage } from './stage'
import './scene.css'

const N = AGENDA.length
/** A row of the list, in --u. */
const ROW = Math.min(5.8, 35.4 / N)
/** Where "Agenda" stands over the line-up, in --u from the left (in the list it is the list's own left edge). */
const HEAD_X = 6.4
const LIST_X = 19

const scene: SceneModule = {
  beats: ['path', 'list'],
  // the agenda IS the table of contents: the rail comes in with the slide after it
  chrome: { rail: false, crumb: false },

  Scene: ({ slide }) => (
    <div className="s02" style={{ '--s02-row': `calc(var(--u) * ${ROW})` } as CSSProperties}>
      <Headline className="s02-h" size="xl" text={slide.title} />
      <span className="s02-here" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
        </svg>
      </span>
      <span className="s02-beam" aria-hidden="true" />
      <ol className="s02-list">
        {AGENDA.map((item) => (
          <li className="s02-row" key={item.letter}>
            <span className="s02-slot">
              <span className="s02-key">{item.letter}</span>
            </span>
            <span className="s02-name">
              <Words text={item.name} />
            </span>
            <span className="s02-rule" aria-hidden="true" />
          </li>
        ))}
      </ol>
    </div>
  ),

  three(ctx) {
    const stage = makeStage(ctx, AGENDA)
    ctx.bag.stage = stage
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      stage.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const stage = ctx.bag.stage as Stage | undefined
    const fx = ctx.backdrop.fx
    const rows = ctx.$$('.s02-row')
    // measure the rows before anything is hidden: this is where each block must land
    const slots = ctx.$$('.s02-slot').map((el) => ctx.loc(el))
    const list = ctx.loc(ctx.$('.s02-list'))
    const head = ctx.$('.s02-h')

    /* ----------------------------------------------------------------- path */
    // the backdrop moves WITH the camera: it draws back too, and turns as the camera comes round
    if (stage && !reduced) gsap.set(fx, { travel: 46, yaw: 0.1 })
    tl.to(fx, { travel: 0, yaw: 0, duration: 4.1, ease: 'power2.inOut' }, 0.15)
    tl.to(fx, { glow: 0.2, focusX: -0.5, focusY: 0.1, energy: 0.2, duration: 2 }, 0.1)
    tl.to(fx, { focusX: 0.2, duration: 3.2, ease: 'power1.inOut' }, 0.9)

    let P = 0.9
    if (stage) {
      const { monos, cam, floor } = stage
      // "Agenda" stands over the line-up; it goes to the head of the list with the next beat
      gsap.set(head, { x: (HEAD_X - LIST_X) * U })
      gsap.set(cam, { p: reduced ? 1 : 0, q: 0, sway: 0 })
      gsap.set(floor, { show: 1 })
      tl.to(cam, { p: 1, duration: 4.05, ease: 'power2.inOut' }, 0.15)
      monos.forEach((m, i) => {
        // A while we are close on it; the others as the camera opens the room to them
        const at = i === 0 ? 0.3 : 1.5 + (i - 1) * 0.4
        m.fill = 0
        m.lit = 0
        m.fold = 0
        tl.to(m, { fill: 1, duration: i === 0 ? 1.25 : 0.95, ease: 'power2.inOut' }, at)
        tl.to(m, { lit: 1, duration: 0.3, ease: 'power2.out' }, at + (i === 0 ? 0.95 : 0.7))
        tl.to(m, { lit: 0, duration: 0.9, ease: 'power2.inOut' }, at + (i === 0 ? 1.25 : 1.0))
      })
      a.words(head, 3.35, { duration: 0.95 })
      tl.to(cam, { sway: 1, duration: 1.0, ease: 'power1.inOut' }, 4.0)
      P = 4.75
    } else {
      // no WebGL: the letters stand in their rows from the first rest on
      a.words(head, 0.1, { duration: 0.9 })
      a.pop('.s02-key', 0.5, { stagger: 0.07 })
      P = 1.6
    }
    tl.addLabel('path', P)

    /* ----------------------------------------------------------------- list */
    const L = P
    tl.to(fx, { travel: 22, duration: 2.4, ease: ease.inOut }, L)
    tl.to(fx, { focusX: -0.45, focusY: -0.5, glow: 0.16, duration: 1.4, ease: ease.inOut }, L)
    if (stage) {
      tl.to(head, { x: 0, duration: 1.2, ease: ease.inOut }, L + 0.1)
      tl.to(stage.cam, { sway: 0, duration: 0.5, ease: 'power2.inOut' }, L)
      // the camera comes down to the stage's own: there a block lands exactly on its row
      tl.to(stage.cam, { q: 1, duration: 1.45, ease: ease.inOut }, L + 0.05)
      tl.to(stage.floor, { show: 0, duration: 0.5, ease: 'power1.in' }, L)
    }
    rows.forEach((row, i) => {
      const at = L + 0.1 + i * 0.09
      const land = at + (stage ? 1.5 : 0.25)
      if (stage) {
        const m = stage.monos[i]
        const s = slots[i]
        const p = stage.gl.at(s.cx / U, s.cy / U, 0)
        const k = s.w / U / MW
        // its name lets go and the name block folds up and away behind the letter
        tl.to(m, { fold: 1, duration: 0.62, ease: 'power2.inOut' }, at)
        // the letter block lifts off, comes a little toward the room, and flies to its row
        const go = at + 0.28
        tl.to(m.group.position, { x: p.x, y: p.y, duration: 1.22, ease: ease.inOut }, go)
        tl.to(m.group.position, { z: Math.max(8, stage.stands[i].z + 6), duration: 0.52, ease: 'power2.out' }, go)
        tl.to(m.group.position, { z: 0, duration: 0.7, ease: 'power2.inOut' }, go + 0.52)
        // it banks into the turn and levels out as it lands: its face is always toward the room, never its edge
        if (!reduced) tl.to(m.group.rotation, { x: -0.3, y: i < N / 2 ? 0.75 : -0.75, z: i < N / 2 ? -0.06 : 0.06, duration: 0.52, ease: 'power2.out' }, go)
        tl.to(m.group.rotation, { x: 0, y: 0, z: 0, duration: 0.7, ease: 'power2.inOut' }, go + 0.52)
        tl.to(m.group.scale, { x: k, y: k, z: k, duration: 1.22, ease: ease.inOut }, go)
      }
      a.rule(row.querySelector('.s02-rule'), land - 0.12, { duration: 0.85 })
      a.words(row.querySelector('.s02-name'), land, { duration: 0.75, stagger: 0.04 })
    })

    // THE LIGHT travels down the list: a lamp over the blocks, a soft band behind the rows
    const S = L + (stage ? 2.4 : 1.2)
    const D = 1.3
    const beam = ctx.$('.s02-beam')
    const first = slots[0]
    const last = slots[slots.length - 1]
    const half = (ROW * U) / 2
    gsap.set(beam, { x: list.x - U * 1.4, y: first.cy - half, autoAlpha: 0 })
    tl.to(beam, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, S)
    tl.to(beam, { y: last.cy - half, duration: D, ease: 'power1.inOut' }, S)
    tl.to(beam, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, S + D - 0.25)
    tl.to(fx, { focusY: 0.55, glow: 0.3, duration: D, ease: 'power1.inOut' }, S)
    tl.to(fx, { glow: 0.1, focusY: -0.5, duration: 0.9 }, S + D)
    if (stage) {
      const lamp = stage.studio.lamp
      const top = stage.gl.at(first.cx / U + 1.2, first.cy / U, 5)
      const foot = stage.gl.at(last.cx / U + 1.2, last.cy / U, 5)
      gsap.set(lamp.position, { x: top.x, y: top.y, z: top.z })
      gsap.set(lamp, { intensity: 0 })
      tl.to(lamp, { intensity: 150, duration: 0.3 }, S)
      tl.to(lamp.position, { y: foot.y, duration: D, ease: 'power1.inOut' }, S)
      tl.to(lamp, { intensity: 0, duration: 0.4 }, S + D - 0.2)
      stage.monos.forEach((m, i) => {
        const k = slots[i].w / U / MW
        const hit = S + 0.1 + (i / Math.max(1, N - 1)) * (D - 0.3)
        tl.to(m, { lit: 1, duration: 0.2, ease: 'power2.out' }, hit)
        tl.to(m, { lit: 0, duration: 0.55, ease: 'power2.in' }, hit + 0.2)
        tl.to(m.group.scale, { x: k * 1.12, y: k * 1.12, z: k * 1.12, duration: 0.2, ease: 'power2.out' }, hit)
        tl.to(m.group.scale, { x: k, y: k, z: k, duration: 0.5, ease: ease.snap }, hit + 0.2)
      })
    }

    // … and comes to rest on A: we start here
    const E = S + D + 0.05
    const here = ctx.$('.s02-here')
    gsap.set(here, { x: list.x - U * 1.4, y: first.cy - half, autoAlpha: 0, scaleX: 0.9, transformOrigin: '0% 50%' })
    tl.to(here, { autoAlpha: 1, scaleX: 1, duration: 0.6, ease: ease.out }, E)
    if (stage) {
      const m = stage.monos[0]
      const k = slots[0].w / U / MW
      tl.to(m, { lit: 0.8, duration: 0.5, ease: 'power2.out' }, E)
      tl.to(m.group.scale, { x: k * 1.08, y: k * 1.08, z: k * 1.08, duration: 0.6, ease: ease.snap }, E)
    }
    tl.addLabel('list', E + 0.65)
    return tl
  },
}

export default scene
