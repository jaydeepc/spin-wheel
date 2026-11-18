/**
 * Slide 59: the words of the slide, copied from the pack (pack/59/data.json → pillars, the same
 * strings as text.json t02 … t19). Nothing is retyped; nothing is added.
 */
import type { IconName } from './icons'

export interface Pillar {
  key: string
  icon: IconName
  /** data.json → pillars[i].title */
  title: string
  /** data.json → pillars[i].line */
  line: string
  /** data.json → pillars[i].tech */
  tech: string
  /**
   * Where the technology line is broken into two: after this many of its ' · ' items. The words
   * are the pack's; only the place of the line break is chosen, so that no product name
   * ("RTX PRO 6000") is cut in two and no line begins or ends with a separator.
   */
  breakAfter?: number
}

/** The technology line as the lines it is set in (see `breakAfter`). */
export const techLines = (p: Pillar): string[] => {
  if (!p.breakAfter) return [p.tech]
  const items = p.tech.split(' · ')
  return [items.slice(0, p.breakAfter).join(' · '), items.slice(p.breakAfter).join(' · ')]
}

export const PILLARS: Pillar[] = [
  { key: 'hardware', icon: 'cpu', title: 'GPU hardware', line: 'Right chip for every model', tech: 'H100 · RTX PRO 6000 · L40S · L4', breakAfter: 2 },
  { key: 'virtualization', icon: 'layers', title: 'GPU virtualization', line: 'One GPU, many models', tech: 'Per-workload resource limits' },
  { key: 'scheduling', icon: 'sliders', title: 'Scheduling & scaling', line: 'Capacity follows demand', tech: 'KAI fair share · KEDA auto-scaling', breakAfter: 1 },
  { key: 'models', icon: 'box', title: 'Model management', line: 'Every model versioned', tech: 'S3 + MLflow · streamed or cached weights' },
  { key: 'runtime', icon: 'zap', title: 'Inference runtime', line: 'Fast, flexible model serving', tech: 'vLLM · TensorRT-LLM · TensorRT · FastAPI', breakAfter: 2 },
  { key: 'observability', icon: 'activity', title: 'Observability', line: 'See from request to GPU', tech: 'Grafana + NVIDIA DCGM' },
]

/**
 * The two ends of the headline (t01: "Six pillars turn open models into in-house AI"), set on
 * the structure itself: what the pillars stand on, and what they carry. Substrings of the
 * headline, cut out of slide.title at run time (see index.tsx), never retyped.
 */
export const GROUND_WORDS = 'open models'
export const ROOF_WORDS = 'in-house AI'

/**
 * THE STRUCTURE, in stage units (--u). One set of numbers for the stylesheet (through inline
 * custom properties) and for the three.js meshes, so the words sit exactly on the stone.
 */
export const L = {
  /** a pillar's width, the gap between two, the first one's left edge */
  colW: 13,
  gap: 1.9,
  x0: 6.25,
  /** the beam: its top and its bottom (the pillars' tops) */
  roofTop: 13.5,
  roofBot: 17.6,
  /** the flame band at the head of a pillar */
  capH: 0.9,
  /** the ground slab: its top (the pillars' feet) and its bottom */
  baseTop: 43.4,
  baseBot: 47.3,
  /** the slabs' left and right ends */
  slabX0: 4.9,
  slabX1: 95.1,
  /** depths, in world units (= --u at the stage's plane) */
  depth: 6,
  slabDepth: 9.5,
  /** how far the slabs stand out in front of the pillars' faces */
  slabFront: 0.9,
} as const

export const colX = (i: number) => L.x0 + i * (L.colW + L.gap)
/** How far a pillar travels as it rises out of the ground slab. */
export const RISE = L.baseTop - L.roofBot + 0.4
