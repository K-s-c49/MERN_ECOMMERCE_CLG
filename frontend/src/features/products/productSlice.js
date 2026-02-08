import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from '../../axios.js';
import { toast } from 'react-toastify';

export const getProducts = createAsyncThunk('product/getProducts', async ({keyword = '', page = 1, category = ''} = {}, { rejectWithValue }) => {
    try {
        // Build URL with query parameters
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (category) params.append('category', category);
        params.append('page', page);
        
        const link = `http://localhost:8000/api/v1/products?${params.toString()}`;
        const { data } = await axios.get(link);
        console.log('response', data);
        
        // Show message if no products found
        if ((keyword || category) && (!data.products || data.products.length === 0)) {
            const message = category 
                ? `No products found in "${category}" category`
                : 'No products found for your search';
            toast.info(message, { autoClose: 2000 });
        }
        return data;
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to fetch products';
        toast.error(errorMsg, { autoClose: 3000 });
        return rejectWithValue(errorMsg);
    }
});

// product details
export const getProductDetails = createAsyncThunk('product/getProductDetails', async (id, { rejectWithValue }) => {
    try {
        const link = `http://localhost:8000/api/v1/product/${id}`;
        const { data } = await axios.get(link);
        return data;
    } catch (error) {
        const errorMsg = error.response?.data?.message || 'Failed to load product details';
        toast.error(errorMsg, { autoClose: 3000 });
        return rejectWithValue(errorMsg);
    }
});
// submit review
export const createReview = createAsyncThunk('product/createReview', async ({ rating, comment, productId }, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
         const { data } = await axios.put('/review', { rating, comment, productId }, config);
        return data;
    }
        catch (error) { 
            return rejectWithValue(error.response?.data?.message || 'Failed to submit review');
    }
});

export 
const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        productCount: 0,
        loading: false,
        error: null,
        product:null,
        resultPerPage: 4,
        totalPages: 0,
        reviewsSuccess: false,
        reviewLoading: false,
    },
    reducers: {
        // Define your reducers here
        removeError(state) {
            state.error = null;
        },
        removeSuccess(state) {
            state.reviewsSuccess = false;
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
            state.products = action.payload.products || [];
            state.productCount = action.payload.filteredProductsCount || action.payload.productCount || 0;    
            state.resultPerPage = action.payload.resultPerPage || 4;
            state.totalPages = action.payload.totalPages || 0;
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
        // submit review
        builder
        .addCase(createReview.pending, (state) => {
            state.reviewLoading = true;
            state.error = null;
            state.reviewsSuccess = false;
        })
        .addCase(createReview.fulfilled, (state, action) => {
            state.reviewLoading = false;
            state.reviewsSuccess = true;
            if (action.payload?.product) {
                state.product = action.payload.product;
            }
        })
        .addCase(createReview.rejected, (state, action) => {
            state.reviewLoading = false;
            state.error = action.payload || 'Something went wrong';
        });
    },  
});
 export const { removeError, removeSuccess } = productSlice.actions;
export default productSlice.reducer;                