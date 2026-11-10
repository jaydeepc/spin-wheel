export type Platform = 'BYOT' | 'BYOA'

export interface Metric {
  /** Shown big. Free text so "₹4.2 Cr", "6 hrs → 20 min" and "92%" all work. */
  value: string
  label: string
}

/** The person who built it. One, or at most two, per use case. */
export interface Person {
  name: string
  /** Role and team, e.g. "Area Collections Manager · Collections" */
  role: string
  /** A sentence or two on who they are and what they do day to day. Shows they are not from Tech. */
  bio: string
  /** Portrait as a small square data URL (resized in the admin page). Empty shows a placeholder. */
  photo: string
}

export interface UseCase {
  id: string
  /** Short name printed on the wheel segment (keep under ~20 characters). */
  wheelLabel: string
  title: string
  /** Function / team that built it: HR, Collections, Operations… */
  team: string
  platform: Platform
  /** One or two sentences under the title. */
  summary: string
  oldWay: string
  problem: string
  solution: string
  newWay: string
  /** What the creator says about it, in their own words. Attributed to the first person. */
  quote: string
  metrics: Metric[]
  people: Person[]
  /** Hidden use cases stay in admin but are left off the wheel. */
  active: boolean
}

export interface Settings {
  sound: boolean
  /** Seconds the wheel spins before stopping on its own if nobody hits the button. */
  autoStopSeconds: number
}

export interface Showcase {
  version: 1
  useCases: UseCase[]
  settings: Settings
}

export const MAX_USE_CASES = 20
export const MAX_METRICS = 3
export const MAX_PEOPLE = 2

/** Character limits, shared by the admin form, the parser and the page layout. */
export const LIMITS = {
  wheelLabel: 24,
  title: 60,
  team: 40,
  summary: 150,
  story: 150,
  quote: 200,
  metricValue: 16,
  metricLabel: 50,
  personName: 40,
  personRole: 60,
  personBio: 170,
  /** Longest photo data URL accepted (about 90 KB of image). */
  photo: 120_000,
} as const
