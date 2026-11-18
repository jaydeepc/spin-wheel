/**
 * Slide 05's four icons, redrawn as vector in the deck's own style: a navy line with flame
 * accents, 64 x 64. Navy strokes carry .s05-ink (they draw themselves), flame parts .s05-acc
 * (they follow). The handshake's hands are the Lucide "handshake" icon (ISC licence).
 */

const ink = { className: 's05-ink', fill: 'none', stroke: 'currentColor', strokeWidth: 2.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const acc = { className: 's05-acc', fill: 'none', stroke: 'var(--kn-flame)', strokeWidth: 2.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export function Handshake() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <g transform="translate(6.2 13.5) scale(2.15)">
        <path {...ink} strokeWidth={1.07} d="m11 17 2 2a1 1 0 1 0 3-3" />
        <path
          {...ink}
          strokeWidth={1.07}
          d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"
        />
        <path {...ink} strokeWidth={1.07} d="m21 3 1 11h-2" />
        <path {...ink} strokeWidth={1.07} d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
        <path {...ink} strokeWidth={1.07} d="M3 4h8" />
      </g>
      <path {...acc} d="M32 5.5v5.5" />
      <path {...acc} d="m22.5 8 2.8 4.6" />
      <path {...acc} d="m41.5 8-2.8 4.6" />
    </svg>
  )
}

export function DocumentCheck() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path {...ink} d="M31 53H16a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4h25a4 4 0 0 1 4 4v20" />
      <path {...ink} d="M19.5 19.5h18" />
      <path {...ink} d="M19.5 27.5h18" />
      <path {...ink} d="M19.5 35.5h9.5" />
      <circle {...acc} cx="44" cy="46" r="9.2" />
      <path {...acc} d="m39.6 46.2 3.1 3.1 5.9-6.3" />
    </svg>
  )
}

const ROSETTE = (() => {
  const N = 12
  const R = 16.2
  const cx = 32
  const cy = 26
  const r = R * Math.sin(Math.PI / N) * 1.12
  const pt = (k: number) => {
    const a = (k / N) * Math.PI * 2 - Math.PI / 2
    return `${(cx + R * Math.cos(a)).toFixed(2)} ${(cy + R * Math.sin(a)).toFixed(2)}`
  }
  let d = `M${pt(0)}`
  for (let k = 1; k <= N; k++) d += `A${r.toFixed(2)} ${r.toFixed(2)} 0 0 1 ${pt(k)}`
  return `${d}Z`
})()

export function RatingBadge() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path {...acc} d="M22.5 41.5 18 58l7.4-3.4 3.8 6.4 3.3-11.5" />
      <path {...acc} d="M41.5 41.5 46 58l-7.4-3.4-3.8 6.4-3.3-11.5" />
      <path {...ink} d={ROSETTE} />
      <text className="s05-acc s05-aa" x="32" y="30.4" textAnchor="middle">
        AA+
      </text>
    </svg>
  )
}

function stack(x: number, coins: number): string {
  const rx = 6.4
  const ry = 2.7
  const step = 4.3
  const foot = 52
  const top = foot - coins * step
  let d = `M${x - rx} ${top}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0`
  d += `M${x - rx} ${top}V${foot}M${x + rx} ${top}V${foot}`
  for (let k = 1; k <= coins; k++) d += `M${x - rx} ${top + k * step}a${rx} ${ry} 0 0 0 ${rx * 2} 0`
  return d
}

export function CoinsGrowth() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path {...ink} strokeWidth={2.1} d={stack(15, 2)} />
      <path {...ink} strokeWidth={2.1} d={stack(31, 3)} />
      <path {...ink} strokeWidth={2.1} d={stack(47, 5)} />
      <path {...acc} d="M8.5 31.5C22 30 36.5 23 50.5 8.5" />
      <path {...acc} d="M41 8h10v10" />
    </svg>
  )
}

export function Calendar() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4.2" width="14" height="12.8" rx="2.2" />
      <path d="M3 8.6h14M7 2.6v3.2M13 2.6v3.2" />
    </svg>
  )
}
