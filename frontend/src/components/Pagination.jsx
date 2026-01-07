import React from 'react'
import '../componentStyles/Pagination.css'

function Pagination({currentPage, totalPages, onPageChange, activeClass='active', nextPageText='Next', prevPageText='Prev', firstPageText='First', lastPageText='Last'}) {
    if(!totalPages || totalPages <= 1) return null;

    // Generate page numbers
    const getPageNumbers = () => {
        const pageNumbers = [];
        const pageWindow = 2; // Number of pages to show on each side of the current page
        
        for (let i = Math.max(1, currentPage - pageWindow); i <= Math.min(totalPages, currentPage + pageWindow); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div className='pagination'>
            {/* First & Prev buttons */}
            {currentPage > 1 && (
                <>
                    <button className='pagination-btn' onClick={() => onPageChange(1)}>{firstPageText}</button>
                    <button className='pagination-btn' onClick={() => onPageChange(currentPage - 1)}>{prevPageText}</button>
                </>
            )}

            {/* Display page numbers */}
            {getPageNumbers().map((number) => (
                <button 
                    className={`pagination-btn ${currentPage === number ? activeClass : ''}`}
                    key={number}
                    onClick={() => onPageChange(number)}
                >
                    {number}
                </button>
            ))}

            {/* Next & Last buttons */}
            {currentPage < totalPages && (
                <>
                    <button className='pagination-btn' onClick={() => onPageChange(currentPage + 1)}>{nextPageText}</button>
                    <button className='pagination-btn' onClick={() => onPageChange(totalPages)}>{lastPageText}</button>
                </>
            )}
        </div>
    )
}

export default Pagination