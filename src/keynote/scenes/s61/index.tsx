'use client'

/**
 * Slides 61, 62, 63, 64 · THE TEAM: one scene in four stages (the folders of 62, 63 and 64
 * re-export this one). People and AI teammates are ONE team, and the story ends on one mesh.
 *
 *   61  team       "The Team" lands in the middle of a net of empty rings: places still to be
 *                  filled (navy for people, flame for AI teammates).
 *   62  icon       the first paper: the three authors' photograph, the paper's real first page
 *                  landing as a sheet on a small stack, the facts; 2,28,198 and 81.4% count.
 *       neurips    it moves aside for the second paper, which arrives the same way.
 *   63  patent     the papers lift away; the patent receipt comes down like a filed document.
 *       stage      the patent moves aside: the talk at MLDS and the delegation at World Summit AI.
 *
 * (On 62 and 63 the first card stands in the middle of the stage and slides to its column when
 * the next ones arrive, so that no rest is half empty.)
 *   64  mesh       the cards let go of their pictures: the receipt and the two photographs
 *                  travel to their places, the papers and the group photographs come back in,
 *                  and thirty-three people stream in from every side. The links draw.
 *       agents     the three AI teammates come up at the hubs, flame-ringed; their links light
 *                  and light begins to run along every link.
 *       ourteam    one ring of light goes out through the whole mesh: Our people + Our AI
 *                  teammates = Our Team.
 *
 * Every photograph and document is the deck's own file at its own proportions, never larger
 * than its pixels (scenes/_shared/people). Links, running light and the rings of slide 61 are
 * three.js; without WebGL the same story is told without them.
 */

import gsap from 'gsap'
import type { ReactNode } from 'react'
import { anim, Count, createSceneCanvas, Headline, slide as slideOf, spanBeats, type SceneCanvas, type SceneModule } from '../../kit'
import { AGENTS, PEOPLE, PRINTS } from '../_shared/people/data'
import { createMesh, meshGL } from '../_shared/people/mesh'
import { MeshNodes, PEOPLE_PRELOAD, Slot } from '../_shared/people/nodes'
import '../_shared/people/people.css'
import * as D from './data'
import './scene.css'

const SLIDES = { 61: ['team'], 62: ['icon', 'neurips'], 63: ['patent', 'stage'], 64: ['mesh', 'agents', 'ourteam'] }

function CardShell({ c, children }: { c: D.CardText; children: ReactNode }) {
  return (
    <section className={`s61-card s61-card--${c.id}`}>
      <div className="s61-panel" />
      <div className="s61-media">
        {c.prints.map((p) => (
          <Slot key={p} id={p} />
        ))}
      </div>
      <div className="s61-txt s61-tag">{c.tag}</div>
      <h3 className="s61-txt s61-ct">{c.title}</h3>
      <div className="s61-txt s61-who">{c.who}</div>
      <p className="s61-txt s61-tx">{children}</p>
      <div className="s61-txt s61-where">{c.where}</div>
    </section>
  )
}

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),
  preload: PEOPLE_PRELOAD,

  Scene: () => (
    <div className="s61">
      <Headline className="s61-title" size="xl" text={slideOf(61).title} flame={[slideOf(61).title]} />
      <i className="s61-rule" />
      <Headline className="s61-h s61-h--62" text={slideOf(62).title} />
      <Headline className="s61-h s61-h--63" text={slideOf(63).title} />

      <div className="s61-row s61-row--62">
        <CardShell c={D.PAPERS[0]}>
          <b>
            <Count className="s61-n1" to={D.ICON_TEXT.count} group="in" />
            {D.ICON_TEXT.boldRest}
          </b>
          {D.ICON_TEXT.a}
          <Count className="s61-n2" to={D.ICON_TEXT.pct} decimals={1} suffix="%" />
          {D.ICON_TEXT.b}
        </CardShell>
        <CardShell c={D.PAPERS[1]}>
          {D.NEURIPS_TEXT.a}
          <b>{D.NEURIPS_TEXT.bold}</b>
          {D.NEURIPS_TEXT.b}
        </CardShell>
      </div>

      <div className="s61-row s61-row--63">
        <CardShell c={D.SHARED[0]}>
          {D.PATENT_TEXT.a}
          <b>{D.PATENT_TEXT.bold}</b>
          {D.PATENT_TEXT.b}
        </CardShell>
        <CardShell c={D.SHARED[1]}>{D.SPEAKER_TEXT}</CardShell>
        <CardShell c={D.SHARED[2]}>{D.DELEGATES_TEXT}</CardShell>
      </div>

      <MeshNodes />

      <p className="s61-line">
        <span className="s61-l s61-l--people">
          <i className="s61-dot s61-dot--people" />
          {D.LEGEND.people}
        </span>
        <span className="s61-l s61-sign s61-plus">+</span>
        <span className="s61-l s61-l--ai">
          <i className="s61-dot s61-dot--ai" />
          {D.LEGEND.ai}
        </span>
        <span className="s61-l s61-sign s61-eq">=</span>
        <b className="s61-l s61-l--team">{slideOf(64).title}</b>
      </p>
    </div>
  ),

  three(ctx) {
    const gl = createSceneCanvas(ctx, { lights: false })
    meshGL(ctx, gl)
    ctx.bag.gl = gl
    return gl.dispose
  },

  build(ctx) {
    const mesh = createMesh(ctx) // measures the nodes and the card slots: before anything is hidden
    const { nodes: N, G } = mesh
    const gl = ctx.bag.gl as SceneCanvas | undefined
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const U = ctx.U
    const calm = ctx.reduced
    const now = () => tl.duration()

    /* ---- the pieces ---- */
    const sheets = (id: string) => Array.from(N[id].el.querySelectorAll<HTMLElement>('.people-sheet'))
    for (const p of PRINTS) if (p.paper) gsap.set(sheets(p.id), { rotation: 0, x: 0, y: 0 })

    /** A print arrives on its card: a photograph rises, a document comes down and its stack fans. */
    const arrive = (id: string, at: number) => {
      const n = N[id]
      const s = n.s
      if (n.def.paper && !calm) {
        s.dy = -6
        s.r = id === 'receipt' ? -5 : 6
        tl.to(s, { a: 1, duration: 0.3, ease: 'power1.out' }, at)
        tl.to(s, { dy: 0, r: 0, duration: id === 'receipt' ? 0.55 : 0.85, ease: id === 'receipt' ? ctx.ease.slam : 'power3.out' }, at)
        const [b, top] = sheets(id)
        const land = at + (id === 'receipt' ? 0.5 : 0.6)
        tl.to(top, { rotation: -2.4, x: -0.3 * U, y: 0.28 * U, duration: 0.7, ease: ctx.ease.out }, land)
        tl.to(b, { rotation: 3.1, x: 0.42 * U, y: 0.46 * U, duration: 0.8, ease: ctx.ease.out }, land)
      } else {
        s.dy = calm ? 0 : 2
        tl.to(s, { a: 1, dy: 0, duration: 0.8, ease: ctx.ease.out }, at)
      }
    }
    const card = (c: D.CardText, at: number) => {
      const root = `.s61-card--${c.id}`
      a.rise(`${root} .s61-panel`, at, { y: 2.2, duration: 0.9 })
      c.prints.forEach((p, i) => arrive(p, at + 0.25 + i * 0.28))
      a.rise(`${root} .s61-txt`, at + 0.75, { y: 1.1, stagger: 0.09 })
    }
    /** A card that stands in the middle first (`by` --u to the right of its column), and later slides home. */
    const aside = (c: D.CardText, by: number) => {
      gsap.set(ctx.$(`.s61-card--${c.id}`), { x: calm ? 0 : by * U })
      if (!calm) for (const p of c.prints) N[p].s.dx = by
    }
    const home = (c: D.CardText, at: number) => {
      if (calm) return
      tl.to(ctx.$(`.s61-card--${c.id}`), { x: 0, duration: 1, ease: ctx.ease.inOut }, at)
      for (const p of c.prints) tl.to(N[p].s, { dx: 0, duration: 1, ease: ctx.ease.inOut }, at)
    }
    /** A node travels from where it is to its place in the mesh. */
    const fly = (id: string, at: number, o: { duration?: number; ease?: gsap.EaseString | gsap.EaseFunction; shown?: boolean } = {}) => {
      const s = N[id].s
      if (calm) {
        if (o.shown) tl.to(s, { a: 0, duration: 0.25 }, at)
        tl.set(s, { k: 1 }, at + 0.26)
        tl.to(s, { a: 1, duration: 0.5 }, at + 0.27)
        return
      }
      if (!o.shown) tl.to(s, { a: 1, duration: 0.45, ease: 'power1.out' }, at)
      tl.to(s, { k: 1, duration: o.duration ?? 1.5, ease: o.ease ?? 'power3.out' }, at)
    }

    /* ---- 61 · team ---- */
    G.spread = calm ? 1.22 : 1.5
    a.words('.s61-title', 0.2)
    a.rule('.s61-rule', 0.75, { from: 'center' })
    tl.to(G, { seed: 1, duration: 1.5, ease: 'power2.out' }, 0.15)
    tl.to(G, { spread: 1.22, duration: 2.2, ease: ctx.ease.out }, 0.1)
    tl.to(fx, { glow: 0.32, energy: 0.2, duration: 1.6 }, 0.2)
    tl.addLabel('team')

    /* ---- 62 · the two papers ---- */
    let t = now()
    a.leave('.s61-title', t, { y: 1.6 })
    a.leave('.s61-rule', t)
    tl.to(G, { seed: 0, spread: calm ? 1.22 : 1.6, duration: 0.6, ease: 'power2.in' }, t)
    tl.to(fx, { glow: 0.12, focusX: 0, focusY: 0.1, energy: 0, duration: 1.2 }, t)
    a.words('.s61-h--62', t + 0.3)
    aside(D.PAPERS[0], 23.4)
    card(D.PAPERS[0], t + 0.55)
    a.count('.s61-n1', t + 1.5)
    a.count('.s61-n2', t + 1.7, { duration: 1 })
    tl.addLabel('icon')

    t = now()
    home(D.PAPERS[0], t)
    card(D.PAPERS[1], t + 0.35)
    tl.to(fx, { focusX: 0.45, duration: 1.2, ease: ctx.ease.inOut }, t)
    tl.addLabel('neurips')

    /* ---- 63 · the patent, the talk, the summit ---- */
    t = now()
    for (const id of ['authors', 'paper1', 'arpit', 'paper2']) tl.to(N[id].s, { a: 0, dy: calm ? 0 : -2.4, duration: 0.4, ease: 'power2.in' }, t)
    a.leave('.s61-row--62 .s61-panel, .s61-row--62 .s61-txt', t, { stagger: 0, y: 2.4 })
    a.retitle('.s61-h--62', '.s61-h--63', t + 0.1)
    aside(D.SHARED[0], 30.6)
    card(D.SHARED[0], t + 0.5)
    tl.to(fx, { focusX: 0, duration: 1.2, ease: ctx.ease.inOut }, t)
    tl.addLabel('patent')

    t = now()
    home(D.SHARED[0], t)
    card(D.SHARED[1], t + 0.35)
    card(D.SHARED[2], t + 0.8)
    tl.to(fx, { focusX: 0.5, duration: 1.6, ease: ctx.ease.inOut }, t)
    tl.addLabel('stage')

    /* ---- 64 · mesh: everything lifts, and the team gathers ---- */
    t = now()
    a.leave('.s61-h--63', t)
    a.leave('.s61-row--63 .s61-panel, .s61-row--63 .s61-txt', t, { stagger: 0, y: 0.6 })
    // the papers come back in from outside (they left with slide 62), with the group photographs
    for (const id of ['authors', 'paper1', 'arpit', 'paper2']) tl.set(N[id].s, { j: 1, dy: 0, r: 0 }, t + 0.05)
    ;['receipt', 'speaker', 'delegates'].forEach((id, i) => fly(id, t + 0.2 + i * 0.12, { duration: 1.6, ease: ctx.ease.inOut, shown: true }))
    ;['team3', 'authors', 'team1', 'paper2', 'team2', 'paper1', 'arpit'].forEach((id, i) => fly(id, t + 0.5 + i * 0.11, { duration: 1.7 }))
    // the people: from every side, in an order that is the same every time
    const order = PEOPLE.map((p, i) => ({ id: p.id, r: Math.abs(Math.sin(i * 91.7 + 3.1) * 1000) % 1 })).sort((x, y) => x.r - y.r)
    order.forEach((p, i) => fly(p.id, t + 0.75 + i * 0.05))
    tl.to(G, { link: 1, duration: 1.6, ease: 'power1.inOut' }, t + 1.7)
    a.rise('.s61-l--people', t + 2.2)
    tl.to(fx, { glow: 0.22, focusX: 0, focusY: 0, energy: 0.25, duration: 2.4 }, t)
    tl.addLabel('mesh')

    /* ---- 64 · agents: the AI teammates come up at the hubs ---- */
    t = now()
    AGENTS.forEach((d, i) => {
      const at = t + 0.1 + i * 0.38
      const s = N[d.id].s
      tl.to(s, { a: 1, duration: 0.3, ease: 'power1.out' }, at)
      tl.to(s, { k: 1, duration: calm ? 0.01 : 1.0, ease: ctx.ease.out }, at)
      const ping = N[d.id].el.querySelector('.people-ping')
      if (ping && !calm) {
        tl.set(ping, { opacity: 0.85, scale: 0.7 }, at + 0.3)
        tl.to(ping, { scale: 2.3, opacity: 0, duration: 1.1, ease: 'power2.out' }, at + 0.3)
      }
    })
    tl.to(G, { pulse: 1, duration: 1.4, ease: 'power1.inOut' }, t + 0.9)
    a.rise('.s61-plus', t + 0.7, { y: 0.8 })
    a.rise('.s61-l--ai', t + 0.8)
    tl.to(fx, { warm: 0.25, energy: 0.4, duration: 1.8 }, t)
    tl.addLabel('agents')

    /* ---- 64 · ourteam: one ring of light through the whole mesh ---- */
    t = now()
    tl.to(G, { wave: 1, duration: calm ? 0.01 : 2.4, ease: 'power1.out' }, t)
    a.rise('.s61-eq', t + 0.3, { y: 0.8 })
    a.rise('.s61-l--team', t + 0.5, { y: 1.2, duration: 1 })
    tl.to(fx, { glow: 0.42, warm: 0.4, duration: 2 }, t)
    tl.addLabel('ourteam', now())

    /* ---- one function places everything ---- */
    if (gl) gl.onFrame((time) => mesh.frame(time))
    else tl.to({}, { duration: tl.duration(), ease: 'none', onUpdate: () => mesh.frame(0) }, 0)
    ctx.onSeek(() => mesh.frame(0))
    mesh.frame(0)
    return tl
  },
}

export default scene
