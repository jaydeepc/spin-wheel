'use client'

/**
 * EVERYDAY AI · shared pieces a moment can use inside its own components.
 */

import type { CSSProperties, ReactNode } from 'react'
import { director } from '../core/director'

/**
 * A line that rises through a mask. It starts hidden below the mask; bring it in with
 * `tl.to(el, { yPercent: 0 })` where el is the inner `.ev-rise`, and send it out with yPercent: -118.
 */
export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={className ? `ev-mask ${className}` : 'ev-mask'}>
      <span className="ev-rise">{children}</span>
    </span>
  )
}

/** Text with the product's name picked out in bold wherever it appears. */
export function withName(text: string, name: string): ReactNode {
  const parts = text.split(name)
  return parts.map((part, i) => (
    <span key={i}>
      {part}
      {i < parts.length - 1 ? <b>{name}</b> : null}
    </span>
  ))
}

/**
 * A text cut into its sentences: at the white space after a full stop, a question mark or an
 * exclamation mark (pass `enders` for other scripts: '.?!।' adds the Devanagari danda). The
 * same result as `text.split(/(?<=[.?!])\s+/)`, written without a lookbehind: Safari before
 * 16.4 refuses to parse one, and with it the whole page.
 */
export function splitSentences(text: string, enders = '.?!'): string[] {
  const out: string[] = []
  const isSpace = (ch: string) => /\s/.test(ch)
  let from = 0
  let i = 0
  while (i < text.length) {
    if (enders.includes(text[i]) && i + 1 < text.length && isSpace(text[i + 1])) {
      let j = i + 1
      while (j < text.length && isSpace(text[j])) j++
      out.push(text.slice(from, i + 1))
      from = j
      i = j
    } else i++
  }
  out.push(text.slice(from))
  return out
}

/**
 * Sentences as lines: each sentence starts a new line, and a hyphenated word never breaks
 * at its hyphen. For short display copy ("Details slip. Follow-ups are late.").
 */
export function sentences(text: string): ReactNode {
  return splitSentences(text).map((sentence, i) => (
    <span className="ev-sentence-line" key={i}>
      {sentence.split(' ').map((word, k) => (
        <span key={k}>
          {k > 0 ? ' ' : null}
          {word.includes('-') ? <span className="ev-nobreak">{word}</span> : word}
        </span>
      ))}
    </span>
  ))
}

/**
 * THE ONE CONTROL of a demo. Put exactly one in your Screen (or Extras) and draw your glyph
 * inside it. The shared frame makes it pulse and pressable from the moment it can be seen, and
 * plays your `run` timeline when it is pressed, or when Next is (the button, a key, a tap on the
 * empty stage). The film is manual: the control waits for as long as it takes, and its own halo
 * is the prompt. Only in Auto-play does the ghost fingertip press it, with "Your turn" beside it
 * for a visitor who is there.
 * Size it from your own class (width / height); it is round unless you give it a radius.
 */
export function TouchControl({
  label,
  className,
  style,
  children,
}: {
  /** What the control does, for screen readers: "Speak a visit note". */
  label: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  return (
    <button
      type="button"
      data-ev-control
      data-own
      aria-label={label}
      className={className ? `ev-touch ${className}` : 'ev-touch'}
      style={style}
      onClick={(e) => {
        // The control takes every tap that lands on it, so none falls through to the stage. It
        // acts only while it is live: once pressed it is spent, and a second tap does nothing.
        e.stopPropagation()
        if (e.currentTarget.getAttribute('data-live') === '1') director.touch()
      }}
    >
      <i className="ev-touch-ring" />
      <i className="ev-touch-ring ev-touch-ring--2" />
      <span className="ev-touch-in">{children}</span>
    </button>
  )
}

/**
 * The phone: 15.4u × 31.6u, before the frame enlarges it to fit the picture area. Children fill
 * its screen, under a status bar: 14.4u × 28.3u. The status bar carries no words and no clock
 * (the time of the moment is in the frame's clock chip): only the signal and the battery.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="ev-phone">
      <i className="ev-phone-btn ev-phone-btn--a" />
      <i className="ev-phone-btn ev-phone-btn--b" />
      <i className="ev-phone-btn ev-phone-btn--c" />
      <i className="ev-phone-bezel" />
      <div className="ev-screen ev-phone-screen">
        <div className="ev-status">
          <svg viewBox="0 0 48 12" aria-hidden="true">
            <rect x="0" y="7" width="3" height="5" rx="1" fill="#071a50" />
            <rect x="5" y="5" width="3" height="7" rx="1" fill="#071a50" />
            <rect x="10" y="2.5" width="3" height="9.5" rx="1" fill="#071a50" />
            <rect x="15" y="0" width="3" height="12" rx="1" fill="#071a50" />
            <rect x="27" y="1" width="18" height="10" rx="3" fill="none" stroke="#071a50" strokeWidth="1.2" />
            <rect x="29" y="3" width="11" height="6" rx="1.4" fill="#071a50" />
            <rect x="46" y="4" width="1.6" height="4" rx="0.8" fill="#071a50" />
          </svg>
        </div>
        <div className="ev-screen-body">{children}</div>
        <i className="ev-phone-glare" />
      </div>
      <i className="ev-phone-island" />
    </div>
  )
}

/** The laptop (Prastuti). Children fill its screen: 29u × 18.8u. */
export function LaptopFrame({ children }: { children: ReactNode }) {
  return (
    <div className="ev-laptop">
      <div className="ev-laptop-lid">
        <i className="ev-laptop-cam" />
        <div className="ev-screen ev-laptop-screen">
          <div className="ev-screen-body">{children}</div>
          <i className="ev-phone-glare" />
        </div>
      </div>
      <div className="ev-laptop-base">
        <i />
      </div>
    </div>
  )
}

/** The engineering mark: a pair of code brackets and a slash. Takes its colour from the text around it. */
export function CodeGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `ev-code ${className}` : 'ev-code'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 6.5 2.8 12 8 17.5" />
      <path d="M16 6.5 21.2 12 16 17.5" />
      <path d="M13.7 4.6 10.3 19.4" />
    </svg>
  )
}
