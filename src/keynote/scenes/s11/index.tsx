'use client'

/**
 * Slide 11 · 1. “What do I talk about when I talk about AI ?”
 *
 * The approved redesign of this slide: TWO WOVEN RIBBON RINGS in the Piramal AI Day colours
 * (exports/ai-view/AI-View-woven-rings.jpg, generator exports/_rig/build_weave.py), built live.
 * Every word is the deck's (pack/11/text.json → data.ts); nothing is added, nothing changed.
 *
 *   what   the two ribbons of the WHAT ring draw themselves round, weaving over and under each
 *          other; as their heads pass a family its three dots land, its capabilities come up and
 *          its name arrives: PREDICTIVE, PERCEPTION, GENERATIVE, LANGUAGE. "WHAT" settles in the middle.
 *   how    the plus; the HOW ring weaves itself the same way; AGENTIC over the top, PRODUCTS &
 *          SYSTEMS along the bottom.
 *   more   the closing lines. Everything steps back for a moment and ONE dot of the twenty stays
 *          lit: LLMs. "AI is much more than LLMs" comes up, and then the whole weave returns, a
 *          light running a lap round each ring: an interconnected ecosystem.
 *
 * The rings are real ribbons on a scene-owned canvas (weave.ts): they pass over and under each
 * other in depth, lit, with a soft shadow, and sway very slightly while the room waits. Without
 * WebGL the same rings are drawn flat in SVG (.s11-fb), from the first rest on.
 */

import gsap from 'gsap'
import type { CSSProperties } from 'react'
import { anim, Headline, Words, type SceneModule } from '../../kit'
import {
  angColour,
  CLOSING,
  CLOSING_SUB,
  CORE,
  css,
  DOT_R,
  dotRadius,
  FAMILIES,
  HOW_RING,
  labelRadius,
  polar,
  ribbonR,
  ringOf,
  THE_ONE,
  WHAT_SOLO,
  WHAT_SOLO_CX,
  tint,
  WHAT_RING,
  type Family,
  type Item,
  type RingSpec,
} from './data'
import { makeWeave, type Weave, type WovenRing } from './weave'
import './scene.css'

const u = (n: number) => `calc(var(--u) * ${n.toFixed(3)})`
const flat = (it: Item) => (it.line ? it.text.replace('\n', ' ') : it.text)

/** Where a label stands: its nearest edge on the ray through its dot, as the approved design places it. */
function labelStyle(f: Family, it: Item): { side: 'l' | 'r' | 't' | 'b'; style: CSSProperties } {
  const [x, y] = polar(ringOf(f.ring), labelRadius(f, it), it.deg)
  const c = Math.cos((it.deg * Math.PI) / 180)
  const s = Math.sin((it.deg * Math.PI) / 180)
  const side = c > 0.35 ? 'r' : c < -0.35 ? 'l' : s > 0 ? 't' : 'b'
  const beside = side === 'l' || side === 'r'
  const lift = beside ? 0.6 * s : 0
  // on a steep ray the label would stand over its own dot: it steps aside a little
  const aside = beside ? Math.sign(c) * 0.55 * Math.min(1, Math.max(0, (Math.abs(s) - 0.6) / 0.3)) : 0
  return { side, style: { left: u(x + aside), top: u(y - lift) } }
}

/** Where a family's name stands, beside its ring. */
function nameStyle(f: Family): CSSProperties {
  const ring = ringOf(f.ring)
  const what = f.ring === 'what'
  const d = { top: [0, what ? -15.7 : -12.9], bottom: [0, what ? 15.7 : 12.9], left: [-20.9, 0], right: [21.9, 0] }[f.side]
  return { left: u(ring.cx + d[0]), top: u(ring.cy + d[1]) }
}

/** How far round its ring (0 … 1, clockwise from the ring's start) an angle lies: when the ribbon's head passes it. */
const along = (ring: RingSpec, deg: number) => ((((ring.start - deg) % 360) + 360) % 360) / 360

/* ------------------------------------------------------------------ the flat rings (no WebGL) */

function arc(ring: RingSpec, sign: 1 | -1, d0: number, d1: number): string {
  const steps = Math.max(2, Math.ceil(Math.abs(d1 - d0) / 2))
  let d = ''
  for (let i = 0; i <= steps; i++) {
    const deg = d0 + ((d1 - d0) * i) / steps
    const [x, y] = polar(ring, ribbonR(ring, sign, deg), deg)
    d += `${i ? 'L' : 'M'}${x.toFixed(3)} ${y.toFixed(3)}`
  }
  return d
}

function FlatRing({ ring }: { ring: RingSpec }) {
  const STEP = 10
  const pieces: { key: string; d: string; colour: string }[] = []
  for (const sign of [1, -1] as const) {
    for (let i = 0; i < 360 / STEP; i++) {
      const d0 = ring.start - i * STEP + 0.4
      const d1 = ring.start - (i + 1) * STEP - 0.4
      const c = angColour((d0 + d1) / 2, ring.stops)
      pieces.push({ key: `${sign}-${i}`, d: arc(ring, sign, d0, d1), colour: css(sign > 0 ? c : tint(c, 0.34)) })
    }
  }
  // ribbon A back over ribbon B at every other crossing
  const step = 360 / ring.lobes
  for (let k = 0; k < ring.lobes; k += 2) {
    const x = ring.phase + step / 2 + k * step
    pieces.push({ key: `x-${k}`, d: arc(ring, 1, x + step * 0.34, x - step * 0.34), colour: css(angColour(x, ring.stops)) })
  }
  return (
    <g className={`s11-fb-ring s11-fb-ring--${ring.key}`} fill="none" strokeWidth={ring.w}>
      {pieces.map((p) => (
        <path key={p.key} className="s11-fb-arc" d={p.d} stroke={p.colour} />
      ))}
      {FAMILIES.filter((f) => f.ring === ring.key).flatMap((f) =>
        f.items.map((it) => {
          const [x, y] = polar(ring, dotRadius(f, it), it.deg)
          return <circle key={it.text} className="s11-fb-dot" data-fam={f.key} data-one={flat(it) === THE_ONE ? 1 : 0} cx={x} cy={y} r={DOT_R} fill={css(f.colour)} stroke="none" />
        }),
      )}
    </g>
  )
}

/* ------------------------------------------------------------------ the scene */

const scene: SceneModule = {
  beats: ['what', 'how', 'more'],

  Scene: ({ slide }) => (
    <div className="s11">
      <Headline text={slide.title} flame={['AI']} />

      <svg className="s11-fb" viewBox="0 0 100 56.25" aria-hidden="true">
        <FlatRing ring={WHAT_RING} />
        <FlatRing ring={HOW_RING} />
      </svg>

      <div className="s11-side s11-side--what">
        <div className="s11-core s11-core--what" style={{ left: u(WHAT_RING.cx), top: u(WHAT_RING.cy) }}>
          <span className="s11-core-t">{CORE.what}</span>
        </div>
      </div>
      <div className="s11-core s11-core--how" style={{ left: u(HOW_RING.cx), top: u(HOW_RING.cy) }}>
        <span className="s11-core-t">{CORE.how}</span>
      </div>

      {FAMILIES.map((f) => (
        <div key={f.key} className={`s11-side s11-side--${f.ring}`}>
          <div className="s11-fam" data-fam={f.key} data-side={f.side} style={{ ...nameStyle(f), color: f.ink }}>
            <span className="s11-fam-t">{f.name}</span>
          </div>
          {f.items.map((it) => {
            const { side, style } = labelStyle(f, it)
            return (
              <div key={it.text} className="s11-lab" data-fam={f.key} data-side={side} data-one={flat(it) === THE_ONE ? 1 : 0} style={style}>
                <span className="s11-lab-t">{flat(it)}</span>
              </div>
            )
          })}
        </div>
      ))}

      <svg className="s11-plus" viewBox="0 0 10 10" aria-hidden="true">
        <path d="M5 0.6V9.4" />
        <path d="M0.6 5H9.4" />
      </svg>

      <p className="s11-close">
        <Words text={CLOSING} />
      </p>
      <p className="s11-sub">
        <Words text={CLOSING_SUB} />
      </p>
    </div>
  ),

  three(ctx) {
    const weave = makeWeave(ctx)
    ctx.bag.weave = weave
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      weave.gl.dispose()
    }
  },

  build(ctx) {
    const { ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const weave = ctx.bag.weave as Weave | undefined
    const q = (sel: string) => ctx.$$(sel)

    /** The time at which a ribbon's head (a sine.inOut run of `dur` from `t0`) has come `f` of the way round. */
    const headAt = (t0: number, dur: number, f: number) => t0 + (dur * Math.acos(1 - 2 * Math.min(1, Math.max(0, f)))) / Math.PI

    /** One ring weaves itself from `t0`; its families land as the head passes them. Returns the time it rests. */
    const weaveRing = (ring: RingSpec, woven: WovenRing | undefined, t0: number, dur: number, size = 1): number => {
      const LAG = 0.22
      if (woven) {
        if (reduced) {
          // less motion: the ring is simply there, whole, and comes up out of the page
          gsap.set([woven.a, woven.b], { value: 0 })
          gsap.set(woven.fade, { value: 1 })
          tl.set([woven.a, woven.b], { value: woven.END }, t0)
          tl.to(woven.fade, { value: 0, duration: 0.8, ease: 'power1.out' }, t0)
        } else {
          gsap.set([woven.a, woven.b], { value: 0 })
          tl.to(woven.a, { value: woven.END, duration: dur, ease: 'sine.inOut' }, t0)
          tl.to(woven.b, { value: woven.END, duration: dur, ease: 'sine.inOut' }, t0 + LAG)
          // it arrives leaning back and settles flat as it closes
          gsap.set(woven.pose.rotation, { x: -0.8 })
          gsap.set(woven.pose.scale, { x: 0.9 * size, y: 0.9 * size, z: 0.9 * size })
          tl.to(woven.pose.rotation, { x: 0, duration: dur * 0.72, ease: 'power3.out' }, t0)
          tl.to(woven.pose.scale, { x: size, y: size, z: size, duration: dur * 0.72, ease: 'power3.out' }, t0)
        }
      } else {
        // flat: the pieces of the two ribbons come in round the ring
        const arcs = q(`.s11-fb-ring--${ring.key} .s11-fb-arc`)
        gsap.set(arcs, { autoAlpha: 0 })
        if (arcs.length) tl.to(arcs, { autoAlpha: 1, duration: 0.3, stagger: dur / arcs.length, ease: 'none' }, t0)
      }
      let rest = t0 + dur + LAG
      for (const f of FAMILIES) {
        if (f.ring !== ring.key) continue
        const first = Math.min(...f.items.map((it) => along(ring, it.deg)))
        // its name, as the head enters its part of the ring
        const name = q(`.s11-fam[data-fam="${f.key}"] .s11-fam-t`)
        a.rise(name, headAt(t0, dur, first - 0.03) + 0.1, { y: 0.7, duration: 0.7 })
        f.items.forEach((it) => {
          const t = headAt(t0, dur, along(ring, it.deg)) + LAG * 0.6
          const bead = woven?.beads.find((b) => b.item === it)
          if (bead) {
            gsap.set(bead.mesh.scale, { x: 0.0001, y: 0.0001, z: 0.0001 })
            tl.to(bead.mesh.scale, { x: DOT_R, y: DOT_R, z: DOT_R, duration: reduced ? 0.01 : 0.55, ease: ease.snap }, t)
          }
          rest = Math.max(rest, t + 0.14 + 0.7)
        })
        if (!woven) a.pop(q(`.s11-fb-dot[data-fam="${f.key}"]`), headAt(t0, dur, first) + LAG * 0.6, { stagger: 0.1 })
        // its capabilities, each just after its dot
        const labels = q(`.s11-lab[data-fam="${f.key}"] .s11-lab-t`)
        labels.forEach((el, i) => a.rise(el, headAt(t0, dur, along(ring, f.items[i].deg)) + LAG * 0.6 + 0.14, { y: 0.8, duration: 0.7 }))
      }
      return rest
    }

    /* ----------------------------------------------------------------- what */
    // WHAT weaves itself in the MIDDLE of the stage, LARGE, and holds it alone; when HOW is called for it
    // comes down to its own size and steps aside to its place (the ribbons, their shadow, the dots and every word, as one)
    const SHIFT = reduced ? 0 : 50 - WHAT_SOLO_CX
    const SIZE = reduced ? 1 : WHAT_SOLO.scale
    const DY = reduced ? 0 : WHAT_SOLO.dy
    a.words('.kn-h', 0.1)
    // the light opens and the ribbons set off while the headline is still writing itself: the stage is never bare
    tl.to(fx, { glow: 0.34, focusX: reduced ? (WHAT_RING.cx - 50) / 50 : (WHAT_RING.cx - WHAT_SOLO_CX) / 50, focusY: reduced ? -0.05 : 0.08, warm: 0.12, duration: 2.0, ease: 'power2.out' }, 0.08)
    const W0 = 0.22
    const whatRest = weaveRing(WHAT_RING, weave?.what, W0, 2.2, SIZE)
    a.rise('.s11-core--what .s11-core-t', 0.3, { y: 0, scale: 0.86, duration: 0.9 })
    const L1 = Math.max(whatRest, 3.4)
    tl.addLabel('what', L1)

    if (SHIFT) {
      const sides = q('.s11-side--what')
      const flatRing = q('.s11-fb-ring--what')
      const MOVE = 1.2
      // everything read scales about the ring's own centre, exactly as the ribbons do
      gsap.set(sides, { x: SHIFT * ctx.U, y: DY * ctx.U, scale: SIZE, transformOrigin: `${WHAT_RING.cx * ctx.U}px ${WHAT_RING.cy * ctx.U}px` })
      tl.to(sides, { x: 0, y: 0, scale: 1, duration: MOVE, ease: ease.inOut }, L1)
      if (weave) {
        const pose = weave.what.pose
        const home = { x: pose.position.x, y: pose.position.y }
        gsap.set(pose.position, { x: home.x + SHIFT, y: home.y - DY })
        tl.to(pose.position, { x: home.x, y: home.y, duration: MOVE, ease: ease.inOut }, L1)
        tl.to(pose.scale, { x: 1, y: 1, z: 1, duration: MOVE, ease: ease.inOut }, L1)
      } else if (flatRing.length) {
        gsap.set(flatRing, { x: SHIFT, y: DY, scale: SIZE, svgOrigin: `${WHAT_RING.cx} ${WHAT_RING.cy}` })
        tl.to(flatRing, { x: 0, y: 0, scale: 1, duration: MOVE, ease: ease.inOut }, L1)
      }
    }

    /* ------------------------------------------------------------------ how */
    a.draw('.s11-plus path', L1 + (SHIFT ? 0.75 : 0.05), { duration: 0.5, stagger: 0.14 })
    tl.to(fx, { focusX: 0.25, warm: -0.12, glow: 0.34, duration: 1.8, ease: ease.inOut }, L1)
    const H0 = L1 + (SHIFT ? 0.7 : 0.4)
    const howRest = weaveRing(HOW_RING, weave?.how, H0, 1.7)
    a.rise('.s11-core--how .s11-core-t', H0 + 0.9, { y: 0, scale: 0.86, duration: 0.9 })
    const L2 = Math.max(howRest, H0 + 2.4)
    tl.addLabel('how', L2)

    /* ----------------------------------------------------------------- more */
    // everything steps back; of twenty dots ONE stays lit: LLMs
    const C0 = L2
    const others = [...q('.s11-lab:not([data-one="1"]) .s11-lab-t'), ...q('.s11-fam-t'), ...q('.s11-core-t'), ...q('.s11-plus')]
    const DIM = 0.5
    tl.to(others, { opacity: 0.16, duration: DIM, ease: 'power2.out' }, C0)
    tl.to(fx, { glow: 0.2, focusX: (WHAT_RING.cx - 50) / 50 - 0.2, focusY: -0.1, duration: 0.8, ease: ease.inOut }, C0)
    const one = weave?.what.beads.find((b) => flat(b.item) === THE_ONE)
    if (weave) {
      tl.to([weave.what.fade, weave.how.fade], { value: 0.8, duration: DIM, ease: 'power2.out' }, C0)
      const rest = [...weave.what.beads, ...weave.how.beads].filter((b) => b !== one).map((b) => b.fade)
      tl.to(rest, { value: 0.84, duration: DIM, ease: 'power2.out' }, C0)
      if (one && !reduced) {
        tl.to(one.mesh.scale, { x: DOT_R * 1.5, y: DOT_R * 1.5, z: DOT_R * 1.5, duration: 0.6, ease: ease.snap }, C0 + 0.1)
        tl.to(one.mesh.scale, { x: DOT_R, y: DOT_R, z: DOT_R, duration: 0.7, ease: ease.inOut }, C0 + 1.4)
      }
    } else {
      tl.to([...q('.s11-fb-arc'), ...q('.s11-fb-dot:not([data-one="1"])')], { opacity: 0.16, duration: DIM, ease: 'power2.out' }, C0)
    }

    // the line
    a.words('.s11-close', C0 + 0.5, { stagger: 0.07, duration: 0.85 })

    // … and the whole weave comes back, round the WHAT ring from LLMs on, then across to HOW
    const BACK = C0 + 1.35
    const order = (ring: RingSpec, from: number) =>
      FAMILIES.filter((f) => f.ring === ring.key)
        .flatMap((f) => f.items.map((it) => ({ f, it, k: (((from - it.deg) % 360) + 360) % 360 })))
        .sort((p, r) => p.k - r.k)
    const seq = [...order(WHAT_RING, 150), ...order(HOW_RING, HOW_RING.start)]
    const STEP = 0.055
    const seen = new Set<string>()
    seq.forEach(({ f, it }, i) => {
      const t = BACK + i * STEP + (f.ring === 'how' ? 0.15 : 0)
      const label = q(`.s11-lab[data-fam="${f.key}"] .s11-lab-t`)[f.items.indexOf(it)]
      if (flat(it) !== THE_ONE) tl.to(label, { opacity: 1, duration: 0.5, ease: 'power1.out' }, t)
      const bead = weave ? [...weave.what.beads, ...weave.how.beads].find((b) => b.item === it) : undefined
      if (bead && bead !== one) tl.to(bead.fade, { value: 0, duration: 0.5, ease: 'power1.out' }, t)
      if (!seen.has(f.key)) {
        seen.add(f.key)
        tl.to(q(`.s11-fam[data-fam="${f.key}"] .s11-fam-t`), { opacity: 1, duration: 0.5, ease: 'power1.out' }, t)
      }
    })
    tl.to(q('.s11-core--what .s11-core-t'), { opacity: 1, duration: 0.6, ease: 'power1.out' }, BACK + 0.1)
    tl.to(q('.s11-plus'), { opacity: 1, duration: 0.5, ease: 'power1.out' }, BACK + 0.6)
    tl.to(q('.s11-core--how .s11-core-t'), { opacity: 1, duration: 0.6, ease: 'power1.out' }, BACK + 0.85)
    if (weave) {
      tl.to(weave.what.fade, { value: 0, duration: 0.9, ease: 'power1.inOut' }, BACK)
      tl.to(weave.how.fade, { value: 0, duration: 0.8, ease: 'power1.inOut' }, BACK + 0.7)
      if (!reduced) {
        // a light runs a lap round each ring
        const g = weave.glint
        gsap.set(g, { lap: 0.04, power: 0, ring: 0 })
        tl.to(g, { power: 1, duration: 0.3, ease: 'power1.out' }, BACK)
        tl.to(g, { lap: 1.0, duration: 1.2, ease: 'power1.inOut' }, BACK)
        tl.to(g, { power: 0, duration: 0.3, ease: 'power1.in' }, BACK + 0.92)
        tl.set(g, { ring: 1, lap: 0 }, BACK + 1.24)
        tl.to(g, { power: 1, duration: 0.25, ease: 'power1.out' }, BACK + 1.25)
        tl.to(g, { lap: 1.0, duration: 1.15, ease: 'power1.inOut' }, BACK + 1.25)
        tl.to(g, { power: 0, duration: 0.3, ease: 'power1.in' }, BACK + 2.1)
      }
    } else {
      tl.to([...q('.s11-fb-arc'), ...q('.s11-fb-dot')], { opacity: 1, duration: 0.8, ease: 'power1.out' }, BACK)
    }
    tl.to(fx, { glow: 0.36, focusX: 0, focusY: 0.55, warm: 0.1, duration: 1.6, ease: ease.inOut }, BACK)

    a.words('.s11-sub', BACK + 0.75, { stagger: 0.035, duration: 0.8 })
    tl.addLabel('more', BACK + 2.45)
    return tl
  },
}

export default scene
