import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bankDetailsApi from "../api/bankDetailsApi";

export const fetchBankDetails = createAsyncThunk(
    "bankDetails/getBankDetails",
    async ({user_id,user_category,data}, { rejectWithValue }) => {
      try {
        console.log("Data in fetchBankDetails:", {user_id,user_category,data});
        
        const response = await bankDetailsApi.getBankDetails({user_id,user_category,data});
       console.log("Response from:", response);
       
        console.log("Response from API:", response.data);
        if (response.status === 201 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to add bank details");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
export const fetchBankDetailsById = createAsyncThunk(
    "bankDetails/getBankDetailsById",
    async ({user_id,user_category,data}, { rejectWithValue }) => {
      try {
        console.log("Data in fetchBankDetails:", {user_id,user_category,data});
        
        const response = await bankDetailsApi.getBankDetailsById({user_id,user_category,data});
       console.log("Response from:", response);
       
        console.log("Response from API:", response.data);
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to add bank details");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
  

const bankDetailsSlice = createSlice({
  name: "bankDetails",
  initialState: {
    bankDetails: [], // Changed to match what you use in reducers
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankDetails.pending, (state) => { // Changed to fetchBankDetails
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBankDetails.fulfilled, (state, action) => { // Changed to fetchBankDetails
        state.status = "succeeded";
        state.bankDetails = action.payload; 
      })
      .addCase(fetchBankDetails.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchBankDetailsById.pending, (state) => { // Changed to fetchBankDetailsById
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBankDetailsById.fulfilled, (state, action) => { // Changed to fetchBankDetailsById
        state.status = "succeeded";
        state.bankDetails = action.payload; 
      })
      .addCase(fetchBankDetailsById.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default bankDetailsSlice.reducer;