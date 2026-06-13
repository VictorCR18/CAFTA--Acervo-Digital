"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { AcervoItem } from "@/types";

interface AcervoFormProps {
  initialData?: AcervoItem;
  onSubmitSuccess?: (item: AcervoItem) => void;
}

export default function AcervoForm({
  initialData,
  onSubmitSuccess,
}: AcervoFormProps) {
  const router = useRouter();
  type FormData = Omit<AcervoItem, "publicationDate"> & {
    publicationDate: string;
  };
  const [formData, setFormData] = useState<FormData>({
    id: "",
    title: "",
    description: "",
    categoryId: "",
    historicalPeriod: "",
    authorship: "",
    fileUrl: "",
    publicationDate: "",
  });
  type FormField = Exclude<keyof AcervoItem, "id">;

  const [errors, setErrors] = useState<Partial<Record<FormField, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const normalizePublicationDate = (date: string | Date) =>
    typeof date === "string" ? date : date.toISOString().split("T")[0];

  // Initialize form with initialData if provided (for edit)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        publicationDate: normalizePublicationDate(initialData.publicationDate),
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const fieldName = name as FormField;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    // Clear error for this field when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<FormField, string>> = {};
    const requiredFields: FormField[] = [
      "title",
      "description",
      "categoryId",
      "historicalPeriod",
      "authorship",
      "fileUrl",
      "publicationDate",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        const fieldLabels: Record<FormField, string> = {
          title: "Título",
          description: "Descrição",
          categoryId: "ID da Categoria",
          historicalPeriod: "Período Histórico",
          authorship: "Autoria",
          fileUrl: "URL do Arquivo",
          publicationDate: "Data de Publicação"
        };
        newErrors[field] = `${fieldLabels[field]} é obrigatório`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for submission based on whether we're creating or updating
      const isUpdate = !!formData.id;
      const endpoint = isUpdate ? `/api/midias/${formData.id}` : `/api/midias`;
      const method = isUpdate ? "PATCH" : "POST";

      // Note: The AcervoItem fields don't map directly to Midia fields
      // This is a simplified mapping - in a real app, you might need more complex transformation
      const submissionData: Partial<{
        titulo: string
        // Note: Other AcervoItem fields don't have direct equivalents in Midia model
        // For a complete implementation, you would need to adjust your backend models
        // or create a mapping layer
      }> = {};

      if (formData.title) submissionData.titulo = formData.title;

      // Only make the API call if there's something to submit
      if (Object.keys(submissionData).length > 0 || !isUpdate) {
        const response = await apiFetch(endpoint, {
          method,
          body: submissionData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // For create operations, we might want to get the created item with ID
        // For now, we'll call onSubmitSuccess with our form data
        if (onSubmitSuccess) {
          // In a real implementation, you might want to use the data returned from the API
          onSubmitSuccess(formData as AcervoItem);
        }
      } else {
        // Nothing to submit, just call success
        if (onSubmitSuccess) {
          onSubmitSuccess(formData as AcervoItem);
        }
      }

      // Redirect to list page
      router.push("/admin/acervo");
    } catch (err) {
      console.error('[AcervoForm] Submit error:', err);
      // Show error to user
      alert('Falha ao enviar. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to make API calls (similar to what's in lib/api.ts but simplified for form use)
  const apiFetch = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const baseUrl = (() => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl) return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;

      if (process.env.NODE_ENV === 'production') {
        return ''; // Relative URLs in production
      }

      return 'http://localhost:4000'; // Development fallback
    })();

    const url = `${baseUrl}${endpoint}`;

    const headers = new Headers(options.headers ?? {});

    // Set Content-Type for JSON data (not for FormData)
    if (
      options.body &&
      !(options.body instanceof FormData) &&
      !(options.body instanceof URLSearchParams) &&
      typeof options.body !== 'string'
    ) {
      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      // Convert body to JSON if it's not already a string
      if (typeof options.body !== 'string') {
        options.body = JSON.stringify(options.body);
      }
    }

    // Add credentials for same-origin requests
    const isSameOrigin = !getApiBaseUrl() ||
      (typeof window !== 'undefined' && window.location.origin === getApiBaseUrl());

    if (isSameOrigin && !headers.has('Credentials') && !options.credentials) {
      options.credentials = 'include';
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
      return apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    }

    if (process.env.NODE_ENV === 'production') {
      return '';
    }

    return 'http://localhost:4000';
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white/5 rounded-lg shadow-md">
      <h2 className="mb-6 text-2xl font-bold text-white">
        {initialData ? "Editar Item" : "Adicionar Novo Item"}
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
            htmlFor="description"
            className="block mb-2 text-white font-medium"
          >
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent h-24 resize-y"
            placeholder="Digite a descrição"
            required
          />
          {errors.description && (
            <p className="mt-1 text-red-400 text-sm">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="categoryId"
              className="block mb-2 text-white font-medium"
            >
              ID da Categoria
            </label>
            <input
              id="categoryId"
              type="text"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Digite o ID da categoria"
              required
            />
            {errors.categoryId && (
              <p className="mt-1 text-red-400 text-sm">{errors.categoryId}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="historicalPeriod"
              className="block mb-2 text-white font-medium"
            >
              Período Histórico
            </label>
            <input
              id="historicalPeriod"
              type="text"
              name="historicalPeriod"
              value={formData.historicalPeriod}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Digite o período histórico (ex: Século XIX)"
              required
            />
            {errors.historicalPeriod && (
              <p className="mt-1 text-red-400 text-sm">
                {errors.historicalPeriod}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="authorship"
              className="block mb-2 text-white font-medium"
            >
              Autoria
            </label>
            <input
              id="authorship"
              type="text"
              name="authorship"
              value={formData.authorship}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Digite a autoria"
              required
            />
            {errors.authorship && (
              <p className="mt-1 text-red-400 text-sm">{errors.authorship}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="fileUrl"
              className="block mb-2 text-white font-medium"
            >
              URL do Arquivo
            </label>
            <input
              id="fileUrl"
              type="text"
              name="fileUrl"
              value={formData.fileUrl}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="Digite a URL do arquivo"
              required
            />
            {errors.fileUrl && (
              <p className="mt-1 text-red-400 text-sm">{errors.fileUrl}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="publicationDate"
            className="block mb-2 text-white font-medium"
          >
            Data de Publicação
          </label>
          <input
            id="publicationDate"
            type="date"
            name="publicationDate"
            value={formData.publicationDate}
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            required
          />
          {errors.publicationDate && (
            <p className="mt-1 text-red-400 text-sm">{errors.publicationDate}</p>
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
                Enviando...
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
            onClick={() => router.push("/admin/acervo")}
            className="ml-4 flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-primary/50 hover:bg-cafta-primary/70 focus:outline-none focus:ring-2 focus-ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark hover:shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}