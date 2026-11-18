# ctx2 · slides 6 and 7 · progress

Both scenes were written by an earlier (interrupted) run and reviewed, checked and finished in a second run.

## s06 · the scale-up charts · DONE (checked)
- Idea: the first chart is run as a RACE on the chart's own x axis (years). All seven curves (the deck's
  own paths, `data.ts → RACE_CURVES`, cut at 100) are drawn as far as the same year; ours carries a light
  at its head and a clock beside the chart stops at 4.5 yrs. Then the opex line falls, then 90+ DPD stays flat.
- Beats: `race` (axes, start, ours reaches 100, clock 4.5 yrs) · `peers` (years run on; NBFC A / B / C finish,
  list fills) · `opex` (list hands over to the deck's labels in the chart; card 2: axes, goal band, line with
  figures, band steps 25 bps down; card 3 waits dimmed) · `risk` (card 3: flat line draws).
- No canvas (SVG, drawn by numbers on the timeline: `track.ts`). No generated pictures.
- Decisions: opex y axis prints every second tick of the deck's sixteen (type floor); source line at 0.85u;
  the logo file on the chart is the deck's own, never larger than its 195 px.

## s07 · the profitability bars · DONE (checked)
- Idea: what was earned is solid, what is guided is a dashed box filled with rising light (three.js points,
  `volume.ts`), all on one scale up to 2,300.
- Beats: `bars` (axis, Growth PBT FY23 to FY26 rise, figures count) · `pat` (Company PAT pills, the two notes,
  arrow 485 → 1,506, "210% YoY profit growth" underlined) · `h1` (divider, FY27P bar 990, pill 1,006, tag) ·
  `guidance` (dashed box draws up, fills with light, 2,200-2,300 lands, arrow from 1,506, "50% growth" underlined).
- Flag: the tag beside the FY27P bar is kept as the deck prints it, "<< H1 FY26A" (probably meant H1 FY27).
- No generated pictures.

## Left
Nothing known. See the final report for what was not verified.

## Third run (repair after review) · ctx2
Fixed at the cause; files changed only in s06/ and s07/.
- s07 `volume.ts` rebuilt: the guidance light is now a shaded column (flame at the bar, gone at 2,300, slow
  rising bands and wisps) with 84 large soft warm-white motes; no hard specks. Checked at 1920 and 3840.
- s07 `chart.tsx`: scale lowered (2,300 stands 20.6u, was 23.2u; base 302) so the hero figure has room;
  "2,200-2,300" is 3.6u, set from the box's left edge with about 2.5u clear above; arrow from 1,506 lands on
  its left edge; divider starts under the arrow. Pills and legend swatch are navy-grey with an outline.
- s07 `index.tsx`: both legend rows from the first rest (Company PAT dimmed until `pat`), FY27P label ghosted
  on the axis until `h1`.
- s06 `index.tsx`: on `opex` the clock and the three rows TRAVEL into the deck's labels in the chart
  (shrink + move, labels and numbered markers take over on arrival); card 2 starts 0.3 s later. The in-chart
  numbered markers now wait for that hand-over (no lone "1" on the race rest). fromTo replaced by to.
- s06 `charts.tsx`: opex ticks, quarter labels and the "25 bps" note raised from 8.5 to 9.1.
- Not done (optional in the review): shortening the peers' finish lines under the in-chart labels (the deck
  draws them full height).
- Checks: see the final report; the machine was heavily loaded during this run (page loads 40 s+), so some
  checker runs timed out and were retried.
