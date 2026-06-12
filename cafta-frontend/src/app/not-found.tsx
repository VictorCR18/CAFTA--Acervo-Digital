import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página não encontrada',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-cafta-dark flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-cafta-gold text-6xl font-bold mb-4">404</p>
        <h1 className="text-white text-2xl font-semibold mb-3">Página não encontrada</h1>
        <p className="text-white/40 text-sm mb-8">
          A página que você está procurando não existe ou foi removida.
        </p>
        <Link href="/" className="btn-cafta-primary">
          Voltar ao início
        </Link>
      </div>
    </main>
  )
}
