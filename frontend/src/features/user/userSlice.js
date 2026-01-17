import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../axios.js";

//  register user api call

 export const registerUser = createAsyncThunk("user/register", async (userData, { rejectWithValue }) => {
    try {
           // Let the browser set the Content-Type (with boundary) for FormData
           const {data} = await axios.post("/register", userData);
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
           const {data} = await axios.post("/login", {email,password}, config);
           console.log('login response', data);
           return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to login user";
        return rejectWithValue(message);
    }
});

export const loadUser = createAsyncThunk("user/loadUser", async (_, { rejectWithValue }) => { 
    try {
        const {data} = await axios.get("/profile");
        console.log('load user response', data);
        return data;
    } catch (error) {  
        const message = error?.response?.data?.message || error?.message || "Failed to load user";
        return rejectWithValue(message);
    }
});

export const logout = createAsyncThunk("user/logout", async (_, { rejectWithValue }) => {
    try {
        const {data} = await axios.post("/logout");
        return data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || "Failed to logout user");
    }
});

export const updateProfile = createAsyncThunk("user/updateProfile", async (userData, { rejectWithValue }) => {
    try {
        console.log("[userSlice] updateProfile thunk called", userData);
        const { data } = await axios.put("/profile/update", userData);
        console.log("[userSlice] updateProfile API response", data);
        return data;
    } catch (error) {
        console.error("[userSlice] updateProfile error", error);
        const message = error?.response?.data?.message || error?.message || "Failed to update profile";
        return rejectWithValue(message);
    }
});

export const updatePassword = createAsyncThunk("user/updatePassword", async (formData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.put("/password/update", formData, config);
        return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to update password";
        return rejectWithValue(message);
    }
});

export const forgotPassword = createAsyncThunk("user/forgotPassword", async (email, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post("/password/forgot", { email }, config);
        return data;
    } catch (error) {
        const message = error?.response?.data?.message || error?.message || "Failed to update  password";
        return rejectWithValue(message);
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
        message: null,
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
        // update profile case
        builder
        .addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            state.user = action.payload.user || null;
            state.message = action.payload.message || "Profile updated successfully";
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Update profile failed";
        });
        // update password case
        builder
        .addCase(updatePassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updatePassword.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            state.message = action.payload.message || "Password updated successfully";
        })
        .addCase(updatePassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Update password failed";
        });
        // forgot password case
        builder
        .addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(forgotPassword.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;
            state.success = action.payload.success;
            state.message = action.payload.message || "Password reset email sent successfully";
        })
        .addCase(forgotPassword.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Forgot password request failed";
        });
    }
});

export const { removeError, removeSuccess } = userSlice.actions;
export default userSlice.reducer;