import { NextResponse, type NextRequest } from 'next/server'

/**
 * A password on the whole site.
 *
 * The password is the environment variable SITE_PASSWORD (set in Vercel, never in the code: this
 * repository is public). When the variable is not set (a local `npm run dev`, a preview without
 * it) the site is open, exactly as before.
 *
 * The browser's own sign-in box asks for it once per browser session (HTTP Basic). Any user name
 * is accepted; only the password counts. Every page and every file is behind it, so a direct link
 * to a picture or to the call recording does not work without it either.
 */
export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD
  if (!password) return NextResponse.next()

  const header = req.headers.get('authorization') ?? ''
  if (header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6))
      const given = decoded.slice(decoded.indexOf(':') + 1)
      if (same(given, password)) return NextResponse.next()
    } catch {
      /* not base64: ask again */
    }
  }

  return new NextResponse('This site needs a password.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Piramal.ai", charset="UTF-8"', 'Cache-Control': 'no-store' },
  })
}

/** Compare without stopping at the first different character. */
function same(a: string, b: string): boolean {
  const n = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < n; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  return diff === 0
}

/** Everything: pages, the files under /public, the API routes and Next's own assets. */
export const config = { matcher: '/:path*' }
