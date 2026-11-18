'use client'

/**
 * Slides 33, 34, 35 · THE PIT LANE: one scene in three stages (the folders of 34 and 35
 * re-export this one). The deck's own car, seen from above, never leaves the stage.
 *
 *   33  alone      the case rolls into the pit box and comes apart: wings off, tyres off. One
 *                  man stands by it (the real photograph of Sushil), the start lights are dark.
 *       checks     the five Cs, ONE AFTER ANOTHER: a lamp turns amber, a light walks to the next
 *                  part of the car and Sushil picks it up, a card says what he reads, and another
 *                  pile of paper lands. Five times.
 *       onhim      "held in his head" fills up; the red line: all in sequence, all on one person.
 *   34  crew       ABCD arrives. Fifteen helmets run in from the four corners to the four wheels,
 *                  the four team cards land with a share of the pile each, the fifteen agents are named.
 *       parallel   the pit stop: four wheels go on AT THE SAME TIME, the wings and the cover snap
 *                  home, sparks fly at all four wheel guns, the four bars fill together, the
 *                  numbers light, and the counter runs to 15.
 *   35  green      the lights come back and go green one by one, each with what ABCD finds.
 *       approved   the verdict comes down: APPROVED, with one condition to check (and the
 *                  Conditions card answers it).
 *       validated  Sushil makes the call: his stamp comes down.
 *       go         the crew steps back, the tyres smoke, and the car is gone.
 *
 * The car, the crew and the paper are the deck's cut-outs, at their own pixels, each over a
 * soft shadow cut from its own outline. The ground is a generated picture (GEN.md); the painted
 * lines are vector, so they draw themselves and stay sharp. Sparks and smoke are three.js
 * (fx.ts); without WebGL the scene tells the same story without them.
 */

import type React from 'react'
import gsap from 'gsap'
import { anim, Count, gen, Headline, Kicker, Person, pic, slide as slideOf, spanBeats, Words, type SceneModule } from '../../kit'
import * as D from './data'
import { makePitFx, SMOKE_END, SMOKE_GO, SPARK_END, type PitFx } from './fx'
import './scene.css'

const SLIDES = {
  33: ['alone', 'checks', 'onhim'],
  34: ['crew', 'parallel'],
  35: ['green', 'approved', 'validated', 'go'],
}

/* ------------------------------------------------------------------ the lane's geometry, in --u */
/** The lane's upper edge on the stage (scene.css → .s33-lane). */
const LT = 15.2
const LH = 41.05
/** The car: the middle of it on the stage, and its size against the deck's (the slide is refitted inside the safe area). */
const CX = 50.3
const CY = 31.2
const K = 0.9
/** How far the car comes from, and how far it goes. */
const FAR = 76
const OUT = 126
/** The launch: seconds, and the distance covered t seconds into it (power4.in). */
const GO = 1.0
const run = (t: number) => OUT * Math.pow(Math.min(Math.max(t / GO, 0), 1), 4)

const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`
/** A deck position (stage units of the deck) relative to the car's middle, at our scale. */
const rx = (du: number) => (du - D.DECK_CAR.cx) * K
const ry = (dv: number) => (dv - D.DECK_CAR.cy) * K
const size = (px: [number, number], k = K): [number, number] => [(px[0] / D.PPU) * k, (px[1] / D.PPU) * k]

/** Each wheel: its hub on the assembled car (relative to the car's middle) and the way out of the car from there. */
const WHEEL = Object.fromEntries(
  D.PARTS.filter((p) => p.key.startsWith('tyre-')).map((p) => {
    const [w, h] = size(p.px)
    const id = p.key.slice(5) as D.Team['wheel']
    return [
      id,
      {
        x: rx(p.at[0]) + w / 2,
        y: ry(p.at[1]) + h / 2,
        sx: id[0] === 'r' ? -1 : 1,
        sy: id[1] === 't' ? -1 : 1,
        off: p.off,
      },
    ]
  }),
) as Record<D.Team['wheel'], { x: number; y: number; sx: number; sy: number; off: [number, number] }>

/** The pile of paper: five stacks, each a little higher than the one before (lane coordinates). */
const STACK_K = 0.8
const [STACK_W, STACK_H] = size(D.STACK_PX, STACK_K)
const STACKS = [0, 1, 2, 3, 4].map((i) => ({
  x: i % 2 ? 8.3 : 7.6,
  y: 32.5 - LT - i * 2.0,
}))
const [MINI_W, MINI_H] = size(D.MINI_PX, 0.8)
/** A team's card on the stage (scene.css places them): where its small stack of paper is pinned. */
const MINI: Record<D.Team['key'], [number, number]> = {
  documents: [23.75, 15.45],
  collateral: [23.75, 41.2],
  policy: [72.4, 15.45],
  fraud: [72.4, 41.2],
}
/** The five things Sushil checks, as five places on the car in pieces: where his light stands (stage x) and what he lifts. */
const CHECKS: { x: number; parts: string[] }[] = [
  { x: CX + rx(31.28 - 7.12) + 2.0, parts: ['rear-wing'] },
  { x: CX + rx(35.33 - 2.1) + 2.1, parts: ['tyre-rt', 'tyre-rb'] },
  { x: CX - 1.6, parts: ['shell'] },
  { x: CX + rx(57.54 + 2.1) + 2.1, parts: ['tyre-ft', 'tyre-fb'] },
  { x: CX + rx(56.19 + 5.63) + 6.6, parts: ['front-wing'] },
]

/**
 * The air lines of slide 34, in lane coordinates: from a coupling on the edge of a team's card,
 * slack, to the gun at the hub its crew works at. The two lower ones come round the corner of the
 * pit box (between the stop mark and the bracket), so no line is laid across the box's paint.
 */
const HOSES = (['rt', 'ft', 'rb', 'fb'] as const).map((id) => {
  const w = WHEEL[id]
  const f = (v: number) => +v.toFixed(2)
  /** mirrored about the car's middle for the two front wheels */
  const X = (x: number) => f(w.sx < 0 ? x : 2 * CX - x)
  const Y = (y: number) => f(y - LT)
  const hx = CX + w.x - w.sx * 0.3
  const hy = CY + w.y + w.sy * 1.5
  if (w.sy < 0) {
    const from: [number, number] = [X(30.3), Y(24.95)]
    return {
      id,
      from,
      to: [f(hx), Y(hy)] as [number, number],
      d: `M${from[0]} ${from[1]} C${X(30.3)} ${Y(28.6)} ${f(hx + w.sx * 4.5)} ${Y(hy - 2.4)} ${f(hx)} ${Y(hy)}`,
    }
  }
  const from: [number, number] = [X(26.5), Y(40.75)]
  return {
    id,
    from,
    to: [f(hx), Y(hy)] as [number, number],
    d: `M${from[0]} ${from[1]} C${X(26.5)} ${Y(38.2)} ${X(26.3)} ${Y(35.7)} ${X(29.6)} ${Y(35.7)} S${f(hx + w.sx * 4.4)} ${Y(hy + 2.2)} ${f(hx)} ${Y(hy)}`,
  }
})

/** The rubber the two rear tyres lay down as the car goes: a handful of fine lines per tyre, the outer two the hardest, squirming where the wheels spun. */
const TRACK_LEN = 44
const TRACKS = (['rt', 'rb'] as const).flatMap((id, t) => {
  const x0 = CX + WHEEL[id].x - 0.9
  const y0 = CY + WHEEL[id].y - LT
  return [-1.32, -1.02, -0.62, -0.2, 0.24, 0.66, 1.04, 1.32].map((off, i) => {
    const edge = i === 0 || i === 7
    const pts: string[] = []
    for (let dx = 0; dx <= TRACK_LEN; dx += 0.5) {
      const squirm = 0.2 * Math.exp(-dx / 4.5) * Math.sin(dx * 1.25 + t * 1.7)
      pts.push(`${(x0 + dx + (i % 3) * 0.25).toFixed(2)} ${(y0 + off + squirm).toFixed(3)}`)
    }
    return {
      d: 'M' + pts.join(' L'),
      w: edge ? 0.17 : 0.09 + ((i * 7) % 3) * 0.035,
      o: edge ? 0.9 : 0.26 + ((i * 5) % 4) * 0.1,
    }
  })
})
const TRACK_X0 = CX + WHEEL.rt.x - 0.9

/** Which agent a helmet is: the j-th helmet at a wheel is the j-th agent of the team that works there. */
const HELMET_N = (() => {
  const seen: Record<string, number> = {}
  return D.HELMETS.map((hm) => {
    const j = (seen[hm.wheel] = (seen[hm.wheel] ?? -1) + 1)
    const team = D.TEAMS.find((t) => t.wheel === hm.wheel) as D.Team
    return { j, n: team.agents[j].n }
  })
})()

/** ABCD's chip on slide 35, against its size where it is named on slide 34. */
const ABCD_SMALL = 0.78

const LAMP = { off: '#1f2f6c', amber: '#f6a823', green: '#23a566' }

/** The shadows were cut with 40 pixels of room round the cut-out. */
const PAD = (40 / D.PPU) * K

/** One of the deck's cut-outs over its own shadow. */
function Sprite({ cls, src, shadow, x, y, w, h, pad, wheel, children }: { cls: string; src: string; shadow: string; x: number; y: number; w: number; h: number; pad: number; wheel?: string; children?: React.ReactNode }) {
  return (
    <span className={`s33-sp ${cls}`} data-wheel={wheel} style={{ left: u(x), top: u(y), width: u(w), height: u(h) }}>
      <img
        className="s33-sp-sh"
        src={shadow}
        alt=""
        draggable={false}
        style={{
          left: u(-pad + 0.22 * (pad / PAD)),
          top: u(-pad + 0.5 * (pad / PAD)),
          width: u(w + 2 * pad),
          height: u(h + 2 * pad),
        }}
      />
      <img className="s33-sp-im" src={src} alt="" draggable={false} />
      {children}
    </span>
  )
}

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),
  preload: [
    gen(33, 'pit-ground.jpg'),
    ...D.PARTS.flatMap((p) => [pic(33, p.file), gen(33, p.shadow)]),
    pic(33, 'illus-paper-stack.png'),
    gen(33, 'shadow-stack.png'),
    pic(33, D.SUSHIL.photo),
    D.ABCD.logo,
    pic(34, 'illus-helmet.png'),
    gen(33, 'shadow-helmet.png'),
    pic(34, 'illus-helmet-mini.png'),
    pic(34, 'illus-paper-stack-mini.png'),
    gen(33, 'shadow-stack-mini.png'),
  ],

  Scene: () => (
    <div className="s33">
      <Headline className="s33-h s33-h--33" text={slideOf(33).title} flame={D.FLAME_33} />
      <Headline className="s33-h s33-h--34" text={slideOf(34).title} flame={D.FLAME_34} />
      <Headline className="s33-h s33-h--35" text={slideOf(35).title} flame={D.FLAME_35} />

      {/* ---------------------------------------------------------------- the lane */}
      <div className="s33-lane" aria-hidden="true">
        <div className="s33-ground">
          <img src={gen(33, 'pit-ground.jpg')} alt="" draggable={false} />
        </div>
        <svg className="s33-paint" viewBox={`0 0 100 ${LH}`} preserveAspectRatio="none">
          {/* the lane's two long lines */}
          <path className="s33-white s33-lane-line" d={`M-1 ${18.7 - LT} H101`} strokeWidth="0.5" />
          <path className="s33-white s33-lane-line" d={`M-1 ${45.7 - LT} H101`} strokeWidth="0.5" />
          {/* the pit box: two orange brackets, and a white stop mark at each end */}
          <path className="s33-orange s33-box" d={`M27.8 ${25.2 - LT} V${21.95 - LT} H72.8 V${25.2 - LT}`} strokeWidth="0.5" />
          <path className="s33-orange s33-box" d={`M72.8 ${37.05 - LT} V${40.3 - LT} H27.8 V${37.05 - LT}`} strokeWidth="0.5" />
          <path className="s33-white s33-tmark" d={`M25.4 ${CY - 5.2 - LT} V${CY + 5.2 - LT} M25.4 ${CY - LT} H27.9`} strokeWidth="0.44" />
          <path className="s33-white s33-tmark s33-tmark--far" d={`M75.2 ${CY - 5.2 - LT} V${CY + 5.2 - LT} M75.2 ${CY - LT} H72.7`} strokeWidth="0.44" />
          {/* the light that runs out along the box's upper bracket as ABCD lands above it (slide 34) */}
          <path className="s33-surge" d={`M${CX} ${21.95 - LT} H27.8 V${25.2 - LT}`} strokeWidth="0.5" pathLength={100} strokeDasharray="16 100" />
          <path className="s33-surge" d={`M${CX} ${21.95 - LT} H72.8 V${25.2 - LT}`} strokeWidth="0.5" pathLength={100} strokeDasharray="16 100" />
          {/* quiet paint in the lower band: the fast lane's broken line */}
          <path className="s33-white s33-dash" d={`M-1 ${49.6 - LT} H101`} strokeWidth="0.3" strokeDasharray="3.2 2.4" />
          {/* the four air lines: from a coupling on each team's card to the gun at its wheel */}
          {HOSES.map((h) => (
            <g className="s33-air" key={h.id}>
              <path className="s33-hose" d={h.d} strokeWidth="0.36" />
              <path className="s33-pulse" d={h.d} strokeWidth="0.36" pathLength={100} strokeDasharray="7 100" />
              <circle className="s33-coupling" cx={h.from[0]} cy={h.from[1]} r="0.52" />
              <circle className="s33-gun" cx={h.to[0]} cy={h.to[1]} r="0.5" />
            </g>
          ))}
        </svg>
        <span className="s33-pool s33-pool--amber" />
        <span className="s33-pool s33-pool--green" />
        {/* the rubber the rear tyres leave when the car goes */}
        <svg className="s33-rubber" viewBox={`0 0 100 ${LH}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="s33-rubber-fade" gradientUnits="userSpaceOnUse" x1={TRACK_X0} y1="0" x2={TRACK_X0 + TRACK_LEN} y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.03" stopColor="#fff" stopOpacity="1" />
              <stop offset="0.3" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="0.7" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="s33-rubber-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height={LH}>
              <rect x="0" y="0" width="100" height={LH} fill="url(#s33-rubber-fade)" />
            </mask>
          </defs>
          <g mask="url(#s33-rubber-mask)">
            {(['rt', 'rb'] as const).map((id) => (
              <path key={id} d={`M${TRACK_X0} ${CY + WHEEL[id].y - LT} H${TRACK_X0 + TRACK_LEN}`} strokeWidth="2.7" strokeOpacity="0.2" strokeLinecap="butt" />
            ))}
            {TRACKS.map((t, i) => (
              <path key={i} d={t.d} strokeWidth={t.w} strokeOpacity={t.o} />
            ))}
          </g>
        </svg>
        <span className="s33-spot" style={{ left: u(CHECKS[0].x), top: u(CY - LT) }} />

        <div className="s33-pile">
          {STACKS.map((s, i) => (
            <Sprite key={i} cls="s33-stack" src={pic(33, 'illus-paper-stack.png')} shadow={gen(33, 'shadow-stack.png')} x={s.x} y={s.y} w={STACK_W} h={STACK_H} pad={(40 / D.PPU) * STACK_K} />
          ))}
        </div>

        {/* the flash of the four wheel guns, on the ground under the car */}
        <div className="s33-crew" style={{ left: u(CX), top: u(CY - LT) }}>
          {(['rt', 'ft', 'rb', 'fb'] as const).map((id) => (
            <span
              className="s33-flash"
              key={id}
              style={{
                left: u(WHEEL[id].x),
                top: u(WHEEL[id].y + WHEEL[id].sy * 1.2),
              }}
            />
          ))}
        </div>

        <div className="s33-car" style={{ left: u(CX), top: u(CY - LT) }}>
          <span className="s33-streak" />
          {D.PARTS.map((p) => {
            const [w, h] = size(p.px)
            return <Sprite key={p.key} cls={`s33-part s33-part--${p.key}`} src={pic(33, p.file)} shadow={gen(33, p.shadow)} x={rx(p.at[0])} y={ry(p.at[1])} w={w} h={h} pad={PAD} />
          })}
        </div>

        <div className="s33-crew" style={{ left: u(CX), top: u(CY - LT) }}>
          {D.HELMETS.map((hm, i) => {
            const [w, h] = size(D.HELMET_PX)
            return (
              <Sprite key={i} cls="s33-helmet" wheel={hm.wheel} src={pic(34, 'illus-helmet.png')} shadow={gen(33, 'shadow-helmet.png')} x={rx(hm.at[0])} y={ry(hm.at[1])} w={w} h={h} pad={PAD}>
                <i className="s33-ping" />
                <i className="s33-tick">{HELMET_N[i].n}</i>
              </Sprite>
            )
          })}
        </div>
      </div>

      <div className="s33-fx" aria-hidden="true" />

      {/* ---------------------------------------------------------------- the start lights */}
      <div className="s33-lights s33-ui" aria-hidden="true">
        {D.FIVE.map((c) => (
          <span className="s33-lamp" key={c}>
            <i className="s33-lamp-halo s33-lamp-halo--amber" />
            <i className="s33-lamp-halo s33-lamp-halo--green" />
            <i className="s33-lamp-face" />
          </span>
        ))}
      </div>

      {/* ---------------------------------------------------------------- slide 33: one man */}
      <div className="s33-chip s33-chip--sushil s33-ui">
        <Person src={pic(33, D.SUSHIL.photo)} name={D.SUSHIL.name} role={D.SUSHIL.role} size={3.75} ring="flame" plate maxPx={D.SUSHIL.px} />
      </div>
      <span className="s33-label s33-label--33 s33-ui">{D.PILE_33}</span>
      <div className="s33-seq s33-ui">{D.SEQUENCE}</div>
      <div className="s33-held s33-ui">
        <Kicker>{D.HELD}</Kicker>
        {D.FIVE.map((c) => (
          <span className="s33-held-c" key={c}>
            {c}
          </span>
        ))}
      </div>
      {D.FIVE.map((c, i) => (
        <div className="s33-c s33-c--reads s33-ui" key={c} style={{ left: u(4.4 + i * 18.48) }}>
          <div className="s33-c-top">
            <i className="s33-dot" />
            <b>{c}</b>
          </div>
          <Kicker>{D.READS}</Kicker>
          <p>{D.READS_TEXT[i]}</p>
        </div>
      ))}

      {/* ---------------------------------------------------------------- slide 34: the crew */}
      <div className="s33-chip s33-chip--abcd s33-ui">
        {/* ABCD is named: its own logo, whole (a speech bubble, not a circle), and its name large beside it */}
        <span className="s33-abcd">
          <span className="s33-abcd-plate" aria-hidden="true" />
          <span className="s33-abcd-mark">
            <i className="s33-abcd-ring" aria-hidden="true" />
            <img src={D.ABCD.logo} alt="" draggable={false} decoding="async" />
          </span>
          <span className="s33-abcd-text">
            <b className="s33-abcd-name" aria-label={D.ABCD.name}>
              {D.ABCD.name.split('').map((ch, i) => (
                <span className="s33-abcd-l" key={i} aria-hidden="true">
                  {ch}
                </span>
              ))}
            </b>
            <small className="s33-abcd-role">{D.ABCD.role}</small>
          </span>
        </span>
      </div>
      <span className="s33-label s33-label--34 s33-ui">{D.PILE_34}</span>
      {D.TEAMS.map((t) => (
        <div className={`s33-team s33-team--${t.key} s33-ui`} key={t.key}>
          <b className="s33-team-name">{t.team}</b>
          <span className="s33-team-q">{t.question}</span>
          <span className="s33-bar">
            <span className="s33-bar-fill" />
          </span>
        </div>
      ))}
      {D.TEAMS.map((t) => (
        <Sprite key={t.key} cls="s33-mini s33-ui" src={pic(34, 'illus-paper-stack-mini.png')} shadow={gen(33, 'shadow-stack-mini.png')} x={MINI[t.key][0]} y={MINI[t.key][1]} w={MINI_W} h={MINI_H} pad={(40 / D.PPU) * 0.8} />
      ))}
      {D.TEAMS.map((t) => (
        <div className={`s33-agents s33-agents--${t.key} s33-ui`} key={t.key} data-team={t.key}>
          {t.agents.map((ag) => (
            <span className="s33-agent" key={ag.n}>
              <img src={pic(34, 'illus-helmet-mini.png')} alt="" draggable={false} />
              <span className="s33-agent-name">{ag.name}</span>
              <span className="s33-agent-n">{ag.n}</span>
            </span>
          ))}
        </div>
      ))}
      <div className="s33-badge s33-ui">
        <p className="s33-badge-top">
          <Count className="s33-badge-n" from={1} to={D.BADGE.value} /> <b>{D.BADGE.unit}</b>
        </p>
        <p>{D.BADGE.line1}</p>
        <p className="s33-badge-l2">{D.BADGE.line2}</p>
      </div>

      {/* ---------------------------------------------------------------- slide 35: the verdict, and the call */}
      {D.FIVE.map((c, i) => (
        <div className="s33-c s33-c--finds s33-ui" key={c} style={{ left: u(4.4 + i * 18.48) }}>
          {i === 4 ? <span className="s33-c-ring" aria-hidden="true" /> : null}
          <div className="s33-c-top">
            <i className="s33-dot" />
            <b>{c}</b>
          </div>
          <Kicker>{D.FINDS}</Kicker>
          <p>
            <Words text={D.FINDS_TEXT[i].text} bold={[D.FINDS_TEXT[i].bold]} />
          </p>
        </div>
      ))}
      <div className="s33-verdict s33-ui">
        <span className="s33-verdict-ring" aria-hidden="true" />
        <Kicker>{D.VERDICT.label}</Kicker>
        <b className="s33-approved">{D.VERDICT.value}</b>
        <span className="s33-verdict-line">{D.VERDICT.line}</span>
      </div>
      <div className="s33-chip s33-chip--sushil2 s33-ui">
        <Person src={pic(35, D.SUSHIL.photo)} name={D.SUSHIL.name} role={D.SUSHIL.role} size={3.75} ring="flame" plate maxPx={D.SUSHIL.px} />
      </div>
      <div className="s33-stamp s33-ui">
        <span className="s33-stamp-ring" aria-hidden="true" />
        <span className="s33-stamp-in">{D.STAMP}</span>
      </div>
    </div>
  ),

  three(ctx) {
    const wheels = (['rt', 'ft', 'rb', 'fb'] as const).map((id) => [CX + WHEEL[id].x, CY + WHEEL[id].y, WHEEL[id].sy] as [number, number, number])
    const rear = (['rt', 'rb'] as const).map((id) => [CX + WHEEL[id].x, CY + WHEEL[id].y] as [number, number])
    const fx = makePitFx(ctx, ctx.$('.s33-fx'), wheels, rear, run)
    ctx.bag.fx = fx
    return fx.dispose
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.bag.fx as PitFx | undefined
    /** Travel: nothing travels where less motion was asked for; things fade in where they stand. */
    const R = reduced ? 0 : 1

    const $$ = ctx.$$
    const car = ctx.$('.s33-car')
    const part = (key: string) => ctx.$(`.s33-part--${key}`)
    const im = (el: Element) => el.querySelector('.s33-sp-im') as Element
    const sh = (el: Element) => el.querySelector('.s33-sp-sh') as Element
    const lights = ctx.$('.s33-lights')
    const faces = $$('.s33-lamp-face')
    const amber = $$('.s33-lamp-halo--amber')
    const green = $$('.s33-lamp-halo--green')
    const poolAmber = ctx.$('.s33-pool--amber')
    const poolGreen = ctx.$('.s33-pool--green')
    const spot = ctx.$('.s33-spot')
    const stacks = $$('.s33-stack')
    const pile = ctx.$('.s33-pile')
    const helmets = $$('.s33-helmet')
    const minis = $$('.s33-mini')
    const reads = $$('.s33-c--reads')
    const finds = $$('.s33-c--finds')
    const abcd = ctx.$('.s33-chip--abcd')
    const abcdIn = ctx.$('.s33-abcd')

    // measured before anything is hidden or moved: where the small stacks of paper come from
    const top = ctx.loc(stacks[4])
    const miniFrom = minis.map((m) => {
      const b = ctx.loc(m)
      return { x: top.cx - b.cx, y: top.cy - b.cy }
    })

    /** A part is picked up and put down again: it comes toward the eye, its shadow slides out from under it. */
    const lift = (el: Element, t: number, up = 0.45, down = 0.4, h = 1) => {
      if (reduced) return
      tl.to(im(el), { scale: 1 + 0.075 * h, duration: up, ease: 'power2.out' }, t)
      tl.to(im(el), { scale: 1, duration: down, ease: 'power2.inOut' }, t + up)
      tl.to(
        sh(el),
        {
          x: 0.42 * U * h,
          y: 0.75 * U * h,
          scale: 1.07,
          autoAlpha: 0.6,
          duration: up,
          ease: 'power2.out',
        },
        t,
      )
      tl.to(
        sh(el),
        {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: down,
          ease: 'power2.inOut',
        },
        t + up,
      )
    }

    /* ================================================================ 33 · alone */
    a.words('.s33-h--33', 0.1)
    a.wipe('.s33-ground', 0.02, { from: 'left', duration: 0.95 })
    a.draw('.s33-lane-line', 0.5, { duration: 1.1, stagger: 0.12 })

    // the case rolls in whole, and brakes into its box
    gsap.set(car, { x: -FAR * U * R, autoAlpha: reduced ? 0 : 1 })
    tl.to(car, { x: 0, autoAlpha: 1, duration: 1.6, ease: 'power3.out' }, 0.65)
    a.draw('.s33-box', 1.75, { duration: 0.8, stagger: 0.1 })
    a.draw('.s33-tmark', 1.95, { duration: 0.5, stagger: 0.06 })
    a.fade('.s33-dash', 1.2, { duration: 0.9 })

    // … and comes apart: wings off, cover back, the four tyres off their hubs
    D.PARTS.forEach((p, i) => {
      if (!p.off[0] && !p.off[1]) return
      const el = part(p.key)
      const to = { x: p.off[0] * K * U, y: p.off[1] * K * U }
      if (reduced) {
        gsap.set(el, to)
        return
      }
      const t = 2.25 + i * 0.045
      tl.to(el, { ...to, duration: 0.85, ease: ease.inOut }, t)
      lift(el, t, 0.4, 0.45, 0.8)
    })
    a.rise('.s33-chip--sushil', 1.5)
    a.rise(lights, 2.5, { y: -1.6 })
    tl.addLabel('alone', 3.45)

    /* ================================================================ 33 · checks: one after another */
    const C0 = 3.5
    const STEP = 0.86
    gsap.set(amber, { autoAlpha: 0, scale: 0.5 })
    gsap.set(green, { autoAlpha: 0, scale: 0.5 })
    gsap.set([poolAmber, poolGreen, spot], { autoAlpha: 0 })
    gsap.set(pile, {
      transformOrigin: `${(STACKS[0].x + STACK_W / 2) * U}px ${(STACKS[0].y + STACK_H) * U}px`,
    })
    a.rise('.s33-label--33', C0 + 0.25)
    D.FIVE.forEach((_, k) => {
      const t = C0 + k * STEP
      // the lamp
      tl.to(faces[k], { backgroundColor: LAMP.amber, duration: 0.22, ease: 'power1.out' }, t)
      tl.to(amber[k], { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.out }, t)
      tl.to(poolAmber, { autoAlpha: (k + 1) / 5, duration: 0.5 }, t)
      // his light goes to the next part of the car, and he picks it up
      if (k === 0) tl.to(spot, { autoAlpha: 1, duration: 0.35 }, t)
      else
        tl.to(
          spot,
          {
            x: (CHECKS[k].x - CHECKS[0].x) * U,
            duration: 0.5,
            ease: ease.inOut,
          },
          t - 0.2,
        )
      CHECKS[k].parts.forEach((key) => lift(part(key), t + 0.08, 0.3, 0.36))
      // what he reads
      a.rise(reads[k], t + 0.1)
      // one more pile
      const st = stacks[k]
      gsap.set(st, {
        autoAlpha: 0,
        y: -7 * U * R,
        scale: 1 + 0.14 * R,
        rotation: (k % 2 ? 5 : -5) * R,
      })
      tl.to(st, { autoAlpha: 1, duration: 0.14, ease: 'none' }, t + 0.12)
      tl.to(st, { y: 0, scale: 1, rotation: 0, duration: 0.4, ease: 'power2.in' }, t + 0.12)
      if (!reduced) {
        tl.to(pile, { scaleY: 0.975, scaleX: 1.012, duration: 0.06, ease: 'power1.out' }, t + 0.52)
        tl.to(pile, { scaleY: 1, scaleX: 1, duration: 0.3, ease: ease.out }, t + 0.58)
      }
    })
    tl.to(spot, { autoAlpha: 0, duration: 0.45 }, C0 + 4 * STEP + 0.75)
    const L2 = C0 + 4 * STEP + 1.2
    tl.addLabel('checks', L2)

    /* ================================================================ 33 · all on one person */
    a.rise('.s33-held', L2 + 0.05, { x: 1.8, y: 0 })
    a.pop('.s33-held-c', L2 + 0.3, { stagger: 0.09, from: 0.8 })
    a.pop('.s33-seq', L2 + 0.85, { from: 0.86 })
    if (!reduced) {
      tl.to(amber, { scale: 1.22, duration: 0.2, ease: 'power1.out' }, L2 + 0.9)
      tl.to(amber, { scale: 1, duration: 0.5, ease: 'power1.inOut' }, L2 + 1.1)
    }
    const L3 = L2 + 1.7
    tl.addLabel('onhim', L3)

    /* ================================================================ 34 · the crew arrives */
    const TA = L3 + 0.05
    a.retitle('.s33-h--33', '.s33-h--34', TA)
    a.leave(reads, TA, { y: -1.4, stagger: 0.04 })
    a.leave('.s33-held, .s33-seq, .s33-chip--sushil, .s33-label--33', TA)
    tl.to(lights, { autoAlpha: 0, y: -1.4 * U * R, duration: 0.4, ease: 'power2.in' }, TA)
    tl.to(poolAmber, { autoAlpha: 0, duration: 0.5 }, TA)
    tl.to(stacks[4], { autoAlpha: 0, scale: 0.7, duration: 0.35, ease: 'power2.in' }, TA + 0.5)

    /* ABCD IS NAMED. Its logo comes down onto the head of the pit box and lands with weight; at the landing a
       ring of light leaves it, a light runs out both ways along the box's bracket, its plate opens and the
       name comes up large, letter by letter, with what it stands for. Only then does the crew move (T4). */
    const mark = ctx.$('.s33-abcd-mark')
    const ring = ctx.$('.s33-abcd-ring')
    const plate = ctx.$('.s33-abcd-plate')
    const letters = $$('.s33-abcd-l')
    const role = ctx.$('.s33-abcd-role')
    const surges = $$('.s33-surge')
    const DROP = TA + 0.3
    const HIT = DROP + (reduced ? 0.3 : 0.42)
    gsap.set(abcdIn, { xPercent: -50, transformOrigin: '0% 50%' })
    gsap.set(abcd, { autoAlpha: 0 })
    gsap.set(ring, { autoAlpha: 0, scale: 0.8 })
    gsap.set(surges, { autoAlpha: 0, strokeDashoffset: 16 })
    gsap.set(role, { autoAlpha: 0, x: -0.8 * U * R })
    tl.set(abcd, { autoAlpha: 1 }, DROP)
    if (reduced) {
      gsap.set([mark, plate, ...letters], { autoAlpha: 0 })
      tl.to([mark, plate, ...letters], { autoAlpha: 1, duration: 0.4, ease: 'power1.out' }, DROP)
    } else {
      gsap.set(mark, { autoAlpha: 0, y: -4.2 * U, scale: 1.45, rotation: -9, transformOrigin: '50% 88%' })
      gsap.set(plate, { scaleX: 0.12, autoAlpha: 0, transformOrigin: '0% 50%' })
      gsap.set(letters, { yPercent: 115 })
      tl.to(mark, { autoAlpha: 1, duration: 0.14, ease: 'none' }, DROP)
      tl.to(mark, { y: 0, scale: 1, rotation: 0, duration: 0.42, ease: 'power3.in' }, DROP)
      // the landing: it gives, and comes back up
      tl.to(mark, { scaleY: 0.88, scaleX: 1.09, duration: 0.07, ease: 'power1.out' }, HIT)
      tl.to(mark, { scaleY: 1, scaleX: 1, duration: 0.5, ease: 'elastic.out(1, 0.45)' }, HIT + 0.07)
      tl.to(ring, { autoAlpha: 1, duration: 0.05, ease: 'none' }, HIT)
      tl.to(ring, { scale: 2.5, duration: 0.75, ease: 'power2.out' }, HIT)
      tl.to(ring, { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, HIT + 0.25)
      // the light runs out along the bracket to both ends of the box
      tl.set(surges, { autoAlpha: 1 }, HIT)
      tl.to(surges, { strokeDashoffset: -100, duration: 0.7, ease: 'power2.out' }, HIT)
      tl.to(surges, { autoAlpha: 0, duration: 0.2, ease: 'none' }, HIT + 0.5)
      tl.to(plate, { autoAlpha: 1, duration: 0.12, ease: 'none' }, HIT)
      tl.to(plate, { scaleX: 1, duration: 0.5, ease: 'power3.out' }, HIT)
      tl.to(letters, { yPercent: 0, duration: 0.55, stagger: 0.055, ease: 'back.out(1.6)' }, HIT + 0.1)
    }
    tl.to(role, { autoAlpha: 1, x: 0, duration: 0.5, ease: ease.out }, HIT + 0.42)
    /** The crew moves when ABCD has landed. */
    const T4 = TA + 0.5
    a.rise('.s33-label--34', T4 + 0.55)
    a.rise('.s33-team', T4 + 0.5, { stagger: 0.06, y: 1.4 })
    // a share of the pile goes to each team
    minis.forEach((m, i) => {
      const t = T4 + 0.55 + i * 0.07
      gsap.set(m, {
        x: miniFrom[i].x * R,
        y: miniFrom[i].y * R,
        scale: 1 + 0.5 * R,
        rotation: -20 * R,
        autoAlpha: 0,
      })
      tl.to(m, { autoAlpha: 1, duration: 0.15, ease: 'none' }, t)
      tl.to(m, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.85, ease: ease.inOut }, t)
    })
    // fifteen helmets, four crews: each comes out of the garage in single file, through the gap beside
    // its team's card (the upper two) or up the open lane (the lower two), and fans out round its wheel,
    // which is still off the car. No helmet passes under a card.
    const pings = $$('.s33-ping')
    const ticks = $$('.s33-tick')
    gsap.set(pings, { autoAlpha: 0, scale: 0.5 })
    gsap.set(ticks, { autoAlpha: 0, scale: 0.3 })
    helmets.forEach((hm, i) => {
      const w = WHEEL[(hm as HTMLElement).dataset.wheel as D.Team['wheel']]
      const j = HELMET_N[i].j
      const seatX = CX + rx(D.HELMETS[i].at[0])
      const seatY = CY + ry(D.HELMETS[i].at[1])
      // the door they come through: x of the file, and the lane's edge they start beyond
      const doorX = w.sy < 0 ? (w.sx < 0 ? 37.0 : 2 * CX - 37.0 - 2.43) : seatX - w.sx * (2.5 + j * 1.1)
      const doorY = w.sy < 0 ? LT - 4.5 : LT + LH + 1.5
      gsap.set(hm, {
        x: (doorX - seatX) * U * R,
        y: (doorY - seatY) * U * R,
        autoAlpha: 0,
        rotation: w.sx * w.sy * 16 * R,
      })
      // the one who stands farthest round the wheel leaves first
      const order = w.sy < 0 ? 3 - j : j
      const t = T4 + 0.8 + order * 0.13
      tl.to(hm, { autoAlpha: 1, duration: 0.12, ease: 'none' }, t)
      tl.to(hm, { y: 0, duration: 0.8, ease: 'power3.out' }, t)
      tl.to(hm, { x: 0, rotation: 0, duration: 0.8, ease: 'power2.inOut' }, t)
    })
    // the air lines: coupling on the card, the line runs out to the wheel, the gun at its end
    const hoses = $$('.s33-hose')
    const couplings = $$('.s33-coupling')
    const guns = $$('.s33-gun')
    const pulses = $$('.s33-pulse')
    gsap.set(pulses, { autoAlpha: 0, strokeDashoffset: 7 })
    gsap.set([...couplings, ...guns], {
      autoAlpha: 0,
      scale: 0.3,
      transformOrigin: '50% 50%',
    })
    tl.to(couplings, { autoAlpha: 1, scale: 1, duration: 0.35, ease: ease.snap }, T4 + 1.15)
    a.draw(hoses, T4 + 1.3, { duration: 0.8 })
    tl.to(guns, { autoAlpha: 1, scale: 1, duration: 0.3, ease: ease.snap }, T4 + 2.0)
    // the lines are live: one pulse of light runs down all four, from the cards to the guns
    if (!reduced) {
      tl.set(pulses, { strokeDashoffset: 7, autoAlpha: 1 }, T4 + 2.12)
      tl.to(pulses, { strokeDashoffset: -100, duration: 0.6, ease: 'power1.inOut' }, T4 + 2.13)
      tl.set(pulses, { autoAlpha: 0 }, T4 + 2.75)
    }
    // the fifteen agents, team by team, all four teams at once
    $$('.s33-agents').forEach((g) => {
      const left = g.classList.contains('s33-agents--documents') || g.classList.contains('s33-agents--collateral')
      a.rise(Array.from(g.querySelectorAll('.s33-agent')), T4 + 1.35, {
        x: left ? 1.8 : -1.8,
        y: 0,
        stagger: 0.1,
      })
    })
    gsap.set($$('.s33-bar-fill'), { scaleX: 0, transformOrigin: '0% 50%' })
    const L4 = T4 + 2.85
    tl.addLabel('crew', L4)

    /* ================================================================ 34 · the pit stop: everything at once */
    const T5 = L4 + 0.05
    /** The guns go four times, at all four wheels together: each push is one agent of every team. */
    const GUN0 = T5 + 0.9
    const GUN = 0.24
    // four wheels up and on, each with its crew
    D.PARTS.forEach((p) => {
      if (!p.off[0] && !p.off[1]) return
      const el = part(p.key)
      if (p.key.startsWith('tyre-')) {
        tl.to(el, { x: 0, y: 0, duration: 0.7, ease: 'power3.inOut' }, T5 + 0.1)
        lift(el, T5 + 0.1, 0.34, 0.36, 1.7)
      } else {
        // the wings and the cover slide home and click
        tl.to(el, { x: 0, y: 0, duration: 0.7, ease: ease.snap }, T5 + (p.key === 'shell' ? 0.3 : 0.4))
      }
    })
    // work runs down the four air lines while the bars fill
    if (!reduced) {
      for (let j = 0; j < 3; j++) {
        const t = T5 + 0.2 + j * 0.62
        tl.set(pulses, { strokeDashoffset: 7, autoAlpha: 1 }, t)
        tl.to(pulses, { strokeDashoffset: -100, duration: 0.56, ease: 'power1.in' }, t + 0.01)
        tl.set(pulses, { autoAlpha: 0 }, t + 0.58)
      }
    }
    if (fx) tl.to(fx.sparks, { value: SPARK_END, duration: SPARK_END, ease: 'none' }, GUN0 - 0.04)
    const flashes = $$('.s33-flash')
    gsap.set(flashes, { autoAlpha: 0, scale: 0.4 })
    if (!reduced) {
      // the wheels are on: the car takes the knock
      tl.to(car, { scale: 1.014, duration: 0.07, ease: 'power1.out' }, T5 + 0.8)
      tl.to(car, { scale: 1, duration: 0.5, ease: ease.out }, T5 + 0.87)
      for (let j = 0; j < 4; j++) {
        tl.to(
          flashes,
          {
            autoAlpha: 1 - j * 0.1,
            scale: 1,
            duration: 0.07,
            ease: 'power1.out',
          },
          GUN0 + j * GUN,
        )
        tl.to(flashes, { autoAlpha: 0, scale: 0.6, duration: 0.2, ease: 'power1.in' }, GUN0 + 0.07 + j * GUN)
        tl.to(guns, { scale: 1.7, duration: 0.06, ease: 'power1.out' }, GUN0 + j * GUN)
        tl.to(guns, { scale: 1, duration: 0.16, ease: 'power1.in' }, GUN0 + 0.06 + j * GUN)
      }
    }
    // push by push: one helmet at every wheel leans in and is counted, and its agent's number lights in the list
    const nums = $$('.s33-agent-n')
    const numOf = new Map(nums.map((el) => [Number(el.textContent), el]))
    helmets.forEach((hm, i) => {
      const { j, n } = HELMET_N[i]
      const t = GUN0 + j * GUN
      const num = numOf.get(n)
      if (num)
        tl.to(
          num,
          {
            backgroundColor: '#f16443',
            color: '#ffffff',
            duration: 0.2,
            ease: 'power1.out',
          },
          t,
        )
      tl.to(
        ticks[i],
        {
          autoAlpha: 1,
          scale: 1,
          duration: reduced ? 0.3 : 0.26,
          ease: reduced ? 'none' : ease.snap,
        },
        t,
      )
      if (reduced) return
      if (num) {
        tl.to(num, { scale: 1.3, duration: 0.12, ease: 'power1.out' }, t)
        tl.to(num, { scale: 1, duration: 0.3, ease: 'power1.inOut' }, t + 0.12)
      }
      tl.to(im(hm), { scale: 1.16, duration: 0.08, ease: 'power1.out' }, t)
      tl.to(im(hm), { scale: 1, duration: 0.2, ease: 'power1.in' }, t + 0.08)
      tl.to(pings[i], { autoAlpha: 0.95, duration: 0.04, ease: 'none' }, t)
      tl.to(pings[i], { scale: 1.9, autoAlpha: 0, duration: 0.5, ease: 'power2.out' }, t + 0.04)
    })
    // the four bars fill together
    tl.to($$('.s33-bar-fill'), { scaleX: 1, duration: 1.75, ease: 'power2.inOut' }, T5 + 0.25)
    a.rise('.s33-badge', T5 + 1.3, { x: 1.8, y: 0 })
    a.count('.s33-badge-n', T5 + 1.35, { duration: 0.95 })
    const L5 = T5 + 2.7
    tl.addLabel('parallel', L5)

    /* ================================================================ 35 · green, one by one */
    const T6 = L5 + 0.05
    a.retitle('.s33-h--34', '.s33-h--35', T6)
    a.leave('.s33-agent', T6, { stagger: 0.012, y: 0.6 })
    a.leave('.s33-team, .s33-mini, .s33-badge, .s33-label--34', T6 + 0.05, {
      stagger: 0.02,
    })
    tl.to($$('.s33-air'), { autoAlpha: 0, duration: 0.35 }, T6 + 0.02)
    tl.to(ticks, { autoAlpha: 0, scale: 0.4, duration: 0.3, ease: 'power2.in' }, T6 + 0.02)
    // the mountain has been read: it goes where it stands
    tl.to(
      stacks.slice(0, 4).reverse(),
      {
        autoAlpha: 0,
        scale: 0.86,
        duration: 0.26,
        stagger: 0.04,
        ease: 'power2.in',
      },
      T6 + 0.02,
    )
    // ABCD takes its place at the head of the lane, and only then do the lights come back
    const chip = ctx.loc(abcd)
    tl.to(abcd, { x: 4.4 * U - chip.x, duration: 0.7, ease: ease.inOut }, T6 + 0.05)
    // … as a nameplate: smaller, so that the verdict under it and the lights beside it lead (slide 35)
    tl.to(abcdIn, { xPercent: 0, scale: ABCD_SMALL, duration: 0.7, ease: ease.inOut }, T6 + 0.05)
    tl.to(lights, { autoAlpha: 1, y: 0, duration: 0.55, ease: ease.out }, T6 + 0.72)
    tl.to(poolAmber, { autoAlpha: 0.7, duration: 0.55 }, T6 + 0.72)
    D.FIVE.forEach((_, k) => {
      const t = T6 + 1.3 + k * 0.3
      tl.to(faces[k], { backgroundColor: LAMP.green, duration: 0.2, ease: 'power1.out' }, t)
      tl.to(amber[k], { autoAlpha: 0, duration: 0.2 }, t)
      tl.to(green[k], { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.out }, t)
      tl.to(poolAmber, { autoAlpha: 0.7 * (1 - (k + 1) / 5), duration: 0.3 }, t)
      tl.to(poolGreen, { autoAlpha: (k + 1) / 5, duration: 0.4 }, t)
      a.rise(finds[k], t + 0.05)
    })
    const L6 = T6 + 1.3 + 4 * 0.3 + 0.95
    tl.addLabel('green', L6)

    /* ================================================================ 35 · approved */
    const T7 = L6 + 0.05
    const verdict = ctx.$('.s33-verdict')
    const approved = ctx.$('.s33-approved')
    const vring = ctx.$('.s33-verdict-ring')
    a.rise(verdict, T7, { y: -1.6 })
    a.fade('.s33-verdict .kn-kicker', T7 + 0.25)
    gsap.set(approved, { autoAlpha: 0, scale: 1 + 0.8 * R })
    tl.to(approved, { autoAlpha: 1, duration: 0.1, ease: 'none' }, T7 + 0.6)
    tl.to(approved, { scale: 1, duration: 0.3, ease: ease.slam }, T7 + 0.6)
    gsap.set(vring, { autoAlpha: 0 })
    if (!reduced) {
      tl.to(verdict, { y: 0.28 * U, duration: 0.06, ease: 'power1.out' }, T7 + 0.9)
      tl.to(verdict, { y: 0, duration: 0.45, ease: ease.out }, T7 + 0.96)
      tl.to(vring, { autoAlpha: 0.9, duration: 0.05, ease: 'none' }, T7 + 0.9)
      tl.to(
        vring,
        {
          autoAlpha: 0,
          scaleX: 1.07,
          scaleY: 1.16,
          duration: 0.6,
          ease: 'power2.out',
        },
        T7 + 0.95,
      )
      tl.to(green, { scale: 1.25, duration: 0.15, ease: 'power1.out' }, T7 + 0.9)
      tl.to(green, { scale: 1, duration: 0.5, ease: 'power1.inOut' }, T7 + 1.05)
    }
    a.fade('.s33-verdict-line', T7 + 1.05)
    // the one condition: the fifth card answers
    a.fade('.s33-c-ring', T7 + 1.2, { duration: 0.5 })
    const L7 = T7 + 1.8
    tl.addLabel('approved', L7)

    /* ================================================================ 35 · Sushil makes the call */
    const T8 = L7 + 0.05
    const stamp = ctx.$('.s33-stamp')
    const sring = ctx.$('.s33-stamp-ring')
    a.rise('.s33-chip--sushil2', T8, { x: 1.8, y: 0 })
    gsap.set(stamp, { autoAlpha: 0, scale: 1 + 1.4 * R, rotation: -10 * R })
    gsap.set(sring, { autoAlpha: 0 })
    tl.to(stamp, { autoAlpha: 1, duration: 0.1, ease: 'none' }, T8 + 0.65)
    tl.to(stamp, { scale: 1, rotation: 0, duration: 0.28, ease: ease.slam }, T8 + 0.65)
    if (!reduced) {
      tl.to(stamp, { scale: 0.94, duration: 0.05, ease: 'power1.out' }, T8 + 0.93)
      tl.to(stamp, { scale: 1, duration: 0.4, ease: ease.out }, T8 + 0.98)
      tl.to(sring, { autoAlpha: 0.8, duration: 0.04, ease: 'none' }, T8 + 0.93)
      tl.to(
        sring,
        {
          autoAlpha: 0,
          scaleX: 1.14,
          scaleY: 1.4,
          duration: 0.55,
          ease: 'power2.out',
        },
        T8 + 0.97,
      )
    }
    const L8 = T8 + 1.6
    tl.addLabel('validated', L8)

    /* ================================================================ 35 · and the car is gone */
    const T9 = L8 + 0.05
    /** The moment the car lets go. */
    const GO0 = T9 + 0.7
    helmets.forEach((hm) => {
      const w = WHEEL[(hm as HTMLElement).dataset.wheel as D.Team['wheel']]
      tl.to(
        hm,
        {
          x: w.sx * 1.9 * U * R,
          y: w.sy * 0.5 * U * R,
          duration: 0.45,
          ease: ease.out,
        },
        T9,
      )
    })
    if (!reduced) {
      tl.to(green, { scale: 1.3, duration: 0.18, stagger: 0.03, ease: 'power1.out' }, T9 + 0.12)
      tl.to(green, { scale: 1, duration: 0.5, stagger: 0.03, ease: 'power1.inOut' }, T9 + 0.3)
    }
    const streak = ctx.$('.s33-streak')
    const rubber = ctx.$('.s33-rubber')
    const cut = 100 - TRACK_X0
    gsap.set(streak, {
      autoAlpha: 0,
      scaleX: 0.15,
      transformOrigin: '100% 50%',
    })
    gsap.set(rubber, { clipPath: `inset(0% ${cut}% 0% 0%)`, autoAlpha: 0 })
    if (reduced) {
      tl.to(car, { autoAlpha: 0, duration: 0.6 }, T9 + 0.4)
      tl.to(rubber, { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, duration: 0.6 }, T9 + 0.5)
    } else {
      // it sits back on its rear tyres, they spin, and it is gone: over clear ground, seen whole to the stage's edge
      tl.to(car, { x: -0.55 * U, duration: 0.3, ease: 'power2.out' }, GO0 - 0.3)
      if (fx) tl.to(fx.smoke, { value: SMOKE_END, duration: SMOKE_END, ease: 'none' }, GO0 - SMOKE_GO)
      tl.to(car, { x: OUT * U, duration: GO, ease: 'power4.in' }, GO0)
      tl.to(streak, { autoAlpha: 1, scaleX: 1, duration: 0.4, ease: 'power2.in' }, GO0 + 0.4)
      tl.to(rubber, { autoAlpha: 1, duration: 0.02, ease: 'none' }, GO0)
      tl.to(
        rubber,
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: GO * 0.82,
          ease: 'power3.in',
        },
        GO0,
      )
      // every head follows it out
      helmets.forEach((hm) => {
        const w = WHEEL[(hm as HTMLElement).dataset.wheel as D.Team['wheel']]
        tl.to(im(hm), { rotation: 90, duration: 0.5, ease: 'power2.inOut' }, GO0 + 0.42 + (w.sx > 0 ? 0.12 : 0))
      })
      tl.to(poolGreen, { x: 14 * U, scaleX: 1.25, duration: 1.4, ease: 'power2.out' }, GO0 + 0.5)
    }
    tl.addLabel('go', GO0 + SMOKE_END - SMOKE_GO + 0.1)

    return tl
  },
}

export default scene
