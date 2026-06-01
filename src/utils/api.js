const DEFAULT_WORKER_URL = 'https://gd-ical-proxy.dilbarhostel.workers.dev'

const getWorkerBase = () => {
  try {
    const raw = localStorage.getItem('gd:api:workerUrl:v1')
    if (raw) return raw.replace(/\/$/, '')
  } catch {}
  return DEFAULT_WORKER_URL
}

export const setWorkerBaseUrl = (url) => {
  try {
    localStorage.setItem('gd:api:workerUrl:v1', url.replace(/\/$/, ''))
  } catch {}
}

const apiFetch = async (path, options = {}) => {
  const base = getWorkerBase()
  const url = `${base}${path}`
  const resp = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`API error ${resp.status}: ${body}`)
  }
  return resp.json()
}

// Ranges
export const apiGetRanges = (calId) => apiFetch(`/api/ranges/${calId}`)
export const apiPostRange = (calId, range) =>
  apiFetch(`/api/ranges/${calId}`, { method: 'POST', body: JSON.stringify(range) })
export const apiUpdateRange = (calId, index, patch) =>
  apiFetch(`/api/ranges/${calId}/${index}`, { method: 'PUT', body: JSON.stringify(patch) })
export const apiDeleteRange = (calId, index) =>
  apiFetch(`/api/ranges/${calId}/${index}`, { method: 'DELETE' })
export const apiClearRanges = (calId) =>
  apiFetch(`/api/ranges/${calId}`, { method: 'DELETE' })

// Imported ranges
export const apiGetImported = (calId) => apiFetch(`/api/imported/${calId}`)
export const apiPutImported = (calId, ranges) =>
  apiFetch(`/api/imported/${calId}`, { method: 'PUT', body: JSON.stringify(ranges) })

// Sources
export const apiGetSources = () => apiFetch('/api/sources')
export const apiPutSources = (sources) =>
  apiFetch('/api/sources', { method: 'PUT', body: JSON.stringify(sources) })

// Bookings
export const apiPostBooking = (booking) =>
  apiFetch('/api/bookings', { method: 'POST', body: JSON.stringify(booking) })
export const apiGetBookings = () => apiFetch('/api/bookings')
