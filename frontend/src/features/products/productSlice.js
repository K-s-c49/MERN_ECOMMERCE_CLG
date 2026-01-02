import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const getProducts = createAsyncThunk('product/getProducts', async (_, { rejectWithValue }) => {
    try {
        const link = `http://localhost:8000/api/v1/products`;
        const { data } = await axios.get(link);
        console.log('response', data);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'an error occurred');
    }
});

// product details
export const getProductDetails = createAsyncThunk('product/getProductDetails', async (id, { rejectWithValue }) => {
    try {
        const link = `http://localhost:8000/api/v1/product/${id}`;
        const { data } = await axios.get(link);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data.message || 'an error occurred');

    }
});
const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null,
        product:null,
    },
    reducers: {
        // Define your reducers here
        removeError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(getProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProducts.fulfilled, (state, action) => {
            console.log('action payload', action.payload);
            state.loading = false;
            state.error = null;
            state.products = action.payload.products;
            state.productCount = action.payload.productCount;    
        })
        .addCase(getProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong';
        });
        // product details
        builder
        .addCase(getProductDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getProductDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.product = action.payload.product;    
        })
        .addCase(getProductDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || 'Something went wrong';
        });
    },  
});
 export const { removeError } = productSlice.actions;
export default productSlice.reducer;                