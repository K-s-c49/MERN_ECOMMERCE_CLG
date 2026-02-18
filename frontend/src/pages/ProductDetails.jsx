import "../pageStyles/ProductDetails.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "../components/Rating.jsx";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  createReview,
  getProductDetails,
  removeError,
  removeSuccess,
} from "../features/products/productSlice.js";
import {
  additemsToCart,
  removeError as removeCartError,
  removeMessage as removeCartMessage,
} from "../features/Cart/cartSlice.js";
import { toast } from "react-toastify";

function ProductDetails() {
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const { loading, product, error, reviewLoading } = useSelector(
    (state) => state.products,
  );
  const {
    loading: cartLoading,
    error: cartError,
    success: cartSuccess,
    message: cartMessage,
  } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getProductDetails(id));
    return () => {
      dispatch(removeError());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (cartError) {
      toast.error(cartError, { position: "top-center", autoClose: 2000 });
      dispatch(removeCartError());
    }
    if (cartSuccess) {
      toast.success(cartMessage || "Cart updated", {
        position: "top-center",
        autoClose: 2000,
      });
      dispatch(removeCartMessage());
    }
  }, [cartError, cartSuccess, cartMessage, dispatch]);

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (product && quantity >= product.stock) {
      toast.warning("Cannot add more than available stock", {
        autoClose: 2000,
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userRating) {
      toast.warning("Please provide a rating", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }
    try {
      await dispatch(
        createReview({ rating: userRating, comment, productId: product._id }),
      ).unwrap();
      toast.success("Review submitted successfully", {
        position: "top-center",
        autoClose: 2000,
      });
      setUserRating(0);
      setComment("");
      dispatch(removeSuccess());
      dispatch(getProductDetails(id));
    } catch (err) {
      toast.error(err || "Failed to submit review", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };
  if (loading || !product) {
    return <Loader />;
  }

  const isSelectedImageValid = product?.images?.some(
    (img) => img?.url === selectedImage,
  );
  const mainImageUrl =
    (isSelectedImageValid ? selectedImage : product?.images?.[0]?.url) ||
    "/images/productnotfound.png";
  const maxQuantity = Math.max(0, Number(product?.stock || 0));
  const displayQuantity =
    maxQuantity > 0 ? Math.min(quantity, maxQuantity) : quantity;

  const addToCart = async () => {
    try {
      if (product.stock <= 0) {
        toast.warning("Product is out of stock", { autoClose: 2000 });
        return;
      }
      await dispatch(
        additemsToCart({
          id: product._id,
          quantity: Math.min(displayQuantity, product.stock),
        }),
      );
      // success toast handled centrally via cart state effect
    } catch {
      toast.error("Failed to add to cart", { autoClose: 2000 });
    }
  };

  return (
    <>
      <PageTitle title={`${product.name} - Details`} />
      <Navbar />
      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img
              src={mainImageUrl}
              alt={product.name}
              className="product-detail-image"
              loading="eager"
              decoding="async"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/productnotfound.png";
              }}
            />

            {product?.images?.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={img?.public_id || index}
                    src={img?.url}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail-image${img?.url === mainImageUrl ? " selected" : ""}`}
                    loading="lazy"
                    decoding="async"
                    tabIndex={0}
                    role="button"
                    onClick={() => setSelectedImage(img?.url)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedImage(img?.url);
                      }
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/productnotfound.png";
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">
              ₹{product.price?.toLocaleString("en-IN")}
            </p>

            <div className="product-rating">
              <Rating value={product.ratings} disable={true} />
              <span className="productCardSpan">
                ({product.numOfReviews}{" "}
                {product.numOfReviews === 1 ? "Review" : "Reviews"})
              </span>
            </div>
            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>
            <div className="quantity-controls">
              <span className="quantity-label">Quantity:</span>
              <button
                type="button"
                className="quantity-button"
                onClick={decreaseQuantity}
              >
                -
              </button>
              <input
                type="text"
                value={displayQuantity}
                readOnly
                className="quantity-value"
              />
              <button
                type="button"
                className="quantity-button"
                onClick={increaseQuantity}
              >
                +
              </button>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={addToCart}
              disabled={cartLoading || product.stock <= 0}
            >
              {cartLoading ? "Adding..." : "Add to Cart"}
            </button>
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Write a Review</h3>
              <Rating
                value={userRating}
                disable={false}
                onRatingChange={handleRatingChange}
              />
              <textarea
                className="review-input"
                placeholder="Write your review here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="submit-review-btn"
                disabled={reviewLoading}
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>

        <div className="reviews-container">
          <h3>Customer Reviews</h3>
          <div className="review-section">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div className="review-item" key={index}>
                  <div className="review-header">
                    <Rating value={review.rating} disable={true} />
                  </div>
                  <div className="review-comment">
                    <p className="review-name">by {review.name}</p>
                    <p className="review-text">{review.comment}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No reviews yet</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
