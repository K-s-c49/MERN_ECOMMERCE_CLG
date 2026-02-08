import Product from "../model/productmodel.js";
import handleAsyncError from "../middleware/handleAsyncerror.js";
import APIFunctionality from "../utilis/apiFunctionality.js";
import handleError from "../utilis/handlError.js";
import mongoose from "mongoose";
import {v2 as cloudinary} from "cloudinary";
// creating a product

// http://localhost:8000/api/v1/product/694d2352bba1253ca33c723e?keyword=shirt

export const createproduct = handleAsyncError (async (req, res, next) => {
    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }else {
        images = req.body.images;
    }

    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.uploader.upload(images[i], {
            folder: "products",
        }); 
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    return res.status(201).json({
        success: true,
        product,
    });
});

// get all products
export const getallproducts = handleAsyncError (async (req, res, next) => {
    const resultPerPage = 4;
    const apiFunctionality = new APIFunctionality(Product.find(), req.query)
        .search()
        .filter();

    const totalProducts = await Product.countDocuments();
    const filteredProducts = await apiFunctionality.query.clone();
    const filteredProductsCount = filteredProducts.length;

    //pagination

    apiFunctionality.pagination(resultPerPage);
    const products = await apiFunctionality.query;

    const page = Number(req.query.page) || 1;
    const totalPages = Math.max(1, Math.ceil(filteredProductsCount / resultPerPage));
    if (page > totalPages && filteredProductsCount > 0) {
        return next(new handleError("Page number exceeds total pages", 404));
    }

    return res.status(200).json({
        success: true,
        totalProducts,
        resultPerPage,
        totalPages,
        filteredProductsCount,
        count: products.length,
        products,
    });
});

// UPDATE PRODUCT
export const updateproduct = handleAsyncError (async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new handleError("Product not found", 404));
    }
    let product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new handleError("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    return res.status(200).json({
        success: true,
        product,
    });
});
      
// DELETE PRODUCT
export const deleteproduct = handleAsyncError (async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new handleError("Product not found", 404));
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
        return next(new handleError("Product not found", 404));
    }
    
    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});
// GET SINGLE PRODUCT
export const getsingleproduct = handleAsyncError (async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new handleError("Product not found", 404));
    }
    const product = await Product.findById(req.params.id);
    return res.status(200).json({
        success: true,
        product,
    });
});

// CREATE NEW REVIEW OR UPDATE THE REVIEW
export const createReviewProduct = handleAsyncError (async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    
    if (!rating || !comment || !productId) {
        return next(new handleError("Please provide rating, comment, and productId", 400));
    }
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new handleError("Product not found", 404));
    }
    
    const product = await Product.findById(productId);
    
    if (!product) {
        return next(new handleError("Product not found", 404));
    }
    
    // Initialize reviews array if it doesn't exist
    if (!product.reviews) {
        product.reviews = [];
    }
    
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    
    const isReviewed = product.reviews.find(
        (rev) => rev.user && rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user && rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });         
    product.ratings = product.reviews.length === 0 ? 0 : avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Review added successfully",
        product,
    });

});

// GETTING REVIEWS
export const getProductReviews = handleAsyncError (async (req, res, next) => {
    const { id } = req.query;

    if (!id) {
        return next(new handleError("Product id is required", 400));
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new handleError("Product not found", 404));
    }

    const product = await Product.findById(id);

    if (!product) {
        return next(new handleError("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

// DELETE REVIEW
export const deleteReview = handleAsyncError(async (req, res, next) => {
    const { productId, id: reviewId } = req.query;

    if (!productId || !reviewId) {
        return next(new handleError("productId and review id are required", 400));
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new handleError("Product not found", 404));
    }
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        return next(new handleError("Review not found", 404));
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new handleError("Product not found", 404));
    }

    // Guard if reviews is missing/null
    if (!Array.isArray(product.reviews)) {
        product.reviews = [];
    }

    // Ensure the review exists
    const exists = product.reviews.some(
        (rev) => rev?._id && String(rev._id) === String(reviewId)
    );
    if (!exists) {
        return next(new handleError("Review not found", 404));
    }

    // Remove the review
    product.reviews = product.reviews.filter(
        (rev) => !(rev?._id && String(rev._id) === String(reviewId))
    );

    // Recompute ratings and count
    const total = product.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    product.numOfReviews = product.reviews.length;
    product.ratings = product.numOfReviews ? total / product.numOfReviews : 0;

    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
});

// admin getting all products
export const getadminproducts = handleAsyncError (async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });

});
