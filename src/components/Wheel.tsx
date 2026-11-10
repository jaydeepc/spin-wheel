'use client'

import { forwardRef, memo, useMemo } from 'react'

export interface WheelSegment {
  id: string
  label: string
}

export type Accent = 'flame' | 'azure' | 'navy'

const ACCENTS: Accent[] = ['flame', 'azure', 'navy']

/** Three accents in rotation, with the last segment adjusted so no two neighbours match. */
export function accentFor(i: number, n: number): Accent {
  if (n > 1 && i === n - 1 && n % 3 === 1) return 'azure'
  return ACCENTS[i % 3]
}

// Geometry, in SVG user units. The wheel is drawn in a 1040 box centred on 0,0.
const R_RIM = 500
const R_BAND_OUT = 484
const R_BAND_IN = 434
const R_HUB = 118
const R_TEXT_OUT = 418
const R_TEXT_MIN = 150

const pt = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180
  return `${(r * Math.sin(a)).toFixed(2)} ${(-r * Math.cos(a)).toFixed(2)}`
}

function ring(r0: number, r1: number, a0: number, a1: number) {
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${pt(r0, a0)} L${pt(r1, a0)} A${r1} ${r1} 0 ${large} 1 ${pt(r1, a1)} L${pt(r0, a1)} A${r0} ${r0} 0 ${large} 0 ${pt(r0, a0)}Z`
}

/** Break a label into at most two balanced lines. */
function splitLabel(label: string, allowTwo: boolean): string[] {
  const text = label.trim()
  const words = text.split(/\s+/)
  if (!allowTwo || words.length < 2 || text.length <= 10) return [text]
  let best = [text]
  let bestLen = text.length
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    const len = Math.max(a.length, b.length)
    if (len < bestLen) {
      bestLen = len
      best = [a, b]
    }
  }
  return best
}

/** Largest type size at which the label fits inside its wedge. */
function fitLabel(label: string, n: number) {
  const seg = 360 / n
  const half = Math.tan(((seg / 2) * Math.PI) / 180)
  const CHAR = 0.6 // average glyph width of bold Open Sans, in em
  let best = { lines: [label], size: 12 }
  for (const lines of [splitLabel(label, true), splitLabel(label, false)]) {
    const longest = Math.max(...lines.map((l) => l.length))
    for (let size = 46; size >= 12; size -= 1) {
      const length = longest * CHAR * size
      const rInner = R_TEXT_OUT - length
      if (rInner < R_TEXT_MIN) continue
      const room = n === 1 ? 999 : 2 * rInner * half
      if (lines.length * size * 1.16 <= room * 0.9) {
        if (size > best.size) best = { lines, size }
        break
      }
    }
  }
  return best
}

interface Props {
  segments: WheelSegment[]
  /** Index of the segment the wheel stopped on, lit in its accent colour. */
  winner?: number | null
}

/**
 * The wheel face. It never rotates itself: the parent turns the element this
 * ref points at, so the whole face stays one GPU layer while it spins.
 */
const Wheel = forwardRef<HTMLDivElement, Props>(function Wheel({ segments, winner = null }, ref) {
  const n = segments.length
  const seg = 360 / Math.max(n, 1)

  const face = useMemo(() => {
    const fits = segments.map((s) => fitLabel(s.label, n))
    // Keep the labels close in size: a short name must not shout over its neighbours.
    const cap = Math.min(...fits.map((f) => f.size), 46) * 1.2
    return segments.map((s, i) => {
      const a0 = i * seg
      const a1 = a0 + seg
      return {
        id: s.id,
        accent: accentFor(i, n),
        mid: a0 + seg / 2,
        a0,
        body: n === 1 ? null : ring(R_HUB, R_BAND_IN, a0, a1),
        band: n === 1 ? null : ring(R_BAND_IN, R_BAND_OUT, a0, a1),
        lines: fits[i].lines,
        size: Math.min(fits[i].size, cap),
      }
    })
  }, [segments, seg, n])

  const pegs =
    n > 1 &&
    face.map((f) => {
      const [x, y] = pt((R_BAND_OUT + R_RIM) / 2, f.a0).split(' ')
      return <circle key={f.id} cx={x} cy={y} r={5.5} className="wheel__peg" />
    })

  return (
    <div className="wheel" data-has-winner={winner != null || undefined}>
      <div className="wheel__spin" ref={ref}>
        <svg viewBox="-520 -520 1040 1040" aria-hidden="true" focusable="false">
          <circle r={R_RIM} className="wheel__plate" />
          {face.map((f, i) => (
            <g key={f.id} className="wheel__seg" data-accent={f.accent} data-winner={winner === i || undefined}>
              {f.body ? <path d={f.body} className="wheel__body" /> : <circle r={R_BAND_IN} className="wheel__body" />}
              {f.band ? (
                <path d={f.band} className="wheel__band" />
              ) : (
                <circle r={(R_BAND_IN + R_BAND_OUT) / 2} className="wheel__band wheel__band--full" />
              )}
              <g transform={`rotate(${f.mid})`}>
                <text className="wheel__num" y={-(R_BAND_IN + R_BAND_OUT) / 2} dy="0.36em" textAnchor="middle">
                  {String(i + 1).padStart(2, '0')}
                </text>
                <g transform={`translate(0 ${-R_TEXT_OUT}) rotate(-90)`}>
                  <text className="wheel__label" textAnchor="end" fontSize={f.size}>
                    {f.lines.map((line, li) => (
                      <tspan key={li} x={0} dy={li === 0 ? `${0.36 - (f.lines.length - 1) * 0.58}em` : '1.16em'}>
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            </g>
          ))}
          <circle r={(R_BAND_OUT + R_RIM) / 2} className="wheel__rim" />
          {pegs}
          <circle r={R_HUB} className="wheel__hub-ring" />
        </svg>
      </div>
      <div className="wheel__hub">
        <span className="wheel__mark" />
      </div>
    </div>
  )
})

export default memo(Wheel)
