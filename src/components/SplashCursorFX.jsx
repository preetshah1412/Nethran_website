import React, { useEffect, useRef } from 'react'

export default function SplashCursorFX() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    let w = 0, h = 0
    let raf
    const ripples = []
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
    }
    const addRipple = (x, y, s = 1) => {
      ripples.push({ x, y, t: 0, s })
    }
    const onMove = e => {
      addRipple(e.clientX, e.clientY, 0.6)
    }
    const onClick = e => {
      addRipple(e.clientX, e.clientY, 1.2)
    }
    resize()
    window.addEventListener('resize', resize)
    if (!prefersReduced) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('click', onClick)
    }
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.t += 0.018
        const R = Math.min(1.0, r.t) * 360 * r.s
        const alpha = Math.max(0, 0.28 - r.t * 0.22)
        const x = Math.floor(r.x * dpr)
        const y = Math.floor(r.y * dpr)
        const g = ctx.createRadialGradient(x, y, 0, x, y, R)
        g.addColorStop(0, `rgba(255,255,255,${alpha})`)
        g.addColorStop(0.6, `rgba(255,255,255,${alpha * 0.35})`)
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(x, y, R, 0, Math.PI * 2)
        ctx.fill()
        if (r.t > 1.2) ripples.splice(i, 1)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return <canvas ref={ref} className="bgfx-splash" />
}
