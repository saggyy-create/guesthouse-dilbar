import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useAvailabilityMergedByCal } from '../hooks/useAvailabilityMergedByCal'
import { CAL_IDS } from '../data/calendars'
import { isDateInRangeInclusive, parseISODate } from '../utils/dateRange'
import { useBookingDraft } from '../hooks/useBookingDraft'
import { useLanguage } from '../context/LanguageContext'

const localeMap = { ru: 'ru-RU', en: 'en-US' }

const startOfMonth = (year, monthIndex) => {
  const d = new Date(year, monthIndex, 1)
  d.setHours(0, 0, 0, 0)
  return d
}

const addMonths = (date, delta) => {
  const d = new Date(date)
  d.setMonth(d.getMonth() + delta)
  return d
}

const daysInMonth = (year, monthIndex) => new Date(year, monthIndex + 1, 0).getDate()

const isoPad = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const isoToday = () => new Date().toISOString().slice(0, 10)

const AvailabilityCalendar = () => {
  const { draft, update } = useBookingDraft()
  const { language, t } = useLanguage()
  const locale = localeMap[language] || 'ru-RU'
  const dayNames = useMemo(() => {
    const week = []
    // Start from Monday
    for (let i = 1; i <= 7; i++) {
      const d = new Date(2026, 0, 5 + i)
      week.push(d.toLocaleDateString(locale, { weekday: 'short' }))
    }
    return week
  }, [locale])

  const monthNames = useMemo(() => {
    const ms = []
    for (let i = 0; i < 12; i++) {
      const d = new Date(2026, i, 1)
      ms.push(d.toLocaleDateString(locale, { month: 'long' }))
    }
    return ms
  }, [locale])

  const [viewDate, setViewDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const stayType = draft?.stayType || 'guesthouse'
  const calId = stayType === 'apartments' ? CAL_IDS.apartments1 : CAL_IDS.guesthouse
  const { ranges } = useAvailabilityMergedByCal(calId)

  const blockedRanges = useMemo(
    () => (ranges || []).map((r) => ({ start: parseISODate(r.start), end: parseISODate(r.end) })),
    [ranges]
  )

  const isBlocked = (date) =>
    blockedRanges.some((r) => isDateInRangeInclusive(date, r.start, r.end))

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const totalDays = daysInMonth(year, month)
  const firstDow = startOfMonth(year, month).getDay()
  // Convert Sunday=0 → 6, Monday=1 → 0, etc.
  const startOffset = firstDow === 0 ? 6 : firstDow - 1
  const today = isoToday()

  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) {
    const dt = new Date(year, month, d)
    dt.setHours(0, 0, 0, 0)
    cells.push(dt)
  }

  const handleDayClick = (date) => {
    const iso = isoPad(date)
    if (!draft.checkIn || (draft.checkIn && draft.checkOut)) {
      update({ checkIn: iso, checkOut: '' })
    } else {
      if (iso <= draft.checkIn) {
        update({ checkIn: iso, checkOut: '' })
      } else {
        update({ checkOut: iso })
      }
    }
  }

  const inRange = (date) => {
    if (!draft.checkIn) return false
    const ci = parseISODate(draft.checkIn)
    if (draft.checkOut) {
      const co = parseISODate(draft.checkOut)
      return date >= ci && date <= co
    }
    return date.getTime() === ci.getTime()
  }

  return (
    <section id="availability" className="py-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => setViewDate(addMonths(viewDate, -1))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-body"
              >
                ←
              </button>
              <h3 className="text-xl font-display font-bold text-gray-900">
                {monthNames[month]} {year}
              </h3>
              <button
                type="button"
                onClick={() => setViewDate(addMonths(viewDate, 1))}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-body"
              >
                →
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((name) => (
                <div key={name} className="text-center text-xs font-semibold text-gray-500 py-2 font-body uppercase">
                  {name}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {cells.map((date, i) => {
                if (!date) return <div key={`e-${i}`} />

                const iso = isoPad(date)
                const blocked = isBlocked(date)
                const selected = inRange(date)
                const isToday = iso === today
                const past = date < parseISODate(today)

                return (
                  <button
                    key={iso}
                    type="button"
                    disabled={blocked || past}
                    onClick={() => handleDayClick(date)}
                    className={`
                      relative p-2 md:p-3 text-sm font-body rounded-lg transition-all duration-200
                      ${blocked || past ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through' : 'hover:bg-primary-100 hover:text-primary-700 cursor-pointer'}
                      ${selected ? 'bg-primary-500 text-white hover:bg-primary-600' : ''}
                      ${isToday && !selected ? 'ring-2 ring-primary-300' : ''}
                    `}
                  >
                    <span className="relative z-10">{date.getDate()}</span>
                    {blocked && <span className="absolute inset-0 bg-red-50 rounded-lg" />}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 font-body text-sm text-gray-600">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded" />
                {t.availability.legendAvailable}
              </div>
              <div className="flex items-center gap-2 font-body text-sm text-gray-600">
                <div className="w-4 h-4 bg-red-50 border-2 border-red-200 rounded" />
                {t.availability.legendBooked}
              </div>
              <div className="flex items-center gap-2 font-body text-sm text-gray-600">
                <div className="w-4 h-4 bg-primary-500 rounded" />
                {t.availability.legendSelected}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AvailabilityCalendar
