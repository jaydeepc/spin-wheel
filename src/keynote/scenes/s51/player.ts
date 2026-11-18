'use client'

/**
 * THE CLIP PLAYER of the wheel (slides 51 to 54).
 *
 * The wheel is four recorded clips (public/keynote/wheel/). Video is the one thing on this stage
 * that is not a GSAP tween, so this player makes it behave as if it were: every tick it reads the
 * scene timeline's playhead and decides what the videos must be doing.
 *
 *   the playhead is advancing at about real time   the right clip plays, kept near the playhead
 *   the playhead jumped (Back, a finished move,    every clip is paused, the nearest STILL is shown
 *     a hold URL, a resize)                        at once, and when the playhead has come to
 *                                                  rest the clip is put on the exact frame
 *   the playhead stands on "spinning"              the loop turns for as long as the presenter talks
 *
 * A clip is only ever shown once it has a frame to show: the stills lie under the videos, so
 * there is never a black or empty screen, and a hand-over from one clip to the next happens on a
 * frame both of them share.
 *
 * Nothing here is module state: the scene makes a player in three(), gives it the timeline in
 * build(), and three()'s dispose stops it.
 */

import gsap from 'gsap'

export type ClipId = 'wheel' | 'up' | 'loop' | 'stop'
export type PosterId = 'wheel0' | 'wheel1' | 'loop0' | 'landed' | 'page'

export interface Plan {
  clip: ClipId
  /** Where in the clip the playhead is, in seconds. */
  time: number
  /** The clip's speed here (1, except where the idle drift eases to a stop). */
  rate: number
  /** The clip moves with the playhead here (false: it waits on `time`). */
  run: boolean
  /** The clip never plays past this while the playhead is in this stretch. */
  stopAt: number
  /** The rest "spinning": the loop turns by itself. */
  loop: boolean
  /** The still that is right (or nearest) for this moment. */
  poster: PosterId
}

export interface Player {
  attach(tl: gsap.core.Timeline, planOf: (t: number) => Plan): void
  /** The director put the playhead somewhere: treat the next tick as a jump. */
  force(): void
  dispose(): void
}

const FPS = 60
const CLIPS: ClipId[] = ['wheel', 'up', 'loop', 'stop']
const POSTERS: PosterId[] = ['wheel0', 'wheel1', 'loop0', 'landed', 'page']
/** The loop gives way to the stop clip over this long (their wheels are at different angles). */
const BLEND = 0.14

export function createPlayer(root: HTMLElement, held: boolean): Player {
  const vid = {} as Record<ClipId, HTMLVideoElement>
  const still = {} as Record<PosterId, HTMLElement>
  for (const id of CLIPS) {
    const v = root.querySelector<HTMLVideoElement>(`video[data-clip="${id}"]`)
    if (!v) throw new Error(`[keynote s51] no video for the clip "${id}"`)
    v.muted = true
    v.defaultMuted = true
    v.playsInline = true
    v.loop = id === 'loop'
    v.style.opacity = '0'
    vid[id] = v
  }
  for (const id of POSTERS) {
    const el = root.querySelector<HTMLElement>(`[data-poster="${id}"]`)
    if (!el) throw new Error(`[keynote s51] no still "${id}"`)
    still[id] = el
  }

  let tl: gsap.core.Timeline | null = null
  let planOf: ((t: number) => Plan) | null = null
  let lastT = Number.NaN
  let lastNow = 0
  let forced = true
  /** A jump was seen and the clip has not been put on its frame yet. */
  let pending = true
  /** The clip the playhead is in. */
  let active: ClipId = 'wheel'
  /** The clip on screen (null: only the still). */
  let shown: ClipId | null = null
  /** Where the active clip stood when it was asked to play: it is shown once it has moved on. */
  let startedAt = -1
  let waited = 0
  let poster: PosterId | null = null

  const play = (v: HTMLVideoElement) => {
    const p = v.play()
    if (p) p.catch(() => {})
  }
  const pause = (v: HTMLVideoElement) => {
    if (!v.paused) v.pause()
  }
  /** Put a clip on the frame that holds `time` (the middle of that frame, so rounding cannot miss it). */
  const seek = (v: HTMLVideoElement, time: number) => {
    const frames = Number.isFinite(v.duration) && v.duration > 0 ? Math.round(v.duration * FPS) : 100000
    const f = Math.min(frames - 1, Math.max(0, Math.floor(time * FPS + 1e-4)))
    const target = (f + 0.5) / FPS
    if (Math.abs(v.currentTime - target) < 0.5 / FPS + 1e-4 && !v.ended) return
    try {
      v.currentTime = target
    } catch {
      /* not loaded yet: the still is showing */
    }
  }
  const ready = (v: HTMLVideoElement) => v.readyState >= 2 && !v.seeking

  /** Every clip is paused; the active one is put on its frame, the others wait on their first. */
  const cue = (p: Plan) => {
    active = p.clip
    shown = null
    startedAt = -1
    waited = 0
    for (const id of CLIPS) {
      const v = vid[id]
      pause(v)
      v.playbackRate = 1
      seek(v, id === active ? p.time : 0)
    }
  }

  /** The playhead stands on "spinning": the spin-up runs out, then the loop takes over on the next frame. */
  const spin = () => {
    if (active === 'up') {
      const u = vid.up
      waited++
      const done = u.ended || u.paused || u.currentTime >= u.duration - 0.6 / FPS || waited > 45
      if (!done || !ready(vid.loop)) {
        if (waited > 90) cue({ clip: 'loop', time: 0, rate: 1, run: false, stopAt: 0, loop: true, poster: 'loop0' })
        return
      }
      active = 'loop'
      shown = 'loop'
      waited = 0
    } else if (active !== 'loop') {
      cue({ clip: 'loop', time: 0, rate: 1, run: false, stopAt: 0, loop: true, poster: 'loop0' })
      return
    }
    const l = vid.loop
    if (!held && shown === 'loop' && l.paused) play(l)
  }

  /** The playhead is moving: the clip moves with it. */
  const follow = (p: Plan) => {
    if (p.clip !== active) {
      // a hand-over: the clip before stays on screen until this one has a moving frame
      active = p.clip
      startedAt = -1
      waited = 0
      if (Math.abs(vid[active].currentTime - p.time) > 0.05) seek(vid[active], p.time)
    }
    const v = vid[active]
    if (!p.run) {
      pause(v)
      return
    }
    if (v.currentTime >= p.stopAt - 0.25 / FPS) {
      pause(v)
      return
    }
    const rate = Math.min(2, Math.max(0.1, p.rate))
    if (Math.abs(v.playbackRate - rate) > 0.01) v.playbackRate = rate
    if (!v.seeking && Math.abs(v.currentTime - p.time) > 0.4) seek(v, p.time)
    if (v.paused && !v.ended) {
      if (startedAt < 0) startedAt = v.currentTime
      play(v)
    }
  }

  /** The playhead stands on a rest it played to: the clip runs out to that frame and stops there. */
  const settle = (p: Plan) => {
    if (p.clip !== active) {
      cue(p)
      return
    }
    const v = vid[active]
    if (v.paused) return
    if (v.currentTime >= Math.min(p.time, p.stopAt) - 0.5 / FPS) pause(v)
    else if (v.playbackRate !== 1) v.playbackRate = 1
  }

  const paint = (p: Plan) => {
    if (poster !== p.poster) {
      poster = p.poster
      for (const id of POSTERS) still[id].style.opacity = id === poster ? '1' : '0'
    }
    const a = vid[active]
    let blend = 1
    // while a jump is waiting to be answered only the still is on screen
    if (!pending && shown !== active && ready(a)) {
      const moving = !a.paused && startedAt >= 0
      if (shown === 'loop' && active === 'stop' && moving) {
        // two wheels at different angles: one short dissolve instead of a cut
        blend = Math.min(1, Math.max(0, (a.currentTime - startedAt) / BLEND))
        if (blend >= 1) shown = active
      } else if (moving && shown !== null) {
        waited++
        if (a.currentTime > startedAt + 0.2 / FPS || waited > 20) shown = active
      } else {
        shown = active
      }
    }
    for (const id of CLIPS) {
      const v = vid[id]
      let o = id === shown ? 1 : 0
      if (id === active && shown !== active && shown === 'loop' && blend < 1) o = blend
      const s = o >= 1 ? '1' : o <= 0 ? '0' : o.toFixed(3)
      if (v.style.opacity !== s) v.style.opacity = s
      // a clip that has left the screen waits on its first frame for its next turn
      if (id !== active && id !== shown) {
        pause(v)
        if (v.currentTime > 0.5 / FPS + 1e-3 && !v.seeking) seek(v, 0)
      }
    }
  }

  const tick = () => {
    if (!tl || !planOf) return
    const t = tl.time()
    const now = performance.now() / 1000
    const dT = t - lastT
    const dN = now - lastNow
    let kind: 'jump' | 'still' | 'play'
    if (forced || Number.isNaN(lastT)) kind = 'jump'
    else if (Math.abs(dT) < 1e-6) kind = 'still'
    else if (dT > 0 && dT < 0.15 && dT < dN * 3 + 0.03) kind = 'play'
    else kind = 'jump'
    forced = false
    lastT = t
    lastNow = now
    const p = planOf(t)

    if (kind === 'jump') {
      // nothing is decoded while the playhead is being thrown about: the still answers at once
      pending = true
      shown = null
      for (const id of CLIPS) pause(vid[id])
    } else {
      if (pending) {
        pending = false
        cue(p)
      }
      if (p.loop) spin()
      else if (kind === 'play') follow(p)
      else settle(p)
    }
    paint(p)
  }

  gsap.ticker.add(tick)

  return {
    attach(timeline, fn) {
      tl = timeline
      planOf = fn
      forced = true
    },
    force() {
      forced = true
      tick()
    },
    dispose() {
      gsap.ticker.remove(tick)
      tl = null
      for (const id of CLIPS) pause(vid[id])
    },
  }
}
