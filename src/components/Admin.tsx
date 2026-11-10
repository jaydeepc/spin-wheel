'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { parseShowcase } from '@/data/parse'
import { blankPerson, blankUseCase, makeId, seedShowcase } from '@/data/seed'
import { useShowcase } from '@/data/store'
import type { Metric, Person, UseCase } from '@/data/types'
import { LIMITS, MAX_METRICS, MAX_PEOPLE, MAX_USE_CASES } from '@/data/types'
import Wheel from './Wheel'

/** Portraits are stored large enough to stay sharp on a 4K kiosk screen; smaller sizes are fallbacks. */
const PHOTO_SIZES = [400, 320, 240]

function Field({
  label,
  hint,
  count,
  children,
  wide,
}: {
  label: string
  hint?: string
  /** [characters used, limit] shows a counter at the end of the label row. */
  count?: readonly [number, number]
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <label className="field" data-wide={wide || undefined}>
      <span className="field__label">
        {label}
        {hint && <span className="field__hint">{hint}</span>}
        {count && (
          <span className="field__count" data-near={count[0] >= count[1] * 0.9 || undefined}>
            {count[0]}/{count[1]}
          </span>
        )}
      </span>
      {children}
    </label>
  )
}

/**
 * Turns a picked image into a small square portrait, entirely in the browser:
 * centre-cropped, resized to 240x240 and encoded as a JPEG data URL short enough to store.
 * Throws an Error with a message meant for the admin if it cannot.
 */
/** The role is stored as "Role · Team"; the form edits the two halves separately. */
function splitRole(role: string): [string, string] {
  const m = /^(.*?)\s*[·•|]\s*(.*)$/.exec(role)
  return m ? [m[1], m[2]] : [role, '']
}
function joinRole(role: string, team: string): string {
  const r = role.replace(/[·•|]/g, ' ')
  const t = team.replace(/[·•|]/g, ' ')
  return t.trim() ? `${r} · ${t}` : r
}

async function fileToPortrait(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('That file is not an image. Choose a JPG or PNG photo.')
  const src = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = () => reject(new Error('This browser could not open that image. Try a JPG or PNG instead.'))
      el.src = src
    })
    const side = Math.min(img.naturalWidth, img.naturalHeight)
    if (!side) throw new Error('That image is empty. Choose another photo.')
    for (const size of PHOTO_SIZES) {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('This browser could not resize the photo. Try another browser.')
      // JPEG has no transparency, so a cut-out PNG gets a white ground instead of black.
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size)
      for (const quality of [0.82, 0.7, 0.55]) {
        const url = canvas.toDataURL('image/jpeg', quality)
        if (url.startsWith('data:image/jpeg;base64,') && url.length <= LIMITS.photo) return url
      }
    }
    throw new Error('That photo is still too large after resizing. Try a simpler or smaller picture.')
  } finally {
    URL.revokeObjectURL(src)
  }
}

function PhotoField({ photo, who, onChange }: { photo: string; who: string; onChange: (photo: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  // Resizing is asynchronous: write through the newest handler so typing meanwhile is not overwritten.
  const latest = useRef(onChange)
  useEffect(() => {
    latest.current = onChange
  })

  const pick = async (file: File) => {
    setError(null)
    setBusy(true)
    try {
      const url = await fileToPortrait(file)
      latest.current(url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That photo could not be used. Try another one.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="photo">
      <div className="photo__frame" data-empty={!photo || undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo ? <img src={photo} alt={`Photo of ${who}`} /> : <span className="photo__blank" aria-hidden="true" />}
      </div>
      <div className="photo__tools">
        <button type="button" className="btn btn--secondary btn--small" disabled={busy} onClick={() => inputRef.current?.click()}>
          {busy ? 'Resizing…' : photo ? 'Replace' : 'Add photo'}
        </button>
        {photo && (
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => {
              setError(null)
              onChange('')
            }}
          >
            Remove
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        aria-label={`Photo of ${who}`}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) void pick(f)
          e.target.value = ''
        }}
      />
      {error ? (
        <p className="photo__msg" data-error role="alert">
          {error}
        </p>
      ) : (
        <p className="photo__msg">{photo ? 'Cropped to a square and resized.' : 'No photo yet. The kiosk shows a placeholder.'}</p>
      )}
    </div>
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
  const segments = useMemo(() => active.map((u) => ({ id: u.id, label: u.wheelLabel, tag: u.platform })), [active])
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
      title: `${u.title.slice(0, LIMITS.title - 7)} (copy)`,
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
      const raw = JSON.parse(await file.text())
      const parsed = parseShowcase(raw)
      if (!parsed) throw new Error('shape')
      // Older exports allowed more people and numbers than the page now shows: say what will not come across.
      const rawCases: { people?: unknown[]; metrics?: unknown[] }[] = Array.isArray(raw?.useCases) ? raw.useCases : []
      const extraPeople = rawCases.filter((c) => Array.isArray(c?.people) && c.people.length > MAX_PEOPLE).length
      const extraMetrics = rawCases.filter((c) => Array.isArray(c?.metrics) && c.metrics.length > MAX_METRICS).length
      const dropped = [
        rawCases.length > parsed.useCases.length && `only the first ${parsed.useCases.length} of ${rawCases.length} use cases are kept`,
        extraPeople > 0 && `${extraPeople} use case${extraPeople === 1 ? ' lists' : 's list'} more than ${MAX_PEOPLE} people; only the first ${MAX_PEOPLE} are kept`,
        extraMetrics > 0 && `${extraMetrics} use case${extraMetrics === 1 ? ' has' : 's have'} more than ${MAX_METRICS} numbers; only the first ${MAX_METRICS} are kept`,
      ].filter(Boolean)
      const warning = dropped.length ? `\n\nNote: ${dropped.join('; ')}.` : ''
      if (!window.confirm(`Replace everything here with the ${parsed.useCases.length} use cases in "${file.name}"?${warning}`)) return
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
        : saveState === 'too-large'
          ? 'Not saved: the content is too large. Remove or replace some photos.'
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
          <Field label="Wheel label" hint="short, it has to fit a segment" count={[u.wheelLabel.length, LIMITS.wheelLabel]}>
            <input type="text" value={u.wheelLabel} maxLength={LIMITS.wheelLabel} onChange={(e) => onChange({ wheelLabel: e.target.value })} />
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
        <h2 className="card__title">The tool</h2>
        <p className="card__sub">
          Name it the way its creator would. A small, specific job is the point: say what it does, not why it is strategic.
        </p>
        <div className="grid">
          <Field label="Title">
            <input type="text" value={u.title} maxLength={LIMITS.title} onChange={(e) => onChange({ title: e.target.value })} />
          </Field>
          <Field label="Function" hint="the team it was built in">
            <input type="text" list="teams" value={u.team} maxLength={LIMITS.team} onChange={(e) => onChange({ team: e.target.value })} />
            <datalist id="teams">
              {teams.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </Field>
          <Field label="In one line" hint="what it is and who built it, in plain words" count={[u.summary.length, LIMITS.summary]} wide>
            <textarea rows={2} value={u.summary} maxLength={LIMITS.summary} onChange={(e) => onChange({ summary: e.target.value })} />
          </Field>
        </div>
      </section>

      <section className="card">
        <div className="editor__head">
          <div>
            <h2 className="card__title">The creator</h2>
            <p className="card__sub">
              The person who built it, with a photo. One is best, {MAX_PEOPLE} at most: individuals, not whole teams.
            </p>
          </div>
          <button
            type="button"
            className="btn btn--secondary"
            disabled={u.people.length >= MAX_PEOPLE}
            onClick={() => onChange({ people: [...u.people, blankPerson()] })}
          >
            {u.people.length ? 'Add a second creator' : 'Add creator'}
          </button>
        </div>
        <div className="creators">
          {u.people.map((p, i) => {
            const who = p.name.trim() || `creator ${i + 1}`
            return (
              <div className="creator" key={i}>
                <PhotoField photo={p.photo} who={who} onChange={(photo) => setPerson(i, { photo })} />
                <div className="creator__fields">
                  <Field label="Name">
                    <input type="text" value={p.name} maxLength={LIMITS.personName} onChange={(e) => setPerson(i, { name: e.target.value })} />
                  </Field>
                  <div className="creator__pair">
                    <Field label="Role">
                      <input
                        type="text"
                        placeholder="Area Collections Manager"
                        value={splitRole(p.role)[0]}
                        maxLength={36}
                        onChange={(e) => setPerson(i, { role: joinRole(e.target.value, splitRole(p.role)[1]) })}
                      />
                    </Field>
                    <Field label="Team" hint="not Tech">
                      <input
                        type="text"
                        placeholder="Collections"
                        value={splitRole(p.role)[1]}
                        maxLength={20}
                        onChange={(e) => setPerson(i, { role: joinRole(splitRole(p.role)[0], e.target.value) })}
                      />
                    </Field>
                  </div>
                  {!p.name.trim() && (p.photo || p.role.trim() || p.bio.trim()) && (
                    <p className="creator__warn">Add a name, or this creator will not be shown on the kiosk.</p>
                  )}
                  <Field
                    label="Short bio"
                    hint="Who they are and what they do day to day. Shows they are not from Tech."
                    count={[p.bio.length, LIMITS.personBio]}
                    wide
                  >
                    <textarea
                      rows={3}
                      placeholder="Runs a team of twelve field officers across two districts. Had never built an app."
                      value={p.bio}
                      maxLength={LIMITS.personBio}
                      onChange={(e) => setPerson(i, { bio: e.target.value })}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  className="icon-btn creator__remove"
                  aria-label={`Remove ${who}`}
                  onClick={() => onChange({ people: u.people.filter((_, k) => k !== i) })}
                >
                  ×
                </button>
              </div>
            )
          })}
          {u.people.length === 0 && <p className="rows__empty">No creator yet. The page is built around the person, so add one.</p>}
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">In their words</h2>
        <p className="card__sub">
          Shown as a pull quote, attributed to the first creator. Use what they actually said: modest, specific, a little personal. Leave
          it empty to hide the quote.
        </p>
        <div className="grid">
          <Field label="Quote" hint="no quotation marks needed" count={[u.quote.length, LIMITS.quote]} wide>
            <textarea
              rows={3}
              placeholder="I used to lose my Monday mornings to this."
              value={u.quote}
              maxLength={LIMITS.quote}
              onChange={(e) => onChange({ quote: e.target.value })}
            />
          </Field>
        </div>
      </section>

      <section className="card">
        <h2 className="card__title">The story</h2>
        <p className="card__sub">
          Four short cards, read left to right. One short, concrete sentence each: what happened at the desk, in everyday words. The
          bio and the quote carry the rest.
        </p>
        <div className="grid">
          {(
            [
              ['oldWay', '1 · The old way', 'one sentence: what they did by hand'],
              ['problem', '2 · The problem', 'one sentence: the small, daily annoyance'],
              ['solution', `3 · The ${u.platform} solution`, 'one sentence: what they built'],
              ['newWay', '4 · The new way', 'one sentence: what a normal day looks like now'],
            ] as const
          ).map(([key, label, hint]) => (
            <Field key={key} label={label} hint={hint} count={[u[key].length, LIMITS.story]}>
              <textarea rows={3} value={u[key]} maxLength={LIMITS.story} onChange={(e) => onChange({ [key]: e.target.value })} />
            </Field>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="editor__head">
          <div>
            <h2 className="card__title">Supporting numbers</h2>
            <p className="card__sub">
              Optional. Up to {MAX_METRICS} small facts that back the story up. They are not the headline, the creator is, so modest and
              true beats big.
            </p>
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
              <input
                type="text"
                aria-label={`Number ${i + 1}`}
                placeholder="1 hr"
                value={m.value}
                maxLength={LIMITS.metricValue}
                onChange={(e) => setMetric(i, { value: e.target.value })}
              />
              <input
                type="text"
                aria-label={`What number ${i + 1} measures`}
                placeholder="of morning calls no longer needed"
                value={m.label}
                maxLength={LIMITS.metricLabel}
                onChange={(e) => setMetric(i, { label: e.target.value })}
              />
              <button type="button" className="icon-btn" aria-label={`Remove number ${i + 1}`} onClick={() => onChange({ metrics: u.metrics.filter((_, k) => k !== i) })}>
                ×
              </button>
            </div>
          ))}
          {u.metrics.length === 0 && <p className="rows__empty">No numbers. That is fine: the page works without them.</p>}
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
