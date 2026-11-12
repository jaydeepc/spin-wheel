# Building a product moment

Everyday AI is one silent film, in this order:

| # | Scene | What it is | Files |
| --- | --- | --- | --- |
| 1 | `intro` | **What Everyday AI is.** The first screen, and the one that waits between visitors: the title, the one sentence, the three pillars, the start button. No Priya yet. | `scenes/Intro.*` |
| 2 | `priya` | **Meet Priya.** She comes in to explain it through her Tuesday. Her photo irises down into the face that carries her words. | `scenes/Priya.*` |
| 3 | `smarthelp` `byot` `byoa` `prastuti` | **Her Tuesday:** four product moments (`product.track === 'day'`). | `moments/*` |
| 4 | `engineering` | **The chapter card:** the people who build the apps she works in. | `scenes/Engineering.*` |
| 5 | `mind` | **Piramal Mind,** the engineering team's own product moment (`product.track === 'engineering'`). Not a time in her day; Priya's lines still narrate it from her side. | `moments/mind.*` |
| 6 | `finale` | **The closing:** "That is Everyday AI", and the five names once more. | `scenes/Finale.*` |

The order is built in `store.ts` (`SCENES`) from `PRODUCTS` and their `track`. There is no
music, no narration and no sound control anywhere: a presenter talks over it.

The owner's two complaints shaped everything below: **too much on every screen**, and **Priya's
line got lost among the text around it**. So: the film waits for the visitor, the frame is
quiet, every screen keeps to a budget, and Priya's voice has a place of its own.

## Manual first (`core/director.ts`, `store.ts`)

**The film never starts and never moves on by itself.** Manual is the default mode. One clear
**Next** button, always bottom right, moves it; a tap on the empty stage and the keys (Space, →,
PageDown, Enter; ← and PageUp for back) do the same, but the button is what a newcomer sees.

What ONE press of Next does:

```
the opening   --[its own start button]-->  Meet Priya                                  (rest)
              -->  a moment's BEFORE: the old-way picture, Priya's 'before' line        (rest)
              -->  the NAME lands, alone; it docks; the device arrives with its control (rest)
                   (the name step is passed through: it is not a rest)
              -->  Next, or a press on the control itself: the DEMO runs,
                   and the RESULT headline comes in                                     (rest)
              -->  the NUMBER                                                           (rest)
              -->  the name is filed into its dot, and the next moment's BEFORE arrives (rest)
   … after Prastuti: the chapter card (rest), then Piramal Mind the same four rests,
     then the closing (rest; there the Next button reads "Start again" and restarts)
```

Four presses per product. While the film is moving, Next is quiet (`data-state="moving"`; a
press finishes the move); when the film rests it comes to full strength (`data-state="ready"`)
with one soft pulse, and breathes gently if nobody presses for about 4 s.

- **A stop can be passed through** (`SceneStop.pass`): manual does not rest there, the same
  press carries on to the next stop, and Back skips it. A moment's `name` stop is one, and so is
  the closing's `say` stop. Auto-play still rests on such a
  stop for its `hold`, and a debug URL can still hold its frame.
- **At a stop with a control,** Next (button, key or stage tap) presses the control: the demo
  runs and the film rests at the result. A press on the control itself does the same. A second
  tap on the stage while a demo runs does nothing; the Next button and the keys finish the move.
- **Back** (the small round button left of Next, ←, PageUp) steps to the previous rest, or to
  the last rest of the scene before.
- **A dot** jumps to its moment, from its beginning.
- **There is no timer in manual.** The film stays on a rest for as long as it takes: a presenter
  can talk over one screen for ten minutes, and a phone can be put down and picked up again.
  (It does not go back to the opening by itself either: the dots, and the closing's Next, which
  reads "Start again", are how a new visitor restarts it.)
- **Auto-play** still exists and is off unless asked for: `?auto` in the URL, or the small
  Auto-play switch (on the opening only, large screens only). It plays the film as before: timed rests, the ghost
  fingertip, "Your turn" beside a control for a visitor who is there, the opening starting by
  itself after `INTRO_TIME.attract`, the closing returning to the opening after
  `FINALE_TIME.idle`. **A deliberate Next or Back (button or key) switches Auto-play off**: the
  visitor has taken over (`director.press`). A press on a demo's control, and a tap on the
  empty stage, leave the mode alone. `director.restart()` keeps the mode.
- In manual there is no ghost and no "Your turn": the control's own halo and the Next button
  are the prompt. There is no "Tap anywhere to continue" any more, in any mode.

## The quiet frame (`shell/Shell.tsx`, `everyday.css`)

What stays on screen through the film, and nothing else:

| Part | Where | Notes |
| --- | --- | --- |
| the logo | top left, alone | no kicker beside it |
| the clock chip | top right, ONE line: a small dial and `9:10 am · At the branch` | the dial becomes a code mark in the engineering chapter (`Every day · With the engineering team`). Hidden on the opening and the closing. Not shown on a phone on its side. |
| Priya's voice | the bottom of the left column | her face and her line in a speech bubble: see THE LAYOUT |
| five progress dots | bottom left, in the strip | four for her day, a small gap, one for Piramal Mind. No words, no times. Current: a slightly longer pill in the product's accent; visited: filled; ahead: hollow. Each is a button (40 px or more) that jumps to its moment. Hidden on the opening, on Meet Priya and on the closing (they fade). |
| Back and **Next** | bottom right, in the strip | Next is the only control with visual weight: 4u tall (a third taller than the strip: it stands on the strip's foot and rises above it), its word 1.6u; 44 px in a phone's bar. Back is centred on it. Neither is shown on the opening. |
| the Auto-play switch | **on the opening only**, faint, bottom left (where the dots will be) | large screens only. Once the film is under way it is gone: nothing but the dots stands under Priya's bubble. There is no separate Start again: the closing's Next is that. |

**The strip carries no sentences,** and during the film no word at all on its left: only the
dots. Priya's line is not down there any more. Gone for good: the
rail with its labelled stops, its times, its "Start" / "Recap" / "Engineering" / "Five names"
caps and step pips; the product previews on the opening; "Tap anywhere to continue"; the Auto /
Start again capsule and its countdown ring; the "EVERYDAY AI" kicker; the "PRIYA" label.
**Nowhere does the screen say "names to remember".**

Hooks other files use:

- `[data-ev-rail="<product key>"]` is that product's **dot** (a button); `.ev-dot-mark` inside
  it is the mark that is drawn. `core/buildMoment.ts` files the docked name into it at the
  hand-over. Nothing else lives in the strip to aim at: the scenes that are not product moments
  do not use it.
- `[data-ev="avatar"]` is Priya's face in the voice block (`.ev-voice-avatar`): Meet Priya
  irises her photo into it.
- `.ev-root` carries `data-scene`, `data-step`, `data-resting`, `data-mode` (`manual` / `auto`),
  `data-track`, `data-accent`, `data-device`, `data-hold`.
- Every button of the shell carries `data-own`, so a press is never also a tap on the stage.
  Give your own buttons the same.
- **A press with a pointer never keeps the keyboard's focus** (`dropFocus` in `Experience.tsx`
  blurs whatever a mouse or a finger has just pressed): Space and Enter always move the film
  on, they never repeat the dot or the Back button that was clicked last. A button reached with
  Tab keeps its focus, and Enter presses it.
- **The stage is raised over the strip only during a moment's hand-over,** from the stylesheet
  (`.ev-root[data-step='done'] .ev-wrap`), so the name can travel into its dot. No timeline sets
  a `z-index` on `.ev-wrap`: a jump that kills the timeline would leave it raised. Presses fall
  through the raised stage, so Next, Back and the dots work during the hand-over too.
- The store has `atEnd` (the film rests on its last frame: Next reads "Start again").

## THE LAYOUT

The whole screen is three fixed slots down the left and ONE picture on the right, and the eye
learns where to look. It is the same at every size; only the numbers change.

```
 -hx                                   -hx + lw   (+2u)                               +hx
  | logo                                           |                         clock chip |
  |                                                |  ┌──────────────────────────────┐  |  --ev-top
  |  THE NAME SLOT                                 |  │                              │  |
  |  BYOT            the docked name               |  │                              │  |
  |  its caption     the promise; demo rest only   |  │      THE PICTURE AREA        │  |
  |                                                |  │                              │  |
  |  THE STATEMENT SLOT                            |  │  ONE picture, centred in it: │  |
  |  at most ONE headline                          |  │  the old-way picture,        │  |
  |  (+ one supporting line: two products only)    |  │  then the device,            │  |
  |  at the number step: the number and its label  |  │  then the picture of the     │  |
  |                                                |  │  number                      │  |
  |  ....... THE CLEAR ZONE: 2u, all round ....... |  │                              │  |
  |  PRIYA'S VOICE                                 |  │                              │  |
  |  (face)  her line, in a speech bubble          |  │                              │  |
  |  ............................................. |  └──────────────────────────────┘  |  --ev-vy
  |  ● ━ ○ ○  ○                                                          ( < )  [ Next → ] |
```

All of it is set by a handful of CSS variables on `.ev-root` (stage coordinates: from the
stage centre, y down; `everyday.css`, top of the file):

| Variable | Meaning | 16:9 | 4:3 | a phone on its side |
| --- | --- | --- | --- | --- |
| `--ev-lw` | the left column's width: the name, the statement, Priya's voice | 46u beside a phone; 44u beside a laptop or a centrepiece (`--ev-lw0`) | 46u; 38u (never more than half the content beside a wide picture) | 46u; 42u |
| `--ev-gap` | the clear zone | 2u | 2u | 2u |
| `--ev-px0`, `--ev-pw` | the picture area's left edge and width (`-hx + lw + gap` to `+hx`) | 2u → 46u (44u wide); 0 → 46u (46u) | 9.6u → 38.4u (28.8u); 1.6u → 38.4u (36.8u) | 2u → 46u (44u); −2u → 46u (48u) |
| `--ev-top`, `--ev-pb`, `--ev-ph` | its top, its foot and its height | −17.4u → 24.7u (42.1u) | −21.1u → 27.7u (48.8u) | −17.1u → 21.3u (38.4u) |
| `--ev-vy` | the foot of Priya's voice: 2.2u above the strip | 24.7u | 27.7u | 20.8u |
| `--ev-bw` | Priya's block at the before step (her longest lines) | 48u | 48u | 50u |

(Measured: 1600 × 900, 1024 × 768, 844 × 390. At 667 × 375 `hx` is 44u, so the picture area is
40u / 44u wide; at 874 × 296 it is as at 844 × 390, with `--u` 6.25 px.)

### The name slot

The docked name: left edge on `-hx`, baseline at −9.15u, as wide as `lw − 4u` allows and never
taller than 7.4u (7.05u on a phone on its side). Its **caption is `product.promise`**, one line,
at −6.9u, and it is on screen **only at the demo rest**: it rises in as the name docks and
leaves as the result headline arrives (`core/buildMoment.ts`; a module does not touch it).

**What the name stands for** rests there too, for the three names that have it: one small line
of caps between the name and the caption (`.ev-dockexp`: BUILD YOUR OWN TECH, BUILD YOUR OWN
AGENTS, HINDI FOR "PRESENTATION"; 1.2u, never under 11 px on a phone, the initials in the
accent). At centre stage the name is open for under a second; here it can be read for as long
as the demo rest lasts. Under such a name the caption stands a little lower (−6.25u), so the
three lines read as one lock-up. It comes with the caption and leaves with it: demo rest only.

### The statement slot

`.ev-col--result`: left edge on `-hx`, top at −6.2u, `lw` wide. The result headline
(`product.after`, 3.55u, balanced lines, your `highlight` phrase in the accent). Under it, **for
two products only**, one supporting line (`Proof` → `.ev-proof`: 1.7u, plain text, 40u at the
widest). At the number step the number and its label stand here (`.ev-stat`, top −5u).

It must end 2u above Priya's bubble. At 16:9 her bubble is 10u tall at three lines and 7.4u at
two, so the statement has 18.9u (21.5u): a three-line headline (12.8u) and a two-line
supporting line (6u with its gap) just fit over a three-line bubble. Count your lines at
1024 × 768 too: the column is narrower there beside a laptop or a centrepiece (38u).
Piramal Mind's headline is the longest of the five and has the supporting line under it: at the
frame's 3.55u it takes four lines in 44u, so `mind.css` sets it at 3.2u (3.05u on a phone on its
side) for that moment only. On a phone on its side the supporting line stands closer to the
headline (0.8u, leading 1.3) for the same reason.

### Priya's voice (`Voice` in `shell/Shell.tsx`, `.ev-voice*` in `everyday.css`)

Her face (5.6u; 4.9u or 38 px on a phone) and her line in a speech bubble: a white card, a
hairline in the moment's accent, a soft shadow, a small tail toward her. Her words are 1.95u
(31 px at 1600 × 900, 23.6 px at 1024 × 768; never under 12 px on a phone), three lines at the
most, the product's name in bold accent. It is the second most prominent text on screen, after
the headline. The block's foot is on `--ev-vy`; it grows upward; its left edge is `-hx`; it is
`lw` wide at the most (`--ev-bw` at the before step).

**THE CLEAR ZONE: nothing else may come within 2u of the block.** No supporting line, no
caption, no note, no stamp, no tag, no picture, no button, no dot. The frame keeps its own parts
out (the picture area starts 2u to its right and ends on its foot; the strip is 2.2u under it).
You keep yours out.

When she speaks, by the moment's own clock (cues on the timeline, so it is exact under a debug
hold and when stepping back):

| Step | Her bubble |
| --- | --- |
| before | her `before` line: it tells the old way |
| name | **away**, face and all: the name has the stage to itself |
| demo | her `tool` line, from 0.5 s after the name starts to dock |
| run → result | her `after` line, from 70% of the way through the run |
| number | **away**: the number has the screen |

A new line is a new card (it is keyed by the line): the old one is gone and the new one pops in
from the corner nearest her, in 0.4 s. One small, crisp move.

On the chapter card and on the closing the block is in its usual place (`ENGINEERING.said`,
`CLOSING.said`): those scenes keep their own content 2u clear of it. On the opening there is
no Priya.

**Meet Priya places her words by her photo.** The bubble's place is three variables on
`.ev-voice`, which the scene's own stylesheet may set for its scene:

```css
/* scenes/Priya.css */
.ev-root[data-scene='priya'] .ev-voice {
  --ev-vb-left: calc(var(--u) * 4);    /* the bubble's left edge, a stage x */
  --ev-vb-bottom: calc(var(--u) * 12); /* the bubble's foot, a stage y */
  --ev-vb-w: calc(var(--u) * 30);      /* its greatest width */
}
.ev-root[data-scene='priya'] .ev-voice-tail { /* a 1.2u square turned 45°: move it to the side that faces her photo, or hide it */ }
```

Her face (`[data-ev="avatar"]`) is not moved by these: it stays in its usual place, hidden on
that scene until the photo lands in it, so the iris ends where the next moment needs her.

### The picture area, and the device in it

`core/buildMoment.ts` measures `.ev-picarea` and **fits the device into it**: centred, enlarged
until it fills the area's height or width, up to `ZOOM_CAP` (phone 1.5, laptop 1.4; a
centrepiece of its own is never enlarged). Only the device's own SIZE matters (`--ev-dw`,
`--ev-dh` on `.ev-deviceMover`); where the stylesheet happens to put it does not. The device
does not move aside for the result: the left column is clear of it at every step. What that
gives:

| Screen | The phone (15.4u × 31.6u; 18.4u wide on a phone) | Prastuti's laptop | Piramal Mind's centrepiece |
| --- | --- | --- | --- |
| 1600 × 900 | × 1.28: 19.7u × 40.5u, centre (24u, 3.7u) | 46u wide (× 1.19), x 0 → 46u | area 46u × 42.1u |
| 1024 × 768 | × 1.48: 22.8u × 46.9u, centre (24u, 3.3u) | 36.8u wide (× 1.36), x 1.6u → 38.4u | area 36.8u × 48.8u |
| 844 × 390 | × 1.215: 22.4u × 38.4u, centre (24u, 2.1u) | 48u wide (× 1.10), x −2u → 46u | area 48u × 38.4u |
| 667 × 375 | × 1.215: 22.3u × 38.4u, centre (24u, 2.1u) | 44u wide, x 0 → 44u | area 44u × 38.4u |
| 874 × 296 | × 1.215: 22.3u × 38.4u, centre (24u, 2.1u) | 48u wide, x −2u → 46u | area 48u × 38.4u |

(Type inside the phone is held to `--dt` on a phone on its side: 7.5 px × 1.215 is 9.1 px on
the glass. There the phone takes the full height of the area, so it does not float while it
waits; on a large screen it keeps 4% of air and breathes by 0.45u.)

A centrepiece of its own (`device: 'none'`) **has the area's own box** (`--ev-dw: var(--ev-pw);
--ev-dh: var(--ev-ph)`), unless its module sets another. Piramal Mind does: its board is
`--ev-pw` wide and `min(--ev-ph, 1.2 × --ev-pw)` tall, so on a squarer screen it stops at 6:5.
Write such a rule as `.ev-moment[data-key='mind'][data-device='none'] .ev-deviceMover`: a
shorter selector ties with the frame's own and loses on load order.

The phone's status bar carries no words and no clock: only the signal and the battery. The
time of the moment is in the frame's clock chip.

Things that hang off the device (`OnDevice`, or `Extras` placed with `loc()`) must stay inside
the picture area (`env.area`), and never reach left of it: that is the clear zone.

**The old-way picture** stands in the same half: laid out by its module for 25u × 20u, enlarged
whole (up to 1.6×) and centred beside Priya's bubble, with the small "Before" tag on its top
left corner. On a squarer screen it stands above her bubble instead, where it can be larger.
(Measured: 1.6× at 1600 × 900 and at 1024 × 768, 1.54× at 844 × 390 and 874 × 296, 1.38× at
667 × 375.) **The picture of the number** is a box of 32 × 20 tile pitches (`--ev-pitch`: 1.34u
on a wide screen, 1.18u on a squarer one), its right edge on `+hx`, centred on the picture
area's height. It is NOT fitted to the picture area: on a squarer screen it reaches left of it,
so there it never starts higher than the statement slot (−5.6u), under the end of a long docked
name. A module whose number is very wide draws its picture smaller by setting `--ev-pitch` (and
`--ev-picw`) on its own moment: SmartHelp does, for "~15%", where the content field is narrow.

## THE BUDGET

For a screen AT REST, outside the frame, this is **all**:

1. **the name** (with its caption at the demo rest only),
2. **at most ONE statement,**
3. **Priya's bubble,**
4. **ONE picture.**

Per step:

| Rest | Name slot | Statement slot | Priya | The picture |
| --- | --- | --- | --- | --- |
| **before** | empty | empty (Piramal Mind only: `before.headline`, by `beforeHeadline: true`) | her `before` line | the old-way picture, with a small "Before" tag |
| *name* (not a rest) | | | away | THE NAME, alone at centre stage. Nothing else. |
| **demo** | the name, what it stands for (BYOT, BYOA, Prastuti) and its caption | empty | her `tool` line | the device with its ONE control |
| **result** | the name | the headline (plus ONE supporting line: SmartHelp, Piramal Mind) | her `after` line | the device in its end state, with at most ONE thing on it: a stamp or a tag, not both |
| **number** | the name | the number and its label | away | the picture of the number |

Not in the budget, anywhere: a demo title or a demo line beside the device; a proof line or
proof row (struck-through times, counts, chips); a side column; a photo; a note; a caption
beside a picture; a second card; a floating pill next to a stamp; a paragraph panel; a headline
or a detail line at the before rest (they repeat her). The single exception is the supporting
line, directly under the result headline, and only where it says something nothing else on
screen says: SmartHelp (`demo.twoWays`) and Piramal Mind (the defect tracing).

**Inside a device, a resting screen has at most about six rows of words.** Cut status-bar
text, timestamps, file names, repeated labels, "on BYOA", decorative rows, and a line that
says again what a stamp on the same device says (SmartHelp's "Resolved" under "Ticket closed").

**What belonged to the previous step and is not in the budget LEAVES as the next step
arrives,** and the leaving is choreographed (staggered, masked, purposeful), not a cut. See
"Leaving on cue".

### The checklist, on a held frame

Run it on `?scene=<yours>&at=<before|demo|result|stat>` at 1600 × 900, 1024 × 768, 844 × 390,
667 × 375 and 874 × 296:

- [ ] Count what is on screen outside the frame. Name, at most one statement, Priya's bubble,
      one picture. Anything else: it goes.
- [ ] Nothing of yours is within 2u of Priya's block (her face and her bubble). Measure it:
      `getBoundingClientRect()` of `.ev-voice-card` and `.ev-voice-avatar` against your elements;
      one `--u` is `.ev-probe`'s width / 100.
- [ ] Nothing of yours reaches left of the picture area, below `--ev-pb`, into the strip, over
      the clock chip, or off the screen (a stamp that hangs off the device included).
- [ ] At the result rest the device carries one thing at the most.
- [ ] Count the rows of words inside the device at the demo rest and at the result rest: six,
      about.
- [ ] Her bubble is three lines or fewer (it is, for every line in `content.ts`, at the five
      sizes; if you change a width, check again).
- [ ] The statement ends 2u above her bubble.
- [ ] On the phones: story text 11 px or more, in-device text 9 px or more (10 px and 8 px at
      874 × 296), Priya's words 12 px, touch targets 40 px.

## The files

| Moment | Files | Device |
| --- | --- | --- |
| SmartHelp | `moments/smarthelp.tsx`, `moments/smarthelp.css` | phone |
| BYOT | `moments/byot.tsx`, `moments/byot.css` | phone |
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
| before | stands your picture in the picture area, enlarged to fit, under the "Before" tag; Priya's bubble | `Before`: the picture of the old way |
| name | THE NAME, alone: lands, opens (expansion / Devanagari / underline), closes. The old-way picture and Priya's bubble leave as it begins. | nothing |
| demo | the name docks top-left with its caption (the promise); the device rises into the picture area; Priya's `tool` line | `Screen`: what is inside the device, with the one control |
| run | makes your control pressable as soon as it can be seen; plays your `run` timeline when it, or Next, is pressed; Priya's `after` line at 70% | the demo itself |
| result | the caption leaves; `product.after` rises in the statement slot (your `highlight` phrase in the accent); your one supporting line under it | optionally `Proof` (two products); **your exits** |
| number | the headline and Priya's bubble leave; the huge counting number and its label in the statement slot; the device leaves (into your picture if you ask) | `Stat`: the picture of the number |
| hand-over | clears the stage, files the name into its dot, starts the next scene | nothing |

Also done: the header, the dots, Back and Next, the backdrop light in your accent, the tap
ripple, manual and Auto-play, start again, resizing, the debug URLs.

## The contract (`types.ts`)

```ts
const mine: MomentModule<MyProduct> = {
  key: 'byoa',
  device: 'phone',                 // 'phone' | 'laptop' | 'none'
  highlight: 'every lead',         // optional: a phrase of product.after to colour
  beforeHeadline: false,           // Piramal Mind only: show before.headline in the statement slot
  Before, Screen, Stat,            // required components
  Proof, OnDevice, Extras,         // optional components
  animate,                         // your motion
}
```

What a module does NOT have (all of these belonged to an earlier design and are gone from the
code; do not bring them back):

| Gone | Instead |
| --- | --- |
| `demoTitle`, `demoLine`, `Under`, `Beside` | Nothing stands beside the device. Say it on the device, or not at all. |
| the product photo, `env.shared.photo` | A moment shows ONE picture. `product.photo` is still in `content.ts`, and is not drawn. |
| a `Proof` row of chips, struck-through times, counts | **ONE supporting line** directly under the result headline, for SmartHelp (`demo.twoWays`) and Piramal Mind (the defect tracing) only: one or two lines of plain text in the frame's type (`.ev-proof`), no box. |
| a headline and a detail line at the before rest | Priya's bubble tells the old way. `beforeHeadline: true` (Piramal Mind only: her line there sets up the request, not the problem) shows `product.before.headline` in the statement slot; the module then keeps it out of its own picture. `before.detail` is not shown anywhere. |
| the promise under the landed name; caption variants | The name is alone at centre stage. The caption under the DOCKED name (`.ev-dockcap`) is `product.promise` for every product, at the demo rest only. The expansion and the Devanagari word are shown by the name itself, as it lands; the expansion (and Prastuti's meaning) then rests as one small line under the docked name at the demo rest (`.ev-dockexp`, the frame's). |
| the device moving aside for the result; `--ev-dx` | The device is fitted to the picture area once and stays. |
| `clock` (a time on the phone's status bar) | The status bar has no clock. |

What a module has, besides its components: `env.area` (the picture area's box) and
`env.leave()` (see "Leaving on cue").

Every component receives `{ product }` (typed) and renders static markup. No state, no
effects, no timers: all change over time happens in `animate()`.

| Component | Where it is drawn | Size |
| --- | --- | --- |
| `Before` | the old-way picture, in the picture area | lay it out for 25u × 20u; enlarged whole, up to 1.6× |
| `Screen` | inside the phone, under its status bar | 14.4u × 28.3u (then enlarged with the phone) |
| `Screen`, laptop | inside the laptop screen | 29u × 18.8u by default; Prastuti sets its own |
| `Screen`, `device: 'none'` | your own centrepiece | give it the picture area: `--ev-pw` × `--ev-ph` |
| `Stat` | the picture of the number | 32 × 20 tile pitches (`--ev-pitch`): about 38u × 24u, 43u × 27u on wide screens |
| `Proof` | the one supporting line under the result headline | text; 40u wide at the most |
| `OnDevice` | on top of the device, moves with it, not clipped by the screen (BYOT's stamp) | the device's box; ONE thing at the result rest |
| `Extras` | a free 0 × 0 layer at the stage centre, above everything of the moment, for things that fly between places | position with `x` / `y` from `env.loc()` |

### `animate(env)`

Called once each time the moment is built (and again after a resize). You get five small
timelines, one per step. `t = 0` on each is the instant its step begins:

| Timeline | `t = 0` is | Budget | What belongs here |
| --- | --- | --- | --- |
| `env.before` | the old-way picture starts to arrive (landed by 0.6) | 0.85 s | bring your picture to life |
| `env.demo` | the name starts to dock, the device starts to rise (landed by 1.0) | 1.25 s | assemble the screen; the control must be ready at the end |
| `env.run` | **the touch** | 2.8 s | the demo: what pressing the control does |
| `env.result` | the caption leaves, the headline rises (0.16 → 0.9), the supporting line fades in (0.45 → 0.85) | 0.95 s | **your exits** (0 → 0.35); the inside of your supporting line |
| `env.stat` | the headline and Priya leave; the number counts 0.35 → 1.3; the device is gone by 0.85 | 1.5 s | **your exits** (0 → 0.3); draw your picture |

A timeline that runs over its budget is played faster by the director (and warns in the
console), so the moment never exceeds 16 seconds in Auto-play. Shorter is fine, and in
Auto-play gives Priya's `before` line more time.

### Leaving on cue

The frame clears its own parts on cue: the old-way picture, its tag and Priya's bubble at the
start of the name; the caption at the start of the result; the headline, the supporting line and
Priya's bubble at the start of the number; everything at the hand-over (your `Extras` layer
included).

Yours leave from your own timelines, at their start:

```ts
// BYOT, as the result begins: the four field labels and their ticks have done their work
// (the values stay), so they leave one after the other
env.leave(result, labels, 0, { stagger: 0.05, dy: 0.5 }) // labels: .byot-field-k, .byot-field-tick
// SmartHelp, late in its run: the pill and the ticket's words give way to the stamp
env.leave(run, [pills[1], tkText], fix + 0.1, { stagger: 0.06, dy: 0.6 })
// anything of yours outside the device, as the number begins
env.leave(env.stat, yourChips)
```

`env.leave(section, targets, at = 0, { stagger = 0.045, dy = 0.9 })` lifts each target `dy`
units and fades it, 0.26 s each; they end at `autoAlpha: 0`. It is an ordinary tween on your
timeline, so every frame is still reachable by seeking, and stepping Back brings them back. Use
a mask (`<Rise>`, `yPercent: -118`) where a line should leave through its own edge instead.

Return `{ control, deviceLandsOn? }`:

- `control`: your `<TouchControl>` element, `env.$('[data-ev-control]')`. Exactly one per
  moment. The shared frame makes it pulse and pressable from the instant it can be seen (on
  screen, not hidden, at least 0.6 opaque: so while the device is still arriving), and spent
  once it has been pressed. Do not add your own click handlers anywhere. See "Touch" below.
- `deviceLandsOn`: an element inside your `Stat` picture that the device should fly into and
  become (BYOT: the phone shrinks into its own tile). Leave it out and the device sinks away.

What `env` gives you: `product`, `accent` (`{ main, ink, soft, haze }`), `U` (one `--u` in
px), `hx` (half the content width in px), `small` (a phone on its side), `ease` (`out`, `inOut`,
`snap`, `slam`), `$` / `$$` (queries scoped to your moment), `loc(el)`, `area` (the picture
area), `letters` (where each letter of the big name stands at centre stage: things can be born
from them), `shared` (`device`, `name`: aim at them, never animate them),
`bump(timeline, at, strength?)` (a small knock on the device when something lands in it) and
`leave()`.

### The rules that keep every frame reachable

1. **Set starting states with `gsap.set()` in `animate()`**, then add `.to()` tweens.
   Never `.from()`. `.fromTo()` only with `immediateRender: false`.
2. **Transforms, `autoAlpha`, `clipPath`, `drawSVG`, `motionPath`, text content** only.
   No width / height / top / left, no filters, no box-shadow animation.
3. **No callbacks, `delayedCall`, timers, state or CSS transitions for story motion.**
   If it is not on the timeline, it cannot be held by a debug URL, and it will be wrong
   when someone presses Back. (A CSS `animation` for an idle pulse is fine.)
4. **Touch only your own elements** (`env.$`, `env.$$`). Never `document.querySelector`.
5. **`env.loc()` is measured in the demo pose.** When `animate()` is called, the stage is
   laid out as it is during the demo, the run and the result: the device in its place in the
   picture area at its fitted size, your Before picture at its resting size and place, your
   `Stat` picture laid out, nothing hidden yet. So `loc()` of a field inside the device is
   exactly where a chip must land. Measure first, then `gsap.set()` your hidden states.
6. Anything that travels between places (letters → device) lives in `Extras`, absolutely
   positioned at `left: 0; top: 0`, and moves with `x` / `y` from `loc()`. Use
   `motionPath: { path: [over, to], curviness: 1.3 }` for an arc, not a line.
7. A `<Rise>` starts hidden below its mask (the shared frame sets `yPercent: 118` on every
   `.ev-rise`); bring it in with `yPercent: 0`, send it out with `yPercent: -118`.
8. Elements you reveal with `autoAlpha` should have `visibility: hidden` in your CSS, so
   nothing flashes before the first frame.

## Shared pieces

From `./parts`:

- `<TouchControl label="…" className="…">glyph</TouchControl>`: the one control. Size it
  with your class (write the rule as `.ev-touch.your-class`, so a radius of your own wins
  whatever order the stylesheets load in); put your own face inside it and animate that, not
  the control itself.
- `<Rise>…</Rise>`: a line that rises through a mask.
- `withName(text, product.name)`: bolds the product name inside a sentence.
- `sentences(text)`: each sentence on its own line, no breaks at hyphens.
- `splitSentences(text, enders?)`: the same cut as plain strings (`'.?!।'` adds the danda).
  Use it instead of `text.split(/(?<=[.?!])\s+/)`: a lookbehind stops the whole page from
  loading in Safari before 16.4. No regular expression in the film may use one.
- `data-ev-solid` on a wordless picture of yours that stands near your control (a pile of cards,
  a dashed box, a strip): Auto-play's "Your turn" caption keeps off it, as it keeps off text.

GSAP: `CustomEase`, `DrawSVGPlugin`, `SplitText`, `MotionPathPlugin` and `Flip` are
registered. Import `gsap` from `'gsap'` and `SplitText` from `'gsap/SplitText'`. Anything you
create inside `animate()` is reverted for you.

CSS variables (all sizes are `calc(var(--u) * n)`; never px, rem or vw):

| Variable | Meaning |
| --- | --- |
| `--u` | the fluid unit: 16px at 1600 × 900, 19.2px at 1920 × 1080, 12.1px at 1024 × 768, about 6 to 9 px on a phone on its side |
| `--fl`, `--dt` | a phone on its side only: one pixel of type floor, and the floor for type inside the enlarged phone |
| `--hx` | half the content width: content runs from `-hx` to `+hx` around the stage centre (46u on wide screens, 38.4u at 4:3) |
| `--ev-lw`, `--ev-gap`, `--ev-px0`, `--ev-pw`, `--ev-top`, `--ev-pb`, `--ev-ph`, `--ev-vy`, `--ev-bw` | THE LAYOUT: see the table there |
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
from `product.accent`. Light theme only: no purple, no green, no dark panels except navy.

## A phone on its side (`@media (max-height: 480px)`, `env.small`)

A phone held sideways gives the page about 640 to 930 px by 300 to 430 px (874 × 296 is what
Safari really gives an iPhone in landscape with its bars showing). Height is what is scarce.
THE LAYOUT is the same one, with its own numbers (the table above). All of it lives behind the
one media query (in `everyday.css`, and in a block at the end of each scene's and moment's own
`.css`) and behind `stage.small` / `env.small`; nothing here changes a larger screen.

- **One bar, no header.** The bottom of the screen is the strip, 44 px or more: the logo, the
  five dots (40 × 44 px each to the touch), then Back (44 × 44) and Next (96 × 44 or more). No
  clock chip, no Auto-play switch, no Start again.
- **The stage has everything above the bar.** `--u` is worked out from that room, clear of
  `env(safe-area-inset-*)`: 38.9u of height, or 88u across, whichever is smaller. The room
  runs from −17.3u to +21.6u around the stage centre. `--z` is 1.
- **Type has a floor in real pixels.** `max(calc(var(--u) * n), calc(var(--fl) * 11))` for
  anything that is read; 12 px for Priya's words; `var(--dt)` (7.5 px, 9.1 px on the glass) for
  type inside the phone; Prastuti's laptop and Piramal Mind's board have their own. `--fl` is
  1px on every phone with `--u` ≥ 6.9 px; below that (874 × 296: `--u` 6.25 px) it shrinks with
  `--u`, which is where the 10 px and 8 px floors of that size come from.
- **Priya's voice** has no room to spare: her bubble is 9u tall at three lines, its foot at
  20.8u. The statement must end by 9.8u: three lines of headline at the frame's size, no more.
- **The page is the film.** It never scrolls, bounces, zooms or selects, at any size
  (`touch-action: none`, `overscroll-behavior`, the route's `viewport` export, the gesture
  guards in `Experience.tsx`: see "Touch"). Held upright, a phone shows "Turn your device
  sideways" and the film waits (`director.freeze`): turned back, it carries on from the same
  frame. A resize (the browser's bar coming or going) rebuilds the scene and resumes its step
  (`director.builtFor()`, compared in `Experience.tsx`).

## Touch (`core/director.ts`, `Experience.tsx`)

- **The Next and Back buttons, and the keys,** are the deliberate moves (`director.press`):
  at rest they step; during a move Next finishes it (the demo included). They switch Auto-play
  off. Enter and Space on a button the KEYBOARD has focused are left to that button; a button
  pressed with a pointer does not keep the focus, so after a click on a dot or on Back they
  still mean Next. A presenter's clicker sends PageDown / PageUp (some send Enter).
- **A tap on the empty stage** moves the film on a step when it is resting. During a move it
  is nearly always a second tap ("did that register?"), so it does nothing for the first
  1.5 s of any move (`TOUCH.settle`) and nothing at all while a demo that a control started
  is running; after that it finishes the move. On the film's last frame it does nothing.
- **The one control of a demo** is live (`data-live="1"`: it pulses and can be pressed) from
  the instant it can be seen, not from the end of the step. Pressed while its step is still
  arriving, the arrival is finished at once and the demo runs. Once pressed it is spent
  (`data-spent="1"`): it still takes the taps that land on it, and does nothing with them.
- **Auto-play only: the ghost fingertip.** Nobody there: it sets off `TOUCH.wait` (0.45 s)
  after the step has come to rest and presses 0.95 s later. Somebody has touched the screen in
  the last 20 s: the control waits `TOUCH.waitAttended` (4 s) for them first, and **"Your
  turn"** (`PROMPTS.yourTurn`) stands beside it, placed by the director where it lies over
  nothing that is read and no picture marked `data-ev-solid`, and never within 2u of Priya's
  voice. Where there is no such place it is not shown.
- **Nothing of the browser shows through.** The context menu is suppressed always; only a
  debug URL (`?scene=…` or `?debug`) keeps it. `touch-action: none`, `user-select: none` and
  `-webkit-touch-callout: none` are on `.ev-root` at every size; pinch and pan and ctrl + wheel
  zoom are prevented.
- **Photos are ready before they are shown.** The film has two (Priya's face and her large
  photo): `Experience.tsx` asks for both at boot and waits for the large one with the fonts, for
  2 s at the most.

## Holding a frame

Animation frames are throttled in the review browser, so judge motion from held frames.
A dev server is already running on port 5183.

```
/everyday-ai                                                                              manual: waits on the opening for its start button
/everyday-ai?auto                                                                         Auto-play: the film plays by itself
/everyday-ai?scene=<intro|priya|smarthelp|byot|byoa|prastuti|engineering|mind|finale>   plays from that scene (manual: to its first rest)
/everyday-ai?scene=byot&at=<before|name|demo|result|stat|done>                           HOLDS the end of that step
/everyday-ai?scene=byot&at=demo&dt=1.2                                                   1.2 s into the run
/everyday-ai?scene=byot&at=name&dt=-1.5                                                  1.5 s before the name has finished
/everyday-ai?scene=byot&at=demo&auto&touched                                             Auto-play's demo frame for a visitor who is there: "Your turn"
```

`at` is a label on the scene's timeline; `dt` moves on from it (or back, if negative):

| Scene | `at` | The frame |
| --- | --- | --- |
| a product moment | `before` `name` `demo` `ran` `result` `stat` `done` | the end of that step (`ran`: the demo has just finished) |
| `intro` | `title` `say` `pillars` | on the way in |
| | `idle` | **the opening at rest,** with the start button waiting |
| | `done` | the stage has cleared for Priya |
| `priya` | `in` | **her photo, her name, her role, her line;** `PRIYA.said` in her bubble |
| | `done` | her photo has irised down into her face (`&dt=-0.5` is a frame on the way) |
| `engineering` | `day` | her Tuesday has gathered into its card |
| | `in` | **the whole chapter card** |
| | `done` | the card has cleared for Piramal Mind |
| `finale` | `say` | **"That is Everyday AI"** alone on the stage |
| | `names` | it has docked; the five names have landed |
| | `done` | **the last frame of the film** |
| any scene | `start` | time 0 |

While holding, nothing advances by itself and nothing is passed through; Space / → and ← still
step, one stop at a time. The other switches: `?auto`, `?touched` (Auto-play: as if somebody
had just touched the screen), `?debug` (keeps the right-click menu; `?scene=…` keeps it too),
`?manual` (accepted; changes nothing).

Look at every rest and several frames inside your `before`, `demo`, `run` and `stat` at
**1600 × 900, 1024 × 768, 844 × 390, 667 × 375 and 874 × 296.** Then walk it once with Next:
`?scene=<yours>`.

## Timing (`core/timing.ts`)

In manual only the travel times matter (`CAP`): before 0.85 · name 2.2 + demo 1.25 (one press)
· run 2.8 + result 0.95 (one press) · number 1.5 · hand-over 0.7 + the next before 0.85.

Auto-play, one moment: before 0.85 + rest 1.15 … 1.6 · name 2.2 + 0.15 · demo 1.25 · the
control waits 0.45, the ghost fingertip takes 0.95 · run 2.8 · result 0.95 + rest 1.6 · number
1.5 + rest 0.6 · hand-over 0.7 = `MOMENT.budget`, 15.6 s (measured: 15.59 to 15.71 s from a
moment's first frame to the next scene's; the limit is 16). Priya's `before` line is only on
screen during the before step, so the before rest takes whatever the rest of the moment leaves
inside the budget, up to what the line needs at reading pace (`READ`: 4.5 words a second). A
long line (SmartHelp's 21 words) does not get its full reading time in Auto-play; in manual it
has as long as the visitor likes.

The whole film in Auto-play, from the start on the opening to the closing's last frame:
0.6 + Meet Priya 7.0 + four moments 62.7 + the chapter card 6.9 + Piramal Mind 15.6 + the
closing 4.3 = about 97 s (measured: 97.1 s; from a cold page load, with the opening's 11 s
attract, about 112 s on the dev server; the limit is 115).

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

A stop is a label where the film rests (`core/director.ts → SceneStop`): `pass` (manual does
not rest here: the same press carries on), `control` (the one thing to press here; Next presses
it too), `exit` (arriving here leaves for the next scene at once), `stay` (the film's last
frame: a tap on the empty stage does nothing, and Next reads "Start again"), `cap` (longest
travel time). For Auto-play only: `hold` (move on after this long), `ghostAfter`, `invite`
("Your turn"), `idle` (return to the opening after this long). The same rules as for a moment
apply: one timeline, `gsap.set` then `.to`, every state reachable by seeking.

What the frame expects of each:

- **`intro`** rests on `idle` with the start button (`OPENING.start`) as its `control`. In manual
  it waits there for as long as it takes; `ghostAfter: INTRO_TIME.attract` starts the film by
  itself in Auto-play only. The frame shows nothing on it but the logo and the faint Auto-play
  switch: no dots, no clock, no Back, no Next. It shows the title, the one sentence, the three
  pillar TITLES and the start button: no product previews, and no teaser line.
- **`priya`** hides her face (`[data-ev="avatar"]`) while her photo is large on the stage and
  reveals it, on the timeline, at the instant the photo lands in it. It places her bubble by
  her photo (see "Priya's voice"). The dots are hidden on it.
- **`engineering`** and **`finale`** keep their content 2u clear of Priya's block, which is in
  its usual place. `finale` keeps a stop with `stay: true` (and `idle: FINALE_TIME.idle`, which
  counts in Auto-play only), marks its `say` stop `pass: true`, calls `director.jump(key)` from
  each row, and has no "Watch again" of its own: the Next button reads "Start again" there. It
  has no recap caption and no hint line. The dots and the clock chip are hidden on it.

## Before you say it is done

- `npx tsc --noEmit` passes; the console is clean (no budget warnings from your moment).
- THE BUDGET's checklist passes on every rest, at the five sizes.
- Every word and number comes from `content.ts`; small interface words ("Tap to speak")
  are the only additions. Nothing says "names to remember".
- One `TouchControl`; pressing it, pressing Next and (Auto-play) waiting for the ghost all give
  the same result, and a second tap anywhere, half a second after the first, changes nothing.
- No regular expression uses a lookbehind; every `color-mix()` has a plain `rgba()` beside
  it (see the `@supports` block at the end of `everyday.css` for why it is written that way).
- Text contrast is at least 4.5:1.
- No sound of any kind: no audio element, no Web Audio, no speech.
- Back from every rest lands on a clean frame, and Next from there plays it again.
- With `?auto` your moment still takes 16.0 s or less.
