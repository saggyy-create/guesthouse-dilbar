import { LanguageProvider } from '../context/LanguageContext'
import Seo from '../components/Seo'
import AdminFab from '../components/AdminFab'
import StickyBookingBar from '../components/StickyBookingBar'
import Header from '../components/Header'
import Hero from '../components/Hero'
import About from '../components/About'
import Rooms from '../components/Rooms'
import RoomComparison from '../components/RoomComparison'
import Gallery from '../components/Gallery'
import AvailabilityCalendar from '../components/AvailabilityCalendar'
import Booking from '../components/Booking'
import FAQ from '../components/FAQ'
import Reviews from '../components/Reviews'
import Location from '../components/Location'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen">
        <Seo />
        <AdminFab />
        <StickyBookingBar defaultStayType="guesthouse" />
        <Header showApartmentsLink={false} />
        <Hero />
        <About />
        <Rooms />
        <RoomComparison />
        <Gallery />
        <AvailabilityCalendar />
        <Booking />
        <FAQ />
        <Reviews />
        <Location />
        <Footer showApartmentsLink={false} />
      </div>
    </LanguageProvider>
  )
}

export default HomePage
