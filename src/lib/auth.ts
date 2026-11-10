import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

/**
 * Admin PIN.
 *
 * The PIN lives in the ADMIN_PIN environment variable and is only ever
 * compared on the server. A correct PIN earns a signed, expiring token in an
 * httpOnly cookie. The signing key is ADMIN_SESSION_SECRET (a long random
 * value, never derived from the PIN, so a captured cookie says nothing about
 * the PIN). Without that variable a random key is made for the life of the
 * process, which is fine on one machine and means a restart signs everyone out.
 *
 * Tokens are stateless so they work on serverless hosting, where each request
 * may land on a different instance. For the same reason the two pieces of
 * in-memory state here, the list of sessions ended with Lock and the
 * brute-force counter, are exact on a single machine and best-effort on
 * serverless. With no ADMIN_PIN set the admin stays locked, so a missing
 * config can never leave it open.
 */
export const SESSION_COOKIE = 'byot_admin'
export const SESSION_HOURS = 12
export const MIN_PIN_LENGTH = 6

const MAX_FAILURES = 8
const BASE_LOCK_MS = 5 * 60 * 1000
const MAX_LOCK_MS = 60 * 60 * 1000
const FORGET_AFTER_MS = 15 * 60 * 1000

interface AuthState {
  /** Session ids ended with Lock, mapped to when they would have expired anyway. */
  revoked: Map<string, number>
  processKey: string
  fails: number
  lastFail: number
  lockUntil: number
  strikes: number
}

// On globalThis so the state survives hot reloads in development.
const g = globalThis as unknown as { __byotAdminAuth2?: AuthState }
const state: AuthState = (g.__byotAdminAuth2 ??= {
  revoked: new Map(),
  processKey: randomBytes(32).toString('hex'),
  fails: 0,
  lastFail: 0,
  lockUntil: 0,
  strikes: 0,
})

function signingKey(): string {
  const fromEnv = (process.env.ADMIN_SESSION_SECRET ?? '').trim()
  return fromEnv.length >= 32 ? fromEnv : state.processKey
}

function sign(payload: string): string {
  return createHmac('sha256', signingKey()).update(payload).digest('hex')
}

function pin(): string {
  return (process.env.ADMIN_PIN ?? '').trim()
}

export function pinConfigured(): boolean {
  return pin().length >= MIN_PIN_LENGTH
}

function safeEqual(a: string, b: string): boolean {
  // Compare digests so length differences leak nothing and timingSafeEqual never throws.
  const ha = createHmac('sha256', 'cmp').update(a).digest()
  const hb = createHmac('sha256', 'cmp').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export function checkPin(candidate: unknown): boolean {
  if (!pinConfigured() || typeof candidate !== 'string') return false
  return safeEqual(candidate.trim(), pin())
}

/* ---------- sessions ---------- */

function sweep(now: number) {
  for (const [id, expires] of state.revoked) if (expires <= now) state.revoked.delete(id)
}

/** Token: <session id>.<expiry ms>.<signature over both>. */
export function createSession(now = Date.now()): { value: string; maxAge: number } {
  const maxAge = SESSION_HOURS * 60 * 60
  const payload = `${randomBytes(16).toString('hex')}.${now + maxAge * 1000}`
  return { value: `${payload}.${sign(payload)}`, maxAge }
}

function parseToken(token: string | undefined | null, now: number): { id: string; expires: number } | null {
  if (!token) return null
  const m = /^([0-9a-f]{32})\.(\d{13})\.([0-9a-f]{64})$/.exec(token)
  if (!m) return null
  if (!safeEqual(m[3], sign(`${m[1]}.${m[2]}`))) return null
  const expires = Number(m[2])
  // Reject the expired, and anything claiming to outlive a freshly issued session.
  if (expires <= now || expires > now + SESSION_HOURS * 60 * 60 * 1000) return null
  return { id: m[1], expires }
}

export function validSession(token: string | undefined | null, now = Date.now()): boolean {
  if (!pinConfigured()) return false
  const parsed = parseToken(token, now)
  return parsed !== null && !state.revoked.has(parsed.id)
}

export function endSession(token: string | undefined | null, now = Date.now()) {
  sweep(now)
  const parsed = parseToken(token, now)
  if (parsed) state.revoked.set(parsed.id, parsed.expires)
}

/* ---------- brute-force guard ----------
 * Counted across all callers rather than per address: a client can lie about
 * its address but cannot dodge a shared count. Each attempt is counted the
 * moment it arrives, before anything is awaited, so a burst of parallel
 * requests cannot slip past the limit. Every lock-out is twice as long as the
 * one before, up to an hour, until a correct PIN resets it.
 */

/** Seconds until attempts are accepted again; 0 when open. */
export function lockedOutFor(now = Date.now()): number {
  return state.lockUntil > now ? Math.ceil((state.lockUntil - now) / 1000) : 0
}

/**
 * Claim one attempt. Returns false when locked out. Call synchronously at the
 * top of the handler, then call attemptSucceeded() if the PIN was right.
 */
export function claimAttempt(now = Date.now()): boolean {
  if (state.lockUntil > now) return false
  if (state.fails > 0 && now - state.lastFail > FORGET_AFTER_MS) state.fails = 0
  state.fails += 1
  state.lastFail = now
  if (state.fails >= MAX_FAILURES) {
    state.lockUntil = now + Math.min(BASE_LOCK_MS * 2 ** state.strikes, MAX_LOCK_MS)
    state.strikes += 1
    state.fails = 0
  }
  return true
}

export function attemptSucceeded() {
  state.fails = 0
  state.strikes = 0
  state.lockUntil = 0
}

/* ---------- bounded request bodies ---------- */

/** Read a JSON body, refusing anything over maxBytes without buffering it. */
export async function readJson(req: Request, maxBytes: number): Promise<{ ok: true; body: unknown } | { ok: false; status: 400 | 413 }> {
  const declared = Number(req.headers.get('content-length'))
  if (Number.isFinite(declared) && declared > maxBytes) return { ok: false, status: 413 }
  if (!req.body) return { ok: false, status: 400 }
  const reader = req.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > maxBytes) {
      await reader.cancel().catch(() => {})
      return { ok: false, status: 413 }
    }
    chunks.push(value)
  }
  try {
    return { ok: true, body: JSON.parse(Buffer.concat(chunks).toString('utf8')) }
  } catch {
    return { ok: false, status: 400 }
  }
}
