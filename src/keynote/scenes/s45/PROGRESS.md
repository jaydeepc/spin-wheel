# The train (slides 45 to 49): progress

One span scene in `s45/` (`s46` … `s49` re-export it). Files: index.tsx, data.ts, fx.ts (three.js:
steam and speed streaks, one canvas above the band), scene.css. No generated pictures (0 of 10):
the deck's landscape and cut-outs are sharp enough and are used as they are.

Idea: one landscape, one track.
- 45 (trolley, steam, electric, aidlc): the generations come through one at a time, each faster;
  the older engine clears the track to the right as the new one chases in from the left and stops
  over its own card. Steam from the chimney (three.js points, CPU-placed from the steam clock);
  the high-speed train drags streaks of air in with it. Cards and counters accumulate.
- 46 (stations, agents, people): tracking shot. The train holds the frame; the deck's landscape,
  mirror-tiled, runs under it (sky part 100u/200u/100u per beat, the track strip three times as
  fast, split at 81.5% of the picture's height), streaks in three.js keep off the train's body.
  Stations open in three layers: head + what AI does, AI AGENTS (a light runs dot to dot),
  OUR PEOPLE (navy, lands last and firmest; the dots turn navy). Every rest of 46 is the deck's
  frame or its mirror.
- 47 (engines, skill): the train leaves, the band closes to a window where the workshop picture
  stands and the picture opens out of it (push-in); 600+ and 70+ count; the three pills of a skill
  come off the bookshelf of the picture.
- 48 (ticket, coach): the empty coach; then the arrow, the second card arrives with the SAME
  empty coach and cross-fades to the team (seats turn orange).
- 49 (ontime, half, voices): station picture and the "Earlier" bars; flame bars stop early and
  55 to 60% counts; three colleagues (real 189 px photographs, capped at their own pixels).

State: DONE and checked. tsc clean in s45 to s49; rests at 1920 and 1366 (console clean); strips
of every move read; press 44 (in) and press 49 (out); walk 44 to 50 clean.

Decisions / flags:
- 45 never shows the four engines side by side (the deck's still frame does): they pass one at a
  time on the one track. The fourth is the WHOLE train (46's cut-out), not the cropped nose file.
- 46 cards are three stacked tiles per station instead of one nested card (so each layer can land
  by itself); dashed empty slots show the structure on the first rest. Type raised to the 0.85u floor.
- 48 footnote moved up into the safe area (47u).
- Not checked: reduced motion and the no-WebGL fallback were written but not run; 3840 not shot.
