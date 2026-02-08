import React, { useState } from 'react'
import '../UserStyles/UserDashboard.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, removeError } from '../features/user/userSlice.js';
import { toast } from 'react-toastify';

const UserDashboard = ({ user }) => {
    const { cartItems = [] } = useSelector(state => state.cart || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    function toggleMenu() {
        setMenuVisible(!menuVisible);
    }
    const options = [
        {name: 'Orders', funcName:orders},
        {name: 'Account', funcName:profile},
        {name: `Cart (${cartItems.length})`, funcName:mycart,isCart:true},
        {name: 'Logout', funcName:logoutUser},
    ];
    if (user?.role === 'admin') {
        options.unshift({name: 'Admin Dashboard', funcName:dashboard});
    }

    // Close menu and invoke the option function
    function handleOptionClick(fn) {
        try {
            fn && fn();
        } finally {
            setMenuVisible(false);
        }
    }
    function dashboard() {
        navigate('/admin/dashboard');
    }
    function orders() {
        navigate('/orders/user');
    }
    function profile() {
        navigate('/profile');
    }
    function mycart() {
        navigate('/cart');
    }
    function logoutUser() {
        // dispatch returns a promise for createAsyncThunk; unwrap to get actual result or throw
        dispatch(logout()).unwrap()
            .then(() => {
                toast.success("Logout successful!", { autoClose: 2000, position: 'top-center' });
                dispatch(removeError());
                navigate('/login');
            })
            .catch((err) => {
                const message = err || 'Logout failed';
                toast.error(message, { autoClose: 2000, position: 'top-center' });
            });
    }
    return (
        <>
            {menuVisible && <div className={`overlay ${menuVisible ? 'show' : ''}`} onClick={toggleMenu} />}
            <div className='dashboard-container'>
                <div className='profile-header' onClick={toggleMenu}>
                    <img
                        src={user?.avatar?.url ? user.avatar.url : './images/c.jpg'}
                        alt='Profile Picture'
                        className='profile-avatar'
                    />
                    <span className='profile-name'>{user?.name || 'Guest'}</span>
                </div>
                {menuVisible && (
                    <div className='menu-options'>
                        {options.map((items) => (
                            <button
                                key={items.name}
                                className={`menu-option-btn ${items.isCart ? (cartItems.length > 0 ? 'cart-not-empty' : '') : ''}`}
                                onClick={() => handleOptionClick(items.funcName)}
                            >
                                {items.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default UserDashboard