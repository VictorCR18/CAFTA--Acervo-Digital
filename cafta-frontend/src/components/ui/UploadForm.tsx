"use client";

import { useState, useRef } from "react";
import type { AcervoTipo, UploadResponse } from "@/types";
import { formatFileSize } from "@/lib/utils";
import { UPLOAD_MAX_SIZE_MB } from "@/lib/constants";
import api from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

const TIPO_OPTIONS: { value: AcervoTipo; label: string }[] = [
  { value: "artigos", label: "Artigo / Trabalho acadêmico" },
  { value: "imagens", label: "Imagem" },
  { value: "videos", label: "Vídeo" },
];

export default function UploadForm() {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<AcervoTipo | "">("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [historicalPeriod, setHistoricalPeriod] = useState("");
  const [authorship, setAuthorship] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTitulo("");
    setTipo("");
    setArquivo(null);
    setDescription("");
    setCategoryId("");
    setHistoricalPeriod("");
    setAuthorship("");
    setPublicationDate("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim() || !tipo || !arquivo) {
      setStatus("error");
      setMessage(
        "Por favor, preencha todos os campos obrigatórios antes de enviar.",
      );
      return;
    }

    if (arquivo.size > UPLOAD_MAX_SIZE_MB * 1024 * 1024) {
      setStatus("error");
      setMessage(`O arquivo deve ter no máximo ${UPLOAD_MAX_SIZE_MB} MB.`);
      return;
    }

    setStatus("loading");
    setMessage("");

    const formData = new FormData();
    formData.append("titulo", titulo.trim());
    formData.append("tipo", tipo);
    formData.append("arquivo", arquivo);
    formData.append("description", description.trim());
    formData.append("categoryId", categoryId.trim());
    formData.append("historicalPeriod", historicalPeriod.trim());
    formData.append("authorship", authorship.trim());
    formData.append("publicationDate", publicationDate);

    try {
      const { data } = await api.post("/api/midias", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setStatus("success");
      setMessage(data.message ?? "Arquivo enviado com sucesso!");
      reset();
    } catch (err: any) {
      console.error("[UploadForm] Error uploading file:", err);
      setStatus("error");
      setMessage(
        err.response?.data?.error || "Erro de conexão. Tente novamente.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {status !== "idle" && status !== "loading" && (
        <div
          role="alert"
          className={`px-4 py-3 rounded-sm text-sm border ${
            status === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label htmlFor="titulo" className="label-cafta">
          Título <span className="text-red-400">*</span>
        </label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Trabalho sobre a Revolução Farroupilha"
          className="input-cafta"
          required
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="tipo" className="label-cafta">
          Tipo de conteúdo <span className="text-red-400">*</span>
        </label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as AcervoTipo)}
          className="input-cafta"
          required
          disabled={status === "loading"}
        >
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {TIPO_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="label-cafta">
          Descrição
        </label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descreva detalhadamente o conteúdo do arquivo..."
          className="input-cafta"
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="label-cafta">
          Categoria (opcional)
        </label>
        <input
          id="categoryId"
          type="text"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          placeholder="Ex: Documentos Históricos, Fotografias Antigas, etc."
          className="input-cafta"
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="historicalPeriod" className="label-cafta">
          Período Histórico (opcional)
        </label>
        <input
          id="historicalPeriod"
          type="text"
          value={historicalPeriod}
          onChange={(e) => setHistoricalPeriod(e.target.value)}
          placeholder="Ex: Império, Primeira República, Estado Novo..."
          className="input-cafta"
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="authorship" className="label-cafta">
          Autoria / Responsabilidade (opcional)
        </label>
        <input
          id="authorship"
          type="text"
          value={authorship}
          onChange={(e) => setAuthorship(e.target.value)}
          placeholder="Ex: João Silva, Maria Oliveira et al."
          className="input-cafta"
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="publicationDate" className="label-cafta">
          Data de Publicação Original (opcional)
        </label>
        <input
          id="publicationDate"
          type="date"
          value={publicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
          className="input-cafta"
          disabled={status === "loading"}
        />
      </div>

      <div>
        <label htmlFor="arquivo" className="label-cafta">
          Arquivo <span className="text-red-400">*</span>
        </label>
        <input
          id="arquivo"
          ref={fileRef}
          type="file"
          onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
          className="input-cafta file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-cafta-gold/20 file:text-cafta-gold hover:file:bg-cafta-gold/30 cursor-pointer"
          required
          disabled={status === "loading"}
        />
        {arquivo && (
          <p className="mt-1.5 text-white/40 text-xs">
            {arquivo.name} — {formatFileSize(arquivo.size)}
          </p>
        )}
        <p className="mt-1.5 text-white/30 text-xs">
          Tamanho máximo: {UPLOAD_MAX_SIZE_MB} MB
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-cafta-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {status === "loading" ? (
          <>
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Enviando…
          </>
        ) : (
          "Enviar para o acervo"
        )}
      </button>
    </form>
  );
}
