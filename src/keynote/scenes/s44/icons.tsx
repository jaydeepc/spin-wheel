/**
 * Slide 44's icons, redrawn as vector from the deck's own (18 to 48 px pictures, too coarse to show).
 * Same shapes: a ringing phone, a chat bubble, a headset, sliders, a rupee; a tag, two languages,
 * a thumb; a person, a pause, a tick. Strokes carry `s44-ink` so they can draw themselves.
 */
import type { ReactNode } from 'react'

const Svg = ({ children, w = 2 }: { children: ReactNode; w?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export const PhoneCall = () => (
  <Svg>
    <path
      className="s44-ink"
      d="M7.2 3.8 9 3.4c.5-.1 1 .2 1.2.7l1 2.6c.2.4 0 .9-.3 1.200L9.500 9.100a10 10 0 0 0 5.400 5.400l1.200-1.400c.3-.3.8-.5 1.200-.3l2.600 1c.5.2.8.7.7 1.200l-.4 1.800c-.2.8-.9 1.400-1.700 1.400C11.300 18.200 5.800 12.700 5.800 5.500c0-.8.600-1.500 1.400-1.700Z"
    />
    <path className="s44-ink s44-ring" d="M14.500 6.200a3.600 3.600 0 0 1 3.300 3.300" />
    <path className="s44-ink s44-ring" d="M14.300 2.900a6.800 6.800 0 0 1 6.800 6.800" />
  </Svg>
)

/** A plain chat bubble carrying a link (the deck names the app in words; no third-party mark is drawn). */
export const ChatLink = () => (
  <Svg>
    <path className="s44-ink" d="M12 3.500a8.300 8.300 0 0 0-7.200 12.400L3.600 20.400l4.600-1.200A8.300 8.300 0 1 0 12 3.500Z" />
    <path className="s44-ink" d="M10.900 13.100a2.300 2.300 0 0 0 3.300 0l1.500-1.500a2.300 2.300 0 0 0-3.300-3.300l-.5.500" />
    <path className="s44-ink" d="M13.100 10.900a2.300 2.300 0 0 0-3.300 0l-1.500 1.500a2.300 2.300 0 0 0 3.300 3.300l.5-.5" />
  </Svg>
)

export const Headset = () => (
  <Svg>
    <path className="s44-ink" d="M4.500 13.500v-1.700a7.500 7.500 0 0 1 15 0v1.700" />
    <rect className="s44-ink" x="3.600" y="12.600" width="3.600" height="5.600" rx="1.500" />
    <rect className="s44-ink" x="16.800" y="12.600" width="3.600" height="5.600" rx="1.500" />
    <path className="s44-ink" d="M19 18.200c0 1.700-1.600 2.600-4.200 2.600h-1.600" />
  </Svg>
)

export const Sliders = () => (
  <Svg>
    <path className="s44-ink" d="M4 7h16M4 12h16M4 17h16" />
    <circle className="s44-knob s44-knob--a" cx="9" cy="7" r="2.100" fill="var(--kn-flame)" />
    <circle className="s44-knob s44-knob--b" cx="15.500" cy="12" r="2.100" fill="var(--kn-flame)" />
    <circle className="s44-knob s44-knob--c" cx="8" cy="17" r="2.100" fill="var(--kn-flame)" />
  </Svg>
)

export const Rupee = () => (
  <Svg w={2.4}>
    <path className="s44-ink" d="M7 5h10M7 9.200h10M7 5h3.200a4.200 4.200 0 0 1 0 8.400H7l7.200 6.600" />
  </Svg>
)

export const Tag = () => (
  <Svg>
    <path className="s44-ink" d="M4 5.200v5.600c0 .5.200 1 .6 1.400l7 7c.7.700 1.800.700 2.500 0l5-5c.7-.700.700-1.800 0-2.500l-7-7c-.4-.4-.9-.6-1.400-.6H5.200C4.500 4 4 4.500 4 5.200Z" />
    <circle className="s44-ink" cx="8.200" cy="8.200" r="1.200" />
  </Svg>
)

export const Languages = () => (
  <Svg>
    <rect className="s44-ink" x="2.800" y="5" width="10.500" height="10.500" rx="1.800" />
    <path className="s44-ink" d="M5.600 12.800 8 7.400l2.400 5.400M6.400 11.200h3.200" />
    <path className="s44-ink" d="M13.300 8.500h6.100c1 0 1.800.800 1.800 1.800v6.900c0 1-.8 1.800-1.800 1.800h-6.900c-1 0-1.800-.800-1.800-1.800v-1.700" />
    <path className="s44-ink" d="M14.200 12.100h5M16.700 11.100v1M18.400 12.100c-.4 2-1.800 3.500-3.800 4.300M15.600 14c.7 1.100 1.800 1.900 3.200 2.300" />
  </Svg>
)

export const Thumb = () => (
  <Svg>
    <path className="s44-ink" d="M7.800 10.600 11.600 4c1.300 0 2.300 1 2.300 2.300v3.300h4.200c1.200 0 2.100 1.100 1.900 2.300l-1 5.700c-.2.900-1 1.600-1.900 1.600H7.800" />
    <rect className="s44-ink" x="3.800" y="10.600" width="4" height="8.600" rx="1" />
  </Svg>
)

export const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="8.200" r="3.700" />
    <path d="M4.800 19.600c0-3.600 3.200-5.900 7.200-5.900s7.200 2.300 7.200 5.900c0 .5-.4.900-.9.900H5.700c-.5 0-.9-.4-.9-.9Z" />
  </svg>
)

export const Pause = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="7" y="6" width="3.600" height="12" rx="1" />
    <rect x="13.400" y="6" width="3.600" height="12" rx="1" />
  </svg>
)

export const Check = () => (
  <Svg w={2.8}>
    <path d="m6 12.600 4 4 8-8.600" />
  </Svg>
)
