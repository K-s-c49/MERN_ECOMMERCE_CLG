import { useEffect } from 'react'
import '../AdminStyles/OrdersList.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { Delete, Edit } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from 'react-redux'
import { deleteOrder, fetchAllOrders, removeErrors } from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
function OrderList() {
    const { orders, loading, error, deleting } = useSelector((state) => state.admin)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAllOrders())
    }, [dispatch])

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [error, dispatch])

    const handleDelete = (orderId) => {
        if (!orderId) return

        const confirmed = window.confirm('Are you sure you want to delete this order?')
        if (!confirmed) return

        dispatch(deleteOrder(orderId))
            .unwrap()
            .then((data) => {
                toast.success(data?.message || 'Order deleted successfully', {
                    position: 'top-center',
                    autoClose: 3000,
                })
            })
            .catch((err) => {
                toast.error(err || 'Failed to delete order', {
                    position: 'top-center',
                    autoClose: 3000,
                })
            })
    }

    return (
        <>
            <Navbar />
            <PageTitle title="Orders List - Admin Dashboard" />

            {loading ? (
                <Loader />
            ) : (
                <div className='ordersList-container'>
                    <h1 className='ordersList-title'>Orders List</h1>

                    {!Array.isArray(orders) || orders.length === 0 ? (
                        <div className="no-orders-container">
                            <p>No orders available</p>
                        </div>
                    ) : (
                        <div className='ordersList-table-container'>
                            <table className='ordersList-table'>
                                <thead>
                                    <tr>
                                        <th>Sr No</th>
                                        <th>Order ID</th>
                                        <th>Status</th>
                                        <th>Total Price</th>
                                        <th>Number of Items</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, index) => {
                                        const orderStatus = order?.orderStatus || '—'
                                        const itemCount = Array.isArray(order?.orderItems)
                                            ? order.orderItems.length
                                            : 0

                                        return (
                                            <tr key={order?._id || index}>
                                                <td>{index + 1}</td>
                                                <td>{order?._id || '—'}</td>
                                                <td className={`order-status ${String(orderStatus).toLowerCase()}`}>
                                                    {orderStatus}
                                                </td>
                                                <td>₹{order?.totalPrice ?? '—'}</td>
                                                <td>{itemCount}</td>
                                                <td>
                                                    <Link to={`/admin/order/${order?._id}`} className="action-icon edit-icon">
                                                        <Edit />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(order?._id)}
                                                        className="action-icon delete-icon"
                                                        disabled={Boolean(deleting?.[order?._id])}
                                                        aria-label={deleting?.[order?._id] ? 'Deleting order' : 'Delete order'}
                                                    >
                                                        {deleting?.[order?._id] ? (
                                                            <CircularProgress size={18} thickness={5} color="primary" />
                                                        ) : (
                                                            <Delete />
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <Footer />
        </>
    )
}

export default OrderList
