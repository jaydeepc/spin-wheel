/**
 * A TRACK: a line of a chart as a run of points with the length drawn so far at each of them.
 * A line that is drawn "as far as x" (a year of the race, a quarter of the axis) needs, for that
 * x, the length of stroke to show and the place of its head. Both are read from here, by plain
 * arithmetic, so that every frame of the drawing can be reached by seeking.
 *
 * The points run from left to right (x never goes back): all the deck's lines do.
 */
export interface Track {
  xs: number[]
  ys: number[]
  /** The length of the line from its start to each point. */
  ls: number[]
  total: number
  /** The same points as an SVG path. */
  d: string
}

export function trackFrom(points: (readonly [number, number])[]): Track {
  const xs: number[] = []
  const ys: number[] = []
  const ls: number[] = []
  let total = 0
  points.forEach(([x, y], i) => {
    if (i) total += Math.hypot(x - xs[i - 1], y - ys[i - 1])
    xs.push(x)
    ys.push(y)
    ls.push(total)
  })
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join('')
  return { xs, ys, ls, total, d }
}

/** The head of the line when it has been drawn as far as x: the length drawn, and where the head is. */
export function trackAt(t: Track, x: number): { l: number; x: number; y: number } {
  const n = t.xs.length
  if (x <= t.xs[0]) return { l: 0, x: t.xs[0], y: t.ys[0] }
  if (x >= t.xs[n - 1]) return { l: t.total, x: t.xs[n - 1], y: t.ys[n - 1] }
  let lo = 0
  let hi = n - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (t.xs[mid] <= x) lo = mid
    else hi = mid
  }
  const k = (x - t.xs[lo]) / (t.xs[hi] - t.xs[lo] || 1)
  return { l: t.ls[lo] + (t.ls[hi] - t.ls[lo]) * k, x, y: t.ys[lo] + (t.ys[hi] - t.ys[lo]) * k }
}

/** Points along a run of cubic segments: x0, y0, then (c1x, c1y, c2x, c2y, x, y) for each. `map` turns a source point into a chart point. */
export function sampleCubics(p: number[], map: (x: number, y: number) => readonly [number, number], per = 24): [number, number][] {
  const out: [number, number][] = [[...map(p[0], p[1])] as [number, number]]
  for (let i = 2; i + 5 < p.length; i += 6) {
    const [ax, ay] = [p[i - 2], p[i - 1]]
    for (let k = 1; k <= per; k++) {
      const t = k / per
      const u = 1 - t
      const x = u * u * u * ax + 3 * u * u * t * p[i] + 3 * u * t * t * p[i + 2] + t * t * t * p[i + 4]
      const y = u * u * u * ay + 3 * u * u * t * p[i + 1] + 3 * u * t * t * p[i + 3] + t * t * t * p[i + 5]
      out.push([...map(x, y)] as [number, number])
    }
  }
  return out
}

/**
 * A smooth line through points that never overshoots them (a monotone cubic): the deck draws
 * its 90+ DPD line smoothed, and a smoothing that bulges past a printed value would say
 * something the numbers do not.
 */
export function sampleSmooth(pts: (readonly [number, number])[], per = 14): [number, number][] {
  const n = pts.length
  const dx: number[] = []
  const m: number[] = []
  for (let i = 0; i < n - 1; i++) {
    dx.push(pts[i + 1][0] - pts[i][0])
    m.push((pts[i + 1][1] - pts[i][1]) / dx[i])
  }
  const tan: number[] = [m[0]]
  for (let i = 1; i < n - 1; i++) tan.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2)
  tan.push(m[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      tan[i] = 0
      tan[i + 1] = 0
      continue
    }
    const a = tan[i] / m[i]
    const b = tan[i + 1] / m[i]
    const s = a * a + b * b
    if (s > 9) {
      const k = 3 / Math.sqrt(s)
      tan[i] = k * a * m[i]
      tan[i + 1] = k * b * m[i]
    }
  }
  const out: [number, number][] = [[pts[0][0], pts[0][1]]]
  for (let i = 0; i < n - 1; i++) {
    for (let k = 1; k <= per; k++) {
      const t = k / per
      const t2 = t * t
      const t3 = t2 * t
      const y = (2 * t3 - 3 * t2 + 1) * pts[i][1] + (t3 - 2 * t2 + t) * dx[i] * tan[i] + (-2 * t3 + 3 * t2) * pts[i + 1][1] + (t3 - t2) * dx[i] * tan[i + 1]
      out.push([pts[i][0] + dx[i] * t, y])
    }
  }
  return out
}

/** The time (0 … 1) at which an ease has reached the share p of its way. */
export function easeReaches(ease: (t: number) => number, p: number): number {
  if (p <= 0) return 0
  if (p >= 1) return 1
  let lo = 0
  let hi = 1
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2
    if (ease(mid) < p) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}
