'use client'

/**
 * The frame every product moment is drawn in. It renders everything the five share and
 * leaves three holes for the module: Before, Screen, Stat (and the optional Proof, OnDevice, Extras).
 * The motion is in core/buildMoment.ts.
 *
 * THE LAYOUT (moments/README.md): down the left, three slots, always in the same place
 *
 *   the NAME slot        the docked name, and its one-line caption (the promise) at the demo rest
 *   the STATEMENT slot   at most one headline; at the number step, the number and its label
 *   PRIYA'S VOICE        her bubble (the shell draws it: shell/Shell.tsx)
 *
 * and on the right ONE picture, in the picture area (.ev-picarea): the old-way picture, then the
 * device, then the picture of the number. Nothing else: no copy beside the device, no photo,
 * no side column.
 */

import { useRef, type CSSProperties } from 'react'
import type { Product } from '../content'
import { buildMoment } from '../core/buildMoment'
import { useScene } from '../core/useScene'
import { LaptopFrame, PhoneFrame, Rise, sentences } from './parts'
import type { MomentModule } from './types'

/** "~15%" → ["~", "15", "%"], "18 min" → ["", "18", " min"]. */
function splitStat(value: string): [string, string, string] {
  const m = /^([^\d]*)([\d.,]+)(.*)$/.exec(value)
  return m ? [m[1], m[2], m[3]] : ['', value, '']
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Moment({ product, module }: { product: Product; module: MomentModule<any> }) {
  const ref = useRef<HTMLDivElement>(null)
  useScene(product.key, ref, (root, stage, ease) => buildMoment(root, stage, ease, product, module))

  const device = module.device ?? 'phone'
  const kind = product.expansion ? 'acronym' : product.devanagari ? 'hindi' : 'plain'
  const nameSize = Math.min(26, 74 / (product.name.length * 0.6))
  const [pre, num, post] = splitStat(product.stat.value)
  const { Before, Screen, Stat, Proof, Extras, OnDevice } = module

  return (
    <div
      ref={ref}
      className="ev-moment"
      data-key={product.key}
      data-accent={product.accent}
      data-device={device}
      data-before-h={module.beforeHeadline ? '1' : '0'}
      data-name={kind}
    >
      {/* where the ONE picture stands: measured by core/buildMoment.ts, never drawn */}
      <i className="ev-picarea" />
      <i className="ev-picarea ev-picarea--before" />
      <i className="ev-picarea ev-picarea--above" />

      {/* ---------- before: the old way. A picture and a small tag; Priya's bubble tells it. ---------- */}
      <div className="ev-before">
        <div className="ev-before-pic" role="img" aria-label={product.before.headline}>
          <Before product={product} />
        </div>
        <p className="ev-before-tag">Before</p>
      </div>
      {/* (only where her line does not tell the old way itself: Piramal Mind) */}
      {module.beforeHeadline ? (
        <p className="ev-before-h">
          <Rise>{sentences(product.before.headline)}</Rise>
        </p>
      ) : null}

      {/* ---------- THE NAME ---------- */}
      <i className="ev-flash" />
      <div className="ev-name" aria-label={product.expansion ? `${product.name}: ${product.expansion.join(' ')}` : product.name}>
        {kind === 'acronym' ? (
          <>
            {product.expansion!.map((word) => (
              <span className="ev-tail" key={`t-${word}`} aria-hidden="true">
                {word.slice(1)}
              </span>
            ))}
            {product.expansion!.map((word) => (
              <span className="ev-initMask" key={`i-${word}`} aria-hidden="true">
                <span className="ev-init">{word[0]}</span>
              </span>
            ))}
            {product.expansion!.map((word) => (
              <span className="ev-under" key={`u-${word}`} aria-hidden="true">
                {word}
              </span>
            ))}
          </>
        ) : (
          <>
            <span className="ev-wordMask" style={{ ['--ev-name-size' as string]: `calc(var(--u) * ${nameSize.toFixed(2)})` } as CSSProperties} aria-hidden="true">
              <span className="ev-word">{product.name}</span>
            </span>
            {kind === 'hindi' ? (
              <>
                <span className="ev-devaMask" style={{ ['--ev-name-size' as string]: `calc(var(--u) * ${nameSize.toFixed(2)})` } as CSSProperties} aria-hidden="true">
                  <span className="ev-deva" lang="hi">
                    {product.devanagari}
                  </span>
                </span>
                <span className="ev-meaning">{product.meaning}</span>
              </>
            ) : (
              <i className="ev-name-rule" />
            )}
          </>
        )}
      </div>
      {/* ---------- the NAME slot: where the name docks, and its caption (the demo rest only) ---------- */}
      <i className="ev-dock" />
      {/* what the name stands for, in one small line under the docked name: the demo rest only
          (it was open at centre stage for under a second; here it can be read) */}
      {product.expansion || product.meaning ? (
        <p className="ev-dockexp" aria-hidden="true">
          <Rise>
            {product.expansion
              ? product.expansion.map((word, i) => (
                  <span key={word}>
                    {i ? ' ' : ''}
                    <b>{word[0]}</b>
                    {word.slice(1)}
                  </span>
                ))
              : product.meaning}
          </Rise>
        </p>
      ) : null}
      <p className="ev-dockcap">
        <Rise>{product.promise}</Rise>
      </p>

      {/* ---------- the STATEMENT slot: the result headline, and at most one supporting line ---------- */}
      <div className="ev-col ev-col--result">
        <p className="ev-sentence" data-highlight={module.highlight ?? ''}>
          {product.after}
        </p>
        {Proof ? (
          <div className="ev-proof">
            <Proof product={product} />
          </div>
        ) : null}
      </div>

      {/* ---------- the number: in the statement slot, with its picture in the picture area ---------- */}
      <div className="ev-stat-pic" aria-hidden="true">
        <Stat product={product} />
      </div>
      <div className="ev-stat" aria-label={`${product.stat.value} ${product.stat.label}`}>
        <p className="ev-mask">
          <span className="ev-rise">
            <span className="ev-stat-num" data-value={num}>
              {pre ? <span className="ev-stat-pre">{pre}</span> : null}
              <span className="ev-stat-n">{num}</span>
              {post ? <span className={post.trim().length > 1 ? 'ev-stat-post ev-stat-post--word' : 'ev-stat-post'}>{post}</span> : null}
            </span>
          </span>
        </p>
        <p className="ev-stat-label">
          <Rise>{product.stat.label}</Rise>
        </p>
      </div>

      {/* ---------- the device: the ONE picture, in the picture area ---------- */}
      <div className="ev-deviceMover">
        <i className="ev-device-shadow" />
        <div className="ev-deviceFloat">
          <div className="ev-deviceNudge">
            {device === 'phone' ? (
              <PhoneFrame>
                <Screen product={product} />
              </PhoneFrame>
            ) : device === 'laptop' ? (
              <LaptopFrame>
                <Screen product={product} />
              </LaptopFrame>
            ) : (
              <div className="ev-own">
                <Screen product={product} />
              </div>
            )}
            {OnDevice ? (
              <div className="ev-ondevice">
                <OnDevice product={product} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* ---------- the module's free layer ---------- */}
      {Extras ? (
        <div className="ev-extras">
          <Extras product={product} />
        </div>
      ) : null}
    </div>
  )
}
