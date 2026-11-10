'use client'

import { memo, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import type { UseCase } from '@/data/types'
import type { Accent } from './Wheel'
import './detail.css'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '·'
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

const vars = (v: Record<string, string | number>) => v as CSSProperties

const Arrow = () => (
  <svg viewBox="0 0 46 20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 10h41" />
    <path d="M35 3l8 7-8 7" />
  </svg>
)

/**
 * A metric value is free text. Numerals are set large, words small, and a
 * "from → to" pair is split so the two halves can be weighted differently.
 * Returns the markup, an estimated width in em (--w, so CSS can size it to its
 * box before anything is measured) and, when the value is one plain number,
 * the numeral to count up to.
 */
function buildValue(raw: string, hero: boolean) {
  const text = raw.trim()
  let parts = text.split(/\s*(?:→|⟶|➜|->)\s*/).filter(Boolean)
  if (parts.length !== 2) parts = [text]
  let w = 0
  const nums: string[] = []

  const half = (s: string): ReactNode[] => {
    if (!/\d/.test(s)) {
      w += s.length * 0.58
      return [<span className="n" key="t">{s}</span>]
    }
    const re = /(\d[\d.,:]*\d|\d)|([^\d]+)/g
    const out: ReactNode[] = []
    let seen = false
    let m: RegExpExecArray | null
    while ((m = re.exec(s))) {
      if (m[1]) {
        for (const ch of m[1]) w += /\d/.test(ch) ? 0.6 : 0.3
        nums.push(m[1])
        out.push(<span className="n" key={out.length}>{m[1]}</span>)
        seen = true
      } else {
        const t = m[2].trim()
        if (!t) continue
        const sym = t.length === 1
        const cls = (sym ? 'sym' : 'unit') + (seen ? (/^\s/.test(m[2]) ? ' sp' : '') : ' pre')
        w += sym ? 0.5 : t.length * 0.2 + 0.2
        out.push(<span className={cls} key={out.length}>{t}</span>)
      }
    }
    return out
  }

  let node: ReactNode
  if (parts.length === 2) {
    const a = half(parts[0])
    const b = half(parts[1])
    w += 1.36
    node = (
      <>
        <span className="v-from" data-in={hero ? 'metric-from' : undefined}>{a}</span>
        <span className="v-arrow" data-in={hero ? 'metric-arrow' : undefined}><Arrow /></span>
        <span className="v-to" data-in={hero ? 'metric-hero' : undefined}>{b}</span>
      </>
    )
  } else {
    node = <span className="v-to" data-in={hero ? 'metric-hero' : undefined}>{half(parts[0])}</span>
  }
  const plain = parts.length === 1 && nums.length === 1 && /^(\d+|\d{1,3}(,\d{2,3})+)(\.\d+)?$/.test(nums[0])
  return { node, w: Math.max(w, 1.6).toFixed(2), count: plain ? nums[0] : undefined }
}

/** How many characters the title is set to per line: one line when short, two for most, three for the longest. */
function titleMeasure(title: string) {
  const len = title.length
  const longest = title.split(/\s+/).reduce((a, wd) => Math.max(a, wd.length), 0)
  if (len <= 12) return Math.max(len, 6)
  if (len <= 34) return Math.max(longest, Math.ceil(len / 2) + 2)
  return Math.max(longest, Math.ceil(len / 3) + 4)
}

/* ------------------------------------------------------------
   Fit. The CSS sizes everything from the content's length; this is the safety
   net for the longest allowed text. It first lets the reading text give a
   little (--ks), then the whole page (--k). It reads only boxes that the
   entrance's transforms and opacity do not disturb.
   ------------------------------------------------------------ */
function fixWidths(root: HTMLElement) {
  const title = root.querySelector<HTMLElement>('.d-title')
  if (title) {
    title.style.removeProperty('--ts')
    if (title.scrollWidth > title.clientWidth + 1) {
      title.style.setProperty('--ts', ((title.clientWidth / title.scrollWidth) * 0.98).toFixed(3))
    }
  }
  root.querySelectorAll<HTMLElement>('.d-value').forEach((v) => {
    v.style.removeProperty('--s')
    let s = 1
    // Units keep a minimum size, so one pass is not always enough.
    for (let i = 0; i < 4 && v.scrollWidth > v.clientWidth + 1; i++) {
      s *= (v.clientWidth / v.scrollWidth) * 0.98
      v.style.setProperty('--s', s.toFixed(3))
    }
  })
}

function fitDetail(root: HTMLElement) {
  const set = (k: number, ks: number) => {
    root.style.setProperty('--k', k.toFixed(2))
    root.style.setProperty('--ks', ks.toFixed(2))
  }
  root.removeAttribute('data-tight')
  set(1, 1)
  fixWidths(root)
  // Short screens scroll instead (see the media query in detail.css).
  if (window.matchMedia('(max-height: 560px)').matches) return

  const cs = getComputedStyle(root)
  const dock = parseFloat(cs.getPropertyValue('--dock')) || 0
  const dockY = parseFloat(cs.getPropertyValue('--dock-y')) || 0
  const height = root.clientHeight
  const floor = height - (parseFloat(cs.paddingBottom) || 0)
  // The wheel's pointer stands a little proud of its circle.
  const dockTop = height - dockY - dock * 1.06
  const top = root.querySelector<HTMLElement>('.d-top')
  const last = root.lastElementChild as HTMLElement | null
  // Sub-pixel bottoms measured against the page itself. Neither the page nor these bands
  // carry a transform of their own, and anything above them only ever translates.
  const bottom = (el: HTMLElement) => el.getBoundingClientRect().bottom - root.getBoundingClientRect().top
  const over = () =>
    (last ? bottom(last) > floor + 0.6 : false) || (top ? bottom(top) > dockTop - 4 : false)

  let ks = 1
  let k = 1
  while (over() && ks > 0.861) {
    ks -= 0.02
    set(k, ks)
  }
  while (over() && k > 0.501) {
    k -= 0.02
    set(k, ks)
    fixWidths(root)
  }
  fixWidths(root)

  // The margin heading sits above the wheel; it must never reach it.
  const side = root.querySelector<HTMLElement>('.d-sidehead')
  if (side && side.offsetTop + side.offsetHeight > dockTop - 6) root.setAttribute('data-tight', '')
}

interface Props {
  useCase: UseCase
  /** Position on the wheel, 1-based. */
  number: number
  accent: Accent
}

/**
 * The page a use case gets once the wheel has stopped on it: an editorial
 * spread. Everything that animates in carries a data-in role; detailTimeline.ts
 * holds the score.
 */
function Detail({ useCase: uc, number, accent }: Props) {
  const ref = useRef<HTMLElement>(null)

  const short = uc.platform === 'BYOA' ? 'BYOA' : 'BYOT'
  const chip = short === 'BYOA' ? 'BYOA · Build Your Own Agents' : 'BYOT · Build Your Own Tech'
  const title = uc.title.trim()
  const words = title.split(/\s+/).filter(Boolean)
  const summary = uc.summary.trim()
  const metrics = uc.metrics.filter((m) => m.value.trim()).slice(0, 4)
  const people = uc.people.filter((p) => p.name.trim()).slice(0, 6)
  const before = [
    { key: 'old', label: 'The old way', text: uc.oldWay.trim() },
    { key: 'problem', label: 'The problem', text: uc.problem.trim() },
  ].filter((s) => s.text)
  const after = [
    { key: 'solution', label: `The ${short} solution`, text: uc.solution.trim() },
    { key: 'new', label: 'The new way', text: uc.newWay.trim() },
  ].filter((s) => s.text)
  const hasStory = before.length + after.length > 0
  const both = before.length > 0 && after.length > 0

  // Must be right on first paint: the kiosk hides everything straight after mount.
  useLayoutEffect(() => {
    const root = ref.current
    const host = root?.parentElement
    if (!root || !host) return
    let alive = true
    fitDetail(root)
    let w = host.clientWidth
    let h = host.clientHeight
    const ro = new ResizeObserver(() => {
      if (host.clientWidth === w && host.clientHeight === h) return
      w = host.clientWidth
      h = host.clientHeight
      fitDetail(root)
    })
    ro.observe(host)
    if (document.fonts && document.fonts.status !== 'loaded') {
      void document.fonts.ready.then(() => {
        if (alive) fitDetail(root)
      })
    }
    return () => {
      alive = false
      ro.disconnect()
    }
  }, [uc])

  let n = 0
  const group = (side: 'before' | 'after', tag: string, steps: typeof before) =>
    steps.length > 0 && (
      <div className="d-group" data-side={side}>
        <div className="d-group__wash" data-in="group-wash" />
        <div className="d-group__rule" data-in="group-rule" />
        <p className="d-group__tag" data-in="group-tag">{tag}</p>
        <div className="d-steps" style={vars({ '--cols': steps.length })}>
          {steps.map((s) => {
            n += 1
            return (
              <div className="d-step" data-kind={s.key} data-in="step" key={s.key}>
                <p className="d-step__head">
                  <span className="d-step__num">{String(n).padStart(2, '0')}</span>
                  <span className="d-step__label">{s.label}</span>
                </p>
                <p className="d-step__text">{s.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    )

  const hero = metrics.length ? buildValue(metrics[0].value, true) : null
  const peopleCols = people.length === 4 ? 4 : 3

  return (
    <article className="detail" ref={ref} data-accent={accent} data-nostory={!hasStory || undefined} data-nopeople={!people.length || undefined} aria-live="polite">
      {/* Band 1: the title page and the figures */}
      <header className="d-top" data-solo={!hero || undefined}>
        <div className="d-intro">
          <p className="d-eyebrow" data-in="eyebrow">
            <span className="d-eyebrow__folio">{String(number).padStart(2, '0')}</span>
            <span className="d-eyebrow__bar" aria-hidden="true" />
            <span className="d-eyebrow__fn">{uc.team.trim() || 'Piramal Finance'}</span>
            <span className="d-eyebrow__chip">{chip}</span>
          </p>
          {words.length > 0 && (
            <h1 className="d-title" style={vars({ '--tl': titleMeasure(title) })} aria-label={title}>
              {words.map((word, i) => (
                <span className="d-title__word" key={i} aria-hidden="true">
                  <span data-in="word">{word}</span>
                </span>
              ))}
            </h1>
          )}
          <div className="d-rule" data-in="rule" />
          {summary && (
            <p className="d-summary" data-in="summary">
              {summary}
            </p>
          )}
        </div>

        {hero && (
          <section className="d-impact" data-in="impact" aria-label="Impact">
            <div>
              <p className="d-label">The impact</p>
              <div className="d-hero">
                <p className="d-value" style={vars({ '--w': hero.w })} data-count={hero.count} aria-label={metrics[0].value}>
                  {hero.node}
                </p>
              </div>
              {metrics[0].label.trim() && (
                <p className="d-hero__label" data-in="metric-label">
                  {metrics[0].label}
                </p>
              )}
            </div>
            {metrics.length > 1 && (
              <div className="d-supports" data-n={metrics.length - 1} style={vars({ '--n': metrics.length - 1 })}>
                {metrics.slice(1).map((m, i) => {
                  const v = buildValue(m.value, false)
                  return (
                    <div className="d-metric" data-in="metric" key={i}>
                      <p className="d-value" style={vars({ '--w': v.w })} data-count={v.count} aria-label={m.value}>
                        {v.node}
                      </p>
                      <p className="d-metric__label">{m.label}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}
      </header>

      {/* Band 2: the story, set in from the margin the wheel sits in */}
      {hasStory && (
        <div className="d-lower">
          <div className="d-sidehead" data-in="sidehead">
            <p className="d-label">The story</p>
            <p className="d-sidehead__line">
              How the work <b>changed</b>
            </p>
          </div>
          <section
            className="d-story"
            data-half={!both || undefined}
            data-single={before.length + after.length === 1 || undefined}
            style={vars({ '--b': `${before.length || 1}fr`, '--a': `${after.length || 1}fr` })}
            aria-label="How it changed"
          >
            {group('before', 'Before', before)}
            {both && (
              <div className="d-turn" aria-hidden="true">
                <div className="d-turn__line" data-in="turn-line" />
                <div className="d-turn__mark" data-in="turn">
                  <span className="d-turn__disc">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 10h13" />
                      <path d="M11 4.5l5.5 5.5-5.5 5.5" />
                    </svg>
                  </span>
                  <span className="d-turn__tag">{short}</span>
                </div>
              </div>
            )}
            {group('after', 'After', after)}
          </section>
        </div>
      )}

      {/* Band 3: the authors, to the right of the docked wheel */}
      {people.length > 0 && (
        <section className="d-people" data-dense={people.length > 3 || undefined} aria-label="The people behind the solution">
          <div className="d-people__head" data-in="people-label">
            <p className="d-label">The people behind it</p>
            <p className="d-people__note">
              Built by the team that lives the problem, <span>not by an IT project.</span>
            </p>
          </div>
          <ul className="d-people__list" style={vars({ '--cols': peopleCols })}>
            {people.map((p, i) => (
              <li className="d-person" key={i} data-in="person">
                <span className="d-person__disc" aria-hidden="true">
                  {initials(p.name)}
                </span>
                <span className="d-person__text">
                  <span className="d-person__name">{p.name}</span>
                  {p.role.trim() && <span className="d-person__role">{p.role}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}

export default memo(Detail)
