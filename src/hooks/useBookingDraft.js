import { useCallback, useEffect, useMemo, useState } from 'react'

const KEY = 'gd:booking:draft:v1'

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const save = (value) => {
  localStorage.setItem(KEY, JSON.stringify(value))
  // Also notify same-tab listeners.
  try {
    window.dispatchEvent(new CustomEvent('gd:booking:draft', { detail: value }))
  } catch {
    // ignore
  }
}

export const useBookingDraft = () => {
  const [draft, setDraft] = useState(() => load() || {
    stayType: 'guesthouse',
    checkIn: '',
    checkOut: '',
    guests: '2',
  })

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== KEY) return
      const next = load()
      if (next) setDraft(next)
    }
    const onCustom = (e) => {
      if (e?.detail) setDraft(e.detail)
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('gd:booking:draft', onCustom)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('gd:booking:draft', onCustom)
    }
  }, [])

  const update = useCallback((patch) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch }
      save(next)
      return next
    })
  }, [])

  return useMemo(() => ({ draft, update }), [draft, update])
}
