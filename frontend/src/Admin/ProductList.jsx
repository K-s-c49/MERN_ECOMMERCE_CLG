import { useEffect } from 'react'
import '../AdminStyles/ProductsList.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProduct, fetchAdminProduct, removeErrors } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

function ProductList() {
    const { Products, loading, error, deleting } = useSelector(state => state.admin)
    const dispatch = useDispatch()

    const formatDateTime = (value) => {
        if (!value) return '—'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return '—'

        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    }

    useEffect(() => {
        dispatch(fetchAdminProduct())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [error, dispatch])

    const handledelete = (productId) => {
        if (!productId) {
            toast.error('Invalid product id.', { position: 'top-center', autoClose: 3000 })
            return
        }

        const isconfirmed = window.confirm('Are you sure you want to delete this product?')
        if (isconfirmed) {
            dispatch(deleteProduct(productId))
                .unwrap()
                .then(() => {
                    toast.success('Product deleted successfully!', { position: 'top-center', autoClose: 3000 })
                })
                .catch((err) => {
                    toast.error(err || 'Failed to delete product.', { position: 'top-center', autoClose: 3000 })
                })
        }
    }

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
                                            <td>{formatDateTime(product?.createdAt)}</td>
                                            <td>
                                                <Link to={`/admin/product/${product?._id}`} className='action-icon edit-icon'>
                                                    <Edit />
                                                </Link>
                                                <button
                                                    className='action-icon delete-icon'
                                                    onClick={() => handledelete(product?._id)}
                                                    disabled={Boolean(deleting?.[product?._id])}
                                                >
                                                    {deleting?.[product?._id] ? <Loader /> : <Delete />}
                                                </button>
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
