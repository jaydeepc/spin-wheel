/**
 * Slide 07 · the profit chart, drawn from the pack's data as one SVG that covers the card
 * (one unit is 1/10 of a --u, as in the kit's charts). The kit's bar charts have no bars that
 * rise out of the baseline with their figure riding on them, no pills, and no dashed box of
 * guidance: so it is drawn here. Nothing in this file moves; the scene's build() does that.
 */
import type { CSSProperties } from 'react'
import { CALLOUTS, GUIDANCE, GUIDANCE_RANGE, GUIDANCE_TAG, H1_TAG, LEGEND_PAT, LEGEND_PBT, YEARS } from './data'

/** The card, in 1/10 u, and the chart's frame inside it. */
export const G = {
  W: 916,
  H: 342,
  /** the baseline */
  base: 302,
  /**
   * 2,300 (the top of the guidance) stands 206 high: every bar and the box are on this one scale.
   * It leaves 6u between the card's title and the box, for the figure the slide is about.
   */
  perUnit: 206 / GUIDANCE_RANGE[1],
  barW: 70,
  xs: [170, 309, 448, 587, 727],
  axis: [96, 800] as const,
  divider: 657,
  /** the divider begins under the guidance figure and the arrow that leads to it */
  dividerTop: 106,
}
export const topOf = (v: number) => G.base - v * G.perUnit
/** The height of the light that runs up a bar as it lands. */
export const GLINT = 46
const LAST = YEARS.length - 1
/** The guidance box: over the FY27P bar, from the top of what H1 has delivered up to 2,300. */
export const BOX = { x: G.xs[LAST] - G.barW / 2, y: topOf(GUIDANCE_RANGE[1]), w: G.barW, h: topOf(YEARS[LAST].pbt) - topOf(GUIDANCE_RANGE[1]) }
/** The guidance figure: its baseline's left end (the box's left edge) and its size. */
export const FIGURE = { x: BOX.x - 1.5, y: BOX.y - 13, size: 36 }
/** Its outline as two halves that rise from the bar's shoulders and meet in the middle of the top. */
export const BOX_HALF = BOX.h + BOX.w / 2

/** Where the pill of year i sits: over its bar; on FY27P inside the bar's head, because the box stands over it (as in the deck). */
export const pillAt = (i: number) => ({ x: G.xs[i], y: i === LAST ? topOf(YEARS[i].pbt) + 19 : topOf(YEARS[i].pbt) - 30 })
const pillW = (text: string) => 16 + text.length * 6.7

const bar = (x: number, v: number) => {
  const t = topOf(v)
  const l = x - G.barW / 2
  const r = x + G.barW / 2
  const k = 5
  return `M${l} ${G.base + 2} V${t + k} Q${l} ${t} ${l + k} ${t} H${r - k} Q${r} ${t} ${r} ${t + k} V${G.base + 2} Z`
}

/** A curved stroke from (sx, sy) to (ex, ey), bent toward (cx, cy), with an arrow head at its end. */
const arrow = (sx: number, sy: number, cx: number, cy: number, ex: number, ey: number) => {
  const ang = Math.atan2(ey - cy, ex - cx)
  const wing = (turn: number) => `${(ex - 6.5 * Math.cos(ang + turn)).toFixed(1)} ${(ey - 6.5 * Math.sin(ang + turn)).toFixed(1)}`
  return `M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)} M${wing(0.5)} L${ex.toFixed(1)} ${ey.toFixed(1)} L${wing(-0.5)}`
}

export function ProfitChart({ style }: { style?: CSSProperties }) {
  const p3 = pillAt(2)
  const p4 = pillAt(3)
  return (
    <svg className="kn-chart s07-chart" viewBox={`0 0 ${G.W} ${G.H}`} style={style} role="img">
      <defs>
        <linearGradient id="s07-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f47a5b" />
          <stop offset="1" stopColor="#e9502c" />
        </linearGradient>
        <linearGradient id="s07-haze" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f16443" stopOpacity="0.26" />
          <stop offset="1" stopColor="#f16443" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="s07-pill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef1f7" />
          <stop offset="1" stopColor="#d6dcea" />
        </linearGradient>
        <filter id="s07-lift" x="-30%" y="-40%" width="160%" height="220%">
          <feDropShadow dx="0" dy="1.6" stdDeviation="1.8" floodColor="#071a50" floodOpacity="0.22" />
        </filter>
        <clipPath id="s07-above">
          <rect x="0" y="0" width={G.W} height={G.base} />
        </clipPath>
        <linearGradient id="s07-glint" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {YEARS.map((y, i) => (
          <clipPath key={y.label} id={`s07-shape-${i}`}>
            <path d={bar(G.xs[i], y.pbt)} />
          </clipPath>
        ))}
      </defs>

      {/* the legend, as the deck's: a grey pill, an orange bar */}
      <g className="s07-legend s07-legend--pat">
        <rect x={60} y={70} width={27} height={12} rx={6} fill="url(#s07-pill)" stroke="#aeb9cf" strokeWidth={0.8} />
        <text x={95} y={80.2} fontSize={11.5}>
          {LEGEND_PAT}
        </text>
      </g>
      <g className="s07-legend s07-legend--pbt">
        <rect x={60} y={93.5} width={27} height={8} rx={1.5} fill="url(#s07-bar)" />
        <text x={95} y={101.8} fontSize={11.5}>
          {LEGEND_PBT}
        </text>
      </g>

      {/* the bars rise out of the baseline, each with its figure riding on it */}
      <g clipPath="url(#s07-above)">
        {YEARS.map((y, i) => (
          <g key={y.label} className="s07-bar" data-i={i}>
            <path d={bar(G.xs[i], y.pbt)} fill="url(#s07-bar)" />
            {/* a light that runs up the bar once, as it lands */}
            <g clipPath={`url(#s07-shape-${i})`}>
              <rect className="s07-glint" x={G.xs[i] - G.barW / 2} y={G.base} width={G.barW} height={GLINT} fill="url(#s07-glint)" />
            </g>
            <text className="s07-val" data-to={y.pbt} x={G.xs[i]} y={topOf(y.pbt) + (i === LAST ? 58 : 23)} fontSize={14} textAnchor="middle">
              {y.pbtText}
            </text>
          </g>
        ))}
      </g>
      <line className="kn-chart-axis s07-axis" x1={G.axis[0]} y1={G.base} x2={G.axis[1]} y2={G.base} />
      {YEARS.map((y, i) => (
        <text key={y.label} className="s07-year" data-i={i} x={G.xs[i]} y={G.base + 20} fontSize={12.5} textAnchor="middle">
          {y.label}
        </text>
      ))}

      {/* what is guided stands apart from what is done */}
      <g className="s07-divider">
        <line x1={G.divider} y1={G.dividerTop} x2={G.divider} y2={G.base + 28} />
      </g>

      {/* the guidance: a dashed box up to 2,300, its top band the range 2,200 to 2,300 */}
      <rect className="s07-haze" x={BOX.x} y={BOX.y} width={BOX.w} height={BOX.h} fill="url(#s07-haze)" />
      <rect className="s07-range" x={BOX.x} y={BOX.y} width={BOX.w} height={topOf(GUIDANCE_RANGE[0]) - BOX.y} />
      <path className="s07-box" d={`M${BOX.x} ${BOX.y + BOX.h} V${BOX.y} H${BOX.x + BOX.w / 2}`} />
      <path className="s07-box" d={`M${BOX.x + BOX.w} ${BOX.y + BOX.h} V${BOX.y} H${BOX.x + BOX.w / 2}`} />
      {/* the figure the slide is about: large, in clear space over the box, set from the box's left edge */}
      <g transform={`translate(${FIGURE.x} ${FIGURE.y})`}>
        <text className="s07-guidance" fontSize={FIGURE.size}>
          {GUIDANCE}
        </text>
      </g>
      <text className="s07-tag s07-tag--guidance" x={BOX.x + BOX.w + 13} y={BOX.y + BOX.h / 2 + 4} fontSize={12.5}>
        {GUIDANCE_TAG}
      </text>
      <text className="s07-tag s07-tag--h1" x={BOX.x + BOX.w + 13} y={(topOf(YEARS[LAST].pbt) + G.base) / 2 + 4} fontSize={12.5}>
        {H1_TAG}
      </text>

      {/* from one year's profit to the next: the growth the card's title names */}
      <path className="s07-arc s07-arc--210" d={arrow(p3.x + pillW(YEARS[2].patText) / 2 + 4, p3.y - 2, p4.x - 44, p3.y - 4, p4.x - pillW(YEARS[3].patText) / 2 - 5, p4.y + 6)} />
      <path className="s07-arc s07-arc--50" d={arrow(p4.x + pillW(YEARS[3].patText) / 2 + 4, p4.y - 4, p4.x + 40, FIGURE.y - 9, FIGURE.x - 9, FIGURE.y - 12)} />

      {/* the two notes of the deck, each over the pill it explains */}
      {CALLOUTS.map((c, k) => {
        const p = pillAt(c.at)
        const w = k === 0 ? 108 : 98
        const h = c.lines.length * 11 + 9
        const y1 = p.y - 10.5 - 13
        return (
          <g key={k} className="s07-call" data-k={k}>
            <line className="s07-lead" x1={p.x} y1={y1} x2={p.x} y2={p.y - 12.5} />
            <rect x={p.x - w / 2} y={y1 - h} width={w} height={h} rx={3.5} />
            {c.lines.map((line, n) => (
              <text key={n} x={p.x} y={y1 - h + 13.2 + n * 11} fontSize={9} textAnchor="middle">
                {line}
              </text>
            ))}
          </g>
        )
      })}

      {/* Company PAT: a pill over each bar */}
      {YEARS.map((y, i) => {
        const p = pillAt(i)
        const w = pillW(y.patText)
        return (
          <g key={y.label} transform={`translate(${p.x} ${p.y})`}>
            <g className="s07-pill" data-i={i}>
              <rect x={-w / 2} y={-10.5} width={w} height={21} rx={10.5} fill="url(#s07-pill)" stroke="#b4bed3" strokeWidth={0.7} filter="url(#s07-lift)" />
              <text y={4.4} fontSize={12.5} textAnchor="middle">
                {y.patText}
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}
