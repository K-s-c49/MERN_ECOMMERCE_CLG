import React from 'react'
import '../AdminStyles/UpdateProduct.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getProductDetails } from '../features/products/productSlice'
import { removeErrors, removeSuccess, updateProduct } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'

function Updateproduct() {
  const [name, setName] = useState()
  const [price, setPrice] = useState()
  const [description, setDescription] = useState()
  const [category, setCategory] = useState()
  const [stock, setStock] = useState()
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])

  const { product } = useSelector(state => state.products)
  const { loading, error, success } = useSelector(state => state.admin)
    const dispatch = useDispatch()
  const navigate = useNavigate()
  const { updateId } = useParams()

    const catergory = [
        "Electronics",
        "Clothing",
        "Home & Kitchen",
        "Books",
        "Sports",
        "Beauty & Personal Care",
        "Toys & Games",
        "Automotive",
        "Health & Wellness",
        "Grocery"
    ]

    useEffect(() => {
        dispatch(getProductDetails(updateId))
    }, [dispatch, updateId])

    const oldImages = product?.images || []
    const nameValue = name ?? (product?.name || '')
    const priceValue = price ?? (product?.price ?? '')
    const descriptionValue = description ?? (product?.description || '')
    const categoryValue = category ?? (product?.category || '')
    const stockValue = stock ?? (product?.stock ?? '')

    useEffect(() => {
      if (error) {
        toast.error(error || 'Failed to update product', { position: 'top-center', autoClose: 3000 })
        dispatch(removeErrors())
      }
      if (success) {
        toast.success('Product updated successfully', { position: 'top-center', autoClose: 3000 })
        dispatch(removeSuccess())
        navigate('/admin/products')
      }
    }, [dispatch, error, success, navigate])

    const handleImageChnage = (e) => {
      const files = Array.from(e.target.files || [])

      setImages([])
      setPreviewImages([])

      files.forEach((file) => {
        const reader = new FileReader()

        reader.onload = () => {
          if (reader.readyState === 2) {
            const base64 = reader.result
            setPreviewImages(old => [...old, base64])
            setImages(old => [...old, base64])
          }
        }

        reader.readAsDataURL(file)
      })
    }

    const updateProductSubmit = async (e) => {
      e.preventDefault()

      const productData = {
        name: nameValue,
        price: Number(priceValue),
        description: descriptionValue,
        category: categoryValue,
        stock: Number(stockValue),
      }

      // Only send images if user selected new ones (so backend won't delete old images).
      if (images.length > 0) {
        productData.images = images
      }

      try {
        await dispatch(updateProduct({ id: updateId, productData })).unwrap()
      } catch {
        // error toast handled by effect via admin.error
      }
    }
  return (
    <>
    <Navbar/>
    <PageTitle title="Update Product"/>
    <div className='update-product-wrapper'>
      <h1 className='update-product-title'>Update Product</h1>
      <form className='update-product-form' encType='multipart/form-data' onSubmit={updateProductSubmit}>
      <label htmlFor="product-name">Product Name:</label>
      <input type="text" className='update-product-input' required id='name' name='name' value={nameValue} onChange={(e) => setName(e.target.value)}/>
      <label htmlFor="product-price">Product Price:</label>
      <input type="number" className='update-product-input' required id='price' name='price' value={priceValue} onChange={(e) => setPrice(e.target.value)}/>
      <label htmlFor="product-description">Description:</label>
      <textarea className='update-product-textarea' required id='description' name='description' value={descriptionValue} onChange={(e) => setDescription(e.target.value)}></textarea> 
      <label htmlFor="product-category">Category:</label>
      <select name="category" id="category" className='update-product-select' value={categoryValue} onChange={(e) => setCategory(e.target.value)}>
        {catergory.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
         </select>
      <label htmlFor="product-stock">Stock:</label>
      <input type="number" className='update-product-input' required id='stock' name='stock' value={stockValue} onChange={(e) => setStock(e.target.value)}/>
      <label htmlFor="product-images">Product Images:</label>
      <div className='update-product-file-wrapper'>
        <input type="file" className='update-product-file-input' accept="image/*" name='image' multiple onChange={handleImageChnage}/>
      </div>
      <div className='update-product-preview-wrapper'>
        {previewImages.map((image, index) => (
          <img key={index} src={image} alt="Product Preview" className='update-product-preview-image' />
        ))}
      </div>
      <div className='update-product-old-images-wrapper'>
        {oldImages.map((image, index) => (
          <img key={index} src={image?.url || image} alt="Old Product Image" className='update-product-old-image'/>
        ))}
      </div>
      <button type="submit" className='update-product-submit-btn' disabled={loading}>
        {loading ? 'Updating...' : 'Update Product'}
      </button>
      </form>
    </div>
    <Footer />
    </>
  )
}

export default Updateproduct
