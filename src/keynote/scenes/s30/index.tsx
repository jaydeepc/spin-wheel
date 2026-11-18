'use client'

/**
 * Slide 30 · "Our AI, Tech & data science capabilities have achieved massive scale"
 *
 * THE IDEA: scale is something that GATHERS. The slide opens on two charts built out of
 * hundreds of small lacquered blocks that come out of the depth of the room and settle into
 * rising columns (the people working on AI; the AI agents). Then, press by press, the charts
 * step back and up to make room and the nine numbers arrive under them, row by row, each one
 * counting up beside its numbered badge (the presenter can call them by number).
 *
 *   progress   the headline; the two charts gather
 *   people     1 to 3: the space, the engineers, the scientists
 *   models     4 to 6: features, dashboards, models
 *   platform   7 to 9: GenAI models, products, API hits
 *
 * THE TWO CHARTS ARE PLACEHOLDERS. The deck leaves two empty boxes there and prints no figure
 * for either, so what is drawn is an illustrative shape only (data.ts → CHARTS), with nothing
 * printed on it, the blocks are pale (an unpainted model, not the brand's full colours), the
 * card is hatched and dashed like an empty plot, and each chart carries the tag "Placeholder
 * chart, to be replaced" (it keeps its size while the charts shrink). The deck's
 * own placeholder text ("<< Chart on … >>") and its yellow highlighter are never shown.
 *
 * The blocks are instanced meshes on a scene-owned canvas (blocks.ts) whose space is the
 * stage's, so they stand inside the DOM's cards and shrink with them. Without WebGL the cards
 * show plain columns instead (.s30-fb), and the scene tells the same thing.
 */

import gsap from 'gsap'
import { anim, Count, Headline, Words, type SceneModule } from '../../kit'
import { makeCharts, type Charts } from './blocks'
import { CHARTS, TAG, TILES } from './data'
import './scene.css'

/* The chart row at full size, in --u (the stylesheet has the same numbers). */
const CARD = { w: 43.5, h: 21, gap: 4.6 }
/** The row's top in the last rest; the grid's top. */
const TOP = 11.7
/**
 * The four rests: where the chart row's top is, how large it is, and how far the grid of
 * numbers hangs below its final place. The charts give way as the numbers come in, so every
 * rest fills the stage.
 */
const RESTS = [
  { top: 20, s: 1, grid: 10.85 },
  { top: 16.35, s: 1, grid: 10.85 },
  { top: 13.4, s: 0.9, grid: 5.6 },
  { top: TOP, s: 0.724, grid: 0 },
]
const ROWS = ['people', 'models', 'platform']

/** A figure counts from the smallest number with as many digits, so its width never changes while it counts. */
const startOf = (to: number) => 10 ** (String(to).length - 1)

const scene: SceneModule = {
  beats: ['progress', ...ROWS],

  Scene: ({ slide }) => (
    <div className="s30">
      <Headline className="s30-h" text={slide.title} />

      <div className="s30-charts">
        {CHARTS.map((c) => (
          <div className="s30-chart" data-chart={c.id} key={c.id}>
            <span className="s30-hatch" aria-hidden="true" />
            <p className="s30-chart-title">
              <Words text={c.title} />
            </p>
            <span className="s30-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="9" strokeDasharray="3.2 3.2" />
                <path d="M12 7.5v5.2M12 16.2v.3" />
              </svg>
              {TAG}
            </span>
            {/* without WebGL: the same illustrative shape as plain columns */}
            <span className="s30-fb" aria-hidden="true">
              {c.shape.map((rows, i) => (
                <span className="s30-fb-bar" key={i} style={{ height: `${(rows / Math.max(...c.shape)) * 100}%`, opacity: 0.45 + (0.55 * i) / (c.shape.length - 1) }} />
              ))}
            </span>
          </div>
        ))}
      </div>

      <div className="s30-grid">
        {TILES.map((t) => (
          <div className="s30-tile" data-tone={t.tone} key={t.n}>
            <span className="s30-badge">{t.n}</span>
            <div className="s30-body">
              <b className="s30-num">
                <Count to={t.to} from={startOf(t.to)} prefix={t.prefix} suffix={t.suffix} />
                {t.unit ? <small className={t.unit.length > 2 ? 's30-unit s30-unit--word' : 's30-unit'}>{t.unit}</small> : null}
              </b>
              <p className="s30-label">
                {t.label.map((line) => (
                  <span className="s30-label-line" key={line}>
                    <Words text={line} />
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  three(ctx) {
    const charts = makeCharts(ctx, CHARTS, CARD)
    ctx.bag.charts = charts
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      charts.gl.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const charts = ctx.bag.charts as Charts | undefined
    const row = ctx.$('.s30-charts')
    const grid = ctx.$('.s30-grid')
    const tiles = ctx.$$('.s30-tile')
    const tags = ctx.$$('.s30-tag')

    /** The chart row (the DOM's cards and the blocks standing in them) goes to rest k. */
    const place = (k: number, t: number) => {
      const r = RESTS[k]
      tl.to(row, { y: (r.top - TOP) * U, scale: r.s, duration: 1.0, ease: ease.inOut }, t)
      tl.to(grid, { y: r.grid * U, duration: 1.0, ease: ease.inOut }, t)
      // the tag does not shrink with its chart: it says "placeholder" at the same size on every rest
      tl.to(tags, { scale: 1 / r.s, duration: 1.0, ease: ease.inOut }, t)
      if (charts) {
        tl.to(charts.rig.position, { y: 28.125 - r.top, duration: 1.0, ease: ease.inOut }, t)
        tl.to(charts.rig.scale, { x: r.s, y: r.s, z: r.s, duration: 1.0, ease: ease.inOut }, t)
      }
    }

    /* ---- starting states ---- */
    gsap.set(row, { transformOrigin: '50% 0%', y: (RESTS[0].top - TOP) * U, scale: 1 })
    gsap.set(grid, { y: RESTS[1].grid * U })
    gsap.set(tags, { transformOrigin: '0% 0%', scale: 1 })
    if (charts) {
      charts.rig.position.set(0, 28.125 - RESTS[0].top, 0)
      charts.rig.scale.setScalar(1)
      charts.state.p = 0
      charts.state.sway = 0
      charts.apply()
    }

    /* --------------------------------------------------------------- progress */
    a.words('.kn-h', 0.1)
    a.rise('.s30-chart', 0.45, { y: 2.6, stagger: 0.14, duration: 0.9 })
    a.words('.s30-chart-title', 0.85, { stagger: 0.05 })
    if (charts) {
      // the blocks gather: out of the depth, column by column, from the ground up
      tl.to(charts.state, { p: 1, duration: reduced ? 1.2 : 2.5, ease: 'none', onUpdate: charts.apply }, 0.75)
      tl.to(charts.state, { sway: 1, duration: 1.0, ease: 'power1.inOut' }, 2.6)
    } else {
      a.rule('.s30-fb-bar', 0.9, { from: 'bottom', stagger: 0.07, duration: 0.8 })
    }
    a.rise('.s30-tag', charts ? 2.75 : 1.9, { y: 0.6, stagger: 0.12, duration: 0.6 })
    tl.to(fx, { glow: 0.3, focusX: 0, focusY: 0.05, energy: 0.25, duration: 2 }, 0.3)
    if (!reduced) tl.to(fx, { travel: 26, duration: 3, ease: 'power3.out' }, 0.2)
    tl.addLabel('progress', 3.45)

    /* ------------------------------------------------- the nine numbers, row by row */
    let t = 3.45
    ROWS.forEach((name, r) => {
      place(r + 1, t)
      const mine = tiles.slice(r * 3, r * 3 + 3)
      const q = (s: string) => mine.flatMap((el) => Array.from(el.querySelectorAll(s)))
      // the row comes up once the charts have cleared its place
      a.rise(mine, t + 0.72, { y: 2.4, stagger: 0.14, duration: 0.85 })
      a.pop(q('.s30-badge'), t + 0.94, { stagger: 0.14, from: 0.3 })
      mine.forEach((tile, i) => {
        a.count(tile.querySelector('.kn-count-n'), t + 0.9 + i * 0.14, { duration: 1.3 })
        a.words(tile.querySelector('.s30-label'), t + 1.2 + i * 0.14, { stagger: 0.035, duration: 0.6 })
      })
      tl.to(fx, { focusY: 0.1 + r * 0.22, glow: 0.24, warm: r % 2 ? 0.14 : -0.08, duration: 1.4, ease: ease.inOut }, t)
      t += 2.6
      tl.addLabel(name, t)
    })

    return tl
  },
}

export default scene
