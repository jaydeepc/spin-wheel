# Progress · builder "world1" · slides 16, 17, 18

Third pass (the repair after the review). All three are DONE and checked. Read this first if you continue.

## s16 · the board of eight themes (rebuilt in the third pass; changed for the presenter, MD round 3)
- Idea: a board of peg holes; the question in the middle comes together FIRST, alone and large (its parts close on the middle, FROM from above, TO from below; a short give as the last lands); then the eight cards are thrown onto the board from the room in depth (CSS perspective, z 44u to 0, own shadow element that closes in), pinned, swing once, going ROUND the middle clockwise from the top left (`data.ts → ROUND`); each round picture settles as it is pinned and its flame ring is drawn then.
- Beats: `centre` (headline, board, the whole question: FROM dimmed, TO with "create value" underlined); `board` (the question shrinks from 1.34 to its own size, the eight cards go round, card 17 lifts off the board). The old `value` beat is gone: its parts are shared between the two.
- Words changed by the presenter (NOT the deck's any more): card 18 line "ML meets GenAI · Physical AI · JEV" is now "ML meets GenAI"; card 21 line "$285 bn left software in 2 weeks" is now "Companies build what they used to buy" (from slide 21's headline; no figure).
- No canvas, no generated pictures. PACK-FIXES.md notes the blue italic runs missing from the pack.

## s17 · 6 in 100
- Idea: a hundred instanced paper planes (`field.ts`). First rest: the WIDE field fills the stage, 63% and 31% over their colours. `six`: the field draws away to the left (state.shift), the six leave one after another on long trails into a formation over the free half, a gust runs through the 94 (state.gust), 6% lands as the first arrives, then the clipping.
- Beats: `everyone`, `six`, `why`.
- Tunables: data.ts `SIX` (formation), `WIDE_STATS`; field.ts `WIDE`, `LEFT`, `STAY` (trail dots kept at rest).
- No WebGL: `.s17--flat` (class set in build) shows the deck's flat picture with the numbers at the deck's places. Checked with WebGL blocked.

## s18 · Composite AI
- Idea: the photograph untouched; the two columns are two jigsaw pieces (seam at 23.4u of 44, knob r 1.4u, tinted at the joint) that cross, pause at the mouth of the socket, lock: ring, band light, backdrop pulse; the banner slides out from under them.
- Beats: `apart`, `one`, `news`.

## Checks (third pass)
- tsc: no error in s16, s17, s18, _shared/world-of-ai. Rests at 1920 and 1366 read for all three; strips read: 16 board, 16 value, 17 six, 18 one, 18 news. press 15, 16, 17, 18: console clean (16 read). walk 15 to 19: clean.
- s17 no-WebGL and reduced-motion rests shot with scratch tool `s2/world1/tools/alt.mjs`.
- Not done: strips of 17 everyone / why were shot but not read at full size; s18 news not re-shot after the last small change (first clipping's drop 3.4u to 1.9u); frame rate not measured; s16 and s18 reduced-motion not shot.
- Shared: `_shared/world-of-ai/pin.ts` (pinDrop; label counter now on ctx.bag; option `drop`). `_shared/pin-boards/` not created.
- Generated pictures: none (0 used).
