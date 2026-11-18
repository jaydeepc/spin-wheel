'use client'

/**
 * Slide 50 · "Martin trains new joiners in Tamil, because Prastuti builds his decks in their language."
 *
 * THE IDEA. It is the same room twice: what changes it is one sentence typed to Prastuti. So the
 * slide is played as that sentence and its answer.
 *
 *   challenge   the headline; Martin's card; step 1 and the room as it is today: lost
 *   turn        step 2: Martin's request types itself into its bubble, and Prastuti answers by
 *               building the deck in front of us: its Tamil title, then the three questions, tile
 *               by tile, under a light that passes over the page
 *   result      step 3: the SAME photograph arrives on the right, and a light wipes across it:
 *               the same room, the same people, now with their hands up
 *   scale       the banner: Martin is one of 2,469 colleagues, 25,289 decks; both numbers count
 *
 * The two classroom photographs are the deck's files, whole, at their own ratio and smaller than
 * their pixels. The deck's placeholders ("Martin's photo goes here", "Martin's quote goes here")
 * are not shown: the card carries an empty portrait frame with Martin's initial, tagged
 * "Photo to come", and no quote. Tamil is set whole (never split) in var(--kn-font-indic).
 */

import gsap from 'gsap'
import { anim, Card, Count, Headline, Pic, pic, Words, type SceneModule } from '../../kit'
import { BANNER, DECK, FLAME, PERSON, PHOTO, PROMPT, STEPS } from './data'
import './scene.css'

const Arrow = ({ className }: { className: string }) => (
  <svg className={`s50-arrow ${className}`} viewBox="0 0 40 20" fill="none" aria-hidden="true">
    <path d="M3 10h31" />
    <path d="M27 3.5 34.5 10 27 16.5" />
  </svg>
)

const StepHead = ({ i }: { i: number }) => {
  const s = STEPS[i]
  return (
    <>
      <div className="s50-step" data-step={s.key}>
        <span className="s50-step-n">{s.n}</span>
        <span className="s50-step-label">{s.label}</span>
      </div>
      <h2 className="s50-title">
        <Words text={s.title} />
      </h2>
    </>
  )
}

const scene: SceneModule = {
  beats: ['challenge', 'turn', 'result', 'scale'],
  preload: [pic(50, PHOTO.before), pic(50, PHOTO.after)],

  Scene: ({ slide }) => (
    <div className="s50">
      <Headline text={slide.title} flame={FLAME} />

      {/* Martin */}
      <Card className="s50-person">
        <div className="s50-portrait" aria-hidden="true">
          <span className="s50-portrait-ring" />
          <span className="s50-portrait-initial">{PERSON.name.charAt(0)}</span>
        </div>
        <span className="s50-portrait-tag">{PERSON.photoTag}</span>
        <b className="s50-name">{PERSON.name}</b>
        <span className="s50-role">{PERSON.role}</span>
        <span className="s50-unit">{PERSON.unit}</span>
        <span className="s50-person-rule" aria-hidden="true" />
        <p className="s50-person-line">{PERSON.line}</p>
      </Card>

      {/* 1 · the challenge */}
      <section className="s50-col s50-col--1">
        <StepHead i={0} />
        <figure className="s50-photo s50-photo--before">
          <Pic n={50} name={PHOTO.before} ratio={PHOTO.ratio} fit="contain" alt={PHOTO.beforeAlt} />
        </figure>
        <p className="s50-text">
          <Words text={STEPS[0].text} bold={[...STEPS[0].bold]} />
        </p>
      </section>

      <Arrow className="s50-arrow--1" />

      {/* 2 · the turn */}
      <section className="s50-col s50-col--2">
        <StepHead i={1} />
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
        <div className="s50-deck">
          <span className="s50-sheen" aria-hidden="true" />
          <div className="s50-deck-head">
            <span className="s50-deck-bar" aria-hidden="true" />
            <span className="s50-deck-mask">
              <span className="s50-deck-title" lang="ta">
                {DECK.title}
              </span>
            </span>
          </div>
          <div className="s50-tiles">
            {DECK.tiles.map((t) => (
              <div className="s50-tile" data-tone={t.tone} key={t.label}>
                <span className="s50-tile-ghost" aria-hidden="true" />
                <span className="s50-tile-frame" aria-hidden="true" />
                <span className="s50-tile-mask">
                  <span className="s50-tile-word" lang="ta">
                    {t.tamil}
                  </span>
                </span>
                <span className="s50-tile-label">{t.label}</span>
              </div>
            ))}
          </div>
          <span className="s50-mark">{DECK.mark}</span>
        </div>
      </section>

      <Arrow className="s50-arrow--2" />

      {/* 3 · the result: the same room */}
      <section className="s50-col s50-col--3">
        <StepHead i={2} />
        <figure className="s50-photo s50-photo--after">
          <Pic className="s50-was" n={50} name={PHOTO.before} ratio={PHOTO.ratio} fit="contain" alt="" />
          <Pic className="s50-now" n={50} name={PHOTO.after} ratio={PHOTO.ratio} fit="contain" alt={PHOTO.afterAlt} />
          <span className="s50-edge" aria-hidden="true" />
        </figure>
        <p className="s50-text">
          <Words text={STEPS[2].text} bold={[...STEPS[2].bold]} />
        </p>
      </section>

      {/* the banner */}
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
    const col = (i: number, sel: string) => ctx.$$(`.s50-col--${i} ${sel}`)

    /**
     * A step's head: its number pops, its label and its title follow. Steps 2 and 3 are on the
     * page from the first rest, quiet (the road ahead); a step's own beat lights it.
     */
    const QUIET = 0.34
    const head = (i: number, t: number) => {
      const n = col(i, '.s50-step-n')
      const label = col(i, '.s50-step-label')
      if (i === 1) {
        a.pop(n, t)
        a.rise(label, t + 0.08, { y: 0, x: -1.2 })
      } else {
        tl.to(n, { autoAlpha: 1, scale: calm ? 1 : 1.22, duration: 0.2, ease: 'power2.out' }, t)
        if (!calm) tl.to(n, { scale: 1, duration: 0.5, ease: ease.snap }, t + 0.2)
        tl.to(label, { autoAlpha: 1, duration: 0.4 }, t + 0.05)
      }
      a.words(col(i, '.s50-title'), t + 0.18, { stagger: 0.035 })
    }
    const ahead = [2, 3].flatMap((i) => [...col(i, '.s50-step-n'), ...col(i, '.s50-step-label')])
    gsap.set(ahead, { autoAlpha: 0 })

    /* ---------------------------------------------------------------- challenge */
    a.words('.kn-h', 0.1)
    a.rise('.s50-person', 0.5, { y: 2.2, duration: 0.9 })
    a.pop('.s50-portrait', 0.8, { from: 0.8 })
    a.fade('.s50-portrait-tag', 1.2)
    a.rise('.s50-name, .s50-role, .s50-unit', 1.0, { y: 1, stagger: 0.09 })
    a.rule('.s50-person-rule', 1.35, { from: 'center', duration: 0.6 })
    a.rise('.s50-person-line', 1.45, { y: 1 })
    head(1, 1.2)
    a.rise('.s50-photo--before', 1.55, { y: 2, scale: 0.97, duration: 0.9 })
    a.words(col(1, '.s50-text'), 2.0, { stagger: 0.025, duration: 0.55 })
    tl.to(ahead, { autoAlpha: QUIET, duration: 0.6, stagger: 0.07, ease: 'power1.out' }, 1.9)
    tl.to(fx, { glow: 0.3, focusX: -0.32, focusY: 0.15, warm: -0.15, duration: 1.6, ease: ease.inOut }, 0.6)
    tl.addLabel('challenge')

    /* --------------------------------------------------------------------- turn */
    const t2 = tl.duration() + 0.05
    a.draw('.s50-arrow--1 path', t2, { duration: 0.45, stagger: 0.12 })
    head(2, t2 + 0.15)
    tl.to(fx, { focusX: 0.22, focusY: 0.2, glow: 0.42, warm: 0.3, duration: 1.4, ease: ease.inOut }, t2)

    // the request: its bubble opens from its tail, and the sentence types itself
    const bubble = ctx.$('.s50-bubble')
    const chars = ctx.$$('.s50-ch')
    gsap.set(bubble, calm ? { autoAlpha: 0 } : { autoAlpha: 0, scale: 0.86, y: U * 0.6, transformOrigin: '12% 100%' })
    gsap.set(chars, { autoAlpha: 0 })
    tl.to(bubble, { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: calm ? 'power1.out' : ease.snap }, t2 + 0.55)
    const typeAt = t2 + 0.95
    const perChar = calm ? 0 : 0.032
    tl.to(chars, { autoAlpha: 1, duration: calm ? 0.4 : 0.02, stagger: perChar, ease: 'none' }, typeAt)
    const typed = typeAt + chars.length * perChar + 0.25

    // the answer: Prastuti builds the deck
    const deck = ctx.$('.s50-deck')
    const sheen = ctx.$('.s50-sheen')
    const tiles = ctx.$$('.s50-tile')
    gsap.set(deck, calm ? { autoAlpha: 0 } : { autoAlpha: 0, y: U * 2, scale: 0.97, transformOrigin: '50% 0%' })
    tl.to(deck, { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: ease.out }, typed)
    // first the page as it is being made: the three places are there, empty
    const ghosts = ctx.$$('.s50-tile-ghost')
    gsap.set(ghosts, { autoAlpha: 0 })
    tl.to(ghosts, { autoAlpha: 1, duration: 0.4, stagger: 0.08 }, typed + 0.25)
    if (!calm) {
      gsap.set(sheen, { xPercent: -130, autoAlpha: 0 })
      tl.to(sheen, { autoAlpha: 1, duration: 0.2 }, typed + 0.45)
      tl.to(sheen, { xPercent: 330, duration: 1.9, ease: 'power1.inOut' }, typed + 0.45)
      tl.to(sheen, { autoAlpha: 0, duration: 0.3 }, typed + 2.05)
    } else {
      gsap.set(sheen, { autoAlpha: 0 })
    }
    // the title, in Tamil, whole
    a.rule('.s50-deck-bar', typed + 0.55, { from: 'top', duration: 0.45 })
    const title = ctx.$('.s50-deck-title')
    gsap.set(title, calm ? { autoAlpha: 0 } : { yPercent: 115 })
    tl.to(title, calm ? { autoAlpha: 1, duration: 0.5 } : { yPercent: 0, duration: 0.75, ease: ease.out }, typed + 0.7)
    // the three questions, one after another
    tiles.forEach((tile, i) => {
      const t = typed + 1.15 + i * 0.36
      const q = (s: string) => Array.from(tile.querySelectorAll(s))
      gsap.set(q('.s50-tile-frame'), calm ? { autoAlpha: 0 } : { autoAlpha: 0, scale: 0.9 })
      tl.to(q('.s50-tile-frame'), { autoAlpha: 1, scale: 1, duration: 0.55, ease: calm ? 'power1.out' : ease.snap }, t)
      tl.to(q('.s50-tile-ghost'), { autoAlpha: 0, duration: 0.3 }, t + 0.1)
      gsap.set(q('.s50-tile-word'), calm ? { autoAlpha: 0 } : { yPercent: 115 })
      tl.to(q('.s50-tile-word'), calm ? { autoAlpha: 1, duration: 0.5 } : { yPercent: 0, duration: 0.65, ease: ease.out }, t + 0.12)
      gsap.set(q('.s50-tile-label'), { autoAlpha: 0, y: calm ? 0 : U * 0.5 })
      tl.to(q('.s50-tile-label'), { autoAlpha: 1, y: 0, duration: 0.5 }, t + 0.3)
    })
    a.fade('.s50-mark', typed + 1.15 + tiles.length * 0.36 + 0.25)
    tl.addLabel('turn')

    /* ------------------------------------------------------------------- result */
    const t3 = tl.duration() + 0.05
    a.draw('.s50-arrow--2 path', t3, { duration: 0.45, stagger: 0.12 })
    head(3, t3 + 0.15)
    tl.to(fx, { focusX: 0.72, focusY: 0.12, glow: 0.5, warm: 0.5, duration: 1.6, ease: ease.inOut }, t3)
    // the same room arrives as it was …
    a.rise('.s50-photo--after', t3 + 0.5, { y: 2, scale: 0.97, duration: 0.8 })
    // … and one pass of light turns it into the room it became
    const now = ctx.$('.s50-now')
    const edge = ctx.$('.s50-edge')
    const frame = ctx.loc(ctx.$('.s50-photo--after'))
    const wipeAt = t3 + 1.45
    if (calm) {
      gsap.set(now, { autoAlpha: 0 })
      gsap.set(edge, { autoAlpha: 0 })
      tl.to(now, { autoAlpha: 1, duration: 0.9, ease: 'power1.inOut' }, wipeAt)
    } else {
      gsap.set(now, { clipPath: 'inset(0% 100% 0% 0%)' })
      gsap.set(edge, { autoAlpha: 0, x: 0 })
      tl.to(now, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'power2.inOut' }, wipeAt)
      tl.to(edge, { x: frame.w, duration: 1.5, ease: 'power2.inOut' }, wipeAt)
      tl.to(edge, { autoAlpha: 1, duration: 0.25 }, wipeAt)
      tl.to(edge, { autoAlpha: 0, duration: 0.3 }, wipeAt + 1.2)
    }
    a.words(col(3, '.s50-text'), wipeAt + 0.9, { stagger: 0.025, duration: 0.55 })
    tl.addLabel('result')

    /* -------------------------------------------------------------------- scale */
    const t4 = tl.duration() + 0.05
    a.rise('.s50-banner', t4, { y: 1.8, duration: 0.8 })
    a.count('.s50-n1', t4 + 0.25, { duration: 1.3 })
    a.count('.s50-n2', t4 + 0.45, { duration: 1.6 })
    tl.to(fx, { focusX: 0.25, focusY: 0.62, glow: 0.46, warm: 0.6, duration: 1.6, ease: ease.inOut }, t4)
    tl.addLabel('scale')
    return tl
  },
}

export default scene
