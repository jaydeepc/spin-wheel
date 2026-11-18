'use client'

/**
 * Slide 08 · "Top 5 Outcomes of Piramal.ai"
 *
 * The deck's picture: a white disc with the title, five petals fanned under it, a round badge
 * where each petal meets the ring. Here the picture is grown, one outcome to a press:
 *
 *   centre        the disc alone, in the middle of the stage, the title in it; five seeds wait
 *                 on its ring; its dial turns and a glint of light travels its edge
 *   underwrite    the disc goes up to its place; a light walks the ring to the first seed, the
 *                 badge lands and draws its icon, and the first petal comes out from under the
 *                 disc standing toward the room and lays itself down; its words rise
 *   productivity  … the light walks on, the ring's line follows it …
 *   growth
 *   cx
 *   build         … to the fifth: the picture of the deck, whole
 *
 * The petals are real slabs of frosted acrylic (../_shared/outcomes/petals.ts) under the DOM;
 * the disc, the badges and every word are DOM. Without WebGL the petals are flat and the scene
 * tells the same thing. The diagram is shared with slide 32 (../_shared/outcomes/).
 */

import { Headline, type SceneModule } from '../../kit'
import { OUTCOMES } from '../_shared/outcomes/data'
import { OutcomesDiagram } from '../_shared/outcomes/Diagram'
import { outcomesRig, outcomesThree } from '../_shared/outcomes/rig'
import { TITLE_FLAME } from './data'

const scene: SceneModule = {
  beats: ['centre', ...OUTCOMES.map((o) => o.key)],

  Scene: ({ slide }) => (
    <div className="s08">
      <OutcomesDiagram>
        <Headline className="oc-title" text={slide.title} flame={TITLE_FLAME} />
      </OutcomesDiagram>
    </div>
  ),

  three: outcomesThree,

  build(ctx) {
    const tl = ctx.timeline()
    const rig = outcomesRig(ctx, tl)

    // the centre, alone
    let t = rig.hub(0.1, { hero: true })
    tl.addLabel('centre', t)

    // … and one outcome to a press. The first press also takes the disc up to its place.
    OUTCOMES.forEach((o, i) => {
      if (i === 0) t = rig.settle(t) - 0.35
      t = rig.bloom(i, t)
      tl.addLabel(o.key, t)
    })
    return tl
  },
}

export default scene
