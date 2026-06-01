import { useEffect, useRef } from 'react'

const LiquidBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let mouseX = 0
    let mouseY = 0
    let time = 0

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    class Wave {
      constructor(index) {
        this.index = index
        this.speed = 0.02 + index * 0.01
        this.amplitude = 30 + index * 10
        this.frequency = 0.01 + index * 0.005
        this.offset = index * Math.PI / 3
      }

      draw(ctx, time, mouseInfluence) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let x = 0; x < canvas.width; x += 5) {
          const distanceToMouse = Math.sqrt(
            Math.pow(x - mouseX, 2) + Math.pow(canvas.height / 2 - mouseY, 2)
          )
          const mouseEffect = Math.max(0, 1 - distanceToMouse / 300) * mouseInfluence

          const y = 
            canvas.height / 2 +
            Math.sin(x * this.frequency + time * this.speed + this.offset) * this.amplitude +
            mouseEffect * 50 * Math.sin(time * 2)

          ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, `rgba(243, 147, 51, ${0.05 + this.index * 0.02})`)
        gradient.addColorStop(0.5, `rgba(14, 165, 233, ${0.03 + this.index * 0.015})`)
        gradient.addColorStop(1, `rgba(243, 147, 51, ${0.02 + this.index * 0.01})`)

        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    const waves = [new Wave(0), new Wave(1), new Wave(2), new Wave(3)]

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.05

      const mouseInfluence = Math.min(
        1,
        Math.sqrt(Math.pow(mouseX - canvas.width / 2, 2) + Math.pow(mouseY - canvas.height / 2, 2)) / 500
      )

      waves.forEach(wave => wave.draw(ctx, time, mouseInfluence))

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  )
}

export default LiquidBackground
