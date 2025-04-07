import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../api/userApi";

// Async thunks
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userApi.RegisterUser(data);
      if (response.status === 200 && response.data) {
        return response.data;
      } else if (response.status === 400) {
        return rejectWithValue(response.data.message || "Registration failed!"); 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "user/verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userApi.verifyOtp(data);
      if (response.status === 200 && response.data) {
        return response.data;
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await userApi.loginUser(data);
      if (response.status === 200 && response.data) {
        return response.data;
      } else if (response.status === 400) {
        return rejectWithValue(response.data.error || "Invalid credentials!"); 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "An error occurred");
    }
  }
);

export const getAllMerchants = createAsyncThunk(
  "user/getAllMerchants",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllMerchants();
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.data.error || "Failed to fetch merchants");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "An error occurred");
    }
  }
);

export const getAllCustomers = createAsyncThunk(
  "user/getAllCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userApi.getAllCustomers();
      if (response.status === 200 && response.data) {
        return response.data;
      }
      return rejectWithValue(response.data.error || "Failed to fetch customers");
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "An error occurred");
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,        // for logged in user
    registrationData: null,   // for registration
    verificationData: null,   // for OTP verification
    merchants: [],           // list of merchants
    customers: [],           // list of customers
    status: "idle",
    error: null,
  },
  reducers: {
    // Add any synchronous reducers if needed
    clearUserState: (state) => {
      state.currentUser = null;
      state.error = null;
      state.status = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.registrationData = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.verificationData = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentUser = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Get All Merchants
      .addCase(getAllMerchants.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllMerchants.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.merchants = action.payload.users;
      })
      .addCase(getAllMerchants.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
      // Get All Customers
      .addCase(getAllCustomers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customers = action.payload.users;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;