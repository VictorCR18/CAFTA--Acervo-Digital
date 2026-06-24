"use client";

import { useState } from "react";
import Link from "next/link";
import { usePesquisas } from "@/lib/usePesquisas";
import type { Pesquisa } from "@/types";
import { useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminPageHeader from "@/components/layout/AdminPageHeader";

export default function PesquisasPage() {
  const { data: pesquisas, loading, error, deletePesquisa } = usePesquisas();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  // Filter pesquisas based on search term
  const filteredPesquisas = (pesquisas || []).filter(
    (pesquisa): pesquisa is Pesquisa =>
      pesquisa !== null &&
      pesquisa !== undefined &&
      typeof pesquisa.title === "string" &&
      pesquisa.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta pesquisa?")) {
      try {
        await deletePesquisa(id);
        alert("Pesquisa excluída com sucesso!");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Falha ao excluir pesquisa. Por favor, tente novamente.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Erro ao carregar pesquisas</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <AdminPageHeader
          title="Gerenciar Pesquisas"
          description="Visualize, edite e gerencie as pesquisas acadêmicas"
          showBackButton={pathname !== "/admin"}
        />
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
            href="/admin/pesquisas/new"
            className="flex-shrink-0 px-6 py-3 bg-cafta-gold text-white font-semibold rounded-sm text-sm tracking-wide hover:bg-cafta-gold-light hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cafta-gold focus:ring-offset-2 focus:ring-offset-cafta-dark transition-colors"
          >
            Nova Pesquisa
          </Link>
        </div>

        {filteredPesquisas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">Nenhuma pesquisa encontrada</p>
            {searchTerm ? (
              <p className="text-white/40 text-sm mt-2">
                Nenhuma pesquisa encontrada para "{searchTerm}"
              </p>
            ) : (
              <p className="text-white/40 text-sm mt-2">
                Nenhuma pesquisa cadastrada ainda
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPesquisas.map((pesquisa) => (
              <div
                key={pesquisa.id}
                className="bg-white/5 rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-2">
                      {pesquisa.title}
                    </h3>
                    <p className="text-white/80 text-sm mb-2">
                      {pesquisa.autores.join(", ")}
                    </p>
                    <div className="flex items-center gap-4 mb-2 text-sm text-white/60">
                      <span>{pesquisa.ano}</span>
                      {pesquisa.destaque && (
                        <span className="bg-cafta-gold/20 text-cafta-gold border border-cafta-gold/30 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm">
                          Destaque
                        </span>
                      )}
                      {pesquisa.link && (
                        <span className="ml-3">
                          <Link
                            href={pesquisa.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cafta-gold hover:text-white underline"
                          >
                            Link
                          </Link>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 flex space-x-3">
                    <Link
                      href={`/admin/pesquisas/${pesquisa.id}/edit`}
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
                      onClick={() => handleDelete(pesquisa.id)}
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
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
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
