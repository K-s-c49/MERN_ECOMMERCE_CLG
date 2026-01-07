import React from 'react'
import '../componentStyles/NoProducts.css'

function NoProduct({keyword}) {
  return (
    <div className="no-products-content">
        <div className='no-products-icon'>
            <img 
                src="/images/productnotfound.png" 
                alt="No Products Found" 
                className='no-products-image'
            />
          
            <p className='no-products-message'>
                {keyword?`No products found for "${keyword}". Please try a different search.`:'There are currently no products available. Please check back later.'}
             </p>
        </div>
    </div>
  )
}

export default NoProduct