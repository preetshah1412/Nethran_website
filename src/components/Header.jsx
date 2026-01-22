import React, { useState } from 'react'
import logo from '../assets/logo.png'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="#home" aria-label="Nethran home">
          <img src={logo} alt="Nethran logo" className="brand-logo" />
          <span className="brand-text">Nethran</span>
        </a>
        <nav className={`nav ${open ? 'open' : ''}`} aria-label="Primary" onClick={() => setOpen(false)}>
          <a href="#home">Home</a>
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="hamburger" aria-label="Toggle navigation" onClick={() => setOpen(v => !v)}>
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
