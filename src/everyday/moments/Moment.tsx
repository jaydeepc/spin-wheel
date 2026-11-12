'use client'

/**
 * The frame every product moment is drawn in. It renders everything the five share and
 * leaves four holes for the module: Before, Screen, Stat (and the optional extras).
 * The motion is in core/buildMoment.ts.
 */

import { useRef, type CSSProperties } from 'react'
import type { Product } from '../content'
import { buildMoment } from '../core/buildMoment'
import { useScene } from '../core/useScene'
import { LaptopFrame, PhoneFrame, Rise, sentences, statusClock, withName } from './parts'
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
  const { Before, Screen, Stat, Under, Beside, Proof, Extras, OnDevice } = module
  // The caption under the docked name. A Hindi name's caption is the word itself, in Devanagari
  // (its own face and language, never the Latin stack), and what it means.
  const dockLine = product.expansion ? (
    product.expansion.join(' ')
  ) : product.devanagari ? (
    <>
      <span className="ev-hi" lang="hi">
        {product.devanagari}
      </span>
      {` · ${product.meaning}`}
    </>
  ) : (
    product.promise
  )

  return (
    <div
      ref={ref}
      className="ev-moment"
      data-key={product.key}
      data-accent={product.accent}
      data-device={device}
      data-photo={product.photo ? '1' : '0'}
      data-name={kind}
    >
      {/* ---------- before: the old way, small ---------- */}
      <div className="ev-before">
        <div className="ev-before-pic" role="img" aria-label={product.before.headline}>
          <Before product={product} />
        </div>
        <div className="ev-before-txt">
          <p className="ev-before-eyebrow">
            <Rise>Before</Rise>
          </p>
          <p className="ev-before-h">
            <Rise>{sentences(product.before.detail)}</Rise>
          </p>
        </div>
      </div>

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
      <p className="ev-promise">
        <Rise>{product.promise}</Rise>
      </p>
      <i className="ev-dock" />
      <p className={kind === 'acronym' ? 'ev-dockcap ev-dockcap--caps' : kind === 'hindi' ? 'ev-dockcap ev-dockcap--hi' : 'ev-dockcap'}>
        <Rise>{dockLine}</Rise>
      </p>

      {/* ---------- left column: demo copy, then the result ---------- */}
      <div className="ev-col ev-col--demo">
        <p className="ev-col-h">
          <Rise>{module.demoTitle}</Rise>
        </p>
        <p className="ev-col-p">
          <Rise>{withName(module.demoLine, product.name)}</Rise>
        </p>
        {Under ? (
          <div className="ev-col-under">
            <Under product={product} />
          </div>
        ) : null}
      </div>
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

      {/* ---------- right column: the photo of this moment in her day ---------- */}
      {product.photo || Beside ? (
        <div className="ev-side">
          {product.photo ? (
            <div className="ev-photo-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.photo} alt={`Priya, ${product.place.toLowerCase()}`} draggable={false} />
              <span className="ev-photo-cap">
                <span className="ev-photo-cap-time">
                  {product.time}
                  {' · '}
                </span>
                {product.place}
              </span>
            </div>
          ) : null}
          {Beside ? (
            <div className="ev-beside">
              <Beside product={product} />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------- stat: a huge number, with a picture of it ---------- */}
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

      {/* ---------- the device, centre stage ---------- */}
      <div className="ev-deviceMover">
        <i className="ev-device-shadow" />
        <div className="ev-deviceFloat">
          <div className="ev-deviceNudge">
            {device === 'phone' ? (
              <PhoneFrame clock={module.clock ?? statusClock(product.time)}>
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
