"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [tipo, setTipo] = useState(searchParams.get("tipo") ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (search.trim()) {
      params.set("search", search.trim());
    } else {
      params.delete("search");
    }

    if (tipo) {
      params.set("tipo", tipo);
    } else {
      params.delete("tipo");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8 w-full max-w-3xl">
      <input
        type="text"
        placeholder="Buscar arquivos por título..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cafta-gold focus:ring-1 focus:ring-cafta-gold transition-colors"
      />
      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="bg-cafta-dark border border-white/10 rounded-md px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cafta-gold focus:ring-1 focus:ring-cafta-gold transition-colors appearance-none sm:w-48"
      >
        <option value="">Todos os tipos</option>
        <option value="imagens">Imagens</option>
        <option value="videos">Vídeos</option>
        <option value="artigos">Artigos/Documentos</option>
      </select>
      <button
        type="submit"
        className="bg-cafta-gold hover:bg-cafta-gold/90 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
      >
        Pesquisar
      </button>
    </form>
  );
}