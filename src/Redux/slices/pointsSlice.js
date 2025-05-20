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
    async (merchantId, { rejectWithValue }) => {
      try {
        const response = await PointsApi.viewCustomerWisePoints(merchantId);
        console.log('fetch merchant points res',response);
        
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

export const fetchPrepaidMerchant = createAsyncThunk(
    "points/getPointsMerchantPrepaid",
    async (_, { rejectWithValue }) => {
      try {
        console.log('fetch prepaid merchants');
        
        const response = await PointsApi.viewPrepaidMerchants();
        console.log(response);
        
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
  
export const fetchTerminalPoints = createAsyncThunk(
    "points/fetchTerminalPoints",
    async (id, { rejectWithValue }) => {
      try {
        console.log('fetch prepaid merchants');
        
        const response = await PointsApi.viewTerminalPoints(id);
        console.log(response);
        
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

export const fetchCustGlobalPoints = createAsyncThunk(
    "points/fetchCustGlobalPoints",
    async (data, { rejectWithValue }) => {
      try {
        console.log('fetch global points');
        
        const response = await PointsApi.viewCustomerGlobalPoints(data);
        console.log(response);
        
        console.log("Response from API view g points:", response.data);
        
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to fetch points");
      } catch (error) {
        console.log('error in G point',error);
        
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );
  

const customerPointsSlice = createSlice({
  name: "customerPoints",
  initialState: {
    customerPoints: [], // Changed to match what you use in reducers
    merchantPoints: [],
    terminalPoints:[],
    globalPoints: [],
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
      })
      .addCase(fetchTerminalPoints.pending, (state) => { // Changed to fetchTerminalPoints
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTerminalPoints.fulfilled, (state, action) => { // Changed to fetchTerminalPoints
        state.status = "succeeded";
        state.terminalPoints = action.payload; 
      })
      .addCase(fetchTerminalPoints.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(fetchCustGlobalPoints.pending, (state) => { // Changed to fetchCustGlobalPoints
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustGlobalPoints.fulfilled, (state, action) => { // Changed to fetchCustGlobalPoints
        state.status = "succeeded";
        state.globalPoints = action.payload; 
      })
      .addCase(fetchCustGlobalPoints.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default customerPointsSlice.reducer;