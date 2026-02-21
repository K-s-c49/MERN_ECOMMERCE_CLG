import React, { useEffect, useState } from 'react'
import '../AdminStyles/ReviewsList.css'
import Navbar from '../components/Navbar'
import PageTitle from '../components/PageTitle'
import Footer from '../components/Footer'
import { Delete } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { 
    fetchAdminProduct, 
    fetchProductReviews, 
    deleteReview, 
    removeErrors,
    removeSuccess, 
    clearMessage
} from '../features/admin/adminSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import { useNavigate } from 'react-router-dom'


function ReviewsList() {

    const { Products, loading, error, reviews, success, message } = useSelector(state => state.admin);
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAdminProduct());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error, { autoClose: 3000, position: "top-center" });
            dispatch(removeErrors());
        }

        if (success) {
            toast.success(message, { autoClose: 3000, position: "top-center" });
            dispatch(removeSuccess());
            dispatch(clearMessage());
            navigate("/admin/products");
        }

    }, [error, success, message, dispatch, navigate]);

    const handleDeleteReview = (productId, reviewId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this review?");
        if (confirmDelete) {
            dispatch(deleteReview({ productId, reviewId }));
        }
    };

    const handleViewReviews = (productId) => {
        setSelectedProduct(productId);
        dispatch(fetchProductReviews(productId));
    };

    if (!Products || Products.length === 0) {
        return (
            <div className='reviews-list-container'>
                <h1 className='reviews-list-title'>Admin Reviews</h1>
                <p>No products Found.</p>
            </div>
        );
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <Navbar />
                    <PageTitle title="Product Reviews" />

                    <div className='reviews-list-container'>
                        <h1 className="reviews-list-title">All Product Reviews</h1>

                        <table className="reviews-table">
                            <thead>
                                <tr>
                                    <th>Sr No</th>
                                    <th>Product Name</th>
                                    <th>Product Image</th>
                                    <th>Number of reviews</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Products.map((Product, index) => (
                                    <tr key={Product._id}>
                                        <td>{index + 1}</td>
                                        <td>{Product.name}</td>
                                        <td>
                                            <img
                                                src={Product.images[0].url}
                                                alt={Product.name}
                                                className='product-image'
                                            />
                                        </td>
                                        <td>{Product.numOfReviews}</td>
                                        <td>
                                            {Product.numOfReviews > 0 && (
                                                <button
                                                    className="action-btn view-btn"
                                                    onClick={() => handleViewReviews(Product._id)}
                                                >
                                                    View Reviews
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {selectedProduct && reviews && reviews.length > 0 && (
                            <div className='reviews-details'>
                                <h2 className="reviews-details-title">
                                    Reviews for Selected Product
                                </h2>

                                <table className="reviews-table">
                                    <thead>
                                        <tr>
                                            <th>Sr No</th>
                                            <th>Reviewer Name</th>
                                            <th>Rating</th>
                                            <th>Comment</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reviews.map((review, index) => (
                                            <tr key={review._id}>
                                                <td>{index + 1}</td>
                                                <td>{review.name}</td>
                                                <td>{review.rating}</td>
                                                <td>{review.comment}</td>
                                                <td>
                                                    <button
                                                        className="action-btn delete-btn"
                                                        onClick={() =>
                                                            handleDeleteReview(selectedProduct, review._id)
                                                        }
                                                    >
                                                        <Delete />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>

                    <Footer />
                </>
            )}
        </>
    );
}

export default ReviewsList;