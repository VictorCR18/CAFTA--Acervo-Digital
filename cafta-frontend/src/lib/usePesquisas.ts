"use client";

import { useEffect, useState } from "react";
import { Pesquisa } from "@/types/index";
import api from "@/lib/api";

export function usePesquisas() {
  const [data, setData] = useState<Pesquisa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPesquisas() {
      setLoading(true);
      setError(null);
      try {
        const { data: result } = await api.get("/api/pesquisas");
        const transformedData: Pesquisa[] = result.data.map(
          (pesquisa: any) => ({
            title: pesquisa.titulo,
            id: pesquisa.id,
            titulo: pesquisa.titulo,
            autores: pesquisa.autores,
            ano: pesquisa.ano,
            link: pesquisa.link,
            destaque: pesquisa.destaque,
          }),
        );
        setData(transformedData);
      } catch (err: any) {
        console.error("[usePesquisas] Error fetching pesquisas:", err);
        setError(err.response?.data?.error || "Erro ao carregar pesquisas");
      } finally {
        setLoading(false);
      }
    }
    fetchPesquisas();
  }, []);

  const createPesquisa = async (novaPesquisa: Omit<Pesquisa, "id">) => {
    setLoading(true);
    try {
      const { data: result } = await api.post("/api/pesquisas", {
        titulo: novaPesquisa.titulo,
        autores: novaPesquisa.autores,
        ano: novaPesquisa.ano,
        link: novaPesquisa.link,
        destaque: novaPesquisa.destaque,
      });
      const pesquisaComId: Pesquisa = {
        title: result.data.titulo,
        id: result.data.id,
        titulo: result.data.titulo,
        autores: result.data.autores,
        ano: result.data.ano,
        link: result.data.link,
        destaque: result.data.destaque,
      };
      setData((prev) => [...prev, pesquisaComId]);
      return pesquisaComId;
    } finally {
      setLoading(false);
    }
  };

  const updatePesquisa = async (
    id: string,
    dadosAtualizacao: Partial<Pesquisa>,
  ) => {
    setLoading(true);
    try {
      const { data: result } = await api.patch(
        `/api/pesquisas/${id}`,
        dadosAtualizacao,
      );
      const pesquisaAtualizada: Pesquisa = {
        title: result.data.titulo,
        id: result.data.id,
        titulo: result.data.titulo,
        autores: result.data.autores,
        ano: result.data.ano,
        link: result.data.link,
        destaque: result.data.destaque,
      };
      setData((prev) =>
        prev.map((p) => (p.id === id ? pesquisaAtualizada : p)),
      );
      return pesquisaAtualizada;
    } finally {
      setLoading(false);
    }
  };

  const deletePesquisa = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      await api.delete(`/api/pesquisas/${id}`);
      setData((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: any) {
      console.error("[usePesquisas] Error deleting pesquisa:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    createPesquisa,
    updatePesquisa,
    deletePesquisa,
  };
}
