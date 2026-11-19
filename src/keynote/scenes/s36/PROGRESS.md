# Banking agent, new story (slides 36 to 39): progress

One span scene in `s36/` (index.tsx, data.ts, scene.css); `s37`, `s38`, `s39` re-export it.
Source: the owner's four pictures of 18 Nov (PACK-FIXES.md). DOM + SVG + one 2D canvas; no
three.js, no pictures, no generated pictures.

Beats: 36 alike, healthy, average, fragile · 37 raw, genai, features · 38 build, model, score · 39 curve, two, ten.

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

Slide 38 added (19 Nov)
- Source: the owner's fifth picture. Slide 38 is new (build, model, score); the whole chart story (curve, two, ten) is now slide 39. deck.ts: only row 38's title changed. There is a fourth headline (.s36-h--39) with the old words; FLAME[39] is the old FLAME[38].
- build: step 2 lights here (it used to light at curve). The 9,000 points of 37's field leave it and gather into the card's numeral: "~9,000" IS the count of points that have arrived (field state `g`, same canvas; the gather's random numbers are drawn after the field's own, so 37's field is unchanged). The list is a reel of grey rows that runs past and stops on a window of ten; the six features resolve out of grey bars one by one. The model's nodes and the ring keep their places, empty and grey (as GenAI's column does on 37 raw).
- model: a line of light from each feature to an input node; nodes land layer by layer (5, 6, 6, 4, 1), all 94 grey links draw, 34 of them again in flame (chosen by a fixed seed; every node has a flame link in and out; all four into the output are flame), then a wave of light runs (two at first; one after review, see below) left to right and the output node answers.
- score: one quicker wave, the line to the ring, the ring closes clockwise in TEN bands (hairline gaps: this differs from the picture's unbroken ring) while the numeral counts 1 to 10, "bands" lands, the caption resolves.
- 39 curve: the ring's ten bands become ten points that fly to the chart's ten group numbers on the axis as the card arrives; the chart's own timings are untouched (curve still takes 3.87 s).
- Words are data.ts `ML`. The caption's apostrophe is the picture's curly one. Smallest type on the slide: "BANKING SCORE" at 0.88u (36's smallest is 0.85u).
- ctx.reduced: nothing travels or pops (no reel, no waves, no flying points); the card's count and the ring's bands still run.
- Checked: beats of 37, 38, 39 at 1920 and 1366; strips of 38 and of 39 curve with --gpu; walk 35 to 40 clean; tsc clean. Rests of 37 and of curve, two, ten compared with shots taken before the change.
- NOT done (outside this folder): public/keynote/pages/38.jpg and 39.jpg, their thumbs, and any pack check of row 38's title (check_deck.mjs) still know the old slides; deck.ts NOTED still lists 38. ctx.reduced was read through, not shot.

Slide 38, after review (19 Nov)
- build: the points no longer land on the numeral. They come home to the free right end of the card's header (clear of "~9,000" and of "features / built from the categories"), growing smaller and fading over the last fifth of the way; the numeral still counts the points that have arrived and is readable throughout. 37's rows leave sooner (0.3 s, stagger 0.03) and the card rises at +0.5 s, so the card's place is empty before it appears.
- model: ONE wave, then the output node answers; the beat is 3.96 s (was 4.71 s).
- score: only the model's last two gaps fire (the whole wave has just been seen); the line leaves at about +0.4 s and the ring begins at about +0.65 s; the beat is 2.83 s (was 3.4 s).
- The ring: the gap between two bands is a hairline (GAP = 0.28 degrees each side, was 0.9), so from the room it reads as the picture's closed ring and still counts to ten.
- Links: grey ones fainter and thinner (#e3e7f0, 0.8), flame ones thinner (1.3), as on the picture. Which links are flame is unchanged.
- 39 curve: the model is one group (.s36-netbody) and drifts left 1.8u as it fades, after the card; the ring's bands are gone by +0.47 s, before the chart's card is half there. The chart's own timings are untouched (curve is still 3.87 s).
- SCENES.md: the span is listed as 36 to 39.
- Checked again: beats of 37, 38, 39 at 1920 and 1366, strips of 38 and of 39 curve with --gpu, walk 35 to 40 clean, tsc clean. 37's three rests are pixel-identical to the shots from before slide 38 existed; curve, two, ten are pixel-identical to the first build's.
- Still NOT done (outside this folder, needs the owner's word): public/keynote/thumbs/38.jpg and pages/38.jpg show the old slide (in the overview grid 38 and 39 both look like the chart); deck.ts NOTED still lists 38.
