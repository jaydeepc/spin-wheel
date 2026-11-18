'use client'

/**
 * /ir. "Implications for Investors", played by the keynote's engine (src/keynote/Keynote.tsx)
 * with this deck (irDeck.ts). Nothing of the engine is copied.
 */

import Keynote from '../keynote/Keynote'
import { IR_DECK } from './irDeck'

export default function Ir() {
  return <Keynote deck={IR_DECK} />
}
