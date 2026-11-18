# Pit lane (slides 33, 34, 35): progress

One span scene in `s33/` (`s34`, `s35` re-export it). Files: index.tsx, data.ts, fx.ts (three.js
sparks, gun glow, tyre smoke), scene.css, GEN.md.

Beats: 33 alone, checks, onhim · 34 crew, parallel · 35 green, approved, validated, go.

## Round 2 (repair after the review): what changed

Slide 35
- Layout: the verdict card (APPROVED) now stands on the LEFT under ABCD's chip; Sushil's chip and the
  VALIDATED stamp stand at the top RIGHT (lane's far end). The corridor from the box to the right
  edge (y 25u to 38u) is empty, so the launch is seen whole. The far stop mark stays throughout.
  (The deck has APPROVED top right with Sushil and the stamp under it: flag for the owner.)
- green: ABCD's chip moves first (T6+0.05, 0.7 s), the lights come back after it has cleared
  (T6+0.72); the paper stacks fade where they stand in 0.26 s.
- go: crew steps back, car sits back, smoke, launch over clear ground; rubber is now an SVG
  (`.s33-rubber`: a faint band plus eight fine lines per rear tyre, squirm at the start, fading over
  44u, revealed with the car); every helmet turns 90 degrees to follow it; the green pool drifts right.
- Conditions ring is drawn on the card's own edge (inside the safe area).

Slide 34
- crew: helmets come out in single file through the gap beside the upper cards / up the open
  lane (no helmet passes under a card). Air lines have a coupling, a gun tip, and the lower two
  come round the box corner instead of across its line.
- parallel: 0.45 s longer. Tyres lift higher; four pushes of the guns (GUN = 0.24 s): at each push
  one helmet per wheel leans in, a ring goes out, its number badge (1 to 15, as in the lists) pops on
  the helmet and the same number lights in the list. Three pulses run down the air lines. three.js:
  thicker sparks (four bursts) and a warm glow at each gun; DOM flash stronger.

Slide 33
- a quiet broken line in the lower band (`.s33-dash`).

## State

All code changes are in and compile (tsc clean under s33/s34/s35). See the report for what was
re-shot and read after the last edit; shots are in the scratchpad under keynote/s2/pit/fix/.

Generated: only `gen/33/pit-ground.jpg` (first round). Nothing generated in round 2.

Not done / ideas: a lingering smoke wisp at the rest of "go" was tried and dropped (static puffs
read as smudges; `WISP = 0` in fx.ts turns it back on).
