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
