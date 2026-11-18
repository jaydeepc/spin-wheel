'use client'

/**
 * Slide 59 · "Six pillars turn open models into in-house AI"
 *
 * THE IDEA. The headline is a building, so it is built. A ground slab comes in: "open models",
 * what everybody can have. Six piers of pale stone rise out of it, each with a band of flame at
 * its head and its own words on its face: the title, the promise, and last and quieter the
 * names of the technology for the experts in the room. Then the beam comes down and lies on all
 * six: "in-house AI". Take one pier away and it would not lie level.
 *
 *   compute   the slab; then GPU hardware, GPU virtualization, Scheduling & scaling rise
 *   serving   Model management, Inference runtime, Observability rise
 *   house     the beam lands on the six; their heads take the load and glow
 *
 * The stone is real (structure.ts: a scene-owned canvas in the stage's own space; the piers'
 * faces lie in the stage's plane, so the DOM's words sit on them exactly, and they come up
 * through the slab's surface behind a clipping plane). Without WebGL the same piers, slab and
 * beam are flat DOM plates (.s59-plate) that make the same moves.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Headline, Words, type SceneModule } from '../../kit'
import { colX, GROUND_WORDS, L, PILLARS, RISE, ROOF_WORDS, techLines } from './data'
import { Icon } from './icons'
import { makeStructure, type Structure } from './structure'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${n})`

/** A phrase of the headline, as the headline has it (never retyped). */
const cut = (title: string, phrase: string) => {
  const i = title.toLowerCase().indexOf(phrase.toLowerCase())
  return i < 0 ? phrase : title.slice(i, i + phrase.length)
}

const scene: SceneModule = {
  beats: ['compute', 'serving', 'house'],

  Scene: ({ slide }) => (
    <div
      className="s59"
      style={
        {
          '--s59-col-w': u(L.colW),
          '--s59-col-top': u(L.roofBot),
          '--s59-col-h': u(L.baseTop - L.roofBot),
          '--s59-cap': u(L.capH),
          '--s59-roof-top': u(L.roofTop),
          '--s59-roof-h': u(L.roofBot - L.roofTop),
          '--s59-base-top': u(L.baseTop),
          '--s59-base-h': u(L.baseBot - L.baseTop),
          '--s59-slab-x': u(L.slabX0),
          '--s59-slab-w': u(L.slabX1 - L.slabX0),
        } as CSSProperties
      }
    >
      <Headline text={slide.title} />

      <div className="s59-slab s59-roof">
        <span className="s59-plate s59-plate--navy" aria-hidden="true" />
        <b className="s59-slab-t s59-roof-t">
          <Words text={cut(slide.title, ROOF_WORDS)} />
        </b>
      </div>

      {PILLARS.map((p, i) => (
        <div className="s59-col" key={p.key} style={{ left: u(colX(i)) }}>
          {i >= 3 ? <span className="s59-ghost" aria-hidden="true" /> : null}
          <div className="s59-clip">
            <div className="s59-ride">
              <span className="s59-plate s59-plate--stone" aria-hidden="true" />
              <span className="s59-sheen" aria-hidden="true" />
              <span className="s59-glint" aria-hidden="true" style={{ animationDelay: `${i * 0.55}s` }} />
              <span className="s59-tile">
                <Icon name={p.icon} />
              </span>
            </div>
          </div>
          <div className="s59-copy">
            <h3 className="s59-title">
              <Words text={p.title} />
            </h3>
            <p className="s59-line">
              <Words text={p.line} />
            </p>
            <span className="s59-rule" aria-hidden="true" />
            <p className="s59-tech">
              {techLines(p).map((line, k, all) => (
                <span className={all.length > 1 ? 's59-tech-l' : undefined} key={line}>
                  {line}
                </span>
              ))}
            </p>
          </div>
        </div>
      ))}

      <div className="s59-slab s59-base">
        <span className="s59-plate s59-plate--navy" aria-hidden="true" />
        <b className="s59-slab-t s59-base-t">
          <Words text={cut(slide.title, GROUND_WORDS)} />
        </b>
      </div>
    </div>
  ),

  three(ctx) {
    const st = makeStructure(ctx, PILLARS.length)
    ctx.bag.st = st
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      st.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const st = ctx.bag.st as Structure | undefined
    const cols = ctx.$$('.s59-col')
    const q = (el: Element, s: string) => Array.from(el.querySelectorAll(s))

    /* ---- starting states ---- */
    const basePlate = ctx.$('.s59-base .s59-plate')
    const roofPlate = ctx.$('.s59-roof .s59-plate')
    // both slabs arrive out of the air close to their seats: neither crosses the chrome, the
    // headline or Back / Next on its way
    const BASE_FROM = 3
    const ROOF_FROM = 3
    const ROOF_NEAR = 6
    const ghosts = ctx.$$('.s59-ghost')
    const glints = ctx.$$('.s59-glint')
    gsap.set(ghosts, { autoAlpha: 0 })
    gsap.set(glints, { autoAlpha: 0 })
    gsap.set([basePlate, roofPlate], { autoAlpha: 0 })
    if (st) {
      st.baseMat.opacity = 0
      st.roofMat.opacity = 0
    }
    if (reduced) {
      gsap.set(ctx.$$('.s59-ride'), { autoAlpha: 0 })
      if (st) {
        for (const p of st.piers) {
          p.group.position.y = 0
          p.group.visible = false
        }
      }
    } else {
      gsap.set(basePlate, { y: BASE_FROM * U })
      gsap.set(roofPlate, { y: -ROOF_FROM * U })
      gsap.set(ctx.$$('.s59-ride'), { y: RISE * U })
      if (st) {
        st.base.position.y = -BASE_FROM
        st.roof.position.y = ROOF_FROM
        st.roof.position.z = ROOF_NEAR
        st.roof.rotation.z = 0.008
        for (const p of st.piers) p.group.position.y = -RISE
      }
    }

    /** Pier i rises, starting at t; its words follow. Returns when it rests. */
    const raise = (i: number, t: number): number => {
      const col = cols[i]
      const D = 1.45
      if (reduced) {
        if (st) tl.set(st.piers[i].group, { visible: true }, t)
        tl.to(q(col, '.s59-ride'), { autoAlpha: 1, duration: 0.5 }, t)
      } else {
        if (st) tl.to(st.piers[i].group.position, { y: 0, duration: D, ease: ease.out }, t)
        tl.to(q(col, '.s59-ride'), { y: 0, duration: D, ease: ease.out }, t)
      }
      if (i >= 3) {
        // the plan is built: its outline and its socket give way to the stone
        tl.to(ghosts[i - 3], { autoAlpha: 0, duration: 0.5, ease: 'power1.out' }, t + 0.1)
        if (st) tl.to(st.sockets[i], { opacity: 0, duration: 0.5, ease: 'power1.out' }, t + 0.25)
      }
      if (st) {
        const p = st.piers[i]
        tl.to(p.foot, { opacity: 0.3, duration: 0.9, ease: 'power1.out' }, t + 0.2)
        // as it comes to a stand its head takes the light for a moment
        tl.to(p.cap, { emissiveIntensity: 0.9, duration: 0.25, ease: 'power2.out' }, t + 0.7)
        tl.to(p.cap, { emissiveIntensity: 0, duration: 0.9, ease: 'power2.inOut' }, t + 0.95)
      }
      // title, promise, and last and quieter the technology
      a.words(q(col, '.s59-title'), t + 0.72, { stagger: 0.05 })
      a.words(q(col, '.s59-line'), t + 0.92, { stagger: 0.035, duration: 0.6 })
      a.rule(q(col, '.s59-rule'), t + 1.1, { duration: 0.7 })
      a.fade(q(col, '.s59-tech'), t + 1.3, { duration: 0.7 })
      return t + 2.0
    }

    /* ------------------------------------------------------------ compute */
    a.words('.kn-h', 0.1)
    if (st) tl.to(st.baseMat, { opacity: 1, duration: 0.45, ease: 'power1.out' }, 0.25)
    tl.to(basePlate, { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }, 0.25)
    if (!reduced) {
      if (st) tl.to(st.base.position, { y: 0, duration: 1.0, ease: ease.out }, 0.25)
      tl.to(basePlate, { y: 0, duration: 1.0, ease: ease.out }, 0.25)
    }
    a.words('.s59-base-t', 0.95, { stagger: 0.08 })
    tl.to(fx, { glow: 0.3, focusX: -0.45, focusY: 0.35, duration: 1.6, ease: ease.inOut }, 0.4)
    let t = 0
    for (let i = 0; i < 3; i++) t = raise(i, 1.0 + i * 0.34)
    // the other half of the plan: where the next three will stand
    tl.to(ghosts, { autoAlpha: 1, duration: 0.7, stagger: 0.12, ease: 'power1.out' }, t - 1.3)
    if (st) st.sockets.slice(3).forEach((m, k) => tl.to(m, { opacity: 0.55, duration: 0.7, ease: 'power1.out' }, t - 1.3 + k * 0.12))
    tl.addLabel('compute', t)

    /* ------------------------------------------------------------ serving */
    const S = t
    tl.to(fx, { focusX: 0.45, warm: -0.15, duration: 1.6, ease: ease.inOut }, S)
    for (let i = 3; i < PILLARS.length; i++) t = raise(i, S + 0.05 + (i - 3) * 0.34)
    tl.addLabel('serving', t)

    /* -------------------------------------------------------------- house */
    const H = t
    const FALL = 0.95
    if (st) tl.to(st.roofMat, { opacity: 1, duration: 0.28, ease: 'power1.out' }, H + 0.05)
    tl.to(roofPlate, { autoAlpha: 1, duration: 0.28, ease: 'power1.out' }, H + 0.05)
    if (!reduced) {
      // it comes out of the air just over its seat, a little toward the room, and settles level
      // and heavy: slower at the end, as a crane sets a beam
      if (st) {
        tl.to(st.roof.position, { y: 0, z: 0, duration: FALL, ease: 'power3.out' }, H + 0.05)
        tl.to(st.roof.rotation, { z: 0, duration: FALL, ease: 'power2.out' }, H + 0.05)
      }
      tl.to(roofPlate, { y: 0, duration: FALL, ease: 'power3.out' }, H + 0.05)
    }
    const hit = H + 0.05 + FALL * 0.82
    if (st) {
      tl.to(st.under, { opacity: 0.2, duration: 0.5, ease: 'power1.out' }, hit - 0.2)
      // the six heads take the load together
      st.piers.forEach((p, i) => {
        const d = Math.abs(i - (PILLARS.length - 1) / 2) * 0.035
        tl.to(p.cap, { emissiveIntensity: 1.25, duration: 0.22, ease: 'power2.out' }, hit + d)
        tl.to(p.cap, { emissiveIntensity: 0.28, duration: 1.1, ease: 'power2.inOut' }, hit + d + 0.24)
      })
    }
    tl.to(fx, { glow: 0.5, focusX: 0, focusY: -0.3, warm: 0.25, energy: 0.25, duration: 1.2, ease: ease.inOut }, hit - 0.3)
    a.words('.s59-roof-t', hit + 0.12, { stagger: 0.09, duration: 0.8 })
    // the house stands: a slow light walks across the six faces for as long as the presenter stays
    tl.to(glints, { autoAlpha: 1, duration: 0.8, ease: 'power1.out' }, hit + 0.6)
    tl.addLabel('house', hit + 1.25)
    return tl
  },
}

export default scene
