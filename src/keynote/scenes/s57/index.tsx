'use client'

/**
 * Slide 57 · "AI usage increased 20x … Cost per token down 46%"
 *
 * THE IDEA. The scissor: usage soars, the cost of a token falls, over the same eight quarters.
 * First the stage belongs to usage alone: one chart in the middle, whose bars are not drawn but
 * FILLED. Every bar is a column of token blocks raining in from above, a handful for FY25-Q3, a
 * downpour for FY27-Q2, each column ending flat at its exact value, while "20x" counts from 1.
 * Then the chart moves aside and the other blade arrives: over the same quarters the blue line
 * draws, bumps up to $1.48, and falls under the level it started from (a quiet dotted line holds
 * that level), while "46%" counts. Then what that was worth: ~ ₹6 Cr.
 *
 *   usage   headline; the token chart, alone and centred; the tokens rain into eight columns; 20x
 *   cost    the chart moves left; the cost chart arrives and its line draws; 46%
 *   saved   ~ ₹6 Cr; the footnote
 *
 * The blocks are three.js (tokens.ts, instanced, with depth). Without WebGL plain bars grow instead.
 */

import gsap from 'gsap'
import type { CSSProperties, ReactNode } from 'react'
import { anim, Card, Count, Headline, LineChart, type SceneModule } from '../../kit'
import { ICONS } from '../s56/icons'
import { BAR_W, BASE_Y, CENTRE, COST, COST_PRINTED, COST_TITLE, FOOTNOTE, PLOT_W, PLOT_X, QUARTERS, STAT_CENTRE, STATS, TOKENS, TOKENS_TITLE, barH, barX } from './data'
import { makeTokens, type TokenField } from './tokens'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${n})`

const Arrow = () => (
  <svg className="s57-arrow" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 6h19M16 1.5 21 6l-5 4.5" />
  </svg>
)

const NUMBERS: Record<string, ReactNode> = {
  // t38 "20x", t40 "46%", t42 "~ ₹6 Cr"
  usage: <Count className="s57-n" to={20} from={1} suffix="x" />,
  cost: <Count className="s57-n" to={46} suffix="%" />,
  saved: <span className="s57-n">~ ₹6 Cr</span>,
}

// where the kit's LineChart puts a value (its own arithmetic, for the dashed level of the start)
const LC = { W: 410, H: 186, type: 12 }
const lcLeft = LC.type * (0.9 + 0.55) + LC.type * 1.1
const lcX = (i: number) => lcLeft + LC.type * 1.3 + ((LC.W - lcLeft - LC.type * 1.3 - LC.type * 1.6) * i) / (COST.length - 1)
const lcY = (v: number) => LC.type * 2 + (LC.H - LC.type * 2 - LC.type * 1.9) * (1 - v / 1.6)

const scene: SceneModule = {
  beats: ['usage', 'cost', 'saved'],

  Scene: ({ slide }) => (
    <div className="s57">
      <Headline text={slide.title} flame={['AI usage increased 20x', 'Cost per token down 46%']} />

      <Card className="s57-panel s57-panel--cost">
        <h3 className="s57-ptitle">{COST_TITLE}</h3>
        <LineChart
          className="s57-cost"
          width={LC.W / 10}
          height={LC.H / 10}
          type={LC.type}
          min={0}
          max={1.6}
          area
          ticks={[0]}
          labels={QUARTERS}
          series={[{ color: 'azure', values: COST, texts: COST_PRINTED }]}
        >
          <line className="s57-level" x1={lcX(0)} y1={lcY(COST[0])} x2={lcX(7) + 8} y2={lcY(COST[0])} />
        </LineChart>
      </Card>

      {/* the token chart: card, axis, quarters, figures in the DOM; the bars are the blocks. One wrapper: it stands centred first */}
      <div className="s57-tok">
        <Card className="s57-panel s57-panel--tokens">
          <h3 className="s57-ptitle">{TOKENS_TITLE}</h3>
        </Card>
        <span
          className="s57-axis"
          style={{
            left: u(PLOT_X - 0.6),
            width: u(PLOT_W + 1.2),
            top: u(BASE_Y + 0.12),
          }}
        />
        {TOKENS.map((v, i) => (
          <div className="s57-col" key={i} style={{ left: u(barX(i)) } as CSSProperties}>
            <span
              className="s57-fbar"
              style={{
                top: u(BASE_Y - barH(v)),
                height: u(barH(v)),
                width: u(BAR_W),
                marginLeft: u(-BAR_W / 2),
              }}
            />
            <b className="s57-val" style={{ top: u(BASE_Y - barH(v) - 1.75) }}>
              {v}
            </b>
            <span className="s57-q" style={{ top: u(BASE_Y + 0.75) }}>
              {QUARTERS[i]}
            </span>
          </div>
        ))}
      </div>

      {STATS.map((s) => (
        <div className={`s57-slot s57-slot--${s.key}`} key={s.key}>
          <Card className={`s57-stat s57-stat--${s.key}`}>
            <span className="s57-disc">{ICONS[s.icon]}</span>
            <div className="s57-stxt">
              <p className="s57-top">
                <b className="s57-num">{NUMBERS[s.key]}</b>
                <span className={`s57-sub s57-sub--${s.sub.length}`}>
                  {s.sub.length === 2 ? (
                    <>
                      {s.sub[0]}
                      <Arrow />
                      {s.sub[1]}
                    </>
                  ) : (
                    s.sub[0]
                  )}
                </span>
              </p>
              <p className="s57-sline">{s.line}</p>
            </div>
          </Card>
        </div>
      ))}

      <p className="s57-foot">{FOOTNOTE}</p>
    </div>
  ),

  three(ctx) {
    const field = makeTokens(ctx)
    ctx.bag.field = field
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      field.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const field = ctx.bag.field as TokenField | undefined
    const vals = ctx.$$('.s57-val')
    const fbars = ctx.$$('.s57-fbar')
    const q = (sel: string) => ctx.$$(`.s57-cost ${sel}`)
    const tok = ctx.$('.s57-tok')
    const slot = ctx.$('.s57-slot--usage')

    // usage has the stage to itself first: its chart and its figure stand in the middle
    gsap.set(tok, { x: CENTRE * U })
    gsap.set(slot, { x: STAT_CENTRE * U })
    if (field) field.state.shift = CENTRE

    /* ---------------------------------------------------------------- usage */
    a.words('.kn-h', 0.1)
    a.rise('.s57-panel--tokens', 0.55)
    a.rule('.s57-axis', 1.0, { duration: 0.7 })
    a.fade('.s57-q', 1.05, { stagger: 0.04, duration: 0.4 })
    gsap.set(vals, { autoAlpha: 0, y: U * 0.6 })
    gsap.set(fbars, { scaleY: 0, transformOrigin: '50% 100%' })
    tl.to(fx, { glow: 0.32, focusX: 0, focusY: 0.1, warm: 0.3, duration: 1.6 }, 0.6)

    // the rain: a handful, then more, then a downpour
    let t = 1.35
    const landed: number[] = []
    TOKENS.forEach((v, i) => {
      const dur = 0.75 + (v / 476) * 1.1
      if (field) {
        field.p[i] = reduced ? 1 : 0
        if (!reduced) tl.to(field.p, { [i]: 1, duration: dur, ease: 'none' }, t)
      } else {
        tl.to(fbars[i], { scaleY: 1, duration: dur, ease: ease.out }, t)
      }
      landed.push(t + dur)
      tl.to(vals[i], { autoAlpha: 1, y: 0, duration: 0.45, ease: ease.out }, t + dur - 0.3)
      t += 0.2 + (v / 476) * 0.22
    })
    const first = landed[0]
    const up = Math.max(...landed)
    if (field) {
      field.state.sheen = 0
      tl.to(field.state, { sheen: 1, duration: 1.1, ease: 'power1.inOut' }, up - 0.2)
    }
    // the figure arrives with the first column and counts from 1x while the rest come down;
    // "23 bn → 476 bn" is true once the last column stands
    a.rise('.s57-stat--usage', first - 0.45)
    a.count('.s57-stat--usage .s57-n', first, {
      duration: up - first,
      ease: 'power1.in',
    })
    a.fade('.s57-stat--usage .s57-sub', up - 0.35, { duration: 0.5 })
    const C = up + 0.9
    tl.addLabel('usage', C)

    /* ----------------------------------------------------------------- cost */
    // the token chart and its figure move aside: the same eight quarters arrive on the right
    const aside = { duration: 0.95, ease: ease.inOut }
    tl.to(tok, { x: 0, ...aside }, C)
    tl.to(slot, { x: 0, ...aside }, C)
    if (field) tl.to(field.state, { shift: 0, ...aside }, C)
    a.rise('.s57-panel--cost', C + 0.4, { x: 2.4, y: 0 })
    const LN = C + 0.9
    a.line('.s57-cost', LN)
    // the area under the line opens with the line, from the left (the kit fades it in whole, later)
    const area = q('.kn-line-area')
    if (area.length && !reduced) {
      gsap.set(area, { clipPath: 'inset(0% 100% 0% 0%)' })
      tl.to(area, { autoAlpha: 1, duration: 0.2 }, LN + 0.2)
      tl.to(area, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power1.inOut' }, LN + 0.2)
    }
    // (a dotted line: it opens by scale, drawSVG would take its dots)
    gsap.set(ctx.$('.s57-level'), { scaleX: 0, transformOrigin: '0% 50%' })
    tl.to(ctx.$('.s57-level'), { scaleX: 1, duration: 1.4, ease: 'power1.inOut' }, LN + 0.2)
    a.rise('.s57-stat--cost', LN + 0.5)
    a.count('.s57-stat--cost .s57-n', LN + 0.5, { duration: 1.7 })
    tl.to(fx, { focusX: 0.5, warm: -0.25, glow: 0.3, duration: 1.6, ease: ease.inOut }, C)
    tl.addLabel('cost', LN + 2.4)

    /* ---------------------------------------------------------------- saved */
    const S = LN + 2.4
    a.rise('.s57-stat--saved', S)
    a.fade('.s57-foot', S + 0.5, { duration: 0.7 })
    tl.to(fx, { focusX: 0.55, focusY: 0.6, warm: 0.1, duration: 1.4, ease: ease.inOut }, S)
    tl.addLabel('saved', S + 1.3)
    return tl
  },
}

export default scene
