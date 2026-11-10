'use client'

import { forwardRef, memo, useEffect, useId, useMemo, useRef } from 'react'
import './wheel.css'

export interface WheelSegment {
  id: string
  label: string
  /** Short tag shown beside the number on the track, e.g. BYOT or BYOA. */
  tag?: string
}

export type Accent = 'flame' | 'azure' | 'navy'

/** Colour says which platform a solution was built on: BYOT is flame, BYOA is azure. */
export function accentForPlatform(platform?: string | null): Accent {
  return platform === 'BYOA' ? 'azure' : 'flame'
}

/* ---------- Geometry, in SVG user units. The wheel is radius 500 in a 1040 box centred on 0,0. ---------- */
const VIEW = '-520 -520 1040 1040'
const R_FACE = 484 // edge of the turning face, under the static bezel
const R_TRACK_IN = 438 // the number track runs from here to the face edge
const R_NUM = 461
const R_ARC = 426 // thin accent arcs
const R_TEXT_OUT = 404 // labels live on a clear ring between these two radii
const R_TEXT_MIN = 206
const R_INNER = 196 // fine ring at the foot of the labels
const R_BODY_IN = 116 // wedges start here; the lens barrel fills the middle
const SIZE_MAX = 30
const SIZE_MIN = 14
const LINE = 1.14
const FILL = 0.72 // share of the wedge's width a label may take, so it keeps air on both sides

const xy = (r: number, deg: number): [string, string] => {
  const a = (deg * Math.PI) / 180
  return [(r * Math.sin(a)).toFixed(2), (-r * Math.cos(a)).toFixed(2)]
}
const pt = (r: number, deg: number) => xy(r, deg).join(' ')

/** Annular sector from a0 to a1, clockwise from 12 o'clock. A full turn becomes a ring. */
function ring(r0: number, r1: number, a0: number, a1: number) {
  if (a1 - a0 >= 359.99) {
    return (
      `M0 ${-r1}A${r1} ${r1} 0 1 1 0 ${r1}A${r1} ${r1} 0 1 1 0 ${-r1}Z` +
      `M0 ${-r0}A${r0} ${r0} 0 1 0 0 ${r0}A${r0} ${r0} 0 1 0 0 ${-r0}Z`
    )
  }
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${pt(r0, a0)}L${pt(r1, a0)}A${r1} ${r1} 0 ${large} 1 ${pt(r1, a1)}L${pt(r0, a1)}A${r0} ${r0} 0 ${large} 0 ${pt(r0, a0)}Z`
}
function arc(r: number, a0: number, a1: number) {
  if (a1 - a0 >= 359.99) return `M0 ${-r}A${r} ${r} 0 1 1 0 ${r}A${r} ${r} 0 1 1 0 ${-r}`
  const large = a1 - a0 > 180 ? 1 : 0
  return `M${pt(r, a0)}A${r} ${r} 0 ${large} 1 ${pt(r, a1)}`
}
const radial = (r0: number, r1: number, deg: number) => `M${pt(r0, deg)}L${pt(r1, deg)}`

/* ---------- Label fitting ---------- */

/** Estimated advance of the semibold face, in em. A measured pass corrects it after render. */
function emWidth(s: string) {
  let w = 0
  for (const c of s) {
    if (c === ' ') w += 0.26
    else if ("iljI.,:;'|!".includes(c)) w += 0.3
    else if ('ftr-()'.includes(c)) w += 0.4
    else if ('mwMW'.includes(c)) w += 0.9
    else if ((c >= 'A' && c <= 'Z') || c === '&') w += 0.68
    else w += 0.58
  }
  return w * 1.03
}

/** Break a label into at most two balanced lines. */
function splitLabel(label: string): string[] {
  const text = label.trim()
  const words = text.split(/\s+/)
  if (words.length < 2 || text.length <= 9) return [text]
  let best = [text]
  let bestW = emWidth(text)
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    const w = Math.max(emWidth(a), emWidth(b))
    if (w < bestW) {
      bestW = w
      best = [a, b]
    }
  }
  return best
}

/** Largest size at which the label (one or two lines, set along the radius) sits inside its wedge with air to spare. */
function fitLabel(label: string, n: number) {
  const tan = n <= 2 ? Infinity : Math.tan(Math.PI / n)
  const options = [[label.trim()], splitLabel(label)]
  let best = { lines: options[0], size: 0 }
  for (const lines of options) {
    const widest = Math.max(...lines.map(emWidth))
    for (let size = SIZE_MAX; size >= SIZE_MIN; size -= 0.5) {
      const rInner = R_TEXT_OUT - widest * size
      if (rInner < R_TEXT_MIN) continue
      if (lines.length * size * LINE <= 2 * rInner * tan * FILL) {
        if (size > best.size) best = { lines, size }
        break
      }
    }
  }
  if (!best.size) {
    // Nothing fits cleanly (a very long name on a crowded wheel): two lines, as large as the length allows.
    const lines = splitLabel(label)
    const widest = Math.max(...lines.map(emWidth), 1)
    best = { lines, size: Math.max(9, Math.min(SIZE_MIN, (R_TEXT_OUT - R_TEXT_MIN) / widest)) }
  }
  return best
}

/* ---------- Static ornament: identical for every wheel, so it is built once ---------- */

const BEZEL_TICKS = (() => {
  let minor = ''
  let major = ''
  for (let d = 0; d < 360; d += 3) {
    if (d % 30 === 0) major += radial(487, 497, d)
    else minor += radial(489.5, 494.5, d)
  }
  return { minor, major }
})()

const BARREL_TICKS = (() => {
  let d = ''
  for (let t = 0; t < 72; t++) d += radial(105, 112, t * 5)
  return d
})()

const MARK_DOTS = Array.from({ length: 24 }, (_, k) => xy(173, k * 15))

interface Props {
  segments: WheelSegment[]
  /** Index of the segment the wheel stopped on, lit in its accent colour. */
  winner?: number | null
}

/**
 * The wheel, built in layers. Only `.wheel__spin` turns: the parent rotates the
 * element this ref points at, and nothing inside it changes while it spins, so
 * the face stays one GPU texture. Everything else (ground shadow, orbit lines,
 * bezel, floating ring, hub) is static and drawn once. `.wheel__smear` is the
 * face as it looks at speed, a rotationally symmetric wash whose opacity the
 * parent raises with velocity; it sits still, so cross-fading to it is free.
 */
const Wheel = forwardRef<HTMLDivElement, Props>(function Wheel({ segments, winner = null }, ref) {
  const n = segments.length
  const seg = 360 / Math.max(n, 1)
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const g = (name: string) => `${uid}-${name}`
  const url = (name: string) => `url(#${uid}-${name})`
  const win = winner != null && winner >= 0 && winner < n ? winner : null
  const faceRef = useRef<SVGSVGElement>(null)

  const face = useMemo(() => {
    const fits = segments.map((s) => fitLabel(s.label, n))
    // Keep the labels close in size: a short name must not shout over its neighbours.
    const cap = Math.min(...fits.map((f) => f.size), SIZE_MAX) * 1.18
    const pad = n === 1 ? 0 : Math.min(1.7, seg * 0.12)
    // Neighbours on the same platform share a colour, so they alternate between two close
    // tints of it: the wheel reads as two kinds of thing, and still as separate segments.
    const accents = segments.map((s) => accentForPlatform(s.tag))
    const shades: boolean[] = []
    accents.forEach((a, i) => shades.push(i > 0 && accents[i - 1] === a ? !shades[i - 1] : false))
    return segments.map((s, i) => {
      const a0 = i * seg
      const a1 = a0 + seg
      const size = Math.min(fits[i].size, cap)
      return {
        id: s.id,
        accent: accents[i],
        tint: `t-${accents[i]}${shades[i] ? '-b' : ''}`,
        mid: a0 + seg / 2,
        body: ring(R_BODY_IN, R_TRACK_IN, a0, a1),
        lit: ring(R_BODY_IN, R_FACE, a0, a1),
        arc: arc(R_ARC, a0 + pad, a1 - pad),
        lines: fits[i].lines,
        size,
        est: Math.max(...fits[i].lines.map(emWidth)) * size,
      }
    })
  }, [segments, seg, n])

  // Linework shared by all wedges, drawn once on top of them.
  const lines = useMemo(() => {
    let seps = ''
    let track = ''
    let under = ''
    let major = ''
    let minor = ''
    const pins: [string, string][] = []
    if (n > 1) {
      for (let b = 0; b < n; b++) {
        const a = b * seg
        seps += radial(R_INNER, R_ARC - 10, a)
        track += radial(R_TRACK_IN, R_FACE, a)
        under += radial(132, 180, a)
        major += radial(101, 113, a)
        pins.push(xy(R_NUM, a))
      }
    }
    // Four quiet graduations per segment on the number track.
    const sub = 5
    for (let m = 0; m < Math.max(n, 1) * sub; m++) {
      if (n > 1 && m % sub === 0) continue
      minor += radial(477, R_FACE, (m * seg) / sub)
    }
    return { seps, track, under, major, minor, pins }
  }, [seg, n])

  // Measured guard: where the real glyphs run longer than the estimate, shrink that label to match.
  useEffect(() => {
    const fit = () => {
      faceRef.current?.querySelectorAll<SVGTextElement>('.wheel__label').forEach((node) => {
        const size = Number(node.dataset.size)
        const est = Number(node.dataset.est)
        node.setAttribute('font-size', String(size))
        let longest = 0
        node.querySelectorAll('tspan').forEach((span) => {
          try {
            longest = Math.max(longest, span.getComputedTextLength())
          } catch {
            /* not rendered yet */
          }
        })
        if (longest > est && est > 0) node.setAttribute('font-size', Math.max(8, (size * est) / longest).toFixed(2))
      })
    }
    fit()
    let live = true
    document.fonts?.ready.then(() => live && fit()).catch(() => {})
    return () => {
      live = false
    }
  }, [face])

  const mkFlame = xy(156, 344)
  const mkAzure = xy(156, 128)

  return (
    <div
      className="wheel"
      data-has-winner={win != null || undefined}
      data-win-accent={win != null ? accentForPlatform(segments[win].tag) : undefined}
    >
      {/* static, below the face */}
      <div className="wheel__plate" />
      <svg className="wheel__layer wheel__orbits" viewBox={VIEW} aria-hidden="true" focusable="false">
        <circle className="wheel__o-line" r={532} />
        <circle className="wheel__o-dash" r={556} />
        <path className="wheel__o-flame" d={arc(532, 208, 252)} />
        <path className="wheel__o-azure" d={arc(532, 36, 64)} />
        {(
          [
            [532, 252, 6.5, 'flame'],
            [532, 36, 5.5, 'azure'],
            [556, 118, 4, 'navy'],
            [556, 304, 4, 'navy'],
          ] as const
        ).map(([r, deg, size, tone]) => {
          const [cx, cy] = xy(r, deg)
          return (
            <g key={`${r}-${deg}`}>
              <circle cx={cx} cy={cy} r={size + 3} fill="#ffffff" />
              <circle cx={cx} cy={cy} r={size} className={`wheel__o-dot wheel__o-dot--${tone}`} />
            </g>
          )
        })}
      </svg>

      {/* the one rotating element */}
      <div className="wheel__spin" ref={ref}>
        <svg className="wheel__face" ref={faceRef} viewBox={VIEW} aria-hidden="true" focusable="false">
          <defs>
            {/* Radial gradients centred on the axle look the same at every angle. */}
            {(
              [
                ['t-flame', '#fff6f2', '#ffe2d6'],
                ['t-flame-b', '#fffbf9', '#fff0e9'],
                ['t-azure', '#f3f8ff', '#d9e8fc'],
                ['t-azure-b', '#f9fcff', '#eaf2fe'],
                ['w-flame', '#b83815', '#cf4019'],
                ['w-azure', '#2459b8', '#2d6ad1'],
              ] as const
            ).map(([name, from, to]) => (
              <radialGradient key={name} id={g(name)} gradientUnits="userSpaceOnUse" cx={0} cy={0} r={R_FACE}>
                <stop offset={0.24} stopColor={from} />
                <stop offset={0.92} stopColor={to} />
              </radialGradient>
            ))}
            <radialGradient id={g('barrel')} gradientUnits="userSpaceOnUse" cx={0} cy={0} r={R_FACE}>
              <stop offset={0.19} stopColor="#000e4f" />
              <stop offset={0.24} stopColor="#1b2f6b" />
            </radialGradient>
          </defs>
          <circle r={R_FACE} fill="#ffffff" />
          {face.map((f, i) => (
            <g key={f.id} className="wheel__seg" data-accent={f.accent} data-winner={win === i || undefined}>
              <path className="wheel__body" d={f.body} fill={url(f.tint)} />
              <path className="wheel__lit" d={f.lit} fill={url(`w-${f.accent}`)} />
              <path className="wheel__arc" d={f.arc} />
              <g transform={`rotate(${f.mid.toFixed(3)})`}>
                <circle className="wheel__bead" cy={-R_INNER} r={3.4} />
                <text className="wheel__num" y={-R_NUM} dy="0.36em" textAnchor="middle">
                  {String(i + 1).padStart(2, '0')}
                  {segments[i]?.tag && (
                    <tspan className="wheel__tag" dx="0.5em">
                      {segments[i].tag}
                    </tspan>
                  )}
                </text>
                <g transform={`translate(0 ${-R_TEXT_OUT}) rotate(-90)`}>
                  <text
                    className="wheel__label"
                    textAnchor="end"
                    fontSize={f.size}
                    data-size={f.size}
                    data-est={f.est.toFixed(1)}
                  >
                    {f.lines.map((line, li) => (
                      <tspan
                        key={li}
                        x={0}
                        dy={li === 0 ? `${(0.35 - ((f.lines.length - 1) * LINE) / 2).toFixed(3)}em` : `${LINE}em`}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            </g>
          ))}
          <path className="wheel__hair" d={lines.seps} />
          <path className="wheel__under" d={lines.under} />
          <circle className="wheel__hair" r={R_INNER} />
          <circle className="wheel__hair wheel__hair--strong" r={R_TRACK_IN} />
          <path className="wheel__hair wheel__hair--strong" d={lines.track} />
          <path className="wheel__minor" d={lines.minor} />
          {lines.pins.map(([cx, cy], i) => (
            <circle key={i} className="wheel__pin" cx={cx} cy={cy} r={5} />
          ))}
          {/* the lens barrel: a dark focus ring whose engraving turns under the static hub */}
          <circle r={R_BODY_IN} fill={url('barrel')} />
          <circle className="wheel__barrel-edge" r={R_BODY_IN - 0.8} />
          <path className="wheel__barrel-tick" d={BARREL_TICKS} />
          <path className="wheel__barrel-major" d={lines.major} />
        </svg>
      </div>

      {/* static: the face as it reads at speed. The parent sets its opacity from the wheel's velocity. */}
      <svg className="wheel__layer wheel__smear" viewBox={VIEW} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={g('smear')} gradientUnits="userSpaceOnUse" cx={0} cy={0} r={R_FACE}>
            <stop offset={0.24} stopColor="#fbfcfe" />
            <stop offset={R_TEXT_MIN / R_FACE} stopColor="#f7f9fc" />
            <stop offset={0.56} stopColor="#edf1f7" />
            <stop offset={0.8} stopColor="#e8edf5" />
            <stop offset={R_TEXT_OUT / R_FACE} stopColor="#f1f4f9" />
            <stop offset={R_TRACK_IN / R_FACE} stopColor="#f6f8fc" />
          </radialGradient>
        </defs>
        <path d={ring(R_BODY_IN, R_TRACK_IN, 0, 360)} fill={url('smear')} />
        <circle className="wheel__smear-arc" r={R_ARC} />
        <circle className="wheel__hair" r={R_INNER} />
        <circle className="wheel__hair wheel__hair--strong" r={R_TRACK_IN} />
      </svg>

      {/* static, above the face: dish shading, bezel, the floating inner ring */}
      <svg className="wheel__layer wheel__over" viewBox={VIEW} aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={g('dish')} gradientUnits="userSpaceOnUse" cx={0} cy={0} r={R_FACE}>
            <stop offset={0.8} stopColor="#071a50" stopOpacity={0} />
            <stop offset={0.94} stopColor="#071a50" stopOpacity={0.025} />
            <stop offset={1} stopColor="#071a50" stopOpacity={0.085} />
          </radialGradient>
          <linearGradient id={g('bezel')} gradientUnits="userSpaceOnUse" x1={-360} y1={-360} x2={360} y2={360}>
            <stop offset={0} stopColor="#27469a" />
            <stop offset={0.28} stopColor="#071a50" />
            <stop offset={0.62} stopColor="#000e4f" />
            <stop offset={1} stopColor="#1b2f6b" />
          </linearGradient>
          <linearGradient id={g('float')} gradientUnits="userSpaceOnUse" x1={-150} y1={-170} x2={150} y2={170}>
            <stop offset={0} stopColor="#ffffff" stopOpacity={0.95} />
            <stop offset={0.55} stopColor="#ffffff" stopOpacity={0.7} />
            <stop offset={1} stopColor="#f3f8fe" stopOpacity={0.84} />
          </linearGradient>
          <radialGradient id={g('cast')} gradientUnits="userSpaceOnUse" cx={0} cy={10} r={222}>
            <stop offset={0.8} stopColor="#071a50" stopOpacity={0.13} />
            <stop offset={1} stopColor="#071a50" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle r={R_FACE} fill={url('dish')} />
        <path fill={url('bezel')} d={ring(R_FACE, 500, 0, 360)} />
        <circle className="wheel__bezel-out" r={499.2} />
        <circle className="wheel__bezel-in" r={484.8} />
        <path className="wheel__bezel-tick" d={BEZEL_TICKS.minor} />
        <path className="wheel__bezel-major" d={BEZEL_TICKS.major} />
        <path className="wheel__bezel-glint" d={arc(492, 296, 338)} />
        <path className="wheel__bezel-glint wheel__bezel-glint--sky" d={arc(492, 124, 152)} />

        <path fill={url('cast')} d={ring(186, 222, 0, 360)} />
        <path fill={url('float')} d={ring(124, 188, 0, 360)} />
        <circle className="wheel__float-line" r={189.4} />
        <circle className="wheel__float-light" r={187} />
        <circle className="wheel__float-light" r={125} />
        <circle className="wheel__float-line" r={122.8} />
        <circle className="wheel__float-line" r={156} />
        <path className="wheel__mark-arc wheel__mark-arc--flame" d={arc(156, 296, 344)} />
        <path className="wheel__mark-arc wheel__mark-arc--azure" d={arc(156, 128, 160)} />
        <g className="wheel__mark-dots">
          {MARK_DOTS.map(([cx, cy], k) => (
            <circle key={k} cx={cx} cy={cy} r={1.7} />
          ))}
        </g>
        <circle cx={mkFlame[0]} cy={mkFlame[1]} r={5} className="wheel__o-dot--flame" />
        <circle cx={mkAzure[0]} cy={mkAzure[1]} r={4.2} className="wheel__o-dot--azure" />
      </svg>

      <div className="wheel__hub">
        <span className="wheel__mark" />
      </div>
    </div>
  )
})

export default memo(Wheel)
