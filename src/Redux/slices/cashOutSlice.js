import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cashOutApi from "../api/cashOutApi";

export const addCashoutCustomer = createAsyncThunk(
    "cashOut/addCashoutCustomer",
    async (data, { rejectWithValue }) => {
      try {
        const response = await cashOutApi.addCashoutCustomer(data);

        console.log("Response from API:", response.data);
        console.log("Response from API:", response);
        
        if (response.status === 200 ) {
          return response.data; // Return the full response data
        } else {
          return rejectWithValue(response.data?.error || "Failed to add cash out");
        }
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
      }
    }
);

export const addCashoutMerchant = createAsyncThunk(
    "cashOut/addCashoutMerchant",
    async (data, { rejectWithValue }) => {
      try {
        const response = await cashOutApi.addCashoutMerchant(data);

        console.log("Response from API:", response.data);
        console.log("Response from API:", response);
        
        if (response.status === 200 ) {
          return response.data; // Return the full response data
        } else {
          return rejectWithValue(response.data?.error || "Failed to add cash out");
        }
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
      }
    }
);
  

const cashOutSlice = createSlice({
  name: "cashOut",
  initialState: {
    cashOut: [], // Changed to match what you use in reducers
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCashoutCustomer.pending, (state) => { // Changed to addCashoutCustomer
        state.status = "loading";
        state.error = null;
      })
      .addCase(addCashoutCustomer.fulfilled, (state, action) => { // Changed to addCashoutCustomer
        state.status = "succeeded";
        state.cashOut = action.payload; 
      })
      .addCase(addCashoutCustomer.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(addCashoutMerchant.pending, (state) => { // Changed to addCashoutMerchant
        state.status = "loading";
        state.error = null;
      })
      .addCase(addCashoutMerchant.fulfilled, (state, action) => { // Changed to addCashoutMerchant
        state.status = "succeeded";
        state.cashOut = action.payload; 
      })
      .addCase(addCashoutMerchant.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default cashOutSlice.reducer;