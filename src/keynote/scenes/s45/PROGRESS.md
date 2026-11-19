# The train (slides 45 to 49): progress

One span scene in `s45/` (`s46` … `s49` re-export it). Files: index.tsx, data.ts, fx.ts (three.js:
steam and speed streaks, one canvas above the band), scene.css. No generated pictures (0 of 10):
the deck's landscape and cut-outs are sharp enough and are used as they are.

Idea: one landscape, one track.
- 45 (trolley, steam, electric, aidlc): the generations come through one at a time, each faster;
  the older engine clears the track to the right as the new one chases in from the left and stops
  over its own card. Steam from the chimney (three.js points, CPU-placed from the steam clock);
  the high-speed train drags streaks of air in with it. Cards and counters accumulate.
- 46 (stations, agents, people): tracking shot, then a DRONE SHOT (asked for after projecting it in
  the hall: the agents' names at 0.87u could not be read). The train runs as before (the landscape,
  mirror-tiled, under it: sky part 100u/200u/100u per beat, the track strip three times as fast,
  split at 81.5% of the picture's height); 0.8 s into the first move the camera rises and pulls
  back: `.s45-band` scales to 0.55 about its top centre and lifts 0.5u (`camera()` in index.tsx;
  the far layer `.s45-far` keeps 9% more size and settles later: parallax; `fx.view` takes the
  streaks along). The picture reaches 41u past the stage on each side (five tiles per strip), so
  the small railway still runs edge to edge; the band's clip-path opens to it for 46 only.
  Under it, 24u of stage for the stations: seven cards in two rows (1, 3, 5, 7 above; 2, 4, 6
  below, their connectors come down between the upper cards), every dot straight above its card.
  Three rests in the SAME card: stage + what AI does (1.6u); then the light runs along the track,
  the AI line gives way to AI AGENTS and the names (1.5u bold navy on white chips); then OUR PEOPLE
  (navy, 1.35u) lands in the dashed slot and dots and connectors turn navy. Nothing read on 46 is
  under 1.3u. 47's first move brings the camera back down in 0.44 s while the train leaves, then
  goes on exactly as before.
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
- 46: what AI does at each station is on the FIRST rest only; it leaves when the agents' names
  arrive (all three layers at 1.3u or more do not fit one card). The three older engines of 45
  are faded out at the start of 46 (they wait off stage right, where the wide shot would see them).
  Rests of 46 are no longer the deck's frame: the composition is the keynote's own.
- 48 footnote moved up into the safe area (47u).
- Not checked: reduced motion and the no-WebGL fallback were written but not run; 3840 not shot.
