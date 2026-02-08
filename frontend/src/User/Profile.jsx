import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../UserStyles/Profile.css'
import { useSelector } from 'react-redux'
import PageTitle from '../components/PageTitle'
import Loader from '../components/Loader'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Profile = () => {
    const {loading, isAuthenticated, user} = useSelector(state=>state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);

    if (loading || !user) return <Loader />;

    return (
        <>
            <Navbar />
            <PageTitle title={`${user?.name || 'User'} Profile`} />
            <main className="profile-page">
                <div className="profile-container">
                    <div className="profile-grid">
                        <section className='profile-card'>
                            <h1 className='profile-heading'>My Profile</h1>
                            <img
                                src={user?.avatar?.url ? user.avatar.url : "/images/user.png"}
                                alt="User Profile"
                                className='profile-avatar'
                            />
                            <Link to="/profile/update" className="profile-primary-link">Edit Profile</Link>
                        </section>

                        <section className='profile-details' aria-label="Profile details">
                            <div className='profile-detail'>
                                <h2>Username</h2>
                                <p>{user?.name || 'N/A'}</p>
                            </div>
                            <div className='profile-detail'>
                                <h2>Email</h2>
                                <p>{user?.email || 'N/A'}</p>
                            </div>
                            <div className='profile-detail'>
                                <h2>Joined On</h2>
                                <p>{user?.createdAt ? String(user.createdAt).substring(0, 10) : 'N/A'}</p>
                            </div>
                        </section>
                    </div>

                    <div className='profile-buttons' aria-label="Profile actions">
                        <Link to="/orders/user" className='profile-button'>My Orders</Link>
                        <Link to="/password/update" className='profile-button'>Change Password</Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Profile