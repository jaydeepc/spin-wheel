'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useShowcase } from '@/data/store'
import Detail from './Detail'
import Wheel, { accentFor } from './Wheel'
import { playTick, playWin, unlockSound } from './sound'

type Phase = 'idle' | 'spinning' | 'stopping' | 'detail' | 'returning'

const DRIFT = 5 // deg/s the wheel idles at, so the screen is never still
const CRUISE = 600 // deg/s at full spin
const MIN_STOP_SPEED = 300
const COAST_SECONDS = 4.6

interface Spot {
  cx: number
  cy: number
  size: number
}

/** "₹4.2 Cr" → counts 0 → 4.2 and keeps the rest. Values with two numbers ("45 → 8 min") are left as they are. */
function countable(text: string) {
  const matches = text.match(/\d[\d,]*(?:\.\d+)?/g)
  if (!matches || matches.length !== 1) return null
  const raw = matches[0]
  const at = text.indexOf(raw)
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  const grouped = raw.includes(',')
  const target = parseFloat(raw.replace(/,/g, ''))
  if (!Number.isFinite(target) || target === 0) return null
  const format = (v: number) => {
    const fixed = v.toFixed(decimals)
    const shown = grouped ? Number(fixed).toLocaleString('en-IN', { minimumFractionDigits: decimals }) : fixed
    return text.slice(0, at) + shown + text.slice(at + raw.length)
  }
  return { target, format }
}

export default function Kiosk() {
  const router = useRouter()
  const { data, ready, refresh } = useShowcase()
  const active = useMemo(() => data.useCases.filter((u) => u.active), [data.useCases])
  const segments = useMemo(() => active.map((u) => ({ id: u.id, label: u.wheelLabel })), [active])
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
    const dockY = Math.max(1.6 * u, 10)
    spots.current = {
      home: { size: homeSize, cx: Math.max(W * 0.29, homeSize / 2 + 2 * u), cy: H / 2 },
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

  /* ---------- the spin: one ticker turns the wheel and flicks the pointer on every peg ---------- */

  useEffect(() => {
    const setRotation = spinRef.current ? gsap.quickSetter(spinRef.current, 'rotation', 'deg') : null
    const tick = (_time: number, delta: number) => {
      const m = motion.current
      if (m.mode !== 'tween') m.rot += (m.vel * Math.min(delta, 50)) / 1000
      setRotation?.(m.rot)
      const n = activeRef.current.length
      if (n < 2 || m.mode === 'drift' || phaseRef.current === 'detail' || phaseRef.current === 'returning') return
      const idx = Math.floor(m.rot / (360 / n))
      if (idx === m.lastIdx) return
      m.lastIdx = idx
      const now = performance.now()
      if (now - m.lastKick < 45) return
      m.lastKick = now
      if (pointerRef.current) {
        gsap.fromTo(
          pointerRef.current,
          { rotation: -20 },
          { rotation: 0, duration: 0.3, ease: 'elastic.out(1, 0.45)', overwrite: true },
        )
      }
      if (soundRef.current) playTick()
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
      // Mount the detail page now so the timeline can address its elements.
      flushSync(() => {
        setWinnerId(chosen.id)
        setLit(true)
        setPhase('detail')
      })

      const rig = rigRef.current
      const view = detailRef.current
      const panel = panelRef.current
      if (!rig || !view || !panel) return
      const { home, dock } = spots.current
      const q = (sel: string) => Array.from(view.querySelectorAll<HTMLElement>(sel))
      const leaving = Array.from(panel.querySelectorAll<HTMLElement>('[data-out]'))

      timeline.current?.kill()
      const tl = gsap.timeline()
      timeline.current = tl

      // Everything on the detail page starts hidden.
      gsap.set(view, { autoAlpha: 1 })
      gsap.set(q('[data-in="fade"]'), { autoAlpha: 0, y: 10 })
      gsap.set(q('[data-in="word"]'), { yPercent: 118 })
      gsap.set(q('[data-in="rule"]'), { scaleX: 0, transformOrigin: '0 50%' })
      gsap.set(q('[data-in="rise"]'), { autoAlpha: 0, y: 26 })
      gsap.set(q('[data-in="metric"]'), { autoAlpha: 0, y: 30 })
      gsap.set(q('[data-in="line"]'), { scaleX: 0, transformOrigin: '0 50%' })
      gsap.set(q('[data-in="step"]'), { autoAlpha: 0, y: 44 })
      gsap.set(q('[data-in="person"]'), { autoAlpha: 0, x: -22 })
      gsap.set(againRef.current, { autoAlpha: 0, y: 8 })

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

      // 2 · The invitation to spin steps aside.
      tl.to(leaving, { autoAlpha: 0, x: 70, duration: 0.5, ease: 'power2.in', stagger: 0.05 }, 0.55)

      // 3 · The wheel shrinks first, then glides to its corner. Different eases on x and y bend the path.
      const T = 0.85
      tl.to(rig, { scale: dock.size / home.size, duration: 1.45, ease: 'power3.inOut' }, T)
      tl.to(rig, { x: dock.cx - home.size / 2, duration: 1.3, ease: 'power3.inOut' }, T + 0.16)
      tl.to(rig, { y: dock.cy - home.size / 2, duration: 1.3, ease: 'power2.inOut' }, T + 0.16)

      // 4 · The use case takes the stage the wheel just left.
      const C = T + 0.8
      tl.to(q('.detail__intro [data-in="fade"]'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, C)
      tl.to(q('[data-in="word"]'), { yPercent: 0, duration: 0.95, ease: 'power4.out', stagger: 0.07 }, C + 0.1)
      tl.to(q('[data-in="rule"]'), { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, C + 0.35)
      tl.to(q('[data-in="rise"]'), { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, C + 0.5)

      tl.to(q('.detail__impact [data-in="fade"]'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, C + 0.6)
      tl.to(q('[data-in="metric"]'), { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.14 }, C + 0.7)
      q('[data-count-to]').forEach((el, i) => {
        const full = el.dataset.countTo ?? ''
        const c = countable(full)
        if (!c) return
        const state = { v: 0 }
        el.textContent = c.format(0)
        tl.to(
          state,
          {
            v: c.target,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => (el.textContent = c.format(state.v)),
            onComplete: () => (el.textContent = full),
          },
          C + 0.7 + i * 0.14,
        )
      })

      tl.to(q('[data-in="line"]'), { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, C + 1.0)
      tl.to(q('[data-in="step"]'), { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.16 }, C + 1.0)

      tl.to(q('.people [data-in="fade"]'), { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, C + 1.7)
      tl.to(q('[data-in="person"]'), { autoAlpha: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, C + 1.8)
      tl.to(againRef.current, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, C + 2.0)
    },
    [setPhase],
  )

  const start = useCallback(() => {
    if (phaseRef.current !== 'idle' || activeRef.current.length < 2) return
    if (soundRef.current) unlockSound()
    const m = motion.current
    setPhase('spinning')
    m.mode = 'free'
    m.lastIdx = Math.floor(m.rot / (360 / activeRef.current.length))
    gsap.killTweensOf(m)
    // A small wind-up backwards, then away.
    gsap
      .timeline()
      .to(m, { vel: -110, duration: 0.2, ease: 'power2.out' })
      .to(m, { vel: CRUISE + Math.random() * 90, duration: 1.3, ease: 'power2.in' })
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
    const seg = 360 / n
    const v = Math.max(m.vel, MIN_STOP_SPEED)
    // power3.out starts at 3× its average speed, so this distance keeps the hand-off from free spin seamless.
    let target = m.rot + (v * COAST_SECONDS) / 3
    const local = (((-target % 360) + 360) % 360)
    const index = Math.min(n - 1, Math.floor(local / seg))
    // Never rest on a divider: settle inside the middle 60% of the segment.
    const within = local - index * seg
    const settled = Math.min(Math.max(within, seg * 0.2), seg * 0.8)
    target -= settled - within
    const duration = (3 * (target - m.rot)) / v
    m.mode = 'tween'
    setPhase('stopping')
    gsap.to(m, { rot: target, duration, ease: 'power3.out', onComplete: () => reveal(index) })
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
    tl.to(m, { rot: m.rot + 360, duration: 1.7, ease: 'power2.inOut' }, 0.2)
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
        back()
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
  const buttonLabel = phase === 'spinning' || phase === 'stopping' ? 'Stop' : 'Spin'
  const hint =
    phase === 'spinning'
      ? 'Hit it again to stop the wheel.'
      : phase === 'stopping'
        ? 'Wait for it…'
        : 'Hit the red button to spin.'
  const rigLabel =
    phase === 'detail' ? 'Back to the wheel' : phase === 'spinning' ? 'Stop the wheel' : 'Spin the wheel'

  return (
    <main className="kiosk pai-backdrop" data-phase={phase} data-ready={ready || undefined}>
      <header className="k-head">
        <div className="k-head__brand">
          <p className="k-head__eyebrow">BYOT · BYOA</p>
          <p className="k-head__sub">Build Your Own Tech · Build Your Own Agents</p>
        </div>
        {data.settings.sampleContent && <p className="k-head__sample">Sample content</p>}
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
        <section className="spin-panel" ref={panelRef} aria-hidden={phase === 'detail'}>
          <h1 className="spin-panel__title" data-out>
            <span className="act">Built</span> <span className="join">by the</span> <span className="who">people</span>
            <br />
            <span className="join">who do the</span> <span className="act">work.</span>
          </h1>
          <div className="spin-panel__rule" data-out />
          <p className="spin-panel__lead" data-out>
            {enough ? (
              <>
                <strong>{segments.length} solutions</strong>
                {teams > 1 ? <> from {teams} functions</> : null}, each one built on BYOT and BYOA by the team that
                lives the problem. Spin to meet one.
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
              disabled={!enough || phase === 'stopping' || phase === 'returning' || phase === 'detail'}
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
          {winner && <Detail key={winner.id} useCase={winner} number={winnerIndex + 1} accent={accentFor(winnerIndex, active.length)} />}
        </section>

        <div className="ripple" ref={rippleRef} data-accent={winnerIndex >= 0 ? accentFor(winnerIndex, active.length) : undefined} aria-hidden="true" />

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
            <svg viewBox="0 0 60 84">
              <path d="M30 82 L6 26 A26 26 0 1 1 54 26 Z" className="pointer__body" />
              <circle cx="30" cy="26" r="9" className="pointer__dot" />
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
