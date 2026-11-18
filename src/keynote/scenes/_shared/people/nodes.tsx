import type { CSSProperties } from 'react'
import { pic } from '../../../kit'
import { ALL, RECEIPT_MASK, type NodeDef } from './data'

/** The CSS width of a node at its largest: its size in --u, never more than the picture's own pixels. */
export function nodeWidth(d: NodeDef): string {
  return `min(calc(var(--u) * ${d.w}), ${d.cap ?? d.px[0]}px)`
}

/** A box of a node's largest size and its picture's own proportions: the place a print holds on a card. */
export function Slot({ id, className = '' }: { id: string; className?: string }) {
  const d = ALL.find((x) => x.id === id)!
  const ratio = d.kind === 'print' ? `${d.px[0]} / ${d.px[1]}` : '1 / 1'
  return <div className={`people-slot ${className}`} data-slot={id} style={{ width: nodeWidth(d), aspectRatio: ratio }} />
}

function Face({ d }: { d: NodeDef }) {
  const src = pic(d.n, d.file)
  if (d.circle) {
    // the face's own circle inside a larger cut-out: placed by its pixels, never resampled unevenly
    const [l, t, dia] = d.circle
    const style: CSSProperties = {
      position: 'absolute',
      width: `${(d.px[0] / dia) * 100}%`,
      height: 'auto',
      left: `${(-l / dia) * 100}%`,
      top: `${(-t / dia) * 100}%`,
      maxWidth: 'none',
    }
    return (
      <span className="people-face">
        <img src={src} alt="" draggable={false} decoding="async" style={style} />
      </span>
    )
  }
  return (
    <span className={`people-face ${d.whole ? 'people-face--whole' : ''}`}>
      <img src={src} alt="" draggable={false} decoding="async" />
    </span>
  )
}

function Node({ d }: { d: NodeDef }) {
  const style = { '--people-w': nodeWidth(d) } as CSSProperties
  if (d.kind === 'print') {
    return (
      <div className={`people-node people-node--print ${d.paper ? 'people-node--paper' : ''}`} data-node={d.id} style={{ ...style, aspectRatio: `${d.px[0]} / ${d.px[1]}` }}>
        {d.paper ? (
          <>
            <i className="people-sheet people-sheet--b" />
            <i className="people-sheet people-sheet--a" />
          </>
        ) : null}
        <span className="people-print">
          <img src={pic(d.n, d.file)} alt="" draggable={false} decoding="async" />
          {d.id === 'receipt' ? (
            <i
              className="people-mask"
              style={{ left: `${RECEIPT_MASK[0] * 100}%`, top: `${RECEIPT_MASK[1] * 100}%`, width: `${RECEIPT_MASK[2] * 100}%`, height: `${RECEIPT_MASK[3] * 100}%` }}
            />
          ) : null}
        </span>
      </div>
    )
  }
  return (
    <div className={`people-node people-node--${d.kind}`} data-node={d.id} style={style}>
      {d.kind === 'ai' ? (
        <>
          <i className="people-ping" />
          <i className="people-orbit" />
        </>
      ) : null}
      <Face d={d} />
    </div>
  )
}

/** Every node of the mesh, once. mesh.ts places them. */
export function MeshNodes() {
  return (
    <div className="people-mesh">
      {ALL.map((d) => (
        <Node key={d.id} d={d} />
      ))}
    </div>
  )
}

export const PEOPLE_PRELOAD: string[] = ALL.map((d) => pic(d.n, d.file))
