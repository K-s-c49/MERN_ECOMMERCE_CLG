import { useEffect } from 'react'
import '../AdminStyles/ProductsList.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminProduct, removeErrors } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

function ProductList() {
    const { Products, loading, error } = useSelector(state => state.admin)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAdminProduct())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [error, dispatch])

    return (
        <>
            <Navbar />
            <PageTitle title="Product List" />

            {loading ? (
                <Loader />
            ) : (
                <div className='product-list-container'>
                    <h1 className='product-list-title'>All Products</h1>

                    {!Products || Products.length === 0 ? (
                        <p className='no-admin-products'>No products available.</p>
                    ) : (
                        <table className='product-table'>
                            <thead>
                                <tr>
                                    <th>Sr No</th>
                                    <th>Product Image</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Ratings</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Products.map((product, index) => {
                                    const imageUrl = product?.images?.[0]?.url
                                    return (
                                        <tr key={product?._id || index}>
                                            <td>{index + 1}</td>
                                            <td>
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={product?.name || 'Product'} className='admin-product-image' />
                                                ) : (
                                                    '—'
                                                )}
                                            </td>
                                            <td>{product?.name}</td>
                                            <td>₹{product?.price}</td>
                                            <td>{product?.ratings}</td>
                                            <td>{product?.category}</td>
                                            <td>{product?.stock}</td>
                                            <td>{product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : '—'}</td>
                                            <td>
                                                <Link to={`/admin/products/${product?._id}`} className='action-icon edit-icon'>
                                                    <Edit />
                                                </Link>
                                                <Link to={`/admin/products/${product?._id}`} className='action-icon delete-icon'>
                                                    <Delete />
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            <Footer />
        </>
    )
}

export default ProductList
