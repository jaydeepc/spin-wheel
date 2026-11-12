import { SCENES, type SceneId } from '../store'

/**
 * Debug URLs.
 *
 *   /everyday-ai?scene=<intro|priya|smarthelp|byot|byoa|prastuti|engineering|mind|finale>
 *        starts the film at that scene (it plays normally from there)
 *   …&at=<label>&dt=<seconds>
 *        HOLDS that scene at that label of its timeline, dt seconds further on (dt may be
 *        negative). Nothing advances by itself.
 *
 *        a product moment   before | name | demo | ran | result | stat | done
 *        intro              title | say | pillars | idle | done
 *        priya              in | done
 *        engineering        day | in | done
 *        finale             say | names | done
 *        any scene          start (time 0)
 *
 *   ?manual   manual mode: wait for a tap at every step
 */
export interface DebugParams {
  scene: SceneId | null
  at: string | null
  dt: number
  manual: boolean
}

const flag = (p: URLSearchParams, name: string) => p.has(name) && p.get(name) !== '0' && p.get(name) !== 'false'

export function readDebug(): DebugParams {
  const p = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search)
  const scene = p.get('scene') as SceneId | null
  const at = p.get('at')
  return {
    scene: scene && SCENES.includes(scene) ? scene : null,
    at: at || null,
    dt: Number(p.get('dt') ?? 0) || 0,
    manual: flag(p, 'manual'),
  }
}
