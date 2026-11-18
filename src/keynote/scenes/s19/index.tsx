'use client'

/**
 * Slide 19 · "Open-weight models are catching up: they now carry 7 in 10 developer tokens, and a
 * token costs about half."
 *
 * THE IDEA: the tokens themselves are the picture. Ten coins pour out from behind the open
 * padlock and land in a row: these are ten developer tokens. Under them lies a measure from 0 to
 * 100. As 71.5% climbs through April's 13 and August's 56, the measure fills in flame and the
 * coins turn over, one by one, from grey to flame: at rest SEVEN of the TEN are flame. Then the
 * price: every coin shrinks inside a dashed ring of the size it was (its face is now 53% of
 * what it was), while a second measure retreats from 100 to 53 and 47% counts what came off.
 *
 *   share   the headline; the padlock (the deck's photograph, as it is); ten coins land;
 *           71.5% climbs, seven coins turn flame
 *   price   47%; every coin shrinks in its ring; the price measure retreats from 100 to 53
 *   why     the line about enterprises; WHY ENTERPRISES SWITCH and its five pills
 *   news    the two clippings are pinned up
 *
 * The coins are three.js (ten lit, turned meshes that sit exactly on DOM slots); where there is
 * no WebGL, flat DOM discs in the same slots tell the same story.
 */

import gsap from 'gsap'
import { anim, Clipping, Count, createSceneCanvas, Headline, Kicker, Pic, pic, Pill, THREE, Words, type SceneCanvas, type SceneCtx, type SceneModule } from '../../kit'
import { CAPTION, CLIPS, FLAME, PADLOCK, PILLS, PRICE, SHARE, SOURCES, UNDER, WHY } from './data'
import './scene.css'

const N = 10
/** A coin's radius in --u (the slots are 3.9u apart). */
const R = 1.62
/** The price is the AREA of a coin's face: 53% of the area is 72.8% of the width. */
const SHRINK = Math.sqrt(PRICE.bars[1].value / PRICE.bars[0].value)
const GREY = '#b4bed4'
const FLAME_C = '#ff6a40'
/** How many of the ten coins are flame at each printed value: 13% → 1, 56% → 6, 71.5% → 7. */
const coinsAt = (pct: number) => Math.round(pct / 10)

interface Coin {
  slot: THREE.Group
  fly: THREE.Group
  flip: THREE.Group
  idle: THREE.Group
  mat: THREE.MeshStandardMaterial
}
interface Coins {
  gl: SceneCanvas
  coins: Coin[]
  idle: { k: number }
}

const scene: SceneModule = {
  beats: ['share', 'price', 'why', 'news'],
  preload: [pic(19, PADLOCK.name)],

  Scene: ({ slide }) => (
    <div className="s19">
      <Headline text={slide.title} flame={FLAME} />

      {/* the deck's photograph, as it is: framed, never stretched */}
      <figure className="s19-lock">
        <span className="s19-lock-frame">
          <Pic n={19} name={PADLOCK.name} fit="cover" ratio={`${PADLOCK.px[0]} / ${PADLOCK.px[1]}`} />
          <span className="s19-lock-sheen" aria-hidden="true" />
        </span>
        <figcaption className="s19-lock-cap">
          <Words text={CAPTION.text} bold={CAPTION.bold} />
        </figcaption>
      </figure>

      <section className="s19-m s19-m--share">
        <b className="s19-num s19-num--flame">
          <span className="s19-hero">{SHARE.to.toFixed(1)}%</span>
        </b>
        <p className="s19-line">
          <Words text={SHARE.line} bold={SHARE.bold} />
        </p>
      </section>

      <section className="s19-m s19-m--price">
        <b className="s19-num s19-num--navy">
          <Count className="s19-hero" to={PRICE.to} suffix="%" />
        </b>
        <p className="s19-line">
          <Words text={PRICE.line} bold={PRICE.bold} />
        </p>
      </section>

      {/* ten tokens: the slots the coins land on, each with the ring of the size it was */}
      <div className="s19-row" aria-hidden="true">
        {Array.from({ length: N }, (_, i) => (
          <span className="s19-slot" key={i}>
            <span className="s19-ring" />
            <span className="s19-dcoin" />
          </span>
        ))}
      </div>

      {/* the share of tokens: a measure from 0 to 100 under the ten coins */}
      <div className="s19-rule s19-rule--share">
        <span className="s19-track" />
        <span className="s19-fill s19-fill--flame" />
        {SHARE.bars.map((b) => (
          <span className="s19-tick" key={b.label} style={{ left: `${b.value}%` }}>
            <i />
            <span className="s19-tick-t">
              <b>
                {b.value.toFixed(b.decimals)}%
              </b>{' '}
              {b.label}
            </span>
          </span>
        ))}
      </div>

      {/* the price of a token: 100, then 53 */}
      <div className="s19-rule s19-rule--price">
        <span className="s19-track" />
        <span className="s19-fill s19-fill--navy" />
        <span className="s19-ghost" />
        <span className="s19-end s19-end--was">
          {PRICE.bars[0].label} <b>{PRICE.bars[0].value}</b>
        </span>
        <span className="s19-end s19-end--now">
          {PRICE.bars[1].label} <b className="s19-now-n">{PRICE.bars[1].value}</b>
        </span>
      </div>

      <p className="s19-under">
        <Words text={UNDER.text} bold={UNDER.bold} />
      </p>

      <div className="s19-why">
        <Kicker tone="flame" className="s19-why-k">
          {WHY}
        </Kicker>
        {PILLS.map((p) => (
          <Pill key={p.text} tone={p.tone} className="s19-pill">
            {p.text}
          </Pill>
        ))}
      </div>

      {CLIPS.map((c, i) => (
        <Clipping key={c.text} className={`s19-clip s19-clip--${i + 1}`} date={c.date} tape={c.tape} source={c.source} tilt={c.tilt} width={27}>
          {c.text}
        </Clipping>
      ))}

      <p className="s19-src">{SOURCES}</p>
    </div>
  ),

  three(ctx) {
    const gl = createSceneCanvas(ctx)
    // a coin turned on a lathe: a raised rim, a sunk face, a soft edge
    const prof: [number, number][] = [
      [0, 0.13],
      [R * 0.66, 0.13],
      [R * 0.74, 0.26],
      [R * 0.94, 0.26],
      [R, 0.19],
      [R, -0.19],
      [R * 0.94, -0.26],
      [R * 0.74, -0.26],
      [R * 0.66, -0.13],
      [0, -0.13],
    ]
    const geo = new THREE.LatheGeometry(
      prof.map(([x, y]) => new THREE.Vector2(x, y)),
      72,
    )
    geo.rotateX(Math.PI / 2)
    const coins: Coin[] = []
    for (let i = 0; i < N; i++) {
      const mat = new THREE.MeshStandardMaterial({ color: GREY, roughness: 0.3, metalness: 0.05, transparent: true, opacity: 0 })
      const slot = new THREE.Group()
      const fly = new THREE.Group()
      const flip = new THREE.Group()
      const idle = new THREE.Group()
      idle.add(new THREE.Mesh(geo, mat))
      flip.add(idle)
      fly.add(flip)
      slot.add(fly)
      slot.visible = false
      gl.scene.add(slot)
      coins.push({ slot, fly, flip, idle, mat })
    }
    const state = { k: 0 }
    gl.onFrame((time) => {
      const live = !(ctx.held || ctx.reduced)
      coins.forEach((c, i) => {
        // a slow wave of light along the row: each coin leans a little, one after the other
        c.idle.rotation.y = live ? Math.sin(time * 1.1 - i * 0.55) * 0.42 * state.k : 0
        c.idle.rotation.x = live ? Math.sin(time * 0.8 - i * 0.4) * 0.1 * state.k : 0
      })
    })
    ctx.bag.coins = { gl, coins, idle: state } satisfies Coins
    return gl.dispose
  },

  build(ctx) {
    const { U, ease } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const calm = ctx.reduced
    const g = ctx.bag.coins as Coins | undefined

    // measure first
    const slots = ctx.$$('.s19-slot').map((el) => ctx.loc(el))
    const lock = ctx.loc(ctx.$('.s19-lock-frame'))
    const ruleW = ctx.loc(ctx.$('.s19-rule--price')).w

    /* ---------------------------------------------------------------- share */
    a.words('.kn-h', 0.1)

    // the padlock: the frame rises with the photograph already in it; a light crosses it once
    a.rise('.s19-lock-frame', 0.35, { y: 2.2, duration: 0.9 })
    const sheen = ctx.$('.s19-lock-sheen')
    gsap.set(sheen, { xPercent: -160, autoAlpha: 0 })
    if (!calm) {
      tl.set(sheen, { autoAlpha: 1 }, 1.0)
      tl.to(sheen, { xPercent: 260, duration: 1.5, ease: 'power2.inOut' }, 1.0)
    }
    a.words('.s19-lock-cap', 1.0, { stagger: 0.03 })

    // ten tokens come out from behind the open lock and land in a row
    const dcoins = ctx.$$('.s19-dcoin')
    const LAND = 0.95
    const landed = (i: number) => LAND + (N - 1 - i) * 0.085 + 0.95
    if (g) {
      gsap.set(dcoins, { autoAlpha: 0 })
      const sx = (lock.x + lock.w * 0.62) / U
      const sy = (lock.y + lock.h * 0.5) / U
      g.coins.forEach((c, i) => {
        const to = g.gl.at(slots[i].cx / U, slots[i].cy / U)
        const from = g.gl.at(sx, sy)
        const s = { p: 0 }
        const put = () => {
          const p = s.p
          c.slot.visible = p > 0.001
          c.mat.opacity = Math.min(1, p * (calm ? 1 : 5))
          if (calm) {
            c.slot.position.copy(to)
            return
          }
          const hop = Math.sin(Math.PI * p)
          c.slot.position.set(from.x + (to.x - from.x) * p, from.y + (to.y - from.y) * p + hop * 3.2, hop * 6)
          c.fly.rotation.y = (1 - p) * Math.PI * 2
          c.fly.rotation.z = (1 - p) * 0.5
          const k = 0.5 + 0.5 * p
          c.fly.scale.set(k, k, k)
        }
        put()
        // the farthest goes first, so no coin crosses one that has landed
        tl.to(s, { p: 1, duration: 0.95, ease: calm ? 'none' : 'power2.out', onUpdate: put }, LAND + (N - 1 - i) * 0.085)
      })
      gsap.set(g.idle, { k: 0 })
      tl.to(g.idle, { k: 1, duration: 1.2, ease: 'power1.inOut' }, landed(0) + 0.2)
    } else {
      gsap.set(dcoins, { autoAlpha: 0, scale: 0.6, backgroundColor: GREY })
      tl.to(dcoins, { autoAlpha: 1, scale: 1, duration: 0.5, ease: ease.out, stagger: { each: 0.085, from: 'end' } }, LAND + 0.3)
    }

    // the measure under them
    const share = ctx.$('.s19-rule--share')
    a.fade(share.querySelector('.s19-track'), LAND + 0.5, { duration: 0.6 })
    const fill = share.querySelector('.s19-fill') as HTMLElement
    const hero = ctx.$('.s19-m--share .s19-hero')
    const meter = { v: 0 }
    const write = () => {
      hero.textContent = `${meter.v.toFixed(1)}%`
      fill.style.clipPath = `inset(0 ${(100 - meter.v).toFixed(2)}% 0 0 round 99px)`
    }
    write()

    // 71.5%: ONE number that climbs through April and August; a coin turns over each time the
    // measure has taken another tenth
    let t = landed(0) - 0.25
    a.rise('.s19-m--share .s19-num', t - 0.1, { y: 2 })
    a.words('.s19-m--share .s19-line', t + 0.1, { stagger: 0.03 })
    const ticks = Array.from(share.querySelectorAll('.s19-tick'))
    let have = 0
    SHARE.bars.forEach((b, bi) => {
      const d = bi === 0 ? 0.6 : bi === 1 ? 1.0 : 0.7
      tl.to(meter, { v: b.value, duration: d, ease: 'power2.inOut', onUpdate: write }, t)
      const want = coinsAt(b.value)
      const n = want - have
      for (let j = 0; j < n; j++) {
        const i = have + j
        const at = t + (d * (j + 0.6)) / (n + 0.6) - 0.2
        if (g) {
          const c = g.coins[i]
          const mix = { m: 0 }
          const grey = new THREE.Color(GREY)
          const flame = new THREE.Color(FLAME_C)
          const tint = () => {
            c.mat.color.lerpColors(grey, flame, mix.m)
          }
          tint()
          if (!calm) tl.to(c.flip.rotation, { y: Math.PI, duration: 0.7, ease: 'power2.inOut' }, at)
          tl.to(mix, { m: 1, duration: calm ? 0.5 : 0.2, ease: 'none', onUpdate: tint }, at + (calm ? 0 : 0.25))
        } else {
          tl.to(dcoins[i], { backgroundColor: FLAME_C, duration: 0.4 }, at + 0.1)
        }
      }
      have = want
      a.fade(ticks[bi], t + d - 0.2, { duration: 0.4 })
      t += d + 0.18
    })
    tl.to(fx, { glow: 0.3, focusX: -0.15, focusY: 0.15, warm: 0.25, duration: 1.6 }, 0.8)
    a.fade('.s19-src', 1.8)
    tl.addLabel('share', t + 0.35)

    /* ---------------------------------------------------------------- price */
    const P = t + 0.35
    const price = ctx.$('.s19-rule--price')
    // the caption first, then the measure standing at 100
    a.words('.s19-m--price .s19-line', P, { stagger: 0.03 })
    a.fade(price.querySelector('.s19-track'), P + 0.1, { duration: 0.5 })
    a.fade(price.querySelector('.s19-end--was'), P + 0.7, { duration: 0.4 })
    const pfill = price.querySelector('.s19-fill') as HTMLElement
    const nowEnd = price.querySelector('.s19-end--now') as HTMLElement
    const nowN = price.querySelector('.s19-now-n') as HTMLElement
    const ghost = price.querySelector('.s19-ghost') as HTMLElement
    const idx = { grow: 0, v: PRICE.bars[0].value }
    const writeIdx = () => {
      const end = idx.v * idx.grow
      pfill.style.clipPath = `inset(0 ${(100 - end).toFixed(2)}% 0 0 round 99px)`
      nowEnd.style.transform = `translateX(${(-(100 - idx.v) / 100) * ruleW}px)`
      nowN.textContent = `${Math.round(idx.v)}`
    }
    writeIdx()
    tl.to(idx, { grow: 1, duration: 0.8, ease: ease.out, onUpdate: writeIdx }, P + 0.15)
    gsap.set([ghost, nowEnd], { autoAlpha: 0 })

    // … then it retreats to 53 inside the outline of what it was; every coin shrinks in its
    // ring; and 47% arrives counting what came off
    const D = P + 1.15
    tl.to(ghost, { autoAlpha: 1, duration: 0.35 }, D - 0.1)
    tl.to(idx, { v: PRICE.bars[1].value, duration: 1.4, ease: ease.inOut, onUpdate: writeIdx }, D)
    tl.to(nowEnd, { autoAlpha: 1, duration: 0.35 }, D + 0.75)
    a.rise('.s19-m--price .s19-num', D - 0.1, { y: 2 })
    a.count('.s19-m--price .s19-hero', D, { duration: 1.4, ease: ease.inOut })
    const rings = ctx.$$('.s19-ring')
    gsap.set(rings, { autoAlpha: 0 })
    tl.to(rings, { autoAlpha: 1, duration: 0.3, stagger: 0.05 }, D)
    if (g) {
      g.coins.forEach((c, i) => {
        tl.to(c.slot.scale, { x: SHRINK, y: SHRINK, z: SHRINK, duration: 0.9, ease: ease.inOut }, D + 0.1 + i * 0.05)
      })
    } else {
      tl.to(dcoins, { scale: SHRINK, duration: 0.9, ease: ease.inOut, stagger: 0.05 }, D + 0.1)
    }
    tl.to(fx, { focusX: 0.12, warm: -0.15, duration: 1.4, ease: ease.inOut }, P)
    tl.addLabel('price', D + 1.6)

    /* ------------------------------------------------------------------ why */
    const Y = D + 1.6
    a.words('.s19-under', Y, { stagger: 0.025 })
    a.rise('.s19-why-k', Y + 0.45, { y: 0, x: -1.2 })
    a.pop('.s19-pill', Y + 0.6, { stagger: 0.1, from: 0.8 })
    tl.to(fx, { focusY: 0.5, glow: 0.24, duration: 1.2, ease: ease.inOut }, Y)
    tl.addLabel('why', Y + 1.6)

    /* ----------------------------------------------------------------- news */
    const W = Y + 1.6
    pin(ctx, tl, ctx.$('.s19-clip--1'), W + 0.05, -1)
    pin(ctx, tl, ctx.$('.s19-clip--2'), W + 0.45, 1)
    tl.to(fx, { focusX: 0.6, focusY: -0.05, glow: 0.26, warm: 0.1, duration: 1.3, ease: ease.inOut }, W)
    tl.addLabel('news', W + 1.7)
    return tl
  },
}

/**
 * The family's last move (slides 16 to 25): a clipping is PINNED up. It comes down from a
 * little above, a touch large and askew, and settles with a small overshoot, as paper with
 * some weight does. The outer element moves; the clipping's own tilt is on its inner one.
 */
function pin(ctx: SceneCtx, tl: gsap.core.Timeline, el: Element, at: number, side: 1 | -1) {
  if (ctx.reduced) {
    gsap.set(el, { autoAlpha: 0 })
    tl.to(el, { autoAlpha: 1, duration: 0.5 }, at)
    return
  }
  gsap.set(el, { autoAlpha: 0, y: -ctx.U * 3.4, rotation: side * 3.2, scale: 1.07, transformOrigin: '50% 0%' })
  tl.to(el, { autoAlpha: 1, duration: 0.22, ease: 'power1.out' }, at)
  tl.to(el, { y: 0, scale: 1, duration: 0.5, ease: 'power3.in' }, at)
  tl.to(el, { rotation: side * -0.9, duration: 0.5, ease: 'power2.in' }, at)
  tl.to(el, { rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' }, at + 0.5)
}

export default scene
