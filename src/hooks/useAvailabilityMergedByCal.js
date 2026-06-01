import { useEffect, useMemo, useState } from 'react'
import { loadJson, storageKeys } from '../utils/storage'
import { useServerAvailabilityRanges } from './useServerAvailability'
import { apiGetImported } from '../utils/api'

const normalize = (r) => ({
  start: String(r?.start || '').slice(0, 10),
  end: String(r?.end || '').slice(0, 10),
  reason: String(r?.reason || 'Импорт').slice(0, 60),
})

const loadLocalImported = (calId) => {
  const raw = loadJson(storageKeys.availabilityImportedByCal, {})
  const arr = Array.isArray(raw?.[calId]) ? raw[calId] : []
  return arr.map(normalize).filter((r) => r.start && r.end)
}

export const useAvailabilityMergedByCal = (calId) => {
  const server = useServerAvailabilityRanges(calId)
  const [imported, setImported] = useState(() => loadLocalImported(calId))

  // Fetch imported from API on mount
  useEffect(() => {
    let cancelled = false
    apiGetImported(calId)
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data)) {
          setImported(data.map(normalize).filter((r) => r.start && r.end))
        }
      })
      .catch(() => {
        // fallback to local already set in useState
      })
    return () => { cancelled = true }
  }, [calId])

  // Also listen for local storage events (for legacy sync)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== storageKeys.availabilityImportedByCal) return
      setImported(loadLocalImported(calId))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [calId])

  const ranges = useMemo(() => [...server.ranges, ...imported], [imported, server.ranges])

  return {
    ranges,
    importedRanges: imported,
    loading: server.loading,
    error: server.error,
    refetch: server.refetch,
  }
}
