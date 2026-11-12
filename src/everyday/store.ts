'use client'

/**
 * EVERYDAY AI · the one small store.
 *
 * What is on screen (which scene, which step) and the one switch (manual, or Auto-play).
 * The director (core/director.ts) is the only thing that moves the scene and the step; the
 * shell reads them; the Auto-play switch flips the mode.
 */

import { create } from 'zustand'
import { PRODUCTS, STEPS, type ProductKey } from './content'

export type SceneId = 'intro' | 'priya' | ProductKey | 'engineering' | 'finale'
/** Manual (the default): the film waits for the visitor at every rest. Auto: it plays by itself. */
export type Mode = 'auto' | 'manual'

const keysOf = (track: 'day' | 'engineering') => PRODUCTS.filter((p) => p.track === track).map((p) => p.key)

/**
 * The film, in order:
 *   intro        what Everyday AI is (the screen that waits between visitors)
 *   priya        meet Priya
 *   …            her Tuesday: the product moments with track 'day'
 *   engineering  the chapter card: the people who build her apps
 *   …            the engineering team's own moment (track 'engineering': Piramal Mind)
 *   finale       the closing: the five names once more
 */
export const SCENES: SceneId[] = ['intro', 'priya', ...keysOf('day'), 'engineering', ...keysOf('engineering'), 'finale']

const PRODUCT_KEYS = new Set<string>(PRODUCTS.map((p) => p.key))
export const isProduct = (scene: SceneId): scene is ProductKey => PRODUCT_KEYS.has(scene)

/** The engineering chapter: its card and its product moment. Everything else belongs to Priya's Tuesday. */
export const isEngineering = (scene: SceneId) => scene === 'engineering' || (isProduct(scene) && PRODUCTS.some((p) => p.key === scene && p.track === 'engineering'))

interface EverydayState {
  /** Which scene is on stage. */
  scene: SceneId
  /** Bumped every time a scene is entered, so entering the same scene twice remounts it. */
  run: number
  /** The step the film is at, or travelling to (a moment: before, name, demo, result, stat, done). */
  step: string
  /** True while the film rests on a step; false while it travels to it. */
  resting: boolean
  /**
   * Which of Priya's lines the scene's timeline has reached (a moment: before, tool, after, or
   * 'off' while she is not on screen: the name at centre stage, the number). Null: go by the step.
   */
  cue: string | null
  /** Manual waits for Next at every rest (the default). Auto plays like a film (?auto, or the Auto-play switch). */
  mode: Mode
  /** A debug URL is holding one frame: nothing advances by itself. */
  hold: boolean
  /** Fonts are in and the first scene has been built. */
  ready: boolean
  /** The film rests on its last frame: the Next button reads "Start again". */
  atEnd: boolean
  /** Bumped after a resize has settled: scenes rebuild their timelines. */
  layoutTick: number

  setScene(scene: SceneId): void
  setStep(step: string, resting: boolean): void
  setCue(cue: string | null): void
  setMode(mode: Mode): void
  toggleMode(): void
  patch(p: Partial<Pick<EverydayState, 'mode' | 'hold' | 'ready' | 'atEnd'>>): void
  relayout(): void
}

export const useEveryday = create<EverydayState>((set) => ({
  scene: 'intro',
  run: 0,
  step: 'idle',
  resting: false,
  cue: null,
  mode: 'manual',
  hold: false,
  ready: false,
  atEnd: false,
  layoutTick: 0,

  setScene: (scene) => set((s) => ({ scene, run: s.run + 1, cue: null, atEnd: false })),
  setStep: (step, resting) => set({ step, resting }),
  setCue: (cue) => set({ cue }),
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((s) => ({ mode: s.mode === 'auto' ? 'manual' : 'auto' })),
  patch: (p) => set(p),
  relayout: () => set((s) => ({ layoutTick: s.layoutTick + 1 })),
}))

/** 0–4 for the five steps of a moment (5 once it is done), or -1 outside one. */
export function stepIndex(step: string): number {
  if (step === 'done') return STEPS.length
  return (STEPS as readonly string[]).indexOf(step)
}
