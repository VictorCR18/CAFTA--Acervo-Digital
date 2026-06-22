"use client"

import { useEffect, useState } from 'react'
import { ArquivoAcervo } from '../types/index'
import api from '../lib/api'

export function usePendingFiles() {
  const [pendingFiles, setPendingFiles] = useState<ArquivoAcervo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPendingFiles() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.append('status', 'processando')

        const { data: result } = await api.get(`/api/midias?${params.toString()}`)
        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

        const transformedFiles: ArquivoAcervo[] = result.data.map((midia: any) => ({
          id: midia.id,
          titulo: midia.titulo,
          tipo: midia.tipo as ArquivoAcervo['tipo'],
          filename: midia.filename,
          url: r2PublicUrl && midia.pathRelativo ? `${r2PublicUrl}/${midia.pathRelativo}` : '',
          thumbnailUrl: midia.thumbnailPath,
          dataUpload: midia.criadoEm ? new Date(midia.criadoEm).toLocaleDateString('pt-BR') : '',
        }))

        setPendingFiles(transformedFiles)
      } catch (err: any) {
        console.error('[usePendingFiles] Error fetching pending files:', err)
        setError(err.response?.data?.error || 'Erro ao carregar arquivos pendentes')
      } finally {
        setLoading(false)
      }
    }
    fetchPendingFiles()
  }, [])

  return { pendingFiles, loading, error }
}