'use client'

/**
 * Slide 13 · "2 · Serving Bharat starts with understanding its people"
 *
 * Six photographs of how Bharat lives and earns, and the three problems a lender reads out of
 * them. The motion is that reading: the people first, then what their life looks like, then
 * each problem DRAWN FROM the very photographs that cause it.
 *
 *   bharat      who Bharat is; the six photographs hang in the room at six distances, drifting
 *   life        "WHAT LIFE LOOKS LIKE": they come to order as a wall of six, each on its mount,
 *               with its caption (75% counts up)
 *   underwrite  the wall makes room; "Hard to underwrite" arrives, and its three reasons fly in
 *               from the three photographs they belong to (those light, the others pale)
 *   serve       "Costlier to serve", from its three
 *   voice       "Voice-led", from the woman speaking into her phone: a voice line draws
 *   thin        the presenter's one expansion: the "Thin document" card opens, from where it
 *               sits, into a panel over the slide (which pales and steps back). Its photograph
 *               rides up into it; then his examples arrive one after another: seven names, each
 *               on an identity slip whose surname field stays empty, and three addresses, each
 *               half a line on a form whose flat, street, landmark and PIN stay empty
 *
 * THE PHOTOGRAPHS ARE REAL: the deck's own files, cropped only as the deck crops them (the
 * top 1.8 : 1 of each), never larger than their pixels on a 1920 stage (data.ts). A veil of
 * the page's white and a passing light lie OVER them; nothing is done to them.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Card, Count, Headline, Pic, pic, Words, type SceneModule } from '../../kit'
import { BHARAT, CARD, FLAME, FORM, LIFE, LIFE_KICKER, PROBLEMS, PROBLEMS_KICKER, SHIFT, THIN, THIN_CARD } from './data'
import './scene.css'

const u = (v: number) => `calc(var(--u) * ${v})`

/** "constitutes 75% bank txns": the figure counts. */
function Line({ text }: { text: string }) {
  const m = text.match(/^(.*?)(\d+)%(.*)$/)
  if (!m) return <>{text}</>
  return (
    <>
      {m[1]}
      <Count className="s13-figure" to={Number(m[2])} suffix="%" />
      {m[3]}
    </>
  )
}

/** The voice line of "Voice-led": bar heights, 0 … 1. */
const WAVE = [0.22, 0.42, 0.3, 0.62, 0.9, 0.55, 0.78, 1, 0.66, 0.4, 0.72, 0.5, 0.28, 0.46, 0.2]

/** One streak of light per reason, from its photograph to its line. */
const SPARKS = PROBLEMS.flatMap((p, k) => p.from.filter((src, j) => p.from.indexOf(src) === j).map((src) => ({ k, src, line: p.from.indexOf(src) })))

const scene: SceneModule = {
  beats: ['bharat', 'life', ...PROBLEMS.map((p) => p.key), 'thin'],
  preload: LIFE.map((l) => pic(13, l.file)),

  Scene: ({ slide }) => (
    <div className="s13">
      <Headline text={slide.title} flame={FLAME} />

      <div className="s13-bharat">
        <i className="s13-bharat-wash" aria-hidden="true" />
        <i className="s13-bharat-bar" aria-hidden="true" />
        <b className="s13-bharat-t">{BHARAT.title}</b>
        <span className="s13-bharat-l">
          <Words text={BHARAT.line} />
        </span>
      </div>

      <div className="s13-life">
        <span className="s13-kick">{LIFE_KICKER}</span>
        {LIFE.map((l, i) => (
          <figure
            className="s13-card"
            key={l.file}
            style={{ left: u((i % 3) * (CARD.w + CARD.gapX)), top: u(2.1 + Math.floor(i / 3) * (CARD.h + CARD.gapY)), zIndex: Math.round(l.float.s * 10) } as CSSProperties}
          >
            <div className="s13-fly">
              <div className="s13-drift">
                <span className="s13-plate" aria-hidden="true" />
                <span className="s13-ring" aria-hidden="true" />
                <span className="s13-shade" aria-hidden="true" />
                <Pic className="s13-shot" n={13} name={l.file} fit="cover" focus="50% 0%" alt={l.caption} />
                <span className="s13-fx" aria-hidden="true">
                  <i className="s13-sheen" />
                </span>
                <figcaption className="s13-note">
                  <b className="s13-cap">{l.caption}</b>
                  <span className="s13-line">
                    <span>
                      <Line text={l.lines[0]} />
                    </span>
                    <span>
                      <Line text={l.lines[1]} />
                    </span>
                  </span>
                </figcaption>
                <span className="s13-veil" aria-hidden="true" />
              </div>
            </div>
          </figure>
        ))}
      </div>

      <div className="s13-prob">
        <span className="s13-prob-h">{PROBLEMS_KICKER}</span>
        {PROBLEMS.map((p) => (
          <Card className={`s13-p s13-p--${p.key}`} tone="peach" key={p.key}>
            <i className="s13-p-bar" aria-hidden="true" />
            <b className="s13-p-t">{p.title}</b>
            {p.lines.map((line) => (
              <span className="s13-p-l" key={line}>
                {line}
              </span>
            ))}
            {p.key === 'voice' ? (
              <svg className="s13-wave" viewBox={`0 0 ${WAVE.length * 4} 24`} aria-hidden="true">
                {WAVE.map((h, i) => (
                  <rect key={i} x={i * 4 + 1} y={12 - h * 11} width={2} height={h * 22} rx={1} />
                ))}
              </svg>
            ) : null}
          </Card>
        ))}
      </div>

      {/* the streaks of light, in stage units: their paths are laid in build(), from where things really are */}
      <svg className="s13-sparks" viewBox="0 0 100 56.25" aria-hidden="true">
        {SPARKS.map((s, i) => (
          <g className="s13-sp" key={i}>
            <path className="s13-spark-glow" d="M0 0" />
            <path className="s13-spark" d="M0 0" />
            <circle className="s13-spark-halo" cx={0} cy={0} r={1.05} />
            <circle className="s13-spark-head" cx={0} cy={0} r={0.36} />
          </g>
        ))}
      </svg>

      {/* the last beat: the slide pales behind a panel that opens out of the "Thin document" card */}
      <i className="s13-scrim" aria-hidden="true" />
      <div className="s13-thin">
        <i className="s13-thin-bg" aria-hidden="true" />
        <Pic className="s13-thin-shot" n={13} name={LIFE[THIN_CARD].file} fit="cover" focus="50% 0%" alt={LIFE[THIN_CARD].caption} />
        <div className="s13-thin-head">
          <i className="s13-thin-bar" aria-hidden="true" />
          <b className="s13-thin-t">{LIFE[THIN_CARD].caption}</b>
          <span className="s13-thin-l">
            <span>{LIFE[THIN_CARD].lines[0]}</span>
            <span>{LIFE[THIN_CARD].lines[1]}</span>
          </span>
        </div>

        <div className="s13-names">
          <b className="s13-group s13-group--names">{THIN.names.title}</b>
          <div className="s13-slips">
            {THIN.names.items.map((name) => (
              <div className="s13-slip" key={name}>
                <span className="s13-lab">{FORM.name}</span>
                <b className="s13-slip-name">{name}</b>
                <span className="s13-slip-row">
                  <span className="s13-lab">{FORM.surname}</span>
                  <i className="s13-empty" aria-hidden="true" />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="s13-addrs">
          <div className="s13-group s13-group--addrs">
            <b>{THIN.addresses.title}</b>
            <span className="s13-group-c">{THIN.addresses.caption}</span>
          </div>
          {THIN.addresses.items.map((address) => (
            <div className="s13-addr" key={address}>
              <span className="s13-lab s13-addr-lab">{FORM.address}</span>
              <span className="s13-addr-line">
                <span className="s13-addr-text">{address}</span>
                <i className="s13-addr-end" aria-hidden="true" />
                <i className="s13-addr-rest" aria-hidden="true" />
              </span>
              <span className="s13-addr-fields">
                {FORM.missing.map((f) => (
                  <span className={`s13-field s13-field--${f.toLowerCase()}`} key={f}>
                    <span className="s13-lab">{f}</span>
                    <i className="s13-empty" aria-hidden="true" />
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const q = (el: Element, sel: string) => el.querySelector(sel) as HTMLElement
    const life = ctx.$('.s13-life')
    const cards = ctx.$$('.s13-card')
    const probs = ctx.$$('.s13-p')
    // measured in the final layout, before anything is moved or hidden
    const boxes = cards.map((c) => ctx.loc(c))
    const shots = cards.map((c) => ctx.loc(q(c, '.s13-shot')))
    const lines = probs.map((p) => Array.from(p.querySelectorAll('.s13-p-l')).map((l) => ({ el: l as HTMLElement, box: ctx.loc(l) })))
    const thin = ctx.$('.s13-thin')
    const thinShot = ctx.$('.s13-thin-shot')
    const back13 = [life, ctx.$('.s13-prob'), ctx.$('.s13-bharat')]
    const at13 = { panel: ctx.loc(thin), shot: ctx.loc(thinShot), back: back13.map((el) => ctx.loc(el)) }

    /* ----------------------------------------------------------- bharat */
    a.words('.kn-h', 0.1)
    a.rule('.s13-bharat-bar', 0.45, { from: 'top', duration: 0.6 })
    a.fade('.s13-bharat-wash', 0.5, { duration: 1.0 })
    a.rise('.s13-bharat-t', 0.55, { y: 0, x: -1.2 })
    a.words('.s13-bharat-l', 0.72, { stagger: 0.035 })
    tl.to(fx, { glow: 0.26, focusX: 0.1, focusY: 0.2, duration: 2 }, 0.2)

    // the six hang in the room: the far ones come first
    gsap.set(life, { x: SHIFT * U })
    const order = LIFE.map((l, i) => ({ i, s: l.float.s }))
      .sort((p, n) => p.s - n.s)
      .map((o) => o.i)
    cards.forEach((card, i) => {
      const f = LIFE[i].float
      const fly = q(card, '.s13-fly')
      const dx = f.x * U - (shots[i].cx + SHIFT * U)
      const dy = f.y * U - shots[i].cy
      const at = 0.65 + order.indexOf(i) * 0.12
      gsap.set(fly, {
        transformOrigin: `${shots[i].cx - boxes[i].x}px ${shots[i].cy - boxes[i].y}px`,
        transformPerspective: 80 * U,
        x: dx,
        y: reduced ? dy : dy + 3.2 * U,
        scale: reduced ? f.s : f.s * 0.78,
        rotation: f.tilt,
        rotationY: reduced ? f.turn : f.turn * 2,
        autoAlpha: 0,
      })
      gsap.set(q(card, '.s13-drift'), { '--s13-near': f.s * f.s })
      tl.to(fly, { autoAlpha: 1, duration: 0.55, ease: 'power1.out' }, at)
      tl.to(fly, { y: dy, scale: f.s, rotationY: f.turn, duration: 1.45, ease: ease.out }, at)
      const sheen = q(card, '.s13-sheen')
      gsap.set(sheen, { xPercent: -130 })
      tl.to(sheen, { xPercent: 330, duration: 1.2, ease: 'power2.inOut' }, at + 0.5)
      gsap.set([q(card, '.s13-plate'), q(card, '.s13-ring'), q(card, '.s13-veil')], { autoAlpha: 0 })
      gsap.set(q(card, '.s13-plate'), { scaleY: 0.68, transformOrigin: '50% 0%' })
      gsap.set([q(card, '.s13-cap'), ...Array.from(card.querySelectorAll('.s13-line > span'))], { autoAlpha: 0, y: 0.8 * U })
    })
    tl.addLabel('bharat', 2.75)

    /* ------------------------------------------------------------- life */
    const L = 2.75
    a.rise('.s13-kick', L + 0.15, { y: 0.9 })
    tl.to(fx, { focusX: 0, focusY: 0.1, glow: 0.2, duration: 1.4, ease: ease.inOut }, L)
    cards.forEach((card, i) => {
      const at = L + i * 0.06
      const fly = q(card, '.s13-fly')
      tl.to(fly, { x: 0, y: 0, scale: 1, rotation: 0, rotationY: 0, duration: 1.3, ease: ease.inOut }, at)
      tl.to(q(card, '.s13-drift'), { '--s13-near': 0, duration: 1.3, ease: ease.inOut }, at)
      tl.to(q(card, '.s13-shade'), { autoAlpha: 0, duration: 0.6, ease: 'power1.inOut' }, at + 0.8)
      // its mount opens under it, then its caption
      tl.to(q(card, '.s13-plate'), { autoAlpha: 1, scaleY: 1, duration: 0.7, ease: ease.out }, at + 0.95)
      tl.to(q(card, '.s13-cap'), { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, at + 1.2)
      tl.to(card.querySelectorAll('.s13-line > span'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: ease.out }, at + 1.32)
      const figure = card.querySelector('.s13-figure')
      if (figure) a.count(figure, at + 1.4, { duration: 1.1 })
    })
    tl.addLabel('life', L + 2.75)

    /* ------------------------------------------------------ the problems */
    const sparks = ctx.$$<SVGPathElement>('.s13-spark')
    const glows = ctx.$$<SVGPathElement>('.s13-spark-glow')
    const heads = ctx.$$<SVGCircleElement>('.s13-spark-head')
    const halos = ctx.$$<SVGCircleElement>('.s13-spark-halo')
    sparks.forEach((path, n) => {
      const s = SPARKS[n]
      const from = shots[s.src]
      const to = lines[s.k][s.line].box
      // from the photograph's edge nearest the problems, so the light leaves it and does not cross it
      const x0 = (from.x + from.w) / U - 0.4
      const y0 = from.cy / U
      const x1 = to.x / U - 0.7
      const y1 = to.cy / U
      const lift = 4 + Math.abs(x1 - x0) * 0.07
      const d = `M${x0.toFixed(2)} ${y0.toFixed(2)} Q${((x0 + x1) / 2).toFixed(2)} ${(Math.min(y0, y1) - lift).toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`
      path.setAttribute('d', d)
      glows[n].setAttribute('d', d)
      gsap.set([path, glows[n]], { drawSVG: '0% 0%', autoAlpha: 0 })
      gsap.set([heads[n], halos[n]], { autoAlpha: 0 })
    })
    gsap.set(ctx.$('.s13-prob-h'), { autoAlpha: 0, y: 0.9 * U })
    gsap.set(probs, { autoAlpha: 0, x: reduced ? 0 : 2.4 * U })
    lines.flat().forEach((l) => gsap.set(l.el, { autoAlpha: 0, x: reduced ? 0 : -0.9 * U }))
    const bars = ctx.$$('.s13-wave rect')
    gsap.set(bars, { scaleY: 0.12, autoAlpha: 0, transformOrigin: '50% 50%' })

    /** Problem k arrives at time t, its reasons flying in from their photographs. Returns its rest. */
    const problem = (k: number, t: number): number => {
      const p = PROBLEMS[k]
      tl.to(probs[k], { autoAlpha: 1, x: 0, duration: 0.8, ease: ease.out }, t)
      tl.to(fx, { focusX: 0.6, focusY: -0.25 + k * 0.32, glow: 0.3, warm: 0.3, duration: 1.2, ease: ease.inOut }, t)
      // its photographs light, the others pale
      cards.forEach((card, i) => {
        const on = p.from.includes(i)
        tl.to(q(card, '.s13-ring'), { autoAlpha: on ? 1 : 0, duration: 0.45, ease: 'power1.out' }, t + 0.25)
        tl.to(q(card, '.s13-veil'), { autoAlpha: on ? 0 : 0.36, duration: 0.5, ease: 'power1.out' }, t + 0.25)
      })
      let end = t + 0.9
      SPARKS.forEach((s, n) => {
        if (s.k !== k) return
        const at = t + 0.55 + s.line * 0.24
        const path = sparks[n]
        const length = path.getTotalLength()
        const state = { p: 0 }
        const paint = () => {
          const head = Math.min(1, state.p * 1.4)
          const tail = Math.max(0, state.p * 1.4 - 0.4)
          const on = state.p > 0.001 && state.p < 0.999 ? 1 : 0
          gsap.set([path, glows[n]], { drawSVG: `${(tail * 100).toFixed(1)}% ${(head * 100).toFixed(1)}%`, autoAlpha: on })
          // the bright head of the comet: gone once it has arrived
          const pt = path.getPointAtLength(head * length)
          for (const dot of [heads[n], halos[n]]) {
            dot.setAttribute('cx', pt.x.toFixed(3))
            dot.setAttribute('cy', pt.y.toFixed(3))
          }
          gsap.set([heads[n], halos[n]], { autoAlpha: on && head < 1 ? 1 : 0 })
        }
        tl.to(state, { p: 1, duration: reduced ? 0.01 : 0.85, ease: 'power2.inOut', onUpdate: paint }, at)
        // the reason lands as the light reaches it (a photograph that gives two reasons gives them together)
        const mine = lines[k].filter((_, j) => p.from[j] === s.src)
        tl.to(
          mine.map((l) => l.el),
          { autoAlpha: 1, x: 0, duration: 0.6, stagger: 0.12, ease: ease.out },
          at + 0.6,
        )
        end = Math.max(end, at + 0.6 + 0.6 + (mine.length - 1) * 0.12)
      })
      return end
    }

    // the wall makes room
    let t = L + 2.75
    tl.to(life, { x: 0, duration: 1.15, ease: ease.inOut }, t)
    tl.to(ctx.$('.s13-prob-h'), { autoAlpha: 1, y: 0, duration: 0.7, ease: ease.out }, t + 0.55)
    t = problem(0, t + 0.6)
    tl.addLabel(PROBLEMS[0].key, t)
    t = problem(1, t)
    tl.addLabel(PROBLEMS[1].key, t)
    const v = t
    t = problem(2, t)
    // "Customers like to talk": a voice line draws beside it
    tl.to(bars, { autoAlpha: 1, duration: 0.2, stagger: 0.03, ease: 'none' }, v + 1.1)
    tl.to(bars, { scaleY: 1, duration: 0.7, stagger: 0.03, ease: ease.snap }, v + 1.1)
    // the slide's last frame is its summary: every photograph comes back to full light, and only
    // the one that speaks keeps its flame line
    const back = Math.max(t, v + 1.1 + 0.7 + 0.03 * bars.length) - 0.25
    tl.to(
      cards.map((card) => q(card, '.s13-veil')),
      { autoAlpha: 0, duration: 0.7, ease: 'power1.inOut' },
      back,
    )
    tl.addLabel(PROBLEMS[2].key, back + 0.7)

    /* ------------------------------------------------------------- thin */
    // "Thin document" opens: the slide pales and steps back, the card's own plate grows from
    // where it sits (its bottom left corner never moves) and its photograph rides up into it
    const N = back + 0.7
    const from = boxes[THIN_CARD]
    const bg = ctx.$('.s13-thin-bg')
    const scrim = ctx.$('.s13-scrim')
    gsap.set([thin, scrim], { autoAlpha: 0 })
    tl.to(scrim, { autoAlpha: 1, duration: 0.7, ease: 'power1.inOut' }, N)
    back13.forEach((el, i) => {
      const b = at13.back[i]
      gsap.set(el, { transformOrigin: `${50 * U - b.x}px ${28.1 * U - b.y}px` })
      if (!reduced) tl.to(el, { scale: 0.972, duration: 0.95, ease: ease.inOut }, N)
    })
    tl.to(fx, { focusX: -0.2, focusY: 0.3, glow: 0.34, duration: 1.2, ease: ease.inOut }, N)
    tl.to(thin, { autoAlpha: 1, duration: reduced ? 0.5 : 0.18, ease: 'power1.out' }, N)
    if (!reduced) {
      gsap.set(bg, {
        transformOrigin: '0% 100%',
        x: from.x - at13.panel.x,
        y: from.y + from.h - (at13.panel.y + at13.panel.h),
        scaleX: from.w / at13.panel.w,
        scaleY: from.h / at13.panel.h,
      })
      tl.to(bg, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.95, ease: ease.inOut }, N)
      gsap.set(thinShot, { x: shots[THIN_CARD].x - at13.shot.x, y: shots[THIN_CARD].y - at13.shot.y })
      tl.to(thinShot, { x: 0, y: 0, duration: 0.95, ease: ease.inOut }, N)
    }
    a.rule('.s13-thin-bar', N + 0.6, { from: 'top', duration: 0.5 })
    a.rise('.s13-thin-t', N + 0.62, { y: 0, x: -1 })
    a.rise('.s13-thin-l > span', N + 0.74, { y: 0.7, stagger: 0.08, duration: 0.6 })
    // his examples, one after another: the names, each on its slip …
    a.rise('.s13-group--names', N + 0.85, { y: 0.8, duration: 0.6 })
    a.rise('.s13-slip', N + 1.0, { y: 1.1, stagger: 0.11, duration: 0.6 })
    // … then the addresses, each written on its line as far as it goes
    const A = N + 1.95
    a.rise('.s13-group--addrs', A, { y: 0.8, duration: 0.6 })
    ctx.$$('.s13-addr').forEach((row, i) => {
      const t0 = A + 0.2 + i * 0.3
      a.rise(row, t0, { y: 1.1, duration: 0.6 })
      a.wipe(q(row, '.s13-addr-text'), t0 + 0.2, { from: 'left', duration: 0.7 })
      a.pop(q(row, '.s13-addr-end'), t0 + 0.8)
      a.rule(q(row, '.s13-addr-rest'), t0 + 0.85, { duration: 0.55 })
    })
    tl.addLabel('thin', A + 0.2 + 2 * 0.3 + 0.85 + 0.55)
    return tl
  },
}

export default scene
