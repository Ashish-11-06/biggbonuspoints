import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import transferPointsApi from "../api/TransferPointsApi";

// Async thunk for transferring points
export const customerToMerchantPoints = createAsyncThunk(
  "points/transfer",
  async (transferData, { rejectWithValue }) => {
    console.log("Transfer data:", transferData);
    
    try {
      const response = await transferPointsApi.redeemPoints(transferData);
      
      console.log("Transfer response:", response);

      if (response.status === 200 && response.data) {
        return response.data;
    } else if (response.status === 400) {
        console.log("Transfer error:", response.data.error);
        return rejectWithValue(response.data.error || "transfer failed!"); 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const customerToCustomerPoints = createAsyncThunk(
  "points/transferCustomer",
  async (transferData, { rejectWithValue }) => {
    console.log("Transfer data cust to customer:", transferData);
    
    try {
      const response = await transferPointsApi.customerToCustomer(transferData);
      
      console.log("Transfer response:", response);

      if (response.status === 200 && response.data) {
        return response.data;
    } else if (response.status === 400) {
        console.log("Transfer error:", response.data.error);
        return rejectWithValue(response.data.error || "transfer failed!"); 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const merchantToCustomerPoints = createAsyncThunk(
  "points/transfer",
  async (transferData, { rejectWithValue }) => {
    console.log("Transfer data merchant to cust:", transferData);
    
    try {
      const response = await transferPointsApi.awardPoints(transferData);
      
      console.log("Transfer response merchant to cust:", response);

      if (response.status === 200 && response.data) {
        return response.data;
    } else if (response.status === 400) {
        console.log("Transfer error:", response.data.error);
        return rejectWithValue(response.data.error || "transfer failed!"); 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const merchantToMerchantPoints = createAsyncThunk(
  "points/transferMerchant",
  async (transferData, { rejectWithValue }) => {
    console.log("Transfer data merchant to cust:", transferData);
    
    try {
      const response = await transferPointsApi.merchantToMerchant(transferData);
      
      console.log("Transfer response merchant to cust:", response);

      if (response.status === 200 && response.data) {
        return response.data;
    } else if (response.status === 400) {
        console.log("Transfer error:", response.data.error);
        return rejectWithValue(response.data.error || "transfer failed!"); 
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);



const transferPointsSlice = createSlice({
  name: "transferPoints",
  initialState: {
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    // No reducers needed since we're not storing data
    resetTransferState: (state) => {
      state.status = "idle";
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(customerToMerchantPoints.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(customerToMerchantPoints.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(customerToMerchantPoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(customerToCustomerPoints.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(customerToCustomerPoints.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(customerToCustomerPoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(merchantToCustomerPoints.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(merchantToCustomerPoints.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(merchantToCustomerPoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(merchantToMerchantPoints.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(merchantToMerchantPoints.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(merchantToMerchantPoints.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});

// Export the reducer and actions
export const { resetTransferState } = transferPointsSlice.actions;
export default transferPointsSlice.reducer;