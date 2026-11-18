'use client'

import { COUNT, pad } from '../deck'
import type { SceneModule } from './types'

/**
 * LAZY SCENES. Each scene (scenes/sNN/index.tsx, with its stylesheet and whatever it imports)
 * is its own chunk, fetched the first time its slide is asked for and kept. Nothing here needs
 * editing when a scene is built: the folder is found by its name.
 */
const cache = new Map<number, Promise<SceneModule>>()

export function loadScene(n: number): Promise<SceneModule> {
  let p = cache.get(n)
  if (!p) {
    p = import(`../scenes/s${pad(n)}/index`).then((m: { default: SceneModule }) => m.default)
    p.catch(() => cache.delete(n))
    cache.set(n, p)
  }
  return p
}

/** Pictures that have been asked for, kept so the browser keeps them decoded. */
const pictures = new Map<string, Promise<void>>()

export function preload(urls: string[] | undefined, patience = 1500): Promise<void> {
  if (!urls?.length || typeof window === 'undefined') return Promise.resolve()
  const all = urls.map((src) => {
    let p = pictures.get(src)
    if (!p) {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
      p = img.decode().catch(() => {})
      ;(p as Promise<void> & { img?: HTMLImageElement }).img = img
      pictures.set(src, p)
    }
    return p
  })
  return Promise.race([Promise.all(all).then(() => {}), new Promise<void>((r) => setTimeout(r, patience))])
}

/** Fetch the neighbours of slide n ahead of the press that will ask for them. */
export function warm(n: number) {
  for (const m of [n + 1, n - 1]) {
    if (m < 1 || m > COUNT) continue
    loadScene(m)
      .then((mod) => preload(mod.preload, 8000))
      .catch(() => {})
  }
}
