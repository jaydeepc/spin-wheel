# s65 · the ending: Piramal Mind

Status: DONE and checked (beats and strips at 1920 x 1080, beats at 1366 x 768, press 64, walk 64 to 65 clean, console clean, no tsc error in this folder).

## Idea
Everything the morning spoke about comes back as cards, is joined by threads of light, and when
the camera pulls back the cloud has a shape: a mind. It is named (Piramal Mind, "Engineered to
hold all of this."), explained in the Everyday AI film's own words, and then settles for questions.

## Beats
1. `recall`: 18 stills of the keynote's own scenes fly in from depth to a curved wall, each with a label; "Everything we spoke about this morning".
2. `connect`: 26 threads draw between related cards; cards shrink to nodes; camera pulls back; 16,600 points gather into the mind; links and pulses.
3. `mind`: "Piramal Mind", "Engineered to hold all of this."; flows in (Every codebase, Every Jira ticket, Every discussion; Auto-ingested) → the mind (One connected memory; "It remembers. And it connects.") → gives back (three lines); a light runs along the flows (CSS idle).
4. `questions`: the mind moves right and calms; logo, "Thank you", "Questions?"; under the mind "Piramal Mind / The memory and the intelligence of our engineering."

## Files
- `index.tsx` DOM and timeline; `mind.ts` all three.js (one state object tweened by the timeline, one draw); `data.ts` cards, threads, wording; `scene.css`.
- `public/keynote/gen/65/still-NN.jpg`: 18 stills, 960 x 540, taken with `shoot.mjs beats NN --gpu --chrome 0 --size 960x540`. No generated pictures were made (0 of 10).

## Decisions and flags
- Chrome: logo, rail, crumb, counter off on this slide; the scene shows its own logo on the last rest.
- Wording is from `src/everyday/content.ts` (product `mind`). Two lines are lightly adapted: "It remembers what had already been decided." (film: "It remembered…") and "It talks back before anything is built." (from the film's code note). "One connected memory", "Flows in", "Gives back", "Everything we spoke about this morning", "Questions?" are ours / the brief's. The film's "80% lower AI cost" stat is NOT shown.
- The stills contain the scenes as they are, including real photographs (12, 64) and the masked statement (37), shown small. If any scene changes, re-shoot its still.
- Card labels are ours (two to four words from each slide's headline).
- No-WebGL fallback: a flat grid of the stills and a soft orb (built, not visually checked).

## Left to do
- Nothing required. Not checked: the idle over a long time on a real screen (frame rate, 20 minutes), reduced motion, the no-WebGL fallback, press out of 65 (it is the last slide).
