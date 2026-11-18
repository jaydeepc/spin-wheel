# s65 · the ending: Piramal Mind

Status: DONE and checked on 19 Nov (beats at 1920 x 1080 and 1366 x 768, strip of `mind` at 0.3 s, walk 64 to 65 clean, console clean, no tsc error in this folder).

## Idea
Everything the morning spoke about lives inside one mind, and every AI draws on it: it gives them
intelligence even when it is not asked, as a mind does (the owner's crux, 19 Nov).

## Beats (three; `connect` and `mind` were merged on 19 Nov: one press, 7.4 s)
1. `recall` (rest 3.5 s): 18 stills fly in to a curved wall, each with a label; "Everything we spoke about this morning…".
2. `mind` (rest 10.9 s, 7.4 s of movement): threads, cards shrink to nodes, the camera pulls back, the points gather (as before, a little tighter); "…lives inside one mind." is written under the first line at +0.7 s; the sentence leaves at +2.8 s; the mind steps down from +2.6 s; "Piramal Mind" from +3.05 s; "It gives intelligence to every AI, even when it is not asked. As a mind does." from +3.6 s; flows in from +4.1 s; "One connected memory" +4.8 s; "Every AI draws on it" and the five AIs (dim rings with names) from +5.0 s; from +5.5 s a pulse leaves the mind for each AI in turn (0.25 s apart) and each lights as it arrives. After +6.1 s only the lights are still to come. At rest the same pulses go on as a CSS idle (one every 1.3 s, in turn; off with `&still=1` and for reduced motion).
3. `questions` (rest 14.5 s): the mind moves right and calms; logo, "Thank you", "Questions?"; under the mind "Piramal Mind / The mind behind every AI at Piramal."

The AIs are rings with names, not portraits: PIA's and Arya's marks carry lettering that is mush at 2.6u, and Nivaaran and Prastuti have none.

## The start of the move out of `recall` (kept from the old `connect`)
The first 1.8 s of `connect` used to look like the `recall` rest (thin threads behind bright cards), so a presenter pressed again and the mind popped in. Now: on the press every card flashes and lifts, then dims and steps back (`ping`, 0.7 s), the labels go, and the threads start at once, drawn above the cards as a thick additive core with a soft halo and a bright travelling head. Shrink starts at +0.45 s, pull back at +0.3 s, the points gather from +0.9 s. Not watched in real time.

## Files
- `index.tsx` DOM and timeline; `mind.ts` all three.js (one state object tweened by the timeline, one draw); `data.ts` cards, threads, wording; `scene.css`.
- `public/keynote/gen/65/still-NN.jpg`: 18 stills, 960 x 540, taken with `shoot.mjs beats NN --gpu --chrome 0 --size 960x540`. No generated pictures were made (0 of 10).

## Decisions and flags
- Chrome: logo, rail, crumb, counter off on this slide; the scene shows its own logo on the last rest.
- Wording: the sentence, the line under the name, "Every AI draws on it" and the last small line are the lead's wording of the owner's thought (19 Nov). "It remembers. And it connects." is the Everyday AI film's. The old "Gives back" column and its three sentences are gone.
- The stills contain the scenes as they are, including real photographs (12, 64) and the masked statement (37), shown small. If any scene changes, re-shoot its still.
- Card labels are ours (two to four words from each slide's headline).
- No-WebGL fallback: a flat grid of the stills and a soft orb (built, not visually checked).

## Left to do
- Nothing required. Not checked: the idle over a long time on a real screen (frame rate, 20 minutes), reduced motion, the no-WebGL fallback, press out of 65 (it is the last slide).
