import type { Metadata, Viewport } from 'next'
import Keynote from '@/keynote/Keynote'

export const metadata: Metadata = {
  title: 'Investor and Analyst Day 2026 · Piramal.ai',
  description: 'The morning keynote, slide by slide.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#04114a',
}

export default function Page() {
  return <Keynote />
}
