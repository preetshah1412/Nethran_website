import React, { useEffect } from 'react'
import Header from './components/Header.jsx'
import BackgroundFX from './components/BackgroundFX.jsx'
import EntranceOverlay from './components/EntranceOverlay.jsx'
import SplashCursor from './components/SplashCursor.jsx'
// CursorDistortCanvas (removed) - reverting to original cursor setup
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Testimonials from './components/Testimonials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
// CursorAura (removed) - reverting to original cursor setup

export default function App() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach(l => {
      l.addEventListener('click', e => {
        const id = l.getAttribute('href').slice(1)
        const el = document.getElementById(id)
        if (el) {
          e.preventDefault()
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add('in-view')
        })
      },
      { threshold: 0.2 }
    )
    const reveals = document.querySelectorAll('.reveal')
    reveals.forEach(el => observer.observe(el))

    return () => {
      links.forEach(l => {
        l.replaceWith(l.cloneNode(true))
      })
      observer.disconnect()
    }
  }, [])

  return (
    <div className="app">
      <SplashCursor />
      <EntranceOverlay />
      <BackgroundFX />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
