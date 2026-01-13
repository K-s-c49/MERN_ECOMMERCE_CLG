import React, { useEffect, useState, useRef } from 'react'
import '../UserStyles/Form.css';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeError, removeSuccess, updateProfile } from '../features/user/userSlice';
import Loader from '../components/Loader.jsx';

function UpdateProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("./images/user1.jpg");

    const ProfileImageUpdate = (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        // keep the File object for FormData upload
        setAvatar(file);
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
            }
        };
        reader.onerror = () => {
            toast.error("Error loading image", { autoClose: 2000, position: 'top-center' });
        };
        reader.readAsDataURL(file);
    }
    const { user, error, success, message, loading } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const didMount = useRef(false);

    const UpdateSubmit = (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        if (avatar && avatar instanceof File) {
            myForm.append("avatar", avatar);
        } else if (avatar) {
            myForm.set("avatar", avatar);
        }
        console.log("[UpdateProfile] Submitting form:", { name, email, avatar });
        dispatch(updateProfile(myForm));
    }
    useEffect(() => {
        if (!didMount.current) return;
        if (error) {
            toast.error(error || "Something went wrong", { autoClose: 2000, position: 'top-center' });
            dispatch(removeError());
        }
    }, [error, dispatch]);

    // clear any previous success/error flags when component mounts
    useEffect(() => {
        dispatch(removeError());
        dispatch(removeSuccess());
    }, [dispatch]);

    useEffect(() => {
        if (!didMount.current) return;
        if (success) {
            toast.success(message || "Profile updated successfully!", { autoClose: 2000, position: 'top-center' });
            // Update avatar preview if new avatar returned
            if (user && user.avatar && user.avatar.url) {
                setAvatarPreview(user.avatar.url);
            }
            dispatch(removeSuccess());
            navigate('/profile');
        }
    }, [success, message, dispatch, navigate, user]);

    // mark component as mounted after first render
    useEffect(() => {
        didMount.current = true;
        return () => { didMount.current = false; };
    }, []);

    // populate form with current user data
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            if (user.avatar && user.avatar.url) setAvatarPreview(user.avatar.url);
        }
    }, [user]);
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Navbar />
                    <div className='container update-container'>
                        <div className='form-content'>
                            <form className='form' encType='multipart/form-data' onSubmit={UpdateSubmit}>
                                <h2>Update Profile</h2>
                                <div className='input-group avatar-group'>
                                    <input type="file" accept='image/*' className='file-input' onChange={ProfileImageUpdate} />
                                    <img src={avatarPreview} alt="User Profile" className='avatar' />
                                </div>
                                <div className='input-group'>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                                </div>
                                <div className='input-group'>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                                </div>
                                <button type="submit" className='authBtn' disabled={loading}>Update</button>
                            </form>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    );
}


export default UpdateProfile