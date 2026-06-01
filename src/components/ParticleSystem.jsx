import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ParticleSystem = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Generate initial particles
    const initialParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      color: Math.random() > 0.5 ? '#f39333' : '#0ea5e9'
    }))
    setParticles(initialParticles)

    // Add particles on click
    const handleClick = (e) => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: Date.now() + i,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 6 + 3,
        duration: 2,
        delay: i * 0.05,
        color: ['#f39333', '#0ea5e9', '#f59e0b', '#06b6d4'][Math.floor(Math.random() * 4)],
        isClick: true
      }))
      
      setParticles(prev => [...prev, ...newParticles])
      
      // Remove click particles after animation
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !p.isClick || p.id < Date.now()))
      }, 2500)
    }

    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{
            x: particle.x,
            y: particle.y,
            opacity: particle.isClick ? 1 : 0.6,
            scale: particle.isClick ? 0 : 1,
          }}
          animate={particle.isClick ? {
            x: particle.x + (Math.random() - 0.5) * 200,
            y: particle.y + (Math.random() - 0.5) * 200,
            opacity: 0,
            scale: 1.5,
          } : {
            x: [particle.x, particle.x + (Math.random() - 0.5) * 100],
            y: [particle.y, particle.y + (Math.random() - 0.5) * 100],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: particle.isClick ? 0 : Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

export default ParticleSystem
