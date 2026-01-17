import React, { useState } from 'react'
import '../userStyles/Form.css'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, removeError } from '../features/user/userSlice.js';
import { useEffect } from 'react';


function Register() {
  const [user,setuser]=useState({
    name:"",
    email:"",
    password:""
  });
  const [avatar,setavatar]=useState("");
  const [avatarPreview,setavatarPreview]=useState("./images/user1.jpg");
  const {success,loading,error}=useSelector(state=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {name,email,password}=user;
  const registerdatachange=(e)=>{
    if(e.target.name==="avatar"){
      const reader=new FileReader();
      reader.onload=()=>{
        if(reader.readyState===2){
          setavatarPreview(reader.result);
          setavatar(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setuser({...user,[e.target.name]:e.target.value});
    }
    }
  const validateEmail = (email) => {
    // Simple email regex
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };
  const registerSubmit=(e)=>{
    e.preventDefault();
    if(!name || !email || !password){
      toast.error("Please fill all the fields", { autoClose: 2000, position:'top-center'});
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Invalid email format", { autoClose: 2000, position:'top-center'});
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters", { autoClose: 2000, position:'top-center'});
      return;
    }
    const myform=new FormData();
    myform.set("name",name);
    myform.set("email",email);
    myform.set("password",password);
    myform.set("avatar",avatar);
    // Dispatch registration action here
    dispatch(registerUser(myform));
  }
  useEffect(() => {
    if (error) {
      toast.error(error, { autoClose: 2000, position:'top-center'});
      dispatch(removeError());
    }
    if (success) {
      toast.success("Registered Successfully", { autoClose: 2000, position:'top-center'});
      dispatch(removeError());
      navigate("/login");
    }     
  }, [error, success, dispatch]);
  return (
    <div className='form-container container'>
      <div className='form-content'>
        <form className='form' onSubmit={registerSubmit} encType='multipart/form-data'>
          <h2>sign up</h2>
          <div className='input-group'>
            <input type="text" placeholder='Username' name='name' value={name} onChange={registerdatachange}/>
          </div>
          <div className='input-group'>
            <input type="text" placeholder='Email' name='email' value={email}  onChange={registerdatachange}/>
          </div>
          <div className='input-group'>
            <input type="password" placeholder='Password' name='password' value={password} onChange={registerdatachange}/>
          </div>
          <div className='input-group avatar-group'>
            <input type="file" name="avatar" id="avatar" className='file-input' accept='image/*' onChange={registerdatachange}/>
            <img src={avatarPreview} alt="avatar Preview" className='avatar' />
          </div>
          <button className='authBtn'>Sign Up</button>
          <p className='form-links'>
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>  
  )
}
export default Register