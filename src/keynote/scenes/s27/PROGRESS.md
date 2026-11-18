# Builder pai1 · slides 27 and 28 · progress

Third pass (the "repair and raise" pass after the independent review). Read this first.

## Slide 27 · rebuilt board and ending
- Idea: the company's own pin-board, THE SAME BOARD as slide 16 (peg holes, card paper and cast
  shadow, flame glossy pins, pin at 0.85u, rows at slide 16's heights: all values copied, nothing
  imported). It fills, then it closes into one thing: a flame thread runs clockwise from card to
  card (wound on the pins between rows, small knots on the edges within a row), each card it
  reaches nudges on its pin and its object breathes; the ring closes and the light comes home to
  the words in the middle, which answer once.
- Beats: `five` (headline, board, centre words, eight ghost places, the top row and the two cards
  beside the words) · `all` (bottom row, then the thread and the light).
- Objects: ONE rule for all eight (scene.css): disc 5.9u, object box 7.6u about the same middle
  (object 7.15u on its long side = 121% of the disc), 1.2u free to the card edge; each shadow lies
  at its object's own foot (FOOT in index.tsx).
- No canvas. The eight generated pictures are the first run's (GEN.md); none added.

## Slide 28 · repaired
- Idea unchanged: a cast introduction (see the head of s28/index.tsx). Beats `pia`, `arya`,
  `abcd`, `nivaaran`, `together`.
- Changed in this pass: the many at the sides are fewer (23, were 35), smaller and paler with
  depth, inside the safe area, and at 0.46 strength while a star is on stage (full only in
  `together`); they begin to arrive at 0.1 s; a star's spark fades during its flight, so the
  portrait opens on a blank face (no double image); the next star lifts 0.55 s after the one
  before leaves for its seat; label and name stand at one fixed place for all four (the
  description grows downward); the stage block moved 4u to the right.
- `SHOW_ROLES` in s28/data.ts: the owner's switch for the function labels and "what it does"
  lines (the deck's words from slides 29, 41, 43, 44, not printed on slide 28). `true` now.

## Flags
- 28: headline slip "star agents shapes" kept (deck.ts).
- 28: Nivaaran has no portrait in the deck: designed SVG emblem (emblem.tsx), not a face.
- 28: CUSTOMER EXPERIENCE is slide 29's block t07 (set on two lines there).
- 27: two beats, 5 + 3 cards (a pacing choice, not the deck's grouping).
- 27: the thread and its knots are an addition (no words added).
- 27: seedling keeps green leaves, coin and sparkles gold (small pictorial accents); "usecases",
  "AI first" are the deck's.

## State of checks: see the builder's report (the machine was heavily loaded during this pass).
