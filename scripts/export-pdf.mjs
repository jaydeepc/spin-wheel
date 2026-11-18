#!/usr/bin/env node
/**
 * PDF EXPORT of the two films: Everyday AI (/everyday-ai) and the Keynote (/keynote).
 *
 *   npm run pdf                    both decks
 *   npm run pdf -- everyday        Everyday AI only
 *   npm run pdf -- keynote         the Keynote only
 *   npm run pdf -- keynote --beats one page for EVERY beat of every slide (the build-ups), not
 *                                  only the slide's last state
 *   npm run pdf -- keynote --from 10 --to 20      a range of keynote slides
 *
 * The app must be running (it is opened at BASE, http://localhost:5183 by default). The script
 * drives a headless Google Chrome: it opens each page held at its rest (the films' own hold
 * URLs: ?scene=…&at=… and ?s=…&at=…&chrome=0&still=1), takes a picture of it, and prints the
 * pictures as one PDF, one page each, 16:9. Nothing in the app is changed.
 *
 * Output: exports/pdf/everyday-ai.pdf and exports/pdf/keynote.pdf (git-ignored).
 *
 * Options (environment):
 *   BASE=http://localhost:5183   where the app is
 *   W=1920 H=1080                the page, in CSS pixels
 *   SCALE=1.5                    pixels per CSS pixel in the pictures (2 is sharper and larger)
 *   CHROME=/path/to/chrome       the browser to drive
 *
 * No dependencies: Node 22+ (its own fetch and WebSocket) and Google Chrome.
 */
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = (process.env.BASE || 'http://localhost:5183').replace(/\/$/, '')
const W = Number(process.env.W) || 1920
const H = Number(process.env.H) || 1080
const SCALE = Number(process.env.SCALE) || 1.5
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const PORT = 9412
const OUT = join(ROOT, 'exports', 'pdf')

const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : fallback
}
const wants = (deck) => !args.some((a) => a === 'everyday' || a === 'keynote') || args.includes(deck)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ---------------------------------------------------------------- the pages of Everyday AI
// One page for each rest of the film, in the order it is presented.
const PRODUCTS = ['smarthelp', 'byot', 'byoa', 'prastuti']
const STEPS = ['before', 'demo', 'result', 'stat']
const EVERYDAY = [
  'scene=intro&at=idle',
  'scene=priya&at=in',
  ...PRODUCTS.flatMap((k) => STEPS.map((at) => `scene=${k}&at=${at}`)),
  'scene=engineering&at=in',
  ...STEPS.map((at) => `scene=mind&at=${at}`),
  'scene=finale&at=done',
]
/** The film's own navigation (Back, Next, the dots, the Auto-play switch) is not part of a page. */
const EVERYDAY_HIDE = '.ev-nav, .ev-dots, .ev-auto { visibility: hidden !important; }'

// ---------------------------------------------------------------- the browser
async function openBrowser() {
  const profile = mkdtempSync(join(tmpdir(), 'pdf-export-'))
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, '--hide-scrollbars', `--window-size=${W},${H}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
  chrome.on('error', () => {
    console.error(`Could not start Chrome at ${CHROME}. Set CHROME=/path/to/chrome.`)
    process.exit(1)
  })
  let target
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250)
    try {
      target = (await (await fetch(`http://127.0.0.1:${PORT}/json`)).json()).find((t) => t.type === 'page')
    } catch {}
  }
  if (!target) throw new Error('Chrome did not open its debugging port')
  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((r, x) => {
    ws.onopen = r
    ws.onerror = x
  })
  let id = 0
  const pending = new Map()
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data)
    if (d.id && pending.has(d.id)) {
      const { ok, no } = pending.get(d.id)
      pending.delete(d.id)
      if (d.error) no(new Error(d.error.message))
      else ok(d.result)
    }
  }
  const send = (method, params = {}) =>
    new Promise((ok, no) => {
      pending.set(++id, { ok, no })
      ws.send(JSON.stringify({ id, method, params }))
    })
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value
  /** Waits until `expression` is truthy in the page; false if it never is. */
  const until = async (expression, ms = 20000) => {
    const end = Date.now() + ms
    while (Date.now() < end) {
      try {
        if (await evaluate(expression)) return true
      } catch {}
      await sleep(150)
    }
    return false
  }
  const size = (scale) => send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: scale, mobile: false })
  const shot = async () => Buffer.from((await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 })).data, 'base64')
  const close = () => {
    try {
      ws.close()
    } catch {}
    chrome.kill()
    // (Chrome may still be writing its profile as it quits: try a few times, and never fail on it)
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 })
    } catch {}
  }
  return { send, evaluate, until, size, shot, close }
}

// ---------------------------------------------------------------- the pictures
async function shootEveryday(b) {
  const pages = []
  for (const [i, q] of EVERYDAY.entries()) {
    await b.send('Page.navigate', { url: `${BASE}/everyday-ai?${q}` })
    const ready = await b.until(`document.querySelector('.ev-root')?.dataset.ready === '1'`)
    if (!ready) console.warn(`  (page ${i + 1}, ${q}: the film did not report ready; shot anyway)`)
    await b.evaluate(`document.fonts.ready.then(() => { const s = document.createElement('style'); s.textContent = ${JSON.stringify(EVERYDAY_HIDE)}; document.head.appendChild(s); return true })`)
    await sleep(2200) // the hold has landed, the pictures have decoded, the number has counted
    pages.push(await b.shot())
    console.log(`  everyday ${String(i + 1).padStart(2)}/${EVERYDAY.length}  ${q}`)
  }
  return pages
}

async function shootKeynote(b) {
  const pages = []
  const root = `document.querySelector('[data-slide]')`
  const url = (n, at) => `${BASE}/keynote?s=${n}${at ? `&at=${encodeURIComponent(at)}` : ''}&chrome=0&still=1&warm=0`
  const settle = async (beat) => {
    const ok = await b.until(`${root}?.dataset.ready === '1' && ${root}.dataset.resting === '1'${beat ? ` && ${root}.dataset.beat === ${JSON.stringify(beat)}` : ''}`, 15000)
    await sleep(700)
    return ok
  }
  await b.send('Page.navigate', { url: url(1) })
  await b.until(`!!window.__kn && !!window.__kn.info()`)
  // how many slides: asked for far past the end, the film answers with its last one
  await b.send('Page.navigate', { url: url(9999) })
  await b.until(`!!window.__kn && !!window.__kn.info()`)
  const count = Number(await b.evaluate(`window.__kn.info().n`)) || 1
  const from = Math.max(1, value('from', 1))
  const to = Math.min(count, value('to', count))
  for (let n = from; n <= to; n++) {
    await b.send('Page.navigate', { url: url(n) })
    const up = await b.until(`!!window.__kn && window.__kn.info()?.n === ${n}`)
    if (!up) {
      console.warn(`  (slide ${n} did not load; skipped)`)
      continue
    }
    const beats = (await b.evaluate(`window.__kn.info().beats`)) ?? []
    const list = flag('beats') ? beats : beats.slice(-1)
    for (const beat of list.length ? list : [null]) {
      if (beat) await b.send('Page.navigate', { url: url(n, beat) })
      const ok = await settle(beat)
      if (!ok) console.warn(`  (slide ${n}${beat ? `, ${beat}` : ''}: did not report its rest; shot anyway)`)
      pages.push(await b.shot())
      console.log(`  keynote ${String(n).padStart(2)}/${count}${beat ? `  ${beat}` : ''}`)
    }
  }
  return pages
}

// ---------------------------------------------------------------- the PDF
async function printPdf(b, name, pages) {
  const dir = mkdtempSync(join(tmpdir(), 'pdf-pages-'))
  pages.forEach((buf, i) => writeFileSync(join(dir, `${i}.jpg`), buf))
  const html = `<!doctype html><meta charset="utf-8"><style>
    @page { size: ${W}px ${H}px; margin: 0 }
    html, body { margin: 0; padding: 0; background: #fff }
    img { display: block; width: ${W}px; height: ${H}px; break-after: page }
    img:last-child { break-after: auto }
  </style>${pages.map((_, i) => `<img src="${i}.jpg">`).join('')}`
  writeFileSync(join(dir, 'index.html'), html)
  await b.size(1)
  await b.send('Page.navigate', { url: pathToFileURL(join(dir, 'index.html')).href })
  await b.until(`document.images.length === ${pages.length} && [...document.images].every((i) => i.complete && i.naturalWidth > 0)`, 60000)
  const { stream } = await b.send('Page.printToPDF', {
    printBackground: true,
    preferCSSPageSize: true,
    paperWidth: W / 96,
    paperHeight: H / 96,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    transferMode: 'ReturnAsStream',
  })
  const chunks = []
  for (;;) {
    const part = await b.send('IO.read', { handle: stream, size: 1 << 20 })
    chunks.push(Buffer.from(part.data, part.base64Encoded ? 'base64' : 'utf8'))
    if (part.eof) break
  }
  await b.send('IO.close', { handle: stream })
  mkdirSync(OUT, { recursive: true })
  const file = join(OUT, `${name}.pdf`)
  const pdf = Buffer.concat(chunks)
  writeFileSync(file, pdf)
  rmSync(dir, { recursive: true, force: true })
  console.log(`${file}  (${pages.length} pages, ${(pdf.length / 1048576).toFixed(1)} MB)`)
  await b.size(SCALE)
}

// ---------------------------------------------------------------- run
try {
  await fetch(BASE)
} catch {
  console.error(`The app is not answering at ${BASE}. Start it first, or set BASE=…`)
  process.exit(1)
}
const b = await openBrowser()
try {
  await b.size(SCALE)
  if (wants('everyday')) {
    console.log('Everyday AI')
    await printPdf(b, 'everyday-ai', await shootEveryday(b))
  }
  if (wants('keynote')) {
    console.log('Keynote')
    await printPdf(b, 'keynote', await shootKeynote(b))
  }
} finally {
  b.close()
}
process.exit(0)
