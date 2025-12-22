import React, { useState, useRef } from 'react'
import Select from 'react-select'
import emailjs from '@emailjs/browser'

const topicOptions = [
  { value: 'business-software', label: 'Business Software' },
  { value: 'apps', label: 'Apps' },
  { value: 'websites', label: 'Websites' },
  { value: 'chatbot', label: 'AI Chatbot Development' },
  { value: 'it-consulting', label: 'IT Consulting & Strategy' },
  { value: 'gen-ai', label: 'Generative AI Solutions' },
  { value: 'cloud-devops', label: 'Cloud & DevOps' },
  { value: 'data-analytics', label: 'Data Analytics & BI' },
  { value: 'comprehensive', label: 'Comprehensive Delivery' },
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const form = useRef()

  const submit = e => {
    e.preventDefault()
    if (!form.current.reportValidity()) return

    setLoading(true)
    setError('')

    // REPLACE THESE WITH YOUR ACTUAL EMAILJS CREDENTIALS
    // Sign up at https://www.emailjs.com/
    const SERVICE_ID = 'YOUR_SERVICE_ID'
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID'
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY'

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          setLoading(false)
          setSent(true)
        },
        err => {
          setLoading(false)
          setError('Failed to send message. Please try again later.')
          console.error('FAILED...', err.text)
        }
      )
  }

  return (
    <section id="contact" className="section contact reveal">
      <div className="container">
        <h2>Contact Us</h2>
        {!sent ? (
          <form className="contact-form" ref={form} onSubmit={submit} noValidate>
            <div className="fields">
              <input type="text" name="user_name" placeholder="Your name" required />
              <input type="email" name="user_email" placeholder="Email" required />
              <input type="text" name="company" placeholder="Company" />
              {/* React Select needs manual handling for EmailJS or a hidden input. 
                  Simplest way for EmailJS form ref is to use a hidden input or 
                  just rely on the fact user picks one. 
                  Actually, react-select doesn't pass native value easily to form ref.
                  Let's stick to a standard select for reliability with form.current, 
                  OR use a hidden input synced with state. 
                  For now to minimize complexity, I'll switch to standard select 
                  styled to look good, OR just add a hidden input. */}
              <div style={{ gridColumn: '1 / -1', position: 'relative', zIndex: 10 }}>
                <Select
                  name="topic_select" /* specific name so we don't confuse it */
                  options={topicOptions}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Topic"
                  isSearchable={false}
                  onChange={(val) => {
                    // Update hidden input if needed, but EmailJS reads name attributes.
                    // React-Select creates hidden inputs with name="topic" by default in newer versions?
                    // Let's manually ensure the value is captured in a hidden input for EmailJS
                    const input = form.current.querySelector('input[name="topic"]')
                    if (input) input.value = val.value
                  }}
                  required
                />
                <input type="hidden" name="topic" required />
              </div>

              <textarea name="message" placeholder="How can we help?" rows="5" required />
            </div>
            {error && <p style={{ color: '#ff6b6b', marginTop: '10px' }}>{error}</p>}
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </form>
        ) : (
          <div className="success">
            <div className="pulse" />
            <h3>Request sent</h3>
            <p>We will get back to you shortly.</p>
            <a href="#home" className="btn ghost" onClick={() => setSent(false)}>Send Another</a>
          </div>
        )}
      </div>
    </section>
  )
}
