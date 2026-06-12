import { useEffect, useState } from 'react'
import { ArquivoAcervo } from '@/types/index'
import { mockAcervoData } from '@/lib/mockAcervoData'

export function usePendingFiles() {
  const [pendingFiles, setPendingFiles] = useState<ArquivoAcervo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPendingFiles() {
      setLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Transform mock data to match ArquivoAcervo format
        const transformedFiles: ArquivoAcervo[] = mockAcervoData.map(item => {
          // Map categoryId to ArquivoAcervo tipo
          const categoryId = String(item.categoryId)
          const tipo: ArquivoAcervo['tipo'] = categoryId === 'documentos'
            ? 'artigos'
            : (item.categoryId as ArquivoAcervo['tipo'])

          // Extract filename from fileUrl
          const filename = item.fileUrl.split('/').pop() || ''

          // Format publicationDate to match dataUpload format
          const dataUpload = new Date(item.publicationDate).toLocaleDateString("pt-BR")

          return {
            id: item.id,
            titulo: item.title,
            tipo,
            filename,
            url: item.fileUrl,
            dataUpload
          }
        })

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