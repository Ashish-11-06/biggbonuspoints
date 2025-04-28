import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import paymentDetailsApi from "../api/paymentDetailsApi";

export const addPaymentDetails = createAsyncThunk(
    "paymentDetails/getPaymentDetails",
    async (data, { rejectWithValue }) => {
      try {
        console.log("Data in addPaymentDetails:", data);
        
        const response = await paymentDetailsApi.paymentDetails(data);
       console.log("Response from:", response);
       
        console.log("Response from API:", response.data);
        if (response.status === 201 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to add payment details");
      } catch (error) {
        console.log('err slice',error);
        
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
export const fetchPaymentDetails = createAsyncThunk(
    "paymentDetails/fetchPaymentDetails",
    async (user_id, { rejectWithValue }) => {
      try {
        console.log("Data in getPaymentDetails:", user_id);
        
        const response = await paymentDetailsApi.getPaymentDetails(user_id);
       console.log("Response from:", response);
       
        console.log("Response from API:", response.data);
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to fetch payment details");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );


const paymentDetailsSlice = createSlice({
  name: "paymentDetails",
  initialState: {
    bankDetails: [], // Changed to match what you use in reducers
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPaymentDetails.pending, (state) => { // Changed to addPaymentDetails
        state.status = "loading";
        state.error = null;
      })
      .addCase(addPaymentDetails.fulfilled, (state, action) => { // Changed to addPaymentDetails
        state.status = "succeeded";
        state.bankDetails = action.payload; 
      })
      .addCase(addPaymentDetails.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchPaymentDetails.pending, (state) => { // Changed to fetchPaymentDetails
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPaymentDetails.fulfilled, (state, action) => { // Changed to fetchPaymentDetails
        state.status = "succeeded";
        state.bankDetails = action.payload; 
      })
      .addCase(fetchPaymentDetails.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default paymentDetailsSlice.reducer;