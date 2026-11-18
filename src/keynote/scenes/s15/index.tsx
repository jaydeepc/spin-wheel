'use client'

/**
 * Slide 15: the opener of section C, "AI – Year in Retrospect".
 *
 * It is the shared section divider (../_shared/divider.tsx: the agenda in small, the line, the
 * section's block of glass), and because this chapter is about AI in the WORLD a globe stands
 * behind the line: land in fine points, slowly turning, a rim of clear blue, arcs of light
 * (globe.ts). The globe is drawn in the divider's own canvas, so there is still one canvas.
 * It takes the place of the divider's very large outlined letter on this slide; where there is
 * no WebGL there is no globe and the letter is there as on every other divider.
 */

import gsap from 'gsap'
import type { SceneCanvas, SceneModule } from '../../kit'
import { divider } from '../_shared/divider'
import { GLOBE, makeGlobe, type Globe } from './globe'
import './scene.css'

const base = divider(15)
const Divider = base.Scene

const scene: SceneModule = {
  ...base,

  Scene: (props) => (
    <div className="s15">
      <Divider {...props} />
    </div>
  ),

  three(ctx) {
    const off = base.three?.(ctx)
    const glass = ctx.bag.glass as { gl: SceneCanvas } | undefined
    // the globe's meshes are in the divider's scene: its dispose frees them with the rest
    if (glass) ctx.bag.globe = makeGlobe(ctx, glass.gl)
    return off
  },

  build(ctx) {
    const tl = base.build(ctx)
    const globe = ctx.bag.globe as Globe | undefined
    const gl = (ctx.bag.glass as { gl: SceneCanvas } | undefined)?.gl
    if (!globe || !gl) return tl
    const { root, state, rest } = globe
    const p = gl.at(GLOBE.u, GLOBE.v)

    if (ctx.reduced) {
      gsap.set(root.position, { x: p.x, y: p.y, z: 0 })
      gsap.set(root.scale, { x: GLOBE.r, y: GLOBE.r, z: GLOBE.r })
      gsap.set(state, { show: 0, turn: rest, arcs: 1, idle: 0 })
      tl.to(state, { show: 1, duration: 1.2, ease: 'power1.out' }, 0.3)
      return tl
    }

    // it rises behind the line as the line arrives, turning into place, and then only idles
    const k0 = GLOBE.r * 0.9
    gsap.set(root.position, { x: p.x + 2.5, y: p.y - 9, z: 0 })
    gsap.set(root.scale, { x: k0, y: k0, z: k0 })
    gsap.set(state, { show: 0, turn: rest - 1.15, arcs: 0, idle: 0 })
    tl.to(state, { show: 1, duration: 1.5, ease: 'power1.out' }, 0.3)
    tl.to(root.position, { x: p.x, y: p.y, duration: 2.7, ease: 'power3.out' }, 0.3)
    tl.to(root.scale, { x: GLOBE.r, y: GLOBE.r, z: GLOBE.r, duration: 2.7, ease: 'power3.out' }, 0.3)
    tl.to(state, { turn: rest, duration: 2.75, ease: 'power3.out' }, 0.3)
    tl.to(state, { arcs: 1, duration: 1.3, ease: 'power2.inOut' }, 1.7)
    tl.to(state, { idle: 1, duration: 0.8, ease: 'power1.inOut' }, 2.25)
    return tl
  },
}

export default scene
