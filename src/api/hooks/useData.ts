import type { Root } from '@/types/data'
import { useEffect, useState } from 'react'

export const useData = (page: number) => {
  const [data, setData] = useState<Root | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${page}`,
        )
        if (!res.ok) throw new Error('Failed to fetch data. Please try again.')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err as Error)
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [page])

  return { data, isLoading, error }
}
