import React from 'react'
import '../pageStyles/ProductDetails.css'
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Rating from '../components/Rating.jsx'
import Loader from '../components/Loader'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProductDetails, removeError } from '../features/products/productSlice.js'
import { toast } from 'react-toastify'

function ProductDetails() {
    const [userRating, setUserRating] = useState(0);
    const [quantity, setQuantity] = useState(1);
    
    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    }
    
    const { loading, product, error } = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const { id } = useParams();
    
    useEffect(() => {
        dispatch(getProductDetails(id));
        return () => {
            dispatch(removeError());
        };
    }, [dispatch, id]);
    
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(removeError());
        }
    }, [error, dispatch]);
    
    const increaseQuantity = () => {
        if (product && quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };
    
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    
    if (loading || !product) {
        return <Loader />;
    }
    
    return (
        <>
            <PageTitle title={`${product.name} - Details`} />
            <Navbar />
            <div className='product-details-container'>
                <div className='product-detail-container'>
                    <div className='product-image-container'>
                        <img 
                            src={product.images && product.images[0]?.url} 
                            alt={product.name} 
                            className='product-detail-image'
                            onError={(e) => e.target.src = 'https://via.placeholder.com/400x400?text=No+Image'}
                        />
                    </div>
                    <div className="product-info">
                        <h2>{product.name}</h2>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">₹{product.price?.toLocaleString('en-IN')}</p>

                        <div className="product-rating">
                            <Rating 
                                value={product.ratings}
                                disable={true}
                            />
                            <span className='productCardSpan'>({product.numOfReviews} {product.numOfReviews === 1 ? 'Review' : 'Reviews'})</span>
                        </div>
                        <div className="stock-status">
                            {product.stock > 0 ? (
                                <span className='in-stock'>In Stock ({product.stock} available)</span>
                            ) : (
                                <span className='out-of-stock'>Out of Stock</span>
                            )}
                        </div>
                        <div className="quantity-controls">
                            <span className='quantity-label'>Quantity:</span>
                            <button className='quantity-button' onClick={decreaseQuantity}>-</button>
                            <input type="text" value={quantity} readOnly className='quantity-value'/>
                            <button className='quantity-button' onClick={increaseQuantity}>+</button>
                        </div>
                        <button className='add-to-cart-btn'>Add to Cart</button>
                        <form className="review-form">
                            <h3>Write a Review</h3>
                            <Rating 
                                value={userRating}
                                disable={false}
                                onRatingChange={handleRatingChange}
                            />
                            <textarea 
                                className='review-input' 
                                placeholder='Write your review here...'
                            ></textarea>
                            <button type='submit' className='submit-review-btn'>Submit Review</button>
                        </form>
                    </div>
                </div>

                <div className='reviews-container'>
                    <h3>Customer Reviews</h3>
                    <div className="review-section">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review, index) => (
                                <div className="review-item" key={index}>
                                    <div className='review-header'>
                                        <Rating 
                                            value={review.rating}
                                            disable={true}
                                        />
                                    </div>
                                    <div className='review-comment'>
                                        <p className='review-name'>by {review.name}</p>
                                        <p className='review-text'>{review.comment}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ProductDetails