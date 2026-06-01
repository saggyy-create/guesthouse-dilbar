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

const loadMap = () => {
  const raw = loadJson(storageKeys.availabilityRangesByCal, null)
  return raw && typeof raw === 'object' ? raw : {}
}

export const useAvailabilityRangesByCal = (calId) => {
  const [map, setMap] = useState(() => loadMap())

  const ranges = useMemo(() => {
    const arr = Array.isArray(map?.[calId])
      ? map[calId]
      : (calId === 'guesthouse' ? defaultBlockedRanges : [])
    return arr.map(normalizeRange).filter(Boolean)
  }, [calId, map])

  const save = useCallback((nextRanges) => {
    const nextMap = { ...loadMap(), [calId]: nextRanges }
    setMap(nextMap)
    saveJson(storageKeys.availabilityRangesByCal, nextMap)
  }, [calId])

  const addRange = useCallback((range) => {
    const n = normalizeRange(range)
    if (!n) return
    save([...ranges, n])
  }, [ranges, save])

  const removeRange = useCallback((index) => {
    save(ranges.filter((_, i) => i !== index))
  }, [ranges, save])

  const updateRange = useCallback((index, patch) => {
    save(ranges.map((r, i) => (i === index ? normalizeRange({ ...r, ...patch }) : r)).filter(Boolean))
  }, [ranges, save])

  const reset = useCallback(() => {
    save(calId === 'guesthouse' ? defaultBlockedRanges : [])
  }, [calId, save])

  return {
    ranges,
    addRange,
    removeRange,
    updateRange,
    reset,
  }
}
