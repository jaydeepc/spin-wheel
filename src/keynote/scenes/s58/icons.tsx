/**
 * Slide 58's line icons, in the keynote's family (24 x 24, stroke = currentColor). The same
 * drawings as slide 56's, kept here so that this scene stands on its own.
 */
import type { ReactNode } from 'react'

const S = ({ children, w = 1.9 }: { children: ReactNode; w?: number }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

export const ICONS = {
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
} satisfies Record<string, ReactNode>
