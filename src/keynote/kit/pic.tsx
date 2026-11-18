import type { CSSProperties } from 'react'
import { pad } from '../deck'

/** The URL of one of slide n's own pictures: public/keynote/src/NN/<name>. */
export const pic = (n: number, name: string) => `/keynote/src/${pad(n)}/${name}`

/**
 * The URL of a GENERATED picture of slide n: public/keynote/gen/NN/<name>. Every slide has its
 * own folder there, so two builders never write the same file. (The rules for generating are in
 * SCENES.md: text prompts only, no names, never a deck picture as a reference.)
 */
export const gen = (n: number, name: string) => `/keynote/gen/${pad(n)}/${name}`

/**
 * A pack rectangle as CSS: `rect` is [x, y, w, h] in fractions of the slide, as text.json and
 * images.json → placements[].rect give it. The box is placed absolutely at the deck's own spot.
 *
 *   <Pic n={33} name="illus-f1-chassis.png" fit="contain" style={place([0.31, 0.42, 0.37, 0.27])} />
 *   <div className="s33-card" style={place(rect, { scale: 0.9, dy: -1.2 })} />
 *
 * `scale` shrinks or grows the whole placement about the stage's centre (to refit a full-bleed
 * slide inside the safe area); `dx`, `dy` shift it, in --u. `height: false` leaves the height to
 * the content (a picture with its own ratio).
 */
export function place(rect: readonly number[], o: { scale?: number; dx?: number; dy?: number; height?: boolean } = {}): CSSProperties {
  const k = o.scale ?? 1
  const u = (v: number) => `calc(var(--u) * ${+v.toFixed(3)})`
  const [x, y, w, h] = rect
  return {
    position: 'absolute',
    left: u(50 + (x * 100 - 50) * k + (o.dx ?? 0)),
    top: u(28.125 + (y * 56.25 - 28.125) * k + (o.dy ?? 0)),
    width: u(w * 100 * k),
    ...(o.height === false ? null : { height: u(h * 56.25 * k) }),
  }
}

/**
 * A PICTURE FROM THE DECK, shown as it is. Real photographs and real screenshots are never
 * stretched: the box you give is filled by `object-fit`, which crops evenly ('cover', as the
 * deck crops) or shows the whole picture ('contain').
 *
 *   <Pic n={12} name="photo-middle-india.jpg" ratio="3 / 4" width={17} radius={1.6} />    // slide 12's own picture
 *   <Pic src={gen(20, 'kite.png')} fit="contain" width={12} />                            // a generated one
 *
 * Give `ratio` (the BOX's width / height) and `width` in --u; or leave both out and size the
 * `.kn-pic` from your stylesheet. `focus` chooses what a crop keeps ("50% 20%").
 * List the pictures of your scene in SceneModule.preload, so they are decoded before they show.
 */
export function Pic({
  n,
  name,
  src,
  alt = '',
  fit = 'cover',
  focus,
  ratio,
  width,
  radius,
  className = '',
  style,
}: {
  /** The slide the picture belongs to, with `name`. */
  n?: number
  name?: string
  /** Or the URL itself. */
  src?: string
  alt?: string
  fit?: 'cover' | 'contain'
  focus?: string
  /** The box's width / height, as CSS ("4 / 3"). */
  ratio?: string
  /** The box's width in --u. */
  width?: number
  /** Corner radius in --u. */
  radius?: number
  className?: string
  style?: CSSProperties
}) {
  const url = src ?? (n && name ? pic(n, name) : '')
  return (
    <span
      className={`kn-pic ${className}`}
      style={{
        ...(width ? { width: `calc(var(--u) * ${width})` } : null),
        ...(ratio ? { aspectRatio: ratio } : null),
        ...(radius ? { borderRadius: `calc(var(--u) * ${radius})` } : null),
        ...style,
      }}
    >
      <img src={url} alt={alt} draggable={false} decoding="async" style={{ objectFit: fit, objectPosition: focus }} />
    </span>
  )
}
