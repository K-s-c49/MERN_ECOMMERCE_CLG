import React, { useEffect } from 'react';
import '../OrderStyles/MyOrders.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTitle from '../components/PageTitle';
import { Link } from 'react-router-dom';
import { LaunchOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { getAllMyOrders, removeError } from '../features/order/orderSlice';

function MyOrders() {
    const { orders, loading, error } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllMyOrders());
    }, [dispatch]);

    useEffect(() => {
        if (!error) return;
        const message = typeof error === 'string' ? error : error?.message;
        toast.error(message || 'Failed to fetch orders', {
            position: 'top-center',
            autoClose: 3000,
        });
        dispatch(removeError());
    }, [dispatch, error]);

    return (
        <>
            <Navbar />
            <PageTitle title="User Orders" />

            {loading ? (
                <Loader />
            ) : Array.isArray(orders) && orders.length > 0 ? (
                <div className="my-orders-container">
                    <h2>My Orders</h2>
                    <div className="table--responsive">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Items Count</th>
                                    <th>Status</th>
                                    <th>Total Price</th>
                                    <th>View Order</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order?._id}>
                                        <td>{order?._id}</td>
                                        <td>{order?.orderItems?.length ?? order?.orderitems?.length ?? 0}</td>
                                        <td>{order?.orderStatus}</td>
                                        <td>${order?.totalPrice}</td>
                                        <td>
                                            <Link to={`/order/${order?._id}`} className="order-link">
                                                <LaunchOutlined />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="no-orders">
                    <p className="no-order-message">No orders found.</p>
                </div>
            )}

            <Footer />
        </>
    );
}

export default MyOrders
