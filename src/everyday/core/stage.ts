'use client'

/**
 * The stage: a point at the centre of the screen. Everything in a scene is placed from
 * it in units of --u, so one layout holds from a phone on its side to a 4K wall.
 */

export interface Box {
  x: number
  y: number
  w: number
  h: number
  cx: number
  cy: number
}

export interface Stage {
  /** One fluid unit (the CSS --u) in pixels. */
  U: number
  /** The stage's own scale (1, or a little more on a phone on its side). */
  Z: number
  /** Half the width of the content field, in stage pixels: content runs from -hx to +hx. */
  hx: number
  /** A phone on its side (short screen): its own layout numbers, and type held to its floors. */
  small: boolean
  /** Re-read U, Z and the stage origin (call after a resize, before measuring). */
  measure(): void
  /**
   * An element's box in stage pixels, measured from the stage centre, as it is drawn
   * right now. The numbers work directly as gsap x / y for an element placed at
   * left:0; top:0 in the stage (or in a moment's Extras layer).
   */
  loc(el: Element): Box
  /** The same, for a rectangle already read from the screen (a text range, say). */
  box(r: { left: number; top: number; width: number; height: number }): Box
}

export function createStage(stageEl: HTMLElement): Stage {
  const probe = stageEl.querySelector('.ev-probe') as HTMLElement
  const probeHx = stageEl.querySelector('.ev-probe-hx') as HTMLElement
  let origin = { left: 0, top: 0 }
  const stage: Stage = {
    U: 16,
    Z: 1,
    hx: 700,
    small: false,
    measure() {
      stage.U = probe.offsetWidth / 100 || 16
      stage.Z = probe.getBoundingClientRect().width / (probe.offsetWidth || 1) || 1
      stage.hx = probeHx.offsetWidth || 46 * stage.U
      stage.small = window.innerHeight <= 480
      const r = stageEl.getBoundingClientRect()
      origin = { left: r.left, top: r.top }
    },
    loc(el) {
      return stage.box(el.getBoundingClientRect())
    },
    box(r) {
      const x = (r.left - origin.left) / stage.Z
      const y = (r.top - origin.top) / stage.Z
      const w = r.width / stage.Z
      const h = r.height / stage.Z
      return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 }
    },
  }
  stage.measure()
  return stage
}
