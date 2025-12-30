import { Order } from "../model/ordermodel.js";
import Product from "../model/productmodel.js";
import User from "../model/usermodel.js";
import handleError from "../utilis/handlError.js";
import handleAsyncError from "../middleware/handleAsyncerror.js";

// create new order
export const createorder = handleAsyncError (async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
    });
});

// getting single order details
export const getSingleOrder = handleAsyncError (async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new handleError("Order not found with this id", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
})

// all my orders
export const allmyOrders = handleAsyncError (async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    if(!orders){
        return next(new handleError("You have no orders yet", 404));
    }
    res.status(200).json({
        success: true,
        orders,
    });
})

// get all orders -- admin
export const getAllOrders = handleAsyncError (async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
});

// update order status -- admin
export const updateOrderStatus = handleAsyncError (async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new handleError("Order not found with this id", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new handleError("You have already delivered this order", 400));
    }
    await Promise.all(order.orderItems.map(item=> updateQuantity(item.product, item.quantity))); 

    order.orderStatus = req.body.status;
    if(order.orderStatus === "Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
    });
});

// function to update product stock
async function updateQuantity(id, quantity) {
    const product = await Product.findById(id);
    if(!product){
        throw new handleError("Product not found with this id", 404);
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// delete order -- admin
export const deleteOrder = handleAsyncError (async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new handleError("Order not found with this id", 404));
    }

    if(order.orderStatus !== "Delivered"){
        return next(new handleError("Only delivered orders can be deleted", 400));
    }
    
    await order.deleteOne({_id: req.params.id});

    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
});