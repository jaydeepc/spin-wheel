'use client'

import { count, deck } from './active'
import type { SceneModule } from './types'

/**
 * LAZY SCENES. Each scene (scenes/sNN/index.tsx, with its stylesheet and whatever it imports)
 * is its own chunk, fetched the first time its slide is asked for and kept. Nothing here needs
 * editing when a scene is built: the folder is found by its name (the deck's own `load`, see
 * core/active.tsx and keynoteDeck.ts).
 */
const cache = new Map<string, Promise<SceneModule>>()

export function loadScene(n: number): Promise<SceneModule> {
  const d = deck()
  const key = `${d.key}:${n}`
  let p = cache.get(key)
  if (!p) {
    p = d.load(n).then((m) => m.default)
    p.catch(() => cache.delete(key))
    cache.set(key, p)
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
    if (m < 1 || m > count()) continue
    loadScene(m)
      .then((mod) => preload(mod.preload, 8000))
      .catch(() => {})
  }
}
