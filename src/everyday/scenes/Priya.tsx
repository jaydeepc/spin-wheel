'use client'

/**
 * Meet Priya. She comes in after the opening, to explain Everyday AI through her Tuesday.
 *
 * On it, and nothing else: her photo (the one picture, large on the right), the title, her
 * role, the one line with "AI learned her job" picked out, and her own words (PRIYA.said) in
 * the voice bubble, which on this screen stands BY HER PHOTO with its tail toward her: this is
 * where the visitor learns that the bubble is Priya speaking. (The bubble is the shell's; this
 * scene's stylesheet only says where it stands: see Priya.css.)
 *
 * When the scene ends her photo irises down into the face of the voice block, at the bottom of
 * the left column, where her words are for the rest of the film.
 *
 * Held frames: ?scene=priya&at=<in|done>
 */

import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { PRIYA } from '../content'
import { PRIYA_TIME } from '../core/timing'
import { useScene } from '../core/useScene'
import { Rise } from '../moments/parts'
import './Priya.css'

export default function Priya() {
  const ref = useRef<HTMLDivElement>(null)

  useScene('priya', ref, (root, stage, E) => {
    const U = stage.U
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
    const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as unknown as T[]
    const t = gsap.timeline({ paused: true, defaults: { ease: E.out, duration: 0.7 } })

    const hero = $('.pr-hero')
    const heroZoom = $('.pr-hero-zoom')
    const heroShadow = $('.pr-hero-shadow')
    const rise = $$('.pr-say .ev-rise')
    const title = SplitText.create($('.pr-title-text'), { type: 'chars' })
    const underline = $('.pr-line em path')
    const avatar = document.querySelector('[data-ev="avatar"]') as HTMLElement | null
    const hb = stage.loc(hero)
    const rr = 1.8 * U
    const clipFull = `inset(0px 0px 0px 0px round ${rr}px)`
    const clipHidden = `inset(${hb.h}px 0px 0px 0px round ${rr}px)`

    gsap.set(rise, { yPercent: 118 })
    gsap.set(title.chars, { yPercent: 118 })
    gsap.set(hero, { clipPath: clipHidden })
    gsap.set(heroZoom, { scale: 1.22, transformOrigin: '50% 30%' })
    gsap.set(heroShadow, { autoAlpha: 0 })
    gsap.set(underline, { drawSVG: '0%' })
    // her photo is on the stage: the avatar it will become stays out until the photo lands in it
    if (avatar) gsap.set(avatar, { autoAlpha: 0 })

    // ============================================================ she comes in
    t.addLabel('start', 0)
      .to(hero, { clipPath: clipFull, duration: 1.0, ease: E.inOut }, 0)
      .to(heroZoom, { scale: 1, duration: 1.5 }, 0)
      .to(heroShadow, { autoAlpha: 1, duration: 0.7, ease: 'power1.out' }, 0.65)
      .to(title.chars, { yPercent: 0, duration: 0.9, stagger: 0.03 }, 0.12)
      .to(rise[0], { yPercent: 0 }, 0.45)
      .to(rise[1], { yPercent: 0, duration: 0.8 }, 0.58)
      .to(underline, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' }, 1.0)
    // (her words arrive last, by her photo: the shell's bubble, delayed in Priya.css)
    const tI = PRIYA_TIME.in
    t.addLabel('in', tI)

    // ============================================================ her photo irises down into her avatar
    const slot = avatar ? stage.loc(avatar) : { x: -stage.hx, y: 17.9 * U, w: 3.6 * U, h: 3.6 * U, cx: 0, cy: 0 }
    const cSide = 0.62 * hb.w
    const sAv = slot.w / cSide
    const clipAvatar = `inset(0px ${0.215 * hb.w}px ${hb.h - cSide}px ${0.165 * hb.w}px round ${cSide / 2}px)`

    t.to(rise, { yPercent: -118, duration: 0.45, ease: 'power3.in', stagger: 0.035 }, tI)
      .to(title.chars, { yPercent: -118, duration: 0.45, ease: 'power3.in', stagger: 0.014 }, tI)
      .to(underline, { autoAlpha: 0, duration: 0.2 }, tI)
      .to(heroShadow, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, tI)
      .to(hero, { x: slot.x - hb.x - sAv * 0.165 * hb.w, y: slot.y - hb.y, scale: sAv, clipPath: clipAvatar, duration: 0.95, ease: E.inOut }, tI + 0.05)
    if (avatar) t.to(avatar, { autoAlpha: 1, duration: 0.18, ease: 'none' }, tI + 0.9)
    t.to(hero, { autoAlpha: 0, duration: 0.1, ease: 'none' }, tI + 1.0)
    t.addLabel('done', tI + PRIYA_TIME.out)

    return {
      tl: t,
      stops: [
        { label: 'in', cap: PRIYA_TIME.in, hold: PRIYA_TIME.hold },
        { label: 'done', step: 'out', cap: PRIYA_TIME.out, exit: true },
      ],
    }
  })

  return (
    <div ref={ref} className="ev-scene ev-scene--priya">
      <div className="pr-say">
        <h1 className="pr-title">
          <span className="ev-mask">
            <span className="pr-title-text">{PRIYA.title}</span>
          </span>
        </h1>
        <p className="pr-role">
          <Rise>{PRIYA.role}</Rise>
        </p>
        <p className="pr-line">
          <Rise>
            {PRIYA.line.lead}
            <em>
              {PRIYA.line.em}
              <svg viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 13 C 60 5, 130 5, 180 10 S 270 15, 297 7" />
              </svg>
            </em>
            <br />
            {PRIYA.line.tail.trim()}
          </Rise>
        </p>
      </div>

      <div className="pr-hero-shadow" />
      <div className="pr-hero">
        <div className="pr-hero-float">
          <div className="pr-hero-zoom">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pr-hero-img" src={PRIYA.photo} alt="Priya, standing in her branch" draggable={false} />
          </div>
        </div>
      </div>
    </div>
  )
}
