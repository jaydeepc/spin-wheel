import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SESSION_COOKIE, readJson, validSession } from '@/lib/auth'
import { readStored, writeStored } from '@/lib/storage'
import { parseShowcase } from '@/data/parse'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/** Public: the kiosk reads the content from here. */
export async function GET() {
  try {
    const raw = await readStored()
    // Nothing saved yet: the client falls back to the sample set.
    return NextResponse.json({ data: raw ? parseShowcase(JSON.parse(raw)) : null })
  } catch {
    return NextResponse.json({ data: null, error: 'unavailable' }, { status: 503 })
  }
}

/** Writing needs an unlocked admin session. */
export async function PUT(req: Request) {
  const jar = await cookies()
  if (!validSession(jar.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: 'locked' }, { status: 401 })
  }
  const read = await readJson(req, 2 * 1024 * 1024)
  if (!read.ok) {
    return NextResponse.json({ error: read.status === 413 ? 'Too large' : 'Invalid JSON' }, { status: read.status })
  }
  const parsed = parseShowcase(read.body)
  if (!parsed) return NextResponse.json({ error: 'Not a showcase file' }, { status: 400 })
  try {
    await writeStored(JSON.stringify(parsed, null, 2))
    return NextResponse.json({ ok: true })
  } catch {
    // The store could not be written; the browser copy still holds the content.
    return NextResponse.json({ error: 'Could not save' }, { status: 500 })
  }
}
