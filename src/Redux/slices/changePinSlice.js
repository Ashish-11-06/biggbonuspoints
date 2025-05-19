import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import changePinApi from "../api/changePinApi";

export const changePin = createAsyncThunk(
    "pin/changePin",
    async (data, { rejectWithValue }) => {
      try {
        console.log("Data in slice:", data);
        
        const response = await changePinApi.changePin(data);
       console.log("Response from:", response);
       
        console.log("Response from API:", response.data);
        if (response.status === 200 && response.data) {
          return response.data;
        }
        return rejectWithValue(response.data.error || "Failed to new number");
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message || "An error occurred");
      }
    }
  );

export const verifyPinOtp = createAsyncThunk(
    "mobileNumber/verifyPinOtp",
    async (data, { rejectWithValue }) => {
      try {
        console.log("Data in slice:", data);
        
        const response = await changePinApi.verifyPinOtp(data);
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
export const verifyPinSecurity = createAsyncThunk(
  "mobileNumber/verifyPinSecurity",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Data in slice:", data);

      const response = await changePinApi.verifyPinSecurity(data);
        console.log('response',response);
        
      // ✅ Check status manually to handle errors that don't throw automatically
      if (response.status >= 200 && response.status < 300) {
        console.log("Response from API:", response);
        return response.data;
      } else {
        throw new Error(response.data?.error || "Verification failed");
      }
    } catch (error) {
      console.log("Error in API:", error);

      return rejectWithValue(
        error.response?.data?.error ||
        error.response?.data ||
        error.message ||
        "An error occurred"
      );
    }
  }
);



  

const changeMobileNoSlice = createSlice({
  name: "mobileNumber",
  initialState: {
    mobileNumber: [], // Changed to match what you use in reducers
    otp:[],
    security:[],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changePin.pending, (state) => { // Changed to changePin
        state.status = "loading";
        state.error = null;
      })
      .addCase(changePin.fulfilled, (state, action) => { // Changed to changePin
        state.status = "succeeded";
        state.mobileNumber = action.payload; 
      })
      .addCase(changePin.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(verifyPinOtp.pending, (state) => { // Changed to verifyPinOtp
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyPinOtp.fulfilled, (state, action) => { // Changed to verifyPinOtp
        state.status = "succeeded";
        state.otp = action.payload; 
      })
      .addCase(verifyPinOtp.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      })
      .addCase(verifyPinSecurity.pending, (state) => { // Changed to verifyPinSecurity
        state.status = "loading";
        state.error = null;
      })
      .addCase(verifyPinSecurity.fulfilled, (state, action) => { // Changed to verifyPinSecurity
        state.status = "succeeded";
        state.security = action.payload; 
      })
      .addCase(verifyPinSecurity.rejected, (state, action) => { // Changed to fetchCustomerPoints
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default changeMobileNoSlice.reducer;