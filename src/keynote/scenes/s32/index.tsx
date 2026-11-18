'use client'

/**
 * Slide 32 · "Top 5 Outcomes of Piramal.ai", again: the contents of section E.
 *
 * The room has seen this picture grow, petal by petal, on slide 8. Here it comes back whole and
 * is then read as a list of what follows:
 *
 *   whole     the disc is there at once and the five petals open from under it as ONE fan; the
 *             badges land along the ring, the words rise
 *   stories   a light walks the ring from the first badge to the fifth, drawing the ring's line;
 *             as it reaches each petal the petal answers (its colour deepens, it lifts a little,
 *             a real light crosses it), in the order the section takes them. (Story names in
 *             the petals exist behind SHOW_STORIES in data.ts and are OFF: they are not printed
 *             on this slide and the pairings are the owner's to decide.)
 *   begin     a light crosses the first petal once more: Underwrite Better comes forward, the
 *             other four stand back. The section's first stories are about underwriting.
 *
 * The diagram, its petals (three.js) and all its moves are shared with slide 8
 * (../_shared/outcomes/); only the order of the moves is this slide's own.
 */

import { Headline, type SceneModule } from '../../kit'
import { OUTCOMES } from '../_shared/outcomes/data'
import { OutcomesDiagram } from '../_shared/outcomes/Diagram'
import { outcomesRig, outcomesThree } from '../_shared/outcomes/rig'
import { SHOW_STORIES, STORIES, TITLE_FLAME } from './data'

/** The light's pace along the ring: seconds from one petal to the next. */
const PACE = 0.78

const scene: SceneModule = {
  beats: ['whole', 'stories', 'begin'],

  Scene: ({ slide }) => (
    <div className="s32">
      <OutcomesDiagram tags={SHOW_STORIES ? STORIES : undefined}>
        <Headline className="oc-title" text={slide.title} flame={TITLE_FLAME} />
      </OutcomesDiagram>
    </div>
  ),

  three: outcomesThree,

  build(ctx) {
    const tl = ctx.timeline()
    const rig = outcomesRig(ctx, tl)

    // whole: the recap
    // Slide 31 before this is a DARK divider. The stage turns light from its middle in about
    // 0.6 s; the white disc and the fan wait for that (over navy the disc is a grey plate).
    rig.hub(0.55)
    let t = rig.fan(0.8)
    tl.addLabel('whole', t)

    // stories: the light walks the ring, petal by petal
    rig.lamp(1, t, 0.4)
    let at = t
    let rest = t
    OUTCOMES.forEach((_, i) => {
      const d = i ? PACE : 0.6
      rest = rig.pass(i, at, d)
      at += d
    })
    rig.lamp(0, at + 0.1, 0.6)
    t = rest + 0.15
    tl.addLabel('stories', t)

    // begin: the first story is next
    t = rig.begin(0, t, [7.2, -6.3])
    tl.addLabel('begin', t)
    return tl
  },
}

export default scene
