import Product from "../model/productmodel.js";
// creating a product

export const createproduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        return res.status(201).json({
            success: true,
            product,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// get all products
export const getallproducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// UPDATE PRODUCT
export const updateproduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
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
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
      
// DELETE PRODUCT
export const deleteproduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};
// GET SINGLE PRODUCT
export const getsingleproduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        
        return res.status(200).json({
            success: true,
            product,
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};