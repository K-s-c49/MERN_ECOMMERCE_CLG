import React, { useEffect, useState, useRef } from 'react'
import '../UserStyles/Form.css';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import PageTitle from '../components/PageTitle';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePassword, removeError } from '../features/user/userSlice.js';
import { toast } from 'react-toastify';
import Loader from '../components/Loader.jsx';


function Updatepassword() {
    const { loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
        const [newPassword, setNewPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const UpdatePasswordSubmit = (e) => {
            e.preventDefault();
            const payload = {
                oldPassword,
                newPassword,
                confirmPassword,
            };
            // Client-side validation
            if (!oldPassword || !newPassword || !confirmPassword) {
                toast.error('Please fill all password fields', { position: 'top-center', autoClose: 3000 });
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error('New password and confirm password do not match', { position: 'top-center', autoClose: 3000 });
                return;
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                toast.error('Password must be at least 8 characters and include uppercase, lowercase, number and special character', { position: 'top-center', autoClose: 4000 });
                return;
            }

            console.log('update password payload', payload);
            dispatch(updatePassword(payload)).unwrap()
                .then((res) => {
                    const msg = res?.message || 'Password updated successfully';
                    toast.success(msg, { position: 'top-center', autoClose: 2000 });
                    setTimeout(() => navigate('/profile'), 1200);
                })
                .catch((err) => {
                    // error will also be handled by the error effect, but log for debugging
                    console.error('Update password failed:', err);
                });
        };
    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeError());
        }
    }, [dispatch, error]);

    // Handle password update directly from dispatch result to guarantee timing
  return (
    <>
    {loading?<Loader />:(<>
    <Navbar />
    < PageTitle title="Password Update" /> 
        <div className='conatiner update-container'>
            <div className='form-content'>
                            <form className='form' onSubmit={UpdatePasswordSubmit}>
                                <h2>Update Password</h2>
                                 <div className='input-group'>
                                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="old password" name='old password' />
                                </div>
                                 <div className='input-group'>
                                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" name='New password' />
                                </div>
                                <div className='input-group'>
                                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Comfirm Password" name='Comfirm Password' />
                                </div>
                                <button type="submit" className='authBtn' disabled={loading}>Update Password</button>
                            </form>
                        </div>
        </div>
    <Footer />
    </>
)}
</>
)
}

export default Updatepassword