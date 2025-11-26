import React from 'react'
import GradientText from './GradientText.jsx'

export default function Hero() {
  return (
    <section id="home" className="section hero">
      <div className="container hero-inner">
        <h1 className="headline">Secure, Scalable IT Solutions</h1>
        <p className="subhead">Nethran delivers modern technology solutions spanning software, apps, web experiences, strategic consultancy, and end-to-end product delivery.</p>
        <div className="cta-row">
          <a href="#contact" className="btn primary">Talk to an Expert</a>
          <a href="#services" className="btn ghost gradient-btn">
            <GradientText
              colors={['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa']}
              animationSpeed={3}
              showBorder={false}
              className="explore-gradient"
            >
              Explore Services
            </GradientText>
          </a>
        </div>
        <div className="stats">
          <div className="stat"><span className="num">99.99%</span><span className="label">Uptime</span></div>
          <div className="stat"><span className="num">40%+</span><span className="label">Risk Reduction</span></div>
        </div>
      </div>
    </section>
  )
}
