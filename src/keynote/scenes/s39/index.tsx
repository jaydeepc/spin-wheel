'use client'

/**
 * Slide 39: A COMPOSITE AI NETWORK SCORES THE CUSTOMER, WITH REASONING.
 *
 * The deck's picture: four kinds of model on the left, ABCD in the middle, two outputs on the
 * right. The motion makes the sentence: the four models assemble as ONE network around the agent
 * (signals run down their lines into it), then the network steps aside and each output comes
 * out of the model that makes it, as the slide's own words pair them: "ML & Deep learning /
 * Transaction Score" lights, ONE signal runs down its line, the agent answers and the score
 * opens out of it (the real chart, in a window, opening from the left as its line falls); then
 * "LLM & Reasoning / Banking Alerts & Triggers" lights, its signal runs, and the reasons arrive
 * (the alerts, one by one).
 */

import gsap from 'gsap'
import type { ReactNode } from 'react'
import { anim, BrowserFrame, Headline, pic, type SceneModule } from '../../kit'
import { AGENT, ALERTS, ALERTS_TITLE, CHART, FLAME, NETWORK, SCORE_TITLE } from './data'
import './scene.css'

/** the deck's four icons, redrawn as line art */
const ICONS: Record<string, ReactNode> = {
  memory: (
    <>
      <rect x="6" y="5" width="20" height="22" rx="3.5" />
      <path d="M11 12 H21 M11 16.5 H21 M11 21 H17" />
    </>
  ),
  llm: (
    <>
      <rect x="4" y="8" width="24" height="16" rx="8" />
      <circle cx="12" cy="16" r="2.1" className="s39-fill" />
      <circle cx="20" cy="16" r="2.1" className="s39-fill" />
    </>
  ),
  ml: (
    <>
      <path d="M8 26 V19 M16 26 V13 M24 26 V7" className="s39-thick" />
    </>
  ),
  slm: (
    <>
      <path d="M5 9 H14 M5 16 H14 M5 23 H14" />
      <path d="M17 7 L27 11 M17 14 L27 18 M17 21 L27 25" />
    </>
  ),
}

/** the four lines into the agent, in the network's own SVG (one unit is 0.1u) */
const WIRES = [
  'M230 53 C 272 53, 262 141, 304 141',
  'M230 136 C 262 136, 270 157, 300 157',
  'M230 219 C 262 219, 270 175, 300 175',
  'M230 302 C 272 302, 262 191, 304 191',
]

/** how far right the network stands before the outputs come (in --u): centred on the stage */
const HOME = 23.5

const scene: SceneModule = {
  beats: ['network', 'score', 'alerts'],
  preload: [pic(39, CHART.name), pic(39, 'agent-abcd-desk.jpg')],

  Scene: ({ slide }) => (
    <div className="s39">
      <Headline text={slide.title} flame={FLAME} />

      <div className="s39-net">
        <svg className="s39-wires" viewBox="0 0 440 360" aria-hidden="true">
          {WIRES.map((d, i) => (
            <path key={i} className="s39-wire" d={d} />
          ))}
          {WIRES.map((d, i) => (
            <path key={`a${i}`} className="s39-signal s39-signal--a" d={d} />
          ))}
          {WIRES.map((d, i) => (
            <path key={`b${i}`} className="s39-signal s39-signal--b" d={d} />
          ))}
        </svg>

        {NETWORK.map((m, i) => (
          <div key={m.icon} className="s39-model" style={{ top: `calc(var(--u) * ${16.6 + i * 8.3})` }}>
            <span className="s39-icon">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                {ICONS[m.icon]}
              </svg>
            </span>
            <span className="s39-modeltext">
              <b>{m.title}</b>
              <span>{m.line}</span>
            </span>
          </div>
        ))}

        <i className="s39-ring" aria-hidden="true" />
        <figure className="s39-bot">
          <img src={pic(39, 'agent-abcd-desk.jpg')} alt="" draggable={false} />
        </figure>
        <p className="s39-agent">
          {AGENT[0]}
          <br />
          {AGENT[1]}
        </p>
      </div>

      <svg className="s39-chev" viewBox="0 0 30 120" aria-hidden="true">
        <path d="M3 0 H13 L29 60 L13 120 H3 L17 60 Z" />
      </svg>

      <h2 className="s39-title s39-title--score">{SCORE_TITLE}</h2>
      {/* the wrapper is what opens (a straight edge from the left); its padding keeps the window's shadow whole */}
      <div className="s39-winwrap">
        <BrowserFrame className="s39-win" src={pic(39, CHART.name)} ratio={`${CHART.px[0]} / ${CHART.px[1]}`} width={33} />
      </div>

      <h2 className="s39-title s39-title--alerts">{ALERTS_TITLE}</h2>
      <ul className="s39-alerts">
        {ALERTS.map((al, i) => {
          const at = al.text.indexOf(al.flame)
          return (
            <li key={i}>
              {al.text.slice(0, at)}
              <em className={al.bold ? 's39-b' : ''}>{al.flame}</em>
              {al.text.slice(at + al.flame.length)}
            </li>
          )
        })}
      </ul>
    </div>
  ),

  build(ctx) {
    const { U } = ctx
    const tl = ctx.timeline()
    const a = anim(ctx, tl)
    const fx = ctx.backdrop.fx
    const calm = ctx.reduced
    const net = ctx.$('.s39-net')
    const sigA = ctx.$$('.s39-signal--a')
    const sigB = ctx.$$('.s39-signal--b')
    const ring = ctx.$('.s39-ring')

    gsap.set(net, { x: calm ? 0 : HOME * U })
    gsap.set([...sigA, ...sigB], { autoAlpha: 0, drawSVG: '0% 0%' })
    gsap.set(ring, { autoAlpha: 0, scale: 1 })

    const models = ctx.$$('.s39-model')
    /** a model goes to work: its card and its icon take the flame */
    const light = (i: number, at: string) => {
      const m = models[i]
      tl.to(m, { borderColor: '#f16443', backgroundColor: '#ffffff', duration: 0.4, ease: 'power1.out' }, at)
      tl.to(m.querySelector('.s39-icon'), { backgroundColor: '#f16443', duration: 0.4, ease: 'power1.out' }, at)
      tl.to(m.querySelectorAll('.s39-icon svg > :not(.s39-fill)'), { stroke: '#ffffff', duration: 0.4, ease: 'power1.out' }, at)
      const dots = m.querySelectorAll('.s39-fill')
      if (dots.length) tl.to(dots, { fill: '#ffffff', duration: 0.4, ease: 'power1.out' }, at)
      if (!calm) tl.to(m, { scale: 1.035, duration: 0.45, ease: ctx.ease.out }, at)
    }

    /** one signal down each of these lines, one after another */
    const signals = (els: Element[], at: string) => {
      if (calm) return
      els.forEach((el, i) => {
        const t = `${at}+=${(i * 0.16).toFixed(2)}`
        tl.set(el, { autoAlpha: 1 }, t)
        tl.fromTo(el, { drawSVG: '0% 0%' }, { drawSVG: '0% 22%', duration: 0.18, ease: 'none', immediateRender: false }, t)
        tl.to(el, { drawSVG: '78% 100%', duration: 0.55, ease: 'power1.inOut' }, '>')
        tl.to(el, { drawSVG: '100% 100%', duration: 0.14, ease: 'none' }, '>')
        tl.set(el, { autoAlpha: 0 }, '>')
      })
    }
    const pulse = (at: string) => {
      if (calm) return
      tl.fromTo(ring, { autoAlpha: 0.9, scale: 1 }, { autoAlpha: 0, scale: 1.45, duration: 0.9, ease: 'power2.out', immediateRender: false }, at)
    }

    // ---- 1. the network assembles around the agent
    a.words('.kn-h', 0.1)
    a.pop('.s39-bot', 0.1, { from: 0.8, duration: 0.7 })
    a.rise('.s39-agent', 0.4, { y: 0.8 })
    a.rise('.s39-model', 0.25, { x: -2.4, y: 0, stagger: 0.14 })
    a.pop('.s39-icon', 0.42, { stagger: 0.14 })
    a.draw('.s39-wire', 0.9, { stagger: 0.14, duration: 0.7 })
    tl.addLabel('sig1', 1.65)
    signals(sigA, 'sig1')
    pulse('sig1+=1.05')
    tl.to(fx, { glow: 0.35, focusX: calm ? -0.2 : 0.25, focusY: 0.1, duration: 1.6 }, 0.8)
    tl.addLabel('network')

    // ---- 2. it steps aside; the SCORE comes out of the model that makes it
    const t2 = tl.duration()
    tl.addLabel('go2', t2)
    tl.to(net, { x: 0, duration: 1.0, ease: ctx.ease.inOut }, 'go2')
    tl.to(fx, { focusX: 0.4, glow: 0.3, duration: 1.2, ease: ctx.ease.inOut }, 'go2')
    light(2, 'go2+=0.45') // ML & Deep learning: Transaction Score
    signals([sigB[2]], 'go2+=0.7')
    pulse('go2+=1.45')
    if (!calm) gsap.set('.s39-chev', { x: -1.6 * U })
    a.fade('.s39-chev', 'go2+=1.35')
    if (!calm) tl.to('.s39-chev', { x: 0, duration: 0.7, ease: ctx.ease.out }, '<')
    a.rise('.s39-title--score', 'go2+=1.5', { y: 0.8 })
    // the window unrolls out of the agent WITH the real chart on it: one straight edge from the
    // left, so its line falls from the first decile to the tenth and the frame is never empty
    a.wipe('.s39-winwrap', 'go2+=1.5', { from: 'left', duration: 1.5, ease: 'power2.inOut' })
    if (!calm) {
      gsap.set('.s39-win', { x: -1.6 * U })
      tl.to('.s39-win', { x: 0, duration: 1.5, ease: ctx.ease.out }, '<')
    }
    tl.addLabel('score')

    // ---- 3. … with reasoning: the ALERTS come out of the model that reasons
    const t3 = tl.duration()
    tl.addLabel('go3', t3)
    light(1, 'go3') // LLM & Reasoning: Banking Alerts & Triggers
    signals([sigA[1]], 'go3+=0.2')
    pulse('go3+=0.95')
    a.rise('.s39-title--alerts', 'go3+=0.95', { y: 0.8 })
    a.rise('.s39-alerts li', 'go3+=1.2', { x: -1.2, y: 0, stagger: 0.18, duration: 0.6 })
    tl.to(fx, { focusY: 0.5, glow: 0.38, duration: 1.4, ease: ctx.ease.inOut }, 'go3')
    tl.addLabel('alerts')

    return tl
  },
}

export default scene
