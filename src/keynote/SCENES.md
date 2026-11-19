# Building a keynote scene

`/keynote` presents the 65 slides of the Investor and Analyst Day morning keynote, one slide at
a time, as a live, click-to-advance presentation. **One slide is one scene, in one folder:
`src/keynote/scenes/sNN/`.** (A few runs of slides are ONE scene that spans them: see "Slides
that are one scene".) Until a scene is built its folder holds a stub that shows the deck's own
page of that slide, so the whole deck already works. You build a scene by replacing the files in
its own folder. You touch nothing else.

Read this once, then your slide's page in the source pack
(`exports/_rig/keynote-src/pack/NN/notes.md`, see "Your slide's source" below), then the
reference scenes. They are the standard:

| Scene | What it shows you |
| --- | --- |
| `scenes/s05/` | **a content slide done properly:** headline, a line of time, four milestones that each land on their own beat, icons redrawn as vector, a number that counts, the backdrop's light walking along. Start here. |
| `scenes/s02/` | **scene-owned three.js:** lit meshes in the stage's own space that land exactly on rows the DOM laid out; a first rest a presenter can stand on; an idle float that never fights the timeline; a DOM fallback when there is no WebGL; Calibri Light for large quiet words. |
| `scenes/s01/` | **a title on the dark theme,** driven mostly through the shared backdrop; a deck picture (the lock-up's lettering) placed by its own pixels and revealed line by line. |
| `scenes/s17/` | **a content slide with a breadcrumb,** so the chrome's bar is seen whole; the plain use of the kit (`Count`, `Words` with bold words, `place()`, `Clipping`, `Kicker`). A first pass: its planes are still the deck's flat picture. |
| `scenes/_shared/divider.tsx` | the section divider (slides 9, 15, 26, 31, 55): a reusable scene made by a function. |

## Where things are

```
src/app/keynote/page.tsx      the route
src/keynote/
  deck.ts                     the 65 slides (n, id, section, crumb, title, theme), the sections A to F, the agenda
  Keynote.tsx  keynote.css    the root: backdrop, stage, chrome, overview
  core/director.ts            the one director: Next, Back, jumps, hold URLs, scenes that span slides
  core/types.ts               SceneModule, SceneCtx, Look            ← the contract, read it
  core/motion.ts              the eases and the timing tokens T
  three/backdrop.ts           the ONE WebGL backdrop behind the whole deck
  three/sceneCanvas.ts        createSceneCanvas(): a scene's own three.js canvas
  chrome/                     the top bar (section rail, breadcrumb, logo), Back / Next, the overview grid
  kit/                        everything you build with (import from '../../kit')
  scenes/sNN/index.tsx        ONE SCENE PER SLIDE  (+ scene.css, + data.ts, + anything else, inside that folder)
  scenes/_shared/             the stub, the divider; and scenes/_shared/<group-id>/ for what a FAMILY of slides shares
public/keynote/pages/NN.jpg   every slide as the deck shows it, 2880 x 1620 (reference; a stub shows it).
                              The authors' review marks are already taken out of 8, 25, 29, 30, 38, 61, 65.
public/keynote/src/NN/…       the slide's own pictures at native resolution   (use these in your scene)
public/keynote/src/_shared/   the deck's two backgrounds (reference only: the backdrop replaces them, and
                              bg-light has the OLD logo baked in)
public/keynote/gen/NN/…       generated pictures of slide NN (see "Generated pictures")
src/brand/                    the font (--font-brand) and the logo: read README.md there, change nothing
exports/_rig/keynote-src/pack/NN/   YOUR SLIDE'S SOURCE: notes.md, text.json, images.json, data.json, vector/, sheet.jpg
exports/_rig/keynote-src/pack/README.md   what every field in those files means
exports/_rig/keynote-src/tools/shoot.mjs      the checker for one scene: rests, strips, frames, a walk
exports/_rig/keynote-src/tools/press.mjs      what a press looks like in real time (a change of slide, a join)
exports/_rig/keynote-src/tools/walk_all.mjs   the walk through the whole deck, or a stretch of it
exports/_rig/keynote-src/tools/check_deck.mjs deck.ts against the pack
```

## Your slide's source: the pack

Everything on slide NN was taken out of the deck once, looked at, and written down in
`exports/_rig/keynote-src/pack/NN/`. **Build from the pack, not from the page picture and never
from the PDF.** Read in this order:

| File | What you take from it |
| --- | --- |
| `notes.md` | **Read first.** What the slide says, what is on it, which pictures are real photographs or real documents, what animation the layout suggests, what the deck left unfinished, which slides it forms one continuous scene with. |
| `text.json` | **Every word that is on the page, exact.** `blocks[]` with `role`, `text`, `rect` (fractions of the slide), `sizeU` (already in stage units) and `lines[].spans[]` with each run's `color` and `weight`: that is where the flame words of the headline are. Copy characters from here, never retype them from the picture. Blocks with role `hidden` or `internal-note` are in the file and NOT on the page: never show them. |
| `data.json` | Every printed number and structured list (chart values, axis labels, tiles, cards). Charts are drawn from this. Nothing in it is estimated; where the deck prints no value it says so. |
| `images.json` | Every picture: `name`, `web` (its URL), `kind`, `px`, and `placements[]` (where and how large the deck shows it: `rect`, its shape `shownAs`, its tilt, and `visiblePart` or `uncoveredPart`, see below). |
| `vector/` | The slide's shapes as SVG (`slide-art.svg`, named regions such as `chart-….svg`, and `…@4x.png`): the deck's own icons, diagrams and curves, to redraw from or to inline. |
| `sheet.jpg` | The page beside its numbered pictures: look at it once. |

How the pack meets the code:

- **Pictures.** `images.json → pictures[].web` is `/keynote/src/NN/<file>`; in a scene that is
  `pic(NN, '<file>')` or `<Pic n={NN} name="<file>" />`. All 250 are there and served.
- **A picture at the deck's own place.** `place(rect)` turns a pack rectangle into CSS:
  `<Pic n={33} name="illus-f1-chassis.png" fit="contain" style={place(rect)} />`. It takes
  `{ scale, dx, dy }` to refit a full-bleed slide inside the safe area.
- **Headline and breadcrumb.** `ctx.slide.title` and `ctx.slide.crumb` (from `deck.ts`) ARE the
  pack's headline and breadcrumb, character for character (`check_deck.mjs` proves it). Use
  `slide.title`; do not retype it. The chrome draws the breadcrumb.
- **Copy the pack's values into `scenes/sNN/data.ts`.** Do not `import` the pack's JSON (it is
  outside `src`, and it is confidential working material that must not become part of the
  site's bundle by accident); copy the strings, numbers and rectangles you use into a `data.ts`
  in your folder, each with the block id or field it came from in a comment. Copy and paste:
  never retype.
- **`kind` decides what you may do with a picture.** `photo-of-real-people`,
  `real-screenshot-or-document` and `chart-as-picture` are shown as they are (frame them, move
  them, light them; never redraw, stretch, recolour or regenerate them). `illustration` is the
  deck's own art: you may animate it, split it, or rebuild it as vector or three.js with the
  picture as your reference. `logo` and `decoration`: rebuild in CSS or use the brand's files.
- **Do not enlarge small pictures.** `pxPerStagePxAt1920` under 1 means the deck already shows
  the picture larger than its pixels. Portraits of colleagues are 97 to 189 px: show them at the
  deck's size or smaller (`placements[].rect[2] * 100` is that width in `--u`), and give
  `<Person maxPx={…}>` the photograph's own width.
- **`visiblePart` is a crop. `uncoveredPart` is not.** `visiblePart` appears only where the deck
  really crops a picture (`shownAs` `rect-cropped`, `rounded-cropped`, or a circle cut from a
  larger picture): reproduce it with `Pic fit="cover"` and `focus`. `uncoveredPart` appears on
  `shownAs: "partly-covered"`: other shapes of the slide lie over the picture, and this is the
  block of it they leave free. **Show such a picture whole**, at its `rect`, and lay your own
  cards over it as the deck does (unless `notes.md` says only a part is meant to be seen).
  Never squeeze a picture into a box of other proportions.
- **Text read by eye.** Blocks with `"source": "read-by-eye"` (the tilted cards and clippings on
  16 to 27, the curved words on 11, the stamp on 35, everything on 51 to 54) were outlines or
  pixels in the PDF: the words were read at high zoom, the positions are approximate. Check them
  against `public/keynote/pages/NN.jpg` once more before you use them.
- **Privacy, slides 36, 37, 38.** The bank statements are real customer documents. Use ONLY
  `doc-bank-statement-…-masked.png` from `public/keynote/src/`. Never extract a picture from
  `deck.pdf` yourself: the PDF holds them unmasked.
- **Never shown:** blocks with role `internal-note` (the authors' review notes) and `hidden`;
  the deck's placeholder text (`notes.md` lists it under "Unfinished"). Where the deck left a
  gap (a missing chart on 30, a missing photo and quote on 50, the whole of 61), build the
  slide so that it is complete without the gap, and say so in your report.
- **Indian scripts** (23, 41, 50): take the strings from `data.json` (normalised Unicode), set
  them with `font-family: var(--kn-font-indic)`, and do not split them into letters.
- **You never change the pack.** Do not edit `pack/`, do not edit
  `tools/pack_curation_*.py`, do not run `make_pack.py` (three files cover 65 slides, and a run
  rewrites `pack/index.json` and deletes and rebuilds `public/keynote/src/NN/` under other
  builders' feet). If the pack is wrong (a word, a role, a rectangle, a missing picture), write
  it down in `scenes/sNN/PACK-FIXES.md` (what is wrong, where, what it should be), work from the
  page picture for that one thing, and say so in your report. One agent applies the fixes
  between rounds.
- **Nothing from the pack or the deck is ever uploaded or sent to any outside service.**

## The stage

The stage is 16:9, letterboxed and centred. **One unit, `--u`, is 1/100 of the stage's width**,
so the stage is **100u wide and 56.25u high**, measured from its top left corner. Size and place
everything with `calc(var(--u) * n)`: never px, rem, vw or %. Then a scene is identical in
proportion at 1366 x 768, 1920 x 1080 and 3840 x 2160. (`--u` is 13.66 px, 19.2 px and 38.4 px
there.) Keep text that must be read at 0.85u or more.

Your `Scene` component is drawn inside `.kn-scene`, which covers the stage exactly
(`position: absolute; inset: 0`). Position your own elements absolutely inside it.

**The safe area.** The chrome owns the edges. Keep your content inside:

```
            4.2u                                                            95.8u
   0 ┌──────────────────────────────────────────────────────────────────────────┐
 1.0u│ (A) B C D E F │ BREADCRUMB / OF THE SLIDE                         [logo] │   the chrome's top bar, 1u to 5.6u
 6.4u│ ┌──────────────────────────────────────────────────────────────────────┐ │
     │ │ Headline (kit <Headline>: left 4.2u, top 6.9u, up to 84u wide)       │ │
     │ │                                                                      │ │
     │ │                        YOUR SCENE                                    │ │
     │ │                                                                      │ │
50.6u│ └───────────────────────────────────────────────────┬──────────────────┤ │
     │                                                     │ 05/65 ▦ ← Next → │ │   keep x > 80u, y > 50.6u clear
56.25└──────────────────────────────────────────────────────────────────────────┘
```

CSS variables for it: `--kn-x0` (4.2u), `--kn-x1` (95.8u), `--kn-y0` (6.4u), `--kn-y1` (50.6u).
A BACKGROUND (a picture, a ground, a wash) may bleed to the stage's edges and under the chrome;
words, numbers, cards and faces stay inside. See "Rulings".

**The chrome is not yours to draw.** The section rail, the slide's breadcrumb (from
`deck.ts → crumb`), the logo at the top right (4.6u high), Back / Next and the progress line
are drawn by the chrome on every slide. Do not repeat the breadcrumb or the logo in your scene.
Where a breadcrumb begins with the section's own name (section F: "AI – UNDER THE HOOD / OPEN
ARCHITECTURE"; section D: "PIRAMAL.AI / …"), the bar shows only the rest, because the rail
beside it already says the first part. If your slide needs a part of the chrome gone, say so in
the module: `chrome: { logo: false }` (also `rail`, `crumb`, `counter`).

## The contract

`scenes/sNN/index.tsx` default-exports a `SceneModule` (`core/types.ts`):

```tsx
'use client'
import gsap from 'gsap'
import { anim, Headline, type SceneModule } from '../../kit'
import './scene.css'

const scene: SceneModule = {
  beats: ['first', 'second'],          // the rests, in order. At least one.

  Scene: ({ slide }) => (              // static markup: no state, no effects, no timers
    <div className="s17">
      <Headline text={slide.title} flame={['6 in 100']} />
      …
    </div>
  ),

  build(ctx) {                          // ONE paused timeline, one label per beat
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    a.words('.kn-h', 0.1)
    a.rise('.s17-card', 0.6)
    tl.addLabel('first')                // ← the REST of beat 1: add it AFTER that beat's tweens
    a.rise('.s17-more', '>')
    tl.addLabel('second')
    return tl
  },

  // optional:
  three(ctx) { … return dispose },      // scene-owned WebGL; runs before build()
  preload: ['/keynote/src/17/x.jpg'],   // pictures to have decoded before the scene shows
  chrome: { crumb: false },             // parts of the chrome to switch off on this slide
  slides: { 33: […], 34: […] },         // ONLY for a scene that spans several slides (see below)
}
export default scene
```

**A beat's label marks its REST**: the instant its move has finished. `tl.addLabel('name')`
with no position puts the label at the end of everything added so far, which is exactly that.
(If your last tween of the beat is not the longest, give the label a time: `tl.addLabel('first', 3.2)`.)
The director complains in the console if a beat has no label, or the labels are out of order.

### What the director does with it

- Arriving on the slide, it plays from time 0 to the first label **by itself**.
- **Next** (the button, →, PageDown, Space, Enter) plays from the current rest to the next
  label, at the timeline's own speed. After the last label it goes to the next slide.
- **Back** (the button, ←, PageUp) goes to the rest before (a quick 0.3 s rewind of your
  timeline), and from the first rest to the LAST rest of the slide before.
- A press during a move finishes that move (Back during a move returns to the rest it left).
- Nothing else ever moves by itself. There are no timers. A presenter may stand on one rest for
  ten minutes.
- Home, End; a number then Enter; G or the grid button for the overview; a click on a section
  in the rail.

**Between two scenes** the one on stage fades away in about a third of a second, and the new
one begins a little before it has gone, so the stage is never left empty. So make the first
tenth of a second of your timeline quiet (the kit's moves start hidden: nothing to do), and do
not open with something that must be seen in full at time 0. **Between a light slide and a dark
one** the two are never blended (peach into navy is a dusty mauve): the old scene goes, then
the backdrop changes in one directed move (the new theme opens from the middle of the stage
behind an edge of clear blue, about 0.6 s) while your first beat begins. You do nothing for it.

So: **put on one beat what the presenter says in one breath.** Most content slides want 2 to 5
beats. The first beat should already put the headline and the picture's frame on screen, and
every rest must be a frame worth standing on: a presenter may stop there and talk.

### Slides that are one scene

The deck flattened some of its own builds into runs of slides: the pit lane of 33 to 35 (car in
pieces, pit crew, green lights), the train of 45 to 49, the town map of 42 and 43. Shown as
separate scenes, the car, the train and the map would fade away and come back at every slide
change. So **a scene may span several consecutive slides**: one folder, one DOM, one timeline;
nothing leaves the stage at the slide change, Next simply plays on.

```tsx
// scenes/s33/index.tsx: the scene lives in the folder of its FIRST slide
import { anim, Headline, slide as slideOf, spanBeats, type SceneModule } from '../../kit'

const SLIDES = { 33: ['alone', 'checks'], 34: ['crew'], 35: ['green', 'approved'] }   // each slide's own beats, in order

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),            // all of them in a row: alone, checks, crew, green, approved
  Scene: () => (
    <div className="s33">
      <Headline className="s33-h s33-h--33" text={slideOf(33).title} flame={[…]} />
      <Headline className="s33-h s33-h--34" text={slideOf(34).title} />      {/* same place: it takes over */}
      <Headline className="s33-h s33-h--35" text={slideOf(35).title} />
      …the pit lane, the car: ONCE…
    </div>
  ),
  build(ctx) {
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    a.words('.s33-h--33', 0.1)
    …
    tl.addLabel('alone')
    …
    tl.addLabel('checks')                          // slide 33's last rest
    a.retitle('.s33-h--33', '.s33-h--34', '>')     // slide 34 begins: its headline takes over, the car stays
    …
    tl.addLabel('crew')
    a.retitle('.s33-h--34', '.s33-h--35', '>')
    …
    return tl
  },
}
export default scene
```

```ts
// scenes/s34/index.tsx and scenes/s35/index.tsx: one line each
export { default } from '../s33'
```

What the director does with a span:

- As the playhead crosses from one slide's beats into the next's, the slide number, the rail,
  the breadcrumb, the counter, the progress line and the URL move on. Back does the reverse.
- Arriving ON slide 34 from elsewhere (a jump, the overview, `?s=34`): the scene is shown at the
  last rest of slide 33 and slide 34's first beat plays by itself. So every slide of a span
  must make sense arriving that way: do not rely on the audience having seen the beats before.
- Hold URLs work per slide: `?s=34` rests at slide 34's first rest, `?s=35&at=approved` at that
  beat. `shoot.mjs beats 34` and `strip 34` show slide 34's own beats.
- Beat names are unique across the whole span. All its slides have the same theme. `ctx.slide`
  and the `slide` prop are the FIRST slide; take the others with `slide(n)` from the kit.
- The CSS prefix is the first slide's (`s33-`), for the whole span.

Which runs are spans is decided by the lead, one builder per span (the pack's `index.json →
groups` and each `notes.md` say which slides belong together). The continuous ones are
**33 to 35** (pit lane), **36 to 39** (banking agent: statements, categories, the model, the score),
**40 and 41** (the collection visit), **42 and 43** (the town map), **45 to 49** (the train),
**51 to 54** (the wheel); **9 and 10** may be one move if their builder takes both.

**A family is not a span.** Slides 16 to 25 share a look (the same clipping cards, the same
layout) but each is its own picture: they stay separate scenes. What a family shares (a card, a
map, a component, its stylesheet) lives in `scenes/_shared/<group-id>/` (the group's id from
`index.json`: `world-of-ai`, `pin-boards`, `outcomes`, `people`), is owned by ONE builder named
by the lead, and is prefixed with the group's id (`.woa-card`). Everyone else imports it and
does not edit it.

### The rules that keep every frame reachable

The director only ever moves the playhead of your timeline. A hold URL puts it anywhere. So:

1. **Starting states with `gsap.set()` inside `build()`, then `.to()` tweens.** Never `.from()`
   (it fights with seeking). The kit's moves (`anim`) do both halves for you.
2. **Animate transforms, opacity (`autoAlpha`), `clipPath`, SVG stroke drawing (`drawSVG`),
   colour (`color`, `backgroundColor`, `fill`, `stroke`: a light turning amber), plain numbers
   (three.js objects, `ctx.backdrop.fx`), text content of a counter.** Not width, height, top,
   left, margin, filter or box-shadow.
3. **No `delayedCall`, timers, React state or CSS transitions for story motion.** If it is not
   on the timeline it cannot be held by a URL and it is wrong after Back. (A CSS `animation`
   for an idle shimmer is fine: `&still=1` stops every CSS animation inside a scene for you.
   `onUpdate` is fine: it runs when the playhead is moved, too.)
4. **Touch only your own elements**: `ctx.$('.s17-x')`, `ctx.$$('.s17-y')`. Never
   `document.querySelector`. `ctx.$` throws when nothing matches, so a typo is found at once.
5. **Measure first, hide second.** `ctx.loc(el)` gives an element's box on the stage in px, as
   laid out now. Call it before any `gsap.set` that moves or hides things.
6. Elements that arrive with `autoAlpha` should have `visibility: hidden` in your CSS as well.
7. Do not tween the scene's root (`ctx.root`) or the layer above it: the director fades those.
8. **Prefix everything global with your scene's id** (`s17-`): every class, every `@keyframes`
   name, every CSS custom property (`--s17-gap`), every `id` inside inline SVG (gradients, clip
   paths, patterns, markers). Every scene's stylesheet stays loaded after its slide was visited,
   and two layers are in the document during a change of slide: an unprefixed `@keyframes float`
   or `id="grad"` changes somebody else's scene. `kn-` belongs to the kit.
9. Everything you create in `build()` and `three()` is undone for you when the scene leaves or
   the window is resized, and then `three()` and `build()` are simply called again. Write them
   so that they can be: no module-level state that survives a rebuild.

### Rulings

Decided once, so that ten builders do not decide ten ways.

- **Full-bleed slides.** A background (the pit lane, a map, a landscape) may run to the stage's
  edges and under the chrome. Everything that is read or looked at (words, numbers, cards,
  faces) is refitted inside the safe area, and nothing of it under Back / Next (x > 80u,
  y > 50.6u). `place(rect, { scale, dy })` shrinks a whole placement about the stage's centre.
- **Colour.** The brand is navy, flame, the clear blue and the peach-to-pale-blue washes. No
  purple, and no green as a brand colour. **The deck's own signal colours are allowed where the
  slide itself shows them and they carry meaning**: amber and green start lights (33 to 35), a
  green or red arrow for up and down (4), the yellow ring (44), "APPROVED". Chart segments the
  deck drew in purple become navy tints (`navy`, `slate`, `grey`). Never a gradient from flame
  to blue: its middle is purple.
- **The deck's slips of the pen** ("Utiliity", "Funiture" on 36, "Humans steps in" on 44, "star
  agents shapes" on 28): **headlines stay exactly as `deck.ts` has them** (they are checked
  against the pack). Inside a slide, set the deck's words as they are and list every slip you
  see in your report: correcting the owner's deck is the owner's call, in one pass, not ours
  slide by slide. Inside a real screenshot or document nothing is ever changed.
- **Type floor.** 0.85u for anything that must be read. A source line or footnote the deck
  prints at 0.75u is set at 0.85u (it is the smallest type in the keynote).
- **Pack values** are copied into `scenes/sNN/data.ts` (see "Your slide's source").
- **`npx tsc --noEmit -p .` is judged by your own folder.** Nine other builders have
  half-written files: errors under `src/keynote/scenes/sNN/` (yours) must be none; errors
  elsewhere are reported, not fixed. (`npx tsc --noEmit -p . 2>&1 | grep scenes/s17/`)
- **A neighbour's noise is reported, not fixed.** If the walk across the slide before and after
  yours fails in THEIR scene, say so in your report and do not touch their folder.
- **Not yours to decide:** whether a click on the stage advances, the agenda's G, the muted or
  bright wordmark, what the deck's unfinished slides (30, 50, 61, 63, 64, 65) finally show.
  Build what `notes.md` says, complete without the gap, and say what you chose.

### `ctx`

| | |
| --- | --- |
| `ctx.slide` | the slide from `deck.ts`: `n`, `id`, `section`, `crumb`, `title`, `theme` (for a span: its first slide) |
| `ctx.root` | your scene's root element |
| `ctx.$(sel)`, `ctx.$$(sel)` | the first match (throws if none) / all matches, inside your scene |
| `ctx.U`, `ctx.W`, `ctx.H` | one `--u` in px; the stage in px (`W = 100 U`) |
| `ctx.loc(el)` | `{ x, y, w, h, cx, cy }` of an element, in stage px from the stage's top left |
| `ctx.timeline()` | a new paused timeline with the keynote's defaults. Build the scene on ONE. |
| `ctx.ease` | `out` (arrivals; the default), `inOut` (travel), `snap` (a landing with a little overshoot), `slam` (a stamp), `glide` (lines drawing, light travelling) |
| `ctx.T` | timing tokens in seconds: `word` 0.7, `wordGap` 0.045, `enter` 0.75, `stagger` 0.08, `draw` 0.9, `count` 1.2, `leave` 0.35, `drift` 1.8 |
| `ctx.backdrop` | `fx` and `mood()`: see below |
| `ctx.bag` | a plain object to pass things from `three()` to `build()` |
| `ctx.reduced` | the visitor asked the system for less motion. The kit's moves already answer it (things fade in where they stand: no travel, no pop, no wipe, no word-by-word). You only guard what you move yourself: your three.js, and `travel` / `yaw` / `pitch` of the backdrop. |
| `ctx.held` | a hold URL with `&dt=` or `&still=1` is showing this scene: do not start idle loops that would change the held frame |
| `ctx.onSeek(fn)` | `fn` is called whenever the director PUTS the playhead somewhere without playing (an arrival, a hold URL, a resize): draw what the timeline does not draw by itself. `createSceneCanvas` already uses it. |

## The backdrop

Behind the stage there is ONE WebGL canvas for the whole deck: a wash of colour (white paper
with peach and pale blue on light slides, the deck's navy on dark ones), a surface of points
that recedes to the horizon, and fine particles through the depth of the room. The director
sets its look for every slide from the slide's theme and section. **A scene does not create or
own it**; it nudges it, in two ways:

```ts
// 1. ON the timeline: ctx.backdrop.fx is a plain object of numbers ADDED to the slide's look.
//    It is your scene's own, starts at zero, and is let go when the scene leaves.
tl.to(ctx.backdrop.fx, { glow: 0.4, focusX: 0.5, duration: 1.2 }, 0.3)   // a light opens on the right
tl.to(ctx.backdrop.fx, { travel: 60, duration: 2.6, ease: 'power3.out' }, 0)  // the camera rushes forward

// 2. For as long as the slide is on screen (not on the timeline; it glides there):
ctx.backdrop.mood({ warm: 0.8 })
```

| Number | What it is |
| --- | --- |
| `dark` | the theme: set by the slide, changed only by the director. Leave it alone. |
| `warm` | 0 the blue side … 1 the peach / flame side |
| `energy` | how alive the particles are, 0 … 1 |
| `glow` | a soft light at the focus point, 0 … 1 |
| `focusX`, `focusY` | where that light sits: −1 the left / top edge … +1 the right / bottom edge |
| `wave` | the field of points at the horizon: 0 away … 1 fully there |
| `travel` | how far the camera has flown forward (30 to 80 is a strong move) |
| `yaw`, `pitch` | the camera turned, in radians (0.1 is plenty) |

Use it to tie the picture to the story (slide 5 walks the light from milestone to milestone).
Keep it calm on content slides: the backdrop must never compete with the slide. On a dark
slide never put the glow behind a logo or behind small text: the wordmark's dark end needs the
deep navy (slide 1 opens its light low, behind the day's line, for that reason).

## Scene-owned three.js

When a slide is better told with real objects, ask for a canvas of your own in the `three()`
hook and return its `dispose`:

```ts
import { createSceneCanvas, THREE, type SceneCanvas } from '../../kit'

three(ctx) {
  const gl = createSceneCanvas(ctx)                 // transparent, covers the stage, under your DOM
  const box = new THREE.Mesh(new THREE.BoxGeometry(6, 6, 1), new THREE.MeshStandardMaterial({ color: '#fff' }))
  box.position.copy(gl.at(20, 30))                  // 20u from the left, 30u from the top
  gl.scene.add(box)
  ctx.bag.box = box
  return gl.dispose                                 // geometries, materials, textures, the context: all freed
},
build(ctx) {
  const box = ctx.bag.box as THREE.Mesh | undefined // undefined if WebGL is not there: have a DOM fallback
  if (box) tl.to(box.rotation, { y: Math.PI, duration: 1.2 }, 0.4)   // plain numbers: seekable
  …
}
```

**The world is the stage.** At z = 0 one world unit is one `--u`, the origin is the stage's
centre, x runs right and y runs UP. `gl.at(u, v, z?)` turns stage units into a world position.
So a mesh at `gl.at(u, v)` sits exactly over a DOM element at `left: u; top: v`, and you can
land a mesh on a DOM slot: `const s = ctx.loc(slotEl); gl.at(s.cx / ctx.U, s.cy / ctx.U)`
(`s02` does this). Bring a mesh toward the camera (z > 0) and it grows: real perspective.

- Options: `{ above: true }` draws over your DOM; `fov` (default 30; smaller is flatter);
  `lights: false` if you bring your own (the default is a soft sky light, a warm key, a cool rim).
- Where there is no WebGL, `createSceneCanvas` throws quietly, your `three()` hook ends there,
  `ctx.bag` stays empty and `build()` must tell the story with the DOM alone, FROM THE FIRST
  REST ON (`s02` shows flat letters in its rows).
- `gl.onFrame((time, dt) => …)` for an idle float. Apply it to a CHILD group, never to what the
  timeline moves; scale it by a number that the timeline tweens to 0 when the story takes over;
  and use `time = 0` when `ctx.held || ctx.reduced`. See `s02/tiles.ts`.
- Letters and words on meshes: draw them to a canvas with the page's own font
  (`getComputedStyle(ctx.root).fontFamily`) and use a `CanvasTexture`, at twice the pixels the
  mesh will cover at 3840 wide (`s02/tiles.ts`). Words that must be read exactly, or that must
  stay sharp at any size, stay in the DOM.
- An object that turns over shows its back: put the picture on both faces, or bank it instead
  of flipping it. An object that comes in turning must never be seen edge-on as a sliver.
- Keep it cheap: a few dozen meshes, no post-processing, no shadow maps. It renders every
  frame while the page is visible.
- **Never a second full-screen backdrop.** Tween `ctx.backdrop.fx` instead.

## The kit

```ts
import { anim, Headline, Words, Kicker, Count, BarChart, MultiBarChart, HBarChart, LineChart,
         PhoneFrame, BrowserFrame, LaptopFrame, PaperStack, Card, Clipping, Chip, Pill, Person,
         Pic, pic, gen, place, Logo, T, AGENDA, SECTIONS, slide, spanBeats } from '../../kit'
```

### The moves: `const a = anim(ctx, tl)`

Every move SETS the hidden state now and adds the tween that undoes it at `at` (a time, a
label, or `'<'`, `'>'`, `'>-0.2'`; left out, it follows what was added last). Targets: a
selector inside your scene, an element, or a list of elements. A move given nothing to move
does nothing and says nothing.

| Move | What it does |
| --- | --- |
| `a.words(target, at?, { stagger, duration })` | words rise through their masks, one by one (a `<Headline>`, or anything holding `<Words>`) |
| `a.retitle(from, to, at?)` | one headline hands over to the next at the same place (a scene that spans slides) |
| `a.rise(target, at?, { y, x, scale, stagger })` | fades in while rising `y` units (default 1.6u): cards, lines of text, pictures |
| `a.pop(target, at?, { from })` | pops in from small with a little overshoot: dots, badges, chips |
| `a.fade(target, at?)` | fades in |
| `a.draw(target, at?, { stagger })` | draws SVG strokes from nothing |
| `a.rule(target, at?, { from })` | a thin div grows from `'left'` (default), `'right'`, `'top'`, `'bottom'`, `'center'` |
| `a.wipe(target, at?, { from })` | reveals through a straight edge: pictures, screenshots, the logo |
| `a.count(target, at?)` | counts a `<Count>` up |
| `a.leave(target, at?, { y })` | lifts and fades something that has done its work (Back brings it back) |
| `a.bars(target, at?)` | a `<BarChart>`, `<MultiBarChart>` or `<HBarChart>`: axis, bars from the baseline, figures, labels |
| `a.line(target, at?)` | a `<LineChart>`: axis and rules, lines from the left, dots and figures as the line reaches them, the band |

With `ctx.reduced` the same moves fade things in where they stand (see `ctx`).

### Text

```tsx
<Headline text={slide.title} flame={['6 in 100']} />        // the slide's headline; flame words kept
<Headline text="…" size="m" className="s17-sub" />           // 'm' a sub-headline, 'l' default, 'xl' a title
<p className="s17-line"><Words text="…" flame={['Merger']} azure={['People']} bold={['no impact on profit']} /></p>
<Kicker tone="flame">What the six do differently</Kicker>    // small spaced caps (muted | flame | azure | navy); `block` puts it on a line of its own
<Count className="s17-big" to={63} suffix="%" />             // a number that counts; a.count('.s17-big', 0.8)
<Count to={111440} group="in" prefix="₹" />                  // 1,11,440 (Indian grouping); decimals, from
```

**The headline is `slide.title`, word for word, and the deck's flame-coloured words stay
flame-coloured**: name them in `flame` (exact substrings; the pack's `text.json` gives each
span's colour). A full stop after a flame phrase stays navy by itself. `azure` sets a phrase in
the clear blue, `bold` in Bold inside a lighter sentence; each is matched by its place in the
sentence, so a word may be flame in one place and part of a blue phrase in another.

### Charts that draw from data

Give them the slide's numbers (the pack's `data.json`), never a picture of a chart.

```tsx
<BarChart className="s57-tokens" width={38} height={20}
  data={[{ label: 'FY25-Q3', value: 23 }, { label: 'FY25-Q4', value: 32 }, { label: 'FY27-Q2', value: 476, color: 'navy' }]} />

<MultiBarChart className="s04-book" width={22} height={30} fill={0.5}        // stacked columns
  data={[{ label: 'Mar-22', total: '22,010', parts: [{ value: 14527, color: 'navy', text: '66%' }, { value: 5723, color: 'slate', text: '26%' }, … ] }, … ]} />
<MultiBarChart mode="group" … data={[{ label: 'FY25', parts: [{ value: 12, color: 'grey', text: '12' }, { value: 31, color: 'flame', text: '31' }] }, … ]} />

<HBarChart className="s49-days" width={34} height={16} labelWidth={9}       // horizontal, one or two bars a row
  data={[{ label: 'Design', parts: [{ value: 2.5, color: 'grey', text: '2.5 days' }, { value: 1, color: 'flame', text: '1 day' }] }, … ]} />

<LineChart className="s57-cost" width={38} height={20} labels={['FY25-Q3', 'FY25-Q4', …]}
  series={[{ color: 'azure', values: [1.19, 1.16, 1.48, 0.84], texts: ['$1.19', '$1.16', '$1.48', '$0.84'] }]} />

<LineChart className="s06-opex" width={34} height={17} min={3} max={7}       // many points
  labels={quarters} labelEvery={2}                                           // thin the labels …
  groups={[{ from: 1, to: 4, text: 'FY24' }, … ]}                            // … or a second level under them
  ticks={[3, 4, 5, 6, 7]} tickText={(v) => `${v}%`}                          // rules across, figures at the left
  bands={[{ from: 3, to: 3.25, hatch: true, label: 'Long range goal' }]}     // a band between two values
  series={[{ color: 'flame', values: opex, texts: opex.map((v, i) => (i === 0 || i === opex.length - 1 ? `${v}%` : null)) }]} />
```

- `color`: `flame`, `azure`, `navy`, `sky`, `peach`, `ice`, `slate`, `grey` or any CSS colour.
- A line's figures keep off the line by themselves (over a peak, under a valley, beside a point
  in the middle of a fall or a climb); `place: 'above' | 'below'` on a series overrides. With
  more than about eight points print only the figures that matter (`null` for the rest).
- A stacked column is as tall as its parts' sum: to draw two columns of different totals to
  scale, give the parts their real values, not their shares.
- Every chart takes `children`: your own SVG over the plot (an arrow, a callout); inside the SVG
  one unit is 0.1u.
- **What the kit has no chart for is drawn in your folder** as SVG with `className="kn-chart"`
  and the classes `kn-chart-axis`, `kn-line`, `kn-bar`, `kn-bar-val`, `kn-bar-label`, so that it
  looks like these and `a.bars` / `a.line` / `a.draw` move it: the many unlabelled peer curves
  of slide 6's first chart (take the paths from `pack/06/vector/chart-aum-race.svg`), slide 19's
  pair, a doughnut. The deck's eleven charts: 4 (stacked: `MultiBarChart`; two bars:
  `BarChart`), 6 (curves: by hand; two long lines: `LineChart` with ticks and a band), 7 (two
  series: `MultiBarChart mode="group"`), 19 (by hand), 49 (`HBarChart`), 57 (`BarChart`,
  `LineChart`).

### Real screenshots and real photographs

**A real photograph or a real screenshot is shown as it is: never redrawn, never stretched,
never passed through a generator.** The kit holds them by `object-fit`.

```tsx
<Pic n={12} name="photo-middle-india.jpg" ratio="3 / 4" width={17} radius={1.6} focus="50% 30%" />
<Pic n={33} name="illus-f1-chassis.png" fit="contain" style={place([0.31, 0.42, 0.37, 0.27])} />      // at its pack rect
<Pic n={39} name="chart-bad-rate-across-deciles.png" fit="contain" width={40} />                       // a chart that IS a picture: as it is
<Person src={pic(33, 'photo-sushil-pange.jpg')} name="Sushil Pange" role="Credit Manager, Nashik, Maharashtra" size={4.4} ring="azure" plate maxPx={110} />
<PhoneFrame   className="s51-phone" src={pic(51, 'screen-wheel-at-rest.jpg')} ratio="9 / 19.5" fit="cover" position="50% 0%" width={15} tilt="left" />
<BrowserFrame className="s51-win"   src={pic(51, 'screen-wheel-at-rest.jpg')} ratio="16 / 9" width={46} address="byot" tilt="right" />
<LaptopFrame  className="s51-top"   src={pic(51, 'screen-wheel-at-rest.jpg')} ratio="16 / 9" width={40} />
<PaperStack   className="s36-stack" width={16} ratio="210 / 297" sheets={5} label="54 pages">
  <Pic n={36} name="doc-bank-statement-axis-masked.png" fit="contain" />
</PaperStack>
```

(The file names above exist; the ratios and sizes are for illustration. Take every picture's
own `px` from `images.json` and pass its true ratio.)

- `pic(n, name)` is `/keynote/src/NN/name`; `gen(n, name)` is `/keynote/gen/NN/name`.
- `place(rect, { scale?, dx?, dy?, height? })`: a pack rectangle (`[x, y, w, h]` in fractions of
  the slide) as `position / left / top / width / height` in `--u`.
- `Pic`: `ratio` is the BOX's width / height. `fit="cover"` (default) fills the box and crops
  evenly, **only as the deck itself crops**; `fit="contain"` shows the whole picture. `focus`
  chooses what a crop keeps.
- `Person`: a real photograph in a circle; `plate` puts it on a white plate (over a photograph
  or a busy ground); `maxPx` is the photograph's own width in pixels: the circle never grows
  beyond it (on a 3840 screen it stops growing rather than the face going soft); `focus` moves
  the crop; `ring`: `azure`, `flame`, `navy`, `plain`.
- Frames: pass the screenshot's OWN ratio as `ratio`, then nothing is cropped and there are no
  bands. `tilt` is a gentle 3D turn (`left`, `right`, `none`). **Animate the outer element**
  (`.kn-phone`, `.kn-browser`, `.kn-laptop`): the tilt is on an inner one, so they do not fight.
  A frame takes `children`: things drawn over the screenshot (a highlight box, a cursor).
- `PaperStack`: each sheet is a `.kn-sheet`, back to front: `a.rise('.s36-stack .kn-sheet', 0.4, { stagger: 0.05 })`.
- List your pictures in `preload: [pic(12, 'photo-middle-india.jpg'), …]`.
- **The deck's yellow boxes ("BIU / IR: …", "Marketing: …") are review notes of its authors.
  They never appear in `/keynote`.** They are already out of `public/keynote/pages/` (the seven
  pages were drawn again without them; `text.json` still lists their words as `internal-note`).
  Placeholder text of the deck ("<< Chart on … >>", "Add photo", "Martin's photo goes here") is
  still on the page pictures of 30, 50 and 63: it must not be in your scene either.

### Generated pictures

A scene may use a generated picture where the deck has none and one would help (a texture, an
object, a ground). The rules are the project's, word for word:

- **This deck is confidential and contains real people's photographs and (masked) customer
  documents. NOTHING from it (no image, no screenshot, no text beyond generic words) may be
  uploaded or sent to any outside service.**
- **Image generation, where allowed, is from text prompts only that describe objects, materials,
  light and colour, with no company or person names; never pass a deck image as a reference.**
- **Real photographs and real screenshots are used as they are: never redrawn, never stretched
  (keep aspect ratio; crop only as the deck itself crops), never passed through a generator,
  never "enhanced".**

Only generate if your brief from the lead says you may. A generated picture never stands in for
a real person, a real product screen or a real document, and never carries a logo or readable
words. Files go in **`public/keynote/gen/NN/`** (your slide's own folder: nobody else writes
there), named for what they show (`kite-paper.png`), used as `gen(NN, 'kite-paper.png')`. Write
the exact prompt of each in `scenes/sNN/GEN.md`, and list the files in your report.

### Cards, clippings, chips

```tsx
<Card className="s05-card">…</Card>                    // white, rounded, soft shadow; tone="peach" | "ice" | "navy"
<Clipping className="s17-clip" date="AUG 2026" tape="flame" source="Tech Times, on McKinsey's State of AI 2026" tilt={-1.5} width={27}>
  Record AI spending cannot move the earnings needle for 94% of enterprises
</Clipping>                                             // the deck's "in the news" slip with its tape (animate the outer element)
<Chip tone="azure" icon={<svg … />}>Sep-25</Chip>       // filled: plain | flame | azure | navy
<Pill tone="flame">Fine-tune freely</Pill>              // outlined, as the deck's short lists
<Logo height={9} />                                     // only where the logo is part of your picture
```

A tone the kit does not have (an amber light, a filled red strip) is your own class in your own
stylesheet, with the colour the slide shows (see "Rulings").

### Colour and type

The brand: deep navy, a flame orange-red, a clear blue, soft peach-to-pale-blue washes.
**No purple (do not blend flame into blue in a gradient: the middle is purple), no green as a
brand colour, no emoji, no sound, no other company's logo beyond what the slide itself shows.**

| Variable | |
| --- | --- |
| `--kn-font` | Calibri: 300 Light, 400 Regular, 700 Bold, and italics. The only family (`--kn-serif` is for a clipping's headline). It is the brand's `--font-brand` (`src/brand/font.ts`): do not add an `@font-face` of your own. 500 draws Regular; 600, 800 and 900 draw Bold. |
| `--kn-font-indic` | The same, followed by the machine's faces for Devanagari, Bengali, Tamil and the other Indian scripts (slides 23, 41, 50). |
| `--kn-fg`, `--kn-fg-soft`, `--kn-hair` | text, quiet text and hairlines **for the slide's theme** (navy on light, white on dark). Use these and a scene works on both. |
| `--kn-navy` `#071a50`, `--kn-ink` `#0d1f57`, `--kn-body`, `--kn-muted`, `--kn-line` | |
| `--kn-flame` `#f16443`, `--kn-flame-deep` `#eb542c` (large flame text on white), `--kn-flame-ink` `#d9481f` (small flame text on white) | |
| `--kn-azure` `#4384d4`, `--kn-azure-ink` `#2d6ad1`, `--kn-sky` `#65a9f5` | |
| `--kn-peach`, `--kn-peach-line`, `--kn-ice`, `--kn-ice-line` | tinted panels and their borders |
| `--kn-shadow` | the card's shadow |

Type sizes that hold together across the deck: headline 3.05u (the kit's); card titles and key
sentences 2 to 2.4u bold; body 1.3 to 1.6u; labels and captions 0.9 to 1.1u; kickers 0.86u
spaced caps; a hero number 5 to 9u; nothing under 0.85u. **Use the weights**: Bold for
headlines and figures, Regular for body, and **Light (300) for large quiet words** beside
something heavy (the agenda's names at 2.9u, a sub-line, a big caption). Light under about 1.8u
is too thin to read from the back of a room.

The deck itself is set in Aptos, which is wider: a `sizeU` from `text.json` is the deck's size,
and the same words in Calibri want about 10% more.

Ligatures are off for the whole keynote ("ti", "tt", "ft" are not joined, as in PowerPoint).
Text you draw to a canvas yourself joins them again: see `unjoin()` in `s02/tiles.ts`.

Characters: Latin, Latin Extended and the rupee sign are in the font on every machine. An arrow
typed as a character (U+2192), Greek and maths signs come from real Calibri only and fall to a
system face where the stand-in Carlito is showing: draw arrows as SVG instead. If a canvas or a
measurement needs the face loaded, `await brandFontsReady()` from `@/brand/font` (the director
already waits for it before it builds a scene).

## A worked example

Slide 22 in outline, to show the shape of a scene: a headline with its flame word, two hero
numbers that count, a clipping, three beats. It runs as it stands. **It is an illustration, not
slide 22's content**: the real slide has two clippings, two captions, a pylon and a socket
(`pack/22/`); its builder takes every word from the pack.

`scenes/s22/index.tsx`

```tsx
'use client'

import { anim, Card, Clipping, Count, Headline, type SceneModule } from '../../kit'
import './scene.css'

const scene: SceneModule = {
  beats: ['power', 'money', 'news'],

  Scene: ({ slide }) => (
    <div className="s22">
      <Headline text={slide.title} flame={['electricity']} />

      <div className="s22-fact s22-fact--power">
        <b className="s22-num"><Count to={945} suffix=" TWh" /></b>
        <p>what the world's data centres will draw by 2030</p>
      </div>

      <Card className="s22-fact s22-fact--money">
        <b className="s22-num s22-num--navy"><Count to={600} prefix="$" suffix=" bn+" /></b>
        <p>going into data centres this year</p>
      </Card>

      <Clipping className="s22-clip" date="IEA" tape="navy" source="IEA, Energy and AI" tilt={-2} width={24}>
        One in five planned data-centre projects risks delay because the grid cannot connect them in time
      </Clipping>
    </div>
  ),

  build(ctx) {
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx

    // beat 1: the headline, then the first number
    a.words('.kn-h', 0.1)
    a.rise('.s22-fact--power', 0.7)
    a.count('.s22-fact--power .kn-count-n', 0.8)
    tl.to(fx, { glow: 0.35, focusX: -0.5, focusY: 0, duration: 1.4 }, 0.6)
    tl.addLabel('power')

    // beat 2: the money; the light moves across with it
    a.rise('.s22-fact--money', '>')
    a.count('.s22-fact--money .kn-count-n', '<0.1')
    tl.to(fx, { focusX: 0.1, warm: -0.2, duration: 1.2, ease: ctx.ease.inOut }, '<')
    tl.addLabel('money')

    // beat 3: the clipping drops in
    a.rise('.s22-clip', '>', { y: -2.4, duration: 0.9 })
    tl.addLabel('news')
    return tl
  },
}

export default scene
```

`scenes/s22/scene.css`

```css
.s22 { position: absolute; inset: 0; }
.s22-fact { position: absolute; top: calc(var(--u) * 17); width: calc(var(--u) * 30); visibility: hidden; }
.s22-fact--power { left: var(--kn-x0); }
.s22-fact--money { left: calc(var(--u) * 38); padding: calc(var(--u) * 1.6); }
.s22-fact p { margin: calc(var(--u) * 0.6) 0 0; font-size: calc(var(--u) * 1.45); color: var(--kn-body); }
.s22-num { display: block; font-size: calc(var(--u) * 6.4); line-height: 1; color: var(--kn-flame-deep); }
.s22-num--navy { color: var(--kn-ink); font-size: calc(var(--u) * 4.6); }
.s22-clip { position: absolute; left: calc(var(--u) * 70); top: calc(var(--u) * 20); visibility: hidden; }
```

That is the whole of it: markup in final layout, hidden states and tweens through `anim`, a
label after each beat. What makes it good is the rest: the slide's own picture brought to life,
built from `public/keynote/src/22/`.

## Checking a scene

The dev server runs on port 5183 (hot reload). **Never stop it, never run `next build` or
`next dev` in the project.** `npx tsc --noEmit -p .` is fine (judge it by your own folder).

### Hold URLs

```
/keynote                          slide 1; its first beat plays by itself
/keynote?s=17                     slide 17, resting at its first rest
/keynote?s=17&at=money            slide 17, resting at the rest "money"
/keynote?s=17&at=money&dt=0.6     0.6 s into the move that LEADS to "money" (held: nothing moves)
/keynote?s=17&at=money&dt=-0.3    0.3 s before "money" is reached
…&chrome=0                        the chrome hidden, nothing moved
…&still=1                         nothing idles: the backdrop's clock, your idle loops (ctx.held), the
                                  chrome's transitions. Two shots of one frame are identical.
…&warm=0                          the slides before and after are not fetched ahead
```

From a held frame Next carries on to the rest and Back goes to the rest before. `.kn-root`
carries `data-slide="17"`, `data-beat="money"`, `data-resting="1|0"`, `data-ready="1"`,
`data-section`, `data-theme`: tools wait on `data-ready` and `data-resting`. In the console,
`__kn.info()` gives the slide's beats, the time of each rest and `start` (where its first move
begins), `__kn.seek('money', 0.6)` holds a frame without a reload.

### The checker

```
cd exports/_rig/keynote-src/tools
node shoot.mjs beats 17                   every rest of slide 17: one PNG each, and a sheet of all
node shoot.mjs strip 17                   the move that leads to EVERY beat, as strips of frames
node shoot.mjs strip 17 money --step 0.15 one move, finer
node shoot.mjs frame 17 money 0.4         one frame
node shoot.mjs walk 16 18                 real key presses: Next from 16 until 18 rests, then Back to 16
node press.mjs 16                         a press in REAL TIME: slide 16's last rest, Next, a sheet of what the
                                          room sees while slide 17 comes in (press.mjs 17 --back; --at <beat>)
…  --size 1366x768                        the small screen (default 1920x1080)
…  --gpu                                  WebGL on this Mac's own GPU: ten times quicker, the same pictures
…  --chrome 0     --out <dir>
```

**Where it works.** The tools need `playwright-core` in a folder OUTSIDE the project, and
write their pictures outside it too. Three environment variables say where:

```
KN_SCRATCH   a scratch folder (default: the one this deck was first built in, if it still exists;
             otherwise ~/.cache/keynote-check)
KN_PW        the folder with playwright-core (default: $KN_SCRATCH/_pw)
KN_OUT       where pictures go (default: $KN_SCRATCH/shots). Give each builder a folder of their own:
             export KN_OUT=<your scratch folder>/shots
```

One-time set-up on a new machine or in a new session:
`export KN_SCRATCH=~/.cache/keynote-check && mkdir -p $KN_SCRATCH/_pw && cd $KN_SCRATCH/_pw && npm init -y && npm i playwright-core`
(never in the project; no `node_modules` and no `.ts` files anywhere under `exports/`).

`shoot.mjs` prints every rest with its time, and prints the page's console: **a finished scene
prints `console: clean`**. Without `--gpu` it runs software WebGL: the frames are right, the
speed is not. Either way do not judge timing or smoothness from held frames; `press.mjs` shows
real time.

### The whole deck

```
node exports/_rig/keynote-src/tools/walk_all.mjs --gpu                  all 65 slides with real keys, forward and back
node exports/_rig/keynote-src/tools/walk_all.mjs --gpu --from 16 --to 18   a stretch (writes to its own folder)
/opt/anaconda3/bin/python3 exports/_rig/keynote-src/tools/walk_sheet.py [<folder>]   contact sheets of what it saw
node exports/_rig/keynote-src/tools/check_deck.mjs                      deck.ts against the pack
```

`walk_all.mjs` checks the data attributes at every rest, that every picture loaded, that Back
retraces Next, the console and the network, and reads the JS heap on the way. Run a stretch
around your slide when you have finished it: it must end with "the walk is clean".

Read the strips. Look for: anything that pops instead of arriving; two things overlapping on
the way; text clipped by its mask; a stroke showing as a dot before it draws; something still
visible that belongs to an earlier beat; an object seen edge-on or from its blank back;
anything that looks cheap. Read the rests: is each one a frame a presenter can stand on?

### Working beside nine other builders

- Your folder is `scenes/sNN/` (and `public/keynote/gen/NN/`). Nothing else is yours.
- The checker opens pages with `&warm=0`, so the slides next to yours are not in its page: a
  neighbour saving their scene does not reload it (tried: saving the slide before and the slide
  after during a strip changed nothing). A save of YOUR scene, or of a shared file, reloads the
  page; `shoot.mjs` then opens the frame again and carries on.
- Your own browser tab on `/keynote?s=NN` DOES fetch the neighbours ahead: it may reload when
  they save. Add `&warm=0` to your tab's URL to stop that.
- `shoot.mjs walk` and `walk_all.mjs --from --to` cross into the neighbours' scenes. If they
  fail there, report it; do not fix it.
- Everything global is prefixed (rule 8). Shared things of a family live in
  `scenes/_shared/<group-id>/` and have one owner.
- The pack is read-only (`PACK-FIXES.md`). `deck.ts`, the kit, the chrome, the director: read-only.
  If the kit lacks something, build it in your folder and say so in your report.

### Things that go wrong

- **"GSAP target not found"** in the console: you passed an empty list to `tl.to` yourself.
  Guard it (`if (els.length)`), or use `anim`, which does.
- **A dot before a line draws**: a stroke of no length with a round cap is a dot. `a.draw`
  hides undrawn strokes for you; if you write `drawSVG` yourself, set `autoAlpha: 0` too and
  bring it to 1 as the draw begins (`s05`).
- **SVG things scaling from the wrong corner**: give GSAP the origin
  (`gsap.set(el, { transformOrigin: '50% 100%' })`); do not also set `transform-box` in CSS.
- **A frame differs between two visits**: something is not on the timeline (a CSS transition,
  an `onFrame` that moves what the timeline moves, an idle loop that ignores `ctx.held`).
- **Positions are off after a resize**: you measured in module scope or cached a number.
  Measure inside `build()`; it is called again after every resize.
- **Your canvas paints over a DOM band, or the other way round**: `createSceneCanvas` is under
  your DOM unless `{ above: true }`.
- In development React mounts a scene twice (strict mode): `three()` and `build()` run, are
  undone, and run again. That is expected, and it is why rule 9 matters.
- Saving a scene file reloads the page: `/keynote` comes back on the same slide (the URL
  follows the slide), at its first rest.
- A scene that throws while rendering or building is replaced by the deck's page of its slide,
  with the error in the console. If you see the page where your scene should be, look there.

## Before you say it is done

- [ ] No TypeScript error under your folder. `node shoot.mjs beats NN` and `strip NN` print `console: clean`.
- [ ] Every rest read as a screenshot at 1920 x 1080 and at 1366 x 768; every move read as a strip.
- [ ] `node press.mjs NN-1` (the change into your slide) and `node press.mjs NN` (out of it) read: nothing pops, the stage is never empty.
- [ ] `node walk_all.mjs --gpu --from NN-1 --to NN+1` ends with "the walk is clean" (or fails only in a neighbour's scene, reported).
- [ ] The headline is `slide.title`, exact; the deck's flame words are flame; every word and
      number on the slide comes from the pack (`pack/NN/text.json` / `data.json`), copied into `data.ts`, not retyped.
- [ ] You read `pack/NN/notes.md` and nothing it lists as real was redrawn, and nothing it lists
      as a note, a hidden block or a placeholder is on screen.
- [ ] Nothing of the chrome is repeated; nothing that is read reaches outside the safe area or under Back / Next.
- [ ] Real photographs and screenshots are the files from `public/keynote/src/NN/`, undistorted, not enlarged.
- [ ] No yellow review note, no placeholder text of the deck, no purple, no emoji, no sound.
- [ ] Every class, `@keyframes`, custom property and SVG id is prefixed with your scene's id.
- [ ] Back from every rest lands on a clean finished frame, and Next from there plays it again.
- [ ] Only files inside `scenes/sNN/` (and `public/keynote/gen/NN/`) were changed. Pack corrections are in `PACK-FIXES.md`, the deck's slips and your own choices are in your report.
