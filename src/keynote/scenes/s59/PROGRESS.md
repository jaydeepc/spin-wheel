# hood2 · slides 59, 60 · progress

## s59 Six pillars — DONE (checked 1920 + 1366 rests, strips, press 58/59, walk 58-61 clean)
Idea: navy ground slab "open models" → six pale stone piers rise THROUGH it (three.js, clipping plane at the slab's top), icon tile rides up, title → promise → tech line → navy beam "in-house AI" lands, flame heads glow.
Beats: compute (slab + piers 1-3), serving (piers 4-6), house (beam).
Files: data.ts (words + layout L), icons.tsx, structure.ts (three), index.tsx, scene.css. No generated pictures.
Decisions: slab/beam words are cut from slide.title (not retyped), set in caps by CSS. Promise line kept dark as in the deck.
Not verified: no-WebGL fallback (.s59-plate), reduced motion, 3840 wide.

## s60 Four levers — DONE (checked 1920 + 1366 rests, strips before the data-gl selector fix, press 59/60, walk clean)
Idea: a console. Four cards in a row, each with a real lever (three.js, canvas above the DOM); one pull per press; grip steel → flame, card lights; the navy panel's three meters answer (latency shortens, throughput and utilisation grow), a white mark keeps where each began. No values anywhere.
Beats: console, hardware, memory, runtime, footprint, measure (the banner).
Files: data.ts (words, layout G, meter targets), icons.tsx, levers.ts (three), index.tsx, scene.css. No generated pictures.
Decisions: 2x2 grid of the deck became a row of four; meter fills are illustrative directions only (data.ts LEVERS[].meters).
Not verified: strips after the last selector/material fixes (rests were re-shot), no-WebGL fallback (.s60-flat), reduced motion, 3840 wide.

Gotcha for whoever continues: data-gl is set on ctx.root (.kn-scene), so CSS must read `.kn-scene[data-gl] .sNN-…`.
