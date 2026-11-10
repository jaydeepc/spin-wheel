import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import {
  SESSION_COOKIE,
  attemptSucceeded,
  checkPin,
  claimAttempt,
  createSession,
  endSession,
  lockedOutFor,
  pinConfigured,
  readJson,
  validSession,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function isHttps(req: Request) {
  return req.headers.get('x-forwarded-proto') === 'https' || new URL(req.url).protocol === 'https:'
}

/** Is this browser unlocked? */
export async function GET() {
  const jar = await cookies()
  return NextResponse.json({ unlocked: validSession(jar.get(SESSION_COOKIE)?.value), configured: pinConfigured() })
}

/** Unlock with the PIN. */
export async function POST(req: Request) {
  if (!pinConfigured()) {
    return NextResponse.json({ error: 'not-configured' }, { status: 503 })
  }
  // Count the attempt before the first await, so parallel requests cannot outrun the limit.
  if (!claimAttempt()) {
    const wait = lockedOutFor()
    return NextResponse.json({ error: 'locked', retryAfter: wait }, { status: 429, headers: { 'Retry-After': String(wait) } })
  }
  const read = await readJson(req, 1024)
  if (!read.ok) {
    return NextResponse.json({ error: 'bad-request', retryAfter: lockedOutFor() }, { status: read.status })
  }
  const candidate = (read.body as { pin?: unknown } | null)?.pin
  if (!checkPin(candidate)) {
    return NextResponse.json({ error: 'wrong-pin', retryAfter: lockedOutFor() }, { status: 401 })
  }
  attemptSucceeded()
  const session = createSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: 'strict',
    secure: isHttps(req),
    path: '/',
    maxAge: session.maxAge,
  })
  return res
}

/** Lock again: the session is ended on the server, not just forgotten by the browser. */
export async function DELETE() {
  const jar = await cookies()
  endSession(jar.get(SESSION_COOKIE)?.value)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'strict', path: '/', maxAge: 0 })
  return res
}
