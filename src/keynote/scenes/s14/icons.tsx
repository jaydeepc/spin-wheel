/**
 * Slide 14's seven icons, redrawn as vector in the deck's own shapes (the deck's are 27 to 40 px
 * pictures: sliders, brain, layers, people; server, cloud, speech bubbles). One description of
 * each serves both the DOM (an inline SVG whose strokes draw themselves) and the faces of the
 * blocks in the three.js structure (painted to a canvas).
 */

type Prim = { d: string } | { c: [number, number, number] } | { r: [number, number, number, number, number] }

export type IconName = 'sliders' | 'brain' | 'layers' | 'team' | 'server' | 'cloud' | 'chat'

/** On a 24 x 24 grid, stroked. */
export const ICONS: Record<IconName, Prim[]> = {
  sliders: [
    { d: 'M3.5 6.5h3.2M11.3 6.5h9.2' },
    { c: [9, 6.5, 2.3] },
    { d: 'M3.5 12h9.2M17.3 12h3.2' },
    { c: [15, 12, 2.3] },
    { d: 'M3.5 17.5h2.2M10.3 17.5h10.2' },
    { c: [8, 17.5, 2.3] },
  ],
  brain: [
    { d: 'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z' },
    { d: 'M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z' },
    { d: 'M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4' },
    { d: 'M17.599 6.5a3 3 0 0 0 .399-1.375' },
    { d: 'M6.003 5.125A3 3 0 0 0 6.401 6.5' },
    { d: 'M6 18a4 4 0 0 1-1.967-.516' },
    { d: 'M19.967 17.484A4 4 0 0 1 18 18' },
  ],
  layers: [{ d: 'M12 3.2 2.8 8 12 12.8 21.2 8 12 3.2Z' }, { d: 'M2.8 12.2 12 17l9.2-4.8' }, { d: 'M2.8 16.4 12 21.2l9.2-4.8' }],
  team: [
    { c: [12, 8.2, 3.1] },
    { d: 'M6.4 20v-1.2a5.6 5.6 0 0 1 11.2 0V20' },
    { c: [4.9, 10.6, 2.1] },
    { d: 'M1.6 18.6v-.5a3.5 3.5 0 0 1 2.6-3.4' },
    { c: [19.1, 10.6, 2.1] },
    { d: 'M22.4 18.6v-.5a3.5 3.5 0 0 0-2.6-3.4' },
  ],
  server: [
    { r: [3.2, 3.8, 17.6, 7, 2.2] },
    { r: [3.2, 13.2, 17.6, 7, 2.2] },
    { d: 'M7 7.3h.01M10.4 7.3h.01M7 16.7h.01M10.4 16.7h.01' },
    { d: 'M14.6 7.3h2.6M14.6 16.7h2.6' },
  ],
  cloud: [{ d: 'M7.2 18.6a4.6 4.6 0 0 1-.7-9.15 6.1 6.1 0 0 1 11.75 1.2 4 4 0 0 1-.75 7.95Z' }],
  chat: [
    { d: 'M4.4 4.6h9.2a2.2 2.2 0 0 1 2.2 2.2v4.6a2.2 2.2 0 0 1-2.2 2.2H8.6l-3.4 2.9v-2.9h-.8a2.2 2.2 0 0 1-2.2-2.2V6.8a2.2 2.2 0 0 1 2.2-2.2Z' },
    { d: 'M18.6 9.4h1a2.2 2.2 0 0 1 2.2 2.2v4a2.2 2.2 0 0 1-2.2 2.2h-.4v2.6l-3.1-2.6h-3.9' },
  ],
}

/** The icon in the DOM: every part carries `.s14-ink`, so the timeline can draw it. */
export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="s14-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name].map((p, i) =>
        'd' in p ? (
          <path className="s14-ink" key={i} d={p.d} />
        ) : 'c' in p ? (
          <circle className="s14-ink" key={i} cx={p.c[0]} cy={p.c[1]} r={p.c[2]} />
        ) : (
          <rect className="s14-ink" key={i} x={p.r[0]} y={p.r[1]} width={p.r[2]} height={p.r[3]} rx={p.r[4]} />
        ),
      )}
    </svg>
  )
}

/** The same icon on a canvas `size` pixels square (the face of a block). */
export function paintIcon(g: CanvasRenderingContext2D, name: IconName, size: number, colour: string, weight = 1.7) {
  g.save()
  g.clearRect(0, 0, size, size)
  g.scale(size / 24, size / 24)
  g.strokeStyle = colour
  g.lineWidth = weight
  g.lineCap = 'round'
  g.lineJoin = 'round'
  for (const p of ICONS[name]) {
    if ('d' in p) g.stroke(new Path2D(p.d))
    else if ('c' in p) {
      g.beginPath()
      g.arc(p.c[0], p.c[1], p.c[2], 0, Math.PI * 2)
      g.stroke()
    } else {
      const [x, y, w, h, r] = p.r
      g.beginPath()
      g.roundRect(x, y, w, h, r)
      g.stroke()
    }
  }
  g.restore()
}
