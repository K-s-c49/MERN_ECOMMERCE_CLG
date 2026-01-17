import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css';
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, removeError, removeSuccess } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';



function Forgotpassword() {
    const {loading,error,success,message}=useSelector(state => state.user);
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const forgotpasswordEmail = (e) => {
        e.preventDefault();
        // Send plain email string — thunk will wrap it into JSON
        if (!email) {
            toast.error('Please enter your registered email', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(forgotPassword(email));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
            dispatch(removeError());
        }
        if (success) {
            toast.success(message || "Reset link sent to your email", { position: 'top-center', autoClose: 3000 });
            dispatch(removeSuccess());
            setEmail("");
        }
    }, [error, success, message, dispatch]);


  return (
 <>
    {( loading ? (<Loader />) :( 
    <>
    <PageTitle title="Forgot Password"/>
    <Navbar />
    <div className='container forgot-container'>
        <div className='form-content email-group'>
        <form className='form' onSubmit={forgotpasswordEmail}>
            <h2>Forgot Password</h2>
            <div className='input-group'>
                <input type="email" placeholder='Enter your registered email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" className='authBtn' disabled={loading}>Send Reset Link</button>
        </form>
        </div>
    </div>
    <Footer />     
    </>))}
    </>
  )
}

export default Forgotpassword