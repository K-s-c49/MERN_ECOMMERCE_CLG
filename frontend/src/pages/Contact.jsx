import React, { useState } from 'react'
import '../pageStyles/contact.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import axios from '../axios'
import { toast } from 'react-toastify'

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !subject || !message) {
      toast.error('Please fill all fields', { position: 'top-center', autoClose: 3000 })
      return
    }

    try {
      setSending(true)
      const { data } = await axios.post('/contact', { name, email, subject, message })
      toast.success(data?.message || 'Message sent successfully', { position: 'top-center', autoClose: 2500 })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to send message'
      toast.error(msg, { position: 'top-center', autoClose: 3000 })
    } finally {
      setSending(false)
    }
  }

  return (
   <>
   <Navbar />
   <PageTitle title="Contact Us" />
     <div className="contact-container">

      {/* HERO SECTION */}
      <section className="contact-hero">
        <h1>Contact ElectroWorld</h1>
        <p>We’re here to help. Reach out anytime!</p>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-content">
        
        {/* CONTACT FORM */}
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Your Message"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="contact-submit-btn" disabled={sending}>
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* CONTACT INFO */}
        <div className="contact-info">
          <h2>Contact Information</h2>
          <p><strong>📍 Address:</strong> 49 ElectroWorld Street, SuratCity</p>
          <p><strong>📞 Phone:</strong> +8141233405</p>
          <p><strong>📧 Email:</strong> support@electroworld.com</p>
          <p><strong>⏰ Working Hours:</strong> Mon - Sat: 9AM - 8PM</p>

          <div className="social-links">
            <a href="#" className="social-link">Facebook</a>
            <a href="#" className="social-link">Instagram</a>
            <a href="#" className="social-link">Twitter</a>
            <a href="#" className="social-link">LinkedIn</a>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="map-section">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps?q=Udhna+College+Surat&output=embed"
          width="100%"
          height="350"
          className="contact-map"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq">
          <div className="faq-item">
            <h4>How long does delivery take?</h4>
            <p>Delivery usually takes 2-5 business days depending on location.</p>
          </div>
          <div className="faq-item">
            <h4>Do you offer warranty?</h4>
            <p>Yes, all products come with official manufacturer warranty.</p>
          </div>
          <div className="faq-item">
            <h4>Can I return a product?</h4>
            <p>Yes, we offer a 7-day easy return policy.</p>
          </div>
        </div>
      </section>

    </div>
   <Footer />
   </>
  )
}

export default Contact
