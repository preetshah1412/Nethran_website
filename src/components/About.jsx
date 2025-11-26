import React from 'react'

const values = [
  { title: 'Trust', text: 'Partner-first approach focused on outcomes and reliability.' },
  { title: 'Security', text: 'Threat-aware designs with continuous hardening and monitoring.' },
]

const team = [
  { name: 'Preet Shah', role: 'Chief Executive Officer' },
  { name: 'Meet Patel', role: 'Chief Technology Officer' },
  { name: 'Preet Dudhat', role: 'Chief Operating Officer' },
]

export default function About() {
  return (
    <section id="about" className="section about reveal">
      <div className="container">
        <h2>About Us</h2>
        <p className="lead">We help organizations design secure, scalable systems and deliver measurable business outcomes.</p>
        <div className="values">
          {values.map(v => (
            <div className="card spotlight" key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
        <div className="team">
          {team.map(t => (
            <div className="team-card tilt" key={t.name}>
              <div className="info">
                <div className="name">{t.name}</div>
                <div className="role">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
