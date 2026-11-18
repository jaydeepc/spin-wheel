# world2 · slides 19, 20, 21, 22 · progress

Third pass (repair after review). All four are built and checked; nothing is half-written.

| Slide | Idea | Beats | State |
| --- | --- | --- | --- |
| 19 | REBUILT. Ten three.js coins pour from behind the padlock photo and land in a row over a 0 to 100 measure; as 71.5% climbs through 13 and 56 the measure fills and coins turn over to flame until 7 of 10 are flame; on price every coin shrinks inside a dashed ring of its old size (face area 53%) while a second measure retreats 100 to 53 and 47% counts | share, price, why, news | done |
| 20 | sky of three.js kites on sagging strings to one spool; the spool comes forward, ONE PULL snaps every string straight and snatches every kite nose-down, flame words flash; three strings snap, kites go up and away, tumble grey onto their clippings | fly, hands, snaps | done (pull, sag, sizes, layout repaired) |
| 21 | bought then built: locked boxes, the cube opens, 16 instanced tiles arc into the grid; FROM grey, TO flame | bought, build, news | done (small fixes: count starts as card falls, cells arrive with panel, dashed TO slots wait in the bought rest, idle tiles appear clear of the lid) |
| 22 | a lead that is too short: a meter (drum window, turning disc) rolls to 945, chips wait, the lit chip's plug lunges twice and stops short | power, grid, news | done (meter housing, chips arrive without crossing, larger second reach, captions and sources spaced) |

Decisions
- Each scene keeps its own `pin()`; nothing imported from `_shared/world-of-ai`.
- s19: the two bar charts are replaced by two horizontal measures carrying the same printed values (13% Apr, 56% Aug, 71.5% Sep; Dec 2025 100, Sep 2026 53). Coins flame at 13 / 56 / 71.5 = 1 / 6 / 7 of ten (rounded). The coin shrinks by AREA (53%), so its width is 72.8%.
- s19: where there is no WebGL, flat DOM discs in the same slots do the same.
- s20: no hand was drawn or generated; the spool grows 1.5x and jerks. Clippings moved left (4.4, 27.4, 50.4u) so the strings are seen converging; sources on one line; "When the string snaps" above clipping 1. Stat captions at 1.3u.
- s22: ROW 41.2 (was 41.7); sources at 49.7u.
- Generated pictures: still only gen/22/chip.png, plug.png, socket.png. Nothing new generated.

Checked in this pass: tsc clean in s19..s22; rests 1920 and 1366 for all four; strips 19 (all), 20 hands and snaps, 21 (all run, sheet of rests read), 22 power and grid; press 18..22 (clean console; 18 into 19 read); walk_all --gpu --from 18 --to 23 "the walk is clean".
Not checked: 3840x2160, no-WebGL fallbacks (19, 20, 21), reduced motion, Back in real time by eye, frame rate.
