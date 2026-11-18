/**
 * THE KIT. Everything a scene builder needs, from one import:
 *
 *   import { anim, Headline, Words, Kicker, Count, BarChart, MultiBarChart, HBarChart, LineChart, PhoneFrame,
 *            BrowserFrame, LaptopFrame, PaperStack, Card, Clipping, Chip, Pill, Person, Pic, pic, gen, place,
 *            Logo, T, spanBeats } from '../../kit'
 *
 * See SCENES.md for each piece with an example.
 */
export { anim, type Anim, type MoveOptions } from './anim'
export { Headline, Words, Kicker, Count, cutWords, formatCount } from './text'
export { BarChart, MultiBarChart, HBarChart, LineChart, type Bar, type BarPart, type BarColumn, type Series } from './charts'
export { PhoneFrame, BrowserFrame, LaptopFrame, PaperStack } from './frames'
export { Card, Clipping, Chip, Pill, Person, Logo } from './cards'
export { Pic, pic, gen, place } from './pic'
export { BRAND } from './brand'
export { T, type Eases } from '../core/motion'
export { createSceneCanvas, THREE, type SceneCanvas } from '../three/sceneCanvas'
export type { SceneModule, SceneCtx, SceneProps, Look, Box } from '../core/types'
export { AGENDA, SECTIONS, SLIDES, slide, section, pad, spanBeats } from '../deck'
