/**
 * Slide 23 · every word and number, copied from exports/_rig/keynote-src/pack/23/ (data.json and text.json).
 * Nothing here is retyped: the strings were written out of the pack by a script.
 */

/** data.json → columns */
export const COLUMNS = ["A YEAR AGO", "TODAY"] as const

/** data.json → rows[0] (text.json t05 … t11) */
export const SARVAM = {
  name: "Sarvam",
  line: "Its model got bigger and became its own.",
  before: { value: 24, suffix: 'B', caption: "Sarvam-M, built on a borrowed French base" },
  after: { value: 105, suffix: 'B' },
  stat: { to: 4, suffix: 'x' },
  statLine: "bigger, trained from scratch, with open weights.",
  /** text.json t11 → the spans set in Bold */
  statBold: ['from scratch', 'open weights'],
} as const

/** data.json → rows[1] (text.json t12 … t39) */
export const BHARATGEN = {
  name: "BharatGen",
  line: "Its model learned twenty more languages.",
  before: { pills: ["हिन्दी", "English"], caption: "Param-1, a 2.9B model" },
  /** The 22 language names in their own scripts, normalised Unicode, in the deck's order. Never split into letters. */
  pills: ["हिन्दी", "বাংলা", "मराठी", "తెలుగు", "தமிழ்", "ગુજરાતી", "اردو", "ಕನ್ನಡ", "ଓଡ଼ିଆ", "മലയാളം", "ਪੰਜਾਬੀ", "অসমীয়া", "मैथिली", "संताली", "कश्मीरी", "नेपाली", "सिन्धी", "कोंकणी", "डोगरी", "মণিপুরী", "बड़ो", "संस्कृतम्"],
  /** data.json → pillRows: how many pills the deck sets on each of its four lines */
  pillRows: [6, 5, 5, 6],
  caption: "Param2 speaks all 22, in a model about six times bigger (17B).",
  /** text.json t39 → the spans set in Bold */
  captionBold: ['all 22', 'about six times bigger'],
} as const

/** data.json → rows[2] (text.json t42 … t46) */
export const GNANI = {
  name: "Gnani.ai",
  line: "Its model learned to listen and speak like India.",
  before: { caption: "Voice bots for call centres" },
  stat: "1 million+",
  statLine: "hours of real Indian speech went into Vachana.",
  /** text.json t46 → the spans set in Bold */
  statBold: ['hours', 'Vachana'],
} as const

/** data.json → quote, quoteLine (text.json t40, t41) */
export const QUOTE = "“मिले सुर मेरा तुम्हारा”"
export const QUOTE_LINE = "Three voices grew up. Together, 22 languages now sing in models that India built."
export const QUOTE_BOLD = ['22 languages']

/** data.json → clippings[0] (read by eye in the pack; checked against pages/23.jpg at full size) */
export const CLIP = {
  date: "FEB 2026",
  headline: "Three home-grown AI models take the stage in one week",
  source: "Reported by Free Press Journal",
} as const

/** data.json → footnote (text.json t47) */
export const FOOTNOTE = "Sources: company and IndiaAI Mission announcements, May 2025 to Feb 2026. Model sizes are in parameters (B = billion); the two Sarvam circles are drawn to scale."

/** images.json → photo-people-singing: 682 x 453 px, a photograph of people: shown whole, as it is */
export const PHOTO = { name: 'photo-people-singing.jpg', px: [682, 453] } as const

/**
 * The two waveforms, bar by bar, as fractions of the tallest bar: measured from
 * pack/23/vector/diagram-models@4x.png (the deck draws 7 faint bars and 22 blue ones).
 */
export const WAVE_AGO = [0.2, 0.62, 0.5, 0.86, 0.62, 0.56, 0.24]
export const WAVE_NOW = [0.38, 0.52, 0.62, 0.57, 0.42, 0.26, 0.57, 0.86, 1, 0.97, 0.78, 0.47, 0.38, 0.7, 0.9, 0.92, 0.78, 0.55, 0.28, 0.3, 0.42, 0.44]
