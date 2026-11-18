# Slides 61 to 64 (the team): progress

ONE scene spanning 61, 62, 63, 64, in `s61/` (62, 63, 64 re-export it). Shared pieces in
`scenes/_shared/people/` (data.ts: pictures, mesh places, links; nodes.tsx: the DOM nodes;
mesh.ts: the placer and the three.js links; people.css).

Beats: 61 team · 62 icon, neurips · 63 patent, stage, judges · 64 mesh, agents, ourteam.

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

Owner's changes (MD round 10)
- 62: the ICON card's last line is the date only, "20–23 Dec 2026" ("Gauhati University, Guwahati · " removed). The NeurIPS line is a venue, unchanged.
- 64: two more AI teammates in the mesh, ABCD (the owner's logo, whole, on white) and Nivaaran (a copy of slide 28's emblem,
  `_shared/people/emblem.tsx`). Five agents now come up left to right (TEAMMATES in people/data.ts). r2c4 and r3c1 stepped aside
  by about one --u; slide 61 shows two more flame rings. No names on 64, as before.

Owner's changes (MD round 14: his own material in public/keynote/owner/team/)
- 63 has a third beat, `judges`: the three cards lift away and ONE card stands in the middle: the page "2026 Global Large
  Enterprises Judges" (judges-panel.png = the first page of judges-panel-source.png, cropped to 580 x 516, shown at 30u and
  never wider than 580 px, as a sheet on a stack), the owner's portrait (jaydeep.jpg) in a circle of 10u beside it, and the
  page's own words only (title, his name, his title, "Piramal Finance"). The page names no award or awarding body: none shown.
- 64: only circles. The three group photographs are gone from the section, and the achievements' prints no longer travel into
  the mesh (they leave with their cards). The people are the owner's new grid (portrait-grid-source.webp, 12 x 5): 52 cuts
  `p-rRcCC.png` (110 to 144 px, shown at 4.9u = 94 px at 1920), plus the owner, whose portrait flies from the judges card to its
  place. Left out: r2c11, r3c08 (pale, empty), r4c09, r5c07 (navy, empty); r5c01 does not exist. Same photograph twice in the
  owner's grid: r3c04 and r3c06 (kept, his call); r5c10 and r5c12 look like one person in two photographs.
- AI teammates (5): Nivaaran, the avatar (deck's file), PIA Investor Assistant (deck's file), PIA Instant Assistant (new, cut from
  the grid, agent-pia-instant.png), ABCD. The deck's second avatar (teammate-ai-avatar-2.jpg) is not in the owner's grid: taken out.
- The layout (XYZ, LINKS in people/data.ts) was made again for 58 nodes, offline, and frozen. 61's net follows it.
- public/keynote/gen/65/still-64.jpg was shot again from 64's last rest.
