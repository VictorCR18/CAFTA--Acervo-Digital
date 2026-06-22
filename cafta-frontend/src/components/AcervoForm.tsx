"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { AcervoItem, AcervoTipo } from "@/types";

interface AcervoFormProps {
  initialData?: AcervoItem;
  onSubmitSuccess?: (item: AcervoItem) => void;
}

export default function AcervoForm({ initialData, onSubmitSuccess }: AcervoFormProps) {
  const router = useRouter();

  type FormData = Omit<AcervoItem, "publicationDate" | "tipo"> & {
    publicationDate: string;
    tipo: AcervoItem["tipo"] | "";
  };

  type FormField = Exclude<keyof AcervoItem, "id">;

  const [formData, setFormData] = useState<FormData>({
    id: "",
    title: "",
    description: "",
    categoryId: "",
    historicalPeriod: "",
    authorship: "",
    fileUrl: "",
    publicationDate: "",
    tipo: "",
  });

  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const normalizePublicationDate = (date: string | Date) =>
    typeof date === "string" ? date : date.toISOString().split("T")[0];

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        publicationDate: normalizePublicationDate(initialData.publicationDate),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as FormField;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<FormField, string>> = {};
    const fieldLabels: Record<FormField, string> = {
      title: "Título",
      description: "Descrição",
      categoryId: "ID da Categoria",
      historicalPeriod: "Período Histórico",
      authorship: "Autoria",
      fileUrl: "URL do Arquivo",
      publicationDate: "Data de Publicação",
      tipo: "Tipo",
    };
    (Object.keys(fieldLabels) as FormField[]).forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${fieldLabels[field]} é obrigatório`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const isUpdate = !!formData.id;
      const endpoint = isUpdate ? `/api/midias/${formData.id}` : `/api/midias`;

      const submissionData: Record<string, any> = {};
      if (formData.title) submissionData.titulo = formData.title;
      if (formData.description !== undefined) submissionData.description = formData.description || null;
      if (formData.categoryId !== undefined) submissionData.categoryId = formData.categoryId || null;
      if (formData.historicalPeriod !== undefined) submissionData.historicalPeriod = formData.historicalPeriod || null;
      if (formData.authorship !== undefined) submissionData.authorship = formData.authorship || null;
      if (formData.publicationDate) submissionData.publicationDate = formData.publicationDate;
      if (formData.tipo) submissionData.tipo = formData.tipo;

      if (isUpdate) {
        await api.patch(endpoint, submissionData);
      } else {
        await api.post(endpoint, submissionData);
      }

      if (onSubmitSuccess) {
        onSubmitSuccess(formData as AcervoItem);
      }

      router.push("/admin/acervo");
    } catch (err: any) {
      console.error("[AcervoForm] Submit error:", err);
      alert(err.response?.data?.error || "Falha ao enviar. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white/5 rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-white">
        {initialData ? "Editar Item" : "Adicionar Novo Item"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 text-white font-medium">Título</label>
          <input
            id="title" type="text" name="title" value={formData.title} onChange={handleChange} required
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Digite o título"
          />
          {errors.title && <p className="mt-1 text-red-400 text-sm">{errors.title}</p>}
        </div>

        <div>
          <label htmlFor="description" className="block mb-2 text-white font-medium">Descrição</label>
          <textarea
            id="description" name="description" value={formData.description} onChange={handleChange} required
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent h-24 resize-y"
            placeholder="Digite a descrição"
          />
          {errors.description && <p className="mt-1 text-red-400 text-sm">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className="block mb-2 text-white font-medium">ID da Categoria</label>
            <input
              id="categoryId" type="text" name="categoryId" value={formData.categoryId} onChange={handleChange} required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Digite o ID da categoria"
            />
            {errors.categoryId && <p className="mt-1 text-red-400 text-sm">{errors.categoryId}</p>}
          </div>

          <div>
            <label htmlFor="historicalPeriod" className="block mb-2 text-white font-medium">Período Histórico</label>
            <input
              id="historicalPeriod" type="text" name="historicalPeriod" value={formData.historicalPeriod} onChange={handleChange} required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Digite o período histórico (ex: Século XIX)"
            />
            {errors.historicalPeriod && <p className="mt-1 text-red-400 text-sm">{errors.historicalPeriod}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="authorship" className="block mb-2 text-white font-medium">Autoria</label>
            <input
              id="authorship" type="text" name="authorship" value={formData.authorship} onChange={handleChange} required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Digite a autoria"
            />
            {errors.authorship && <p className="mt-1 text-red-400 text-sm">{errors.authorship}</p>}
          </div>

          <div>
            <label htmlFor="fileUrl" className="block mb-2 text-white font-medium">URL do Arquivo</label>
            <input
              id="fileUrl" type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} required
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Digite a URL do arquivo"
            />
            {errors.fileUrl && <p className="mt-1 text-red-400 text-sm">{errors.fileUrl}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="publicationDate" className="block mb-2 text-white font-medium">Data de Publicação</label>
          <input
            id="publicationDate" type="date" name="publicationDate" value={formData.publicationDate} onChange={handleChange} required
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          />
          {errors.publicationDate && <p className="mt-1 text-red-400 text-sm">{errors.publicationDate}</p>}
        </div>

        <div>
          <label htmlFor="tipo" className="block mb-2 text-white font-medium">Tipo</label>
          <select
            id="tipo" name="tipo" value={formData.tipo} onChange={handleChange} required
            disabled={!!initialData?.id}
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
          >
            <option value="">Selecione o tipo</option>
            <option value="imagens">Imagens</option>
            <option value="videos">Vídeos</option>
            <option value="artigos">Artigos</option>
          </select>
          {errors.tipo && <p className="mt-1 text-red-400 text-sm">{errors.tipo}</p>}
        </div>

        <div className="flex justify-end">
          <button
            type="submit" disabled={isLoading}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Enviando...
              </>
            ) : "Salvar"}
          </button>
          <button
            type="button" onClick={() => router.push("/admin/acervo")}
            className="ml-4 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-primary/50 hover:bg-cafta-primary/70 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}