'use client'

/**
 * EVERYDAY AI. The client root.
 *
 * It mounts the shell (which stays on screen throughout), the stage (where one scene at a
 * time plays) and the director (which moves the film). Scenes are in scenes/ and moments/.
 */

import { Component, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import gsap from 'gsap'
import { productByKey } from './content'
import { readDebug } from './core/debug'
import { director } from './core/director'
import { motion } from './core/motion'
import { startPump } from './core/pump'
import { createStage } from './core/stage'
import Moment from './moments/Moment'
import { MOMENTS } from './moments'
import Engineering from './scenes/Engineering'
import Finale from './scenes/Finale'
import Intro from './scenes/Intro'
import Priya from './scenes/Priya'
import { Backdrop, Header, Rail, RotatePrompt, Subtitle } from './shell/Shell'
import { isEngineering, isProduct, useEveryday } from './store'
import './everyday.css'

/** A scene that throws while rendering is dropped, and the film moves on to the next one. The shell stays up. */
class SceneBoundary extends Component<{ name: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.error(`[everyday] the "${this.props.name}" scene failed to render`, err)
    director.sceneFailed()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function Experience() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [booted, setBooted] = useState(false)
  const scene = useEveryday((s) => s.scene)
  const run = useEveryday((s) => s.run)
  const step = useEveryday((s) => s.step)
  const resting = useEveryday((s) => s.resting)
  const ready = useEveryday((s) => s.ready)
  const hold = useEveryday((s) => s.hold)
  const mode = useEveryday((s) => s.mode)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let alive = true
    motion()
    const debug = readDebug()
    const $ = <T extends Element = HTMLElement>(sel: string) => root.querySelector(sel) as unknown as T
    const stopPump = startPump(root)
    const stage = createStage($('.ev-stage'))

    // ---- touch feedback: a ripple under every tap, and the light leans a little toward the pointer
    const ripples = Array.from(root.querySelectorAll('.ev-ripple'))
    let rippleIdx = 0
    const onDown = (e: PointerEvent) => {
      const r = ripples[rippleIdx++ % ripples.length]
      if (!r) return
      gsap.fromTo(r, { x: e.clientX, y: e.clientY, scale: 0.15, autoAlpha: 1 }, { scale: 1, autoAlpha: 0, duration: 0.7, ease: 'power2.out', overwrite: true })
    }
    const light = $('.ev-light')
    const lx = gsap.quickTo(light, 'x', { duration: 0.9, ease: 'power3.out' })
    const ly = gsap.quickTo(light, 'y', { duration: 0.9, ease: 'power3.out' })
    const onMove = (e: PointerEvent) => {
      lx((e.clientX / window.innerWidth - 0.5) * -2.8 * stage.U)
      ly((e.clientY / window.innerHeight - 0.5) * -2.8 * stage.U)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault()
        director.next()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        director.back()
      }
    }
    // Every pixel distance in a timeline is measured when it is built, so a new screen size
    // means building again. The root is watched as well as the window: some hosts (embedded
    // panes, a phone being turned) change the layout without a window resize event.
    let resizeTimer: ReturnType<typeof setTimeout> | null = null
    const sizeNow = () => `${root.clientWidth}x${root.clientHeight}`
    let size = sizeNow()
    // A phone held upright shows the "turn your device" prompt instead of the film (everyday.css).
    // The film waits behind it, and is not rebuilt for a shape nobody sees: turned back, it
    // carries on from the same frame.
    const upright = window.matchMedia('(orientation: portrait) and (max-width: 1023px)')
    const rebuild = () => {
      const now = sizeNow()
      if (!alive || now === size) return
      size = now
      stage.measure()
      useEveryday.getState().relayout()
    }
    /** Whether the film is being held for an upright screen (what the director was last told). */
    let held = false
    const hold = (on: boolean) => {
      held = on
      director.freeze(on)
    }
    const onTurn = () => {
      if (!upright.matches) rebuild()
      hold(upright.matches)
    }
    const onResize = () => {
      // the media query's own event can arrive late (it is delivered with a painted frame): the
      // film stops the instant the screen is seen to be upright
      if (upright.matches) hold(true)
      if (resizeTimer) clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (alive) onTurn()
      }, 160)
    }
    // The film is the whole page: it never pans, bounces or zooms under a finger, and a long
    // press brings up no menu. (Taps are untouched: they are clicks.)
    const coarse = window.matchMedia('(pointer: coarse)')
    const noGesture = (e: Event) => {
      if (e.cancelable) e.preventDefault()
    }
    const noMenu = (e: Event) => {
      if (coarse.matches) e.preventDefault()
    }
    const watcher = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    // Resize events and observers are only delivered with a painted frame. A host that has stopped
    // painting (see core/pump.ts) still changes size, so the size is also read on a slow timer.
    const sizePoll = setInterval(() => {
      if (sizeNow() !== size || upright.matches !== held) onResize()
    }, 400)

    const boot = () => {
      if (!alive) return
      stage.measure()
      director.mount({ root, wrap: $('.ev-wrap'), ghost: $('.ev-ghost'), ghostRing: $('.ev-ghost i'), ring: $<SVGCircleElement>('[data-ev="ring"]') }, stage, debug)
      setBooted(true)
      root.addEventListener('pointerdown', onDown)
      window.addEventListener('pointermove', onMove)
      window.addEventListener('keydown', onKey)
      window.addEventListener('resize', onResize)
      size = sizeNow()
      watcher?.observe(root)
      upright.addEventListener('change', onTurn)
      hold(upright.matches)
      root.addEventListener('touchmove', noGesture, { passive: false })
      root.addEventListener('contextmenu', noMenu)
      document.addEventListener('gesturestart', noGesture)
      document.addEventListener('gesturechange', noGesture)
    }
    const fonts = document.fonts
    if (fonts?.ready) {
      Promise.all([fonts.load('800 40px "Open Sans"'), fonts.load('300 40px "Open Sans"'), fonts.load('600 40px "Open Sans"'), fonts.ready]).then(boot, boot)
    } else boot()

    return () => {
      alive = false
      if (resizeTimer) clearTimeout(resizeTimer)
      clearInterval(sizePoll)
      root.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      upright.removeEventListener('change', onTurn)
      root.removeEventListener('touchmove', noGesture)
      root.removeEventListener('contextmenu', noMenu)
      document.removeEventListener('gesturestart', noGesture)
      document.removeEventListener('gesturechange', noGesture)
      watcher?.disconnect()
      gsap.killTweensOf([light, ...ripples])
      director.unmount()
      stopPump()
      useEveryday.getState().patch({ ready: false })
      setBooted(false)
    }
  }, [])

  /** A tap anywhere that is not a control of its own moves the film on a step. */
  const onClick = (e: MouseEvent) => {
    if ((e.target as Element).closest('[data-own]')) return
    const s = useEveryday.getState()
    if (s.preview) s.setPreview(null)
    else director.tap()
  }

  const product = isProduct(scene) ? productByKey(scene) : null

  return (
    <div
      ref={rootRef}
      className="ev-root"
      data-ready={ready ? '1' : '0'}
      data-hold={hold ? '1' : '0'}
      data-scene={scene}
      data-step={step}
      data-resting={resting ? '1' : '0'}
      data-mode={mode}
      data-track={isEngineering(scene) ? 'engineering' : 'day'}
      data-accent={product ? product.accent : scene === 'engineering' ? 'navy' : 'brand'}
      data-device={product ? (MOMENTS[product.key].device ?? 'phone') : 'none'}
      onClick={onClick}
    >
      <Backdrop />
      <Header />

      {/* the stage: one scene at a time */}
      <div className="ev-wrap">
        <div className="ev-stage">
          <i className="ev-probe" />
          <i className="ev-probe-hx" />
          {booted ? (
            <SceneBoundary name={scene} key={`${scene}:${run}`}>
              {scene === 'intro' ? (
                <Intro />
              ) : scene === 'priya' ? (
                <Priya />
              ) : scene === 'engineering' ? (
                <Engineering />
              ) : scene === 'finale' ? (
                <Finale />
              ) : product ? (
                <Moment product={product} module={MOMENTS[product.key]} />
              ) : null}
            </SceneBoundary>
          ) : null}
        </div>
      </div>

      {/* over the stage, through every scene: Priya's line, the two controls, the ghost fingertip */}
      <div className="ev-shellstage">
        <Subtitle />
        <i className="ev-ghost" aria-hidden="true">
          <i />
        </i>
      </div>

      <Rail />

      <div className="ev-ripples" aria-hidden="true">
        <i className="ev-ripple" />
        <i className="ev-ripple" />
        <i className="ev-ripple" />
        <i className="ev-ripple" />
      </div>
      <RotatePrompt />
    </div>
  )
}
