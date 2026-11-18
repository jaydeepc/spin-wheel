'use client'

/**
 * Slide 06 · "Our retail scale-up (along with declining opex and controlled risk) is among the
 * fastest ones in industry"
 *
 * The deck's three numbered charts, told as three proofs. The first is a RACE, and it is run as
 * one: the chart's x axis is years, so all seven curves (ours and the six peers) leave Y0
 * together and are drawn as far as the same year, a light at the head of ours. Nothing is
 * estimated: the curves are the deck's own paths (data.ts), cut at 100 as the deck cuts them.
 *
 *   race    the headline; card 1 and its axes; the seven start; ours reaches ₹100k Cr and the
 *           clock beside the chart stops at 4.5 yrs, while the peers stand where they were then
 *   peers   the years run on: NBFC A, B and C reach the line in ~6, ~8 and ~10 yrs, each
 *           dropping its finish line and its numbered marker; the list beside the chart fills
 *   opex    the list hands over to the deck's own labels in the chart; card 2: axes, the long
 *           range goal, then the line falls from 6.5% to 3.48% with its figures landing as the
 *           light passes them, and the band steps 25 bps down where the guidance was cut
 *   risk    card 3 (waiting, dimmed, since "opex"): the 90+ DPD line draws flat across 18 quarters
 *
 * No canvas: the lines are SVG, drawn as far as a number on the timeline (track.ts), so every
 * frame of the race can be held by a URL.
 */

import gsap from 'gsap'
import { anim, Card, Headline, pic, Words, type SceneModule } from '../../kit'
import { DPD_LAST, DPD_TRACK, DpdChart, dpdX, FINISHERS, OPEX_LAST, OPEX_TRACK, OpexChart, opexX, RACE, RaceChart, raceX, RUNNERS, US } from './charts'
import { DPD_TITLE, FOOTNOTE, OPEX_TITLE, RACE_LABELS, RACE_RETAIL, RACE_TITLE } from './data'
import { easeReaches, trackAt, type Track } from './track'
import './scene.css'

const LOGO = pic(6, 'logo-piramal-finance.png')

/** "NBFC A in ~6 yrs" → the name and its time, so the time can be set heavier. */
const split = (label: string) => {
  const i = label.indexOf(' in ')
  return { who: label.slice(0, i + 3), time: label.slice(i + 4) }
}
const OURS = split(RACE_LABELS[1])

const scene: SceneModule = {
  beats: ['race', 'peers', 'opex', 'risk'],
  preload: [LOGO],

  Scene: ({ slide }) => (
    <div className="s06">
      <Headline text={slide.title} />

      {/* 1 · the race */}
      <Card className="s06-card s06-card--race" tone="ice">
        <span className="s06-badge">1</span>
        <p className="s06-title">
          <Words text={RACE_TITLE} />
        </p>
        <RaceChart />
        <div className="s06-brand">
          {/* the deck's own label of the orange curve: its logo file, as it is, and the word under it */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO} alt="Piramal Finance" width={195} height={110} decoding="async" draggable={false} />
          <span>{RACE_RETAIL}</span>
        </div>
      </Card>

      {/* beside the chart while the race is run: the clock, then the three peers the deck names */}
      <div className="s06-hero">
        <p className="s06-hero-who">
          <span className="s06-disc s06-disc--us">1</span>
          <span className="s06-hero-name">
            <Words text={OURS.who} />
          </span>
        </p>
        <p className="s06-hero-num">
          <span className="s06-clock">{OURS.time.split(' ')[0]}</span>
          <i> {OURS.time.split(' ')[1]}</i>
        </p>
        <span className="s06-hero-rule" aria-hidden="true" />
        {[2, 3, 4].map((m) => {
          const l = split(RACE_LABELS[m])
          return (
            <p className="s06-row" data-m={m} key={m}>
              <span className="s06-disc">{m}</span>
              <span>
                {l.who} <b>{l.time}</b>
              </span>
            </p>
          )
        })}
      </div>

      {/* 2 · opex to AUM */}
      <Card className="s06-card s06-card--opex" tone="peach">
        <span className="s06-badge">2</span>
        <p className="s06-title">
          <Words text={OPEX_TITLE} />
        </p>
        <OpexChart />
      </Card>

      {/* 3 · retail 90+ DPD */}
      <Card className="s06-card s06-card--dpd" tone="ice">
        <span className="s06-badge">3</span>
        <p className="s06-title">
          <Words text={DPD_TITLE} />
        </p>
        <DpdChart />
      </Card>

      {/* a stroke under the words each card is about */}
      <span className="s06-mark" data-for="race" aria-hidden="true" />
      <span className="s06-mark" data-for="opex" aria-hidden="true" />
      <span className="s06-mark" data-for="dpd" aria-hidden="true" />

      <p className="s06-src">{FOOTNOTE}</p>
    </div>
  ),

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const one = <E extends Element>(sel: string) => ctx.$<E>(sel)
    /** A drawing takes its time; with less motion asked for, the line simply stands there as its group fades in. */
    const span = (d: number) => (reduced ? 0.01 : d)
    /** Strokes draw from nothing. (Not a.draw: it ends on opacity 1, and these lines are quiet by their stroke-opacity.) */
    const draw = (els: Element[], at: number, duration: number, stagger = 0) => {
      if (!els.length) return
      // hidden as well as undrawn: a stroke of no length with a round cap would show as a dot
      gsap.set(els, { drawSVG: '0%', visibility: 'hidden' })
      tl.set(els, { visibility: 'inherit', stagger }, at)
      tl.to(els, { drawSVG: '100%', duration, stagger, ease: ease.glide }, at)
    }

    /* ------------------------------------------------------------- measure first */
    // the words each card is about, to put a stroke under them
    const under = (card: string, words: string[]) => {
      const spans = ctx.$$(`${card} .s06-title .kn-w`).filter((w) => words.includes((w.textContent ?? '').trim()))
      if (!spans.length) return null
      const first = ctx.loc(spans[0])
      const last = ctx.loc(spans[spans.length - 1])
      const fs = parseFloat(getComputedStyle(spans[0]).fontSize)
      return { x: first.x + fs * 0.02, y: first.y + fs * 1.24, w: last.x + last.w - first.x - fs * 0.1 }
    }
    const marks = [
      { el: one<HTMLElement>('.s06-mark[data-for="race"]'), at: under('.s06-card--race', ['fastest']) },
      { el: one<HTMLElement>('.s06-mark[data-for="opex"]'), at: under('.s06-card--opex', ['~300', 'bps']) },
      { el: one<HTMLElement>('.s06-mark[data-for="dpd"]'), at: under('.s06-card--dpd', ['tight', 'control']) },
    ]
    for (const m of marks) if (m.at) gsap.set(m.el, { x: m.at.x, y: m.at.y, width: m.at.w, scaleX: 0, transformOrigin: '0% 50%' })

    // the hand-over on "opex": the clock and the three rows beside the chart travel INTO the deck's own
    // labels in the chart. Measured here, as laid out, before anything is moved or hidden.
    const labelBox = (m: number) => ctx.loc(one<SVGGElement>(`.s06-mk-label[data-m="${m}"]`))
    const labelPx = 0.95 * U // the labels' type in the chart
    /** From an element's own place to a point, shrinking to the label's type: x, y, scale for a transform about (ox, oy) of its box. */
    const into = (el: HTMLElement, cx: number, cy: number, ox = 0.5, oy = 0.5) => {
      const b = ctx.loc(el)
      const s = Math.min(1, labelPx / parseFloat(getComputedStyle(el).fontSize))
      return { el, x: cx - (b.x + b.w * ox + b.w * (0.5 - ox) * s), y: cy - (b.y + b.h * oy + b.h * (0.5 - oy) * s), scale: s }
    }
    const l1 = labelBox(1)
    const trips = [
      // "Piramal Finance in" to the label's first words, "4.5 yrs" to its last
      into(one<HTMLElement>('.s06-hero-who'), l1.x + l1.w * 0.4, l1.cy),
      into(one<HTMLElement>('.s06-hero-num'), l1.x + l1.w * 0.84, l1.cy, 0, 0.6),
      ...[2, 3, 4].map((m) => {
        const l = labelBox(m)
        return into(one<HTMLElement>(`.s06-row[data-m="${m}"]`), l.cx - l.h * 0.5, l.cy)
      }),
    ]

    /* ------------------------------------------------------------- what the numbers draw */
    // three numbers on the timeline: the year the race has reached, and how far each line has run
    const st = { year: 0, opex: 0, dpd: 0 }
    const runners = RUNNERS.map((r, i) => ({
      r,
      path: one<SVGPathElement>(`.s06-curve[data-i="${i}"]`),
      head: one<SVGElement>(r.who === 'us' ? `.s06-race .s06-comet` : `.s06-head[data-i="${i}"]`),
    }))
    const glow = one<SVGPathElement>('.s06-glow')
    const cursor = one<SVGLineElement>('.s06-cursor')
    const clock = one<HTMLElement>('.s06-clock')
    const xticks = ctx.$$<SVGTextElement>('.s06-xtick text')
    const lines = [
      { key: 'opex' as const, track: OPEX_TRACK, x: opexX, path: one<SVGPathElement>('.s06-opex .s06-line'), head: one<SVGElement>('.s06-opex .s06-comet') },
      { key: 'dpd' as const, track: DPD_TRACK, x: dpdX, path: one<SVGPathElement>('.s06-dpd .s06-line'), head: one<SVGElement>('.s06-dpd .s06-comet') },
    ]
    const dash = (path: SVGPathElement, track: Track, l: number) => {
      path.style.strokeDasharray = `${l.toFixed(2)} ${(track.total + 4).toFixed(2)}`
    }
    const paint = () => {
      const x = raceX(st.year)
      for (const { r, path, head } of runners) {
        const p = trackAt(r.track, x)
        dash(path, r.track, p.l)
        head.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`)
        // a peer's light goes out once it is over the line (or its data has run out)
        if (r.who === 'peer') head.style.opacity = String(Math.max(0, Math.min(1, 1 - (st.year - r.endYear) / 0.3)))
        if (r === US) dash(glow, r.track, p.l)
      }
      cursor.setAttribute('transform', `translate(${x.toFixed(2)} 0)`)
      clock.textContent = Math.min(st.year, US.endYear).toFixed(1)
      xticks.forEach((t, k) => {
        t.style.opacity = st.year >= k - 0.03 ? '1' : '0.45'
      })
      for (const l of lines) {
        const p = trackAt(l.track, l.x(st[l.key]))
        dash(l.path, l.track, p.l)
        l.head.setAttribute('transform', `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`)
      }
    }
    paint()
    ctx.onSeek(paint)

    /* ------------------------------------------------------------- hidden states */
    const hero = one<HTMLElement>('.s06-hero')
    const fins = ctx.$$<SVGLineElement>('.s06-fin')
    const mks = ctx.$$<SVGGElement>('.s06-mk')
    const rows = ctx.$$<HTMLElement>('.s06-row')
    const ring = one<SVGCircleElement>('.s06-ring')
    const halo = one<SVGCircleElement>('.s06-race .s06-comet-halo')
    const hundred = one<SVGGElement>('.s06-hundred')
    const num = one<HTMLElement>('.s06-hero-num')
    gsap.set(ctx.$$('.s06-curves, .s06-heads, .s06-cursor, .s06-ring'), { autoAlpha: 0 })
    gsap.set(mks, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
    gsap.set(rows, { autoAlpha: 0, x: reduced ? 0 : U * 1.8 })
    gsap.set(hundred, { scaleX: 0, svgOrigin: `${RACE.x0 - 10} 0` })
    gsap.set(ring, { scale: 0.4, transformOrigin: '50% 50%' })
    gsap.set(halo, { scale: 0.5, transformOrigin: '50% 50%' })
    gsap.set(num, { transformOrigin: '0% 60%' })
    // the clock and its line stand lower while they are alone, and move up when the peers' list comes
    if (!reduced) gsap.set(hero, { y: U * 4.6 })

    /* =================================================================== race */
    a.words('.kn-h', 0.1)
    a.rise('.s06-card--race', 0.45, { y: 2.2 })
    a.pop('.s06-card--race .s06-badge', 0.8)
    a.words('.s06-card--race .s06-title', 0.85, { stagger: 0.03 })
    a.fade('.s06-src', 1.3)

    // the axes arrive first
    draw(ctx.$$('.s06-race .s06-axis'), 1.15, 0.8)
    a.fade('.s06-race .s06-ytick', 1.2, { stagger: 0.035, duration: 0.35 })
    draw(ctx.$$('.s06-gridline'), 1.2, 0.7, 0.035)
    a.fade('.s06-xtick', 1.3, { stagger: 0.03, duration: 0.35 })
    a.fade('.s06-axis-name', 1.5)
    tl.to(hundred, { scaleX: 1, duration: 0.9, ease: ease.glide }, 1.55)

    // the clock beside the chart
    a.pop('.s06-hero-who .s06-disc', 1.6)
    a.words('.s06-hero-name', 1.65)
    a.rise('.s06-hero-num', 1.8, { y: 2 })
    tl.to(fx, { glow: 0.3, focusX: 0.42, focusY: 0.05, warm: 0.25, duration: 1.6 }, 1.2)

    // … then the seven, on the line at Y0, and off
    const GO = 2.45
    const RUN = span(2.7)
    tl.to(ctx.$$('.s06-curves, .s06-heads'), { autoAlpha: 1, duration: 0.3 }, GO - 0.45)
    tl.to(cursor, { autoAlpha: 1, duration: 0.3 }, GO)
    tl.to(halo, { scale: 1, duration: 0.6, ease: 'power2.out' }, GO)
    tl.to(st, { year: US.endYear, duration: RUN, ease: 'power1.in', onUpdate: paint }, GO)

    // ours is over the line: the finish drops to its year, the marker, the deck's label of the curve
    const F = GO + RUN
    tl.to(ring, { autoAlpha: 0.9, duration: 0.06, ease: 'none' }, F - 0.02)
    tl.to(ring, { scale: reduced ? 1 : 5.5, autoAlpha: 0, duration: 0.95, ease: 'power2.out' }, F + 0.04)
    tl.to(halo, { scale: 1.5, duration: 0.14, ease: 'power2.out' }, F - 0.02)
    tl.to(halo, { scale: 0.72, duration: 0.9, ease: 'power2.inOut' }, F + 0.12)
    tl.to(hundred.querySelector('line'), { stroke: '#f16443', strokeOpacity: 1, duration: 0.4 }, F)
    tl.to(one('.s06-ytick[data-v="100"]'), { fill: '#d9481f', duration: 0.4 }, F)
    tl.to(cursor, { autoAlpha: 0, duration: 0.3 }, F)
    draw([fins[0]], F, 0.6)
    // (the numbered markers in the chart wait for their words, on "opex": the "1" beside the clock carries it until then)
    a.rise('.s06-brand', F + 0.1, { y: 1.1 })
    if (!reduced) {
      tl.to(num, { scale: 1.06, duration: 0.14, ease: 'power2.out' }, F)
      tl.to(num, { scale: 1, duration: 0.6, ease: ease.snap }, F + 0.14)
    }
    if (marks[0].at) tl.to(marks[0].el, { scaleX: 1, duration: 0.7, ease: ease.glide }, F + 0.3)
    tl.to(fx, { glow: 0.42, duration: 0.5 }, F)
    tl.addLabel('race', F + 1.15)

    /* =================================================================== peers */
    const P = F + 1.15
    const P_GO = P + 0.35
    const P_RUN = span(3.7)
    const peerEase = gsap.parseEase('power1.inOut')
    tl.to(hero, { y: 0, duration: 0.9, ease: ease.inOut }, P)
    a.rule('.s06-hero-rule', P + 0.55, { duration: 0.8 })
    tl.to(cursor, { autoAlpha: 1, duration: 0.3 }, P_GO)
    tl.to(st, { year: RACE.years, duration: P_RUN, ease: peerEase, onUpdate: paint }, P_GO)
    tl.to(fx, { glow: 0.3, focusX: 0.5, focusY: 0.35, warm: 0, duration: 2.4, ease: ease.inOut }, P)
    FINISHERS.slice(1).forEach((r, k) => {
      // the moment this peer's curve reaches 100
      const at = P_GO + easeReaches(peerEase, (r.endYear - US.endYear) / (RACE.years - US.endYear)) * P_RUN
      draw([fins[k + 1]], at, 0.55)
      tl.to(rows[k], { autoAlpha: 1, x: 0, duration: 0.7, ease: ease.out }, at + 0.05)
    })
    tl.to(cursor, { autoAlpha: 0, duration: 0.4 }, P_GO + P_RUN - 0.35)
    tl.addLabel('peers', P_GO + P_RUN + 0.3)

    /* =================================================================== opex */
    const O = P_GO + P_RUN + 0.3
    const opex = (sel: string) => ctx.$$(`.s06-opex ${sel}`)
    // the list hands over to the deck's own labels in the chart
    // … as a move: the clock shrinks and travels to "Piramal Finance in 4.5 yrs" beside marker 1, the three rows
    // follow to theirs; each label and its numbered marker take over as its traveller arrives
    const labels = ctx.$$<SVGGElement>('.s06-mk-label')
    gsap.set(labels, { autoAlpha: 0 })
    const TRIP = 0.7
    if (reduced) {
      tl.to(hero, { autoAlpha: 0, duration: 0.4 }, O)
      tl.to([...labels, ...mks], { autoAlpha: 1, scale: 1, duration: 0.5 }, O + 0.2)
    } else {
      tl.to(one('.s06-hero-rule'), { autoAlpha: 0, duration: 0.25 }, O)
      trips.forEach((t, k) => {
        const m = Math.max(0, k - 1) // which label: the first two travellers both go to label 1
        const at = O + (k < 2 ? 0 : 0.06 + (k - 2) * 0.07)
        tl.to(t.el, { x: t.x, y: t.y, scale: t.scale, duration: TRIP, ease: ease.inOut }, at)
        tl.to(t.el, { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, at + TRIP - 0.26)
        if (k === 1) return
        tl.to(labels[m], { autoAlpha: 1, duration: 0.26, ease: 'power1.out' }, at + TRIP - 0.2)
        tl.to(mks[m], { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.snap }, at + TRIP - 0.22)
      })
    }
    // card 2 comes once the clock has cleared its place
    const O2 = O + 0.3
    a.rise('.s06-card--opex', O2 + 0.2, { y: 2.2 })
    a.pop('.s06-card--opex .s06-badge', O2 + 0.5)
    a.words('.s06-card--opex .s06-title', O2 + 0.55, { stagger: 0.03 })
    // card 3 waits under it, dimmed, with its axis: the sentence is not finished yet
    const dpdCard = one<HTMLElement>('.s06-card--dpd')
    gsap.set(dpdCard, { autoAlpha: 0, y: reduced ? 0 : U * 2.2 })
    tl.to(dpdCard, { autoAlpha: 0.5, y: 0, duration: 0.8, ease: ease.out }, O2 + 0.4)
    a.pop('.s06-card--dpd .s06-badge', O2 + 0.7)
    // axes first
    draw(opex('.s06-axis'), O2 + 0.8, 0.7)
    a.fade(opex('.s06-tick'), O2 + 0.85, { stagger: 0.04, duration: 0.35 })
    a.fade(opex('.s06-quarters'), O2 + 0.95)
    a.fade(opex('.s06-band--goal, .s06-note--goal'), O2 + 1.25, { duration: 0.7 })
    // then the line, its figures landing as the light passes them
    const O_GO = O2 + 1.6
    const O_RUN = span(2.3)
    const lineEase = gsap.parseEase('power1.inOut')
    const runLine = (chart: string, key: 'opex' | 'dpd', last: number, go: number, run: number) => {
      const q = (sel: string) => ctx.$$<SVGElement>(`${chart} ${sel}`)
      const comet = q('.s06-comet')
      const haloOf = q('.s06-comet-halo')
      gsap.set([...q('.s06-line'), ...comet], { autoAlpha: 0 })
      gsap.set(q('.s06-dot'), { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
      gsap.set(q('.s06-val'), { autoAlpha: 0, y: reduced ? 0 : 4 })
      tl.to([...q('.s06-line'), ...comet], { autoAlpha: 1, duration: reduced ? 0.5 : 0.2 }, go - 0.1)
      tl.to(st, { [key]: last, duration: run, ease: lineEase, onUpdate: paint }, go)
      const when = (i: number) => go + easeReaches(lineEase, i / last) * run
      q('.s06-dot').forEach((dot, i) => tl.to(dot, { autoAlpha: 1, scale: 1, duration: 0.35, ease: ease.snap }, when(i)))
      q('.s06-val').forEach((val, i) => tl.to(val, { autoAlpha: 1, y: 0, duration: 0.4, ease: ease.out }, when(i) + 0.04))
      // the light has done its work: it settles into the last point
      tl.to(haloOf, { scale: 0.62, duration: 0.8, ease: 'power2.inOut', transformOrigin: '50% 50%' }, go + run)
      return when
    }
    const whenOpex = runLine('.s06-opex', 'opex', OPEX_LAST, O_GO, O_RUN)
    // where the guidance was cut, the band steps 25 bps down
    const cut = whenOpex(9.5)
    const lower = opex('.s06-band--lower')
    gsap.set(lower, { autoAlpha: 0, y: reduced ? 0 : -5.6 })
    tl.to(lower, { autoAlpha: 1, duration: 0.4 }, cut)
    tl.to(lower, { y: 0, duration: 0.7, ease: ease.inOut }, cut + 0.25)
    a.fade(opex('.s06-note--cut'), cut + 0.3)
    draw(opex('.s06-arrow'), cut + 0.45, 0.5)
    if (marks[1].at) tl.to(marks[1].el, { scaleX: 1, duration: 0.7, ease: ease.glide }, O_GO + O_RUN - 0.2)
    tl.to(fx, { glow: 0.3, focusX: 0.5, focusY: -0.25, warm: 0.3, duration: 1.6, ease: ease.inOut }, O)
    tl.addLabel('opex', O_GO + O_RUN + 0.75)

    /* =================================================================== risk */
    const K = O_GO + O_RUN + 0.75
    tl.to(dpdCard, { autoAlpha: 1, duration: 0.45 }, K)
    const K_GO = K + 0.4
    const K_RUN = span(2.2)
    runLine('.s06-dpd', 'dpd', DPD_LAST, K_GO, K_RUN)
    if (marks[2].at) tl.to(marks[2].el, { scaleX: 1, duration: 0.7, ease: ease.glide }, K_GO + K_RUN - 0.3)
    tl.to(fx, { focusY: 0.45, warm: -0.1, duration: 1.6, ease: ease.inOut }, K)
    tl.addLabel('risk', K_GO + K_RUN + 0.7)
    return tl
  },
}

export default scene
