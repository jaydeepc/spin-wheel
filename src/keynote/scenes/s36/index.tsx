'use client'

/**
 * Slides 36, 37, 38: THE ABCD BANKING AGENT READS A STATEMENT. One scene, three customers.
 *
 * The picture is the deck's own, left to right: the customer, his statement, what the agent
 * finds. What moves makes the point: the statement is LONG (a stack of as many sheets as it has
 * pages is dealt onto the desk: 54, then 14, then 27), the agent READS it (a light runs down the
 * page, every row glints as the light crosses it, the stack fans open and the lines it found are
 * drawn out from between the sheets, from the pages further down, and fly to the right) and what
 * it found becomes a category or an alert, and then a sentence.
 *
 * An alert (37, 38) is quiet first, then caught: the card stays empty while the agent reads, and
 * says "RAISES ALERT" only after the line is out and named. 36's card states a task, so it
 * speaks before the reading.
 *
 * No row of page 1 is marked as a finding: the found lines are real cut-outs of OTHER rows, on
 * later pages, and a mark that stayed on page 1 would claim a transaction was something it is not.
 *
 * The statements are real customer documents: the masked pictures of the pack, as they are, with
 * EXTRA mask bars over what the deck's own masks leave readable (data.ts lists every one).
 */

import gsap from 'gsap'
import { anim, Count, Headline, pic, slide as slideOf, spanBeats, Words, type SceneModule } from '../../kit'
import { CUSTOMERS, CUT_W, FOOTNOTE, FROM, PAGE, type Customer } from './data'
import { fanOf, makeStacks, STEP, type Stacks } from './stack'
import './scene.css'

const SLIDES = {
  36: ['kirana', 'reads', 'says'],
  37: ['salaried', 'visa', 'flight'],
  38: ['vendor', 'gaming', 'frequent'],
}

const ACCENT = { flame: '#f16443', azure: '#2d6ad1' }

/** rows of findings: the centre of each row, in --u from the top */
const ROW_Y: Record<number, number[]> = { 36: [27.05, 30.95, 34.85, 38.75], 37: [30.6], 38: [28.25, 33.35] }
/** where the "NN pages" chip sits on the page, as a fraction of its height (36: over the last two balance figures) */
const CHIP_TOP: Record<number, number> = { 36: 0.862, 37: 0.923, 38: 0.923 }

/** where ABCD waits before it reads: offset from its place in the card (in --u) and its size there */
const HOME = { x: 13.2, y: 11.2, s: 1.7 }
/** how small a found line is while it is still between the sheets */
const SLIP = 0.62

const pct = (v: number) => `${(v * 100).toFixed(3)}%`

/** The name as the deck types it: its block characters drawn as navy bars. */
function MaskedName({ text }: { text: string }) {
  const runs = text.match(/█+|[^█]+/g) ?? []
  return (
    <>
      {runs.map((r, i) =>
        r[0] === '█' ? <i key={i} className="s36-block" style={{ width: `${(r.length * 0.56).toFixed(2)}em` }} aria-hidden="true" /> : <span key={i}>{r}</span>,
      )}
    </>
  )
}

function CustomerParts({ c }: { c: Customer }) {
  const [sw, sh] = c.statementPx
  const box = (r: [number, number, number, number]) => ({ left: pct(r[0] / sw), top: pct(r[1] / sh), width: pct(r[2] / sw), height: pct(r[3] / sh) })
  return (
    <div className={`s36-set s36-set--${c.n}`} data-accent={c.accent}>
      {/* the customer */}
      <div className="s36-cust">
        <p className="s36-name">
          <MaskedName text={c.name} />
        </p>
        <p className="s36-desc">
          {c.desc[0]}
          <br />
          {c.descBold.length ? (
            <>
              {c.desc[1].replace(c.descBold[0], '')}
              <b>{c.descBold[0]}</b>
            </>
          ) : (
            c.desc[1]
          )}
        </p>
        <figure className="s36-photo" style={{ aspectRatio: `${c.photoPx[0]} / ${c.photoPx[1]}` }}>
          <img src={pic(c.n, c.photo)} alt="" draggable={false} />
        </figure>
      </div>

      {/* his statement: the real page, masked, on top of the stack */}
      <div className="s36-doc" style={{ aspectRatio: `${sw} / ${sh}` }}>
        <i className="s36-under s36-under--2" aria-hidden="true" />
        <i className="s36-under s36-under--1" aria-hidden="true" />
        <div className="s36-page">
          <img src={pic(c.n, c.statement)} alt="" draggable={false} />
          {c.masks.map((r, i) => (
            <i key={i} className="s36-mask" style={box(r)} aria-hidden="true" />
          ))}
          {(c.masksOnRed ?? []).map((r, i) => (
            <i key={i} className="s36-mask s36-mask--red" style={box(r)} aria-hidden="true" />
          ))}
          {c.reads.map((r, i) => (
            <i key={i} className="s36-hit" style={box(r)} aria-hidden="true" />
          ))}
          <i className="s36-scan" aria-hidden="true" />
          <span className="s36-pages" style={{ top: pct(CHIP_TOP[c.n]) }}>
            <Count to={c.pages} suffix=" pages" />
          </span>
        </div>
        <i className="s36-tape" aria-hidden="true" />
      </div>

      {/* what the agent finds */}
      <div className="s36-card">
        <i className="s36-pulse" aria-hidden="true" />
        <span className="s36-think" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="s36-cardin">
          <p className="s36-label">
            <em>ABCD</em> {c.cardLabel}
          </p>
          <p className="s36-cardtext">{c.cardText}</p>
        </div>
      </div>

      {/* the agent's name under it while it waits (the card's own first word) */}
      <p className="s36-wait">ABCD</p>

      {c.findings.map((f, i) => (
        <div key={i} className={`s36-row s36-row--${c.n}`} style={{ top: `calc(var(--u) * ${ROW_Y[c.n][i]})` }}>
          <span className="s36-cut" style={{ width: `calc(var(--u) * ${CUT_W[c.n][i]})`, aspectRatio: `${f.px[0]} / ${f.px[1]}` }}>
            <img src={pic(c.n, f.cut)} alt="" draggable={false} />
            {(f.masks ?? []).map((r, j) => (
              <i key={j} className="s36-mask" style={{ left: pct(r[0] / f.px[0]), top: pct(r[1] / f.px[1]), width: pct(r[2] / f.px[0]), height: pct(r[3] / f.px[1]) }} aria-hidden="true" />
            ))}
          </span>
          <svg className="s36-arrow" viewBox="0 0 30 10" aria-hidden="true">
            <path d="M1 5 H28 M23.5 1.4 L28 5 L23.5 8.6" />
          </svg>
          <span className="s36-chip">{f.chip}</span>
        </div>
      ))}

      <div className="s36-says">
        <p className="s36-label s36-label--says">
          <em>ABCD SAYS</em>
        </p>
        <p className="s36-saystext">
          <Words text={c.says} bold={c.saysBold} />
        </p>
      </div>
    </div>
  )
}

const scene: SceneModule = {
  slides: SLIDES,
  beats: spanBeats(SLIDES),
  preload: [
    ...CUSTOMERS.flatMap((c) => [pic(c.n, c.photo), pic(c.n, c.statement), ...c.findings.map((f) => pic(c.n, f.cut))]),
    pic(39, 'agent-abcd-desk.jpg'),
  ],

  Scene: () => (
    <div className="s36" style={{ ['--s36-page-left' as string]: PAGE.left, ['--s36-page-top' as string]: PAGE.top, ['--s36-page-w' as string]: PAGE.width }}>
      {CUSTOMERS.map((c) => (
        <Headline key={c.n} className={`s36-h s36-h--${c.n}`} text={slideOf(c.n).title} flame={c.flame} />
      ))}

      {CUSTOMERS.map((c) => (
        <CustomerParts key={c.n} c={c} />
      ))}

      <svg className="s36-chev" viewBox="0 0 30 120" aria-hidden="true">
        <path d="M3 0 H13 L29 60 L13 120 H3 L17 60 Z" fill={ACCENT.flame} />
      </svg>

      {/* ABCD itself: it stays where it is through all three customers (the deck's render; the largest copy is slide 39's) */}
      <figure className="s36-bot">
        <img src={pic(39, 'agent-abcd-desk.jpg')} alt="" draggable={false} />
      </figure>

      <p className="s36-foot">{FOOTNOTE}</p>
    </div>
  ),

  three(ctx) {
    const first = CUSTOMERS[0]
    const stacks = makeStacks(
      ctx,
      { left: PAGE.left, top: PAGE.top, width: PAGE.width, height: (PAGE.width * first.statementPx[1]) / first.statementPx[0] },
      Object.fromEntries(CUSTOMERS.map((c) => [c.n, c.pages])),
    )
    ctx.bag.stacks = stacks
    return stacks.dispose
  },

  build(ctx) {
    const { U } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const stacks = ctx.bag.stacks as Stacks | undefined
    const calm = ctx.reduced
    const set = (n: number, sel: string) => `.s36-set--${n} ${sel}`
    const bot = ctx.$('.s36-bot')

    // ---- measure first (rule 5): where each cut-out rests, and where it comes out of the stack
    // (the right edge of a sheet some way down the fanned stack: the lines are on later pages)
    const flights: Record<number, { el: HTMLElement; dx: number; dy: number }[]> = {}
    for (const c of CUSTOMERS) {
      const page = ctx.loc(ctx.$(set(c.n, '.s36-page')))
      const cuts = ctx.$$<HTMLElement>(set(c.n, '.s36-cut'))
      const count = Math.max(1, c.pages - 1)
      flights[c.n] = cuts.map((el, i) => {
        const b = ctx.loc(el)
        const from = FROM[c.n][i]
        const off = stacks ? Math.max(1, Math.round(from.depth * count)) * STEP * (1 + fanOf(count)) * U : 0.5 * U
        const edge = page.x + page.w + off // the sheet's right edge: the slip is cut off there until it is out
        // hidden, its right edge at the sheet's edge
        return { el, dx: edge - (b.w * SLIP) / 2 - b.cx, dy: page.y + from.y * page.h + off - b.cy }
      })
    }
    const pageH = ctx.loc(ctx.$(set(36, '.s36-page'))).h
    const CLIP = { in: 'inset(-40% -6% -40% 100%)', out: 'inset(-40% -6% -40% 0%)', free: 'inset(-40% -6% -40% -6%)' }

    // ---- hidden states that no move of the kit sets
    for (const c of CUSTOMERS) {
      gsap.set(set(c.n, '.s36-doc'), { autoAlpha: 0 })
      gsap.set(set(c.n, '.s36-hit'), { autoAlpha: 0 })
      gsap.set(set(c.n, '.s36-scan'), { autoAlpha: 0, y: -4 * U })
      gsap.set(set(c.n, '.s36-think'), { autoAlpha: 0 })
      gsap.set(set(c.n, '.s36-pulse'), { autoAlpha: 0 })
      // with WebGL the stack is real sheets; without it, two flat sheets under the page
      if (stacks) gsap.set(set(c.n, '.s36-under'), { autoAlpha: 0 })
      for (const f of flights[c.n]) gsap.set(f.el, calm ? { autoAlpha: 0 } : { autoAlpha: 0, x: f.dx, y: f.dy, scale: SLIP, clipPath: CLIP.in })
    }

    /** A customer arrives: his name, his photograph, his statement dealt onto the desk page by page. */
    const arrive = (c: Customer, at: number | string, waitAt: number) => {
      tl.addLabel(`in${c.n}`, at)
      const L = `in${c.n}`
      a.rise(set(c.n, '.s36-name'), L, { y: 1 })
      a.rise(set(c.n, '.s36-desc'), `${L}+=0.1`, { y: 1 })
      a.rise(set(c.n, '.s36-photo'), `${L}+=0.2`, { y: 2.2, duration: 0.9 })
      // the deal takes longer for a longer statement
      const deal = calm ? 0.01 : 0.9 + Math.min(1, c.pages / 54) * 0.9
      if (stacks) tl.to(stacks.p[c.n], { in: 1, duration: deal, ease: 'power1.inOut' }, `${L}+=0.25`)
      // the real page lands last, on top
      const doc = ctx.$(set(c.n, '.s36-doc'))
      if (calm) tl.to(doc, { autoAlpha: 1, duration: 0.5 }, `${L}+=0.4`)
      else {
        // it comes down from the camera's side, as the sheets do: never across the headline
        gsap.set(doc, { y: 0.5 * U, scale: 1.08, rotation: -2 })
        tl.to(doc, { autoAlpha: 1, duration: 0.3, ease: 'power1.out' }, `${L}+=${(0.2 + deal * 0.72).toFixed(2)}`)
        tl.to(doc, { y: 0, scale: 1, rotation: 0, duration: 0.8, ease: ctx.ease.out }, '<')
      }
      a.rule(set(c.n, '.s36-tape'), '>-0.35', { duration: 0.4 })
      a.pop(set(c.n, '.s36-pages'), '<0.05')
      a.count(set(c.n, '.s36-pages .kn-count-n'), '<', { duration: 0.9 })
      a.fade(set(c.n, '.s36-wait'), `${L}+=${waitAt}`)
    }

    /**
     * The agent reads. It takes its place in the card; the light runs down the page and every
     * row glints as it is read; the stack opens, and the lines it found are drawn out from
     * between the sheets and fly to their rows, where each is named. An alert is raised last.
     */
    const read = (c: Customer) => {
      tl.addLabel(`read${c.n}`, tl.duration())
      const L = `read${c.n}`
      const at = (t: number) => `${L}+=${t.toFixed(2)}`
      // ABCD goes to work: it takes its place in the card
      tl.to(set(c.n, '.s36-wait'), { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, L)
      tl.to(bot, { x: 0, y: 0, scale: 1, duration: 0.8, ease: ctx.ease.inOut }, L)
      a.rise(set(c.n, '.s36-card'), at(0.3), { y: 0.8, duration: 0.6 })
      if (c.alert) {
        // quiet first: the card is there, it has nothing to say yet
        gsap.set(set(c.n, '.s36-cardin'), { autoAlpha: 0, y: calm ? 0 : 0.6 * U })
        tl.to(set(c.n, '.s36-think'), { autoAlpha: 1, duration: 0.4 }, at(0.7))
      }
      const scan = ctx.$(set(c.n, '.s36-scan'))
      const t0 = 0.75
      const dur = 1.5
      tl.to(scan, { autoAlpha: 1, duration: 0.2 }, at(t0))
      tl.to(scan, { y: pageH, duration: dur, ease: 'none' }, at(t0))
      tl.to(scan, { autoAlpha: 0, duration: 0.2 }, at(t0 + dur - 0.2))
      tl.to(fx, { glow: 0.3, focusX: 0.45, focusY: 0.1, duration: 1.6, ease: ctx.ease.inOut }, at(t0))
      // every row glints as the light crosses it, and is paper again
      const sy = c.statementPx[1]
      ctx.$$(set(c.n, '.s36-hit')).forEach((el, i) => {
        const r = c.reads[i]
        const t = t0 + dur * Math.min(0.97, (((r[1] + r[3]) / sy) * pageH + 2 * U) / (pageH + 4 * U))
        tl.to(el, { autoAlpha: 1, duration: 0.1, ease: 'power1.out' }, at(t))
        tl.to(el, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, at(t + 0.12))
      })
      // the chevron steps back while the lines cross it
      tl.to('.s36-chev', { autoAlpha: 0, duration: 0.3 }, at(t0 + 0.3))

      // the lines come out of the stack: an alert's one line late, after the quiet
      const first = c.alert ? t0 + dur - 0.35 : t0 + 0.55
      const gap = c.alert ? 0.5 : 0.24
      const pull = 0.5
      const fly = 0.85
      const n = flights[c.n].length
      const lastOut = first + (n - 1) * gap + pull
      if (stacks && !calm) {
        tl.to(stacks.p[c.n], { fan: 1, duration: 0.8, ease: 'power2.out' }, at(t0))
        tl.to(stacks.p[c.n], { fan: 0, duration: 1.0, ease: 'power2.inOut' }, at(Math.max(t0 + dur, lastOut + 0.1)))
      }
      const rows = ctx.$$(`.s36-row--${c.n}`)
      let done = 0
      flights[c.n].forEach((f, i) => {
        const t = first + i * gap
        let land = t + 0.5
        if (calm) tl.to(f.el, { autoAlpha: 1, duration: 0.4 }, at(t))
        else {
          // drawn out from between two sheets …
          tl.set(f.el, { autoAlpha: 1 }, at(t))
          tl.to(f.el, { x: f.dx + f.el.offsetWidth * SLIP, clipPath: CLIP.out, duration: pull, ease: 'power2.out' }, at(t))
          // … and across to its place
          const go = at(t + pull + 0.08)
          tl.to(f.el, { x: 0, duration: fly, ease: 'power3.inOut' }, go)
          tl.to(f.el, { y: 0, scale: 1, clipPath: CLIP.free, duration: fly, ease: 'power2.inOut' }, go)
          land = t + pull + 0.08 + fly
        }
        a.draw(rows[i].querySelector('.s36-arrow path'), at(land - 0.2), { duration: 0.4 })
        a.pop(rows[i].querySelector('.s36-chip'), at(land + 0.05))
        done = land + 0.5
      })
      tl.to('.s36-chev', { autoAlpha: 1, duration: 0.4 }, at(done - 0.6))
      if (c.alert) {
        // caught: now the card speaks, and rings once
        tl.to(set(c.n, '.s36-think'), { autoAlpha: 0, duration: 0.2 }, at(done - 0.25))
        tl.to(set(c.n, '.s36-cardin'), { autoAlpha: 1, y: 0, duration: 0.55, ease: ctx.ease.out }, at(done - 0.1))
        if (!calm) tl.fromTo(set(c.n, '.s36-pulse'), { autoAlpha: 0.9, scaleX: 1, scaleY: 1 }, { autoAlpha: 0, scaleX: 1.035, scaleY: 1.16, duration: 0.9, ease: 'power2.out', immediateRender: false }, at(done))
      }
    }

    /** The agent says it in a sentence. */
    const say = (c: Customer) => {
      a.rise(set(c.n, '.s36-says'), tl.duration(), { y: 1.2 })
      a.rise(set(c.n, '.s36-label--says'), '<0.15', { y: 0.5, duration: 0.5 })
      a.words(set(c.n, '.s36-saystext'), '<0.1', { stagger: 0.028, duration: 0.6 })
      tl.to(fx, { focusY: 0.55, glow: 0.38, duration: 1.2, ease: ctx.ease.inOut }, '<')
    }

    /** A customer leaves: his findings lift away, his stack is swept off the desk. */
    const depart = (c: Customer, next: Customer) => {
      tl.addLabel(`out${c.n}`, tl.duration())
      const L = `out${c.n}`
      a.retitle(`.s36-h--${c.n}`, `.s36-h--${next.n}`, L)
      a.leave([...ctx.$$(set(c.n, '.s36-says')), ...ctx.$$(`.s36-row--${c.n}`), ...ctx.$$(set(c.n, '.s36-card'))], L, { stagger: 0.03 })
      a.leave([...ctx.$$(set(c.n, '.s36-name')), ...ctx.$$(set(c.n, '.s36-desc'))], L)
      tl.to(set(c.n, '.s36-photo'), { autoAlpha: 0, x: calm ? 0 : -2.4 * U, duration: 0.45, ease: 'power2.in' }, L)
      tl.to(set(c.n, '.s36-doc'), { autoAlpha: 0, x: calm ? 0 : -7 * U, y: calm ? 0 : -1.5 * U, rotation: calm ? 0 : -5, duration: 0.5, ease: 'power2.in' }, L)
      if (stacks) tl.to(stacks.p[c.n], { out: 1, duration: calm ? 0.01 : 0.85, ease: 'power1.in' }, `${L}+=0.05`)
      tl.to(fx, { glow: 0, focusX: 0, focusY: 0, duration: 0.6 }, L)
      // the accent turns with the customer (blue on 37, as the deck)
      tl.to(bot, { x: HOME.x * U, y: HOME.y * U, scale: HOME.s, duration: 0.9, ease: ctx.ease.inOut }, `${L}+=0.15`)
      // never blended: flame into blue passes through purple
      tl.to('.s36-chev', { autoAlpha: 0, duration: 0.25, ease: 'power1.in' }, L)
      tl.set('.s36-chev path', { fill: ACCENT[next.accent] }, `${L}+=0.3`)
      tl.to('.s36-chev', { autoAlpha: 1, duration: 0.45, ease: 'power1.out' }, `${L}+=0.75`)
      arrive(next, `${L}+=0.45`, 1.0)
    }

    const [k, s, v] = CUSTOMERS

    // ---- slide 36
    a.words('.s36-h--36', 0.1)
    a.fade('.s36-foot', 0.9)
    arrive(k, 0.15, 1.75)
    if (!calm) gsap.set('.s36-chev', { x: -1.5 * U })
    a.fade('.s36-chev', 'in36+=1.5')
    if (!calm) tl.to('.s36-chev', { x: 0, duration: 0.7, ease: ctx.ease.out }, '<')
    // ABCD waits at the end of the row, large: customer, statement, agent
    gsap.set(bot, { autoAlpha: 0, x: HOME.x * U, y: HOME.y * U, scale: calm ? HOME.s : HOME.s * 0.8 })
    tl.to(bot, { autoAlpha: 1, scale: HOME.s, duration: 0.7, ease: ctx.ease.out }, 'in36+=1.4')
    tl.addLabel('kirana')
    read(k)
    tl.addLabel('reads')
    say(k)
    tl.addLabel('says')

    // ---- slide 37
    depart(k, s)
    tl.addLabel('salaried')
    read(s)
    tl.addLabel('visa')
    say(s)
    tl.addLabel('flight')

    // ---- slide 38
    depart(s, v)
    tl.addLabel('vendor')
    read(v)
    tl.addLabel('gaming')
    say(v)
    tl.addLabel('frequent')

    return tl
  },
}

export default scene
