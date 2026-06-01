import { motion } from 'framer-motion'
import { FaFacebook, FaInstagram, FaTwitter, FaTripadvisor, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const Footer = ({ showApartmentsLink = true }) => {
  const { t } = useLanguage()

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const quickLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'rooms', label: t.nav.rooms },
    ...(showApartmentsLink ? [{ id: 'apartments', label: 'Апартаменты' }] : []),
    { id: 'compare', label: 'Сравнение' },
    { id: 'gallery', label: t.nav.gallery },
    { id: 'availability', label: 'Занятость' },
    { id: 'booking', label: t.nav.booking },
    { id: 'faq', label: 'FAQ' },
    { id: 'reviews', label: t.nav.reviews }
  ]

  const socialLinks = [
    { icon: <FaFacebook size={24} />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaInstagram size={24} />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaTwitter size={24} />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaTripadvisor size={24} />, url: 'https://tripadvisor.com', label: 'TripAdvisor' }
  ]

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-display font-bold mb-4" style={{ letterSpacing: '-0.02em' }}>
                Guesthouse <span className="text-primary-400">Dilbar</span>
              </h3>
              <p className="text-gray-400 leading-relaxed mb-4 font-body">
                {t.footer.description}
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, color: '#f39333' }}
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-4">{t.footer.quickLinks}</h4>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                {showApartmentsLink && (
                  <li>
                    <a href="/#/apartments" className="text-gray-400 hover:text-primary-400 transition-colors">
                      Апартаменты (раздел)
                    </a>
                  </li>
                )}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-4">{t.footer.contact}</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-400">123 Main Street, City Center</span>
                </li>
                <li className="flex items-start space-x-3">
                  <FaPhone className="text-primary-400 mt-1 flex-shrink-0" />
                  <a href="tel:+998901234567" className="text-gray-400 hover:text-primary-400 transition-colors">
                    +998 90 123 45 67
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <FaEnvelope className="text-primary-400 mt-1 flex-shrink-0" />
                  <a href="mailto:info@guesthousedilbar.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                    info@guesthousedilbar.com
                  </a>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Newsletter */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="text-xl font-bold mb-4 font-display">Newsletter</h4>
              <p className="text-gray-400 mb-4 font-body">
                Подпишитесь, чтобы получать специальные предложения и обновления
              </p>
              <form className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary-400 focus:outline-none transition-colors font-body"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors font-sans"
                >
                  Подписаться
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8 text-center"
        >
          <p className="text-gray-400 font-body">
            &copy; {new Date().getFullYear()} Guesthouse Dilbar. {t.footer.rights}
          </p>
          <p className="text-gray-500 text-sm mt-2 font-body">
            Создано с любовью для исключительного гостеприимства
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
