'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function PinGate({ configured }: { configured: boolean }) {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  // Keep the caret in the field: on arrival, after a wrong PIN, and when a lock-out ends.
  useEffect(() => {
    if (!busy && wait === 0) input.current?.focus()
  }, [busy, wait])

  // Count a lock-out down so the form re-opens by itself.
  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (busy || wait > 0 || !pin.trim()) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })
      if (res.ok) {
        router.refresh()
        return
      }
      const json = await res.json().catch(() => ({}))
      setPin('')
      if (res.status === 429) {
        setWait(Number(json.retryAfter) || 60)
        setError('Too many wrong attempts.')
      } else if (res.status === 401) {
        const locked = Number(json.retryAfter) > 0
        if (locked) setWait(Number(json.retryAfter))
        setError(locked ? 'That PIN is not right, and that was one try too many.' : 'That PIN is not right.')
      } else {
        setError('The PIN could not be checked. Try again.')
      }
    } catch {
      setError('The server could not be reached. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin pai-backdrop gate">
      <form className="card gate__card" onSubmit={submit}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="gate__logo" src="/brand/piramal-ai-lockup.png" alt="Piramal.ai" />
        <p className="admin__eyebrow">BYOT · BYOA Showcase</p>
        <h1 className="gate__title">Admin is locked</h1>
        {configured ? (
          <>
            <label className="field">
              <span className="field__label">Enter the admin PIN</span>
              <input
                ref={input}
                className="gate__input"
                type="password"
                autoComplete="off"
                maxLength={32}
                value={pin}
                readOnly={busy || wait > 0}
                aria-invalid={error ? true : undefined}
                aria-describedby="gate-msg"
                onChange={(e) => setPin(e.target.value)}
              />
            </label>
            <div id="gate-msg" className="gate__msg">
              {/* Announced once; the ticking countdown beside it is deliberately not a live region. */}
              <span role="alert">
                {error}
                {wait > 0 && ` Try again in about ${Math.ceil(wait / 60)} minute${wait > 60 ? 's' : ''}.`}
              </span>
              {wait > 0 && (
                <span className="gate__count" aria-hidden="true">
                  {Math.floor(wait / 60)}:{String(wait % 60).padStart(2, '0')}
                </span>
              )}
            </div>
            <button type="submit" className="btn btn--primary" disabled={busy || wait > 0 || !pin.trim()}>
              {busy ? 'Checking…' : 'Unlock'}
            </button>
          </>
        ) : (
          <p className="gate__setup">
            No PIN has been set, so the admin page stays locked. Add <code>ADMIN_PIN</code> (six or more characters) to{' '}
            <code>.env.local</code> and restart the app.
          </p>
        )}
        <Link href="/" className="btn btn--ghost">
          Back to the wheel
        </Link>
      </form>
    </div>
  )
}
