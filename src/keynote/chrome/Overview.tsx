'use client'

/**
 * THE OVERVIEW. Every slide as a small picture of its page, grouped by section. "G" or the grid
 * button opens it; a click (or the arrow keys and Enter) jumps to a slide from its beginning;
 * Esc or G closes it.
 */

import { useEffect, useRef } from 'react'
import { SECTIONS, SLIDES, pad, type Slide } from '../deck'
import { director } from '../core/director'
import { useKeynote } from '../core/store'

const GROUPS: { letter: string; name: string; slides: Slide[] }[] = [
  { letter: '', name: 'Opening', slides: SLIDES.filter((s) => s.section === 'open') },
  ...SECTIONS.map((sec) => ({ letter: sec.letter, name: sec.name, slides: SLIDES.filter((s) => s.section === sec.key) })),
  { letter: '', name: 'Close', slides: SLIDES.filter((s) => s.section === 'close') },
]

export default function Overview() {
  const open = useKeynote((s) => s.overview)
  const n = useKeynote((s) => s.n)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const root = ref.current
    const cur = root?.querySelector<HTMLButtonElement>(`[data-n="${n}"]`)
    cur?.focus({ preventScroll: true })
    cur?.scrollIntoView({ block: 'center' })
    const onKey = (e: KeyboardEvent) => {
      const items = Array.from(root?.querySelectorAll<HTMLButtonElement>('.kn-over-item') ?? [])
      const i = items.indexOf(document.activeElement as HTMLButtonElement)
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        items[Math.min(items.length - 1, Math.max(0, i + (e.key === 'ArrowRight' ? 1 : -1)))]?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  if (!open) return null
  return (
    <div className="kn-over" ref={ref} role="dialog" aria-label="All slides">
      <div className="kn-over-head">
        <h2>All slides</h2>
        <p>Click a slide to go there. Esc to close.</p>
        <button type="button" className="kn-over-close" onClick={() => useKeynote.setState({ overview: false })}>
          Close
        </button>
      </div>
      {GROUPS.map((g) => (
        <section className="kn-over-sec" key={g.name}>
          <h3>
            {g.letter && <b>{g.letter}</b>}
            {g.name}
          </h3>
          <div className="kn-over-grid">
            {g.slides.map((s) => (
              <button
                type="button"
                key={s.n}
                className="kn-over-item"
                data-n={s.n}
                data-on={s.n === n ? 1 : 0}
                title={`${s.n}. ${s.title}`}
                onClick={() => director.jump(s.n)}
              >
                <img src={s.thumb} alt={s.title} loading="lazy" decoding="async" draggable={false} />
                <span>{pad(s.n)}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
