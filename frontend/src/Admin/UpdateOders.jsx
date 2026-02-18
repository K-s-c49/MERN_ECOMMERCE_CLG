import { useEffect, useMemo, useState } from 'react'
import '../AdminStyles/UpdateOrder.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getOrderDetails, removeError as removeOrderError } from '../features/order/orderSlice'
import { removeErrors, updateOrderStatus } from '../features/admin/adminSlice'
import Loader from '../components/Loader'
function UpdateOders() {
    const [status, setStatus] = useState('')
    const {orderId}= useParams();
    const { order, loading: orderLoading, error: orderError } = useSelector((state) => state.order)
    const { error: adminError, deleting, loading: adminLoading } = useSelector((state) => state.admin)
    const loadingState = orderLoading || adminLoading
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getOrderDetails(orderId));
    }, [dispatch, orderId])

    const shippingInfo = order?.shippingInfo
    const orderItems = useMemo(() => (Array.isArray(order?.orderItems) ? order.orderItems : []), [order])
    const totalPrice = order?.totalPrice
    const orderStatus = order?.orderStatus
    const isDelivered = orderStatus === 'Delivered'

    const handlestatusupdate = () => {
        if (!status) {
            toast.error('Please select a status to update.', { position: 'top-center', autoClose: 3000 })
            return
        }
        dispatch(updateOrderStatus({ orderId, status }))
            .unwrap()
            .then((data) => {
                toast.success(data?.message || 'Order status updated successfully!', {
                    position: 'top-center',
                    autoClose: 3000,
                })
                dispatch(getOrderDetails(orderId))
                setStatus('')
            })
            .catch((err) => {
                toast.error(err || 'Failed to update order status', {
                    position: 'top-center',
                    autoClose: 3000,
                })
            })
    }

    useEffect(() => {
        if (orderError) {
            toast.error(orderError?.message || orderError || 'Failed to fetch order details', {
                position: 'top-center',
                autoClose: 3000,
            })
            dispatch(removeOrderError())
        }
    }, [orderError, dispatch])

    useEffect(() => {
        if (adminError) {
            toast.error(adminError, { position: 'top-center', autoClose: 3000 })
            dispatch(removeErrors())
        }
    }, [adminError, dispatch])

  return (
    <>
    <Navbar />
    <PageTitle title="Update Order - Admin Dashboard" />
   {loadingState ? (
        <Loader />
    ) : (
        <div className='order-container'>
        <h1 className='order-title'>Update Order</h1>
            <div className='order-details'>
                <h2>Order information</h2>
                <p><strong>Order ID: </strong> {orderId}</p>
                <p><strong>Customer Name: </strong> {shippingInfo?.name}</p>
                <p><strong>Shipping Address: </strong> {shippingInfo?.address}, {shippingInfo?.city}, {shippingInfo?.country}</p>
                <p><strong>Phone: </strong> {shippingInfo?.phone}</p>
                <p><strong>Order Status: </strong> {orderStatus}</p>
                <p><strong>Payment Status: </strong> {order?.paymentInfo?.status}</p>
                <p><strong>Total Price: </strong> ₹{totalPrice}</p>
            </div>
            <div className='order-items'>
                <h2>Order Items</h2>
                <table className='order-table'>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderItems.length > 0 ? (
                            orderItems.map((item, idx) => (
                                <tr key={item?._id || idx}>
                                    <td>
                                        {item?.image ? (
                                            <img src={item.image} alt={item?.name || 'Item'} className='order-item-image'/>
                                        ) : (
                                            '—'
                                        )}
                                    </td>
                                    <td>{item?.name || '—'}</td>
                                    <td>{item?.quantity ?? '—'}</td>
                                    <td>₹{item?.price ?? '—'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>No items found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className='order-status'>
                <h2>Update Order Status</h2>
                <select  className="status-select" value={status} onChange={(e) => setStatus(e.target.value)} disabled={loadingState || isDelivered}>
                    <option value="">Select Status</option>
                    <option value="Shipping">Shipping</option>
                    <option value="On The Way">On The Way</option>
                    <option value="Delivered">Delivered</option>
                </select>
                <button className='update-button' onClick={handlestatusupdate} disabled={loadingState || !status || isDelivered || Boolean(deleting?.[orderId])}>
                    {deleting?.[orderId] ? 'Updating...' : 'Update Status'}
                </button>
            </div>
    </div>
    )}
    <Footer />
    </>
  )
}
export default UpdateOders
