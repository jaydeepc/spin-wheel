import fs from 'node:fs'
import path from 'node:path'
import { LOCAL_CALIBRI_FILES, brandFontCss } from './font'

/**
 * Puts the brand font's @font-face rules and the variables --font-brand and --font-brand-film on
 * the page. A server component: the root layout renders it once, for every route.
 *
 * The local-only Calibri files (public/fonts/local-calibri/, never committed, never deployed)
 * are named as a source only when all six are on the machine that serves the page, and never in
 * a Vercel build. Everywhere else the page asks for nothing that is not there: an installed
 * Calibri, then Carlito.
 */
function hasLocalCalibri(): boolean {
  if (process.env.VERCEL) return false
  try {
    const dir = path.join(process.cwd(), 'public', 'fonts', 'local-calibri')
    return LOCAL_CALIBRI_FILES.every((f) => fs.existsSync(path.join(dir, f)))
  } catch {
    return false
  }
}

export default function BrandFonts() {
  const css = brandFontCss({ localCalibri: hasLocalCalibri() })
  return <style data-brand-fonts="" dangerouslySetInnerHTML={{ __html: css }} />
}
