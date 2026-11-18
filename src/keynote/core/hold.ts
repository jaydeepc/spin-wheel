import { COUNT } from '../deck'

/**
 * Hold URLs: for checking a frame, and later for recording.
 *
 *   /keynote                         slide 1; its first beat plays by itself
 *   /keynote?s=17                    slide 17, resting at its first rest
 *   /keynote?s=17&at=<beat>          slide 17, resting at that named rest
 *   /keynote?s=17&at=<beat>&dt=0.6   0.6 s into the move that LEADS to that rest
 *   /keynote?s=17&at=<beat>&dt=-0.3  0.3 s before that rest is reached
 *   …&chrome=0                       the navigation chrome is hidden; the layout does not change
 *   …&still=1                        everything that idles is stopped: the backdrop's clock, a scene's own
 *                                    idle loops (ctx.held), the chrome's transitions. Two shots are identical.
 *   …&warm=0                         the neighbouring slides are NOT fetched ahead (a checking tool is not
 *                                    disturbed by a neighbour's scene being edited)
 *
 * With `dt` the frame is HELD: nothing moves until a key is pressed. Next then carries on to the
 * rest, Back goes to the rest before.
 */
export interface Hold {
  /** A slide was asked for (?s=). */
  asked: boolean
  s: number
  at: string | null
  /** null: rest exactly at `at`. */
  dt: number | null
  chrome: boolean
  still: boolean
  /** Fetch the neighbouring slides ahead. */
  warm: boolean
}

export function readHold(): Hold {
  const p = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
  const raw = Number(p.get('s'))
  const asked = p.has('s') && Number.isFinite(raw) && raw >= 1
  const dt = p.has('dt') ? Number(p.get('dt')) : NaN
  return {
    asked,
    s: asked ? Math.min(COUNT, Math.max(1, Math.round(raw))) : 1,
    at: p.get('at') || null,
    dt: Number.isFinite(dt) ? dt : null,
    chrome: !(p.get('chrome') === '0' || p.get('chrome') === 'false'),
    still: p.get('still') === '1',
    warm: p.get('warm') !== '0',
  }
}

/** Keeps ?s= in step with the slide on screen, so a reload (or a hot reload) comes back to it. */
export function writeSlide(n: number) {
  if (typeof window === 'undefined') return
  const u = new URL(window.location.href)
  u.searchParams.set('s', String(n))
  u.searchParams.delete('at')
  u.searchParams.delete('dt')
  window.history.replaceState(null, '', u)
}
