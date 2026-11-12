# Building a product moment

Everyday AI is one silent film, in this order:

| # | Scene | What it is | Files |
| --- | --- | --- | --- |
| 1 | `intro` | **What Everyday AI is.** The first screen, and the one that waits between visitors: the title, the one sentence, the three pillars, the start control. No Priya yet. | `scenes/Intro.*` |
| 2 | `priya` | **Meet Priya.** She comes in to explain it through her Tuesday. Her photo irises down into the avatar that carries her words. | `scenes/Priya.*` |
| 3 | `smarthelp` `byot` `byoa` `prastuti` | **Her Tuesday:** four product moments (`product.track === 'day'`). | `moments/*` |
| 4 | `engineering` | **The chapter card:** the people who build the apps she works in. Her day gathers into one card; the engineering panel arrives under it. | `scenes/Engineering.*` |
| 5 | `mind` | **Piramal Mind,** the engineering team's own product moment (`product.track === 'engineering'`). Not a time in her day; Priya's lines still narrate it from her side. | `moments/mind.*` |
| 6 | `finale` | **The closing:** "That is Everyday AI", and the five names once more, each replayable. | `scenes/Finale.*` |

The order is built in `store.ts` (`SCENES`) from `PRODUCTS` and their `track`. There is no
music, no narration and no sound control anywhere: a presenter talks over it.

Every product moment plays the same five steps, **before → name → demo → result → stat**, and
the shared frame already does everything the five share. You build only what is unique to your
product. `byot.tsx` + `byot.css` are the finished reference: read them before you start.

## The files

| Moment | Files | Device |
| --- | --- | --- |
| SmartHelp | `moments/smarthelp.tsx`, `moments/smarthelp.css` | phone |
| BYOT (the reference) | `moments/byot.tsx`, `moments/byot.css` | phone |
| BYOA | `moments/byoa.tsx`, `moments/byoa.css` | phone |
| Prastuti | `moments/prastuti.tsx`, `moments/prastuti.css` | `device: 'laptop'` |
| Piramal Mind | `moments/mind.tsx`, `moments/mind.css` | `device: 'none'` (its own centrepiece) |

A moment's module touches nothing but its own two files. All words and numbers come from
`content.ts`, unchanged. What the five share lives in `core/`, `shell/`, `everyday.css`,
`Moment.tsx`, `parts.tsx` and `types.ts`: change it there, for all five at once.

Every class of a moment is prefixed with its key (`smarthelp-`, `byoa-`, `prastuti-`,
`mind-`). The four scenes that are not product moments have their own prefixes: `op-` (the
opening), `pr-` (Meet Priya), `eng-` (the chapter card), `fin-` (the closing).

## What is already done for you

| Step | The shared frame does | You add |
| --- | --- | --- |
| before | the card: your picture, the word "Before", `product.before.detail` as the line | `Before`: the little picture of the old way |
| name | THE NAME: lands, opens (expansion / Devanagari / underline), closes, promise under it | nothing |
| demo | the name docks top-left with its caption; the device rises to centre stage; the left column (`demoTitle`, `demoLine`); the photo on the right | `Screen`: what is inside the device, with the one control |
| run | sends the ghost fingertip to your control, plays your `run` timeline when it is touched | the demo itself |
| result | `product.after` as the headline (your `highlight` phrase in the accent colour); the device slides aside | optionally `Proof` |
| stat | the huge counting number and its label; the device leaves (into your picture if you ask) | `Stat`: the picture of the number |
| hand-over | clears the stage, files the name into the rail, starts the next scene | nothing |

Also done: Priya's subtitle (her `before` line, which stays on while the name lands for as
long as it takes to read; then `tool`; then `after` from the touch on), the header (the clock of her Tuesday, or the engineering mark), the
rail and its step pips, the backdrop light in your accent, the tap ripple, auto and manual
modes, start again, resizing, the debug URLs. `before.headline` is deliberately not shown:
Priya says the same thing in the subtitle beside it.

## The contract (`types.ts`)

```ts
const mine: MomentModule<MyProduct> = {
  key: 'byoa',
  device: 'phone',                 // 'phone' | 'laptop' | 'none'
  demoTitle: P.demo.agent,         // left column, during the demo
  demoLine: P.demo.builtBy,
  highlight: 'every lead',         // optional: a phrase of product.after to colour
  Before, Screen, Stat,            // required components
  Under, Beside, Proof, OnDevice, Extras,   // optional components
  animate,                         // your motion
}
```

Every component receives `{ product }` (typed) and renders static markup. No state, no
effects, no timers: all change over time happens in `animate()`.

| Component | Where it is drawn | Size |
| --- | --- | --- |
| `Before` | the picture box of the before card | 25u × 20u |
| `Screen` | inside the phone, under its status bar | 14.4u × 28.3u |
| `Screen`, laptop | inside the laptop screen | 29u × 18.8u |
| `Screen`, `device: 'none'` | your own centrepiece: everything right of the copy column | (hx + 15u) × 31.6u |
| `Stat` | the box right of the number | 32 × 20 tile pitches (`--ev-pitch`): about 38u × 24u, 43u × 27u on wide screens |
| `Under` | under `demoTitle` / `demoLine` (hidden on a phone on its side: the story must not depend on it) | 26u wide |
| `Beside` | under the photo; in the photo's place if there is none | 17u wide |
| `Proof` | under the result headline | 35u wide (30u with `device: 'none'`) |
| `OnDevice` | on top of the device, moves with it, not clipped by the screen (BYOT's stamp) | the device's box |
| `Extras` | a free 0 × 0 layer at the stage centre, above everything of the moment, for things that fly between places | position with `x` / `y` from `env.loc()` |

### `animate(env)`

Called once each time the moment is built (and again after a resize). You get five small
timelines, one per step. `t = 0` on each is the instant its step begins:

| Timeline | `t = 0` is | Budget | What belongs here |
| --- | --- | --- | --- |
| `env.before` | the before card starts to arrive (frame landed by 0.6) | 0.85 s | bring your picture to life |
| `env.demo` | the name starts to dock, the device starts to rise (landed by 1.0) | 1.25 s | assemble the screen; the control must be ready at the end |
| `env.run` | **the touch** | 2.8 s | the demo: what pressing the control does |
| `env.result` | the headline starts to rise | 0.95 s | your `Proof` |
| `env.stat` | the stat begins (number counts 0.35 → 1.3; device gone by 0.85) | 1.5 s | draw your picture |

A timeline that runs over its budget is played faster by the director (and warns in the
console), so the moment never exceeds 16 seconds. Shorter is fine.

Return `{ control, deviceLandsOn? }`:

- `control`: your `<TouchControl>` element, `env.$('[data-ev-control]')`. Exactly one per
  moment. The shared frame makes it pulse and touchable only while the film waits on it.
  Do not add your own click handlers anywhere.
- `deviceLandsOn`: an element inside your `Stat` picture that the device should fly into and
  become (BYOT: the phone shrinks into its own tile). Leave it out and the device sinks away.

What `env` gives you: `product`, `accent` (`{ main, ink, soft, haze }`), `U` (one `--u` in
px), `hx` (half the content width in px), `small` (a phone on its side), `ease` (`out`, `inOut`, `snap`, `slam`), `$` / `$$`
(queries scoped to your moment), `loc(el)`, `letters` (where each letter of the big name
stands at centre stage: things can be born from them), `shared` (`device`, `photo`, `name`:
aim at them, never animate them) and `bump(timeline, at, strength?)` (a small knock on the
device when something lands in it).

### The rules that keep every frame reachable

1. **Set starting states with `gsap.set()` in `animate()`**, then add `.to()` tweens.
   Never `.from()`. `.fromTo()` only with `immediateRender: false`.
2. **Transforms, `autoAlpha`, `clipPath`, `drawSVG`, `motionPath`, text content** only.
   No width / height / top / left, no filters, no box-shadow animation.
3. **No callbacks, `delayedCall`, timers, state or CSS transitions for story motion.**
   If it is not on the timeline, it cannot be held by a debug URL, and it will be wrong
   when someone taps Back. (A CSS `animation` for an idle pulse is fine.)
4. **Touch only your own elements** (`env.$`, `env.$$`). Never `document.querySelector`.
5. **`env.loc()` is measured in the demo pose.** When `animate()` is called, the stage is
   laid out as it is during the demo and the run: device in place (and enlarged on a phone
   on its side), photo and `Beside` in place, your `Stat` picture laid out, nothing hidden
   yet. So `loc()` of a field inside the device is exactly where a chip must land. Measure
   first, then `gsap.set()` your hidden states.
6. Anything that travels between places (letters → device, quote → field) lives in
   `Extras`, absolutely positioned at `left: 0; top: 0`, and moves with `x` / `y` from
   `loc()`. Use `motionPath: { path: [over, to], curviness: 1.3 }` for an arc, not a line.
7. A `<Rise>` starts hidden below its mask (the shared frame sets `yPercent: 118` on every
   `.ev-rise`); bring it in with `yPercent: 0`, send it out with `yPercent: -118`.
8. Elements you reveal with `autoAlpha` should have `visibility: hidden` in your CSS, so
   nothing flashes before the first frame.

## Shared pieces

From `./parts`:

- `<TouchControl label="…" className="…">glyph</TouchControl>`: the one control. Size it
  with your class; put your own face inside it (see `.byot-mic-face`) and animate that,
  not the control itself.
- `<Rise>…</Rise>`: a line that rises through a mask.
- `withName(text, product.name)`: bolds the product name inside a sentence.
- `sentences(text)`: each sentence on its own line, no breaks at hyphens.
- `statusClock(time)`: `"10:30 am"` → `"10:30"`.

GSAP: `CustomEase`, `DrawSVGPlugin`, `SplitText`, `MotionPathPlugin` and `Flip` are
registered. Import `gsap` from `'gsap'` and `SplitText` from `'gsap/SplitText'` as
`byot.tsx` does. Anything you create inside `animate()` is reverted for you.

CSS variables (all sizes are `calc(var(--u) * n)`; never px, rem or vw):

| Variable | Meaning |
| --- | --- |
| `--u` | the fluid unit: 16px at 1600 × 900, 19.2px at 1920 × 1080, about 7 to 9.5px on a phone on its side |
| `--fl`, `--dt` | a phone on its side only: one pixel of type floor, and the floor for type inside the enlarged phone (see "A phone on its side") |
| `--hx` | half the content width: content runs from `-hx` to `+hx` around the stage centre (46u on wide screens) |
| `--acc`, `--acc-deep` | your accent: fills and large marks |
| `--acc-ink` | accent text on white (4.5:1) |
| `--acc-text` | small accent text on the tinted haze |
| `--acc-soft`, `--acc-line` | tinted panel and its border |
| `--acc-haze` | the soft light behind the name |
| `--acc-g1`, `--acc-g2`, `--acc-g3` | the wordmark gradient, top to bottom |
| `--ev-navy`, `--ev-ink`, `--ev-body`, `--ev-muted`, `--ev-line` | text and line colours |
| `--ev-flame*`, `--ev-azure*`, `--ev-sky` | the brand colours, when you need one that is not your accent |
| `--ev-pitch` | the tile pitch of the stat picture (the box is 32 × 20 of them) |

Use the accent variables, not hard-coded flame or azure, so your moment takes its colour
from `product.accent`. No purple, no green, no dark panels except navy.

The stage is a point at the centre of the screen (a little above the true centre). Rough
map of the demo step, in units from that point:

```
 -46u                      -19u        -7.7u   0   +7.7u            +29u        +46u
  |  BYOT (docked name)      |           ┌─────────┐                  ┌───────────┐  -15.8u
  |  BUILD YOUR OWN TECH     |           │         │                  │   photo   │
  |  demoTitle               |           │ device  │                  │ 17 × 19.8 │
  |  demoLine                |           │15.4×31.6│                  └───────────┘   +4.4u
  |  <Under>                 |           │         │                   <Beside>
  |                          |           └─────────┘                                  +15.8u
  |  (Priya's subtitle, and the two controls at its right end: +17.8u … +21.6u, then the rail)
```

Without a photo the device stands 9u right of centre. The laptop is 33u × 21.4u, centred
4.6u right of centre; Prastuti gives itself a larger one where there is room (up to 38.5u
on a 16:9 screen: the deck is its hero) and a smaller one on squarer screens (`prastuti.css`).
For the result a phone steps back to 0.94, a laptop only as far as it must to stand clear
of the headline and the photo, and a `device: 'none'` centrepiece shrinks to 0.84 toward the
right edge. A phone on its side is laid out again: see the next section.

## A phone on its side (`@media (max-height: 480px)`, `env.small`)

A phone held sideways gives the page about 640 to 930 px by 300 to 430 px. Height is what is
scarce, so the film is laid out around it. All of it lives behind the one media query (in
`everyday.css`, and in a block at the end of each scene's and moment's own `.css`) and behind
`stage.small` / `env.small`; nothing here changes a larger screen.

- **One bar, no header.** The bottom of the screen is a player's transport bar, 44 px or more:
  the logo, the rail (times, names, step pips; the two caps are their dots, and the opening's
  dot is not a button: Start again does the same), then auto / manual and Start again as two
  round buttons. Every target is 44 × 44 px with 8 px between neighbours. The header clock is
  gone: the rail carries the times, the photo's caption the place.
- **The stage has everything above the bar.** `--u` is worked out from that room, clear of
  `env(safe-area-inset-*)`: 38.9u from the top of the docked name to the foot of Priya's
  line, or 88u across, whichever is smaller. `--z` is 1 (the stage is not scaled).
- **Type has a floor in real pixels.** `max(calc(var(--u) * n), calc(var(--fl) * 11))` for
  anything that is read; `var(--dt)` (7.5 px, 9 px on the glass) for type inside the phone,
  which is enlarged 1.2×; Prastuti's laptop and Piramal Mind's board have their own
  (`--pdt`, `--md-k` / `--md-v`). `--fl` is 1px on every phone the film is laid out for
  (`--u` ≥ 6.9 px: 320 px of height and 640 px of width, clear of the insets); below that it
  shrinks with `--u`, so a still smaller window scales down whole instead of breaking.
- **The devices are larger, and stay large.** The phone is drawn wider (18.4u) and enlarged
  1.2× from the demo to the end of the result (`SMALL_ZOOM` in `core/buildMoment.ts`), filling
  the stage's height; the before picture is drawn 1.2× too. Prastuti's laptop takes the whole
  right of the stage (its app is drawn about 1.5×); her Hindi words stand on the left and
  leave when the headline arrives. Piramal Mind's board keeps its size for the result.
- **What is dropped there** (the story must not need it): `Under`, the small print inside
  the devices (app subtitles, "on BYOA"), Prastuti's photo and its `demoLine`, the code
  editor on Piramal Mind's board (its preview stays, as one line) and the ticket numbers on
  its three links, the word "Priya" over her line.
- **The page is the film.** It never scrolls, bounces, zooms or selects (`touch-action`,
  `overscroll-behavior`, the route's `viewport` export, the gesture guards in
  `Experience.tsx`). Held upright, a phone shows "Turn your device sideways" and the film
  waits (`director.freeze`): turned back, it carries on from the same frame. A resize (the
  browser's bar coming or going) rebuilds the scene and resumes its step.

Check a moment at 780 × 360 first, then 640 × 360 and 740 × 340 (the tightest: every floor is
at full strength there), 667 × 375, 844 × 390 and 932 × 430.

## The shell (`shell/Shell.tsx`, `everyday.css`)

What stays on screen through the whole film. It only reads the store.

- **The header** (not on a phone on its side). Through her Tuesday, a clock and a place
  ("Tuesday, 10:30 am · On a site visit"). In the engineering chapter (the chapter card and Piramal Mind) the clock becomes
  a code mark and the words are the chapter's own: `product.time` and `product.place` of the
  engineering product ("Every day · With the engineering team"). On the opening screen there
  is no clock and no kicker: no Priya yet, and the title is on the stage itself.
- **Priya's subtitle,** with her avatar. Nothing on the opening screen; `PRIYA.said` on
  Meet Priya (the avatar arrives when her photo lands in it); her three lines in a product
  moment; `ENGINEERING.said` on the chapter card; `CLOSING.said` on the closing.
- **The two controls,** one capsule at the right end of the subtitle row: auto / manual
  (the ring counts down to the film's next move) and Start again. Everything left of them
  belongs to her line. On a phone on its side they are two round buttons at the right end of
  the bar, and her line has the whole width.
- **The rail: the film as one line, in two tracks.** A cap for the opening ("Everyday AI"),
  the four stops of her Tuesday with their times, **a break in the line**, Piramal Mind on
  its own stretch under an "Engineering" tag instead of a time, and a cap for the closing
  ("Five names"). Every stop jumps to its scene; on the opening screen a product's stop
  opens a preview instead. The proportions (how wide a cap, the break and the engineering
  stop are) live in one CSS rule, `.ev-rail`; `Shell.tsx` only says where the marker stands,
  in those units (`--a` … `--e`). On squarer screens the two caps shrink to their dots.

`data-track="day|engineering"` on `.ev-root` says which chapter is on stage, next to
`data-scene`, `data-step`, `data-resting`, `data-mode`, `data-accent`, `data-device`,
`data-hold`. Hindi anywhere in the shell takes the class `ev-hi`.

## Holding a frame

Animation frames are throttled in the review browser, so judge motion from held frames.
A dev server is already running on port 5183.

```
/everyday-ai?scene=<intro|priya|smarthelp|byot|byoa|prastuti|engineering|mind|finale>   plays from that scene
/everyday-ai?scene=byot&at=<before|name|demo|result|stat|done>                           HOLDS the end of that step
/everyday-ai?scene=byot&at=demo&dt=1.2                                                   1.2 s into the run
/everyday-ai?scene=byot&at=name&dt=-1.5                                                  1.5 s before the name has finished
```

`at` is a label on the scene's timeline; `dt` moves on from it (or back, if negative):

| Scene | `at` | The frame |
| --- | --- | --- |
| a product moment | `before` `name` `demo` `ran` `result` `stat` `done` | the end of that step (`ran`: the demo has just finished) |
| `intro` | `title` | the title has landed |
| | `say` | the sentence is in, "our own job" underlined |
| | `pillars` | the three pillars are in |
| | `idle` | **the attract frame:** everything, with the start control waiting |
| | `done` | the stage has cleared for Priya |
| `priya` | `in` | **her photo, her name, her role, her line;** `PRIYA.said` in the subtitle |
| | `done` | her photo has irised down into the avatar (`&dt=-0.5` is a frame on the way) |
| `engineering` | `day` | her Tuesday has gathered into its card; the engineering panel is still to come |
| | `in` | **the whole chapter card** |
| | `done` | the card has cleared for Piramal Mind |
| `finale` | `say` | **"That is Everyday AI"** alone on the stage |
| | `names` | it has docked; the five names have landed, the numbers are still counting |
| | `done` | **the last frame of the film** |
| any scene | `start` | time 0 |

While holding, nothing advances by itself; Space / → and ← still step. The one other switch
is `?manual` (start in manual mode: wait for a tap at every step).

Look at every step's end frame and several frames inside your `before`, `demo`, `run` and
`stat` at 1600 × 900, 1024 × 768 and 780 × 360 (and the other phone sizes listed under
"A phone on its side"). Then watch it live once: `?scene=<yours>`.

## Timing (`core/timing.ts`)

One moment, unattended: before 0.85 + rest 0.65 · name 2.85 + 0.25 · demo 1.25 · the control
waits 1.0, the ghost fingertip takes 0.95 · run 2.8 · result 0.95 + rest 0.95 · stat 1.5 +
rest 1.0 · hand-over 0.7 = 15.7 s (measured: 15.7 to 15.8 s; the limit is 16). Every name
gets the same 3.1 s at centre stage, whichever of the three choreographies it has. A moment
fits inside these budgets; it does not change them.

The film is silent, so every line is read. Priya's `before` line is given about 4.5 words a
second (`READ` in `timing.ts`): what the before step does not give it, it takes from the
name step, staying on while the name lands; her `tool` line arrives after it, and always
before the name has finished. This is a cue on the moment's timeline (`SceneHandle.cues`,
read by the director from the playhead), so it holds under a debug URL and when stepping
back. It changes no duration.

The whole film, unattended, from the first tap on the opening to the closing's last frame:

| | seconds |
| --- | --- |
| the opening clears (`INTRO_TIME.out`) | 0.6 |
| Meet Priya (`PRIYA_TIME`: in 1.5, rest 4.4, out 1.1) | 7.0 |
| her Tuesday: four moments | 63.2 |
| the chapter card (`CHAPTER_TIME`: in 1.4, rest 4.0, out 0.45) | 5.9 |
| Piramal Mind | 15.8 |
| the closing (`FINALE_TIME`: say 1.0, rest 1.3, names 3.2) | 5.5 |
| **in all (measured: 97.9 s; the limit is 1 min 55)** | **98** |

Waiting: the opening starts by itself after `INTRO_TIME.attract` (9 s, auto mode); the
closing returns to the opening after `FINALE_TIME.idle` (40 s); a film left in manual mode
goes back to auto, and to the opening, after `IDLE.manual` (90 s).

## The scenes that are not product moments

A scene is a component that builds one paused timeline and hands it to the director:

```tsx
useScene('engineering', ref, (root, stage, ease) => {
  const t = gsap.timeline({ paused: true })
  …
  t.addLabel('in', CHAPTER_TIME.in)
  …
  t.addLabel('done', CHAPTER_TIME.in + CHAPTER_TIME.out)
  return {
    tl: t,
    stops: [
      { label: 'in', cap: CHAPTER_TIME.in, hold: CHAPTER_TIME.hold },
      { label: 'done', step: 'out', cap: CHAPTER_TIME.out, exit: true },
    ],
  }
})
```

A stop is a label where the film rests (`core/director.ts → SceneStop`): `hold` (auto mode
moves on after this long), `control` (wait for a touch; the ghost presses it, after
`ghostAfter`), `idle` (return to the opening screen after this long), `cap` (longest travel
time), `exit` (arriving here leaves for the next scene at once), `stay` (a tap on the empty
stage does nothing: the film's last frame). The same rules as for a moment apply: one
timeline, `gsap.set` then `.to`, every state reachable by seeking.

- **`intro`** rests on `idle` with the start control (`OPENING.start`) as its `control` and
  `ghostAfter: INTRO_TIME.attract`: in auto mode the film starts by itself. It is alive
  while it waits through CSS animations only (the start control pings, the pillars and the
  rail's names take turns to lift); they stop under a debug hold.
- **`priya`** hides the shell's avatar while her photo is large on the stage and reveals it,
  on the timeline, at the instant the photo lands in it.
- **`engineering`** measures the rail's four day names (it never moves them): the names in
  its card lift off from there. Its root sets `data-accent="navy"`.
- **`finale`** does the same with all five names. It must keep a stop with
  `idle: FINALE_TIME.idle` and `stay: true`, show every word of `CLOSING`, call
  `director.restart()` from "Watch again", and `director.jump(key)` from each card. Its
  natural layout is the last frame; earlier frames are that layout moved by measured
  transforms. Piramal Mind's card carries the "Engineering" tag where the others carry
  their time, and stands a little apart behind a dashed line, as its stop does on the rail.

## Before you say it is done

- `npx tsc --noEmit` passes; the console is clean (no budget warnings from your moment).
- Every word and number comes from `content.ts`; small interface words ("Tap to speak")
  are the only additions.
- One `TouchControl`; touching it and waiting for the ghost both give the same result.
- All five end frames and the in-between frames hold at the three sizes, text contrast is
  at least 4.5:1, nothing overlaps the docked name, the subtitle, the two controls or the rail.
- On a phone on its side: nothing that is read is under 11 px (9 px inside a device), the
  one control is 44 px to the touch, and nothing stands in a safe area.
- No sound of any kind: no audio element, no Web Audio, no speech.
- Back (←) from every step lands on a clean frame.
