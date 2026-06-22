
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../../../components/layout/Navbar";
import api from "@/lib/api";
import Footer from "../../../components/layout/Footer";
import { labelForTipo, actionLabelForTipo } from "../../../lib/utils";
import type { AcervoTipo, ArquivoAcervo } from "../../../types";

// ─── Static params ─────────────────────────────────────────────────────────────


export function generateStaticParams() {
  const tipos: AcervoTipo[] = ["imagens", "videos", "artigos"];
  return tipos.map((tipo) => ({ tipo }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { tipo: string };
}): Promise<Metadata> {
  const label = labelForTipo(params.tipo as AcervoTipo);
  return { title: label };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PageProps {
  params: { tipo: string };
  searchParams: {
    search?: string;
    [key: string]: string | string[] | undefined
  };
}

export default async function AcervoTipoPage({ params, searchParams }: PageProps) {
  const tipo = params.tipo as AcervoTipo;
  const validTipos: AcervoTipo[] = ["imagens", "videos", "artigos"];
  const searchTerm = searchParams.search ?? "";

  if (!validTipos.includes(tipo)) {
    return (
      <main className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <p className="text-white/60">Categoria não encontrada.</p>
      </main>
    );
  }

  // Fetch data from backend API
  let arquivos: any[] = [];
  let loading = true;
  let error: string | null = null;

  try {
    // Build query parameters
    const paramsObj = new URLSearchParams();
    paramsObj.append('status', 'ativo'); // Always show only approved files

    // Add search term if provided
    if (searchTerm?.trim()) {
      paramsObj.append('search', searchTerm.trim());
    }

    // Add tipo filter
    paramsObj.append('tipo', tipo);

    // Fetch from backend API
    const response = await api.get(`/api/midias?${paramsObj.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Get R2 public URL from environment variables
    const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    // Transform backend Midia objects to frontend format
    arquivos = result.data.map((midia: any) => {
      // Construct the public URL for the file in R2
      const fileUrl = r2PublicUrl && midia.pathRelativo
        ? `${r2PublicUrl}/${midia.pathRelativo}`
        : '';

      return {
        id: midia.id,
        titulo: midia.titulo,
        tipo: midia.tipo,
        filename: midia.filename,
        url: fileUrl, // Public URL of the file in R2
        thumbnailUrl: midia.thumbnailPath, // Public URL of thumbnail (for images)
        dataUpload: midia.criadoEm
          ? new Date(midia.criadoEm).toLocaleDateString('pt-BR')
          : '',
        tamanho: midia.tamanhoBytes ? Number(midia.tamanhoBytes) : undefined,
        // Mapeando os novos campos descritivos
        description: midia.description || '',
        categoryId: midia.categoryId || '',
        historicalPeriod: midia.historicalPeriod || '',
        authorship: midia.authorship || '',
        publicationDate: midia.publicationDate
          ? new Date(midia.publicationDate).toLocaleDateString('pt-BR')
          : '',
      };
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Erro ao carregar itens do acervo';
    console.error('[AcervoTipoPage] Error fetching acervo items:', err);
  } finally {
    loading = false;
  }

  const label = labelForTipo(tipo);
  const actionLabel = actionLabelForTipo(tipo);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cafta-dark flex items-center justify-center pt-[72px]">
          <div className="text-center">
            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span className="text-white">Carregando...</span>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cafta-dark flex items-center justify-center pt-[72px]">
          <div className="text-center">
            <h2 className="text-white/50 text-sm mb-4">Erro</h2>
            <p className="text-red-400">{error}</p>
            <Link href="/#section_acervo" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-cafta-dark">
              Tentar novamente
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cafta-dark pt-[72px]">
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            {/* Back link */}
            <Link
              href="/#section_acervo"
              className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Voltar ao acervo
            </Link>

            {/* Heading */}
            <div className="mb-12">
              <span className="section-eyebrow">Acervo</span>
              <h1 className="section-title">{label}</h1>
              <p className="text-white/40 text-sm mt-2">
                {arquivos.length} {arquivos.length === 1 ? 'arquivo' : 'arquivos'}
              </p>
            </div>

            {/* Grid */}
            {arquivos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {arquivos.map((arquivo) => (
                  <article key={arquivo.id} className="card-acervo group">
                    {/* Media preview */}
                    <div className="relative aspect-video bg-cafta-primary overflow-hidden">
                      {tipo === "imagens" && (
                        <Image
                          src={arquivo.url}
                          alt={arquivo.titulo}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )}
                      {tipo === "videos" && (
                        <video
                          src={arquivo.url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      )}
                      {tipo === "artigos" && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                          <svg
                            className="w-12 h-12 text-cafta-gold/60"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-white/30 text-xs font-medium uppercase tracking-wider">
                            {arquivo.filename.split(".").pop()?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h2 className="text-white text-sm font-medium line-clamp-2 mb-1">
                        {arquivo.titulo}
                      </h2>
                      <p className="text-white/30 text-xs mb-3">
                        {arquivo.dataUpload}
                      </p>
                      <a
                        href={arquivo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cafta-outline text-xs py-1.5 px-3 w-full justify-center"
                      >
                        {actionLabel}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
                <p className="text-white/30 text-sm">
                  Nenhum arquivo encontrado nesta categoria.
                </p>
                {searchTerm ? (
                  <p className="text-white/40 text-sm mt-2">
                    Nenhum item encontrado para "{searchTerm}"
                  </p>
                ) : (
                  <p className="text-white/40 text-sm mt-2">
                    Nenhum item cadastrado ainda nesta categoria
                  </p>
                )}
                <Link
                  href="/upload"
                  className="btn-cafta-outline text-xs mt-6 inline-flex"
                >
                  Publicar o primeiro ↗
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
