import { useEffect, useMemo, useState } from 'react'
import { LanguageProvider } from '../context/LanguageContext'
import AdminGate from './AdminGate'
import { useServerAvailabilityRanges } from '../hooks/useServerAvailability'
import { CAL_IDS, calendarMeta } from '../data/calendars'
import { apiPutImported, apiGetSources, apiPutSources, setWorkerBaseUrl } from '../utils/api'
import { loadJson, saveJson, dispatchStorageEvent, storageKeys } from '../utils/storage'
import { parseIcsToBlockedRanges } from '../utils/ics'

const AvailabilityAdmin = () => {
  const [calId, setCalId] = useState(CAL_IDS.guesthouse)
  const { ranges, addRange, removeRange, updateRange, reset, loading } = useServerAvailabilityRanges(calId)

  const [workerBaseUrl, setWorkerUrl] = useState(() => {
    return loadJson('gd:api:workerUrl:v1', null) || 'https://gd-ical-proxy.dilbarhostel.workers.dev'
  })
  const [airbnbUrl, setAirbnbUrl] = useState('')
  const [bookingUrl, setBookingUrl] = useState('')
  const [syncStatus, setSyncStatus] = useState('')

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // Load sources for the selected calendar from API
  useEffect(() => {
    let cancelled = false
    apiGetSources().then((data) => {
      if (cancelled || !data) return
      setWorkerUrl(data?.workerBaseUrl || workerBaseUrl)
      setAirbnbUrl(data?.[calId]?.airbnbUrl || '')
      setBookingUrl(data?.[calId]?.bookingUrl || '')
    }).catch(() => {
      // fallback: try localStorage
      const src = loadJson(storageKeys.availabilitySourcesByCal, {})
      setAirbnbUrl(src?.[calId]?.airbnbUrl || '')
      setBookingUrl(src?.[calId]?.bookingUrl || '')
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calId])

  const saveSources = async (nextByCal) => {
    saveJson(storageKeys.availabilitySourcesByCal, nextByCal)
    try {
      await apiPutSources(nextByCal)
    } catch {
      // offline fallback
    }
  }

  const onSync = async () => {
    setSyncStatus('Синхронизация...')
    try {
      const current = loadJson(storageKeys.availabilitySourcesByCal, {})
      const nextSources = {
        ...current,
        workerBaseUrl,
        [calId]: { airbnbUrl, bookingUrl },
      }
      saveSources(nextSources)
      setWorkerBaseUrl(workerBaseUrl)

      const [airbnbRanges, bookingRanges] = await Promise.all([
        syncOne('Airbnb', airbnbUrl, workerBaseUrl),
        syncOne('Booking', bookingUrl, workerBaseUrl),
      ])

      const merged = [...airbnbRanges, ...bookingRanges]
      const importedMap = loadJson(storageKeys.availabilityImportedByCal, {})
      const nextImportedMap = { ...importedMap, [calId]: merged }
      saveJson(storageKeys.availabilityImportedByCal, nextImportedMap)
      dispatchStorageEvent(storageKeys.availabilityImportedByCal, nextImportedMap)

      // Also persist to API
      try {
        await apiPutImported(calId, merged)
      } catch {}

      setSyncStatus(`Готово: импортировано ${merged.length} событий`)
    } catch (e) {
      if (String(e?.message).includes('worker_missing')) {
        setSyncStatus('Укажи URL Cloudflare Worker (прокси), иначе iCal не загрузится из браузера (CORS).')
      } else {
        setSyncStatus('Ошибка синхронизации. Проверь ссылки и Worker URL.')
      }
    }
  }

  return (
    <LanguageProvider>
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-24">
        <AdminGate>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">Админка: календарь занятости</h1>
                <p className="text-gray-600 font-body mt-2">
                  Данные сохраняются в облаке (Cloudflare KV) и локально. Доступны на всех устройствах.
                </p>
              </div>
              <div className="flex gap-3">
                <a className="btn-secondary py-2 px-4" href="/#/">На сайт</a>
                <button type="button" className="btn-secondary py-2 px-4" onClick={reset}>Сбросить</button>
              </div>
            </div>

            {loading && (
              <div className="mt-4 text-gray-600 font-body">Загрузка данных...</div>
            )}

            <div className="mt-8 space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <label className="block text-gray-700 font-semibold mb-2 font-sans">Редактируемый календарь</label>
                <select
                  value={calId}
                  onChange={(e) => setCalId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                >
                  <option value={CAL_IDS.guesthouse}>{calendarMeta[CAL_IDS.guesthouse].label}</option>
                  <option value={CAL_IDS.apartments1}>{calendarMeta[CAL_IDS.apartments1].label}</option>
                  <option value={CAL_IDS.apartments2}>{calendarMeta[CAL_IDS.apartments2].label}</option>
                  <option value={CAL_IDS.apartments3}>{calendarMeta[CAL_IDS.apartments3].label}</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
                <h2 className="font-display font-bold text-gray-900 text-xl">Синхронизация iCal</h2>
                <p className="text-gray-600 font-body mt-2">
                  iCal-ссылки тянутся через Cloudflare Worker-прокси.
                </p>
                <p className="text-sm text-gray-700 font-body mt-2">
                  Календарь: <span className="font-semibold">{calendarMeta[calId].label}</span>
                </p>

                <div className="grid gap-4 mt-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 font-sans">Cloudflare Worker URL</label>
                    <input
                      value={workerBaseUrl}
                      onChange={(e) => setWorkerUrl(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                      placeholder="https://gd-ical-proxy.<you>.workers.dev"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 font-sans">Airbnb iCal URL</label>
                    <input
                      value={airbnbUrl}
                      onChange={(e) => setAirbnbUrl(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                      placeholder="https://www.airbnb... .ics"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 font-sans">Booking.com iCal URL</label>
                    <input
                      value={bookingUrl}
                      onChange={(e) => setBookingUrl(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                      placeholder="https://admin.booking.com/... .ics"
                    />
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    <button type="button" className="btn-primary" onClick={onSync}>Синхронизировать сейчас</button>
                    <button type="button" className="btn-secondary" onClick={() => {
                      const importedMap = loadJson(storageKeys.availabilityImportedByCal, {})
                      const nextImportedMap = { ...importedMap, [calId]: [] }
                      saveJson(storageKeys.availabilityImportedByCal, nextImportedMap)
                      dispatchStorageEvent(storageKeys.availabilityImportedByCal, nextImportedMap)
                      apiPutImported(calId, []).catch(() => {})
                      setSyncStatus('Импорт очищен')
                    }}>Очистить импорт</button>
                  </div>

                  {syncStatus && (
                    <div className="text-sm font-body text-gray-700 bg-white border border-gray-100 rounded-lg px-4 py-3">{syncStatus}</div>
                  )}
                </div>
              </div>

              {ranges.length === 0 && (
                <div className="text-gray-600 font-body">Пока нет заблокированных интервалов.</div>
              )}

              {ranges.map((r, idx) => (
                <div key={`${r.start}-${r.end}-${idx}`} className="grid md:grid-cols-[1fr_1fr_2fr_auto] gap-3 items-end">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 font-sans">Начало</label>
                    <input type="date" value={r.start} onChange={(e) => updateRange(idx, { start: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 font-sans">Конец</label>
                    <input type="date" value={r.end} onChange={(e) => updateRange(idx, { end: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body" />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 font-sans">Причина</label>
                    <input type="text" value={r.reason} onChange={(e) => updateRange(idx, { reason: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body" placeholder="Занято" />
                  </div>
                  <div>
                    <button type="button" className="btn-secondary py-3 px-4" onClick={() => removeRange(idx)}>Удалить</button>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <button type="button" className="btn-primary" onClick={() => addRange({ start: todayIso, end: todayIso, reason: 'Занято' })}>
                  Добавить интервал
                </button>
              </div>
            </div>
          </div>
        </AdminGate>
      </div>
    </div>
    </LanguageProvider>
  )
}

async function syncOne(label, url, workerBaseUrl) {
  if (!url) return []
  if (!workerBaseUrl) throw new Error('worker_missing')
  const base = workerBaseUrl.replace(/\/$/, '')
  const proxyUrl = `${base}/ical?url=${encodeURIComponent(url)}`
  const resp = await fetch(proxyUrl)
  if (!resp.ok) throw new Error('fetch_failed')
  const text = await resp.text()
  const reason = `Импорт: ${label}`
  return parseIcsToBlockedRanges(text, reason)
}

export default AvailabilityAdmin
