/**
 * EVERYDAY AI · THE CONTRACT for a product moment.
 *
 * Every moment is the same film in five steps: before, name, demo, result, stat.
 * The shared frame (moments/Moment.tsx + core/buildMoment.ts) owns everything the five
 * share: THE LAYOUT (the name, the statement and Priya's voice down the left, ONE picture on
 * the right), the "Before" tag, THE NAME, the device and where it stands, the result headline,
 * the counting number, the hand-over, and the touch.
 *
 * A product module supplies only what is unique to it:
 *
 *   Before    the picture of the old way
 *   Screen    what is inside the device (or, with device: 'none', its own centrepiece)
 *   Stat      the picture of the number
 *   animate() its own animation, added to five small timelines, one per step
 *
 * Read moments/README.md first: THE LAYOUT and THE BUDGET there are the rules.
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
   * t = 0: the old-way picture starts to arrive in the picture area (it has landed by 0.6).
   * Animate the inside of your Before picture. Budget: 0.85 s.
   */
  before: gsap.core.Timeline
  /**
   * t = 0: the name starts to dock top-left and the device starts to rise in the picture area
   * (it has landed by 1.0). Priya's 'tool' line arrives in her bubble at 0.5.
   * Assemble your screen; the control must be visible and ready at the end. Budget: 1.25 s.
   * The control can be pressed from the instant it can be seen (on screen, not hidden, at least
   * 0.6 opaque), so bring it in when the screen around it makes sense, not before.
   */
  demo: gsap.core.Timeline
  /**
   * t = 0: THE TOUCH. This is the demo: what happens when the control is pressed.
   * Its last frame is the end state the result step is built on. Budget: 2.8 s.
   * Priya's 'after' line arrives 70% of the way through.
   */
  run: gsap.core.Timeline
  /**
   * t = 0: the result begins. The caption under the docked name leaves (0 to 0.3), the headline
   * rises in the statement slot (0.16 to 0.9), your supporting line (`Proof`) fades in under it
   * (0.45 to 0.85). The device does NOT move: it is already in its place, the right half.
   * EXITS BELONG HERE, at 0 to 0.35: whatever your run left on the device that is not in the
   * resting budget (one thing on the device, about six rows of words) leaves now, with
   * `env.leave(env.result, [...])`. Budget: 0.95 s.
   */
  result: gsap.core.Timeline
  /**
   * t = 0: the number begins. The headline, the supporting line and Priya's bubble leave (0 to
   * 0.35); the number counts from 0.35 to 1.3; the device has gone (into `deviceLandsOn`, if you
   * return one) by 0.85. EXITS BELONG HERE too, at 0 to 0.3: anything of yours outside the device
   * (your Extras) that the number's screen does not show. Draw your Stat picture. Budget: 1.5 s.
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
   * is called. At that instant the stage is posed AS IT WILL BE DURING THE DEMO, THE RUN AND THE
   * RESULT: the device in its place in the picture area, at the size the frame has fitted it to
   * (it is enlarged at every screen size now, not only on a phone), your Before picture at its
   * resting size and place, your Stat picture laid out. So loc() of a field inside the device is
   * where a chip must fly to.
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
    /** The docked name, top-left. */
    name: HTMLElement
  }
  /** A small knock on the device, as if something landed in it: `bump(run, 1.2)` or `bump(run, 1.2, 2)`. */
  bump(section: gsap.core.Timeline, at: number, strength?: number): void
  /**
   * Send things OUT on cue, the same way in every moment: each target lifts a little and fades,
   * 0.26 s, one after the other (0.045 s apart; `stagger: 0` for all at once). They end hidden
   * (autoAlpha 0). `leave(env.result, env.$$('.byot-row'))` at the start of the result is how what
   * belonged to the demo and is not in the resting budget goes. `at` defaults to 0.
   */
  leave(section: gsap.core.Timeline, targets: gsap.TweenTarget, at?: number, opts?: { stagger?: number; dy?: number }): void
  /** The picture area: the right half, where the frame stands the ONE picture (stage pixels). Do not draw outside it. */
  area: Box
}

export interface MomentHandles {
  /**
   * The one control that does the thing. Render it with <TouchControl> (moments/parts.tsx)
   * inside your Screen or Extras and return its element: env.$('[data-ev-control]').
   * The shared frame makes it pulse and pressable as soon as it can be seen and plays your `run`
   * timeline when it is pressed, or when Next is (the button, a key, a tap on the empty stage).
   * In Auto-play the ghost fingertip presses it. Once pressed it is spent: further taps do nothing.
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
  /**
   * Show product.before.headline in the statement slot at the before rest. Only where Priya's
   * 'before' line does not itself tell the old way (Piramal Mind: her line sets up the request).
   */
  beforeHeadline?: boolean
  /** A phrase of product.after to pick out in the accent colour in the result headline. */
  highlight?: string

  /**
   * The picture of the old way. Lay it out for a 25u × 20u box; the frame stands it in the
   * picture area under a small "Before" tag and enlarges it whole (up to 1.6×) to fit.
   */
  Before: ComponentType<PartProps<P>>
  /** What is inside the device. Fills the screen; lay it out in --u like everything else. */
  Screen: ComponentType<PartProps<P>>
  /** The picture of the number. It fills the box to the right of the stat: 32 × 20 tile pitches (--ev-pitch), about 38u × 24u. */
  Stat: ComponentType<PartProps<P>>

  /**
   * Optional, and for TWO products only (SmartHelp: demo.twoWays; Piramal Mind: the defect
   * tracing): ONE supporting line directly under the result headline, saying something nothing
   * else on screen says. One or two lines of plain text in the frame's own type (.ev-proof), no
   * box, no icon row, no second card. No other module has one.
   */
  Proof?: ComponentType<PartProps<P>>
  /**
   * Optional: something that sits ON the device and travels with it, but is not clipped by its
   * screen (BYOT's stamp). At the result rest the device carries at most ONE such thing: a stamp
   * or a tag, not both.
   */
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
