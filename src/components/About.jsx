import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaHome, FaUsers, FaWifi, FaUtensils, FaTshirt, FaCar, FaChild, FaHotTub } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import { guesthouse } from '../data/guesthouse'

const iconMap = {
  'Wi-Fi (бесплатно)': <FaWifi size={24} />,
  'Общая кухня': <FaUtensils size={24} />,
  'Прачечная / химчистка': <FaTshirt size={24} />,
  'Детская площадка': <FaChild size={24} />,
  'Баня': <FaHotTub size={24} />,
}

const About = () => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const keyFeatures = [
    { icon: <FaHome size={36} />, title: `${guesthouse.rooms} номеров`, desc: `до ${guesthouse.totalPlaces} мест` },
    { icon: <FaUsers size={36} />, title: 'Открыто в 2013', desc: 'Более 10 лет опыта' },
    { icon: <FaCar size={36} />, title: 'Парковка', desc: 'Бесплатно, по записи' },
    { icon: <FaUtensils size={36} />, title: 'Питание', desc: 'Завтрак / столовая' },
  ]

  const topServices = guesthouse.services.slice(0, 6)

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t.about.title}</h2>
          <p className="section-subtitle">{guesthouse.description.short}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070"
                alt="Guesthouse Interior"
                className="w-full h-full object-cover"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-2xl"
            >
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600 mb-2 font-display">{guesthouse.totalPlaces}</div>
                <div className="text-gray-600 font-medium font-body">мест</div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-body">
              {guesthouse.description.full}
            </p>
            <p className="text-gray-600 leading-relaxed mb-8 font-body italic">
              "{guesthouse.description.review}"
            </p>

            <div className="grid grid-cols-2 gap-4">
              {keyFeatures.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="text-primary-600 mb-2">{f.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 font-display">{f.title}</h3>
                  <p className="text-gray-600 text-sm font-body">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-2xl font-display font-bold text-gray-900 text-center mb-8">Удобства и услуги</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topServices.map((svc) => (
              <div key={svc} className="flex items-center gap-3 bg-white p-4 rounded-xl shadow border border-gray-100">
                <div className="text-primary-600 flex-shrink-0">
                  {Object.entries(iconMap).find(([k]) => svc.startsWith(k))?.[1] || <FaHome size={24} />}
                </div>
                <span className="text-gray-700 font-body">{svc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
