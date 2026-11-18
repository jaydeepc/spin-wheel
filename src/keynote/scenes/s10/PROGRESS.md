# Progress: key "theme" (slides 10, 11)

No generated pictures used (0 of 4). No GEN.md needed.

## s10 "Building AI for Bharat" — DONE (checked in second run)
- Idea: the curtain rises: the room's points lift from under the stage and gather into the four words (dust.ts,
  scene-owned canvas, shader-driven so every frame is seekable); then each word POURS its column in the deck's
  numbered order.
- Beats: theme / ai / bharat / building.
- No logo in the scene (deck's doubled logo slip not reproduced). Columns left to right as the deck (3, 1, 2);
  beats follow the numbers 1, 2, 3.
- Second run: only moved the block down a little (hero top 12.2u, columns top 34.6u) for a better final frame.

## s11 "What do I talk about when I talk about AI ?" — DONE (checked in second run)
- Idea: the approved woven ribbon rings, as real lit ribbons in three.js (weave.ts) that draw themselves and weave.
- Beats: what / how / more.
- Second run: WHAT now weaves in the MIDDLE of the stage on beat 1 (so the first rest is a composed frame) and
  steps aside to its place when HOW is called (data.ts WHAT_SOLO_CX; index.tsx SHIFT). Off with reduced motion.
- Text is pack/11/text.json exactly (deck headline and "AI is much more than LLMs", not the still's wording).
- Flags: family names set straight beside the rings as in the approved still (not curved); deck icons dropped
  (approved design has none); AGENTIC / PRODUCTS & SYSTEMS coloured blue / deep navy as in the still.

## Third run (repair after review) — DONE, checked
Shots: scratchpad/keynote/s2/theme/fix/ (rests 1920 + 1366, strips, press 9/10/11, idle/, fallback-sheet.jpg). Walk 9 to 12 clean.
- s10 arrival: the points now rise as ONE SHEET along the whole floor (dust.ts uRise, aAlt = place in the sheet), then gather
  into the words. Sheet is on screen about 0.1 s after the scene's own start.
- s10 rests: about 690 motes stay around the three words and drift (dust.ts mode 2, uTime; frozen when ctx.held / reduced);
  they dim with their word (motes[key].a). A CSS light runs along each column rule (s10-shimmer). Last beat: glow under columns.
- s10 pour: the italic subline dims to 0.22 while a stream falls and returns as the column lands.
- s11 beat 1: WHAT stands at 1.2 scale, 3u lower, centred (data.ts WHAT_SOLO); comes down to size as it steps aside on beat 2.
  Same in the flat SVG fallback. Off with reduced motion.
- s11 idle: rings tilt a few degrees (weave.ts sway, zero at time 0) and a soft band of light travels round each whole ring
  about every 9 s (shader glint, gPos.y / gPow.y). Beat 3 lap is the same shader band (gPos.x), 1.2 s per ring. PointLight removed.
- s11: family names 1.22u (were 1.02u), moved 0.3u out; closing lines 0.45u lower; WHAT core word arrives at 0.3 s and the
  ribbon sets off at 0.22 s so the stage is not bare after the press.
- Not measured: frame rate; 3840x2160.
