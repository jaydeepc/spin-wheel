import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import Admin from '@/components/Admin'
import PinGate from '@/components/PinGate'
import { SESSION_COOKIE, pinConfigured, validSession } from '@/lib/auth'
import './admin.css'

export const metadata: Metadata = { title: 'Showcase admin — BYOT · BYOA' }
export const dynamic = 'force-dynamic'

/** The editor is only ever sent to a browser that has already entered the PIN. */
export default async function Page() {
  const jar = await cookies()
  if (!validSession(jar.get(SESSION_COOKIE)?.value)) {
    return <PinGate configured={pinConfigured()} />
  }
  return <Admin />
}
