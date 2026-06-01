import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { lazy, Suspense } from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import { guesthouse } from '../data/guesthouse'

const LazyLeafletMap = lazy(() => import('./LeafletMap'))

const Location = () => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const position = [41.2995, 69.2401]

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt size={24} />,
      title: t.location.address,
      content: 'Ташкент, центр города',
      link: 'https://maps.google.com',
    },
    {
      icon: <FaPhone size={24} />,
      title: t.location.phone,
      content: '+998 88 912 58 38',
      link: 'tel:+998889125838',
    },
    {
      icon: <FaClock size={24} />,
      title: 'Заезд / Выезд',
      content: `${guesthouse.checkIn} / ${guesthouse.checkOut}`,
      link: null,
    },
    {
      icon: <FaEnvelope size={24} />,
      title: t.location.email,
      content: 'dilbar@example.com',
      link: 'mailto:dilbar@example.com',
    },
  ]

  return (
    <section id="location" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t.location.title}</h2>
          <p className="section-subtitle">{t.location.subtitle}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="bg-primary-100 p-4 rounded-xl text-primary-600">
                  {info.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1 font-display">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-gray-600 hover:text-primary-600 transition-colors font-body"
                      target={info.link.startsWith('http') ? '_blank' : ''}
                      rel={info.link.startsWith('http') ? 'noopener noreferrer' : ''}
                    >
                      {info.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 font-body">{info.content}</p>
                  )}
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-3 font-display">Парковка</h3>
              <p className="text-gray-600 font-body">
                Бесплатная открытая парковка. Требуется предварительное бронирование.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex gap-3"
            >
              <a
                href={contactInfo[1].link}
                className="btn-primary"
              >
                {t.location.phone}
              </a>
              <a
                href={contactInfo[0].link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                {t.location.getDirections}
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-[450px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Suspense fallback={<div className="h-full bg-gray-200 animate-pulse" />}>
              <LazyLeafletMap position={position} />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Location
