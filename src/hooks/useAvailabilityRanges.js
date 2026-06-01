import { useCallback, useMemo, useState } from 'react'
import { defaultBlockedRanges } from '../data/availability'
import { storageKeys, loadJson, saveJson } from '../utils/storage'

const normalizeRange = (r) => {
  if (!r?.start || !r?.end) return null
  return {
    start: String(r.start).slice(0, 10),
    end: String(r.end).slice(0, 10),
    reason: String(r.reason || 'Занято').slice(0, 60),
  }
}

export const useAvailabilityRanges = () => {
  const [ranges, setRanges] = useState(() => {
    const stored = loadJson(storageKeys.availabilityRanges, null)
    const arr = Array.isArray(stored) ? stored : defaultBlockedRanges
    return arr.map(normalizeRange).filter(Boolean)
  })

  const save = useCallback((next) => {
    setRanges(next)
    saveJson(storageKeys.availabilityRanges, next)
  }, [])

  const addRange = useCallback((range) => {
    const n = normalizeRange(range)
    if (!n) return
    save([...ranges, n])
  }, [ranges, save])

  const removeRange = useCallback((index) => {
    const next = ranges.filter((_, i) => i !== index)
    save(next)
  }, [ranges, save])

  const updateRange = useCallback((index, patch) => {
    const next = ranges.map((r, i) => (i === index ? normalizeRange({ ...r, ...patch }) : r)).filter(Boolean)
    save(next)
  }, [ranges, save])

  const resetToDefault = useCallback(() => {
    save(defaultBlockedRanges)
  }, [save])

  return useMemo(() => ({
    ranges,
    addRange,
    removeRange,
    updateRange,
    resetToDefault,
  }), [addRange, ranges, removeRange, resetToDefault, updateRange])
}
