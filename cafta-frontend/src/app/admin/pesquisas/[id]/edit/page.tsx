"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PesquisaForm from "@/components/PesquisaForm";
import api from "@/lib/api";
import type { Pesquisa } from "@/types";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import FeedbackPopup from "@/components/ui/FeedbackPopup";

export default function EditPesquisaPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pesquisa, setPesquisa] = useState<Pesquisa | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ show: true, message, type });
  };

  useEffect(() => {
    const fetchPesquisa = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const response = await api.get(`/api/pesquisas/${id}`);

        const pesquisaData = response.data.data || response.data;

        const frontendPesquisa: Pesquisa = {
          id: pesquisaData.id,
          title: pesquisaData.titulo || pesquisaData.title || "",
          titulo: pesquisaData.titulo || pesquisaData.title || "",
          autores: pesquisaData.autores || [],
          ano: pesquisaData.ano || "",
          link: pesquisaData.link || "",
          destaque: pesquisaData.destaque || false,
        };

        setPesquisa(frontendPesquisa);
      } catch (err: any) {
        console.error("[EditPesquisaPage] Error fetching pesquisa:", err);
        setFetchError(err.response?.data?.error || "Erro ao carregar pesquisa");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPesquisa();
  }, [id]);

  const handleSubmitSuccess = async (updatedPesquisa: Pesquisa) => {
    try {
      const updateData: Record<string, any> = {};

      if (updatedPesquisa.titulo !== undefined)
        updateData.titulo = updatedPesquisa.titulo;
      if (updatedPesquisa.autores !== undefined)
        updateData.autores = updatedPesquisa.autores;
      if (updatedPesquisa.ano !== undefined)
        updateData.ano = updatedPesquisa.ano;
      if (updatedPesquisa.destaque !== undefined)
        updateData.destaque = updatedPesquisa.destaque;

      if (updatedPesquisa.link && updatedPesquisa.link.trim() !== "") {
        updateData.link = updatedPesquisa.link.trim();
      }

      await api.patch(`/api/pesquisas/${id}`, updateData);

      showPopup("Pesquisa atualizada com sucesso!", "success");

      setTimeout(() => {
        router.push("/admin/pesquisas");
      }, 2000);
    } catch (err: any) {
      console.error("[EditPesquisaPage] Error updating pesquisa:", err);
      showPopup(
        err.response?.data?.error || "Erro ao atualizar pesquisa",
        "error",
      );
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-red-400">{fetchError}</div>
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
    <div className="min-h-screen bg-cafta-dark relative">
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <PesquisaForm
          initialData={pesquisa}
          onSubmitSuccess={handleSubmitSuccess}
        />
      </div>

      {popup.show && (
        <FeedbackPopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
