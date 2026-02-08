import React, { useEffect, useState } from 'react'
import '../CartStyles/Payment.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from '../axios.js'
import { useSelector } from 'react-redux'

export function Payment() {
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState(null);
  const { user } = useSelector(state => state.user || {});
  const { shippingInfo, cartItems } = useSelector(state => state.cart || {});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('orderInfo');
      if (!raw) {
        // nothing to pay for, go back to confirm
        navigate('/order/confirm');
        return;
      }
      const parsed = JSON.parse(raw);
      setOrderInfo(parsed);
    } catch (e) {
      console.warn('Failed to parse orderInfo', e);
      navigate('/order/confirm');
    }
  }, [navigate]);

  const completePayment = async (amount) => {
    if (!amount || amount <= 0) {
      toast.error('Invalid payment amount');
      return;
    }

    try {
      // 1) get razorpay key from server
      const { data: keyResp } = await axios.get('/getKey');
      const key = keyResp?.key;
      if (!key) throw new Error('Payment key not available');

      // 2) create razorpay order on server (amount in rupees expected)
      const { data: orderResp } = await axios.post('/payment/process', { amount });
      const order = orderResp?.order;
      if (!order || !order.id) throw new Error('Failed to create payment order');

      // 3) open Razorpay checkout
      const options = {
        key, // razorpay key id
        amount: order.amount || Math.round(amount * 100),
        currency: order.currency || 'INR',
        name: 'ShopEase',
        description: 'Ecommerce Transaction',
        order_id: order.id,
        handler: async function (response) {
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderInfo,
              orderItems: cartItems,
              shippingInfo,
            };

            const { data: verifyResp } = await axios.post('/payment/verify', verifyPayload);
            if (verifyResp && verifyResp.success) {
              toast.success('Payment successful — order placed', { position: 'top-center', autoClose: 2000 });
              try {
                sessionStorage.removeItem('orderInfo');
                sessionStorage.setItem('lastOrderId', verifyResp.order._id);
              } catch (e) {}

              // route uses /order/:id in your backend and frontend queries
              navigate(`/order/${verifyResp.order._id}`);
            } else {
              toast.error('Payment verification failed', { position: 'top-center' });
            }
          } catch (e) {
            console.error('Verification error', e);
            toast.error('Payment verification error', { position: 'top-center' });
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: shippingInfo?.phoneNo || '',
        },
        theme: { color: '#3399cc' },
      };

      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not loaded. Ensure checkout script is included in index.html');
      }

    } catch (err) {
      console.error('Payment init error', err);
      toast.error(err.message || 'Payment initialization failed', { position: 'top-center' });
    }
  }

  return (
    <>
      <PageTitle title="Payment Processing" />
      <Navbar />
      <CheckoutPath activePath={2} />
      <div className='payment-container'>
        <Link to="/order/confirm" className='payment-go-back'>&larr; Back to Order Confirmation</Link>
        <button className='payment-btn' onClick={() => completePayment(orderInfo?.total)} disabled={!orderInfo}>Pay Now ({orderInfo ? Number(orderInfo.total).toFixed(2) : '0.00'})</button>
      </div>
      <Footer />
    </>
  )
}

export default Payment
