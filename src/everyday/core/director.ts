'use client'

/**
 * EVERYDAY AI · the director.
 *
 * Every scene (the opening, Meet Priya, a product moment, the chapter card, the closing) builds ONE paused GSAP timeline
 * and hands it over with an ordered list of stops: labels on that timeline where the film
 * rests. The director plays from stop to stop, rests, listens for touch, sends the ghost
 * fingertip when nobody touches, and moves to the next scene after the last stop.
 *
 * Nothing else moves the film. A scene never plays its own timeline.
 */

import gsap from 'gsap'
import { SCENES, isProduct, useEveryday, type SceneId } from '../store'
import type { DebugParams } from './debug'
import type { Stage } from './stage'
import { CUT, IDLE, TOUCH } from './timing'

export interface SceneStop {
  /** A label on the scene's timeline: the END state of this step. */
  label: string
  /** The step name the shell sees (defaults to the label). */
  step?: string
  /** The stretches to play to get here from the previous stop. Default: one stretch, to `label`. */
  legs?: { to: string; cap?: number }[]
  /** The longest the (single) stretch may take; it is played faster if it is longer. */
  cap?: number
  /** Auto mode: rest here this long, then move on. Leave out to wait for a touch. */
  hold?: number
  /** The one control that does the thing at this stop. In auto mode the ghost fingertip presses it. */
  control?: HTMLElement | null
  /** Seconds the control waits before the ghost fingertip sets off (default TOUCH.wait). */
  ghostAfter?: number
  /** Whatever the mode: after this long untouched, start again from the opening screen. */
  idle?: number
  /** Arriving here leaves the scene at once for the next one. */
  exit?: boolean
  /** The film's last frame: a tap on the empty stage does nothing here (keys and its own buttons still work). */
  stay?: boolean
}

/**
 * A moment of the timeline at which something in the shell changes (Priya's line), wherever
 * the film is between two stops. The director reads the playhead, so a cue is right under a
 * debug hold and when the film is stepped back, exactly like everything else on the timeline.
 */
export interface SceneCue {
  /** Seconds on the scene's timeline: the cue is on once the playhead has passed this. */
  at: number
  id: string
}

export interface SceneHandle {
  tl: gsap.core.Timeline
  stops: SceneStop[]
  /** In order of time. The last one the playhead has passed is the store's `cue`. */
  cues?: SceneCue[]
}

type Entry =
  | { kind: 'play' }
  | { kind: 'hold'; at: string | null; dt: number }
  | { kind: 'rest' }
  | { kind: 'resume'; idx: number; busy: boolean }

interface Els {
  root: HTMLElement
  wrap: HTMLElement
  ghost: HTMLElement
  ghostRing: HTMLElement
  ring: SVGCircleElement | null
}

const RING_LEN = 2 * Math.PI * 17
const store = () => useEveryday.getState()

class Director {
  stage!: Stage
  private els: Els | null = null
  private handle: SceneHandle | null = null
  private scene: SceneId = 'intro'
  private token = 0
  private entry: Entry = { kind: 'play' }
  private idx = -1
  private busy = false
  private cutting = false
  /** A scene is about to arrive from this side (set by a cut, used when the scene has been built). */
  private arriving: 1 | -1 | 0 = 0
  private moveStarted = 0
  private mover: gsap.core.Tween | null = null
  private timers: gsap.core.Tween[] = []
  private ghostTl: gsap.core.Timeline | null = null
  private ringTween: gsap.core.Tween | null = null
  private live: HTMLElement | null = null
  private unsub: (() => void) | null = null
  /** Nobody can see the film (a phone held upright shows the "turn your device" prompt): it waits where it is. */
  private frozen = false

  // ------------------------------------------------------------------ life
  mount(els: Els, stage: Stage, debug: DebugParams) {
    this.els = els
    this.stage = stage
    if (els.ring) gsap.set(els.ring, { strokeDasharray: RING_LEN, strokeDashoffset: RING_LEN })
    store().patch({ mode: debug.manual ? 'manual' : 'auto', hold: !!(debug.scene && debug.at) })
    this.unsub = useEveryday.subscribe((s, prev) => {
      // auto ↔ manual while resting: re-arm the stop under the new rule
      if (s.mode !== prev.mode && this.handle && !this.busy && this.idx >= 0) {
        this.clearAuto()
        this.schedule(this.handle.stops[this.idx])
      }
    })
    const scene = debug.scene ?? 'intro'
    this.enter(scene, debug.scene && debug.at ? { kind: 'hold', at: debug.at, dt: debug.dt } : { kind: 'play' })
  }

  unmount() {
    this.unsub?.()
    this.unsub = null
    this.clearAuto()
    this.mover?.kill()
    this.mover = null
    if (this.els) gsap.killTweensOf([this.els.wrap, this.els.ghost, this.els.ghostRing])
    this.setLive(null)
    this.handle = null
    this.els = null
    this.cutting = false
    this.arriving = 0
    this.frozen = false
  }

  /**
   * A scene hands over its timeline. Called again after a resize (the scene rebuilds),
   * in which case the film picks up where it was.
   */
  register(scene: SceneId, handle: SceneHandle): () => void {
    if (scene !== this.scene || !this.els) return () => {}
    const token = this.token
    this.handle = handle
    const { tl, stops } = handle
    const e = this.entry
    const lastRest = () => {
      for (let i = stops.length - 1; i >= 0; i--) if (!stops[i].exit) return i
      return 0
    }
    if (e.kind === 'hold') {
      let time: number
      if (e.at === 'start') time = 0
      else if (e.at && tl.labels[e.at] != null) time = tl.labels[e.at]
      else time = tl.labels[stops[e.at === 'done' ? lastRest() : 0].label] ?? 0
      time = Math.min(Math.max(time + e.dt, 0), tl.duration())
      tl.seek(time)
      let i = stops.findIndex((s) => (tl.labels[s.label] ?? 0) >= time - 0.001)
      if (i < 0) i = stops.length - 1
      this.idx = i
      this.busy = false
      const resting = Math.abs((tl.labels[stops[i].label] ?? 0) - time) < 0.001
      store().setStep(stops[i].step ?? stops[i].label, resting)
      if (resting && stops[i].control) this.setLive(stops[i].control ?? null)
    } else if (e.kind === 'rest') {
      const i = lastRest()
      tl.seek(stops[i].label)
      this.idx = i
      this.arrive(i)
    } else if (e.kind === 'resume') {
      const i = Math.min(Math.max(e.idx, 0), stops.length - 1)
      if (e.busy) {
        tl.seek(i > 0 ? stops[i - 1].label : 0)
        this.idx = i - 1
        this.goTo(i)
      } else {
        tl.seek(stops[i].label)
        this.idx = i
        this.arrive(i)
      }
    } else {
      tl.seek(0)
      this.idx = -1
      this.goTo(0)
    }
    this.syncCue()
    if (!store().ready) store().patch({ ready: true })
    this.slideIn()

    return () => {
      if (token !== this.token || this.handle !== handle) return
      this.clearAuto()
      this.mover?.kill()
      this.mover = null
      this.setLive(null)
      if (this.entry.kind !== 'hold') this.entry = { kind: 'resume', idx: Math.max(this.idx, 0), busy: this.busy }
      this.handle = null
    }
  }

  // ------------------------------------------------------------------ the visitor's moves
  /** A tap anywhere, Space or Right: move on a step. A tap during a move finishes the move. */
  next = () => {
    const h = this.handle
    if (!h || this.cutting) return
    if (this.busy) {
      if (performance.now() - this.moveStarted < TOUCH.debounce * 1000) return
      const i = this.idx
      this.clearAuto()
      this.mover?.kill()
      this.moveStarted = performance.now()
      this.mover = h.tl.tweenTo(h.stops[i].label, { duration: 0.32, ease: 'power2.out', onUpdate: this.syncCue, onComplete: () => this.arrive(i) })
      return
    }
    if (this.idx < h.stops.length - 1) this.goTo(this.idx + 1)
    else this.leave()
  }

  /** A tap on the empty stage: the same as `next`, except on a frame that is meant to stay put. */
  tap = () => {
    const h = this.handle
    if (h && !this.busy && this.idx >= 0 && h.stops[this.idx]?.stay) return
    this.next()
  }

  /** The control at this stop was touched (by a visitor or by the ghost). */
  touch = () => this.next()

  /** Left: back a step, or to the scene before. */
  back = () => {
    const h = this.handle
    if (!h || this.cutting) return
    if (this.idx > 0) {
      const i = this.idx - 1
      this.clearAuto()
      this.mover?.kill()
      this.setLive(null)
      this.idx = i
      this.busy = true
      this.moveStarted = performance.now()
      store().setStep(h.stops[i].step ?? h.stops[i].label, false)
      this.mover = h.tl.tweenTo(h.stops[i].label, { duration: 0.6, ease: 'power2.inOut', onUpdate: this.syncCue, onComplete: () => this.arrive(i) })
      return
    }
    const at = SCENES.indexOf(this.scene)
    if (at > 0) this.cut(() => this.enter(SCENES[at - 1], { kind: 'rest' }), -1)
  }

  /** The rail: play any scene from its beginning. The stage turns the way the film runs. */
  jump = (scene: SceneId) => {
    if (this.cutting) return
    const dir = SCENES.indexOf(scene) < SCENES.indexOf(this.scene) ? -1 : 1
    this.cut(() => this.enter(scene, { kind: 'play' }), dir)
  }

  /** Start again, from the opening screen. */
  restart = () => this.jump('intro')

  /** A scene could not be drawn at all (its component threw): move on, so the film never stalls on it. */
  sceneFailed = () => {
    if (store().hold) return
    const token = this.token
    gsap.delayedCall(0.6, () => {
      if (token === this.token && !this.handle) this.leave()
    })
  }

  /**
   * The film cannot be seen (a phone turned upright): stop where it is, mid-move or at rest,
   * and carry on from exactly there when it can be seen again.
   */
  freeze = (on: boolean) => {
    if (on === this.frozen) return
    this.frozen = on
    if (on) {
      this.clearAuto()
      this.mover?.pause()
    } else if (this.busy) {
      this.mover?.resume()
    } else if (this.handle && !this.cutting && this.idx >= 0) {
      this.schedule(this.handle.stops[this.idx])
    }
  }

  /** Stop the countdown at the current stop (a preview is open)… */
  suspend = () => this.clearAuto()

  /** …and start it again. */
  resume = () => {
    if (this.handle && !this.busy && !this.cutting && this.idx >= 0) {
      this.clearAuto()
      this.schedule(this.handle.stops[this.idx])
    }
  }

  // ------------------------------------------------------------------ the machine
  private enter(scene: SceneId, entry: Entry) {
    this.clearAuto()
    this.mover?.kill()
    this.mover = null
    this.setLive(null)
    this.handle = null
    this.token += 1
    this.scene = scene
    this.entry = entry
    this.idx = -1
    this.busy = true
    const s = store()
    s.setScene(scene)
    s.setStep(isProduct(scene) ? 'before' : scene === 'intro' ? 'idle' : 'in', false)
  }

  private leave() {
    const at = SCENES.indexOf(this.scene)
    if (at >= SCENES.length - 1) this.restart()
    else this.enter(SCENES[at + 1], { kind: 'play' })
  }

  private goTo(i: number) {
    const h = this.handle
    if (!h) return
    this.clearAuto()
    this.mover?.kill()
    this.setLive(null)
    const stop = h.stops[i]
    this.idx = i
    this.busy = true
    this.moveStarted = performance.now()
    store().setStep(stop.step ?? stop.label, false)
    const legs = stop.legs ?? [{ to: stop.label, cap: stop.cap }]
    const tl = h.tl
    const play = (k: number) => {
      if (k >= legs.length) return this.arrive(i)
      const target = tl.labels[legs[k].to] ?? tl.duration()
      const natural = Math.max(0.01, target - tl.time())
      const cap = legs[k].cap
      this.mover = tl.tweenTo(target, { duration: cap ? Math.min(natural, cap) : natural, ease: 'none', onUpdate: this.syncCue, onComplete: () => play(k + 1) })
      if (this.frozen) this.mover.pause()
    }
    play(0)
  }

  /** Which cue the playhead has reached: read from the timeline, so it holds whichever way the film is moved. */
  private syncCue = () => {
    const h = this.handle
    if (!h?.cues) return
    const time = h.tl.time()
    let id: string | null = null
    for (const cue of h.cues) if (cue.at <= 0 || time > cue.at + 0.004) id = cue.id
    if (store().cue !== id) store().setCue(id)
  }

  private arrive(i: number) {
    const h = this.handle
    if (!h) return
    this.busy = false
    this.mover = null
    const stop = h.stops[i]
    this.syncCue()
    store().setStep(stop.step ?? stop.label, true)
    if (stop.exit) {
      if (!store().hold) this.leave()
      return
    }
    this.schedule(stop)
  }

  private schedule(stop: SceneStop) {
    const s = store()
    if (stop.control) this.setLive(stop.control)
    if (s.hold || this.frozen) return
    if (s.mode === 'auto') {
      if (stop.control) this.ghostTouch(stop.ghostAfter ?? TOUCH.wait, stop.control, () => this.next())
      else if (stop.hold != null) this.autoAfter(stop.hold, () => this.next())
    } else if (stop.idle == null) {
      // Manual, and nobody touching: back to auto, for the next visitor. Anywhere but the opening
      // screen that also means starting again from it (there, auto mode simply takes over the wait).
      this.timers.push(
        gsap.delayedCall(IDLE.manual, () => {
          store().setMode('auto')
          if (this.scene !== 'intro') this.restart()
        }),
      )
    }
    if (stop.idle != null) this.timers.push(gsap.delayedCall(stop.idle, () => this.restart()))
  }

  /**
   * A jump that is not part of the film's own flow (the rail, Left from a first step, start
   * again). The stage turns like a page along the rail: what is on it slides off the way the rail
   * runs, and the new scene arrives from the other side while the rail's marker glides across.
   * dir 1 = later in the film (out to the left), -1 = earlier.
   */
  private cut(mid: () => void, dir: 1 | -1 = 1) {
    const els = this.els
    if (!els) return
    this.clearAuto()
    this.mover?.kill()
    this.setLive(null)
    if (store().hold) {
      mid()
      return
    }
    const U = this.stage.U
    this.cutting = true
    gsap.to(els.wrap, {
      autoAlpha: 0,
      x: -dir * CUT.travel * U,
      duration: CUT.out,
      ease: 'power2.in',
      overwrite: true,
      onComplete: () => {
        this.cutting = false
        // The new scene measures the shell (rail, avatar) as it builds, so the stage is put back
        // in place, unseen, first; it slides in once the scene has been built (see register).
        gsap.set(els.wrap, { x: 0 })
        this.arriving = dir
        mid()
      },
    })
  }

  private slideIn() {
    const els = this.els
    const dir = this.arriving
    this.arriving = 0
    if (!els || !dir) return
    gsap.fromTo(
      els.wrap,
      { x: dir * CUT.travel * 1.4 * this.stage.U, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: CUT.in, ease: 'expo.out', overwrite: true },
    )
  }

  // ------------------------------------------------------------------ waiting, and the ghost touch
  private clearAuto() {
    this.timers.forEach((t) => t.kill())
    this.timers = []
    if (this.ghostTl) {
      this.ghostTl.kill()
      this.ghostTl = null
      if (this.els) gsap.set(this.els.ghost, { autoAlpha: 0 })
    }
    this.ringTween?.kill()
    this.ringTween = null
    if (this.els?.ring) gsap.set(this.els.ring, { strokeDashoffset: RING_LEN })
  }

  /** The ring around the auto control fills while the film counts down to its next move. */
  private countdown(seconds: number) {
    const ring = this.els?.ring
    if (!ring) return
    this.ringTween?.kill()
    this.ringTween = gsap.fromTo(ring, { strokeDashoffset: RING_LEN }, { strokeDashoffset: 0, duration: seconds, ease: 'none' })
  }

  private autoAfter(seconds: number, act: () => void) {
    this.countdown(seconds)
    this.timers.push(gsap.delayedCall(seconds, act))
  }

  /** A soft fingertip travels to the control and presses it: it does the thing, and shows the next person how. */
  private ghostTouch(delay: number, target: HTMLElement, act: () => void) {
    this.countdown(delay + TOUCH.travel)
    this.timers.push(
      gsap.delayedCall(delay, () => {
        const els = this.els
        if (!els || !target.isConnected) return act()
        const { stage } = this
        stage.measure()
        const U = stage.U
        const b = stage.loc(target)
        const T = TOUCH.travel
        const g = gsap.timeline()
        this.ghostTl = g
        g.set(els.ghost, { x: b.cx + 11 * U, y: b.cy + 8 * U, scale: 1.2, autoAlpha: 0 })
          .set(els.ghostRing, { scale: 1, autoAlpha: 0 })
          .to(els.ghost, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, 0)
          .to(els.ghost, { x: b.cx + 0.4 * U, duration: T - 0.15, ease: 'power2.inOut' }, 0)
          .to(els.ghost, { y: b.cy + 0.5 * U, duration: T - 0.15, ease: 'power3.out' }, 0)
          .to(els.ghost, { scale: 0.78, duration: 0.13, ease: 'power2.in' }, T - 0.15)
          .set(els.ghostRing, { autoAlpha: 0.9 }, T - 0.02)
          .to(els.ghostRing, { scale: 2.6, autoAlpha: 0, duration: 0.55, ease: 'power2.out' }, T - 0.02)
          .to(els.ghost, { scale: 1.05, duration: 0.3, ease: 'back.out(3)' }, T)
          .add(() => {
            // the fingertip lifts away by itself while the film moves on
            this.ghostTl = null
            target.setAttribute('data-pressed', '1')
            gsap.delayedCall(0.16, () => target.removeAttribute('data-pressed'))
            act()
          }, T)
          .to(els.ghost, { autoAlpha: 0, x: `+=${2 * U}`, y: `+=${3 * U}`, duration: 0.5, ease: 'power1.in' }, T + 0.25)
      }),
    )
  }

  /** The control that can be touched right now pulses (data-live="1"); every other time it is inert. */
  private setLive(el: HTMLElement | null) {
    if (this.live === el) return
    this.live?.removeAttribute('data-live')
    this.live = el
    el?.setAttribute('data-live', '1')
  }
}

export const director = new Director()
