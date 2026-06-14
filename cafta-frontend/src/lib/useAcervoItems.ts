"use client"

import { useEffect, useState } from 'react'
import { AcervoTipo, ArquivoAcervo } from './../types/index'
import { api } from '../lib/api'

export function useAcervoItems(p0: { searchTerm: string; tipo?: AcervoTipo }) {
  const [data, setData] = useState<ArquivoAcervo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAcervoItems() {
      setLoading(true)
      setError(null)

      try {
        // Build query parameters
        const params = new URLSearchParams()
        params.append('status', 'ativo') // Always show only approved files

        // Add search term if provided
        if (p0.searchTerm?.trim()) {
          params.append('search', p0.searchTerm.trim())
        }

        // Add tipo filter if provided
        if (p0.tipo) {
          params.append('tipo', p0.tipo)
        }

        // Fetch from backend API
        const response = await api.get(`/api/midias?${params.toString()}`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        // Get R2 public URL from environment variables
        const r2PublicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL

        // Transform backend Midia objects to frontend ArquivoAcervo format
        const transformedData: ArquivoAcervo[] = result.data.map((midia: any) => {
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
            tamanho: midia.tamanhoBytes ? Number(midia.tamanhoBytes) : undefined,
            // Mapeando os novos campos descritivos
            description: midia.description || '',
            categoryId: midia.categoryId || '',
            historicalPeriod: midia.historicalPeriod || '',
            authorship: midia.authorship || '',
            publicationDate: midia.publicationDate
              ? new Date(midia.publicationDate).toLocaleDateString('pt-BR')
              : '',
          }
        })

        setData(transformedData)
      } catch (err) {
        console.error('[useAcervoItems] Error fetching acervo items:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar itens do acervo')
      } finally {
        setLoading(false)
      }
    }

    fetchAcervoItems()
  }, [p0.searchTerm, p0.tipo])

  return { data, loading, error }
}