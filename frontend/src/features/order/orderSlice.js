import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";

export const createorder = createAsyncThunk('order/createOrder', async (order, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        };
        const { data } = await axios.post("/new/order", order, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data || 'order creation failed');
    }
});

export const getAllMyOrders = createAsyncThunk('order/getAllMyOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get("/orders/user");
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data || 'Failed to fetch orders');
    }
});

//Get order Details
export const getOrderDetails = createAsyncThunk('order/getOrderDetails', async (orderID, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(`/order/${orderID}`);
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data || 'Failed to fetch order details');
    }
});

const orderSlice = createSlice({
    name: "order",
    initialState: {
        success: false,
        loading: false,
        error: null,
        orders: [],
        order:{}
    },
    reducers: {
           removeError(state) {
            state.error = null;
        },
        removeSuccess(state) {
            state.success = null;
        }
    },
     extraReducers: (builder) => {
        builder
        .addCase(createorder.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createorder.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.order = action.payload.order;
        })
        .addCase(createorder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Failed to create order';
        });
        // get all my orders
        builder
        .addCase(getAllMyOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getAllMyOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload.orders;
            state.success = action.payload.success;
        })
        .addCase(getAllMyOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || action.payload || 'Failed to fetch orders';
        });
        // get order details
        builder
        .addCase(getOrderDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getOrderDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload.order;
            state.success = action.payload.success;
        })
        .addCase(getOrderDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || action.payload || 'Failed to fetch order details';
        });
    }
});
export const {removeError,removeSuccess} = orderSlice.actions;
export default orderSlice.reducer;