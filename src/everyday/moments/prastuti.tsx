'use client'

/**
 * Prastuti · प्रस्तुति · 4:00 pm, at the weekly review.
 *
 * SHE SPEAKS IN HINDI, AND THE DECK COMES OUT IN HINDI. AND IT IS A DECK YOU WOULD WANT.
 *
 * The laptop is the ONE picture, and everything of this moment happens inside it.
 *
 * Before   ONE picture: a slide editor late on Sunday night (the clock in its title bar says
 *          so), every formatting button, and an empty slide with a blinking cursor
 * Demo     the laptop opens on Prastuti, set to हिन्दी: the place the deck will appear, and
 *          the voice bar with the one control. The tracker flies out of the name and attaches
 *          itself (it rests there as a small sheet, without a word).
 * Run      she speaks, in Hindi: her words run as a live line in the voice bar, each sentence
 *          with its English beneath. Over it four slides build themselves, large, one on top
 *          of the other, in Hindi: a cover, the branch bars (the lagging one picked out), the
 *          rising line, the three points. The two charts stay longest. Then the voice bar gives
 *          way, and the finished deck is dealt out over the whole screen: the cover, the bars
 *          and the rising line, stamped प्रस्तुति तैयार. That spread is the picture the moment
 *          rests on: the product's name and the language in the bar, three slides, one stamp.
 * Result   nothing is added: the headline is the frame's, and the laptop keeps its spread
 * Stat     a stopwatch that fills to 18 minutes as the number counts; the laptop flies into
 *          the deck at its centre
 *
 * Everything here is Prastuti's own. The name (and its turn into Devanagari), the laptop,
 * the headline, the number, Priya's voice, the hand-over and the touch come from the shared
 * frame.
 *
 * Sizes inside the laptop are in --a, the app's own unit: a 29th of the laptop screen's width
 * (prastuti.css). A slide's own art is in --s, a hundredth of the slide's width.
 *
 * Hindi on screen: always the .prastuti-hi font stack, line-height 1.5 or more, never
 * letter-spaced, never upper-cased, never split below a word for animation, and never inside
 * a box that could cut its matras.
 */

import gsap from 'gsap'
import type { ReactNode } from 'react'
import type { PrastutiProduct, PrastutiSlide } from '../content'
import { splitSentences, TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './prastuti.css'

type P = PartProps<PrastutiProduct>

/** A slide is 100 × 56.25 of its own units (--s): the art below is drawn in them. */
const SLIDE = { w: 100, h: 56.25 }
/** The cover's sun: a disc low on the right, with two orbits round it. */
const SUN = { cx: 84, cy: 50, r: 26, orbit1: 33, orbit2: 41 }
/** The callout on the last point of the line reaches this far (slide units) to the right of the point: it never leaves the slide. */
const CALL_REACH = 7
/** The rising line of the trend slide, inside the slide's box. */
const TREND = { x0: 9, x1: 84, yLow: 48, yHigh: 23.5, floor: 51 }

/** The small level meter beside her words: how high each bar swings while she speaks. */
const WAVE = [0.55, 1, 0.7, 0.9, 0.45]

/** The stopwatch: one hour round. */
const DIAL = { size: 340, c: 170, ring: 114, tickIn: 132, tickOut: 138, tickMajor: 142, num: 157 }

const minutesOf = (value: string) => parseInt(value, 10) || 0
/** Hindi ends a sentence with a danda (।); English with a full stop. */
const sentencesOf = (text: string) => splitSentences(text, '.?!।').filter(Boolean)
/** The slides the finished deck is dealt out with, back to front: the cover, the bars, the rising line. */
const SPREAD: PrastutiSlide['kind'][] = ['title', 'bars', 'trend']
const polar = (r: number, minute: number) => {
  const a = (minute / 60) * Math.PI * 2
  return [DIAL.c + r * Math.sin(a), DIAL.c - r * Math.cos(a)] as const
}
const onOrbit = (r: number, degrees: number) => {
  const a = (degrees / 180) * Math.PI
  return { cx: (SUN.cx + r * Math.cos(a)).toFixed(2), cy: (SUN.cy - r * Math.sin(a)).toFixed(2) }
}
/** The points of the rising line, in slide units. */
const trendPoints = (values: number[]) => {
  const lo = Math.min(...values)
  const hi = Math.max(...values)
  return values.map((v, i) => ({
    x: TREND.x0 + (i * (TREND.x1 - TREND.x0)) / Math.max(1, values.length - 1),
    y: TREND.yLow - ((v - lo) / (hi - lo || 1)) * (TREND.yLow - TREND.yHigh),
  }))
}

/** Hindi, as the deck shows it. */
function Hi({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={className ? `prastuti-hi ${className}` : 'prastuti-hi'} lang="hi">
      {children}
    </span>
  )
}

/** A spreadsheet, drawn: the tracker she attaches. */
function SheetGlyph() {
  return (
    <svg className="prastuti-sheet" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="3.5" width="19" height="17" rx="3.2" fill="#15244b" />
      <path d="M2.5 9.5h19M2.5 15h19M9 9.500v11M15.500 9.500v11" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  )
}

/** A globe, drawn: the language she speaks and the deck comes out in. */
function GlobeGlyph() {
  return (
    <svg className="prastuti-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3.200 3 14.800 0 18M12 3c-3 3.200-3 14.800 0 18" />
    </svg>
  )
}

// ====================================================================== BEFORE
/** ONE picture: a slide editor late on Sunday night. Every formatting button there is, and an empty slide. */
function Before({ product }: P) {
  return (
    <div className="prastuti-b">
      <div className="prastuti-b-win">
        <div className="prastuti-b-top">
          <i />
          <i />
          <i />
          {/* the clock in the title bar: this is being done at night */}
          <span className="prastuti-b-clock">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path className="prastuti-b-moon" d="M20.500 14.200A8.300 8.300 0 0 1 9.800 3.500a8.300 8.300 0 1 0 10.700 10.700z" />
              <circle className="prastuti-b-star" cx="17.200" cy="5.400" r="1.150" />
              <circle className="prastuti-b-star" cx="21" cy="9.300" r="0.800" />
            </svg>
            {product.demo.beforeWhen}
          </span>
        </div>
        <div className="prastuti-b-tools">
          <span className="prastuti-b-font">
            <i />
            <svg viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.500 5 6.500 8 3.500" />
            </svg>
          </span>
          <b className="prastuti-b-tool prastuti-b-tool--b">B</b>
          <b className="prastuti-b-tool prastuti-b-tool--i">I</b>
          <b className="prastuti-b-tool prastuti-b-tool--u">U</b>
          <i className="prastuti-b-sep" />
          {['M2 3h12M2 7h8M2 11h12M2 15h7', 'M2 3h12M4 7h8M2 11h12M5 15h6', 'M2 3h12M6 7h8M2 11h12M7 15h7'].map((d) => (
            <b className="prastuti-b-tool" key={d}>
              <svg viewBox="0 0 16 18" aria-hidden="true">
                <path d={d} />
              </svg>
            </b>
          ))}
          <i className="prastuti-b-sep" />
          <i className="prastuti-b-swatch prastuti-b-swatch--a" />
          <i className="prastuti-b-swatch prastuti-b-swatch--b" />
          <i className="prastuti-b-swatch prastuti-b-swatch--c" />
          <i className="prastuti-b-press" />
        </div>
        <div className="prastuti-b-body">
          <div className="prastuti-b-strip">
            <i className="prastuti-b-thumb prastuti-b-thumb--on" />
            <i className="prastuti-b-thumb" />
            <i className="prastuti-b-thumb" />
          </div>
          <div className="prastuti-b-slide">
            <div className="prastuti-b-ph prastuti-b-ph--title">
              <i className="prastuti-b-cursor" />
              <span>Click to add title</span>
            </div>
            <div className="prastuti-b-ph prastuti-b-ph--body">
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ====================================================================== THE FOUR SLIDES
/** The heading of a chart slide: the Hindi title large, its English as a small caption. */
function Head({ slide }: { slide: PrastutiSlide }) {
  return (
    <div className="prastuti-head">
      <i className="prastuti-head-bar" />
      <Hi className="prastuti-head-t">{slide.title}</Hi>
      <span className="prastuti-head-en">{slide.en}</span>
    </div>
  )
}

/** 1 · The cover: navy, a flame sun low on the right with two orbits, the title in two lines. */
function TitleFace({ slide }: { slide: PrastutiSlide }) {
  return (
    <div className="prastuti-f prastuti-f--title">
      <svg className="prastuti-t-art" viewBox={`0 0 ${SLIDE.w} ${SLIDE.h}`} aria-hidden="true">
        <circle className="prastuti-t-ring prastuti-t-ring--2" cx={SUN.cx} cy={SUN.cy} r={SUN.orbit2} transform={`rotate(150 ${SUN.cx} ${SUN.cy})`} />
        <circle className="prastuti-t-ring" cx={SUN.cx} cy={SUN.cy} r={SUN.orbit1} transform={`rotate(170 ${SUN.cx} ${SUN.cy})`} />
      </svg>
      <i className="prastuti-t-sun" />
      <svg className="prastuti-t-art" viewBox={`0 0 ${SLIDE.w} ${SLIDE.h}`} aria-hidden="true">
        <circle className="prastuti-t-dot prastuti-t-dot--sky" {...onOrbit(SUN.orbit2, 112)} r="1.5" />
        <circle className="prastuti-t-dot" {...onOrbit(SUN.orbit1, 146)} r="1.9" />
      </svg>
      <span className="prastuti-t-en">{slide.en}</span>
      <Hi className="prastuti-t-title">
        {slide.title.split(' ').map((word) => (
          <span key={word}>{word}</span>
        ))}
      </Hi>
      <i className="prastuti-t-rule" />
      <Hi className="prastuti-t-sub">{slide.sub}</Hi>
    </div>
  )
}

/** 2 · The branches as bars. They grow one by one; the one that lags is picked out. */
function BarsFace({ slide }: { slide: PrastutiSlide }) {
  return (
    <div className="prastuti-f prastuti-f--bars">
      <Head slide={slide} />
      <div className="prastuti-bars">
        <i className="prastuti-bars-grid" />
        <i className="prastuti-bars-grid" />
        {(slide.bars ?? []).map((bar, i) => (
          <div className={bar.flag ? 'prastuti-barcol prastuti-barcol--flag' : `prastuti-barcol prastuti-barcol--${i}`} key={bar.label} style={{ ['--v' as string]: bar.value }}>
            {bar.flag ? (
              <i className="prastuti-bar-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7.500 21V4" />
                  <path d="M7.500 5h10l-2.600 3.700 2.600 3.700h-10z" fill="#fff" />
                </svg>
              </i>
            ) : null}
            <i className="prastuti-bar" />
            <Hi className="prastuti-bar-l">{bar.label}</Hi>
          </div>
        ))}
        <i className="prastuti-bars-base" />
      </div>
    </div>
  )
}

/** 3 · The line that draws upward, and the callout on its last point. */
function TrendFace({ slide, copy }: { slide: PrastutiSlide; copy?: boolean }) {
  // the slide is drawn twice (on the canvas, and in the finished spread): each has its own gradient
  const light = copy ? 'prastuti-trend-light-2' : 'prastuti-trend-light'
  const pts = trendPoints(slide.trend ?? [])
  if (!pts.length) return null
  const last = pts[pts.length - 1]
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join('')
  const area = `${line}L${last.x.toFixed(2)} ${TREND.floor}L${pts[0].x.toFixed(2)} ${TREND.floor}z`
  const box = `0 0 ${SLIDE.w} ${SLIDE.h}`
  return (
    <div className="prastuti-f prastuti-f--trend">
      <svg className="prastuti-trend-svg" viewBox={box} aria-hidden="true">
        {[0, 1, 2].map((g) => (
          <path className="prastuti-trend-grid" key={g} d={`M${TREND.x0 - 3} ${TREND.yHigh + g * 9.2}H${TREND.x1 + 8}`} />
        ))}
        <path className="prastuti-trend-floor" d={`M${TREND.x0 - 3} ${TREND.floor}H${TREND.x1 + 8}`} />
      </svg>
      {/* the light under the line: wiped in from the left as the line draws */}
      <div className="prastuti-trend-fill">
        <svg className="prastuti-trend-svg" viewBox={box} aria-hidden="true">
          <defs>
            <linearGradient id={light} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f16443" stopOpacity="0.42" />
              <stop offset="1" stopColor="#f16443" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${light})`} />
        </svg>
      </div>
      <svg className="prastuti-trend-svg" viewBox={box} aria-hidden="true">
        <path className="prastuti-trend-line" d={line} />
        {pts.slice(0, -1).map((p, i) => (
          <circle className="prastuti-trend-dot" key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r="1.25" />
        ))}
        <circle className="prastuti-trend-halo" cx={last.x} cy={last.y.toFixed(2)} r="4.4" />
        <circle className="prastuti-trend-dot prastuti-trend-dot--last" cx={last.x} cy={last.y.toFixed(2)} r="2.1" />
      </svg>
      <Head slide={slide} />
      <div className="prastuti-trend-call" style={{ left: `${last.x + CALL_REACH}%`, top: `${((last.y - 6.2) / SLIDE.h) * 100}%` }}>
        <div className="prastuti-trend-pill">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 18 18 6M9 6h9v9" />
          </svg>
          <Hi>{slide.callout}</Hi>
        </div>
      </div>
    </div>
  )
}

/** The three small glyphs of the points slide: up, lagging, files. */
const POINT_GLYPHS = [
  <path key="up" d="M4 17l5.500-6 4 3.500L20 7M14.500 7H20v5.500" />,
  <g key="flag">
    <path d="M7 21V4" />
    <path d="M7 5h11l-2.800 3.800L18 12.600H7z" />
  </g>,
  <g key="files">
    <path d="M8.500 7.500V4h7l3.500 3.500V17h-3.500" />
    <path d="M5 7.500h7l3.500 3.500V20.500H5z" />
  </g>,
]

/** 4 · What moved: a navy band with the title, and three points with their glyphs. */
function PointsFace({ slide }: { slide: PrastutiSlide }) {
  return (
    <div className="prastuti-f prastuti-f--points">
      <div className="prastuti-p-band">
        <i className="prastuti-p-arc" />
        <i className="prastuti-p-rule" />
        <Hi className="prastuti-p-title">{slide.title}</Hi>
        <span className="prastuti-p-en">{slide.en}</span>
      </div>
      <ul className="prastuti-p-list">
        {(slide.points ?? []).map((pt, i) => (
          <li className="prastuti-p-row" key={pt}>
            <i className={`prastuti-p-tile prastuti-p-tile--${i % POINT_GLYPHS.length}`}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {POINT_GLYPHS[i % POINT_GLYPHS.length]}
              </svg>
            </i>
            <Hi className="prastuti-p-text">{pt}</Hi>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SlideFace({ slide, copy }: { slide: PrastutiSlide; copy?: boolean }) {
  if (slide.kind === 'title') return <TitleFace slide={slide} />
  if (slide.kind === 'bars') return <BarsFace slide={slide} />
  if (slide.kind === 'trend') return <TrendFace slide={slide} copy={copy} />
  return <PointsFace slide={slide} />
}

// ====================================================================== SCREEN
/**
 * Prastuti on her laptop. The bar says two things only: the product's name and the language.
 * Under it one canvas: the place the deck appears, and the voice bar with the one control.
 */
function Screen({ product }: P) {
  const d = product.demo
  const hindi = sentencesOf(d.spoken)
  const english = sentencesOf(d.spokenEn)
  return (
    <div className="prastuti-app">
      <div className="prastuti-appbar">
        <span className="prastuti-appicon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3.5" y="4.5" width="17" height="11.500" rx="2" />
            <path d="M12 16v3.500M8.500 20h7M8 12.500v-2M12 12.500V8.500M16 12.500v-3" />
          </svg>
        </span>
        <span className="prastuti-appname">
          <b>{product.name}</b>
          <Hi>{product.devanagari}</Hi>
        </span>
        {/* the language marker: what she speaks, and what the deck comes out in */}
        <span className="prastuti-lang">
          <GlobeGlyph />
          <Hi>{d.language.native}</Hi>
          <span>{d.language.en}</span>
        </span>
      </div>

      <div className="prastuti-canvas">
        {/* the place the deck will appear */}
        <div className="prastuti-empty" data-ev-solid>
          <span className="prastuti-empty-k">Speak in</span>
          <span className="prastuti-empty-lang">
            <Hi>{d.language.native}</Hi>
            <span>{d.language.en}</span>
          </span>
        </div>

        {/* the slides, as they are built: large, one on top of the other */}
        {d.slides.map((s, i) => (
          <div className={`prastuti-slide prastuti-build prastuti-build--${s.kind}`} style={{ zIndex: 2 + i }} key={s.kind}>
            <SlideFace slide={s} />
          </div>
        ))}

        {/* the voice bar: the one control, and her words as she says them */}
        <div className="prastuti-dock">
          <div className="prastuti-micWrap">
            <TouchControl label={`Talk the week through, in ${d.language.en}`} className="prastuti-mic">
              <span className="prastuti-mic-face">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <g className="prastuti-mic-g--mic">
                    <rect x="9" y="2.500" width="6" height="11.500" rx="3" fill="#fff" stroke="none" />
                    <path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3.500" />
                  </g>
                  <rect className="prastuti-mic-g--stop" x="7" y="7" width="10" height="10" rx="2.400" fill="#fff" stroke="none" />
                </svg>
              </span>
            </TouchControl>
          </div>
          <div className="prastuti-say">
            <div className="prastuti-idle">
              <span className="prastuti-idle-k">Tap to talk</span>
              <span className="prastuti-idle-p">Talk me through your week</span>
            </div>
            {/* the live line: one sentence at a time, in Hindi, with its English beneath */}
            {hindi.map((sentence, i) => (
              <div className="prastuti-line" key={sentence}>
                <p className="prastuti-line-hi prastuti-hi" lang="hi">
                  {sentence.split(' ').map((word, k) => (
                    <span key={k}>
                      {k > 0 ? ' ' : null}
                      <span className="prastuti-w">{word}</span>
                    </span>
                  ))}
                </p>
                <p className="prastuti-line-en">{english[i] ?? ''}</p>
              </div>
            ))}
          </div>
          <div className="prastuti-wave" aria-hidden="true">
            {WAVE.map((_, i) => (
              <i key={i} />
            ))}
          </div>
          {/* the tracker, attached: a small sheet, without a word */}
          <div className="prastuti-attach">
            <i className="prastuti-attach-outline" />
            <div className="prastuti-attach-tile">
              <SheetGlyph />
              <i className="prastuti-attach-sweep" />
            </div>
          </div>
        </div>

        {/* the finished deck, dealt out: the cover and the two charts once more, as real slides */}
        {SPREAD.map((kind, i) => {
          const at = d.slides.findIndex((s) => s.kind === kind)
          return at < 0 ? null : (
            <div className={`prastuti-slide prastuti-out prastuti-out--${kind}`} data-slide={at} style={{ zIndex: 20 + i }} key={kind}>
              <SlideFace slide={d.slides[at]} copy />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** The ONE thing on the laptop at the result: the stamp, on the corner the dealt-out deck leaves free (animate() places it). */
function OnDevice({ product }: P) {
  return (
    <div className="prastuti-stamp">
      <i className="prastuti-stamp-burst" />
      <Hi>{product.demo.ready}</Hi>
      <span>{product.demo.readyEn}</span>
    </div>
  )
}

/** The thing that flies: the tracker, out of the name and into the voice bar. */
function Extras({ product }: P) {
  return (
    <div className="prastuti-file" aria-hidden="true">
      <SheetGlyph />
      {product.demo.file}
    </div>
  )
}

// ====================================================================== STAT
/** A stopwatch, one hour round, that stops at 18 minutes. The deck is at its centre. */
function Stat({ product }: P) {
  const mins = minutesOf(product.stat.value)
  const slides = product.demo.slides
  const cover = slides.find((s) => s.kind === 'title') ?? slides[0]
  return (
    <div className="prastuti-clock">
      <i className="prastuti-clock-shadow" />
      <svg viewBox={`0 0 ${DIAL.size} ${DIAL.size}`} aria-hidden="true">
        <defs>
          <linearGradient id="prastuti-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4714d" />
            <stop offset="1" stopColor="#e24a22" />
          </linearGradient>
        </defs>
        <g className="prastuti-clock-crown">
          <rect x={DIAL.c - 5} y="18" width="10" height="14" rx="2" />
          <rect x={DIAL.c - 12} y="6" width="24" height="14" rx="4.500" />
        </g>
        <circle className="prastuti-clock-face" cx={DIAL.c} cy={DIAL.c} r={DIAL.ring + 13} />
        <circle className="prastuti-clock-track" cx={DIAL.c} cy={DIAL.c} r={DIAL.ring} />
        {Array.from({ length: 60 }, (_, m) => {
          const major = m % 5 === 0
          const [x1, y1] = polar(DIAL.tickIn, m)
          const [x2, y2] = polar(major ? DIAL.tickMajor : DIAL.tickOut, m)
          return <line className={major ? 'prastuti-tick prastuti-tick--major' : 'prastuti-tick'} key={m} x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} />
        })}
        {/* the minutes that were used: each lights as the hand passes it */}
        {Array.from({ length: mins }, (_, i) => {
          const m = i + 1
          const [x1, y1] = polar(DIAL.tickIn, m)
          const [x2, y2] = polar(m % 5 === 0 ? DIAL.tickMajor : DIAL.tickOut, m)
          return <line className="prastuti-tick-lit" key={m} x1={x1.toFixed(2)} y1={y1.toFixed(2)} x2={x2.toFixed(2)} y2={y2.toFixed(2)} />
        })}
        {[15, 30, 45].map((m) => {
          const [x, y] = polar(DIAL.num, m)
          return (
            <text className="prastuti-clock-num" key={m} x={x.toFixed(1)} y={(y + 5.2).toFixed(1)} textAnchor="middle">
              {m}
            </text>
          )
        })}
        <circle className="prastuti-clock-arc" cx={DIAL.c} cy={DIAL.c} r={DIAL.ring} transform={`rotate(-90 ${DIAL.c} ${DIAL.c})`} />
        <g className="prastuti-clock-head">
          <circle cx={DIAL.c} cy={DIAL.c - DIAL.ring} r="11" />
          <circle cx={DIAL.c} cy={DIAL.c - DIAL.ring} r="4.200" />
        </g>
      </svg>

      <div className="prastuti-mini">
        <i className="prastuti-mini-card prastuti-mini-card--3" />
        <i className="prastuti-mini-card prastuti-mini-card--2" />
        <div className="prastuti-mini-card prastuti-mini-card--1">
          <TitleFace slide={cover} />
        </div>
        <i className="prastuti-mini-check">
          <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5.500 12.500 10 17 18.500 7.500" />
          </svg>
        </i>
      </div>

    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<PrastutiProduct>) {
  const { $, $$, U, ease: E, loc, letters, before, demo, run, stat, product } = env
  const inside = <T extends Element = HTMLElement>(root: Element, selector: string) => Array.from(root.querySelectorAll(selector)) as unknown as T[]

  // ---------------------------------------------------------------- before: late on Sunday, and nothing on the slide
  const clock = $('.prastuti-b-clock')
  const moon = $('.prastuti-b-moon')
  const stars = $$('.prastuti-b-star')
  const tools = $$('.prastuti-b-tools > *:not(.prastuti-b-press)')
  const press = $('.prastuti-b-press')
  const pressOn = [$('.prastuti-b-tool--b'), $('.prastuti-b-swatch--b'), $('.prastuti-b-tool--u')]
  const bThumbs = $$('.prastuti-b-thumb')
  const bSlide = $('.prastuti-b-slide')
  const phs = $$('.prastuti-b-ph')
  const cursor = $('.prastuti-b-cursor')
  // she tries one formatting button after another: the highlight hops between them
  const toolsEl = $('.prastuti-b-tools')
  const toolsBox = loc(toolsEl)
  // the picture is drawn enlarged by the frame: the hops are in the toolbar's own pixels
  const drawn = toolsBox.w / (toolsEl.offsetWidth || 1) || 1
  const pressAt = pressOn.map((el) => {
    const b = loc(el)
    return { x: (b.cx - toolsBox.x) / drawn, y: (b.cy - toolsBox.y) / drawn }
  })
  gsap.set(clock, { autoAlpha: 0, scale: 0.7, transformOrigin: '100% 50%' })
  gsap.set(moon, { scale: 0, rotation: -50, transformOrigin: '50% 50%' })
  gsap.set(stars, { scale: 0, transformOrigin: '50% 50%' })
  gsap.set(tools, { autoAlpha: 0, y: 0.5 * U })
  gsap.set(press, { x: pressAt[0].x, y: pressAt[0].y, xPercent: -50, yPercent: -50, scale: 0.4, autoAlpha: 0 })
  gsap.set(bThumbs, { autoAlpha: 0, x: -0.6 * U })
  gsap.set(bSlide, { autoAlpha: 0, scale: 0.95 })
  gsap.set(phs, { autoAlpha: 0 })
  gsap.set(cursor, { autoAlpha: 0 })
  before
    .to(tools, { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.022, ease: 'power2.out' }, 0.2)
    .to(bThumbs, { autoAlpha: 1, x: 0, duration: 0.28, stagger: 0.05 }, 0.24)
    .to(bSlide, { autoAlpha: 1, scale: 1, duration: 0.36, ease: E.snap }, 0.26)
    .to(phs, { autoAlpha: 1, duration: 0.24, stagger: 0.08 }, 0.4)
    .to(cursor, { autoAlpha: 1, duration: 0.1 }, 0.56)
    // the clock in the title bar: it is night
    .to(clock, { autoAlpha: 1, scale: 1, duration: 0.34, ease: 'back.out(2.2)' }, 0.34)
    .to(moon, { scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' }, 0.42)
    .to(stars, { scale: 1, duration: 0.24, stagger: 0.06, ease: 'back.out(3)' }, 0.5)
    // bold, a colour, underline… and still nothing on the slide
    .to(press, { autoAlpha: 1, scale: 1, duration: 0.14, ease: 'back.out(3)' }, 0.44)
    .to(press, { x: pressAt[1].x, y: pressAt[1].y, duration: 0.16, ease: 'power3.inOut' }, 0.56)
    .to(press, { x: pressAt[2].x, y: pressAt[2].y, duration: 0.16, ease: 'power3.inOut' }, 0.68)

  // ---------------------------------------------------------------- the screen, as it is laid out
  // Everything inside the laptop is laid out at its real size (--a), so places are read from the
  // layout itself (offsets inside the canvas), which no enlargement of the laptop changes.
  const canvas = $('.prastuti-canvas')
  /** One app unit, in the canvas's own pixels. */
  const A = canvas.offsetWidth / 29
  const within = (el: HTMLElement) => {
    let x = 0
    let y = 0
    let node: HTMLElement | null = el
    while (node && node !== canvas) {
      x += node.offsetLeft
      y += node.offsetTop
      node = node.offsetParent as HTMLElement | null
    }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight }
  }

  const empty = $('.prastuti-empty')
  const builds = $$('.prastuti-build')
  const outs = $$('.prastuti-out')
  const dock = $('.prastuti-dock')
  const micWrap = $('.prastuti-micWrap')
  const idle = $$('.prastuti-idle > span')
  const attach = $('.prastuti-attach')
  const attachOutline = $('.prastuti-attach-outline')
  const attachTile = $('.prastuti-attach-tile')
  const attachSweep = $('.prastuti-attach-sweep')
  const file = $('.prastuti-file')
  const attachBox = loc(attach)
  const fileBox = { w: file.offsetWidth, h: file.offsetHeight }
  // measured now, while the dealt-out deck still lies where it will rest
  const canvasBox = loc(canvas)
  const outBox = (kind: string) => {
    const el = outs.find((o) => o.classList.contains(`prastuti-out--${kind}`))
    return el ? loc(el) : null
  }
  const barsBox = outBox('bars')
  const trendBox = outBox('trend')

  // ---------------------------------------------------------------- demo: Prastuti, set to Hindi; the tracker attaches itself
  gsap.set(empty, { autoAlpha: 0, scale: 0.95 })
  gsap.set(dock, { autoAlpha: 0, y: 1.6 * A })
  gsap.set(micWrap, { scale: 0 })
  gsap.set(idle, { autoAlpha: 0, x: -0.5 * A })
  gsap.set(attachTile, { autoAlpha: 0, scale: 0.7 })
  gsap.set(attachSweep, { xPercent: -110 })
  // the tracker is born from the first letter of the name and is thrown across into the voice bar
  const born = { x: letters[0].cx, y: letters[0].cy }
  const dropAt = { x: attachBox.cx, y: attachBox.cy }
  const dropOver = { x: born.x + (dropAt.x - born.x) * 0.5, y: Math.min(born.y, dropAt.y) - 7.5 * U }
  gsap.set(file, { x: born.x, y: born.y, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0, rotation: -8 })
  const fileLand = 0.92
  demo
    .to(empty, { autoAlpha: 1, scale: 1, duration: 0.42, ease: E.snap }, 0.44)
    .to(dock, { autoAlpha: 1, y: 0, duration: 0.4, ease: E.snap }, 0.52)
    .to(micWrap, { scale: 1, duration: 0.42, ease: 'back.out(2.4)' }, 0.68)
    .to(idle, { autoAlpha: 1, x: 0, duration: 0.26, stagger: 0.06 }, 0.82)
    .to(file, { scale: 1, autoAlpha: 1, duration: 0.32, ease: 'back.out(2.2)' }, 0.04)
    .to(file, { motionPath: { path: [dropOver, dropAt], curviness: 1.25 }, duration: 0.6, ease: 'power2.inOut' }, fileLand - 0.6)
    .to(file, { rotation: 7, duration: 0.26, ease: 'sine.out' }, fileLand - 0.6)
    .to(file, { rotation: 0, duration: 0.34, ease: 'sine.inOut' }, fileLand - 0.34)
    // it lands, and becomes the small sheet in the voice bar
    .to(file, { scaleX: attachBox.w / fileBox.w, scaleY: attachBox.h / fileBox.h, autoAlpha: 0, duration: 0.18, ease: 'power2.out' }, fileLand - 0.05)
    .to(attachOutline, { autoAlpha: 0, duration: 0.16 }, fileLand - 0.05)
    .to(attachTile, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(2.6)' }, fileLand - 0.05)
  env.bump(demo, fileLand - 0.05)

  // ---------------------------------------------------------------- run: she speaks in Hindi, and the deck builds itself in Hindi
  const mic = $('.prastuti-mic-face')
  const micGlyph = $('.prastuti-mic-g--mic')
  const stopGlyph = $('.prastuti-mic-g--stop')
  const wave = $('.prastuti-wave')
  const waveBars = $$('.prastuti-wave i')
  const lines = $$('.prastuti-line')
  const stamp = $('.prastuti-stamp')
  const burst = $('.prastuti-stamp-burst')
  const kinds = product.demo.slides.map((s) => s.kind)

  gsap.set(stopGlyph, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
  gsap.set(micGlyph, { transformOrigin: '50% 50%' })
  gsap.set(wave, { autoAlpha: 0 })
  gsap.set(waveBars, { scaleY: 0.2 })

  // WHEN. Each slide arrives on the canvas, builds itself, and is covered by the next. The two
  // charts are the picture the visitor came for: they stay longest. The cover and the three
  // points pass quickly (the cover is seen again in the finished spread).
  const WORD = 0.04
  const firstWords = lines[0] ? inside(lines[0], '.prastuti-w').length : 0
  const firstSaid = 0.1 + firstWords * WORD
  const STAY: Record<PrastutiSlide['kind'], number> = { title: 0.28, bars: 0.68, trend: 0.68, points: 0.26 }
  const arrivals: number[] = []
  let tG = firstSaid
  builds.forEach((_, i) => {
    arrivals.push(tG)
    tG += STAY[kinds[i] ?? 'points']
  })
  // (tG: the last slide is built; the voice bar gives way and the deck is dealt out)

  // WHERE. A slide is built at its full size. When the next one arrives it steps back, up and to
  // the left, so the deck is seen growing as a pile: `back` is how many slides lie on top of it.
  const pile = (back: number) => ({ x: -1.15 * A * back, y: -0.36 * A * back, scale: 1 - 0.035 * back })
  gsap.set(builds, { transformOrigin: '0 0', autoAlpha: 0, x: 1.3 * A, y: 0.9 * A, scale: 0.95 })

  run
    // the touch: she starts to talk
    .to(mic, { scale: 0.84, duration: 0.08, ease: 'power2.in' }, 0)
    .to(mic, { scale: 1, duration: 0.4, ease: 'back.out(3.2)' }, 0.08)
    .to(micGlyph, { autoAlpha: 0, scale: 0.4, duration: 0.16, ease: 'power2.in' }, 0.03)
    .to(stopGlyph, { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'back.out(2.4)' }, 0.14)
    .to(idle, { autoAlpha: 0, y: -0.5 * A, duration: 0.14, stagger: 0.03, ease: 'power2.in' }, 0)
    .to(wave, { autoAlpha: 1, duration: 0.2 }, 0.06)
    // the canvas keeps saying which language until the first slide is on its way
    .to(empty, { autoAlpha: 0, scale: 0.97, duration: 0.16, ease: 'power1.in' }, firstSaid - 0.1)
  waveBars.forEach((b, i) => {
    run.to(b, { scaleY: WAVE[i % WAVE.length], duration: 0.13, repeat: 11, yoyo: true, ease: 'sine.inOut' }, 0.08 + i * 0.03)
  })

  // HER WORDS: the live line in the voice bar. One sentence at a time, whole words at a time,
  // its English beneath as she finishes it; it lifts away as the next one begins.
  const saidAt = lines.map((_, i) => (i === 0 ? 0.1 : (arrivals[i] ?? tG) + 0.04))
  lines.forEach((line, i) => {
    const words = inside(line, '.prastuti-w')
    const gloss = inside(line, '.prastuti-line-en')
    const at = saidAt[i]
    const until = saidAt[i + 1] ?? tG
    gsap.set(line, { autoAlpha: 0 })
    gsap.set(words, { autoAlpha: 0, y: 0.45 * A })
    gsap.set(gloss, { autoAlpha: 0, y: 0.3 * A })
    run.to(line, { autoAlpha: 1, duration: 0.01, ease: 'none' }, at)
    words.forEach((w, k) => {
      run.to(w, { autoAlpha: 1, y: 0, duration: 0.22, ease: 'power2.out' }, at + k * WORD)
    })
    run
      .to(gloss, { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' }, at + Math.min(words.length * WORD, 0.3))
      .to(line, { autoAlpha: 0, y: -0.7 * A, duration: 0.14, ease: 'power2.in' }, until - 0.14)
  })

  // THE SLIDES
  builds.forEach((slide, i) => {
    const at = arrivals[i]
    run.to(slide, { autoAlpha: 1, duration: 0.12, ease: 'none' }, at).to(slide, { x: 0, y: 0, scale: 1, duration: 0.3, ease: E.snap }, at)
    // the slides already built step back, one place each
    builds.slice(0, i).forEach((older, j) => {
      run.to(older, { ...pile(i - j), duration: 0.3, ease: E.inOut }, at)
    })
    const kind = kinds[i]

    if (kind === 'title') {
      // 1 · the cover: the sun comes up, its orbits draw, the title rises in two lines
      const sun = inside(slide, '.prastuti-t-sun')
      const orbits = inside<SVGCircleElement>(slide, '.prastuti-t-ring')
      const moons = inside<SVGCircleElement>(slide, '.prastuti-t-dot')
      const caption = inside(slide, '.prastuti-t-en')
      const titleLines = inside(slide, '.prastuti-t-title > span')
      const rule = inside(slide, '.prastuti-t-rule')
      const sub = inside(slide, '.prastuti-t-sub')
      gsap.set(sun, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(orbits, { drawSVG: '0%' })
      gsap.set(moons, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set([caption, sub], { autoAlpha: 0, x: -0.5 * A })
      gsap.set(titleLines, { autoAlpha: 0, y: 0.7 * A })
      gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' })
      run
        .to(sun, { scale: 1, duration: 0.24, ease: 'back.out(1.5)' }, at + 0.02)
        .to(orbits, { drawSVG: '100%', duration: 0.2, stagger: 0.03, ease: 'power2.out' }, at + 0.04)
        .to(moons, { scale: 1, duration: 0.12, stagger: 0.03, ease: 'back.out(3)' }, at + 0.14)
        .to(caption, { autoAlpha: 1, x: 0, duration: 0.14 }, at + 0.03)
        .to(titleLines, { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.04, ease: 'power3.out' }, at + 0.04)
        .to(rule, { scaleX: 1, duration: 0.12, ease: 'power2.out' }, at + 0.12)
        .to(sub, { autoAlpha: 1, x: 0, duration: 0.12 }, at + 0.14)
      return
    }

    // the heading of a chart slide
    const headBar = inside(slide, '.prastuti-head-bar')
    const headText = inside(slide, '.prastuti-head-t, .prastuti-head-en')
    if (headBar.length) {
      gsap.set(headBar, { scaleY: 0, transformOrigin: '50% 0%' })
      gsap.set(headText, { autoAlpha: 0, x: -0.5 * A })
      run.to(headBar, { scaleY: 1, duration: 0.22, ease: 'power2.out' }, at + 0.04).to(headText, { autoAlpha: 1, x: 0, duration: 0.24, stagger: 0.05 }, at + 0.06)
    }

    if (kind === 'bars') {
      // 2 · the tracker is read (its sheet in the voice bar lights); the branches stand up one by one; the one that lags is flagged
      run
        .to(attachSweep, { xPercent: 110, duration: 0.44, ease: 'power2.inOut' }, at - 0.04)
        .to(attachTile, { scale: 1.16, duration: 0.14, ease: 'power2.out' }, at - 0.02)
        .to(attachTile, { scale: 1, duration: 0.3, ease: 'back.out(2.4)' }, at + 0.12)
      const base = inside(slide, '.prastuti-bars-base')
      const grid = inside(slide, '.prastuti-bars-grid')
      const bars = inside(slide, '.prastuti-bar')
      const labels = inside(slide, '.prastuti-bar-l')
      const mark = inside(slide, '.prastuti-bar-mark')
      gsap.set(base, { scaleX: 0, transformOrigin: '0 50%' })
      gsap.set(grid, { autoAlpha: 0 })
      gsap.set(bars, { scaleY: 0, transformOrigin: '50% 100%' })
      gsap.set(labels, { autoAlpha: 0, y: 0.3 * A })
      gsap.set(mark, { scale: 0, y: 0.5 * A, transformOrigin: '50% 100%' })
      run
        .to(base, { scaleX: 1, duration: 0.22, ease: 'power2.out' }, at + 0.04)
        .to(grid, { autoAlpha: 1, duration: 0.22 }, at + 0.08)
        .to(bars, { scaleY: 1, duration: 0.34, stagger: 0.07, ease: 'back.out(1.7)' }, at + 0.08)
        .to(labels, { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.07 }, at + 0.13)
        .to(mark, { scale: 1, y: 0, duration: 0.2, ease: 'back.out(3)' }, at + 0.44)
    } else if (kind === 'trend') {
      // 3 · the line draws upward, the light follows under it, and the last point is called out
      const line = inside<SVGPathElement>(slide, '.prastuti-trend-line')
      const fill = inside(slide, '.prastuti-trend-fill')
      const dots = inside<SVGCircleElement>(slide, '.prastuti-trend-dot')
      const halo = inside<SVGCircleElement>(slide, '.prastuti-trend-halo')
      const grid = inside<SVGPathElement>(slide, '.prastuti-trend-grid, .prastuti-trend-floor')
      const pill = inside(slide, '.prastuti-trend-pill')
      const drawAt = at + 0.07
      const drawFor = 0.42
      gsap.set(line, { drawSVG: '0%' })
      gsap.set(fill, { clipPath: 'inset(0% 100% 0% 0%)' })
      gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(halo, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(grid, { autoAlpha: 0 })
      gsap.set(pill, { autoAlpha: 0, scale: 0.5, y: 0.6 * A, transformOrigin: '80% 100%' })
      run
        .to(grid, { autoAlpha: 1, duration: 0.24, stagger: 0.03 }, at + 0.06)
        .to(line, { drawSVG: '100%', duration: drawFor, ease: 'power1.inOut' }, drawAt)
        .to(fill, { clipPath: 'inset(0% 0% 0% 0%)', duration: drawFor, ease: 'power1.inOut' }, drawAt)
        .to(halo, { scale: 1, duration: 0.24, ease: 'back.out(2.4)' }, drawAt + drawFor - 0.06)
        .to(pill, { autoAlpha: 1, duration: 0.1, ease: 'none' }, drawAt + drawFor - 0.06)
        .to(pill, { scale: 1, y: 0, duration: 0.22, ease: 'back.out(2.6)' }, drawAt + drawFor - 0.06)
      dots.forEach((dot, k) => {
        run.to(dot, { scale: 1, duration: 0.18, ease: 'back.out(3)' }, drawAt + (drawFor * k) / Math.max(1, dots.length - 1) - 0.02)
      })
    } else {
      // 4 · the band slides in with its title; the three points arrive with their glyphs
      const band = inside(slide, '.prastuti-p-band')
      const bandBits = inside(slide, '.prastuti-p-title, .prastuti-p-en')
      const rule = inside(slide, '.prastuti-p-rule')
      const arc = inside(slide, '.prastuti-p-arc')
      const tiles = inside(slide, '.prastuti-p-tile')
      const texts = inside(slide, '.prastuti-p-text')
      gsap.set(band, { xPercent: -101 })
      gsap.set(bandBits, { autoAlpha: 0, y: 0.5 * A })
      gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' })
      gsap.set(arc, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(tiles, { scale: 0 })
      gsap.set(texts, { autoAlpha: 0, x: -0.6 * A })
      run
        .to(band, { xPercent: 0, duration: 0.18, ease: 'power3.out' }, at + 0.02)
        .to(arc, { scale: 1, duration: 0.2, ease: 'back.out(1.6)' }, at + 0.05)
        .to(rule, { scaleX: 1, duration: 0.12, ease: 'power2.out' }, at + 0.06)
        .to(bandBits, { autoAlpha: 1, y: 0, duration: 0.14, stagger: 0.03, ease: 'power3.out' }, at + 0.06)
        .to(tiles, { scale: 1, duration: 0.14, stagger: 0.03, ease: 'back.out(2.6)' }, at + 0.07)
        .to(texts, { autoAlpha: 1, x: 0, duration: 0.12, stagger: 0.03 }, at + 0.09)
    }
  })

  // THE DECK IS FINISHED, and it is dealt out, not closed. Her words and the voice bar have done
  // their work: they give way (the bar sinks out of the screen), and the cover and the two charts
  // come out of the pile and lie over the whole canvas. That spread is what the moment rests on.
  const last = builds.length - 1
  const stage0 = builds[0] ? within(builds[0]) : { x: 0, y: 0, w: 1, h: 1 }
  run
    .to(dock, { y: 4.4 * A, autoAlpha: 0, duration: 0.26, ease: 'power2.in' }, tG - 0.02)
    .to(wave, { autoAlpha: 0, duration: 0.12 }, tG - 0.02)
  outs.forEach((out, i) => {
    const from = Number(out.dataset.slide) || 0
    const home = within(out)
    const p = pile(last - from)
    // it starts exactly where its slide lies in the pile…
    const start = {
      x: stage0.x + p.x - home.x,
      y: stage0.y + p.y - home.y,
      scale: (stage0.w * p.scale) / (home.w || 1),
    }
    gsap.set(out, { transformOrigin: '0 0', ...start, autoAlpha: 0 })
    const leave = tG + i * 0.035
    run
      .to(out, { autoAlpha: 1, duration: 0.05, ease: 'none' }, leave)
      .to(builds[from], { autoAlpha: 0, duration: 0.05, ease: 'none' }, leave + 0.03)
      // …and is dealt to its own place
      .to(out, { x: 0, y: 0, scale: 1, duration: 0.36, ease: E.inOut }, leave)
  })
  // the slides that are not in the spread (the three points) go under the others as they are dealt
  builds.forEach((slide, i) => {
    if (outs.some((out) => Number(out.dataset.slide) === i)) return
    run.to(slide, { autoAlpha: 0, scale: 0.9, y: 0.8 * A, duration: 0.2, ease: 'power2.in' }, tG)
  })

  // प्रस्तुति तैयार: the ONE thing on the laptop. It comes down on the corner the spread leaves free
  // (low on the right: right of the bars, under the rising line). It lives on the laptop, not in
  // its screen, so that place is worked out in the laptop's own pixels.
  const onDevice = stamp.parentElement as HTMLElement
  const deviceBox = loc(onDevice)
  const perStage = deviceBox.w / (onDevice.offsetWidth || 1) || 1
  const right = canvasBox.x + canvasBox.w
  const foot = canvasBox.y + canvasBox.h
  const free = {
    x: barsBox ? (barsBox.x + barsBox.w + right) / 2 : canvasBox.cx,
    y: trendBox ? (trendBox.y + trendBox.h + foot) / 2 : canvasBox.cy,
  }
  const stampAt = { x: (free.x - deviceBox.x) / perStage, y: (free.y - deviceBox.y) / perStage }
  gsap.set(stamp, { x: stampAt.x, y: stampAt.y, xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 2.3, rotation: -22, transformOrigin: '80% 50%' })
  gsap.set(burst, { autoAlpha: 0 })
  const hit = tG + 0.4
  run
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.22)
    .to(stamp, { scale: 1, rotation: -6, duration: 0.22, ease: E.slam }, hit - 0.22)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.6, autoAlpha: 0, duration: 0.13, ease: 'power2.out' }, hit + 0.01)

  // ---------------------------------------------------------------- result: nothing of Prastuti's is added, and nothing is left to clear.
  // (The voice bar and her words left as the deck was dealt out; the laptop rests on its spread
  // and its one stamp. The headline is the frame's.)

  // ---------------------------------------------------------------- stat: the stopwatch stops at 18 minutes
  const mins = minutesOf(product.stat.value)
  const crown = $('.prastuti-clock-crown')
  const face = $('.prastuti-clock-face')
  const shadow = $('.prastuti-clock-shadow')
  const track = $('.prastuti-clock-track')
  const arc = $('.prastuti-clock-arc')
  const head = $('.prastuti-clock-head')
  const ticks = $$('.prastuti-tick')
  const lit = $$('.prastuti-tick-lit')
  const clockNums = $$('.prastuti-clock-num')
  const mini = $('.prastuti-mini')
  const miniFront = $('.prastuti-mini-card--1')
  const miniBacks = [$('.prastuti-mini-card--2'), $('.prastuti-mini-card--3')]
  const miniCheck = $('.prastuti-mini-check')
  const miniW = mini.offsetWidth
  const centre = `${DIAL.c} ${DIAL.c}`
  // the number counts from 0.35 for 0.95 s on power2.out: the hand keeps exactly that time
  const COUNT = { at: 0.35, dur: 0.95, ease: 'power2.out' }
  const minuteAt = (m: number) => COUNT.at + COUNT.dur * (1 - Math.sqrt(1 - m / mins))

  gsap.set([face, track], { scale: 0.86, autoAlpha: 0, svgOrigin: centre })
  gsap.set(shadow, { autoAlpha: 0 })
  gsap.set(crown, { y: 14, autoAlpha: 0 })
  gsap.set([ticks, lit], { autoAlpha: 0 })
  gsap.set(clockNums, { autoAlpha: 0 })
  gsap.set(arc, { drawSVG: '0% 0%' })
  gsap.set(head, { rotation: 0, svgOrigin: centre, autoAlpha: 0 })
  gsap.set(mini, { autoAlpha: 0 })
  gsap.set(miniBacks, { x: 0, y: 0, rotation: 0 })
  gsap.set(miniCheck, { scale: 0 })
  stat
    // the stamp has been read: it lifts off the laptop before the laptop flies into the stopwatch
    .to(stamp, { autoAlpha: 0, scale: 0.8, duration: 0.2, ease: 'power2.in' }, 0)
    .to([face, track], { scale: 1, autoAlpha: 1, duration: 0.5, ease: E.snap }, 0.2)
    .to(shadow, { autoAlpha: 1, duration: 0.4 }, 0.3)
    .to(crown, { y: 0, autoAlpha: 1, duration: 0.3, ease: 'back.out(2.4)' }, 0.42)
    .to(ticks, { autoAlpha: 1, duration: 0.2, stagger: 0.006 }, 0.3)
    .to(clockNums, { autoAlpha: 1, duration: 0.3, stagger: 0.06 }, 0.44)
    // the hand runs with the number
    .to(head, { autoAlpha: 1, duration: 0.1 }, COUNT.at)
    .to(arc, { drawSVG: `0% ${(mins / 60) * 100}%`, duration: COUNT.dur, ease: COUNT.ease }, COUNT.at)
    .to(head, { rotation: (mins / 60) * 360, duration: COUNT.dur, ease: COUNT.ease }, COUNT.at)
    // it presses the crown: stopped
    .to(crown, { y: 5, duration: 0.07, ease: 'power2.in' }, COUNT.at + COUNT.dur - 0.06)
    .to(crown, { y: 0, duration: 0.2, ease: 'back.out(3)' }, COUNT.at + COUNT.dur + 0.01)
    .to(head, { scale: 1.28, duration: 0.1, ease: 'power2.out' }, COUNT.at + COUNT.dur - 0.06)
    .to(head, { scale: 1, duration: 0.16, ease: 'power2.inOut' }, COUNT.at + COUNT.dur + 0.04)
    // the laptop has become the deck at the centre
    .to(mini, { autoAlpha: 1, duration: 0.14, ease: 'none' }, 0.72)
    .to(miniBacks[0], { x: 0.05 * miniW, y: -0.045 * miniW, rotation: 2, duration: 0.4, ease: E.snap }, 0.86)
    .to(miniBacks[1], { x: 0.1 * miniW, y: -0.085 * miniW, rotation: 4, duration: 0.4, ease: E.snap }, 0.9)
    .to(miniCheck, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 1.16)
  // each minute mark lights as the hand passes it
  lit.forEach((tick, i) => {
    stat.to(tick, { autoAlpha: 1, duration: 0.08, ease: 'none' }, minuteAt(i + 1))
  })

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: miniFront }
}

const prastuti: MomentModule<PrastutiProduct> = {
  key: 'prastuti',
  device: 'laptop',
  highlight: 'builds the deck, in Hindi',
  Before,
  Screen,
  Stat,
  Extras,
  OnDevice,
  animate,
}

export default prastuti
