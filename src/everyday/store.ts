'use client'

/**
 * EVERYDAY AI · the one small store.
 *
 * What is on screen (which scene, which step) and the visitor's one switch (auto or
 * manual). The director (core/director.ts) is the only thing that moves the scene and
 * the step; the shell reads them; the controls flip the switch.
 */

import { create } from 'zustand'
import { PRODUCTS, STEPS, type ProductKey } from './content'

export type SceneId = 'intro' | 'priya' | ProductKey | 'engineering' | 'finale'
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
  /** Which of Priya's lines the scene's timeline has reached (a moment: before, tool, after). Null: go by the step. */
  cue: string | null
  /** Auto plays like a film. Manual waits for a tap at the end of every step. */
  mode: Mode
  /** A debug URL is holding one frame: nothing advances by itself. */
  hold: boolean
  /** Fonts are in and the first scene has been built. */
  ready: boolean
  /** Manual mode, resting on a step a plain tap moves on from: the shell shows "Tap anywhere to continue". */
  tapHint: boolean
  /** On the opening screen, the product being previewed from the rail. */
  preview: ProductKey | null
  /** Bumped after a resize has settled: scenes rebuild their timelines. */
  layoutTick: number

  setScene(scene: SceneId): void
  setStep(step: string, resting: boolean): void
  setCue(cue: string | null): void
  setMode(mode: Mode): void
  setTapHint(on: boolean): void
  toggleMode(): void
  setPreview(key: ProductKey | null): void
  patch(p: Partial<Pick<EverydayState, 'mode' | 'hold' | 'ready'>>): void
  relayout(): void
}

export const useEveryday = create<EverydayState>((set) => ({
  scene: 'intro',
  run: 0,
  step: 'idle',
  resting: false,
  cue: null,
  mode: 'auto',
  hold: false,
  ready: false,
  tapHint: false,
  preview: null,
  layoutTick: 0,

  setScene: (scene) => set((s) => ({ scene, run: s.run + 1, preview: null, cue: null })),
  setStep: (step, resting) => set({ step, resting }),
  setCue: (cue) => set({ cue }),
  setMode: (mode) => set({ mode }),
  setTapHint: (tapHint) => set({ tapHint }),
  toggleMode: () => set((s) => ({ mode: s.mode === 'auto' ? 'manual' : 'auto' })),
  setPreview: (preview) => set({ preview }),
  patch: (p) => set(p),
  relayout: () => set((s) => ({ layoutTick: s.layoutTick + 1 })),
}))

/** 0–4 for the five steps of a moment (5 once it is done), or -1 outside one. */
export function stepIndex(step: string): number {
  if (step === 'done') return STEPS.length
  return (STEPS as readonly string[]).indexOf(step)
}
