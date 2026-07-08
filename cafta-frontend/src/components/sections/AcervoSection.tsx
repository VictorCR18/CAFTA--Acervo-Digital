import CategoriaCard from "@/components/ui/CategoriaCard";

import { CATEGORIAS_ACERVO } from "@/lib/constants";

export default function AcervoSection() {
  return (
    <section id="section_acervo" className="py-24 bg-cafta-dark">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Nossas memórias em fotos</span>
          <h2 className="section-title">Acervo</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIAS_ACERVO.map((cat) => (
            <CategoriaCard key={cat.slug} item={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}
