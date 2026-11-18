'use client'

/**
 * Slide 65 · THE ENDING: PIRAMAL MIND. Dark navy; the last scene of the keynote.
 *
 * The deck's page 65 is only "Thank You". The owner asked for this instead: one last beat where
 * everything the morning spoke about comes together, inside a mind; it opens up to say Piramal
 * Mind is engineered to hold all of this; and the keynote ends there, open for questions.
 *
 *   recall     the morning comes back: eighteen stills of the keynote's own scenes fly in from the
 *              depth of the room to a curved wall around the viewer; "Everything we spoke about this morning…"
 *   mind       ONE press, one move: threads of light join the cards, they shrink to nodes, the camera
 *              pulls back and the cloud has a shape, while the line completes ("…lives inside one mind.");
 *              the sentence yields to the name as the mind finishes forming; then what it is: what
 *              flows in, the one memory, and the AIs of the morning, each lit by a pulse that leaves
 *              the mind BY ITSELF (nothing travels from the AI first): "even when it is not asked"
 *   questions  the mind settles; the logo, "Thank you", "Questions?". It can stand for twenty minutes.
 *
 * The 3D is in mind.ts: the timeline tweens the numbers of its state, nothing else.
 */

import type { ReactNode } from 'react'
import gsap from 'gsap'
import { anim, Kicker, Logo, Words, type SceneModule } from '../../kit'
import { AIS, CLOSE, LIVES, MEMORIES, MIND, RECALL, still } from './data'
import { createMind, type Mind } from './mind'
import './scene.css'

/** Small line icons, drawn here: what flows in. */
const ICONS_IN = [
  <g key="a">
    {/* a document */}
    <path d="M7 3h7l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
    <path d="M14 3v4h4M8.5 12h7M8.5 16h5" />
  </g>,
  <g key="b">
    {/* a decision: a tick in a circle */}
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.3 12.4l2.6 2.6 4.9-5.4" />
  </g>,
  <g key="c">
    <path d="M4 5h10a2 2 0 012 2v4a2 2 0 01-2 2H9l-3.5 3v-3H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
    <path d="M19 10h1a2 2 0 012 2v3a2 2 0 01-2 2v2.4L17.2 17H14" />
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
/** The AIs stand on a shallow arc to the right of the mind: [x, y] of each ring's centre, in --u. */
const AI_AT = AIS.map((_, i) => [71.3 + [0, 3.3, 4.5, 3.3, 0][i], MIND_Y + (i - 2) * 4.9])
/** From the mind to each AI (drawn in that direction: it is the way the light travels). */
const GIVES = AI_AT.map(([x, y], i) => {
  const y0 = MIND_Y + (i - 2) * 1.5
  return `M60.2 ${y0} C${65.2 + (x - 71.3) * 0.3} ${y0} ${x - 6.4} ${y} ${x - 1.7} ${y}`
})
/** The idle: one pulse every 1.3 s, to each AI in turn. */
const IDLE_GAP = 1.3
const IDLE = AIS.length * IDLE_GAP

const scene: SceneModule = {
  beats: ['recall', 'mind', 'questions'],
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

      {/* one sentence in two parts: the second is written in under the first as the mind forms */}
      <p className="s65-recall">
        <span className="s65-said">
          <Words text={RECALL} />
        </span>
        <span className="s65-lives">
          <Words text={LIVES} bold={['one mind']} />
        </span>
      </p>

      {/* the second rest: the name, and what it is */}
      <h2 className="s65-name">
        <Words text={MIND.name} />
      </h2>
      <p className="s65-line">
        <Words text={MIND.line} flame={[MIND.lineFlame]} />
      </p>

      <svg className="s65-flows" viewBox="0 0 100 56.25" aria-hidden="true">
        {FLOWS_IN.map((d, i) => (
          <g key={`i${i}`}>
            <path className="s65-flow s65-flow--in" d={d} />
            <path className="s65-run s65-run--in" d={d} style={{ animationDelay: `${-i * 0.9}s` }} />
          </g>
        ))}
        {GIVES.map((d, i) => (
          <g key={`o${i}`}>
            <path className="s65-flow s65-flow--out" d={d} />
            {/* the first pulse, on the timeline */}
            <g className="s65-shot">
              <path className="s65-shot-halo" d={d} />
              <path className="s65-shot-core" d={d} />
            </g>
          </g>
        ))}
        {/* the idle: the same pulses, in turn, for as long as the rest stands */}
        <g className="s65-gives">
          {GIVES.map((d, i) => (
            <path key={i} className="s65-run s65-run--give" d={d} pathLength={100} style={{ animationDelay: `${i * IDLE_GAP - IDLE}s` }} />
          ))}
        </g>
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
        {AIS.map((name, i) => (
          <div key={name} className="s65-ai" style={{ left: `calc(var(--u) * ${AI_AT[i][0]})`, top: `calc(var(--u) * ${AI_AT[i][1]})` }}>
            <span className="s65-ai-dot">
              <i className="s65-ai-lit" />
              <span className="s65-ai-live">
                <i className="s65-ai-idle" style={{ animationDelay: `${i * IDLE_GAP - IDLE}s` }} />
              </span>
            </span>
            <b>{name}</b>
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
    a.words('.s65-said', 1.5, { stagger: 0.08, duration: 0.95 })
    tl.addLabel('recall', 3.5)

    /* ---------------------------------------------------------------- 2 · mind */
    // ONE press from the thumbnails to the whole picture (the owner: "bring the text also in that
    // same click"). The press must be answered at once and nothing may look at rest on the way (a
    // second press finishes the move). So everything overlaps: the wall flashes and dims, the
    // threads are already shooting, the line completes while the cards shrink and the camera pulls
    // back, the name begins to land as the cloud closes, and the infographic follows straight on.
    // 7.4 s; after +6.1 s only the AIs' lights are still to come.
    const t0 = 3.5
    const LEN = 7.4
    const tm = t0 + 2.6 // the formed mind steps down to its place in the picture
    if (S) {
      tl.to(S, { ping: 1, duration: 0.7, ease: 'none' }, t0)
      tl.to(S, { thread: 1, duration: 1.5, ease: 'power1.out' }, t0)
      tl.to(S, { labels: 0, duration: 0.4, ease: 'power1.out' }, t0)
      tl.to(S, { morph: 1, duration: 2.3, ease: 'none' }, t0 + 0.45)
      tl.to(S, { pull: 1, duration: 3.3, ease: 'sine.inOut' }, t0 + 0.3)
      tl.to(S, { cloud: 1, duration: 3.0, ease: 'power1.out' }, t0 + 0.8)
      tl.to(S, { spin: 1, duration: 2.4, ease: 'power2.inOut' }, t0 + 2.0)
      tl.to(S, { ms: 0.58, my: MIND_Y - 29.7, duration: 1.6, ease: ease.inOut }, tm)
    } else {
      const grid = ctx.$('.s65-fb-grid')
      const orb = ctx.$('.s65-fb-orb')
      gsap.set(orb, { autoAlpha: 0, scale: 0.4 })
      tl.to(grid, { scale: 0.3, autoAlpha: 0, duration: 1.6, ease: ease.inOut }, t0 + 0.1)
      tl.to(orb, { autoAlpha: 1, scale: 1, duration: 1.8, ease: ease.out }, t0 + 0.7)
      tl.to(orb, { scale: 0.62, y: U * 3.5, duration: 1.6, ease: ease.inOut }, tm)
    }
    if (!reduced) tl.to(fx, { travel: -70, duration: 3.6, ease: 'sine.inOut' }, t0 + 0.3)
    tl.to(fx, { glow: 0.12, energy: 0.3, duration: 2.4, ease: 'power2.inOut' }, t0 + 0.8)
    tl.to(fx, { glow: 0.05, focusY: 0.25, duration: 1.6, ease: 'power2.inOut' }, t0 + 3.2)

    // the sentence completes in place, is read, and yields to the name
    a.words('.s65-lives', t0 + 0.7, { stagger: 0.09, duration: 0.8 })
    a.leave('.s65-recall', t0 + 2.8)
    a.words('.s65-name', t0 + 3.05, { stagger: 0.14, duration: 1.0 })
    a.words('.s65-line', t0 + 3.6, { stagger: 0.035 })

    // what flows in, and the one memory
    a.fade('.s65-col--in .s65-head', t0 + 4.1)
    a.rise('.s65-row--in', t0 + 4.2, { x: -1.6, y: 0, stagger: 0.1 })
    a.draw('.s65-flow--in', t0 + 4.45, { stagger: 0.1, duration: 0.8 })
    a.fade('.s65-run--in', t0 + 5.0)
    a.rise('.s65-mem', t0 + 4.8, { y: 1 })

    // every AI draws on it: they stand there dim; then a pulse leaves the mind for each in turn,
    // by itself, and each lights as its pulse arrives
    a.fade('.s65-col--out .s65-head', t0 + 5.0)
    a.draw('.s65-flow--out', t0 + 5.05, { stagger: 0.08, duration: 0.7 })
    a.pop('.s65-ai', t0 + 5.15, { stagger: 0.08, from: 0.7 })
    const shots = ctx.$$('.s65-shot')
    const ais = ctx.$$('.s65-ai')
    ais.forEach((ai, i) => {
      const at = t0 + 5.5 + i * 0.25
      const lit = ai.querySelector('.s65-ai-lit')
      const nm = ai.querySelector('b')
      gsap.set(lit, { autoAlpha: 0, scale: reduced ? 1 : 1.9 })
      if (reduced) {
        tl.to(lit, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, at + 0.5)
      } else {
        const paths = shots[i].querySelectorAll('path')
        gsap.set(paths, { drawSVG: '0% 0%', autoAlpha: 0 })
        tl.set(paths, { autoAlpha: 1 }, at)
        tl.to(paths, { drawSVG: '0% 20%', duration: 0.1, ease: 'none' }, at)
        tl.to(paths, { drawSVG: '80% 100%', duration: 0.33, ease: 'none' }, at + 0.1)
        tl.to(paths, { drawSVG: '100% 100%', duration: 0.07, ease: 'none' }, at + 0.43)
        tl.set(paths, { autoAlpha: 0 }, at + 0.5)
        tl.to(lit, { autoAlpha: 1, duration: 0.1, ease: 'none' }, at + 0.45)
        tl.to(lit, { scale: 1, duration: 0.4, ease: 'power2.out' }, at + 0.45)
      }
      tl.to(nm, { color: '#ffffff', duration: 0.3, ease: 'power1.out' }, at + 0.45)
    })
    // …and it keeps giving: the idle (CSS; it stands still on a held frame and for reduced motion)
    a.fade(['.s65-gives', '.s65-ai-live'].flatMap((q) => ctx.$$(q)), t0 + 6.9, { duration: 0.4 })
    tl.addLabel('mind', t0 + LEN)

    /* ---------------------------------------------------------------- 3 · questions */
    const t2 = t0 + LEN
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
