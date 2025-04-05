import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import transferPointsApi from "../api/TransferPointsApi";

// Async thunk for transferring points
export const customerToMerchantPoints = createAsyncThunk(
  "points/transfer",
  async (transferData, { rejectWithValue }) => {
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
      });
  }
});

// Export the reducer and actions
export const { resetTransferState } = transferPointsSlice.actions;
export default transferPointsSlice.reducer;