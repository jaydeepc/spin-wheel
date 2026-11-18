/**
 * THE LOGO: where the files are, and their proportions. The files are in public/brand/ (README.md).
 * The same artwork is right on white and on the deck's navy: the deck uses these colours on both.
 */
export const BRAND_LOGO = {
  /** Flame and "Piramal.ai". Vector; inline it or use it in an <img>. viewBox 441.03 x 195.71. */
  lockupSvg: '/brand/piramal-ai-lockup.svg',
  /** The same, 2400 x 1065, transparent. This is the file the wheel, the film and the experiments load. */
  lockupPng: '/brand/piramal-ai-lockup.png',
  /** The flame alone. Vector, viewBox 115.14 x 195.71. */
  markSvg: '/brand/piramal-ai-mark.svg',
  /** The flame alone, 706 x 1200, transparent. */
  markPng: '/brand/piramal-ai-mark.png',
  /** The flame centred in a square, 256 x 256, transparent: the browser tab icon. */
  iconPng: '/brand/piramal-ai-icon.png',
  /** width / height */
  lockupAspect: 441.03 / 195.71,
  markAspect: 115.14 / 195.71,
  /** The flame is the first 26.1% of the lockup's width, and as tall as the lockup. */
  markShare: 115.14 / 441.03,
} as const

/** The logo's own colours (measured from the logo the deck embeds). */
export const BRAND_LOGO_COLORS = {
  flame: '#ED4224',
  wordStart: '#4768B0',
  wordEnd: '#69B8E6',
} as const
