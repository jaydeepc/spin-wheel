'use client'

import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Flip } from 'gsap/Flip'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { SplitText } from 'gsap/SplitText'

/** The film's four eases. Everything shared moves on these, so the five moments feel like one hand. */
export interface Eases {
  /** Arrivals: fast out of the gate, a long soft landing. The default. */
  out: gsap.EaseFunction
  /** Travel between two places on the stage. */
  inOut: gsap.EaseFunction
  /** A landing with a little overshoot and follow-through. */
  snap: gsap.EaseFunction
  /** A stamp: accelerates all the way into the hit. */
  slam: gsap.EaseFunction
}

let eases: Eases | null = null

/** Registers the GSAP plugins once and returns the shared eases. Call inside an effect, not at module load. */
export function motion(): Eases {
  if (!eases) {
    gsap.registerPlugin(CustomEase, DrawSVGPlugin, SplitText, MotionPathPlugin, Flip)
    eases = {
      out: CustomEase.create('evOut', '0.16,1,0.3,1'),
      inOut: CustomEase.create('evInOut', '0.76,0,0.24,1'),
      snap: CustomEase.create('evSnap', 'M0,0 C0.18,0 0.12,1.1 0.42,1.045 0.62,1.01 0.74,1 1,1'),
      slam: CustomEase.create('evSlam', 'M0,0 C0.55,0 0.9,0.35 1,1'),
    }
  }
  return eases
}

export { gsap, SplitText, Flip, MotionPathPlugin, DrawSVGPlugin, CustomEase }
