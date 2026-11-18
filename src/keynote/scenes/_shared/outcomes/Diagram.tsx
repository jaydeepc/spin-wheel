/**
 * "Top 5 Outcomes of Piramal.ai": the petal diagram of slides 8 and 32, as DOM.
 *
 *   <OutcomesDiagram>                      // the hub (white disc, ring), five badges, five labels
 *     <Headline className="oc-title" text={slide.title} flame={['Piramal.ai']} />
 *   </OutcomesDiagram>
 *   <OutcomesDiagram tags={['…', …]}>      // + a small tag in each petal (slide 32's stories)
 *
 * The petals themselves are three.js (petals.ts) on a canvas under this DOM. Where there is no
 * WebGL the flat petals in .oc-flat stand in for them (the stylesheet hides them when the scene
 * carries data-gl="1").
 *
 * Layers, back to front: [canvas: petals] · flat petals · the hub · the title · badges · words.
 */

import type { CSSProperties, ReactNode } from 'react'
import { Words } from '../../../kit'
import { BADGE_R, DISC, onRing, OUTCOMES, outlinePath } from './data'
import { ICONS } from './icons'
import './outcomes.css'

const u = (n: number) => `calc(var(--u) * ${n})`

/** Where the ring's line runs: in the small gap between the disc and the petals. */
const RIM = DISC.r + 0.3
/** The ring's line begins a little before the first badge. */
const LEAD = 20

/** An arc of the rim from one stage angle to another (degrees; the angles fall as the ring is walked left to right). */
function arc(from: number, to: number): string {
  const a = ((from * Math.PI) / 180) as number
  const b = (to * Math.PI) / 180
  const p = (t: number) => `${(RIM * Math.cos(t)).toFixed(3)} ${(RIM * Math.sin(t)).toFixed(3)}`
  return `M${p(a)}A${RIM} ${RIM} 0 0 0 ${p(b)}`
}

const TICKS = Array.from({ length: 120 }, (_, k) => {
  const a = (k / 120) * Math.PI * 2
  const major = k % 5 === 0
  const r1 = DISC.r - 0.75
  const r0 = r1 - (major ? 0.62 : 0.3)
  return {
    k,
    major,
    x0: r0 * Math.cos(a),
    y0: r0 * Math.sin(a),
    x1: r1 * Math.cos(a),
    y1: r1 * Math.sin(a),
  }
})

export interface OutcomesDiagramProps {
  /** The title: a <Headline className="oc-title" …> with the slide's own words. */
  children?: ReactNode
  /** One small tag per petal, in the outcomes' order (null for none). */
  tags?: (string | null)[]
}

export function OutcomesDiagram({ children, tags }: OutcomesDiagramProps) {
  const box = `${-DISC.r - 1} ${-DISC.r - 1} ${DISC.r * 2 + 2} ${DISC.r * 2 + 2}`
  return (
    <div className="oc">
      {/* the petals without WebGL */}
      <svg className="oc-flat" viewBox="0 0 100 56.25" aria-hidden="true">
        {OUTCOMES.map((o) => (
          <path key={o.key} className="oc-flat-petal" data-tone={o.tone} d={outlinePath(o.outline)} />
        ))}
      </svg>

      {/* slide 8: the places of the petals still to come, barely there */}
      <svg className="oc-ghosts" viewBox="0 0 100 56.25" aria-hidden="true">
        {OUTCOMES.map((o) => (
          <path key={o.key} className="oc-ghost" data-tone={o.tone} d={outlinePath(o.outline)} />
        ))}
      </svg>

      {/* the hub: the white disc and its ring */}
      <div className="oc-sky">
        <div
          className="oc-hub"
          style={{
            left: u(DISC.cx - DISC.r - 1),
            top: u(DISC.cy - DISC.r - 1),
            width: u(DISC.r * 2 + 2),
            height: u(DISC.r * 2 + 2),
          }}
        >
          <span className="oc-disc" aria-hidden="true" />
          <svg className="oc-ticks" viewBox={box} aria-hidden="true">
            {TICKS.map((t) => (
              <line key={t.k} className={t.major ? 'oc-tick oc-tick--major' : 'oc-tick'} x1={t.x0.toFixed(3)} y1={t.y0.toFixed(3)} x2={t.x1.toFixed(3)} y2={t.y1.toFixed(3)} />
            ))}
          </svg>
          <span className="oc-glint" aria-hidden="true" />
          <svg className="oc-rim" viewBox={box} aria-hidden="true">
            <circle className="oc-rim-track" r={RIM} />
            {OUTCOMES.map((o, i) => (
              <path key={o.key} className="oc-arc" d={arc(i ? OUTCOMES[i - 1].angle : OUTCOMES[0].angle + LEAD, o.angle)} />
            ))}
            {OUTCOMES.map((o) => {
              const [x, y] = onRing(o.angle)
              return <circle key={o.key} className="oc-seed" cx={(x - DISC.cx).toFixed(3)} cy={(y - DISC.cy).toFixed(3)} r="0.62" />
            })}
            {/* the light that walks the ring: it stands at the first badge's angle and is turned from there */}
            <g className="oc-spark">
              <circle className="oc-spark-halo" cx={(RIM * Math.cos((OUTCOMES[0].angle * Math.PI) / 180)).toFixed(3)} cy={(RIM * Math.sin((OUTCOMES[0].angle * Math.PI) / 180)).toFixed(3)} r="1.5" />
              <circle className="oc-spark-core" cx={(RIM * Math.cos((OUTCOMES[0].angle * Math.PI) / 180)).toFixed(3)} cy={(RIM * Math.sin((OUTCOMES[0].angle * Math.PI) / 180)).toFixed(3)} r="0.46" />
            </g>
          </svg>
        </div>
      </div>

      {children}

      {OUTCOMES.map((o, i) => (
        <div className="oc-item" key={o.key} data-tone={o.tone} data-key={o.key}>
          <div
            className="oc-words"
            style={
              {
                '--oc-ox': u(o.centroid[0]),
                '--oc-oy': u(o.centroid[1]),
              } as CSSProperties
            }
          >
            <p className="oc-label" style={{ left: u(o.label[0]), top: u(o.label[1]) }}>
              {o.lines.map((line) => (
                <span className="oc-line" key={line}>
                  <Words text={line} />
                </span>
              ))}
            </p>
            {tags?.[i] ? (
              <span className="oc-tag-slot" style={{ left: u(o.label[0]), top: u(o.label[1]) }}>
                <span className="oc-tag">
                  <span className="oc-tag-text">{tags[i]}</span>
                  <svg className="oc-tag-go" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h13M12.5 6 18.5 12l-6 6" />
                  </svg>
                </span>
              </span>
            ) : null}
          </div>
          <span
            className="oc-badge"
            style={{
              left: u(o.badge[0] - BADGE_R),
              top: u(o.badge[1] - BADGE_R),
              width: u(BADGE_R * 2),
              height: u(BADGE_R * 2),
            }}
            aria-hidden="true"
          >
            <i className="oc-halo" />
            <i className="oc-face">{ICONS[o.key]}</i>
          </span>
        </div>
      ))}
    </div>
  )
}
