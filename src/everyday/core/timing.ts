/**
 * EVERYDAY AI · every timing constant, in one place. Seconds.
 *
 * One product moment, unattended, is the sum of CAP (the longest each stretch of
 * animation may take) + HOLD (the rests) + the touch wait:
 *
 *   before 0.85 + 1.15 · name 2.2 + 0.25 · demo 1.25 + touch 1.55 (0.6 + 0.95) · run 2.8
 *   · result 0.95 + 1.8 · stat 1.5 + 0.7 · hand-over 0.7    = 15.7 s   (limit: 16)
 *
 * Measured from its first frame to the next scene's, a moment takes up to 0.2 s longer than
 * that sum (timers, and mounting the next scene: 15.7 to 15.9 s), so the sum is kept 0.3 s
 * inside the limit.
 *
 * Where the time goes is decided by what has to be READ, because the film is silent. The two
 * steps that are sentences get the rests: the old way (a card and a line: 2.0 s in all) and
 * the result (a headline and its proof: 2.75 s, of which 1.8 s at rest). The name is one word
 * that then stays docked for the rest of the moment, and the number is one number: they get
 * less.
 *
 * Every name gets the same time at centre stage: all three name choreographies (core/name.ts)
 * are written to one length (NAME_SCORE) and played in exactly CAP.name.
 *
 * In a moment Priya's 'before' line stays on while the name lands (READ, below). The two scenes
 * that are mostly words (Meet Priya, the chapter card) rest long enough to be read.
 *
 * The whole unattended run, from the first tap on the opening to the closing's last frame:
 *
 *   the opening clears              0.6
 *   Meet Priya                      1.5 + 4.4 + 1.1   =  7.0
 *   her Tuesday, four moments       4 x 15.8          = 63.2
 *   the chapter card                1.4 + 5.0 + 0.45  =  6.85
 *   Piramal Mind                                        15.8
 *   the closing                     1.0 + 1.3 + 3.2   =  5.5
 *                                                     = about 99 s   (limit: 115)
 *
 * Before that first tap the opening screen waits INTRO_TIME.attract, and after the last frame
 * the closing waits FINALE_TIME.idle: neither is part of the run.
 *
 * A visitor who is there changes one thing: a demo control waits TOUCH.waitAttended for them
 * instead of TOUCH.wait (see TOUCH). That is their time, not the film's.
 *
 * A moment's own animation can be shorter than its cap, never longer: the director plays
 * a stretch that runs over its cap faster, so the film always keeps time.
 */

export const CAP = {
  /** The before card arrives. */
  before: 0.85,
  /** The name lands, opens, closes. */
  name: 2.2,
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

/**
 * The three name choreographies in core/name.ts are scored on this many seconds (their own
 * clock: where the letters land, when the word opens and closes) and played in CAP.name.
 */
export const NAME_SCORE = 2.85

/** How long the film rests on a finished step before it moves on by itself (auto mode). */
export const HOLD = {
  /** The old way: a picture, a line, and Priya's own line. */
  before: 1.15,
  name: 0.25,
  /** The new way, in one sentence, with its proof under it. */
  result: 1.8,
  stat: 0.7,
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
  /** Her 'after' line arrives with the outcome: this far through the demo's run, not at the touch. */
  afterAt: 0.7,
} as const

export const TOUCH = {
  /**
   * A demo control can be pressed from the moment it is visible (while the device is still
   * arriving). Nobody there: once the step has come to rest the ghost fingertip sets off after
   * this long, so the film keeps time…
   */
  wait: 0.6,
  /** …and takes this long to travel and press. */
  travel: 0.95,
  /** Somebody has touched the screen within this long: they are still there… */
  attendedFor: 20,
  /** …so the control waits this long for them, with "Your turn" beside it, before the ghost sets off. */
  waitAttended: 4,
  /** Taps closer together than this are one tap (a key during a move finishes the move). */
  debounce: 0.3,
  /**
   * A tap on the empty stage does nothing for this long after a move has begun, and nothing at all
   * while a demo is running: a second tap ("did it register?") must not throw the demo away.
   * Space, Right, PageDown and Enter still skip.
   */
  settle: 1.5,
} as const

/** The opening: what Everyday AI is. Also the screen that waits between visitors. */
export const INTRO_TIME = {
  /** The opening screen waits this long (its 59 words, read), then starts the film by itself (auto mode). */
  attract: 13,
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
  hold: 5.0,
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
  /** The closing returns to the opening screen, the one that explains, for the next visitor. */
  idle: 20,
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
