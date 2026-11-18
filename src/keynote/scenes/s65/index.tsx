'use client'

/**
 * Slide 65 · THE ENDING: PIRAMAL MIND. Dark navy; the last scene of the keynote.
 *
 * The deck's page 65 is only "Thank You". The owner asked for this instead: one last beat where
 * everything the morning spoke about comes together, inside a mind; it opens up to say Piramal
 * Mind is engineered to hold all of this; and the keynote ends there, open for questions.
 *
 *   recall     the morning comes back: eighteen stills of the keynote's own scenes fly in from the
 *              depth of the room to a curved wall around the viewer, each with its two or three words
 *   connect    threads of light join the ones that belong together; the cards shrink to bright
 *              nodes; the camera PULLS BACK, thousands of points gather, and the cloud has a shape
 *   mind       the name lands: Piramal Mind, "Engineered to hold all of this.", and what it is in
 *              the Everyday AI film's own words: what flows in, the one memory, what it gives back
 *   questions  the mind settles; the logo, "Thank you", "Questions?". It can stand for twenty minutes.
 *
 * The 3D is in mind.ts: the timeline tweens the numbers of its state, nothing else.
 */

import type { ReactNode } from 'react'
import gsap from 'gsap'
import { anim, Kicker, Logo, Words, type SceneModule } from '../../kit'
import { CLOSE, MEMORIES, MIND, RECALL, still } from './data'
import { createMind, type Mind } from './mind'
import './scene.css'

/** Small line icons, drawn here: what flows in, what comes back. */
const ICONS_IN = [
  <path key="a" d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.6 5l-3.2 14" />,
  <g key="b">
    <path d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4z" />
    <path d="M14 8.5v7" strokeDasharray="1.6 1.9" />
  </g>,
  <g key="c">
    <path d="M4 5h10a2 2 0 012 2v4a2 2 0 01-2 2H9l-3.5 3v-3H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
    <path d="M19 10h1a2 2 0 012 2v3a2 2 0 01-2 2v2.4L17.2 17H14" />
  </g>,
]
const ICONS_OUT = [
  <g key="a">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.2V12l3.2 2" />
  </g>,
  <g key="b">
    <path d="M4 5h16v10.5H10.5L6 19.5v-4H4z" />
    <path d="M8.5 10.2h7M12.6 7.6l2.9 2.6-2.9 2.6" />
  </g>,
  <g key="c">
    <circle cx="5" cy="17.5" r="2.2" />
    <circle cx="12" cy="6.5" r="2.2" />
    <circle cx="19" cy="15.5" r="2.2" />
    <path d="M6.2 15.6l4.6-7.2M13.6 8l4 5.7" />
  </g>,
]
const Icon = ({ children }: { children: ReactNode }) => (
  <span className="s65-ico" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </span>
)

/** The rows' centres and the mind's, in --u (the third rest). */
const ROWS = [25.6, 33.2, 40.8]
const MIND_Y = 33.2
const FLOWS_IN = ROWS.map((y, i) => `M30.5 ${y} C35 ${y} 35 ${MIND_Y + (i - 1) * 2.2} 39.6 ${MIND_Y + (i - 1) * 2.2}`)
const FLOWS_OUT = ROWS.map((y, i) => `M60.4 ${MIND_Y + (i - 1) * 2.2} C65 ${MIND_Y + (i - 1) * 2.2} 65 ${y} 69.5 ${y}`)

const scene: SceneModule = {
  beats: ['recall', 'connect', 'mind', 'questions'],
  preload: MEMORIES.map((m) => still(m.n)),
  // the ending is its own room: nothing of the chrome but Back / Next
  chrome: { logo: false, rail: false, crumb: false, counter: false },

  Scene: () => (
    <div className="s65">
      {/* only where there is no WebGL: the same story, flat */}
      <div className="s65-fb" aria-hidden="true">
        <div className="s65-fb-grid">
          {MEMORIES.map((m) => (
            <figure key={m.n} className="s65-fb-card">
              <img src={still(m.n)} alt="" draggable={false} />
              <figcaption>{m.label}</figcaption>
            </figure>
          ))}
        </div>
        <i className="s65-fb-orb" />
      </div>

      <p className="s65-recall">
        <Words text={RECALL} />
      </p>

      {/* the third rest: the name, and what it is */}
      <h2 className="s65-name">
        <Words text={MIND.name} />
      </h2>
      <p className="s65-line">
        <Words text={MIND.line} flame={['all of this']} />
      </p>

      <svg className="s65-flows" viewBox="0 0 100 56.25" aria-hidden="true">
        {FLOWS_IN.map((d, i) => (
          <g key={`i${i}`}>
            <path className="s65-flow s65-flow--in" d={d} />
            <path className="s65-run s65-run--in" d={d} style={{ animationDelay: `${-i * 0.9}s` }} />
          </g>
        ))}
        {FLOWS_OUT.map((d, i) => (
          <g key={`o${i}`}>
            <path className="s65-flow s65-flow--out" d={d} />
            <path className="s65-run s65-run--out" d={d} style={{ animationDelay: `${-0.4 - i * 0.9}s` }} />
          </g>
        ))}
      </svg>

      <div className="s65-col s65-col--in">
        <div className="s65-head">
          <Kicker tone="azure">{MIND.inKicker}</Kicker>
          <span className="s65-tag">{MIND.inTag}</span>
        </div>
        {MIND.ins.map((t, i) => (
          <div key={t} className="s65-row s65-row--in" style={{ top: `calc(var(--u) * ${ROWS[i]})` }}>
            <b>{t}</b>
            <Icon>{ICONS_IN[i]}</Icon>
          </div>
        ))}
      </div>

      <div className="s65-col s65-col--out">
        <div className="s65-head">
          <Kicker tone="flame">{MIND.outKicker}</Kicker>
        </div>
        {MIND.outs.map((t, i) => (
          <div key={t} className="s65-row s65-row--out" style={{ top: `calc(var(--u) * ${ROWS[i]})` }}>
            <Icon>{ICONS_OUT[i]}</Icon>
            <span>{t}</span>
          </div>
        ))}
      </div>

      <div className="s65-mem">
        <Kicker tone="azure" block>
          {MIND.memory}
        </Kicker>
        <b>{MIND.motto}</b>
      </div>

      {/* the last rest */}
      <div className="s65-end">
        <div className="s65-logo">
          <Logo height={5.2} />
        </div>
        <p className="s65-thanks">
          <Words text={CLOSE.thanks} />
        </p>
        <p className="s65-q">
          <Words text={CLOSE.questions} />
        </p>
      </div>
      <div className="s65-sig">
        <b>{MIND.name}</b>
        <span>{MIND.promise}</span>
      </div>
    </div>
  ),

  three(ctx) {
    const mind = createMind(ctx)
    ctx.bag.mind = mind
    return mind.gl.dispose
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const mind = ctx.bag.mind as Mind | undefined
    const S = mind?.state
    const fb = !mind

    /* ---------------------------------------------------------------- 1 · recall */
    gsap.set(fx, { travel: reduced ? 0 : -55, energy: -0.2, glow: -0.2, focusX: 0, focusY: 0.1 })
    tl.to(fx, { travel: 0, duration: 3.2, ease: 'power3.out' }, 0)
    tl.to(fx, { energy: 0.15, duration: 2.4, ease: 'power2.out' }, 0.2)
    if (S) {
      tl.to(S, { arrive: 1, duration: 3.1, ease: 'none' }, 0.1)
      tl.to(S, { labels: 1, duration: 0.9, ease: 'power1.out' }, 2.35)
    } else {
      a.rise('.s65-fb-card', 0.4, { stagger: 0.07 })
    }
    a.words('.s65-recall', 1.5, { stagger: 0.08, duration: 0.95 })
    tl.addLabel('recall', 3.5)

    /* ---------------------------------------------------------------- 2 · connect */
    const t0 = 3.5
    if (S) {
      tl.to(S, { thread: 1, duration: 1.9, ease: 'power1.inOut' }, t0)
      tl.to(S, { labels: 0, duration: 0.6, ease: 'power1.in' }, t0 + 1.3)
      tl.to(S, { morph: 1, duration: 2.5, ease: 'none' }, t0 + 1.6)
      tl.to(S, { pull: 1, duration: 3.7, ease: ease.inOut }, t0 + 1.6)
      tl.to(S, { cloud: 1, duration: 3.7, ease: 'power1.out' }, t0 + 1.9)
      tl.to(S, { spin: 1, duration: 2.6, ease: 'power2.inOut' }, t0 + 3.1)
    } else {
      const grid = ctx.$('.s65-fb-grid')
      const orb = ctx.$('.s65-fb-orb')
      gsap.set(orb, { autoAlpha: 0, scale: 0.4 })
      tl.to(grid, { scale: 0.3, autoAlpha: 0, duration: 1.6, ease: ease.inOut }, t0 + 0.6)
      tl.to(orb, { autoAlpha: 1, scale: 1, duration: 1.8, ease: ease.out }, t0 + 1.2)
    }
    if (!reduced) tl.to(fx, { travel: -70, duration: 3.9, ease: ease.inOut }, t0 + 1.5)
    tl.to(fx, { glow: 0.12, energy: 0.3, duration: 3.0, ease: 'power2.inOut' }, t0 + 1.8)
    tl.addLabel('connect', t0 + 5.7)

    /* ---------------------------------------------------------------- 3 · mind */
    const t1 = t0 + 5.7
    a.leave('.s65-recall', t1)
    if (S) tl.to(S, { ms: 0.58, my: MIND_Y - 29.7, duration: 1.7, ease: ease.inOut }, t1)
    else tl.to(ctx.$('.s65-fb-orb'), { scale: 0.62, y: U * 3.5, duration: 1.7, ease: ease.inOut }, t1)
    a.words('.s65-name', t1 + 0.55, { stagger: 0.14, duration: 1.05 })
    a.words('.s65-line', t1 + 1.15)
    a.fade('.s65-col--in .s65-head', t1 + 1.5)
    a.rise('.s65-row--in', t1 + 1.6, { x: -1.6, y: 0, stagger: 0.12 })
    a.draw('.s65-flow--in', t1 + 1.9, { stagger: 0.12 })
    a.fade('.s65-run--in', t1 + 2.5)
    a.rise('.s65-mem', t1 + 2.5, { y: 1 })
    a.draw('.s65-flow--out', t1 + 2.8, { stagger: 0.12 })
    a.fade('.s65-run--out', t1 + 3.4)
    a.fade('.s65-col--out .s65-head', t1 + 3.0)
    a.rise('.s65-row--out', t1 + 3.1, { x: 1.6, y: 0, stagger: 0.12 })
    tl.to(fx, { glow: 0.05, focusY: 0.25, duration: 1.6, ease: 'power2.inOut' }, t1)
    tl.addLabel('mind', t1 + 4.2)

    /* ---------------------------------------------------------------- 4 · questions */
    const t2 = t1 + 4.2
    a.leave(['.s65-col--in', '.s65-col--out', '.s65-flows', '.s65-mem'].map((s) => ctx.$(s)), t2, { y: 0 })
    a.leave(['.s65-name', '.s65-line'].map((s) => ctx.$(s)), t2 + 0.1)
    if (S) tl.to(S, { ms: 0.9, mx: 19.5, my: -2.9, calm: 1, duration: 2.3, ease: ease.inOut }, t2 + 0.25)
    else tl.to(ctx.$('.s65-fb-orb'), { scale: 1, x: U * 19.5, y: -U * 2.9, duration: 2.3, ease: ease.inOut }, t2 + 0.25)
    tl.to(fx, { energy: -0.1, glow: 0, focusX: 0.4, focusY: 0, duration: 2.4, ease: 'power2.inOut' }, t2 + 0.2)
    a.wipe('.s65-logo', t2 + 1.3, { duration: 1.1 })
    a.words('.s65-thanks', t2 + 1.7)
    a.words('.s65-q', t2 + 1.95, { duration: 1.1 })
    a.rise('.s65-sig', t2 + 2.5, { y: 1 })
    tl.addLabel('questions', t2 + 3.6)

    if (fb) a.fade('.s65-fb', 0)
    return tl
  },
}

export default scene
