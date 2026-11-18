import type { CSSProperties, ReactNode } from 'react'

/**
 * FRAMES FOR REAL SCREENSHOTS. A screenshot of the actual tool is shown as it is: never redrawn,
 * never stretched. These frames hold it by `object-fit`:
 *
 *   fit="contain"  the whole screenshot is seen; the screen takes the screenshot's own ratio if
 *                  you pass it as `ratio` (then nothing is cropped and there are no bands)
 *   fit="cover"    the screen is filled and the overflow is cropped evenly: only where the deck
 *                  itself crops the picture
 *
 * Animate the OUTER element (.kn-phone, .kn-browser, .kn-laptop) with GSAP. The gentle 3D tilt
 * is on an inner element, so your transforms and the tilt do not fight.
 */

type Tilt = 'none' | 'left' | 'right'

interface FrameProps {
  /** The screenshot. */
  src?: string
  alt?: string
  /** The screen's width / height, as CSS ("9 / 19.5", "1280 / 800"). Pass the screenshot's own ratio. */
  ratio?: string
  fit?: 'contain' | 'cover'
  /** Which part of the screenshot to keep when `cover` crops ("50% 0%" keeps its top). */
  position?: string
  /** The frame's width in --u. */
  width: number
  tilt?: Tilt
  className?: string
  style?: CSSProperties
  /** Anything drawn over the screenshot, inside the screen (a highlight box, a cursor). */
  children?: ReactNode
}

const Shot = ({ src, alt = '', fit = 'contain', position }: Pick<FrameProps, 'src' | 'alt' | 'fit' | 'position'>) =>
  src ? <img className="kn-shot" src={src} alt={alt} draggable={false} decoding="async" style={{ objectFit: fit, objectPosition: position }} /> : null

/**
 *   <PhoneFrame className="s43-phone" src={pic(43, 'arya-app.png')} ratio="1170 / 2532" width={15} tilt="left" />
 */
export function PhoneFrame({ src, alt, ratio = '9 / 19.5', fit = 'contain', position, width, tilt = 'none', className = '', style, children }: FrameProps) {
  return (
    <div className={`kn-phone ${className}`} data-tilt={tilt} style={{ width: `calc(var(--u) * ${width})`, ...style }}>
      <div className="kn-phone-body">
        <div className="kn-phone-screen" style={{ aspectRatio: ratio }}>
          <Shot src={src} alt={alt} fit={fit} position={position} />
          {children}
        </div>
        <span className="kn-phone-notch" aria-hidden="true" />
      </div>
    </div>
  )
}

/**
 * A browser window: a bar with three dots and, if given, the address.
 *
 *   <BrowserFrame className="s57-dash" src={pic(57, 'gateway.png')} ratio="1600 / 900" width={46} address="ai-gateway" tilt="right" />
 */
export function BrowserFrame({
  src,
  alt,
  ratio = '16 / 10',
  fit = 'contain',
  position,
  width,
  tilt = 'none',
  className = '',
  style,
  children,
  address,
}: FrameProps & { address?: string }) {
  return (
    <div className={`kn-browser ${className}`} data-tilt={tilt} style={{ width: `calc(var(--u) * ${width})`, ...style }}>
      <div className="kn-browser-body">
        <div className="kn-browser-bar">
          <i />
          <i />
          <i />
          {address ? <span>{address}</span> : null}
        </div>
        <div className="kn-browser-screen" style={{ aspectRatio: ratio }}>
          <Shot src={src} alt={alt} fit={fit} position={position} />
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * A laptop: the screenshot on its screen, a slim base under it.
 *
 *   <LaptopFrame className="s50-laptop" src={pic(50, 'prastuti.png')} ratio="16 / 10" width={40} />
 */
export function LaptopFrame({ src, alt, ratio = '16 / 10', fit = 'contain', position, width, tilt = 'none', className = '', style, children }: FrameProps) {
  return (
    <div className={`kn-laptop ${className}`} data-tilt={tilt} style={{ width: `calc(var(--u) * ${width})`, ...style }}>
      <div className="kn-laptop-body">
        <div className="kn-laptop-lid">
          <div className="kn-laptop-screen" style={{ aspectRatio: ratio }}>
            <Shot src={src} alt={alt} fit={fit} position={position} />
            {children}
          </div>
        </div>
        <div className="kn-laptop-base" aria-hidden="true" />
      </div>
    </div>
  )
}

/**
 * A stack of paper: `sheets` pages, the top one holding your content (a real document page via
 * <Pic>, or a few drawn lines). Each sheet is a `.kn-sheet`, back to front, so a scene can deal
 * them in one by one: a.rise('.s36-stack .kn-sheet', 0.4, { stagger: 0.05 })
 *
 *   <PaperStack className="s36-stack" width={16} ratio="210 / 297" sheets={5} label="54 pages">
 *     <Pic n={36} name="statement-p1.png" fit="contain" />
 *   </PaperStack>
 */
export function PaperStack({
  width,
  ratio = '210 / 297',
  sheets = 4,
  label,
  className = '',
  children,
}: {
  width: number
  ratio?: string
  sheets?: number
  /** A small tag on the stack's lower right corner ("54 pages"). */
  label?: string
  className?: string
  children?: ReactNode
}) {
  const n = Math.max(1, sheets)
  return (
    <div className={`kn-stack ${className}`} style={{ width: `calc(var(--u) * ${width})`, aspectRatio: ratio }}>
      {Array.from({ length: n }, (_, i) => {
        const back = n - 1 - i // 0 is the top sheet
        const turn = back === 0 ? 0 : ((back * 37) % 5) - 2 + (back % 2 ? 0.6 : -0.6)
        return (
          <div
            key={i}
            className="kn-sheet"
            data-top={back === 0 ? 1 : 0}
            style={{ transform: `translate(calc(var(--u) * ${back * 0.28}), calc(var(--u) * ${back * 0.3})) rotate(${turn * 0.8}deg)` }}
          >
            <div className="kn-sheet-face">{back === 0 ? children : null}</div>
          </div>
        )
      })}
      {label ? <span className="kn-stack-label">{label}</span> : null}
    </div>
  )
}
