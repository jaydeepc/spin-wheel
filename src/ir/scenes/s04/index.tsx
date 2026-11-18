'use client'

/**
 * /ir slide 04 · "…driven by improving operating leverage". Light.
 *
 * THE POINT: the return on the growth book is climbing toward its target, and it climbs because
 * the cost of running the book falls. So the slide is told in two moves.
 *
 *   track    the path: Growth business RoAUM by quarter, three years as three lines drawn across
 *            the whole stage (FY25, FY26, FY27), the long range goal as a band above them, the
 *            Q4 FY27 target as a marker the newest line is heading for.
 *   nim      the path folds to the left and the formula is laid out beside it:
 *            NIM − Opex/AUM − Credit cost = ROAUM, as ONE waterfall on one scale.
 *            NIM stands up first: what the book earns.
 *   opex     Opex/AUM is taken off the top of it (the bars hang from NIM's own level and what is
 *            left stands pale beneath them): 4.2% to 3.6%, 3.7% to 3.3%. The later bar of each
 *            pair first reaches as far as the earlier one, then draws back: the bite gets smaller,
 *            and the stretch it no longer takes stays marked.
 *   credit   Credit cost is taken off what is left. It hardly moves.
 *   roaum    What remains IS the ROAUM: the four pale remainders leave the waterfall, cross into
 *            the result's own panel and grow to its own, larger scale as they land (the page
 *            gives ROAUM its own scale too). The two gains are drawn as the lifts they are:
 *            +40bps, +34bps (the deck's green, its own signal).
 *
 * The three terms are drawn from the chart objects' exact values on one common scale, so the
 * waterfall is true: NIM − Opex/AUM − Credit cost lands on ROAUM (to 1 bp in H1FY26). The result
 * has a floor and a scale of its own; the move into the panel says so. The line chart is a
 * LINKED object in the file (no values): its points stand at the figures the page prints.
 *
 * All of it is one SVG in the stage's own space (10 units = 1u). The line chart is laid out by a
 * plain number k (0 wide … 1 folded) that the timeline tweens: every frame is reachable.
 */

import gsap from 'gsap'
import { anim, Headline, type SceneModule } from '../../kit'
import { EXCL, GOAL, GOAL_BAND, LIFTS, NOTE, NOTE_HEAD, PERIODS, QUARTERS, SUB_BOLD, SUB_LIGHT, TARGET, TARGET_LINES, TERMS, TICKS, TRACKS } from './data'
import './scene.css'

/** stage units to SVG units */
const P = (n: number) => +(n * 10).toFixed(2)

/* ------------------------------------------------------------------ the path (line chart) */

const LX = { axis: 7.7, first: 10.4, wide: 87.6, tight: 27.0 }
const xr = (k: number) => LX.wide + (LX.tight - LX.wide) * k
const px = (i: number, k: number) => LX.first + ((xr(k) - LX.first) * i) / (QUARTERS.length - 1)
const py = (v: number) => 44.2 - (v - 0.75) * 10.3
const AXIS_Y = 44.6
/** how far past the last point the plot runs (the lines' names stand there) */
const TAIL = 1.3

/** a smooth line through the points (Catmull-Rom as cubic Béziers), in SVG units */
function curve(pts: [number, number][]) {
  let d = `M${P(pts[0][0])} ${P(pts[0][1])}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${P(c1[0])} ${P(c1[1])} ${P(c2[0])} ${P(c2[1])} ${P(p2[0])} ${P(p2[1])}`
  }
  return d
}
const trackPath = (s: number, k: number) => curve(TRACKS[s].values.map((v, i) => [px(i, k), py(v)] as [number, number]))
const trackEnd = (s: number, k: number) => px(TRACKS[s].values.length - 1, k)
const at = (x: number, y: number) => `translate(${P(x)} ${P(y)})`

const TRACK_TONE = ['grey', 'navy', 'azure'] as const

/* ------------------------------------------------------------------ the waterfall */

/** the three terms: ONE common scale, so what is taken off is true to size */
const WF = { x0: 34.5, bw: 2.1, pitch: 3.5, pairGap: 0.5, op: 2.0, base: 43.4, scale: 3.42 }
const GROUP_W = WF.pitch * 3 + WF.pairGap + WF.bw
const gx = (g: number) => WF.x0 + g * (GROUP_W + WF.op)
const bx = (g: number, j: number) => gx(g) + j * WF.pitch + (j >= 2 ? WF.pairGap : 0)
const WF_END = gx(2) + GROUP_W
/** a value (a fraction) as a height above the baseline, in u */
const hOf = (frac: number) => frac * 100 * WF.scale
const yOf = (frac: number) => WF.base - hOf(frac)

/** the result: its own panel, its own floor and its own, larger scale (as the page gives it) */
const PN = { x: 80.2, w: 15.4, pad: 1.0, bw: 2.3, pitch: 3.55, pairGap: 0.4, top: 12.5, bottom: 47.1, scale: 10.5 }
const pbx = (j: number) => PN.x + PN.pad + j * PN.pitch + (j >= 2 ? PN.pairGap : 0)
const pH = (frac: number) => frac * 100 * PN.scale
const pY = (frac: number) => WF.base - pH(frac)
const BPS_Y = 20.3

const [NIM, OPEX, CREDIT, ROAUM] = TERMS
const FALL = [NIM, OPEX, CREDIT]
/** per period: the level the bar of each term starts from (its top) and ends at (its bottom) */
const SPAN = PERIODS.map((_, j) => {
  const nim = NIM.values[j]
  const afterOpex = nim - OPEX.values[j]
  const afterCredit = afterOpex - CREDIT.values[j]
  return [
    { top: nim, bottom: 0 },
    { top: nim, bottom: afterOpex },
    { top: afterOpex, bottom: afterCredit },
  ]
})
/** the later period of each pair is set against the earlier one */
const PAIRS = LIFTS.map((l) => ({ from: l.from, to: l.to }))
const pairOf = (j: number) => PAIRS.find((pr) => pr.to === j)
const liftOf = (j: number) => LIFTS.find((l) => l.to === j)
const OPS = ['', 'minus', 'minus', 'equals'] as const
const OP_X = [0, gx(1) - WF.op / 2, gx(2) - WF.op / 2, (WF_END + PN.x) / 2]
const HEAD_X = [gx(0) + GROUP_W / 2, gx(1) + GROUP_W / 2, gx(2) + GROUP_W / 2, PN.x + PN.w / 2]
const HEAD_Y = 15.05
/** a bar with only its top corners rounded (a cap standing on the bar beneath it) */
const capPath = (x: number, y: number, w: number, h: number, r = 0.24) =>
  `M${P(x)} ${P(y + h)} V${P(y + r)} Q${P(x)} ${P(y)} ${P(x + r)} ${P(y)} H${P(x + w - r)} Q${P(x + w)} ${P(y)} ${P(x + w)} ${P(y + r)} V${P(y + h)} Z`

const scene: SceneModule = {
  beats: ['track', 'nim', 'opex', 'credit', 'roaum'],

  Scene: ({ slide }) => (
    <div className="ir04">
      <Headline text={slide.title} />

      <p className="ir04-sub">
        <b>{SUB_BOLD}</b>
        <span>{SUB_LIGHT}</span>
      </p>
      <p className="ir04-excl">
        {EXCL[0]}
        <sup>{EXCL[1]}</sup>
        {EXCL[2]}
      </p>

      <svg className="ir04-svg kn-chart" viewBox="0 0 1000 562.5" role="img" aria-label={`${SUB_BOLD}${SUB_LIGHT}`}>
        <defs>
          <pattern id="ir04-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="9" stroke="#4384d4" strokeWidth="1.1" opacity="0.34" />
            <line x1="0" y1="0" x2="9" y2="0" stroke="#4384d4" strokeWidth="1.1" opacity="0.34" />
          </pattern>
          {TRACKS.map((_, s) => (
            <clipPath key={s} id={`ir04-clip-${s}`} clipPathUnits="userSpaceOnUse">
              <rect className="ir04-cliprect" data-s={s} x={P(LX.axis)} y={P(16)} width={0} height={P(31)} />
            </clipPath>
          ))}
        </defs>

        {/* ---------------- the path ---------------- */}
        <g className="ir04-track">
          <g className="ir04-goal">
            <rect className="ir04-band ir04-band--tint" x={P(LX.axis)} y={P(py(GOAL_BAND.to))} width={P(xr(0) + TAIL - LX.axis)} height={P(py(GOAL_BAND.from) - py(GOAL_BAND.to))} rx={3} />
            <rect className="ir04-band" x={P(LX.axis)} y={P(py(GOAL_BAND.to))} width={P(xr(0) + TAIL - LX.axis)} height={P(py(GOAL_BAND.from) - py(GOAL_BAND.to))} rx={3} fill="url(#ir04-hatch)" />
            <text className="ir04-band-label" x={P((LX.axis + xr(0) + TAIL) / 2)} y={P((py(GOAL_BAND.from) + py(GOAL_BAND.to)) / 2 + 0.38)} fontSize={11.5} textAnchor="middle">
              {GOAL[0]}
              <tspan dy={-3.6} fontSize={8.5}>
                {GOAL[1]}
              </tspan>
            </text>
          </g>

          {TICKS.map((t) => (
            <g key={t.v}>
              <line className="ir04-tick kn-chart-tick" x1={P(LX.axis)} y1={P(py(t.v))} x2={P(xr(0) + TAIL)} y2={P(py(t.v))} />
              <text className="ir04-ticktext" x={P(LX.axis - 0.7)} y={P(py(t.v) + 0.3)} fontSize={9} textAnchor="end">
                {t.text}
              </text>
            </g>
          ))}
          {QUARTERS.map((q, i) => (
            <text key={q} className="ir04-q" data-i={i} x={P(px(i, 0))} y={P(AXIS_Y + 1.55)} fontSize={9.4} textAnchor="middle">
              {q}
            </text>
          ))}

          {TRACKS.map((tr, s) => (
            <g key={tr.name} className={`ir04-series ir04-series--${TRACK_TONE[s]}`}>
              <g clipPath={`url(#ir04-clip-${s})`}>
                <path className="ir04-path" data-s={s} d={trackPath(s, 0)} />
              </g>
              {tr.values.map((v, i) => (
                <g key={i} className="ir04-pt" data-s={s} data-i={i} transform={at(px(i, 0), py(v))}>
                  <circle className="ir04-dot" data-s={s} data-i={i} r={s === 2 ? 5.4 : 4.4} />
                  {/* the last figure of the lowest line stands under its line's name, clear of the climb */}
                  <text
                    className="ir04-fig"
                    data-s={s}
                    data-i={i}
                    x={s === 0 && i === tr.values.length - 1 ? 12.5 : 0}
                    y={s === 0 ? (i === tr.values.length - 1 ? 16.5 : 20.5) : -10.5}
                    fontSize={s === 2 ? 12.5 : 10.6}
                    textAnchor={s === 0 && i === tr.values.length - 1 ? 'start' : 'middle'}
                  >
                    {tr.texts[i]}
                  </text>
                </g>
              ))}
              <g className="ir04-tagpos" data-s={s} transform={at(trackEnd(s, 0) + 1.25, py(tr.values[tr.values.length - 1]))}>
                <text className="ir04-tag" data-s={s} y={3.4} fontSize={s === 2 ? 11.5 : 10}>
                  {tr.name}
                </text>
              </g>
            </g>
          ))}

          <g className="ir04-targetpos" transform={at(px(TARGET.quarter, 0), py(TARGET.value))}>
            <g className="ir04-target-note">
              {TARGET_LINES.map((line, i) => (
                <text key={i} className="ir04-target-line" x={-39} y={-2.6 + i * 11.4} fontSize={9.6} textAnchor="end">
                  {line}
                </text>
              ))}
              <path className="ir04-target-arrow" d="M-33 0.6 H-18 M-22.4 -3 L-18 0.6 L-22.4 4.2" />
            </g>
            <g className="ir04-target-mark">
              <circle className="ir04-ring" r={10} />
              <circle className="ir04-core" r={4.4} />
            </g>
            <text className="ir04-target-fig" y={-17} fontSize={13.5} textAnchor="middle">
              {TARGET.text}
            </text>
          </g>
        </g>

        {/* ---------------- the waterfall: three terms on one scale ---------------- */}
        <rect className="ir04-result" x={P(PN.x)} y={P(PN.top)} width={P(PN.w)} height={P(PN.bottom - PN.top)} rx={12} />
        <g className="ir04-fall">
          <line className="ir04-base kn-chart-axis" x1={P(gx(0) - 0.6)} y1={P(WF.base)} x2={P(WF_END + 0.6)} y2={P(WF.base)} />

          {/* the formula's own line: the operator, then the term */}
          {TERMS.map((term, g) => (
            <g key={term.key}>
              {OPS[g] ? (
                <g transform={at(OP_X[g], HEAD_Y - 0.52)}>
                  <g className="ir04-op" data-g={g}>
                    {OPS[g] === 'minus' ? <path d="M-4.4 0 H4.4" /> : <path d="M-4.4 -2.4 H4.4 M-4.4 2.4 H4.4" />}
                  </g>
                </g>
              ) : null}
              <text className="ir04-term" data-g={g} x={P(HEAD_X[g])} y={P(HEAD_Y)} fontSize={15} textAnchor="middle">
                {term.name}
              </text>
            </g>
          ))}

          {FALL.map((term, g) => (
            <g key={term.key} className={`ir04-group ir04-group--${term.key}`}>
              <line
                className="ir04-split"
                data-g={g}
                x1={P(bx(g, 1) + WF.bw + (WF.pitch - WF.bw + WF.pairGap) / 2)}
                x2={P(bx(g, 1) + WF.bw + (WF.pitch - WF.bw + WF.pairGap) / 2)}
                y1={P(yOf(Math.max(...SPAN.map((sp) => sp[g].top))) - 0.2)}
                y2={P(WF.base + 1.95)}
              />

              {PERIODS.map((period, j) => {
                const sp = SPAN[j][g]
                const x = P(bx(g, j))
                const late = j % 2 === 1
                const pair = g === 1 ? pairOf(j) : undefined
                // how much less Opex/AUM takes than in the period before: the stretch it no longer reaches
                const savedH = pair ? hOf(OPEX.values[pair.from] - OPEX.values[j]) : 0
                return (
                  <g key={period}>
                    {g === 1 || g === 2 ? (
                      <rect className="ir04-ghost" data-g={g} data-j={j} x={x} y={P(yOf(sp.top))} width={P(WF.bw)} height={P(hOf(sp.top))} rx={2.4} />
                    ) : null}
                    {pair ? (
                      <g className="ir04-saved" data-j={j}>
                        <rect className="ir04-saved-box" x={x + 0.8} y={P(yOf(sp.bottom))} width={P(WF.bw) - 1.6} height={P(savedH)} />
                        <line className="ir04-saved-tick" x1={x - 4} x2={x + P(WF.bw) + 4} y1={P(yOf(sp.bottom) + savedH)} y2={P(yOf(sp.bottom) + savedH)} />
                      </g>
                    ) : null}
                    <rect
                      className={`ir04-bar ir04-bar--${term.key} ${late ? 'ir04-bar--late' : 'ir04-bar--early'}`}
                      data-g={g}
                      data-j={j}
                      x={x}
                      y={P(yOf(sp.top))}
                      width={P(WF.bw)}
                      height={P(hOf(sp.top - sp.bottom))}
                      rx={2.4}
                    />
                    <text className="ir04-val" data-g={g} data-j={j} x={P(bx(g, j) + WF.bw / 2)} y={P(yOf(sp.top) - 0.6)} fontSize={10.4} textAnchor="middle">
                      {term.texts[j]}
                    </text>
                    <text className="ir04-cat" data-g={g} x={P(bx(g, j) + WF.bw / 2)} y={P(WF.base + 1.5)} fontSize={9.5} textAnchor="middle">
                      {period}
                    </text>
                  </g>
                )
              })}
            </g>
          ))}
        </g>

        {/* ---------------- the result: what is left, on its own stage ---------------- */}
        <g className="ir04-panel">
          <line className="ir04-pbase kn-chart-axis" x1={P(PN.x + 0.5)} y1={P(WF.base)} x2={P(PN.x + PN.w - 0.5)} y2={P(WF.base)} />
          <line
            className="ir04-split"
            data-g={3}
            x1={P(pbx(1) + PN.bw + (PN.pitch - PN.bw + PN.pairGap) / 2)}
            x2={P(pbx(1) + PN.bw + (PN.pitch - PN.bw + PN.pairGap) / 2)}
            y1={P(BPS_Y + 1.6)}
            y2={P(WF.base + 1.95)}
          />
          {PERIODS.map((period, j) => {
            const v = ROAUM.values[j]
            const lift = liftOf(j)
            const late = j % 2 === 1
            return (
              <g key={period}>
                <rect
                  className={`ir04-bar ir04-bar--roaum ${late ? 'ir04-bar--late' : 'ir04-bar--early'}`}
                  data-g={3}
                  data-j={j}
                  x={P(pbx(j))}
                  y={P(pY(v))}
                  width={P(PN.bw)}
                  height={P(pH(v))}
                  rx={2.4}
                />
                {lift ? <path className="ir04-cap" data-j={j} d={capPath(pbx(j), pY(v), PN.bw, pH(v - ROAUM.values[lift.from]))} /> : null}
                <text className="ir04-val ir04-val--result" data-g={3} data-j={j} x={P(pbx(j) + PN.bw / 2)} y={P(pY(v) - 0.65)} fontSize={12.4} textAnchor="middle">
                  {ROAUM.texts[j]}
                </text>
                <text className="ir04-cat" data-g={3} x={P(pbx(j) + PN.bw / 2)} y={P(WF.base + 1.5)} fontSize={9.5} textAnchor="middle">
                  {period}
                </text>
              </g>
            )
          })}

          {LIFTS.map((l, p) => {
            const y0 = pY(ROAUM.values[l.from])
            const y1 = pY(ROAUM.values[l.to])
            const gapX = pbx(l.from) + PN.bw + (PN.pitch - PN.bw) / 2
            return (
              <g key={l.text} className="ir04-lift" data-p={p}>
                {/* the level of the bar before, carried across; the climb from it */}
                <line className="ir04-lift-level" data-p={p} x1={P(pbx(l.from) + PN.bw)} x2={P(pbx(l.to))} y1={P(y0)} y2={P(y0)} />
                <g className="ir04-lift-arrow" data-p={p}>
                  <path className="ir04-lift-stem" d={`M${P(gapX)} ${P(y0)} V${P(y1 + 0.55)}`} />
                  <path className="ir04-lift-head" d={`M${P(gapX - 0.36)} ${P(y1 + 0.78)} L${P(gapX)} ${P(y1 + 0.12)} L${P(gapX + 0.36)} ${P(y1 + 0.78)}`} />
                </g>
                <g transform={at(pbx(l.to) + PN.bw, BPS_Y)}>
                  <g className="ir04-lift-in" data-p={p}>
                    <path className="ir04-lift-tri" d="M-60 -0.8 L-54.5 -10.4 L-49 -0.8 Z" />
                    <text className="ir04-lift-fig" data-p={p} x={0} y={0} fontSize={15} textAnchor="end">
                      {l.text}
                    </text>
                  </g>
                </g>
              </g>
            )
          })}
        </g>
      </svg>

      <p className="ir04-note">
        <b>{NOTE_HEAD}</b>
        {NOTE}
      </p>
    </div>
  ),

  build(ctx) {
    const { ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const $$ = <T extends Element = SVGElement>(sel: string) => ctx.$$(sel) as unknown as T[]
    const set = (els: Element[], vars: gsap.TweenVars) => {
      if (els.length) gsap.set(els, vars)
    }
    const to = (els: Element[], vars: gsap.TweenVars, pos: number) => {
      if (els.length) tl.to(els, vars, pos)
    }

    /* ---- the path's layout: one plain state, drawn by one function ---- */
    const st = { k: 0, r0: reduced ? 1 : 0, r1: reduced ? 1 : 0, r2: reduced ? 1 : 0 }
    const el = {
      ticks: $$<SVGLineElement>('.ir04-tick'),
      bands: $$<SVGRectElement>('.ir04-band'),
      bandLabel: ctx.$('.ir04-band-label'),
      qs: $$<SVGTextElement>('.ir04-q'),
      paths: $$<SVGPathElement>('.ir04-path'),
      clips: $$<SVGRectElement>('.ir04-cliprect'),
      pts: $$<SVGGElement>('.ir04-pt'),
      tags: $$<SVGGElement>('.ir04-tagpos'),
      target: ctx.$('.ir04-targetpos'),
    }
    const draw = () => {
      const k = st.k
      const right = P(xr(k) + TAIL)
      for (const t of el.ticks) t.setAttribute('x2', String(right))
      for (const b of el.bands) b.setAttribute('width', String(P(xr(k) + TAIL - LX.axis)))
      el.bandLabel.setAttribute('x', String(P((LX.axis + xr(k) + TAIL) / 2)))
      el.qs.forEach((q, i) => q.setAttribute('x', String(P(px(i, k)))))
      el.paths.forEach((p, s) => p.setAttribute('d', trackPath(s, k)))
      const reveal = [st.r0, st.r1, st.r2]
      el.clips.forEach((c, s) => c.setAttribute('width', String(P((trackEnd(s, k) + 0.8 - LX.axis) * reveal[s]))))
      for (const p of el.pts) {
        const s = Number(p.dataset.s)
        const i = Number(p.dataset.i)
        p.setAttribute('transform', at(px(i, k), py(TRACKS[s].values[i])))
      }
      el.tags.forEach((t, s) => t.setAttribute('transform', at(trackEnd(s, k) + 1.25, py(TRACKS[s].values[TRACKS[s].values.length - 1]))))
      el.target.setAttribute('transform', at(px(TARGET.quarter, k), py(TARGET.value)))
    }
    draw()

    /* ================================================================ 1 · track */
    a.words('.kn-h', 0.1)
    a.rise('.ir04-sub', 0.45, { y: 1 })
    a.rise('.ir04-excl', 0.6, { y: 1 })

    // the frame of the plot
    a.draw('.ir04-tick', 0.75, { duration: 0.9, stagger: 0.05 })
    a.fade('.ir04-ticktext', 0.85, { stagger: 0.05 })
    a.fade('.ir04-q', 0.95, { stagger: 0.07 })

    // the three years, one after another; each point lands as its line reaches it
    const LINE = [
      { start: 1.15, dur: 1.25 },
      { start: 1.75, dur: 1.25 },
      { start: 2.55, dur: 0.75 },
    ]
    const paths = $$('.ir04-path')
    TRACKS.forEach((tr, s) => {
      const { start, dur } = LINE[s]
      const key = `r${s}` as 'r0' | 'r1' | 'r2'
      if (reduced) {
        set([paths[s]], { autoAlpha: 0 })
        to([paths[s]], { autoAlpha: 1, duration: 0.5 }, start)
      } else {
        tl.to(st, { [key]: 1, duration: dur, ease: 'power1.inOut', onUpdate: draw }, start)
      }
      const span = tr.values.length - 1
      // where along the WHOLE plot the line's point i is, so that a dot lands as the edge passes it
      const when = (i: number) => start + dur * (0.12 + 0.8 * (i / Math.max(1, span)))
      const dots = $$(`.ir04-dot[data-s="${s}"]`)
      const figs = $$(`.ir04-fig[data-s="${s}"]`)
      set(dots, { autoAlpha: 0, scale: reduced ? 1 : 0, transformOrigin: '50% 50%' })
      set(figs, { autoAlpha: 0 })
      dots.forEach((d, i) => tl.to(d, { autoAlpha: 1, scale: 1, duration: 0.4, ease: ease.snap }, when(i)))
      figs.forEach((f, i) => tl.to(f, { autoAlpha: 1, duration: 0.35 }, when(i) + 0.08))
      const tag = $$(`.ir04-tag[data-s="${s}"]`)
      set(tag, { autoAlpha: 0, x: reduced ? 0 : -8 })
      to(tag, { autoAlpha: 1, x: 0, duration: 0.5, ease: ease.out }, start + dur * 0.95)
    })

    // where it is going: the long range goal above, the Q4 FY27 target ahead of the newest line
    const goal = $$('.ir04-goal')
    set(goal, { autoAlpha: 0 })
    to(goal, { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, 2.3)
    const note = $$('.ir04-target-note')
    const mark = $$('.ir04-target-mark')
    const tfig = $$('.ir04-target-fig')
    set(note, { autoAlpha: 0, x: reduced ? 0 : -14 })
    set(mark, { autoAlpha: 0, scale: reduced ? 1 : 0.2, transformOrigin: '50% 50%' })
    set(tfig, { autoAlpha: 0, y: reduced ? 0 : 6 })
    to(mark, { autoAlpha: 1, scale: 1, duration: 0.7, ease: ease.snap }, 3.25)
    to(tfig, { autoAlpha: 1, y: 0, duration: 0.5, ease: ease.out }, 3.45)
    to(note, { autoAlpha: 1, x: 0, duration: 0.6, ease: ease.out }, 3.5)

    a.fade('.ir04-note', 3.3, { duration: 0.7 })

    tl.to(fx, { glow: 0.22, focusX: 0.55, focusY: -0.15, duration: 2.4, ease: 'power2.out' }, 1.2)
    tl.addLabel('track', 4.2)

    /* ================================================================ 2 · nim */
    const T2 = 4.2
    // the path folds to the left: same heights, a quarter of the width
    tl.to(st, { k: 1, duration: reduced ? 0.01 : 1.15, ease: ease.inOut, onUpdate: draw }, T2)
    tl.to(fx, { focusX: 0.1, glow: 0.12, duration: 1.4, ease: ease.inOut }, T2)

    // the formula's line and the floor it stands on: quiet until each term is spoken
    const QUIET = 0.3
    const terms = $$('.ir04-term')
    const ops = $$('.ir04-op')
    a.draw('.ir04-base', T2 + 0.75, { duration: 0.9 })
    set([...terms, ...ops], { autoAlpha: 0, y: reduced ? 0 : 6 })
    terms.forEach((t, g) => tl.to(t, { autoAlpha: QUIET, y: 0, duration: 0.5, ease: ease.out }, T2 + 0.85 + g * 0.1))
    ops.forEach((o, i) => tl.to(o, { autoAlpha: QUIET, y: 0, duration: 0.5, ease: ease.out }, T2 + 0.9 + i * 0.1))
    set($$('.ir04-cat'), { autoAlpha: 0 })
    set($$('.ir04-split'), { autoAlpha: 0 })

    /** a term is spoken: its name (and its operator) come up to full strength, its periods are named */
    const speak = (g: number, pos: number, catsAt = pos + 0.1) => {
      to([terms[g]], { autoAlpha: 1, duration: 0.45 }, pos)
      const op = $$(`.ir04-op[data-g="${g}"]`)
      to(op, { autoAlpha: 1, duration: 0.45 }, pos)
      if (op.length && !reduced) {
        gsap.set(op, { scale: 1, transformOrigin: '50% 50%' })
        tl.to(op, { scale: 1.5, duration: 0.22, ease: 'power2.out' }, pos).to(op, { scale: 1, duration: 0.4, ease: 'power2.inOut' }, pos + 0.22)
      }
      to($$(`.ir04-cat[data-g="${g}"]`), { autoAlpha: 1, duration: 0.4, stagger: 0.05 }, catsAt)
      to($$(`.ir04-split[data-g="${g}"]`), { autoAlpha: 1, duration: 0.6 }, catsAt + 0.1)
    }
    /** one figure counts up to what the page prints (by way of `via`, if it first reaches further) */
    const figure = (g: number, j: number, pos: number, via?: { value: number; hold: number }) => {
      const v = $$<SVGTextElement>(`.ir04-val[data-g="${g}"][data-j="${j}"]`)[0]
      if (!v) return
      const end = TERMS[g].values[j] * 100
      const text = TERMS[g].texts[j]
      const s = { n: 0, done: 0 }
      const write = () => {
        v.textContent = s.done >= 1 ? text : `${s.n.toFixed(1)}%`
      }
      write()
      gsap.set(v, { autoAlpha: 0 })
      tl.to(v, { autoAlpha: 1, duration: 0.3 }, pos)
      if (via && !reduced) {
        tl.to(s, { n: via.value * 100, duration: 0.8, ease: 'power2.out', onUpdate: write }, pos)
        tl.to(s, { n: end, duration: 0.8, ease: 'power2.inOut', onUpdate: write }, pos + via.hold)
        tl.to(s, { done: 1, duration: 0.01, onUpdate: write }, pos + via.hold + 0.8)
      } else {
        tl.to(s, { n: end, duration: 0.8, ease: 'power2.out', onUpdate: write }, pos)
        tl.to(s, { done: 1, duration: 0.01, onUpdate: write }, pos + 0.8)
      }
    }
    const figures = (g: number, pos: number, gap: number) => PERIODS.forEach((_, j) => figure(g, j, pos + j * gap))
    /** the bars of a term grow from `origin` */
    const grow = (g: number, pos: number, gap: number, origin: string, dur = 0.95) => {
      const bars = $$(`.ir04-bar[data-g="${g}"]`)
      if (reduced) {
        set(bars, { autoAlpha: 0 })
        to(bars, { autoAlpha: 1, duration: 0.5, stagger: gap }, pos)
      } else {
        set(bars, { scaleY: 0, transformOrigin: origin })
        to(bars, { scaleY: 1, duration: dur, stagger: gap, ease: ease.out }, pos)
      }
    }
    /** the pale remainders of a term stand up first: what the term before it left */
    const ghosts = (g: number, pos: number) => {
      const gh = $$(`.ir04-ghost[data-g="${g}"]`)
      if (reduced) {
        set(gh, { autoAlpha: 0 })
        to(gh, { autoAlpha: 1, duration: 0.4, stagger: 0.06 }, pos)
      } else {
        set(gh, { scaleY: 0, transformOrigin: '50% 100%' })
        to(gh, { scaleY: 1, duration: 0.6, stagger: 0.07, ease: ease.out }, pos)
      }
    }

    speak(0, T2 + 1.35)
    grow(0, T2 + 1.4, 0.11, '50% 100%')
    figures(0, T2 + 1.75, 0.11)
    tl.addLabel('nim', T2 + 3.0)

    /* ================================================================ 3 · opex */
    // Opex/AUM is taken off the top of NIM. The later bar of each pair first reaches as far as the
    // earlier one did, then draws back to its own length: the stretch it no longer takes stays marked.
    const T3 = T2 + 3.0
    speak(1, T3 + 0.05)
    ghosts(1, T3 + 0.1)
    const opexBars = $$('.ir04-bar[data-g="1"]')
    const HOLD = 1.05
    opexBars.forEach((bar, j) => {
      const pair = pairOf(j)
      const pairIndex = PAIRS.findIndex((pr) => pr.from === j || pr.to === j)
      const start = T3 + 0.6 + pairIndex * 0.45 + (pair ? 0.2 : 0)
      const saved = $$(`.ir04-saved[data-j="${j}"]`)
      set(saved, { autoAlpha: 0 })
      if (reduced) {
        gsap.set(bar, { autoAlpha: 0 })
        tl.to(bar, { autoAlpha: 1, duration: 0.5 }, start)
        to(saved, { autoAlpha: 1, duration: 0.5 }, start + 0.3)
        figure(1, j, start + 0.2)
        return
      }
      gsap.set(bar, { scaleY: 0, transformOrigin: '50% 0%' })
      if (!pair) {
        tl.to(bar, { scaleY: 1, duration: 0.95, ease: ease.out }, start)
        figure(1, j, start + 0.25)
        return
      }
      const reach = OPEX.values[pair.from] / OPEX.values[j]
      tl.to(bar, { scaleY: reach, duration: 0.85, ease: ease.out }, start)
      tl.to(bar, { scaleY: 1, duration: 0.8, ease: 'power2.inOut' }, start + HOLD)
      to(saved, { autoAlpha: 1, duration: 0.5 }, start + HOLD + 0.15)
      figure(1, j, start + 0.2, { value: OPEX.values[pair.from], hold: HOLD - 0.2 })
    })
    tl.to(fx, { focusX: 0.3, warm: 0.25, glow: 0.2, duration: 1.4, ease: ease.inOut }, T3)
    tl.addLabel('opex', T3 + 3.4)

    /* ================================================================ 4 · credit */
    const T4 = T3 + 3.4
    speak(2, T4 + 0.05)
    ghosts(2, T4 + 0.1)
    grow(2, T4 + 0.55, 0.11, '50% 0%', 0.8)
    figures(2, T4 + 0.8, 0.11)
    tl.to(fx, { focusX: 0.5, warm: 0, duration: 1.2, ease: ease.inOut }, T4)
    tl.addLabel('credit', T4 + 2.1)

    /* ================================================================ 5 · roaum */
    // What is left under Credit cost IS the ROAUM: the four remainders leave the waterfall, cross
    // into the panel and grow to the panel's own scale as they land. Then the two gains are lifted.
    const T5 = T4 + 2.1
    const result = $$('.ir04-result')
    set(result, { autoAlpha: 0, scaleY: reduced ? 1 : 0.92, transformOrigin: '50% 100%' })
    to(result, { autoAlpha: 1, scaleY: 1, duration: 0.8, ease: ease.out }, T5)
    a.draw('.ir04-pbase', T5 + 0.35, { duration: 0.7 })
    speak(3, T5 + 0.05, T5 + 1.35)
    // the three terms step back: the result is the only thing at full strength
    to($$('.ir04-bar[data-g="0"], .ir04-bar[data-g="2"]'), { opacity: 0.5, duration: 0.8 }, T5 + 0.3)
    to($$('.ir04-val[data-g="0"], .ir04-val[data-g="2"]'), { opacity: 0.75, duration: 0.8 }, T5 + 0.3)

    const FILL = { early: ['#cfdcf3', '#9cc3f3'], late: ['#b9cff0', '#2d6ad1'] }
    const movers = $$('.ir04-bar[data-g="3"]')
    const LAND: number[] = []
    movers.forEach((m, j) => {
      const tone = j % 2 === 1 ? FILL.late : FILL.early
      // the last one leaves first: nothing crosses in front of a bar that is still standing
      const go = T5 + 0.55 + (movers.length - 1 - j) * 0.13
      LAND[j] = go + 1.15
      if (reduced) {
        gsap.set(m, { autoAlpha: 0 })
        tl.to(m, { autoAlpha: 1, duration: 0.5 }, go)
        figure(3, j, go + 0.2)
        return
      }
      gsap.set(m, {
        autoAlpha: 0,
        x: P(bx(2, j)) - P(pbx(j)),
        scaleX: WF.bw / PN.bw,
        scaleY: WF.scale / PN.scale,
        transformOrigin: '0% 100%',
        fill: tone[0],
      })
      tl.to(m, { autoAlpha: 1, duration: 0.3 }, T5 + 0.12)
      tl.to(m, { x: 0, scaleX: 1, duration: 1.15, ease: ease.inOut }, go)
      tl.to(m, { scaleY: 1, duration: 0.85, ease: 'power3.out' }, go + 0.55)
      tl.to(m, { fill: tone[1], duration: 0.8, ease: 'power1.inOut' }, go + 0.35)
      figure(3, j, go + 0.75)
    })

    // the gains: the level of the bar before is carried across, the green cap rises from it, the figure counts
    LIFTS.forEach((l, p) => {
      const at0 = Math.max(...LAND) + 0.15 + p * 0.45
      const cap = $$(`.ir04-cap[data-j="${l.to}"]`)
      const level = $$(`.ir04-lift-level[data-p="${p}"]`)
      const arrow = $$(`.ir04-lift-arrow[data-p="${p}"]`)
      const inner = $$(`.ir04-lift-in[data-p="${p}"]`)
      const fig = $$<SVGTextElement>(`.ir04-lift-fig[data-p="${p}"]`)[0]
      set(level, { autoAlpha: 0 })
      to(level, { autoAlpha: 1, duration: 0.35 }, at0)
      if (reduced) {
        set([...cap, ...arrow], { autoAlpha: 0 })
        to([...cap, ...arrow], { autoAlpha: 1, duration: 0.5 }, at0 + 0.1)
      } else {
        set(cap, { scaleY: 0, transformOrigin: '50% 100%' })
        to(cap, { scaleY: 1, duration: 0.75, ease: ease.snap }, at0 + 0.15)
        set(arrow, { autoAlpha: 0, scaleY: 0, transformOrigin: '50% 100%' })
        to(arrow, { autoAlpha: 1, duration: 0.2 }, at0 + 0.15)
        to(arrow, { scaleY: 1, duration: 0.7, ease: ease.out }, at0 + 0.15)
      }
      set(inner, { autoAlpha: 0, y: reduced ? 0 : 16 })
      to(inner, { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.snap }, at0 + 0.35)
      if (fig) {
        const s = { v: 0 }
        const write = () => {
          fig.textContent = s.v >= l.bps - 0.01 ? l.text : `+${Math.round(s.v)}bps`
        }
        write()
        tl.to(s, { v: l.bps, duration: 0.9, ease: 'power2.out', onUpdate: write }, at0 + 0.35)
      }
    })
    tl.to(fx, { focusX: 0.72, focusY: 0.1, glow: 0.3, duration: 1.6, ease: ease.inOut }, T5)
    tl.addLabel('roaum', Math.max(...LAND) + 0.15 + 0.45 + 1.5)

    return tl
  },
}

export default scene
