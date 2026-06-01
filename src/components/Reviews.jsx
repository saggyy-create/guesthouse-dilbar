import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaStar, FaQuoteLeft } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const Reviews = () => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      country: 'USA',
      rating: 5,
      text: 'Amazing experience! The staff was incredibly friendly and the rooms were spotless. The location is perfect for exploring the city. Highly recommend!',
      image: 'https://i.pravatar.cc/150?img=1',
      date: '2024-03-15'
    },
    {
      id: 2,
      name: 'Michael Chen',
      country: 'Singapore',
      rating: 5,
      text: 'Best guesthouse I have stayed at! Beautiful interior design, comfortable beds, and excellent service. Will definitely come back.',
      image: 'https://i.pravatar.cc/150?img=13',
      date: '2024-03-10'
    },
    {
      id: 3,
      name: 'Emma Williams',
      country: 'UK',
      rating: 5,
      text: 'Wonderful stay! The attention to detail is impressive. Breakfast was delicious and the common areas are beautifully decorated. Felt like home.',
      image: 'https://i.pravatar.cc/150?img=5',
      date: '2024-03-05'
    },
    {
      id: 4,
      name: 'Carlos Rodriguez',
      country: 'Spain',
      rating: 5,
      text: 'Exceptional hospitality! The owners went above and beyond to make our stay comfortable. Great value for money and perfect location.',
      image: 'https://i.pravatar.cc/150?img=12',
      date: '2024-02-28'
    },
    {
      id: 5,
      name: 'Yuki Tanaka',
      country: 'Japan',
      rating: 5,
      text: 'Very clean and cozy! The room exceeded our expectations. WiFi was fast, and the neighborhood is safe and convenient. Highly recommended!',
      image: 'https://i.pravatar.cc/150?img=9',
      date: '2024-02-20'
    },
    {
      id: 6,
      name: 'Sophie Martin',
      country: 'France',
      rating: 5,
      text: 'Perfect place to stay! Beautiful decor, comfortable amenities, and the staff made us feel so welcome. Would love to return soon!',
      image: 'https://i.pravatar.cc/150?img=10',
      date: '2024-02-15'
    }
  ]

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t.reviews.title}</h2>
          <p className="section-subtitle">{t.reviews.subtitle}</p>
        </motion.div>

        {/* Overall Rating */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-16 bg-white rounded-2xl shadow-xl p-8 text-center"
        >
          <div className="text-6xl font-bold text-primary-600 mb-2 font-display">5.0</div>
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-2xl mx-1" />
            ))}
          </div>
          <p className="text-gray-600 text-lg font-body">На основе {reviews.length}+ отзывов</p>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl shadow-lg p-6 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-primary-200 text-4xl">
                <FaQuoteLeft />
              </div>

              {/* User Info */}
              <div className="flex items-center mb-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover mr-4 border-4 border-primary-100"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg font-display">{review.name}</h4>
                  <p className="text-gray-600 text-sm font-body">{review.country}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-lg" />
                ))}
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-4 font-body" style={{ lineHeight: '1.7' }}>
                "{review.text}"
              </p>

              {/* Date */}
              <p className="text-gray-500 text-sm font-body">
                {new Date(review.date).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-gray-700 mb-6 font-body">
            Присоединяйтесь к сотням довольных гостей!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary font-sans"
          >
            Забронировать сейчас
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Reviews
