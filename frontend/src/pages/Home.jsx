import React from 'react'
import Footer from '../components/Footer'
import '../pageStyles/Home.css'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'
import PageTitle from '../components/PageTitle'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { useEffect } from 'react'
import { getProducts } from '../features/products/productSlice'

function Home() {
const {loading, products}  = useSelector((state) => state.products);
const dispatch = useDispatch();
useEffect(() => {
  dispatch(getProducts({}));
}, [dispatch]);

return (
    <>
{ loading ?(<Loader />)
 : (
    <>
    <PageTitle title="Home - E-Commerce App"/>
    <Navbar/>
    <ImageSlider />
    <div className='home-container'> 
      <h2 className='home-heading'>Trending Now</h2>
      <div className='home-product-container'>
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <Product product={product} key={product._id || index}/>
          ))
        ) : (
          <p style={{textAlign: 'center', fontSize: '1.1rem', color: '#666'}}>No products available</p>
        )}
      </div>
    </div>
      <Footer />
    </> )}
</>
  )
}

export default Home
