'use client'

/**
 * THE KEYNOTE. The client root of /keynote.
 *
 * It mounts the backdrop (one WebGL canvas for the whole deck), the 16:9 stage (where one scene
 * at a time plays; two during a change of slide), the chrome (the table of contents at the top,
 * Back / Next) and the overview, and hands the keys to the director.
 *
 * Scenes are in scenes/sNN/, one folder per slide, fetched one at a time. See SCENES.md.
 */

import { Component, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { brandFontsReady } from '@/brand/font'
import Chrome, { Progress } from './chrome/Chrome'
import Overview from './chrome/Overview'
import { DeckContext, setDeck, slideIn, useDeck, type DeckDef } from './core/active'
import { director } from './core/director'
import { readHold } from './core/hold'
import { motion } from './core/motion'
import { startPump } from './core/pump'
import { useKeynote, type Layer } from './core/store'
import { pad } from './deck'
import { KEYNOTE_DECK } from './keynoteDeck'
import { Backdrop } from './three/backdrop'
import { hasWebGL } from './three/sceneCanvas'
import './keynote.css'
import './kit/kit.css'

/** A scene that throws while rendering is replaced by the deck's page of its slide. The chrome stays up. */
class SceneBoundary extends Component<{ id: string; onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.error(`[keynote ${this.props.id}] the scene failed to render; showing the page instead`, err)
    this.props.onFail()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function SceneLayer({ layer }: { layer: Layer }) {
  const layerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const tick = useKeynote((s) => s.layoutTick)
  const s = slideIn(useDeck(), layer.n)
  // build before the first paint, so the scene's starting states are never seen undone
  useLayoutEffect(() => {
    if (!layerRef.current || !rootRef.current) return
    return director.mount(layer, layerRef.current, rootRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer.key, tick])
  const Scene = layer.mod.Scene
  return (
    <div ref={layerRef} className="kn-layer" data-key={layer.key}>
      <div ref={rootRef} className={`kn-scene kn-${s.id}`} data-theme={s.theme} data-section={s.section}>
        <SceneBoundary id={s.id} onFail={() => director.failed(layer.key)}>
          <Scene slide={s} />
        </SceneBoundary>
      </div>
    </div>
  )
}

/** `deck`: the deck to play (core/active.tsx). The keynote's own, unless a route gives another (/ir). */
export default function Keynote({ deck = KEYNOTE_DECK }: { deck?: DeckDef }) {
  // the director and its helpers read the deck from here; they only ever run in the browser
  if (typeof window !== 'undefined') setDeck(deck)
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const n = useKeynote((s) => s.n)
  const beat = useKeynote((s) => s.beat)
  const resting = useKeynote((s) => s.resting)
  const ready = useKeynote((s) => s.ready)
  const layers = useKeynote((s) => s.layers)
  const themeHold = useKeynote((s) => s.themeHold)
  const cur = slideIn(deck, n)

  useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!root || !stage || !canvas) return
    let alive = true
    motion()
    director.hold = readHold()
    director.stageEl = stage
    setDeck(deck)
    director.fallback = deck.stub
    root.dataset.chrome = director.hold.chrome ? '1' : '0'
    // &still=1: nothing idles, so two shots of one frame are identical (the chrome's own transitions too)
    if (director.hold.still) root.dataset.still = '1'

    let backdrop: Backdrop | null = null
    if (hasWebGL()) {
      try {
        backdrop = new Backdrop(canvas)
        backdrop.still = director.hold.still
        director.backdrop = backdrop
        backdrop.start()
        root.dataset.gl = '1'
      } catch (err) {
        console.warn('[keynote] the backdrop could not start: it is a still wash instead', err)
        root.dataset.gl = '0'
      }
    } else {
      // said once, quietly: every scene then uses its DOM fallback
      console.info('[keynote] no WebGL on this machine: the backdrop is a still wash, scenes use their DOM fallbacks')
      root.dataset.gl = '0'
    }

    const stopPump = startPump(root)

    const onKey = (e: KeyboardEvent) => {
      // Enter and Space on a button the KEYBOARD has focused belong to that button
      const a = document.activeElement
      if ((e.key === 'Enter' || e.key === ' ') && a instanceof HTMLElement && a.matches('button, a, input') && !useKeynote.getState().typed) return
      if (director.key(e)) e.preventDefault()
    }
    window.addEventListener('keydown', onKey)

    let timer = 0
    let w = window.innerWidth
    let h = window.innerHeight
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (window.innerWidth === w && window.innerHeight === h) return
        w = window.innerWidth
        h = window.innerHeight
        director.relayout()
      }, 160)
    }
    window.addEventListener('resize', onResize)

    // the scenes measure words: wait for the brand font in all its weights (Light, Regular, Bold
    // and the italic: brandFontsReady asks for each, so a weight no text has used yet is in too),
    // briefly, then begin
    Promise.race([brandFontsReady(), new Promise((r) => setTimeout(r, 1500))]).then(() => {
      if (alive) director.boot()
    })

    // for the checking tools: window.__kn.frames() are the gaps between the backdrop's last frames, in ms
    ;(window as unknown as { __kn?: unknown }).__kn = {
      director,
      state: () => useKeynote.getState(),
      info: () => director.info(),
      seek: (at: string | null, dt: number | null = null) => director.seek(at, dt),
      frames: () => (backdrop ? backdrop.frames.slice() : []),
    }

    return () => {
      alive = false
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
      stopPump()
      director.backdrop = null
      backdrop?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <DeckContext.Provider value={deck}>
    <div
      ref={rootRef}
      className="kn-root"
      data-slide={pad(n)}
      data-beat={beat}
      data-resting={resting ? 1 : 0}
      data-ready={ready ? 1 : 0}
      data-section={cur.section}
      data-theme={themeHold ?? cur.theme}
    >
      <canvas ref={canvasRef} className="kn-backdrop" aria-hidden="true" />
      <div ref={stageRef} className="kn-stage">
        {layers.map((layer) => (
          <SceneLayer key={layer.key} layer={layer} />
        ))}
        <Chrome />
      </div>
      <Progress />
      <Overview />
    </div>
    </DeckContext.Provider>
  )
}
