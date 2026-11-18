/**
 * THE CIRCUIT of /ir slides 07 and 08: thin flame lines with rounded corners down the left and
 * right edges of the stage, a few dots on them. Drawn ONCE, in stage units (the SVG's viewBox is
 * the stage: 100 x 56.25), and shared by both slides: the scene spans 7 and 8, so the same lines
 * stand in the same places through the change of slide.
 *
 * A trace is a list of waypoints joined by straight runs; where the direction turns the corner is
 * a quarter circle. Every trace begins OFF the stage (it grows in from an edge) and the ones that
 * leave again end off it, 40u out, so that on a screen that is not 16:9 they still run to the
 * window's edge. A waypoint marked `true` carries a dot; each dot knows how far along its trace
 * it sits (`f`, 0 to 1), which is what times its lighting as a pulse passes.
 */

import type { CSSProperties } from 'react'

type Way = [x: number, y: number, dot?: boolean]

export interface Dot {
  x: number
  y: number
  /** how far along the trace, 0 … 1 */
  f: number
}
export interface Trace {
  d: string
  length: number
  dots: Dot[]
  /** the fraction of the trace at which it enters the stage (what lies before is off it) */
  f0: number
  /** the fraction at which it leaves the stage again (1 when it ends on the stage) */
  f1: number
  /** the timeline pulse's length and the idle pulse's, in hundredths of this trace */
  pl: number
  il: number
}

const R = 0.95
/**
 * How far the lines run beyond the stage: far enough for a 4:3 screen (9.4u above and below) and
 * an ultrawide one (2560 x 1080: 16.7u each side).
 */
const OUT = 40
/** A pulse's length on the stage, in u: the one the timeline sends, and the slower idle one. */
const PULSE_U = 5.6
const IDLE_U = 4
/** Where a pulse is parked when it has run: beyond the trace's end (hundredths of the trace). */
export const PARK = -103
const n2 = (v: number) => Number(v.toFixed(3))

function trace(ways: Way[]): Trace {
  let d = `M${ways[0][0]} ${ways[0][1]}`
  let cx = ways[0][0]
  let cy = ways[0][1]
  let len = 0
  const marks: { x: number; y: number; at: number }[] = []
  for (let i = 1; i < ways.length; i++) {
    const [px, py, dot] = ways[i]
    const [qx, qy] = ways[i - 1]
    const inL = Math.hypot(px - qx, py - qy)
    const ix = (px - qx) / inL
    const iy = (py - qy) / inL
    const next = ways[i + 1]
    let ox = ix
    let oy = iy
    if (next) {
      const outL = Math.hypot(next[0] - px, next[1] - py)
      ox = (next[0] - px) / outL
      oy = (next[1] - py) / outL
    }
    const cross = ix * oy - iy * ox
    if (next && Math.abs(cross) > 0.5) {
      // a corner: stop R short, turn through a quarter circle, carry on R beyond
      const ax = px - ix * R
      const ay = py - iy * R
      const bx = px + ox * R
      const by = py + oy * R
      len += Math.hypot(ax - cx, ay - cy) + (Math.PI * R) / 2
      d += ` L${n2(ax)} ${n2(ay)} A${R} ${R} 0 0 ${cross > 0 ? 1 : 0} ${n2(bx)} ${n2(by)}`
      cx = bx
      cy = by
    } else {
      len += Math.hypot(px - cx, py - cy)
      d += ` L${px} ${py}`
      cx = px
      cy = py
      if (dot) marks.push({ x: px, y: py, at: len })
    }
  }
  const last = ways[ways.length - 1]
  const leaves = last[0] < 0 || last[0] > 100 || last[1] < 0 || last[1] > 56.25
  return {
    d,
    length: len,
    dots: marks.map((m) => ({ x: m.x, y: m.y, f: m.at / len })),
    // every trace begins with a straight run of OUT off the stage, and one that leaves ends with one
    f0: OUT / len,
    f1: leaves ? (len - OUT) / len : 1,
    pl: (100 * PULSE_U) / len,
    il: (100 * IDLE_U) / len,
  }
}

const TOP = -OUT
const BOT = 56.25 + OUT
const RIGHT = 100 + OUT

/**
 * LEFT: four traces from the top and the bottom edge. RIGHT: three from the right edge, between
 * the logo (top right) and Back / Next (bottom right), which they keep clear of.
 */
export const TRACES: Trace[] = [
  // left · the spine, top to bottom
  trace([[2.5, TOP], [2.5, 17.5], [5.3, 17.5], [5.3, 27.4, true], [5.3, 37], [2.5, 37], [2.5, BOT]]),
  // left · from the top, ends in a dot
  trace([[5.9, TOP], [5.9, 8.4], [9, 8.4], [9, 20.6, true]]),
  // left · from the bottom, ends in a dot
  trace([[8.2, BOT], [8.2, 45.4], [11.3, 45.4], [11.3, 33.6, true]]),
  // left · from the bottom, a short one
  trace([[5.3, BOT], [5.3, 48.2, true], [5.3, 42.4, true]]),
  // right · in under the logo, down, ends in a dot
  trace([[RIGHT, 9.4], [96.6, 9.4], [96.6, 20.4], [93.6, 20.4], [93.6, 32.2, true]]),
  // right · in, a long run down, ends in a dot above Back / Next
  trace([[RIGHT, 14.6], [98.6, 14.6], [98.6, 26.4, true], [98.6, 37.4], [95.8, 37.4], [95.8, 47.6, true]]),
  // right · a short one
  trace([[RIGHT, 42.2], [98.5, 42.2], [98.5, 48.6, true]]),
]

/** The idle pulse crosses its trace in RUN of its cycle, then the line rests (scene.css, ir07-run). */
const RUN = 0.4
/** One idle cycle of trace i, in seconds, and where in the cycle it starts. */
export const idleCycle = (i: number) => 13 + ((i * 5) % 7) * 1.3
export const idleDelay = (i: number) => -(((i * 3.7) % 9) + 0.4)

/**
 * A pulse is a dash on a path of pathLength 100; its stroke-dashoffset says where it is.
 * `enter`: its head is at the edge of the stage. `over(f)`: its middle is over the point at f.
 * `gone`: its tail has left the stage (or reached the trace's end).
 */
export const offsets = (t: Trace, len: number) => ({
  enter: len - 100 * t.f0,
  over: (f: number) => len / 2 - 100 * f,
  gone: -100 * t.f1,
})

/** When, inside one idle cycle of duration D, the idle pulse's middle is over a dot at f. */
const idleAt = (t: Trace, f: number, D: number) => {
  const o = offsets(t, t.il)
  return (RUN * D * (o.enter - o.over(f))) / (o.enter - PARK)
}

export function Circuit() {
  return (
    <svg className="ir07-circuit" viewBox="0 0 100 56.25" aria-hidden="true">
      <defs>
        <radialGradient id="ir07-halo">
          <stop offset="0" stopColor="#ffb9a0" stopOpacity="0.95" />
          <stop offset="0.28" stopColor="#f16443" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f16443" stopOpacity="0" />
        </radialGradient>
      </defs>
      {TRACES.map((t, i) => {
        const D = idleCycle(i)
        const delay = idleDelay(i)
        const run = {
          animationDuration: `${D}s`,
          animationDelay: `${delay}s`,
          strokeDasharray: `${t.il.toFixed(3)} 400`,
          '--ir07-a': (t.il - 100 * t.f0).toFixed(3),
        } as CSSProperties
        const dash = { strokeDasharray: `${t.pl.toFixed(3)} 400` }
        return (
          <g key={i} className="ir07-trace">
            <path className="ir07-line" d={t.d} />
            {/* the pulse the timeline sends (a soft body, a bright core) */}
            <path className={`ir07-pulse ir07-pulse--glow ir07-p${i}`} d={t.d} pathLength={100} style={dash} />
            <path className={`ir07-pulse ir07-pulse--core ir07-p${i}`} d={t.d} pathLength={100} style={dash} />
            {/* the pulse that idles, slowly, for as long as the slide stands */}
            <g className="ir07-idle">
              <path className="ir07-run ir07-run--glow" d={t.d} pathLength={100} style={run} />
              <path className="ir07-run ir07-run--core" d={t.d} pathLength={100} style={run} />
            </g>
            {t.dots.map((dot, k) => (
              <g key={k} className={`ir07-dot ir07-d${i}`} data-f={dot.f.toFixed(4)}>
                <circle className="ir07-dot-base" cx={dot.x} cy={dot.y} r={0.44} />
                <g className="ir07-lit">
                  <circle cx={dot.x} cy={dot.y} r={1.9} fill="url(#ir07-halo)" />
                  <circle className="ir07-lit-core" cx={dot.x} cy={dot.y} r={0.44} />
                </g>
                <g className="ir07-idle">
                  <g className="ir07-glint" style={{ animationDuration: `${D}s`, animationDelay: `${(delay + idleAt(t, dot.f, D) - 0.03 * D - D).toFixed(3)}s` }}>
                    <circle cx={dot.x} cy={dot.y} r={1.9} fill="url(#ir07-halo)" />
                    <circle className="ir07-lit-core" cx={dot.x} cy={dot.y} r={0.44} />
                  </g>
                </g>
              </g>
            ))}
          </g>
        )
      })}
    </svg>
  )
}
