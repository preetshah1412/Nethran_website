import React, { useEffect, useState, useMemo } from 'react'
import logo from '../assets/logo.png'

export default function EntranceOverlay() {
  const [visible, setVisible] = useState(true)
  const [closing, setClosing] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [typed, setTyped] = useState('')
  const word = useMemo(() => 'NETHRAN'.split(''), [])

  useEffect(() => {
    let i = 0
    const full = 'Secure. Scalable. Modern.'
    const t = setInterval(() => {
      setTyped(full.slice(0, i + 1))
      i += 1
      if (i >= full.length) {
        clearInterval(t)
        setZoom(true)
        setTimeout(() => setClosing(true), 700)
        setTimeout(() => {
          setVisible(false)
        }, 1000)
      }
    }, 40)
    return () => clearInterval(t)
  }, [])

  if (!visible) return null
  return (
    <div className={`entrance ${closing ? 'closing' : ''} ${zoom ? 'zoom' : ''}`}>
      <div className="entrance-inner">
        <img src={logo} alt="Nethran logo" className="entrance-logo" />
        <div className="word">
          {word.map((ch, idx) => (
            <span key={idx} style={{ ['--i']: idx }}>{ch}</span>
          ))}
        </div>
        <div className="typed" aria-label="tagline">{typed}</div>
      </div>
    </div>
  )
}
