# Banking agent, new story (slides 36 to 39): progress

One span scene in `s36/` (index.tsx, data.ts, scene.css); `s37`, `s38`, `s39` re-export it.
Source: the owner's four pictures of 18 Nov (PACK-FIXES.md). DOM + SVG + one 2D canvas; no
three.js, no pictures, no generated pictures.

Beats: 36 alike, healthy, average, fragile · 37 raw, genai, features · 38 curve, two · 39 ten.

Done and checked (18 Nov): beats at 1920 and 1366, strips of every beat, press 35 and 39,
walk 35 to 40 clean, tsc clean in s36..s39 and deck.ts. `public/keynote/gen/65/still-37.jpg`
re-shot from 36's last rest (960 x 540).

Choices
- Agent avatar is a drawn robot mark (the old one was a photo-like render).
- At "alike" the balance is a flat grey line on all three; the real line draws as the band reads it.
- 37's field of points is a representation (a few thousand points, not 9,000); the grey block is exactly 100, at the same pitch.
- 38 "curve": the chart card stands in the middle alone, then moves left as the reasoning card arrives.
- Chart values are read by eye from the picture (data.ts).
- ctx.reduced: the kit's moves calm down; the scan band, typing wipe and ring still move.

Second pass (18 Nov, after review)
- 36: findings are spaced by their own height (two-line pills get more room; never less than 0.5u of air); statements are 22.6u wide; the one being read lifts off the table (scale 1.055, deeper shadow), the band has a trail and leaves a wash of the statement's colour, and the agent's line of light runs to it. The agent and the deal-in start earlier (0.15 s, 0.4 s).
- 37 raw: GenAI's column holds its place (dim name, five dashed places) and the "100" box is already there with its 10 x 10 block.
- 37 features: exactly 9,000 points (225 x 40) at the same whole-pixel pitch as the 100; the counter IS the number of points landed. Foot boxes are stacked (number over words) to give the field the room: this differs from the picture's layout.
- Narration lines are set in Geist Mono (OFL), shipped in this folder (geist-mono-latin.woff2, Next's own copy), so hyphens are short and lines the same on every machine.
- 39: the ring goes red, amber, green (the three statement tones); rows turn over from t + 0.45.
- Chart: the area fill fades in from score 1 (no hard edge).
- still-37.jpg re-shot again from 36's last rest.
- NOT done here (outside this folder): public/keynote/pages/36..39.jpg and thumbs still show the retired slides.
