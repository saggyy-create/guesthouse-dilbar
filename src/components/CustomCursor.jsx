import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')
  const [trail, setTrail] = useState([])

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      
      // Add to trail
      setTrail(prev => [...prev.slice(-20), { x: e.clientX, y: e.clientY, id: Date.now() }])
    }

    const mouseEnterButton = () => setCursorVariant('button')
    const mouseLeaveButton = () => setCursorVariant('default')

    window.addEventListener('mousemove', mouseMove)

    // Add listeners to all interactive elements
    const buttons = document.querySelectorAll('button, a, input, textarea, select')
    buttons.forEach(button => {
      button.addEventListener('mouseenter', mouseEnterButton)
      button.addEventListener('mouseleave', mouseLeaveButton)
    })

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      buttons.forEach(button => {
        button.removeEventListener('mouseenter', mouseEnterButton)
        button.removeEventListener('mouseleave', mouseLeaveButton)
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: 'rgba(243, 147, 51, 0.5)',
    },
    button: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      scale: 2,
      backgroundColor: 'rgba(14, 165, 233, 0.5)',
    }
  }

  return (
    <>
      {/* Trail Effect */}
      {trail.map((point, index) => (
        <motion.div
          key={point.id}
          className="fixed w-2 h-2 rounded-full pointer-events-none z-50"
          style={{
            left: point.x - 4,
            top: point.y - 4,
            background: `rgba(243, 147, 51, ${0.5 - (index / trail.length) * 0.5})`
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}

      {/* Main Cursor */}
      <motion.div
        className="fixed w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        variants={variants}
        animate={cursorVariant}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        {/* Inner Dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
          style={{ transform: 'translate(-50%, -50%)' }}
          animate={{
            scale: [1, 1.5, 1],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>

      {/* Outer Ring */}
      <motion.div
        className="fixed w-12 h-12 border-2 border-primary-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 24,
          y: mousePosition.y - 24,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      />
    </>
  )
}

export default CustomCursor
