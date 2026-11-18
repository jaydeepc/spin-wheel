'use client'

/**
 * Slides 36, 37, 38, 39 · THE ABCD BANKING AGENT, one scene in three acts (the folders of 37,
 * 38 and 39 re-export this one). The agent's pill never leaves the stage.
 *
 *   36  alike     three account statements are dealt onto the stage. They look the same: grey
 *                 rows, a flat grey line where the balance should be.
 *       healthy   the agent's band of light runs down the first statement: every row glints as
 *       average   it is read, the balance line draws itself (calm, wavy, jagged), the rows that
 *       fragile   matter take the statement's colour and a finding lifts out of each, and at the
 *                 foot the verdict is stamped. One statement per press; unread ones wait dimmed.
 *   37  raw       the mechanism. Five narration lines are typed as the bank writes them, and the
 *                 traditional way stamps its dull label on each.
 *       genai     GenAI's light runs along each line: the fragment that means something turns
 *                 flame, lifts out and flies across, and the category resolves. Row by row.
 *       features  100 beside ~9,000+: the features stream out of the five categories as points
 *                 and settle into a field (the 100 are a small grey block at the same scale).
 *   38  curve     step 2 lights. The chart: axes, the line from score 1 to 10, the two callouts.
 *       two       this customer: the red ring closes on point 2, the score counts to 2, four
 *                 red reasons.
 *   39  ten       the SAME card: the ring runs along the curve to 10 and turns green, the score
 *                 counts on to 10, the title follows, the four reasons turn over to green.
 *
 * Everything is drawn (DOM, SVG, one 2D canvas for the points): no picture is used. The
 * statements have depth by CSS 3D only while they move; at rest they are flat, so type is crisp.
 */

import gsap from 'gsap'
import { anim, Count, Headline, Kicker, slide as slideOf, spanBeats, type Box, type SceneModule } from '../../kit'
import * as D from './data'
import './scene.css'

const SLIDES = {
  36: ['alike', 'healthy', 'average', 'fragile'],
  37: ['raw', 'genai', 'features'],
  38: ['curve', 'two'],
  39: ['ten'],
}

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`

/* ------------------------------------------------------------------ 36: the statement's geometry, in --u */
const COL_X = [4.6, 35.9, 67.2]
const DOC = { top: 20.7, w: 22.6, h: 25.5, rows0: 9.1, rows1: 25.1, scan0: 0.5, scan1: 25.0, balance: 6.9, trail: 5.4 }
/** a finding's pill is 2.5u high on one line and 3.5u on two (the long ones wrap, as on the owner's slide) */
const pillH = (f: string) => (f.length > 41 ? 3.5 : 2.5)
/**
 * Where the findings sit on the statement, from its top: each pill gets the room its own height
 * needs and the air left over is shared out evenly, so no two pills ever touch.
 * `mid` is the middle of each finding, `between` the quiet row after it.
 */
const slots = (findings: string[]) => {
  const hs = findings.map(pillH)
  const gap = (DOC.rows1 - DOC.rows0 - hs.reduce((a, b) => a + b, 0)) / hs.length
  let y = DOC.rows0 + gap / 2
  const mid: number[] = []
  const between: number[] = []
  for (const h of hs) {
    mid.push(y + h / 2)
    between.push(y + h + gap / 2)
    y += h + gap
  }
  return { mid, between }
}
/** seconds the band takes to run down one statement */
const SCAN = 3.0
/** the balance paths are drawn in a 184-wide box; the statement shows them 200 wide */
const widen = (d: string) => {
  let k = 0
  return d.replace(/-?\d+(\.\d+)?/g, (m) => (k++ % 2 === 0 ? String(+(parseFloat(m) * (200 / 184)).toFixed(1)) : m))
}
/** the agent's line of light to each statement (1 = 0.1u, on the whole stage) */
const WIRES = ['M159 196 V206', 'M300 196 Q300 201 306 201 H466 Q472 201 472 206', 'M300 196 Q300 201 306 201 H779 Q785 201 785 206']

/* ------------------------------------------------------------------ 38, 39: the chart's geometry (1 = 0.1u) */
const CH = { w: 500, h: 222, x0: 40, x1: 494, y0: 176, y14: 26 }
const px = (score: number) => 72 + (score - 1) * 45.4
const py = (rate: number) => CH.y0 - (rate / 14) * (CH.y0 - CH.y14)
const PTS = D.CHART.values.map((v, i) => [px(i + 1), py(v)] as const)
/** where a (fractional) score sits on the line */
const onCurve = (score: number) => {
  const s = Math.min(Math.max(score, 1), 10) - 1
  const i = Math.min(Math.floor(s), 8)
  const f = s - i
  return [PTS[i][0] + (PTS[i + 1][0] - PTS[i][0]) * f, PTS[i][1] + (PTS[i + 1][1] - PTS[i][1]) * f] as const
}

/* ------------------------------------------------------------------ pieces */

/** The agent's small robot mark, drawn (the pictures' own mark; no photograph). */
function Robot() {
  // the ABCD agent's own logo (owner, 18 Nov): shown whole, never cropped
  return <img className="s36-robot" src="/keynote/brand/abcd-agent-512.png" alt="" draggable={false} />
}

const Chevron = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 10 14" aria-hidden="true">
    <path d="M2 1.6 L8 7 L2 12.4" />
  </svg>
)

function StatementCol({ s, k }: { s: D.Statement; k: number }) {
  const at = slots(s.findings)
  const tone = D.TONE[s.tone]
  return (
    <div className={`s36-col s36-col--${k}`} style={{ left: u(COL_X[k]), ['--s36-ink' as string]: tone.ink, ['--s36-soft' as string]: tone.soft, ['--s36-line' as string]: tone.line }}>
      <div className="s36-doc">
        <i className="s36-lift" aria-hidden="true" />
        <i className="s36-under s36-under--2" aria-hidden="true" />
        <i className="s36-under s36-under--1" aria-hidden="true" />
        <div className="s36-page">
          <i className="s36-read" aria-hidden="true" />
          <i className="s36-logo" aria-hidden="true" />
          <i className="s36-bar s36-bar--a" aria-hidden="true" />
          <i className="s36-bar s36-bar--b" aria-hidden="true" />
          <span className="s36-dochead">{D.DOC_HEAD}</span>
          <span className="s36-balhead">{D.DOC_BALANCE}</span>
          <svg className="s36-bal" viewBox="0 0 200 22" aria-hidden="true">
            <path className="s36-bal-flat" d="M2 12 H198" />
            <path className="s36-bal-line" d={widen(s.balance)} />
          </svg>
          <i className="s36-rule" aria-hidden="true" />
          {s.findings.map((_, i) => (
            <span key={i}>
              <i className="s36-txn s36-txn--hit" data-y={at.mid[i]} style={{ top: u(at.mid[i]) }} aria-hidden="true">
                <b />
                <b />
                <b />
              </i>
              <i className="s36-txn" data-y={at.between[i]} style={{ top: u(at.between[i]) }} aria-hidden="true">
                <b />
                <b />
                <b />
              </i>
            </span>
          ))}
        </div>
        <i className="s36-scan" aria-hidden="true">
          <i />
        </i>
      </div>
      {s.findings.map((f, i) => (
        <div key={i} className="s36-find" style={{ top: u(at.mid[i]) }}>
          <span className="s36-pill">
            <i aria-hidden="true" />
            {f}
          </span>
        </div>
      ))}
      <div className="s36-verdict">
        <span>{s.verdict}</span>
        <i className="s36-flash" aria-hidden="true" />
      </div>
    </div>
  )
}

function Step({ i }: { i: number }) {
  const s = D.STEPS[i]
  const body = (lit: boolean) => (
    <span className={`s36-stepin ${lit ? 's36-stepin--lit' : ''}`} aria-hidden={lit ? true : undefined}>
      <b className="s36-stepn">{s.n}</b>
      <strong>{s.name}</strong>
      <span>{s.does}</span>
    </span>
  )
  return (
    <div className={`s36-step s36-step--${i + 1}`}>
      {body(false)}
      {body(true)}
    </div>
  )
}

function Reason({ i }: { i: number }) {
  return (
    <div className="s36-reason">
      <div className="s36-face s36-face--bad">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" />
          <path d="M8.4 8.4l7.2 7.2M15.6 8.4l-7.2 7.2" />
        </svg>
        <span>{D.WHY.low.reasons[i]}</span>
      </div>
      <div className="s36-face s36-face--good">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="12" />
          <path d="M7.4 12.4l3.2 3.1 6-6.6" />
        </svg>
        <span>{D.WHY.high.reasons[i]}</span>
      </div>
    </div>
  )
}

function Chart() {
  const line = PTS.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const area = `${line} L${PTS[9][0].toFixed(1)} ${CH.y0} L${PTS[0][0].toFixed(1)} ${CH.y0} Z`
  return (
    <svg className="s36-chart" viewBox={`0 0 ${CH.w} ${CH.h}`} aria-hidden="true">
      <defs>
        <linearGradient id="s36-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f16443" stopOpacity="0.2" />
          <stop offset="1" stopColor="#f16443" stopOpacity="0" />
        </linearGradient>
        {/* the fill has no hard edge at score 1: it comes in from the left */}
        <linearGradient id="s36-areafade" gradientUnits="userSpaceOnUse" x1={PTS[0][0]} y1="0" x2={PTS[0][0] + 60} y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="s36-areamask" maskUnits="userSpaceOnUse" x="0" y="0" width={CH.w} height={CH.h}>
          <rect x="0" y="0" width={CH.w} height={CH.h} fill="url(#s36-areafade)" />
        </mask>
      </defs>
      <text className="s36-ch-name" x="2" y="9">
        {D.CHART.yName}
      </text>
      {D.CHART.ticks.map((t) => (
        <g key={t}>
          <path className={`s36-ch-grid ${t === 0 ? 's36-ch-grid--base' : ''}`} d={`M${CH.x0} ${py(t).toFixed(1)} H${CH.x1}`} />
          <text className="s36-ch-tick" x={CH.x0 - 8} y={py(t) + 3.4} textAnchor="end">
            {t}%
          </text>
        </g>
      ))}
      {PTS.map(([x], i) => (
        <text key={i} className="s36-ch-x" x={x} y={CH.y0 + 15} textAnchor="middle">
          {i + 1}
        </text>
      ))}
      <text className="s36-ch-cap" x={(CH.x0 + CH.x1) / 2} y={CH.h - 4} textAnchor="middle">
        {D.CHART.caption}
      </text>
      <path className="s36-ch-area" d={area} fill="url(#s36-area)" mask="url(#s36-areamask)" />
      <path className="s36-ch-line" d={line} />
      {PTS.map(([x, y], i) => (
        <circle key={i} className="s36-ch-dot" cx={x} cy={y} r="5.4" />
      ))}
      <g className="s36-ch-call s36-ch-call--high">
        <rect x="96" y="12" width="126" height="26" rx="13" />
        <text x="159" y="29.2" textAnchor="middle">
          {D.CHART.high}
        </text>
      </g>
      <g className="s36-ch-call s36-ch-call--low">
        <rect x="352" y="108" width="132" height="26" rx="13" />
        <text x="418" y="125.2" textAnchor="middle">
          {D.CHART.low}
        </text>
      </g>
      <g className="s36-ch-at">
        <circle className="s36-ch-halo" r="13" />
        <circle className="s36-ch-ring" r="13" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ 37: the features, one point each (a 2D canvas, drawn from two numbers) */

/** the nine thousand: 225 across, 40 down. The hundred: 10 by 10, at the same pitch. */
const MANY = { cols: 225, rows: 40 }

interface Field {
  /** h: the hundred, 0 to 1. p: the nine thousand, 0 to 1. */
  state: { h: number; p: number }
  paint(): void
}

function makeField(canvas: HTMLCanvasElement, W: number, H: number, U: number, sources: Box[], big: Box, small: Box, landed: (n: number) => void): Field {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = Math.round(W * dpr)
  canvas.height = Math.round(H * dpr)
  const g = canvas.getContext('2d')
  const state = { h: 0, p: 0 }
  const { cols, rows } = MANY
  const n = cols * rows
  if (!g || !sources.length) return { state, paint: () => landed(Math.round(Math.min(1, state.p / 0.99) * n)) }

  // ONE pitch for both blocks, on whole pixels: the two are to one scale, every point is a crisp square
  let pitch = Math.max(2, Math.round(0.215 * U * dpr))
  while (pitch > 2 && (cols * pitch > big.w * dpr || rows * pitch > big.h * dpr)) pitch--
  const dot = Math.max(1, pitch - 1)
  const fly = Math.max(dot + 1, Math.round(0.3 * U * dpr))
  let seed = 36
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646

  const bx = Math.round(big.x * dpr + (big.w * dpr - cols * pitch) / 2)
  const by = Math.round(big.y * dpr + (big.h * dpr - rows * pitch) / 2)
  // per point: source x, y; control x, y; target x, y; delay; unused
  const pts = new Float32Array(n * 8)
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const i = (c * rows + r) * 8
      const s = sources[Math.floor(rnd() * sources.length)]
      const sx = (s.x + s.w * (0.12 + rnd() * 0.76)) * dpr
      const sy = s.cy * dpr
      const tx = bx + c * pitch
      const ty = by + r * pitch
      pts[i] = sx
      pts[i + 1] = sy
      // the way there bows out and down, and never crosses the words at the box's left
      pts[i + 2] = Math.max(bx, (sx + tx) / 2 + (rnd() - 0.5) * 14 * U * dpr)
      pts[i + 3] = sy + (ty - sy) * (0.25 + rnd() * 0.5)
      pts[i + 4] = tx
      pts[i + 5] = ty
      pts[i + 6] = (c / cols) * 0.5 + rnd() * 0.18
    }
  }
  // the hundred: ten by ten, in the middle of its slot
  const sx0 = Math.round(small.cx * dpr - 5 * pitch)
  const sy0 = Math.round(small.cy * dpr - 5 * pitch)

  const paint = () => {
    g.clearRect(0, 0, canvas.width, canvas.height)
    // the 100, one by one
    const shown = Math.min(100, Math.floor(state.h * 100 + 0.001))
    if (shown > 0) {
      g.fillStyle = '#6f7b98'
      for (let k = 0; k < shown; k++) g.fillRect(sx0 + (k % 10) * pitch, sy0 + Math.floor(k / 10) * pitch, dot, dot)
    }
    // the many: each leaves a category, crosses, and lands in its place
    const p = state.p
    let down = 0
    if (p > 0) {
      g.fillStyle = '#f16443'
      for (let k = 0; k < n; k++) {
        const i = k * 8
        const t = (p - pts[i + 6] * 0.92) / 0.36
        if (t <= 0) continue
        if (t >= 1) {
          down++
          g.fillRect(pts[i + 4], pts[i + 5], dot, dot)
          continue
        }
        const e = 1 - Math.pow(1 - t, 3)
        const q = 1 - e
        const x = q * q * pts[i] + 2 * q * e * pts[i + 2] + e * e * pts[i + 4]
        const y = q * q * pts[i + 1] + 2 * q * e * pts[i + 3] + e * e * pts[i + 5]
        g.globalAlpha = Math.min(1, t * 6)
        const d = dot + Math.round((1 - t) * (fly - dot))
        g.fillRect(Math.round(x), Math.round(y), d, d)
        g.globalAlpha = 1
      }
    }
    landed(down)
  }
  return { state, paint }
}

/* ------------------------------------------------------------------ the scene */

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),

  Scene: () => (
    <div className="s36">
      <Headline className="s36-h s36-h--36" text={slideOf(36).title} flame={D.FLAME[36]} />
      <Headline className="s36-h s36-h--37" text={slideOf(37).title} flame={D.FLAME[37]} />
      <Headline className="s36-h s36-h--38" text={slideOf(38).title} flame={D.FLAME[38]} />

      {/* the agent: on stage through all four slides */}
      <div className="s36-agent">
        <span className="s36-avatar">
          <Robot />
          <i className="s36-ping" aria-hidden="true" />
        </span>
        <b className="s36-agentname">{D.AGENT.name}</b>
        <span className="s36-agentsub s36-agentsub--reads">{D.AGENT.reads}</span>
        <span className="s36-agentsub s36-agentsub--comp">{D.AGENT.composite}</span>
      </div>

      {/* ---------------- act one (36): three statements ---------------- */}
      <p className="s36-aside">{D.ASIDE}</p>
      <svg className="s36-wire" viewBox="0 0 1000 562.5" aria-hidden="true">
        {WIRES.map((d, k) => (
          <path key={k} d={d} />
        ))}
      </svg>
      {D.STATEMENTS.map((s, k) => (
        <StatementCol key={k} s={s} k={k} />
      ))}

      {/* ---------------- the two steps (37 to 39) ---------------- */}
      <Step i={0} />
      <span className="s36-plus" aria-hidden="true">
        +
      </span>
      <Step i={1} />

      {/* ---------------- act two (37): as the bank writes it ---------------- */}
      <div className="s36-b">
        {D.HEADS.map((h, i) => (
          <Kicker key={i} tone={i === 2 ? 'flame' : 'muted'} className={`s36-head s36-head--${i}`}>
            {h}
          </Kicker>
        ))}
        <div className="s36-foot s36-foot--old">
          <b className="s36-footn">
            <Count to={D.FOOT.old.n} />
          </b>
          <p>
            <strong>{D.FOOT.old.title}</strong>
            {D.FOOT.old.sub}
          </p>
          <i className="s36-slot s36-slot--small" aria-hidden="true" />
        </div>
        <div className="s36-foot s36-foot--abcd">
          <b className="s36-footn">
            <Count to={D.FOOT.abcd.n} prefix={D.FOOT.abcd.prefix} suffix={D.FOOT.abcd.suffix} />
          </b>
          <p>
            <strong>{D.FOOT.abcd.title}</strong>
            {D.FOOT.abcd.sub}
          </p>
          <i className="s36-slot s36-slot--big" aria-hidden="true" />
        </div>
        <canvas className="s36-field" aria-hidden="true" />
        {D.ROWS.map((r, i) => (
          <div key={i} className="s36-row" style={{ top: u(22.4 + i * 3.5) }}>
            <div className="s36-raw">
              <i className="s36-tab" aria-hidden="true" />
              <span className="s36-rawtext">
                {r.raw[0]}
                <b className="s36-frag">{r.raw[1]}</b>
                {r.raw[2]}
              </span>
              <i className="s36-sweep" aria-hidden="true" />
            </div>
            <Chevron className="s36-chev s36-chev--old" />
            <span className="s36-old">{r.old}</span>
            <Chevron className="s36-chev s36-chev--new" />
            <i className="s36-catslot" aria-hidden="true" />
            <span className="s36-cat">
              <span>{r.cat}</span>
            </span>
          </div>
        ))}
        {D.ROWS.map((r, i) => (
          <span key={i} className="s36-ghost" aria-hidden="true">
            {r.raw[1]}
          </span>
        ))}
      </div>

      {/* ---------------- act three (38, 39): the score, and why ---------------- */}
      <div className="s36-card s36-card--chart">
        <Kicker tone="flame" block>
          {D.CHART.kicker}
        </Kicker>
        <h2 className="s36-cardtitle">{D.CHART.title}</h2>
        <Chart />
      </div>
      <div className="s36-card s36-card--why">
        <Kicker tone="flame" block>
          {D.WHY.kicker}
        </Kicker>
        <h2 className="s36-cardtitle">
          {D.WHY.title} <span className="s36-whyn">{D.WHY.high.score}</span>
        </h2>
        <div className="s36-score">
          <span>{D.WHY.bar}</span>
          <b className="s36-scoren">{D.WHY.high.score}</b>
        </div>
        {D.WHY.low.reasons.map((_, i) => (
          <Reason key={i} i={i} />
        ))}
      </div>
    </div>
  ),

  build(ctx) {
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const { U, ease } = ctx
    const fx = ctx.backdrop.fx
    const calm = ctx.reduced

    /* ---------- measure first (rule 5) ---------- */
    const rows = ctx.$$('.s36-row')
    const frags = ctx.$$('.s36-frag').map((el) => ctx.loc(el))
    const cats = ctx.$$('.s36-cat').map((el) => ctx.loc(el))
    const bigSlot = ctx.loc(ctx.$('.s36-slot--big'))
    const smallSlot = ctx.loc(ctx.$('.s36-slot--small'))
    const chartCard = ctx.$('.s36-card--chart')
    const chartBox = ctx.loc(chartCard)
    // the counter is the number of points that have landed: the figure and the picture are one thing
    const manyN = ctx.$('.s36-foot--abcd .kn-count-n')
    let manyShown = -1
    const landed = (n: number) => {
      if (n === manyShown) return
      manyShown = n
      manyN.textContent = `${D.FOOT.abcd.prefix}${n.toLocaleString('en-US')}${D.FOOT.abcd.suffix}`
    }
    const field = makeField(ctx.$<HTMLCanvasElement>('.s36-field'), ctx.W, ctx.H, U, cats, bigSlot, smallSlot, landed)
    field.paint()
    ctx.onSeek(field.paint)

    /* =================================================================== 36 · alike */
    a.words('.s36-h--36', 0.1)
    a.rise('.s36-agent', 0.15, { y: 1 })
    gsap.set(ctx.$('.s36-agentsub--comp'), { autoAlpha: 0 })
    a.fade('.s36-aside', 0.7, { duration: 0.7 })

    const cols = ctx.$$('.s36-col')
    const docs = ctx.$$('.s36-doc')
    // dealt in from depth: lying back, turning, then standing flat (identity at rest: crisp type)
    gsap.set(docs, calm ? { autoAlpha: 0 } : { autoAlpha: 0, rotationX: 46, rotationY: (i) => [-26, 0, 26][i], z: -34 * U, y: 9 * U, transformOrigin: '50% 100%' })
    tl.to(docs, { autoAlpha: 1, duration: 0.35, stagger: 0.16, ease: 'power1.out' }, 0.4)
    tl.to(docs, { rotationX: 0, rotationY: 0, z: 0, y: 0, duration: 1.15, stagger: 0.16, ease: ease.out }, 0.4)
    gsap.set(ctx.$$('.s36-under'), { x: 0, y: 0 })
    tl.to(ctx.$$('.s36-under--1'), { x: 0.42 * U, y: 0.34 * U, duration: 0.6, ease: ease.out }, 1.15)
    tl.to(ctx.$$('.s36-under--2'), { x: 0.84 * U, y: 0.68 * U, duration: 0.6, ease: ease.out }, 1.21)
    tl.to(fx, { glow: 0.2, focusY: 0.2, duration: 1.6 }, 0.6)

    gsap.set(ctx.$$('.s36-pill'), { autoAlpha: 0, x: -2.2 * U, scale: 0.9, transformOrigin: '0% 50%' })
    gsap.set(ctx.$$('.s36-verdict'), { autoAlpha: 0, scale: 1.2, y: -0.7 * U })
    gsap.set(ctx.$$('.s36-flash'), { autoAlpha: 0 })
    gsap.set(ctx.$$('.s36-scan'), { autoAlpha: 0, y: DOC.scan0 * U })
    gsap.set(ctx.$$('.s36-scan i'), { scaleY: 0, transformOrigin: '50% 100%' })
    gsap.set(ctx.$$('.s36-read'), { scaleY: 0, transformOrigin: '50% 0%' })
    gsap.set(ctx.$$('.s36-lift'), { autoAlpha: 0 })
    gsap.set(cols, { transformOrigin: (i) => ['35% 30%', '60% 30%', '100% 30%'][i] })
    const wires = ctx.$$<SVGPathElement>('.s36-wire path')
    gsap.set(wires, { autoAlpha: 0, drawSVG: '0% 0%' })
    gsap.set(ctx.$$('.s36-bal-line'), { drawSVG: '0%', autoAlpha: 0 })
    gsap.set(ctx.$('.s36-ping'), { autoAlpha: 0, scale: 1 })
    tl.addLabel('alike')

    /* =================================================================== 36 · one statement per press */
    const read = (k: number, label: string) => {
      const t = tl.duration() + 0.02
      const col = cols[k]
      const tone = D.TONE[D.STATEMENTS[k].tone]
      const q = <E extends Element = HTMLElement>(sel: string) => Array.from(col.querySelectorAll<E>(sel))
      const scan = q('.s36-scan')[0]
      /** the band starts down the page */
      const t0 = t + 0.5
      const when = (y: number) => t0 + ((y - DOC.scan0) / (DOC.scan1 - DOC.scan0)) * SCAN

      // the unread statements wait, dimmed; this one is read
      const waiting = cols.filter((_, i) => i > k)
      if (k === 0) tl.to(waiting, { opacity: 0.42, duration: 0.5 }, t)
      else tl.to(col, { opacity: 1, duration: 0.4 }, t)
      tl.to(fx, { focusX: [-0.62, 0, 0.62][k], glow: 0.42, warm: [-0.25, 0.15, 0.4][k], duration: 1.2, ease: ease.inOut }, t)
      // the agent looks up, and its line of light runs to the statement
      tl.fromTo(ctx.$('.s36-ping'), { autoAlpha: 0.9, scale: 1 }, { autoAlpha: 0, scale: 1.9, duration: 0.7, ease: 'power2.out', immediateRender: false }, t)
      const wd = k ? 0.4 : 0.2
      tl.to(wires[k], { autoAlpha: 1, duration: 0.01, ease: 'none' }, t + 0.05)
      tl.to(wires[k], { drawSVG: '0% 100%', duration: wd, ease: 'power1.inOut' }, t + 0.05)
      tl.to(wires[k], { drawSVG: '100% 100%', duration: 0.3, ease: 'power1.in' }, t + 0.05 + wd)
      tl.to(wires[k], { autoAlpha: 0, duration: 0.01, ease: 'none' }, t + 0.36 + wd)

      // it comes forward off the table while it is read, and is set down again as the verdict lands
      if (!calm) {
        tl.to(col, { scale: 1.055, duration: 0.6, ease: ease.out }, t + 0.1)
        tl.to(q('.s36-lift'), { autoAlpha: 1, duration: 0.6, ease: ease.out }, t + 0.1)
        tl.to(col, { scale: 1, duration: 0.5, ease: ease.inOut }, t0 + SCAN - 0.4)
        tl.to(q('.s36-lift'), { autoAlpha: 0, duration: 0.5, ease: ease.inOut }, t0 + SCAN - 0.4)
      }

      // the band of light, its trail, and the wash of colour it leaves on what it has read
      tl.to(scan, { autoAlpha: 1, duration: 0.2 }, t0 - 0.2)
      tl.to(scan, { y: DOC.scan1 * U, duration: SCAN, ease: 'none' }, t0)
      tl.to(q('.s36-scan i'), { scaleY: 1, duration: (DOC.trail / (DOC.scan1 - DOC.scan0)) * SCAN, ease: 'none' }, t0)
      tl.to(q('.s36-read'), { scaleY: DOC.scan1 / DOC.h, duration: SCAN, ease: 'none' }, t0)
      tl.to(q('.s36-read'), { scaleY: 1, duration: 0.25, ease: 'none' }, t0 + SCAN)
      tl.to(scan, { autoAlpha: 0, duration: 0.25 }, t0 + SCAN)

      // the balance draws itself as the band crosses it
      const tb = when(DOC.balance) - 0.25
      tl.to(q('.s36-bal-line'), { autoAlpha: 1, duration: 0.01, ease: 'none' }, tb)
      tl.to(q('.s36-bal-line'), { drawSVG: '100%', duration: 1.0, ease: 'power1.inOut' }, tb)
      tl.to(q('.s36-bal-flat'), { autoAlpha: 0, duration: 0.5 }, tb + 0.2)
      tl.to(q('.s36-balhead'), { color: '#0d1f57', duration: 0.4 }, tb)

      // every row glints as it is read; the ones that matter keep the statement's colour
      const pills = q('.s36-pill')
      let hit = 0
      for (const row of q('.s36-txn')) {
        const tr = when(Number(row.dataset.y))
        const bars = Array.from(row.children)
        if (row.classList.contains('s36-txn--hit')) {
          tl.to(bars, { backgroundColor: tone.soft, duration: 0.2 }, tr - 0.06)
          tl.to(bars[0], { backgroundColor: tone.line, duration: 0.2 }, tr - 0.06)
          // the finding lifts out of its row
          tl.to(pills[hit++], { autoAlpha: 1, x: 0, scale: 1, duration: 0.6, ease: ease.snap }, tr + 0.02)
        } else {
          tl.to(bars, { backgroundColor: '#f6b9a8', duration: 0.12, ease: 'none' }, tr - 0.08)
          tl.to(bars, { backgroundColor: '#e3e8f2', duration: 0.4, ease: 'power1.out' }, tr + 0.06)
        }
      }

      // the verdict is stamped at the foot
      const tv = t0 + SCAN + 0.05
      tl.to(q('.s36-verdict'), { autoAlpha: 1, scale: 1, y: 0, duration: 0.3, ease: ease.slam }, tv)
      tl.fromTo(q('.s36-flash'), { autoAlpha: 0.75 }, { autoAlpha: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, tv + 0.28)
      if (!calm) {
        tl.to(q('.s36-doc'), { y: 0.22 * U, duration: 0.09, ease: 'power2.out' }, tv + 0.28)
        tl.to(q('.s36-doc'), { y: 0, duration: 0.5, ease: ease.out }, tv + 0.37)
      }
      tl.addLabel(label, tv + 0.9)
    }
    read(0, 'healthy')
    read(1, 'average')
    read(2, 'fragile')

    /* =================================================================== 37 · raw */
    let t = tl.duration() + 0.02
    a.retitle('.s36-h--36', '.s36-h--37', t)
    tl.to(cols, { autoAlpha: 0, y: -1.4 * U, duration: 0.42, stagger: 0.07, ease: 'power2.in' }, t)
    tl.to(ctx.$('.s36-aside'), { autoAlpha: 0, duration: 0.3 }, t)
    tl.to(ctx.$('.s36-agentsub--reads'), { autoAlpha: 0, duration: 0.25 }, t + 0.1)
    tl.to(ctx.$('.s36-agentsub--comp'), { autoAlpha: 1, duration: 0.4 }, t + 0.35)
    tl.to(fx, { focusX: -0.4, focusY: 0.1, glow: 0.25, warm: 0, duration: 1.4, ease: ease.inOut }, t)

    const steps = ctx.$$('.s36-step')
    const lit = ctx.$$('.s36-stepin--lit')
    a.rise(steps, t + 0.5, { x: 2, y: 0, stagger: 0.14 })
    a.pop('.s36-plus', t + 0.8)
    gsap.set(lit, { autoAlpha: 0 })
    tl.to(lit[0], { autoAlpha: 1, duration: 0.45 }, t + 1.15)

    a.fade('.s36-head--0', t + 0.7)
    const raws = ctx.$$('.s36-raw')
    const texts = ctx.$$('.s36-rawtext')
    a.rise(raws, t + 0.75, { y: 1.1, stagger: 0.1, duration: 0.6 })
    // typed as the bank writes it: monospace, so a stepped wipe is the typing
    texts.forEach((el, i) => {
      const n = el.textContent?.length ?? 30
      if (calm) return
      gsap.set(el, { clipPath: 'inset(0% 100% 0% 0%)' })
      tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.35 + n * 0.017, ease: `steps(${n})` }, t + 1.0 + i * 0.16)
    })
    const tOld = t + 2.25
    a.fade('.s36-head--1', tOld)
    // GenAI's column keeps its place: its name waits dim, over five places still to be filled
    const head2 = ctx.$('.s36-head--2')
    const catSlots = ctx.$$('.s36-catslot')
    gsap.set(head2, { autoAlpha: 0 })
    tl.to(head2, { autoAlpha: 0.5, duration: 0.5 }, tOld + 0.45)
    gsap.set(catSlots, { autoAlpha: 0 })
    tl.to(catSlots, { autoAlpha: 1, duration: 0.4, stagger: 0.08 }, tOld + 0.5)
    // … and the traditional way's whole harvest: a hundred features
    a.rise('.s36-foot--old', tOld + 0.7, { y: 1.4 })
    a.count('.s36-foot--old .kn-count-n', tOld + 0.9, { duration: 0.9 })
    gsap.set(field.state, { h: 0, p: 0 })
    tl.to(field.state, { h: 1, duration: 0.9, ease: 'power2.out', onUpdate: field.paint }, tOld + 0.9)
    a.fade('.s36-chev--old', tOld + 0.05, { stagger: 0.11, duration: 0.3 })
    const olds = ctx.$$('.s36-old')
    gsap.set(olds, calm ? { autoAlpha: 0 } : { autoAlpha: 0, scale: 1.25 })
    tl.to(olds, { autoAlpha: 1, scale: 1, duration: 0.26, stagger: 0.11, ease: ease.slam }, tOld + 0.12)
    tl.addLabel('raw')

    /* =================================================================== 37 · genai */
    t = tl.duration() + 0.02
    tl.to(head2, { autoAlpha: 1, duration: 0.4 }, t)
    tl.to(steps[0], { scale: 1.035, duration: 0.22, ease: 'power2.out' }, t)
    tl.to(steps[0], { scale: 1, duration: 0.5, ease: ease.out }, t + 0.22)
    tl.to(fx, { focusX: 0.55, glow: 0.4, warm: 0.5, duration: 3.2, ease: ease.inOut }, t)
    const ghosts = ctx.$$('.s36-ghost')
    const fragEls = ctx.$$('.s36-frag')
    const catEls = ctx.$$('.s36-cat')
    const tabs = ctx.$$('.s36-tab')
    gsap.set(ctx.$$('.s36-sweep'), { xPercent: -110, autoAlpha: 0 })
    gsap.set(ctx.$$('.s36-chev--new'), { autoAlpha: 0, x: -0.8 * U })
    gsap.set(catEls, calm ? { autoAlpha: 0 } : { autoAlpha: 1, clipPath: 'inset(0% 100% 0% 0% round 99em)' })
    gsap.set(
      catEls.map((c) => c.firstElementChild as Element),
      { autoAlpha: 0, y: 0.5 * U },
    )
    rows.forEach((row, i) => {
      const r = t + 0.2 + i * 0.62
      const one = <E extends Element = HTMLElement>(sel: string) => row.querySelector<E>(sel) as E
      // the light runs along the line
      tl.to(one('.s36-sweep'), { autoAlpha: 1, duration: 0.1 }, r)
      tl.to(one('.s36-sweep'), { xPercent: 520, duration: 0.7, ease: 'power1.inOut' }, r)
      tl.to(one('.s36-sweep'), { autoAlpha: 0, duration: 0.15 }, r + 0.6)
      tl.to(tabs[i], { backgroundColor: '#f16443', duration: 0.3 }, r + 0.05)
      // the fragment that means something
      const rf = r + 0.1 + (frags[i].cx - ctx.loc(raws[i]).x) / ctx.loc(raws[i]).w * 0.4
      tl.to(fragEls[i], { color: '#d9481f', backgroundColor: 'rgba(253, 227, 217, 1)', duration: 0.22 }, rf)
      // … lifts out and crosses to its category
      const gh = ghosts[i]
      gsap.set(gh, { x: frags[i].x, y: frags[i].y, autoAlpha: 0 })
      if (!calm) {
        tl.to(gh, { autoAlpha: 1, duration: 0.08 }, rf + 0.1)
        // up into the gap above its own row, across over nobody's words, then down into its category
        tl.to(gh, { y: frags[i].y - 1.6 * U, duration: 0.28, ease: 'power2.out' }, rf + 0.1)
        tl.to(gh, { x: cats[i].cx - frags[i].w / 2, duration: 0.55, ease: 'power2.inOut' }, rf + 0.3)
        tl.to(gh, { y: cats[i].cy - frags[i].h / 2, duration: 0.22, ease: 'power2.in' }, rf + 0.63)
        tl.to(gh, { autoAlpha: 0, scale: 0.7, duration: 0.2 }, rf + 0.7)
      }
      const rc = rf + 0.62
      tl.to(one('.s36-old'), { opacity: 0.5, duration: 0.4 }, rc)
      tl.to(one('.s36-chev--old'), { opacity: 0.45, duration: 0.4 }, rc)
      tl.to(one('.s36-chev--new'), { autoAlpha: 1, x: 0, duration: 0.35, ease: ease.snap }, rc - 0.08)
      tl.to(catEls[i], calm ? { autoAlpha: 1, duration: 0.4 } : { clipPath: 'inset(0% 0% 0% 0% round 99em)', duration: 0.5, ease: ease.out }, rc)
      tl.to(catEls[i].firstElementChild, { autoAlpha: 1, y: 0, duration: 0.4, ease: ease.out }, rc + 0.14)
      tl.to(catSlots[i], { autoAlpha: 0, duration: 0.3 }, rc + 0.25)
    })
    tl.addLabel('genai')

    /* =================================================================== 37 · features */
    t = tl.duration() + 0.02
    a.rise('.s36-foot--abcd', t, { y: 1.4 })
    // every category gives up its features
    tl.to(catEls, { scale: 1.03, duration: 0.2, stagger: 0.07, ease: 'power2.out' }, t + 0.4)
    tl.to(catEls, { scale: 1, duration: 0.5, stagger: 0.07, ease: ease.out }, t + 0.6)
    tl.to(field.state, { p: 1, duration: 3.0, ease: 'none', onUpdate: field.paint }, t + 0.35)
    tl.to(fx, { focusX: 0.45, focusY: 0.75, glow: 0.5, energy: 0.3, duration: 2.4, ease: ease.inOut }, t)
    tl.addLabel('features')

    /* =================================================================== 38 · curve */
    t = tl.duration() + 0.02
    a.retitle('.s36-h--37', '.s36-h--38', t)
    tl.to(rows, { autoAlpha: 0, x: -1.6 * U, duration: 0.36, stagger: 0.045, ease: 'power2.in' }, t)
    tl.to([...ctx.$$('.s36-head'), ...ctx.$$('.s36-foot'), ctx.$('.s36-field')], { autoAlpha: 0, duration: 0.36, ease: 'power2.in' }, t + 0.05)
    tl.to(fx, { focusX: -0.2, focusY: 0.3, glow: 0.3, warm: 0.1, energy: 0, duration: 1.6, ease: ease.inOut }, t)
    // step 2 lights
    tl.to(lit[1], { autoAlpha: 1, duration: 0.5 }, t + 0.45)
    tl.to(steps[1], { scale: 1.04, duration: 0.22, ease: 'power2.out' }, t + 0.45)
    tl.to(steps[1], { scale: 1, duration: 0.55, ease: ease.out }, t + 0.67)

    // the chart's card stands in the middle while it is alone
    const mid = ctx.W / 2 - chartBox.cx
    const cq = <E extends Element = SVGElement>(sel: string) => Array.from(chartCard.querySelectorAll<E>(sel))
    gsap.set(chartCard, { autoAlpha: 0, x: mid, y: 2 * U })
    tl.to(chartCard, { autoAlpha: 1, y: 0, duration: 0.75, ease: ease.out }, t + 0.5)
    const tc = t + 0.85
    gsap.set(cq('.s36-ch-grid'), { drawSVG: '0%' })
    gsap.set([...cq('.s36-ch-tick'), ...cq('.s36-ch-x'), ...cq('.s36-ch-name'), ...cq('.s36-ch-cap'), ...cq('.s36-ch-area')], { autoAlpha: 0 })
    tl.to(cq('.s36-ch-grid'), { drawSVG: '100%', duration: 0.7, stagger: 0.04, ease: ease.glide }, tc)
    tl.to([...cq('.s36-ch-name'), ...cq('.s36-ch-tick')], { autoAlpha: 1, duration: 0.4, stagger: 0.03 }, tc + 0.1)
    tl.to(cq('.s36-ch-x'), { autoAlpha: 1, duration: 0.4, stagger: 0.04 }, tc + 0.3)
    tl.to(cq('.s36-ch-cap'), { autoAlpha: 1, duration: 0.5 }, tc + 0.6)
    // the line, from score 1 to 10; each point lands as the line reaches it
    const LINE = 1.7
    const linePath = cq<SVGPathElement>('.s36-ch-line')[0]
    const total = linePath.getTotalLength()
    gsap.set(linePath, { drawSVG: '0%', autoAlpha: 0 })
    tl.to(linePath, { autoAlpha: 1, duration: 0.01, ease: 'none' }, tc + 0.7)
    tl.to(linePath, { drawSVG: '100%', duration: LINE, ease: 'none' }, tc + 0.7)
    const dots = cq('.s36-ch-dot')
    gsap.set(dots, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%' })
    let run = 0
    dots.forEach((d, i) => {
      if (i) run += Math.hypot(PTS[i][0] - PTS[i - 1][0], PTS[i][1] - PTS[i - 1][1])
      tl.to(d, { autoAlpha: 1, scale: 1, duration: 0.4, ease: ease.snap }, tc + 0.7 + (run / total) * LINE - 0.05)
    })
    tl.to(cq('.s36-ch-area'), { autoAlpha: 1, duration: 0.9 }, tc + 0.7 + LINE * 0.6)
    const calls = cq('.s36-ch-call')
    gsap.set(calls, { autoAlpha: 0, scale: 0.7, transformOrigin: '50% 50%' })
    tl.to(calls[0], { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.snap }, tc + 0.7 + LINE * 0.25)
    tl.to(calls[1], { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.snap }, tc + 0.7 + LINE + 0.1)
    tl.addLabel('curve')

    /* =================================================================== 38 · two, 39 · ten: one card, one number */
    const at = cq<SVGGElement>('.s36-ch-at')[0]
    const ring = cq<SVGCircleElement>('.s36-ch-ring')[0]
    const halo = cq<SVGCircleElement>('.s36-ch-halo')[0]
    const whyN = ctx.$('.s36-whyn')
    const scoreN = ctx.$('.s36-scoren')
    // red, amber, green: the three colours of the three statements, never the brown between red and green
    const mix = gsap.utils.interpolate([D.TONE.bad.ink, D.TONE.mid.ink, D.TONE.good.ink])
    const sc = { n: 0 }
    /** everything that follows the score: the ring's place and colour, both numerals */
    const paint = () => {
      const s = Math.min(Math.max(sc.n, 2), 10)
      const [x, y] = onCurve(s)
      at.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`)
      const c = mix((s - 2) / 8)
      ring.style.stroke = c
      halo.style.fill = c
      const txt = String(Math.round(sc.n))
      if (scoreN.textContent !== txt) scoreN.textContent = txt
      const w = String(Math.max(2, Math.round(sc.n)))
      if (whyN.textContent !== w) whyN.textContent = w
    }
    paint()
    ctx.onSeek(paint)

    t = tl.duration() + 0.02
    const why = ctx.$('.s36-card--why')
    tl.to(chartCard, { x: 0, duration: 0.85, ease: ease.inOut }, t)
    gsap.set(why, { autoAlpha: 0, x: 5 * U })
    tl.to(why, { autoAlpha: 1, x: 0, duration: 0.8, ease: ease.out }, t + 0.35)
    tl.to(fx, { focusX: 0.4, warm: 0.45, glow: 0.38, duration: 1.4, ease: ease.inOut }, t)
    // the ring closes on point 2
    gsap.set(ring, { drawSVG: '0%', autoAlpha: 0, rotation: -90, transformOrigin: '50% 50%' })
    gsap.set(halo, { autoAlpha: 0, scale: 1, transformOrigin: '50% 50%' })
    tl.to(ring, { autoAlpha: 1, duration: 0.01, ease: 'none' }, t + 0.8)
    tl.to(ring, { drawSVG: '100%', duration: 0.6, ease: ease.glide }, t + 0.8)
    tl.fromTo(halo, { autoAlpha: 0.35, scale: 1 }, { autoAlpha: 0, scale: 2.4, duration: 0.8, ease: 'power2.out', immediateRender: false }, t + 1.35)
    // the score
    const bar = ctx.$('.s36-score')
    a.wipe(bar, t + 0.95, { duration: 0.6 })
    tl.fromTo(sc, { n: 0 }, { n: 2, duration: 0.6, ease: 'power1.out', onUpdate: paint, immediateRender: false }, t + 1.3)
    // four reasons, red
    const reasons = ctx.$$('.s36-reason')
    const bad = ctx.$$('.s36-face--bad')
    const good = ctx.$$('.s36-face--good')
    gsap.set(good, calm ? { autoAlpha: 0 } : { autoAlpha: 0, rotationX: 88, transformOrigin: '50% 50%' })
    a.rise(reasons, t + 1.7, { y: 0, x: 2.4, stagger: 0.16, duration: 0.6 })
    const crosses = bad.map((b) => b.querySelector('svg') as Element)
    gsap.set(crosses, { scale: 0, transformOrigin: '50% 50%' })
    tl.to(crosses, { scale: 1, duration: 0.45, stagger: 0.16, ease: ease.snap }, t + 1.85)
    tl.addLabel('two')

    t = tl.duration() + 0.02
    // the ring runs along the curve, and the score counts with it
    tl.to(ring, { scale: 1.18, duration: 0.25, ease: 'power2.out' }, t)
    tl.fromTo(sc, { n: 2 }, { n: 10, duration: 1.6, ease: ease.inOut, onUpdate: paint, immediateRender: false }, t + 0.1)
    tl.to(ring, { scale: 1, duration: 0.5, ease: ease.snap }, t + 1.6)
    tl.fromTo(halo, { autoAlpha: 0.4, scale: 1 }, { autoAlpha: 0, scale: 2.6, duration: 0.9, ease: 'power2.out', immediateRender: false }, t + 1.65)
    tl.to(scoreN, { scale: 1.16, duration: 0.18, ease: 'power2.out' }, t + 1.55)
    tl.to(scoreN, { scale: 1, duration: 0.5, ease: ease.out }, t + 1.73)
    tl.to(fx, { focusX: 0.5, warm: -0.35, glow: 0.45, duration: 1.8, ease: ease.inOut }, t)
    // the same four rows turn over: red out, green in
    reasons.forEach((_, i) => {
      const r = t + 0.45 + i * 0.18
      if (calm) {
        tl.to(bad[i], { autoAlpha: 0, duration: 0.3 }, r)
        tl.to(good[i], { autoAlpha: 1, duration: 0.4 }, r + 0.2)
        return
      }
      tl.to(bad[i], { rotationX: -88, duration: 0.26, ease: 'power2.in' }, r)
      tl.to(bad[i], { autoAlpha: 0, duration: 0.01, ease: 'none' }, r + 0.26)
      tl.to(good[i], { autoAlpha: 1, duration: 0.01, ease: 'none' }, r + 0.26)
      tl.to(good[i], { rotationX: 0, duration: 0.5, ease: ease.snap }, r + 0.26)
    })
    tl.addLabel('ten', t + 2.6)

    return tl
  },
}

export default scene
