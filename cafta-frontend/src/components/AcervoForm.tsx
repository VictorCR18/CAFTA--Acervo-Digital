"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { AcervoFormData, AcervoItem } from "@/types";
import { formatFileSize } from "@/lib/utils";
import { UPLOAD_MAX_SIZE_MB, CATEGORIAS_ACERVO } from "@/lib/constants";

interface AcervoFormProps {
  initialData?: AcervoItem;
  onSubmitSuccess?: (item: AcervoItem) => void;
  onCancel?: () => void;
  isPublic?: boolean;
}

const EMPTY_FORM: AcervoFormData = {
  title: "",
  description: "",
  categoryId: "",
  historicalPeriod: "",
  authorship: "",
  publicationDate: "",
  tipo: "",
  fileUrl: "",
};

export default function AcervoForm({
  initialData,
  onSubmitSuccess,
  onCancel,
  isPublic = false,
}: AcervoFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AcervoFormData>(() => {
    if (initialData) {
      return {
        ...EMPTY_FORM,
        ...initialData,
        publicationDate: normalizeDate(initialData.publicationDate),
      };
    }
    return EMPTY_FORM;
  });

  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof AcervoFormData, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...EMPTY_FORM,
        ...initialData,
        publicationDate: normalizeDate(initialData.publicationDate),
      });
    }
  }, [initialData]);

  function normalizeDate(date: string | Date | undefined): string {
    if (!date) return "";
    return typeof date === "string"
      ? date.split("T")[0]
      : date.toISOString().split("T")[0];
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile && selectedFile.size > UPLOAD_MAX_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        fileUrl: `O arquivo deve ter no máximo ${UPLOAD_MAX_SIZE_MB} MB.`,
      }));
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setFile(selectedFile);
    setErrors((prev) => ({ ...prev, fileUrl: "" }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AcervoFormData, string>> = {};

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.tipo) newErrors.tipo = "Tipo é obrigatório";
    if (!formData.categoryId) newErrors.categoryId = "Categoria é obrigatória";

    if (!formData.id && !file) {
      newErrors.fileUrl = "Arquivo é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const isUpdate = !!formData.id;
      const endpoint = isUpdate ? `/api/midias/${formData.id}` : `/api/midias`;

      const payload = new FormData();

      payload.append("titulo", formData.title);
      payload.append("tipo", formData.tipo);

      if (formData.description)
        payload.append("description", formData.description);
      if (formData.categoryId)
        payload.append("categoryId", formData.categoryId);
      if (formData.historicalPeriod)
        payload.append("historicalPeriod", formData.historicalPeriod);
      if (formData.authorship)
        payload.append("authorship", formData.authorship);
      if (formData.publicationDate)
        payload.append("publicationDate", formData.publicationDate);

      if (file) {
        payload.append("arquivo", file);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(percentCompleted);
          }
        },
      };

      setUploadProgress(0);

      const { data } = await (isUpdate
        ? api.patch(endpoint, payload, config)
        : api.post(endpoint, payload, config));

      setUploadProgress(100);

      setUploadStatus("success");
      setUploadMessage(data.message ?? "Operação realizada com sucesso!");

      if (onSubmitSuccess) onSubmitSuccess(data.data as AcervoItem);

      if (!isUpdate) {
        setFormData(EMPTY_FORM);
        setFile(null);
        if (fileRef.current) fileRef.current.value = "";
      }
    } catch (err: any) {
      setUploadStatus("error");
      setUploadMessage(
        err.response?.data?.error ??
          "Falha ao enviar. Por favor, tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isEdit = !!formData.id;

  return (
    <div
      className={
        !isPublic ? "max-w-2xl mx-auto p-4 bg-white/5 rounded-lg shadow-md" : ""
      }
    >
      {!isPublic && (
        <h2 className="mb-6 text-2xl font-bold text-white">
          {isEdit ? "Editar Item" : "Adicionar Novo Item"}
        </h2>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {uploadStatus !== "idle" && uploadStatus !== "loading" && (
          <div
            role="alert"
            className={`px-4 py-3 rounded-sm text-sm border flex items-center ${
              uploadStatus === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            }`}
          >
            {uploadStatus === "success" ? (
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
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
            ) : (
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
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
            )}
            {uploadMessage}
          </div>
        )}

        <div>
          <label
            htmlFor="title"
            className={
              isPublic ? "label-cafta" : "block mb-2 text-white font-medium"
            }
          >
            Título <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={
              isPublic
                ? "input-cafta"
                : "block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 focus:ring-2 focus:ring-white"
            }
            placeholder="Ex: Trabalho sobre a Revolução"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-red-400 text-sm">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tipo"
            className={
              isPublic ? "label-cafta" : "block mb-2 text-white font-medium"
            }
          >
            Tipo de conteúdo <span className="text-red-400">*</span>
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            disabled={isEdit || isLoading}
            className={
              isPublic
                ? "input-cafta"
                : "block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 focus:ring-2 focus:ring-white"
            }
          >
            <option value="" disabled>
              Selecione o tipo
            </option>
            <option value="artigos">Artigo / Trabalho acadêmico</option>
            <option value="imagens">Imagem</option>
            <option value="videos">Vídeo</option>
          </select>
          {errors.tipo && (
            <p className="mt-1 text-red-400 text-sm">{errors.tipo}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className={
              isPublic ? "label-cafta" : "block mb-2 text-white font-medium"
            }
          >
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            disabled={isLoading}
            className={
              isPublic
                ? "input-cafta"
                : "block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 h-24 resize-y"
            }
            placeholder="Descreva detalhadamente..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="categoryId"
              className={
                isPublic ? "label-cafta" : "block mb-2 text-white font-medium"
              }
            >
              Categoria <span className="text-red-400">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={isLoading}
              className={
                isPublic
                  ? "input-cafta"
                  : "block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 focus:ring-2 focus:ring-white"
              }
            >
              <option value="" disabled>
                Selecione uma categoria...
              </option>
              {CATEGORIAS_ACERVO.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.titulo}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-red-400 text-sm">{errors.categoryId}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="historicalPeriod"
              className={
                isPublic ? "label-cafta" : "block mb-2 text-white font-medium"
              }
            >
              Período Histórico (opcional)
            </label>
            <input
              id="historicalPeriod"
              name="historicalPeriod"
              type="text"
              value={formData.historicalPeriod}
              onChange={handleChange}
              disabled={isLoading}
              className={
                isPublic
                  ? "input-cafta"
                  : "block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10"
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="authorship"
              className={
                isPublic ? "label-cafta" : "block mb-2 text-white font-medium"
              }
            >
              Autoria (opcional)
            </label>
            <input
              id="authorship"
              name="authorship"
              type="text"
              value={formData.authorship}
              onChange={handleChange}
              disabled={isLoading}
              className={
                isPublic
                  ? "input-cafta"
                  : "block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10"
              }
            />
          </div>

          <div>
            <label
              htmlFor="publicationDate"
              className={
                isPublic ? "label-cafta" : "block mb-2 text-white font-medium"
              }
            >
              Data de Publicação
            </label>
            <input
              id="publicationDate"
              name="publicationDate"
              type="date"
              value={formData.publicationDate}
              onChange={handleChange}
              disabled={isLoading}
              className={
                isPublic
                  ? "input-cafta"
                  : "block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10"
              }
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="fileUpload"
            className={
              isPublic ? "label-cafta" : "block mb-2 text-white font-medium"
            }
          >
            Arquivo {!isEdit && <span className="text-red-400">*</span>}
          </label>
          <input
            id="fileUpload"
            ref={fileRef}
            type="file"
            onChange={handleFileChange}
            disabled={isLoading}
            className="input-cafta file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-cafta-gold/20 file:text-cafta-gold hover:file:bg-cafta-gold/30 cursor-pointer"
          />
          {file ? (
            <p className="mt-1.5 text-white/40 text-xs">
              {file.name} — {formatFileSize(file.size)}
            </p>
          ) : isEdit && initialData?.fileUrl ? (
            <p className="mt-1.5 text-white/40 text-xs">
              Arquivo atual:{" "}
              <a
                href={initialData.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cafta-gold hover:underline"
              >
                {initialData.fileUrl.split("/").pop()?.split("?")[0] ??
                  "arquivo"}
              </a>
            </p>
          ) : null}
          {errors.fileUrl && (
            <p className="mt-1 text-red-400 text-sm">{errors.fileUrl}</p>
          )}
        </div>

        {isLoading && uploadProgress > 0 && (
          <div className="w-full bg-white/10 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className="bg-cafta-gold h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-xs text-white/60 text-right mt-1.5">
              Enviando... {uploadProgress}%
            </p>
          </div>
        )}

        <div
          className={`flex ${isPublic ? "flex-col" : "justify-end"} gap-4 mt-6`}
        >
          <button
            type="submit"
            disabled={isLoading}
            className={
              isPublic
                ? "btn-cafta-primary w-full justify-center disabled:opacity-50"
                : "flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light disabled:opacity-50"
            }
          >
            {isLoading
              ? "Enviando..."
              : isPublic
                ? "Enviar para o acervo"
                : isEdit
                  ? "Atualizar Item"
                  : "Salvar Item"}
          </button>

          {!isPublic && (
            <button
              type="button"
              onClick={onCancel || (() => router.push("/admin/acervo"))}
              className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-primary/50 hover:bg-cafta-primary/70 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
