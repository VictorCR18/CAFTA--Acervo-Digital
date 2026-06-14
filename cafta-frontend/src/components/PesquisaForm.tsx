"use client";

import { useState } from "react";
import { Pesquisa } from "@/types/index";

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

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as any }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name as keyof typeof errors]: "" }));
    }
  };

  // Validate form data
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PesquisaFormState, string>> = {};
    const currentYear = new Date().getFullYear();

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório";
    }

    // Authors validation
    const authorsArray = formData.authors
      .split(",")
      .map((author) => author.trim())
      .filter((author) => author.length > 0);
    if (authorsArray.length === 0) {
      newErrors.authors = "Autores são obrigatórios (separados por vírgula)";
    }

    // Year validation
    const yearNum = parseInt(formData.year.toString());
    if (
      isNaN(yearNum) ||
      !Number.isInteger(yearNum) ||
      yearNum < 1900 ||
      yearNum > currentYear
    ) {
      newErrors.year = `Ano deve ser um número inteiro entre 1900 e ${currentYear}`;
    }

    // Link validation (optional, but if provided must be valid URL)
    if (formData.link.trim()) {
      const linkValue = formData.link.trim();
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
          "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain
          "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip
          "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
          "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
          "(\\#[-a-z\\d_]*)?$", // fragment
        "i",
      );
      if (!urlPattern.test(linkValue)) {
        newErrors.link = "Link deve ser uma URL válida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for submission - map to backend expected format
      const pesquisaData = {
        titulo: formData.title.trim(),
        autores: formData.authors
          .split(",")
          .map((author) => author.trim())
          .filter((author) => author.length > 0),
        ano: parseInt(formData.year.toString()),
        link: formData.link.trim() || undefined,
        destaque: formData.destaque,
      };

      // Determine if we're creating or updating
      const isUpdate = !!formData.id;
      const endpoint = isUpdate
        ? `/api/pesquisas/${formData.id}`
        : `/api/pesquisas`;
      const method = isUpdate ? "PATCH" : "POST";

      // Make the API call
      const response = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(pesquisaData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Erro ao enviar a pesquisa.");
      }

      const result = await response.json();

      // Map backend response to frontend Pesquisa format
      const submittedPesquisa: Pesquisa = {
        title: result.data.titulo,
        id: result.data.id,
        titulo: result.data.titulo,
        autores: result.data.autores,
        ano: result.data.ano,
        link: result.data.link,
        destaque: result.data.destaque,
      };

      // Call onSuccess callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(submittedPesquisa);
      }
    } catch (err) {
      console.error("[PesquisaForm] Submit error:", err);
      // Show error to user
      alert(
        err instanceof Error
          ? err.message
          : "Falha ao enviar. Por favor, tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to make API calls (similar to what's in lib/api.ts)
  const apiFetch = async (
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> => {
    const baseUrl = (() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) return apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;

      if (process.env.NODE_ENV === "production") {
        return ""; // Relative URLs in production
      }

      return "http://localhost:4000"; // Development fallback
    })();

    const url = `${baseUrl}${endpoint}`;

    const headers = new Headers(options.headers ?? {});

    // Add credentials for same-origin requests (for auth cookies)
    const isSameOrigin =
      !getApiBaseUrl() ||
      (typeof window !== "undefined" &&
        window.location.origin === getApiBaseUrl());

    if (isSameOrigin && !headers.has("Credentials") && !options.credentials) {
      options.credentials = "include";
    }

    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    return fetch(url, fetchOptions);
  };

  // Helper to get API base URL (same as in lib/api.ts)
  const getApiBaseUrl = (): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      return apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    }

    if (process.env.NODE_ENV === "production") {
      return "";
    }

    return "http://localhost:4000";
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
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Digite o título"
            required
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
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            placeholder="Ex: Autor Um, Autor Dois, Autor Três"
            required
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
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              min="1900"
              max={new Date().getFullYear()}
              required
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

        <div>
          <label
            htmlFor="destaque"
            className="block mb-2 text-white font-medium"
          >
            Destaque
          </label>
          <input
            id="destaque"
            type="checkbox"
            name="destaque"
            checked={formData.destaque}
            onChange={handleChange}
            className="h-4 w-4 text-white bg-white/10 rounded focus:ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark"
          />
          {errors.destaque && (
            <p className="mt-1 text-red-400 text-sm">{errors.destaque}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark hover:shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <>
                Salvar
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3l2.037 2.038c1.388 1.389 3.636 1.39 5.025.049l8.604-8.603c1.389-1.388 1.389-3.637-.048-5.025L12.038 3.038c1.389-1.388 3.636-1.389 5.025-.049l2.038 2.037c1.388 1.389 1.388 3.637-.049 5.024L3.038 12.038c-1.388 1.389-3.636 1.389-5.025.049z"
                  ></path>
                </svg>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="ml-4 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-primary/50 hover:bg-cafta-primary/70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark hover:shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
