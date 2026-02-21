import React from 'react'
import '../UserStyles/Form.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { resetPassword, removeError, removeSuccess } from '../features/user/userSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function ResetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    const { loading, error, success, message } = useSelector((state) => state.user);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeError());
        }

        if (success) {
            toast.success(message || 'Password reset successfully', { position: 'top-center', autoClose: 2500 });
            dispatch(removeSuccess());
            // Backend logs the user in (sets cookie + returns user/token), so route to profile.
            navigate('/profile');
        }
    }, [dispatch, error, success, message, navigate]);

    const resetPasswordSubmit = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) {
            toast.error('Please enter password and confirm password', { position: 'top-center', autoClose: 3000 });
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Password and confirm password do not match', { position: 'top-center', autoClose: 3000 });
            return;
        }
        if (!token) {
            toast.error('Reset token is missing or invalid', { position: 'top-center', autoClose: 3000 });
            return;
        }

        try {
            await dispatch(resetPassword({ token, password, confirmPassword })).unwrap();
        } catch {
            // error toast handled by effect
        }
    };
  return (
<>
<PageTitle title="Reset Password"/>
{loading ? (
    <Loader />
) : (
    <>
        <Navbar />
        <div className='container form-container'>
            <div className='form-content'>
                <form className='form' onSubmit={resetPasswordSubmit}>
                    <h2>Reset Password</h2>
                    <div className='input-group'>
                        <input
                            type="password"
                            placeholder='Enter your new password'
                            name='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <input
                            type="password"
                            placeholder='Confirm your new password'
                            name='confirmPassword'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className='authBtn' disabled={loading}>Reset Password</button>
                </form>
            </div>
        </div>
        <Footer />
    </>
)}
</>
  )
}

export default ResetPassword