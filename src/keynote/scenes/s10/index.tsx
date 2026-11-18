'use client'

/**
 * Slide 10 · "Building AI for Bharat": the theme of the day, arriving as a statement.
 *
 *   theme     THE CURTAIN RISES. The room's own points lift from under the stage and gather into
 *             the three words, each in its colour; the solid words take over and the dust lifts
 *             off them. "Three words. Each one chosen deliberately." The phrase stands alone in
 *             the middle of the stage.
 *   ai        the phrase rises to make room and the other words step back. "AI" lets a stream of
 *             its points go: they fall, narrow to a neck and run out along the rule that heads its
 *             column. The word POURS its column: "1. AI", and its line.
 *   bharat    the same for "Bharat": "2. Bharat".
 *   building  and for "Building": "3. Building". Then all three words stand lit again over their
 *             three columns.
 *
 * The columns stand left to right in the phrase's order (Building, AI, Bharat), as the deck has
 * them; the numbers give the order of telling, and the beats follow the numbers.
 *
 * The points are a scene-owned canvas (dust.ts). Without WebGL, or where less motion is asked
 * for, the words and the rules simply arrive (the kit's moves) and nothing is missing.
 * No logo here: the deck's page has it twice by a slip, and the chrome already shows it.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Words, type SceneModule } from '../../kit'
import { COL_W, COLUMNS, HERO, ORDER, SUB, WORDS, type WordKey } from './data'
import { makeDust, type Dust } from './dust'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${n})`

const scene: SceneModule = {
  beats: ['theme', ...ORDER.map((k) => COLUMNS.find((c) => c.key === k)?.beat ?? k)],

  Scene: ({ slide }) => {
    // the phrase IS the slide's title (deck.ts), word for word
    const words = slide.title.split(' ')
    return (
      <div className="s10">
        <div className="s10-hero">
          <h1 className="s10-theme" aria-label={slide.title}>
            {words.map((w, i) => (
              <span key={i}>
                <span className={`s10-word s10-word--${WORDS[i]?.key ?? 'ai'}`} style={{ color: WORDS[i]?.colour }}>
                  {w}
                </span>
                {i < words.length - 1 ? ' ' : null}
              </span>
            ))}
            <i className="s10-base" aria-hidden="true" />
          </h1>
          <p className="s10-sub">
            <Words text={SUB} />
          </p>
        </div>

        {COLUMNS.map((c) => (
          <div key={c.key} className={`s10-col s10-col--${c.key}`} style={{ left: u(c.x), width: u(COL_W), '--s10-c': c.colour, '--s10-ink': c.ink } as CSSProperties}>
            <h2 className="s10-col-h">
              <Words text={c.head} />
            </h2>
            <span className="s10-col-bar" aria-hidden="true">
              <span className="s10-col-track" />
              <span className="s10-col-rule" />
            </span>
            <p className="s10-col-line">
              {c.line.map((run, i) => (run.italic ? <i key={i}>{run.text}</i> : <span key={i}>{run.text}</span>))}
            </p>
          </div>
        ))}
      </div>
    )
  },

  three(ctx) {
    // less motion asked for: no flight of points, the words simply arrive
    if (ctx.reduced) return
    const dust = makeDust(ctx)
    ctx.bag.dust = dust
    return dust.gl.dispose
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const dust = ctx.bag.dust as Dust | undefined
    const hero = ctx.$('.s10-hero')
    const word = (k: WordKey) => ctx.$(`.s10-word--${k}`)
    const all = WORDS.map((w) => word(w.key))
    const sub = ctx.$('.s10-sub')

    /* ---------------------------------------------------------------- theme */
    // the phrase stands alone first: larger, in the middle of the stage
    gsap.set(hero, { y: HERO.dy * U, scale: HERO.scale, transformOrigin: '50% 50%' })
    // the room: the camera lifts its eyes and comes forward as the curtain goes up
    if (!reduced) {
      gsap.set(fx, { pitch: -0.14, glow: -0.2 })
      tl.to(fx, { pitch: 0, duration: 2.8, ease: 'power3.out' }, 0)
      tl.to(fx, { travel: 46, duration: 3.1, ease: 'power3.out' }, 0)
    }
    tl.to(fx, { glow: 0.5, focusX: 0, focusY: -0.04, energy: 0.25, duration: 2.4, ease: 'power2.out' }, 0.3)

    const START: Record<WordKey, number> = { building: 0.2, ai: 0.62, for: 0.84, bharat: 0.92 }
    const FORM = 1.6
    if (dust) {
      // THE CURTAIN: the whole sheet of points lifts off the floor at once, from edge to edge
      gsap.set(dust.rise, { value: 0 })
      gsap.set(dust.shift, { value: 0 })
      tl.to(dust.rise, { value: 1, duration: 1.35, ease: 'none' }, 0.04)
      WORDS.forEach(({ key }) => {
        const el = word(key)
        const cloud = dust.form[key]
        const s = START[key]
        gsap.set(el, { autoAlpha: 0 })
        gsap.set([cloud.p, cloud.out], { value: 0 })
        tl.to(cloud.p, { value: 1, duration: FORM, ease: 'none' }, s)
        // the solid word takes over from its points, and the dust lifts off it
        tl.to(el, { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, s + FORM - 0.5)
        tl.to(cloud.out, { value: 1, duration: 0.85, ease: 'power1.in' }, s + FORM - 0.3)
      })
    } else {
      a.rise(all, 0.35, { y: 2.6, stagger: 0.24, duration: 1.05 })
    }
    a.words('.s10-sub', dust ? 2.35 : 1.7, { stagger: 0.05, duration: 0.85 })
    let t = dust ? 3.2 : 2.7
    tl.addLabel('theme', t)

    /* ----------------------------------------------- ai, bharat, building */
    const POUR = 1.3
    // three places wait under the phrase: a pale line for each word, drawn as the phrase rises
    a.rule('.s10-col-track', t + 0.45, { duration: 0.9, stagger: 0.1 })
    ORDER.forEach((key, i) => {
      const col = COLUMNS.find((c) => c.key === key)
      if (!col) return
      const root = ctx.$(`.s10-col--${key}`)
      const rule = root.querySelector('.s10-col-rule') as HTMLElement
      const last = i === ORDER.length - 1
      // the phrase rises to make room (once)
      if (i === 0) {
        tl.to(hero, { y: 0, scale: 1, duration: 1.05, ease: ease.inOut }, t)
        if (dust) tl.to(dust.shift, { value: 1, duration: 1.05, ease: ease.inOut }, t)
      }
      // this word is the one being told: the others step back
      const lit = t + (i === 0 ? 0.3 : 0)
      tl.to(
        all.filter((el) => el !== word(key)),
        { opacity: 0.24, duration: 0.55, ease: 'power2.out' },
        lit,
      )
      tl.to(word(key), { opacity: 1, duration: 0.45, ease: 'power2.out' }, lit)
      if (dust) {
        // … and so does the dust that stays around them
        for (const c of COLUMNS) tl.to(dust.motes[c.key].a, { value: c.key === key ? 1 : 0.22, duration: 0.55, ease: 'power2.out' }, lit)
      }
      tl.to(fx, { focusX: ((col.x + COL_W / 2 - 50) / 50) * 0.9, focusY: 0.3, glow: 0.42, warm: key === 'building' ? 0.25 : key === 'bharat' ? -0.25 : 0, duration: 1.5, ease: ease.inOut }, t)

      const t0 = t + (i === 0 ? 0.85 : 0.15)
      const stream = dust?.pour[key]
      if (stream) {
        // the word pours its column: the rule runs out from where the stream lands
        gsap.set([stream.p, stream.out], { value: 0 })
        // the line under the phrase steps back while the stream falls through it
        tl.to(sub, { opacity: 0.22, duration: 0.3, ease: 'power2.out' }, t0 - 0.05)
        tl.to(sub, { opacity: 1, duration: 0.55, ease: 'power1.inOut' }, t0 + POUR - 0.3)
        tl.to(stream.p, { value: 1, duration: POUR, ease: 'none' }, t0)
        gsap.set(rule, { scaleX: 0, transformOrigin: `${(stream.land * 100).toFixed(2)}% 50%` })
        tl.to(rule, { scaleX: 1, duration: POUR / 2, ease: 'none' }, t0 + POUR / 2)
        tl.to(stream.out, { value: 1, duration: 0.5, ease: 'power1.in' }, t0 + POUR - 0.42)
      } else {
        a.rule(rule, t0 + 0.2, { duration: 0.9 })
      }
      const land = stream ? t0 + POUR / 2 : t0 + 0.3
      a.words(root.querySelector('.s10-col-h'), land + 0.2, { duration: 0.8, stagger: 0.09 })
      a.rise(root.querySelector('.s10-col-line'), land + 0.42, { y: 1.1, duration: 0.8 })
      t = land + 1.3
      if (last) {
        // … and the three words stand together again, over their three columns
        tl.to(all, { opacity: 1, duration: 0.8, ease: 'power1.inOut' }, land + 0.75)
        if (dust) tl.to(COLUMNS.map((c) => dust.motes[c.key].a), { value: 1, duration: 0.8, ease: 'power1.inOut' }, land + 0.75)
        // a light settles under the three columns
        tl.to(fx, { focusX: 0, focusY: 0.42, glow: 0.52, warm: 0.05, duration: 1.4, ease: ease.inOut }, land + 0.6)
        t = land + 1.75
      }
      tl.addLabel(col.beat, t)
    })
    return tl
  },
}

export default scene
