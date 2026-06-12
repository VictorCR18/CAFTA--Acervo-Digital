import Image from 'next/image'

export default function SobreSection() {
  return (
    <section
      id="section_sobre"
      className="relative py-24 bg-cafta-primary overflow-hidden"
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
          backgroundSize: '20px 20px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/campus-1.jpeg"
                alt="Sobre o CAFTA"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Gold accent border */}
            <div className="absolute -bottom-3 -right-3 w-2/3 h-2/3 border-2 border-cafta-gold/30 rounded-lg pointer-events-none" aria-hidden="true" />
          </div>

          {/* Text */}
          <div>
            <span className="section-eyebrow">Quem somos</span>
            <h2 className="section-title mb-6">Sobre nós</h2>

            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                O site foi criado pelo{' '}
                <strong className="text-white">C. A. Frei Tito de Alencar</strong> com o intuito de
                disponibilizar um acervo digital do curso de História da UFC aos graduandos.
              </p>
              <p>
                Aqui você acessará <span className="text-cafta-gold-light">fotos, vídeos e produções acadêmicas</span> produzidos
                ao longo da história do centro acadêmico.
              </p>
              <p>
                Quer que postemos os seus trabalhos acadêmicos?{' '}
                <a href="#section_contato" className="text-cafta-gold hover:text-cafta-gold-light underline underline-offset-2 transition-colors">
                  Entre em contato conosco!
                </a>
              </p>
            </div>

            <div className="mt-8">
              <a href="#section_acervo" className="btn-cafta-primary">
                Ver nosso acervo
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
