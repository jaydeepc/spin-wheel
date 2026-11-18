import type { Metadata, Viewport } from 'next'
import Ir from '@/ir/Ir'

export const metadata: Metadata = {
  title: 'Implications for Investors · Piramal.ai',
  description: 'Implications for Investors, slide by slide.',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#04114a',
}

export default function Page() {
  return <Ir />
}
