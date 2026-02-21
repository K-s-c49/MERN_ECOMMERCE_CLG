import { useState } from 'react'
import '../AdminStyles/CreateProduct.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createProduct, removeErrors, removeSuccess } from '../features/admin/adminSlice'
import { categoriesData } from '../data/categories'

function CreateProduct() {
  const { loading } = useSelector(state => state.admin)
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [mainCategory, setMainCategory] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState('')
  const [images, setImages] = useState([])
  const [imagesPreviews, setImagesPreviews] = useState([])

  const selectedMain = categoriesData.find((c) => c?.name === mainCategory)
  const subcategoryOptions = selectedMain?.subcategories || []

  const createProductSubmit = async (e) => {
    e.preventDefault()

    if (!category) {
      toast.error('Please choose a subcategory', { position: 'top-center', autoClose: 3000 })
      return
    }

    const productData = {
      name,
      price: Number(price),
      description,
      category,
      stock: Number(stock),
      images,
    }

    try {
      await dispatch(createProduct(productData)).unwrap()
      toast.success('Product created successfully', { position: 'top-center', autoClose: 3000 })
      dispatch(removeSuccess())

      setName('')
      setPrice('')
      setDescription('')
      setMainCategory('')
      setCategory('')
      setStock('')
      setImages([])
      setImagesPreviews([])
    } catch (err) {
      toast.error(err || 'Failed to create product', { position: 'top-center', autoClose: 3000 })
      dispatch(removeErrors())
    }
  }

  const createProductImage = (e) => {
    const files = Array.from(e.target.files || [])

    setImages([])
    setImagesPreviews([])

    files.forEach((file) => {
      const reader = new FileReader()

      reader.onload = () => {
        if (reader.readyState === 2) {
          const base64 = reader.result
          setImagesPreviews(old => [...old, base64])
          setImages(old => [...old, base64])
        }
      }

      reader.readAsDataURL(file)
    })
  }

  return (
    <>
      <Navbar />
      <PageTitle title="Create Product" />

      <div className='create-product-container'>
        <h1 className='form-title'>Create New Product</h1>

        <form className='product-form' onSubmit={createProductSubmit}>
          <input
            type="text"
            placeholder='Product Name'
            className='form-input'
            required
            name='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder='Price'
            className='form-input'
            required
            name='Price'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <textarea
            placeholder='Description'
            className='form-input'
            required
            name='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            name="mainCategory"
            className='form-select'
            value={mainCategory}
            required
            onChange={(e) => {
              setMainCategory(e.target.value)
              setCategory('')
            }}
          >
            <option value="">Choose a Category</option>
            {categoriesData.map((c) => (
              <option value={c.name} key={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            name="category"
            className='form-select'
            value={category}
            required
            disabled={!mainCategory}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Choose a Subcategory</option>
            {subcategoryOptions.map((sub) => (
              <option value={sub} key={sub}>{sub}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder='Stock'
            className='form-input'
            required
            name='Stock'
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />

          <div className='file-input-container'>
            <input
              type="file"
              accept='image/*'
              className='form-input-file'
              multiple
              name='image'
              onChange={createProductImage}
            />
          </div>

          <div className='image-preview-container'>
            {imagesPreviews.map((img, index) => (
              <img
                src={img}
                alt="Product Preview"
                className='image-preview'
                key={index}
              />
            ))}
          </div>

          <button type='submit' className='submit-btn' disabled={loading}>
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>

      <Footer />
    </>
  )
}

export default CreateProduct
