'use client'

/**
 * Slide 50 · "Martin trains new joiners in Tamil, because Prastuti builds his decks in their language."
 *
 * THE IDEA. One screen and one room. The screen is Martin's training deck; a light leaves it
 * toward the room. In English the light fades before it reaches the people. He asks Prastuti in
 * one sentence, the English slide dissolves line by line into the ACTUAL slide Prastuti made in
 * Tamil, and now the light reaches the room.
 *
 *   english    Martin (portrait, name, role, Micro LAP · Coimbatore) and his deck, in English
 *   room       the deck turns to the room: two prints of real sessions arrive; the screen's light
 *              stops short of them, the English lines go pale. The point is language, not people.
 *   prastuti   alone with the deck again: his request types itself, and the English slide
 *              dissolves, line by line, into the real Tamil slide
 *   tamil      the real Tamil slide faces the room: two more prints, the light reaches them
 *   scale      the banner: Martin is one of 2,469 colleagues, 25,289 decks; both numbers count
 *
 * REAL: the Tamil slide (a screenshot, whole, undistorted, in the kit's LaptopFrame) and the four
 * classroom photographs (cropped only, smaller than their pixels, as prints with white borders).
 * GENERATED: Martin's portrait, a stand-in until his own photograph arrives (GEN.md).
 * DRAWN: the English slide: three phrases of the pack, everything else grey lines.
 */

import gsap from 'gsap'
import { anim, Card, Count, gen, Headline, LaptopFrame, Pic, Words, type SceneModule } from '../../kit'
import { BANNER, ENGLISH, FLAME, INTRO, MARK, PERSON, PROMPT, RESULT, ROOM, STEPS, TAMIL } from './data'
import './scene.css'

const PORTRAIT = gen(50, PERSON.photo)

const Step = ({ i }: { i: number }) => {
  const s = STEPS[i]
  return (
    <div className={`s50-top s50-top--${s.key}`} data-step={s.key}>
      <span className="s50-step-n">{s.n}</span>
      <span className="s50-step-label">{s.label}</span>
      <h2 className="s50-title">
        <Words text={s.title} />
      </h2>
    </div>
  )
}

const Print = ({ which, className }: { which: keyof typeof ROOM; className: string }) => {
  const p = ROOM[which]
  return (
    <figure className={`s50-print ${className}`}>
      <div className="s50-print-in">
        <Pic src={p.src} ratio={p.ratio} fit="contain" alt={p.alt} />
      </div>
    </figure>
  )
}

const scene: SceneModule = {
  beats: ['english', 'room', 'prastuti', 'tamil', 'scale'],
  preload: [PORTRAIT, TAMIL.src, ROOM.back.src, ROOM.board.src, ROOM.screen.src, ROOM.group.src],

  Scene: ({ slide }) => (
    <div className="s50">
      <Headline text={slide.title} flame={FLAME} />

      {/* Martin */}
      <Card className="s50-person">
        <div className="s50-portrait">
          <img src={PORTRAIT} alt="" draggable={false} decoding="async" />
        </div>
        <b className="s50-name">{PERSON.name}</b>
        <span className="s50-role">{PERSON.role}</span>
        <span className="s50-unit">{PERSON.unit}</span>
        <span className="s50-person-rule" aria-hidden="true" />
        <p className="s50-person-line">{PERSON.line}</p>
      </Card>

      {/* the line above the screen: what his training is, then the three steps in turn */}
      <p className="s50-top s50-top--intro">
        <Words text={INTRO.text} bold={[...INTRO.bold]} />
      </p>
      <Step i={0} />
      <Step i={1} />
      <Step i={2} />

      {/* the light that leaves the screen for the room */}
      <span className="s50-beam s50-beam--short" aria-hidden="true" />
      <span className="s50-beam s50-beam--full" aria-hidden="true" />
      <span className="s50-halo" aria-hidden="true" />

      {/* his request */}
      <div className="s50-bubble">
        <span className="s50-bubble-tail" aria-hidden="true" />
        <p className="s50-prompt" aria-label={PROMPT}>
          {PROMPT.split(' ').map((word, w) => (
            <span className="s50-pw" key={w} aria-hidden="true">
              {Array.from(word).map((ch, c) => (
                <span className="s50-ch" key={c}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>
      </div>

      {/* the screen: the real Tamil slide, and over it the English slide it replaces */}
      <div className="s50-desk">
        <div className="s50-desk-in">
          <LaptopFrame className="s50-laptop" src={TAMIL.src} alt={TAMIL.alt} ratio={TAMIL.ratio} width={43}>
            <div className="s50-en" aria-hidden="true">
              <div className="s50-band s50-band--head">
                <span className="s50-band-bg" />
                <div className="s50-band-in">
                  <i className="s50-en-bar" />
                  <i className="s50-en-line s50-en-line--title" />
                  <i className="s50-en-line s50-en-line--sub" />
                </div>
              </div>
              {ENGLISH.map((label, i) => (
                <div className={`s50-band s50-band--row s50-band--r${i + 1}`} key={label}>
                  <span className="s50-band-bg" />
                  <div className="s50-band-in">
                    <i className="s50-en-dot" />
                    <b className="s50-en-word">{label}</b>
                    <i className="s50-en-line s50-en-line--a" />
                    <i className="s50-en-line s50-en-line--b" />
                  </div>
                </div>
              ))}
              <div className="s50-band s50-band--foot">
                <span className="s50-band-bg" />
                <div className="s50-band-in">
                  <i className="s50-en-line s50-en-line--foot" />
                </div>
              </div>
              <span className="s50-sheen" />
            </div>
          </LaptopFrame>
          <span className="s50-mark">
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 1.5l1.9 5.1 5.1 1.9-5.1 1.9L10 15.5l-1.9-5.1L3 8.5l5.1-1.9z" />
              <path d="M16 13.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" />
            </svg>
            {MARK}
          </span>
        </div>
      </div>

      {/* the room: prints of real sessions */}
      <Print which="back" className="s50-print--b1" />
      <Print which="board" className="s50-print--b2" />
      <Print which="screen" className="s50-print--a1" />
      <Print which="group" className="s50-print--a2" />

      {/* under the screen: the result's line, then the banner */}
      <p className="s50-result">
        <Words text={RESULT.text} bold={[...RESULT.bold]} />
      </p>
      <div className="s50-banner">
        <p>
          {BANNER.a}
          <b className="s50-banner-navy">
            <Count className="s50-n1" to={BANNER.colleagues} />
            {BANNER.b}
          </b>
          {BANNER.c}
          <b className="s50-banner-flame">
            <Count className="s50-n2" to={BANNER.decks} />
            {BANNER.d}
          </b>
          {BANNER.e}
        </p>
      </div>
    </div>
  ),

  build(ctx) {
    const { ease, U } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const calm = ctx.reduced

    /** The screen stands in the middle when Martin is alone with it, and steps left to face the room. */
    const desk = ctx.$('.s50-desk')
    const MID = calm ? 0 : U * 13.2
    gsap.set(desk, { x: MID })
    const travel = (x: number, at: number) => {
      if (!calm) tl.to(desk, { x, duration: 1.0, ease: ease.inOut }, at)
    }

    /** One of the lines above the screen: its number lands, its label and its title follow. */
    const top = (key: string, at: number) => {
      const q = (s: string) => ctx.$$(`.s50-top--${key} ${s}`)
      a.pop(q('.s50-step-n'), at)
      a.rise(q('.s50-step-label'), at + 0.08, { y: 0, x: -1.2 })
      a.words(q('.s50-title'), at + 0.16, { stagger: 0.035 })
    }
    const untop = (key: string, at: number) => a.leave(`.s50-top--${key}`, at, { y: 0.7 })

    /* ------------------------------------------------------------------ english */
    a.words('.kn-h', 0.1)
    a.rise('.s50-person', 0.5, { y: 2.2, duration: 0.9 })
    a.pop('.s50-portrait', 0.8, { from: 0.82 })
    a.rise('.s50-name, .s50-role, .s50-unit', 1.0, { y: 1, stagger: 0.09 })
    a.rule('.s50-person-rule', 1.35, { from: 'center', duration: 0.6 })
    a.rise('.s50-person-line', 1.45, { y: 1 })
    a.rise('.s50-desk-in', 0.9, { y: 2.4, scale: 0.97, duration: 1.0 })
    a.rise('.s50-band-in', 1.5, { y: 0.8, stagger: 0.1, duration: 0.6 })
    a.words('.s50-top--intro', 1.9, { stagger: 0.03, duration: 0.6 })
    tl.to(fx, { glow: 0.3, focusX: 0.2, focusY: 0.15, duration: 1.6, ease: ease.inOut }, 0.6)
    tl.addLabel('english')

    /* --------------------------------------------------------------------- room */
    const t2 = tl.duration() + 0.05
    untop('intro', t2)
    travel(0, t2)
    top('challenge', t2 + 0.3)
    a.rise('.s50-print--b1', t2 + 0.7, { y: 2.2, scale: 0.96, duration: 0.9 })
    a.rise('.s50-print--b2', t2 + 0.95, { y: 2.2, scale: 0.96, duration: 0.9 })
    // the light leaves the screen and gives out before the room
    const short = ctx.$('.s50-beam--short')
    gsap.set(short, calm ? { autoAlpha: 0 } : { autoAlpha: 0, scaleX: 0.2, transformOrigin: '0% 50%' })
    tl.to(short, { autoAlpha: 1, scaleX: 1, duration: 1.3, ease: ease.glide }, t2 + 1.3)
    // and the English lines go pale
    tl.to(ctx.$$('.s50-en-word'), { color: '#b3bccc', duration: 0.9, ease: 'power1.inOut' }, t2 + 1.5)
    tl.to(ctx.$$('.s50-en-dot, .s50-en-bar'), { backgroundColor: '#ccd3df', duration: 0.9, ease: 'power1.inOut' }, t2 + 1.5)
    tl.to(fx, { focusX: 0.3, glow: 0.18, warm: -0.3, duration: 1.6, ease: ease.inOut }, t2)
    tl.addLabel('room')

    /* ----------------------------------------------------------------- prastuti */
    const t3 = tl.duration() + 0.05
    untop('challenge', t3)
    tl.to(short, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, t3)
    a.leave('.s50-print--b2', t3, { y: 1.2 })
    a.leave('.s50-print--b1', t3 + 0.08, { y: 1.2 })
    travel(MID, t3 + 0.15)
    top('turn', t3 + 0.45)
    tl.to(fx, { focusX: 0.2, glow: 0.4, warm: 0.3, duration: 1.4, ease: ease.inOut }, t3)

    // the request: its bubble opens from Martin's side, and the sentence types itself
    const bubble = ctx.$('.s50-bubble')
    const chars = ctx.$$('.s50-ch')
    gsap.set(bubble, calm ? { autoAlpha: 0 } : { autoAlpha: 0, scale: 0.86, x: -U * 0.8, transformOrigin: '0% 50%' })
    gsap.set(chars, { autoAlpha: 0 })
    tl.to(bubble, { autoAlpha: 1, scale: 1, x: 0, duration: 0.55, ease: calm ? 'power1.out' : ease.snap }, t3 + 1.05)
    const typeAt = t3 + 1.45
    const perChar = calm ? 0 : 0.032
    tl.to(chars, { autoAlpha: 1, duration: calm ? 0.4 : 0.02, stagger: perChar, ease: 'none' }, typeAt)
    const typed = typeAt + chars.length * perChar + 0.3

    // the answer: a light passes over the page and the English slide gives way, line by line,
    // to the slide Prastuti really made
    const sheen = ctx.$('.s50-sheen')
    if (calm) {
      gsap.set(sheen, { autoAlpha: 0 })
    } else {
      gsap.set(sheen, { yPercent: -120, autoAlpha: 0 })
      tl.to(sheen, { autoAlpha: 1, duration: 0.2 }, typed)
      tl.to(sheen, { yPercent: 420, duration: 2.3, ease: 'power1.inOut' }, typed)
      tl.to(sheen, { autoAlpha: 0, duration: 0.3 }, typed + 2.0)
    }
    ctx.$$('.s50-band').forEach((band, i) => {
      const t = typed + 0.3 + i * 0.34
      const inner = Array.from(band.querySelectorAll('.s50-band-in'))
      const bg = Array.from(band.querySelectorAll('.s50-band-bg'))
      tl.to(inner, { autoAlpha: 0, x: calm ? 0 : U * 0.7, duration: 0.4, ease: 'power2.in' }, t)
      tl.to(bg, { autoAlpha: 0, duration: 0.6, ease: 'power1.inOut' }, t + 0.25)
    })
    a.pop('.s50-mark', typed + 0.3 + 5 * 0.34 + 0.55, { from: 0.7 })
    tl.addLabel('prastuti')

    /* -------------------------------------------------------------------- tamil */
    const t4 = tl.duration() + 0.05
    untop('turn', t4)
    a.leave('.s50-bubble', t4, { y: 0.9 })
    travel(0, t4 + 0.1)
    top('result', t4 + 0.4)
    a.rise('.s50-print--a1', t4 + 0.8, { y: 2.2, scale: 0.96, duration: 0.9 })
    a.rise('.s50-print--a2', t4 + 1.05, { y: 2.2, scale: 0.96, duration: 0.9 })
    // now the light crosses the whole way and the room is lit
    const full = ctx.$('.s50-beam--full')
    const halo = ctx.$('.s50-halo')
    gsap.set(full, calm ? { autoAlpha: 0 } : { autoAlpha: 0, scaleX: 0.2, transformOrigin: '0% 50%' })
    gsap.set(halo, { autoAlpha: 0 })
    tl.to(full, { autoAlpha: 1, scaleX: 1, duration: 1.3, ease: ease.glide }, t4 + 1.3)
    tl.to(halo, { autoAlpha: 1, duration: 1.2, ease: 'power1.out' }, t4 + 1.9)
    a.words('.s50-result', t4 + 2.0, { stagger: 0.03, duration: 0.6 })
    tl.to(fx, { focusX: 0.62, focusY: 0.1, glow: 0.5, warm: 0.55, duration: 1.8, ease: ease.inOut }, t4)
    tl.addLabel('tamil')

    /* -------------------------------------------------------------------- scale */
    const t5 = tl.duration() + 0.05
    a.leave('.s50-result', t5, { y: 0.7 })
    a.rise('.s50-banner', t5 + 0.25, { y: 1.8, duration: 0.8 })
    a.count('.s50-n1', t5 + 0.5, { duration: 1.3 })
    a.count('.s50-n2', t5 + 0.7, { duration: 1.6 })
    tl.to(fx, { focusX: 0.25, focusY: 0.62, glow: 0.46, warm: 0.6, duration: 1.6, ease: ease.inOut }, t5)
    tl.addLabel('scale')
    return tl
  },
}

export default scene
