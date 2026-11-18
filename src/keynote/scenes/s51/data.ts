/**
 * Slides 51 to 54: the BYOT | BYOA wheel, as recorded.
 *
 * The clips and stills are in public/keynote/wheel/. The clips are the four files inside
 * exports/spin-wheel/v2/Spin-Wheel-BYOT.pptx (ppt/media/media1..4.mp4), byte for byte; the stills
 * are frames taken out of those clips, lossless. 1920 x 1080, 60 frames a second, no sound.
 * Every mark below is from exports/_rig/wheel-deck/rec/manifest.json (take.marks), counted in
 * frames of the take; a clip's own frame is that minus the clip's first frame.
 */

export const FPS = 60
/** The picture's own size: the screen is always shown at this ratio. */
export const PX = { w: 1920, h: 1080 }

const at = (name: string) => `/keynote/wheel/${name}`

export const CLIP = {
  /** 01-wheel: the wheel page; the wheel drifts at 5 degrees a second. 132 frames. */
  wheel: { src: at('01-wheel.mp4'), seconds: 2.2 },
  /** 02-spin-up: the press, the wind-back, the run up to full speed. 125 frames; its first frame is 01-wheel's last. */
  up: { src: at('02-spin-up.mp4'), seconds: 125 / FPS },
  /** 03-spinning: one full turn, 54 frames; its first frame follows 02-spin-up's last. */
  loop: { src: at('03-spinning.mp4'), seconds: 0.9 },
  /** 04-stop: the press, the coast, the result, the hand-over, the use case page. 732 frames, from take frame 418. */
  stop: { src: at('04-stop.mp4'), seconds: 12.2 },
}

/**
 * Marks inside 04-stop, in seconds of the clip.
 *   landedAt 700 - 418 = frame 282: the wheel has stopped, the result begins to show
 *   detailAt 857 - 418 = frame 439: the hand-over to the use case page begins
 *   restAt  1119 - 418 = frame 701: the page is at rest
 * The line under the result fills during the 2.6 s the result is held, so the rest "landed" is
 * frame 435: the line is full, the hand-over has not begun.
 */
export const STOP = {
  touchdown: 282 / FPS,
  landed: 435 / FPS,
  page: 705 / FPS,
}

export const STILL = {
  /** 01-wheel, frame 0 */
  wheel0: at('wheel-first.png'),
  /** 01-wheel, frame 131 (= 02-spin-up, frame 0) */
  wheel1: at('wheel-last.png'),
  /** 03-spinning, frame 0 */
  loop0: at('loop-first.png'),
  /** 04-stop, frame 150: the coast, the wheel slow and sharp (only for a held frame inside the move, before the clip has decoded) */
  coast: at('coast.png'),
  /** 04-stop, frame 282: the wheel has just stopped */
  touch: at('touch.png'),
  /** 04-stop, frame 435 */
  landed: at('landed.png'),
  /** 04-stop, frame 520: the wheel has docked, the page is building */
  dock: at('dock.png'),
  /** 04-stop, frame 731 (the same picture from frame 705 on) */
  page: at('page.png'),
}

/** What the screen shows, for those who cannot see it (the words are the wheel app's own, from the take's manifest). */
export const ALT = 'The BYOT | BYOA wheel of this site, recorded: it spins and stops on 01, LI & GI Surrender Verification, built by Praveen Ostwal.'
