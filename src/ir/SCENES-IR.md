# Building a scene of /ir

`/ir` is "Implications for Investors": eight slides, played by **the keynote's engine** (director,
chrome, backdrop, kit). Nothing of the engine is copied: `src/keynote/Keynote.tsx` takes a deck,
and `/ir` gives it `src/ir/irDeck.ts`.

**Read `src/keynote/SCENES.md` first.** The contract (`SceneModule`, beats, labels at the REST),
the nine rules, `ctx`, the backdrop, scene-owned three.js, every piece of the kit, colour and type,
hold URLs and the checklist are all the same. This page says only what is different for `/ir`.
Reference scenes: `src/ir/scenes/s01/` (the dark title), and the keynote's `scenes/s05/` (a
content slide done properly), `s04`, `s06`, `s07`, `s57` (charts drawn from data), `s65` (the
keynote's Thank You).

## Where things are

```
src/app/ir/page.tsx            the route
src/ir/
  deck.ts                      the 8 slides (n, id 'irNN', title, theme, crumb). No sections, no agenda.
  irDeck.ts  Ir.tsx            the deck handed to the engine; the client root
  kit.ts                       THE KIT FOR /ir: import from '../../kit' exactly as in the keynote
  pic.tsx                      pic(), gen(), <Pic> reading /ir's own pictures
  scenes/sNN/index.tsx         ONE SCENE PER SLIDE (+ scene.css, + data.ts, inside that folder)
  scenes/_shared/stub.tsx      the stub (the page picture; the plain words for 7 and 8)
public/ir/pages/01…06.jpg      the six pages of the source deck, 2880 x 1620 (reference; a stub shows them)
public/ir/thumbs/01…08.jpg     640 x 360, for the overview grid (07, 08 are pictures of the stubs: redo when built)
public/ir/src/NN/…             the deck's own pictures (below)
public/ir/gen/NN/…             generated pictures of slide NN, if your brief allows any
exports/_rig/ir-src/           THE SOURCE: deck-text.md (every word and number), pages/p-1…6.jpg, deck.pptx, deck.pdf
```

## The slides

| n | folder | theme | title (`slide.title`, exact) |
| --- | --- | --- | --- |
| 1 | `s01` | dark | Implications for Investors (BUILT: the reference) |
| 2 | `s02` | light | Last year we spoke of AI impact on AUM growth and operating efficiency |
| 3 | `s03` | light | On track to meet all FY27 targets… |
| 4 | `s04` | light | …driven by improving operating leverage |
| 5 | `s05` | light | What has AI delivered for us in the past 12 months? |
| 6 | `s06` | light | We are working towards 20-25% AUM CAGR along with RoE of 15%+ |
| 7 | `s07` | dark | Thank You! |
| 8 | `s08` | dark | Q&A |

## What differs from the keynote guide

- **Your folder is `src/ir/scenes/sNN/`** (and `public/ir/gen/NN/`). Replace `index.tsx` (now a
  one-line stub), add `scene.css`, `data.ts`. Touch nothing else: not `deck.ts`, not the kit, not
  anything under `src/keynote/`.
- **Imports: the same line, another kit.** `import { anim, Headline, Words, Count, BarChart,
  LineChart, Card, Pic, pic, place, type SceneModule } from '../../kit'` resolves to
  `src/ir/kit.ts`: the whole keynote kit, with `slide(n)`, `SLIDES`, `COUNT`, `pic`, `gen` and
  `<Pic n name>` replaced by /ir's own. Never import from `src/keynote/kit` directly (its `pic()`
  and `slide()` are the keynote's). `AGENDA`, `SECTIONS`, `section()` are the keynote's: not for /ir.
- **Pictures.** `pic(2, 'last-year-aum-growth.png')` is `/ir/src/02/last-year-aum-growth.png`;
  `<Pic n={2} name="last-year-aum-growth.png" fit="contain" width={…} ratio="669 / 668" />`;
  `gen(5, 'x.png')` is `/ir/gen/05/x.png`. List them in `preload`.
- **The prefix is `irNN-`, not `sNN-`** (`ir03-card`, `@keyframes ir03-float`, `--ir03-gap`, SVG
  ids): `ctx.slide.id` is `'ir03'`. The keynote's scenes own `s03-…`.
- **The chrome.** No section rail. On slides 2 to 6 the bar begins with the quiet breadcrumb
  "IMPLICATIONS FOR INVESTORS" (from `deck.ts`; do not draw it yourself), the logo is at the top
  right, the counter and Back / Next at the bottom right. Slides 1, 7 and 8 have no breadcrumb.
  Switch parts off with `chrome: { logo: false, crumb: false, counter: false }` as in the keynote.
- **The stage, the units and the safe area are the keynote's, unchanged**: 100u x 56.25u, `--u`;
  content inside x 4.2u … 95.8u, y 6.4u … 50.6u (`--kn-x0/x1/y0/y1`); keep x > 80u, y > 50.6u
  clear (Back / Next); the kit's `<Headline>` sits at left 4.2u, top 6.9u. A background may bleed.
- **There is no pack.** The source is `exports/_rig/ir-src/deck-text.md` (copy every word and
  number from there into your `data.ts`: copy and paste, never retype) and the page picture
  `exports/_rig/ir-src/pages/p-N.jpg` (it settles which label belongs to which number; read it).
  `deck.pptx` may be read with python-pptx or unzip only: never open it in PowerPoint.
  Nothing from it is ever sent to an outside service. Do not import anything from `exports/`.
- **The owner's brief: do not go by how the slide is structured; take the data from it.** Charts
  are drawn from the numbers (`BarChart`, `MultiBarChart`, `LineChart`), never shown as pictures.
- **The headline's flame words** are the deck's (seen on the page pictures): slide 3 "FY27
  targets…"; check each page for the others.
- **Hold URLs**: `/ir?s=3`, `/ir?s=3&at=<beat>`, `/ir?s=3&at=<beat>&dt=0.6`, `&chrome=0`,
  `&still=1`, `&warm=0`: as in the keynote, on `/ir`.

## The deck's own pictures (`public/ir/src/`)

| File | px | What it is, what you may do |
| --- | --- | --- |
| `01/hero-dawn.jpg` | 5333 x 3000 | the title's ground: deep navy, an ember light top right, a blue one bottom right. The deck's own art, full-bleed. |
| `01/hero-dawn-2880.jpg` | 2880 x 1620 | the same, at the size the stage needs (slide 1 uses this one; 7 and 8 may use it too) |
| `01/logo-deck.png` | 1116 x 482 | the logo as the deck embeds it. Reference only: use the chrome's logo or `<Logo />`. |
| `02/last-year-aum-growth.png` | 669 x 668 | **a picture of last year's slide** "We expect AUM growth momentum to sustain longer" (a bar chart, FY25A to FY30P). On the page it is at the TOP LEFT, 29.2u wide, its bottom 14.8% cropped away (`srcRect b=14773`), and the AUM-growth sentences stand to its right. A real document: show it as it is (its own pink and blue included), never redraw, never stretch, never wider than about 35u (it is 669 px). |
| `02/last-year-opex-outlook.png` | 670 x 672 | **a picture of last year's slide** "Revising Retail Opex-AUM outlook lower" (a line chart, 6.5% down to 3.9%). On the page it is at the BOTTOM RIGHT, 29.6u wide, shown whole, and the opex sentences stand to its left. The same rule. (deck-text.md lists the sentences as "Left" and "Right": go by the page, `p-2.jpg`: AUM picture with AUM words, opex picture with opex words.) |
| `03/icon-tick-stock.jpg` | 2000 x 2000 | a stock green tick on white (shown three times, 3.6u). Decoration: REDRAW it as a vector tick (green is allowed here: it is the slide's own signal colour). Do not use the file. |
| `04/icon-arrow-straight.svg` | vector | a small grey arrow (decoration: redraw) |
| `05/icon-arrow-curve.svg` | vector | a small green curved arrow beside the two growth figures (decoration: redraw) |
| `_shared/bg-light.jpg` | 4800 x 2700 | the deck's light background, with a logo baked in. Reference only: the backdrop replaces it. |

The charts of slides 4, 5 and 6 are chart objects in the file (their previews are EMF): their
values are in `deck-text.md`, exact. Slides 7 and 8 have no source file: their words are in
`deck-text.md`; the orange circuit lines of the owner's photograph are drawn as SVG (`a.draw`).

## Checking

The tools are the keynote's, with `--route ir` (or `export KN_ROUTE=ir`). Without it they check
`/keynote`, exactly as before.

```
cd exports/_rig/keynote-src/tools
export KN_OUT=<your scratch folder>/shots            # give yourself a folder of your own
node shoot.mjs beats 3 --gpu --route ir              every rest of /ir slide 3 (must print "console: clean")
node shoot.mjs strip 3 --gpu --route ir              the move that leads to every beat, as strips
node shoot.mjs frame 3 <beat> 0.4 --gpu --route ir   one frame
node shoot.mjs beats 3 --gpu --route ir --size 1366x768
node press.mjs 2 --route ir                          a press in real time: out of slide 2, into slide 3 (--back, --at <beat>)
node walk_all.mjs --gpu --route ir                   all 8 slides with real keys, forward and back
node walk_all.mjs --gpu --route ir --from 2 --to 4   a stretch; must end "the walk is clean"
cd <project> && npx tsc --noEmit -p . 2>&1 | grep "src/ir/scenes/s03/"     # must print nothing
```

The dev server runs on port 5183: never start, stop or restart it; never run `next build` or
`next dev`. Without `KN_OUT`, pictures of /ir go to `$KN_SCRATCH/shots-ir` and
`$KN_SCRATCH/walk-ir/…`, apart from the keynote's.
