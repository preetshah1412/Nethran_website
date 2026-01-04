import React, { useState, useRef } from 'react'
import Select from 'react-select'
import emailjs from '@emailjs/browser'
import { supabase } from '../supabaseClient'

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

  const submit = async e => {
    e.preventDefault()
    if (!form.current.reportValidity()) return

    setLoading(true)
    setError('')

    const formData = new FormData(form.current)
    const submission = {
      user_name: formData.get('user_name'),
      user_email: formData.get('user_email'),
      company: formData.get('company'),
      topic: formData.get('topic'),
      message: formData.get('message'),
    }

    try {
      console.log('Submitting form...');
      // Run Supabase and EmailJS in parallel, but handle failures independently
      const supabasePromise = supabase
        .from('contacts')
        .insert([submission])

      const SERVICE_ID = 'service_d4fye7w'
      const TEMPLATE_ID = 'template_idvsxey'
      const PUBLIC_KEY = '3ipeMcZv05FHVRDLH'

      // Only attempt EmailJS if keys look somewhat valid to avoid noise, 
      // or just try and expect failure. 
      const emailPromise = emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, {
        publicKey: PUBLIC_KEY,
      })

      const results = await Promise.allSettled([supabasePromise, emailPromise])
      const [supabaseResult, emailResult] = results

      // Check Supabase result
      // Supabase .insert() usually returns { data, error }, it doesn't throw unless network fail
      // but the promise itself resolves to that object.
      // Wait: supabase-js v2 returns { error } but DOES NOT reject the promise for SQL errors usually.
      // It implies supabasePromise will virtually always be 'fulfilled' (resolved),
      // but the *value* inside will contain .error if it failed.

      let supabaseError = null;
      if (supabaseResult.status === 'fulfilled') {
        if (supabaseResult.value.error) {
          supabaseError = supabaseResult.value.error;
        }
      } else {
        supabaseError = supabaseResult.reason;
      }

      if (emailResult.status === 'rejected') {
        console.warn('EmailJS failed (expected if keys are missing):', emailResult.reason)
      }

      if (supabaseError) {
        throw supabaseError
      }

      // If we got here, Supabase succeeded (or didn't return an error).
      // We accept the submission as successful even if EmailJS failed.
      setLoading(false)
      setSent(true)

    } catch (err) {
      setLoading(false)
      console.error('Submission Failed:', err)
      setError(`Failed: ${err.message || 'Unknown error'}`)
    }
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
              {/* React Select needs manual handling for a hidden input. */}
              <div style={{ gridColumn: '1 / -1', position: 'relative', zIndex: 10 }}>
                <Select
                  name="topic_select" /* specific name so we don't confuse it */
                  options={topicOptions}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Topic"
                  isSearchable={false}
                  onChange={(val) => {
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
