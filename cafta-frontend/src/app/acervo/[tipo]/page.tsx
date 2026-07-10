import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import api from "@/lib/api";
import Footer from "@/components/layout/Footer";
import { CATEGORIAS_ACERVO } from "@/lib/constants";
import { LuArrowLeft } from "react-icons/lu";
import SearchFilters from "@/components/ui/SearchFilters";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { tipo: string };
}): Promise<Metadata> {
  const categoria = CATEGORIAS_ACERVO.find((c) => c.slug === params.tipo);
  return { title: categoria ? categoria.titulo : "Acervo" };
}

interface PageProps {
  params: { tipo: string };
  searchParams: {
    search?: string;
    formato?: string;
    [key: string]: string | string[] | undefined;
  };
}

export default async function AcervoTipoPage({
  params,
  searchParams,
}: PageProps) {
  const slug = params.tipo;
  const categoriaInfo = CATEGORIAS_ACERVO.find((c) => c.slug === slug);
  const searchTerm = searchParams.search ?? "";
  const tipoFiltro = searchParams.formato ?? "";

  if (!categoriaInfo) {
    return (
      <main className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <p className="text-white/60">Categoria não encontrada.</p>
      </main>
    );
  }

  let arquivos: any[] = [];
  let error: string | null = null;

  try {
    const paramsObj = new URLSearchParams();

    if (searchTerm) {
      paramsObj.append("search", searchTerm.trim());
    }
    if (tipoFiltro) {
      paramsObj.append("tipo", tipoFiltro);
    }

    paramsObj.append("categoryId", slug.toLowerCase());

    const { data: result } = await api.get(
      `/api/midias?${paramsObj.toString()}`,
    );

    const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    arquivos = result.data.map((midia: any) => {
      const fileUrl =
        r2PublicUrl && midia.pathRelativo
          ? `${r2PublicUrl}/${midia.pathRelativo}`
          : "";
      return {
        id: midia.id,
        titulo: midia.titulo,
        tipo: midia.tipo,
        filename: midia.filename,
        url: fileUrl,
        dataUpload: midia.criadoEm
          ? new Date(midia.criadoEm).toLocaleDateString("pt-BR")
          : "",
        description: midia.description || "",
      };
    });
  } catch (err: any) {
    error = `Erro na API: ${err.message || String(err)}`;
    console.error("[AcervoTipoPage] Error detalhado:", err);
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cafta-dark flex items-center justify-center pt-[72px]">
          <div className="text-center">
            <h2 className="text-white/50 text-sm mb-4">Erro</h2>
            <p className="text-red-400">{error}</p>
            <Link
              href="/#section_acervo"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light"
            >
              Voltar ao Início
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-cafta-dark">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/#section_acervo"
                  className="flex items-center justify-center text-white/60 hover:text-white transition-colors p-2 -ml-2 rounded-md hover:bg-white/5"
                  aria-label="Voltar para a página inicial"
                >
                  <LuArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                  <span className="section-eyebrow mb-1 block">Acervo</span>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    {categoriaInfo.titulo}
                  </h1>
                  <p className="text-white/50 text-sm mt-1">
                    {arquivos.length}{" "}
                    {arquivos.length === 1
                      ? "arquivo encontrado"
                      : "arquivos encontrados"}
                  </p>
                </div>
              </div>
            </div>

            <SearchFilters />

            {arquivos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {arquivos.map((arquivo) => (
                  <article key={arquivo.id} className="card-acervo group">
                    <div className="relative aspect-video bg-cafta-primary overflow-hidden">
                      {arquivo.tipo === "imagens" && (
                        <Image
                          src={arquivo.url}
                          alt={arquivo.titulo}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )}
                      {arquivo.tipo === "videos" && (
                        <video
                          src={arquivo.url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      )}
                      {arquivo.tipo === "artigos" && (
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
                            PDF/DOC
                          </span>
                        </div>
                      )}
                    </div>

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
                        {arquivo.tipo === "artigos"
                          ? "Ler documento"
                          : "Visualizar"}
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-lg">
                <p className="text-white/40 text-sm">
                  Nenhum item encontrado com estes filtros.
                </p>
                {!searchTerm && !tipoFiltro && (
                  <Link
                    href="/upload"
                    className="btn-cafta-outline text-xs mt-6 inline-flex"
                  >
                    Publicar o primeiro ↗
                  </Link>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
