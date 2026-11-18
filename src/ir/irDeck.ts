'use client'

/**
 * /ir AS A DECK: what the engine (src/keynote: director, chrome, backdrop) needs to play
 * src/ir/deck.ts. See src/keynote/core/active.tsx.
 */

import type { DeckDef } from '../keynote/core/active'
import type { SceneModule } from '../keynote/core/types'
import { SLIDES, pad } from './deck'
import { stub } from './scenes/_shared/stub'

export const IR_DECK: DeckDef = {
  key: 'ir',
  slides: SLIDES,
  // no sections: no rail
  sections: [],
  groups: [{ letter: '', name: 'Implications for Investors', slides: SLIDES }],
  // one chunk per scene, found by its folder's name
  load: (n) => import(`./scenes/s${pad(n)}/index`) as Promise<{ default: SceneModule }>,
  stub,
}
