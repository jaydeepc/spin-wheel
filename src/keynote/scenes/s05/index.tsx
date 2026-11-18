'use client'

/**
 * Slide 05 · "We strengthened our foundation with key milestones"
 *
 * Four dated milestones on one line of time. The headline arrives, the line draws with its
 * four stops, and then each milestone lands on its own beat:
 *
 *   sep25   Merger of Piramal Enterprises with Piramal Finance
 *   nov25   Relisting of the merged entity as Piramal Finance
 *   mar26   Domestic credit ratings upgraded to AA+
 *   aug26   ₹3,850 Cr total equity capital raised
 *
 * A landing is always the same gesture (`land` below): the flame line runs on to the stop, the
 * stop opens into its date, the card rises under it, its icon draws itself, its words come up
 * (the deck's flame words stay flame). The chevron between two cards comes in with the second
 * of them. The backdrop's light walks along with it.
 */

import gsap from 'gsap'
import type { ReactNode } from 'react'
import { anim, Card, Chip, Count, Headline, Words, type SceneModule } from '../../kit'
import { Calendar, CoinsGrowth, DocumentCheck, Handshake, RatingBadge } from './icons'
import './scene.css'

interface Milestone {
  beat: string
  date: string
  tone: 'peach' | 'ice'
  icon: ReactNode
  /** The card's words: `text` with the deck's flame words named, or a line built by hand. */
  text?: string
  flame?: string[]
  custom?: ReactNode
}

const MILESTONES: Milestone[] = [
  { beat: 'sep25', date: 'Sep-25', tone: 'peach', icon: <Handshake />, text: 'Merger of Piramal Enterprises with Piramal Finance', flame: ['Merger'] },
  { beat: 'nov25', date: 'Nov-25', tone: 'ice', icon: <DocumentCheck />, text: 'Relisting of the merged entity as Piramal Finance', flame: ['Relisting'] },
  { beat: 'mar26', date: 'Mar-26', tone: 'peach', icon: <RatingBadge />, text: 'Domestic credit ratings upgraded to AA+', flame: ['AA+'] },
  {
    beat: 'aug26',
    date: 'Aug-26',
    tone: 'ice',
    icon: <CoinsGrowth />,
    // "₹3,850 Cr total equity capital raised": the figure counts up, so its words are set by hand
    custom: (
      <>
        <span className="kn-w">
          <span className="kn-wi">
            <em className="kn-flame">
              <Count className="s05-figure" to={3850} prefix="₹" suffix=" Cr" />
            </em>
          </span>
        </span>{' '}
        <Words text="total equity capital raised" />
      </>
    ),
  },
]

const scene: SceneModule = {
  beats: MILESTONES.map((m) => m.beat),

  Scene: ({ slide }) => (
    <div className="s05">
      <Headline text={slide.title} />

      <div className="s05-track" aria-hidden="true">
        <span className="s05-track-base" />
        <span className="s05-track-fill" />
      </div>

      {MILESTONES.map((m, i) => (
        <div className="s05-col" key={m.beat} style={{ left: `calc(var(--u) * ${5.3 + i * 23})` }}>
          <span className="s05-stop" aria-hidden="true" />
          <Chip className="s05-date" tone="azure" icon={<Calendar />}>
            {m.date}
          </Chip>
          <span className="s05-stem" aria-hidden="true" />
          <Card className="s05-card">
            <span className="s05-disc" data-tone={m.tone}>
              {m.icon}
            </span>
            <p className="s05-text">{m.custom ?? <Words text={m.text ?? ''} flame={m.flame} />}</p>
          </Card>
          {i < MILESTONES.length - 1 ? (
            <span className="s05-next" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9.5 6.5 6 5.5-6 5.5" />
              </svg>
            </span>
          ) : null}
        </div>
      ))}
    </div>
  ),

  build(ctx) {
    const { ease } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const cols = ctx.$$('.s05-col')
    const fill = ctx.$('.s05-track-fill')
    // where each stop sits along the line, 0 … 1 (measured: the layout is the stylesheet's)
    const track = ctx.loc(ctx.$('.s05-track'))
    const stops = cols.map((c) => (ctx.loc(c.querySelector('.s05-stop') as Element).cx - track.x) / track.w)

    // everything starts hidden; a landing brings its own column in
    gsap.set(fill, { scaleX: 0, transformOrigin: '0% 50%' })
    gsap.set(ctx.$$('.s05-date, .s05-card, .s05-next, .s05-disc'), { autoAlpha: 0 })
    // hidden as well as undrawn: a stroke of no length with a round cap would show as a dot
    gsap.set(ctx.$$('.s05-ink, .s05-acc:not(text)'), { drawSVG: '0%', autoAlpha: 0 })
    gsap.set(ctx.$$('.s05-aa'), { autoAlpha: 0 })
    gsap.set(ctx.$$('.s05-text .kn-wi'), { yPercent: 118 })
    gsap.set(ctx.$$('.s05-stem'), { scaleY: 0, transformOrigin: '50% 0%' })

    // the headline, the line of time and its four stops
    a.words('.kn-h', 0.1)
    a.rule('.s05-track-base', 0.45, { duration: 1.1 })
    a.pop('.s05-stop', 0.75, { stagger: 0.12 })

    /** Milestone i lands, starting at time t. Returns the time at which it rests. */
    const land = (i: number, t: number): number => {
      const col = cols[i]
      const q = (s: string) => Array.from(col.querySelectorAll(s))
      const U = ctx.U
      // the flame line runs on to this stop, and the backdrop's light walks with it
      tl.to(fill, { scaleX: stops[i], duration: 0.8, ease: ease.glide }, t)
      tl.to(fx, { focusX: stops[i] * 1.6 - 0.8, focusY: -0.1, glow: 0.38, warm: i % 2 ? -0.2 : 0.12, duration: 1.2, ease: ease.inOut }, t)
      // the stop opens into its date
      const date = q('.s05-date')
      gsap.set(date, { scale: 0.3, y: 0 })
      tl.to(q('.s05-stop'), { scale: 0, autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, t + 0.45)
      tl.to(date, { autoAlpha: 1, scale: 1, duration: 0.6, ease: ease.snap }, t + 0.5)
      tl.to(q('.s05-stem'), { scaleY: 1, duration: 0.35, ease: ease.glide }, t + 0.7)
      // the card rises under it
      const card = q('.s05-card')
      gsap.set(card, { y: U * 2.4 })
      tl.to(card, { autoAlpha: 1, y: 0, duration: 0.85, ease: ease.out }, t + 0.7)
      // its icon draws itself: navy first, then the flame parts
      const disc = q('.s05-disc')
      gsap.set(disc, { scale: 0.6 })
      tl.to(disc, { autoAlpha: 1, scale: 1, duration: 0.6, ease: ease.snap }, t + 0.9)
      tl.to(q('.s05-ink'), { autoAlpha: 1, duration: 0.01, stagger: 0.07, ease: 'none' }, t + 1.0)
      tl.to(q('.s05-ink'), { drawSVG: '100%', duration: 0.85, stagger: 0.07, ease: ease.glide }, t + 1.0)
      tl.to(q('.s05-acc:not(text)'), { autoAlpha: 1, duration: 0.01, stagger: 0.08, ease: 'none' }, t + 1.5)
      tl.to(q('.s05-acc:not(text)'), { drawSVG: '100%', duration: 0.5, stagger: 0.08, ease: ease.glide }, t + 1.5)
      if (q('.s05-aa').length) tl.to(q('.s05-aa'), { autoAlpha: 1, duration: 0.4 }, t + 1.55)
      // its words
      tl.to(q('.s05-text .kn-wi'), { yPercent: 0, duration: ctx.T.word, stagger: 0.04, ease: ease.out }, t + 1.15)
      if (q('.s05-figure').length) a.count(q('.s05-figure'), t + 1.2, { duration: 1.3 })
      // the chevron between the card before and this one comes in WITH this one: it never points at an empty place
      const prev = i > 0 ? Array.from(cols[i - 1].querySelectorAll('.s05-next')) : []
      if (prev.length) {
        gsap.set(prev, { scale: 0.4 })
        tl.to(prev, { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.snap }, t + 0.55)
      }
      if (i < cols.length - 1) return t + 2.15
      // the last one: the line runs out to its end
      tl.to(fill, { scaleX: 1, duration: 0.7, ease: ease.glide }, t + 1.7)
      return t + 2.5
    }

    let t = 1.0
    MILESTONES.forEach((m, i) => {
      t = land(i, t)
      tl.addLabel(m.beat, t)
    })
    return tl
  },
}

export default scene
