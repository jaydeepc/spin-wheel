# world3 · slides 23, 24, 25 · progress

Second builder's pass (after the review): all three DONE and re-checked. Shots of this pass:
<scratchpad>/keynote/s2/world3/fix/. No generated pictures (0 used; no GEN.md, no gen folders).
Checks after the last change: tsc clean in s23/s24/s25; beats at 1920 and 1366 and strips "console: clean";
press 22, 23, 24, 25 clean (23 into 24 now overlaps at +240 ms); walk 22 to 26 "the walk is clean".

## 23 · done
Idea: growing up three times, then a voice. Beats: `ago`, `today`, `chorus`.
This pass: the first rest shows the places "today" will fill as dashed outlines (a ring, 22 pill slots, a flat
line) under a pale TODAY; "4x" and "1 million+" arrive whole (no 1x … 3x, no 0.6 million); the Hindi line is
2.0u with air under the photograph, the paragraph is 1.22u on two lines, the clipping moved 0.3u left.
The 24B → 105B count inside the growing circle is kept.

## 24 · done
Idea: the deck's chess game continues in 3D (glass.ts, one scene-owned canvas). Beats: `stolen`, `news`, `response`.
This pass:
- The right-hand bolts no longer come from behind the clippings (they name real organisations): they come
  down out of the open air above the king (x 54 to 62.5u, y 14.8 to 17.3u). Left ones still from the photograph.
- The hesitation into 24 was shader compilation on the first draw (measured: about 1.2 s on a loaded machine,
  first visit only). Programs are now compiled with renderer.compileAsync and the scene is hidden until they
  are ready (glass.ts, end of makeGlass). Measured after: about 60 ms.
- Clippings drop 1.5u (were 3.4u): none crosses its neighbour. Card words 0.2 s earlier. Board raised 0.5u
  (BOARD.v 34.0) so it clears the card. Photograph arrives at 0.2 s (was 0.45) so the stage fills sooner.

## 25 · done (opening rebuilt)
Idea: slide 16's board comes home. The eight world cards appear where they hung on 16 (rects, tilts, names
and picture centres copied from pack/16 into data.ts WORLD); the two with no company card (power wall,
security race) step back and leave; the six pictures travel to the company's cards, which rise under them;
each number lands and the card is then taped down. Beats: `first` (top row; rest at 4.5 s), `second`.
No false figure on screen: pairs (2.3% → 0.57%, 13% → 64%, $1.48 → $0.64), "3x" and "Agent" arrive whole
through a mask; only tallies count up (9,000+, 623, 277, 3.62 lakh).

## Not verified
60 fps in real time on a quiet machine (load average was above 20 during every check); the no-WebGL fallback
of 24 and reduced motion; Indic strings by a native reader; 3840-wide rendering.
