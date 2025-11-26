import React, { useEffect, useState } from 'react'

const quotes = [
  { 
    text: 'Our ERP overhaul was delivered with remarkable precision. Nethran understood our workflows and built a system that actually fits the business.', 
    name: 'Operations Head, Manufacturing', 
    rating: 5 
  },
  { 
    text: 'The mobile app launch exceeded expectations. Clean UX, stable performance, and delivered ahead of schedule.', 
    name: 'Product Manager, EdTech', 
    rating: 5 
  },
  { 
    text: 'Nethran redesigned our website into a fast, modern, conversion-driven platform. Engagement went up instantly.', 
    name: 'Marketing Director, Retail', 
    rating: 5 
  },
  { 
    text: 'Their technology advisory helped us make the right architectural decisions and avoid costly mistakes.', 
    name: 'Founder, Startup', 
    rating: 4 
  },
  { 
    text: 'From planning to deployment, the end-to-end delivery was seamless. Engineering, communication, and support were outstanding.', 
    name: 'CEO, Logistics', 
    rating: 5 
  },
];


export default function Testimonials() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setIndex(i => (i + 1) % quotes.length), 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="testimonials" className="section testimonials reveal">
      <div className="container">
        <h2>Testimonials</h2>
        <div className="carousel" role="region" aria-label="Client testimonials">
          {quotes.map((q, i) => (
            <div className={`slide ${i === index ? 'active' : ''}`} key={q.name}>
              <div className="stars" aria-hidden="true">{'★'.repeat(q.rating)}{'☆'.repeat(5 - q.rating)}</div>
              <p className="quote">{q.text}</p>
              <div className="author">{q.name}</div>
            </div>
          ))}
          <div className="dots">
            {quotes.map((_, i) => (
              <button key={i} className={`dot ${i === index ? 'on' : ''}`} onClick={() => setIndex(i)} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
