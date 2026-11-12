'use client'

/**
 * EVERYDAY AI · the director.
 *
 * Every scene (the opening, Meet Priya, a product moment, the chapter card, the closing) builds ONE paused GSAP timeline
 * and hands it over with an ordered list of stops: labels on that timeline where the film
 * rests. The director plays from stop to stop, rests, and moves to the next scene after the
 * last stop.
 *
 * MANUAL IS THE DEFAULT. The film never starts or moves on by itself: at every rest it waits
 * for the Next button (or a key, or a tap on the empty stage; at a stop with a control, a press
 * on the control), for as long as it takes. There is no timer of any kind in manual: a presenter
 * can talk over one screen for ten minutes and it will still be there.
 *
 * AUTO-PLAY (?auto, or the Auto-play switch) plays it like a film: rests are timed, and the
 * ghost fingertip presses the controls. A deliberate Next or Back switches it off again.
 *
 * Nothing else moves the film. A scene never plays its own timeline.
 */

import gsap from 'gsap'
import { SCENES, isProduct, useEveryday, type SceneId } from '../store'
import type { DebugParams } from './debug'
import type { Box, Stage } from './stage'
import { CUT, TOUCH } from './timing'

export interface SceneStop {
  /** A label on the scene's timeline: the END state of this step. */
  label: string
  /** The step name the shell sees (defaults to the label). */
  step?: string
  /** The stretches to play to get here from the previous stop. Default: one stretch, to `label`. */
  legs?: { to: string; cap?: number }[]
  /** The longest the (single) stretch may take; it is played faster if it is longer. */
  cap?: number
  /** Auto-play: rest here this long, then move on. Leave out to wait for a touch. (Manual always waits for Next.) */
  hold?: number
  /**
   * Manual passes straight through: the film does not rest here, it carries on to the next stop
   * on the same press (a moment's 'name', the closing's 'say'). Back skips it too. Auto-play still
   * rests here for `hold`, and a debug URL can still hold the frame.
   */
  pass?: boolean
  /**
   * The one control that does the thing at this stop. It can be pressed from the moment it can be
   * seen, while the film is still arriving here. Next (the button, a key, a tap on the empty
   * stage) presses it too. In Auto-play the ghost fingertip presses it.
   */
  control?: HTMLElement | null
  /**
   * Auto-play: seconds the control waits, once the film rests here, before the ghost fingertip
   * sets off (default TOUCH.wait). If somebody has just touched the screen it waits at least TOUCH.waitAttended.
   */
  ghostAfter?: number
  /** Auto-play: say "Your turn" beside the control while it waits for somebody who is there (a moment's demo). */
  invite?: boolean
  /** Auto-play: after this long untouched, start again from the opening screen. (Manual never does.) */
  idle?: number
  /** Arriving here leaves the scene at once for the next one. */
  exit?: boolean
  /**
   * The film's last frame: a tap on the empty stage does nothing here, and the Next button reads
   * "Start again" (the store's `atEnd`); Next and the keys start the film again.
   */
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
  /** The "Your turn" caption (rendered in Experience.tsx; Auto-play places it beside a waiting control). */
  turn: HTMLElement | null
}

interface Rect {
  x: number
  y: number
  w: number
  h: number
}
/** THE CLEAR ZONE around Priya's voice, in units of --u: nothing of the frame's comes nearer (moments/README.md). */
const VOICE_CLEAR = 2
/** Do two boxes overlap, or come within `pad` of each other? */
const overlap = (a: Rect, b: Rect, pad = 0) => a.x < b.x + b.w + pad && a.x + a.w > b.x - pad && a.y < b.y + b.h + pad && a.y + a.h > b.y - pad
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
  private live: HTMLElement | null = null
  /** The control that has just been pressed: not live any more, but it still takes the taps that land on it. */
  private spent: HTMLElement | null = null
  /** The film is travelling the run that a control started: a tap on the empty stage does nothing. */
  private guarded = false
  /** A control was pressed while its step was still arriving: the press happens when it has arrived. */
  private queued = false
  /** When somebody last touched the screen (performance.now()). */
  private lastTouch = -Infinity
  /** A debug URL says somebody is there (?touched), so "Your turn" can be looked at in a held frame. */
  private pretendTouched = false
  private unsub: (() => void) | null = null
  /** Nobody can see the film (a phone held upright shows the "turn your device" prompt): it waits where it is. */
  private frozen = false
  /** The page size the scene on stage was measured and built at (see builtFor). */
  private built = ''

  // ------------------------------------------------------------------ life
  mount(els: Els, stage: Stage, debug: DebugParams) {
    this.els = els
    this.stage = stage
    this.pretendTouched = debug.touched
    if (debug.touched) this.lastTouch = performance.now()
    // manual unless Auto-play was asked for
    store().patch({ mode: debug.auto ? 'auto' : 'manual', hold: !!(debug.scene && debug.at) })
    this.unsub = useEveryday.subscribe((s, prev) => {
      // auto ↔ manual while resting: re-arm the stop under the new rule
      if (s.mode !== prev.mode && this.handle && !this.busy && !this.cutting && this.idx >= 0) {
        this.clearAuto()
        const stop = this.handle.stops[this.idx]
        // (Auto-play was resting on a stop that manual passes through: carry on to the next rest)
        if (this.passes(stop, this.idx)) this.goTo(this.idx + 1)
        else this.schedule(stop)
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
    if (this.els) gsap.killTweensOf([this.els.wrap, this.els.ghost, this.els.ghostRing, this.els.turn])
    this.setLive(null)
    this.setSpent(null)
    this.guarded = false
    this.queued = false
    this.handle = null
    this.els = null
    this.cutting = false
    this.arriving = 0
    this.frozen = false
    this.built = ''
  }

  /** The page's size, as the film's layout sees it. */
  pageSize = () => (this.els ? `${this.els.root.clientWidth}x${this.els.root.clientHeight}` : '')

  /**
   * The size the scene on stage was built at. Every pixel distance in a timeline is measured when
   * it is built, so a scene that happened to be built while the page was passing through another
   * size (a browser bar sliding, a phone being turned) has to be built again, even if the page is
   * back at the size it had before: Experience.tsx compares this with the size it sees.
   */
  builtFor = () => this.built

  /**
   * A scene hands over its timeline. Called again after a resize (the scene rebuilds),
   * in which case the film picks up where it was.
   */
  register(scene: SceneId, handle: SceneHandle): () => void {
    if (scene !== this.scene || !this.els) return () => {}
    this.built = this.pageSize()
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
      // (a label may stand a little after the last tween: the timeline ends where its motion does)
      const labelAt = (s: SceneStop) => Math.min(tl.labels[s.label] ?? 0, tl.duration())
      let i = stops.findIndex((s) => labelAt(s) >= time - 0.001)
      if (i < 0) i = stops.length - 1
      this.idx = i
      this.busy = false
      const resting = Math.abs(labelAt(stops[i]) - time) < 0.001
      store().setStep(stops[i].step ?? stops[i].label, resting)
      this.setAtEnd(resting && !!stops[i].stay)
      if (resting) {
        // a held frame shows what a visitor would see resting here: the live control, and (Auto-play, ?touched) "Your turn"
        const stop = stops[i]
        if (stop.control) this.setLive(stop.control)
        if (stop.control && stop.invite && store().mode === 'auto' && this.pretendTouched) this.inviteSoon(stop.control)
      }
    } else if (e.kind === 'rest') {
      const i = lastRest()
      tl.seek(stops[i].label)
      this.idx = i
      this.arrive(i, true)
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
      this.setSpent(null)
      this.queued = false
      if (this.entry.kind !== 'hold') this.entry = { kind: 'resume', idx: Math.max(this.idx, 0), busy: this.busy }
      this.handle = null
    }
  }

  // ------------------------------------------------------------------ the visitor's moves
  /**
   * A DELIBERATE Next or Back: the Next and Back buttons, and the keys (Space, Right, PageDown,
   * Enter; Left, PageUp). The visitor has taken over, so Auto-play is switched off. (A press on a
   * demo's control and a tap on the empty stage do not come through here: they leave the mode alone.)
   */
  press = (dir: 1 | -1) => {
    this.noteTouch()
    if (store().mode === 'auto' && !store().hold) store().setMode('manual')
    if (dir > 0) this.next()
    else this.back()
  }

  /**
   * Move on a step. At rest: to the next rest (at a stop with a control this is that control's
   * press: the demo runs and the film rests at its result; on the last frame the film starts
   * again). During a move it finishes the move: the deliberate skip.
   */
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

  /**
   * A tap on the empty stage. At rest it moves the film on a step (except on a frame that is
   * meant to stay put). During a move it is nearly always a second tap ("did that register?"),
   * so it does nothing while a demo that a control started is running, and nothing for the
   * first TOUCH.settle seconds of any other move; after that it finishes the move, as a key does.
   */
  tap = () => {
    const h = this.handle
    if (!h) return
    if (this.busy) {
      if (this.guarded || performance.now() - this.moveStarted < TOUCH.settle * 1000) return
    } else if (this.idx >= 0 && h.stops[this.idx]?.stay) return
    this.next()
  }

  /**
   * The control at this stop was pressed by a visitor. Only a live control counts. If its step is
   * still arriving, the arrival is finished quickly and the press happens then: a real press is
   * never lost, and it always cancels the ghost fingertip.
   */
  touch = () => {
    const h = this.handle
    const control = this.live
    if (!h || !control || this.cutting || this.frozen) return
    if (!this.busy) {
      this.next()
      return
    }
    const i = this.idx
    if (this.queued || h.stops[i]?.control !== control) return
    this.queued = true
    this.clearAuto()
    this.mover?.kill()
    const left = Math.max(0, (h.tl.labels[h.stops[i].label] ?? h.tl.duration()) - h.tl.time())
    this.mover = h.tl.tweenTo(h.stops[i].label, { duration: Math.max(0.01, Math.min(0.32, left)), ease: 'power2.out', onUpdate: this.syncCue, onComplete: () => this.arrive(i) })
  }

  /** Somebody touched the screen or pressed a key: for a while, Auto-play takes it that they are still there. */
  noteTouch = () => {
    this.lastTouch = performance.now()
  }

  /** Back to the rest before this one (manual skips the stops it passes through), or to the scene before. */
  back = () => {
    const h = this.handle
    if (!h || this.cutting) return
    let i = this.idx - 1
    if (store().mode === 'manual' && !store().hold) while (i >= 0 && h.stops[i].pass) i--
    if (i >= 0) {
      this.clearAuto()
      this.mover?.kill()
      this.setLive(null)
      this.setSpent(null)
      this.guarded = false
      this.queued = false
      this.idx = i
      this.busy = true
      this.moveStarted = performance.now()
      this.setAtEnd(false)
      store().setStep(h.stops[i].step ?? h.stops[i].label, false)
      this.mover = h.tl.tweenTo(h.stops[i].label, { duration: 0.6, ease: 'power2.inOut', onUpdate: this.syncCue, onComplete: () => this.arrive(i, true) })
      return
    }
    const at = SCENES.indexOf(this.scene)
    if (at > 0) this.cut(() => this.enter(SCENES[at - 1], { kind: 'rest' }), -1)
  }

  /** A progress dot (or a card on the closing): play any scene from its beginning. The stage turns the way the film runs. */
  jump = (scene: SceneId) => {
    if (this.cutting) return
    const dir = SCENES.indexOf(scene) < SCENES.indexOf(this.scene) ? -1 : 1
    this.cut(() => this.enter(scene, { kind: 'play' }), dir)
  }

  /**
   * Start again, from the opening screen. The mode is kept: a manual film waits there for its
   * start button, Auto-play starts by itself after the opening's attract time. (Start again, the
   * Next button on the last frame, Auto-play's return from the closing.)
   */
  restart = () => {
    if (this.cutting) return
    this.jump('intro')
  }

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

  // ------------------------------------------------------------------ the machine
  private enter(scene: SceneId, entry: Entry) {
    this.clearAuto()
    this.mover?.kill()
    this.mover = null
    this.setLive(null)
    this.setSpent(null)
    this.guarded = false
    this.queued = false
    this.handle = null
    this.token += 1
    this.scene = scene
    this.entry = entry
    this.idx = -1
    this.busy = true
    const s = store()
    this.setAtEnd(false)
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
    // Leaving a stop that has a control is that control's run, however it was set off: the control
    // has been used (it takes the taps that land on it, and does nothing with them), and a tap on
    // the empty stage does not cut the run short.
    const from = i > 0 ? (h.stops[i - 1].control ?? null) : null
    this.setSpent(from)
    this.guarded = !!from
    this.queued = false
    this.idx = i
    this.busy = true
    this.moveStarted = performance.now()
    this.setAtEnd(false)
    store().setStep(stop.step ?? stop.label, false)
    const legs = stop.legs ?? [{ to: stop.label, cap: stop.cap }]
    const tl = h.tl
    // the control at the stop ahead can be pressed as soon as it can be seen
    const ahead = stop.control ?? null
    const onUpdate = () => {
      this.syncCue()
      if (ahead && this.live !== ahead && !store().hold && this.seen(ahead)) this.setLive(ahead)
    }
    const play = (k: number) => {
      if (k >= legs.length) return this.arrive(i)
      const target = tl.labels[legs[k].to] ?? tl.duration()
      const natural = Math.max(0.01, target - tl.time())
      const cap = legs[k].cap
      this.mover = tl.tweenTo(target, { duration: cap ? Math.min(natural, cap) : natural, ease: 'none', onUpdate, onComplete: () => play(k + 1) })
      if (this.frozen) this.mover.pause()
    }
    play(0)
  }

  /** Can this control be seen well enough to be pressed? (On screen, not hidden, most of the way faded in.) */
  private seen(el: HTMLElement): boolean {
    const root = this.els?.root
    if (!root || !el.isConnected) return false
    const r = el.getBoundingClientRect()
    if (r.width < 8 || r.height < 8) return false
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    if (cx < 0 || cy < 0 || cx > window.innerWidth || cy > window.innerHeight) return false
    let opacity = 1
    for (let n: HTMLElement | null = el; n && n !== root; n = n.parentElement) {
      const cs = getComputedStyle(n)
      if (cs.visibility === 'hidden' || cs.display === 'none') return false
      opacity *= parseFloat(cs.opacity) || 0
      if (opacity < 0.6) return false
    }
    return true
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

  /** Manual does not rest on this stop: it carries straight on to the next one. */
  private passes(stop: SceneStop, i: number) {
    const h = this.handle
    return !!h && !!stop.pass && !stop.exit && i < h.stops.length - 1 && store().mode === 'manual' && !store().hold
  }

  /** The film has reached stop i. `steppedBack`: it was stepped back onto it, so it rests here whatever the stop is. */
  private arrive(i: number, steppedBack = false) {
    const h = this.handle
    if (!h) return
    this.busy = false
    this.mover = null
    this.guarded = false
    this.setSpent(null)
    const stop = h.stops[i]
    this.syncCue()
    if (this.queued) {
      // its control was pressed on the way here: the press happens now
      this.queued = false
      if (stop.control && !store().hold && i < h.stops.length - 1) {
        this.goTo(i + 1)
        return
      }
    }
    if (!steppedBack && this.passes(stop, i)) {
      // manual: not a rest. The same press carries on to the next stop.
      this.goTo(i + 1)
      return
    }
    store().setStep(stop.step ?? stop.label, true)
    if (stop.exit) {
      if (!store().hold) this.leave()
      return
    }
    this.setAtEnd(!!stop.stay)
    this.schedule(stop)
  }

  private setAtEnd(on: boolean) {
    if (store().atEnd !== on) store().patch({ atEnd: on })
  }

  private schedule(stop: SceneStop) {
    const s = store()
    if (stop.control) this.setLive(stop.control)
    if (s.hold || this.frozen) return
    if (s.mode === 'auto') {
      if (stop.control) {
        // Nobody there: the ghost sets off almost at once, and the film keeps time. Somebody has
        // just touched the screen: it is their turn, and the control waits for them.
        const base = stop.ghostAfter ?? TOUCH.wait
        const here = this.attended()
        if (here && stop.invite) this.inviteSoon(stop.control)
        this.ghostTouch(here ? Math.max(base, TOUCH.waitAttended) : base, stop.control, () => this.next())
      } else if (stop.hold != null) this.autoAfter(stop.hold, () => this.next())
      if (stop.idle != null) this.timers.push(gsap.delayedCall(stop.idle, () => this.restart()))
    }
    // Manual: nothing is scheduled. Everything waits for the visitor, for as long as it takes
    // (the control's own halo and the Next button are the prompt).
  }

  /** Has somebody touched the screen recently enough to still be standing there? */
  private attended() {
    return performance.now() - this.lastTouch < TOUCH.attendedFor * 1000
  }

  /**
   * A jump that is not part of the film's own flow (a progress dot, Back from a first step, start
   * again). The stage turns like a page: what is on it slides off the way the film runs, and the
   * new scene arrives from the other side. dir 1 = later in the film (out to the left), -1 = earlier.
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
        // The new scene measures the shell (the dots, the avatar) as it builds, so the stage is put back
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
    this.hideTurn()
    if (this.ghostTl) {
      this.ghostTl.kill()
      this.ghostTl = null
      if (this.els) gsap.set(this.els.ghost, { autoAlpha: 0 })
    }
  }

  private autoAfter(seconds: number, act: () => void) {
    this.timers.push(gsap.delayedCall(seconds, act))
  }

  /** A soft fingertip travels to the control and presses it: it does the thing, and shows the next person how. */
  private ghostTouch(delay: number, target: HTMLElement, act: () => void) {
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

  /** The control that has just been used keeps the taps that land on it (data-spent="1") until its run is over. */
  private setSpent(el: HTMLElement | null) {
    if (this.spent === el) return
    this.spent?.removeAttribute('data-spent')
    this.spent = el
    el?.setAttribute('data-spent', '1')
  }

  // ------------------------------------------------------------------ "Your turn" keeps clear of what is read
  /**
   * Everything inside `near` (stage pixels) that the caption must not lie over: every piece of text
   * that can actually be seen (what a mask hides, or an ancestor has faded out, is not there),
   * Priya's face and her bubble WITH THEIR CLEAR ZONE (2u all round: `clear` is how much of it the
   * caller's own padding does not already give), the buttons, the dots, the logo and the clock,
   * and any wordless picture a scene has marked `data-ev-solid` (a pile of cards, a dashed box).
   */
  private blocksIn(near: Rect, self: HTMLElement, clear: number): Box[] {
    const els = this.els
    if (!els) return []
    const { stage } = this
    const blocks: Box[] = []
    els.root.querySelectorAll<HTMLElement>('.ev-voice-avatar, .ev-voice-bubble, .ev-nav, .ev-util, .ev-dots, .ev-turn, .ev-logo, .ev-clock, [data-ev-solid]').forEach((el) => {
      const cs = getComputedStyle(el)
      if (el === self || cs.visibility === 'hidden' || parseFloat(cs.opacity) <= 0.05) return
      const b = stage.loc(el)
      const grow = el.matches('.ev-voice-avatar, .ev-voice-bubble') ? clear : 0
      blocks.push(grow ? { ...b, x: b.x - grow, y: b.y - grow, w: b.w + 2 * grow, h: b.h + 2 * grow } : b)
    })
    // what each ancestor does to the text inside it: how much it fades it, and whether it clips it
    const seenEls = new Map<Element, { opacity: number; clips: boolean }>()
    const look = (el: Element) => {
      let v = seenEls.get(el)
      if (!v) {
        const cs = getComputedStyle(el)
        v = { opacity: parseFloat(cs.opacity) || 0, clips: cs.overflowX !== 'visible' || cs.overflowY !== 'visible' }
        seenEls.set(el, v)
      }
      return v
    }
    const walker = document.createTreeWalker(els.root, NodeFilter.SHOW_TEXT)
    const range = document.createRange()
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const parent = node.parentElement
      if (!parent || !(node.nodeValue ?? '').trim() || self.contains(parent) || parent.closest('.ev-turn, .ev-rotate')) continue
      range.selectNodeContents(node)
      const rects = range.getClientRects()
      for (let k = 0; k < rects.length; k++) {
        const r = rects[k]
        if (r.width < 1 || r.height < 1) continue
        if (!overlap(stage.box(r), near)) continue
        if (getComputedStyle(parent).visibility === 'hidden') break
        // what a mask hides is not there: keep only the part every clipping ancestor shows
        let left = r.left
        let top = r.top
        let right = r.right
        let bottom = r.bottom
        let opacity = 1
        for (let n: Element | null = parent; n && n !== els.root; n = n.parentElement) {
          const a = look(n)
          opacity *= a.opacity
          if (a.clips) {
            const cr = n.getBoundingClientRect()
            left = Math.max(left, cr.left)
            top = Math.max(top, cr.top)
            right = Math.min(right, cr.right)
            bottom = Math.min(bottom, cr.bottom)
          }
        }
        // (a sliver of a line that a mask has all but hidden carries no ink: it is leading)
        if (opacity < 0.05 || right - left < 2 || bottom - top < 0.35 * r.height) continue
        blocks.push(stage.box({ left, top, width: right - left, height: bottom - top }))
      }
    }
    return blocks
  }

  // ------------------------------------------------------------------ "Your turn"
  /** The caption is placed once the stop's own layout has settled (Priya's line included). */
  private inviteSoon(control: HTMLElement) {
    this.timers.push(gsap.delayedCall(0.12, () => this.showTurn(control)))
  }

  private hideTurn() {
    const turn = this.els?.turn
    if (!turn) return
    gsap.killTweensOf(turn)
    gsap.set(turn, { autoAlpha: 0 })
  }

  /**
   * "Your turn", beside the waiting control (Auto-play only). Where exactly is worked out from
   * what is on screen at that instant: next to the control if there is clear room, otherwise
   * beside the device it is in, at the control's height. It never lies over text, a picture marked
   * `data-ev-solid`, the control itself or the edge of a device, and never within 2u of Priya's
   * voice; if no such place exists it is not shown (the control still pulses).
   */
  private showTurn(control: HTMLElement) {
    const els = this.els
    const turn = els?.turn
    if (!els || !turn || !control.isConnected) return
    const { stage } = this
    stage.measure()
    const U = stage.U
    const w = turn.offsetWidth
    const h = turn.offsetHeight
    if (!w || !h) return
    const c = stage.loc(control)
    const kind = els.root.dataset.device
    const moverEl = kind === 'phone' || kind === 'laptop' ? els.root.querySelector('.ev-moment .ev-deviceMover') : null
    const screenEl = moverEl?.querySelector('.ev-screen') ?? null
    const device = moverEl ? stage.loc(moverEl) : null
    const screen = screenEl ? stage.loc(screenEl) : null

    // ---- where it may stand: inside the page and above the bottom strip. Priya's bubble, her
    // face, the dots and the buttons are kept clear of one by one (below).
    const page = stage.box(els.root.getBoundingClientRect())
    const under = els.root.querySelector('.ev-strip')
    const floor = under ? stage.loc(under).y : page.y + page.h
    const edge = 0.8 * U
    const field = { x0: Math.max(page.x + edge, -stage.hx), x1: Math.min(page.x + page.w - edge, stage.hx), y0: page.y + edge, y1: floor - 0.4 * U }

    // ---- the candidates, nearest first. side: where the caption stands, seen from the control.
    type Spot = { x: number; y: number; side: 'right' | 'left' | 'above' | 'below' }
    const g = 0.9 * U
    const midY = c.cy - h / 2
    const spots: Spot[] = [
      { x: c.x + c.w + g, y: midY, side: 'right' },
      { x: c.x - g - w, y: midY, side: 'left' },
      { x: c.cx - w / 2, y: c.y - g - h, side: 'above' },
      { x: c.cx - w / 2, y: c.y + c.h + g, side: 'below' },
      { x: c.x + c.w - w, y: c.y - g - h, side: 'above' },
      { x: c.x, y: c.y - g - h, side: 'above' },
      { x: c.x + c.w - w, y: c.y + c.h + g, side: 'below' },
      { x: c.x, y: c.y + c.h + g, side: 'below' },
      { x: c.x + c.w - w * 0.4, y: c.y + c.h + g, side: 'below' },
      { x: c.x + c.w - w * 0.4, y: c.y - g - h, side: 'above' },
      { x: c.x - w * 0.6, y: c.y + c.h + g, side: 'below' },
      { x: c.x - w * 0.6, y: c.y - g - h, side: 'above' },
    ]
    if (device) {
      // beside the device the control is in, nearest side first
      const gd = 1.1 * U
      const y = Math.min(Math.max(midY, device.y + U), device.y + device.h - h - U)
      const x = Math.min(Math.max(c.cx - w / 2, device.x), device.x + device.w - w)
      const beside: Spot[] = [
        { x: device.x + device.w + gd, y, side: 'right' },
        { x: device.x - gd - w, y, side: 'left' },
        { x, y: device.y + device.h + gd, side: 'below' },
        { x, y: device.y - gd - h, side: 'above' },
      ]
      // (to the nearest unit: when two sides are as near as each other, the order above decides)
      const far = (p: Spot) => Math.round(Math.hypot(p.x + w / 2 - c.cx, p.y + h / 2 - c.cy) / U)
      spots.push(...beside.sort((a, b) => far(a) - far(b)))
    }

    // ---- what it must keep clear of (only what is near enough to matter is measured)
    const around = device ? [c, device] : [c]
    const nx = Math.min(...around.map((o) => o.x)) - w - 3 * U
    const ny = Math.min(...around.map((o) => o.y)) - h - 3 * U
    const near = {
      x: nx,
      y: ny,
      w: Math.max(...around.map((o) => o.x + o.w)) + w + 3 * U - nx,
      h: Math.max(...around.map((o) => o.y + o.h)) + h + 3 * U - ny,
    }
    const hits = overlap
    const pad = 0.45 * U
    const blocks = this.blocksIn(near, turn, Math.max(0, VOICE_CLEAR * U - pad))

    // ---- the first candidate that is clear
    const spot = spots.find((p) => {
      const b = { x: p.x, y: p.y, w, h }
      if (b.x < field.x0 || b.x + b.w > field.x1 || b.y < field.y0 || b.y + b.h > field.y1) return false
      if (device) {
        // wholly on the device's screen, or wholly off the device: never across its edge
        const inside = screen && b.x >= screen.x + 0.3 * U && b.x + b.w <= screen.x + screen.w - 0.3 * U && b.y >= screen.y + 0.3 * U && b.y + b.h <= screen.y + screen.h - 0.3 * U
        if (!inside && hits(b, device, 0.5 * U)) return false
      }
      // the control itself, and a little air around it
      if (hits(b, c, 0.4 * U)) return false
      return !blocks.some((o) => hits(b, o, pad))
    })
    if (!spot) return
    turn.setAttribute('data-side', spot.side)
    gsap.killTweensOf(turn)
    if (store().hold) {
      gsap.set(turn, { x: spot.x, y: spot.y, scale: 1, autoAlpha: 1 })
      return
    }
    gsap.set(turn, { x: spot.x, y: spot.y, scale: 0.86, autoAlpha: 0, transformOrigin: spot.side === 'right' ? '0% 50%' : spot.side === 'left' ? '100% 50%' : spot.side === 'above' ? '50% 100%' : '50% 0%' })
    gsap.to(turn, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(2)' })
  }
}

export const director = new Director()
