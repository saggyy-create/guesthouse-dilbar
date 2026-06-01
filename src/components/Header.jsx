import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaBars, FaTimes, FaGlobe } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const Header = ({ showApartmentsLink = true }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'rooms', label: t.nav.rooms },
    ...(showApartmentsLink ? [{ id: 'apartments', label: t.nav.apartments }] : []),
    { id: 'compare', label: t.nav.compare },
    { id: 'gallery', label: t.nav.gallery },
    { id: 'availability', label: t.nav.availability },
    { id: 'booking', label: t.nav.booking },
    { id: 'faq', label: 'FAQ' },
    { id: 'reviews', label: t.nav.reviews },
    { id: 'location', label: t.nav.contact }
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => scrollToSection('home')}
          >
            <div className={`text-2xl md:text-3xl font-display font-bold ${
              isScrolled ? 'text-primary-600' : 'text-white'
            }`} style={{ letterSpacing: '-0.02em' }}>
              Guesthouse <span className="text-accent-500">Dilbar</span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`font-medium transition-colors duration-300 hover:text-primary-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {item.label}
              </button>
            ))}

            {showApartmentsLink && (
              <a
                href="/#/apartments"
                className={`font-semibold transition-colors duration-300 hover:text-primary-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                {t.nav.apartmentsSection}
              </a>
            )}
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'bg-primary-100 text-primary-600 hover:bg-primary-200' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FaGlobe />
              <span className="font-semibold">{language.toUpperCase()}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className={`p-2 rounded-lg ${
                isScrolled ? 'text-primary-600' : 'text-white'
              }`}
            >
              <FaGlobe size={20} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`text-2xl ${isScrolled ? 'text-gray-700' : 'text-white'}`}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 bg-white rounded-lg shadow-xl overflow-hidden"
          >
            <div className="flex flex-col py-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-6 py-3 text-left text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-300"
                >
                  {item.label}
                </button>
              ))}
              {showApartmentsLink && (
                <a
                  href="/#/apartments"
                  className="px-6 py-3 text-left text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-300"
                >
                  {t.nav.apartmentsSection}
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  )
}

export default Header
