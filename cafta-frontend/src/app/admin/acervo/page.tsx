"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { usePathname } from "next/navigation";
import AdminPageHeader from "@/components/layout/AdminPageHeader";

export default function AcervoPage() {
  const pathname = usePathname();
  const [tipoCounts, setTipoCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTipoCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const tipos: ("imagens" | "videos" | "artigos")[] = [
        "imagens",
        "videos",
        "artigos",
      ];
      // Busca a contagem de itens ativos de cada tipo
      const countsPromises = tipos.map(async (tipo) => {
        const { data } = await api.get(`/api/midias?tipo=${tipo}&status=ativo`);
        return [tipo, data.total || 0];
      });
      
      const results = await Promise.all(countsPromises);
      setTipoCounts(Object.fromEntries(results));
    } catch (err: any) {
      console.error("[AcervoPage] Error fetching tipo counts:", err);
      setError(
        err.response?.data?.error || "Erro ao carregar contagem por tipo",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTipoCounts();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">Erro</h2>
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => fetchTipoCounts()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <AdminPageHeader
          title="Acervo Digital"
          description="Selecione uma categoria abaixo para visualizar, buscar ou adicionar novos itens."
          showBackButton={pathname !== "/admin"}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                tipo: "imagens",
                label: "Fotos",
                color: "text-blue-500 group-hover:text-blue-600",
                icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 002-2v12a2 2 0 002 2z",
              },
              {
                tipo: "videos",
                label: "Vídeos",
                color: "text-purple-500 group-hover:text-purple-600",
                icon: "M10 7l8 4-8 4V7zM3 3v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 002-2H5a2 2 0 002-2V3z",
              },
              {
                tipo: "artigos",
                label: "Artigos",
                color: "text-green-500 group-hover:text-green-600",
                icon: "M12 4v16m8-8H4",
              },
            ].map(({ tipo, label, color, icon }) => (
              <Link
                key={tipo}
                // O Link agora leva diretamente para a página específica da categoria
                href={`/admin/acervo/tipo/${tipo}`}
                className="group block cursor-pointer"
              >
                <div className="relative h-64 w-full rounded-lg overflow-hidden bg-cafta-primary/20 hover:bg-cafta-primary/30 transition-all hover:scale-[1.02] border border-transparent hover:border-white/10">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center flex flex-col items-center">
                      <div className="mb-4">
                        <svg
                          className={`h-12 w-12 ${color} transition-colors`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={icon}
                          />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-white group-hover:text-white/90 transition-colors">
                        {label}
                      </h2>
                      <span className="mt-3 px-3 py-1 bg-white/5 rounded-full text-white/60 text-sm">
                        {tipoCounts[tipo] || 0} item
                        {tipoCounts[tipo] !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Caso não exista nenhum item no banco de dados ainda */}
          {!Object.values(tipoCounts).some((count) => count > 0) && (
            <div className="text-center py-12 mt-8 bg-cafta-primary/10 rounded-lg border border-white/5">
              <p className="text-white/50 mb-4">
                O acervo ainda está vazio. Escolha uma categoria acima ou comece por aqui:
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/admin/acervo/new?tipo=imagens"
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light transition-colors shadow-lg"
                >
                  Adicionar Primeira Foto
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}