import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import transactionHistoryApi from "../api/transactionHistoryApi";

// Async thunk for fetching data
export const fetchTransactionHistory = createAsyncThunk(
  "user/fetchCustomerPointsById",
  async ({user_id,user_category}, { rejectWithValue }) => {
    console.log("user",user_id);
    console.log("user_category",user_category);
    
    try {
      const response = await transactionHistoryApi.transactionHistory({user_id,user_category});
      console.log(response);
      
      if (response.status === 200 && response.data) {
        console.log("Transaction history response:", response.data);
        console.log("Transaction history response:", response.data.transaction_history);
        
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const transactionHistorySlice = createSlice({
  name: "transactionHistory",
  initialState: {
    transactionHistory: [], // Ensure it's an array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.transactionHistory = action.payload; 
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default transactionHistorySlice.reducer;
