/**
 * Slide 06 · the three charts, drawn from the pack's data as SVG (the kit has no chart for many
 * unlabelled curves, a stepped band or a light at the head of a line). Inside each SVG one unit
 * is 1/10 of a --u, as in the kit's charts, and the kit's classes give them the kit's look.
 *
 * Nothing here moves: the scene's build() draws the lines as far as a year or a quarter, with
 * the tracks exported from this file.
 */
import {
  DPD_QUARTERS,
  DPD_TEXTS,
  DPD_VALUES,
  OPEX_BANDS,
  OPEX_GOAL,
  OPEX_GUIDANCE,
  OPEX_QUARTERS,
  OPEX_TEXTS,
  OPEX_TICKS,
  OPEX_VALUES,
  RACE_CURVES,
  RACE_FRAME,
  RACE_LABELS,
  RACE_MARKER_AT,
  RACE_X_LABEL,
  RACE_X_TICKS,
  RACE_Y_LABEL,
  RACE_Y_TICKS,
  RACE_Y_ZERO,
  opexTick,
} from './data'
import { sampleCubics, sampleSmooth, trackFrom, type Track } from './track'

const box = (w: number, h: number) => ({ width: `calc(var(--u) * ${w / 10})`, height: `calc(var(--u) * ${h / 10})` })

/* ====================================================================== 1 · the AUM race */

export const RACE = { W: 420, H: 282, x0: 48, perYear: 29, y0: 236, perUnit: 1.84, years: 12 }
/** A year on the chart. */
export const raceX = (year: number) => RACE.x0 + RACE.perYear * year
/** An AUM (₹ k Cr) on the chart. */
export const raceY = (aum: number) => RACE.y0 - RACE.perUnit * aum

export interface Runner {
  who: 'us' | 'peer'
  marker?: number
  track: Track
  /** The year in which the curve reaches ₹100k Cr, or the year its data ends if it never does. */
  endYear: number
  finishes: boolean
}

/** The deck's curves on this chart, each cut where it reaches 100 (the deck's plot stops there too). */
export const RUNNERS: Runner[] = RACE_CURVES.map((c) => {
  const F = RACE_FRAME
  const pts = sampleCubics(c.pts, (x, y) => [(x - F.x0) / F.perYear, ((y - F.y0) / (F.y100 - F.y0)) * 100] as const)
  const kept: [number, number][] = []
  let finishes = false
  for (let i = 0; i < pts.length; i++) {
    const [yr, aum] = pts[i]
    if (aum >= 100 && i > 0) {
      const [pyr, paum] = pts[i - 1]
      const k = (100 - paum) / (aum - paum || 1)
      kept.push([pyr + (yr - pyr) * k, 100])
      finishes = true
      break
    }
    kept.push([Math.max(0, yr), aum])
  }
  const endYear = kept[kept.length - 1][0]
  return { who: c.who, marker: c.marker, track: trackFrom(kept.map(([yr, aum]) => [raceX(yr), raceY(aum)] as const)), endYear, finishes }
})
export const US = RUNNERS.find((r) => r.who === 'us') as Runner
/** The runner behind each numbered marker (1 is ours). */
export const FINISHERS = [1, 2, 3, 4].map((m) => RUNNERS.find((r) => r.marker === m) as Runner)

export function RaceChart() {
  const R = RACE
  return (
    <svg className="kn-chart s06-race" viewBox={`0 0 ${R.W} ${R.H}`} style={box(R.W, R.H)} role="img">
      <defs>
        <radialGradient id="s06-halo">
          <stop offset="0" stopColor="#f16443" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#f16443" stopOpacity="0.2" />
          <stop offset="1" stopColor="#f16443" stopOpacity="0" />
        </radialGradient>
        <filter id="s06-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" />
        </filter>
      </defs>

      {/* the ground: a hairline at every ten, the finish at 100 */}
      {RACE_Y_TICKS.slice(0, -1).map((v) => (
        <line key={v} className="s06-gridline" x1={R.x0 - 10} y1={raceY(v)} x2={raceX(R.years) + 12} y2={raceY(v)} />
      ))}
      <g className="s06-hundred">
        <line x1={R.x0 - 10} y1={raceY(100)} x2={raceX(R.years) + 12} y2={raceY(100)} />
      </g>
      <line className="kn-chart-axis s06-axis" x1={R.x0 - 14} y1={R.y0} x2={raceX(R.years) + 14} y2={R.y0} />

      <text className="s06-ytick" x={R.x0 - 18} y={R.y0 + 3.2} fontSize={9.5} textAnchor="end">
        {RACE_Y_ZERO}
      </text>
      {RACE_Y_TICKS.map((v) => (
        <text key={v} className="s06-ytick" data-v={v} x={R.x0 - 18} y={raceY(v) + 3.2} fontSize={9.5} textAnchor="end">
          {v}
        </text>
      ))}
      {RACE_X_TICKS.map((t, k) => (
        <g key={t} className="s06-xtick">
          <text data-k={k} x={raceX(k)} y={R.y0 + 16} fontSize={9.5} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      <text className="s06-axis-name s06-axis-name--y" x={4} y={raceY(100) - 14} fontSize={9.5}>
        {RACE_Y_LABEL}
      </text>
      <text className="s06-axis-name s06-axis-name--x" x={raceX(R.years / 2)} y={R.y0 + 33} fontSize={9.5} textAnchor="middle">
        {RACE_X_LABEL}
      </text>

      {/* where each of the four reached 100: a line down to its year */}
      {FINISHERS.map((r, k) => (
        <line key={k} className="s06-fin" data-m={k + 1} x1={raceX(r.endYear)} y1={raceY(100)} x2={raceX(r.endYear)} y2={R.y0} />
      ))}
      {/* the year the race has reached */}
      <line className="s06-cursor" x1={0} y1={raceY(100) - 6} x2={0} y2={R.y0} />

      <g className="s06-curves">
        {RUNNERS.map((r, i) =>
          r.who === 'peer' ? <path key={i} className={`s06-curve s06-curve--peer${r.marker ? ' s06-curve--named' : ''}`} data-i={i} d={r.track.d} /> : null,
        )}
        <path className="s06-glow" d={US.track.d} filter="url(#s06-soft)" />
        <path className="s06-curve s06-curve--us" data-i={RUNNERS.indexOf(US)} d={US.track.d} />
      </g>

      <g className="s06-heads">
        {RUNNERS.map((r, i) =>
          r.who === 'peer' ? <circle key={i} className={`s06-head${r.marker ? ' s06-head--named' : ''}`} data-i={i} r={r.marker ? 2.6 : 2.1} /> : null,
        )}
        <circle className="s06-ring" cx={raceX(US.endYear)} cy={raceY(100)} r={6} />
        <g className="s06-comet" data-i={RUNNERS.indexOf(US)}>
          <circle className="s06-comet-halo" r={17} fill="url(#s06-halo)" />
          <circle className="s06-comet-core" r={3.7} />
        </g>
      </g>

      {/* the deck's numbered markers on the finish lines, each with its words */}
      {FINISHERS.map((r, k) => {
        const m = k + 1
        const x = raceX(r.endYear)
        const y = raceY(RACE_MARKER_AT[m])
        return (
          <g key={m} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
            <g className={`s06-mk${m === 1 ? ' s06-mk--us' : ''}`} data-m={m}>
              <circle r={6.4} />
              <text y={3.1} fontSize={9} textAnchor="middle">
                {m}
              </text>
            </g>
            {/* the words stand on a plate of the card's colour: the finish lines of the others pass behind them, as in the deck */}
            <g className={`s06-mk-label${m === 1 ? ' s06-mk-label--us' : ''}`} data-m={m}>
              <rect x={8.5} y={-6.5} width={RACE_LABELS[m].length * (m === 1 ? 4.95 : 4.7) + 6} height={13} rx={3} />
              <text x={11} y={3.2} fontSize={9.5}>
                {RACE_LABELS[m]}
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}

/* ====================================================================== 2 · opex to AUM */

const OPEX = { W: 452, H: 142, x0: 36, slot: 24.2, top: 8, foot: 108, lo: 3, hi: 6.75 }
export const opexX = (q: number) => OPEX.x0 + OPEX.slot * (q + 0.5)
const opexY = (v: number) => OPEX.foot - ((v - OPEX.lo) / (OPEX.hi - OPEX.lo)) * (OPEX.foot - OPEX.top)
export const OPEX_TRACK = trackFrom(OPEX_VALUES.map((v, i) => [opexX(i), opexY(v)] as const))
export const OPEX_LAST = OPEX_VALUES.length - 1

/** Quarters grouped by their financial year: [{ text: 'FY24', from: 1, to: 4 }, …] */
const years = (quarters: string[]) => {
  const out: { text: string; from: number; to: number }[] = []
  quarters.forEach((q, i) => {
    const fy = q.split(' ')[1]
    const last = out[out.length - 1]
    if (last && last.text === fy) last.to = i
    else out.push({ text: fy, from: i, to: i })
  })
  return out
}

function Comet({ className }: { className: string }) {
  return (
    <g className={`s06-comet ${className}`}>
      <circle className="s06-comet-halo" r={13} fill="url(#s06-halo)" />
      <circle className="s06-comet-core" r={3.1} />
    </g>
  )
}

export function OpexChart() {
  const O = OPEX
  const end = O.x0 + O.slot * OPEX_QUARTERS.length
  // every second tick of the deck's sixteen: 3.00%, 3.50% … 6.50%
  const ticks = OPEX_TICKS.filter((_, i) => i % 2 === 0)
  const [goal, lower] = OPEX_BANDS
  const bandX = (q: number) => O.x0 + O.slot * (q + 0.5)
  return (
    <svg className="kn-chart s06-opex" viewBox={`0 0 ${O.W} ${O.H}`} style={box(O.W, O.H)} role="img">
      <defs>
        <pattern id="s06-hatch" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="3.2" stroke="#5b6885" strokeWidth="0.9" />
        </pattern>
      </defs>

      {ticks.map((v) => (
        <g key={v} className="s06-tick">
          <line className="kn-chart-tick" x1={O.x0} y1={opexY(v)} x2={end} y2={opexY(v)} />
          <text className="kn-chart-ticktext" x={O.x0 - 5} y={opexY(v) + 3.1} fontSize={9.1} textAnchor="end">
            {opexTick(v)}
          </text>
        </g>
      ))}

      {/* the long range goal, and the same band 25 bps lower from where the guidance was cut */}
      <rect className="s06-band s06-band--goal" x={bandX(goal.q0)} y={opexY(goal.to)} width={bandX(goal.q1) - bandX(goal.q0)} height={opexY(goal.from) - opexY(goal.to)} fill="url(#s06-hatch)" />
      <rect className="s06-band s06-band--lower" x={bandX(lower.q0)} y={opexY(lower.to)} width={bandX(lower.q1) - bandX(lower.q0)} height={opexY(lower.from) - opexY(lower.to)} fill="url(#s06-hatch)" />
      <text className="s06-note s06-note--goal" x={(bandX(goal.q0) + bandX(goal.q1)) / 2} y={(opexY(goal.to) + opexY(goal.from)) / 2 + 3} fontSize={8.8} textAnchor="middle">
        {OPEX_GOAL}
      </text>
      <text className="s06-note s06-note--cut" x={bandX(goal.q1) - 19} y={opexY(3.25) + 3.2} fontSize={9.1} textAnchor="end">
        {OPEX_GUIDANCE}
      </text>
      <path className="s06-arrow" d={`M${bandX(goal.q1) - 16} ${opexY(3.25)} H${bandX(goal.q1) - 3} m-4.6 -3.4 l4.6 3.4 l-4.6 3.4`} />

      <line className="kn-chart-axis s06-axis" x1={O.x0} y1={O.foot} x2={end} y2={O.foot} />
      <line className="kn-chart-axis s06-axis s06-axis--y" x1={O.x0} y1={O.foot} x2={O.x0} y2={O.top - 2} />
      <Quarters quarters={OPEX_QUARTERS} x={(i) => opexX(i)} edge={(i) => O.x0 + O.slot * i} foot={O.foot} />

      <path className="kn-line s06-line" d={OPEX_TRACK.d} />
      {OPEX_VALUES.map((v, i) => (
        <circle key={i} className="s06-dot" data-i={i} cx={opexX(i)} cy={opexY(v)} r={2.5} />
      ))}
      {OPEX_TEXTS.map((t, i) => {
        const edge = i === 0 || i === OPEX_LAST
        const y = opexY(OPEX_VALUES[i])
        return (
          <text
            key={i}
            className={`s06-val${edge ? ' s06-val--edge' : ''}${i === OPEX_LAST ? ' s06-val--now' : ''}`}
            data-i={i}
            x={opexX(i) + (i === 0 ? 6 : i === OPEX_LAST ? 3 : -1)}
            y={i === 0 ? y + 2 : y - 6}
            fontSize={edge ? 11 : 8.8}
          >
            {t}
          </text>
        )
      })}
      <Comet className="s06-comet--line" />
    </svg>
  )
}

/** The two levels under a quarterly axis: Q1 … Q4, and the financial year under each run of them, between dividers. */
function Quarters({ quarters, x, edge, foot }: { quarters: string[]; x: (i: number) => number; edge: (i: number) => number; foot: number }) {
  const fy = years(quarters)
  const cuts = [0, ...fy.map((g) => g.to + 1)]
  return (
    <g className="s06-quarters">
      {cuts.map((i) => (
        <line key={i} className="s06-cut" x1={edge(i)} y1={foot} x2={edge(i)} y2={foot + 31} />
      ))}
      {quarters.map((q, i) => (
        <text key={i} className="s06-q" x={x(i)} y={foot + 11.3} fontSize={9.1} textAnchor="middle">
          {q.split(' ')[0]}
        </text>
      ))}
      {fy.map((g) => (
        <text key={g.text} className="s06-fy" x={(edge(g.from) + edge(g.to + 1)) / 2} y={foot + 26} fontSize={9.1} textAnchor="middle">
          {g.text}
        </text>
      ))}
    </g>
  )
}

/* ====================================================================== 3 · retail 90+ DPD */

const DPD = { W: 452, H: 96, x0: 14, slot: 434 / DPD_QUARTERS.length, foot: 62, perPct: 33 }
export const dpdX = (q: number) => DPD.x0 + DPD.slot * (q + 0.5)
const dpdY = (v: number) => DPD.foot - v * DPD.perPct
export const DPD_TRACK = trackFrom(sampleSmooth(DPD_VALUES.map((v, i) => [dpdX(i), dpdY(v)] as const)))
export const DPD_LAST = DPD_VALUES.length - 1

export function DpdChart() {
  const D = DPD
  const v = DPD_VALUES
  return (
    <svg className="kn-chart s06-dpd" viewBox={`0 0 ${D.W} ${D.H}`} style={box(D.W, D.H)} role="img">
      <line className="kn-chart-axis s06-axis" x1={D.x0} y1={D.foot} x2={D.x0 + D.slot * v.length} y2={D.foot} />
      <Quarters quarters={DPD_QUARTERS} x={(i) => dpdX(i)} edge={(i) => D.x0 + D.slot * i} foot={D.foot} />
      <path className="kn-line s06-line" d={DPD_TRACK.d} />
      {v.map((val, i) => (
        <circle key={i} className="s06-dot" data-i={i} cx={dpdX(i)} cy={dpdY(val)} r={2.5} />
      ))}
      {DPD_TEXTS.map((t, i) => {
        // a figure keeps off its own line: under a valley, to the right after a fall, to the left before a climb
        const prev = i > 0 ? v[i - 1] : v[i]
        const next = i < v.length - 1 ? v[i + 1] : v[i]
        const valley = prev - v[i] > 0.15 && next > v[i]
        const fell = prev - v[i] > 0.15
        const climbs = next - v[i] > 0.15
        const y = dpdY(v[i])
        const at = valley
          ? { x: dpdX(i), y: y + 12.5, textAnchor: 'middle' as const }
          : fell
            ? { x: dpdX(i) - 2, y: y - 6, textAnchor: 'start' as const }
            : climbs
              ? { x: dpdX(i) + 3, y: y - 6, textAnchor: 'end' as const }
              : { x: dpdX(i), y: y - 6.5, textAnchor: 'middle' as const }
        return (
          <text key={i} className="s06-val" data-i={i} {...at} fontSize={8.8}>
            {t}
          </text>
        )
      })}
      <Comet className="s06-comet--line" />
    </svg>
  )
}
