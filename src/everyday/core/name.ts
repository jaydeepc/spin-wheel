'use client'

/**
 * THE NAME. The one piece of choreography every moment shares, so that five product
 * names are learnt the same way: a giant wordmark lands at centre stage, opens into what
 * it stands for, closes again, then docks top-left and stays for the rest of the moment.
 *
 *   acronym  BYOT, BYOA       four giant initials open into "Build Your Own Tech" and close
 *   hindi    Prastuti         the word turns into प्रस्तुति with its meaning, and turns back
 *   plain    SmartHelp, Piramal Mind   the wordmark lands, is underlined with its promise, and
 *                                     the underline runs out under the whole word and back
 *
 * Open Sans metrics used below (for a line box with line-height 1):
 * cap top 0.174 em, cap middle 0.531 em, baseline 0.888 em from the top of the box.
 */

import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import type { Eases } from './motion'
import type { Box, Stage } from './stage'

const CAP_MID = 0.531
const BASE = 0.888
/** Optical kerning between a giant initial and the rest of its word, in em of the small size. */
const KERN: Record<string, number> = { B: -0.004, Y: -0.05, O: -0.012, T: -0.085, A: -0.03 }

export interface NameRig {
  /** Where each landed letter stands, in stage pixels from the stage centre. */
  letters: Box[]
  /** The name opens into something else (an expansion, a Hindi word) before it closes again. */
  opens: boolean
  /** Hide everything, ready to land. Call after the moment's module has measured. */
  setInitial(): void
  /** Adds the landing, opening and closing at `at`. Returns how long they take. */
  addTo(tl: gsap.core.Timeline, at: number): number
  /** Adds the exit of the name's small print (captions, underline) as it leaves centre stage. */
  addLeaveCentre(tl: gsap.core.Timeline, at: number): void
  /** The transform that docks the wordmark with its left edge at x and its baseline at y. */
  dock(x: number, baselineY: number, maxWidth: number, maxCap: number): { x: number; y: number; scale: number }
  /** The transform that lays the wordmark over a rail label of the given font size, centred on (cx, cy). */
  rail(cx: number, cy: number, fontPx: number): { x: number; y: number; scale: number }
}

export function prepareName(root: HTMLElement, stage: Stage, E: Eases): NameRig {
  const U = stage.U
  const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
  const $$ = <T extends Element = HTMLElement>(sel: string) => Array.from(root.querySelectorAll(sel)) as unknown as T[]
  const kind = (root.dataset.name ?? 'plain') as 'acronym' | 'hindi' | 'plain'
  const capMid = -3.1 * U
  const clipShut = 'inset(0% 100% 0% 0%)'
  const clipOpen = 'inset(-10% -4% -20% 0%)'

  // ================================================================ acronym
  if (kind === 'acronym') {
    const masks = $$('.ev-initMask')
    const glyphs = $$('.ev-init')
    const tails = $$('.ev-tail')
    const unders = $$('.ev-under')
    const F = parseFloat(getComputedStyle(masks[0]).fontSize)
    const f0 = parseFloat(getComputedStyle(tails[0]).fontSize)
    const W = masks.map((m) => m.offsetWidth)
    const w0 = tails.map((el) => el.offsetWidth)
    const track = -0.012 * F
    const closedW = W.reduce((a, b) => a + b, 0) + track * (W.length - 1)
    const Yc = capMid - CAP_MID * F
    const closedX: number[] = []
    let cx = -closedW / 2
    W.forEach((wi) => {
      closedX.push(cx)
      cx += wi + track
    })

    // the open line: Build Your Own Tech, set as one line and fitted to the field
    const kern0 = glyphs.map((g) => KERN[(g.textContent ?? '').trim()] ?? -0.02)
    const natural = (f: number) => {
      const s = f / F
      return W.reduce((sum, wi, i) => sum + wi * s + kern0[i] * f + w0[i] * (f / f0), 0) + 0.3 * f * (W.length - 1)
    }
    const q = Math.min(1, (stage.hx * 2 * 0.96) / natural(f0))
    const f = f0 * q
    const sOpen = f / F
    const w = w0.map((x) => x * q)
    const kern = kern0.map((k) => k * f)
    const space = 0.3 * f
    const wordW = W.map((wi, i) => wi * sOpen + kern[i] + w[i])
    const openW = wordW.reduce((a, b) => a + b, 0) + space * (W.length - 1)
    const Yo = capMid - CAP_MID * f
    const openX: number[] = []
    const tailX: number[] = []
    let ox = -openW / 2
    wordW.forEach((ww, i) => {
      openX.push(ox)
      tailX.push(ox + W[i] * sOpen + kern[i])
      ox += ww + space
    })
    // each tail rides on the right edge of its letter, so the word grows out of the initial
    const tailHomeX = (i: number) => closedX[i] + W[i] + kern[i]
    const tailHomeY = capMid + (BASE - CAP_MID) * F - BASE * f
    const underY = Yc + BASE * F

    return {
      letters: closedX.map((x, i) => ({ x, y: Yc, w: W[i], h: F, cx: x + W[i] / 2, cy: capMid })),
      opens: true,
      setInitial() {
        gsap.set(masks, { x: (i) => closedX[i] + (i - (W.length - 1) / 2) * 1.6 * U, y: Yc })
        gsap.set(glyphs, { yPercent: 104 })
        gsap.set(tails, { x: tailHomeX, y: tailHomeY, scale: q, transformOrigin: '0 0', clipPath: clipShut, autoAlpha: 0 })
        gsap.set(unders, { x: (i) => closedX[i] + W[i] / 2, xPercent: -50, y: underY + 2.5 * U, autoAlpha: 0 })
      },
      addTo(t, tN) {
        const tO = tN + 0.72 // opens, as the last initial settles
        const tC = tN + 2.05 // closes: the open line has been held long enough to be read
        t.to(glyphs, { yPercent: 0, duration: 0.6, stagger: 0.04 }, tN + 0.1)
          .to(masks, { x: (i) => closedX[i], duration: 0.5, stagger: 0.04, ease: E.snap }, tN + 0.1)
          // opens out: Build Your Own Tech
          .to(masks, { x: (i) => openX[i], y: Yo, scale: sOpen, duration: 0.75, ease: E.inOut, stagger: 0.02 }, tO)
          .to(tails, { x: (i) => tailX[i], y: Yo, duration: 0.75, ease: E.inOut, stagger: 0.02 }, tO)
          .to(tails, { autoAlpha: 1, duration: 0.01 }, tO + 0.28)
          .to(tails, { clipPath: clipOpen, duration: 0.55, stagger: 0.045 }, tO + 0.3)
          // and closes again
          .to(tails, { clipPath: clipShut, duration: 0.26, ease: 'power2.in', stagger: 0.02 }, tC)
          .to(tails, { autoAlpha: 0, duration: 0.01 }, tC + 0.33)
          .to(tails, { x: tailHomeX, y: tailHomeY, duration: 0.62, ease: E.snap, stagger: 0.02 }, tC + 0.12)
          .to(masks, { x: (i) => closedX[i], y: Yc, scale: 1, duration: 0.62, ease: E.snap, stagger: 0.02 }, tC + 0.12)
          .to(unders, { autoAlpha: 1, y: underY + 1.5 * U, duration: 0.4, stagger: 0.04 }, tC + 0.28)
        return 2.85
      },
      addLeaveCentre(t, at) {
        t.to(unders, { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, at)
      },
      dock(x, baselineY, maxWidth, maxCap) {
        const scale = Math.min(maxCap / (0.714 * F), maxWidth / closedW)
        return { x: x - (closedX[0] + 0.045 * F) * scale, y: baselineY - (Yc + BASE * F) * scale, scale }
      },
      rail(cx0, cy0, fontPx) {
        const scale = fontPx / F
        return { x: cx0, y: cy0 - capMid * scale, scale }
      },
    }
  }

  // ================================================================ plain and hindi: one wordmark
  const mask = $('.ev-wordMask')
  const word = $('.ev-word')
  const rule = $('.ev-name-rule')
  const devaMask = $('.ev-devaMask')
  const deva = $('.ev-deva')
  const meaning = $('.ev-meaning')
  const F = parseFloat(getComputedStyle(word).fontSize)
  const split = SplitText.create(word, { type: 'chars', charsClass: 'ev-ch' })
  const chars = split.chars as HTMLElement[]
  const W = word.offsetWidth
  const x0 = -W / 2
  const Yc = capMid - CAP_MID * F
  const padX = parseFloat(getComputedStyle(mask).paddingLeft) || 0
  const padY = parseFloat(getComputedStyle(mask).paddingTop) || 0
  const underY = Yc + BASE * F + 1.5 * U
  /** under the Devanagari word, which reaches lower than the Latin one */
  const openUnderY = capMid + 0.72 * F
  /** the underline of a plain name sits clear of its descenders */
  const ruleY = Yc + (BASE + 0.3) * F
  const wordBox = word.getBoundingClientRect()
  const letters: Box[] = chars.map((ch) => {
    const r = ch.getBoundingClientRect()
    const x = x0 + (r.left - wordBox.left) / stage.Z
    const cw = r.width / stage.Z
    return { x, y: Yc, w: cw, h: F, cx: x + cw / 2, cy: capMid }
  })

  return {
    letters,
    opens: kind === 'hindi',
    setInitial() {
      gsap.set(mask, { x: x0 - padX, y: Yc - padY })
      gsap.set(chars, { yPercent: 112 })
      if (rule) gsap.set(rule, { x: 0, xPercent: -50, y: ruleY, scaleX: 0, autoAlpha: 0 })
      if (devaMask && deva) {
        const dw = devaMask.offsetWidth
        const dh = devaMask.offsetHeight
        gsap.set(devaMask, { x: -dw / 2, y: capMid - dh * 0.5 })
        gsap.set(deva, { yPercent: 102 })
      }
      if (meaning) gsap.set(meaning, { x: 0, xPercent: -50, y: openUnderY + 1 * U, autoAlpha: 0 })
    },
    addTo(t, tN) {
      t.to(chars, { yPercent: 0, duration: 0.8, stagger: 0.035 }, tN + 0.1)
      if (kind === 'hindi' && deva && meaning) {
        const tO = tN + 0.8 // turns into the Hindi word
        const tC = tO + 1.05 // and back
        t.to(chars, { yPercent: -112, duration: 0.4, ease: 'power3.in', stagger: 0.018 }, tO)
          .to(deva, { yPercent: 0, duration: 0.6 }, tO + 0.22)
          .to(meaning, { autoAlpha: 1, y: openUnderY, duration: 0.45 }, tO + 0.45)
          .to(deva, { yPercent: -102, duration: 0.32, ease: 'power3.in' }, tC)
          .to(meaning, { y: underY, duration: 0.6, ease: E.inOut }, tC + 0.2)
          .set(chars, { yPercent: 112 }, tC + 0.24)
          .to(chars, { yPercent: 0, duration: 0.6, stagger: 0.025 }, tC + 0.25)
        return tC - tN + 1.05
      }
      if (rule) {
        // A plain name has nothing to open into, so its second beat is its own: the underline runs
        // out to the full width of the word while the letters lift over it from the middle, and
        // settles back. It takes as long as BYOT's opening, so every name holds the stage equally.
        const full = (W * 0.97) / Math.max(1, rule.offsetWidth)
        t.to(rule, { autoAlpha: 1, duration: 0.01 }, tN + 0.7)
          .to(rule, { scaleX: 1, duration: 0.55, ease: E.inOut }, tN + 0.7)
          .to(rule, { scaleX: full, duration: 0.55, ease: E.inOut }, tN + 1.8)
          .to(chars, { yPercent: -4.5, duration: 0.26, ease: 'power2.out', stagger: { each: 0.022, from: 'center' } }, tN + 1.88)
          .to(chars, { yPercent: 0, duration: 0.5, ease: E.snap, stagger: { each: 0.022, from: 'center' } }, tN + 2.14)
          .to(rule, { scaleX: 1, duration: 0.42, ease: E.inOut }, tN + 2.43)
      }
      return 2.85
    },
    addLeaveCentre(t, at) {
      if (rule) t.to(rule, { scaleX: 0, autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, at)
      if (meaning) t.to(meaning, { autoAlpha: 0, duration: 0.22, ease: 'power1.in' }, at)
    },
    dock(x, baselineY, maxWidth, maxCap) {
      const scale = Math.min(maxCap / (0.714 * F), maxWidth / W)
      return { x: x - (x0 + 0.04 * F) * scale, y: baselineY - (Yc + BASE * F) * scale, scale }
    },
    rail(cx0, cy0, fontPx) {
      const scale = fontPx / F
      return { x: cx0, y: cy0 - capMid * scale, scale }
    },
  }
}
