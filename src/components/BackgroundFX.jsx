import React, { useEffect } from 'react'


export default function BackgroundFX() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const docEl = document.documentElement
    let targetX = window.innerWidth / 2
    let targetY = window.innerHeight / 2
    let mx = targetX
    let my = targetY
    let rafId
    const trailEls = Array.from(document.querySelectorAll('.trail-dot'))
    const trail = new Array(trailEls.length).fill(0).map(() => ({ x: mx, y: my }))

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const loop = () => {
      mx += (targetX - mx) * 0.12
      my += (targetY - my) * 0.12
      const nx = mx / window.innerWidth
      const ny = my / window.innerHeight
      docEl.style.setProperty('--mx', String(Math.round(mx)))
      docEl.style.setProperty('--my', String(Math.round(my)))
      docEl.style.setProperty('--nx', String(nx.toFixed(4)))
      docEl.style.setProperty('--ny', String(ny.toFixed(4)))
      docEl.style.setProperty('--cx', `${(nx * 100).toFixed(2)}%`)
      docEl.style.setProperty('--cy', `${(ny * 100).toFixed(2)}%`)

      trail.unshift({ x: mx, y: my })
      trail.pop()
      for (let i = 0; i < trailEls.length; i++) {
        const p = trail[i]
        const el = trailEls[i]
        const s = 1 - i / trailEls.length
        el.style.transform = `translate(${p.x}px, ${p.y}px) scale(${Math.max(.3, s)})`
        el.style.opacity = String(Math.max(.05, s * .35))
      }
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    const onClick = (e) => {
      const splash = document.createElement('div')
      splash.className = 'splash'
      splash.style.left = `${e.clientX}px`
      splash.style.top = `${e.clientY}px`
      document.querySelector('.bgfx')?.appendChild(splash)
      setTimeout(() => splash.remove(), 1200)
    }
    window.addEventListener('click', onClick)
    rafId = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="bgfx" aria-hidden="true">
      <div className="bgfx-aurora" />
      <div className="bgfx-stripes" />
      <div className="bgfx-grid" />
      <div className="bgfx-particles" />
      <div className="bgfx-trail">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="trail-dot" />
        ))}
      </div>
      <div className="bgfx-vignette" />
    </div>
  )
}
