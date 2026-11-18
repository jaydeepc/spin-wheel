# The brand: the logo and the font

One place for the two things every page shares: the Piramal.ai logo and Calibri.

```
src/brand/font.ts          the font: families, stacks, the @font-face rules, brandFontsReady()
src/brand/BrandFonts.tsx   puts those rules and two CSS variables on every page (rendered by src/app/layout.tsx)
src/brand/logo.ts          the logo's file paths, proportions and colours
public/brand/              the logo files
public/fonts/carlito/      the font that ships (open licence)
public/fonts/local-calibri/   real Calibri, LOCAL ONLY, never committed, never deployed
exports/_rig/keynote-src/tools/brand/   the scripts that made all of this, and how the logo was measured
```

## The logo

| File | What |
| --- | --- |
| `public/brand/piramal-ai-lockup.svg` | Flame and "Piramal.ai". Vector. viewBox 441.03 x 195.71. The flame is `#pai-flame`, the letters are the group `#pai-wordmark`. |
| `public/brand/piramal-ai-lockup.png` | The same, 2400 x 1065, transparent. The wheel, the admin page, the film and the two experiments load this file. |
| `public/brand/piramal-ai-mark.svg` | The flame alone. Vector. viewBox 115.14 x 195.71. |
| `public/brand/piramal-ai-mark.png` | The flame alone, 706 x 1200, transparent. The wheel's hub shows it. |
| `public/brand/piramal-ai-icon.png` (`.svg`) | The flame centred in a square, 256 x 256: the browser tab icon (`src/app/layout.tsx`). |
| `public/brand/alt/piramal-ai-lockup-bright.*` | NOT the default. The same lockup with the earlier, brighter wordmark blue, which the deck's light background image still carries. See below. |
| `public/brand/old/` | The previous logo (shaded flame, bright blue letters), kept. |

Colours: the flame is one flat colour, `#ED4224`. The wordmark is a linear gradient from
`#4768B0` (left) to `#69B8E6` (right). There is no separate version for dark grounds: the deck
puts exactly these colours on its navy title and section slides and on white, and so do we. The
files are tight to the artwork (0.2% clear all round), and the flame is as tall as the lockup, so
a rule that sets the logo's height sets the flame's height.

Where it came from: the deck has no vector logo, only pictures of it. The letters are the true
vector outlines of the previous logo (the letterforms and the arrangement did not change; checked
against the new picture letter by letter). The flame was traced on this machine from the largest
clean silhouette there is (812 px tall), with its five sharp tips rebuilt, and checked against
the new picture. Colours were read from the logo the deck embeds on its title slide, which is the
owner's supplied picture pixel for pixel. Details and the script: `tools/brand/README.md`.

One thing to know: on its light slides the deck's background image has the logo with the NEW flat
flame but the OLD brighter blue letters (about `#2A65FE` to `#59BDFC`). The owner's supplied
picture and the deck's dark slides have the muted blue above, and that is what every page uses.
If the owner wants the brighter blue after all, `alt/piramal-ai-lockup-bright.svg` is ready.

Never recolour, stretch, rotate or redraw the logo. On a busy ground give it a clear area.

## The font

The owner's font is **Calibri**: Light (300), Regular (400), Bold (700), each with an italic.
There is no Semibold or Extrabold: a `font-weight` of 600, 800 or 900 draws Bold, 500 draws
Regular. Design with three weights.

### How to use it

`<BrandFonts />` is in the root layout, so on every route these exist:

```css
font-family: var(--font-brand);        /* Calibri at its true size: the keynote */
font-family: var(--font-brand-film);   /* Calibri sized and set on Open Sans's metrics: the film only */
```

```ts
import { brandFontsReady } from '@/brand/font'
await brandFontsReady()          // before measuring text or building a timeline ('film' for the film)
```

Calibri next to other fonts: at the same `font-size` it looks about 13% smaller than Open Sans or
Inter (capitals 0.632 em, x-height 0.466 em) and runs 11 to 19% narrower. Its line box at
`line-height: normal` is 1.22 em; with `line-height: 1` the baseline is 0.842 em from the top.
Both are written into the faces, so they are the same on every machine and with Carlito.

Characters: Latin, Latin Extended and the rupee sign are covered everywhere. Arrows, Greek,
Cyrillic, maths and box-drawing come from real Calibri only; without it they fall to a system
font. Indian scripts are never in Calibri: give them their own stack, as the film does for Hindi.

### Where each face comes from, and why

In this order, for every weight and style:

1. **Calibri installed on the machine**: `local("Calibri")`, `local("Calibri Light")` and so on.
   Any Windows PC has it. Nothing is downloaded.
2. **The local-only copies**, `public/fonts/local-calibri/*.ttf`, named as a source only when all
   six files are on the machine serving the page and the build is not a Vercel build.
3. **Carlito**, `public/fonts/carlito/*.woff2`, from the npm package `@fontsource/carlito`
   (SIL Open Font Licence, text in `public/fonts/carlito/OFL.txt`).

Why not simply ship Calibri: it is Microsoft's, licensed with Office for the machine Office is on,
and its licence does not allow publishing the files on a website. Carlito was made as its
stand-in: every character is exactly as wide as Calibri's and the line metrics are the same, so a
page laid out in one is laid out identically in the other (checked: the film's 84 held frames
have the same line breaks in both). Carlito has no Light, so weight 300 draws
Carlito Regular there.

### The film (`/everyday-ai`)

The film was drawn in Open Sans, with its positions computed from Open Sans's metrics. It now
uses `--font-brand-film`: the same Calibri files, scaled by `FILM_SIZE_ADJUST = 1.13`
(`src/brand/font.ts`) so the capitals are exactly as tall as Open Sans's were, and keeping Open
Sans's ascent and descent, so every baseline and line box is where it was designed. That number
is the one knob for the film's type size as a whole.

What changed in the film's own files: `everyday.css` (the two `font-family` lines),
`Experience.tsx` (it waits for the brand font instead of Open Sans), a comment in `core/name.ts`.
What is different on screen: text runs up to 9% narrower, so some lines break differently (the
BYOT result headline is two lines instead of three and its orange phrase "on the spot" now breaks
after "the"; on a phone on its side the Prastuti result headline is three lines instead of four;
a few of Priya's lines are one line shorter); and where the film used three heavy weights (600,
700, 800) there is now one, Calibri Bold. Nothing overflows or collides at 1600 x 900 or 874 x 296.

To check the film after any change to the font: `tools/brand/film_walk.py`, `shot.mjs`,
`film_diff.py`.

## The event machine: getting real Calibri

- **A Windows PC**: nothing to do. Calibri and Calibri Light are installed; the pages find them by
  name.
- **A Mac with Microsoft Office**: run
  `python3 exports/_rig/keynote-src/tools/brand/copy_local_calibri.py` in the project. It copies
  the six files out of the Office app into `public/fonts/local-calibri/`. Then serve the site
  from that Mac (`npm run dev`, or `npm run build` and `npm start`).
- **A Mac without Office, or any machine opening a deployed copy**: the pages draw Carlito. Same
  layout, slightly different letter shapes, no Light.

To see which one a page is using: in the browser's developer tools, Network, filter "font":
`local-calibri/…ttf` is real Calibri from the folder, `carlito-…woff2` is Carlito, and no font
request at all means Calibri is installed on the machine.

## Never commit, never deploy

- `public/fonts/local-calibri/` (Microsoft's Calibri). It is in `.gitignore`: keep it there, and
  do not add a `.vercelignore` without listing it too (with a `.vercelignore` present, Vercel
  stops reading `.gitignore`). Do not build a deployment on a machine where the folder exists
  unless you move the folder out first: a prebuilt upload would carry the files with it.
  `BrandFonts.tsx` also refuses to name the files in a Vercel build, as a second guard.
- Nothing else here is restricted: Carlito and the logo files are meant to ship.
