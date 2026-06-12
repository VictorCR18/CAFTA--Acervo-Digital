import { CONTATO } from '@/lib/constants'

const contactItems = [
  {
    label: 'E-mail',
    value: CONTATO.email,
    href: `mailto:${CONTATO.email}`,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: CONTATO.instagram,
    href: CONTATO.instagramUrl,
    external: true,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V9h2v7zm4 0h-2V9h2v7z" />
      </svg>
    ),
  },
  {
    label: 'Telefone',
    value: CONTATO.telefone,
    href: `tel:${CONTATO.telefone.replace(/\D/g, '')}`,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
]

export default function ContatoSection() {
  return (
    <section id="section_contato" className="py-24 bg-cafta-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-eyebrow">Fale conosco!</span>
          <h2 className="section-title mb-4">Contato</h2>
          <p className="text-white/50 mb-12">
            Quer publicar seus trabalhos no acervo ou tirar dúvidas sobre o CAFTA?
            Fale com a gente pelos canais abaixo.
          </p>

          <ul className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {contactItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex flex-col items-center gap-2 p-6 rounded-lg border border-white/10
                             bg-cafta-primary/50 w-44 transition-all duration-300
                             hover:border-cafta-gold/40 hover:bg-cafta-primary hover:-translate-y-1 hover:shadow-lg"
                >
                  <span className="text-cafta-gold/70 group-hover:text-cafta-gold transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-white/30 text-xs uppercase tracking-wider">{item.label}</span>
                  <span className="text-white text-sm font-medium text-center leading-snug">{item.value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
