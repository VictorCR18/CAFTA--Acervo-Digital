import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import UploadForm from '@/components/ui/UploadForm'

export const metadata: Metadata = {
  title: 'Publicar no Acervo',
  description: 'Envie fotos, vídeos ou trabalhos acadêmicos para o acervo digital do CAFTA.',
}

export default function UploadPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cafta-dark pt-[72px]">
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voltar ao início
            </Link>

            <div className="max-w-lg mx-auto">
              {/* Header */}
              <div className="mb-10">
                <span className="section-eyebrow">Contribua com o CAFTA</span>
                <h1 className="section-title">Publicar no Acervo</h1>
                <p className="text-white/50 mt-3 text-sm leading-relaxed">
                  Envie suas fotos, vídeos ou trabalhos acadêmicos para compor o acervo digital do
                  Centro Acadêmico Frei Tito de Alencar.
                </p>
              </div>

              {/* Form */}
              <div className="bg-cafta-primary/60 border border-white/10 rounded-lg p-8">
                <UploadForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
