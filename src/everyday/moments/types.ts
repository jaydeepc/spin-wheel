/**
 * EVERYDAY AI · THE CONTRACT for a product moment.
 *
 * Every moment is the same film in five steps: before, name, demo, result, stat.
 * The shared frame (moments/Moment.tsx + core/buildMoment.ts) owns everything the five
 * share: the before card, THE NAME, the device, the photo, the result headline, the
 * counting number, the hand-over, the touch invitation and the ghost touch.
 *
 * A product module supplies only what is unique to it:
 *
 *   Before    the little picture of the old way
 *   Screen    what is inside the device (or, with device: 'none', its own centrepiece)
 *   Stat      the picture of the number
 *   animate() its own animation, added to five small timelines, one per step
 *
 * Read moments/README.md, then moments/byot.tsx: it is the reference.
 */

import type { ComponentType } from 'react'
import type { ACCENTS, Product } from '../content'
import type { Eases } from '../core/motion'
import type { Box } from '../core/stage'

export type DeviceKind = 'phone' | 'laptop' | 'none'

/** Every component a module supplies receives its product (typed) and nothing else. */
export interface PartProps<P extends Product = Product> {
  product: P
}

export interface MomentSections {
  /**
   * t = 0: the before card starts to arrive (its frame has landed by 0.6).
   * Animate the inside of your Before picture. Budget: 0.85 s.
   */
  before: gsap.core.Timeline
  /**
   * t = 0: the name starts to dock top-left and the device starts to rise (it has landed by 1.0).
   * Assemble your screen; the control must be visible and ready at the end. Budget: 1.25 s.
   */
  demo: gsap.core.Timeline
  /**
   * t = 0: THE TOUCH. This is the demo: what happens when the control is pressed.
   * Its last frame is the end state the result step is built on. Budget: 2.8 s.
   */
  run: gsap.core.Timeline
  /**
   * t = 0: the result headline starts to rise (the device slides aside over 0.9).
   * Animate your Proof, if you have one. Budget: 0.95 s.
   */
  result: gsap.core.Timeline
  /**
   * t = 0: the stat begins. The number counts from 0.35 to 1.3; the device has gone
   * (into `deviceLandsOn`, if you return one) by 0.85. Draw your Stat picture. Budget: 1.5 s.
   */
  stat: gsap.core.Timeline
}

export interface MomentEnv<P extends Product = Product> extends MomentSections {
  product: P
  /** The brand colours of this product's accent: { main, ink, soft, haze }. */
  accent: (typeof ACCENTS)[keyof typeof ACCENTS]
  /** One fluid unit (the CSS --u) in pixels. Size every distance from it: `3 * U`. */
  U: number
  /** Half the content width in pixels: the stage's content runs from x = -hx to x = +hx. Keep flying things inside it. */
  hx: number
  /** A phone on its side: the device is enlarged during the demo, so keep to relative moves inside it. */
  small: boolean
  /** The four shared eases: out (arrive), inOut (travel), snap (land with follow-through), slam (stamp). */
  ease: Eases
  /** One of YOUR elements (the query is scoped to this moment). */
  $<T extends Element = HTMLElement>(selector: string): T
  /** All of YOUR elements matching. */
  $$<T extends Element = HTMLElement>(selector: string): T[]
  /**
   * An element's box in stage pixels from the stage centre, as it is drawn when animate()
   * is called. At that instant the stage is posed AS IT WILL BE DURING THE DEMO AND THE RUN:
   * device in place (and enlarged on a small screen), photo and Beside in place, your Stat
   * picture laid out. So loc() of a field inside the device is where a chip must fly to.
   * The numbers work directly as gsap x / y for an element in your Extras layer.
   */
  loc(el: Element): Box
  /**
   * Where each letter of the big name stands when it has landed at centre stage (before it
   * docks), in the same coordinates: BYOT gives four boxes. Things can be born from the letters.
   */
  letters: Box[]
  /** Shared elements you may aim at or measure. Do not animate them: the shared frame does. */
  shared: {
    /** The whole device (frame and screen), or your own centrepiece's box. */
    device: HTMLElement
    /** The photo of this moment in her day, if the product has one. */
    photo: HTMLElement | null
    /** The docked name, top-left. */
    name: HTMLElement
  }
  /** A small knock on the device, as if something landed in it: `bump(run, 1.2)` or `bump(run, 1.2, 2)`. */
  bump(section: gsap.core.Timeline, at: number, strength?: number): void
}

export interface MomentHandles {
  /**
   * The one control that does the thing. Render it with <TouchControl> (moments/parts.tsx)
   * inside your Screen or Extras and return its element: env.$('[data-ev-control]').
   * The shared frame gives it its living pulse, sends the ghost fingertip to it, and plays
   * your `run` timeline when it is touched.
   */
  control: HTMLElement | null
  /**
   * An element inside your Stat picture that the device should fly into and become
   * (BYOT: the phone shrinks into its own tile among the 634). Leave out and the device sinks away.
   */
  deviceLandsOn?: HTMLElement | null
}

export interface MomentModule<P extends Product = Product> {
  key: P['key']
  /** 'phone' (default), 'laptop' (Prastuti), or 'none': your Screen is the centrepiece itself (Piramal Mind). */
  device?: DeviceKind
  /** The title and one line beside the device during the demo (left column). */
  demoTitle: string
  demoLine: string
  /** A phrase of product.after to pick out in the accent colour in the result headline. */
  highlight?: string
  /** The time on the phone's status bar (defaults to the moment's time). */
  clock?: string

  /** The little picture of the old way. It fills a 25u × 20u box beside the word "Before". */
  Before: ComponentType<PartProps<P>>
  /** What is inside the device. Fills the screen; lay it out in --u like everything else. */
  Screen: ComponentType<PartProps<P>>
  /** The picture of the number. It fills the box to the right of the stat: 32 × 20 tile pitches (--ev-pitch), about 38u × 24u. */
  Stat: ComponentType<PartProps<P>>

  /** Optional: a little more under the demo title and line (left column). */
  Under?: ComponentType<PartProps<P>>
  /** Optional: a small panel under the photo (right column). Without a photo it takes the photo's place. */
  Beside?: ComponentType<PartProps<P>>
  /** Optional: one line of proof under the result headline. */
  Proof?: ComponentType<PartProps<P>>
  /** Optional: something that sits ON the device and travels with it, but is not clipped by its screen (BYOT's stamp). */
  OnDevice?: ComponentType<PartProps<P>>
  /** Optional: a free layer over the whole stage (a 0 × 0 box at the stage centre) for things that fly between places. */
  Extras?: ComponentType<PartProps<P>>

  /**
   * Add your animation. Set your starting states with gsap.set(), add tweens to
   * env.before / demo / run / result / stat, return your control. Rules:
   *   · transforms, opacity (autoAlpha), clip-path and SVG attributes only
   *   · .to() and .fromTo(…, { immediateRender: false }) only; never .from()
   *   · no callbacks that change state, no delayedCall, no timers: every frame must be reachable by seeking
   *   · touch only your own elements (env.$ / env.$$)
   */
  animate(env: MomentEnv<P>): MomentHandles
}
