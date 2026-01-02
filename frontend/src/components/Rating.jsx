import React from 'react'
import '../componentStyles/Rating.css'
import { useState } from 'react';

function Rating({value,onRatingChange,disable}) {
 const [hoveredrating , setHoveredRating]=useState(0);
 const [selectedRating , setSelectedRating]=useState(value || 0);

 //  star handler

 const handleMouseEnter = (rating) => {
    if (!disable){
        setHoveredRating(rating);
    }
};
// mouse leave handler
const handleMouseLeave = () => {
    if (!disable){
        setHoveredRating(0);
    }
};
// click handler
const handleClick = (rating) => {
    if (!disable){
        setSelectedRating(rating);
        if (onRatingChange) {
            onRatingChange(rating);
        }
    }
};

// function to generate and render stars based on rating
const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const isFilled = i <= (hoveredrating || selectedRating);
        stars.push(   
            <span
            key={i} 
            className={`star ${isFilled ? 'filled' : ''}`}
            onMouseEnter={() => handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(i)}
            style={{pointerEvents:disable?'none':'auto'}}

            >🟉</span> 
        );
    }  
    return stars;
};
    return (
    <div>
        <div className='rating'>{generateStars()}</div>
    </div>
  )
}

export default Rating