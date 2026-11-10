import type { Showcase, UseCase } from './types'
import { MAX_METRICS, MAX_PEOPLE, MAX_USE_CASES } from './types'

function sanitiseUseCase(raw: Partial<UseCase>, i: number): UseCase {
  const s = (v: unknown) => (typeof v === 'string' ? v : '')
  return {
    id: s(raw?.id) || `uc_${i}_${Math.random().toString(36).slice(2, 8)}`,
    wheelLabel: s(raw?.wheelLabel) || s(raw?.title) || `Use case ${i + 1}`,
    title: s(raw?.title) || s(raw?.wheelLabel) || `Use case ${i + 1}`,
    team: s(raw?.team),
    platform: raw?.platform === 'BYOA' ? 'BYOA' : 'BYOT',
    summary: s(raw?.summary),
    oldWay: s(raw?.oldWay),
    problem: s(raw?.problem),
    solution: s(raw?.solution),
    newWay: s(raw?.newWay),
    metrics: Array.isArray(raw?.metrics)
      ? raw.metrics.slice(0, MAX_METRICS).map((m) => ({ value: s(m?.value), label: s(m?.label) }))
      : [],
    people: Array.isArray(raw?.people)
      ? raw.people.slice(0, MAX_PEOPLE).map((p) => ({ name: s(p?.name), role: s(p?.role) }))
      : [],
    active: raw?.active !== false,
  }
}

/** Accepts anything (stored JSON, an imported file, a request body) and returns a valid Showcase, or null. */
export function parseShowcase(input: unknown): Showcase | null {
  if (!input || typeof input !== 'object') return null
  const obj = input as Partial<Showcase>
  if (!Array.isArray(obj.useCases)) return null
  const auto = Number(obj.settings?.autoStopSeconds)
  return {
    version: 1,
    useCases: obj.useCases.slice(0, MAX_USE_CASES).map(sanitiseUseCase),
    settings: {
      sound: Boolean(obj.settings?.sound),
      autoStopSeconds: Number.isFinite(auto) && auto >= 5 ? Math.min(auto, 120) : 20,
    },
  }
}
