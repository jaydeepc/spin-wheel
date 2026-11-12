'use client'

import { useEffect, type RefObject } from 'react'
import gsap from 'gsap'
import type { SceneId } from '../store'
import { useEveryday } from '../store'
import { director, type SceneHandle } from './director'
import { motion, type Eases } from './motion'
import type { Stage } from './stage'

/**
 * A scene's one job: build its paused timeline and hand it to the director.
 * `build` runs inside a gsap.context scoped to the scene's root, so everything it
 * creates (tweens, sets, SplitText) is undone when the scene leaves or the screen
 * is resized, and then it is simply called again.
 */
export function useScene(
  scene: SceneId,
  ref: RefObject<HTMLElement | null>,
  build: (root: HTMLElement, stage: Stage, ease: Eases) => SceneHandle,
) {
  const tick = useEveryday((s) => s.layoutTick)
  useEffect(() => {
    const root = ref.current
    if (!root || !director.stage) return
    const ease = motion()
    director.stage.measure()
    let handle: SceneHandle | null = null
    const ctx = gsap.context(() => {
      handle = build(root, director.stage, ease)
    }, root)
    const off = handle ? director.register(scene, handle) : () => {}
    return () => {
      off()
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])
}
