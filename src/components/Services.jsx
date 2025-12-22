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
    title: 'AI Chatbot Development',
    text: 'Smart, context-aware chatbots that deliver human-like 24/7 support across web, apps, and messaging platforms.',
  },
  {
    title: 'IT Consulting & Strategy',
    text: 'Expert guidance on digital transformation, cybersecurity, and cloud adoption to align technology with your business goals.',
  },
  {
    title: 'Generative AI Solutions',
    text: 'Custom generative AI solutions to automate designs, generate content, and optimize business logic for growth.',
  },
  {
    title: 'Cloud & DevOps',
    text: 'Scalable cloud infrastructure and automated CI/CD pipelines for robust, high-performance deployment.',
  },
  {
    title: 'Data Analytics & BI',
    text: 'Transform raw data into actionable insights with custom dashboards and predictive analytics.',
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
