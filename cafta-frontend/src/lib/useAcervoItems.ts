import { useEffect, useState } from 'react'
import { AcervoItem } from '@/types/index'
import { mockAcervoData } from '@/lib/mockAcervoData'

export function useAcervoItems() {
  const [data, setData] = useState<AcervoItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAcervoItems() {
      setLoading(true)
      setError(null)

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Return mock acervo data
        setData(mockAcervoData)
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