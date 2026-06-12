import { useEffect, useState } from 'react'
import { Pesquisa } from '@/types/index'
import { PESQUISAS_SAMPLE } from '@/lib/constants'

export function usePesquisas() {
  const [data, setData] = useState<Pesquisa[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPesquisas() {
      setLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Return mock pesquisas data (clone to avoid mutation)
        setData([...PESQUISAS_SAMPLE])
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
      await new Promise(resolve => setTimeout(resolve, 500))
      const pesquisaComId = {
        ...novaPesquisa,
        id: Date.now().toString() // ID temporário baseado em timestamp
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
      await new Promise(resolve => setTimeout(resolve, 500))
      setData(prev => prev.map(p =>
        p.id === id ? { ...p, ...dadosAtualizacao } : p
      ))
    } finally {
      setLoading(false)
    }
  }

  const deletePesquisa = async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
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