import Image from "next/image";
import Link from "next/link";
import type { CategoriaAcervo } from "@/types";

export default function CategoriaCard({ item }: { item: CategoriaAcervo }) {
  return (
    <Link href={`/acervo/${item.slug}`} className="block">
      <article className="card-acervo group cursor-pointer">
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
    </Link>
  );
}
