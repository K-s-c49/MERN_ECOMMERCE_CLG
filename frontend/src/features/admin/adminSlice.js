import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// fetch all products for admin dashboard
export const fetchAdminProduct = createAsyncThunk("admin/fetchAdminProduct", async (_, { rejectWithValue }) => {
    try {

       const {data} = await axios.get("/api/v1/admin/products");
        return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "error while fetching the products";
        return rejectWithValue(message);
    }
});

// create product for admin dashboard
export const createProduct = createAsyncThunk("admin/createProduct", async (productData, { rejectWithValue }) => {
    try {
        const {data} = await axios.post("/api/v1/admin/products/create", productData);
        return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "error while creating the product";
        return rejectWithValue(message);
    }
});

const AdminSlice = createSlice({
    name: "admin",
    initialState: {
        Products: [],
        success: false,
        loading: false,
        error: null,
    },
    reducers: {
        removeErrors: (state) => {
            state.error = null;
        },
        removeSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {   
        builder.addCase(fetchAdminProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAdminProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.Products = action.payload.products;
        });
        builder.addCase(fetchAdminProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to fetch products";
        });
        // create product cases

        builder.addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.success = action.payload.success;
            state.Products.push(action.payload.product);
        });
        builder.addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to create product";
        });
    }
});



export const { removeErrors, removeSuccess } = AdminSlice.actions;
export default AdminSlice.reducer;