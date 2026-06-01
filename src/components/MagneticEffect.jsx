import { useEffect } from 'react'

const MagneticEffect = () => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const buttons = document.querySelectorAll('button, a.btn-primary, a.btn-secondary, .magnetic')
      
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect()
        const buttonCenterX = rect.left + rect.width / 2
        const buttonCenterY = rect.top + rect.height / 2
        
        const distanceX = e.clientX - buttonCenterX
        const distanceY = e.clientY - buttonCenterY
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
        
        // Magnetic effect radius
        const magneticRadius = 150
        
        if (distance < magneticRadius) {
          const strength = (magneticRadius - distance) / magneticRadius
          const moveX = distanceX * strength * 0.3
          const moveY = distanceY * strength * 0.3
          
          button.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.1})`
          button.style.transition = 'transform 0.2s ease-out'
        } else {
          button.style.transform = 'translate(0, 0) scale(1)'
        }
      })
    }

    const handleMouseLeave = () => {
      const buttons = document.querySelectorAll('button, a.btn-primary, a.btn-secondary, .magnetic')
      buttons.forEach(button => {
        button.style.transform = 'translate(0, 0) scale(1)'
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return null
}

export default MagneticEffect
