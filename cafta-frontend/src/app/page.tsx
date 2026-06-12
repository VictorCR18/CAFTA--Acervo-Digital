import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import SobreSection from '@/components/sections/SobreSection'
import AcervoSection from '@/components/sections/AcervoSection'
import PesquisasSection from '@/components/sections/PesquisasSection'
import ContatoSection from '@/components/sections/ContatoSection'

export const metadata: Metadata = {
  title: 'CAFTA — Acervo Digital de História',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SobreSection />
        <AcervoSection />
        <PesquisasSection />
        <ContatoSection />
      </main>
      <Footer />
    </>
  )
}
