import React from 'react'

const services = [
  {
    title: 'Business Software',
    text: 'Custom ERP, CRM, and workflow platforms tailored to your operations.',
  },
  {
    title: 'Apps',
    text: 'Native and cross-platform mobile apps from concept through launch.',
  },
  {
    title: 'Websites',
    text: 'High-performing marketing sites, portals, and commerce experiences.',
  },
  {
    title: 'Consultancy',
    text: 'Strategic technology advisory, roadmaps, and executive guidance.',
  },
  {
    title: 'Comprehensive Delivery',
    text: 'Comprehensive, end-to-end solutions integrating product development, engineering, and ongoing support.',
  },
]

export default function Services() {
  return (
    <section id="services" className="section services reveal">
      <div className="container">
        <h2>Services</h2>
        <div className="service-grid">
          {services.map(s => (
            <a href="#contact" className="service-card spotlight" key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
