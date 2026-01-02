import React from 'react'
import '../componentStyles/Footer.css'
import { Phone, Email, GitHub, LinkedIn, YouTube, Instagram } from '@mui/icons-material';

function Footer() {
  return (
   <footer className="footer">
    <div className="footer-container">
        {/* section 1 */}
        <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p><Phone fontSize='small'/>Phone : +91 8141233405</p>
            <p><Email fontSize='small'/>Email : rajputkhushal04@gmail.com </p>
        </div>
        {/* section 2 */}
        <div className='footer-section social'>
            <h3>Follow Us</h3>
            <div className="social-links">
                <a href="#" target="_blank" rel="noopener noreferrer"><GitHub className='social-icon'/></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><LinkedIn className='social-icon'/></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><YouTube className='social-icon'/></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><Instagram className='social-icon'/></a>
        </div>
        </div>
        {/* section 3 */}
        <div className="footer-section about">
            <h3>About</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio ratione, laudantium itaque vel ipsa aut ipsam nulla culpa alias molestias inventore quod aperiam suscipit dolores pariatur consectetur! Reprehenderit, quia neque?</p>
        </div>
    </div>
    <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Khushal singh. All rights reserved.</p>
    </div>
   </footer>
  )
}

export default Footer