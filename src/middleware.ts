import { NextResponse, type NextRequest } from 'next/server'

/**
 * A password on the whole site.
 *
 * The password is the environment variable SITE_PASSWORD (set in Vercel, never in the code: this
 * repository is public). When the variable is not set (a local `npm run dev`, a preview without
 * it) the site is open, exactly as before.
 *
 * Without the cookie, any page shows a small password-only form (no user name). The form posts to
 * /__login, which sets an http-only cookie holding a hash of the password (never the password
 * itself) and goes back to the page that was asked for. Files and API calls without the cookie get
 * a plain 401, so a direct link to a picture or to the call recording does not work either.
 */
const COOKIE = 'site_pass'
const LOGIN = '/__login'
const DAYS = 7

export async function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD
  if (!password) return NextResponse.next()

  const token = await hash(password)
  const { pathname, search } = req.nextUrl

  if (pathname === LOGIN) {
    if (req.method !== 'POST') return NextResponse.redirect(new URL('/', req.url))
    const form = await req.formData().catch(() => null)
    const given = String(form?.get('password') ?? '')
    const next = safeNext(String(form?.get('next') ?? '/'))
    if (!same(await hash(given), token)) return page(next, true)
    const res = NextResponse.redirect(new URL(next, req.url), 303)
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: req.nextUrl.protocol === 'https:',
      sameSite: 'lax',
      path: '/',
      maxAge: DAYS * 24 * 60 * 60,
    })
    return res
  }

  if (same(req.cookies.get(COOKIE)?.value ?? '', token)) return NextResponse.next()

  const wantsPage = req.method === 'GET' && (req.headers.get('accept') ?? '').includes('text/html')
  if (wantsPage) return page(pathname + search, false)
  return new NextResponse('This site needs a password.', { status: 401, headers: { 'Cache-Control': 'no-store' } })
}

async function hash(s: string): Promise<string> {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('piramal-site:' + s))
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Compare without stopping at the first different character. */
function same(a: string, b: string): boolean {
  const n = Math.max(a.length, b.length)
  let diff = a.length ^ b.length
  for (let i = 0; i < n; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0)
  return diff === 0
}

/** Only a path on this site, never another site. */
function safeNext(n: string): string {
  return n.startsWith('/') && !n.startsWith('//') && !n.startsWith('/\\') ? n : '/'
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

function page(next: string, wrong: boolean): NextResponse {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Piramal.ai</title>
<style>
  *{box-sizing:border-box}
  html,body{margin:0;height:100%;background:#0b0f1a;color:#e8ecf4;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
  body{display:grid;place-items:center;padding:16px}
  form{width:100%;max-width:340px;display:grid;gap:14px}
  h1{margin:0 0 6px;font-size:22px;font-weight:600;letter-spacing:.01em}
  input{width:100%;padding:13px 14px;font-size:16px;border-radius:10px;border:1px solid #2a3350;background:#121829;color:inherit;outline:none}
  input:focus{border-color:#f5b83d}
  button{padding:13px;font-size:16px;font-weight:600;border:0;border-radius:10px;background:#f5b83d;color:#0b0f1a;cursor:pointer}
  p{margin:0;font-size:14px;color:#ff8f8f}
</style></head><body>
<form method="post" action="${LOGIN}">
  <h1>Piramal.ai</h1>
  <input type="hidden" name="next" value="${esc(safeNext(next))}">
  <input type="password" name="password" placeholder="Password" aria-label="Password" autocomplete="current-password" autofocus required>
  ${wrong ? '<p>That password is not right.</p>' : ''}
  <button type="submit">Enter</button>
</form></body></html>`
  return new NextResponse(html, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

/** Everything: pages, the files under /public, the API routes and Next's own assets. */
export const config = { matcher: '/:path*' }
