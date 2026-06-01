import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FaCalendar, FaUser, FaBed, FaEnvelope, FaPhone } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import { useAvailabilityMergedByCal } from '../hooks/useAvailabilityMergedByCal'
import { CAL_IDS } from '../data/calendars'
import { doesRangeOverlapInclusive, parseISODate } from '../utils/dateRange'
import { calculatePriceUsd } from '../utils/pricing'
import { convert, formatMoney, loadCurrencyPref } from '../utils/currency'
import { useBookingDraft } from '../hooks/useBookingDraft'
import { apiPostBooking } from '../utils/api'

const Booking = ({ initialStayType = 'guesthouse', lockStayType = false, apartmentCalId = null }) => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const [formData, setFormData] = useState({
    stayType: initialStayType,
    checkIn: null,
    checkOut: null,
    guests: 1,
    roomType: '',
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  })

  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)

  const { draft, update: updateDraft } = useBookingDraft()

  const currencyPref = useMemo(() => loadCurrencyPref(), [])

  const bookingText = useMemo(() => {
    const fmt = (d) => (d ? d.toLocaleDateString('ru-RU') : '—')
    const roomLabel =
      formData.roomType === 'standard'
        ? t.rooms.standard
        : formData.roomType === 'deluxe'
          ? t.rooms.deluxe
          : formData.roomType === 'suite'
            ? t.rooms.suite
            : '—'

    const stayLabel = formData.stayType === 'apartments' ? 'Апартаменты' : 'Гостевой дом'
    const aptLabel = formData.stayType === 'apartments' && apartmentCalId
      ? `Квартира: ${String(apartmentCalId).replace('apartments-', '#')}`
      : null

    return [
      'Заявка на бронирование (Guesthouse Dilbar)',
      '',
      `Заезд: ${fmt(formData.checkIn)}`,
      `Выезд: ${fmt(formData.checkOut)}`,
      `Гостей: ${formData.guests || '—'}`,
      `Формат: ${stayLabel}`,
      ...(aptLabel ? [aptLabel] : []),
      `Тип номера: ${roomLabel}`,
      '',
      `Имя: ${formData.name || '—'}`,
      `Телефон: ${formData.phone || '—'}`,
      `Email: ${formData.email || '—'}`,
      '',
      `Пожелания: ${formData.specialRequests || '—'}`,
    ].join('\n')
  }, [formData, t.rooms.deluxe, t.rooms.standard, t.rooms.suite])

  const calId = formData.stayType === 'apartments'
    ? (apartmentCalId || CAL_IDS.apartments1)
    : CAL_IDS.guesthouse
  const { ranges } = useAvailabilityMergedByCal(calId)

  const blocked = useMemo(() => {
    return ranges.map((r) => ({
      start: parseISODate(r.start),
      end: parseISODate(r.end),
      reason: r.reason,
    }))
  }, [ranges])

  const isValid =
    !!formData.checkIn &&
    !!formData.checkOut &&
    (formData.stayType === 'apartments' ? true : !!formData.roomType) &&
    !!formData.name &&
    !!formData.email &&
    !!formData.phone

  const overlapsBlocked = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) return false
    const aStart = formData.checkIn
    // Treat end as inclusive for user expectation.
    const aEnd = formData.checkOut
    return blocked.some((r) => doesRangeOverlapInclusive(aStart, aEnd, r.start, r.end))
  }, [blocked, formData.checkIn, formData.checkOut])

  const whatsappHref = useMemo(() => {
    const phone = '998889125838'
    const text = encodeURIComponent(bookingText)
    return `https://wa.me/${phone}?text=${text}`
  }, [bookingText])

  const price = useMemo(() => {
    return calculatePriceUsd({
      stayType: formData.stayType,
      roomType: formData.roomType,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: formData.guests,
    })
  }, [formData.checkIn, formData.checkOut, formData.guests, formData.roomType, formData.stayType])

  const totalUzs = useMemo(() => convert(price.totalUsd, 'USD', 'UZS', currencyPref.usdToUzs), [currencyPref.usdToUzs, price.totalUsd])
  const nightlyUzs = useMemo(() => convert(price.nightlyUsd, 'USD', 'UZS', currencyPref.usdToUzs), [currencyPref.usdToUzs, price.nightlyUsd])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!isValid || overlapsBlocked) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    // Save booking to API (fire-and-forget with toast)
    apiPostBooking({
      stayType: formData.stayType,
      checkIn: formData.checkIn?.toISOString?.()?.slice(0, 10) || formData.checkIn,
      checkOut: formData.checkOut?.toISOString?.()?.slice(0, 10) || formData.checkOut,
      guests: formData.guests,
      roomType: formData.roomType || null,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      specialRequests: formData.specialRequests || '',
    }).catch(() => {}) // silent fail - not critical

    setShowSuccess(true)
    setTimeout(() => {
      setShowSuccess(false)
      setFormData({
        stayType: initialStayType,
        checkIn: null,
        checkOut: null,
        guests: 1,
        roomType: '',
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
      })
    }, 3000)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === 'stayType') updateDraft({ stayType: value })
    if (field === 'guests') updateDraft({ guests: String(value) })
  }

  useEffect(() => {
    // Sync draft -> form (dates/guests/stayType).
    // Only overwrite when draft values exist.
    setFormData((prev) => {
      const next = { ...prev }
      if (draft?.stayType && !lockStayType) next.stayType = draft.stayType
      if (draft?.guests) next.guests = draft.guests
      if (draft?.checkIn) next.checkIn = new Date(draft.checkIn)
      if (draft?.checkOut) next.checkOut = new Date(draft.checkOut)
      return next
    })
  }, [draft, lockStayType])

  const copyBookingText = async () => {
    try {
      await navigator.clipboard.writeText(bookingText)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch {
      // Clipboard might be blocked; fall back to selecting text is overkill here.
      setShowError(true)
      setTimeout(() => setShowError(false), 2000)
    }
  }

  return (
    <section id="booking" className="py-20 bg-gradient-to-b from-white to-primary-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t.booking.title}</h2>
          <p className="section-subtitle">{t.booking.subtitle}</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl p-8 md:p-12"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Price Preview */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="font-display font-bold text-gray-900 text-xl">{t.booking.price}</div>
                    <div className="text-gray-600 font-body mt-1">
                      {t.booking.priceNote}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 font-sans">
                      {price.nights ? formatMoney(totalUzs, 'UZS') : '—'}
                    </div>
                    <div className="text-sm text-gray-600 font-body">
                      {price.nights ? `${formatMoney(price.totalUsd, 'USD')} • ${price.nights} ноч.` : ''}
                    </div>
                  </div>
                </div>

                {price.nights ? (
                  <div className="mt-4 grid sm:grid-cols-3 gap-3">
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="text-xs text-gray-500 font-body">{t.booking.perNight}</div>
                      <div className="font-bold text-gray-900 font-sans mt-1">{formatMoney(nightlyUzs, 'UZS')}</div>
                      <div className="text-xs text-gray-500 font-body">({formatMoney(price.nightlyUsd, 'USD')})</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="text-xs text-gray-500 font-body">{t.booking.seasonalMultiplier}</div>
                      <div className="font-bold text-gray-900 font-sans mt-1">×{price.multiplier}</div>
                      <div className="text-xs text-gray-500 font-body">по месяцу заезда</div>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="text-xs text-gray-500 font-body">{t.booking.currency}</div>
                      <div className="font-bold text-gray-900 font-sans mt-1">UZS + USD</div>
                      <div className="text-xs text-gray-500 font-body">{t.booking.rate}: 1 USD = {currencyPref.usdToUzs} UZS</div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 text-sm text-gray-600 font-body">
                    {t.booking.pickDates}
                  </div>
                )}
              </div>
              {/* Date Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 font-sans">
                    <FaCalendar className="inline mr-2" />
                    {t.booking.checkIn}
                  </label>
                  <DatePicker
                    selected={formData.checkIn}
                    onChange={(date) => {
                      handleChange('checkIn', date)
                      updateDraft({ checkIn: date ? date.toISOString().slice(0, 10) : '' })
                    }}
                    minDate={new Date()}
                    excludeDateIntervals={blocked}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                    placeholderText="Выберите дату"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 font-sans">
                    <FaCalendar className="inline mr-2" />
                    {t.booking.checkOut}
                  </label>
                  <DatePicker
                    selected={formData.checkOut}
                    onChange={(date) => {
                      handleChange('checkOut', date)
                      updateDraft({ checkOut: date ? date.toISOString().slice(0, 10) : '' })
                    }}
                    minDate={formData.checkIn || new Date()}
                    excludeDateIntervals={blocked}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                    placeholderText="Выберите дату"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>

              {/* Guests and Stay Type */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 font-sans">
                    <FaUser className="inline mr-2" />
                    {t.booking.guests}
                  </label>
                  <select
                    value={formData.guests}
                    onChange={(e) => handleChange('guests', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 font-sans">
                    <FaBed className="inline mr-2" />
                    {t.booking.stayFormat}
                  </label>
                  <select
                    value={formData.stayType}
                    onChange={(e) => {
                      const v = e.target.value
                      handleChange('stayType', v)
                      if (v === 'apartments') handleChange('roomType', '')
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                    disabled={lockStayType}
                  >
                    <option value="guesthouse">{t.booking.guesthouse}</option>
                    <option value="apartments">{t.booking.apartmentOption}</option>
                  </select>
                  {lockStayType && (
                    <p className="text-xs text-gray-500 mt-2 font-body">
                      {t.booking.stayFormat} фиксирован для этой страницы.
                    </p>
                  )}
                </div>
              </div>

              {/* Room Type (only for guesthouse) */}
              {formData.stayType !== 'apartments' && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 font-sans">
                    <FaBed className="inline mr-2" />
                    {t.booking.roomType}
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => handleChange('roomType', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                  >
                    <option value="">{t.booking.selectRoom}</option>
                    <option value="standard">{t.rooms.standard}</option>
                    <option value="deluxe">{t.rooms.deluxe}</option>
                    <option value="suite">{t.rooms.suite}</option>
                  </select>
                </div>
              )}

              {/* Personal Information */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 font-sans">
                  <FaUser className="inline mr-2" />
                  {t.booking.name}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                  placeholder="Иван Иванов"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 font-sans">
                    <FaEnvelope className="inline mr-2" />
                    {t.booking.email}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 font-sans">
                    <FaPhone className="inline mr-2" />
                    {t.booking.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors font-body"
                    placeholder="+998 90 123 45 67"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 font-sans">
                  {t.booking.specialRequests}
                </label>
                <textarea
                  value={formData.specialRequests}
                  onChange={(e) => handleChange('specialRequests', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none transition-colors resize-none font-body"
                  placeholder="Любые особые пожелания..."
                />
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full btn-primary text-lg font-sans"
              >
                {t.booking.submit}
              </motion.button>

              {/* Practical actions (no backend) */}
              <div className="grid sm:grid-cols-2 gap-3">
                <a
                  className={`btn-secondary text-center font-sans ${isValid && !overlapsBlocked ? '' : 'opacity-50 pointer-events-none'}`}
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!isValid || overlapsBlocked}
                >
                  {t.booking.sendWhatsApp}
                </a>
                <button
                  type="button"
                  onClick={copyBookingText}
                  className="btn-secondary font-sans"
                >
                  {t.booking.copyRequest}
                </button>
              </div>

              {/* Success/Error Messages */}
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-lg text-center font-semibold font-body"
                >
                  {t.booking.done}
                </motion.div>
              )}

              {showError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-center font-semibold font-body"
                >
                  {overlapsBlocked ? t.booking.datesUnavailable : t.booking.error}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Booking
