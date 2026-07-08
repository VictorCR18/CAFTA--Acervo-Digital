"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePendingFiles } from "@/lib/usePendingFiles";
import { useAcervoItems } from "@/lib/useAcervoItems";
import { usePesquisas } from "@/lib/usePesquisas";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboard() {
  const {
    pendingFiles,
    loading: pendingLoading,
    error: pendingError,
  } = usePendingFiles();
  const {
    data: acervoItems,
    loading: acervoLoading,
    error: acervoError,
  } = useAcervoItems({ searchTerm: "" });
  const {
    data: pesquisas,
    loading: pesquisasLoading,
    error: pesquisasError,
  } = usePesquisas();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isLoading = pendingLoading || acervoLoading || pesquisasLoading;
    const combinedError = pendingError || acervoError || pesquisasError;
    setLoading(isLoading);
    setError(combinedError);
  }, [
    pendingLoading,
    acervoLoading,
    pesquisasLoading,
    pendingError,
    acervoError,
    pesquisasError,
  ]);

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
            href="/admin/login"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light"
          >
            Tentar novamente
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafta-dark">
        <div className="bg-cafta-primary/50 border-b border-white/10">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <h1 className="text-2xl font-bold text-white">
              Painel Administrativo
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Visão geral das ferramentas administrativas
            </p>
          </div>

        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/admin/moderacao"
              className="group relative overflow-hidden bg-cafta-dark/50 border border-white/10 rounded-lg hover:bg-cafta-dark/70 transition-colors cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <svg className="h-8 w-8 text-cafta-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafta-gold/20 text-cafta-gold">
                    {pendingFiles.length}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Aprovação de Mídia</h2>
                <p className="text-white/60 text-sm mb-4">
                  Revise e aprove ou rejeite as submissões de mídia pendentes
                </p>
                <div className="mt-6 flex items-center space-x-3 text-sm text-white/60">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Ver pendências</span>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/acervo"
              className="group relative overflow-hidden bg-cafta-dark/50 border border-white/10 rounded-lg hover:bg-cafta-dark/70 transition-colors cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <svg className="h-8 w-8 text-cafta-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 20h10a2 2 0 002-2V8a2 2 0 00-2-2h-4l-3-3H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafta-gold/20 text-cafta-gold">
                    {acervoItems.length}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Gerenciamento do Acervo</h2>
                <p className="text-white/60 text-sm mb-4">
                  Visualize, edite e gerencie itens do acervo histórico
                </p>
                <div className="mt-6 flex items-center space-x-3 text-sm text-white/60">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Acessar acervo</span>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/pesquisas"
              className="group relative overflow-hidden bg-cafta-dark/50 border border-white/10 rounded-lg hover:bg-cafta-dark/70 transition-colors cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <svg className="h-8 w-8 text-cafta-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cafta-gold/20 text-cafta-gold">
                    {pesquisas.length}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Gerenciamento de Pesquisas</h2>
                <p className="text-white/60 text-sm mb-4">
                  Visualize, edite e gerencie as publicações acadêmicas
                </p>
                <div className="mt-6 flex items-center space-x-3 text-sm text-white/60">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Ver pesquisas</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}