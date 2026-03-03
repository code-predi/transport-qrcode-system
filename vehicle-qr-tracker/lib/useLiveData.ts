'use client'

import { useEffect, useState, useCallback } from 'react'

/**
 * Generic live data hook with auto-refresh
 * @param fetcher function that returns Promise<T>
 * @param interval refresh interval in ms (default 5000)
 */

export function useLiveData<T>(
  fetcher: () => Promise<T>,
  interval: number = 5000
) {

  const [data, setData] = useState<T | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)


  const load = useCallback(async () => {

    try {

      const result = await fetcher()

      setData(result)

      setError(null)

    }
    catch (err) {

      console.error("LiveData error:", err)

      setError("Failed to load live data")

    }
    finally {

      setLoading(false)

    }

  }, [fetcher])


  useEffect(() => {

    load()

    const timer = setInterval(load, interval)

    return () => clearInterval(timer)

  }, [load, interval])


  return {

    data,

    loading,

    error,

    refresh: load

  }

}