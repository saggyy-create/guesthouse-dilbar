import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaBed, FaUsers, FaMapMarkerAlt, FaWifi, FaSnowflake, FaUtensils } from 'react-icons/fa'
import { apartments as apartmentsData } from '../data/apartments'

const Apartments = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const apartments = apartmentsData

  const iconFor = (f) => {
    if (f === 'WiFi') return <FaWifi />
    if (f === 'Кухня') return <FaUtensils />
    if (f === 'Кондиционер') return <FaSnowflake />
    return null
  }

  return (
    <section id="apartments" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Апартаменты</h2>
          <p className="section-subtitle">
            Отдельные квартиры для тех, кто хочет максимум приватности: кухня, пространство и свой ритм.
          </p>

          <div className="mt-6">
            <a className="btn-secondary inline-block" href="/#/">
              Перейти в гостевой дом
            </a>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {apartments.map((a, idx) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -8 }}
              className="card group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-display font-bold text-2xl leading-tight">{a.title}</div>
                  <div className="text-white/80 font-body">{a.subtitle}</div>
                  <div className="text-white/85 font-body flex items-center gap-2 mt-1">
                    <FaMapMarkerAlt /> {a.location}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-gray-900 font-bold font-sans">{a.area}</div>
                    <div className="text-gray-600 text-xs font-body">площадь</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-gray-900 font-bold font-sans flex items-center justify-center gap-2"><FaUsers /> {a.guests}</div>
                    <div className="text-gray-600 text-xs font-body">гостей</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-gray-900 font-bold font-sans flex items-center justify-center gap-2"><FaBed /> </div>
                    <div className="text-gray-600 text-xs font-body">{a.beds}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {a.features.map((f) => (
                    <span key={f} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-body">
                      {iconFor(f)} {f}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn-primary w-full font-sans"
                  onClick={() => window.location.assign(`/#/apartments/${a.id}`)}
                >
                  Открыть страницу
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Apartments
