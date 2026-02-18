import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../axios.js';

// fetch all products for admin dashboard
export const fetchAdminProduct = createAsyncThunk(
  'admin/fetchAdminProduct',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/admin/products');
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while fetching the products';
      return rejectWithValue(message);
    }
  }
);

// create product for admin dashboard
export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/admin/products/create', productData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while creating the product';
      return rejectWithValue(message);
    }
  }
);

// update product for admin dashboard
export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/admin/product/${id}`, productData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while updating the product';
      return rejectWithValue(message);
    }
  }
);

// delete product for admin dashboard
export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/admin/product/${productId}`);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while deleting the product';
      return rejectWithValue(message);
    }
  }
);

// fetch users for admin dashboard
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/admin/users');
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while fetching the users';
      return rejectWithValue(message);
    }
  }
); 

// get single user for admin dashboard
export const getSingleUser = createAsyncThunk(
  'admin/getUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/admin/user/${userId}`);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while fetching the user details';
      return rejectWithValue(message);
    }
  }
);

// update user role for admin dashboard
export const updateUserRole = createAsyncThunk(
  'admin/updateUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      // Backend route: PUT /admin/user/:id
      const { data } = await axios.put(
        `/admin/user/${userId}`,
        { role },
        {
        headers: { 'Content-Type': 'application/json' },
        }
      );
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while updating the user role';
      return rejectWithValue(message);
    }
  }
);
// delete user for admin dashboard
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/admin/user/${userId}`);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while deleting the user';
      return rejectWithValue(message);
    }
  }
);
// admin fetching orders
export const fetchAllOrders = createAsyncThunk(
  'admin/fetchAllOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/admin/orders');
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while fetching the orders';
      return rejectWithValue(message);
    }
  }
);
// delete order for admin dashboard
export const deleteOrder = createAsyncThunk(
  'admin/deleteOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/admin/order/${orderId}`);
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while deleting the order';
      return rejectWithValue(message);
    }
  }
);
// update order status for admin dashboard
export const updateOrderStatus = createAsyncThunk(
  'admin/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {      const { data } = await axios.put(
        `/admin/order/${orderId}`,
        { status },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return data;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'error while updating the order status';
      return rejectWithValue(message);
    }
  }
);

const AdminSlice = createSlice({
  name: 'admin',
  initialState: {
    Products: [],
    success: false,
    loading: false,
    error: null,
    product: {},
    deleting: {},
    users: [],
    user: {},
    message: null,
    orders: [],
    totalAmount: 0,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.success = false;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch admin products
      .addCase(fetchAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.Products = action.payload.products;
      })
      .addCase(fetchAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch products';
      })
      // create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.Products.push(action.payload.product);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create product';
      })
      // update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;

        const updated = action.payload.product;
        const index = state.Products.findIndex((p) => p._id === updated?._id);
        if (index !== -1) {
          state.Products[index] = updated;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update product';
      })
      // delete product
      .addCase(deleteProduct.pending, (state, action) => {
        const productId = action.meta.arg;
        state.error = null;
        state.deleting[productId] = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = false;

        // Backend returns { success, message } (no productId), so rely on meta.arg.
        state.success = true;
        state.Products = state.Products.filter((p) => p._id !== productId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.deleting[productId] = false;
        state.error = action.payload || 'Failed to delete product';
      })

      // fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch users';
      })

      // get single user
      .addCase(getSingleUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user details';
      })

      // update user role
      .addCase(updateUserRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.loading = false;
        state.success = Boolean(action.payload.success);
        state.message = action.payload.message || null;

        const updatedUser = action.payload.user;
        const index = state.users.findIndex((u) => u._id === updatedUser?._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update user role';
      })

      // delete user
      .addCase(deleteUser.pending, (state, action) => {
        const userId = action.meta.arg;
        state.error = null;
        state.deleting[userId] = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.meta.arg;
        state.deleting[userId] = false;
        state.success = true;
        state.message = action.payload?.message || null;

        state.users = state.users.filter((u) => u._id !== userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        const userId = action.meta.arg;
        state.deleting[userId] = false;
        state.error = action.payload || 'Failed to delete user';
      });
      // fetch all orders
      builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      });
      // delete order
      builder
      .addCase(deleteOrder.pending, (state, action) => {
        const orderId = action.meta.arg;
        state.error = null;
        state.deleting[orderId] = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        const orderId = action.meta.arg;
        state.deleting[orderId] = false;
        state.success = true;
        state.message = action.payload?.message || null;
        state.orders = state.orders.filter((o) => o._id !== orderId);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        const orderId = action.meta.arg;
        state.deleting[orderId] = false;
        state.error = action.payload || 'Failed to delete order';
      });
      // update order status
      builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = Boolean(action.payload.success);
        state.message = action.payload.message || null;
        const updatedOrder = action.payload.order;
        const index = state.orders.findIndex((o) => o._id === updatedOrder?._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        } 
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update order status';
      });
  },
});

export const { removeErrors, removeSuccess, clearMessage } = AdminSlice.actions;
export default AdminSlice.reducer;
