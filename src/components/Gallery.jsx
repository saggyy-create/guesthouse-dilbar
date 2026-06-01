import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { useLanguage } from '../context/LanguageContext'

const Gallery = () => {
  const { t } = useLanguage()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070',
      title: 'Exterior View'
    },
    {
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070',
      title: 'Lobby Area'
    },
    {
      url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070',
      title: 'Standard Room'
    },
    {
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2074',
      title: 'Deluxe Room'
    },
    {
      url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070',
      title: 'Suite'
    },
    {
      url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070',
      title: 'Bathroom'
    },
    {
      url: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=2070',
      title: 'Dining Area'
    },
    {
      url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070',
      title: 'Common Area'
    },
    {
      url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071',
      title: 'Terrace'
    }
  ]

  const openLightbox = (index) => {
    setCurrentIndex(index)
    setSelectedImage(images[index])
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const newIndex = (currentIndex + 1) % images.length
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  const prevImage = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">{t.gallery.title}</h2>
          <p className="section-subtitle">{t.gallery.subtitle}</p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative h-64 rounded-lg overflow-hidden cursor-pointer shadow-lg group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-body">
                  {image.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-white text-3xl hover:text-primary-400 transition-colors z-50"
                onClick={closeLightbox}
              >
                <FaTimes />
              </button>

              {/* Previous Button */}
              <button
                className="absolute left-4 text-white text-4xl hover:text-primary-400 transition-colors z-50"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
              >
                <FaChevronLeft />
              </button>

              {/* Next Button */}
              <button
                className="absolute right-4 text-white text-4xl hover:text-primary-400 transition-colors z-50"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
              >
                <FaChevronRight />
              </button>

              {/* Image */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="max-w-6xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain rounded-lg"
                />
                <p className="text-white text-center mt-4 text-xl font-semibold font-display">
                  {selectedImage.title}
                </p>
              </motion.div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-body">
                {currentIndex + 1} / {images.length}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Gallery
