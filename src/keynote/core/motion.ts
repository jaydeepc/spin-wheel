'use client'

import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { SplitText } from 'gsap/SplitText'

/** The keynote's eases. Everything moves on these, so 65 scenes feel like one hand. */
export interface Eases {
  /** Arrivals: fast out of the gate, a long soft landing. The default. */
  out: gsap.EaseFunction
  /** Travel between two places on the stage. */
  inOut: gsap.EaseFunction
  /** A landing with a little overshoot and follow-through (a card, a chip, a dot). */
  snap: gsap.EaseFunction
  /** A stamp: accelerates all the way into the hit. */
  slam: gsap.EaseFunction
  /** A long, even glide: lines drawing, light travelling. */
  glide: gsap.EaseFunction
}

/**
 * Timing tokens, in seconds. Use them instead of numbers of your own, so that a rule drawing on
 * slide 5 and a rule drawing on slide 40 take the same time.
 */
export const T = {
  /** a word of a headline rising through its mask */
  word: 0.7,
  /** between two words of a headline */
  wordGap: 0.045,
  /** a card, a chip, a picture arriving */
  enter: 0.75,
  /** between siblings arriving one after another */
  stagger: 0.08,
  /** a rule, an axis, a connector drawing */
  draw: 0.9,
  /** a number counting up */
  count: 1.2,
  /** something leaving */
  leave: 0.35,
  /** a slow camera or backdrop move under a beat */
  drift: 1.8,
} as const

let eases: Eases | null = null

/** Registers the GSAP plugins once and returns the shared eases. Call inside an effect, not at module load. */
export function motion(): Eases {
  if (!eases) {
    gsap.registerPlugin(CustomEase, DrawSVGPlugin, SplitText, MotionPathPlugin, Flip)
    eases = {
      out: CustomEase.create('knOut', '0.16,1,0.3,1'),
      inOut: CustomEase.create('knInOut', '0.76,0,0.24,1'),
      snap: CustomEase.create('knSnap', 'M0,0 C0.18,0 0.12,1.1 0.42,1.045 0.62,1.01 0.74,1 1,1'),
      slam: CustomEase.create('knSlam', 'M0,0 C0.55,0 0.9,0.35 1,1'),
      glide: CustomEase.create('knGlide', '0.45,0.05,0.2,1'),
    }
  }
  return eases
}

export { gsap, SplitText, Flip, MotionPathPlugin, DrawSVGPlugin, CustomEase }
