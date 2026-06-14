"use client"

import { useEffect, useState } from 'react'
import { ArquivoAcervo } from '../types/index'
import { api } from '../lib/api'

export function usePendingFiles() {
  const [pendingFiles, setPendingFiles] = useState<ArquivoAcervo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPendingFiles() {
      setLoading(true)
      setError(null)

      try {
        // Build query parameters
        const params = new URLSearchParams()
        params.append('status', 'processando') // Show only pending files for approval

        // Fetch from backend API
        const response = await api.get(`/api/midias?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        // Get R2 public URL from environment variables
        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

        // Transform backend Midia objects to frontend ArquivoAcervo format
        const transformedFiles: ArquivoAcervo[] = result.data.map((midia: any) => {
          // Construct the public URL for the file in R2
          const fileUrl = r2PublicUrl && midia.pathRelativo
            ? `${r2PublicUrl}/${midia.pathRelativo}`
            : ''

          return {
            id: midia.id,
            titulo: midia.titulo,
            tipo: midia.tipo as ArquivoAcervo['tipo'],
            filename: midia.filename,
            url: fileUrl, // Public URL of the file in R2
            thumbnailUrl: midia.thumbnailPath, // Public URL of thumbnail (for images)
            dataUpload: midia.criadoEm
              ? new Date(midia.criadoEm).toLocaleDateString('pt-BR')
              : '',
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