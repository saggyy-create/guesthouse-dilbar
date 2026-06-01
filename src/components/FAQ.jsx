import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { guesthouse } from '../data/guesthouse'

const FAQ = () => {
  const [open, setOpen] = useState(0)
  const items = guesthouse.faq

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">FAQ и правила</h2>
          <p className="section-subtitle">Коротко отвечаем на самые частые вопросы, чтобы бронирование было проще.</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {items.map((it, idx) => {
            const isOpen = open === idx
            return (
              <div key={it.q} className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left px-6 py-5 flex items-center justify-between"
                  onClick={() => setOpen((cur) => (cur === idx ? -1 : idx))}
                >
                  <span className="font-display font-bold text-gray-900 text-lg">{it.q}</span>
                  <span className="text-primary-600 font-sans font-bold text-xl">{isOpen ? '−' : '+'}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-gray-700 font-body leading-relaxed">{it.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
