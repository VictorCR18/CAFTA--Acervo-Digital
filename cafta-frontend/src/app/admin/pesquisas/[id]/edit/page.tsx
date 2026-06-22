"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PesquisaForm from "@/components/PesquisaForm";
import api from "@/lib/api";
import type { Pesquisa } from "@/types";
import Link from "next/link";

export default function EditPesquisaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPesquisa = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch pesquisa from backend API
        const response = await api.get(`/api/pesquisas/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pesquisaData = await response.json();

        // Map backend response to frontend Pesquisa format
        const frontendPesquisa: Pesquisa = {
          title: pesquisaData.titulo,
          id: pesquisaData.id,
          titulo: pesquisaData.titulo,
          autores: pesquisaData.autores,
          ano: pesquisaData.ano,
          link: pesquisaData.link,
          destaque: pesquisaData.destaque
        };

        setPesquisa(frontendPesquisa);
      } catch (err) {
        console.error('[EditPesquisaPage] Error fetching pesquisa:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar pesquisa');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPesquisa();
    }
  }, [id, router]);

  const handleSubmitSuccess = async (updatedPesquisa: Pesquisa) => {
    try {
      // Map frontend Pesquisa format to backend UpdatePesquisaBody format
      const updateData: Partial<{
        titulo: string
        autores: string[]
        ano: number
        link?: string
        destaque?: boolean
      }> = {};

      if (updatedPesquisa.titulo !== undefined) updateData.titulo = updatedPesquisa.titulo;
      if (updatedPesquisa.autores !== undefined) updateData.autores = updatedPesquisa.autores;
      if (updatedPesquisa.ano !== undefined) updateData.ano = updatedPesquisa.ano;
      if (updatedPesquisa.link !== undefined) updateData.link = updatedPesquisa.link;
      if (updatedPesquisa.destaque !== undefined) updateData.destaque = updatedPesquisa.destaque;

      const response = await api.patch(`/api/pesquisas/${id}`, {
        body: JSON.stringify(updateData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Redirect to pesquisas list on success
      router.push("/admin/pesquisas");
    } catch (err) {
      console.error('[EditPesquisaPage] Error updating pesquisa:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pesquisa');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-red-400">{error}</div>
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

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Editar Pesquisa</h1>
              <p className="mt-1 text-sm text-white/60">
                Atualize os detalhes de "{pesquisa.titulo}"
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
            Atualize os detalhes de "{pesquisa.titulo}"
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