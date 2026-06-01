export const storageKeys = {
  // Legacy (guesthouse default)
  availabilityRanges: 'gd:availability:ranges:v1',
  availabilityImported: 'gd:availability:imported:v1',
  availabilitySources: 'gd:availability:sources:v1',
  availabilityImportedMeta: 'gd:availability:imported:meta:v1',

  // Multi-calendar v2
  availabilityRangesByCal: 'gd:availability:rangesByCal:v2',
  availabilityImportedByCal: 'gd:availability:importedByCal:v2',
  availabilitySourcesByCal: 'gd:availability:sourcesByCal:v2',
  availabilityImportedMetaByCal: 'gd:availability:importedMetaByCal:v2',
  adminSession: 'gd:admin:session:v1',
  currencyPref: 'gd:currency:pref:v1',
}

export const loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export const saveJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const dispatchStorageEvent = (key, value) => {
  try {
    window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(value) }))
  } catch {
    // ignore
  }
}
