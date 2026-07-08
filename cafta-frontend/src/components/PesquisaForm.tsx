"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Pesquisa } from "@/types/index";
import api from "@/lib/api";

interface PesquisaFormProps {
  initialData?: Pesquisa;
  onSubmitSuccess?: (pesquisa: Pesquisa) => void;
}

type PesquisaFormState = {
  id?: string;
  title: string;
  authors: string;
  year: number;
  link: string;
  destaque: boolean;
};

export default function PesquisaForm({
  initialData,
  onSubmitSuccess,
}: PesquisaFormProps) {
  const [formData, setFormData] = useState<PesquisaFormState>(() => {
    if (initialData) {
      return {
        id: initialData.id,
        title: initialData.title,
        authors: Array.isArray(initialData.autores)
          ? initialData.autores.join(", ")
          : (initialData.autores ?? ""),
        year: initialData.ano,
        link: initialData.link ?? "",
        destaque: initialData.destaque ?? false,
      };
    }
    return {
      title: "",
      authors: "",
      year: new Date().getFullYear(),
      link: "",
      destaque: false,
    };
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof PesquisaFormState, string>>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PesquisaFormState, string>> = {};
    const currentYear = new Date().getFullYear();

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório";

    const authorsArray = formData.authors
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    if (authorsArray.length === 0)
      newErrors.authors = "Autores são obrigatórios (separados por vírgula)";

    const yearNum = parseInt(formData.year.toString());
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = `Ano deve ser um número inteiro entre 1900 e ${currentYear}`;
    }

    if (formData.link.trim()) {
      const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
      if (!urlPattern.test(formData.link.trim())) {
        newErrors.link = "Link deve ser uma URL válida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const pesquisaData = {
        titulo: formData.title.trim(),
        autores: formData.authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        ano: parseInt(formData.year.toString()),
        link: formData.link.trim() || undefined,
        destaque: formData.destaque,
      };

      const isUpdate = !!formData.id;
      const endpoint = isUpdate
        ? `/api/pesquisas/${formData.id}`
        : `/api/pesquisas`;

      const { data: result } = isUpdate
        ? await api.patch(endpoint, pesquisaData)
        : await api.post(endpoint, pesquisaData);

      const submittedPesquisa: Pesquisa = {
        title: result.data.titulo,
        id: result.data.id,
        titulo: result.data.titulo,
        autores: result.data.autores,
        ano: result.data.ano,
        link: result.data.link,
        destaque: result.data.destaque,
      };

      if (onSubmitSuccess) onSubmitSuccess(submittedPesquisa);
    } catch (err: any) {
      console.error("[PesquisaForm] Submit error:", err);
      alert(
        err.response?.data?.error ||
          "Falha ao enviar. Por favor, tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white/5 rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-white">
        {initialData ? "Editar Pesquisa" : "Adicionar Nova Pesquisa"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block mb-2 text-white font-medium">
            Título
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Digite o título"
          />
          {errors.title && (
            <p className="mt-1 text-red-400 text-sm">{errors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="authors"
            className="block mb-2 text-white font-medium"
          >
            Autores (separados por vírgula)
          </label>
          <input
            id="authors"
            type="text"
            name="authors"
            value={formData.authors}
            onChange={handleChange}
            required
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Ex: Autor Um, Autor Dois, Autor Três"
          />
          {errors.authors && (
            <p className="mt-1 text-red-400 text-sm">{errors.authors}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block mb-2 text-white font-medium">
              Ano
            </label>
            <input
              id="year"
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear()}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            />
            {errors.year && (
              <p className="mt-1 text-red-400 text-sm">{errors.year}</p>
            )}
          </div>

          <div>
            <label htmlFor="link" className="block mb-2 text-white font-medium">
              Link (opcional)
            </label>
            <input
              id="link"
              type="text"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="https://exemplo.com/pesquisa"
            />
            {errors.link && (
              <p className="mt-1 text-red-400 text-sm">{errors.link}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="destaque"
            type="checkbox"
            name="destaque"
            checked={formData.destaque}
            onChange={handleChange}
            className="h-4 w-4 text-white bg-white/10 rounded focus:ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark"
          />
          <label htmlFor="destaque" className="text-white font-medium">
            Destaque
          </label>
          {errors.destaque && (
            <p className="text-red-400 text-sm">{errors.destaque}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="5"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Salvando...
              </>
            ) : (
              "Salvar"
            )}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="ml-4 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-primary/50 hover:bg-cafta-primary/70 transition-colors"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
