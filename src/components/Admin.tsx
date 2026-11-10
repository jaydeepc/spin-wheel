'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useRef, useState } from 'react'
import { parseShowcase } from '@/data/parse'
import { blankUseCase, makeId, seedShowcase } from '@/data/seed'
import { useShowcase } from '@/data/store'
import type { Metric, Person, UseCase } from '@/data/types'
import { MAX_METRICS, MAX_PEOPLE, MAX_USE_CASES } from '@/data/types'
import Wheel from './Wheel'

const LABEL_LIMIT = 24

function Field({
  label,
  hint,
  children,
  wide,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <label className="field" data-wide={wide || undefined}>
      <span className="field__label">
        {label}
        {hint && <span className="field__hint">{hint}</span>}
      </span>
      {children}
    </label>
  )
}

export default function Admin() {
  const { data, ready, saveState, update, replace, flush } = useShowcase({ writer: true })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [locking, setLocking] = useState(false)
  const lock = async () => {
    if (locking) return
    setLocking(true)
    try {
      // Let a keystroke from this same moment reach the save queue, then send anything
      // still waiting before the session that authorises it is ended.
      await new Promise((r) => setTimeout(r, 0))
      await flush()
      await fetch('/api/admin/session', { method: 'DELETE' })
    } catch {
      /* the lock screen below still appears if the session is gone */
    } finally {
      router.refresh()
      setLocking(false)
    }
  }

  const cases = data.useCases
  const selected = cases.find((u) => u.id === selectedId) ?? cases[0] ?? null
  const active = useMemo(() => cases.filter((u) => u.active), [cases])
  const segments = useMemo(() => active.map((u) => ({ id: u.id, label: u.wheelLabel })), [active])
  const teams = useMemo(() => Array.from(new Set(cases.map((u) => u.team.trim()).filter(Boolean))).sort(), [cases])
  const full = cases.length >= MAX_USE_CASES

  const patch = (id: string, change: Partial<UseCase>) =>
    update((prev) => ({ ...prev, useCases: prev.useCases.map((u) => (u.id === id ? { ...u, ...change } : u)) }))

  const add = () => {
    if (full) return
    const fresh = blankUseCase()
    update((prev) => ({ ...prev, useCases: [...prev.useCases, fresh] }))
    setSelectedId(fresh.id)
  }

  const duplicate = (u: UseCase) => {
    if (full) return
    const copy: UseCase = {
      ...u,
      id: makeId(),
      wheelLabel: u.wheelLabel,
      title: `${u.title} (copy)`,
      metrics: u.metrics.map((m) => ({ ...m })),
      people: u.people.map((p) => ({ ...p })),
    }
    update((prev) => {
      const at = prev.useCases.findIndex((x) => x.id === u.id)
      const next = [...prev.useCases]
      next.splice(at + 1, 0, copy)
      return { ...prev, useCases: next }
    })
    setSelectedId(copy.id)
  }

  const remove = (u: UseCase) => {
    if (!window.confirm(`Delete "${u.title}"? This cannot be undone.`)) return
    update((prev) => ({ ...prev, useCases: prev.useCases.filter((x) => x.id !== u.id) }))
    setSelectedId(null)
  }

  const move = (id: string, by: -1 | 1) =>
    update((prev) => {
      const from = prev.useCases.findIndex((u) => u.id === id)
      const to = from + by
      if (from < 0 || to < 0 || to >= prev.useCases.length) return prev
      const next = [...prev.useCases]
      ;[next[from], next[to]] = [next[to], next[from]]
      return { ...prev, useCases: next }
    })

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'byot-byoa-showcase.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importJson = async (file: File) => {
    try {
      const parsed = parseShowcase(JSON.parse(await file.text()))
      if (!parsed) throw new Error('shape')
      if (!window.confirm(`Replace everything here with the ${parsed.useCases.length} use cases in "${file.name}"?`)) return
      replace(parsed)
      setSelectedId(null)
      setNotice(`Imported ${parsed.useCases.length} use cases.`)
    } catch {
      setNotice('That file is not a showcase export. Nothing was changed.')
    }
  }

  const resetToSamples = () => {
    if (!window.confirm('Replace everything with the sample use cases? Your current content will be lost unless you have exported it.')) return
    replace(seedShowcase())
    setSelectedId(null)
    setNotice('Sample use cases restored.')
  }

  const status =
    saveState === 'saving'
      ? 'Saving…'
      : saveState === 'locked'
        ? 'Not saved yet: the admin session has expired. Your edits are kept in this browser.'
        : saveState === 'local-only'
        ? 'Saved in this browser only (the server could not write the file)'
        : saveState === 'saved'
          ? 'All changes saved'
          : 'Changes save automatically'

  let wheelNumber = 0

  return (
    <div className="admin pai-backdrop" data-ready={ready || undefined}>
      <header className="admin__head">
        <div>
          <p className="admin__eyebrow">BYOT · BYOA Showcase</p>
          <h1 className="admin__title">Admin</h1>
        </div>
        <div className="admin__head-right">
          <p className="admin__status" data-state={saveState} aria-live="polite">
            {status}
          </p>
          {saveState === 'locked' && (
            <button type="button" className="btn btn--danger" onClick={() => router.refresh()}>
              Enter the PIN again
            </button>
          )}
          <Link href="/" className="btn btn--primary" target="_blank">
            Open the wheel
          </Link>
          <button type="button" className="btn btn--secondary" onClick={lock} disabled={locking}>
            {locking ? 'Locking…' : 'Lock'}
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="admin__logo" src="/brand/piramal-ai-lockup.png" alt="Piramal.ai" />
        </div>
      </header>

      {notice && (
        <p className="admin__notice" role="status">
          {notice}
          <button type="button" className="btn btn--ghost" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </p>
      )}

      <div className="admin__body">
        <aside className="admin__side">
          <section className="card preview">
            <div className="preview__wheel">
              <Wheel segments={segments} winner={selected?.active ? active.findIndex((u) => u.id === selected.id) : null} />
            </div>
            <div className="preview__text">
              <p className="preview__count">
                <strong>{active.length}</strong> on the wheel
              </p>
              <p className="preview__sub">
                {cases.length} of {MAX_USE_CASES} use cases created
                {active.length < 2 && ' · the wheel needs at least two'}
              </p>
            </div>
          </section>

          <section className="card list">
            <div className="list__head">
              <h2 className="card__title">Use cases</h2>
              <button type="button" className="btn btn--secondary" onClick={add} disabled={full}>
                Add use case
              </button>
            </div>
            {full && <p className="list__full">The wheel holds {MAX_USE_CASES} at most. Delete one to add another.</p>}
            <ol className="list__items">
              {cases.map((u, i) => {
                const n = u.active ? ++wheelNumber : 0
                return (
                  <li key={u.id} className="row" data-selected={selected?.id === u.id || undefined} data-off={!u.active || undefined}>
                    <button type="button" className="row__main" onClick={() => setSelectedId(u.id)}>
                      <span className="row__num">{n ? String(n).padStart(2, '0') : '–'}</span>
                      <span className="row__text">
                        <span className="row__label">{u.wheelLabel || 'Untitled'}</span>
                        <span className="row__meta">
                          {[u.team, u.platform, !u.active && 'Hidden'].filter(Boolean).join(' · ')}
                        </span>
                      </span>
                    </button>
                    <span className="row__tools">
                      <button type="button" className="icon-btn" onClick={() => move(u.id, -1)} disabled={i === 0} aria-label={`Move ${u.wheelLabel} up`}>
                        ↑
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => move(u.id, 1)}
                        disabled={i === cases.length - 1}
                        aria-label={`Move ${u.wheelLabel} down`}
                      >
                        ↓
                      </button>
                    </span>
                  </li>
                )
              })}
            </ol>
          </section>

          <section className="card settings">
            <h2 className="card__title">Kiosk settings</h2>
            <label className="check">
              <input
                type="checkbox"
                checked={data.settings.sound}
                onChange={(e) => update((p) => ({ ...p, settings: { ...p.settings, sound: e.target.checked } }))}
              />
              <span>Play ticks and a chime while the wheel spins</span>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={data.settings.sampleContent}
                onChange={(e) => update((p) => ({ ...p, settings: { ...p.settings, sampleContent: e.target.checked } }))}
              />
              <span>Label the kiosk “Sample content” (switch off once the real use cases and numbers are in)</span>
            </label>
            <Field label="Stop by itself after" hint="seconds, if nobody hits the button again">
              <input
                type="number"
                min={5}
                max={120}
                value={data.settings.autoStopSeconds}
                onChange={(e) => {
                  const v = Math.round(Number(e.target.value))
                  if (Number.isFinite(v)) update((p) => ({ ...p, settings: { ...p.settings, autoStopSeconds: Math.min(120, Math.max(5, v)) } }))
                }}
              />
            </Field>
            <div className="settings__actions">
              <button type="button" className="btn btn--secondary" onClick={exportJson}>
                Export
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => fileRef.current?.click()}>
                Import
              </button>
              <button type="button" className="btn btn--ghost" onClick={resetToSamples}>
                Restore samples
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) void importJson(f)
                  e.target.value = ''
                }}
              />
            </div>
          </section>
        </aside>

        <main className="admin__main">
          {selected ? (
            <Editor
              key={selected.id}
              useCase={selected}
              teams={teams}
              canDuplicate={!full}
              onChange={(c) => patch(selected.id, c)}
              onDuplicate={() => duplicate(selected)}
              onDelete={() => remove(selected)}
            />
          ) : (
            <section className="card empty">
              <h2 className="card__title">No use cases yet</h2>
              <p>Add the first one to start building the wheel.</p>
              <button type="button" className="btn btn--primary" onClick={add}>
                Add use case
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

function Editor({
  useCase: u,
  teams,
  canDuplicate,
  onChange,
  onDuplicate,
  onDelete,
}: {
  useCase: UseCase
  teams: string[]
  canDuplicate: boolean
  onChange: (c: Partial<UseCase>) => void
  onDuplicate: () => void
  onDelete: () => void
}) {
  const setMetric = (i: number, c: Partial<Metric>) => onChange({ metrics: u.metrics.map((m, k) => (k === i ? { ...m, ...c } : m)) })
  const setPerson = (i: number, c: Partial<Person>) => onChange({ people: u.people.map((p, k) => (k === i ? { ...p, ...c } : p)) })

  return (
    <div className="editor">
      <section className="card">
        <div className="editor__head">
          <h2 className="card__title">On the wheel</h2>
          <label className="check">
            <input type="checkbox" checked={u.active} onChange={(e) => onChange({ active: e.target.checked })} />
            <span>Show on the wheel</span>
          </label>
        </div>
        <div className="grid">
          <Field label="Wheel label" hint={`${u.wheelLabel.length}/${LABEL_LIMIT} · short, it has to fit a segment`}>
            <input type="text" value={u.wheelLabel} maxLength={LABEL_LIMIT} onChange={(e) => onChange({ wheelLabel: e.target.value })} />
          </Field>
          <Field label="Built on">
            <span className="segmented" role="radiogroup" aria-label="Platform">
              {(['BYOT', 'BYOA'] as const).map((p) => (
                <button key={p} type="button" role="radio" aria-checked={u.platform === p} onClick={() => onChange({ platform: p })}>
                  {p}
                  <small>{p === 'BYOT' ? 'Build Your Own Tech' : 'Build Your Own Agents'}</small>
                </button>
              ))}
            </span>
          </Field>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">The use case</h2>
        <div className="grid">
          <Field label="Title">
            <input type="text" value={u.title} maxLength={60} onChange={(e) => onChange({ title: e.target.value })} />
          </Field>
          <Field label="Function" hint="the team that built it">
            <input type="text" list="teams" value={u.team} maxLength={40} onChange={(e) => onChange({ team: e.target.value })} />
            <datalist id="teams">
              {teams.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="Description" hint="one or two sentences under the title" wide>
            <textarea rows={2} value={u.summary} maxLength={220} onChange={(e) => onChange({ summary: e.target.value })} />
          </Field>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">The story</h2>
        <p className="card__sub">Four short cards, read left to right. Around 30 words each fits the screen best.</p>
        <div className="grid">
          {(
            [
              ['oldWay', '1 · The old way', 'how it was done before'],
              ['problem', '2 · The problem', 'what that cost'],
              ['solution', `3 · The ${u.platform} solution`, 'what the team built'],
              ['newWay', '4 · The new way', 'how it works today'],
            ] as const
          ).map(([key, label, hint]) => (
            <Field key={key} label={label} hint={`${hint} · ${u[key].length}/260`}>
              <textarea rows={4} value={u[key]} maxLength={260} onChange={(e) => onChange({ [key]: e.target.value })} />
            </Field>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="editor__head">
          <div>
            <h2 className="card__title">The impact</h2>
            <p className="card__sub">Up to {MAX_METRICS} numbers. With three, the first is shown largest.</p>
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={u.metrics.length >= MAX_METRICS}
            onClick={() => onChange({ metrics: [...u.metrics, { value: '', label: '' }] })}
          >
            Add number
          </button>
        </div>
        <div className="rows">
          {u.metrics.map((m, i) => (
            <div className="pair" key={i}>
              <input type="text" aria-label={`Number ${i + 1}`} placeholder="63%" value={m.value} maxLength={16} onChange={(e) => setMetric(i, { value: e.target.value })} />
              <input
                type="text"
                aria-label={`What number ${i + 1} measures`}
                placeholder="fewer files sent back"
                value={m.label}
                maxLength={60}
                onChange={(e) => setMetric(i, { label: e.target.value })}
              />
              <button type="button" className="icon-btn" aria-label={`Remove number ${i + 1}`} onClick={() => onChange({ metrics: u.metrics.filter((_, k) => k !== i) })}>
                ×
              </button>
            </div>
          ))}
          {u.metrics.length === 0 && <p className="rows__empty">No numbers yet. The impact panel is hidden until you add one.</p>}
        </div>
      </section>

      <section className="card">
        <div className="editor__head">
          <div>
            <h2 className="card__title">The people behind it</h2>
            <p className="card__sub">Name, then role and function. Up to {MAX_PEOPLE}.</p>
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={u.people.length >= MAX_PEOPLE}
            onClick={() => onChange({ people: [...u.people, { name: '', role: '' }] })}
          >
            Add person
          </button>
        </div>
        <div className="rows">
          {u.people.map((p, i) => (
            <div className="pair" key={i}>
              <input type="text" aria-label={`Person ${i + 1} name`} placeholder="Name" value={p.name} maxLength={40} onChange={(e) => setPerson(i, { name: e.target.value })} />
              <input
                type="text"
                aria-label={`Person ${i + 1} role and function`}
                placeholder="Area Collections Manager · Collections"
                value={p.role}
                maxLength={60}
                onChange={(e) => setPerson(i, { role: e.target.value })}
              />
              <button type="button" className="icon-btn" aria-label={`Remove person ${i + 1}`} onClick={() => onChange({ people: u.people.filter((_, k) => k !== i) })}>
                ×
              </button>
            </div>
          ))}
          {u.people.length === 0 && <p className="rows__empty">Nobody listed yet.</p>}
        </div>
      </section>

      <div className="editor__foot">
        <button type="button" className="btn btn--secondary" onClick={onDuplicate} disabled={!canDuplicate}>
          Duplicate
        </button>
        <button type="button" className="btn btn--danger" onClick={onDelete}>
          Delete use case
        </button>
      </div>
    </div>
  )
}
