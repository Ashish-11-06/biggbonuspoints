import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import helpSectionApi from "../api/helpSecionApi";

export const addHelpQuery = createAsyncThunk(
    "helpQuery/addHelpQuery",
    async (data, { rejectWithValue }) => {
      try {
        const response = await helpSectionApi.addHelpDetails(data);

        console.log("Response from API:", response.data);
        console.log("Response from API:", response);
        
        if (response.status === 201 ) {
          return response.data; // Return the full response data
        } else {
          return rejectWithValue(response.data?.error || "Failed to add help query");
        }
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
      }
    }
);
  

const addHelpQuerySlice = createSlice({
  name: "helpQuery",
  initialState: {
    helpQuery: [], // Changed to match what you use in reducers
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addHelpQuery.pending, (state) => { // Changed to addHelpQuery
        state.status = "loading";
        state.error = null;
      })
      .addCase(addHelpQuery.fulfilled, (state, action) => { // Changed to addHelpQuery
        state.status = "succeeded";
        state.helpQuery = action.payload; 
      })
      .addCase(addHelpQuery.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default addHelpQuerySlice.reducer;