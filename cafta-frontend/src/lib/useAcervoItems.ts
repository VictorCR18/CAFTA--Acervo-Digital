"use client";

import { useEffect, useState } from "react";
import { AcervoTipo, ArquivoAcervo } from "./../types/index";
import api from "../lib/api";

export function useAcervoItems(p0: { searchTerm: string; tipo?: AcervoTipo }) {
  const [data, setData] = useState<ArquivoAcervo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAcervoItems() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("status", "ativo");
        if (p0.searchTerm?.trim())
          params.append("search", p0.searchTerm.trim());
        if (p0.tipo) params.append("tipo", p0.tipo);

        const { data: result } = await api.get(
          `/api/midias?${params.toString()}`,
        );
        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

        const transformedData: ArquivoAcervo[] = result.data.map(
          (midia: any) => ({
            id: midia.id,
            titulo: midia.titulo,
            tipo: midia.tipo as ArquivoAcervo["tipo"],
            filename: midia.filename,
            url:
              r2PublicUrl && midia.pathRelativo
                ? `${r2PublicUrl}/${midia.pathRelativo}`
                : "",
            thumbnailUrl: midia.thumbnailPath,
            dataUpload: midia.criadoEm
              ? new Date(midia.criadoEm).toLocaleDateString("pt-BR")
              : "",
            tamanho: midia.tamanhoBytes
              ? Number(midia.tamanhoBytes)
              : undefined,
            description: midia.description || "",
            categoryId: midia.categoryId || "",
            historicalPeriod: midia.historicalPeriod || "",
            authorship: midia.authorship || "",
            publicationDate: midia.publicationDate
              ? new Date(midia.publicationDate).toLocaleDateString("pt-BR")
              : "",
          }),
        );

        setData(transformedData);
      } catch (err: any) {
        console.error("[useAcervoItems] Error fetching acervo items:", err);
        setError(
          err.response?.data?.error || "Erro ao carregar itens do acervo",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchAcervoItems();
  }, [p0.searchTerm, p0.tipo]);

  return { data, loading, error };
}
