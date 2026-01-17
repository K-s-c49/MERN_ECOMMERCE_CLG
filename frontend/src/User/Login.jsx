
import React, { useEffect, useState } from 'react';
import '../userStyles/Form.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, removeError } from '../features/user/userSlice.js';
import { toast } from 'react-toastify';

const Login = () => {

    const [loginEmail, setloginEmail] = useState("");
    const [loginPassword, setloginPassword] = useState("");
    const { error, loading, success, isAuthenticated } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const loginSubmit = (e) => {
      e.preventDefault();
      if (!loginEmail || !loginPassword) {
        toast.error("Please fill all fields", { autoClose: 2000, position: 'top-center' });
        return;
      }
      dispatch(login({ email: loginEmail, password: loginPassword }));
    };
    useEffect(() => {
      if (error) {
        toast.error(error, { autoClose: 2000, position: 'top-center' });
        dispatch(removeError());
      }
      if (isAuthenticated) {
        toast.success("Login successful!", { autoClose: 2000, position: 'top-center' });
        navigate("/");
      }
    }, [dispatch, error, isAuthenticated, navigate]);
  return (
    <div className='form-container container'>
        <div className='form-content'>
        <form className='form' onSubmit={loginSubmit} encType='multipart/form-data'>
            <div className='input-group'>
              <input type="email" placeholder='Email' name='email' value={loginEmail} onChange={(e) => setloginEmail(e.target.value)} />
            </div>
            <div className='input-group'>
              <input type="password" placeholder='Password' name='password' value={loginPassword} onChange={(e) => setloginPassword(e.target.value)} />
            </div>
            <button type="submit" className='authBtn'>Sign In</button>
            <p className='form-links'>
                forgot password? <Link to="/password/forgot">Reset here</Link> 
            </p>  
            <p className='form-links'>
                Don't have an account? <Link to="/register">Sign up here</Link>
            </p>
        </form> 
        </div>

    </div>
  )
}

export default Login