/**
 * The five badge icons of the outcomes diagram, redrawn as vector with the deck's own pictures
 * as the reference (pack/08: four white glyphs in vector/diagram-outcomes.svg and one 69 px
 * raster, icon-gears-clock-white.png, which the deck already shows larger than its pixels):
 *
 *   underwrite     a document and a pen
 *   productivity   a gear, a clock and two rising arrows
 *   growth         a bar chart with a rising arrow
 *   cx             a person under three stars
 *   build          a head in profile with a circuit inside
 *
 * One hand for all five: a white line of one weight on a 48 x 48 grid, round ends. Strokes carry
 * .oc-ink (they draw themselves), filled parts carry .oc-dot (they follow).
 */

import type { ReactNode } from 'react'
import type { OutcomeKey } from './data'

const ink = { className: 'oc-ink', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const dot = { className: 'oc-dot', fill: 'currentColor', stroke: 'none' }

/** A gear's outline: `n` teeth between the root circle `r` and the tip circle `R`. */
function gear(cx: number, cy: number, n: number, R: number, r: number): string {
  const p = (rad: number, deg: number) => {
    const a = (deg * Math.PI) / 180
    return `${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`
  }
  const step = 360 / n
  let d = ''
  for (let k = 0; k < n; k++) {
    const a = k * step - 90
    d += `${k ? 'L' : 'M'}${p(r, a - step * 0.3)}L${p(R, a - step * 0.17)}L${p(R, a + step * 0.17)}L${p(r, a + step * 0.3)}`
    d += `A${r} ${r} 0 0 1 ${p(r, a + step * 0.7)}`
  }
  return `${d}Z`
}

/** A five-pointed star. */
function star(cx: number, cy: number, R: number): string {
  let d = ''
  for (let k = 0; k < 10; k++) {
    const a = ((k * 36 - 90) * Math.PI) / 180
    const rad = k % 2 ? R * 0.44 : R
    d += `${k ? 'L' : 'M'}${(cx + rad * Math.cos(a)).toFixed(2)} ${(cy + rad * Math.sin(a)).toFixed(2)}`
  }
  return `${d}Z`
}

const GEAR = gear(19, 26.5, 8, 11.4, 8.3)

export const ICONS: Record<OutcomeKey, ReactNode> = {
  underwrite: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path {...ink} d="M23.5 41.5H12.5a3 3 0 0 1-3-3v-29a3 3 0 0 1 3-3H26l8.5 8.5V20" />
      <path {...ink} d="M26 6.5V12a3 3 0 0 0 3 3h5.5" />
      <path {...ink} d="M15.5 21.5h11" />
      <path {...ink} d="M15.5 27.5h7.5" />
      <path {...ink} d="M15.5 33.5h4.5" />
      <path {...ink} d="m26.5 41 1.9-6.6 10.8-10.8a3.3 3.3 0 0 1 4.7 4.7L33.1 39.1Z" />
      <path {...ink} d="m36.4 26.4 4.7 4.7" />
    </svg>
  ),
  productivity: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      {/* the clock stands in front of the gear: the gear is cut away behind it */}
      <mask id="oc-gear-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
        <rect width="48" height="48" fill="#fff" />
        <circle cx="35.5" cy="35.5" r="10.6" fill="#000" />
      </mask>
      <g mask="url(#oc-gear-cut)">
        <path {...ink} d={GEAR} />
        <circle {...ink} cx="19" cy="26.5" r="3.7" />
      </g>
      <path {...ink} d="M32.5 19.5V7" />
      <path {...ink} d="m27.8 11.7 4.7-4.7 4.7 4.7" />
      <path {...ink} d="M42 23v-9" />
      <path {...ink} d="m38.3 17.7 3.7-3.7 3.7 3.7" />
      <circle {...ink} cx="35.5" cy="35.5" r="7.7" />
      <path {...ink} d="M35.5 31.2v4.6l3 1.9" />
    </svg>
  ),
  growth: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path {...ink} d="M7.5 7.5v33h33.5" />
      <path {...ink} d="M14.5 40.5V32.5h5.5v8" />
      <path {...ink} d="M24.5 40.5V26h5.5v14.5" />
      <path {...ink} d="M34.5 40.5V19h5.5v21.5" />
      <path {...ink} d="M13.5 23.5 28.5 8.5" />
      <path {...ink} d="M20.5 8.5h8v8" />
    </svg>
  ),
  cx: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle {...ink} cx="24" cy="24.5" r="5.6" />
      <path {...ink} d="M11.5 42.5v-1.6a8.4 8.4 0 0 1 8.4-8.4h8.2a8.4 8.4 0 0 1 8.4 8.4v1.6" />
      <path {...dot} d={star(11.5, 10.6, 4.3)} />
      <path {...dot} d={star(24, 8, 5)} />
      <path {...dot} d={star(36.5, 10.6, 4.3)} />
    </svg>
  ),
  build: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path {...ink} d="M16.5 42.5V36C11 32.9 7.5 27.6 7.5 21.5 7.5 12.9 14.7 6 23.6 6c8.4 0 15.2 6.2 15.4 14.3v1.9l3.6 6.6H39v4.9a3.6 3.6 0 0 1-3.6 3.6H31v5.2" />
      <path {...ink} d="M17.3 16.5h5.4l4 4v5.2" />
      <path {...ink} d="M24.6 11v3.4l4.9 4.9h2.9" />
      <path {...ink} d="M13.6 24.2h5.6l3.5 3.5v3" />
      <circle {...dot} cx="15.6" cy="16.5" r="1.9" />
      <circle {...dot} cx="26.7" cy="27.5" r="1.9" />
      <circle {...dot} cx="24.6" cy="9.2" r="1.9" />
      <circle {...dot} cx="34.2" cy="19.3" r="1.9" />
      <circle {...dot} cx="11.8" cy="24.2" r="1.9" />
      <circle {...dot} cx="22.7" cy="32.5" r="1.9" />
    </svg>
  ),
}
