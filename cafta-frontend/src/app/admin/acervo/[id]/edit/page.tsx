"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AcervoForm from "../../../../../components/AcervoForm";
import api from "@/lib/api";
import type { AcervoItem } from "../../../../../types";
import Link from "next/link";

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
        // Fetch item from backend API
        const response = await api.get(`/api/midias/${id}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const midia = await response.json();

        // Get R2 public URL from environment variables
        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

        // Transform Midia response to AcervoItem format for the form
        // Map all available fields from Midia model
        const acervoItem: AcervoItem = {
          id: midia.id,
          title: midia.titulo,
          description: midia.description || "",
          categoryId: midia.categoryId || "",
          historicalPeriod: midia.historicalPeriod || "",
          authorship: midia.authorship || "",
          // Construct file URL from R2 public URL and pathRelativo
          fileUrl: r2PublicUrl && midia.pathRelativo
            ? `${r2PublicUrl}/${midia.pathRelativo}`
            : "",
          publicationDate: midia.publicationDate
            ? new Date(midia.publicationDate).toISOString().split('T')[0]
            : (midia.criadoEm ? new Date(midia.criadoEm).toISOString().split('T')[0] : ""),
          tipo: midia.tipo
        };

        setItem(acervoItem);
      } catch (err) {
        console.error('[EditAcervoPage] Error fetching item:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar item');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id, router]);

  const handleSubmitSuccess = async (updatedItem: AcervoItem) => {
    try {
      // Map AcervoItem fields to Midia update format
      const updateData: Partial<{
        titulo: string
        description: string | null
        categoryId: string | null
        historicalPeriod: string | null
        authorship: string | null
        publicationDate: string
      }> = {};

      if (updatedItem.title !== undefined) {
        updateData.titulo = updatedItem.title;
      }

      if (updatedItem.description !== undefined) {
        updateData.description = updatedItem.description;
      }

      if (updatedItem.categoryId !== undefined) {
        updateData.categoryId = updatedItem.categoryId;
      }

      if (updatedItem.historicalPeriod !== undefined) {
        updateData.historicalPeriod = updatedItem.historicalPeriod;
      }

      if (updatedItem.authorship !== undefined) {
        updateData.authorship = updatedItem.authorship;
      }

      if (updatedItem.publicationDate !== undefined) {
        // Convert publicationDate to YYYY-MM-DD string for the backend
        updateData.publicationDate = typeof updatedItem.publicationDate === 'string'
          ? updatedItem.publicationDate
          : updatedItem.publicationDate.toISOString().split('T')[0];
      }

      // Only make the API call if there's something to update
      if (Object.keys(updateData).length > 0) {
        const response = await api.patch(`/api/midias/${id}`, {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      // Redirect to acervo list on success
      router.push("/admin/acervo");
    } catch (err) {
      console.error('[EditAcervoPage] Error updating item:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar item');
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

  if (!item) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Item não encontrado</div>
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
              <h1 className="text-2xl font-bold text-white">Editar Item do Acervo</h1>
              <p className="mt-1 text-sm text-white/60">
                Atualize os detalhes de "{item?.title ?? ''}"
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Editar Item do Acervo</h1>
          <p className="mt-2 text-sm text-white/60">
            Atualize os detalhes de "{item.title}"
          </p>
        </div>
        <AcervoForm initialData={item} onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
}