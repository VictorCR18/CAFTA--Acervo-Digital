"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIAS_ACERVO } from "@/lib/constants";
import type { CategoriaAcervo } from "@/types";
import { usePendingFiles } from "@/lib/usePendingFiles";
import api from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import AdminPageHeader from "@/components/layout/AdminPageHeader";
import FeedbackPopup from "@/components/ui/FeedbackPopup";

interface PendingFile {
  id: string;
  titulo: string;
  tipo: string;
  filename: string;
  url: string;
  dataUpload: string;
}

const tipoLabels: Record<string, string> = {
  imagens: "Imagem",
  videos: "Vídeo",
  artigos: "Documento",
};

const tipoColors: Record<string, string> = {
  imagens: "bg-blue-500",
  videos: "bg-purple-500",
  artigos: "bg-green-500",
};

export default function ModeracaoPage() {
  const pathname = usePathname();

  const { pendingFiles, loading, error } = usePendingFiles();
  const [pendingFilesState, setPendingFilesState] = useState<PendingFile[]>([]);
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  // <-- Estado para controlar o Popup
  const [popup, setPopup] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    setPendingFilesState(pendingFiles);
    setLoadingState(loading);
    setErrorState(error);
  }, [pendingFiles, loading, error]);

  const showPopup = (message: string, type: "success" | "error") => {
    setPopup({ show: true, message, type });
  };

  async function handleView(url: string) {
    if (url) {
      window.open(url, "_blank");
    } else {
      showPopup("URL não disponível para este arquivo", "error");
    }
  }

  async function handleApprove(id: string) {
    try {
      setLoadingState(true);
      await api.patch(`/api/midias/${id}/status`, { status: "ativo" });
      setPendingFilesState((prev) => prev.filter((file) => file.id !== id));
      showPopup("Arquivo aprovado com sucesso!", "success"); // <-- Substituindo alert
    } catch (err: any) {
      console.error("[ModeracaoPage] Error approving file:", err);
      showPopup(
        err.response?.data?.error || "Erro ao aprovar arquivo",
        "error",
      ); // <-- Substituindo alert
    } finally {
      setLoadingState(false);
    }
  }

  async function handleReject(id: string) {
    try {
      setLoadingState(true);
      await api.patch(`/api/midias/${id}/status`, { status: "inativo" });
      setPendingFilesState((prev) => prev.filter((file) => file.id !== id));
      showPopup("Arquivo rejeitado com sucesso!", "success"); // <-- Substituindo alert
    } catch (err: any) {
      console.error("[ModeracaoPage] Error rejecting file:", err);
      showPopup(
        err.response?.data?.error || "Erro ao rejeitar arquivo",
        "error",
      ); // <-- Substituindo alert
    } finally {
      setLoadingState(false);
    }
  }

  if (loadingState) {
    return <LoadingSpinner fullScreen />;
  }

  if (errorState) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">Erro</h2>
          <p className="text-red-400">{errorState}</p>
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
    <div className="min-h-screen bg-cafta-dark relative">
      <AdminPageHeader
        title="Aprovação de Mídia"
        description="Revise e aprove ou rejeite submissões de mídia"
        showBackButton={pathname !== "/admin"}
      >
        <div className="flex items-center space-x-4">
          <span className="text-white/60 text-sm">
            {pendingFilesState.length}{" "}
            {pendingFilesState.length === 1
              ? "arquivo pendente"
              : "arquivos pendentes"}
          </span>
        </div>
      </AdminPageHeader>

      <div className="container mx-auto px-4 md:px-6 py-8">
        {pendingFilesState.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 text-xl mb-4">
              Nenhum arquivo pendente
            </p>
            <p className="text-white/40 text-sm">
              Todas as submissões foram processadas. Novas submissões aparecerão
              aqui quando forem enviadas.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-6">
              {[...new Set(pendingFilesState.map((file) => file.tipo))].map(
                (tipo) => {
                  const filesOfTipo = pendingFilesState.filter(
                    (file) => file.tipo === tipo,
                  );
                  const categoria = CATEGORIAS_ACERVO.find(
                    (cat) => cat.slug === tipo,
                  ) as CategoriaAcervo | undefined;

                  return (
                    <div key={tipo} className="space-y-4">
                      <div className="flex items-center justify-between space-x-4">
                        <h2 className="text-xl font-semibold text-white">
                          {categoria?.titulo || tipoLabels[tipo] || tipo}
                        </h2>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${tipoColors[tipo] || "bg-gray-500"}`}
                        >
                          {filesOfTipo.length}
                        </span>
                      </div>

                      <div className="divide-y divide-white/10">
                        {filesOfTipo.map((file) => (
                          <div
                            key={file.id}
                            className="py-4 flex items-start space-x-4"
                          >
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg bg-cafta-primary/50">
                              {(() => {
                                const extension =
                                  file.filename
                                    .split(".")
                                    .pop()
                                    ?.toLowerCase() || "";
                                if (
                                  [
                                    "jpg",
                                    "jpeg",
                                    "png",
                                    "gif",
                                    "webp",
                                  ].includes(extension)
                                ) {
                                  return (
                                    <img
                                      src={file.url}
                                      alt={file.titulo}
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  );
                                }
                                if (
                                  ["mp4", "webm", "ogg"].includes(extension)
                                ) {
                                  return (
                                    <video
                                      src={file.url}
                                      className="w-12 h-12 object-cover rounded"
                                      muted
                                      loop
                                    />
                                  );
                                }
                                return (
                                  <div className="text-white/50">
                                    <svg
                                      className="w-6 h-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                      />
                                    </svg>
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h3 className="text-white font-semibold truncate max-w-[200px]">
                                  {file.titulo}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 text-xs font-medium rounded-full ${tipoColors[tipo] || "bg-gray-500/50"}`}
                                >
                                  {tipoLabels[tipo] || tipo}
                                </span>
                              </div>

                              <p className="text-white/40 text-sm">
                                {file.dataUpload}
                              </p>

                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => handleView(file.url)}
                                  className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                                >
                                  Visualizar
                                  <svg
                                    className="ml-1 h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => handleApprove(file.id)}
                                  className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-cafta-gold hover:bg-cafta-gold-light transition-colors"
                                >
                                  Aprovar
                                  <svg
                                    className="ml-1 h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </button>

                                <button
                                  onClick={() => handleReject(file.id)}
                                  className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
                                >
                                  Rejeitar
                                  <svg
                                    className="ml-1 h-3 w-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        )}
      </div>

      {/* Renderização do Popup */}
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
