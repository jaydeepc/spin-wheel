'use client'

/**
 * THE DIRECTOR. One for the whole deck.
 *
 *   Next   plays the current scene to its next rest; after the last rest it goes to the next
 *          slide: the scene on stage leaves, the new one comes in and its first beat plays by
 *          itself.
 *   Back   goes to the rest before (the finished frame), across slides too.
 *   A press during a move finishes that move (Back during a move returns to the rest it left).
 *   Nothing ever moves by itself except the first beat of a slide on arrival. No timers.
 *
 * A scene is a paused GSAP timeline with one label per beat (the label marks the REST). The
 * director only ever moves that timeline's playhead: from a rest to the next label at the
 * timeline's own speed, or straight to a label. That is why any frame can be held by a URL.
 *
 * A SCENE MAY SPAN SEVERAL SLIDES (SceneModule.slides). Then Next simply plays on through the
 * slide boundary: nothing leaves the stage, and the slide number, the rail, the breadcrumb and
 * the counter move on as the playhead crosses into the next slide's beats.
 *
 * BETWEEN TWO SCENES the one on stage fades away and the new one begins a little before it has
 * gone, so the stage is never left empty. Between a light slide and a dark one the two are not
 * blended: the old scene goes, then the backdrop changes in one directed move as the new scene
 * begins.
 */

import gsap from 'gsap'
import { COUNT, slide as slideOf, type Slide } from '../deck'
import { baseLook, ZERO_LOOK, type Backdrop } from '../three/backdrop'
import { NoWebGL } from '../three/sceneCanvas'
import { readHold, writeSlide, type Hold } from './hold'
import { motion, T } from './motion'
import { loadScene, preload, warm } from './registry'
import { CHROME_DEFAULT, useKeynote, type Layer } from './store'
import type { Look, SceneCtx, SceneModule } from './types'

type Arrive = { kind: 'first' } | { kind: 'last' } | { kind: 'hold'; at: string | null; dt: number | null }

interface Mounted {
  key: string
  mod: SceneModule
  layerEl: HTMLElement
  tl: gsap.core.Timeline
  /** The time of each beat's rest, in beat order. */
  rests: number[]
  /** The slide each beat belongs to, in beat order (all the same slide unless the scene spans several). */
  slideAt: number[]
  revert: () => void
  tween: gsap.core.Tween | null
  /** Draws what the timeline does not draw by itself (a scene's own canvas). */
  seeks: (() => void)[]
}

type Phase = 'loading' | 'leaving' | 'moving' | 'resting' | 'held'

const set = useKeynote.setState
const get = useKeynote.getState

/**
 * The slides a scene covers, in order. A plain scene covers the slide it was asked for; a span
 * covers the slides it names, if it names them properly (otherwise it is treated as plain, and
 * the console says why).
 */
export function spanOf(mod: SceneModule, n: number): { first: number; last: number; slideAt: number[] } {
  const plain = { first: n, last: n, slideAt: mod.beats.map(() => n) }
  if (!mod.slides) return plain
  const keys = Object.keys(mod.slides)
    .map(Number)
    .sort((a, b) => a - b)
  const id = `[keynote s${String(keys[0]).padStart(2, '0')}]`
  const run = keys.every((k, i) => k === keys[0] + i)
  const all = keys.flatMap((k) => mod.slides![k])
  const same = all.length === mod.beats.length && all.every((b, i) => b === mod.beats[i])
  const full = keys.every((k) => mod.slides![k].length > 0)
  if (!keys.includes(n) || !run || !same || !full) {
    console.error(
      `${id} "slides" must name consecutive slides (asked for slide ${n}), give each at least one beat, and "beats" must be all of them in order (use spanBeats). Treated as a scene of one slide.`,
    )
    return plain
  }
  return { first: keys[0], last: keys[keys.length - 1], slideAt: keys.flatMap((k) => mod.slides![k].map(() => k)) }
}

class Director {
  backdrop: Backdrop | null = null
  stageEl: HTMLElement | null = null
  hold: Hold = readHold()
  /** Replaced by scenes/_shared/stub when a scene fails to load or to build. */
  fallback: ((n: number) => SceneModule) | null = null

  private token = 0
  private seq = 0
  private phase: Phase = 'loading'
  private mounted = new Map<string, Mounted>()
  private liveKey: string | null = null
  /** The slide on screen. */
  private n = 1
  private arrive: Arrive = { kind: 'first' }
  private arrived = false
  /** The scene on its way in may begin (the one on its way out has gone far enough). */
  private gate = true
  /** Next or Back has been pressed since the scene on stage arrived. */
  private touched = false
  /** The timeline time of a frame held by a URL (&dt=), until a key is pressed. */
  private heldAt: number | null = null
  private leaving: gsap.core.Tween | null = null
  private leavingKey: string | null = null
  /** The beat the scene is at or is moving to: an index into the scene's beats. */
  private index = 0

  private get live(): Mounted | null {
    return this.liveKey ? (this.mounted.get(this.liveKey) ?? null) : null
  }

  /* ------------------------------------------------------------ the moves */

  /** The first slide: what the URL asks for, or slide 1 from its beginning. */
  boot() {
    this.hold = readHold()
    const h = this.hold
    if (h.asked) void this.go(h.s, { kind: 'hold', at: h.at, dt: h.dt }, true)
    else void this.go(1, { kind: 'first' }, true)
  }

  next() {
    if (get().overview) return
    if (this.phase === 'loading') return
    this.touched = true
    if (this.phase === 'leaving') return void this.leaving?.progress(1)
    if (this.phase === 'moving') return this.finish()
    if (this.phase === 'held') return this.playTo(this.index)
    const m = this.live
    if (!m) return
    if (this.index < m.rests.length - 1) this.playTo(this.index + 1)
    else {
      const last = m.slideAt[m.slideAt.length - 1]
      if (last < COUNT) void this.go(last + 1, { kind: 'first' })
    }
  }

  back() {
    if (get().overview) return
    if (this.phase === 'loading') return
    this.touched = true
    if (this.phase === 'leaving') return void this.leaving?.progress(1)
    const m = this.live
    if (!m) return
    // during a move: return to the rest it left
    const target = this.index - 1
    if (target >= 0) this.playTo(target, true)
    else if (m.slideAt[0] > 1) void this.go(m.slideAt[0] - 1, { kind: 'last' })
    else if (this.phase !== 'resting') this.playTo(0, true)
  }

  /** Jump to a slide, from its beginning. */
  jump(n: number) {
    set({ overview: false, typed: '' })
    void this.go(n, { kind: 'first' })
  }

  /** Finish the move that is under way. */
  finish() {
    const m = this.live
    if (this.phase === 'moving' && m?.tween) m.tween.progress(1)
  }

  private async go(n: number, arrive: Arrive, first = false) {
    n = Math.min(COUNT, Math.max(1, Math.round(n)))
    const token = ++this.token
    const s = slideOf(n)
    this.phase = 'loading'
    set({ loading: true })

    let mod: SceneModule
    try {
      mod = await loadScene(n)
      await preload(mod.preload)
    } catch (err) {
      console.error(`[keynote] scene ${s.id} failed to load`, err)
      if (!this.fallback) return
      mod = this.fallback(n)
    }
    if (token !== this.token) return

    // a change that was still under way is completed at once (a scene that had not yet come in is never shown)
    if (this.leaving) {
      this.arrived = true
      this.leaving.progress(1)
    }
    const old = this.live
    // the theme on screen: the one being held, if a change of theme was still waiting
    const shown = get().themeHold ?? slideOf(this.n).theme
    const span = spanOf(mod, n)
    const key = `s${String(span.first).padStart(2, '0')}.${++this.seq}`
    this.liveKey = key
    this.n = n
    this.arrive = arrive
    this.arrived = false
    this.touched = false
    this.index = Math.max(0, span.slideAt.indexOf(n))

    // a light slide and a dark one are never blended: the theme is held until the old scene has gone
    const holdTheme = !!old && shown !== s.theme
    const keep = old ? get().layers.filter((l) => l.key === old.key) : []
    const own = mod.slides?.[n] ?? mod.beats
    set({
      n,
      loading: false,
      resting: false,
      beat: own[0] ?? '',
      beatIndex: 0,
      beatCount: own.length,
      chrome: { ...CHROME_DEFAULT, ...mod.chrome },
      layers: [...keep, { key, n: span.first, mod }],
      themeHold: holdTheme ? shown : null,
    })
    this.backdrop?.setBase(baseLook(s), first || arrive.kind === 'hold', holdTheme)
    if (!first) writeSlide(n)

    if (old) {
      old.tween?.kill()
      old.tween = null
      this.phase = 'leaving'
      this.leavingKey = old.key
      this.gate = false
      const quick = arrive.kind !== 'first'
      const seconds = quick ? 0.24 : 0.36
      // The new scene begins when the old one is this far gone: a little before the end, so the
      // stage is never empty. A change of theme, and an arrival on a finished frame (Back), wait
      // for the old scene to have gone completely.
      const from = quick || holdTheme ? 1 : 0.55
      this.backdrop?.releaseLayer(old.key, seconds * 0.95)
      const leaving = gsap.to(old.layerEl, {
        autoAlpha: 0,
        scale: quick ? 1 : 0.985,
        duration: seconds,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (!this.gate && leaving.progress() >= from) {
            this.gate = true
            this.tryArrive()
          }
        },
        onComplete: () => {
          if (this.leaving === leaving) this.leaving = null
          this.dropLayer(old.key)
          this.gate = true
          this.tryArrive()
        },
      })
      this.leaving = leaving
    } else {
      this.gate = true
    }
    // the new scene mounts now (see mount()), and comes in when the gate is open
  }

  private dropLayer(key: string) {
    if (this.leavingKey === key) this.leavingKey = null
    set({ layers: get().layers.filter((l) => l.key !== key) })
  }

  /** The new scene is built and the old one has gone far enough: bring it in. */
  private tryArrive() {
    const m = this.live
    if (!m || !this.gate || this.arrived) return
    this.arrived = true
    const a = this.arrive
    gsap.set(m.layerEl, { autoAlpha: 1, scale: 1 })
    // the theme may change now: the backdrop in one directed move, the chrome with it
    this.backdrop?.releaseBase()
    const themed = !!get().themeHold
    if (themed) set({ themeHold: null })

    const firstOf = m.slideAt.indexOf(this.n)
    const lastOf = m.slideAt.lastIndexOf(this.n)

    if (a.kind === 'first') {
      // the slide's first beat plays by itself, from the rest before it (time 0 for the scene's first slide)
      m.tl.time(firstOf > 0 ? m.rests[firstOf - 1] : 0)
      this.drawn(m)
      this.playTo(firstOf)
      this.ready()
      return
    }
    if (a.kind === 'last') {
      this.index = lastOf
      m.tl.time(m.rests[this.index])
      this.drawn(m)
      // a finished frame comes in quickly; across a change of theme it comes in WITH the backdrop's move, not ahead of it
      gsap.fromTo(m.layerEl, { autoAlpha: 0 }, themed ? { autoAlpha: 1, duration: 0.6, ease: 'power2.in' } : { autoAlpha: 1, duration: 0.3, ease: 'power2.out' })
      this.rest()
      this.ready()
      return
    }
    // a hold URL
    let i = a.at ? m.mod.beats.indexOf(a.at) : firstOf
    if (i < 0) {
      console.warn(`[keynote] ${slideOf(this.n).id} has no beat "${a.at}". Its beats: ${m.mod.beats.join(', ')}`)
      i = firstOf
    }
    this.index = i
    if (a.dt === null) {
      m.tl.time(m.rests[i])
      this.drawn(m)
      this.rest()
    } else {
      const from = i > 0 ? m.rests[i - 1] : 0
      const to = m.rests[i]
      const t = a.dt >= 0 ? Math.min(to, from + a.dt) : Math.max(from, to + a.dt)
      m.tl.time(t)
      this.drawn(m)
      this.phase = 'held'
      this.heldAt = t
      this.sync(m)
      set({ resting: false })
    }
    this.ready()
  }

  /** The playhead was put somewhere without playing: whatever does not draw itself is drawn now. */
  private drawn(m: Mounted) {
    for (const fn of m.seeks) {
      try {
        fn()
      } catch {
        /* a canvas that is already gone */
      }
    }
  }

  /**
   * Tells the page which slide and which beat the playhead is in (or is moving to). In a scene
   * that spans several slides this is where the slide number moves on.
   */
  private sync(m: Mounted) {
    const n = m.slideAt[this.index]
    const firstOf = m.slideAt.indexOf(n)
    const count = m.slideAt.lastIndexOf(n) - firstOf + 1
    if (n !== this.n) {
      this.n = n
      this.backdrop?.setBase(baseLook(slideOf(n)))
      writeSlide(n)
    }
    set({ n, beat: m.mod.beats[this.index], beatIndex: this.index - firstOf, beatCount: count })
  }

  private ready() {
    if (get().ready) return
    // two frames: the scene's first paint, and the backdrop's
    requestAnimationFrame(() => requestAnimationFrame(() => set({ ready: true })))
    // a host that sends no animation frames still gets there
    setTimeout(() => set({ ready: true }), 400)
  }

  private playTo(i: number, quick = false) {
    const m = this.live
    if (!m) return
    m.tween?.kill()
    this.heldAt = null
    const to = m.rests[i]
    const from = m.tl.time()
    this.index = i
    this.phase = 'moving'
    this.sync(m)
    set({ resting: false })
    if (Math.abs(to - from) < 0.001) {
      m.tl.time(to)
      this.rest()
      return
    }
    m.tween = gsap.to(m.tl, {
      time: to,
      duration: quick ? 0.3 : Math.abs(to - from),
      ease: quick ? 'power2.out' : 'none',
      overwrite: true,
      onComplete: () => {
        m.tween = null
        this.rest()
      },
    })
  }

  private rest() {
    const m = this.live
    if (!m) return
    this.phase = 'resting'
    this.sync(m)
    set({ resting: true })
    if (this.hold.warm) warm(this.n)
  }

  /* ------------------------------------------------- for the checking tools */

  /**
   * The slide on screen: its beats, the time of each rest, and `start`, the time its first move
   * begins at (0, or in a scene that spans several slides the last rest of the slide before).
   */
  info() {
    const m = this.live
    if (!m) return null
    const a = m.slideAt.indexOf(this.n)
    const z = m.slideAt.lastIndexOf(this.n)
    return {
      n: this.n,
      beats: m.mod.beats.slice(a, z + 1),
      rests: m.rests.slice(a, z + 1),
      start: a > 0 ? m.rests[a - 1] : 0,
      duration: m.tl.duration(),
      span: m.mod.slides ? [m.slideAt[0], m.slideAt[m.slideAt.length - 1]] : null,
    }
  }

  /** Hold the scene on stage at a rest (`dt` null) or `dt` seconds into the move that leads to it, as a hold URL does. */
  seek(at: string | null, dt: number | null = null) {
    const m = this.live
    if (!m || this.leaving) return false
    m.tween?.kill()
    this.arrive = { kind: 'hold', at, dt }
    this.arrived = false
    this.tryArrive()
    return true
  }

  /* ------------------------------------------------- scenes come and go */

  /** A scene's DOM is in the page: build it. Called by the layer component, before the first paint. */
  mount(layer: Layer, layerEl: HTMLElement, root: HTMLElement): () => void {
    const stageEl = this.stageEl
    if (!stageEl) return () => {}
    const ease = motion()
    const s = slideOf(layer.n)
    const rect = stageEl.getBoundingClientRect()
    const U = rect.width / 100
    const fx: Look = this.backdrop?.addLayer(layer.key) ?? { ...ZERO_LOOK }
    const isLive = () => this.liveKey === layer.key
    const seeks: (() => void)[] = []

    const ctx: SceneCtx = {
      slide: s,
      root,
      $: <E extends Element = HTMLElement>(sel: string) => {
        const el = root.querySelector<E>(sel)
        if (!el) throw new Error(`[keynote ${s.id}] nothing in the scene matches "${sel}"`)
        return el
      },
      $$: <E extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll<E>(sel)),
      U,
      W: rect.width,
      H: rect.height,
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      held: this.hold.still || (isLive() && this.arrive.kind === 'hold' && this.arrive.dt !== null),
      ease,
      T,
      backdrop: {
        fx,
        mood: (look) => {
          if (isLive()) this.backdrop?.nudgeBase(look)
        },
      },
      bag: {},
      timeline: () => gsap.timeline({ paused: true, defaults: { ease: ease.out, duration: T.enter } }),
      loc: (el) => {
        const o = stageEl.getBoundingClientRect()
        const r = el.getBoundingClientRect()
        const x = r.left - o.left
        const y = r.top - o.top
        return { x, y, w: r.width, h: r.height, cx: x + r.width / 2, cy: y + r.height / 2 }
      },
      onSeek: (fn) => {
        seeks.push(fn)
      },
    }

    let tl: gsap.core.Timeline | null = null
    let disposeThree: (() => void) | void
    let failed: unknown = null
    const gctx = gsap.context(() => {
      try {
        if (layer.mod.three) {
          try {
            disposeThree = layer.mod.three(ctx)
          } catch (err) {
            // no WebGL on this machine is not news (the page said so once): the scene uses its DOM fallback
            if (!(err instanceof NoWebGL)) console.warn(`[keynote ${s.id}] its three() hook failed; the scene goes on without it`, err)
          }
        }
        tl = layer.mod.build(ctx)
      } catch (err) {
        failed = err
      }
    }, root)

    const undo = () => {
      const m = this.mounted.get(layer.key)
      m?.tween?.kill()
      this.mounted.delete(layer.key)
      // Unmounted while it is still the scene on stage: the stage was resized, or React mounted
      // it twice (development). If nobody has pressed anything yet, it simply arrives again, as
      // it was asked to; otherwise it is rebuilt at the rest it was at.
      if (isLive() && !this.touched) this.arrived = false
      gctx.revert()
      try {
        disposeThree?.()
      } catch {
        /* the context may already be gone */
      }
      // after a rebuild the layer is added again under the same key; when the scene has left for good this is a no-op
      this.backdrop?.releaseLayer(layer.key, 0)
    }

    if (failed || !tl) {
      console.error(`[keynote ${s.id}] build() failed; showing the page instead`, failed)
      undo()
      this.failed(layer.key)
      return () => {}
    }

    const timeline = tl as gsap.core.Timeline
    timeline.pause(0)
    const rests = this.readRests(s, layer.mod, timeline)
    // the slide this layer was asked for is the live slide if it is live; otherwise (a layer on its way out) its own
    const span = spanOf(layer.mod, isLive() ? this.n : layer.n)
    const rebuilt = isLive() && this.arrived
    const m: Mounted = { key: layer.key, mod: layer.mod, layerEl, tl: timeline, rests, slideAt: span.slideAt, revert: undo, tween: null, seeks }
    this.mounted.set(layer.key, m)

    if (rebuilt) {
      // the stage changed size: back to the rest we were at (or were moving to)
      this.index = Math.min(this.index, rests.length - 1)
      gsap.set(layerEl, { autoAlpha: 1, scale: 1 })
      if (this.phase === 'held' && this.heldAt !== null) timeline.time(this.heldAt)
      else {
        timeline.time(rests[this.index])
        this.rest()
      }
      this.drawn(m)
    } else if (isLive()) {
      this.tryArrive()
    }
    return undo
  }

  /** A scene threw while rendering or building: its slide shows the deck's page instead. */
  failed(key: string) {
    const layer = get().layers.find((l) => l.key === key)
    if (!layer || !this.fallback) return
    const live = this.liveKey === key
    const n = live ? this.n : layer.n
    const mod = this.fallback(n)
    const nk = `${key}.page`
    if (live) {
      this.liveKey = nk
      this.index = 0
    }
    set({
      layers: get().layers.map((l) => (l.key === key ? { key: nk, n, mod } : l)),
      ...(live ? { beatCount: mod.beats.length, beatIndex: 0, chrome: { ...CHROME_DEFAULT, ...mod.chrome } } : null),
    })
  }

  private readRests(s: Slide, mod: SceneModule, tl: gsap.core.Timeline): number[] {
    const end = tl.duration()
    let prev = 0
    return mod.beats.map((b) => {
      let t = tl.labels[b]
      if (typeof t !== 'number') {
        console.error(`[keynote ${s.id}] the timeline has no label "${b}" (beats: ${mod.beats.join(', ')}). Add tl.addLabel('${b}') after that beat's tweens.`)
        t = end
      }
      if (t < prev) console.error(`[keynote ${s.id}] the label "${b}" comes before the beat in front of it: labels must be in beat order.`)
      prev = t
      return t
    })
  }

  /** The stage has a new size: every scene on stage is rebuilt, and rests where it was. */
  relayout() {
    if (this.phase === 'moving') this.finish()
    this.touched = true // a resize never replays an arrival: the scene is rebuilt at its rest
    set({ layoutTick: get().layoutTick + 1 })
  }

  /* --------------------------------------------------------------- keys */

  key(e: KeyboardEvent): boolean {
    if (e.metaKey || e.ctrlKey || e.altKey) return false
    const st = get()
    const k = e.key
    if (k === 'g' || k === 'G') {
      set({ overview: !st.overview, typed: '' })
      return true
    }
    if (k === 'Escape') {
      if (st.overview || st.typed) {
        set({ overview: false, typed: '' })
        return true
      }
      return false
    }
    if (st.overview) return false // the grid has its own keys
    if (/^[0-9]$/.test(k)) {
      set({ typed: (st.typed + k).slice(-2) })
      return true
    }
    if (k === 'Backspace' && st.typed) {
      set({ typed: st.typed.slice(0, -1) })
      return true
    }
    if (k === 'Enter' && st.typed) {
      const n = Number(st.typed)
      set({ typed: '' })
      if (n >= 1 && n <= COUNT) this.jump(n)
      return true
    }
    if (k === 'ArrowRight' || k === 'PageDown' || k === ' ' || k === 'Enter') {
      this.next()
      return true
    }
    if (k === 'ArrowLeft' || k === 'PageUp') {
      this.back()
      return true
    }
    if (k === 'Home') {
      this.jump(1)
      return true
    }
    if (k === 'End') {
      this.jump(COUNT)
      return true
    }
    return false
  }
}

export const director = new Director()
