import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import additinalDetailsApi from "../api/additionalDetailsApi";

export const addAdditinalDetails = createAsyncThunk(
    "details/addDetails",
    async (data, { rejectWithValue }) => {
      console.log("Data to be sent to API:", data); // Log the data being sent
      try {
        const response = await additinalDetailsApi.addAdditinalDetails(data);
        console.log("Response from API:", response.data);
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to fetch points");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
export const addAdditinalDetailsMerchant = createAsyncThunk(
    "details/addDetails",
    async (data, { rejectWithValue }) => {
      console.log("Data to be sent to API:", data); // Log the data being sent
      try {
        const response = await additinalDetailsApi.addAdditinalDetailsMerchant(data);
        console.log("Response from API:", response.data);
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to fetch points");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
  
export const fetchAdditionalDetailsMerchant = createAsyncThunk(
    "details/addDetails",
    async (data, { rejectWithValue }) => {
      try {
        console.log('hiii');
        
        const response = await additinalDetailsApi.getAdditionalDetailsMerchant(data);
        console.log("Response from API:", response);
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to fetch points");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
export const fetchAdditionalDetails = createAsyncThunk(
    "details/addDetails",
    async (data, { rejectWithValue }) => {
      try {
        const response = await additinalDetailsApi.getAdditionalDetails(data);
        console.log("Response from API:", response);
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to fetch points");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
  

const additinalDetailsSlice = createSlice({
  name: "addDetails",
  initialState: {
    addDetails: [], // Changed to match what you use in reducers
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAdditinalDetails.pending, (state) => { // Changed to addAdditinalDetails
        state.status = "loading";
        state.error = null;
      })
      .addCase(addAdditinalDetails.fulfilled, (state, action) => { // Changed to addAdditinalDetails
        state.status = "succeeded";
        state.addDetails = action.payload; 
      })
      .addCase(addAdditinalDetails.rejected, (state, action) => { // Changed to addAdditinalDetails
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(addAdditinalDetailsMerchant.pending, (state) => { // Changed to addAdditinalDetailsMerchant
        state.status = "loading";
        state.error = null;
      })
      .addCase(addAdditinalDetailsMerchant.fulfilled, (state, action) => { // Changed to addAdditinalDetailsMerchant
        state.status = "succeeded";
        state.addDetails = action.payload; 
      })
      .addCase(addAdditinalDetailsMerchant.rejected, (state, action) => { // Changed to addAdditinalDetails
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchAdditionalDetails.pending, (state) => { // Changed to fetchAdditionalDetails
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdditionalDetails.fulfilled, (state, action) => { // Changed to fetchAdditionalDetails
        state.status = "succeeded";
        state.addDetails = action.payload; 
      })
      .addCase(fetchAdditionalDetails.rejected, (state, action) => { // Changed to fetchAdditinalDetails
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchAdditionalDetailsMerchant.pending, (state) => { // Changed to fetchAdditionalDetailsMerchant
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAdditionalDetailsMerchant.fulfilled, (state, action) => { // Changed to fetchAdditionalDetailsMerchant
        state.status = "succeeded";
        state.addDetails = action.payload; 
      })
      .addCase(fetchAdditionalDetailsMerchant.rejected, (state, action) => { // Changed to fetchAdditinalDetails
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default additinalDetailsSlice.reducer;