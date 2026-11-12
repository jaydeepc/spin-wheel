'use client'

/**
 * EVERYDAY AI · the shared choreography of a product moment.
 *
 * One paused timeline per moment. Its labels are the END state of each step:
 *
 *   start ─ before ─ name ─ demo ─ ran ─ result ─ stat ─ done
 *
 *   before   the old way: its picture is in the picture area under a "Before" tag (REST)
 *   name     the wordmark has landed, opened and closed, alone at centre stage (manual passes through)
 *   demo     the name is docked with its caption, the device is in, the control is waiting (REST)
 *   ran      the demo has been performed (the module's `run` timeline has played)
 *   result   the result headline is in the statement slot (REST)
 *   stat     the number has counted up in the statement slot, beside its picture (REST)
 *   done     the stage is clear and the name has been filed into its progress dot
 *
 * THE LAYOUT every rest keeps to (moments/README.md): the name, the statement and Priya's voice
 * down the left; ONE picture in the picture area on the right. The device is fitted to that
 * area once (enlarged as far as the area allows) and never moves aside again: the left column
 * is clear of it at every step.
 *
 * The module's five small timelines (before, demo, run, result, stat) are dropped in at
 * the start of their step. The director (core/director.ts) plays from label to label.
 */

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ACCENTS, type Product } from '../content'
import type { MomentEnv, MomentHandles, MomentModule } from '../moments/types'
import type { SceneHandle } from './director'
import type { Eases } from './motion'
import { prepareName } from './name'
import type { Stage } from './stage'
import { CAP, HOLD, MOMENT, READ, TOUCH } from './timing'

/**
 * The device is FITTED to the picture area: enlarged until it fills the area's height or width,
 * but never more than this. (A phone grows to about 1.3× on a 16:9 screen, 1.5× on a 4:3 one and
 * 1.2× on a phone on its side.) A centrepiece of its own ('none') is never enlarged: it is given the area's
 * own box by its module, and only ever scaled down to fit.
 */
const ZOOM_CAP = { phone: 1.5, laptop: 1.4, none: 1 } as const
/** The old-way picture is laid out for 25u × 20u and enlarged whole, up to this. */
const BEFORE_ZOOM = 1.6

export function buildMoment(
  root: HTMLElement,
  stage: Stage,
  E: Eases,
  product: Product,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: MomentModule<any>,
): SceneHandle {
  const U = stage.U
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
  const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as unknown as T[]
  const deviceKind = module.device ?? 'phone'
  const t = gsap.timeline({ paused: true, defaults: { ease: E.out, duration: 0.7 } })

  // ---------------------------------------------------------------- the shared cast
  const beforePic = $('.ev-before-pic')
  const beforeTag = $('.ev-before-tag')
  const beforeH = $('.ev-before-h .ev-rise')
  const flash = $('.ev-flash')
  const nameGroup = $('.ev-name')
  const dockcap = $('.ev-dockcap .ev-rise')
  /** What the name stands for, under the docked name (BYOT, BYOA, Prastuti only). */
  const dockexp = $('.ev-dockexp .ev-rise')
  const resultCol = $('.ev-col--result')
  const sentenceEl = $('.ev-sentence')
  const proof = $('.ev-proof')
  const statPic = $('.ev-stat-pic')
  const statRise = $$('.ev-stat .ev-rise')
  const numEl = $('.ev-stat-n')
  const mover = $('.ev-deviceMover')
  const nudge = $('.ev-deviceNudge')
  const extras = $('.ev-extras')
  /** This product's progress dot (shell/Shell.tsx): where the name is filed at the hand-over. */
  const dot = document.querySelector<HTMLElement>(`[data-ev-rail="${product.key}"] .ev-dot-mark`)

  // ---------------------------------------------------------------- THE LAYOUT, measured
  const area = stage.loc($('.ev-picarea'))
  const m0 = stage.loc(mover)
  // the device: centred in the picture area, as large as the area allows
  // (on a large screen a phone keeps a little air above and below; on a phone on its side it
  // takes every pixel of the height: what is on it is at its type floor there)
  const air = deviceKind === 'phone' && !stage.small ? 0.96 : 1
  const zoom = Math.min(ZOOM_CAP[deviceKind], (area.w * air) / Math.max(1, m0.w), (area.h * air) / Math.max(1, m0.h))
  const home = { x: area.cx - m0.cx, y: area.cy - m0.cy }
  gsap.set(mover, { x: home.x, y: home.y, scale: zoom })
  // The old-way picture: the same, under its tag (which needs 3u above it). It stands beside
  // Priya's bubble, or, where that lets it be larger (a squarer screen), above it.
  const tagRoom = 3 * U
  const b0 = stage.loc(beforePic)
  const fitBefore = (a: typeof area) => Math.max(0.6, Math.min(BEFORE_ZOOM, (a.w * 0.96) / Math.max(1, b0.w), (a.h - tagRoom) / Math.max(1, b0.h)))
  const beside = stage.loc($('.ev-picarea--before'))
  const above = stage.loc($('.ev-picarea--above'))
  const beforeArea = fitBefore(above) > fitBefore(beside) * 1.04 ? above : beside
  const bz = fitBefore(beforeArea)
  const bHome = { x: beforeArea.cx - b0.cx, y: beforeArea.cy + tagRoom / 2 - b0.cy }
  gsap.set(beforePic, { x: bHome.x, y: bHome.y, scale: bz })
  const tag0 = stage.loc(beforeTag)
  const tagHome = { x: beforeArea.cx - (b0.w * bz) / 2 - tag0.x, y: beforeArea.cy + tagRoom / 2 - (b0.h * bz) / 2 - 0.5 * U - tag0.h - tag0.y }

  const name = prepareName(root, stage, E)
  const dockAt = stage.loc($('.ev-dock'))
  const rc = stage.loc(resultCol)

  // ---------------------------------------------------------------- the module adds its own
  const section = () => gsap.timeline({ paused: true, defaults: { ease: E.out, duration: 0.5 } })
  const sec = { before: section(), demo: section(), run: section(), result: section(), stat: section() }
  const env: MomentEnv = {
    ...sec,
    product,
    accent: ACCENTS[product.accent],
    U,
    hx: stage.hx,
    small: stage.small,
    ease: E,
    $,
    $$,
    loc: (el) => stage.loc(el),
    letters: name.letters,
    shared: { device: mover, name: nameGroup },
    area,
    bump(s, at, strength = 1) {
      s.to(nudge, { y: 0.16 * U * strength, duration: 0.07, ease: 'power1.out' }, at).to(nudge, { y: 0, duration: 0.3, ease: 'power2.out' }, at + 0.07)
    },
    leave(s, targets, at = 0, opts) {
      s.to(targets, { autoAlpha: 0, y: -(opts?.dy ?? 0.9) * U, duration: 0.26, ease: 'power2.in', stagger: opts?.stagger ?? 0.045 }, at)
    },
  }
  let handles: MomentHandles = { control: null }
  try {
    handles = module.animate(env) ?? handles
  } catch (err) {
    // A module that fails still gets the shared film: before, name, device, result, stat.
    console.error(`[everyday] ${product.key}: animate() failed`, err)
  }
  const landOn = handles.deviceLandsOn ? stage.loc(handles.deviceLandsOn) : null
  if (process.env.NODE_ENV !== 'production') {
    ;(Object.keys(sec) as (keyof typeof sec)[]).forEach((k) => {
      const d = sec[k].duration()
      if (d > CAP[k] + 0.05) console.warn(`[everyday] ${product.key}: "${k}" runs ${d.toFixed(2)}s, over its ${CAP[k]}s budget. It will be played faster.`)
    })
  }

  // ---------------------------------------------------------------- shared starting states
  gsap.set($$('.ev-mask > .ev-rise'), { yPercent: 118 })
  gsap.set(beforePic, { autoAlpha: 0, x: bHome.x + 5 * U, y: bHome.y + 1.2 * U, scale: bz * 0.9, rotation: 3 })
  gsap.set(beforeTag, { autoAlpha: 0, x: tagHome.x - 1.6 * U, y: tagHome.y })
  gsap.set(flash, { autoAlpha: 0, scale: 0.6 })
  name.setInitial()
  gsap.set(mover, { autoAlpha: 0, x: home.x, y: home.y + 50 * U, rotation: deviceKind === 'phone' ? 5 : 0, scale: zoom })
  if (proof) gsap.set(proof, { autoAlpha: 0, y: 1 * U })
  gsap.set(statPic, { autoAlpha: 0 })
  gsap.set(numEl, { textContent: 0 })

  // ================================================================ BEFORE: the old way. ONE picture; Priya's bubble tells it.
  const tB = 0
  t.addLabel('start', 0)
  t.to(beforePic, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, tB)
    .to(beforePic, { x: bHome.x, y: bHome.y, scale: bz, rotation: 0, duration: 0.75, ease: E.snap }, tB)
    .to(beforeTag, { autoAlpha: 1, x: tagHome.x, duration: 0.5 }, tB + 0.28)
  if (beforeH) t.to(beforeH, { yPercent: 0, duration: 0.65 }, tB + 0.16)
  t.add(sec.before.paused(false), tB)
  const tN = tB + Math.max(0.85, sec.before.duration())
  t.addLabel('before', tN)

  // ================================================================ NAME: the hero, alone at centre stage
  // The old way leaves with intent: the tag first, then the picture, drawn off to the right, and
  // (Piramal Mind) the headline up through its mask. Priya's bubble leaves on the same beat (cue 'off').
  t.to(beforeTag, { autoAlpha: 0, x: tagHome.x + 1.2 * U, duration: 0.16, ease: 'power2.in' }, tN)
    .to(beforePic, { autoAlpha: 0, x: bHome.x + 6 * U, scale: bz * 0.92, rotation: 2.5, duration: 0.26, ease: 'power2.in' }, tN)
    .to(flash, { autoAlpha: 1, scale: 1, duration: 1.1 }, tN + 0.1)
  // (out fast: the name's first letters land where its second line stands, a tenth of a second later)
  if (beforeH) t.to(beforeH, { yPercent: -118, duration: 0.14, ease: 'power1.in' }, tN)
  // every name takes exactly CAP.name: its choreography is scored on NAME_SCORE seconds (core/name.ts)
  const nameDur = name.addTo(t, tN)
  const tD = tN + nameDur
  t.addLabel('name', tD)

  // ================================================================ DEMO: the name docks, the device arrives in the picture area
  // The docked name is as wide as the left column lets it be, and never taller than 7.4u (7.05u on a phone on its side).
  const dock = name.dock(dockAt.x, dockAt.y, Math.max(20 * U, rc.w - 4 * U), (stage.small ? 7.05 : 7.4) * U)
  name.addLeaveCentre(t, tD)
  t.to(nameGroup, { ...dock, duration: 0.85, ease: E.inOut }, tD + 0.04)
    .to(flash, { autoAlpha: 0.5, duration: 0.85, ease: 'power1.inOut' }, tD)
    .to(dockcap, { yPercent: 0, duration: 0.55 }, tD + 0.65)
    .to(mover, { autoAlpha: 1, duration: 0.01 }, tD + 0.05)
  // What the name stands for rests under the docked name for as long as the demo rest lasts: at
  // centre stage it was open for under a second. It rises in just ahead of the caption.
  if (dockexp) t.to(dockexp, { yPercent: 0, duration: 0.5 }, tD + 0.52)
  t.to(mover, { y: home.y, rotation: 0, duration: 0.95 }, tD + 0.05).add(sec.demo.paused(false), tD)
  const tU = tD + Math.max(1.25, sec.demo.duration())
  t.addLabel('demo', tU)

  // ================================================================ RUN: the touch, and what it does
  t.add(sec.run.paused(false), tU)
  const tR = tU + Math.max(0.2, sec.run.duration())
  t.addLabel('ran', tR)

  // ================================================================ RESULT: the new way, in one sentence, in the statement slot
  const sentence = SplitText.create(sentenceEl, { type: 'lines,words', mask: 'lines' })
  const lines = sentence.lines as HTMLElement[]
  const wanted = (sentenceEl.dataset.highlight ?? '').toLowerCase().split(/\s+/).filter(Boolean)
  if (wanted.length) {
    const words = sentence.words as HTMLElement[]
    const clean = (el: HTMLElement) => (el.textContent ?? '').toLowerCase().replace(/[^\p{L}\p{N}’'-]/gu, '')
    for (let i = 0; i + wanted.length <= words.length; i++) {
      if (wanted.every((w, k) => clean(words[i + k]) === w.replace(/[^\p{L}\p{N}’'-]/gu, ''))) {
        words.slice(i, i + wanted.length).forEach((el) => el.classList.add('ev-hl'))
        break
      }
    }
  }
  gsap.set(lines, { yPercent: 118 })
  // The caption has done its work (it named the promise while the demo was shown): it leaves as
  // the headline takes the slot under the name. The device stays exactly where it is.
  // (What the name stands for leaves with it, a beat behind: the caption stands where the
  // headline's first line arrives, so it goes first. The name slot is the name alone again.)
  t.to(dockcap, { yPercent: -118, duration: 0.26, ease: 'power2.in' }, tR).to(lines, { yPercent: 0, duration: 0.7, stagger: 0.08 }, tR + 0.16)
  if (dockexp) t.to(dockexp, { yPercent: -118, duration: 0.26, ease: 'power2.in' }, tR + 0.06)
  // the one supporting line (SmartHelp, Piramal Mind) follows the headline in
  if (proof) t.to(proof, { autoAlpha: 1, y: 0, duration: 0.4 }, tR + 0.45)
  t.add(sec.result.paused(false), tR)
  const tT = tR + Math.max(0.95, sec.result.duration())
  t.addLabel('result', tT)

  // ================================================================ STAT: the number has the screen (Priya's bubble leaves: cue 'off')
  const target = Number((numEl.parentElement?.dataset.value ?? '0').replace(/[^\d.]/g, '')) || 0
  t.to(lines, { yPercent: -118, duration: 0.32, ease: 'power3.in', stagger: 0.03 }, tT)
  if (proof) t.to(proof, { autoAlpha: 0, y: -0.6 * U, duration: 0.22, ease: 'power1.in' }, tT)
  if (landOn) {
    // the device flies into its place in the picture, and becomes part of it
    t.to(
      mover,
      { x: landOn.cx - m0.cx, y: landOn.cy - m0.cy, scale: (landOn.w * 1.1) / m0.w, duration: 0.8, ease: E.inOut },
      tT + 0.05,
    ).to(mover, { autoAlpha: 0, duration: 0.14, ease: 'power1.in' }, tT + 0.73)
  } else {
    t.to(mover, { y: home.y + 7 * U, scale: zoom * 0.9, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, tT)
  }
  t.to(statPic, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, tT + 0.2)
    .to(statRise[0], { yPercent: 0, duration: 0.6 }, tT + 0.3)
    .to(numEl, { textContent: target, snap: { textContent: 1 }, duration: 0.95, ease: 'power2.out' }, tT + 0.35)
    .to(statRise[1], { yPercent: 0, duration: 0.55 }, tT + 0.75)
    .to('.ev-stat-num', { scale: 1.035, duration: 0.1, ease: 'power2.out' }, tT + 1.26)
    .to('.ev-stat-num', { scale: 1, duration: 0.14, ease: 'power2.inOut' }, tT + 1.36)
    .add(sec.stat.paused(false), tT)
  const tH = tT + Math.max(1.5, sec.stat.duration())
  t.addLabel('stat', tH)

  // ================================================================ HAND OVER: the name is filed into its dot
  t.to(statRise, { yPercent: -118, duration: 0.28, ease: 'power3.in', stagger: 0.03 }, tH)
    .to(statPic, { autoAlpha: 0, scale: 0.97, duration: 0.3, ease: 'power2.in' }, tH)
    .to(flash, { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, tH)
  if (extras) t.to(extras, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, tH)
  if (dot) {
    // The docked name travels down into its own progress dot, shrinking as it goes, and is gone
    // as it lands: ONE name on the way, and nothing left over the dot. It sets off once the
    // number and its label have risen out (they stand in its path). The dot then fills (it
    // turns from the current pill into a filled dot as the next scene begins: the shell's CSS).
    // The dots are outside the stage and drawn over it, so for the flight the stage is raised
    // over them: nothing cuts through the word on its way down. The raise is the stylesheet's
    // (.ev-root[data-step='done'] .ev-wrap in everyday.css), keyed on the step, so it can never
    // outlive the hand-over, and presses fall through it to Next, Back and the dots.
    const db = stage.loc(dot)
    t.to(nameGroup, { ...name.rail(db.cx, db.cy, 0.5 * U), duration: 0.52, ease: E.inOut }, tH + 0.2).to(nameGroup, { autoAlpha: 0, duration: 0.1, ease: 'power1.in' }, tH + 0.63)
  } else {
    t.to(nameGroup, { autoAlpha: 0, y: '-=' + 2 * U, duration: 0.3, ease: 'power2.in' }, tH + 0.1)
  }
  t.addLabel('done', tH + 0.75)

  // ================================================================ PRIYA'S VOICE, on the same clock
  // Her bubble is read, not heard. It is on screen for the before step (her 'before' line), away
  // while the name has the stage, back as the device arrives (her 'tool' line), changes late in
  // the run to the outcome (her 'after' line: never at the touch), and leaves as the number
  // arrives. These are cues on this timeline, so they hold under a debug URL and when stepping back.
  //
  // Auto-play: the before rest is the only time her 'before' line has, so it is as long as the
  // line needs at reading pace, as far as this moment's own budget allows (see MOMENT.budget).
  const beforeWords = product.priya.before.trim().split(/\s+/).length
  const readFor = READ.settle + beforeWords / READ.wordsPerSecond
  const lap = (dur: number, cap: number) => Math.min(dur, cap)
  const rest =
    CAP.name + HOLD.name + lap(tU - tD, CAP.demo) + TOUCH.wait + TOUCH.travel + lap(tR - tU, CAP.run) + lap(tT - tR, CAP.result) + HOLD.result + lap(tH - tT, CAP.stat) + HOLD.stat + CAP.done
  const beforeIn = lap(tN, CAP.before)
  const beforeHold = Math.max(HOLD.before, Math.min(readFor - beforeIn, MOMENT.budget - rest - beforeIn))

  return {
    tl: t,
    cues: [
      { at: 0, id: 'before' },
      { at: tN, id: 'off' },
      { at: tD + READ.toolAt, id: 'tool' },
      { at: tU + READ.afterAt * (tR - tU), id: 'after' },
      { at: tT, id: 'off' },
    ],
    stops: [
      { label: 'before', cap: CAP.before, hold: beforeHold },
      // the name is the biggest moment of every product, and not a place to wait: manual passes through
      { label: 'name', cap: CAP.name, hold: HOLD.name, pass: true },
      // the one control: live as soon as it can be seen; Next presses it too
      handles.control ? { label: 'demo', cap: CAP.demo, control: handles.control, invite: true } : { label: 'demo', cap: CAP.demo, hold: 1 },
      {
        label: 'result',
        legs: [
          { to: 'ran', cap: CAP.run },
          { to: 'result', cap: CAP.result },
        ],
        hold: HOLD.result,
      },
      { label: 'stat', cap: CAP.stat, hold: HOLD.stat },
      { label: 'done', cap: CAP.done, exit: true },
    ],
  }
}
