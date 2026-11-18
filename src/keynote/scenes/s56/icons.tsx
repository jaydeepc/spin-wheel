/**
 * The small icons of slides 56, 57 and 58, redrawn as one family of line icons (the deck's are
 * 28 to 85 px pastes). 24 x 24, stroke = currentColor.
 */
import type { ReactNode } from 'react'

const S = ({ children, w = 1.9 }: { children: ReactNode; w?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export const ICONS: Record<string, ReactNode> = {
  handshake: (
    <S>
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
      <path d="m21 3 1 11h-2" />
      <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
      <path d="M3 4h8" />
    </S>
  ),
  team: (
    <S>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </S>
  ),
  layers: (
    <S>
      <path d="m12 2.5 9.5 4.75L12 12 2.5 7.25z" />
      <path d="m2.5 12 9.5 4.75L21.5 12" />
      <path d="m2.5 16.75 9.5 4.75 9.5-4.75" />
    </S>
  ),
  compass: (
    <S>
      <circle cx="12" cy="12" r="9.5" />
      <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
    </S>
  ),
  brain: (
    <S>
      <path d="M12 5.2v14" />
      <path d="M12 5.2A2.9 2.9 0 0 0 6.5 4.3 3.2 3.2 0 0 0 4 9.2a3.4 3.4 0 0 0 .3 5.6A3.3 3.3 0 0 0 8.6 19.4 2.9 2.9 0 0 0 12 19.2" />
      <path d="M12 5.2a2.9 2.9 0 0 1 5.5-.9A3.2 3.2 0 0 1 20 9.2a3.4 3.4 0 0 1-.3 5.6 3.3 3.3 0 0 1-4.3 4.6 2.9 2.9 0 0 1-3.4-.2" />
      <path d="M8.2 9.6c1.2 0 2.2.7 2.6 1.8" />
      <path d="M15.8 13.4c-1.2 0-2.2-.7-2.6-1.8" />
    </S>
  ),
  tag: (
    <S>
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r="1" fill="currentColor" />
    </S>
  ),
  arrowDown: (
    <S w={2.4}>
      <path d="M12 4.5v15" />
      <path d="m18.5 13-6.5 6.5L5.5 13" />
    </S>
  ),
  rupee: (
    <S w={2.2}>
      <path d="M6 3.5h12" />
      <path d="M6 8.5h12" />
      <path d="m6.5 13.5 8 7.5" />
      <path d="M6 13.5h3" />
      <path d="M9 13.5c6.667 0 6.667-10 0-10" />
    </S>
  ),
  chat: (
    <S>
      <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" />
      <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
    </S>
  ),
  shuffle: (
    <S>
      <path d="m18 14 4 4-4 4" />
      <path d="m18 2 4 4-4 4" />
      <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" />
      <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" />
      <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
    </S>
  ),
  cloud: (
    <S>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </S>
  ),
  server: (
    <S>
      <rect x="2.5" y="3" width="19" height="7.5" rx="2" />
      <rect x="2.5" y="13.5" width="19" height="7.5" rx="2" />
      <path d="M6.5 6.75h.01M6.5 17.25h.01M10.5 6.75h.01M10.5 17.25h.01" />
    </S>
  ),
  search: (
    <S w={2.2}>
      <circle cx="11" cy="11" r="7.5" />
      <path d="m21 21-4.4-4.4" />
    </S>
  ),
  sliders: (
    <S>
      <path d="M3 6h9M16 6h5M3 12h4M11 12h10M3 18h11M18 18h3" />
      <path d="M14 4v4M9 10v4M16 16v4" />
    </S>
  ),
  chip: (
    <S>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.6" />
      <path d="M9 2.5V5M15 2.5V5M9 19v2.5M15 19v2.5M2.5 9H5M2.5 15H5M19 9h2.5M19 15h2.5" />
    </S>
  ),
  bolt: (
    <S>
      <path d="M13 2 4 13.5h7.5L10.5 22 20 10.5h-7.5z" />
    </S>
  ),
  chartLine: (
    <S w={2.1}>
      <path d="M3 3v18h18" />
      <path d="m19 8-5 5-4-4-3.5 3.5" />
    </S>
  ),
  shield: (
    <S w={2.1}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </S>
  ),
  unlock: (
    <S w={2.1}>
      <rect x="3.5" y="11" width="17" height="10.5" rx="2" />
      <path d="M7.5 11V7a4.8 4.8 0 0 1 9.4-1.2" />
    </S>
  ),
  gauge: (
    <S w={2.1}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </S>
  ),
}
