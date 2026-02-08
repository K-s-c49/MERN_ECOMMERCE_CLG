import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios.js";
//add item to cart

export const additemsToCart = createAsyncThunk(
    "cart/additemsToCart",
    async ({ id, quantity }, { rejectWithValue, getState }) => {
        try {
            console.log('[cartSlice] additemsToCart called', { id, quantity });
            const { data } = await axios.get(`/product/${id}`);
            const product = data.product;
            if (!product) return rejectWithValue('Product not found');

            const item = {
                product: product._id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                image: product.images && product.images[0]?.url,
                quantity: Number(quantity),
            };

            const state = getState();
            // normalize existing items (ensure product id is string and quantity is number)
            const currentItems = (state.cart?.cartItems || []).map(ci => ({ ...ci, product: String(ci.product), quantity: Number(ci.quantity) }));
            const existingIndex = currentItems.findIndex(ci => String(ci.product) === String(item.product));
            let updatedItems;
            const maxStock = typeof product.stock === 'number' ? product.stock : Infinity;
            if (existingIndex >= 0) {
                updatedItems = [...currentItems];
                const prev = updatedItems[existingIndex];
                const newQty = Math.min(prev.quantity + item.quantity, maxStock);
                updatedItems[existingIndex] = {
                    ...prev,
                    quantity: newQty,
                };
                // reflect the actual quantity that ended up in cart
                const addedItem = { product: String(item.product), name: item.name, quantity: newQty };
                console.log('[cartSlice] updatedItems', updatedItems);
                return { cartItems: updatedItems, message: 'Cart updated', addedItem };
            } else {
                // cap initial quantity by stock
                const qty = Math.min(item.quantity, maxStock);
                updatedItems = [...currentItems, { ...item, quantity: qty, product: String(item.product) }];
                const addedItem = { product: String(item.product), name: item.name, quantity: qty };
                console.log('[cartSlice] updatedItems', updatedItems);
                return { cartItems: updatedItems, message: 'Item added to cart', addedItem };
            }
        } catch (error) {
            console.error('[cartSlice] additemsToCart error', error);
            const message = error?.response?.data?.message || error?.message || "an error occurred";
            return rejectWithValue(message);
        }
    }
);

const normalizeCartItems = (arr) => (arr || []).map(ci => ({
    ...ci,
    product: String(ci.product),
    quantity: Number(ci.quantity) || 1,
    stock: typeof ci.stock === 'number' ? ci.stock : (ci.stock ? Number(ci.stock) : undefined),
}));

const savedCart = (() => {
    try {
        const raw = localStorage.getItem('cartItems');
        const parsed = raw ? JSON.parse(raw) : [];
        return normalizeCartItems(parsed);
    } catch (e) {
        console.warn('Failed to parse cartItems from localStorage', e);
        return [];
    }
})();

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: savedCart,
        lastAdded: null,
        loading: false,
        error: null,
        success: false,
        message: null,
        removingId: null,
        shippingInfo: JSON.parse(localStorage.getItem('shippingInfo')) || {},
    },
    reducers: {
        removeError(state) {
            state.error = null;
        },
        removeMessage(state) {
            state.message = null;
            state.lastAdded = null;
            state.success = false;
        },
        removeitemFromCart: (state, action) => {
            state.removingId = action.payload;
            state.cartItems = (state.cartItems || []).filter(
                (item) => String(item.product) !== String(action.payload)
            );
            try {
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            } catch (e) {
                console.warn('Failed to persist cartItems after removal', e);
            }
            state.removingId = null;
            state.success = true;
            state.message = 'Item removed from cart';
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
            try {
                localStorage.setItem('shippingInfo', JSON.stringify(state.shippingInfo));
            } catch (e) {
                console.warn('Failed to persist shippingInfo', e);
            }
        },
        clearCart: (state) => {
            state.cartItems = [];
            state.shippingInfo = {};
            state.lastAdded = null;
            state.error = null;
            state.success = true;
            state.message = 'Cart cleared';
            try {
                localStorage.removeItem('cartItems');
                localStorage.removeItem('shippingInfo');
            } catch (e) {
                console.warn('Failed to clear cartItems from localStorage', e);
            }
        },  
    },
    extraReducers: (builder) => {
        builder
        .addCase(additemsToCart.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(additemsToCart.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            // Normalize and persist cart items
            state.cartItems = normalizeCartItems(action.payload.cartItems || []);
            state.message = action.payload.message;
            // ensure lastAdded mirrors normalized shape
            const added = action.payload.addedItem || null;
            state.lastAdded = added ? { ...added, product: String(added.product), quantity: Number(added.quantity || 1) } : null;
            try {
                localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
            } catch (e) {
                console.warn('Failed to persist cart to localStorage', e);
            }
        })
        .addCase(additemsToCart.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
})
export const { removeError, removeMessage, removeitemFromCart, saveShippingInfo, clearCart } = cartSlice.actions;
export default cartSlice.reducer;