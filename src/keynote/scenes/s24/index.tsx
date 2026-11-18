'use client'

/**
 * Slide 24 · "AI now arms the attacker and the defender alike, and cybersecurity sits in the
 * boardroom."
 *
 * THE IDEA: the deck's chess game (orange attacks, navy defends) goes on in three dimensions
 * beside its photograph. The defender's navy king stands on his board in the middle of the
 * stage; the attacks are flame bolts that come out from behind the photograph.
 *
 *   stolen     the headline, the chess photograph, and under it the case as a picture: THE
 *              SWARM. Roughly 700 agents (700 points) pour in from the edge of the stage and
 *              from behind the photograph and close on one block, the platform; its guard ring
 *              flickers and gives; the "700" counts up as they land, and the presenter's words
 *              stand beside it as its caption. Meanwhile bolt after bolt crosses the stage and
 *              goes straight through the unprotected king: he rocks.
 *   coverup    THE COVER-UP: the record of their actions comes up (five lines of a log), a part
 *              of the swarm drops to it and runs along it line by line: three lines are
 *              deleted, two are altered, and the agents stay lying over them. The second
 *              statement and the source land beside it.
 *   news       attack, attack, attack: the king gives ground and the three clippings are
 *              pinned one by one (the leap, the playbook, the damage); more bolts now come
 *              down on him from the open air above. NONE comes from the clippings: they name
 *              real organisations, and those are the reporters, not the attackers.
 *   response   the counter-move: a dome of glass rises over the king, panel by panel. From now
 *              on every bolt is turned away, and a ring runs across the glass from where it
 *              struck. Under it the navy card: THE RESPONSE, Project Glasswing.
 *
 * The king, the dome and the bolts are real meshes on a scene-owned canvas (glass.ts). Where
 * there is no WebGL a flat drawing of the king and his dome stands in their place.
 *
 * The photograph is the deck's file, whole, never restyled. The deck's 2 by 2 block of slips is
 * laid out again as one column, so that the living picture has the middle of the stage.
 */

import gsap from 'gsap'
import { anim, Card, Clipping, Headline, Kicker, Pic, pic, Words, type SceneModule } from '../../kit'
import { CLIPS, FOOTNOTE, HACK, LOG, PHOTO, RESPONSE } from './data'
import { KING_PROFILE, makeGlass, type Glass } from './glass'
import { landed, WIPE, wipeStart, type Field } from './swarm'
import './scene.css'

/** While the right of the stage is still empty the king stands this far (in --u) right of his final place. */
const OPEN = 13.5
/** … and a little larger: he is the only thing on that side. */
const BIG = 1.14

/** The king's outline as a flat path (the fallback where there is no WebGL): his profile, mirrored. */
const KING_PATH = (() => {
  const right = KING_PROFILE.map(([r, y]) => `${r.toFixed(2)} ${(-y).toFixed(2)}`)
  const left = [...KING_PROFILE].reverse().map(([r, y]) => `${(-r).toFixed(2)} ${(-y).toFixed(2)}`)
  return `M${[...right, ...left].join('L')}Z`
})()

/** The platform's guard ring and its block, in --u about the block's middle (the SVG's own units). */
const RING = 3.5
const HALF = 1.9
/** How far out from the block's middle the swarm stands when it has come in. */
const REACH = 4.9
const ARCS = [0, 1, 2, 3].map((q) => {
  const p = (deg: number) => `${(RING * Math.cos((deg * Math.PI) / 180)).toFixed(3)} ${(RING * Math.sin((deg * Math.PI) / 180)).toFixed(3)}`
  return `M${p(q * 90 + 9)}A${RING} ${RING} 0 0 1 ${p(q * 90 + 81)}`
})
/** Only where there is no WebGL: a few of the agents, standing at the block. */
const FLAT_AGENTS = Array.from({ length: 54 }, (_, i) => {
  const a = i * 2.39996
  const r = 2.4 + 2.3 * ((i * 0.618034) % 1)
  return { x: Math.cos(a) * r, y: Math.sin(a) * r, r: 0.09 + 0.05 * ((i * 0.37) % 1) }
})

/** One caption line: its words rise through their masks. */
const Line = ({ text, tone, part }: { text: string; tone: 'light' | 'bold'; part: string }) => (
  <p className={`s24-cl s24-cl--${tone} s24-cl--${part}`}>
    <Words text={text} />
  </p>
)

const scene: SceneModule = {
  beats: ['stolen', 'coverup', 'news', 'response'],
  preload: [pic(24, PHOTO.name)],

  Scene: ({ slide }) => (
    <div className="s24">
      <Headline text={slide.title} flame={['in the boardroom']} />

      {/* the deck's picture: orange attacks, navy defends */}
      <div className="s24-photo">
        <Pic n={24} name={PHOTO.name} ratio={`${PHOTO.px[0]} / ${PHOTO.px[1]}`} fit="contain" alt="A chess game: orange pieces against navy pieces, a hand moving a navy piece" />
      </div>

      {/* THE SWARM: the platform and its guard ring (the agents are points on the canvas) */}
      <svg className="s24-plat" viewBox="-5 -5 10 10" aria-hidden="true">
        <g className="s24-plat-dots">
          {FLAT_AGENTS.map((d, i) => (
            <circle key={i} cx={d.x.toFixed(2)} cy={d.y.toFixed(2)} r={d.r.toFixed(2)} />
          ))}
        </g>
        <g className="s24-ring">
          {ARCS.map((d, i) => (
            <path key={i} className="s24-arc" d={d} />
          ))}
        </g>
        <g className="s24-block">
          <rect className="s24-block-body" x={-HALF} y={-HALF} width={HALF * 2} height={HALF * 2} rx="0.6" />
          {[-1.03, -0.25, 0.53].map((y) => (
            <rect key={y} className="s24-bay" x="-1.16" y={y} width="2.32" height="0.5" rx="0.25" />
          ))}
        </g>
      </svg>
      <div className="s24-cap s24-cap--swarm">
        <Line text={HACK.swarm.lead} tone="light" part="lead" />
        <div className="s24-figrow">
          <b className="s24-fig">{HACK.swarm.fig}</b>
          <div>
            {HACK.swarm.beside.map((t) => (
              <Line key={t} text={t} tone="bold" part="beside" />
            ))}
          </div>
        </div>
        {HACK.swarm.statement.map((t) => (
          <Line key={t} text={t} tone="bold" part="statement" />
        ))}
        <div className="s24-tail">
          {HACK.swarm.tail.map((t) => (
            <Line key={t} text={t} tone="light" part="tail" />
          ))}
        </div>
      </div>

      {/* THE COVER-UP: the record of their actions, five lines of a log */}
      <div className="s24-log" aria-hidden="true">
        <svg className="s24-log-sheet" viewBox="0 0 9.2 6.6">
          <path d="M0.65 0.05H7.6L9.15 1.6V5.95A0.6 0.6 0 0 1 8.55 6.55H0.65A0.6 0.6 0 0 1 0.05 5.95V0.65A0.6 0.6 0 0 1 0.65 0.05" />
          <path d="M7.6 0.05V1.1A0.5 0.5 0 0 0 8.1 1.6H9.15" />
        </svg>
        {LOG.map((row, k) => (
          <div key={k} className="s24-log-line" style={{ top: `calc(var(--u) * ${(0.92 + k * 1.08).toFixed(2)})` }}>
            <i className="s24-log-ghost" />
            <span className="s24-log-ink">
              <i className="s24-log-tick" />
              {row.bars.map((w, j) => (
                <i key={j} style={{ width: `calc(var(--u) * ${w})` }} />
              ))}
            </span>
            {'alt' in row ? (
              <span className="s24-log-alt">
                <i className="s24-log-tick" />
                {row.alt.map((w, j) => (
                  <i key={j} style={{ width: `calc(var(--u) * ${w})` }} />
                ))}
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="s24-cap s24-cap--cover">
        <Line text={HACK.cover.lead} tone="light" part="lead" />
        {HACK.cover.statement.map((t) => (
          <Line key={t} text={t} tone="bold" part="statement" />
        ))}
        <p className="s24-case-src">{HACK.source}</p>
      </div>

      {/* only where there is no WebGL: the king and his dome, flat */}
      <svg className="s24-flat" viewBox="-13 -15 26 17" aria-hidden="true">
        <ellipse className="s24-flat-board" cx="0" cy="0.2" rx="12.2" ry="1.5" />
        <g className="s24-flat-king">
          <path d={KING_PATH} />
          <rect x="-0.22" y="-10.4" width="0.44" height="1.5" />
          <rect x="-0.61" y="-10.02" width="1.22" height="0.42" />
        </g>
        <path className="s24-flat-dome" d="M-11 0C-11 -18.4 11 -18.4 11 0" />
      </svg>

      {CLIPS.map((c) => (
        <Clipping key={c.key} className={`s24-clip s24-clip--${c.key}`} date={c.date} tape={c.tape} source={c.source} tilt={c.tilt} width={29}>
          {c.headline}
        </Clipping>
      ))}

      <Card tone="navy" className="s24-answer">
        <Kicker className="s24-answer-k" block>
          {RESPONSE.label}
        </Kicker>
        <h2 className="s24-answer-t">
          <Words text={RESPONSE.title} />
        </h2>
        <p className="s24-answer-p">
          <Words text={RESPONSE.text} bold={[...RESPONSE.bold]} />
        </p>
      </Card>

      <p className="s24-src">{FOOTNOTE}</p>
    </div>
  ),

  three(ctx) {
    const glass = makeGlass(ctx)
    ctx.bag.glass = glass
    ctx.root.dataset.gl = '1'
    return () => {
      delete ctx.root.dataset.gl
      glass.gl.dispose()
    }
  },

  build(ctx) {
    const { U, ease, reduced } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const glass = ctx.bag.glass as Glass | undefined

    // measure first, hide second: where the page laid out the platform and the lines of its log
    const u = (px: number) => px / U
    const plat = ctx.loc(ctx.$('.s24-plat'))
    const rows = ctx.$$('.s24-log-line')
    const field: Field = {
      block: { cx: u(plat.cx), cy: u(plat.cy), half: HALF },
      ring: RING,
      reach: REACH,
      lines: rows.map((row) => {
        const r = ctx.loc(row)
        return { x0: u(r.x), x1: u(r.x + r.w), y: u(r.cy) }
      }),
    }
    glass?.swarm.layout(field)
    /** the three numbers of the case: the canvas reads them where there is one */
    const flow = glass?.swarm.sim ?? { swarm: 0, breach: 0, wipe: 0 }

    /* =============================================================== stolen */
    a.words('.kn-h', 0.1)
    a.rise('.s24-photo', 0.2, { y: 2, duration: 1.0 })
    const photo = ctx.$('.s24-photo .kn-pic img')
    if (!reduced) {
      // a slow push out of the picture: it settles at its own size, never larger
      gsap.set(photo, { scale: 1.08, transformOrigin: '38% 60%' })
      tl.to(photo, { scale: 1, duration: 2.4, ease: 'power2.out' }, 0.2)
    }
    if (glass) {
      // the king comes up on his board
      const { rig, sim, gl } = glass
      // he begins in the middle of the open stage; the news will push him to his place (below)
      if (!reduced) gsap.set(rig.position, { x: rig.position.x + OPEN })
      gsap.set(gl.canvas, { autoAlpha: 0 })
      tl.to(gl.canvas, { autoAlpha: 1, duration: 0.7, ease: 'power1.out' }, 0.4)
      if (!reduced) {
        const y = rig.position.y
        gsap.set(rig.position, { y: y - 3.5 })
        gsap.set(rig.scale, { x: 1, y: 1, z: 1 })
        tl.to(rig.position, { y, duration: 1.3, ease: ease.out }, 0.55)
        tl.to(rig.scale, { x: BIG, y: BIG, z: BIG, duration: 1.3, ease: ease.out }, 0.55)
      }
      // … and the attacks begin: from the orange side of the board
      tl.to(sim, { attack: 0.667, duration: 1.0, ease: 'power1.in' }, 1.15)
    } else {
      a.rise('.s24-flat-board', 0.6)
      a.rise('.s24-flat-king', 0.75, { y: 2.4 })
    }
    /* ---- the case, as a picture: THE SWARM ---- */
    gsap.set(ctx.$('.s24-block'), { svgOrigin: '0 0' })
    a.pop('.s24-block', 0.85, { from: 0.8 })
    a.draw('.s24-arc', 1.0, { duration: 0.6, stagger: 0.05 })
    a.fade('.s24-plat-dots', 1.6, { duration: 0.9 })
    a.words('.s24-cap--swarm .s24-cl--lead', 0.95)
    // the agents pour in, and the figure counts them as they land
    const fig = ctx.$('.s24-fig') as HTMLElement
    const count = () => {
      if (!reduced) fig.textContent = String(landed(flow.swarm))
    }
    fig.textContent = HACK.swarm.fig
    a.rise(fig, 1.05, { y: 0.8, duration: 0.6 })
    tl.to(flow, { swarm: 1, duration: 1.9, ease: 'none', onUpdate: count }, 1.0)
    count()
    a.words('.s24-cl--beside', 1.35, { stagger: 0.05 })
    a.words('.s24-cap--swarm .s24-cl--statement', 1.75, { stagger: 0.035 })
    // the guard ring flickers …
    const ring = ctx.$('.s24-ring')
    if (!reduced) [0.25, 1, 0.4, 0.95, 0.2, 0.85].forEach((o, i) => tl.to(ring, { opacity: o, duration: 0.07, ease: 'none' }, 2.1 + i * 0.07))
    // … and gives: its four arcs slip apart and go pale, and the agents go in to the walls
    ctx.$$('.s24-arc').forEach((arc, q) => {
      const mid = ((q * 90 + 45) * Math.PI) / 180
      tl.to(
        arc,
        { x: reduced ? 0 : Math.cos(mid) * 0.5, y: reduced ? 0 : Math.sin(mid) * 0.5, rotation: reduced ? 0 : q % 2 ? 13 : -9, svgOrigin: '0 0', opacity: 0.26, duration: 0.6, ease: 'power2.out' },
        2.55 + q * 0.03,
      )
    })
    tl.to(flow, { breach: 1, duration: 0.75, ease: 'power1.inOut' }, 2.55)
    tl.to(ctx.$$('.s24-bay'), { fill: '#f16443', duration: 0.3, stagger: 0.12, ease: 'power1.out' }, 2.8)
    a.words('.s24-cl--tail', 2.6, { stagger: 0.03 })
    a.fade('.s24-src', 2.0)
    tl.to(fx, { glow: 0.3, focusX: -0.3, focusY: 0.05, warm: 0.35, duration: 1.8 }, 0.5)
    const S = 3.5
    tl.addLabel('stolen', S)

    /* ============================================================== coverup */
    // the record of their actions comes up …
    a.draw('.s24-log-sheet path', S + 0.05, { duration: 0.6, stagger: 0.1 })
    a.rise(rows, S + 0.15, { y: 0, x: -1.2, stagger: 0.06, duration: 0.5 })
    a.words('.s24-cap--cover .s24-cl--lead', S + 0.2)
    // … and is run along, line after line: deleted (a pale trace is left) or altered (it reads otherwise)
    const W0 = S + 0.55
    const WD = 2.0
    tl.to(flow, { wipe: 1, duration: WD, ease: 'none' }, W0)
    rows.forEach((row, k) => {
      const at = W0 + wipeStart(k) * WD
      const run = WIPE.run * WD
      const ink = row.querySelector('.s24-log-ink')
      const ghost = row.querySelector('.s24-log-ghost')
      const alt = row.querySelector('.s24-log-alt')
      if (ink) {
        gsap.set(ink, { clipPath: 'inset(-20% 0% -20% 0%)' })
        tl.to(ink, { clipPath: 'inset(-20% 0% -20% 100%)', duration: run, ease: 'none' }, at)
      }
      if (alt) {
        gsap.set(alt, { clipPath: 'inset(-20% 100% -20% 0%)', autoAlpha: 1 })
        tl.to(alt, { clipPath: 'inset(-20% 0% -20% 0%)', duration: run, ease: 'none' }, at + 0.12)
      } else if (ghost) {
        gsap.set(ghost, { autoAlpha: 0 })
        tl.to(ghost, { autoAlpha: 1, duration: run, ease: 'none' }, at + 0.1)
      }
    })
    a.words('.s24-cap--cover .s24-cl--statement', S + 0.8, { stagger: 0.07 })
    a.fade('.s24-case-src', S + 2.3)
    tl.to(fx, { focusY: 0.3, glow: 0.36, duration: 1.6, ease: ease.inOut }, S + 0.2)
    const L = S + 2.9
    tl.addLabel('coverup', L)

    /* ================================================================= news */
    ctx.$$('.s24-clip').forEach((clip, i) => {
      const at = L + 0.05 + i * 0.5
      gsap.set(clip, { autoAlpha: 0, y: reduced ? 0 : -1.5 * U, rotation: reduced ? 0 : i % 2 ? 2.4 : -2.4, transformOrigin: '50% 0%' })
      tl.to(clip, { autoAlpha: 1, duration: 0.22, ease: 'power1.out' }, at)
      tl.to(clip, { y: 0, duration: 0.42, ease: 'power2.in' }, at)
      tl.to(clip, { rotation: i % 2 ? -0.8 : 0.8, duration: 0.15, ease: 'power1.out' }, at + 0.42)
      tl.to(clip, { rotation: 0, duration: 0.5, ease: 'power2.inOut' }, at + 0.57)
    })
    if (glass) {
      // the king gives ground to the news: he moves to the middle, between his attackers
      if (!reduced) {
        tl.to(glass.rig.position, { x: glass.rig.position.x - OPEN, duration: 1.3, ease: ease.inOut }, L)
        tl.to(glass.rig.scale, { x: 1, y: 1, z: 1, duration: 1.3, ease: ease.inOut }, L)
      }
      tl.to(glass.sim, { attack: 1, duration: 1.2, ease: 'none' }, L + 0.6)
    }
    tl.to(fx, { focusX: 0.25, focusY: 0.05, glow: 0.3, warm: 0.5, energy: 0.2, duration: 1.6, ease: ease.inOut }, L)
    tl.addLabel('news', L + 2.3)

    /* ============================================================= response */
    const M = L + 2.3
    if (glass) {
      tl.to(glass.sim, { rise: 1, duration: 1.25, ease: 'power2.inOut' }, M + 0.1)
      tl.to(glass.sim, { hold: 1, duration: 0.45, ease: 'power1.out' }, M + 0.45)
    } else {
      a.draw('.s24-flat-dome', M + 0.1, { duration: 1.2 })
    }
    a.rise('.s24-answer', M + 0.7, { y: 2.6, duration: 0.9 })
    a.fade('.s24-answer-k', M + 0.8)
    a.words('.s24-answer-t', M + 0.85)
    a.words('.s24-answer-p', M + 1.1, { stagger: 0.025 })
    tl.to(fx, { glow: 0.42, focusX: -0.03, focusY: 0.05, warm: -0.35, energy: 0.05, duration: 1.6, ease: ease.inOut }, M)
    const END = M + 2.5
    tl.addLabel('response', END)

    // the attack's own clock runs with the timeline (the idle loop adds the room's time to it)
    if (glass) tl.to(glass.sim, { clock: END * 0.7, duration: END, ease: 'none' }, 0)
    return tl
  },
}

export default scene
