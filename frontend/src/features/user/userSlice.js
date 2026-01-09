import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//  register user api call

 export const registerUser = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
    try {
           // Let the browser set the Content-Type (with boundary) for FormData
           const {data} = await axios.post("http://localhost:8000/api/v1/register", userData);
           console.log('registration response', data);
           return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to register user";
        return rejectWithValue(message);
    }
});

export const login = createAsyncThunk("user/login", async ({email,password}, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
           const {data} = await axios.post("http://localhost:8000/api/v1/login", {email,password}, config);
           console.log('login response', data);
           return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to login user";
        return rejectWithValue(message);
    }
});

export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => { 
    try {
        const {data} = await axios.get("http://localhost:8000/api/v1/profile");
        console.log('load user response', data);
        return data;
    } catch (error) {  
        const message = error?.response?.data?.message || error?.message || "Failed to load user";
        return rejectWithValue(message);
    }
});

export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const {data} = await axios.post("http://localhost:8000/api/v1/logout",{withCredentials:true});
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || "Failed to logout user");
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        loading: false,
        error: null,
        success: false,
        isAuthenticated: false,
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

        // register case
        builder
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;  
            state.error = null;
            state.success = action.payload.success;
            state.user = action.payload.user || null;
            // Do not mark as authenticated on registration to avoid
            // triggering login-success UI (user should explicitly log in)
            state.isAuthenticated = false;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Registration failed";
            state.isAuthenticated = false;
            state.user = null;

        });
        // login case
        builder
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            state.user = action.payload.user || null;
            state.isAuthenticated = Boolean(action.payload.success);
            console.log("User logged in:", state.user);
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            // Always use the backend error message if present
            state.error = action.payload || "Login failed";
            state.isAuthenticated = false;
            state.user = null;
        });
        // load user case
        builder
        .addCase(loadUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loadUser.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload.user || null;
            state.isAuthenticated = Boolean(action.payload.success);

        })
        .addCase(loadUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Load user failed";
            state.isAuthenticated = false;
            state.user = null;
        });
        // logout case
        builder
        .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Logout failed";
        });
    }
});

export const { removeError, removeSuccess } = userSlice.actions;
export default userSlice.reducer;