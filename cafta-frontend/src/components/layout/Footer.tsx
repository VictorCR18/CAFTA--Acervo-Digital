import Link from 'next/link'
import { CONTATO, NAV_ITEMS } from '@/lib/constants'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-cafta-primary border-t border-white/10 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-bold tracking-widest text-white text-lg mb-3">CAFTA</p>
            <p className="text-white/50 text-sm leading-relaxed">
              Centro Acadêmico Frei Tito de Alencar<br />
              Curso de História — UFC
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-cafta-gold text-xs font-semibold tracking-widest uppercase mb-4">Navegação</p>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-white/50 text-sm hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-cafta-gold text-xs font-semibold tracking-widest uppercase mb-4">Contato</p>
            <ul className="space-y-2 text-sm text-white/50">
              <li>
                <a href={`mailto:${CONTATO.email}`} className="hover:text-white transition-colors">
                  {CONTATO.email}
                </a>
              </li>
              <li>
                <a href={CONTATO.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  {CONTATO.instagram}
                </a>
              </li>
              <li>{CONTATO.telefone}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {year} CAFTA — Centro Acadêmico Frei Tito de Alencar. Todos os direitos reservados.
          </p>
          <Link href="/upload" className="text-cafta-gold/70 text-xs hover:text-cafta-gold transition-colors">
            Publicar no acervo ↗
          </Link>
        </div>
      </div>
    </footer>
  )
}
