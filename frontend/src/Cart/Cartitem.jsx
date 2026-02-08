import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { additemsToCart, removeError as removeCartError, removeMessage as removeCartMessage, removeitemFromCart } from '../features/Cart/cartSlice.js'

function Cartitem(item) {
    const { success, loading, error, message } = useSelector(state => state.cart);
    const dispatch=useDispatch();
    const [quantity, setQuantity] = useState(item.quantity || 1);
       const increaseQuantity = () => {
            if (item && quantity < item.stock) {
                setQuantity(quantity + 1);
            } else if (item && quantity >= item.stock) {
                toast.warning('Cannot add more than available stock', { autoClose: 2000 });
            }
        };
        
        const decreaseQuantity = () => {
            if (quantity > 1) {
                setQuantity(quantity - 1);
            }
        };
        const handleupdate=async()=>{
            if(loading) return;
            if (quantity !== item.quantity) {
                dispatch(additemsToCart({ id: item.product, quantity }));
            }
        }
        useEffect(() => {
            if (error) {
                toast.error(error, { position: 'top-center', autoClose: 2000 });
                dispatch(removeCartError());
            }
        }, [error, dispatch]);

        useEffect(() => {
            if (success) {
                toast.success(message || 'Cart updated', { position: 'top-center', autoClose: 2000, toastId: 'cart-update-success' });
                dispatch(removeCartMessage());
            }
        }, [success, message, dispatch]);

        const handleRemove = () => {
            if (loading) return;
            dispatch(removeitemFromCart(item.product));
            toast.success('Item removed from cart', { position: 'top-center', autoClose: 2000,toastId:'cart-item-removed' });
        }
        
  return (
     <div className='cart-item'>
                            <div className='item-info'>
                                <img src={item.image} alt={item.name} className='item-image' />
                                <div className='item-details'>
                                    <h3 className='item-name'>{item.name}</h3>
                                    <p className='item-price'><strong>Price: </strong>{item.price.toFixed(2)}/-</p>
                                    <p className='item-quantity'><strong>Quantity :</strong>{quantity}</p>
                                </div>
                            </div>

                            <div className='quantity-controls'>
                                <button className='quantity-button decrease-btn' onClick={decreaseQuantity} disabled={loading}>-</button>
                                <input type='number' value={quantity} className='quantity-input' readOnly min='1' />
                                <button className='quantity-button increase-btn' onClick={increaseQuantity} disabled={loading}>+</button>
                            </div>

                            <div className='item-total'>
                                <span className='item-total-price'>{(item.price * quantity).toFixed(2)}/-</span>
                            </div>

                            <div className='item-actions'>
                                <button className='update-item-btn' onClick={handleupdate} disabled={loading || quantity === item.quantity}>{loading ? 'Updating...' : 'Update'}</button>
                                <button className='remove-item-btn' disabled={loading} onClick={handleRemove}>Remove</button>
                            </div>
                        </div>
  )
}

export default Cartitem
