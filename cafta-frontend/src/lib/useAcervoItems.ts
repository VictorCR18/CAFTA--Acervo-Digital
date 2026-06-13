"use client"

import { useEffect, useState } from 'react'
import { ArquivoAcervo } from './../types/index'
import { api } from '../lib/api'

export function useAcervoItems(p0: { searchTerm: string }) {
  const [data, setData] = useState<ArquivoAcervo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAcervoItems() {
      setLoading(true)
      setError(null)

      try {
        // Fetch from backend API
        const response = await api.get('/api/midias')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        // Transform backend Midia objects to frontend ArquivoAcervo format
        const transformedData: ArquivoAcervo[] = result.data.map((midia: any) => ({
          id: midia.id,
          titulo: midia.titulo,
          tipo: midia.tipo as ArquivoAcervo['tipo'],
          filename: midia.filename,
          url: midia.thumbnailPath || '', // Use the public URL from backend
          dataUpload: midia.criadoEm
            ? new Date(midia.criadoEm).toLocaleDateString('pt-BR')
            : '',
          tamanho: midia.tamanhoBytes ? Number(midia.tamanhoBytes) : undefined
        }))

        setData(transformedData)
      } catch (err) {
        console.error('[useAcervoItems] Error fetching acervo items:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar itens do acervo')
      } finally {
        setLoading(false)
      }
    }

    fetchAcervoItems()
  }, [])

  return { data, loading, error }
}