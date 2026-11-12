'use client'

/**
 * EVERYDAY AI. The client root.
 *
 * It mounts the shell (the quiet frame that stays on screen throughout: the logo, the clock
 * chip, Priya's voice, the dots, Back and Next), the stage (where one scene at a time plays)
 * and the director (which moves the film). Scenes are in scenes/ and moments/.
 *
 * The film is MANUAL: it waits for the visitor. Next (bottom right), the keys and a tap on the
 * empty stage move it on; nothing moves by itself unless Auto-play is on (?auto, or the switch).
 */

import { Component, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import gsap from 'gsap'
import { PRIYA, PROMPTS, productByKey } from './content'
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
import { Backdrop, Header, RotatePrompt, Strip, Voice } from './shell/Shell'
import { isEngineering, isProduct, useEveryday } from './store'
import './everyday.css'

/**
 * The film's photographs, asked for when the page boots and kept here, so that each is already
 * decoded when its scene first shows it (and still there if the connection is lost afterwards).
 */
const photos: HTMLImageElement[] = []
function fetchPhoto(src: string): HTMLImageElement {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  photos.push(img)
  return img
}

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
      // somebody is there: (Auto-play) the next demo control waits for them
      director.noteTouch()
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
    // A press with a pointer (a mouse, a finger) must not leave the keyboard's focus on the button
    // it pressed: Space and Enter would then repeat THAT button (a dot, Back) instead of moving the
    // film on. A click made with the keyboard (detail 0) keeps its focus, so Tab and Enter still work.
    const dropFocus = (e: globalThis.MouseEvent) => {
      if (e.detail <= 0) return
      const el = document.activeElement
      if (el instanceof HTMLElement && el !== document.body && root.contains(el)) el.blur()
    }
    // The keyboard, and a presenter's clicker (most send PageDown and PageUp; some send the arrows
    // or Enter): the same deliberate Next and Back as the two buttons. Enter and Space on a button
    // that the keyboard has focused are left to that button.
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      if ((k === 'Enter' || k === ' ') && (e.target as Element | null)?.closest?.('button, a, [data-own]')) return
      if (k === ' ' || k === 'ArrowRight' || k === 'PageDown' || k === 'Enter') {
        e.preventDefault()
        director.press(1)
      } else if (k === 'ArrowLeft' || k === 'PageUp') {
        e.preventDefault()
        director.press(-1)
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
    /** The scene on stage was measured at another size than the page has now (see director.builtFor). */
    const stale = () => {
      const built = director.builtFor()
      return !!built && built !== sizeNow()
    }
    const rebuild = () => {
      const now = sizeNow()
      if (!alive || (now === size && !stale())) return
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
    // The film is the whole page, on a screen strangers will press and hold: it never pans,
    // bounces or zooms under a finger or a wheel, and a long press (or a right click) brings up
    // no browser menu, whatever kind of pointer the screen says it has. Only a debug URL
    // (?scene=… or ?debug) keeps the menu, for whoever is developing. Taps are untouched: they are clicks.
    const noGesture = (e: Event) => {
      if (e.cancelable) e.preventDefault()
    }
    const noMenu = (e: Event) => {
      if (!debug.dev) e.preventDefault()
    }
    const noWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey && e.cancelable) e.preventDefault()
    }
    const watcher = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(onResize) : null
    // Resize events and observers are only delivered with a painted frame. A host that has stopped
    // painting (see core/pump.ts) still changes size, so the size is also read on a slow timer.
    const sizePoll = setInterval(() => {
      if (sizeNow() !== size || upright.matches !== held || (!upright.matches && stale())) onResize()
    }, 400)

    const boot = () => {
      if (!alive) return
      stage.measure()
      director.mount(
        { root, wrap: $('.ev-wrap'), ghost: $('.ev-ghost'), ghostRing: $('.ev-ghost i'), turn: $<HTMLElement>('.ev-turn') },
        stage,
        debug,
      )
      setBooted(true)
      root.addEventListener('pointerdown', onDown)
      root.addEventListener('click', dropFocus, true)
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
      window.addEventListener('wheel', noWheelZoom, { passive: false })
    }
    // Every photograph is asked for now, not when its scene mounts. The film waits for the first
    // one it shows large (Priya, standing in the branch) as it waits for the fonts, but never
    // longer than two seconds: a slow picture must not hold the film.
    if (!photos.length) fetchPhoto(PRIYA.portrait)
    const hero = photos.find((img) => img.src.endsWith(PRIYA.photo)) ?? fetchPhoto(PRIYA.photo)
    const heroIn = new Promise<void>((done) => {
      const timer = setTimeout(done, 2000)
      const settle = () => {
        clearTimeout(timer)
        done()
      }
      if (typeof hero.decode === 'function') hero.decode().then(settle, settle)
      else if (hero.complete) settle()
      else {
        hero.addEventListener('load', settle, { once: true })
        hero.addEventListener('error', settle, { once: true })
      }
    })
    const fonts = document.fonts
    const fontsIn = fonts?.ready
      ? Promise.all([fonts.load('800 40px "Open Sans"'), fonts.load('300 40px "Open Sans"'), fonts.load('600 40px "Open Sans"'), fonts.ready]).then(
          () => undefined,
          () => undefined,
        )
      : Promise.resolve()
    Promise.all([fontsIn, heroIn]).then(boot, boot)

    return () => {
      alive = false
      if (resizeTimer) clearTimeout(resizeTimer)
      clearInterval(sizePoll)
      root.removeEventListener('pointerdown', onDown)
      root.removeEventListener('click', dropFocus, true)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      upright.removeEventListener('change', onTurn)
      root.removeEventListener('touchmove', noGesture)
      root.removeEventListener('contextmenu', noMenu)
      document.removeEventListener('gesturestart', noGesture)
      document.removeEventListener('gesturechange', noGesture)
      window.removeEventListener('wheel', noWheelZoom)
      watcher?.disconnect()
      gsap.killTweensOf([light, ...ripples])
      director.unmount()
      stopPump()
      useEveryday.getState().patch({ ready: false })
      setBooted(false)
    }
  }, [])

  /** A tap anywhere that is not a control of its own moves the film on a step (the Next button is what a newcomer sees). */
  const onClick = (e: MouseEvent) => {
    if ((e.target as Element).closest('[data-own]')) return
    director.tap()
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

      {/* over the stage, through every scene: Priya's voice; and for Auto-play, "Your turn" and the ghost fingertip */}
      <div className="ev-shellstage">
        <Voice />
        {/* Auto-play only: placed beside a demo's control while it waits for a visitor who is there (core/director.ts) */}
        <div className="ev-turn" data-side="right" aria-hidden="true">
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M7.6 2.2 3.8 6l3.8 3.8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{PROMPTS.yourTurn}</span>
        </div>
        <i className="ev-ghost" aria-hidden="true">
          <i />
        </i>
      </div>

      {/* along the bottom: the progress dots, Back and Next */}
      <Strip />

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
