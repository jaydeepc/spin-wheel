# Builder ctx1 · slides 3 and 4 · progress

Third pass (repair after review). Both slides DONE and checked. No generated pictures (0 used).
Shots of this pass: scratchpad/keynote/s2/ctx1/fix/.

## Slide 03 · "The Year That Moved Us Forward" · DONE

- Idea: the slide says "forward", so the room moves forward. A scene-owned three.js tunnel of
  light (streaks.ts: one instanced mesh, 1300 lights, one draw call) rushes past as the headline
  rises, and slows to drifting motes. Then the three real photographs come out of the vanishing
  point and land in a row with weight, in front of a wall that is only light, 30u behind them;
  a slow sideways truck of the camera (CSS, paused when held) gives parallax.
- Beats: `year` (rush, headline, the deck's sub-line) · `moments` (title lifts, photographs arrive).
- Photographs: the files of public/keynote/src/03, whole, own 3:2, 27.6u wide (deck: 29.8u),
  all three capped at the narrowest file's own width (873 px); only translated. No tilt, no filter.
- Repair pass:
  - The rounded glass pane is gone. The wall is a fine line of light at 30.3u (thins to nothing at
    both ends), a wash falling from it (gone by 50.4u, inside the safe line), and faint vertical
    joints (what the truck's parallax is read against). No border, no radius.
  - The row is laid out from the print's actual width (`--s03-w`, `--s03-gap`, `--s03-i`), so at
    3840x2160, where the prints stop growing, the gaps stay 2.6u and the group stays centred. Seen.
  - The streaks thin out over the section rail, the logo and Back / Next (fragment shader, `uRes`).
- Flags: the deck's sub-line reads "serving our customer better" (kept as is).

## Slide 04 · "We have built a large, diversified retail-led business" · DONE

- Idea: two books, then and now; every figure on screen is the height you are looking at.
- Beats: `mar22` · `grown` (the column's twin comes out from behind Mar-22, walks to Sep-26, grows
  slice by slice, total counts 22,010 → 1,11,440, green arrow, "5x") · `diversified` (eleven lines
  of business with leaders and shares) · `legacy` (43,175 comes down to 1,673, "Down 96%", "1.5%").
- Charts: the kit's MultiBarChart from data.ts; the scene moves the kit's rects through one
  state object on the timeline.
- Repair pass:
  - The Sep-26 twin is clipped (clipPath `s04-clip-growth` / `s04-clip-legacy`, counter-moved on
    the timeline) to what has cleared the Mar-22 column, so "66%" / "26%" never blink off.
  - "1.5%" is lifted clear of the axis and tied to the sliver with a short tick.
  - Leader lines 1.15 thick (were 0.9). Header comment corrected (the cards keep their own scales).
- Decisions / flags:
  - Deck's two purples are navy tints (ruling). Sep-26 shares are in the legend; only 31% / 27% in the column.
  - Mar-22 thin slices: heights from the deck's own vector drawing, no numbers invented.
  - Each card is scaled to its own maximum, as on the deck (22,010 and 43,175 are not to one scale): owner's call.
  - Totals and "Down n%" show interpolated values mid-move; every rest shows only deck figures.
  - First rest leaves the growth card mostly empty on purpose (left as is; no invented outline).

## Left to do

Nothing known.
