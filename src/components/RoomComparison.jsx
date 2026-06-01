import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useLanguage } from '../context/LanguageContext'

const RoomComparison = () => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const rows = [
    { label: 'Вместимость', эконом: '2', стандарт: '3', семейный: '4', просторный: '5', deluxe: '2' },
    { label: 'WiFi', эконом: '✓', стандарт: '✓', семейный: '✓', просторный: '✓', deluxe: '✓' },
    { label: 'Кондиционер', эконом: '✓', стандарт: '✓', семейный: '✓', просторный: '✓', deluxe: '✓' },
    { label: 'TV', эконом: '✓', стандарт: '✓', семейный: '✓', просторный: '✓', deluxe: '✓' },
    { label: 'Холодильник', эконом: '✓', стандарт: '✓', семейный: '✓', просторный: '✓', deluxe: '✓' },
    { label: 'Мини-бар', эконом: '—', стандарт: '—', семейный: '—', просторный: '—', deluxe: '✓' },
    { label: 'Фен', эконом: '—', стандарт: '✓', семейный: '✓', просторный: '✓', deluxe: '✓' },
    { label: 'Утюг', эконом: '—', стандарт: '—', семейный: '✓', просторный: '—', deluxe: '✓' },
    { label: 'Тапочки', эконом: '—', стандарт: '—', семейный: '—', просторный: '—', deluxe: '✓' },
    { label: 'Красивый вид', эконом: '—', стандарт: '—', семейный: '—', просторный: '✓', deluxe: '—' },
    { label: 'Цена/койка', эконом: '200K', стандарт: '200K', семейный: '200K', просторный: '200K', deluxe: '250K' },
  ]

  return (
    <section id="compare" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Сравнение номеров</h2>
          <p className="section-subtitle">Быстро выберите вариант, который подходит вам по удобствам и вместимости.</p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="overflow-x-auto rounded-2xl shadow-xl bg-white border border-gray-100">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-4 font-semibold text-gray-700 font-sans">Параметр</th>
                  <th className="px-4 py-4 font-display font-bold text-gray-900">Эконом</th>
                  <th className="px-4 py-4 font-display font-bold text-gray-900">Стандарт</th>
                  <th className="px-4 py-4 font-display font-bold text-gray-900">Семейный</th>
                  <th className="px-4 py-4 font-display font-bold text-gray-900">Просторный</th>
                  <th className="px-4 py-4 font-display font-bold text-gray-900">Deluxe</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.label} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                    <td className="px-4 py-4 text-gray-700 font-body font-semibold">{r.label}</td>
                    <td className="px-4 py-4 text-center text-gray-900 font-body">{r.эконом}</td>
                    <td className="px-4 py-4 text-center text-gray-900 font-body">{r.стандарт}</td>
                    <td className="px-4 py-4 text-center text-gray-900 font-body">{r.семейный}</td>
                    <td className="px-4 py-4 text-center text-gray-900 font-body">{r.просторный}</td>
                    <td className="px-4 py-4 text-center text-gray-900 font-body">{r.deluxe}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-10">
            <button
              className="btn-primary font-sans"
              onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              type="button"
            >
              Перейти к бронированию
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoomComparison
