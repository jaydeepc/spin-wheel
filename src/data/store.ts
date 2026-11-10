'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { parseShowcase } from './parse'
import { seedShowcase } from './seed'
import type { Showcase } from './types'

const KEY = 'byot-showcase-v1'
/** Set while this browser holds edits the server has not accepted yet. */
const PENDING = 'byot-showcase-v1:pending'
const API = '/api/showcase'

export type SaveState = 'idle' | 'saving' | 'saved' | 'local-only' | 'locked'

function loadLocal(): Showcase | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? parseShowcase(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function saveLocal(data: Showcase) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    /* storage unavailable; the session still works in memory */
  }
}

function hasPending(): boolean {
  try {
    return localStorage.getItem(PENDING) === '1'
  } catch {
    return false
  }
}

function setPending(on: boolean) {
  try {
    if (on) localStorage.setItem(PENDING, '1')
    else localStorage.removeItem(PENDING)
  } catch {
    /* ignore */
  }
}

async function loadServer(): Promise<Showcase | null> {
  try {
    const res = await fetch(API, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return parseShowcase(json?.data)
  } catch {
    return null
  }
}

/**
 * The showcase content.
 *
 * Source of truth is data/showcase.json on the machine running the app (via
 * /api/showcase), so the admin page can be open on a laptop while the kiosk
 * screen picks the changes up. A copy is also kept in the browser.
 *
 * Edits the server has not accepted (session expired, disk not writable,
 * network down) are never thrown away: they stay in the browser, flagged as
 * pending, and the admin page sends them again the next time it opens.
 *
 * `writer` is true only for the admin page. The kiosk reads and never writes.
 */
export function useShowcase({ writer = false }: { writer?: boolean } = {}) {
  // Start from the sample set so server and first client render agree.
  const [data, setData] = useState<Showcase>(seedShowcase)
  const [ready, setReady] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const queued = useRef<Showcase | null>(null)
  const sending = useRef<Promise<boolean> | null>(null)
  /** True from the first unsaved edit until the server confirms it. */
  const unsynced = useRef(false)

  /** Send the newest queued copy now. Resolves true once the server has everything. */
  const flush = useCallback(async (): Promise<boolean> => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    if (sending.current) await sending.current
    const next = queued.current
    if (!next) return !unsynced.current
    queued.current = null
    const run = (async () => {
      try {
        const res = await fetch(API, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(next),
          keepalive: true,
        })
        if (res.ok) {
          // Only clean if nothing newer was queued while this one was in flight.
          if (!queued.current) {
            unsynced.current = false
            setPending(false)
            setSaveState('saved')
          }
          return true
        }
        setSaveState(res.status === 401 ? 'locked' : 'local-only')
        return false
      } catch {
        setSaveState('local-only')
        return false
      }
    })()
    sending.current = run
    const ok = await run
    if (sending.current === run) sending.current = null
    if (ok && queued.current) return flush()
    return ok
  }, [])

  const push = useCallback(
    (next: Showcase) => {
      saveLocal(next)
      setPending(true)
      unsynced.current = true
      queued.current = next
      setSaveState('saving')
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => void flush(), 400)
    },
    [flush],
  )

  const refresh = useCallback(async () => {
    if (unsynced.current) return // never clobber edits that have not reached the server
    const server = await loadServer()
    if (unsynced.current) return
    if (server) {
      setData(server)
      // Leave the browser copy alone while it holds edits waiting to be sent.
      if (!hasPending()) saveLocal(server)
    } else {
      const local = loadLocal()
      if (local) setData(local)
    }
  }, [])

  useEffect(() => {
    let alive = true
    const start = async () => {
      const local = writer && hasPending() ? loadLocal() : null
      if (local) {
        // Edits from an earlier visit never reached the server: restore them and try again.
        setData(local)
        push(local)
      } else {
        await refresh()
      }
      if (alive) setReady(true)
    }
    void start()

    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || unsynced.current) return
      const local = loadLocal()
      if (local) setData(local)
    }
    // Last chance to send an edit made a moment before the tab closes.
    const onHide = () => {
      if (queued.current) void flush()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('pagehide', onHide)
    return () => {
      alive = false
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('pagehide', onHide)
      if (queued.current) void flush()
    }
  }, [refresh, push, flush, writer])

  const update = useCallback(
    (fn: (prev: Showcase) => Showcase) => {
      setData((prev) => {
        const next = fn(prev)
        if (next !== prev) queueMicrotask(() => push(next))
        return next
      })
    },
    [push],
  )

  const replace = useCallback(
    (next: Showcase) => {
      setData(next)
      push(next)
    },
    [push],
  )

  return { data, ready, saveState, update, replace, refresh, flush }
}
