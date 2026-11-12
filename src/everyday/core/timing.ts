/**
 * EVERYDAY AI · every timing constant, in one place. Seconds.
 *
 * One product moment, unattended, is the sum of CAP (the longest each stretch of
 * animation may take) + HOLD (the rests) + the touch wait:
 *
 *   before 0.85 + 0.65 · name 2.85 + 0.25 · demo 1.25 + touch 1.95 · run 2.8
 *   · result 0.95 + 0.95 · stat 1.5 + 1.0 · hand-over 0.7    = 15.7 s   (limit: 16)
 *
 * Measured, a moment takes about 0.15 s longer than that sum (timers, and mounting the next
 * scene), so the sum is kept a quarter of a second inside the limit.
 *
 * Every name gets the same time at centre stage: all three name choreographies (core/name.ts)
 * run the full CAP.name.
 *
 * The film is silent: every line on it is read. So the two scenes that are mostly words (Meet
 * Priya, the chapter card) rest long enough to be read, and in a moment Priya's 'before' line
 * stays on while the name lands (READ, below).
 *
 * The whole unattended run, from the first tap on the opening to the closing's last frame:
 *
 *   the opening clears              0.6
 *   Meet Priya                      1.5 + 4.4 + 1.1   =  7.0
 *   her Tuesday, four moments       4 x 15.8          = 63.2
 *   the chapter card                1.4 + 4.0 + 0.45  =  5.85
 *   Piramal Mind                                        15.8
 *   the closing                     1.0 + 1.3 + 3.2   =  5.5
 *                                                     = about 98 s   (limit: 115)
 *
 * A moment's own animation can be shorter than its cap, never longer: the director plays
 * a stretch that runs over its cap faster, so the film always keeps time.
 */

export const CAP = {
  /** The before card arrives. */
  before: 0.85,
  /** The name lands, opens, closes. */
  name: 2.85,
  /** The name docks, the device arrives, the control is ready. */
  demo: 1.25,
  /** The demo itself, from the touch to its end state. The moment's own budget. */
  run: 2.8,
  /** The result headline. */
  result: 0.95,
  /** The number counts up, with its picture. */
  stat: 1.5,
  /** The hand-over: the stage clears and the name is filed into the rail. */
  done: 0.7,
} as const

/** How long the film rests on a finished step before it moves on by itself (auto mode). */
export const HOLD = {
  before: 0.65,
  name: 0.25,
  result: 0.95,
  stat: 1.0,
} as const

/**
 * Priya's lines are read, not heard. In a moment her 'before' line is given this long before
 * her next line replaces it; what the before step itself does not give, it takes from the
 * name step, while the name lands (core/buildMoment.ts). Nothing here changes the length of
 * the film: only the instant, inside the name step, at which her line changes.
 */
export const READ = {
  /** The line needs this long to rise into place… */
  settle: 0.5,
  /** …and is read at about this pace. */
  wordsPerSecond: 4.5,
  /** Her next line is always in before the name has finished: at least this long before. */
  nameTail: 0.3,
} as const

export const TOUCH = {
  /** A control waits this long for a visitor before the ghost fingertip sets off… */
  wait: 1.0,
  /** …and the fingertip takes this long to travel and press. The control has already been in view
   *  for a good third of a second by then: about 2.5 s in all. */
  travel: 0.95,
  /** Taps closer together than this are one tap (a tap during a move finishes the move). */
  debounce: 0.3,
} as const

/** The opening: what Everyday AI is. Also the screen that waits between visitors. */
export const INTRO_TIME = {
  /** The opening screen waits this long, then starts the film by itself (auto mode). */
  attract: 9,
  /** A product preview on the opening screen closes by itself after this long. */
  preview: 7,
  /** On start, the opening clears the stage for Priya. */
  out: 0.6,
} as const

/** Meet Priya. */
export const PRIYA_TIME = {
  /** Her photo and her words arrive… */
  in: 1.5,
  /** …rest, long enough to read who she is and her first line (auto mode)… */
  hold: 4.4,
  /** …and her photo irises down into the avatar that carries her words from here on. */
  out: 1.1,
} as const

/** The chapter card between her Tuesday and Piramal Mind. */
export const CHAPTER_TIME = {
  in: 1.4,
  /** The card that sets Piramal Mind apart from her day: it is all words, so it rests until they are read. */
  hold: 4.0,
  out: 0.45,
} as const

/** The closing: the five names once more. */
export const FINALE_TIME = {
  /** "That is Everyday AI" takes the stage… */
  say: 1.0,
  /** …rests (auto mode)… */
  hold: 1.3,
  /** …then docks, and the five names lift off the rail into their cards. */
  names: 3.2,
  /** The closing returns to the opening screen for the next visitor. */
  idle: 40,
} as const

export const IDLE = {
  /** Manual mode, nobody touching: back to the opening screen, and back to auto. */
  manual: 90,
} as const

export const CUT = {
  /** A jump that is not part of the film's own flow turns the stage like a page: out, then in… */
  out: 0.22,
  in: 0.6,
  /** …travelling this far (in units of --u) the way the rail runs. */
  travel: 6,
} as const
