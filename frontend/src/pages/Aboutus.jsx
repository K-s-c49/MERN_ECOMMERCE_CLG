import React from 'react'
import '../pageStyles/aboutus.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

function Aboutus() {
  return (
    <>
    <Navbar />
    <PageTitle title="About Us" />
     <div className="about-container">

      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About ElectroWorld</h1>
          <p>
            Powering Your World with the Latest Electronics & Technology.
          </p>
        </div>
      </section>

      {/* COMPANY STORY */}
      <section className="about-section">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            ElectroWorld is a leading electronics store committed to delivering
            cutting-edge gadgets, home appliances, and smart devices at
            competitive prices. Since our founding, we’ve focused on quality,
            innovation, and customer satisfaction.
          </p>
          <p>
            From smartphones and laptops to gaming gear and home automation,
            we provide trusted brands and exceptional service.
          </p>
        </div>
        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
            alt="Electronics Store"
          />
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="mission-vision">
        <div className="card">
          <h3>Our Mission</h3>
          <p>
            To make advanced technology accessible and affordable for everyone.
          </p>
        </div>
        <div className="card">
          <h3>Our Vision</h3>
          <p>
            To become the most trusted and innovative electronics retailer
            worldwide.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="features">
        <h2>Why Choose Us</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h4>✔ Premium Quality</h4>
            <p>We offer only trusted and certified electronics products.</p>
          </div>
          <div className="feature-card">
            <h4>🚚 Fast Delivery</h4>
            <p>Quick and secure nationwide shipping services.</p>
          </div>
          <div className="feature-card">
            <h4>💳 Secure Payment</h4>
            <p>100% safe and encrypted payment options.</p>
          </div>
          <div className="feature-card">
            <h4>📞 24/7 Support</h4>
            <p>Dedicated customer service ready to assist you anytime.</p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="stat">
          <h3>10K+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat">
          <h3>5K+</h3>
          <p>Products Sold</p>
        </div>
        <div className="stat">
          <h3>50+</h3>
          <p>Brands</p>
        </div>
        <div className="stat">
          <h3>8+</h3>
          <p>Years Experience</p>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="CEO" />
            <h4>John Smith</h4>
            <p>Founder & CEO</p>
          </div>
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Manager" />
            <h4>Sarah Johnson</h4>
            <p>Operations Manager</p>
          </div>
          <div className="team-card">
            <img src="https://randomuser.me/api/portraits/men/12.jpg" alt="Tech Lead" />
            <h4>David Lee</h4>
            <p>Technical Lead</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="cta">
        <h2>Ready to Explore the Latest Electronics?</h2>
        <Link to="/products" className="cta-button">Shop Now</Link>
      </section>

    </div>
    <Footer />
    </>
  )
}

export default Aboutus
