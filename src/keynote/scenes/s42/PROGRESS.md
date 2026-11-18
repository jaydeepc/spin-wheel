# Slides 42 + 43 · the town map (one span, lives in s42; s43 re-exports)

Idea: the deck's map as a real place (three.js slab leaning back, pins standing on the stops, a view that follows the marker).
42: the manager drives the red dashed route with its dead ends; one press per stop, the card opens as he reaches it.
43: THE HINGE is staged: headline + chip hand over, THEN the red route is taken back along its own length (he rides it home,
the thin white ghost stays), THEN the banner, THEN Arya's planned route draws in one line through all five stops.
Then he glides along it; RANK #1.

Beats: 42 town, ask, recall, dig, stuck, missed · 43 arya, guided, onward, rank

Files: index.tsx (DOM + timeline), town.ts (three.js town, paths, the view rig, the marker), routes.ts (the deck's route
vectors, generated from the pack), data.ts (words), scene.css.

## Second pass (after the review), status

- [done] hinge staged inside 'arya' (rewind of the red route, marker never hidden)
- [done] first rest of 43: hero placement of the town + the whole planned route (pale blue on white) + five closed tasks
- [done] the view follows the marker (rig: small yaw + pan from the marker's x, push in during each drive: town.ts VIEW)
- [done] marker is a puck with a heading wedge + ground shadow; photo (DOM, real, max 110 px) carried over it on a stem
- [done] per-stop beats on 42 (ask, recall, dig, stuck) and 43 split guided / onward
- [done] RANK #1 tag moved clear of pin 5; 'Digs through notes' pill brought down onto the slab
- [done] cards close/open with words and box together; fromTo replaced by set + to
- [to check] shots at 1920 and 1366, strips, press, walk 41 to 44 (the machine was heavily loaded: the checker timed out;
  a patient shooter of my own is in the scratch folder s2/map/fix/tmp/my.mjs)

Decisions / flags
- No generated pictures: the deck's map is used as it is (routes follow its roads).
- No "wasted distance" counter: the deck prints no distance; an invented number is not shown.
- Banner shows the five instructions the deck stacks (43 t11..t15), one per stop.
- Arya's picture: the larger cut-out of slide 28.
- Without WebGL: flat picture + SVG lines (not verified in a browser without WebGL).
