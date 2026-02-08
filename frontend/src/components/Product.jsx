import React from 'react'
import { Link } from 'react-router-dom'
import '../componentStyles/Product.css'
import Rating from './Rating';
import { useState } from 'react';

function Product({ product }) {
  const [rating , setRating]=useState(0);
const handleRatingChange = (newRating) => {
  setRating(newRating);
  console.log("New Rating:", newRating);
}
  return (
    <Link to={`product/${product._id}`} className='product_id'>
    <div className="product-card">
        <img 
            src={product.images && product.images[0]?.url} 
            alt={product.name}
            className="product-image-card"
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/productnotfound.png'; }}
        />
        <div className='product-details'>
            <h3 className="product-title">{product.name}</h3>
            <p className='home-price'><strong>Price: </strong>₹{product.price?.toLocaleString('en-IN')}</p>
            <div className="rating_container">
              <Rating
              value={product.ratings}
              onRatingChange={handleRatingChange}
              disable={true}
              />
            </div>
            <span className='productCardSpan'>
              ({product.numOfReviews} {product.numOfReviews === 1 ? 'Review' : 'Reviews'})
            </span>
            <button className='add-to-cart'>View Details</button>
        </div>
    </div>
    </Link>
  )
}

export default Product