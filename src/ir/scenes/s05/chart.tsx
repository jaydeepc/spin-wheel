/**
 * /ir slide 05: the three pictures of the stage, drawn from data.ts. One SVG unit is 0.1u.
 */
import { AI, NEW_LINES, PRODUCTIVITY, PRODUCTIVITY_TEXTS, RISK, RISK_TEXTS } from './data'

const u = (n: number) => `calc(var(--u) * ${n / 10})`

/* ------------------------------------------------------------------ productivity: three bars, the last one lifted */

export const B = { W: 250, H: 250, BASE: 218, HMAX: 160, CX: [45, 125, 205], BW: 50 }

/** A column with a rounded top. */
const column = (cx: number, top: number, bottom: number, w: number, r = 5) => {
  const x0 = cx - w / 2
  const x1 = cx + w / 2
  return `M${x0} ${bottom}V${top + r}Q${x0} ${top} ${x0 + r} ${top}H${x1 - r}Q${x1} ${top} ${x1} ${top + r}V${bottom}Z`
}

/** Heights of chart k, in SVG units: each bar, and the last bar's parts. */
export const barHeights = (k: number) => {
  const v = PRODUCTIVITY[k].values
  const max = Math.max(...v)
  const h = v.map((x) => (x / max) * B.HMAX)
  return { h, prev: h[1], up: h[2] - h[1] }
}

export function Bars({ k }: { k: number }) {
  const d = PRODUCTIVITY[k]
  const { h, prev, up } = barHeights(k)
  const [c0, c1, c2] = B.CX
  const x0 = c2 - B.BW / 2
  const yPrev = B.BASE - prev
  const yTop = B.BASE - h[2]
  const yMid = yPrev - up / 2
  return (
    <svg className="kn-chart ir05-bars" viewBox={`0 0 ${B.W} ${B.H}`} style={{ width: u(B.W), height: u(B.H) }} aria-hidden="true">
      <line className="kn-chart-axis ir05-axis" x1={4} x2={B.W - 4} y1={B.BASE} y2={B.BASE} />
      <path className="ir05-bar" data-i={0} d={column(c0, B.BASE - h[0], B.BASE, B.BW)} />
      <path className="ir05-bar" data-i={1} d={column(c1, B.BASE - h[1], B.BASE, B.BW)} />
      {/* the last year: as high as the year before, then the uplift, and half of the uplift is AI's */}
      <rect className="ir05-bar" data-i={2} x={x0} y={yPrev} width={B.BW} height={prev} />
      <g className="ir05-up">
        <path className="ir05-up-all" d={column(c2, yTop, yPrev, B.BW)} />
        <path className="ir05-up-ai" d={column(c2, yTop, yMid, B.BW)} />
      </g>
      {/* where last year stood: carried across from its bar */}
      <line className="ir05-prev" x1={c1 + B.BW / 2 + 3} x2={c2 + B.BW / 2} y1={yPrev} y2={yPrev} />
      <text className="ir05-ai" x={c2} y={(yTop + yMid) / 2 + 3.8} textAnchor="middle" fontSize={11}>
        {AI}
      </text>
      {d.values.map((_, i) => (
        <text className="kn-bar-val ir05-val" data-i={i} key={i} x={B.CX[i]} y={B.BASE - h[i] - 7} textAnchor="middle" fontSize={15.5}>
          {PRODUCTIVITY_TEXTS[k][i]}
        </text>
      ))}
      {d.labels.map((t, i) => (
        <text className="kn-bar-label ir05-lab" key={i} x={B.CX[i]} y={B.BASE + 18} textAnchor="middle" fontSize={11}>
          {t}
        </text>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ credit risk: nine quarters, one line that falls */

/** The plot stands on zero: LO is 0 and YB is the axis, so heights (and the filled area) are to scale. */
export const L = { W: 516, H: 244, X0: 34, STEP: 53.5, YB: 190, LO: 0, HI: 2.1, PLOT: 160, AXIS: 190, DROP: 494 }
export const lx = (i: number) => L.X0 + i * L.STEP
export const ly = (v: number) => L.YB - ((v - L.LO) / (L.HI - L.LO)) * L.PLOT

/** A smooth line through the points that never overshoots them (monotone cubic). */
const smooth = (pts: [number, number][]) => {
  const n = pts.length
  const dx: number[] = []
  const m: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0])
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i])
  }
  const t: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (2 * m[i - 1] * m[i]) / (m[i - 1] + m[i]))
  t.push(m[n - 2])
  let d = `M${pts[0][0]} ${pts[0][1].toFixed(2)}`
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3
    d += `C${(pts[i][0] + h).toFixed(2)} ${(pts[i][1] + t[i] * h).toFixed(2)} ${(pts[i + 1][0] - h).toFixed(2)} ${(pts[i + 1][1] - t[i + 1] * h).toFixed(2)} ${pts[i + 1][0]} ${pts[i + 1][1].toFixed(2)}`
  }
  return d
}

export function Fall() {
  const pts = RISK.values.map((v, i) => [lx(i), ly(v)] as [number, number])
  const line = smooth(pts)
  const last = pts.length - 1
  const y0 = pts[0][1]
  const y1 = pts[last][1]
  return (
    <svg className="kn-chart ir05-fall" viewBox={`0 0 ${L.W} ${L.H}`} style={{ width: u(L.W), height: u(L.H) }} aria-hidden="true">
      <defs>
        <linearGradient id="ir05-area-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f16443" stopOpacity="0.26" />
          <stop offset="1" stopColor="#f16443" stopOpacity="0" />
        </linearGradient>
        <clipPath id="ir05-reveal">
          <rect className="ir05-reveal-rect" x={0} y={0} width={L.W} height={L.AXIS} />
        </clipPath>
        <clipPath id="ir05-reveal-level">
          <rect className="ir05-level-rect" x={pts[0][0]} y={0} width={L.DROP + 8 - pts[0][0]} height={L.AXIS} />
        </clipPath>
      </defs>
      <line className="kn-chart-axis ir05-axis" x1={6} x2={L.W - 6} y1={L.AXIS} y2={L.AXIS} />
      <g clipPath="url(#ir05-reveal)">
        <path className="ir05-area" d={`${line}V${L.AXIS}H${pts[0][0]}Z`} fill="url(#ir05-area-g)" />
        <path className="kn-line ir05-line" d={line} />
      </g>
      {/* where it began, carried across; and how far it has come down */}
      <g clipPath="url(#ir05-reveal-level)">
        <line className="ir05-level" x1={pts[0][0]} x2={L.DROP + 8} y1={y0} y2={y0} />
      </g>
      <path className="ir05-drop" d={`M${L.DROP} ${y0 + 5}V${y1 - 4}`} />
      <path className="ir05-drop-head" d={`M${L.DROP - 6} ${y1 - 9}L${L.DROP} ${y1}L${L.DROP + 6} ${y1 - 9}Z`} />
      {pts.map(([x, y], i) => (
        <circle className="ir05-dot" data-i={i} key={i} cx={x} cy={y} r={i === 0 || i === last ? 5.6 : 4.2} />
      ))}
      {pts.map(([x, y], i) => {
        const end = i === 0 || i === last
        return (
          <text className={`ir05-pt${end ? ' ir05-pt--end' : ''}${i === last ? ' ir05-pt--last' : ''}`} data-i={i} key={i} x={x} y={y - (end ? 19 : 12)} textAnchor="middle" fontSize={end ? 19 : 12}>
            {RISK_TEXTS[i]}
          </text>
        )
      })}
      {RISK.quarters.map((t, i) => (
        <text className="kn-line-label ir05-q" key={i} x={lx(i)} y={L.AXIS + 17} textAnchor="middle" fontSize={11}>
          {t}
        </text>
      ))}
      {RISK.groups.map((g) => {
        const a = lx(g.from) - 16
        const b = lx(g.to) + 16
        return (
          <g className="ir05-group" key={g.text}>
            <path d={`M${a} ${L.AXIS + 24}v5H${b}v-5`} />
            <text x={(a + b) / 2} y={L.AXIS + 46} textAnchor="middle" fontSize={11.5}>
              {g.text}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ new lines of business: two branches off the stream, one outlet */

export const N = { W: 516, H: 226, TRUNK_Y: 200, OUT_X: 372, OUT_Y: 76 }
export const TRUNK = `M8 ${N.TRUNK_Y}H490`
const PILL = { x: 150, w: 168, h: 36 }
const YS = [42, 110]
const NODE_X = [54, 104]
/** off the stream, up to its own line */
export const BRANCHES = [
  `M${NODE_X[0]} ${N.TRUNK_Y}C${NODE_X[0] + 50} ${N.TRUNK_Y} ${NODE_X[0] + 30} ${YS[0]} ${NODE_X[0] + 84} ${YS[0]}H${PILL.x}`,
  `M${NODE_X[1]} ${N.TRUNK_Y}C${NODE_X[1] + 34} ${N.TRUNK_Y} ${NODE_X[1] + 14} ${YS[1]} ${NODE_X[1] + 42} ${YS[1]}H${PILL.x}`,
]
/** and on from each line into the one outlet */
export const MERGES = YS.map((y) => `M${PILL.x + PILL.w} ${y}C${PILL.x + PILL.w + 32} ${y} ${N.OUT_X - 30} ${N.OUT_Y} ${N.OUT_X} ${N.OUT_Y}`)
const OUT = { w: 136, h: 78 }

export function Branches({ figure, after }: { figure: string; after: string }) {
  return (
    <svg className="kn-chart ir05-tree" viewBox={`0 0 ${N.W} ${N.H}`} style={{ width: u(N.W), height: u(N.H) }} aria-hidden="true">
      <path className="ir05-trunk" d={TRUNK} />
      <path className="ir05-trunk-head" d={`M488 ${N.TRUNK_Y - 9}L504 ${N.TRUNK_Y}L488 ${N.TRUNK_Y + 9}Z`} />
      {BRANCHES.map((d, i) => (
        <path className="ir05-branch" data-i={i} key={i} d={d} />
      ))}
      {MERGES.map((d, i) => (
        <path className="ir05-merge" data-i={i} key={i} d={d} />
      ))}
      {NODE_X.map((x, i) => (
        <circle className="ir05-node" data-i={i} key={i} cx={x} cy={N.TRUNK_Y} r={6} />
      ))}
      {/* what runs along them while the presenter talks (an idle loop: CSS, stopped by &still=1) */}
      <g className="ir05-flow">
        {[0, 1, 2].map((i) => (
          <circle className="ir05-bead ir05-bead--trunk" key={`t${i}`} r={3.4} style={{ offsetPath: `path('${TRUNK}')`, animationDelay: `${-i * 1.2}s` }} />
        ))}
        {BRANCHES.map((d, b) =>
          [0, 1].map((i) => (
            <circle className="ir05-bead ir05-bead--b" key={`${b}${i}`} r={3.4} style={{ offsetPath: `path('${d}')`, animationDelay: `${-i * 1.4 - b * 0.7}s` }} />
          )),
        )}
      </g>
      {NEW_LINES.lines.map((t, i) => (
        <g className="ir05-pill" data-i={i} key={t}>
          <rect x={PILL.x} y={YS[i] - PILL.h / 2} width={PILL.w} height={PILL.h} rx={PILL.h / 2} />
          <text x={PILL.x + PILL.w / 2} y={YS[i] + 5.6} textAnchor="middle" fontSize={16.5}>
            {t}
          </text>
        </g>
      ))}
      {/* what the new lines disburse: the deck's own figure, counting as they arrive */}
      <g className="ir05-out">
        <rect x={N.OUT_X} y={N.OUT_Y - OUT.h / 2} width={OUT.w} height={OUT.h} rx={13} />
        <text className="ir05-out-fig" x={N.OUT_X + OUT.w / 2} y={N.OUT_Y + 2} textAnchor="middle" fontSize={24}>
          {figure}
        </text>
        <text className="ir05-out-after" x={N.OUT_X + OUT.w / 2} y={N.OUT_Y + 23} textAnchor="middle" fontSize={13}>
          {after}
        </text>
      </g>
    </svg>
  )
}
