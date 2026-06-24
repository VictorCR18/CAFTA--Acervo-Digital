"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAcervoItems } from "@/lib/useAcervoItems";
import { labelForTipo } from "@/lib/utils";
import type { AcervoTipo } from "@/types";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AcervoTipoPage() {
  const params = useParams<{ tipo: string }>();
  const tipo = params.tipo as AcervoTipo;

  const [searchTerm, setSearchTerm] = useState("");
  const { data: items, loading, error } = useAcervoItems({ searchTerm, tipo });

  const validTipos: AcervoTipo[] = ["imagens", "videos", "artigos"];
  const isValidTipo = validTipos.includes(tipo);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/midias/${id}`);
      alert("Item excluído com sucesso");
      // Força re-fetch alterando e restaurando searchTerm
      setSearchTerm((prev) => prev + " ");
      setTimeout(() => setSearchTerm((prev) => prev.trimEnd()), 0);
    } catch (err: any) {
      console.error("[AcervoTipoPage] Error deleting item:", err);
      alert("Erro ao excluir item. Por favor, tente novamente.");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">Erro</h2>
          <p className="text-red-400">{error}</p>
          <Link
            href="/admin/acervo"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light"
          >
            Voltar ao acervo
          </Link>
        </div>
      </div>
    );
  }

  if (!isValidTipo) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">
            Categoria não encontrada
          </h2>
          <p className="text-white/40">A categoria solicitada não é válida.</p>
          <Link
            href="/admin/acervo"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light"
          >
            Voltar ao acervo
          </Link>
        </div>
      </div>
    );
  }

  const label = labelForTipo(tipo);

  return (
    <div className="min-h-screen bg-cafta-dark">
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{label}</h1>
              <p className="mt-1 text-sm text-white/60">
                Visualize, edite e gerencie itens deste tipo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <label
              htmlFor="search"
              className="block mb-2 text-sm font-medium text-white"
            >
              Pesquisar por título
            </label>
            <input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite o título para pesquisar..."
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
          </div>
          <Link
            href={`/admin/acervo/new?tipo=${tipo}`}
            className="flex-shrink-0 px-6 py-3 bg-cafta-gold text-white font-semibold rounded-sm text-sm tracking-wide hover:bg-cafta-gold-light hover:shadow-lg hover:-translate-y-0.5 transition-colors"
          >
            Adicionar Novo Item
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">
              Nenhum item encontrado nesta categoria.
            </p>
            {searchTerm ? (
              <p className="text-white/40 text-sm mt-2">
                Nenhum item encontrado para "{searchTerm}"
              </p>
            ) : (
              <p className="text-white/40 text-sm mt-2">
                Nenhum item cadastrado ainda nesta categoria
              </p>
            )}
            <Link
              href={`/admin/acervo/new?tipo=${tipo}`}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light"
            >
              Adicionar Primeiro Item
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg bg-cafta-primary/50">
                    {(() => {
                      const extension =
                        item.filename.split(".").pop()?.toLowerCase() || "";
                      if (
                        ["jpg", "jpeg", "png", "gif", "webp"].includes(
                          extension,
                        )
                      ) {
                        return (
                          <img
                            src={item.url}
                            alt={item.titulo}
                            className="w-12 h-12 object-cover rounded"
                          />
                        );
                      }
                      if (["mp4", "webm", "ogg"].includes(extension)) {
                        return (
                          <video
                            src={item.url}
                            className="w-12 h-12 object-cover rounded"
                            muted
                            loop
                          />
                        );
                      }
                      return (
                        <div className="text-white/50">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      {item.titulo}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 mb-2 text-sm text-white/60">
                      <span>{item.dataUpload}</span>
                      {item.categoryId && (
                        <span className="bg-cafta-gold/20 text-cafta-gold border border-cafta-gold/30 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm">
                          {item.categoryId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex space-x-3">
                    <Link
                      href={`/admin/acervo/${item.id}/edit`}
                      className="flex items-center px-3 py-1.5 text-xs font-medium bg-cafta-primary/20 text-white rounded hover:bg-cafta-primary/30 transition-colors"
                    >
                      Editar
                      <svg
                        className="ml-1 w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-3-1 2-2.5z"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Excluir
                      <svg
                        className="ml-1 w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => window.open(item.url, "_blank")}
                      className="flex items-center px-3 py-1.5 text-xs font-medium bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      Visualizar
                      <svg
                        className="ml-1 h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
