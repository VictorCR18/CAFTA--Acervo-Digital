import { useEffect, useState } from 'react'
import { ArquivoAcervo } from '../types/index'
import { api } from '@/lib/api'

export function usePendingFiles() {
  const [pendingFiles, setPendingFiles] = useState<ArquivoAcervo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPendingFiles() {
      setLoading(true)
      setError(null)

      try {
        // Fetch from backend API with status=processando (pending approval)
        const response = await api.get('/api/midias?status=processando')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        // Transform backend Midia objects to frontend ArquivoAcervo format
        const transformedFiles: ArquivoAcervo[] = result.data.map((midia: any) => ({
          id: midia.id,
          titulo: midia.titulo,
          tipo: midia.tipo as ArquivoAcervo['tipo'],
          filename: midia.filename,
          url: midia.thumbnailPath || '', // Use the public URL from backend
          dataUpload: midia.criadoEm
            ? new Date(midia.criadoEm).toLocaleDateString('pt-BR')
            : '',
        }))

        setPendingFiles(transformedFiles)
      } catch (err) {
        console.error('[usePendingFiles] Error fetching pending files:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar arquivos pendentes')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingFiles()
  }, [])

  return { pendingFiles, loading, error }
}