/**
 * A COPY of slide 28's emblem (scenes/s28/emblem.tsx), so that Nivaaran is the same mark in the
 * mesh of slide 64 as on slide 28. If one changes, change the other. Its styles: people.css.
 *
 * NIVAARAN'S EMBLEM. The deck has no portrait for Nivaaran (slide 28 leaves its place empty); on
 * slide 41 it is a flame disc with a white "N". This is that disc, set in the family of the other
 * three badges (a cream ground inside a fine flame ring, as Arya's), with what Nivaaran does
 * drawn round it: it listens. A ring of sound, bars of navy and flame, radiates from the disc
 * ("Nivaaran captures what the customer tells us", slide 41). It is a designed mark, not a face.
 *
 * Pure SVG, 200 x 200. The bars breathe very slightly while the slide waits (a CSS animation,
 * stopped by &still=1 like every idle loop).
 */

const BARS = 48
/** The length of bar k, in the emblem's units: two waves laid over each other, so it reads as a voice and not as a gear. */
const length = (k: number) => {
  const a = (k / BARS) * Math.PI * 2
  return 6.5 + 4.6 * Math.abs(Math.sin(a * 3 + 0.4)) + 3.4 * Math.abs(Math.sin(a * 7 + 1.3))
}

export function NivaaranEmblem({ className = '' }: { className?: string }) {
  return (
    <svg className={`people-emblem ${className}`} viewBox="0 0 200 200" role="img" aria-label="Nivaaran">
      <defs>
        <radialGradient id="people-em-ground" cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor="#fff8f3" />
          <stop offset="1" stopColor="#fce4d8" />
        </radialGradient>
        <radialGradient id="people-em-disc" cx="36%" cy="28%" r="85%">
          <stop offset="0" stopColor="#f88562" />
          <stop offset="0.55" stopColor="#f16443" />
          <stop offset="1" stopColor="#e24a22" />
        </radialGradient>
      </defs>
      {/* the ground and its fine ring */}
      <circle cx="100" cy="100" r="97" fill="url(#people-em-ground)" />
      <circle cx="100" cy="100" r="95.2" fill="none" stroke="#f16443" strokeWidth="3.2" />
      {/* the ring of sound */}
      <g className="people-em-bars">
        {Array.from({ length: BARS }, (_, k) => {
          const len = length(k)
          const flame = k % 4 === 1
          return (
            <g key={k} transform={`rotate(${(k * 360) / BARS} 100 100)`}>
              <rect
                className="people-em-bar"
                style={{ animationDelay: `${-((k * 7) % BARS) * 0.11}s` }}
                x={98.2}
                y={100 - 62.5 - len}
                width={3.6}
                height={len}
                rx={1.8}
                fill={flame ? '#f16443' : '#0d2466'}
                opacity={flame ? 1 : 0.86}
              />
            </g>
          )
        })}
      </g>
      {/* the disc of slide 41, and its letter */}
      <circle cx="100" cy="100" r="56" fill="url(#people-em-disc)" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="#ffffff" strokeWidth="2.4" />
      <text className="people-em-n" x="100" y="100" textAnchor="middle" dominantBaseline="central">
        N
      </text>
    </svg>
  )
}
