# Builder "wheel": slides 50 to 54 — ALL DONE AND CHECKED

## 51 to 54 (ONE scene in s51; s52, s53, s54 are one-line re-exports)
- Idea: the recorded wheel plays on a kiosk screen under the director.
- Beats: wheel (51: screen arrives, wheel drifts to a stop) · spinning (52: spin-up, then the loop turns while the slide rests) · landed (53: coast, stop on 01, result held; clip frame 435) · page (54: use case page; clip frame 705).
- Files: s51/index.tsx (timeline: one linear stretch per clip, backdrop moves), player.ts (makes the videos follow the playhead: play / jump → still → exact frame / loop at rest), data.ts (marks from rec/manifest.json), scene.css.
- Assets: public/keynote/wheel/ 01-wheel.mp4, 02-spin-up.mp4, 03-spinning.mp4, 04-stop.mp4 (byte for byte from Spin-Wheel-BYOT.pptx), stills wheel-first/wheel-last/loop-first/landed/page .png (frames taken losslessly from the clips).
- Chrome: rail, crumb, logo off on these four slides (the picture carries its own logo and title).
- Checked: beats at 1920 and 1366, strip 53, press 50 and 51 and 54, real-key probe (Next, Back, Next mid-move, arrival from 50, on to 55 and back), walk 49..55 clean.
- With &still=1 (the checker) the loop is held on its first frame by design (ctx.held).

## 50 (Prastuti / Martin)
- Idea: the same room twice. Beats: challenge · turn (prompt types, Tamil deck builds tile by tile) · result (the before photo arrives on the right and is wiped into the after photo) · scale (banner, two counts).
- Files: s50/index.tsx, data.ts, scene.css. No generated pictures, no canvas.
- Flags: deck placeholders never shown; empty portrait frame with initial "M" tagged "Photo to come"; no quote area. Tamil strings from data.json, not verified by a Tamil reader.
- Checked: beats 1920 and 1366, strips, press 49, walk 49..55 clean.
