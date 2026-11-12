/**
 * EVERYDAY AI · every timing constant, in one place. Seconds.
 *
 * THE FILM IS MANUAL BY DEFAULT: it waits for the visitor at every rest and never starts or
 * moves on by itself. In manual the only numbers here that matter are CAP (how long each stretch
 * of animation takes): there is no timer of any kind in manual. Everything about rests (HOLD,
 * the ghost fingertip, the opening's attract, the closing's idle) belongs to AUTO-PLAY, which is
 * off unless asked for (?auto, or the Auto-play switch).
 *
 * One product moment in Auto-play is the sum of CAP + HOLD + the touch wait:
 *
 *   before 0.85 + 1.15 … 1.6 · name 2.2 + 0.15 · demo 1.25 + touch 1.4 (0.45 + 0.95) · run 2.8
 *   · result 0.95 + 1.6 · stat 1.5 + 0.6 · hand-over 0.7    = at most MOMENT.budget (15.6 s; limit: 16)
 *
 * Measured from its first frame to the next scene's, a moment takes up to 0.2 s longer than
 * that sum (timers, and mounting the next scene), so the budget is kept 0.4 s inside the limit.
 *
 * Where the time goes is decided by what has to be READ, because the film is silent. Priya's
 * 'before' line is only on screen during the before step (she is not on screen while the name
 * lands), so the before rest takes whatever the rest of the moment leaves inside the budget, up
 * to what the line needs at READ pace: core/buildMoment.ts works it out per moment (a moment
 * whose own animation is shorter than its caps gives that time to her line).
 *
 * Every name gets the same time at centre stage: all three name choreographies (core/name.ts)
 * are written to one length (NAME_SCORE) and played in exactly CAP.name.
 *
 * The whole Auto-play run, from the start on the opening to the closing's last frame:
 *
 *   the opening clears              0.6
 *   Meet Priya                      1.5 + 4.4 + 1.1   =  7.0
 *   her Tuesday, four moments       4 x 15.7          = 62.7
 *   the chapter card                1.4 + 5.0 + 0.45  =  6.85
 *   Piramal Mind                                        15.6
 *   the closing                     1.0 + 1.3 + 2.0   =  4.3   (its last stretch runs 2.0 s; FINALE_TIME.names is its cap)
 *                                                     = about 97 s   (limit: 115)
 *
 * (Measured at 1600 x 900: the moments 15.59 to 15.71 s each; the film 97.1 s from the start on
 * the opening; from a cold page load, with the opening's 11 s attract, about 112 s on the dev
 * server, which takes some 2 s to boot the page. The attract was 13 s: one run then came to 116 s.)
 *
 * A visitor who is there changes one thing in Auto-play: a demo control waits TOUCH.waitAttended
 * for them instead of TOUCH.wait (see TOUCH). That is their time, not the film's.
 *
 * A moment's own animation can be shorter than its cap, never longer: the director plays
 * a stretch that runs over its cap faster, so the film always keeps time.
 */

export const CAP = {
  /** The old-way picture arrives. */
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
  /** The hand-over: the stage clears and the name is filed into its dot. */
  done: 0.7,
} as const

/**
 * The three name choreographies in core/name.ts are scored on this many seconds (their own
 * clock: where the letters land, when the word opens and closes) and played in CAP.name.
 */
export const NAME_SCORE = 2.85

/** Auto-play: how long the film rests on a finished step before it moves on by itself. */
export const HOLD = {
  /** The old way: a picture and Priya's line. The LEAST it rests; see MOMENT.budget for the most. */
  before: 1.15,
  /** The name has had its 2.2 s at centre stage: it docks almost at once. (Manual passes straight through.) */
  name: 0.15,
  /** The new way, in one sentence. */
  result: 1.6,
  stat: 0.6,
} as const

/** Auto-play: one moment's whole length, from its first frame to the end of its hand-over. */
export const MOMENT = {
  /**
   * The before rest is stretched, for the sake of Priya's line, until the moment adds up to
   * this. 0.4 s inside the 16 s limit (see the top of this file).
   */
  budget: 15.6,
} as const

/**
 * Priya's lines are read, not heard. Her bubble shows her 'before' line through the before
 * step, is away while the name lands (the name has the stage to itself), comes back with her
 * 'tool' line as the device arrives, changes to her 'after' line late in the demo's run, and
 * leaves as the number arrives. These are cues on the moment's timeline (core/buildMoment.ts).
 */
export const READ = {
  /** The bubble needs this long to arrive… */
  settle: 0.5,
  /** …and its line is read at about this pace. */
  wordsPerSecond: 4.5,
  /** Her 'tool' line arrives this long after the name starts to dock (the device is rising). */
  toolAt: 0.5,
  /** Her 'after' line arrives with the outcome: this far through the demo's run, not at the touch. */
  afterAt: 0.7,
} as const

export const TOUCH = {
  /**
   * A demo control can be pressed from the moment it is visible (while the device is still
   * arriving). Auto-play, nobody there: once the step has come to rest the ghost fingertip sets
   * off after this long, so the film keeps time…
   */
  wait: 0.45,
  /** …and takes this long to travel and press. */
  travel: 0.95,
  /** Somebody has touched the screen within this long: they are still there… */
  attendedFor: 20,
  /** …so (Auto-play) the control waits this long for them, with "Your turn" beside it, before the ghost sets off. */
  waitAttended: 4,
  /** Presses closer together than this are one press (a key or the Next button during a move finishes the move). */
  debounce: 0.3,
  /**
   * A tap on the empty stage does nothing for this long after a move has begun, and nothing at all
   * while a demo is running: a second tap ("did it register?") must not throw the demo away.
   * The Next button and the keys still finish a move.
   */
  settle: 1.5,
} as const

/** The opening: what Everyday AI is. Also the screen that waits between visitors. */
export const INTRO_TIME = {
  /** Auto-play only: the opening waits this long (its words, read), then starts the film by itself. In manual it waits for its start button. */
  attract: 11,
  /** On start, the opening clears the stage for Priya. */
  out: 0.6,
} as const

/** Meet Priya. */
export const PRIYA_TIME = {
  /** Her photo and her words arrive… */
  in: 1.5,
  /** …rest, long enough to read who she is and her first line (Auto-play)… */
  hold: 4.4,
  /** …and her photo irises down into the avatar that carries her words from here on. */
  out: 1.1,
} as const

/** The chapter card between her Tuesday and Piramal Mind. */
export const CHAPTER_TIME = {
  in: 1.4,
  /** The card that sets Piramal Mind apart from her day: it is all words, so it rests until they are read (Auto-play). */
  hold: 5.0,
  out: 0.45,
} as const

/** The closing: the five names once more. */
export const FINALE_TIME = {
  /** "That is Everyday AI" takes the stage… */
  say: 1.0,
  /** …rests (Auto-play; manual passes straight through)… */
  hold: 1.3,
  /** …then docks, and the five names arrive in their cards. */
  names: 3.2,
  /** Auto-play: the closing returns to the opening screen, the one that explains, for the next visitor. */
  idle: 20,
} as const

export const CUT = {
  /** A jump that is not part of the film's own flow turns the stage like a page: out, then in… */
  out: 0.22,
  in: 0.6,
  /** …travelling this far (in units of --u) the way the film runs. */
  travel: 6,
} as const
