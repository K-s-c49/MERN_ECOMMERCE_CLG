import React, { useEffect, useState } from 'react'
import '../pageStyles/Products.css'
import PageTitle from '../components/PageTitle.jsx'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useDispatch, useSelector } from 'react-redux'
import Product from '../components/Product'
import { getProducts } from '../features/products/productSlice.js'
import Loader from '../components/Loader'
import { useLocation, useNavigate } from 'react-router-dom'
import NoProduct from '../components/NoProduct.jsx'
import Pagination from '../components/Pagination.jsx'
import Categories from '../components/Categories.jsx'

function Products() {
    const {loading, products, totalPages}  = useSelector((state) => state.products);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword') || '';
    const categoryFromParams = queryParams.get('category') || '';
    const pageFromParams = parseInt(queryParams.get('page'), 10) || 1;
    const [currentPage, setCurrentPage] = useState(pageFromParams);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromParams);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
        
        // Update URL with category parameter
        const newSearchParams = new URLSearchParams(location.search);
        if (category) {
            newSearchParams.set('category', category);
        } else {
            newSearchParams.delete('category');
        }
        newSearchParams.delete('page'); // Reset to page 1 when category changes
        navigate(`?${newSearchParams.toString()}`);
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        setCurrentPage(pageFromParams);
    }, [pageFromParams]);

    useEffect(() => {
        setSelectedCategory(categoryFromParams);
    }, [categoryFromParams]);

    useEffect(() => {
        dispatch(getProducts({keyword, page: currentPage, category: selectedCategory}));
    }, [dispatch, keyword, currentPage, selectedCategory]);

    const handlePageChange = (page) => {
        if (page !== currentPage && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            const newSearchParams = new URLSearchParams(location.search);
            if(page === 1){
                newSearchParams.delete('page');
            } else {
                newSearchParams.set('page', page);
            }
            navigate(`?${newSearchParams.toString()}`);
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

  return (
    <>
  { loading?(<Loader />):(<>
    <PageTitle title="All Products - E-Commerce App"/>
    <Navbar/>
    <div className='products-layout'>
        <div className='filter-section'>
            <Categories onCategorySelect={handleCategorySelect} selectedCategory={selectedCategory} />
        </div>
        <div className='products-section'>
            {products.length > 0 ? (
                <>
                    <div className="products-product-container">
                        {products.map((product, index) => (
                            <Product product={product} key={product._id || index}/>
                        ))}
                    </div>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <NoProduct keyword={keyword}/>
            )}
        </div>
        </div>
    <Footer/>

    </>)}  
  </>
)
}

export default Products