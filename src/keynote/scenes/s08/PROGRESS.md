# Outcomes (slides 8 and 32): progress

Shared diagram: `scenes/_shared/outcomes/` (data.ts numbers from the pack, Diagram.tsx DOM hub/badges/words/ghosts,
icons.tsx redrawn badge icons, petals.ts three.js acrylic petals, rig.ts every move, outcomes.css).
No generated pictures are used (0 used; no GEN.md).

## Slide 8: DONE, checked (third pass, after review)
Idea: the deck's picture grows, one outcome per press. Beats: centre (disc alone, mid-stage, title, five
seeds on the ring), underwrite (disc rises to its place; the places of the four petals still to come show
very faintly; first petal), productivity, growth, cx, build.

## Slide 32: DONE, checked (third pass, after review)
Idea: the diagram returns whole (one fan), then the light walks the ring and each petal answers in turn.
Beats: whole, stories (light walks the ring; each petal lights), begin (Underwrite Better forward, others back).

## Third pass: what the review asked and what was done
- HIGH story tags: `SHOW_STORIES = false` in s32/data.ts. Nothing on 32 that the deck does not print.
- MEDIUM 31 -> 32: hub at 0.55 s, fan at 0.8 s (stage is light by then); shaders compiled in three()
  (renderer.compile), bevel segments 10 -> 5. press 31: 132 frames in 1.24 s (was 44).
- MEDIUM stair-stepped rims: cause was the slab's straight wall seen from the stage centre; DEPTH 0.55 -> 0.03
  (the slab is two round bevels back to back). Canvas pixel ratio = min(2, max(dpr, 3840 / W)).
- LOW frozen glint at 32 "begin": the lamp crosses the petal and is out before the rest.
- LOW lopsided rests on 8: ghost places (.oc-ghost) appear in settle(), each fades as its petal blooms.

## Flags
- s32 tags are OFF. Turning them on needs the owner's yes on each pairing (see s32/data.ts).
- s32 "begin" still brings Underwrite Better forward although slide 33's breadcrumb is CREDIT.AI
  (36 to 39 say UNDERWRITE BETTER). Owner may prefer to drop the beat: remove 'begin' from beats and the last block.
- Diagram is trued up (centred disc, mirrored pairs); badge icons redrawn as vector, incl. the 69 px raster.
- The deck's yellow review note on 8 is not shown.

## Checked in the third pass
beats 08, 32 at 1920x1080 and 1366x768; strips of both; press 07, 08, 31, 32; walk_all 7-9 and 31-33
("the walk is clean"); 3840x2160 frames of 08 build and 32 begin; no-WebGL (flat petals) 7 frames;
reduced motion 5 frames; tsc clean in s08, s32, _shared/outcomes. Shots: scratchpad keynote/s2/outcomes/fix/.
Not checked: frame rate on an ordinary laptop (only this Mac's GPU, under load from other jobs).
