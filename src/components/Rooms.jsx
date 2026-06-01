import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaUsers, FaBed, FaWifi, FaTv, FaSnowflake, FaCoffee, FaShower, FaUtensils, FaFaucet } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'
import { guesthouse } from '../data/guesthouse'

const Rooms = () => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const rooms = [
    {
      id: 1,
      name: 'Эконом (2 места)',
      price: '200 000',
      currency: 'сум/койка',
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070',
      guests: 2,
      amenities: ['WiFi', 'TV', 'AC', 'Холодильник'],
    },
    {
      id: 2,
      name: 'Стандарт (3 места)',
      price: '200 000',
      currency: 'сум/койка',
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074',
      guests: 3,
      amenities: ['WiFi', 'TV', 'AC', 'Холодильник', 'Фен'],
    },
    {
      id: 3,
      name: 'Семейный (4 места)',
      price: '200 000',
      currency: 'сум/койка',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074',
      guests: 4,
      amenities: ['WiFi', 'TV', 'AC', 'Мини-бар', 'Фен', 'Утюг'],
    },
    {
      id: 4,
      name: 'Просторный (5 мест)',
      price: '200 000',
      currency: 'сум/койка',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
      guests: 5,
      amenities: ['WiFi', 'TV', 'AC', 'Холодильник', 'Красивый вид'],
    },
    {
      id: 5,
      name: 'Deluxe (2 места)',
      price: '250 000',
      currency: 'сум/койка',
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070',
      guests: 2,
      amenities: ['WiFi', 'TV', 'AC', 'Мини-бар', 'Тапочки', 'Халат'],
    },
  ]

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <FaWifi />,
      'TV': <FaTv />,
      'AC': <FaSnowflake />,
      'Холодильник': <FaFaucet />,
      'Мини-бар': <FaCoffee />,
      'Фен': <FaShower />,
      'Утюг': <FaUtensils />,
      'Красивый вид': <FaBed />,
      'Тапочки': <FaBed />,
      'Халат': <FaBed />,
    }
    return icons[amenity] || <FaBed />
  }

  return (
    <section id="rooms" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t.rooms.title}</h2>
          <p className="section-subtitle">
            {guesthouse.rooms} номеров · {guesthouse.totalPlaces} мест · от {guesthouse.priceFromUzs.toLocaleString()} сум
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
              className="card group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full font-bold shadow-lg font-sans">
                  {room.price}
                  <span className="text-sm font-normal">/{room.currency}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-display">{room.name}</h3>

                <div className="flex items-center text-gray-600 mb-4 font-body">
                  <FaUsers className="mr-2" />
                  <span>до {room.guests} {t.rooms.guests}</span>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 font-sans">{t.rooms.amenities}:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-body">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full btn-primary font-sans"
                >
                  {t.rooms.viewDetails}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="/#/apartments" className="btn-secondary inline-block font-sans">
            Смотреть апартаменты
          </a>
        </div>
      </div>
    </section>
  )
}

export default Rooms
