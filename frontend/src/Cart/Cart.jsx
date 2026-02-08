import React, { use } from 'react'
import '../CartStyles/Cart.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Cartitem from './Cartitem'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

function Cart() {
    const { cartItems } = useSelector(state => state.cart)
    const items = cartItems || [];
    console.log('Cart items:', items);

    const subtotal = items.reduce((acc, it) => acc + (Number(it.price || 0) * Number(it.quantity || 0)), 0);
    const tax = +(subtotal * 0.18).toFixed(2);
    const shipping = subtotal > 300 ? 0 : 50;
    const total = +(subtotal + tax + shipping).toFixed(2);
    const navigate=useNavigate();
    const checkoutHandler = () => {
        // ensure redirect is an absolute path so Login navigates back to /shipping
        navigate('/login?redirect=/shipping');
    }
  return (
        <>
            <PageTitle title="Your Shopping Cart" />
            <Navbar />
        {!items || items.length === 0 ? (
      <div className='empty-cart-container'>
      <p className='empty-cart-message'>Your cart is empty</p>
      <Link to="/products" className='viewProducts'>Shop Now</Link>
      </div>
    ) : (
      <>
          
          

            <div className='cart-page'>
                <div className='cart-items'>
                    <div className='cart-items-heading'>Your Shopping Cart</div>

                    <div className='cart-table'>
                        <div className='cart-table-header'>
                            <div className='header-product'>Product</div>
                            <div className='header-quantity'>Quantity</div>
                            <div className='header-total-item'>Item Total</div>
                            <div className='header-action'>Actions</div>
                        </div>

                        {/* Single cart item (static example) */}
                       {cartItems && cartItems.map((item) => <Cartitem key={item.product || item.id} {...item} />)}
                
                    </div>
                </div>

            {/* price summary */}
            <div className='price-summary'>
                <h3 className='price-summary-heading'>Price Summary</h3>
                <div className='summary-item'>
                    <p className='summary-label'>Subtotal</p>
                    <p className='summary-value'>{subtotal.toFixed(2)}/-</p>
                </div>
                <div className='summary-item'>
                    <p className='summary-label'>Tax (18%)</p>
                    <p className='summary-value'>{tax.toFixed(2)}/-</p>
                </div>
                <div className='summary-item'>
                    <p className='summary-label'>Shipping</p>
                    <p className='summary-value'>{shipping.toFixed(2)}/-</p>
                </div>
                <div className='summary-total'>
                    <p className='total-label'>Total</p>
                    <p className='total-value'>{total.toFixed(2)}/-</p>
                </div>
                <button className='checkout-btn' onClick={checkoutHandler}>Proceed to Checkout</button>
            </div>

            </div>

    
        </>)}
                <Footer />
    </>
  )
}

export default Cart
