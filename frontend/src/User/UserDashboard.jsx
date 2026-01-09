import React, { useState } from 'react'
import '../userStyles/UserDashboard.css'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, removeError } from '../features/user/userSlice.js';
import { toast } from 'react-toastify';

const UserDashboard = ({ user }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [menuVisible, setMenuVisible] = useState(false);
    function toggleMenu() {
        setMenuVisible(!menuVisible);
    }
    const options = [
        {name: 'Orders', funcName:orders},
        {name: 'Account', funcName:profile},
        {name: 'Logout', funcName:logoutUser},
    ];
    if (user.role==='admin') {
        options.unshift({name: 'Admin Dashboard', funcName:dashboard});
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
                            <button key={items.name} className='menu-option-btn' onClick={items.funcName}>
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