"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PesquisaForm from "@/components/PesquisaForm";
import { PESQUISAS_SAMPLE } from "@/lib/constants";
import type { Pesquisa } from "@/types";
import Link from "next/link";

export default function EditPesquisaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pesquisa from mock data (in real app, this would be an API call)
    const fetchPesquisa = () => {
      setLoading(true);
      const foundPesquisa = PESQUISAS_SAMPLE.find((p) => p.id === id);
      if (foundPesquisa) {
        setPesquisa(foundPesquisa);
      } else {
        // Pesquisa not found, set null to show "not found" message
        setPesquisa(null);
      }
      setLoading(false);
    };

    fetchPesquisa();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!pesquisa) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Pesquisa não encontrada</div>
      </div>
    );
  }

  const handleSubmitSuccess = (updatedPesquisa: any) => {
    // In a real app, you would update the item via API
    // For now, we'll just update the mock data (not persistent)
    console.log("Pesquisa atualizada com sucesso:", updatedPesquisa);
    alert("Pesquisa atualizada com sucesso!");
    router.push("/admin/pesquisas");
  };

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Editar Pesquisa</h1>
              <p className="mt-1 text-sm text-white/60">
                Atualize os detalhes de "{pesquisa?.title ?? ""}"
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/pesquisas"
                className="text-sm font-medium text-white hover:text-cafta-gold"
              >
                Voltar às pesquisas
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-white hover:text-cafta-gold"
              >
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Editar Pesquisa</h1>
          <p className="mt-2 text-sm text-white/60">
            Atualize os detalhes de "{pesquisa.title}"
          </p>
        </div>
        <PesquisaForm
          initialData={pesquisa}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>
    </div>
  );
}
