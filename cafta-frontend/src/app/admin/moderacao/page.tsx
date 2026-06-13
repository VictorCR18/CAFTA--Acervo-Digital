'use client';

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CATEGORIAS_ACERVO } from '@/lib/constants'
import type { CategoriaAcervo } from '@/types'
import { usePendingFiles } from '@/lib/usePendingFiles'
import { api } from '@/lib/api'

interface PendingFile {
  id: string
  titulo: string
  tipo: string
  filename: string
  url: string
  dataUpload: string
}

// Map tipo to its label for display
const tipoLabels: Record<string, string> = {
  imagens: 'Imagem',
  videos: 'Vídeo',
  artigos: 'Documento'
}

// Map tipo to its color for badge
const tipoColors: Record<string, string> = {
  imagens: 'bg-blue-500',
  videos: 'bg-purple-500',
  artigos: 'bg-green-500'
}

export default function ModeracaoPage() {
  const { pendingFiles, loading, error } = usePendingFiles()
  const [pendingFilesState, setPendingFilesState] = useState<PendingFile[]>([])
  const [loadingState, setLoadingState] = useState<boolean>(true)
  const [errorState, setErrorState] = useState<string | null>(null)
  const router = useRouter()

  // Sync state with hook data
  useEffect(() => {
    setPendingFilesState(pendingFiles)
    setLoadingState(loading)
    setErrorState(error)
  }, [pendingFiles, loading, error])

  // Fetch pending files on mount - NOW USING REAL API
  useEffect(() => {
    // The hook already handles fetching, but we keep this for consistency
    // In a real app, this would trigger a refetch if needed
  }, [])

  // Handle file approval - NOW USING REAL API
  async function handleApprove(filename: string, tipo: string) {
    try {
      // Show loading state
      setLoadingState(true)

      // Call backend API to approve file (change status to 'ativo')
      const response = await api.patch(`/api/midias/${filename}/status`, {
        body: JSON.stringify({ status: 'ativo' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update UI optimistically
      setPendingFilesState(prev => prev.filter(file => file.id !== filename))

      // Show success message
      alert('Arquivo aprovado com sucesso!')
    } catch (err) {
      console.error('[ModeracaoPage] Error approving file:', err)
      alert(err instanceof Error ? err.message : 'Erro ao aprovar arquivo')
    } finally {
      setLoadingState(false)
    }
  }

  // Handle file rejection - NOW USING REAL API
  async function handleReject(filename: string, tipo: string) {
    try {
      // Show loading state
      setLoadingState(true)

      // Call backend API to reject file (change status to 'inativo')
      const response = await api.patch(`/api/midias/${filename}/status`, {
        body: JSON.stringify({ status: 'inativo' }),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Update UI optimistically
      setPendingFilesState(prev => prev.filter(file => file.id !== filename))

      // Show success message
      alert('Arquivo rejeitado com sucesso!')
    } catch (err) {
      console.error('[ModeracaoPage] Error rejecting file:', err)
      alert(err instanceof Error ? err.message : 'Erro ao rejeitar arquivo')
    } finally {
      setLoadingState(false)
    }
  }

  if (loadingState) {
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

  if (errorState) {
    return (
      <div className="min-h-screen bg-cafta-dark flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-white/50 text-sm mb-4">Erro</h2>
          <p className="text-red-400">{errorState}</p>
          <Link href="/admin/login" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus-ring-white focus:ring-offset-2 focus-ring-offset-cafta-dark">
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
              <h1 className="text-2xl font-bold text-white">Aprovação de Mídia</h1>
              <p className="mt-1 text-sm text-white/60">
                Revise e aprove ou rejeite submissões de mídia
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/60 text-sm">
                {pendingFilesState.length} {pendingFilesState.length === 1 ? 'arquivo pendente' : 'arquivos pendentes'}
              </span>
              <Link href="/admin" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao painel
              </Link>
              <Link href="/" className="text-sm font-medium text-white hover:text-cafta-gold">
                Voltar ao site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {pendingFilesState.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50 text-xl mb-4">Nenhum arquivo pendente</p>
            <p className="text-white/40 text-sm">
              Todas as submissões foram processadas. Novas submissões aparecerão aqui quando forem enviadas.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Files Grid */}
            <div className="grid gap-6">
              {/* Group files by tipo for section headers */}
              {[...new Set(pendingFilesState.map(file => file.tipo))].map(tipo => {
                const filesOfTipo = pendingFilesState.filter(file => file.tipo === tipo)
                const categoria = CATEGORIAS_ACERVO.find(cat => cat.slug === tipo) as CategoriaAcervo | undefined

                return (
                  <div key={tipo} className="space-y-4">
                    {/* Section Header */}
                    <div className="flex items-center justify-between space-x-4">
                      <h2 className="text-xl font-semibold text-white">
                        {categoria?.titulo || tipoLabels[tipo] || tipo}
                      </h2>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${tipoColors[tipo] || 'bg-gray-500'}`}>
                          {filesOfTipo.length}
                        </span>
                      </div>
                    </div>

                    {/* Files List */}
                    <div className="divide-y divide-white/10">
                      {filesOfTipo.map((file) => (
                        <div key={file.id} className="py-4 flex items-start space-x-4">
                          {/* File Preview */}
                          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-lg bg-cafta-primary/50">
                            {(() => {
                              // Determine preview based on file type
                              const extension = file.filename.split('.').pop()?.toLowerCase() || ''

                              if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                                return (
                                  <img
                                    src={file.url}
                                    alt={file.titulo}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )
                              }

                              if (['mp4', 'webm', 'ogg'].includes(extension)) {
                                return (
                                  <video
                                    src={file.url}
                                    className="w-12 h-12 object-cover rounded"
                                    muted
                                    loop
                                  />
                                )
                              }

                              // Default icon for documents and other files
                              return (
                                <div className="text-white/50 text-2xl">
                                  {/* Simple file icon - could be improved with actual icons */}
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 12h6m2 0a2 2 0 110-4m0 4a2 2 0 100-4m-6 8a2 2 0 110-4m0 4a2 2 0 100-4m-6 0a2 2 0 110-4m0 4a2 2 0 110-4m0 4a2 2 0 110-4m0 4a2 2 0 100-4"/>
                                  </svg>
                                </div>
                              )
                            })()}
                          </div>

                          {/* File Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="text-white font-semibold truncate max-w-[200px]">
                                {file.titulo}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${tipoColors[tipo] || 'bg-gray-500/50'} text-${tipoColors[tipo] || 'gray-100'}`}>
                                {tipoLabels[tipo] || tipo}
                              </span>
                            </div>

                            <p className="text-white/40 text-sm">
                              {file.dataUpload}
                            </p>

                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleApprove(file.filename, file.tipo)}
                                className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-transparent text-white bg-cafta-gold hover:bg-cafta-gold-light focus:outline-none focus:ring-2 focus-ring-white focus:ring-offset-2 focus-ring-offset-cafta-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Aprovar
                                {/* Small checkmark icon */}
                                <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M5 13l4 4L19 7"/>
                                </svg>
                              </button>

                              <button
                                onClick={() => handleReject(file.filename, file.tipo)}
                                className="flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-transparent text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus-ring-red focus:ring-offset-2 focus-ring-offset-red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Rejeitar
                                {/* Small x icon */}
                                <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}