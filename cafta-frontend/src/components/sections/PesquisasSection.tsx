"use client";

import { usePesquisas } from "@/lib/usePesquisas";
import type { Pesquisa } from "@/types";

function PesquisaRow({ pesquisa }: { pesquisa: Pesquisa }) {
  return (
    <div className="card-pesquisa group">
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {pesquisa.link ? (
              <a
                href={pesquisa.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium text-sm leading-snug hover:text-cafta-gold transition-colors line-clamp-2"
              >
                {pesquisa.titulo}
              </a>
            ) : (
              <p className="text-white font-medium text-sm leading-snug line-clamp-2">
                {pesquisa.titulo}
              </p>
            )}
            <p className="text-white/40 text-xs mt-1">
              {pesquisa.autores.join("; ")}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-cafta-gold font-semibold text-sm tabular-nums">
              {pesquisa.ano}
            </span>
            {pesquisa.destaque && (
              <span className="bg-cafta-gold/20 text-cafta-gold border border-cafta-gold/30 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm">
                Destaque
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PesquisasSection() {
  const { data: pesquisas, loading, error } = usePesquisas();

  if (loading) {
    return (
      <section id="section_pesquisas" className="py-24 bg-cafta-primary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="5"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <span className="ml-3 text-white">Carregando pesquisas...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="section_pesquisas" className="py-24 bg-cafta-primary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="text-white/50 text-sm mb-4">Erro</h2>
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!pesquisas || pesquisas.length === 0) {
    return (
      <section id="section_pesquisas" className="py-24 bg-cafta-primary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <p className="text-white/50">Nenhuma pesquisa encontrada.</p>
            <a
              href="#section_contato"
              className="text-cafta-gold/60 hover:text-cafta-gold transition-colors underline underline-offset-2"
            >
              Quer publicar a sua?
            </a>
          </div>
        </div>
      </section>
    );
  }

  const half = Math.ceil(pesquisas.length / 2);
  const col1 = pesquisas.slice(0, half);
  const col2 = pesquisas.slice(half);

  return (
    <section id="section_pesquisas" className="py-24 bg-cafta-primary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <span className="section-eyebrow">Produções acadêmicas</span>
          <h2 className="section-title">Pesquisas</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-cafta-dark/50 rounded-lg border border-white/10 p-6">
            {col1.map((p) => (
              <PesquisaRow key={p.id} pesquisa={p} />
            ))}
          </div>

          <div className="bg-cafta-dark/50 rounded-lg border border-white/10 p-6">
            {col2.map((p) => (
              <PesquisaRow key={p.id} pesquisa={p} />
            ))}
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-8">
          As pesquisas são inseridas manualmente pelos administradores do CAFTA.{" "}
          <a
            href="#section_contato"
            className="text-cafta-gold/60 hover:text-cafta-gold transition-colors underline underline-offset-2"
          >
            Quer publicar a sua?
          </a>
        </p>
      </div>
    </section>
  );
}
