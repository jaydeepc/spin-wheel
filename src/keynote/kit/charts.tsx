import type { ReactNode } from 'react'

/**
 * CHARTS THAT DRAW FROM DATA. Plain SVG, sized in --u, animated by anim.bars() / anim.line().
 * Give them the slide's own numbers (the source pack's data.json), never a picture of a chart.
 *
 *   BarChart        one bar per label                                  a.bars()
 *   MultiBarChart   stacked columns, or groups of bars side by side    a.bars()
 *   HBarChart       horizontal bars, one or several per row            a.bars()
 *   LineChart       one or more lines; value labels that keep off the line, thinned or two-level
 *                   x labels, y ticks, a band                          a.line()
 *
 * Inside the SVG one unit is 1/10 of a --u: a chart 40u wide has a viewBox 400 wide. Type sizes
 * below are in those units (12 = 1.2u). Every chart takes `children`: your own SVG drawn over
 * the plot (an annotation, an arrow, a guide line), in the same units.
 *
 * A chart the kit does not have (a doughnut, the many unlabelled curves of slide 6) is written
 * as SVG in the scene's own folder: give it `className="kn-chart"`, use the classes
 * `kn-chart-axis`, `kn-line`, `kn-bar`, `kn-bar-val`, `kn-bar-label` and it is styled like these
 * and drawn by the same moves.
 */

const TONE: Record<string, string> = {
  flame: 'var(--kn-flame)',
  azure: 'var(--kn-azure)',
  navy: 'var(--kn-navy)',
  sky: 'var(--kn-sky)',
  peach: '#f6b6a2',
  ice: '#bcd8f6',
  slate: '#5b6fa6',
  grey: '#b9c3d6',
}
const tone = (c?: string) => (c ? (TONE[c] ?? c) : TONE.flame)

const box = (width: number, height: number) => ({ width: `calc(var(--u) * ${width})`, height: `calc(var(--u) * ${height})` })

/* -------------------------------------------------------------------- bars */

export interface Bar {
  label: string
  value: number
  /** A tone name (flame, azure, navy, sky, peach, ice, slate, grey) or any CSS colour. */
  color?: string
  /** What to print over the bar. Default: the value. */
  text?: string
}

export interface BarChartProps {
  data: Bar[]
  /** Size in --u. */
  width: number
  height: number
  /** The value at the top of the plot. Default: the largest value. */
  max?: number
  /** The share of a slot that the bar fills. Default 0.56. */
  fill?: number
  /** Type size of values and labels, in 1/10 u. Default 12. */
  type?: number
  className?: string
  /** Extra SVG drawn over the plot (an annotation, a guide line). */
  children?: ReactNode
}

/**
 *   <BarChart className="s57-tokens" width={38} height={20}
 *     data={[{ label: 'FY25-Q3', value: 23 }, { label: 'FY25-Q4', value: 32 }, { label: 'FY27-Q2', value: 476, color: 'navy' }]} />
 *   …
 *   a.bars('.s57-tokens', 0.6)
 */
export function BarChart({ data, width, height, max, fill = 0.56, type = 12, className = '', children }: BarChartProps) {
  const W = width * 10
  const H = height * 10
  const top = type * 1.7
  const bottom = type * 1.9
  const plot = H - top - bottom
  const peak = max ?? Math.max(...data.map((d) => d.value), 1)
  const slot = W / data.length
  const bw = slot * fill
  return (
    <svg className={`kn-chart kn-barchart ${className}`} viewBox={`0 0 ${W} ${H}`} style={box(width, height)} role="img">
      <line className="kn-chart-axis" x1={0} y1={H - bottom} x2={W} y2={H - bottom} />
      {data.map((d, i) => {
        const h = Math.max(1, (d.value / peak) * plot)
        const x = slot * i + (slot - bw) / 2
        const y = H - bottom - h
        return (
          <g key={i} data-i={i}>
            <rect className="kn-bar" x={x} y={y} width={bw} height={h} rx={Math.min(4, bw / 6)} fill={tone(d.color)} />
            <text className="kn-bar-val" x={x + bw / 2} y={y - type * 0.5} fontSize={type} textAnchor="middle">
              {d.text ?? d.value}
            </text>
            <text className="kn-bar-label" x={x + bw / 2} y={H - bottom + type * 1.35} fontSize={type * 0.82} textAnchor="middle">
              {d.label}
            </text>
          </g>
        )
      })}
      {children}
    </svg>
  )
}

export interface BarPart {
  value: number
  color?: string
  /** stack: printed inside the segment (left out if the segment is too thin). group: printed over the bar. */
  text?: string
  /** stack: the colour of that text. Default white. */
  ink?: string
}

export interface BarColumn {
  label: string
  /** stack: from the baseline upward. group: left to right. */
  parts: BarPart[]
  /** stack: printed over the whole column ("1,11,440"). */
  total?: string
}

export interface MultiBarChartProps extends Omit<BarChartProps, 'data'> {
  data: BarColumn[]
  /** 'stack' (default): the parts of a column stand on each other. 'group': they stand side by side. */
  mode?: 'stack' | 'group'
}

/**
 * Stacked columns (slide 4's growth book) or groups of bars side by side (slide 7's two series).
 *
 *   <MultiBarChart className="s04-book" width={22} height={30} fill={0.5}
 *     data={[
 *       { label: 'Mar-22', total: '22,010', parts: [{ value: 66, color: 'navy', text: '66%' }, { value: 26, color: 'slate', text: '26%' }, { value: 8, color: 'grey' }] },
 *       { label: 'Sep-26', total: '1,11,440', parts: [ … ] },
 *     ]} />
 *   <MultiBarChart mode="group" … data={[{ label: 'FY25', parts: [{ value: 12, color: 'grey', text: '12' }, { value: 31, color: 'flame', text: '31' }] }, …]} />
 *   …
 *   a.bars('.s04-book', 0.6)          // a column grows as one; its figures follow
 *
 * In a stack every column is as tall as its parts' sum against `max` (default: the largest sum).
 * To draw two columns of DIFFERENT totals to scale, give the parts their real values, not shares.
 */
export function MultiBarChart({ data, mode = 'stack', width, height, max, fill = 0.56, type = 12, className = '', children }: MultiBarChartProps) {
  const W = width * 10
  const H = height * 10
  const top = type * 1.7
  const bottom = type * 1.9
  const plot = H - top - bottom
  const slot = W / data.length
  const bw = slot * fill
  const sum = (c: BarColumn) => c.parts.reduce((a, p) => a + p.value, 0)
  const peak = max ?? Math.max(...data.map((c) => (mode === 'stack' ? sum(c) : Math.max(...c.parts.map((p) => p.value)))), 1)
  return (
    <svg className={`kn-chart kn-barchart kn-barchart--${mode} ${className}`} viewBox={`0 0 ${W} ${H}`} style={box(width, height)} role="img">
      <line className="kn-chart-axis" x1={0} y1={H - bottom} x2={W} y2={H - bottom} />
      {data.map((c, i) => {
        const x0 = slot * i + (slot - bw) / 2
        const label = (
          <text className="kn-bar-label" x={x0 + bw / 2} y={H - bottom + type * 1.35} fontSize={type * 0.82} textAnchor="middle">
            {c.label}
          </text>
        )
        if (mode === 'group') {
          const gap = bw * 0.06
          const w = (bw - gap * (c.parts.length - 1)) / c.parts.length
          return (
            <g key={i} data-i={i}>
              {c.parts.map((p, k) => {
                const h = Math.max(1, (p.value / peak) * plot)
                const x = x0 + k * (w + gap)
                return (
                  <g key={k}>
                    <rect className="kn-bar" x={x} y={H - bottom - h} width={w} height={h} rx={Math.min(4, w / 6)} fill={tone(p.color ?? (k ? 'flame' : 'grey'))} />
                    <text className="kn-bar-val" x={x + w / 2} y={H - bottom - h - type * 0.5} fontSize={type} textAnchor="middle">
                      {p.text ?? p.value}
                    </text>
                  </g>
                )
              })}
              {label}
            </g>
          )
        }
        let y = H - bottom
        const total = sum(c)
        return (
          <g key={i} data-i={i}>
            {/* the whole column is ONE bar to the move: it grows from the baseline as one piece */}
            <g className="kn-bar">
              {c.parts.map((p, k) => {
                const h = (p.value / peak) * plot
                y -= h
                return <rect key={k} x={x0} y={y} width={bw} height={Math.max(0.5, h - 0.8)} fill={tone(p.color ?? 'navy')} />
              })}
            </g>
            {(() => {
              let yy = H - bottom
              return c.parts.map((p, k) => {
                const h = (p.value / peak) * plot
                yy -= h
                return p.text && h >= type * 0.95 ? (
                  <text key={k} className="kn-bar-seg" x={x0 + bw / 2} y={yy + h / 2 + type * 0.3} fontSize={type * 0.86} textAnchor="middle" fill={p.ink ?? '#fff'}>
                    {p.text}
                  </text>
                ) : null
              })
            })()}
            {c.total ? (
              <text className="kn-bar-val" x={x0 + bw / 2} y={H - bottom - (total / peak) * plot - type * 0.5} fontSize={type} textAnchor="middle">
                {c.total}
              </text>
            ) : null}
            {label}
          </g>
        )
      })}
      {children}
    </svg>
  )
}

export interface HBarChartProps {
  /** One row per label; `parts` are that row's bars, one under another (one bar, or a before / after pair). */
  data: { label: string; parts: BarPart[] }[]
  width: number
  height: number
  max?: number
  /** The width kept for the labels at the left, in --u. Default 9. */
  labelWidth?: number
  /** The share of a row that its bars fill. Default 0.62. */
  fill?: number
  type?: number
  className?: string
  children?: ReactNode
}

/**
 * Horizontal bars: they grow from the left, each with its figure at its end.
 *
 *   <HBarChart className="s49-time" width={40} height={18} labelWidth={10}
 *     data={[
 *       { label: 'Design', parts: [{ value: 10, color: 'grey', text: '10 days' }, { value: 4, color: 'flame', text: '4 days' }] },
 *       { label: 'Build', parts: [{ value: 30, color: 'grey', text: '30 days' }, { value: 12, color: 'flame', text: '12 days' }] },
 *     ]} />
 *   …
 *   a.bars('.s49-time', 0.6)
 */
export function HBarChart({ data, width, height, max, labelWidth = 9, fill = 0.62, type = 12, className = '', children }: HBarChartProps) {
  const W = width * 10
  const H = height * 10
  const left = labelWidth * 10
  const right = type * 5.5
  const plot = W - left - right
  const peak = max ?? Math.max(...data.flatMap((r) => r.parts.map((p) => p.value)), 1)
  const row = H / data.length
  return (
    <svg className={`kn-chart kn-hbarchart ${className}`} viewBox={`0 0 ${W} ${H}`} style={box(width, height)} role="img">
      <line className="kn-chart-axis" x1={left} y1={0} x2={left} y2={H} />
      {data.map((r, i) => {
        const y0 = row * i + (row * (1 - fill)) / 2
        const gap = row * 0.05
        const bh = (row * fill - gap * (r.parts.length - 1)) / r.parts.length
        return (
          <g key={i} data-i={i}>
            <text className="kn-bar-label" x={left - type * 0.8} y={row * i + row / 2 + type * 0.3} fontSize={type * 0.9} textAnchor="end">
              {r.label}
            </text>
            {r.parts.map((p, k) => {
              const w = Math.max(1, (p.value / peak) * plot)
              const y = y0 + k * (bh + gap)
              return (
                <g key={k}>
                  <rect className="kn-bar" x={left} y={y} width={w} height={bh} rx={Math.min(4, bh / 5)} fill={tone(p.color ?? (k ? 'flame' : 'grey'))} />
                  <text className="kn-bar-val" x={left + w + type * 0.6} y={y + bh / 2 + type * 0.33} fontSize={Math.min(type, bh * 0.95)} textAnchor="start">
                    {p.text ?? p.value}
                  </text>
                </g>
              )
            })}
          </g>
        )
      })}
      {children}
    </svg>
  )
}

/* -------------------------------------------------------------------- lines */

export interface Series {
  name?: string
  color?: string
  values: number[]
  /** What to print at each point (null: nothing). Default: nothing. */
  texts?: (string | null)[]
  /**
   * Where a point's text goes. 'auto' (default) keeps it off the line: over a peak, under a
   * valley (and under the end of a fall), to the upper right of a point in the middle of a fall,
   * to the upper left of one in the middle of a climb.
   */
  place?: 'auto' | 'above' | 'below'
}

export interface LineChartProps {
  series: Series[]
  /** One label per point, along the foot. */
  labels?: string[]
  /** Print only every n-th label (15 quarters on one axis: 2 or 3). Default 1: all of them. */
  labelEvery?: number
  /** A second level under the labels: brackets that span points `from` … `to` (indexes), each with its text ("FY26"). */
  groups?: { from: number; to: number; text: string }[]
  /** Values to rule across the plot, each printed at the left. */
  ticks?: number[]
  /** How a tick is printed. Default: the number as it is. */
  tickText?: (v: number) => string
  /** Bands across the plot between two VALUES (a target range): soft, or hatched as the deck draws a goal. */
  bands?: { from: number; to: number; color?: string; hatch?: boolean; label?: string; labelAt?: 'left' | 'right' }[]
  width: number
  height: number
  min?: number
  max?: number
  /** Fill softly under the first series. */
  area?: boolean
  /** Dots on the points. Default true. */
  dots?: boolean
  type?: number
  className?: string
  children?: ReactNode
}

/**
 *   <LineChart className="s57-cost" width={38} height={20} labels={['FY25-Q3', 'FY25-Q4', …]}
 *     series={[{ color: 'azure', values: [1.19, 1.16, 1.48, 0.84], texts: ['$1.19', '$1.16', '$1.48', '$0.84'] }]} />
 *
 *   // many points (slide 6: 15 quarters): thin the labels, rule the values, print only the ends
 *   <LineChart className="s06-opex" width={30} height={20} min={3} max={7}
 *     labels={quarters} labelEvery={2} ticks={[3, 4, 5, 6, 7]} tickText={(v) => `${v}%`}
 *     bands={[{ from: 3, to: 3.25, hatch: true, label: 'Long range goal' }]}
 *     series={[{ color: 'flame', values: opex, texts: opex.map((v, i) => (i === 0 || i === opex.length - 1 ? `${v}%` : null)) }]} />
 *   …
 *   a.line('.s57-cost', 0.6)
 */
export function LineChart({
  series,
  labels = [],
  labelEvery = 1,
  groups = [],
  ticks = [],
  tickText = (v) => String(v),
  bands = [],
  width,
  height,
  min,
  max,
  area = false,
  dots = true,
  type = 12,
  className = '',
  children,
}: LineChartProps) {
  const W = width * 10
  const H = height * 10
  const top = type * 2
  const bottom = (labels.length ? type * 1.9 : type * 0.6) + (groups.length ? type * 1.9 : 0)
  const left = ticks.length ? type * (0.9 + 0.55 * Math.max(...ticks.map((t) => tickText(t).length))) + type * 1.1 : type * 1.6
  const right = type * 1.6
  const all = series.flatMap((s) => s.values)
  const lo = min ?? Math.min(...all, ...ticks)
  const hi = max ?? Math.max(...all, ...ticks)
  const count = Math.max(...series.map((s) => s.values.length), labels.length, 2)
  /** Where the text of point i of a series goes (see Series.place). */
  const spot = (s: Series, i: number): 'above' | 'below' | 'right' | 'left' => {
    if (s.place && s.place !== 'auto') return s.place
    const v = s.values
    const prev = i > 0 ? v[i - 1] : v[i]
    const next = i < v.length - 1 ? v[i + 1] : v[i]
    if (prev > v[i] && next >= v[i]) return 'below'
    if (prev > v[i] && next < v[i]) return 'right'
    if (prev < v[i] && next > v[i] && i > 0) return 'left'
    return 'above'
  }
  // with rules across the plot the first point stands clear of their figures
  const inset = ticks.length ? type * 1.3 : 0
  // a text under the lowest point needs room above the axis (unless the chart was given its own floor)
  const under = min === undefined && series.some((s) => s.texts?.some((t, i) => t && spot(s, i) === 'below'))
  const floor = under ? type * 1.9 : 0
  const px = (i: number) => left + inset + ((W - left - inset - right) * i) / (count - 1)
  const py = (v: number) => top + (H - top - bottom - floor) * (1 - (v - lo) / (hi - lo || 1))
  const foot = H - bottom
  const uid = `kn-hatch-${className.replace(/[^a-z0-9]/gi, '') || 'x'}`
  return (
    <svg className={`kn-chart kn-linechart ${className}`} viewBox={`0 0 ${W} ${H}`} style={box(width, height)} role="img">
      {bands.some((b) => b.hatch) ? (
        <defs>
          <pattern id={uid} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1.6" />
          </pattern>
        </defs>
      ) : null}
      {bands.map((b, i) => {
        const y0 = py(Math.max(b.from, b.to))
        const y1 = py(Math.min(b.from, b.to))
        const c = tone(b.color ?? 'azure')
        return (
          <g key={i} className="kn-chart-band" style={{ color: c }}>
            <rect x={left} y={y0} width={W - left - right} height={Math.max(2, y1 - y0)} fill={b.hatch ? `url(#${uid})` : c} fillOpacity={b.hatch ? 0.55 : 0.14} />
            {b.label ? (
              <text
                x={b.labelAt === 'right' ? W - right : left + type * 0.4}
                y={y0 - type * 0.45}
                fontSize={type * 0.82}
                textAnchor={b.labelAt === 'right' ? 'end' : 'start'}
                fill={c}
              >
                {b.label}
              </text>
            ) : null}
          </g>
        )
      })}
      {ticks.map((t, i) => (
        <g key={i}>
          <line className="kn-chart-tick" x1={left} y1={py(t)} x2={W - right} y2={py(t)} />
          <text className="kn-chart-ticktext" x={left - type * 0.7} y={py(t) + type * 0.3} fontSize={type * 0.82} textAnchor="end">
            {tickText(t)}
          </text>
        </g>
      ))}
      <line className="kn-chart-axis" x1={ticks.length ? left : 0} y1={foot} x2={W} y2={foot} />
      {labels.map((l, i) =>
        i % labelEvery === 0 ? (
          <text key={i} className="kn-line-label" x={px(i)} y={foot + type * 1.35} fontSize={type * 0.82} textAnchor="middle">
            {l}
          </text>
        ) : null,
      )}
      {groups.map((g, i) => {
        const y = foot + (labels.length ? type * 2.1 : type * 0.7)
        const x0 = px(g.from) - type * 0.5
        const x1 = px(g.to) + type * 0.5
        return (
          <g key={i} className="kn-line-group">
            <path d={`M${x0} ${y - 3} V${y} H${x1} V${y - 3}`} />
            <text x={(x0 + x1) / 2} y={y + type * 1.2} fontSize={type * 0.86} textAnchor="middle">
              {g.text}
            </text>
          </g>
        )
      })}
      {series.map((s, si) => {
        const pts = s.values.map((v, i) => [px(i), py(v)] as const)
        const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
        const c = tone(s.color ?? (si ? 'azure' : 'flame'))
        // a text keeps off its own line
        const at = (i: number) => {
          const [x, y] = pts[i]
          const where = spot(s, i)
          if (where === 'below') return { x, y: y + type * 1.55, textAnchor: 'middle' as const }
          if (where === 'right') return { x: x + type * 0.75, y: y - type * 0.25, textAnchor: 'start' as const }
          if (where === 'left') return { x: x - type * 0.75, y: y - type * 0.25, textAnchor: 'end' as const }
          return { x, y: y - type * 0.8, textAnchor: 'middle' as const }
        }
        return (
          <g key={si}>
            {area && si === 0 && <path className="kn-line-area" d={`${d} L${pts[pts.length - 1][0].toFixed(1)} ${foot} L${pts[0][0].toFixed(1)} ${foot} Z`} fill={c} />}
            <path className="kn-line" data-series={si} d={d} stroke={c} />
            {dots &&
              pts.map(([x, y], i) => <circle key={i} className="kn-line-dot" data-series={si} data-i={i} cx={x} cy={y} r={type * 0.32} fill="#fff" stroke={c} />)}
            {s.texts?.map((t, i) =>
              t && pts[i] ? (
                <text
                  key={i}
                  className="kn-line-val"
                  data-series={si}
                  data-i={i}
                  {...at(i)}
                  fontSize={type * 0.9}
                  fill={c}
                >
                  {t}
                </text>
              ) : null,
            )}
          </g>
        )
      })}
      {children}
    </svg>
  )
}
