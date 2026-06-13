import { useEffect, useState } from 'react'
import { Pesquisa } from '@/types/index'
import { api } from '@/lib/api'

export function usePesquisas() {
  const [data, setData] = useState<Pesquisa[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPesquisas() {
      setLoading(true)
      setError(null)

      try {
        // Fetch from backend API
        const response = await api.get('/api/pesquisas')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

        // The backend already returns data in the format expected by frontend
        // Just map the data to ensure proper typing
        const transformedData: Pesquisa[] = result.data.map((pesquisa: any) => ({
          title: pesquisa.titulo, // Note: backend uses 'titulo', frontend expects 'title'
          id: pesquisa.id,
          titulo: pesquisa.titulo,
          autores: pesquisa.autores,
          ano: pesquisa.ano,
          link: pesquisa.link,
          destaque: pesquisa.destaque
        }))

        setData(transformedData)
      } catch (err) {
        console.error('[usePesquisas] Error fetching pesquisas:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar pesquisas')
      } finally {
        setLoading(false)
      }
    }

    fetchPesquisas()
  }, [])

  const createPesquisa = async (novaPesquisa: Omit<Pesquisa, 'id'>) => {
    setLoading(true)
    try {
      // Map frontend Pesquisa format to backend CreatePesquisaBody format
      const backendData = {
        titulo: novaPesquisa.titulo,
        autores: novaPesquisa.autores,
        ano: novaPesquisa.ano,
        link: novaPesquisa.link,
        destaque: novaPesquisa.destaque
      }

      const response = await api.post('/api/pesquisas', {
        body: JSON.stringify(backendData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // Map backend response to frontend format
      const pesquisaComId: Pesquisa = {
        title: result.data.titulo,
        id: result.data.id,
        titulo: result.data.titulo,
        autores: result.data.autores,
        ano: result.data.ano,
        link: result.data.link,
        destaque: result.data.destaque
      }

      setData(prev => [...prev, pesquisaComId])
      return pesquisaComId
    } finally {
      setLoading(false)
    }
  }

  const updatePesquisa = async (id: string, dadosAtualizacao: Partial<Pesquisa>) => {
    setLoading(true)
    try {
      // Map frontend Pesquisa format to backend UpdatePesquisaBody format
      const backendData: Partial<{
        titulo: string
        autores: string[]
        ano: number
        link?: string
        destaque?: boolean
      }> = {}

      if (dadosAtualizacao.titulo !== undefined) backendData.titulo = dadosAtualizacao.titulo
      if (dadosAtualizacao.autores !== undefined) backendData.autores = dadosAtualizacao.autores
      if (dadosAtualizacao.ano !== undefined) backendData.ano = dadosAtualizacao.ano
      if (dadosAtualizacao.link !== undefined) backendData.link = dadosAtualizacao.link
      if (dadosAtualizacao.destaque !== undefined) backendData.destaque = dadosAtualizacao.destaque

      const response = await api.patch(`/api/pesquisas/${id}`, {
        body: JSON.stringify(backendData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      // Map backend response to frontend format
      const pesquisaAtualizada: Pesquisa = {
        title: result.data.titulo,
        id: result.data.id,
        titulo: result.data.titulo,
        autores: result.data.autores,
        ano: result.data.ano,
        link: result.data.link,
        destaque: result.data.destaque
      }

      setData(prev => prev.map(p => p.id === id ? pesquisaAtualizada : p))
      return pesquisaAtualizada
    } finally {
      setLoading(false)
    }
  }

  const deletePesquisa = async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      const response = await api.delete(`/api/pesquisas/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Remove from local state
      setData(prev => prev.filter(p => p.id !== id))
      return true
    } catch (err) {
      console.error('[usePesquisas] Error deleting pesquisa:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, createPesquisa, updatePesquisa, deletePesquisa }
}