import { instance } from "../server.js";
import handleAsyncerror from "../middleware/handleAsyncerror.js";
import crypto from 'crypto';
import { Order } from '../model/ordermodel.js';

export const processpayment = handleAsyncerror (async (req, res, next) => {
    // amount expected in rupees from frontend; convert to paise
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) return res.status(400).json({ success: false, message: 'Invalid amount' });

    const option = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
        currency: "INR",
    };

    const order = await instance.orders.create(option);
    res.status(200).json({
        success: true,
        order,
    });
});

export const sendAPIKey = handleAsyncerror (async (req, res, next) => {
    // support multiple env key names for backward compatibility
    const key = process.env.RAZORPAY_KEY_ID || process.env.Razarpay_KEY_ID || process.env.RAZORPAY_API_KEY;
    res.status(200).json({
        success: true,
        key,
    });
});

// Verify payment signature and create the order in DB (secure server-side)
export const verifyPayment = handleAsyncerror(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderInfo, orderItems, shippingInfo } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || process.env.Razarpay_KEY_SECRET;
    if (!key_secret) return res.status(500).json({ success: false, message: 'Payment secret not configured' });

    const generated_signature = crypto.createHmac('sha256', key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    // signature verified — create order record
    const paymentInfo = {
        id: razorpay_payment_id,
        status: 'succeeded',
        method: 'razorpay',
    };

    const itemsPrice = orderInfo?.subtotal || 0;
    const taxPrice = orderInfo?.tax || 0;
    const shippingPrice = orderInfo?.shipping || 0;
    const totalPrice = orderInfo?.total || 0;

    const order = await Order.create({
        shippingInfo: shippingInfo || {},
        orderItems: orderItems || [],
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Payment verified and order created', order });
});