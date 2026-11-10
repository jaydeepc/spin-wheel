'use client'

import { memo } from 'react'
import type { UseCase } from '@/data/types'
import type { Accent } from './Wheel'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '·'
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

interface Props {
  useCase: UseCase
  /** Position on the wheel, 1-based. */
  number: number
  accent: Accent
}

/**
 * The page a use case gets once the wheel has stopped on it. Everything that
 * animates in carries a data-in attribute; the kiosk timeline picks them up.
 */
function Detail({ useCase: uc, number, accent }: Props) {
  const metrics = uc.metrics.filter((m) => m.value.trim())
  const people = uc.people.filter((p) => p.name.trim())
  const steps = [
    { key: 'old', label: 'The old way', text: uc.oldWay },
    { key: 'problem', label: 'The problem', text: uc.problem },
    { key: 'solution', label: `The ${uc.platform} solution`, text: uc.solution },
    { key: 'new', label: 'The new way', text: uc.newWay },
  ].filter((s) => s.text.trim())

  return (
    <article className="detail" data-accent={accent} aria-live="polite">
      <header className="detail__top">
        <div className="detail__intro">
          <p className="detail__eyebrow" data-in="fade">
            <span className="detail__num">{String(number).padStart(2, '0')}</span>
            <span className="detail__dot" aria-hidden="true">·</span>
            <span>{uc.team || 'Piramal Finance'}</span>
            <span className="detail__chip">{uc.platform === 'BYOA' ? 'BYOA · Build Your Own Agents' : 'BYOT · Build Your Own Tech'}</span>
          </p>
          <h1 className="detail__title" aria-label={uc.title}>
            {uc.title.split(/\s+/).map((word, i) => (
              <span className="detail__word" key={i} aria-hidden="true">
                <span data-in="word">{word}</span>
              </span>
            ))}
          </h1>
          <div className="detail__rule" data-in="rule" />
          {uc.summary && (
            <p className="detail__summary" data-in="rise">
              {uc.summary}
            </p>
          )}
        </div>

        {metrics.length > 0 && (
          <section className="detail__impact" data-count={metrics.length} aria-label="Impact">
            <p className="detail__label" data-in="fade">
              The impact
            </p>
            <div className="detail__metrics">
              {metrics.map((m, i) => (
                <div className="metric" key={i} data-in="metric">
                  <p className="metric__value" data-count-to={m.value}>
                    {m.value}
                  </p>
                  <p className="metric__label">{m.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </header>

      {steps.length > 0 && (
        <section className="journey" style={{ ['--steps' as string]: steps.length }} aria-label="How it changed">
          <div className="journey__line" data-in="line" aria-hidden="true" />
          {steps.map((s, i) => (
            <div className="step" data-kind={s.key} key={s.key} data-in="step">
              <p className="step__head">
                <span className="step__disc">{i + 1}</span>
                <span>{s.label}</span>
              </p>
              <p className="step__text">{s.text}</p>
            </div>
          ))}
        </section>
      )}

      <footer className="detail__foot">
        <div className="detail__dock" aria-hidden="true" />
        <section className="people" aria-label="The people behind the solution">
          <p className="detail__label" data-in="fade">
            The people behind it
            <span className="people__note">Built by the team that lives the problem, not by an IT project</span>
          </p>
          <ul className="people__list">
            {people.map((p, i) => (
              <li className="person" key={i} data-in="person">
                <span className="person__disc" data-alt={i % 2 === 1 || undefined} aria-hidden="true">
                  {initials(p.name)}
                </span>
                <span className="person__text">
                  <span className="person__name">{p.name}</span>
                  {p.role && <span className="person__role">{p.role}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </footer>
    </article>
  )
}

export default memo(Detail)
