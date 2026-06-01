import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiGetRanges, apiPostRange, apiUpdateRange, apiDeleteRange, apiClearRanges } from '../utils/api'
import { defaultBlockedRanges } from '../data/availability'
import { loadJson, saveJson, storageKeys } from '../utils/storage'

const normalizeRange = (r) => {
  if (!r?.start || !r?.end) return null
  return {
    start: String(r.start).slice(0, 10),
    end: String(r.end).slice(0, 10),
    reason: String(r.reason || 'Занято').slice(0, 60),
  }
}

export const useServerAvailabilityRanges = (calId) => {
  const [ranges, setRanges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRanges = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetRanges(calId)
      setRanges(Array.isArray(data) ? data : [])
      // Cache in localStorage as fallback
      saveJson(storageKeys.availabilityRangesByCal, { ...loadJson(storageKeys.availabilityRangesByCal, {}), [calId]: data })
    } catch (e) {
      // Fallback to localStorage
      const local = loadJson(storageKeys.availabilityRangesByCal, {})
      const fallback = Array.isArray(local?.[calId]) ? local[calId] : (calId === 'guesthouse' ? defaultBlockedRanges : [])
      setRanges(fallback)
      setError(e.message)
    }
    setLoading(false)
  }, [calId])

  useEffect(() => { fetchRanges() }, [fetchRanges])

  const addRange = useCallback(async (range) => {
    const n = normalizeRange(range)
    if (!n) return
    try {
      const data = await apiPostRange(calId, n)
      setRanges(Array.isArray(data) ? data : [])
    } catch {
      // Fallback: local add
      setRanges((prev) => [...prev, n])
    }
  }, [calId])

  const removeRange = useCallback(async (index) => {
    try {
      const data = await apiDeleteRange(calId, index)
      setRanges(Array.isArray(data) ? data : [])
    } catch {
      setRanges((prev) => prev.filter((_, i) => i !== index))
    }
  }, [calId])

  const updateRange = useCallback(async (index, patch) => {
    try {
      const data = await apiUpdateRange(calId, index, patch)
      setRanges(Array.isArray(data) ? data : [])
    } catch {
      setRanges((prev) => prev.map((r, i) => (i === index ? normalizeRange({ ...r, ...patch }) : r)).filter(Boolean))
    }
  }, [calId])

  const reset = useCallback(async () => {
    try {
      const data = await apiClearRanges(calId)
      setRanges(Array.isArray(data) ? data : [])
    } catch {
      setRanges(calId === 'guesthouse' ? defaultBlockedRanges : [])
    }
  }, [calId])

  return { ranges, loading, error, addRange, removeRange, updateRange, reset, refetch: fetchRanges }
}
