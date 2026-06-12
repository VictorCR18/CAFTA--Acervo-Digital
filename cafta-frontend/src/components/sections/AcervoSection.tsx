import Image from 'next/image'
import { CATEGORIAS_ACERVO } from '@/lib/constants'
import type { CategoriaAcervo } from '@/types'

function CategoriaCard({ item }: { item: CategoriaAcervo }) {
  return (
    <article className="card-acervo group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={item.imagemSrc}
          alt={item.imagemAlt}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cafta-dark/80 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-cafta-gold transition-colors">
          {item.titulo}
        </h3>
        <p className="text-white/50 text-sm">{item.descricao}</p>
      </div>
    </article>
  )
}

export default function AcervoSection() {
  return (
    <section id="section_acervo" className="py-24 bg-cafta-dark">
      <div className="container mx-auto px-4 md:px-6">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="section-eyebrow">Nossas memórias em fotos</span>
          <h2 className="section-title">Acervo</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIAS_ACERVO.map((cat) => (
            <CategoriaCard key={cat.slug} item={cat} />
          ))}
        </div>
      </div>
    </section>
  )
}
