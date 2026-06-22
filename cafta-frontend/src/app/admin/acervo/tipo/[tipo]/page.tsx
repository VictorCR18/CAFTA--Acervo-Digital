"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAcervoItems } from "@/lib/useAcervoItems";
import { labelForTipo, actionLabelForTipo } from "@/lib/utils";
import type { AcervoTipo, ArquivoAcervo } from "@/types";
import { api } from "@/lib/api";

export default function AcervoTipoPage() {
  const params = useParams<{ tipo: string }>();
  const tipo = params.tipo as AcervoTipo;
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const { data: items, loading, error } = useAcervoItems({
    searchTerm,
    tipo: tipo
  });

  // Validate tipo
  const validTipos: AcervoTipo[] = ["imagens", "videos", "artigos"];
  const isValidTipo = validTipos.includes(tipo);

  const handleDelete = async (id: string) => {
    try {
      // Call backend API to delete the item
      const response = await api.delete(`/api/midias/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Show success message
      alert("Item excluído com sucesso");

      // Refetch by triggering useAcervoItems to re-fetch
      // This happens automatically when searchTerm or tipo changes,
      // but we can also manually trigger by updating searchTerm temporarily
      setSearchTerm("");
      setSearchTerm(" "); // Trigger re-fetch
      setSearchTerm("");
    } catch (err) {
      console.error('[AcervoTipoPage] Error deleting item:', err);
      alert('Erro ao excluir item. Por favor, tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="ml-2 text-white">Carregando...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">Erro</h2>
          <p className="text-red-400">{error}</p>
          <Link href="/admin/acervo" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus-ring-white focus:ring-offset-2 focus-ring-offset-cafta-dark">
            Voltar ao acervo
          </Link>
        </div>
      </div>
    )
  }

  if (!isValidTipo) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">Categoria não encontrada</h2>
          <p className="text-white/40">A categoria solicitada não é válida.</p>
          <Link href="/admin/acervo" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus-ring-white focus:ring-offset-2 focus-ring-offset-cafta-dark">
            Voltar ao acervo
          </Link>
        </div>
      </div>
    )
  }

  const label = labelForTipo(tipo);
  const actionLabel = actionLabelForTipo(tipo);

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{label}</h1>
              <p className="mt-1 text-sm text-white/60">
                Visualize, edite e gerencie itens deste tipo
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/acervo" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao acervo
              </Link>
              <Link href="/" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {/* Search and controls */}
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
            className="flex-shrink-0 px-6 py-3 bg-cafta-gold text-white font-semibold rounded-sm text-sm tracking-wide hover:bg-cafta-gold-light hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cafta-gold focus:ring-offset-2 focus:ring-offset-cafta-dark transition-colors"
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
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus-ring-white focus:ring-offset-2 focus-ring-offset-cafta-dark"
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
                  {/* Media preview */}
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg bg-cafta-primary/50">
                    {(() => {
                      // Determine preview based on file type
                      const extension = item.filename.split('.').pop()?.toLowerCase() || ''

                      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                        return (
                          <img
                            src={item.url}
                            alt={item.titulo}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )
                      }

                      if (['mp4', 'webm', 'ogg'].includes(extension)) {
                        return (
                          <video
                            src={item.url}
                            className="w-12 h-12 object-cover rounded"
                            muted
                            loop
                          />
                        )
                      }

                      // Default icon for documents and other files
                      return (
                        <div className="text-white/50 text-2xl">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9 12h6m2 0a2 2 0 110-4m0 4a2 2 0 100-4m-6 8a2 2 0 110-4m0 4a2 2 0 100-4m-6 0a2 2 0 110-4m0 4a2 2 0 110-4m0 4a2 2 0 100-4"/>
                          </svg>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      {item.titulo}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4 mb-2 text-sm text-white/60">
                      <span>
                        {item.dataUpload}
                      </span>
                      {item.categoryId && (
                        <span className="bg-cafta-gold/20 text-cafta-gold border border-cafta-gold/30 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm">
                          {item.categoryId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex space-x-3">
                    <Link
                      href={`/admin/acervo/${item.id}/edit`}
                      className="flex items-center px-3 py-1.5 text-xs font-medium bg-cafta-primary/20 text-white rounded hover:bg-cafta-primary/30 hover:text-white transition-colors"
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
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-3-1 2-2.5z"
                        ></path>
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 hover:text-red-500 transition-colors"
                    >
                      Excluir
                      <svg
                        className="ml-1 w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => window.open(item.url, '_blank')}
                      className="flex items-center px-3 py-1.5 text-xs font-medium bg-blue-500 hover:bg-blue-600 transition-colors"
                    >
                      Visualizar
                      <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M1 12s4-8 11-8 11 8-4 8-11-8-11-8z"/>
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