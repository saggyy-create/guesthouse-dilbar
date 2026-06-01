import { LanguageProvider, useLanguage } from '../context/LanguageContext'
import Seo from '../components/Seo'
import StickyBookingBar from '../components/StickyBookingBar'
import Header from '../components/Header'
import Apartments from '../components/Apartments'
import Booking from '../components/Booking'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import { apartments } from '../data/apartments'

const ApartmentsPageInner = () => {
  const { t } = useLanguage()

  return (
    <>
      <Seo title={t.apartments.title} description={t.apartments.subtitle} />
      <StickyBookingBar defaultStayType="apartments" />
      <Header showApartmentsLink={false} />
      <Apartments />

      <section className="pb-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900">Быстрый выбор</h2>
                <p className="text-gray-600 font-body mt-2">Открой страницу квартиры, там будет её календарь и бронирование.</p>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-3 gap-3">
              {apartments.map((a) => (
                <a key={a.id} className="btn-primary text-center" href={`/#/apartments/${a.id}`}>
                  {a.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Booking initialStayType="apartments" lockStayType />
      <FAQ />
      <Footer showApartmentsLink={false} />
    </>
  )
}

const ApartmentsPage = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <ApartmentsPageInner />
      </div>
    </LanguageProvider>
  )
}

export default ApartmentsPage
