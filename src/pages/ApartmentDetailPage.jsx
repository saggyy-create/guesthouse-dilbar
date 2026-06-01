import { useMemo } from 'react'
import { LanguageProvider, useLanguage } from '../context/LanguageContext'
import Seo from '../components/Seo'
import Header from '../components/Header'
import StickyBookingBar from '../components/StickyBookingBar'
import ApartmentsAvailabilityCalendar from '../components/ApartmentsAvailabilityCalendar'
import Booking from '../components/Booking'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import { CAL_IDS, calendarMeta } from '../data/calendars'
import { getApartmentById } from '../data/apartments'

const calFor = (id) => {
  if (id === '1') return CAL_IDS.apartments1
  if (id === '2') return CAL_IDS.apartments2
  if (id === '3') return CAL_IDS.apartments3
  return null
}

const ApartmentDetailInner = ({ apartmentId, calId }) => {
  const { t } = useLanguage()
  const apt = getApartmentById(apartmentId)
  const meta = calId ? calendarMeta[calId] : null

  const seoTitle = apt?.title || meta?.label || `Apartment #${apartmentId}`
  const seoDesc = apt
    ? `${apt.title} — ${apt.subtitle}. ${apt.area}, до ${apt.guests} гостей. ${apt.location}.`
    : ''

  return (
    <>
      <Seo title={seoTitle} description={seoDesc} image={apt?.image} />
      <StickyBookingBar defaultStayType="apartments" apartmentCalId={calId} />
      <Header showApartmentsLink={false} />

      <section className="pt-28 pb-10 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-5xl font-display font-bold text-gray-900">{seoTitle}</h1>
              {apt?.subtitle && <p className="text-gray-700 font-body mt-3 text-xl">{apt.subtitle}</p>}
              <p className="text-gray-600 font-body mt-4 max-w-2xl">
                {apt
                  ? `Локация: ${apt.location}. Площадь: ${apt.area}. Вместимость: до ${apt.guests} гостей.`
                  : 'Подставим фото, адрес, описание и удобства, когда ты дашь информацию.'}
              </p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <a className="btn-secondary" href="/#/apartments">{t.apartments.backToAll}</a>
                <a className="btn-secondary" href="/#/">{t.apartments.backToHome}</a>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <img
                src={apt?.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070'}
                alt={seoTitle}
                className="w-full h-[320px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {calId && <ApartmentsAvailabilityCalendar calId={calId} />}

      <Booking initialStayType="apartments" lockStayType apartmentCalId={calId} />
      <FAQ />
      <Footer showApartmentsLink={false} />
    </>
  )
}

const ApartmentDetailPage = ({ apartmentId }) => {
  const calId = calFor(apartmentId)

  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <ApartmentDetailInner apartmentId={apartmentId} calId={calId} />
      </div>
    </LanguageProvider>
  )
}

export default ApartmentDetailPage
