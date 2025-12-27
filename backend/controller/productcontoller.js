import Product from "../model/productmodel.js";
import handleAsyncError from "../middleware/handleAsyncerror.js";
import APIFunctionality from "../utilis/apiFunctionality.js";
import handleError from "../utilis/handlError.js";
// creating a product

// http://localhost:8000/api/v1/product/694d2352bba1253ca33c723e?keyword=shirt

export const createproduct = handleAsyncError (async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    return res.status(201).json({
        success: true,
        product,
    });
});

// get all products
export const getallproducts = handleAsyncError (async (req, res, next) => {
    const resultPerPage = 9;
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
        filteredProductsCount,
        count: products.length,
        products,
    });
});

// UPDATE PRODUCT
export const updateproduct = handleAsyncError (async (req, res, next) => {
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
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new handleError("Product not found", 404));
    }
    
    return res.status(200).json({
        success: true,
        product,
    });
});