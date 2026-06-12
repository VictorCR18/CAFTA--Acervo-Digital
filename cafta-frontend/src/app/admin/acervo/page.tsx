"use client";

import { useState } from "react";
import Link from "next/link";
import { mockAcervoData } from "@/lib/mockAcervoData";
import type { AcervoItem } from "@/types";

export default function AcervoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<AcervoItem[]>(mockAcervoData);

  // Filter items based on search term
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: string) => {
    // In a real app, you would call an API to delete the item
    // For now, we'll just filter it out from the state
    setItems((prev) => prev.filter((item) => item.id !== id));
    alert("Item excluído com sucesso");
  };

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Gerenciamento do Acervo</h1>
              <p className="mt-1 text-sm text-white/60">
                Visualize, edite e gerencie itens do acervo histórico
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
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
            href="/admin/acervo/new"
            className="flex-shrink-0 px-6 py-3 bg-cafta-gold text-white font-semibold rounded-sm text-sm tracking-wide hover:bg-cafta-gold-light hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cafta-gold focus:ring-offset-2 focus:ring-offset-cafta-dark transition-colors"
          >
            Adicionar Novo Item
          </Link>
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">
              Nenhum item encontrado correspondente à sua pesquisa.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white/5 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-cafta-primary/20">
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Período Histórico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Autoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Data de Publicação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/50 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 text-white text-sm">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-white/80 text-sm max-w-[200px] truncate">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-white/80 text-sm capitalize">
                      {item.categoryId}
                    </td>
                    <td className="px-6 py-4 text-white/80 text-sm">
                      {item.historicalPeriod}
                    </td>
                    <td className="px-6 py-4 text-white/80 text-sm">
                      {item.authorship}
                    </td>
                    <td className="px-6 py-4 text-white/80 text-sm">
                      {new Date(item.publicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
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
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


