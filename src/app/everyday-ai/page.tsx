import type { Metadata, Viewport } from 'next'
import Experience from '@/everyday/Experience'

export const metadata: Metadata = {
  title: 'Everyday AI — Piramal.ai',
  description:
    'Everyday AI at Piramal Finance: AI that every one of us can use, every day, to do our own job better. See it in one Tuesday, and remember five names: SmartHelp, BYOT, BYOA, Prastuti and Piramal Mind.',
}

/**
 * The film fills the screen edge to edge (it keeps clear of the notch and the home indicator
 * itself, with env(safe-area-inset-*)), and is never zoomed: on a phone it is a film, not a page.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function Page() {
  return <Experience />
}
