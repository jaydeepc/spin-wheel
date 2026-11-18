# Builder "pai2": slides 29 and 30

Both slides are DONE. Third pass (repair after the review): every medium finding fixed, the
cheap low ones too. Shots of this pass: scratchpad `keynote/s2/pai2/fix/`.

## Slide 29 (scenes/s29) · done
- Idea: the headline's "from Sales to Collections" is a line with five stops; a light runs to
  the next stop on each press and that function lights up (card comes forward, the row makes
  room, panel rises over the lower part of the deck's scene, its italic line, its agent pills
  cascade, starred ones take their star and warm). Last press: line leaves, five settle into an
  even row, support functions and the Everyday AI / AI infrastructure box rise underneath.
- Beats: journey, sales, credit, operations, experience, collections, support.
- No canvas, no generated pictures. Pictures are the deck's eight, as they are.
- Repair pass:
  - first rest: line and row hang SHIFT (3.2u) lower, centred under the headline; they rise to
    the walking position with the first light (index.tsx: SHIFT).
  - waiting functions: a cool navy veil (.s29-veil) instead of opacity 0.46 (no milky pink).
  - the italic line and the pills start with the panel (t+0.55 / t+0.7): no blank white sheet.
- Not changed: LIT stays 1.28 (the lit picture is 1.33x its pixels at 3840 only; fine at 1920);
  no star legend (the deck has none: owner's call).
- Flags: the star has no legend in the deck (none invented). Ten hidden blocks and the authors'
  note are not in data.ts. OPERATIONS has only three agents (as the deck).

## Slide 30 (scenes/s30) · done
- Idea: scale gathers. Two charts made of instanced blocks (three.js, blocks.ts) fly in from
  depth and settle into rising columns; then the charts step back and the nine numbers count up
  row by row beside their badges.
- Beats: progress, people (1 to 3), models (4 to 6), platform (7 to 9).
- PLACEHOLDER: both charts. Shapes in data.ts → CHARTS are illustrative, no figures printed.
  Said three ways: pale blocks (not the brand's full colours), a hatched and dashed card, and
  the tag "Placeholder chart, to be replaced" (navy on white, flame dashes), which is
  counter-scaled so it reads about 1.3u on EVERY rest. Title "AI agents" is ours (the deck box
  is empty); "Employees working on AI" is the deck's.
- Repair pass: cards 21u high (were 18.9), last rest at 0.724 (was 0.667), tiles 6.9u high
  (were 7.1), grid top 27.9u; blocks start low behind the columns so they no longer cross the
  chart titles; first rest centred (top 20u).
- Flags: asterisks on tiles 6 and 7 have no footnote in the deck; 45+ and 150mn were
  highlighted by the authors for update (highlighter not shown, values as printed).
- DOM fallback without WebGL (.s30-fb) exists but was not exercised in a browser.

## Generated pictures
None.
