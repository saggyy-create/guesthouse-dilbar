import { motion } from 'framer-motion'
import { useState } from 'react'

const HolographicCard = ({ children, className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02 }}
    >
      {/* Holographic Gradient Overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              circle at ${mousePosition.x}% ${mousePosition.y}%,
              rgba(243, 147, 51, 0.3) 0%,
              rgba(14, 165, 233, 0.2) 25%,
              rgba(168, 85, 247, 0.2) 50%,
              rgba(236, 72, 153, 0.2) 75%,
              transparent 100%
            )
          `,
        }}
      />

      {/* Rainbow Shine Effect */}
      <motion.div
        className="absolute inset-0 opacity-0 hover:opacity-50 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              ${mousePosition.x * 3.6}deg,
              rgba(255, 0, 0, 0.1),
              rgba(255, 154, 0, 0.1),
              rgba(208, 222, 33, 0.1),
              rgba(79, 220, 74, 0.1),
              rgba(63, 218, 216, 0.1),
              rgba(47, 201, 226, 0.1),
              rgba(28, 127, 238, 0.1),
              rgba(95, 21, 242, 0.1),
              rgba(186, 12, 248, 0.1),
              rgba(251, 7, 217, 0.1)
            )
          `,
        }}
      />

      {/* Sparkle Effect */}
      <motion.div
        className="absolute w-full h-full pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, white 0%, transparent 50%)`,
          opacity: 0.1,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Border Glow */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none"
        style={{
          boxShadow: `0 0 20px rgba(243, 147, 51, 0.5), inset 0 0 20px rgba(14, 165, 233, 0.3)`,
          opacity: 0,
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

export default HolographicCard
