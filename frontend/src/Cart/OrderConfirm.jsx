import React from 'react'
import '../CartStyles/OrderConfirm.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CheckoutPath from './CheckoutPath'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function OrderConfirm() {
        const navigate = useNavigate();
        const { shippingInfo = {} , cartItems = [] } = useSelector(state => state.cart || {});
        const { user = {} } = useSelector(state => state.user || {});

        // compute totals
        const items = Array.isArray(cartItems) ? cartItems : [];
        const subtotal = items.reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
        const tax = +(subtotal * 0.18).toFixed(2);
        const shipping = subtotal > 300 ? 0 : 50;
        const total = +(subtotal + tax + shipping).toFixed(2);

        const proceedToPayment = () => {
            const data = { subtotal, tax, shipping, total };
            try {
                sessionStorage.setItem('orderInfo', JSON.stringify(data));
            } catch (e) {
                console.warn('Failed to save orderInfo to sessionStorage', e);
            }
            navigate('/process/payment');
        }

    return (
        <>
            <PageTitle title="Order Confirmation" />
            <Navbar />
            <CheckoutPath activePath={1} />
            <div className='confirm-container'>
                <h1 className='confirm-header'>Order Confirmation</h1>
                <div className='confirm-table-container'>
                    <table className='confirm-table'>
                        <caption>Shipping Details</caption>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{user.name || 'N/A'}</td>
                                <td>{shippingInfo.phoneNo || 'N/A'}</td>
                                <td>{shippingInfo && `${shippingInfo.address || ''}${shippingInfo.city ? ', ' + shippingInfo.city : ''}${shippingInfo.state ? ', ' + shippingInfo.state : ''}${shippingInfo.country ? ', ' + shippingInfo.country : ''}${shippingInfo.pinCode ? ' - ' + shippingInfo.pinCode : ''}`}</td>
                            </tr>
                        </tbody>
                    </table>

                    <table className='confirm-table cart-table'>
                        <caption>Cart Items</caption>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 && (
                                <tr><td colSpan={5}>Your cart is empty</td></tr>
                            )}
                            {items.map((item) => (
                                <tr key={item.product || item.id}>
                                    <td><img src={item.image} alt={item.name} className='product-image' /></td>
                                    <td>{item.name}</td>
                                    <td>{Number(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>{(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                <table className='confirm-table'>
                    <caption>Order Summary</caption>
                    <thead>
                        <tr>
                            <th>Subtotal</th>
                            <th>Shipping Chargers</th>
                            <th>GST Tax (18%)</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{subtotal.toFixed(2)}/-</td>
                            <td>{shipping.toFixed(2)}/-</td>
                            <td>{tax.toFixed(2)}/-</td>
                            <td>{total.toFixed(2)}/-</td>
                        </tr>
                    </tbody>

                </table>
                </div>

        <button type='submit' className='proceed-button' onClick={proceedToPayment} disabled={items.length===0}>Proceed to Payment</button>

            </div>
            <Footer />
        </>
    )
}

export default OrderConfirm
