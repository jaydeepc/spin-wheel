# hood2 · slides 59, 60 · progress (second builder, after review)

## s59 Six pillars: DONE
Idea: navy ground slab "open models" → six pale stone piers rise THROUGH it (three.js, clipping plane) → navy beam "in-house AI" lands, flame heads glow.
Beats: compute (slab + piers 1-3, then the plan of 4-6: dashed outlines + sockets on the slab), serving (piers 4-6), house (beam).
Second pass: beam and slab now fade in 3u from their seats (beam also 6u toward the room), never crossing chrome, headline or Back/Next; tech lines broken deliberately (data.ts breakAfter); ghost outlines + sockets for the first rest; slow CSS glint across the faces after "house" (idle, stopped by &still=1).
Checked: rests 1920 + 1366, strips 1920, walk 58-61 (clean in 59/60). Not verified: no-WebGL plates, reduced motion, 3840, the glint in motion, press sheets (machine too loaded to record a change in real time).

## s60 Four levers: REBUILT, DONE
Idea: ONE console. A navy deck (three.js, canvas UNDER the DOM, 3 degree lens so all four levers are seen head-on and alike) runs under the four cards, which stand on it. Each lever: inlaid plate, rimmed slot, steel arm, big grip with collars. A channel runs from every slot along the deck, through a tab, into the navy panel, where an SVG way leads up to the three discs.
One pull per press: grip steel → flame, slot fills, card lights, light runs the channel into the panel, the three traces each take ONE equal step (latency down, the others up). No track, no end stop, no values, no lead meter.
Beats: console, hardware, memory, runtime, footprint, measure (banner).
Files: data.ts (words, layout G, TRACE), levers.ts (three), index.tsx, scene.css, icons.tsx. No generated pictures.
Checked: rests 1920 + 1366, strips of console and hardware at 1920, walk 58-61. Not verified: strips of the other pulls and of measure, no-WebGL flat deck (.s60-flat), reduced motion, 3840, press sheets.

Gotchas: data-gl is set on ctx.root (.kn-scene), so CSS reads `.kn-scene[data-gl] .sNN-…`. The traces are drawn from one number each (prog[k].p) in drawTrace(), also on ctx.onSeek.
A patient shooter for a loaded machine is in the scratchpad: s2/hood2/tool/q.mjs (one page load, then __kn.seek per frame).
