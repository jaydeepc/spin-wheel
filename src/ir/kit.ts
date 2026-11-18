/**
 * THE KIT FOR /ir. The keynote's kit, whole (src/keynote/kit: anim, Headline, Words, Count, the
 * charts, the frames, cards, place, Logo, createSceneCanvas, THREE, the types), with the four
 * things that belong to a deck replaced by /ir's own:
 *
 *   slide(n), SLIDES, COUNT, CRUMB   from src/ir/deck.ts
 *   pic(n, name)                     /ir/src/NN/<name>
 *   gen(n, name)                     /ir/gen/NN/<name>
 *   <Pic n name />                   reads from /ir/src/NN/
 *
 *   import { anim, Headline, Count, Pic, pic, type SceneModule } from '../../kit'
 *
 * (AGENDA, SECTIONS and section() still come through from the keynote: /ir has none, do not use them.)
 */
export * from '../keynote/kit'
export { slide, SLIDES, COUNT, CRUMB, pad } from './deck'
export { Pic, pic, gen } from './pic'
