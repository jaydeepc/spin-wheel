'use client'

/**
 * Slides 42 and 43 · THE TOWN MAP: one scene in two stages (the folder of 43 re-exports this
 * one). The deck's own map is a real place here: a slab that leans back in perspective, the five
 * numbered pins standing on their stops, and a marker that drives. The town never leaves the stage.
 *
 *   42  town     the town leans back into view, the five pins drop on their stops, the manager
 *                (his real photograph, carried over a puck with a heading wedge) stands at the
 *                start, the five tasks are named.
 *       ask      he sets off: up a side road to ask around and back, to stop 1. The red dashes
 *                follow him, and the view follows him too (a small turn, a small push in).
 *       recall   round the long loop below, calling from memory, to stop 2.
 *       dig      over the top, digging through notes, to stop 3.
 *       stuck    a wrong turn into a dead end and back, to stop 4.
 *       missed   he ends at stop 5, short of the destination: missed by 2 cases.
 *   43  arya     THE HINGE, in order: the headline and the chip hand over while the red tangle
 *                still lies there; then the red route is taken back along its own length, the
 *                marker riding it home, leaving the deck's thin white ghost; the banner comes
 *                down; and the route Arya has planned draws in one line through all five stops
 *                to the destination. The rest: the whole town, the plan, the five tasks.
 *       guided   the marker glides along it through stops 1 and 2: the banner gives the
 *                instruction, each card says what Arya says.
 *       onward   through stops 3 and 4, without stopping between them.
 *       rank     through stop 5 to the destination: RANK #1.
 *
 * The map picture is the deck's illustration, as it is, on the slab. The routes are the deck's
 * own vector paths (routes.ts), drawn by a shader (town.ts). Without WebGL the same story is
 * told on the flat picture with SVG lines.
 */

import gsap from 'gsap'
import type { ReactNode } from 'react'
import { anim, Count, Headline, Person, pic, slide as slideOf, spanBeats, type SceneModule } from '../../kit'
import * as D from './data'
import { DEST, MAP_H, RED_A, RED_B, RED_C, RED_S1, RED_S2, BLUE, STOPS } from './routes'
import { CARRY, makeRoutes, makeTown3D, markerAt, PIN, townState, type Routes, type Town3D } from './town'
import './scene.css'

const SLIDES = { 42: ['town', 'ask', 'recall', 'dig', 'stuck', 'missed'], 43: ['arya', 'guided', 'onward', 'rank'] }
const MAP = pic(42, 'illus-town-map.jpg')

/** Without WebGL: the flat map's place on the stage, in --u (scene.css → .s42-flat). */
const FLAT = { x: 4.2, y: 15.6, k: 0.916 }

/** The first rest: the town stands this much lower (--u) and nearer (world units), and the row of tasks this much lower. */
const HERO = { dy: 2.4, z: 1, cards: 5.2 }

/** A sentence with some of its phrases in Bold; a phrase may be a number that counts. */
function Rich({ text, bold, counts = {} }: { text: string; bold: string[]; counts?: Record<string, ReactNode> }) {
  const out: ReactNode[] = []
  let rest = text
  let key = 0
  while (rest.length) {
    let at = -1
    let hit = ''
    for (const b of bold) {
      const i = rest.indexOf(b)
      if (i >= 0 && (at < 0 || i < at)) {
        at = i
        hit = b
      }
    }
    if (at < 0) {
      out.push(rest)
      break
    }
    if (at > 0) out.push(rest.slice(0, at))
    out.push(<b key={key++}>{counts[hit] ?? hit}</b>)
    rest = rest.slice(at + hit.length)
  }
  return <>{out}</>
}

/** The deck's five numbers of card 5, as counters (43 t40). */
const COUNTS: Record<string, ReactNode> = {
  '₹1.07 Cr': <Count className="s42-count" to={1.07} from={1} decimals={2} prefix="₹" suffix=" Cr" />,
  '₹13,463': <Count className="s42-count" to={13463} from={10000} group="in" prefix="₹" />,
}

const pts = (flat: number[]) => flat.map((v) => +v.toFixed(2)).join(' ')

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),
  preload: [MAP, pic(42, D.KRISHN.photo), pic(D.ARYA.photoSlide, D.ARYA.photo)],

  Scene: () => (
    <div className="s42">
      <Headline className="s42-h s42-h--42" text={slideOf(42).title} flame={D.FLAME_42} />
      <Headline className="s42-h s42-h--43" text={slideOf(43).title} flame={D.FLAME_43} />

      {/* only where there is no WebGL: the deck's picture, flat, with the routes as SVG */}
      <div className="s42-flat" aria-hidden="true">
        <img src={MAP} alt="" draggable={false} />
        <svg viewBox={`0 0 100 ${MAP_H.toFixed(3)}`}>
          {[RED_A, RED_S1, RED_B, RED_S2, RED_C].map((r, i) => (
            <polyline key={i} className="s42-flat-red" points={pts(r)} />
          ))}
          {[RED_A, RED_S1, RED_B, RED_S2, RED_C].map((r, i) => (
            <polyline key={i} className="s42-flat-ghost" points={pts(r)} />
          ))}
          <polyline className="s42-flat-planbed" points={pts(BLUE)} />
          <polyline className="s42-flat-plan" points={pts(BLUE)} />
          <polyline className="s42-flat-bed" points={pts(BLUE)} />
          <polyline className="s42-flat-blue" points={pts(BLUE)} />
          {[...STOPS, DEST].map((s, i) => (
            <circle key={i} className="s42-flat-dot" cx={s[0]} cy={s[1]} r={0.52} />
          ))}
          {STOPS.map((s, i) => (
            <g key={i} className="s42-flat-pin">
              <circle cx={s[0]} cy={s[1] - 3.75} r={1.2} />
              <text x={s[0]} y={s[1] - 3.75 + 0.42} textAnchor="middle">
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* who is driving */}
      <div className="s42-chip s42-chip--krishn">
        <Person src={pic(42, D.KRISHN.photo)} name={D.KRISHN.name} role={D.KRISHN.role} size={3.7} ring="flame" plate maxPx={D.KRISHN.px} />
      </div>
      <div className="s42-chip s42-chip--arya">
        <Person src={pic(D.ARYA.photoSlide, D.ARYA.photo)} name={D.ARYA.name} role={D.ARYA.role} size={3.7} ring="flame" plate />
      </div>

      {/* the navigation banner of slide 43: one instruction at a time */}
      <div className="s42-nav">
        <span className="s42-nav-disc">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 19V5.5M6.2 11.2 12 5.4l5.8 5.8" />
          </svg>
        </span>
        <span className="s42-nav-texts">
          {D.NAV.map((t, i) => (
            <span key={i} className={`s42-nav-t s42-nav-t--${i}`}>
              {t}
            </span>
          ))}
        </span>
      </div>

      {/* what stands over the town: each follows its own point of the map */}
      {(Object.keys(D.SPEECH) as (keyof typeof D.SPEECH)[]).map((k) => (
        <div key={k} className={`s42-trk s42-trk--${k}`}>
          <div className="s42-off">
            <span className="s42-say">
              <em>?</em> {D.SPEECH[k]}
            </span>
          </div>
        </div>
      ))}
      <div className="s42-trk s42-trk--tags">
        <div className="s42-off">
          <span className="s42-tag s42-tag--red">{D.END_TAGS[0]}</span>
          <span className="s42-tag s42-tag--navy">{D.END_TAGS[1]}</span>
        </div>
      </div>
      <div className="s42-trk s42-trk--rank">
        <div className="s42-off">
          <span className="s42-rank">{D.RANK}</span>
        </div>
      </div>
      <div className="s42-trk s42-trk--me">
        <div className="s42-off">
          <span className="s42-me">
            <img src={pic(42, D.KRISHN.photo)} alt={D.KRISHN.name} draggable={false} />
          </span>
        </div>
      </div>

      {/* the five tasks */}
      <div className="s42-cards">
        {D.STEPS.map((s) => (
          <div key={s.n} className="s42-card">
            <div className="s42-card-sh">
              <div className="s42-card-plate">
                <div className="s42-card-warm" />
              </div>
            </div>
            <div className="s42-card-head">
              <span className="s42-num">{s.n}</span>
              <b>{s.title}</b>
            </div>
            <div className="s42-before">
              <p>
                <Rich text={s.before} bold={s.beforeBold} />
              </p>
              <span className="s42-verdict">{s.verdict}</span>
            </div>
            <div className="s42-after">
              <div className="s42-says">
                <img src={pic(D.ARYA.photoSlide, D.ARYA.photo)} alt="" draggable={false} />
                <span>{D.SAYS}</span>
              </div>
              <p>
                <Rich text={s.after} bold={s.afterBold} counts={s.n === 5 ? COUNTS : undefined} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  three(ctx) {
    const routes = makeRoutes()
    const t3 = makeTown3D(ctx, routes, MAP)
    ctx.bag.t3 = t3
    ctx.bag.routes = routes
    return t3.dispose
  },

  build(ctx) {
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const { U, ease } = ctx
    const fx = ctx.backdrop.fx
    const t3 = ctx.bag.t3 as Town3D | undefined
    const R = (ctx.bag.routes as Routes | undefined) ?? makeRoutes()
    const st = townState()
    const calm = ctx.reduced

    /* ---------------------------------------------------------------- the DOM over the town */
    const project = t3
      ? t3.project
      : (x: number, y: number, z = 0) => ({ x: (FLAT.x + x * FLAT.k) * U, y: (FLAT.y + (y - z * 0.58) * FLAT.k) * U })
    const spurEnd = R.S1.at(R.S1.len)
    const loop = R.redAt(R.red.loop)
    const top = R.redAt(R.red.top)
    const dead = R.S2.at(R.S2.len)
    const trackers: { el: HTMLElement; at: () => [number, number, number] }[] = [
      { el: ctx.$('.s42-trk--asks'), at: () => [spurEnd.x, spurEnd.y, 0] },
      { el: ctx.$('.s42-trk--calls'), at: () => [loop.x, loop.y, 0] },
      { el: ctx.$('.s42-trk--digs'), at: () => [top.x, top.y, 0] },
      { el: ctx.$('.s42-trk--wrong'), at: () => [dead.x, dead.y, 0] },
      { el: ctx.$('.s42-trk--tags'), at: () => [STOPS[4][0], STOPS[4][1], 0] },
      { el: ctx.$('.s42-trk--rank'), at: () => [DEST[0], DEST[1], PIN.h * 0.72] },
      {
        el: ctx.$('.s42-trk--me'),
        at: () => {
          const m = markerAt(R, st)
          return [m.x, m.y, CARRY]
        },
      },
    ]
    const flatRed = ctx.$$<SVGPolylineElement>('.s42-flat-red')
    const flatBlue = ctx.$$<SVGPolylineElement>('.s42-flat-blue, .s42-flat-bed')
    const flatGhost = ctx.$$<SVGPolylineElement>('.s42-flat-ghost')
    const flatPlan = ctx.$$<SVGPolylineElement>('.s42-flat-plan, .s42-flat-planbed')
    const apply = () => {
      if (t3) t3.sync(st)
      else {
        R.pieces.forEach((p, i) => {
          const drawn = Math.min(Math.max(st.d - p.from, 0), p.path.len + 1)
          flatRed[i].style.strokeDasharray = `${drawn.toFixed(2)} 400`
          flatRed[i].style.opacity = String(drawn > 0.01 ? st.red : 0)
          flatGhost[i].style.opacity = String(Math.max(st.d, st.gd) - p.from > 0.01 ? st.ghost : 0)
        })
        for (const el of flatPlan) {
          el.style.strokeDasharray = `${st.p.toFixed(2)} 400`
          el.style.opacity = st.p > 0.01 ? String(st.plan) : '0'
        }
        for (const el of flatBlue) {
          el.style.strokeDasharray = `${st.b.toFixed(2)} 400`
          el.style.opacity = st.b > 0.01 ? '1' : '0'
        }
      }
      for (const t of trackers) {
        const [x, y, z] = t.at()
        const p = project(x, y, z)
        t.el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`
      }
    }
    if (t3) t3.gl.onFrame(apply)
    else {
      gsap.set(ctx.$('.s42-flat'), { autoAlpha: 1 })
      ctx.onSeek(apply)
    }

    /* ---------------------------------------------------------------- starting states */
    const cards = ctx.$$('.s42-card')
    const plates = ctx.$$('.s42-card-plate')
    const rad = (1.3 * U).toFixed(2)
    const SHUT = `inset(0% 0% 67% 0% round ${rad}px)`
    const OPEN = `inset(0% 0% 0% 0% round ${rad}px)`
    gsap.set(plates, { clipPath: SHUT })
    const warm = ctx.$$('.s42-card-warm')
    gsap.set(warm, { autoAlpha: 0 })
    const beforeOf = (i: number) => Array.from(cards[i].querySelectorAll('.s42-before > *'))
    const afterOf = (i: number) => Array.from(cards[i].querySelectorAll('.s42-after > *'))
    cards.forEach((_, i) => gsap.set([...beforeOf(i), ...afterOf(i)], { autoAlpha: 0, y: 0.9 * U }))
    const navT = ctx.$$('.s42-nav-t')
    gsap.set(navT, { autoAlpha: 0, yPercent: 70 })
    const me = ctx.$('.s42-me')
    const disc = ctx.$('.s42-nav-disc')
    const says = (k: string) => ctx.$(`.s42-trk--${k} .s42-say`)

    /* ---------------------------------------------------------------- small moves */
    /** A timeline position ('>-0.1', a label, a number) as a time in seconds. */
    const when = (at: gsap.Position): number => {
      if (typeof at === 'number') return at
      tl.addLabel('s42-when', at)
      const t = tl.labels['s42-when']
      tl.removeLabel('s42-when')
      return t
    }
    /** Under a whole beat (from the rest `from` to now): the backdrop's light walks along, the view pushes in and eases back. */
    const under = (from: string, look: gsap.TweenVars, rest = 0.3) => {
      const t0 = tl.labels[from]
      const duration = Math.max(tl.duration() - t0, 0.5)
      tl.to(fx, { ...look, duration, ease: 'sine.inOut' }, t0)
      if (t3 && !calm) {
        tl.to(st, { zoom: 1, duration: duration * 0.5, ease: 'sine.inOut' }, t0)
        tl.to(st, { zoom: rest, duration: duration * 0.5, ease: 'sine.inOut' }, t0 + duration * 0.5)
      }
    }
    /** He drives on to `d`. */
    const drive = (d: number, duration: number, e: gsap.EaseFunction | string = 'power2.inOut', at: gsap.Position = '>') => tl.to(st, { d, duration, ease: e }, at)
    /** He looks left and right. */
    const look = (at: gsap.Position = '>') => {
      if (calm) return tl.to(st, { look: 0, duration: 0.5 }, at)
      tl.to(st, { look: 0.85, duration: 0.24, ease: 'sine.inOut' }, at)
      tl.to(st, { look: -0.85, duration: 0.36, ease: 'sine.inOut' })
      return tl.to(st, { look: 0, duration: 0.26, ease: 'sine.inOut' })
    }
    /** The marker reaches a stop: its pin lifts, a ring opens on the road. */
    const reach = (i: number, at: gsap.Position = '>') => {
      const t = when(at)
      if (t3) {
        const ring = t3.rings[i]
        const mat = ring.material as { opacity: number }
        tl.set(ring.scale, { x: 1, y: 1 }, t)
        tl.set(mat, { opacity: 0.95 }, t)
        tl.to(ring.scale, { x: 3.4, y: 3.4, duration: 0.9, ease: 'power2.out' }, t)
        tl.to(mat, { opacity: 0, duration: 0.9, ease: 'power1.out' }, t)
        if (i < 5 && !calm) {
          tl.to(t3.pins[i].position, { z: 1.7, duration: 0.2, ease: 'power2.out' }, t)
          tl.to(t3.pins[i].position, { z: 0, duration: 0.3, ease: 'power2.in' }, t + 0.2)
        }
      }
      return t
    }
    /** A card opens and says what happens at its stop: the words come with the box, not after it. */
    const openCard = (i: number, which: 'before' | 'after', at: gsap.Position) => {
      tl.to(plates[i], { clipPath: OPEN, duration: 0.5, ease: ease.out }, at)
      tl.to(which === 'before' ? beforeOf(i) : afterOf(i), { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.06, ease: ease.out }, '<0.06')
    }
    /** The banner gives its next instruction. */
    const instruct = (i: number, at: gsap.Position) => {
      if (i > 0) tl.to(navT[i - 1], { autoAlpha: 0, yPercent: -70, duration: 0.28, ease: 'power2.in' }, at)
      tl.to(navT[i], { autoAlpha: 1, yPercent: 0, duration: 0.5, ease: ease.out }, i > 0 ? '>-0.06' : at)
      if (i > 0 && !calm) {
        tl.to(disc, { scale: 1.16, duration: 0.16, ease: 'power2.out' }, at)
        tl.to(disc, { scale: 1, duration: 0.4, ease: 'power2.out' }, '>')
      }
    }
    /** When a tween with power1.inOut from `a` to `b` passes `x`, as a fraction of its duration. */
    const passes = (a: number, b: number, x: number) => {
      const f = Math.min(Math.max((x - a) / (b - a), 0), 1)
      return f < 0.5 ? Math.sqrt(f / 2) : 1 - Math.sqrt((1 - f) / 2)
    }

    /* ================================================================ 42 · town */
    a.words('.s42-h--42', 0.1)
    const row = ctx.$('.s42-cards')
    let y0 = 0
    if (t3) {
      const { town, pins, dots, pinShadows } = t3
      y0 = town.position.y
      const tilt = town.rotation.x
      gsap.set(t3.gl.canvas, { autoAlpha: 0 })
      tl.to(t3.gl.canvas, { autoAlpha: 1, duration: 0.7, ease: 'power1.out' }, 0.2)
      if (!calm) {
        town.rotation.x = tilt * 0.22
        town.rotation.y = 0.1
        town.position.y = y0 - HERO.dy - 5
        town.position.z = -16
        tl.to(town.rotation, { x: tilt, y: 0, duration: 2.0, ease: ease.inOut }, 0.2)
        tl.to(town.position, { y: y0 - HERO.dy, z: HERO.z, duration: 2.0, ease: ease.out }, 0.2)
      } else {
        town.position.y = y0 - HERO.dy
        town.position.z = HERO.z
      }
      // the dots open on the roads, the pins drop on them
      ;[...dots].forEach((dot, i) => {
        dot.scale.setScalar(0.0001)
        tl.to(dot.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: ease.snap }, 1.25 + i * 0.1)
      })
      pins.forEach((pin, i) => {
        const at = 1.5 + i * 0.13
        const sh = pinShadows[i]
        const shm = sh.material as { opacity: number }
        pin.scale.setScalar(0.0001)
        shm.opacity = 0
        sh.scale.setScalar(0.3)
        tl.to(pin.scale, { x: 1, y: 1, z: 1, duration: calm ? 0.4 : 0.16, ease: 'power2.out' }, at)
        tl.to(shm, { opacity: 1, duration: 0.5, ease: 'power1.out' }, at)
        tl.to(sh.scale, { x: 1, y: 1, duration: 0.5, ease: 'power2.in' }, at)
        if (!calm) {
          pin.position.z = 11
          tl.to(pin.position, { z: 0, duration: 0.46, ease: 'power2.in' }, at)
          tl.to(pin.position, { z: 0.9, duration: 0.14, ease: 'power2.out' }, at + 0.46)
          tl.to(pin.position, { z: 0, duration: 0.2, ease: 'power2.in' }, at + 0.6)
        }
      })
    }
    /** The town and the row of tasks: to the first rest's large placement, or to their working places. */
    const place = (hero: boolean, at: number, duration = 1.0) => {
      tl.to(row, { y: hero ? HERO.cards * U : 0, duration, ease: ease.inOut }, at)
      if (t3) tl.to(t3.town.position, { y: hero ? y0 - HERO.dy : y0, z: hero ? HERO.z : 0, duration, ease: ease.inOut }, at)
      if (!calm) tl.to(st, { follow: hero ? 0 : 1, duration, ease: ease.inOut }, at)
    }
    a.rise('.s42-chip--krishn', 0.9, { y: 1.2 })
    // until he sets off the town has the stage: it stands larger and lower, the five tasks under it
    gsap.set(row, { y: HERO.cards * U })
    a.rise('.s42-card', 1.3, { y: 1.4, stagger: 0.08 })
    tl.to(st, { mark: 1, duration: 0.55, ease: ease.snap }, 2.35)
    a.pop(me, 2.4)
    tl.to(fx, { warm: 0.25, glow: 0.2, focusX: -0.75, focusY: 0.1, duration: 2.0 }, 0.4)
    tl.addLabel('town', 3.05)

    /* ================================================================ 42 · ask (stop 1) */
    place(false, tl.labels.town)
    drive(R.red.spur1, 1.0, 'power2.inOut', 'town+=0.35')
    a.pop(says('asks'), '>-0.15')
    look('<0.05')
    drive(R.red.back1, 0.62, 'power2.inOut', '>-0.1')
    drive(R.red.stop1, 0.5, 'power2.out')
    openCard(0, 'before', reach(0, '>-0.12'))
    under('town', { focusX: -0.6 })
    tl.addLabel('ask')

    /* ================================================================ 42 · recall (stop 2) */
    drive(R.red.loop, 1.0, 'power2.inOut', 'ask')
    a.pop(says('calls'), '>-0.15')
    look('<0.05')
    drive(R.red.stop2, 0.95, 'power2.inOut', '>-0.2')
    openCard(1, 'before', reach(1, '>-0.12'))
    under('ask', { focusX: -0.35 })
    tl.addLabel('recall')

    /* ================================================================ 42 · dig (stop 3) */
    drive(R.red.top, 1.05, 'power2.inOut', 'recall')
    a.pop(says('digs'), '>-0.15')
    look('<0.05')
    drive(R.red.stop3, 1.05, 'power2.inOut', '>-0.2')
    openCard(2, 'before', reach(2, '>-0.12'))
    under('recall', { focusX: 0 })
    tl.addLabel('dig')

    /* ================================================================ 42 · stuck (stop 4) */
    drive(R.red.spur2, 1.0, 'power2.inOut', 'dig')
    a.pop(says('wrong'), '>-0.15')
    look('<0.05')
    drive(R.red.back2, 0.62, 'power2.inOut', '>-0.15')
    drive(R.red.stop4, 0.6, 'power2.out')
    openCard(3, 'before', reach(3, '>-0.12'))
    under('dig', { focusX: 0.3 })
    tl.addLabel('stuck')

    /* ================================================================ 42 · missed */
    drive(R.red.end, 1.7, 'power2.inOut', 'stuck')
    const missedAt = reach(4, '>-0.1')
    openCard(4, 'before', missedAt)
    a.pop('.s42-tag--red', missedAt + 0.25, { duration: 0.5, ease: ease.slam, from: 1.5 })
    a.pop('.s42-tag--navy', missedAt + 0.5)
    if (t3) {
      // the destination he did not reach: its ring stays open
      const ring = t3.rings[5]
      const mat = ring.material as { opacity: number }
      tl.set(ring.scale, { x: 1, y: 1 }, missedAt + 0.5)
      tl.to(ring.scale, { x: 2.1, y: 2.1, duration: 0.8, ease: 'power2.out' }, missedAt + 0.5)
      tl.to(mat, { opacity: 0.85, duration: 0.5 }, missedAt + 0.5)
    }
    under('stuck', { focusX: 0.7, warm: 0.45 }, 0)
    tl.addLabel('missed', tl.duration() + 0.05)

    /* ================================================================ 43 · arya: the hinge */
    const H = tl.labels.missed
    // 1 · the headline and the chip hand over. The red tangle still lies there.
    a.retitle('.s42-h--42', '.s42-h--43', H)
    tl.to([says('asks'), says('calls'), says('digs'), says('wrong'), ctx.$('.s42-tag--red'), ctx.$('.s42-tag--navy')], { autoAlpha: 0, scale: 0.8, duration: 0.3, stagger: 0.03, ease: 'power2.in' }, H + 0.1)
    tl.to(ctx.$('.s42-chip--krishn'), { autoAlpha: 0, y: -0.8 * U, duration: 0.35, ease: 'power2.in' }, H + 0.1)
    a.rise('.s42-chip--arya', H + 0.4, { y: 1.2 })
    tl.to(fx, { warm: -0.35, glow: 0.3, focusX: -0.7, focusY: 0, duration: 2.4, ease: 'sine.inOut' }, H + 0.3)
    if (t3) tl.to(t3.rings[5].material as { opacity: number }, { opacity: 0, duration: 0.4 }, H + 0.3)
    // 2 · the red route is taken back along its own length; he rides it home. Under it lies the thin white ghost.
    const REWIND = 1.7
    const r0 = H + 0.75
    tl.set(st, { gd: R.total, ghost: 1, rev: 1 }, r0)
    tl.to(st, { d: 0, duration: REWIND, ease: 'power2.inOut' }, r0)
    tl.to(st, { tone: 1, duration: 0.5, ease: 'none' }, r0 + REWIND - 0.45)
    tl.set(st, { rev: 0, onBlue: 1 }, r0 + REWIND + 0.02)
    // the cards close as the route leaves them, the last first: words and box together
    for (let i = 4; i >= 0; i--) {
      const t = r0 + 0.1 + (4 - i) * 0.2
      tl.to(beforeOf(i), { autoAlpha: 0, y: -0.4 * U, duration: 0.26, ease: 'power2.in' }, t)
      tl.to(plates[i], { clipPath: SHUT, duration: 0.42, ease: ease.inOut }, t)
      tl.to(warm[i], { autoAlpha: 1, duration: 0.5 }, t + 0.3)
    }
    // the whole town comes forward again, the five tasks under it
    place(true, r0 + 0.7, 1.2)
    // 3 · the banner comes down
    const n0 = r0 + REWIND - 0.15
    a.rise('.s42-nav', n0, { y: -2.4, duration: 0.8 })
    instruct(0, n0 + 0.35)
    if (!calm) {
      tl.to(me, { scale: 1.14, duration: 0.18, ease: 'power2.out' }, n0 + 0.2)
      tl.to(me, { scale: 1, duration: 0.4, ease: 'power2.out' }, n0 + 0.38)
    }
    // 4 · the route Arya has planned: ONE line, through all five stops, to the destination
    const PLAN = 1.5
    const p0 = n0 + 0.55
    tl.set(st, { plan: 1 }, p0)
    tl.to(st, { p: R.blu.end, duration: PLAN, ease: 'power1.inOut' }, p0)
    R.blu.stops.forEach((sAt, i) => reach(i, p0 + PLAN * passes(0, R.blu.end, sAt)))
    reach(5, p0 + PLAN - 0.05)
    tl.to(fx, { focusX: 0.2, glow: 0.4, duration: PLAN, ease: 'sine.inOut' }, p0)
    tl.addLabel('arya', tl.duration() + 0.05)

    /* ================================================================ 43 · guided (stops 1 and 2) */
    const G = tl.labels.arya
    place(false, G)
    const glide = (from: number, via: number, to: number, at: number, duration: number) => {
      tl.to(st, { b: to, duration, ease: 'power1.inOut' }, at)
      return [at + duration * passes(from, to, via), at + duration - 0.12] as const
    }
    {
      const [mid, end] = glide(0, R.blu.stops[0], R.blu.stops[1], G + 0.35, 2.7)
      openCard(0, 'after', reach(0, mid))
      instruct(1, end - 0.3)
      openCard(1, 'after', reach(1, end))
    }
    under('arya', { focusX: -0.3, glow: 0.3 })
    tl.addLabel('guided')

    /* ================================================================ 43 · onward (stops 3 and 4) */
    {
      const O = tl.labels.guided
      const [mid, end] = glide(R.blu.stops[1], R.blu.stops[2], R.blu.stops[3], O, 3.0)
      instruct(2, mid - 0.3)
      openCard(2, 'after', reach(2, mid))
      instruct(3, end - 0.3)
      openCard(3, 'after', reach(3, end))
    }
    under('guided', { focusX: 0.3 })
    tl.addLabel('onward')

    /* ================================================================ 43 · rank */
    {
      const K = tl.labels.onward
      instruct(4, K + 0.1)
      const [mid, end] = glide(R.blu.stops[3], R.blu.stops[4], R.blu.end, K, 2.3)
      openCard(4, 'after', reach(4, mid))
      a.count(Array.from(cards[4].querySelectorAll('.s42-count')), mid + 0.25, { duration: 1.1 })
      reach(5, end)
      a.pop('.s42-rank', end + 0.07, { duration: 0.55, ease: ease.slam, from: 1.6 })
    }
    under('onward', { focusX: 0.8, warm: 0.1, glow: 0.45 }, 0)
    tl.addLabel('rank', tl.duration() + 0.05)

    // without WebGL nothing redraws the lines by itself: this does, for the whole length of the timeline
    if (!t3) tl.to({}, { duration: tl.duration(), onUpdate: apply }, 0)
    apply()
    return tl
  },
}

export default scene
