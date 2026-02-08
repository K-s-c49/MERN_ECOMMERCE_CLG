import React, { useEffect, useMemo, useRef, useState } from 'react'
import '../CartStyles/PaymentSuccess.css'
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import axios from '../axios.js'
import Loader from '../components/Loader'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { clearCart } from '../features/Cart/cartSlice'

function PaymentSuccess() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const queryOrderId = searchParams.get('orderId');
  const referenceId = searchParams.get('referenceId');
  const routeOrderId = params.id;

  const orderId = useMemo(() => {
    if (routeOrderId) return routeOrderId;
    if (queryOrderId) return queryOrderId;
    try {
      const raw = sessionStorage.getItem('lastOrderId');
      return raw || null;
    } catch (e) {
      return null;
    }
  }, [routeOrderId, queryOrderId]);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!orderId) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // backend route: GET /order/:id (authenticated)
        const { data } = await axios.get(`/order/${orderId}`);
        if (data && data.order) {
          setOrder(data.order);
          // clean ephemeral checkout session keys once we have a confirmed order
          try {
            sessionStorage.removeItem('orderInfo');
            sessionStorage.removeItem('lastOrderId');
          } catch (e) {}

          // Clear cart only after a confirmed successful order fetch.
          // This makes the flow resilient to refreshes or temporary API errors.
          dispatch(clearCart());
        } else {
          toast.error('Order not found');
        }
      } catch (err) {
        console.error('Fetch order error', err);
        toast.error('Unable to fetch order details');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, dispatch]);

  if (!orderId) {
    // If Razorpay redirected without our internal order id, show a safe fallback
    return (
      <div className='payment-success-container'>
        <div className='success-icon'>
          <div className='checkmark'></div>
        </div>
        <h1>Order placed successfully</h1>
        <p>Your payment was completed successfully. Reference ID: <strong>{referenceId || 'N/A'}</strong></p>
        <Link className='explore-btn' to="/">Explore More Products</Link >
        <Link className='explore-btn' to="/orders/user">See My Orders</Link >
      </div>
    )
  }

  return (
    <>
      <PageTitle title="Payment Successful Status" />
      <Navbar />
      <div className='payment-success-container'>
        <div className='success-content'></div> 
        <div className='success-icon'>
          <div className='checkmark'></div>
        </div>
        <h1>Order placed successfully</h1>
        {loading ? (
          <Loader />
        ) : order ? (
          <div className='payment-success-details'>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> {order.orderStatus}</p>
            <p><strong>Paid At:</strong> {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}</p>
            <p><strong>Total:</strong> ₹{typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : Number(order.totalPrice || 0).toFixed(2)}</p>
            <h3>Shipping</h3>
            <p>{order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state} - {order.shippingInfo?.pinCode}</p>
            <p><strong>Contact:</strong> {order.shippingInfo?.phoneNo}</p>
            <h3>Items</h3>
            <ul>
              {order.orderItems && order.orderItems.map(item => (
                <li key={item.product} style={{ marginBottom: 8 }}>
                  <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 8 }} />
                  <strong>{item.name}</strong> &times; {item.quantity} — ₹{(item.price).toFixed(2)}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 12 }}>
              <button className='explore-btn' onClick={() => navigate(`/order/${order._id}`)}>View Order Details</button>
              <Link className='explore-btn' to="/">Continue Shopping</Link>
            </div>
          </div>
        ) : (
          <div>
            <p>Unable to load order details.</p>
            <Link className='explore-btn' to="/orders/user">See My Orders</Link >
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default PaymentSuccess
