import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const GlitchText = ({ children, className = '' }) => {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 200)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Main Text */}
      <motion.span
        className="relative z-10"
        animate={isGlitching ? {
          x: [0, -2, 2, -2, 2, 0],
          y: [0, 2, -2, 2, -2, 0],
        } : {}}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>

      {/* Red Glitch Layer */}
      <motion.span
        className="absolute top-0 left-0 text-red-500 opacity-0"
        style={{ mixBlendMode: 'screen' }}
        animate={isGlitching ? {
          opacity: [0, 0.8, 0],
          x: [-2, 2, -2],
          y: [1, -1, 1],
        } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>

      {/* Blue Glitch Layer */}
      <motion.span
        className="absolute top-0 left-0 text-blue-500 opacity-0"
        style={{ mixBlendMode: 'screen' }}
        animate={isGlitching ? {
          opacity: [0, 0.8, 0],
          x: [2, -2, 2],
          y: [-1, 1, -1],
        } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>

      {/* Green Glitch Layer */}
      <motion.span
        className="absolute top-0 left-0 text-green-500 opacity-0"
        style={{ mixBlendMode: 'screen' }}
        animate={isGlitching ? {
          opacity: [0, 0.6, 0],
          x: [1, -1, 1],
          y: [2, -2, 2],
        } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </div>
  )
}

export default GlitchText
