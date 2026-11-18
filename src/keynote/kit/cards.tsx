import type { CSSProperties, ReactNode } from 'react'
import { BRAND } from './brand'

type Tone = 'flame' | 'azure' | 'navy' | 'plain'

/**
 * The deck's card: white, softly rounded, a soft shadow. `tone` tints it (peach, ice) or turns
 * it navy.
 *
 *   <Card className="s05-card">…</Card>
 *   <Card tone="navy">…</Card>
 */
export function Card({
  children,
  tone = 'paper',
  className = '',
  style,
}: {
  children?: ReactNode
  tone?: 'paper' | 'peach' | 'ice' | 'navy'
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`kn-card kn-card--${tone} ${className}`} style={style}>
      {children}
    </div>
  )
}

/**
 * The deck's "in the news" clipping: a slip of paper held by a strip of tape, a small kicker and
 * date, the headline in a newspaper serif, the source under it.
 *
 *   <Clipping className="s17-clip" date="AUG 2026" tape="flame" source="Tech Times, on McKinsey's State of AI 2026" tilt={-1.5} width={22}>
 *     Record AI spending cannot move the earnings needle for 94% of enterprises
 *   </Clipping>
 *
 * Animate the outer element; the tilt is on an inner one.
 */
export function Clipping({
  children,
  kicker = 'In the news',
  date,
  source,
  tape = 'flame',
  tilt = -1.2,
  width,
  className = '',
}: {
  /** The clipping's headline, exact. */
  children: ReactNode
  kicker?: string
  date?: string
  source?: string
  tape?: 'flame' | 'navy' | 'azure'
  /** Degrees. */
  tilt?: number
  /** Width in --u. */
  width?: number
  className?: string
}) {
  return (
    <div className={`kn-clip ${className}`} style={width ? { width: `calc(var(--u) * ${width})` } : undefined}>
      <div className="kn-clip-paper" style={{ transform: `rotate(${tilt}deg)` }}>
        <span className={`kn-clip-tape kn-clip-tape--${tape}`} aria-hidden="true" />
        <div className="kn-clip-top">
          <b>{kicker}</b>
          {date ? <span>{date}</span> : null}
        </div>
        <p className="kn-clip-text">{children}</p>
        {source ? <div className="kn-clip-source">{source}</div> : null}
      </div>
    </div>
  )
}

/**
 * A filled chip: a short label on a tinted ground, optionally with a small icon in front.
 *
 *   <Chip tone="azure" icon={<CalendarIcon />}>Sep-25</Chip>
 */
export function Chip({ children, tone = 'plain', icon, className = '' }: { children: ReactNode; tone?: Tone; icon?: ReactNode; className?: string }) {
  return (
    <span className={`kn-chip kn-chip--${tone} ${className}`}>
      {icon ? <span className="kn-chip-icon">{icon}</span> : null}
      {children}
    </span>
  )
}

/**
 * An outlined pill, as the deck uses for short lists ("Lower unit cost", "No lock-in").
 *
 *   <Pill tone="flame">Fine-tune freely</Pill>
 */
export function Pill({ children, tone = 'navy', className = '' }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <span className={`kn-pillo kn-pillo--${tone} ${className}`}>{children}</span>
}

/**
 * A person: a REAL photograph in a circle (cropped to the circle by object-fit: cover, never
 * squeezed), a name and a role.
 *
 *   <Person src={pic(33, 'photo-sushil-pange.jpg')} name="Sushil Pange" role="Credit Manager, Nashik, Maharashtra" size={4.4} />
 *   <Person … plate />              // on a white plate, for use over a photograph or a busy ground
 *   <Person … maxPx={110} />        // never drawn larger than the photograph's own 110 pixels
 *
 * `focus` moves the crop if a face is not centred ("50% 20%"). The deck's portraits are small
 * (97 to 189 px): `size` is the circle's diameter in --u, and `maxPx` (the photograph's own width,
 * images.json → px[0]) caps it, so that on a very large screen the circle stops growing rather
 * than the face going soft.
 */
export function Person({
  src,
  name,
  role,
  size = 4.4,
  ring = 'azure',
  focus,
  plate = false,
  maxPx,
  className = '',
}: {
  src: string
  name?: string
  role?: string
  /** The circle's diameter in --u. */
  size?: number
  ring?: Tone
  focus?: string
  /** A white rounded plate behind the photo and the words. */
  plate?: boolean
  /** The photograph's own width in pixels: the circle is never drawn larger than this. */
  maxPx?: number
  className?: string
}) {
  const d = `calc(var(--u) * ${size})`
  return (
    <span
      className={`kn-person kn-person--${ring} ${plate ? 'kn-person--plate' : ''} ${className}`}
      style={{ '--kn-ps': maxPx ? `min(${d}, ${maxPx}px)` : d } as CSSProperties}
    >
      <span className="kn-person-photo">
        <img src={src} alt={name ?? ''} draggable={false} decoding="async" style={focus ? { objectPosition: focus } : undefined} />
      </span>
      {name || role ? (
        <span className="kn-person-text">
          {name ? <b>{name}</b> : null}
          {role ? <small>{role}</small> : null}
        </span>
      ) : null}
    </span>
  )
}

/**
 * The logo lock-up (the mark and "Piramal.ai"). The chrome already shows it at the top right of
 * every slide: use this only where a scene needs it as part of its picture (the title page).
 *
 *   <Logo height={9} />
 */
export function Logo({ height = 4.6, className = '', mark = false }: { height?: number; className?: string; mark?: boolean }) {
  return (
    <img
      className={`kn-logo ${className}`}
      src={mark ? BRAND.mark : BRAND.lockup}
      alt="Piramal.ai"
      draggable={false}
      style={{ height: `calc(var(--u) * ${height})`, width: 'auto' }}
    />
  )
}
