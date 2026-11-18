import type { Metadata, Viewport } from 'next'
import './globals.css'
import BrandFonts from '@/brand/BrandFonts'

export const metadata: Metadata = {
  title: 'BYOT · BYOA Showcase — Piramal.ai',
  description: 'Spin the wheel to meet a solution built on BYOT and BYOA by teams across Piramal Finance.',
  icons: { icon: '/brand/piramal-ai-icon.png' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* The brand font (Calibri): --font-brand and --font-brand-film, for the keynote and the film. See src/brand. */}
        <BrandFonts />
        {children}
      </body>
    </html>
  )
}
