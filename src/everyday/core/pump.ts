'use client'

import gsap from 'gsap'

/**
 * Some hosts (embedded previews, panes that are open but not painting) stop sending
 * animation frames while the page still counts as visible. The film then keeps time
 * from a timer instead, and CSS transitions and animations are moved on by hand.
 */
export function startPump(root: HTMLElement): () => void {
  let lastRaf = performance.now()
  let lastPump = lastRaf
  let rafId = requestAnimationFrame(function beat() {
    lastRaf = performance.now()
    rafId = requestAnimationFrame(beat)
  })
  const pump = setInterval(() => {
    const now = performance.now()
    const dt = now - lastPump
    lastPump = now
    if (document.visibilityState !== 'visible' || now - lastRaf < 140) return
    gsap.ticker.tick()
    void root.offsetWidth
    root.getAnimations({ subtree: true }).forEach((a) => {
      if (a.playState === 'running' && typeof a.currentTime === 'number') a.currentTime = a.currentTime + dt
    })
  }, 16)
  return () => {
    cancelAnimationFrame(rafId)
    clearInterval(pump)
  }
}
