"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AcervoForm from "../../../../../components/AcervoForm";
import api from "@/lib/api";
import type { AcervoItem } from "../../../../../types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EditAcervoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<AcervoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/midias/${id}`);

        // CORREÇÃO AQUI: Garante que estamos pegando o objeto certo dependendo da formatação da sua API
        const midia = response.data.data || response.data;

        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

        const acervoItem: AcervoItem = {
          id: midia.id,
          title: midia.titulo || midia.title, // Tratamento preventivo caso venha como title
          description: midia.description || "",
          categoryId: midia.categoryId || "",
          historicalPeriod: midia.historicalPeriod || "",
          authorship: midia.authorship || "",
          fileUrl:
            r2PublicUrl && midia.pathRelativo
              ? `${r2PublicUrl}/${midia.pathRelativo}`
              : "",
          publicationDate: midia.publicationDate
            ? new Date(midia.publicationDate).toISOString().split("T")[0]
            : midia.criadoEm
              ? new Date(midia.criadoEm).toISOString().split("T")[0]
              : "",
          tipo: midia.tipo,
        };

        setItem(acervoItem);
      } catch (err: any) {
        console.error("[EditAcervoPage] Error fetching item:", err);
        setError(err.response?.data?.error || "Erro ao carregar item");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleSubmitSuccess = (updatedItem: AcervoItem) => {
    // The form now handles submission internally, so we just redirect
    router.push("/admin/acervo");
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Item não encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafta-dark">
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Editar Item do Acervo
              </h1>
              <p className="mt-1 text-sm text-white/60">
                Atualize os detalhes de "{item.title}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <AcervoForm initialData={item} onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
}
