'use client'

import { create } from 'zustand'
import type { ChromeOptions, SceneModule } from './types'

/** One scene on the stage. During a change of slide there are two: the one leaving and the one arriving. */
export interface Layer {
  key: string
  /** The slide whose folder the scene is in: for a scene that spans several slides, the first of them. */
  n: number
  mod: SceneModule
}

export const CHROME_DEFAULT: ChromeOptions = { logo: true, rail: true, crumb: true, counter: true }

export interface KeynoteState {
  /** The slide on screen (1 to 65). */
  n: number
  /** The beat the scene is at, or is moving to. */
  beat: string
  beatIndex: number
  beatCount: number
  /** The scene rests: nothing is moving, Next is ready. */
  resting: boolean
  /** The frame that was asked for is on screen (the screenshot tools wait for this). */
  ready: boolean
  /** A scene is being fetched. */
  loading: boolean
  layers: Layer[]
  /** What the chrome shows on this slide. */
  chrome: ChromeOptions
  /** The overview grid is open. */
  overview: boolean
  /** Digits typed for "number + Enter". */
  typed: string
  /** Bumped when the stage has changed size: every scene on stage is rebuilt. */
  layoutTick: number
  /**
   * Between a light slide and a dark one: the theme the chrome keeps until the scene on its way
   * out has gone (then the backdrop changes, and the chrome with it).
   */
  themeHold: 'light' | 'dark' | null
}

export const INITIAL: KeynoteState = {
  n: 1,
  beat: '',
  beatIndex: 0,
  beatCount: 1,
  resting: false,
  ready: false,
  loading: true,
  layers: [],
  chrome: CHROME_DEFAULT,
  overview: false,
  typed: '',
  layoutTick: 0,
  themeHold: null,
}

export const useKeynote = create<KeynoteState>(() => ({ ...INITIAL }))
