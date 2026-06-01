import { useEffect, useMemo, useState } from 'react'
import { useAvailabilityRanges } from './useAvailabilityRanges'
import { loadJson, storageKeys } from '../utils/storage'

// Returns merged blocked ranges for UI/booking.
// manual ranges are editable in admin; imported ranges come from iCal sync.
export const useAvailabilityMerged = () => {
  const manual = useAvailabilityRanges()

  const [imported, setImported] = useState(() => {
    const raw = loadJson(storageKeys.availabilityImported, [])
    const arr = Array.isArray(raw) ? raw : []
    return arr
      .map((r) => ({
        start: String(r?.start || '').slice(0, 10),
        end: String(r?.end || '').slice(0, 10),
        reason: String(r?.reason || 'Импорт').slice(0, 60),
      }))
      .filter((r) => r.start && r.end)
  })

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== storageKeys.availabilityImported) return
      const raw = loadJson(storageKeys.availabilityImported, [])
      const arr = Array.isArray(raw) ? raw : []
      setImported(
        arr
          .map((r) => ({
            start: String(r?.start || '').slice(0, 10),
            end: String(r?.end || '').slice(0, 10),
            reason: String(r?.reason || 'Импорт').slice(0, 60),
          }))
          .filter((r) => r.start && r.end)
      )
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const merged = useMemo(() => {
    // Keep simple: just concatenate. (We can add coalescing later.)
    return [...manual.ranges, ...imported]
  }, [imported, manual.ranges])

  return {
    ...manual,
    importedRanges: imported,
    ranges: merged,
  }
}
