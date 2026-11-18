/** /ir slide 06: the growth chart and the two benchmark tracks, drawn from data.ts. One SVG unit is 0.1u. */
import { GROWTH, PEERS, WAY } from './data'

const u = (n: number) => `calc(var(--u) * ${n / 10})`

export const G = { W: 428, H: 178, STEP: 42.8, BW: 27, BASE: 138, BAR: 84 }
export const gx = (i: number) => G.STEP / 2 + i * G.STEP
const MAX = Math.max(...GROWTH.aum)
export const barH = (v: number) => (v / MAX) * G.BAR
/** the line runs in its own band above the bars: 30% just over the tallest bar, 51% at the top */
export const gy = (g: number) => G.BASE - (96 + ((g - 30) / 21) * 28)

export function GrowthChart() {
  const last = GROWTH.aum.length - 1
  const pts = GROWTH.yoy.map((g, i) => `${gx(i)} ${gy(g).toFixed(2)}`)
  return (
    <svg className="kn-chart ir06-chart" viewBox={`0 0 ${G.W} ${G.H}`} style={{ width: u(G.W), height: u(G.H) }} aria-hidden="true">
      <defs>
        <clipPath id="ir06-reveal">
          <rect className="ir06-reveal-rect" x={0} y={0} width={G.W} height={G.BASE} />
        </clipPath>
      </defs>
      <g className="ir06-legend">
        <rect x={226} y={0.5} width={11} height={8} rx={1.5} className="ir06-legend-bar" />
        <text x={242} y={8.6} fontSize={10.5}>
          {GROWTH.legend.bars}
        </text>
        <path d="M344 4.5h18" className="ir06-legend-line" />
        <circle cx={353} cy={4.5} r={2.6} className="ir06-legend-dot" />
        <text x={367} y={8.6} fontSize={10.5}>
          {GROWTH.legend.line}
        </text>
      </g>
      <line className="kn-chart-axis ir06-axis" x1={2} x2={G.W - 2} y1={G.BASE} y2={G.BASE} />
      {GROWTH.aum.map((v, i) => (
        <rect className={`ir06-bar${i === last ? ' ir06-bar--now' : ''}`} key={i} x={gx(i) - G.BW / 2} y={G.BASE - barH(v)} width={G.BW} height={barH(v)} rx={2.5} />
      ))}
      {GROWTH.aum.map((v, i) => (
        <text className="ir06-val" key={i} x={gx(i)} y={G.BASE - barH(v) + 14.5} textAnchor="middle" fontSize={11.5}>
          {v}
        </text>
      ))}
      <g clipPath="url(#ir06-reveal)">
        <path className="kn-line ir06-line" d={`M${pts.join('L')}`} />
      </g>
      {GROWTH.yoy.map((g, i) => (
        <circle className="ir06-dot" key={i} cx={gx(i)} cy={gy(g)} r={3.6} />
      ))}
      {GROWTH.yoy.map((g, i) => (
        <text className="ir06-pct" key={i} x={gx(i)} y={gy(g) - 8} textAnchor="middle" fontSize={i === 0 || i === last ? 12.5 : 10.5}>
          {g}%
        </text>
      ))}
      {GROWTH.quarters.map((t, i) => (
        <text className="kn-line-label ir06-q" key={i} x={gx(i)} y={G.BASE + 13.5} textAnchor="middle" fontSize={10}>
          {t}
        </text>
      ))}
      {GROWTH.groups.map((g) => {
        const a = gx(g.from) - 15
        const b = gx(g.to) + 15
        return (
          <g className="ir06-group" key={g.text}>
            <path d={`M${a} ${G.BASE + 19}v4H${b}v-4`} />
            <text x={(a + b) / 2} y={G.BASE + 36} textAnchor="middle" fontSize={10.5}>
              {g.text}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ a benchmark track: the peers' average as a tick, ours as a flame run */

export const K = { W: 330, H: 64, Y: 32 }
export const kx = (k: number, v: number) => ((v - PEERS.rows[k].lo) / (PEERS.rows[k].hi - PEERS.rows[k].lo)) * K.W

export function Track({ k }: { k: number }) {
  const r = PEERS.rows[k]
  const a = kx(k, r.from)
  const b = r.to === null ? K.W - 14 : kx(k, r.to)
  const p = kx(k, r.peer)
  return (
    <svg className="kn-chart ir06-track" data-k={k} viewBox={`0 0 ${K.W} ${K.H}`} style={{ width: u(K.W), height: u(K.H) }} aria-hidden="true">
      <defs>
        <linearGradient id={`ir06-open-${k}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f16443" />
          <stop offset="1" stopColor="#f16443" stopOpacity={r.to === null ? 0.35 : 1} />
        </linearGradient>
      </defs>
      <rect className="ir06-rail" x={0} y={K.Y - 3} width={K.W} height={6} rx={3} />
      <g className="ir06-ours">
        <rect x={a} y={K.Y - 5} width={b - a} height={10} rx={r.to === null ? 0 : 5} fill={`url(#ir06-open-${k})`} />
        {r.to === null ? <path className="ir06-ours-head" d={`M${b - 1} ${K.Y - 10}L${b + 13} ${K.Y}L${b - 1} ${K.Y + 10}Z`} /> : null}
      </g>
      {/* the way there (the RoE track only): today, the next stop, and on to where ours begins */}
      {k === 1 ? (
        <g className="ir06-way">
          <path className="ir06-way-b" d={`M${kx(k, WAY.next)} ${K.Y}H${a}`} />
          <path className="ir06-way-a" d={`M${kx(k, WAY.now)} ${K.Y}H${kx(k, WAY.next)}`} />
          <circle className="ir06-way-now" cx={kx(k, WAY.now)} cy={K.Y} r={5} />
          <circle className="ir06-way-next" cx={kx(k, WAY.next)} cy={K.Y} r={6.4} />
          <text className="ir06-way-now-text" x={kx(k, WAY.now)} y={K.Y - 13} textAnchor="middle" fontSize={14}>
            {WAY.nowText}
          </text>
          <text className="ir06-way-next-text" x={kx(k, WAY.next)} y={K.Y - 13} textAnchor="middle" fontSize={16.5}>
            {WAY.nextText}
          </text>
          <text className="ir06-way-caption" x={kx(k, WAY.next)} y={K.Y + 28} textAnchor="middle" fontSize={10.8}>
            {WAY.caption}
          </text>
        </g>
      ) : null}
      <text className="ir06-ours-text" x={(a + b) / 2} y={K.Y - 13} textAnchor="middle" fontSize={16.5}>
        {r.ours}
      </text>
      <g className="ir06-peer">
        <path d={`M${p} ${K.Y - 11}V${K.Y + 11}`} />
        <circle cx={p} cy={K.Y} r={4.6} />
      </g>
      <text className="ir06-peer-text" x={p} y={K.Y + 29} textAnchor="middle" fontSize={15}>
        {r.peerText}
      </text>
    </svg>
  )
}
