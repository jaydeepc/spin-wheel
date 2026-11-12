'use client'

/**
 * EVERYDAY AI · the shared choreography of a product moment.
 *
 * One paused timeline per moment. Its labels are the END state of each step:
 *
 *   start ─ before ─ name ─ demo ─ ran ─ result ─ stat ─ done
 *
 *   before   the old way: the before card is in
 *   name     the wordmark has landed, opened and closed; its promise is under it
 *   demo     the name is docked, the device is in, the control is waiting for a touch
 *   ran      the demo has been performed (the module's `run` timeline has played)
 *   result   the result headline is in
 *   stat     the number has counted up beside its picture
 *   done     the stage is clear and the name has been filed into the rail
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
import { CAP, HOLD, READ, TOUCH } from './timing'

/**
 * How much a device is enlarged on a phone on its side, so its text can be read. The phone
 * fills the stage's whole height there, from the top of the docked name to the foot of
 * Priya's line (see "A phone on its side" in everyday.css), and stands that much lower than centre.
 */
const SMALL_ZOOM = { phone: 1.2, laptop: 1.12, none: 1 } as const
const SMALL_DROP = 2.45

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
  const beforeEl = $('.ev-before')
  const beforeRise = $$('.ev-before-txt .ev-rise')
  const flash = $('.ev-flash')
  const nameGroup = $('.ev-name')
  const promise = $('.ev-promise .ev-rise')
  const dockcap = $('.ev-dockcap .ev-rise')
  const demoRise = $$('.ev-col--demo > p .ev-rise')
  const under = $('.ev-col-under')
  const resultCol = $('.ev-col--result')
  const sentenceEl = $('.ev-sentence')
  const proof = $('.ev-proof')
  const side = $('.ev-side')
  const statPic = $('.ev-stat-pic')
  const statRise = $$('.ev-stat .ev-rise')
  const numEl = $('.ev-stat-n')
  const mover = $('.ev-deviceMover')
  const nudge = $('.ev-deviceNudge')
  const extras = $('.ev-extras')
  const railStop = document.querySelector<HTMLElement>(`[data-ev-rail="${product.key}"]`)
  const railName = railStop?.querySelector<HTMLElement>('.ev-stop-pop') ?? null

  // ---------------------------------------------------------------- pose the stage as it is during the demo, and measure
  const zoom = stage.small ? SMALL_ZOOM[deviceKind] : 1
  const zoomY = stage.small && deviceKind === 'phone' ? SMALL_DROP * U : 0
  const m0 = stage.loc(mover)
  gsap.set(mover, { scale: zoom, y: zoomY })
  const name = prepareName(root, stage, E)
  const dockAt = stage.loc($('.ev-dock'))
  const rc = stage.loc(resultCol)
  const sideBox = side ? stage.loc(side) : null

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
    shared: { device: mover, photo: $<HTMLElement>('.ev-photo-frame'), name: nameGroup },
    bump(s, at, strength = 1) {
      s.to(nudge, { y: 0.16 * U * strength, duration: 0.07, ease: 'power1.out' }, at).to(nudge, { y: 0, duration: 0.3, ease: 'power2.out' }, at + 0.07)
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
  gsap.set(beforePic, { autoAlpha: 0, y: 2.6 * U, scale: 0.92, rotation: -5 })
  gsap.set(flash, { autoAlpha: 0, scale: 0.6 })
  name.setInitial()
  gsap.set(mover, { autoAlpha: 0, y: zoomY + 46 * U, rotation: deviceKind === 'phone' ? 5 : 0, scale: zoom })
  if (under) gsap.set(under, { autoAlpha: 0, y: 0.8 * U })
  if (side) gsap.set(side, { autoAlpha: 0, x: 5 * U, scale: 0.95 })
  if (proof) gsap.set(proof, { autoAlpha: 0, y: 1 * U })
  gsap.set(statPic, { autoAlpha: 0 })
  gsap.set(numEl, { textContent: 0 })

  // ================================================================ BEFORE: the old way, small
  const tB = 0
  t.addLabel('start', 0)
  t.to(beforePic, { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.7, ease: E.snap }, tB)
    .to(beforeRise, { yPercent: 0, duration: 0.65, stagger: 0.09 }, tB + 0.12)
    .add(sec.before.paused(false), tB)
  const tN = tB + Math.max(0.85, sec.before.duration())
  t.addLabel('before', tN)

  // ================================================================ NAME: the hero
  t.to(beforeEl, { autoAlpha: 0, scale: 0.92, y: -1.6 * U, duration: 0.36, ease: 'power2.in' }, tN).to(
    flash,
    { autoAlpha: 1, scale: 1, duration: 1.1 },
    tN + 0.1,
  )
  const nameDur = name.addTo(t, tN)
  t.to(promise, { yPercent: 0, duration: 0.6 }, tN + (name.opens ? 1.35 : 1.0))
  const tD = tN + nameDur
  t.addLabel('name', tD)

  // ================================================================ DEMO: the name docks, the device arrives
  const dock = name.dock(dockAt.x, dockAt.y, 31 * U, 7.05 * U)
  name.addLeaveCentre(t, tD)
  t.to(promise, { yPercent: -118, duration: 0.32, ease: 'power3.in' }, tD)
    .to(nameGroup, { ...dock, duration: 0.85, ease: E.inOut }, tD + 0.04)
    .to(flash, { autoAlpha: 0.5, duration: 0.85, ease: 'power1.inOut' }, tD)
    .to(dockcap, { yPercent: 0, duration: 0.55 }, tD + 0.65)
    .to(mover, { autoAlpha: 1, duration: 0.01 }, tD + 0.05)
    .to(mover, { y: zoomY, rotation: 0, duration: 0.95 }, tD + 0.05)
    .to(demoRise, { yPercent: 0, duration: 0.6, stagger: 0.07 }, tD + 0.5)
  if (under) t.to(under, { autoAlpha: 1, y: 0, duration: 0.45 }, tD + 0.75)
  if (side) t.to(side, { autoAlpha: 1, x: 0, scale: 1, duration: 0.8 }, tD + 0.4)
  t.add(sec.demo.paused(false), tD)
  const tU = tD + Math.max(1.25, sec.demo.duration())
  t.addLabel('demo', tU)

  // ================================================================ RUN: the touch, and what it does
  t.add(sec.run.paused(false), tU)
  const tR = tU + Math.max(0.2, sec.run.duration())
  t.addLabel('ran', tR)

  // ================================================================ RESULT: the new way, in one sentence
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
  // the device makes room: it settles between the headline and the photo
  let resultX = 0
  let resultScale = 1
  // A side panel that a moment has moved to the headline's own place (Prastuti, on a phone on its
  // side: her words stand left of the laptop) is not a neighbour to keep clear of: it leaves
  // when the headline arrives.
  const sideLeaves = !!sideBox && sideBox.x < rc.x + rc.w
  if (deviceKind !== 'none') {
    const loEdge = rc.x + rc.w + 2.2 * U
    const hiEdge = sideBox && !sideLeaves ? sideBox.x - 2.2 * U : stage.hx
    // a phone steps back a little; a laptop only as far as it must to stand clear of both.
    // On a phone on its side a device keeps its enlarged size if it can: what is on it is still being read.
    resultScale = deviceKind === 'phone' ? (stage.small ? zoom : 0.94) : Math.min(zoom, Math.max(0.8, (hiEdge - loEdge) / m0.w))
    const half = (m0.w * resultScale) / 2
    const lo = loEdge + half
    const hi = hiEdge - half
    const cx = lo <= hi ? Math.min(Math.max(m0.cx, lo), hi) : (lo + hi) / 2
    resultX = cx - m0.cx
  } else {
    // a centrepiece of its own draws back toward the right edge, to give the headline its room.
    // On a phone on its side it keeps its size: its words are at their floor already, and the
    // moment lays its headline out beside it (see the moment's own phone block).
    resultScale = stage.small ? 1 : 0.84
    resultX = (m0.w * (1 - resultScale)) / 2
  }
  t.to(demoRise, { yPercent: -118, duration: 0.3, ease: 'power3.in', stagger: 0.03 }, tR)
  if (under) t.to(under, { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, tR)
  if (side && sideLeaves) t.to(side, { autoAlpha: 0, duration: 0.24, ease: 'power1.in' }, tR)
  t.to(mover, { x: resultX, y: stage.small && deviceKind === 'phone' ? zoomY : 0, scale: resultScale, duration: 0.85, ease: E.inOut }, tR).to(
    lines,
    { yPercent: 0, duration: 0.65, stagger: 0.07 },
    tR + 0.16,
  )
  if (proof) t.to(proof, { autoAlpha: 1, y: 0, duration: 0.4 }, tR + 0.5)
  t.add(sec.result.paused(false), tR)
  const tT = tR + Math.max(0.95, sec.result.duration())
  t.addLabel('result', tT)

  // ================================================================ STAT: a huge number, with a picture of it
  const target = Number((numEl.parentElement?.dataset.value ?? '0').replace(/[^\d.]/g, '')) || 0
  t.to(lines, { yPercent: -118, duration: 0.32, ease: 'power3.in', stagger: 0.03 }, tT)
  if (proof) t.to(proof, { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, tT)
  if (side) t.to(side, { autoAlpha: 0, x: 5 * U, duration: 0.4, ease: 'power2.in' }, tT)
  if (landOn) {
    // the device flies into its place in the picture, and becomes part of it
    t.to(
      mover,
      { x: landOn.cx - m0.cx, y: landOn.cy - m0.cy, scale: (landOn.w * 1.1) / m0.w, duration: 0.8, ease: E.inOut },
      tT + 0.05,
    ).to(mover, { autoAlpha: 0, duration: 0.14, ease: 'power1.in' }, tT + 0.73)
  } else {
    t.to(mover, { y: 7 * U, scale: resultScale * 0.9, autoAlpha: 0, duration: 0.45, ease: 'power2.in' }, tT)
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

  // ================================================================ HAND OVER: the name is filed into the day
  t.to(statRise, { yPercent: -118, duration: 0.36, ease: 'power3.in', stagger: 0.04 }, tH)
    .to(statPic, { autoAlpha: 0, scale: 0.97, duration: 0.3, ease: 'power2.in' }, tH)
    .to(dockcap, { yPercent: -118, duration: 0.28, ease: 'power3.in' }, tH)
    .to(flash, { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, tH)
  if (extras) t.to(extras, { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, tH)
  if (railName && railStop) {
    // The name lands exactly on its own name in the rail, at the size the rail shows the current
    // name. That size is worked out from the stop's CSS, not measured: when a moment is built
    // the rail is still easing into it. The rail is outside the stage, so its lengths are ÷ Z.
    const cs = getComputedStyle(railStop)
    const grow = parseFloat(cs.getPropertyValue('--cur-scale')) || 1
    const lean = parseFloat(cs.getPropertyValue('--cur-dx')) || 0
    const sb = stage.loc(railStop)
    const nameCs = getComputedStyle(railName.parentElement as HTMLElement)
    const top = parseFloat(nameCs.top) || 0
    const lh = parseFloat(nameCs.lineHeight) || 0
    const railFont = (parseFloat(nameCs.fontSize) * grow) / stage.Z
    t.to(nameGroup, { ...name.rail(sb.cx + (lean * U) / stage.Z, sb.y + (top + lh / 2) / stage.Z, railFont), duration: 0.66, ease: E.inOut }, tH + 0.04)
  }
  t.to(nameGroup, { autoAlpha: 0, duration: 0.1, ease: 'none' }, tH + 0.62)
  t.addLabel('done', tH + 0.75)

  // ================================================================ PRIYA'S LINE, on the same clock
  // Her 'before' line is read, not heard: it stays on screen while the name lands, for as long
  // as it takes to read (see READ in timing.ts), and her next line arrives after it. The longest
  // lines hand over just before the name has finished, so the name always ends with her saying it.
  const beforeWords = product.priya.before.trim().split(/\s+/).length
  const readFor = READ.settle + beforeWords / READ.wordsPerSecond
  const lag = Math.min(Math.max(readFor - (tN + HOLD.before), 0), Math.max(0, nameDur - READ.nameTail))

  return {
    tl: t,
    cues: [
      { at: 0, id: 'before' },
      { at: tN + lag, id: 'tool' },
      { at: tU, id: 'after' },
    ],
    stops: [
      { label: 'before', cap: CAP.before, hold: HOLD.before },
      { label: 'name', cap: CAP.name, hold: HOLD.name },
      handles.control ? { label: 'demo', cap: CAP.demo, control: handles.control, ghostAfter: TOUCH.wait } : { label: 'demo', cap: CAP.demo, hold: 1 },
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
