import React, { useState } from 'react'
import Select from 'react-select'

const topicOptions = [
  { value: 'business-software', label: 'Business Software' },
  { value: 'apps', label: 'Apps' },
  { value: 'websites', label: 'Websites' },
  { value: 'consultancy', label: 'Consultancy' },
  { value: 'comprehensive', label: 'Comprehensive Delivery' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const submit = e => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.reportValidity()) return
    setSent(true)
  }

  return (
    <section id="contact" className="section contact reveal">
      <div className="container">
        <h2>Contact Us</h2>
        {!sent ? (
          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="fields">
              <input type="text" name="name" placeholder="Your name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="text" name="company" placeholder="Company" />
              <Select
                name="topic"
                options={topicOptions}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Topic"
                isSearchable={false}
                required
              />
              <textarea name="message" placeholder="How can we help?" rows="5" required />
            </div>
            <button className="btn primary" type="submit">Send Request</button>
          </form>
        ) : (
          <div className="success">
            <div className="pulse" />
            <h3>Request sent</h3>
            <p>We will get back to you shortly.</p>
            <a href="#home" className="btn ghost">Back to Home</a>
          </div>
        )}
      </div>
    </section>
  )
}
