import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import changeMobileNoApi from "../api/changeMobileNoApi";

export const addNewNumber = createAsyncThunk(
    "mobileNumber/addNewNumber",
    async (data, { rejectWithValue }) => {
      try {
        console.log("Data in slice:", data);
        
        const response = await changeMobileNoApi.addNewNumber(data);
       console.log("Response from:", response);
       
        console.log("Response from API:", response.data);
        if (response.status === 201 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to new number");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );

export const verifyNewNumber = createAsyncThunk(
    "mobileNumber/verifyNumber",
    async (data, { rejectWithValue }) => {
      try {
        console.log("Data in slice:", data);
        
        const response = await changeMobileNoApi.verifyMobileNo(data);
       console.log("Response from:", response);
       
        console.log("Response from API:", response.data);
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to verify number");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );

  

const changeMobileNoSlice = createSlice({
  name: "mobileNumber",
  initialState: {
    mobileNumber: [], // Changed to match what you use in reducers
    otp:[],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewNumber.pending, (state) => { // Changed to addNewNumber
        state.status = "loading";
        state.error = null;
      })
      .addCase(addNewNumber.fulfilled, (state, action) => { // Changed to addNewNumber
        state.status = "succeeded";
        state.mobileNumber = action.payload; 
      })
      .addCase(addNewNumber.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(verifyNewNumber.pending, (state) => { // Changed to verifyNewNumber
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyNewNumber.fulfilled, (state, action) => { // Changed to verifyNewNumber
        state.status = "succeeded";
        state.otp = action.payload; 
      })
      .addCase(verifyNewNumber.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default changeMobileNoSlice.reducer;