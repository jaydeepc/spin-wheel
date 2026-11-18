# Outcomes (slides 8 and 32): progress

Shared diagram: `scenes/_shared/outcomes/` (data.ts numbers from the pack, Diagram.tsx DOM hub/badges/words,
icons.tsx redrawn badge icons, petals.ts three.js acrylic petals, rig.ts every move, outcomes.css).
No generated pictures are used (0 of 5).

## Slide 8: DONE, checked
Idea: the deck's picture grows, one outcome per press. Beats: centre (disc alone, mid-stage, title, five
seeds on the ring), underwrite (disc rises to its place; first petal), productivity, growth, cx, build.
Second run: the title now scales with the hero disc (it touched the disc's edge before).

## Slide 32: DONE, checked
Idea: the diagram returns whole (one fan), then becomes the contents of section E.
Beats: whole, stories (light walks the ring; each petal answers and shows its story's tag), begin
(Underwrite Better forward, others stand back).

## Flags
- s32 tags ABCD / Nivaaran / Arya / PIA / AIDLC are NOT printed on slide 32 (taken from the headlines of
  33 to 49). One switch: `SHOW_STORIES` in s32/data.ts. AIDLC under "Integrate & Build More" is read into it.
- Diagram is trued up (centred disc, mirrored pairs); badge icons redrawn as vector, incl. the 69 px raster.
- The deck's yellow review note on 8 is not shown.

## Checked in the second run (after the title fix)
beats 08 and 32 at 1920x1080 and 1366x768: console clean. press 07, 08, 31, 32: console clean.
walk_all 7 to 9 and 31 to 33: "the walk is clean". tsc: no errors in s08, s32, _shared/outcomes.
Strips of both slides were read before the title fix; only the first and second strips of 8 are touched by it.
Not checked: 3840x2160, the no-WebGL fallback, reduced motion, real-time frame rate on an ordinary laptop.
