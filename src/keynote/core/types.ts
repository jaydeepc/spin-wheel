import type { ComponentType } from 'react'
import type { Slide } from '../deck'
import type { Eases, T } from './motion'

/** A box on the stage, in stage pixels from the stage's top left corner. */
export interface Box {
  x: number
  y: number
  w: number
  h: number
  cx: number
  cy: number
}

/**
 * What a scene may ask of the shared 3D backdrop.
 *
 * The backdrop has a LOOK (the numbers below). The director sets it for every slide from the
 * slide's theme and section. A scene changes it in two ways:
 *
 *   ctx.backdrop.mood({ warm: 0.8 })          for as long as the slide is on screen: the look
 *                                             glides there (not part of the timeline)
 *   tl.to(ctx.backdrop.fx, { glow: 0.6 }, 0)  ON the scene's timeline: `fx` is a plain object of
 *                                             numbers ADDED to the look. It starts at zero, it is
 *                                             the scene's own, and it is let go when the scene
 *                                             leaves. Seeking the timeline seeks the backdrop.
 */
export interface Look {
  /** 0 the light page (white, peach, pale blue) … 1 the deck's deep navy. */
  dark: number
  /** 0 the blue side … 1 the peach / flame side. */
  warm: number
  /** How alive the particles are: their strength and their drift. 0 … 1. */
  energy: number
  /** A soft light at the focus point. 0 … 1. */
  glow: number
  /** Where that light sits, in stage halves: -1 the left edge … +1 the right edge. */
  focusX: number
  /** -1 the top edge … +1 the bottom edge. */
  focusY: number
  /** The field of points that recedes to the horizon. 0 away … 1 fully there. */
  wave: number
  /** How far the camera has flown forward, in world units. Tween it for a rush through the particles (30 to 80 is a strong move). */
  travel: number
  /** The camera turned left / right, in radians (0.1 is plenty). */
  yaw: number
  /** The camera turned up / down, in radians. */
  pitch: number
}

export interface BackdropApi {
  /** The scene's own additive layer: tween these numbers on your timeline. All start at 0. */
  fx: Look
  /** Override parts of the slide's base look while this slide is on screen. */
  mood(look: Partial<Look>): void
}

export interface SceneCtx {
  /** The slide (from deck.ts): n, id, section, crumb, title, theme. */
  slide: Slide
  /** The scene's root element: the element your `Scene` component returned sits inside it. */
  root: HTMLElement
  /** The first match inside the scene. Throws if there is none, so a typo is found at once. */
  $<E extends Element = HTMLElement>(selector: string): E
  /** Every match inside the scene. */
  $$<E extends Element = HTMLElement>(selector: string): E[]
  /** One fluid unit (the CSS --u) in pixels: 1/100 of the stage's width. */
  U: number
  /** The stage in pixels: W = 100 U, H = 56.25 U. */
  W: number
  H: number
  /** The visitor has asked the system for less motion: keep the story, drop the flourishes. */
  reduced: boolean
  /** A hold URL with `&dt=` or `&still=1` is showing this scene: do not start idle loops that would change a held frame. */
  held: boolean
  ease: Eases
  /** Timing tokens (seconds). */
  T: typeof T
  backdrop: BackdropApi
  /** A place to pass things from `three()` to `build()` (three() runs first). */
  bag: Record<string, unknown>
  /** A new paused timeline with the keynote's defaults. Build the whole scene on ONE of these. */
  timeline(): gsap.core.Timeline
  /** An element's box on the stage, as it is laid out right now (measure BEFORE you gsap.set hidden states). */
  loc(el: Element): Box
  /**
   * Called whenever the director has PUT the playhead somewhere without playing to it (an arrival,
   * a hold URL, a rebuild after a resize): draw what the timeline does not draw by itself (a
   * canvas). createSceneCanvas() uses it, so a scene's own WebGL is never blank on its first paint.
   */
  onSeek(fn: () => void): void
}

export interface SceneProps {
  slide: Slide
}

/** What the chrome shows on this slide. Everything defaults to true. */
export interface ChromeOptions {
  /** The logo, top right. */
  logo: boolean
  /** The section rail A to F, top left. */
  rail: boolean
  /** The slide's breadcrumb beside the rail. */
  crumb: boolean
  /** The slide counter by the Back / Next pills. */
  counter: boolean
}

/**
 * ONE SCENE PER SLIDE: scenes/sNN/index.tsx default-exports one of these.
 */
export interface SceneModule {
  /** The DOM of the scene, drawn inside the 16:9 stage. Static markup: no state, no effects, no timers. */
  Scene: ComponentType<SceneProps>
  /** The rests, in order. At least one. The first is reached by itself when the slide arrives. */
  beats: string[]
  /**
   * Builds ONE paused timeline that carries a label for every beat, in order. A beat's label
   * marks its REST: the instant its move has finished. So add the label AFTER the tweens of
   * that beat (`tl.addLabel('name')` puts it at the end of what has been added so far).
   */
  build(ctx: SceneCtx): gsap.core.Timeline
  /** Scene-owned WebGL: set it up with createSceneCanvas(ctx) and return its dispose function. Runs before build(). */
  three?(ctx: SceneCtx): (() => void) | void
  /** Pictures to have decoded before the scene is shown (the next slide's are fetched ahead). */
  preload?: string[]
  chrome?: Partial<ChromeOptions>
  /**
   * SLIDES THAT ARE ONE SCENE. A scene may span several consecutive slides (the pit lane of 33 to
   * 35, the train of 45 to 49): one DOM, one timeline, nothing leaves the screen at the slide
   * change. Give each slide its own beats here, in order; `beats` is then all of them in a row
   * (`beats: spanBeats(SLIDES)` from the kit). The scene lives in the folder of its FIRST slide;
   * the folders of the others hold one line: `export { default } from '../s33'`.
   *
   *   slides: { 33: ['alone', 'character', 'capacity'], 34: ['crew'], 35: ['green', 'approved'] }
   *
   * The director moves the slide number, the rail, the breadcrumb and the counter on as the
   * playhead crosses from one slide's beats into the next's. See SCENES.md.
   */
  slides?: Record<number, string[]>
}
