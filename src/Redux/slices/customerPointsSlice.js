import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import customerpointsApi from "../api/customerpointsApi";

// Async thunk for fetching data
export const fetchCustomerPointsById = createAsyncThunk(
  "user/fetchCustomerPointsById",
  async (data, { rejectWithValue }) => {
    try {
      const response = await customerpointsApi.customerPoints(data);
      console.log(response);
      
      if (response.status === 200 && response.data) {
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const customerPointsSlice = createSlice({
  name: "customerPoints",
  initialState: {
    customerPoints: [], // Ensure it's an array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerPointsById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCustomerPointsById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customerPoints = action.payload; 
      })
      .addCase(fetchCustomerPointsById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default customerPointsSlice.reducer;
