'use client'

/**
 * Slides 45 to 49: THE TRAIN. One scene, one landscape, one track.
 *
 *   45  the generations come through the same place, one at a time, each faster than the last:
 *       the older engine clears the track as the new one chases in (steam and air in three.js)
 *   46  the whole high-speed train: the camera tracks it, the landscape runs under it, and the
 *       seven stations open in three layers: what AI does, the agents, and last our people
 *   47  the window closes to the workshop where the engines are built
 *   48  inside the coach: a ticket for every seat, then our own coach
 *   49  at the station, on time: the days at each stage, 55 to 60%, three colleagues
 *
 * See PROGRESS.md.
 */

import gsap from 'gsap'
import { anim, Count, Headline, Words, pic, slide as slideOf, spanBeats, type SceneModule } from '../../kit'
import {
  BANNER_45,
  BANNER_46,
  BANNER_47,
  CAPTION_47,
  COMPARE,
  DAYS,
  FOOTNOTE_48,
  GENERATIONS,
  LABELS_46,
  LANDSCAPE,
  PILL_46,
  QUOTES,
  SKILL,
  STAGES,
  STATION,
  STATS_47,
  STAT_49,
  TRAIN,
  WORKSHOP,
} from './data'
import { createRailFx, STEAM_TO, type RailFx } from './fx'
import './scene.css'

const SLIDES = {
  45: ['trolley', 'steam', 'electric', 'aidlc'],
  46: ['stations', 'agents', 'people'],
  47: ['engines', 'skill'],
  48: ['ticket', 'coach'],
  49: ['ontime', 'half', 'voices'],
}

/** The landscape band on the stage, in --u (pack rect [0, 0.2534, 1, 0.3574]). */
const BAND = { top: 14.25, height: 20.1 }
/** Where the rails begin in the landscape picture, as a share of its height. */
const SPLIT = 0.815
/** The seven stations' centres on the track, in --u (the deck's dots). */
const STOPS = [10.6, 23.72, 36.84, 49.96, 63.08, 76.2, 89.32]
/** The four generations' dots on the track, in --u. */
const DOTS = [15.4, 38.5, 61.55, 84.6]
/** One day of work in --u, and where the bars begin inside the chart card. */
const DAY = 10.4
const BAR0 = 13.2

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13M12.5 6.5 18 12l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),
  preload: [
    pic(LANDSCAPE.n, LANDSCAPE.file),
    ...GENERATIONS.filter((g) => g.file).map((g) => pic(45, g.file)),
    pic(TRAIN.n, TRAIN.file),
    pic(WORKSHOP.n, WORKSHOP.file),
    ...COMPARE.map((c) => pic(48, c.file)),
    pic(STATION.n, STATION.file),
    ...QUOTES.map((q) => pic(49, q.file)),
  ],

  Scene: () => (
    <div className="s45">
      <Headline className="s45-h s45-h--45" text={slideOf(45).title} flame={['every stage of how we build software']} />
      <Headline className="s45-h s45-h--46" text={slideOf(46).title} flame={['AIDLC', 'our people make every decision']} />
      <Headline className="s45-h s45-h--47" text={slideOf(47).title} flame={['build the AI agents', 'write the skills']} />
      <Headline className="s45-h s45-h--48" text={slideOf(48).title} flame={['build more of our own software', 'infrastructure, not per seat']} />
      <Headline className="s45-h s45-h--49" text={slideOf(49).title} flame={['AIDLC', 'less than half the time']} />

      {/* ------------------------------------------------ the railway: 45 and 46 */}
      <div className="s45-band">
        <div className="s45-win s45-win--sky">
          <div className="s45-strip s45-strip--sky">
            {[0, 1, 2].map((i) => (
              <img key={i} className={i === 1 ? 's45-flip' : ''} style={{ left: u(i * 100) }} src={pic(LANDSCAPE.n, LANDSCAPE.file)} alt="" draggable={false} />
            ))}
          </div>
        </div>
        <div className="s45-win s45-win--track">
          <div className="s45-strip s45-strip--track">
            {[0, 1, 2].map((i) => (
              <img key={i} className={i === 1 ? 's45-flip' : ''} style={{ left: u(i * 100) }} src={pic(LANDSCAPE.n, LANDSCAPE.file)} alt="" draggable={false} />
            ))}
          </div>
        </div>
        {GENERATIONS.filter((g) => g.file).map((g) => (
          <img
            key={g.key}
            className={`s45-engine s45-engine--${g.key}`}
            src={pic(45, g.file)}
            alt=""
            draggable={false}
            style={{ left: u(g.rect[0] * 100), top: u(g.rect[1] * 56.25 - BAND.top), width: u(g.rect[2] * 100) }}
          />
        ))}
        <img
          className="s45-engine s45-engine--train"
          src={pic(TRAIN.n, TRAIN.file)}
          alt=""
          draggable={false}
          style={{ left: u(TRAIN.rect[0] * 100), top: u(TRAIN.rect[1] * 56.25 - BAND.top), width: u(TRAIN.rect[2] * 100) }}
        />
      </div>

      <p className="s45-banner s45-banner--45 s45-hid">
        <Words text={BANNER_45.text} flame={BANNER_45.flame} />
      </p>
      <div className="s45-banner s45-banner--46 s45-hid">
        <b className="s45-banner-title">
          <Words text={BANNER_46.title} flame={BANNER_46.flame} />
        </b>
        <i className="s45-banner-line">{BANNER_46.line}</i>
      </div>
      <p className="s45-agents-pill s45-hid">
        <Words text={PILL_46.text} flame={PILL_46.flame} />
      </p>

      {/* 45: four generations, four cards */}
      {GENERATIONS.map((g, i) => (
        <i key={g.key} className="s45-dot s45-dot--gen s45-hid" style={{ left: u(DOTS[i]) }} />
      ))}
      {GENERATIONS.map((g, i) => (
        <div key={g.key} className={`s45-gen s45-gen--${g.key} s45-hid ${g.highlighted ? 's45-gen--on' : ''}`} style={{ left: u(4.5 + i * 23.07) }}>
          <b className="s45-gen-num">
            {g.key === 'trolley' && <Count to={7} prefix="~" suffix="%" />}
            {g.key === 'steam' && (
              <>
                <Count to={40} /> to <Count to={45} suffix="%" />
              </>
            )}
            {g.key === 'electric' && <Count to={70} suffix="%+" />}
            {g.key === 'aidlc' && g.value}
          </b>
          <span className="s45-gen-line">{g.valueLine}</span>
          <i className="s45-gen-rule" />
          <b className="s45-gen-title">{g.title}</b>
          <span className="s45-gen-text">{g.text}</span>
        </div>
      ))}

      {/* 46: seven stations, three layers each */}
      <i className="s45-pulse s45-hid" />
      {STAGES.map((s, i) => (
        <i key={s.n} className="s45-dot s45-dot--stop s45-hid" style={{ left: u(STOPS[i]) }} />
      ))}
      {STAGES.map((s, i) => (
        <div key={s.n} className="s45-stop" style={{ left: u(STOPS[i] - 6.2) }}>
          <i className="s45-slot s45-slot--agents s45-hid" />
          <i className="s45-slot s45-slot--people s45-hid" />
          <div className="s45-tile s45-tile--ai s45-hid">
            <div className="s45-stop-head">
              <i>{s.n}</i>
              <b>{s.stage}</b>
            </div>
            <p>
              {s.bold ? (
                <>
                  <b>{s.bold[0]}</b>
                  {s.ai.slice(s.bold[0].length)}
                </>
              ) : (
                s.ai
              )}
            </p>
          </div>
          <div className="s45-tile s45-tile--agents s45-hid">
            <span className="s45-tile-label">{LABELS_46.agents}</span>
            <div className={`s45-chips ${s.agents.length === 1 ? 's45-chips--one' : ''}`}>
              {s.agents.map((a) => (
                <b key={a} className="s45-chip">
                  {a}
                </b>
              ))}
            </div>
          </div>
          <div className="s45-tile s45-tile--people s45-hid">
            <span className="s45-tile-label">{LABELS_46.people}</span>
            <b>{s.people}</b>
          </div>
        </div>
      ))}

      {/* ------------------------------------------------ 47: the workshop */}
      <div className="s45-shop s45-hid">
        <img src={pic(WORKSHOP.n, WORKSHOP.file)} alt="" draggable={false} />
      </div>
      <p className="s45-shop-cap s45-hid">
        <b>{CAPTION_47[0]}</b>
        <b className="s45-flame">{CAPTION_47[1]}</b>
      </p>
      {STATS_47.map((s, i) => (
        <div key={s.to} className="s45-stat s45-hid" style={{ left: u(50.1 + i * 23.3) }}>
          <b className="s45-stat-num">
            <Count to={s.to} suffix={s.suffix} />
          </b>
          <b className="s45-stat-title">{s.title}</b>
          <span>{s.line}</span>
        </div>
      ))}
      <div className="s45-skill s45-hid">
        <span className="s45-skill-label">{SKILL.label}</span>
        <p className="s45-skill-title">
          <Words text={SKILL.title} flame={SKILL.flame} />
        </p>
        <div className="s45-skill-pills">
          {SKILL.pills.map((p) => (
            <b key={p} className="s45-skill-pill s45-hid">
              {p}
            </b>
          ))}
        </div>
        <p className="s45-skill-text s45-hid">
          {SKILL.text.slice(0, SKILL.text.indexOf(SKILL.bold[0]))}
          <b>{SKILL.bold[0]}</b>
        </p>
      </div>
      <p className="s45-banner47 s45-hid">
        <Words text={BANNER_47.text} flame={BANNER_47.flame} />
      </p>

      {/* ------------------------------------------------ 48: inside the coach */}
      {COMPARE.map((c) => (
        <div key={c.key} className={`s45-coach s45-coach--${c.key} s45-hid`}>
          <div className="s45-coach-pic">
            {c.key === 'build' && <img className="s45-coach-before" src={pic(48, COMPARE[0].file)} alt="" draggable={false} />}
            <img className={`s45-coach-img s45-coach-img--${c.key}`} src={pic(48, c.file)} alt="" draggable={false} />
            <span className="s45-coach-label">{c.label}</span>
          </div>
          <b className="s45-coach-title">{c.title}</b>
          <ul>
            {c.bullets.map((b) => (
              <li key={b} className="s45-hid">
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <i className="s45-go s45-hid">
        <Arrow />
      </i>
      <p className="s45-foot s45-hid">
        <b>{FOOTNOTE_48.lead}</b>
        {FOOTNOTE_48.text}
      </p>

      {/* ------------------------------------------------ 49: at the station */}
      <div className="s45-station s45-hid">
        <img src={pic(STATION.n, STATION.file)} alt="" draggable={false} />
      </div>
      <div className="s45-half s45-hid">
        <b className="s45-half-num">
          <Count to={STAT_49.from} from={STAT_49.from - 30} /> to <Count to={STAT_49.to} from={STAT_49.to - 30} suffix="%" />
        </b>
        <div className="s45-half-pills">
          {STAT_49.pills.map((p) => (
            <b key={p} className="s45-hid">
              {p}
            </b>
          ))}
        </div>
        <b className="s45-half-line">{STAT_49.line}</b>
        <span className="s45-half-sub">{STAT_49.sub}</span>
      </div>
      <div className="s45-days s45-hid">
        <span className="s45-days-title">{DAYS.title}</span>
        <span className="s45-days-key">
          <i className="s45-key s45-key--earlier" />
          {DAYS.series[0]}
          <i className="s45-key s45-key--aidlc" />
          {DAYS.series[1]}
        </span>
        {DAYS.rows.map((r, i) => (
          <div key={r.label} className="s45-row" style={{ top: u(4.7 + i * 4.05) }}>
            <b className="s45-row-label">{r.label}</b>
            <i className="s45-bar s45-bar--earlier" style={{ width: u(r.earlier * DAY) }} />
            <b className="s45-val s45-val--earlier s45-hid" style={{ left: u(BAR0 + r.earlier * DAY + 0.7) }}>
              {r.earlierText}
            </b>
            <i className="s45-bar s45-bar--aidlc" style={{ width: u(r.aidlc * DAY) }} />
            <b className="s45-val s45-val--aidlc s45-hid" style={{ left: u(BAR0 + r.aidlc * DAY + 0.7) }}>
              {r.aidlcText}
            </b>
          </div>
        ))}
        <p className="s45-days-note s45-hid">
          {DAYS.note.map((n) => (
            <span key={n.b}>
              <b>{n.b}</b>
              {n.t}{' '}
            </span>
          ))}
        </p>
      </div>
      {QUOTES.map((q, i) => (
        <div key={q.name} className="s45-voice s45-hid" style={{ left: u(4.5 + i * 30.8) }}>
          <img src={pic(49, q.file)} alt="" draggable={false} />
          <b className="s45-voice-text">{q.text}</b>
          <span className="s45-voice-who">
            <b>{q.name}</b>
            <i>·</i>
            {q.role}
          </span>
        </div>
      ))}
    </div>
  ),

  three(ctx) {
    const fx = createRailFx(ctx, { top: BAND.top + 0.6, height: BAND.height - 1.2 })
    ctx.bag.fx = fx
    return fx.dispose
  },

  build(ctx) {
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const { U, W, ease } = ctx
    const fx = ctx.bag.fx as RailFx | undefined
    const back = ctx.backdrop.fx
    const calm = ctx.reduced
    const $ = ctx.$
    const $$ = ctx.$$
    const now = () => tl.duration()

    /* ---------- measure first ---------- */
    const pills = $$('.s45-skill-pill')
    const pillAt = pills.map((p) => ctx.loc(p))

    /* ---------- the railway ---------- */
    const band = $('.s45-band')
    const sky = $('.s45-strip--sky')
    const track = $('.s45-strip--track')
    const engines = {
      trolley: $('.s45-engine--trolley'),
      steam: $('.s45-engine--steam'),
      electric: $('.s45-engine--electric'),
      train: $('.s45-engine--train'),
    }
    const left = { trolley: 7.65, steam: 28.36, electric: 51.16, train: 24.91 }
    const width = { trolley: 15.45, steam: 20.26, electric: 20.78, train: 69.02 }
    type Key = keyof typeof engines
    const off = (k: Key) => -(left[k] + width[k] + 3) * U
    const out = (k: Key) => (100 - left[k] + 3) * U

    /** The run: `d` is the distance the camera has travelled along the track, in --u. */
    const run = { d: 0 }
    const lay = () => {
      gsap.set(sky, { x: -(run.d % 200) * U })
      gsap.set(track, { x: -((run.d * 3) % 200) * U })
      if (fx) fx.streak.phase = run.d * 3.4
    }
    lay()
    const runTo = (d: number, at: number, duration: number, e: string | gsap.EaseFunction = 'power2.inOut', wind = 0.85) => {
      if (calm) return
      tl.to(run, { d, duration, ease: e, onUpdate: lay }, at)
      if (fx) {
        tl.to(fx.streak, { amt: wind, len: 1, duration: duration * 0.4, ease: 'power2.in' }, at + duration * 0.06)
        tl.to(fx.streak, { amt: 0, len: 0.15, duration: duration * 0.42, ease: 'power2.out' }, at + duration * 0.55)
      }
    }

    // the train's body, for the streaks to keep off: it follows the train's own x
    const body = () => {
      if (!fx) return
      const x = (Number(gsap.getProperty(engines.train, 'x')) || 0) / U
      fx.body.x0 = left.train + 0.5 + x
      fx.body.x1 = left.train + width.train - 1 + x
      fx.body.y0 = 21.6
      fx.body.y1 = 31.2
    }
    const arrive = (k: Key, at: number, duration: number, e: string) => {
      if (calm) {
        gsap.set(engines[k], { autoAlpha: 0 })
        tl.to(engines[k], { autoAlpha: 1, duration: 0.5 }, at)
      } else {
        gsap.set(engines[k], { x: off(k) })
        tl.to(engines[k], { x: 0, duration, ease: e, onUpdate: k === 'train' ? body : undefined }, at)
      }
    }
    const depart = (k: Key, at: number, duration: number) => {
      if (calm) tl.to(engines[k], { autoAlpha: 0, duration: 0.3 }, at)
      else tl.to(engines[k], { x: out(k), duration, ease: 'power2.in', onUpdate: k === 'train' ? body : undefined }, at)
    }
    body()
    const card = (k: string, at: number) => {
      const i = GENERATIONS.findIndex((g) => g.key === k)
      a.pop($$('.s45-dot--gen')[i], at)
      a.rise(`.s45-gen--${k}`, at + 0.1)
      a.count(`.s45-gen--${k} .kn-count-n`, at + 0.2)
    }

    /* =================================================== 45 · trolley */
    a.words('.s45-h--45', 0.1)
    gsap.set(band, { clipPath: calm ? 'inset(0px 0px 0px 0px round 0px)' : `inset(0px ${W}px 0px 0px round 0px)`, autoAlpha: calm ? 0 : 1 })
    tl.to(band, { clipPath: 'inset(0px 0px 0px 0px round 0px)', autoAlpha: 1, duration: 1.0, ease: 'power3.out' }, 0.04)
    a.rise('.s45-banner--45', 0.95, { y: -1 })
    arrive('trolley', 0.9, 2.5, 'power2.out')
    card('trolley', 2.5)
    tl.to(back, { glow: 0.25, focusX: -0.7, focusY: 0.1, duration: 1.6 }, 0.6)
    tl.addLabel('trolley', now())

    /* =================================================== 45 · steam */
    let t = now()
    const tSteam = t
    depart('trolley', t, 1.5)
    arrive('steam', t + 0.9, 2.1, 'power3.out')
    card('steam', t + 2.2)
    tl.to(back, { focusX: -0.25, duration: 1.6, ease: ease.inOut }, t + 0.8)
    tl.addLabel('steam', now())
    const steamRest = now() - tSteam

    /* =================================================== 45 · electric */
    t = now()
    const tElectric = t
    depart('steam', t, 1.25)
    arrive('electric', t + 0.75, 1.7, 'power3.out')
    card('electric', t + 1.7)
    tl.to(back, { focusX: 0.25, duration: 1.4, ease: ease.inOut }, t + 0.6)
    tl.addLabel('electric', now())

    // the steam's clock runs with the timeline through both beats: born from the chimney wherever the engine is
    if (fx && !calm) {
      const enter = gsap.parseEase('power3.out')
      const exit = gsap.parseEase('power2.in')
      const chimX = left.steam + width.steam * 0.795
      const chimY = 21.75
      fx.chimney = (c) => {
        let x = 0
        if (c < steamRest) x = (off('steam') / U) * (1 - enter(Math.min(1, Math.max(0, (c - 0.9) / 2.1))))
        else x = (out('steam') / U) * exit(Math.min(1, Math.max(0, (c - (tElectric - tSteam)) / 1.25)))
        return [chimX + x, chimY]
      }
      const end = STEAM_TO + 2.4
      tl.to(fx.steam, { t: steamRest, duration: steamRest, ease: 'none' }, tSteam)
      tl.to(fx.steam, { t: end, duration: end - steamRest, ease: 'none' }, tElectric)
    }

    /* =================================================== 45 · aidlc */
    t = tl.labels.electric
    depart('electric', t, 1.0)
    arrive('train', t + 0.55, 1.7, 'power4.out')
    if (fx && !calm) {
      // the air it drags along: streaks that run WITH the train and die as it stops
      const gust = { p: 0 }
      tl.to(gust, { p: 1, duration: 1.9, ease: 'power3.out', onUpdate: () => (fx.streak.phase = -gust.p * 150) }, t + 0.5)
      tl.to(fx.streak, { amt: 0.75, len: 0.7, duration: 0.3, ease: 'power1.in' }, t + 0.55)
      tl.to(fx.streak, { amt: 0, len: 0.05, duration: 1.1, ease: 'power2.out' }, t + 0.95)
    }
    card('aidlc', t + 1.5)
    tl.to(back, { focusX: 0.7, glow: 0.4, warm: 0.25, duration: 1.4, ease: ease.inOut }, t + 0.5)
    tl.addLabel('aidlc', now())

    /* =================================================== 46 · stations */
    t = now()
    a.retitle('.s45-h--45', '.s45-h--46', t)
    a.leave('.s45-gen', t, { y: -1.2 })
    a.leave('.s45-dot--gen', t)
    a.leave('.s45-banner--45', t)
    a.rise('.s45-banner--46', t + 0.5, { y: -1 })
    a.rise('.s45-agents-pill', t + 0.7, { y: -1 })
    runTo(100, t + 0.4, 2.8)
    a.pop('.s45-dot--stop', t + 0.9, { stagger: 0.14 })
    a.rise('.s45-tile--ai', t + 1.0, { stagger: 0.14, y: 1.4 })
    a.fade('.s45-slot', t + 1.9, { stagger: 0.04, duration: 0.6 })
    tl.to(back, { focusX: 0, glow: 0.2, warm: 0, duration: 1.6, ease: ease.inOut }, t + 0.4)
    tl.addLabel('stations', now())

    /* =================================================== 46 · agents */
    t = now()
    runTo(300, t, 4.0, 'power2.inOut', 1)
    const pulse = $('.s45-pulse')
    const agentTiles = $$('.s45-tile--agents')
    gsap.set(pulse, { x: STOPS[0] * U, autoAlpha: 0, scale: 0.4 })
    gsap.set(agentTiles, { autoAlpha: 0, y: -1.2 * U })
    $$('.s45-chip').forEach((c) => gsap.set(c, { autoAlpha: 0, scale: 0.7 }))
    tl.to(pulse, { autoAlpha: 1, scale: 1, duration: 0.3 }, t + 0.35)
    const hop = 0.42
    tl.to(pulse, { x: STOPS[6] * U, duration: hop * 6, ease: 'none' }, t + 0.6)
    agentTiles.forEach((tile, i) => {
      const at = t + 0.6 + i * hop
      tl.to(tile, { autoAlpha: 1, y: 0, duration: 0.6, ease: ease.out }, at)
      tl.to(tile.querySelectorAll('.s45-chip'), { autoAlpha: 1, scale: 1, duration: 0.45, stagger: 0.12, ease: ease.snap }, at + 0.22)
    })
    tl.to(pulse, { autoAlpha: 0, scale: 1.8, duration: 0.5, ease: 'power1.out' }, t + 0.6 + hop * 6)
    tl.addLabel('agents', now())

    /* =================================================== 46 · people */
    t = now()
    runTo(400, t, 3.0, 'power2.inOut', 0.7)
    const peopleTiles = $$('.s45-tile--people')
    const stops = $$('.s45-dot--stop')
    gsap.set(peopleTiles, { autoAlpha: 0, y: -1.6 * U, scale: 0.94 })
    peopleTiles.forEach((tile, i) => {
      const at = t + 0.5 + i * 0.3
      tl.to(tile, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: ease.snap }, at)
      tl.to(stops[i], { scale: 1.35, duration: 0.18, ease: 'power2.out' }, at + 0.1)
      tl.to(stops[i], { scale: 1, backgroundColor: '#071a50', duration: 0.4, ease: 'power2.out' }, at + 0.28)
    })
    tl.addLabel('people', now())

    /* =================================================== 47 · engines */
    t = now()
    a.retitle('.s45-h--46', '.s45-h--47', t)
    a.leave('.s45-tile', t, { stagger: 0.012, y: -1 })
    tl.to($$('.s45-slot'), { autoAlpha: 0, duration: 0.2 }, t)
    a.leave('.s45-dot--stop', t)
    a.leave(['.s45-banner--46', '.s45-agents-pill'].map((s) => $(s)), t)
    depart('train', t + 0.1, 1.15)
    runTo(480, t + 0.1, 1.5, 'power2.in', 0.9)
    // the window closes to where the workshop's picture stands, and the workshop opens out of it
    const shop = $('.s45-shop')
    const shopImg = $('.s45-shop img')
    const r = 1.4 * U
    const winTop = 15.38 - BAND.top
    const shopH = 29.5
    if (calm) {
      tl.to(band, { autoAlpha: 0, duration: 0.4 }, t + 0.3)
      gsap.set(shop, { autoAlpha: 0 })
      tl.to(shop, { autoAlpha: 1, duration: 0.6 }, t + 0.6)
    } else {
      tl.to(band, { clipPath: `inset(${winTop * U}px ${51.24 * U}px 0px ${4.5 * U}px round ${r}px)`, duration: 1.0, ease: ease.inOut }, t + 0.55)
      gsap.set(shop, { autoAlpha: 0, clipPath: `inset(0px 0px ${(shopH - (BAND.height - winTop)) * U}px 0px round ${r}px)` })
      gsap.set(shopImg, { scale: 1.12, transformOrigin: '62% 55%' })
      tl.to(shop, { autoAlpha: 1, duration: 0.5, ease: 'power1.inOut' }, t + 1.35)
      tl.to(band, { autoAlpha: 0, duration: 0.3 }, t + 1.75)
      tl.to(shop, { clipPath: `inset(0px 0px 0px 0px round ${r}px)`, duration: 0.9, ease: ease.inOut }, t + 1.55)
      tl.to(shopImg, { scale: 1, duration: 2.6, ease: 'power2.out' }, t + 1.35)
    }
    a.rise('.s45-shop-cap', t + 2.3, { y: 1 })
    a.rise('.s45-stat', t + 1.9, { stagger: 0.16 })
    a.count('.s45-stat .kn-count-n', t + 2.05, { duration: 1.5 })
    tl.to(back, { focusX: -0.4, focusY: 0.2, glow: 0.3, warm: 0.3, duration: 1.6, ease: ease.inOut }, t + 0.6)
    tl.addLabel('engines', now())

    /* =================================================== 47 · skill */
    t = now()
    a.rise('.s45-skill', t)
    a.words('.s45-skill-title', t + 0.25, { stagger: 0.03 })
    // the three parts of a skill come off the shelf of the picture
    pills.forEach((p, i) => {
      const at = t + 0.75 + i * 0.22
      if (calm) {
        gsap.set(p, { autoAlpha: 0 })
        tl.to(p, { autoAlpha: 1, duration: 0.4 }, at)
        return
      }
      const b = pillAt[i]
      gsap.set(p, { autoAlpha: 0, x: 9.5 * U - b.cx, y: (22 + i * 5.2) * U - b.cy, scale: 0.55, rotation: -8 })
      tl.to(p, { autoAlpha: 1, duration: 0.25, ease: 'power1.out' }, at)
      tl.to(p, { x: 0, scale: 1, rotation: 0, duration: 1.0, ease: ease.inOut }, at)
      tl.to(p, { y: 0, duration: 1.0, ease: 'power2.inOut' }, at)
    })
    a.fade('.s45-skill-text', t + 1.9)
    a.rise('.s45-banner47', t + 2.1, { y: 1 })
    tl.to(back, { focusX: 0.4, duration: 1.4, ease: ease.inOut }, t)
    tl.addLabel('skill', now())

    /* =================================================== 48 · ticket */
    t = now()
    a.retitle('.s45-h--47', '.s45-h--48', t)
    a.leave(['.s45-shop', '.s45-shop-cap', '.s45-skill', '.s45-banner47'].map((s) => $(s)).concat($$('.s45-stat')), t, { stagger: 0.03 })
    a.rise('.s45-coach--buy', t + 0.5, { y: 2 })
    a.wipe('.s45-coach--buy .s45-coach-pic', t + 0.6, { duration: 1.1 })
    a.rise('.s45-coach--buy li', t + 1.2, { stagger: 0.14, y: 0.8 })
    tl.to(back, { focusX: -0.45, focusY: 0, glow: 0.2, warm: -0.2, duration: 1.4, ease: ease.inOut }, t + 0.3)
    tl.addLabel('ticket', now())

    /* =================================================== 48 · coach */
    t = now()
    a.pop('.s45-go', t)
    if (!calm) {
      tl.to($('.s45-go svg'), { x: 0.45 * U, duration: 0.22, ease: 'power2.out' }, t + 0.45)
      tl.to($('.s45-go svg'), { x: 0, duration: 0.4, ease: 'power2.inOut' }, t + 0.67)
    }
    a.rise('.s45-coach--build', t + 0.35, { y: 0, x: -5, duration: 0.9 })
    gsap.set($('.s45-coach-img--build'), { autoAlpha: 0 })
    tl.to($('.s45-coach-img--build'), { autoAlpha: 1, duration: 1.3, ease: 'power1.inOut' }, t + 1.2)
    gsap.set($('.s45-coach--build .s45-coach-title'), { color: '#071a50' })
    tl.to($('.s45-coach--build .s45-coach-title'), { color: '#eb542c', duration: 0.8 }, t + 1.6)
    a.rise('.s45-coach--build li', t + 2.0, { stagger: 0.16, y: 0.8 })
    a.fade('.s45-foot', t + 2.6)
    tl.to(back, { focusX: 0.45, warm: 0.35, glow: 0.35, duration: 1.6, ease: ease.inOut }, t + 0.4)
    tl.addLabel('coach', now())

    /* =================================================== 49 · ontime */
    t = now()
    a.retitle('.s45-h--48', '.s45-h--49', t)
    a.leave($$('.s45-coach').concat([$('.s45-go'), $('.s45-foot')]), t, { stagger: 0.03 })
    a.wipe('.s45-station', t + 0.5, { duration: 1.2 })
    if (!calm) {
      gsap.set($('.s45-station img'), { scale: 1.1, x: -1.4 * U, transformOrigin: '50% 60%' })
      tl.to($('.s45-station img'), { scale: 1, x: 0, duration: 2.4, ease: 'power3.out' }, t + 0.5)
    }
    a.rise('.s45-days', t + 0.7)
    const clipBar = (sel: string, at: number, stagger: number, duration: number) => {
      const bars = $$(sel)
      const rr = 0.45 * U
      gsap.set(bars, { clipPath: `inset(0px 100% 0px 0px round ${rr}px)` })
      tl.to(bars, { clipPath: `inset(0px 0% 0px 0px round ${rr}px)`, duration, stagger, ease: ease.inOut }, at)
    }
    clipBar('.s45-bar--earlier', t + 1.2, 0.16, 1.1)
    a.fade('.s45-val--earlier', t + 2.0, { stagger: 0.16, duration: 0.35 })
    tl.to(back, { focusX: -0.5, focusY: 0, glow: 0.3, warm: 0.3, duration: 1.4, ease: ease.inOut }, t + 0.4)
    tl.addLabel('ontime', now())

    /* =================================================== 49 · half */
    t = now()
    clipBar('.s45-bar--aidlc', t, 0.2, 0.75)
    a.fade('.s45-val--aidlc', t + 0.55, { stagger: 0.2, duration: 0.35 })
    a.fade('.s45-days-note', t + 1.3)
    a.rise('.s45-half', t + 0.9, { y: 1.4 })
    a.count('.s45-half .kn-count-n', t + 1.0, { duration: 1.4 })
    a.pop('.s45-half-pills b', t + 1.9, { stagger: 0.14 })
    tl.addLabel('half', now())

    /* =================================================== 49 · voices */
    t = now()
    a.rise('.s45-voice', t, { stagger: 0.2, y: 2 })
    tl.to(back, { focusX: 0, focusY: 0.5, glow: 0.2, duration: 1.4, ease: ease.inOut }, t)
    tl.addLabel('voices', now())

    return tl
  },
}

export default scene
