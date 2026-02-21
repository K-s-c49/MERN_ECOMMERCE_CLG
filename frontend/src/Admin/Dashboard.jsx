import "../AdminStyles/Dashboard.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import {
  AddBox,
  AttachMoney,
  CheckCircle,
  Dashboard as DashboardIcon,
  Error,
  Instagram,
  Inventory,
  Inventory2,
  LinkedIn,
  People,
  ShoppingCart,
  Star,
  YouTube,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAdminProduct, fetchAllOrders } from "../features/admin/adminSlice";

function Dashboard() {
  const { Products = [], orders = [], totalAmount = 0 } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAdminProduct());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const totalProducts = Products.length;
  const totalOrders = orders.length;
  const outOfStock = Products.filter(product => product.stock === 0).length;
  const inStock = Products.filter(product => product.stock > 0).length;
  const totalReviews = Products.reduce((acc, product) => acc + (product.reviews?.length || 0), 0);

  return (
    <>
      <Navbar />
      <PageTitle title="Admin Dashboard" />
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo">
            <DashboardIcon className="logo-icon" />
            Admin Dashboard
          </div>
          <nav className="nav-menu">
            <div className="nav-section">
              <h3>Product</h3>
              <Link to="/admin/products" className="nav-link">
                <Inventory className="nav-icon" />
                All Products
              </Link>
              <Link to="/admin/products/create" className="nav-link">
                <AddBox className="nav-icon" />
                Create Product
              </Link>
            </div>
            <div className="nav-section">
              <h3>User</h3>
              <Link to="/admin/users" className="nav-link">
                <People className="nav-icon" />
                All Users
              </Link>
            </div>
            <div className="nav-section">
              <h3>Orders</h3>
              <Link to="/admin/orders" className="nav-link">
                <ShoppingCart className="nav-icon" />
                All Orders
              </Link>
            </div>
            <div className="nav-section">
              <h3>Reviews</h3>
              <Link to="/admin/reviews" className="nav-link">
                <Star className="nav-icon" />
                All Reviews
              </Link>
            </div>
          </nav>
        </div>
        <div className="main-content">
          <div className="stats-grid">
            <div className="stat-box">
              <Inventory2 className="icon" />
              <h3>Total Products</h3>
              <p>{totalProducts}</p>
            </div>
            <div className="stat-box">
              <ShoppingCart className="icon" />
              <h3>Total Orders</h3>
              <p>{totalOrders}</p>
            </div>
            <div className="stat-box">
              <Star className="icon" />
              <h3>Total Reviews</h3>
              <p>{totalReviews}</p>
            </div>
            <div className="stat-box">
              <AttachMoney className="icon" />
              <h3>Total Revenue</h3>
              <p>${totalAmount}/-</p>
            </div>
            <div className="stat-box">
              <Error className="icon" />
              <h3>Out Of Stock Products</h3>
              <p>{outOfStock}</p>
            </div>
            <div className="stat-box">
              <CheckCircle className="icon" />
              <h3>In Stock Products</h3>
              <p>{inStock}</p>
            </div>
          </div>

          <div className="social-stats">
            <div className="social-box instagram">
              <Instagram className="social-icon" />
              <h3>Instagram Followers</h3>
              <p>10K</p>
              <p>+12 Post</p>
            </div>
            <div className="social-box linkedin">
              <LinkedIn className="social-icon" />
              <h3>LinkedIn Followers</h3>
              <p>10K</p>
              <p>+12 Post</p>
            </div>
            <div className="social-box youtube">
              <YouTube className="social-icon" />
              <h3>YouTube Followers</h3>
              <p>10K</p>
              <p>+12 Post</p>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
}

export default Dashboard;