/**
 * THE BRAND FONT: Calibri (Light 300, Regular 400, Bold 700, and their italics).
 *
 * One module for the keynote and the Everyday AI film. It has no dependencies and runs anywhere
 * (server or browser). The @font-face rules it writes are put on the page by <BrandFonts />
 * (./BrandFonts.tsx), which the root layout renders once, so on every route:
 *
 *     font-family: var(--font-brand);        Calibri at its true size        (the keynote)
 *     font-family: var(--font-brand-film);   Calibri at Open Sans's optical size and line metrics
 *                                            (the film, which was drawn in Open Sans)
 *
 * Where each face comes from, in this order (see README.md for the why):
 *   1. Calibri installed on the machine          local("Calibri") …            any Windows PC with Office
 *   2. the local-only copies, if the folder is there   /fonts/local-calibri/*.ttf   this Mac, the event machine
 *   3. Carlito, the open-licensed font with Calibri's metrics   /fonts/carlito/*.woff2   what ships
 * Light (300) is Calibri Light where 1 or 2 has it; Carlito has no Light, so there it is Regular.
 */

export const BRAND_FAMILY = 'Brand Calibri'
export const BRAND_FILM_FAMILY = 'Brand Calibri Film'

/** What follows the brand family in a font stack. */
const AFTER = `Calibri, Carlito, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif`
export const BRAND_FONT_STACK = `'${BRAND_FAMILY}', ${AFTER}`
export const BRAND_FILM_FONT_STACK = `'${BRAND_FILM_FAMILY}', '${BRAND_FAMILY}', ${AFTER}`

/** The CSS variables <BrandFonts /> defines on :root. */
export const BRAND_FONT_VAR = '--font-brand'
export const BRAND_FILM_FONT_VAR = '--font-brand-film'

/**
 * Calibri's own line metrics (hhea, per 2048 units: ascent 1950, descent 550, no line gap).
 * Carlito's are the same. Written into the faces so a line box is identical on every machine.
 */
const CALIBRI = { ascent: 1950 / 2048, descent: 550 / 2048 }

/**
 * THE FILM'S ONE KNOB. The film was drawn in Open Sans; Calibri at the same font-size is about
 * 13% smaller to the eye (cap height 0.632 em against 0.714 em) and 11 to 19% narrower.
 * FILM_SIZE_ADJUST scales the film's Calibri so its capitals are exactly as tall as Open Sans's
 * were (1462 / 1294 = 1.13), and the film's faces keep Open Sans's line metrics (ascent 2189,
 * descent 600 per 2048), so every baseline and every line box in the film stays where it was
 * designed. Text then runs 0 to 9% narrower than it did, never wider (except weight 300 where
 * there is no Calibri Light: about 2% wider).
 * To make the film's type larger or smaller as a whole, change this one number.
 */
export const FILM_SIZE_ADJUST = 1.13
const OPEN_SANS = { ascent: 2189 / 2048, descent: 600 / 2048 }

/** The two Carlito subsets that ship, with the ranges @fontsource/carlito gives them. */
const SUBSETS = [
  {
    name: 'latin',
    range:
      'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  },
  {
    // the rupee sign (U+20B9) lives here
    name: 'latin-ext',
    range:
      'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
  },
] as const

/**
 * What Calibri has and the two Carlito subsets do not (Greek, Cyrillic, arrows such as U+2192,
 * maths, box drawing). Real Calibri only: without it these characters fall to the next family.
 */
const CALIBRI_ONLY_RANGE =
  'U+0370-03FF,U+0400-052F,U+2070-209F,U+2100-2112,U+2114-2121,U+2123-218F,U+2190,U+2192,U+2194-21FF,U+2200-2211,U+2213-2214,U+2216-22FF,U+2500-25FF,U+FB00-FB06'

interface Face {
  weight: 300 | 400 | 700
  style: 'normal' | 'italic'
  /** Names an installed Calibri answers to: its full name and its PostScript name. */
  local: string[]
  /** The file in public/fonts/local-calibri/ (copied from the Office app). */
  file: string
  /** The Carlito face that stands in: Carlito has no Light. */
  carlito: '400-normal' | '400-italic' | '700-normal' | '700-italic'
}

const FACES: Face[] = [
  { weight: 300, style: 'normal', local: ['Calibri Light', 'Calibri-Light'], file: 'calibril.ttf', carlito: '400-normal' },
  { weight: 300, style: 'italic', local: ['Calibri Light Italic', 'Calibri-LightItalic'], file: 'calibrili.ttf', carlito: '400-italic' },
  { weight: 400, style: 'normal', local: ['Calibri'], file: 'Calibri.ttf', carlito: '400-normal' },
  { weight: 400, style: 'italic', local: ['Calibri Italic', 'Calibri-Italic'], file: 'Calibrii.ttf', carlito: '400-italic' },
  { weight: 700, style: 'normal', local: ['Calibri Bold', 'Calibri-Bold'], file: 'Calibrib.ttf', carlito: '700-normal' },
  { weight: 700, style: 'italic', local: ['Calibri Bold Italic', 'Calibri-BoldItalic'], file: 'Calibriz.ttf', carlito: '700-italic' },
]

/** The six local-only files, by name (BrandFonts checks that they are there). */
export const LOCAL_CALIBRI_FILES = FACES.map((f) => f.file)
export const LOCAL_CALIBRI_DIR = '/fonts/local-calibri'
export const CARLITO_DIR = '/fonts/carlito'

const pct = (v: number) => `${(v * 100).toFixed(2)}%`

function faces(family: string, metrics: string, localCalibri: boolean): string {
  const out: string[] = []
  for (const f of FACES) {
    const real = [
      ...f.local.map((n) => `local('${n}')`),
      ...(localCalibri ? [`url('${LOCAL_CALIBRI_DIR}/${f.file}') format('truetype')`] : []),
    ]
    const head = `font-family:'${family}';font-style:${f.style};font-weight:${f.weight};font-display:block;${metrics}`
    // Declared first: where a range is claimed twice, the later rule wins.
    out.push(`@font-face{${head}src:${real.join(',')};unicode-range:${CALIBRI_ONLY_RANGE}}`)
    for (const s of SUBSETS) {
      const src = [...real, `url('${CARLITO_DIR}/carlito-${s.name}-${f.carlito}.woff2') format('woff2')`]
      out.push(`@font-face{${head}src:${src.join(',')};unicode-range:${s.range}}`)
    }
  }
  return out.join('\n')
}

/**
 * The whole stylesheet: both families and the two variables.
 * `localCalibri`: the local-only folder exists on the machine serving the page, so its files may
 * be named as a source. Never true on a deployed build (see BrandFonts.tsx).
 */
export function brandFontCss(opts: { localCalibri: boolean }): string {
  const own = `ascent-override:${pct(CALIBRI.ascent)};descent-override:${pct(CALIBRI.descent)};line-gap-override:0%;`
  // The override descriptors are scaled by size-adjust, so they are divided by it here.
  const film =
    `size-adjust:${pct(FILM_SIZE_ADJUST)};` +
    `ascent-override:${pct(OPEN_SANS.ascent / FILM_SIZE_ADJUST)};descent-override:${pct(OPEN_SANS.descent / FILM_SIZE_ADJUST)};line-gap-override:0%;`
  return [
    faces(BRAND_FAMILY, own, opts.localCalibri),
    faces(BRAND_FILM_FAMILY, film, opts.localCalibri),
    `:root{${BRAND_FONT_VAR}:${BRAND_FONT_STACK};${BRAND_FILM_FONT_VAR}:${BRAND_FILM_FONT_STACK}}`,
  ].join('\n')
}

/**
 * Resolves when the brand's upright faces (and the regular italic) are ready to measure and draw
 * with. Call it before measuring text (SplitText, getBoundingClientRect) or building a timeline.
 * Never rejects: a face that cannot load must not hold a show.
 *
 *     await brandFontsReady()            // the keynote
 *     await brandFontsReady('film')      // the film
 */
export function brandFontsReady(which: 'brand' | 'film' = 'brand'): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts?.load) return Promise.resolve()
  const family = which === 'film' ? BRAND_FILM_FAMILY : BRAND_FAMILY
  const wanted = ['300', '400', '700', 'italic 400'].map((w) => document.fonts.load(`${w} 40px "${family}"`))
  return Promise.all([...wanted, document.fonts.ready]).then(
    () => undefined,
    () => undefined,
  )
}
