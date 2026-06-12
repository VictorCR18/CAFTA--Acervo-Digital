import { promises as fs } from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { labelForTipo, actionLabelForTipo } from "@/lib/utils";
import type { AcervoTipo, ArquivoAcervo } from "@/types";

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

// ─── Data loading ─────────────────────────────────────────────────────────────

async function getArquivos(tipo: AcervoTipo): Promise<ArquivoAcervo[]> {
  const dir = path.join(process.cwd(), "public", "uploads", tipo);
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => !f.startsWith("."))
      .map((filename) => ({
        id: filename,
        titulo: filename.replace(/^\d+-/, "").replace(/\.[^.]+$/, ""),
        tipo,
        filename,
        url: `/uploads/${tipo}/${filename}`,
        dataUpload: new Date(
          parseInt(filename.split(".")[0]),
        ).toLocaleDateString("pt-BR"),
      }));
  } catch {
    return [];
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PageProps {
  params: { tipo: string };
}

export default async function AcervoTipoPage({ params }: PageProps) {
  const tipo = params.tipo as AcervoTipo;
  const validTipos: AcervoTipo[] = ["imagens", "videos", "artigos"];

  if (!validTipos.includes(tipo)) {
    return (
      <main className="min-h-screen bg-cafta-dark flex items-center justify-center">
        <p className="text-white/60">Categoria não encontrada.</p>
      </main>
    );
  }

  const arquivos = await getArquivos(tipo);
  const label = labelForTipo(tipo);
  const actionLabel = actionLabelForTipo(tipo);

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
