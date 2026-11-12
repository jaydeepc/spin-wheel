'use client'

/**
 * Prastuti · प्रस्तुति · 4:00 pm, at the weekly review.
 *
 * SHE SPEAKS IN HINDI, AND THE DECK COMES OUT IN HINDI. AND IT IS A DECK YOU WOULD WANT.
 *
 * Before   Sunday, 11 pm: a slide editor, every formatting button, and an empty slide
 *          with a blinking cursor
 * Demo     the laptop opens on Prastuti, set to हिन्दी: four empty places in the filmstrip,
 *          an empty slide that says where the deck will appear; the tracker file flies out
 *          of the name and attaches itself
 * Run      she speaks, in Hindi (her words under the photo, each sentence with its English
 *          beneath). Four slides build themselves on the big canvas, one after another, in
 *          Hindi: a cover, the branch bars (the lagging one picked out), the rising line,
 *          the three points. Each takes its place in the filmstrip. Then the deck gathers,
 *          cover on top, stamped प्रस्तुति तैयार.
 * Result   Sunday, 11 pm, struck through, becomes प्रस्तुति तैयार
 * Stat     a stopwatch that fills to 18 minutes as the number counts; the laptop flies
 *          into the deck at its centre
 *
 * Everything here is Prastuti's own. The name (and its turn into Devanagari), the laptop,
 * the photo, the headline, the number, the hand-over and the touch invitation come from
 * the shared frame.
 *
 * Hindi on screen: always the .prastuti-hi font stack, line-height 1.5 or more, never
 * letter-spaced, never upper-cased, and never split below a word for animation.
 */

import gsap from 'gsap'
import type { ReactNode } from 'react'
import { PRIYA, productByKey, type PrastutiProduct, type PrastutiSlide } from '../content'
import { TouchControl } from './parts'
import type { MomentEnv, MomentModule, PartProps } from './types'
import './prastuti.css'

type P = PartProps<PrastutiProduct>
const PRASTUTI = productByKey('prastuti') as PrastutiProduct

/** A slide is 100 × 56.25 of its own units (--s): the art below is drawn in them. */
const SLIDE = { w: 100, h: 56.25 }
/** The cover's sun: a disc low on the right, with two orbits round it. */
const SUN = { cx: 84, cy: 50, r: 26, orbit1: 33, orbit2: 41 }
/** The rising line of the trend slide, inside the slide's box. */
const TREND = { x0: 9, x1: 84, yLow: 48, yHigh: 23.5, floor: 51 }

const WAVE = [0.4, 0.8, 0.55, 1, 0.35, 0.7, 0.95, 0.45, 0.6, 0.9, 0.3, 0.75, 1, 0.5, 0.85, 0.4, 0.65, 0.95, 0.35, 0.8, 0.55, 1, 0.45, 0.7, 0.9, 0.38]

/** The stopwatch: one hour round. */
const DIAL = { size: 340, c: 170, ring: 114, tickIn: 132, tickOut: 138, tickMajor: 142, num: 157 }

const minutesOf = (value: string) => parseInt(value, 10) || 0
/** Hindi ends a sentence with a danda (।); English with a full stop. */
const sentencesOf = (text: string) => text.split(/(?<=[।.?!])\s+/).filter(Boolean)
const bare = (word: string) => word.normalize('NFC').replace(/[।.,!?]/g, '')
/**
 * The words of a sentence that the deck uses as they were said: the longest run of two or
 * more of her words found on a slide. Returns [from, to) in words; [0, 0] if there is none.
 */
const keyRun = (words: string[], deckTexts: string[]): [number, number] => {
  let best: [number, number] = [0, 0]
  for (let from = 0; from < words.length; from++) {
    for (let to = words.length; to > from + 1 && to - from > best[1] - best[0]; to--) {
      const phrase = words.slice(from, to).map(bare).join(' ')
      if (deckTexts.some((text) => text.normalize('NFC').includes(phrase))) {
        best = [from, to]
        break
      }
    }
  }
  return best
}
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

function MicGlyph({ colour }: { colour: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={colour} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="2.500" width="6" height="11.500" rx="3" fill={colour} stroke="none" />
      <path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3.500" />
    </svg>
  )
}

// ====================================================================== BEFORE
/** Sunday, 11 pm. Every formatting button there is, and an empty slide with a blinking cursor. */
function Before({ product }: P) {
  return (
    <div className="prastuti-b">
      <div className="prastuti-b-night">
        <svg viewBox="0 0 150 90" aria-hidden="true">
          <path className="prastuti-b-moon" d="M143 25A13 13 0 0 1 127.500 9.500 13 13 0 1 0 143 25z" />
          {[
            [133, 45, 1.2],
            [143, 42, 1.5],
            [131, 56, 1],
            [144, 70, 1.3],
            [136, 82, 0.9],
            [120, 33, 0.9],
          ].map(([x, y, r], i) => (
            <circle className="prastuti-b-star" key={i} cx={x} cy={y} r={r} />
          ))}
        </svg>
        <span className="prastuti-b-time">{product.demo.beforeWhen}</span>
      </div>

      <div className="prastuti-b-win">
        <div className="prastuti-b-top">
          <i />
          <i />
          <i />
          <span>Untitled deck</span>
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
function TrendFace({ slide }: { slide: PrastutiSlide }) {
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
            <linearGradient id="prastuti-trend-light" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f16443" stopOpacity="0.42" />
              <stop offset="1" stopColor="#f16443" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={area} fill="url(#prastuti-trend-light)" />
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
      <div className="prastuti-trend-call" style={{ left: `${last.x}%`, top: `${((last.y - 6.2) / SLIDE.h) * 100}%` }}>
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

function SlideFace({ slide }: { slide: PrastutiSlide }) {
  if (slide.kind === 'title') return <TitleFace slide={slide} />
  if (slide.kind === 'bars') return <BarsFace slide={slide} />
  if (slide.kind === 'trend') return <TrendFace slide={slide} />
  return <PointsFace slide={slide} />
}

// ====================================================================== SCREEN
/** Prastuti on her laptop: set to Hindi, four places for slides, one big canvas, one place to talk. */
function Screen({ product }: P) {
  const d = product.demo
  const cover = d.slides.find((s) => s.kind === 'title') ?? d.slides[0]
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
        <span className="prastuti-appwho">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PRIYA.portrait} alt="" draggable={false} />
          Priya
        </span>
      </div>

      <div className="prastuti-canvas">
        {/* the filmstrip: four places, filled one by one */}
        <div className="prastuti-strip">
          {d.slides.map((s, i) => (
            <div className="prastuti-thumb" key={s.kind}>
              <span className="prastuti-thumb-n">
                {i + 1}
                <i className="prastuti-thumb-ok">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5.500 12.500 10 17 18.500 7.500" />
                  </svg>
                </i>
              </span>
              <div className="prastuti-thumb-slot">
                <i className="prastuti-thumb-ring" />
              </div>
            </div>
          ))}
        </div>

        {/* the canvas: each slide is built here, full size, then takes its place in the filmstrip */}
        <div className="prastuti-main">
          <div className="prastuti-empty">
            <span className="prastuti-empty-k">Speak in</span>
            <span className="prastuti-empty-lang">
              <Hi>{d.language.native}</Hi>
              <span>{d.language.en}</span>
            </span>
            <span className="prastuti-empty-p">Your deck appears here, in the same language.</span>
          </div>
          {d.slides
            .slice(1)
            .reverse()
            .map((s, i) => (
              <i className={`prastuti-back prastuti-back--${d.slides.length - 1 - i}`} key={s.kind} />
            ))}
          {d.slides.map((s, i) => (
            <div className={`prastuti-slide prastuti-slide--${s.kind}`} style={{ zIndex: 10 - i }} key={s.kind}>
              <SlideFace slide={s} />
            </div>
          ))}
          {/* the finished deck: its cover, once more, on top */}
          <div className="prastuti-slide prastuti-cover">
            <TitleFace slide={cover} />
          </div>
        </div>

        <div className="prastuti-talk">
          <div className="prastuti-micWrap">
            <TouchControl label={`Talk the week through, in ${d.language.en}`} className="prastuti-mic">
              <span className="prastuti-mic-face">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <g className="prastuti-mic-g--mic">
                    <rect x="9" y="2.500" width="6" height="11.500" rx="3" fill="#fff" stroke="none" />
                    <path d="M5.500 11.500a6.500 6.500 0 0 0 13 0M12 18v3.500" />
                  </g>
                  <rect className="prastuti-mic-g--stop" x="7" y="7" width="10" height="10" rx="2.400" fill="#fff" stroke="none" />
                  <path className="prastuti-mic-g--check" d="M5 12.500 10 17.500 19.500 7" strokeWidth="2.800" />
                </svg>
              </span>
            </TouchControl>
          </div>
          <div className="prastuti-talk-mid">
            <div className="prastuti-hint">
              <span>Tap to talk</span>
              <span>Listening, in {d.language.en}</span>
              <span>Building the deck, in {d.language.en}</span>
              <span>
                {d.slides.length} slides, in {d.language.en}
              </span>
            </div>
            <div className="prastuti-talk-body">
              <p className="prastuti-talk-ph">Talk me through your week</p>
              <div className="prastuti-wave">
                {WAVE.map((_, i) => (
                  <i key={i} />
                ))}
              </div>
            </div>
          </div>
          <div className="prastuti-attach">
            <i className="prastuti-attach-outline" />
            <div className="prastuti-attach-chip">
              <SheetGlyph />
              <span>{d.file}</span>
              <i className="prastuti-attach-sweep" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/** The stamp sits on the laptop's edge, over the corner of the deck, and travels with it. */
function OnDevice({ product }: P) {
  return (
    <div className="prastuti-stamp">
      <i className="prastuti-stamp-burst" />
      <Hi>{product.demo.ready}</Hi>
      <span>{product.demo.readyEn}</span>
    </div>
  )
}

// ====================================================================== AROUND THE DEVICE
/** Left column: what goes in. Her voice, in her language, and the tracker. Nothing to format. */
function Under({ product }: P) {
  const d = product.demo
  return (
    <div className="prastuti-kit">
      <span className="prastuti-kit-chip">
        <MicGlyph colour="#c8431c" />
        Her voice, in {d.language.en}
      </span>
      <span className="prastuti-kit-chip">
        <SheetGlyph />
        {d.file}
      </span>
      <span className="prastuti-kit-chip prastuti-kit-chip--solid">No formatting</span>
    </div>
  )
}

/** Under the photo: what she says, in Hindi, each sentence with its English beneath. */
function Beside({ product }: P) {
  const d = product.demo
  const hindi = sentencesOf(d.spoken)
  const english = sentencesOf(d.spokenEn)
  // everything the deck says, to find her own words in it
  const deckTexts = d.slides.flatMap((s) => [s.title, s.sub ?? '', s.callout ?? '', ...(s.points ?? []), ...(s.bars ?? []).map((b) => b.label)])
  return (
    <div className="prastuti-said">
      <i className="prastuti-said-line" />
      <p className="prastuti-said-who">
        Priya says, in {d.language.en}
        <span className="prastuti-said-wave" aria-hidden="true">
          {[0.5, 1, 0.65, 0.9, 0.4].map((_, i) => (
            <i key={i} />
          ))}
        </span>
      </p>
      {hindi.map((sentence, i) => {
        const words = sentence.split(' ')
        const [from, to] = keyRun(words, deckTexts)
        return (
          <div className="prastuti-sent" key={sentence}>
            <p className="prastuti-sent-hi prastuti-hi" lang="hi">
              {words.map((word, k) => (
                <span key={k}>
                  {k > 0 ? ' ' : null}
                  {k >= from && k < to ? (
                    // a word the deck keeps as she said it: it warms to the accent (two whole words, cross-faded)
                    <span className="prastuti-w prastuti-w--key">
                      <span className="prastuti-w-said">{word}</span>
                      <span className="prastuti-w-kept" aria-hidden="true">
                        {word}
                      </span>
                    </span>
                  ) : (
                    <span className="prastuti-w">{word}</span>
                  )}
                </span>
              ))}
            </p>
            <p className="prastuti-sent-en">{english[i] ?? ''}</p>
          </div>
        )
      })}
    </div>
  )
}

/** Under the result headline: the old time, struck through, and the new state. */
function Proof({ product }: P) {
  return (
    <div className="prastuti-compare">
      <span className="prastuti-compare-old">
        {product.demo.beforeWhen}
        <i />
      </span>
      <svg viewBox="0 0 40 20" fill="none" stroke="#c8431c" strokeWidth="2.600" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 10h34M28 3l8 7-8 7" />
      </svg>
      <span className="prastuti-compare-new">
        <Hi>{product.demo.ready}</Hi>
        <span>{product.demo.readyEn}</span>
      </span>
    </div>
  )
}

/** The thing that flies: the tracker, out of the name and into the laptop. */
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
  const d = product.demo
  const cover = d.slides.find((s) => s.kind === 'title') ?? d.slides[0]
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

      <div className="prastuti-callout">
        <div className="prastuti-callout-in">
          <Hi>{d.ready}</Hi>
          <span>{d.readyEn}</span>
        </div>
      </div>
    </div>
  )
}

// ====================================================================== MOTION
function animate(env: MomentEnv<PrastutiProduct>) {
  const { $, $$, U, ease: E, loc, letters, before, demo, run, result, stat, product } = env
  const inside = <T extends Element = HTMLElement>(root: Element, selector: string) => Array.from(root.querySelectorAll(selector)) as unknown as T[]

  // ---------------------------------------------------------------- before: Sunday, 11 pm, and nothing on the slide
  const night = $('.prastuti-b-night')
  const moon = $('.prastuti-b-moon')
  const stars = $$('.prastuti-b-star')
  const win = $('.prastuti-b-win')
  const tools = $$('.prastuti-b-tools > *:not(.prastuti-b-press)')
  const press = $('.prastuti-b-press')
  const pressOn = [$('.prastuti-b-tool--b'), $('.prastuti-b-swatch--b'), $('.prastuti-b-tool--u')]
  const bThumbs = $$('.prastuti-b-thumb')
  const bSlide = $('.prastuti-b-slide')
  const phs = $$('.prastuti-b-ph')
  const cursor = $('.prastuti-b-cursor')
  // she tries one formatting button after another: the highlight hops between them
  const toolsBox = loc($('.prastuti-b-tools'))
  const pressAt = pressOn.map((el) => {
    const b = loc(el)
    return { x: b.cx - toolsBox.x, y: b.cy - toolsBox.y }
  })
  gsap.set(night, { autoAlpha: 0, y: 2 * U, rotation: 9 })
  gsap.set(moon, { scale: 0, rotation: -40, transformOrigin: '50% 50%' })
  gsap.set(stars, { scale: 0, transformOrigin: '50% 50%' })
  gsap.set(win, { autoAlpha: 0, y: 3 * U, rotation: -9 })
  gsap.set(tools, { autoAlpha: 0, y: 0.5 * U })
  gsap.set(press, { x: pressAt[0].x, y: pressAt[0].y, xPercent: -50, yPercent: -50, scale: 0.4, autoAlpha: 0 })
  gsap.set(bThumbs, { autoAlpha: 0, x: -0.6 * U })
  gsap.set(bSlide, { autoAlpha: 0, scale: 0.95 })
  gsap.set(phs, { autoAlpha: 0 })
  gsap.set(cursor, { autoAlpha: 0 })
  before
    .to(night, { autoAlpha: 1, y: 0, rotation: 4, duration: 0.6, ease: E.snap }, 0.05)
    .to(win, { autoAlpha: 1, y: 0, rotation: -3, duration: 0.65, ease: E.snap }, 0.12)
    .to(moon, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2)' }, 0.3)
    .to(stars, { scale: 1, duration: 0.3, stagger: 0.04, ease: 'back.out(3)' }, 0.38)
    .to(tools, { autoAlpha: 1, y: 0, duration: 0.26, stagger: 0.022, ease: 'power2.out' }, 0.26)
    .to(bThumbs, { autoAlpha: 1, x: 0, duration: 0.28, stagger: 0.05 }, 0.3)
    .to(bSlide, { autoAlpha: 1, scale: 1, duration: 0.36, ease: E.snap }, 0.32)
    .to(phs, { autoAlpha: 1, duration: 0.24, stagger: 0.08 }, 0.46)
    .to(cursor, { autoAlpha: 1, duration: 0.1 }, 0.6)
    // bold, a colour, underline… and still nothing on the slide
    .to(press, { autoAlpha: 1, scale: 1, duration: 0.14, ease: 'back.out(3)' }, 0.5)
    .to(press, { x: pressAt[1].x, y: pressAt[1].y, duration: 0.16, ease: 'power3.inOut' }, 0.62)
    .to(press, { x: pressAt[2].x, y: pressAt[2].y, duration: 0.16, ease: 'power3.inOut' }, 0.74)

  // ---------------------------------------------------------------- measure the screen, as it is laid out
  const app = $('.prastuti-app')
  // on screens narrower than 16:9 the laptop is smaller (prastuti.css): the app is fitted to its screen
  const fitTo = (app.parentElement as HTMLElement).offsetWidth / (app.offsetWidth || 1)
  if (fitTo > 0 && Math.abs(fitTo - 1) > 0.004) gsap.set(app, { scale: fitTo })

  // The slides move inside the app, so their places are read from its own layout (offsets),
  // which no zoom or fit of the laptop changes.
  const canvas = $('.prastuti-canvas')
  const main = $('.prastuti-main')
  const W = main.offsetWidth
  const H = main.offsetHeight
  const within = (el: HTMLElement) => {
    let x = 0
    let y = 0
    let node: HTMLElement | null = el
    while (node && node !== canvas) {
      x += node.offsetLeft
      y += node.offsetTop
      node = node.offsetParent as HTMLElement | null
    }
    return { x, y }
  }
  const mainAt = within(main)
  /** Where each slide stands in the filmstrip, as a move of the full-size slide. */
  const park = $$('.prastuti-thumb-slot').map((slot) => {
    const at = within(slot)
    return { x: at.x - mainAt.x, y: at.y - mainAt.y, scale: slot.offsetWidth / (W || 1) }
  })

  const thumbs = $$('.prastuti-thumb')
  const rings = $$('.prastuti-thumb-ring')
  const oks = $$('.prastuti-thumb-ok')
  const empty = $('.prastuti-empty')
  const slides = $$('.prastuti-slide:not(.prastuti-cover)')
  const cover = $('.prastuti-cover')
  // drawn deepest first: here the one nearest the cover comes first
  const backs = $$('.prastuti-back').reverse()
  const micWrap = $('.prastuti-micWrap')
  const hints = $$('.prastuti-hint span')
  const attachOutline = $('.prastuti-attach-outline')
  const attachChip = $('.prastuti-attach-chip')
  const attachSweep = $('.prastuti-attach-sweep')
  const file = $('.prastuti-file')
  const attachBox = loc($('.prastuti-attach'))
  const fileBox = { w: file.offsetWidth, h: file.offsetHeight }

  // ---------------------------------------------------------------- demo: Prastuti, set to Hindi; the tracker attaches itself
  gsap.set(thumbs, { autoAlpha: 0, x: -0.7 * U })
  gsap.set(rings, { autoAlpha: 0 })
  gsap.set(oks, { scale: 0 })
  gsap.set(empty, { autoAlpha: 0, scale: 0.96 })
  gsap.set(micWrap, { autoAlpha: 0, scale: 0 })
  gsap.set(hints, { autoAlpha: 0 })
  gsap.set(attachChip, { autoAlpha: 0, scale: 0.9 })
  gsap.set(attachSweep, { xPercent: -110 })
  const saidWho = $('.prastuti-said-who')
  gsap.set(saidWho, { autoAlpha: 0, x: 0.8 * U })
  // the tracker is born from the first letter of the name and is thrown across into the laptop
  const born = { x: letters[0].cx, y: letters[0].cy }
  const dropAt = { x: attachBox.cx, y: attachBox.cy }
  const dropOver = { x: born.x + (dropAt.x - born.x) * 0.5, y: Math.min(born.y, dropAt.y) - 7.5 * U }
  gsap.set(file, { x: born.x, y: born.y, xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0, rotation: -8 })
  const fileLand = 0.92
  demo
    .to(empty, { autoAlpha: 1, scale: 1, duration: 0.42, ease: E.snap }, 0.46)
    .to(thumbs, { autoAlpha: 1, x: 0, duration: 0.34, stagger: 0.06 }, 0.5)
    .to(file, { scale: 1, autoAlpha: 1, duration: 0.32, ease: 'back.out(2.2)' }, 0.04)
    .to(file, { motionPath: { path: [dropOver, dropAt], curviness: 1.25 }, duration: 0.58, ease: 'power2.inOut' }, fileLand - 0.58)
    .to(file, { rotation: 7, duration: 0.26, ease: 'sine.out' }, fileLand - 0.58)
    .to(file, { rotation: 0, duration: 0.32, ease: 'sine.inOut' }, fileLand - 0.32)
    .to(file, { scaleX: attachBox.w / fileBox.w, scaleY: attachBox.h / fileBox.h, autoAlpha: 0, duration: 0.18, ease: 'power2.out' }, fileLand - 0.05)
    .to(attachOutline, { autoAlpha: 0, duration: 0.16 }, fileLand - 0.05)
    .to(attachChip, { autoAlpha: 1, scale: 1, duration: 0.3, ease: E.snap }, fileLand - 0.05)
    .to(micWrap, { autoAlpha: 1, scale: 1, duration: 0.42, ease: 'back.out(2.4)' }, 0.74)
    .to(hints[0], { autoAlpha: 1, duration: 0.25 }, 0.92)
    // under the photo, the place her words will be: she is about to speak, in Hindi
    .to(saidWho, { autoAlpha: 1, x: 0, duration: 0.3 }, 0.9)
  env.bump(demo, fileLand - 0.05)

  // ---------------------------------------------------------------- run: she speaks in Hindi, and the deck builds itself in Hindi
  const mic = $('.prastuti-mic-face')
  const micGlyph = $('.prastuti-mic-g--mic')
  const stopGlyph = $('.prastuti-mic-g--stop')
  const checkGlyph = $('.prastuti-mic-g--check')
  const placeholder = $('.prastuti-talk-ph')
  const wave = $('.prastuti-wave')
  const waveBars = $$('.prastuti-wave i')
  const saidLine = $('.prastuti-said-line')
  const saidWave = $$('.prastuti-said-wave i')
  const sents = $$('.prastuti-sent')
  const stamp = $('.prastuti-stamp')
  const burst = $('.prastuti-stamp-burst')

  gsap.set(stopGlyph, { autoAlpha: 0, scale: 0.4, transformOrigin: '50% 50%' })
  gsap.set(micGlyph, { transformOrigin: '50% 50%' })
  gsap.set(checkGlyph, { drawSVG: '0%' })
  gsap.set(wave, { autoAlpha: 0 })
  gsap.set(saidLine, { scaleY: 0, transformOrigin: '50% 0%' })
  gsap.set(saidWave, { scaleY: 0.25 })
  gsap.set(slides, { transformOrigin: '0 0', autoAlpha: 0, x: W * 0.02, y: H * 0.02, scale: 0.96 })
  // it comes down from over the laptop, not from over her photo
  gsap.set(stamp, { autoAlpha: 0, scale: 2.3, rotation: -22, transformOrigin: '88% 60%' })
  gsap.set(burst, { autoAlpha: 0 })

  run
    // the touch: she starts to talk
    .to(mic, { scale: 0.84, duration: 0.08, ease: 'power2.in' }, 0)
    .to(mic, { scale: 1, duration: 0.4, ease: 'back.out(3.2)' }, 0.08)
    .to(micGlyph, { autoAlpha: 0, scale: 0.4, duration: 0.16, ease: 'power2.in' }, 0.03)
    .to(stopGlyph, { autoAlpha: 1, scale: 1, duration: 0.28, ease: 'back.out(2.4)' }, 0.14)
    .to([hints[0], placeholder], { autoAlpha: 0, duration: 0.14 }, 0)
    .to(hints[1], { autoAlpha: 1, duration: 0.2 }, 0.1)
    .to(wave, { autoAlpha: 1, duration: 0.2 }, 0.05)
    .to(saidLine, { scaleY: 1, duration: 0.6, ease: 'power2.out' }, 0.04)
    .to(empty, { autoAlpha: 0, scale: 0.97, duration: 0.2, ease: 'power1.in' }, 0.04)
  waveBars.forEach((b, i) => {
    run.to(b, { scaleY: WAVE[i % WAVE.length], duration: 0.14, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 0.08 + (i % 7) * 0.022)
  })
  saidWave.forEach((b, i) => {
    run.to(b, { scaleY: 1, duration: 0.13, repeat: 5, yoyo: true, ease: 'sine.inOut' }, 0.08 + i * 0.03)
  })

  // her words, whole words at a time; each sentence's English arrives as she finishes it
  let spokenEnd = 0.1
  let wordIndex = 0
  sents.forEach((sent) => {
    const words = inside(sent, '.prastuti-w')
    const gloss = inside(sent, '.prastuti-sent-en')
    gsap.set(words, { autoAlpha: 0, y: 0.4 * U })
    gsap.set(gloss, { autoAlpha: 0, y: 0.3 * U })
    words.forEach((w) => {
      run.to(w, { autoAlpha: 1, y: 0, duration: 0.24, ease: 'power2.out' }, 0.1 + wordIndex * 0.042)
      wordIndex += 1
    })
    spokenEnd = 0.1 + wordIndex * 0.042
    run.to(gloss, { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out' }, spokenEnd + 0.02)
    // the words the deck keeps exactly as she said them warm to the accent
    const kept = inside(sent, '.prastuti-w-kept')
    if (kept.length) {
      gsap.set(kept, { autoAlpha: 0 })
      run.to(kept, { autoAlpha: 1, duration: 0.18, ease: 'none' }, spokenEnd + 0.1).to(inside(sent, '.prastuti-w-said'), { autoAlpha: 0, duration: 0.18, ease: 'none' }, spokenEnd + 0.1)
    }
  })
  // she has said it; the recording stays as a quiet waveform while the deck is built
  run
    .to(waveBars, { scaleY: (i) => 0.18 + WAVE[i % WAVE.length] * 0.55, duration: 0.3, ease: 'power2.out', stagger: 0.005 }, spokenEnd + 0.14)
    .to(wave, { autoAlpha: 0.55, duration: 0.3 }, spokenEnd + 0.14)
    .to(saidWave, { scaleY: (i) => [0.5, 1, 0.65, 0.9, 0.4][i % 5], duration: 0.24, ease: 'power2.out' }, spokenEnd + 0.14)
    .to(hints[1], { autoAlpha: 0, duration: 0.14 }, spokenEnd + 0.14)
    .to(hints[2], { autoAlpha: 1, duration: 0.2 }, spokenEnd + 0.24)

  // each slide arrives on the canvas, builds itself, and takes its place in the filmstrip
  const ARRIVE = [0.04, 0.44, 0.96, 1.48]
  const STAY = [0.38, 0.5, 0.5, 0.48]
  const PARK = 0.28
  const arrive = (i: number) => ARRIVE[Math.min(i, ARRIVE.length - 1)] + Math.max(0, i - (ARRIVE.length - 1)) * 0.5
  slides.forEach((slide, i) => {
    const at = arrive(i)
    const leave = at + STAY[Math.min(i, STAY.length - 1)]
    const land = leave + PARK
    run
      .to(slide, { autoAlpha: 1, duration: 0.12, ease: 'none' }, at)
      .to(slide, { x: 0, y: 0, scale: 1, duration: 0.3, ease: E.snap }, at)
      .to(rings[i], { autoAlpha: 1, duration: 0.14 }, at)
      .to(slide, { x: park[i].x, y: park[i].y, scale: park[i].scale, duration: PARK, ease: E.inOut }, leave)
      .to(rings[i], { autoAlpha: 0, duration: 0.2 }, land)
      .to(oks[i], { scale: 1, duration: 0.26, ease: 'back.out(3)' }, land - 0.04)
  })

  slides.forEach((slide, i) => {
    const at = arrive(i)
    const kind = product.demo.slides[i]?.kind

    if (kind === 'title') {
      // 1 · the cover: the sun comes up, its orbits draw, the title rises in two lines
      const sun = inside(slide, '.prastuti-t-sun')
      const orbits = inside<SVGCircleElement>(slide, '.prastuti-t-ring')
      const moons = inside<SVGCircleElement>(slide, '.prastuti-t-dot')
      const caption = inside(slide, '.prastuti-t-en')
      const lines = inside(slide, '.prastuti-t-title > span')
      const rule = inside(slide, '.prastuti-t-rule')
      const sub = inside(slide, '.prastuti-t-sub')
      gsap.set(sun, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(orbits, { drawSVG: '0%' })
      gsap.set(moons, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set([caption, sub], { autoAlpha: 0, x: -0.5 * U })
      gsap.set(lines, { autoAlpha: 0, y: 0.7 * U })
      gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' })
      run
        .to(sun, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, at + 0.03)
        .to(orbits, { drawSVG: '100%', duration: 0.38, stagger: 0.05, ease: 'power2.out' }, at + 0.08)
        .to(moons, { scale: 1, duration: 0.2, stagger: 0.05, ease: 'back.out(3)' }, at + 0.28)
        .to(caption, { autoAlpha: 1, x: 0, duration: 0.22 }, at + 0.06)
        .to(lines, { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.06, ease: 'power3.out' }, at + 0.1)
        .to(rule, { scaleX: 1, duration: 0.2, ease: 'power2.out' }, at + 0.24)
        .to(sub, { autoAlpha: 1, x: 0, duration: 0.22 }, at + 0.26)
      return
    }

    // the heading of a chart slide
    const headBar = inside(slide, '.prastuti-head-bar')
    const headText = inside(slide, '.prastuti-head-t, .prastuti-head-en')
    if (headBar.length) {
      gsap.set(headBar, { scaleY: 0, transformOrigin: '50% 0%' })
      gsap.set(headText, { autoAlpha: 0, x: -0.5 * U })
      run.to(headBar, { scaleY: 1, duration: 0.22, ease: 'power2.out' }, at + 0.04).to(headText, { autoAlpha: 1, x: 0, duration: 0.24, stagger: 0.05 }, at + 0.06)
    }

    if (kind === 'bars') {
      // 2 · the tracker is read; the branches stand up one by one; the one that lags is flagged
      run.to(attachSweep, { xPercent: 110, duration: 0.44, ease: 'power2.inOut' }, at - 0.04)
      const base = inside(slide, '.prastuti-bars-base')
      const grid = inside(slide, '.prastuti-bars-grid')
      const bars = inside(slide, '.prastuti-bar')
      const labels = inside(slide, '.prastuti-bar-l')
      const mark = inside(slide, '.prastuti-bar-mark')
      gsap.set(base, { scaleX: 0, transformOrigin: '0 50%' })
      gsap.set(grid, { autoAlpha: 0 })
      gsap.set(bars, { scaleY: 0, transformOrigin: '50% 100%' })
      gsap.set(labels, { autoAlpha: 0, y: 0.3 * U })
      gsap.set(mark, { scale: 0, y: 0.5 * U, transformOrigin: '50% 100%' })
      run
        .to(base, { scaleX: 1, duration: 0.22, ease: 'power2.out' }, at + 0.04)
        .to(grid, { autoAlpha: 1, duration: 0.22 }, at + 0.08)
        .to(bars, { scaleY: 1, duration: 0.28, stagger: 0.055, ease: 'back.out(1.7)' }, at + 0.08)
        .to(labels, { autoAlpha: 1, y: 0, duration: 0.18, stagger: 0.055 }, at + 0.13)
        .to(mark, { scale: 1, y: 0, duration: 0.2, ease: 'back.out(3)' }, at + 0.36)
    } else if (kind === 'trend') {
      // 3 · the line draws upward, the light follows under it, and the last point is called out
      const line = inside<SVGPathElement>(slide, '.prastuti-trend-line')
      const fill = inside(slide, '.prastuti-trend-fill')
      const dots = inside<SVGCircleElement>(slide, '.prastuti-trend-dot')
      const halo = inside<SVGCircleElement>(slide, '.prastuti-trend-halo')
      const grid = inside<SVGPathElement>(slide, '.prastuti-trend-grid, .prastuti-trend-floor')
      const pill = inside(slide, '.prastuti-trend-pill')
      const drawAt = at + 0.07
      const drawFor = 0.34
      gsap.set(line, { drawSVG: '0%' })
      gsap.set(fill, { clipPath: 'inset(0% 100% 0% 0%)' })
      gsap.set(dots, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(halo, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(grid, { autoAlpha: 0 })
      gsap.set(pill, { autoAlpha: 0, scale: 0.5, y: 0.6 * U, transformOrigin: '50% 100%' })
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
      gsap.set(bandBits, { autoAlpha: 0, y: 0.5 * U })
      gsap.set(rule, { scaleX: 0, transformOrigin: '0 50%' })
      gsap.set(arc, { scale: 0, transformOrigin: '50% 50%' })
      gsap.set(tiles, { scale: 0 })
      gsap.set(texts, { autoAlpha: 0, x: -0.6 * U })
      run
        .to(band, { xPercent: 0, duration: 0.26, ease: 'power3.out' }, at + 0.02)
        .to(arc, { scale: 1, duration: 0.32, ease: 'back.out(1.6)' }, at + 0.08)
        .to(rule, { scaleX: 1, duration: 0.18, ease: 'power2.out' }, at + 0.1)
        .to(bandBits, { autoAlpha: 1, y: 0, duration: 0.22, stagger: 0.04, ease: 'power3.out' }, at + 0.1)
        .to(tiles, { scale: 1, duration: 0.2, stagger: 0.055, ease: 'back.out(2.6)' }, at + 0.12)
        .to(texts, { autoAlpha: 1, x: 0, duration: 0.18, stagger: 0.055 }, at + 0.16)
    }
  })

  // the four gather into a deck on the canvas, the cover on top, and it is stamped
  const lastLeave = arrive(slides.length - 1) + STAY[Math.min(slides.length - 1, STAY.length - 1)]
  // the cover comes up out of the filmstrip as the last slide goes down into it: the canvas is never empty
  const tG = lastLeave
  const DECK = { scale: 0.86, dx: W * 0.0448, dy: H * 0.042 }
  const deckY = H * (1 - DECK.scale)
  gsap.set(cover, { transformOrigin: '0 0', x: park[0].x, y: park[0].y, scale: park[0].scale, autoAlpha: 0 })
  gsap.set(backs, { transformOrigin: '0 0', x: (i) => park[Math.min(i + 1, park.length - 1)].x, y: (i) => park[Math.min(i + 1, park.length - 1)].y, scale: (i) => park[Math.min(i + 1, park.length - 1)].scale, autoAlpha: 0 })
  run.to(cover, { autoAlpha: 1, duration: 0.06, ease: 'none' }, tG).to(cover, { x: 0, y: deckY, scale: DECK.scale, duration: 0.36, ease: E.inOut }, tG)
  backs.forEach((back, i) => {
    // the last of them waits for its slide to reach the filmstrip
    const leave = tG + [0.04, 0.1, 0.2][Math.min(i, 2)]
    run
      .to(back, { autoAlpha: 1, duration: 0.06, ease: 'none' }, leave)
      .to(back, { x: (i + 1) * DECK.dx, y: deckY - (i + 1) * DECK.dy, scale: DECK.scale, duration: 0.28, ease: E.inOut }, leave)
  })
  const hit = tG + 0.42
  run
    .to(stopGlyph, { autoAlpha: 0, scale: 0.4, duration: 0.14, ease: 'power2.in' }, tG)
    .to(checkGlyph, { drawSVG: '100%', duration: 0.3, ease: 'power2.out' }, tG + 0.1)
    .to(hints[2], { autoAlpha: 0, duration: 0.14 }, tG)
    .to(hints[3], { autoAlpha: 1, duration: 0.2 }, tG + 0.1)
    // प्रस्तुति तैयार
    .to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, hit - 0.24)
    .to(stamp, { scale: 1, rotation: -7, duration: 0.24, ease: E.slam }, hit - 0.24)
    .to(burst, { autoAlpha: 0.8, duration: 0.01 }, hit)
    .to(burst, { scale: 1.6, autoAlpha: 0, duration: 0.2, ease: 'power2.out' }, hit + 0.01)
  env.bump(run, hit, 3)

  // ---------------------------------------------------------------- result: Sunday, 11 pm, struck through
  const strike = $('.prastuti-compare-old i')
  gsap.set(strike, { scaleX: 0 })
  result.to(strike, { scaleX: 1, duration: 0.26, ease: 'power2.inOut' }, 0.66)

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
  const callout = $('.prastuti-callout-in')
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
  gsap.set(callout, { autoAlpha: 0, x: -1 * U, yPercent: -50 })
  stat
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
    .to(miniBacks[0], { x: 0.07 * miniW, y: -0.06 * miniW, rotation: 2, duration: 0.4, ease: E.snap }, 0.86)
    .to(miniBacks[1], { x: 0.14 * miniW, y: -0.12 * miniW, rotation: 4, duration: 0.4, ease: E.snap }, 0.9)
    .to(miniCheck, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 1.16)
    .to(callout, { autoAlpha: 1, x: 0, duration: 0.34, ease: E.snap }, 1.14)
  // each minute mark lights as the hand passes it
  lit.forEach((tick, i) => {
    stat.to(tick, { autoAlpha: 1, duration: 0.08, ease: 'none' }, minuteAt(i + 1))
  })

  return { control: $<HTMLElement>('[data-ev-control]'), deviceLandsOn: miniFront }
}

const prastuti: MomentModule<PrastutiProduct> = {
  key: 'prastuti',
  device: 'laptop',
  demoTitle: PRASTUTI.demo.slides[0].en,
  demoLine: PRASTUTI.promise,
  highlight: 'builds the deck, in Hindi',
  Before,
  Screen,
  Stat,
  Under,
  Beside,
  Proof,
  Extras,
  OnDevice,
  animate,
}

export default prastuti
