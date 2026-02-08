import React from 'react'
import { useSelector } from 'react-redux';
import Loader from './Loader.jsx';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ element,adminOnly = false }) {
    const { isAuthenticated, loading, user } = useSelector(state => state.user);
    const location = useLocation();
    if (loading) {
        return <Loader />;
    }
    if (!isAuthenticated) {
        // preserve attempted path so login can redirect back
        const redirectTo = `/login?redirect=${encodeURIComponent(location.pathname)}`;
        return <Navigate to={redirectTo} />;
    }
    if (adminOnly && user.role !== 'admin') {
        return <Navigate to="/" />;
    }
    return element;
}

export default ProtectedRoute