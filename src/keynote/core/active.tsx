'use client'

/**
 * THE DECK THE ENGINE IS PLAYING. The engine (director, registry, hold URLs, chrome, overview,
 * backdrop) is one; the deck it plays is a parameter: its slides, its sections, where its scenes
 * are, what shows when a scene fails, and whether the chrome has a section rail.
 *
 *   /keynote   src/keynote/keynoteDeck.ts   (the default of <Keynote />: nothing changed for it)
 *   /ir        src/ir/irDeck.ts
 *
 * One page plays one deck. <Keynote deck={…} /> names it: for what React draws through
 * <DeckContext> (so two requests on the server never see each other's deck), and for the director
 * and its helpers, which only ever run in the browser, through setDeck().
 */

import { createContext, useContext } from 'react'
import type { Section, Slide } from '../deck'
import { INITIAL, useKeynote } from './store'
import type { SceneModule } from './types'

export interface DeckGroup {
  /** The agenda's letter, '' if the group has none. */
  letter: string
  name: string
  slides: Slide[]
}

export interface DeckDef {
  /** 'keynote', 'ir': names the deck in the scene cache. */
  key: string
  slides: Slide[]
  /** The section rail's sections. [] : the deck has none, and the chrome draws no rail. */
  sections: Section[]
  /** The slides as the overview groups them. */
  groups: DeckGroup[]
  /** Fetches the scene of slide n: `(n) => import(`./scenes/s${pad(n)}/index`)`, one chunk per scene. */
  load(n: number): Promise<{ default: SceneModule }>
  /** What a slide shows when its scene fails to load, to render or to build. */
  stub(n: number): SceneModule
}

let cur: DeckDef | null = null

/** Names the deck this page plays. Called by <Keynote /> as it renders, in the browser. */
export function setDeck(d: DeckDef) {
  if (cur === d) return
  // Another deck was playing in this tab (a client-side change of route): the stage starts empty.
  // The SAME deck as a new object is a hot reload in development: nothing is reset, the slide stays.
  if (cur && cur.key !== d.key) useKeynote.setState({ ...INITIAL })
  cur = d
}

export function deck(): DeckDef {
  if (!cur) throw new Error('[keynote] no deck: <Keynote /> has not rendered yet')
  return cur
}

/** How many slides the deck has. Before a deck is named: no limit. */
export const count = (): number => (cur ? cur.slides.length : Number.MAX_SAFE_INTEGER)

/** Slide n of the deck being played (clamped to the deck). */
export const slideOf = (n: number): Slide => {
  const s = deck().slides
  return s[Math.min(s.length, Math.max(1, Math.round(n))) - 1]
}

export const DeckContext = createContext<DeckDef | null>(null)

/** The deck, for a component under <Keynote />. */
export function useDeck(): DeckDef {
  const d = useContext(DeckContext)
  if (!d) throw new Error('[keynote] useDeck() outside <Keynote />')
  return d
}

/** Slide n of a given deck (clamped). */
export const slideIn = (d: DeckDef, n: number): Slide => d.slides[Math.min(d.slides.length, Math.max(1, Math.round(n))) - 1]
