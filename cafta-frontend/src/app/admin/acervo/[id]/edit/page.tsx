"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AcervoForm from "@/components/AcervoForm";
import api from "@/lib/api";
import type { AcervoItem } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

export default function EditAcervoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<AcervoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/midias/${id}`);
        const midia = response.data.data || response.data;
        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

        const acervoItem: AcervoItem = {
          id: midia.id,
          title: midia.titulo,
          description: midia.description || "",
          categoryId: midia.categoryId || "",
          historicalPeriod: midia.historicalPeriod || "",
          authorship: midia.authorship || "",
          fileUrl: r2PublicUrl && midia.pathRelativo ? `${r2PublicUrl}/${midia.pathRelativo}` : "",
          publicationDate: midia.publicationDate ? new Date(midia.publicationDate).toISOString().split("T")[0] : "",
          tipo: midia.tipo,
        };

        setItem(acervoItem);
      } catch (err: any) {
        setError("Erro ao carregar item");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchItem();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/api/midias/${id}`);
      router.push("/admin/acervo");
    } catch (err: any) {
      alert("Erro ao excluir item.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error || !item) return <div className="text-white text-center py-20">{error || "Item não encontrado"}</div>;

  return (
    <div className="min-h-screen bg-cafta-dark">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Editar: {item.title}</h1>
        
        <AcervoForm 
          initialData={item} 
          onSubmitSuccess={() => router.push("/admin/acervo")} 
        />

        <div className="mt-8 pt-6 border-t border-white/10">
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Excluir este item permanentemente
          </button>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Excluir item"
        description="Tem certeza que deseja excluir esta mídia? Esta ação é irreversível."
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}