'use client'

/**
 * THE KEYNOTE AS A DECK: what the engine needs to play src/keynote/deck.ts (core/active.tsx).
 * It is the default deck of <Keynote />.
 */

import type { DeckDef } from './core/active'
import type { SceneModule } from './core/types'
import { SECTIONS, SLIDES, pad } from './deck'
import { stub } from './scenes/_shared/stub'

export const KEYNOTE_DECK: DeckDef = {
  key: 'keynote',
  slides: SLIDES,
  sections: SECTIONS,
  groups: [
    { letter: '', name: 'Opening', slides: SLIDES.filter((s) => s.section === 'open') },
    ...SECTIONS.map((sec) => ({ letter: sec.letter, name: sec.name, slides: SLIDES.filter((s) => s.section === sec.key) })),
    { letter: '', name: 'Close', slides: SLIDES.filter((s) => s.section === 'close') },
  ],
  // Each scene (scenes/sNN/index.tsx, with its stylesheet and whatever it imports) is its own
  // chunk. Nothing here needs editing when a scene is built: the folder is found by its name.
  load: (n) => import(`./scenes/s${pad(n)}/index`) as Promise<{ default: SceneModule }>,
  stub,
}
