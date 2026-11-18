# Slides 61 to 64 (the team): progress

ONE scene spanning 61, 62, 63, 64, in `s61/` (62, 63, 64 re-export it). Shared pieces in
`scenes/_shared/people/` (data.ts: pictures, mesh places, links; nodes.tsx: the DOM nodes;
mesh.ts: the placer and the three.js links; people.css).

Beats: 61 team · 62 icon, neurips · 63 patent, stage · 64 mesh, agents, ourteam.

Status: DONE and checked (rests at 1920 and 1366, strips, press 60/61/63/64, walk 60 to 65 clean, tsc clean).
Not checked: frame rate on a real screen, the no-WebGL fallback, reduced motion, 3840 wide.

Decisions
- No generated pictures.
- 64's closing line uses only the deck's words: "Our people + Our AI teammates = Our Team".
- The four empty circles of 64 are left out. No names on 64.
- Receipt: the filing agent's name, street and e-mail are covered (RECEIPT_MASK in people/data.ts).
- Mesh places were relaxed once offline and frozen in people/data.ts (XYZ, LINKS).
- On 62 and 63 the first card stands in the middle and slides to its column on the next beat (no half-empty rest).
- 63 has two beats (patent, stage): the talk and the summit photographs arrive on one press.
