"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAcervoItems } from "@/lib/useAcervoItems";
import { labelForTipo } from "@/lib/utils";
import type { AcervoTipo } from "@/types";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import { ItemActions } from "@/components/ui/ItemActions";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { CATEGORIAS_ACERVO, CATEGORY_COLORS } from "@/lib/constants";

export default function AcervoTipoPage() {
  const params = useParams<{ tipo: string }>();
  const router = useRouter();
  const tipo = params.tipo as AcervoTipo;

  // Estados para o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    titulo: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const { data: items, loading, error } = useAcervoItems({ searchTerm, tipo });

  const validTipos: AcervoTipo[] = ["imagens", "videos", "artigos"];
  const isValidTipo = validTipos.includes(tipo);

  // Inicia o processo de exclusão abrindo o modal
  const openDeleteModal = (item: any) => {
    setItemToDelete({ id: item.id, titulo: item.titulo });
    setIsDeleteModalOpen(true);
  };

  // Executa a exclusão de fato
  const executeDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/midias/${itemToDelete.id}`);
      setIsDeleteModalOpen(false);
      window.location.reload(); // Recarrega para atualizar a lista
    } catch (err: any) {
      alert("Erro ao excluir item.");
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  if (error || !isValidTipo) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center text-white">
          Erro ao carregar ou categoria inválida.
        </div>
      </div>
    );
  }

  const label = labelForTipo(tipo);

  return (
    <div className="min-h-screen bg-cafta-dark">
      <AdminPageHeader
        title={label}
        description="Visualize, edite e gerencie itens deste tipo"
        showBackButton={true}
        backHref="/admin/acervo"
      />

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="space-y-4">
          {items.map((item) => {
            // Buscando a info da categoria para este item
            const categoriaInfo = CATEGORIAS_ACERVO.find(
              (c) => c.slug === item.categoryId,
            );

            // Determina a cor com fallback caso a categoria não seja encontrada
            const badgeColor =
              CATEGORY_COLORS[item.categoryId] ||
              "bg-cafta-primary/40 text-white/80 border-white/10";

            return (
              <div
                key={item.id}
                onClick={() => window.open(item.url, "_blank")}
                className="bg-white/5 rounded-lg border border-white/10 p-4 hover:bg-white/10 transition-all cursor-pointer flex flex-row items-center gap-4"
              >
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-cafta-primary/50 rounded overflow-hidden flex items-center justify-center relative">
                  <img
                    src={item.thumbnailPath || item.url}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate text-sm sm:text-base">
                    {item.titulo}
                  </h3>

                  {/* Container de metadados: Data + Badge da Categoria */}
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-white/60 text-xs sm:text-sm">
                      {item.dataUpload}
                    </p>

                    {categoriaInfo && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase border ${badgeColor}`}
                      >
                        {categoriaInfo.titulo}
                      </span>
                    )}
                  </div>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <ItemActions
                    onEdit={() => router.push(`/admin/acervo/${item.id}/edit`)}
                    onDelete={() => openDeleteModal(item)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir "${itemToDelete?.titulo}"? Essa ação não pode ser desfeita.`}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
      />
    </div>
  );
}
