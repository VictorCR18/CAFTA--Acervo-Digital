"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAcervoItems } from "@/lib/useAcervoItems";
import { CATEGORIAS_ACERVO } from "@/lib/constants";

export default function AcervoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [tipoCounts, setTipoCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch counts for each tipo on mount
  useEffect(() => {
    const fetchTipoCounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const tipos: ('imagens' | 'videos' | 'artigos')[] = ['imagens', 'videos', 'artigos'];
        const countsPromises = tipos.map(async (tipo) => {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/midias?tipo=${tipo}&status=ativo`);
          if (!response.ok) throw new Error(`Failed to fetch count for ${tipo}`);
          const data = await response.json();
          return [tipo, data.total || 0];
        });
        const results = await Promise.all(countsPromises);
        setTipoCounts(Object.fromEntries(results));
      } catch (err) {
        console.error('[AcervoPage] Error fetching tipo counts:', err);
        setError('Erro ao carregar contagem por tipo');
      } finally {
        setLoading(false);
      }
    };

    fetchTipoCounts();
  }, []);

  // Handle tipo selection
  const handleTipoSelect = (tipo: string) => {
    setSelectedTipo(tipo);
    // Reset search when changing tipo
    setSearchTerm("");
  };

  // Handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      // Call backend API to delete the item
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/midias/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refetch tipo counts since one item was deleted
      await fetchTipoCounts();
      alert("Item excluído com sucesso");
    } catch (err) {
      console.error('[AcervoPage] Error deleting item:', err);
      alert('Erro ao excluir item. Por favor, tente novamente.');
    }
  };

  // Refetch tipo counts function (extracted for reuse)
  const fetchTipoCounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const tipos: ('imagens' | 'videos' | 'artigos')[] = ['imagens', 'videos', 'artigos'];
      const countsPromises = tipos.map(async (tipo) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/midias?tipo=${tipo}&status=ativo`);
        if (!response.ok) throw new Error(`Failed to fetch count for ${tipo}`);
        const data = await response.json();
        return [tipo, data.total || 0];
      });
      const results = await Promise.all(countsPromises);
      setTipoCounts(Object.fromEntries(results));
    } catch (err) {
      console.error('[AcervoPage] Error fetching tipo counts:', err);
      setError('Erro ao carregar contagem por tipo');
    } finally {
      setLoading(false);
    }
  };

  // Fetch items for list view when a tipo is selected
  const { data: listItems, loading: listLoading, error: listError } = useAcervoItems({
    searchTerm,
    tipo: selectedTipo as any
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="5"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span className="ml-2 text-white">Carregando...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">Erro</h2>
          <p className="text-red-400">{error}</p>
          <Link href="/admin" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus-ring-offset-cafta-dark">
            Tentar novamente
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cafta-dark">
      {/* Header */}
      <div className="bg-cafta-primary/50 border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Gerenciamento do Acervo</h1>
              <p className="mt-1 text-sm text-white/60">
                Visualize, edite e gerencie itens do acervo histórico
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {selectedTipo ? (
          // List view for selected tipo
          <div className="space-y-6">
            {/* Header with back button and title */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedTipo(null)}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-cafta-primary/50 hover:bg-cafta-primary/70 rounded transition-colors"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Voltar
              </button>
              <h1 className="text-2xl font-bold text-white">
                {selectedTipo === 'imagens' ? 'Fotos' : selectedTipo === 'videos' ? 'Vídeos' : 'Artigos'}
              </h1>
            </div>

            {/* Search and Add Button */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex-1 min-w-[200px]">
                <label
                  htmlFor="search"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Pesquisar por título
                </label>
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Digite o título para pesquisar..."
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-6 text-white bg-white/10 placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
              </div>
              <Link
                href={`/admin/acervo/new?tipo=${selectedTipo}`}
                className="flex-shrink-0 px-6 py-3 bg-cafta-gold text-white font-semibold rounded-sm text-sm tracking-wide hover:bg-cafta-gold-light hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-cafta-gold focus:ring-offset-2 focus:ring-offset-cafta-dark transition-colors"
              >
                Adicionar Novo Item
              </Link>
            </div>

            {/* Acervo Items List */}
            <div>
              {selectedTipo && (
                <>
                  <h2 className="text-xl font-bold text-white mb-4">
                    {selectedTipo === 'imagens' ? 'Fotos' : selectedTipo === 'videos' ? 'Vídeos' : 'Artigos'}
                  </h2>
                  <div className="space-y-4">
                    {listLoading ? (
                      <div className="text-white/50 text-center py-8">
                        Carregando itens...
                      </div>
                    ) : listError ? (
                      <div className="text-red-400 text-center py-8">
                        {listError}
                      </div>
                    ) : listItems.length === 0 ? (
                      <div className="text-white/50 text-center py-8">
                        Nenhum item encontrado nesta categoria.
                      </div>
                    ) : (
                      <>
                        {listItems.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white/5 rounded-lg border border-white/10 p-6 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-start space-x-4">
                              {/* Media preview */}
                              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg bg-cafta-primary/50">
                                {(() => {
                                  // Determine preview based on file type
                                  const extension = item.filename.split('.').pop()?.toLowerCase() || ''

                                  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                                    return (
                                      <img
                                        src={item.url}
                                        alt={item.titulo}
                                        className="w-12 h-12 object-cover rounded"
                                      />
                                    )
                                  }

                                  if (['mp4', 'webm', 'ogg'].includes(extension)) {
                                    return (
                                      <video
                                        src={item.url}
                                        className="w-12 h-12 object-cover rounded"
                                        muted
                                        loop
                                      />
                                    )
                                  }

                                  // Default icon for documents and other files
                                  return (
                                    <div className="text-white/50 text-2xl">
                                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M9 12h6m2 0a2 2 0 110-4m0 4a2 2 0 100-4m-6 8a2 2 0 110-4m0 4a2 2 0 100-4m-6 0a2 2 0 110-4m0 4a2 2 0 100-4"/>
                                      </svg>
                                    </div>
                                  )
                                })()}
                              </div>

                              {/* Content */}
                              <div className="flex-1">
                                <h3 className="text-white font-semibold mb-2">
                                  {item.titulo}
                                </h3>
                                <p className="text-white/80 text-sm mb-2">
                                  {item.description}
                                </p>
                                <div className="flex items-center gap-4 mb-2 text-sm text-white/60">
                                  <span>
                                    {item.dataUpload}
                                  </span>
                                  {item.categoryId && (
                                    <span className="bg-cafta-gold/20 text-cafta-gold border border-cafta-gold/30 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-sm">
                                      {item.categoryId}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex-shrink-0 flex space-x-3">
                                <Link
                                  href={`/admin/acervo/${item.id}/edit`}
                                  className="flex items-center px-3 py-1.5 text-xs font-medium bg-cafta-primary/20 text-white rounded hover:bg-cafta-primary/30 hover:text-white transition-colors"
                                >
                                  Editar
                                  <svg
                                    className="ml-1 w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002 2v-7"
                                    ></path>
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-3-1 2-2.5z"
                                    ></path>
                                  </svg>
                                </Link>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="flex items-center px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 hover:text-red-500 transition-colors"
                                >
                                  Excluir
                                  <svg
                                    className="ml-1 w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                  </svg>
                                </button>
                                <button
                                  onClick={() => window.open(item.url, '_blank')}
                                  className="flex items-center px-3 py-1.5 text-xs font-medium bg-blue-500 hover:bg-blue-600 transition-colors"
                                >
                                  Visualizar
                                  <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M1 12s4-8 11-8 11 8-4 8-11-8-11-11-8z"/>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          // Tipo cards view (default)
          <div className="space-y-8">
            {/* Tipo Cards Grid */}
            <div className="grid gap-6">
              {/* Imagens Card */}
              <Link
                href="/admin/acervo/tipo/imagens"
                onClick={(e) => {
                  e.preventDefault();
                  handleTipoSelect('imagens');
                }}
                className="group block cursor-pointer"
              >
                <div className="relative h-64 w-full rounded-lg overflow-hidden bg-cafta-primary/20 hover:bg-cafta-primary/30 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4">
                        <svg className="h-10 w-10 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 002-2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                        Fotos
                      </h2>
                      <p className="mt-2 text-white/50 text-sm">
                        {tipoCounts.imagens || 0} item{tipoCounts.imagens !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Vídeos Card */}
              <Link
                href="/admin/acervo/tipo/videos"
                onClick={(e) => {
                  e.preventDefault();
                  handleTipoSelect('videos');
                }}
                className="group block cursor-pointer"
              >
                <div className="relative h-64 w-full rounded-lg overflow-hidden bg-cafta-primary/20 hover:bg-cafta-primary/30 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4">
                        <svg className="h-10 w-10 text-purple-500 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7l8 4-8 4V7zM3 3v16a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 002-2H5a2 2 0 002-2V3z"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                        Vídeos
                      </h2>
                      <p className="mt-2 text-white/50 text-sm">
                        {tipoCounts.videos || 0} item{tipoCounts.videos !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Artigos Card */}
              <Link
                href="/admin/acervo/tipo/artigos"
                onClick={(e) => {
                  e.preventDefault();
                  handleTipoSelect('artigos');
                }}
                className="group block cursor-pointer"
              >
                <div className="relative h-64 w-full rounded-lg overflow-hidden bg-cafta-primary/20 hover:bg-cafta-primary/30 transition-colors">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="mb-4">
                        <svg className="h-10 w-10 text-green-500 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path>
                        </svg>
                      </div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                        Artigos
                      </h2>
                      <p className="mt-2 text-white/50 text-sm">
                        {tipoCounts.artigos || 0} item{tipoCounts.artigos !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Empty state when no tipos have items */}
            {!Object.values(tipoCounts).some(count => count > 0) && (
              <div className="text-center py-12">
                <p className="text-white/50">
                  Nenhum item encontrado no acervo.
                </p>
                <Link
                  href="/admin/acervo/new"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus-ring-offset-cafta-dark"
                >
                  Adicionar Primeiro Item
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}