# Banking agent (slides 36 to 39): progress

Span scene 36 to 38 lives in `s36/` (`s37`, `s38` re-export it): index.tsx, data.ts, stack.ts (three.js paper stacks), scene.css.
Slide 39 is its own scene in `s39/` (index.tsx, data.ts, scene.css; DOM + SVG, no canvas).
Second builder's pass (after the review) is written below; shots of it are under
`…/scratchpad/keynote/s2/bank/fix/shots/`.

## 36 to 38
Idea: customer | his statement as a stack of as many sheets as it has pages (three.js instanced sheets with per-sheet
opacity, dealt in from the camera's side, swept off to the left at each slide change) | what ABCD finds. A scan light runs
down the real masked page and EVERY row glints as it passes (no row stays marked); the stack fans open and the found lines
(the real cut-outs) are drawn out from between the sheets at the stack's right edge and fly to their rows; chips; then
ABCD SAYS. ABCD's disc waits large at the right with the caption "ABCD" and moves into its card when it reads.
On 37 / 38 (alerts) the card is empty (three quiet dots) while it reads and says "RAISES ALERT …" only after the line is
out and named, with one ring of its border. 36's card states a task and speaks first.
Beats: 36 kirana, reads, says · 37 salaried, visa, flight · 38 vendor, gaming, frequent.

Second pass, code DONE (tsc clean): deal path (never above 15u), per-sheet alpha, glints instead of boxes, lines out of the
stack, alert order, cut-outs at the deck's widths (CUT_W), chips 9.6u / 10.6u, card 8.6u high, says card higher on 37 / 38,
chevron dims while lines cross, "ABCD" caption under the waiting disc, red mask on 38's header chip, extra mask on the
payee of 36's second cut-out.
Checked by eye so far: 36 kirana strip, 36 reads strip and rest. See "Checked" for the rest.

## 39
Idea: four model cards + wires + ABCD assemble centred as one network (signals run into the agent, a ring answers); the
network steps left; "ML & Deep learning" lights, ONE signal down its wire, ring, and the real chart window opens out of
the agent with its wipe at once; then "LLM & Reasoning" lights, its signal, ring, and the six alerts tick in.
Beats: network, score, alerts. Second pass code DONE (tsc clean).

## Decisions and flags
- No generated pictures (0 of 4 + 3), so no GEN.md.
- Extra privacy masks: listed with comments in s36/data.ts (`masks`, `masksOnRed`, findings[].masks), CSS `.s36-mask`.
  Remove an entry to undo it.
- "54 pages" chip on 36 sits over the last two balance figures (CHIP_TOP in index.tsx).
- 38 description shown: "Food vendor in Nashik / Applied for UBL" (the deck's other, overlapping line is dropped).
- Footnote "*Masked for customer privacy" (deck: 38 only) is shown on 36, 37 and 38.
- Deck slips kept: Utiliity, Funiture (36); stray closing quote and "detecte" (39); 38's headline says Crypto, examples are gaming.
- Cut-out lines are at the deck's own widths; on 37 / 38 that is 1.3 to 1.7 times their pixels (as in the deck).
- 38's gaming cut-outs are in another bank's narration format ("WDL TFR UPI/DR/") than the IndusInd statement: the deck's own.
- Robot disc on 36 to 38 uses slide 39's copy of the same render (420 px, the largest).

## Checked
See the final report of the second pass. The machine was under very heavy load (other builders) during checking:
many checker runs timed out.
