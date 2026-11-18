'use client'

/**
 * THE CHROME. What stays on screen through the deck, inside the stage:
 *
 *   top left     the section rail, A to F, built from the agenda: the current section is opened
 *                to its name, the ones behind us are marked, each is a button that jumps to its
 *                first slide. Beside it, the slide's own breadcrumb (deck.ts → crumb), which
 *                animates only in the part that changed.
 *   top right    the logo.
 *   bottom right the slide counter, the overview button, Back and Next.
 *   the foot     a thin line of progress (along the foot of the screen: Keynote.tsx places it).
 *
 * A scene never draws any of this. It may switch parts off for its slide: SceneModule.chrome.
 * `?chrome=0` hides all of it without moving anything.
 */

import { pad } from '../deck'
import { slideIn, useDeck, type DeckDef } from '../core/active'
import { director } from '../core/director'
import { useKeynote } from '../core/store'
import { BRAND } from '../kit/brand'

function Rail() {
  const n = useKeynote((s) => s.n)
  const show = useKeynote((s) => s.chrome.rail)
  const deck = useDeck()
  // a deck without sections has no rail (and its breadcrumb then begins the bar)
  if (!deck.sections.length) return null
  const cur = slideIn(deck, n).section
  return (
    <nav className="kn-rail" data-show={show ? 1 : 0} aria-label="Sections">
      {deck.sections.map((sec, i) => {
        const state = sec.key === cur ? 'on' : n > sec.last ? 'done' : 'ahead'
        return (
          <span key={sec.key} style={{ display: 'contents' }}>
            {i > 0 && <span className="kn-rail-link" aria-hidden="true" />}
            <button
              type="button"
              className="kn-rail-item"
              data-state={state}
              data-section={sec.key}
              tabIndex={show ? 0 : -1}
              aria-current={state === 'on' ? 'true' : undefined}
              title={`${sec.letter}  ${sec.name}`}
              onClick={(e) => {
                e.currentTarget.blur()
                director.jump(sec.first)
              }}
            >
              <span className="kn-rail-letter">{sec.letter}</span>
              <span className="kn-rail-name">{sec.name}</span>
            </button>
          </span>
        )
      })}
    </nav>
  )
}

/** Letters and figures only, for comparing a breadcrumb's first part with the section's name. */
const plain = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, '')

/**
 * The parts of a slide's breadcrumb that the bar shows. The deck's breadcrumb often begins with
 * the section's own name ("AI – UNDER THE HOOD / OPEN ARCHITECTURE" in section F), and the rail
 * beside it already says that: the repeat is dropped, the rest is shown.
 */
export function crumbParts(deck: DeckDef, n: number): { text: string; sep: string | null; last: boolean }[] {
  const s = slideIn(deck, n)
  const sec = deck.sections.find((x) => x.key === s.section)
  const parts = s.crumb.map((text, i) => ({ text, sep: i > 0 ? (s.crumbSep?.[i - 1] ?? '/') : null, last: i === s.crumb.length - 1 && i > 0 }))
  if (sec && parts.length > 1) {
    const a = plain(parts[0].text)
    const b = plain(sec.name)
    if (a && (b.startsWith(a) || a.startsWith(b))) {
      parts.shift()
      parts[0].sep = null
    }
  }
  return parts
}

function Crumb() {
  const n = useKeynote((s) => s.n)
  const show = useKeynote((s) => s.chrome.crumb)
  const deck = useDeck()
  const parts = crumbParts(deck, n)
  if (!parts.length) return <div className="kn-crumb" data-show="0" style={{ border: 0 }} />
  return (
    <div className="kn-crumb" data-show={show ? 1 : 0} data-alone={deck.sections.length ? undefined : 1} data-crumb={slideIn(deck, n).crumb.join(' / ')}>
      {parts.map((part, i) => [
        part.sep && (
          <span key={`sep-${i}-${part.text}`} className="kn-crumb-sep" aria-hidden="true">
            {part.sep}
          </span>
        ),
        // keyed by its words: a part that stays between two slides does not animate again
        <span key={`${i}-${part.text}`} className="kn-crumb-part" data-last={part.last ? 1 : 0}>
          {part.text}
        </span>,
      ])}
    </div>
  )
}

const Arrow = ({ back = false }: { back?: boolean }) => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {back ? <path d="M13 8H3.5M7.5 3.5 3 8l4.5 4.5" /> : <path d="M3 8h9.5M8.5 3.5 13 8l-4.5 4.5" />}
  </svg>
)

function Nav() {
  const n = useKeynote((s) => s.n)
  const resting = useKeynote((s) => s.resting)
  const beatIndex = useKeynote((s) => s.beatIndex)
  const beatCount = useKeynote((s) => s.beatCount)
  const counter = useKeynote((s) => s.chrome.counter)
  const COUNT = useDeck().slides.length
  const atStart = n === 1 && beatIndex === 0
  const atEnd = n === COUNT && beatIndex >= beatCount - 1 && resting
  const press = (fn: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.blur() // a click never keeps the keyboard's focus: Space and Enter stay "Next"
    fn()
  }
  return (
    <div className="kn-nav" data-state={resting ? 'ready' : 'moving'}>
      <span className="kn-count" data-show={counter ? 1 : 0} aria-label={`Slide ${n} of ${COUNT}`}>
        {pad(n)} / {pad(COUNT)}
      </span>
      <button
        type="button"
        className="kn-pill kn-pill--quiet"
        title="All slides (G)"
        aria-label="All slides"
        onClick={press(() => useKeynote.setState({ overview: true }))}
      >
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <rect x="2" y="2" width="5" height="5" rx="1.2" />
          <rect x="9" y="2" width="5" height="5" rx="1.2" />
          <rect x="2" y="9" width="5" height="5" rx="1.2" />
          <rect x="9" y="9" width="5" height="5" rx="1.2" />
        </svg>
      </button>
      <button type="button" className="kn-pill kn-pill--quiet" title="Back" aria-label="Back" disabled={atStart} onClick={press(() => director.back())}>
        <Arrow back />
      </button>
      <button type="button" className="kn-pill kn-pill--next" aria-label="Next" disabled={atEnd} onClick={press(() => director.next())}>
        Next
        <Arrow />
      </button>
    </div>
  )
}

/** The thin line of progress. It lies along the foot of the SCREEN (not of the stage), so on a 16:10 laptop it is not left floating. */
export function Progress() {
  const n = useKeynote((s) => s.n)
  const beatIndex = useKeynote((s) => s.beatIndex)
  const beatCount = useKeynote((s) => s.beatCount)
  const COUNT = useDeck().slides.length
  const p = (n - 1 + (beatIndex + 1) / Math.max(1, beatCount)) / COUNT
  return (
    <div className="kn-progress" aria-hidden="true">
      <div className="kn-progress-fill" style={{ transform: `scaleX(${p.toFixed(4)})` }} />
    </div>
  )
}

function Typed() {
  const typed = useKeynote((s) => s.typed)
  if (!typed) return null
  return (
    <div className="kn-typed" role="status">
      Go to slide {typed} <small>Enter</small>
    </div>
  )
}

export default function Chrome() {
  const logo = useKeynote((s) => s.chrome.logo)
  return (
    <div className="kn-chrome">
      <div className="kn-top">
        <Rail />
        <Crumb />
        <span className="kn-top-gap" />
        <img className="kn-toplogo" data-show={logo ? 1 : 0} src={BRAND.lockup} alt="Piramal.ai" draggable={false} />
      </div>
      <Nav />
      <Typed />
    </div>
  )
}
