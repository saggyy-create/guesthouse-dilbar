import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CAL_IDS } from '../data/calendars'
import { useAvailabilityMergedByCal } from '../hooks/useAvailabilityMergedByCal'
import { doesRangeOverlapInclusive, parseISODate } from '../utils/dateRange'
import { calculatePriceUsd } from '../utils/pricing'
import { convert, formatMoney, loadCurrencyPref } from '../utils/currency'
import { useBookingDraft } from '../hooks/useBookingDraft'
import { useLanguage } from '../context/LanguageContext'

const isoToday = () => new Date().toISOString().slice(0, 10)

const StickyBookingBar = ({ defaultStayType = 'guesthouse', apartmentCalId = null }) => {
  const [open, setOpen] = useState(false)
  const { draft, update } = useBookingDraft()
  const { t } = useLanguage()

  const stayType = draft.stayType || defaultStayType
  const checkIn = draft.checkIn || ''
  const checkOut = draft.checkOut || ''
  const guests = draft.guests || '2'

  const calId = stayType === 'apartments' ? (apartmentCalId || CAL_IDS.apartments1) : CAL_IDS.guesthouse
  const { ranges } = useAvailabilityMergedByCal(calId)

  const blocked = useMemo(() => {
    return ranges.map((r) => ({
      start: parseISODate(r.start),
      end: parseISODate(r.end),
      reason: r.reason,
    }))
  }, [ranges])

  const overlaps = useMemo(() => {
    if (!checkIn || !checkOut) return false
    const aStart = new Date(checkIn)
    const aEnd = new Date(checkOut)
    return blocked.some((r) => doesRangeOverlapInclusive(aStart, aEnd, r.start, r.end))
  }, [blocked, checkIn, checkOut])

  const canGo = !!checkIn && !!checkOut && !overlaps

  const currencyPref = useMemo(() => loadCurrencyPref(), [])
  const price = useMemo(() => {
    return calculatePriceUsd({
      stayType,
      roomType: 'standard',
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      guests,
    })
  }, [checkIn, checkOut, guests, stayType])
  const totalUzs = useMemo(() => convert(price.totalUsd, 'USD', 'UZS', currencyPref.usdToUzs), [currencyPref.usdToUzs, price.totalUsd])

  const go = () => {
    if (!canGo) {
      document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    // Scroll to form; form will read the shared draft.
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  useEffect(() => {
    // prefill minimal
    if (!checkIn) update({ checkIn: isoToday(), stayType })
  }, [checkIn, stayType, update])

  useEffect(() => {
    // Ensure content is not hidden under the fixed bars.
    const root = document.documentElement
    const prevTop = root.style.scrollPaddingTop
    const prevBottom = root.style.scrollPaddingBottom
    root.style.scrollPaddingTop = '80px'
    root.style.scrollPaddingBottom = '160px'
    return () => {
      root.style.scrollPaddingTop = prevTop
      root.style.scrollPaddingBottom = prevBottom
    }
  }, [])

  return (
    <>
      {/* Desktop floating bar (bottom, avoids header overlap) */}
      <div className="hidden md:block fixed inset-x-0 bottom-0 z-40 pointer-events-none">
        <div className="container mx-auto px-4 pb-6">
          <div className="pointer-events-auto max-w-5xl mx-auto bg-white/95 backdrop-blur border border-gray-100 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3">
            <div>
              <div className="font-display font-bold text-gray-900 leading-tight">{t.stickyBar.quickBooking}</div>
              <div className="text-sm text-gray-700 font-body">
                {price.nights ? `${formatMoney(totalUzs, 'UZS')} (${formatMoney(price.totalUsd, 'USD')})` : t.stickyBar.pickDates}
              </div>
            </div>

            <div className="flex-1" />

            <select
              value={stayType}
              onChange={(e) => update({ stayType: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg font-body"
            >
              <option value="guesthouse">{t.stickyBar.guesthouse}</option>
              <option value="apartments">{t.stickyBar.apartments}</option>
            </select>

            <input
              type="date"
              value={checkIn}
              min={isoToday()}
              onChange={(e) => update({ checkIn: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg font-body"
            />
            <input
              type="date"
              value={checkOut}
              min={checkIn || isoToday()}
              onChange={(e) => update({ checkOut: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg font-body"
            />
            <select
              value={guests}
              onChange={(e) => update({ guests: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-lg font-body"
            >
              {['1', '2', '3', '4', '5', '6'].map((g) => (
                <option key={g} value={g}>{g} {t.stickyBar.guests}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={go}
              className={`btn-primary py-2 px-5 ${canGo ? '' : 'opacity-80'}`}
              title={overlaps ? t.stickyBar.datesTaken : ''}
            >
              {overlaps ? t.stickyBar.booked : t.stickyBar.toForm}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-40">
        <div className="px-4 pb-4">
          <div className="bg-white/95 backdrop-blur border border-gray-100 shadow-2xl rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="font-display font-bold text-gray-900">{t.stickyBar.quickBooking}</div>
              <div className="flex-1" />
              <button type="button" className="btn-secondary py-2 px-4" onClick={() => setOpen((v) => !v)}>
                {open ? t.stickyBar.hide : t.stickyBar.show}
              </button>
              <button type="button" className="btn-primary py-2 px-4" onClick={go}>
                {t.stickyBar.toForm}
              </button>
            </div>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 grid gap-3"
                >
                  <select
                    value={stayType}
                    onChange={(e) => update({ stayType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-body"
                  >
                    <option value="guesthouse">{t.stickyBar.guesthouse}</option>
                    <option value="apartments">{t.stickyBar.apartments}</option>
                  </select>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={checkIn}
                      min={isoToday()}
                      onChange={(e) => update({ checkIn: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-body"
                    />
                    <input
                      type="date"
                      value={checkOut}
                      min={checkIn || isoToday()}
                      onChange={(e) => update({ checkOut: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-body"
                    />
                  </div>

                  <select
                    value={guests}
                    onChange={(e) => update({ guests: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg font-body"
                  >
                    {['1', '2', '3', '4', '5', '6'].map((g) => (
                      <option key={g} value={g}>{g} гостей</option>
                    ))}
                  </select>

                  {overlaps && (
                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 font-body">
                      {t.stickyBar.datesTaken}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  )
}

export default StickyBookingBar
