import React, { useEffect } from 'react'
import Home from './pages/Home.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ProductDetails from './pages/ProductDetails.jsx'
import Products from './pages/Products.jsx'
import Register from './User/Register.jsx'
import Login from './User/Login.jsx'
import { useDispatch, useSelector } from 'react-redux'
import UserDashboard from './User/UserDashboard.jsx'
import Profile from './User/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UpdateProfile from './User/UpdateProfile.jsx'
import { loadUser } from './features/user/userSlice.js'

function App() {
  const { isAuthenticated, user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
    // Dispatch loadUser action to fetch user data on app load
    dispatch(loadUser());
    }
  }, [dispatch]);
  console.log("App component - isAuthenticated:", isAuthenticated,user);
  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home />} />  
      <Route path="/product/:id" element={<ProductDetails />} />  
      <Route path="/products" element={<Products />} />  
      <Route path="/products/:keyword" element={<Products />} />  
      <Route path="/register" element={<Register />} />  
      <Route path="/login" element={<Login />} />    
      <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
      <Route path="/profile/update" element={<ProtectedRoute element={<UpdateProfile />} />} />
    </Routes>
    {isAuthenticated && (<UserDashboard  user={user}/>)}
   </Router>
)}

export default App