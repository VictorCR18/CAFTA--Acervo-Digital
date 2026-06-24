"use client";

import { useState } from "react";
import Link from "next/link";
import { usePesquisas } from "@/lib/usePesquisas";
import type { Pesquisa } from "@/types";
import { usePathname } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import FeedbackPopup from "@/components/ui/FeedbackPopup";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal"; // <-- Novo Import

export default function PesquisasPage() {
  const { data: pesquisas, loading, error, deletePesquisa } = usePesquisas();
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  // Estados de feedback e controle
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtragem
  const filteredPesquisas = (pesquisas || []).filter(
    (pesquisa): pesquisa is Pesquisa =>
      pesquisa !== null &&
      pesquisa !== undefined &&
      typeof pesquisa.title === "string" &&
      pesquisa.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ show: true, message, type });
  };

  const executeDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deletePesquisa(itemToDelete);
      showPopup("Pesquisa excluída com sucesso!", "success");
    } catch (err) {
      console.error("Delete error:", err);
      showPopup(
        "Falha ao excluir pesquisa. Por favor, tente novamente.",
        "error",
      );
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <div className="text-white">Erro ao carregar pesquisas</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cafta-dark relative">
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <AdminPageHeader
          title="Gerenciar Pesquisas"
          description="Visualize, edite e gerencie as pesquisas acadêmicas"
          showBackButton={pathname !== "/admin"}
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-wrap items-end gap-4 mb-6">
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
            className="flex-shrink-0 px-6 py-2 bg-cafta-gold text-white font-semibold rounded-sm text-sm tracking-wide hover:bg-cafta-gold-light hover:shadow-lg hover:-translate-y-0.5 transition-colors"
          >
            Nova Pesquisa
          </Link>
        </div>

        {filteredPesquisas.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/50">Nenhuma pesquisa encontrada</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPesquisas.map((pesquisa) => (
              <div
                key={pesquisa.id}
                className="bg-white/5 rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start space-x-4">
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
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex space-x-3">
                    <Link
                      href={`/admin/pesquisas/${pesquisa.id}/edit`}
                      className="flex items-center px-3 py-1.5 text-xs font-medium bg-cafta-primary/20 text-white rounded hover:bg-cafta-primary/30 transition-colors"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => setItemToDelete(pesquisa.id)}
                      className="flex items-center px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Uso do Componente de Modal Componentizado */}
      <ConfirmDeleteModal
        isOpen={!!itemToDelete}
        title="Excluir Pesquisa?"
        description="Essa ação não pode ser desfeita. A pesquisa será removida permanentemente do sistema."
        isDeleting={isDeleting}
        onClose={() => setItemToDelete(null)}
        onConfirm={executeDelete}
      />

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
