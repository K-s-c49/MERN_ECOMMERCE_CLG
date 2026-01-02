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
import { getProducts, removeError } from '../features/products/productSlice'
import { toast } from 'react-toastify'


function Home() {
const {loading,error, products, productCount}  = useSelector((state) => state.products);
const dispatch = useDispatch();
useEffect(() => {
  dispatch(getProducts());
}, [dispatch]);

useEffect(() => {
  if (error) {
    toast.error(error.message , { position: 'top-center', autoClose: 3000 });
    dispatch(removeError());
  } 
}, [dispatch, error]);
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
        {products.map((product, index) => (
          <Product product={product} key={product._id || index}/>
        ))}
      </div>
    </div>
      <Footer />
    </> )}
</>
  )
}

export default Home
