import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '400', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'CAFTA — Acervo Digital de História',
    template: '%s | CAFTA',
  },
  description:
    'Acervo digital do Centro Acadêmico Frei Tito de Alencar — UFC. Fotos, vídeos e produções acadêmicas do curso de História.',
  keywords: ['CAFTA', 'UFC', 'História', 'acervo digital', 'Centro Acadêmico'],
  authors: [{ name: 'CAFTA — C. A. Frei Tito de Alencar' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'CAFTA',
    title: 'CAFTA — Acervo Digital de História',
    description: 'Acervo digital do curso de História da UFC.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a1a2e',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={jakarta.className}>
      <body className="min-h-screen bg-cafta-dark font-sans">{children}</body>
    </html>
  )
}
