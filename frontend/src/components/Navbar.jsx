import React from 'react'
import '../componentStyles/Navbar.css'
import { Link, useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import '../pageStyles/Search.css'
import { useState } from 'react';
import { useSelector } from 'react-redux';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const togglemenu = () => setIsMenuOpen(!isMenuOpen);
    const { isAuthenticated } = useSelector(state => state.user);
    const [SearchQuery, setSearchQuery] = useState("");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
    const navigate = useNavigate();
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (SearchQuery.trim()) {
            navigate(`/products?keyword=${encodeURIComponent(SearchQuery.trim())}`);
            setSearchQuery("");
            setIsSearchOpen(false);
        } else {
            navigate(`/products`);
            setSearchQuery("");
            setIsSearchOpen(false);
        }
    };

    return (
        <nav className='navbar'>
            <div className="navbar-container">
                <div className='navbar-logo'>
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>ShopEasy</Link>
                </div>

                <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
                        <li><Link to="/about-us" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
                        <li><Link to="/contact-us" onClick={() => setIsMenuOpen(false)}>Contact Us</Link></li>
                    </ul>
                </div>

                <div className="navbar-icons">
                     <div className="search-container">
                        <form className={`search-form ${isSearchOpen ? 'active' : ''}`} onSubmit={handleSearchSubmit}>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Search products..." 
                                value={SearchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus={isSearchOpen}
                            />
                            <button 
                                type="button" 
                                onClick={toggleSearch} 
                                className='search-icon' 
                                aria-label="Toggle Search"
                            >
                              {isSearchOpen ? <CloseIcon focusable="false" /> : <SearchIcon focusable="false" />}
                            </button>
                        </form>
                    </div> 

                    <div className='cart-container'>
                        <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                            <ShoppingCartIcon className='icon' />
                            <span className="cart-badge">1</span>
                        </Link>
                    </div>

                    { !isAuthenticated && <Link to="/register" className='register-link' onClick={() => setIsMenuOpen(false)}><PersonAddIcon className='icon' /></Link>}
                    <div className='navbar-hamburger' onClick={togglemenu}>
                        {isMenuOpen ? <CloseIcon className='icon' /> : <MenuIcon className='icon' />}
                    </div>

                </div>
            </div>
        </nav>
    )
}

export default Navbar