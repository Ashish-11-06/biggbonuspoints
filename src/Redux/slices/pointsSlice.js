import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PointsApi from "../api/PointsApi";

export const fetchCustomerPoints = createAsyncThunk(
    "points/getPoints",
    async (data, { rejectWithValue }) => {
      try {
        const response = await PointsApi.viewMerchantWisePoints(data);
        console.log("Response from API view merchant:", response.data);
        
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to fetch points");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );

export const fetchMerchantPoints = createAsyncThunk(
    "points/getPointsMerchant",
    async (data, { rejectWithValue }) => {
      try {
        const response = await PointsApi.viewCustomerWisePoints(data);
        console.log("Response from API view merchant:", response.data);
        
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to fetch points");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
  

const customerPointsSlice = createSlice({
  name: "customerPoints",
  initialState: {
    customerPoints: [], // Changed to match what you use in reducers
    merchantPoints: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerPoints.pending, (state) => { // Changed to fetchCustomerPoints
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomerPoints.fulfilled, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "succeeded";
        state.customerPoints = action.payload; 
      })
      .addCase(fetchCustomerPoints.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchMerchantPoints.pending, (state) => { // Changed to fetchMerchantPoints
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMerchantPoints.fulfilled, (state, action) => { // Changed to fetchMerchantPoints
        state.status = "succeeded";
        state.merchantPoints = action.payload; 
      })
      .addCase(fetchMerchantPoints.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default customerPointsSlice.reducer;