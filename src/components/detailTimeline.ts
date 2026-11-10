import gsap from 'gsap'

/**
 * The score for the use case page's entrance: the title, then the person who
 * built it, then what they say, then the story and the numbers. Every animated element carries a data-in role (see Detail.tsx).
 * Offsets are in em of the element's own font size, so the motion scales with
 * the screen. Transforms and opacity only.
 */
interface Cue {
  /** Start time in seconds; a list gives one time per element of that role. */
  at: number | number[]
  /** Stagger between elements when `at` is a single time. */
  step?: number
  dur: number
  fade?: boolean
  x?: number
  y?: number
  yPercent?: number
  scale?: number
  scaleX?: number
  scaleY?: number
  origin?: string
  ease?: string
}

const EASE = 'power3.out'
/** When the story's first step arrives, the gap between steps, and when the second half follows the turn. */
const STEP_AT = 2.06
const STEP_GAP = 0.1
const STEP_AFTER_AT = 2.38
const FACT_AT = 2.38
const POP = 'back.out(1.9)'

const SCORE: Record<string, Cue> = {
  // 1 · what it is
  eyebrow: { at: 0.0, dur: 0.5, fade: true, x: -0.8 },
  word: { at: 0.08, step: 0.06, dur: 0.7, yPercent: 115 },
  rule: { at: 0.4, dur: 0.55, fade: true, scaleX: 0, origin: '0 50%' },
  summary: { at: 0.5, dur: 0.6, fade: true, y: 0.9 },
  // 2 · who built it
  creator: { at: 0.8, dur: 0.7, fade: true, y: 1.1, scale: 0.985 },
  'creator-label': { at: 0.95, dur: 0.45, fade: true, x: -0.8 },
  portrait: { at: 1.0, step: 0.14, dur: 0.65, fade: true, scale: 0.82, ease: POP },
  person: { at: 1.1, step: 0.14, dur: 0.6, fade: true, x: 1 },
  claim: { at: 1.4, dur: 0.5, fade: true, y: 0.6 },
  // 3 · what they say
  'quote-mark': { at: 1.5, dur: 0.6, fade: true, scale: 0.5, origin: '0 100%', ease: POP },
  quote: { at: 1.6, dur: 0.75, fade: true, y: 0.7 },
  'quote-by': { at: 1.9, dur: 0.5, fade: true, x: -0.8 },
  // 4 · how the work changed, and the numbers
  'group-wash': { at: [2.0, 2.3], dur: 0.7, fade: true },
  'group-rule': { at: [2.0, 2.3], dur: 0.5, scaleX: 0, origin: '0 50%' },
  'group-tag': { at: [2.05, 2.35], dur: 0.4, fade: true },
  step: { at: STEP_AT, step: STEP_GAP, dur: 0.55, fade: true, y: 0.9 },
  'turn-line': { at: 2.15, dur: 0.45, scaleY: 0, origin: '50% 0' },
  turn: { at: 2.22, dur: 0.5, fade: true, x: -0.6, scale: 0.6, ease: POP },
  'facts-label': { at: 2.3, dur: 0.45, fade: true, x: -0.8 },
  fact: { at: FACT_AT, step: 0.1, dur: 0.5, fade: true, y: 0.8 },
}

const COUNT_SECONDS = 0.7

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const delayOf = (cue: Cue, i: number) =>
  Array.isArray(cue.at) ? cue.at[Math.min(i, cue.at.length - 1)] : cue.at + (cue.step ?? 0) * i

/** Every animated element with its cue and its index within its role, in document order. */
function cast(view: HTMLElement) {
  const seen: Record<string, number> = {}
  const out: { el: HTMLElement; role: string; cue: Cue; i: number }[] = []
  view.querySelectorAll<HTMLElement>('[data-in]').forEach((el) => {
    const role = el.dataset.in ?? ''
    const cue = SCORE[role]
    if (!cue) return
    const i = (seen[role] = role in seen ? seen[role] + 1 : 0)
    out.push({ el, role, cue, i })
  })
  return out
}

/** The second half of the story waits for the turn, even when the first half has only one step. */
function stepDelay(el: HTMLElement, i: number) {
  const after = el.closest('[data-side="after"]')
  const firstHalf = el.closest('.d-story')?.querySelectorAll('[data-side="before"] [data-in="step"]').length ?? 0
  return after && firstHalf ? STEP_AFTER_AT + (i - firstHalf) * STEP_GAP : STEP_AT + i * STEP_GAP
}

function hidden(el: HTMLElement, cue: Cue, still: boolean): gsap.TweenVars {
  if (still) return cue.fade ? { autoAlpha: 0 } : {}
  const em = parseFloat(getComputedStyle(el).fontSize) || 16
  const v: gsap.TweenVars = {}
  if (cue.fade) v.autoAlpha = 0
  if (cue.x !== undefined) v.x = cue.x * em
  if (cue.y !== undefined) v.y = cue.y * em
  if (cue.yPercent !== undefined) v.yPercent = cue.yPercent
  if (cue.scale !== undefined) v.scale = cue.scale
  if (cue.scaleX !== undefined) v.scaleX = cue.scaleX
  if (cue.scaleY !== undefined) v.scaleY = cue.scaleY
  if (cue.origin) v.transformOrigin = cue.origin
  return v
}

function shown(cue: Cue, still: boolean): gsap.TweenVars {
  if (still) return cue.fade ? { autoAlpha: 1 } : {}
  const v: gsap.TweenVars = {}
  if (cue.fade) v.autoAlpha = 1
  if (cue.x !== undefined) v.x = 0
  if (cue.y !== undefined) v.y = 0
  if (cue.yPercent !== undefined) v.yPercent = 0
  if (cue.scale !== undefined) v.scale = 1
  if (cue.scaleX !== undefined) v.scaleX = 1
  if (cue.scaleY !== undefined) v.scaleY = 1
  return v
}

/** "63" → counts 0 → 63; "4,200" keeps its grouping. Null when there is nothing to count. */
function counter(raw: string) {
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  const target = parseFloat(raw.replace(/,/g, ''))
  if (!Number.isFinite(target) || target === 0) return null
  if (!raw.includes(',')) return { target, format: (v: number) => v.toFixed(decimals) }
  const opts = { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
  const locale = ['en-IN', 'en-US'].find((l) => target.toLocaleString(l, opts) === raw)
  if (!locale) return null
  return { target, format: (v: number) => v.toLocaleString(locale, opts) }
}

/** Put every animated element of the use case page into its hidden starting state. */
export function prepareDetail(view: HTMLElement) {
  const still = reduced()
  cast(view).forEach(({ el, cue }) => {
    const v = hidden(el, cue, still)
    if (Object.keys(v).length) gsap.set(el, v)
  })
}

/**
 * Add the use case page's entrance to `tl`, starting at time `C` (seconds).
 * Transforms and opacity only. Returns how long the entrance runs, in seconds.
 */
export function playDetail(view: HTMLElement, tl: gsap.core.Timeline, C: number): number {
  const still = reduced()
  let length = 0
  const starts = new Map<HTMLElement, number>()

  cast(view).forEach(({ el, role, cue, i }) => {
    const at = role === 'step' ? stepDelay(el, i) : delayOf(cue, i)
    starts.set(el, at)
    length = Math.max(length, at + cue.dur)
    const v = shown(cue, still)
    if (!Object.keys(v).length) return
    tl.to(el, { ...v, duration: cue.dur, ease: cue.ease ?? EASE }, C + at)
  })

  // Count up values that are one plain number. The fitted width was measured with the final text.
  if (!still) {
    view.querySelectorAll<HTMLElement>('.d-value[data-count]').forEach((value) => {
      const num = value.querySelector<HTMLElement>('.v-to .n')
      const full = value.dataset.count ?? ''
      const c = counter(full)
      if (!num || !c) return
      const holder = value.closest<HTMLElement>('[data-in="fact"]')
      const at = ((holder && starts.get(holder)) ?? FACT_AT) + 0.05
      const state = { v: 0 }
      num.textContent = c.format(0)
      tl.to(
        state,
        {
          v: c.target,
          duration: COUNT_SECONDS,
          ease: 'power3.out',
          onUpdate: () => {
            num.textContent = c.format(state.v)
          },
          onComplete: () => {
            num.textContent = full
          },
        },
        C + at,
      )
      length = Math.max(length, at + COUNT_SECONDS)
    })
  }

  return length
}
