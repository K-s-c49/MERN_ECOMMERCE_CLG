import React, { useEffect } from 'react';
import '../OrderStyles/OrderDetails.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails, removeError } from '../features/order/orderSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function OrderDetails() {
    const { orderId } = useParams();
    const { order, loading, error } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!orderId) return;
        dispatch(getOrderDetails(orderId));
    }, [dispatch, orderId]);

    useEffect(() => {
        if (!error) return;
        const message = typeof error === 'string' ? error : error?.message;
        toast.error(message || 'Failed to fetch order details', {
            position: 'top-center',
            autoClose: 3000,
        });
        dispatch(removeError());
    }, [dispatch, error]);

    const shippingInfo = order?.shippingInfo ?? {};
    const orderItems = order?.orderItems ?? order?.orderitems ?? [];
    const paymentInfo = order?.paymentInfo ?? {};

    const orderStatus = order?.orderStatus;
    const totalPrice = order?.totalPrice;
    const taxPrice = order?.taxPrice;
    const shippingPrice = order?.shippingPrice;
    const itemsPrice = order?.itemsPrice;
    const paidAt = order?.paidAt;

    const computedItemsPrice = Array.isArray(orderItems)
        ? orderItems.reduce((sum, item) => sum + Number(item?.price || 0) * Number(item?.quantity || 0), 0)
        : 0;

    const paymentStatus = paymentInfo?.status === 'succeeded' ? 'Paid' : 'Not Paid';
    const finalOrderStatus = paymentStatus === 'Not Paid' ? 'Cancelled' : orderStatus;

    const normalizedStatus = (finalOrderStatus || 'processing').toString().toLowerCase();
    const orderStatusClass = `status-tag ${normalizedStatus === 'delivered' ? 'delivered' : normalizedStatus}`;
    const paymentStatusClass = `pay-tag ${paymentStatus === 'Paid' ? 'paid' : 'not-paid'}`;


  return (
   <>
            <PageTitle title={`Order ID: ${orderId || ''}`} />
            <Navbar />

            {loading ? (
                <Loader />
            ) : (
                <div className="order-box">
                    <div className="table-block">
                        <h2 className="table-title">Order Items</h2>
                        <table className="table-main">
                            <thead className="table-head">
                                <tr>
                                    <th className="head-cell">Image</th>
                                    <th className="head-cell">Name</th>
                                    <th className="head-cell">Quantity</th>
                                    <th className="head-cell">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(orderItems) && orderItems.length > 0 ? (
                                    orderItems.map((item) => (
                                        <tr className="table-row" key={item?.product || item?._id || item?.name}>
                                            <td className="table-cell">
                                                {item?.image ? (
                                                    <img src={item.image} alt={item?.name || 'Item'} className="item-img" />
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="table-cell">{item?.name}</td>
                                            <td className="table-cell">{item?.quantity}</td>
                                            <td className="table-cell">₹{item?.price}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="table-row">
                                        <td className="table-cell" colSpan={4}>
                                            No items found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-block">
                        <h2 className="table-title">Shipping Information</h2>
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="head-cell">Address:</th>
                                    <td className="table-cell">
                                        {shippingInfo?.address || ''}
                                        {shippingInfo?.city ? `, ${shippingInfo.city}` : ''}
                                        {shippingInfo?.state ? `, ${shippingInfo.state}` : ''}
                                        {shippingInfo?.country ? `, ${shippingInfo.country}` : ''}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="head-cell">Phone:</th>
                                    <td className="table-cell">{shippingInfo?.phoneNo ?? '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="table-block">
                        <h2 className="table-title">Order Summary</h2>
                        <table className="table-main">
                            <tbody>
                                <tr className="table-row">
                                    <th className="head-cell">Order Status</th>
                                    <td className="table-cell">
                                        <span className={orderStatusClass}>{finalOrderStatus || '-'}</span>
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="head-cell">Payment Status</th>
                                    <td className="table-cell">
                                        <span className={paymentStatusClass}>{paymentStatus}</span>
                                        {paidAt ? (
                                            <span className="payment-date"> {new Date(paidAt).toLocaleDateString()}</span>
                                        ) : null}
                                    </td>
                                </tr>
                                <tr className="table-row">
                                    <th className="head-cell">Item Price</th>
                                    <td className="table-cell">₹{itemsPrice ?? computedItemsPrice ?? '-'}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="head-cell">Tax Price</th>
                                    <td className="table-cell">₹{taxPrice ?? '-'}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="head-cell">Shipping Price</th>
                                    <td className="table-cell">₹{shippingPrice ?? '-'}</td>
                                </tr>
                                <tr className="table-row">
                                    <th className="head-cell">Total Price</th>
                                    <td className="table-cell">₹{totalPrice ?? '-'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Footer />
        </>
  )
}

export default OrderDetails
