export type Platform = 'BYOT' | 'BYOA'

export interface Metric {
  /** Shown big. Free text so "₹4.2 Cr", "6 hrs → 20 min" and "92%" all work. */
  value: string
  label: string
}

export interface Person {
  name: string
  /** Role and function, e.g. "Area Collections Manager · Collections" */
  role: string
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
export const MAX_METRICS = 4
export const MAX_PEOPLE = 6
