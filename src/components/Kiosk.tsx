'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useShowcase } from '@/data/store'
import Detail from './Detail'
import { playDetail, prepareDetail } from './detailTimeline'
import Wheel, { accentForPlatform } from './Wheel'
import { playTick, playWin, unlockSound } from './sound'

// 'landed' is the hold after the wheel stops: the result is announced beside the wheel before the page arrives.
type Phase = 'idle' | 'spinning' | 'stopping' | 'landed' | 'detail' | 'returning'

const DRIFT = 5 // deg/s the wheel idles at, so the screen is never still
// deg/s at full spin. At 60Hz this is under 7° a frame: less than half the narrowest wedge (18° at 20 segments),
// so the dividers can never alias into a strobe or appear to run backwards.
const CRUISE = 400
const MIN_STOP_SPEED = 240
const COAST_SECONDS = 4.6
const MAX_FRAME_MS = 100 // a longer gap than this is a stall, not a frame: do not jump the wheel across it
// The face cross-fades toward its symmetric "smear" layer between these speeds (deg/s).
const SMEAR_FROM = 130
const SMEAR_FULL = 370
const SMEAR_MAX = 0.8
// Seconds the result is held on screen, wheel still and winner lit, before the hand-over to the page.
const HOLD_SECONDS = 2.6

const PLATFORM_NAME = { BYOT: 'Build Your Own Tech', BYOA: 'Build Your Own Agents' } as const

/** The stop, run by the ticker on frame timestamps: rot = from + distance · (1 − (1 − t/duration)³). */
interface Coast {
  from: number
  distance: number
  duration: number
  t: number
  done: () => void
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

interface Spot {
  cx: number
  cy: number
  size: number
}

export default function Kiosk() {
  const router = useRouter()
  const { data, ready, refresh } = useShowcase()
  const active = useMemo(() => data.useCases.filter((u) => u.active), [data.useCases])
  const segments = useMemo(() => active.map((u) => ({ id: u.id, label: u.wheelLabel, tag: u.platform })), [active])
  const teams = useMemo(() => new Set(active.map((u) => u.team.trim()).filter(Boolean)).size, [active])

  const [phase, setPhaseState] = useState<Phase>('idle')
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [lit, setLit] = useState(false)

  const phaseRef = useRef<Phase>('idle')
  const setPhase = useCallback((p: Phase) => {
    phaseRef.current = p
    setPhaseState(p)
  }, [])

  const stageRef = useRef<HTMLDivElement>(null)
  const rigRef = useRef<HTMLDivElement>(null)
  const spinRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const rippleRef = useRef<HTMLDivElement>(null)
  const againRef = useRef<HTMLButtonElement>(null)
  const landedRef = useRef<HTMLDivElement>(null)
  // True from the moment the wheel stops until it has docked: nothing can be started or undone in between.
  const busy = useRef(false)

  const motion = useRef({ rot: 0, vel: DRIFT, mode: 'drift' as 'drift' | 'free' | 'tween', lastIdx: 0, lastKick: 0 })
  const spots = useRef<{ home: Spot; dock: Spot }>({
    home: { cx: 0, cy: 0, size: 0 },
    dock: { cx: 0, cy: 0, size: 0 },
  })
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const autoStop = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeRef = useRef(active)
  activeRef.current = active
  const soundRef = useRef(data.settings.sound)
  soundRef.current = data.settings.sound

  const winnerIndex = winnerId ? active.findIndex((u) => u.id === winnerId) : -1
  const winner = winnerIndex >= 0 ? active[winnerIndex] : null

  /* ---------- layout: where the wheel lives when it is the star, and when it is docked ---------- */

  const place = useCallback((spot: 'home' | 'dock') => {
    const rig = rigRef.current
    if (!rig) return
    const { home } = spots.current
    const t = spots.current[spot]
    gsap.set(rig, {
      width: home.size,
      height: home.size,
      x: t.cx - home.size / 2,
      y: t.cy - home.size / 2,
      scale: t.size / home.size,
    })
  }, [])

  const measure = useCallback(() => {
    const stage = stageRef.current
    if (!stage) return
    const W = stage.clientWidth
    const H = stage.clientHeight
    const u = Math.min(window.innerWidth * 0.0118, window.innerHeight * 0.017778)
    const homeSize = Math.max(120, Math.min(H * 0.92, W * 0.5))
    const dockSize = Math.min(Math.max(12.5 * u, 92), H * 0.42)
    const dockX = Math.max(3.5 * u, 14)
    // Short screens (phones on their side): leave room under the wheel for the "Spin again" tag.
    const dockY = H < 520 ? 26 : Math.max(1.6 * u, 10)
    spots.current = {
      home: { size: homeSize, cx: Math.max(W * 0.31, homeSize / 2 + 6.5 * u), cy: H / 2 },
      dock: { size: dockSize, cx: dockX + dockSize / 2, cy: H - dockY - dockSize / 2 },
    }
    stage.style.setProperty('--dock', `${dockSize}px`)
    stage.style.setProperty('--dock-x', `${dockX}px`)
    stage.style.setProperty('--dock-y', `${dockY}px`)
    stage.style.setProperty('--home', `${homeSize}px`)
  }, [])

  useEffect(() => {
    const onResize = () => {
      // Finish any running transition first so we never measure mid-flight.
      timeline.current?.progress(1)
      measure()
      place(phaseRef.current === 'detail' ? 'dock' : 'home')
    }
    onResize()
    gsap.set(rigRef.current, { autoAlpha: 1 })
    const ro = new ResizeObserver(onResize)
    if (stageRef.current) ro.observe(stageRef.current)
    window.addEventListener('orientationchange', onResize)
    return () => {
      ro.disconnect()
      window.removeEventListener('orientationchange', onResize)
    }
  }, [measure, place])

  /* ---------- the spin: one ticker turns the wheel, fades the speed smear and moves the pointer ---------- */

  const coast = useRef<Coast | null>(null)

  useEffect(() => {
    const spinEl = spinRef.current
    const pointerEl = pointerRef.current
    const smearEl = rigRef.current?.querySelector<SVGElement>('.wheel__smear') ?? null
    const pointer = { lean: 0, bump: 0, shown: 0 }
    let lastFrame = -1
    let lastRot = motion.current.rot
    let shownRot = NaN
    let smear = 0
    let shownSmear = 0

    const tick = (_time: number, delta: number) => {
      const m = motion.current

      // Step by the frame's own timestamp (the vsync clock), not by when this callback happened to run.
      // GSAP's delta is wall-clock time read inside the callback, which wobbles by a few milliseconds
      // under load; multiplied by the spin speed that wobble is a visible judder at the rim.
      const frame = typeof document.timeline?.currentTime === 'number' ? document.timeline.currentTime : -1
      let ms = lastFrame >= 0 && frame > lastFrame ? frame - lastFrame : delta
      lastFrame = frame
      ms = Math.min(Math.max(ms, 0), MAX_FRAME_MS)
      const dt = ms / 1000

      const c = coast.current
      let landed: Coast | null = null
      if (c) {
        // The stop: a cubic ease-out whose first-frame speed equals the free-spin speed it takes over from.
        c.t = Math.min(c.t + dt, c.duration)
        const k = 1 - c.t / c.duration
        m.rot = c.from + c.distance * (1 - k * k * k)
        m.vel = ((3 * c.distance) / c.duration) * k * k
        if (k <= 0) {
          coast.current = null
          landed = c
        }
      } else if (m.mode !== 'tween') {
        m.rot += m.vel * dt
      }

      // The wheel: one transform on one layer, written only when it has changed.
      if (spinEl && m.rot !== shownRot) {
        shownRot = m.rot
        spinEl.style.transform = `rotate(${(((m.rot % 360) + 360) % 360).toFixed(3)}deg)`
      }

      // Speed as actually shown, whoever is driving the rotation (free spin, the stop, or the turn on the way back).
      const speed = dt > 0 ? Math.abs(m.rot - lastRot) / dt : 0
      lastRot = m.rot

      // Smear: as speed rises the labels and dividers give way to a still, rotationally symmetric wash.
      // It is a separate static layer, so this is a compositor-only opacity change.
      // Only while the visitor's spin is running: the lazy turn on the way back stays crisp.
      const spinningNow = phaseRef.current === 'spinning' || phaseRef.current === 'stopping'
      const s = spinningNow ? clamp01((speed - SMEAR_FROM) / (SMEAR_FULL - SMEAR_FROM)) : 0
      const smearTarget = s * s * (3 - 2 * s) * SMEAR_MAX
      smear += (smearTarget - smear) * (1 - Math.exp(-dt * 12))
      const smearOut = smear < 0.004 ? 0 : Math.round(smear * 250) / 250
      if (smearEl && smearOut !== shownSmear) {
        shownSmear = smearOut
        smearEl.style.opacity = String(smearOut)
      }

      // Pointer: at speed it leans into the pins and only flutters; as the wheel slows each pin becomes a distinct tick.
      const n = activeRef.current.length
      const live = n >= 2 && (phaseRef.current === 'spinning' || phaseRef.current === 'stopping')
      let leanTarget = 0
      if (n >= 2) {
        const seg = 360 / n
        const idx = Math.floor(m.rot / seg)
        if (idx !== m.lastIdx) {
          const dir = idx > m.lastIdx ? 1 : -1
          m.lastIdx = idx
          if (live) {
            const rate = speed / seg // pins per second
            const fast = clamp01((rate - 3) / 9)
            pointer.bump = dir * (13 - 10.5 * fast)
            const now = performance.now()
            if (soundRef.current && now - m.lastKick >= 45) {
              m.lastKick = now
              playTick()
            }
          }
        }
        if (live) leanTarget = Math.sign(m.vel) * 7 * clamp01((speed / seg - 2) / 8)
      }
      pointer.lean += (leanTarget - pointer.lean) * (1 - Math.exp(-dt * 9))
      pointer.bump *= Math.exp(-dt * 15)
      let angle = -(pointer.lean + pointer.bump)
      if (Math.abs(angle) < 0.02) angle = 0
      angle = Math.round(angle * 50) / 50
      if (pointerEl && angle !== pointer.shown) {
        pointer.shown = angle
        pointerEl.style.transform = angle ? `rotate(${angle}deg)` : ''
      }

      landed?.done()
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  const clearAutoStop = () => {
    if (autoStop.current) clearTimeout(autoStop.current)
    autoStop.current = null
  }

  /* ---------- wheel → use case ---------- */

  const reveal = useCallback(
    (index: number) => {
      const chosen = activeRef.current[index]
      if (!chosen) {
        motion.current.mode = 'drift'
        motion.current.vel = DRIFT
        setPhase('idle')
        return
      }
      if (soundRef.current) playWin()
      busy.current = true
      // Mount the announcement and the detail page now so the timeline can address their elements.
      flushSync(() => {
        setWinnerId(chosen.id)
        setLit(true)
        setPhase('landed')
      })

      const rig = rigRef.current
      const view = detailRef.current
      const panel = panelRef.current
      const landed = landedRef.current
      if (!rig || !view || !panel || !landed) {
        busy.current = false
        setPhase('detail')
        return
      }
      const { home, dock } = spots.current
      const leaving = Array.from(panel.querySelectorAll<HTMLElement>('[data-out]'))
      const lines = Array.from(landed.querySelectorAll<HTMLElement>('[data-ann]'))
      const meter = landed.querySelector<HTMLElement>('.landed__meter-fill')

      timeline.current?.kill()
      const tl = gsap.timeline()
      timeline.current = tl

      // Everything on the detail page starts hidden, and the page itself stays out until the hand-over.
      gsap.set(view, { autoAlpha: 0 })
      prepareDetail(view)
      gsap.set(againRef.current, { autoAlpha: 0, y: 8 })
      gsap.set(landed, { autoAlpha: 1 })
      gsap.set(lines, { autoAlpha: 0, x: 0, y: 26 })
      if (meter) gsap.set(meter, { scaleX: 0 })

      // 1 · The win: a breath and a ring that expands off the wheel.
      if (rippleRef.current) {
        tl.fromTo(
          rippleRef.current,
          { x: home.cx - home.size / 2, y: home.cy - home.size / 2, width: home.size, height: home.size, scale: 0.96, autoAlpha: 0.7 },
          { scale: 1.34, autoAlpha: 0, duration: 1.1, ease: 'power2.out' },
          0,
        )
      }
      tl.to(rig, { scale: 1.04, duration: 0.32, ease: 'power2.out' }, 0)
      tl.to(rig, { scale: 1, duration: 0.34, ease: 'power2.inOut' }, 0.32)

      // 2 · The invitation to spin steps aside and the result takes its place, large enough for the room.
      tl.to(leaving, { autoAlpha: 0, x: 50, duration: 0.3, ease: 'power2.in', stagger: 0.03 }, 0.05)
      tl.to(lines, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.09 }, 0.42)
      // A quiet meter runs under it for the length of the hold, so the room knows the page is on its way.
      if (meter) tl.to(meter, { scaleX: 1, duration: HOLD_SECONDS - 0.7, ease: 'none' }, 0.7)

      // 3 · The hold ends. The announcement lifts away and the wheel hands the stage over.
      const H = HOLD_SECONDS
      tl.to(lines, { autoAlpha: 0, y: -22, duration: 0.36, ease: 'power2.in', stagger: 0.045 }, H)
      tl.call(() => setPhase('detail'), [], H)
      tl.set(landed, { autoAlpha: 0 }, H + 0.7)
      tl.set(view, { autoAlpha: 1 }, H + 0.7)

      // 4 · The wheel gathers itself, shrinks, then glides to its corner. Different eases on x and y bend the path.
      const T = H + 0.45
      tl.to(rig, { scale: 1.025, duration: 0.3, ease: 'power2.out' }, H + 0.12)
      tl.to(rig, { scale: dock.size / home.size, duration: 1.45, ease: 'power3.inOut' }, T)
      tl.to(rig, { x: dock.cx - home.size / 2, duration: 1.3, ease: 'power3.inOut' }, T + 0.16)
      tl.to(rig, { y: dock.cy - home.size / 2, duration: 1.3, ease: 'power2.inOut' }, T + 0.16)
      tl.call(() => void (busy.current = false), [], T + 1.46)

      // 5 · The use case takes the stage the wheel just left.
      const C = T + 0.8
      const introLength = playDetail(view, tl, C)
      tl.to(againRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, C + Math.max(introLength - 0.5, 0))
    },
    [setPhase],
  )

  const start = useCallback(() => {
    if (phaseRef.current !== 'idle' || activeRef.current.length < 2) return
    if (soundRef.current) unlockSound()
    const m = motion.current
    setPhase('spinning')
    m.mode = 'free'
    coast.current = null
    m.lastIdx = Math.floor(m.rot / (360 / activeRef.current.length))
    gsap.killTweensOf(m)
    // A small wind-up backwards, then away. Only the velocity is tweened; the ticker integrates it,
    // so the wheel's position stays continuous through every change of pace.
    gsap
      .timeline()
      .to(m, { vel: -90, duration: 0.22, ease: 'power2.out' })
      .to(m, { vel: CRUISE + Math.random() * 30, duration: 1.25, ease: 'power2.inOut' })
    clearAutoStop()
    autoStop.current = setTimeout(() => stopRef.current(), data.settings.autoStopSeconds * 1000)
  }, [data.settings.autoStopSeconds, setPhase])

  const stop = useCallback(() => {
    if (phaseRef.current !== 'spinning') return
    clearAutoStop()
    const m = motion.current
    const n = activeRef.current.length
    if (n < 2) return
    gsap.killTweensOf(m)
    setPhase('stopping')
    const land = () => {
      const count = activeRef.current.length
      if (count < 2) {
        reveal(-1)
        return
      }
      const seg = 360 / count
      const v = m.vel
      // A cubic ease-out starts at 3× its average speed, so this distance at this duration
      // begins at exactly the speed the wheel has now: no step in velocity at the hand-off.
      let target = m.rot + (v * COAST_SECONDS) / 3
      const local = ((-target % 360) + 360) % 360
      const index = Math.min(count - 1, Math.floor(local / seg))
      // Never rest on a divider: settle inside the middle 60% of the segment.
      const within = local - index * seg
      const settled = Math.min(Math.max(within, seg * 0.2), seg * 0.8)
      target -= settled - within
      const distance = target - m.rot
      // The nudge changes the distance, so the duration follows it and the starting speed stays v.
      m.mode = 'tween'
      coast.current = { from: m.rot, distance, duration: (3 * distance) / v, t: 0, done: () => reveal(index) }
    }
    if (m.vel >= MIN_STOP_SPEED) land()
    // Stopped during the wind-up: carry on up to a fair speed first, rather than jumping to it.
    else gsap.to(m, { vel: MIN_STOP_SPEED, duration: 0.45, ease: 'power1.inOut', onComplete: land })
  }, [reveal, setPhase])

  const stopRef = useRef(stop)
  stopRef.current = stop

  /* ---------- use case → wheel ---------- */

  const back = useCallback(() => {
    if (phaseRef.current !== 'detail') return
    const rig = rigRef.current
    const view = detailRef.current
    const panel = panelRef.current
    if (!rig || !view || !panel) return
    setPhase('returning')
    busy.current = false
    gsap.set(landedRef.current, { autoAlpha: 0 })
    const { home } = spots.current
    const m = motion.current
    const entering = Array.from(panel.querySelectorAll<HTMLElement>('[data-out]'))

    timeline.current?.kill()
    const tl = gsap.timeline()
    timeline.current = tl

    tl.to(againRef.current, { autoAlpha: 0, duration: 0.2 }, 0)
    tl.to(view, { autoAlpha: 0, y: -18, duration: 0.45, ease: 'power2.in' }, 0)
    tl.call(() => setLit(false), [], 0.4)
    tl.to(rig, { y: home.cy - home.size / 2, duration: 1.2, ease: 'power3.inOut' }, 0.2)
    tl.to(rig, { x: home.cx - home.size / 2, duration: 1.2, ease: 'power2.inOut' }, 0.2)
    tl.to(rig, { scale: 1, duration: 1.3, ease: 'power3.inOut' }, 0.25)
    // One lazy turn on the way back, so it arrives looking ready to go again.
    tl.to(m, { rot: m.rot + 360, duration: 1.8, ease: 'sine.inOut' }, 0.2)
    tl.fromTo(
      entering,
      { autoAlpha: 0, x: 70 },
      { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 },
      1.0,
    )
    tl.call(() => {
      gsap.set(view, { y: 0 })
      setWinnerId(null)
      m.vel = DRIFT
      m.mode = 'drift'
      setPhase('idle')
      void refresh() // pick up anything changed in admin while this use case was on screen
    })
  }, [refresh, setPhase])

  const primary = useCallback(() => {
    const p = phaseRef.current
    if (busy.current) return
    if (p === 'idle') start()
    else if (p === 'spinning') stop()
    else if (p === 'detail') back()
  }, [start, stop, back])

  // Space or Enter anywhere is the red button, so a physical arcade button wired as a keyboard just works.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        primary()
      } else if (e.key === 'Escape') {
        // Ignored until the wheel has docked; after that it returns as usual.
        if (!busy.current) back()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [primary, back])

  // If the use case on screen is removed in admin, go back to the wheel.
  useEffect(() => {
    if (phase === 'detail' && winnerId && !winner) back()
  }, [phase, winnerId, winner, back])

  useEffect(() => {
    const onFocus = () => {
      if (phaseRef.current === 'idle') void refresh()
    }
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      clearAutoStop()
      timeline.current?.kill()
    }
  }, [refresh])

  const enough = segments.length >= 2
  const maker = winner?.people?.find((p) => p.name.trim())?.name.trim()
  const makerTeam = winner?.team?.trim()
  const builtBy = maker ? `Built by ${maker}${makerTeam ? ` · ${makerTeam}` : ''}` : makerTeam ? `Built in ${makerTeam}` : ''
  const buttonLabel = phase === 'spinning' || phase === 'stopping' ? 'Stop' : 'Spin'
  const hint =
    phase === 'spinning'
      ? 'Hit it again to stop the wheel.'
      : phase === 'stopping'
        ? 'Wait for it…'
        : 'Hit the red button to meet one.'
  const rigLabel =
    phase === 'detail' || phase === 'landed' ? 'Back to the wheel' : phase === 'spinning' ? 'Stop the wheel' : 'Spin the wheel'

  return (
    <main className="kiosk pai-backdrop" data-phase={phase} data-ready={ready || undefined}>
      <header className="k-head">
{/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="k-head__logo"
          src="/brand/piramal-ai-lockup.png"
          alt="Piramal.ai"
          draggable={false}
          onDoubleClick={() => router.push('/admin')}
        />
      </header>

      <div className="stage" ref={stageRef}>
        {/* The two platforms, named once, down the side of the wheel in the wheel's own colours. */}
        <p className="side-mark" aria-label="BYOT, Build Your Own Tech, and BYOA, Build Your Own Agents">
          <span className="side-mark__t">BYOT</span>
          <span className="side-mark__bar" aria-hidden="true" />
          <span className="side-mark__a">BYOA</span>
        </p>
        <section className="spin-panel" ref={panelRef} aria-hidden={phase === 'detail' || phase === 'landed'}>
          <h1 className="spin-panel__title" data-out>
            <span className="line">Non-Tech people</span>
            <span className="line join">building their own</span>
            <span className="line">
              <span className="tech">tech</span> <span className="join">and</span> <span className="agents">agents.</span>
            </span>
          </h1>
          <p className="spin-panel__lead" data-out>
            {enough ? (
              <>
                <strong>
                  {segments.length} small, practical fixes
                  {teams > 1 ? <> from {teams} functions</> : null}
                </strong>
                , each built with AI by the person who needed it.
              </>
            ) : (
              <>Add at least two use cases in the admin page to set up the wheel.</>
            )}
          </p>
          <div className="spin-panel__action" data-out>
            <button
              type="button"
              className="red-button"
              data-state={phase}
              onClick={primary}
              disabled={!enough || phase === 'stopping' || phase === 'landed' || phase === 'returning' || phase === 'detail'}
              aria-label={phase === 'spinning' ? 'Stop the wheel' : 'Spin the wheel'}
            >
              <span className="red-button__pulse" aria-hidden="true" />
              <span className="red-button__cap">{buttonLabel}</span>
            </button>
            <p className="spin-panel__hint" aria-live="polite">
              {hint}
            </p>
          </div>
        </section>

        <section className="detail-view" ref={detailRef} aria-hidden={phase !== 'detail'}>
          {winner && <Detail key={winner.id} useCase={winner} number={winnerIndex + 1} accent={accentForPlatform(winner.platform)} />}
        </section>

        <div className="ripple" ref={rippleRef} data-accent={winner ? accentForPlatform(winner.platform) : undefined} aria-hidden="true" />

        {/* Where the wheel stopped, held beside it before the page arrives. */}
        <div
          className="landed"
          ref={landedRef}
          data-accent={winner ? accentForPlatform(winner.platform) : undefined}
          aria-hidden={phase !== 'landed'}
        >
          {winner && (
            <>
              <p className="landed__eyebrow" data-ann>
                The wheel stopped on
              </p>
              <div className="landed__head" data-ann>
                <span className="landed__num">{String(winnerIndex + 1).padStart(2, '0')}</span>
                <span className="landed__platform">
                  <b>{winner.platform}</b>
                  <span>{PLATFORM_NAME[winner.platform]}</span>
                </span>
              </div>
              <p className="landed__name" data-ann>
                {winner.title || winner.wheelLabel}
              </p>
              {builtBy && (
                <p className="landed__by" data-ann>
                  {builtBy}
                </p>
              )}
              <div className="landed__meter" data-ann>
                <span className="landed__meter-fill" />
              </div>
            </>
          )}
        </div>

        <div
          className="rig"
          ref={rigRef}
          role="button"
          tabIndex={phase === 'detail' ? 0 : -1}
          aria-label={rigLabel}
          onClick={primary}
        >
          <Wheel ref={spinRef} segments={segments} winner={lit && winnerIndex >= 0 ? winnerIndex : null} />
          <div className="pointer" ref={pointerRef} aria-hidden="true">
            <svg viewBox="-40 -40 80 130">
              <defs>
                <linearGradient id="pointer-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#27469a" />
                  <stop offset="0.45" stopColor="#071a50" />
                  <stop offset="1" stopColor="#000e4f" />
                </linearGradient>
                <radialGradient id="pointer-jewel" cx="0.38" cy="0.32" r="0.75">
                  <stop offset="0" stopColor="#ffe2d4" />
                  <stop offset="0.35" stopColor="#ff7a45" />
                  <stop offset="0.75" stopColor="#ef4123" />
                  <stop offset="1" stopColor="#d13518" />
                </radialGradient>
              </defs>
              <path d="M-14 2A14 14 0 1 1 14 2L2.4 60Q0 65 -2.4 60Z" className="pointer__shade" transform="translate(2.5 4.5)" />
              <path d="M-14 2A14 14 0 1 1 14 2L2.4 60Q0 65 -2.4 60Z" className="pointer__body" fill="url(#pointer-fill)" />
              <circle cx="0" cy="2" r="8.6" className="pointer__ring" />
              <circle cx="0" cy="2" r="6.2" fill="url(#pointer-jewel)" />
            </svg>
          </div>
        </div>

        <button type="button" className="again" ref={againRef} onClick={back} tabIndex={phase === 'detail' ? 0 : -1}>
          Spin again
        </button>
      </div>

      <div className="rotate" role="alert">
        <div className="rotate__phone" aria-hidden="true" />
        <p className="rotate__title">Turn your device sideways</p>
        <p className="rotate__sub">The BYOT · BYOA showcase is made for landscape.</p>
      </div>
    </main>
  )
}
