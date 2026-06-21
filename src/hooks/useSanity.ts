import { useState, useEffect } from 'react'
import { client } from '@/sanity/lib/client'

export function useSanity<T>(query: string, params?: Record<string, unknown>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Stable dependency key so the effect re-runs when params change
  // (e.g. navigating between projects changes `slug` but not `query`).
  const paramsKey = JSON.stringify(params ?? {})

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    client
      .fetch<T>(query, params ?? {})
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, paramsKey])

  return { data, loading, error }
}
