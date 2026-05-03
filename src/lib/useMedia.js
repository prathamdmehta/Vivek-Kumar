import { useEffect, useState } from 'react'

/**
 * Fetches media from the backend by category.
 * Returns { url, data, loading, error }
 *
 * @param {string} category  - e.g. 'hero', 'profile', 'photo', 'svg'
 * @param {string} fallback  - fallback URL while loading or on error
 */
const useMedia = (category, fallback = '') => {
  const [url, setUrl] = useState(fallback)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!category) {
      setLoading(false)
      return
    }

    const fetchMedia = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/media?category=${encodeURIComponent(category)}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.message || 'Failed to fetch media.')
        const items = json.data || []
        setData(items)
        // Return the first match's URL if available
        if (items.length > 0) setUrl(items[0].url)
      } catch (err) {
        setError(err.message)
        // Keep the fallback URL on error
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [category])

  return { url, data, loading, error }
}

export default useMedia
