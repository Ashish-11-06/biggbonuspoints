import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import securityQuestionsApi from "../api/securityQuestionsApi";

// Async thunk for fetching data
export const getSecurityQuestions = createAsyncThunk(
  "securityQuestions/getSecurityQuestions",
  async (data, { rejectWithValue }) => {
    try {
      const response = await securityQuestionsApi.securityQuestions(data);
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

const securityQuestionsSlice = createSlice({
  name: "securityQuestions",
  initialState: {
    securityQuestions: [], // Ensure it's an array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSecurityQuestions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSecurityQuestions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.securityQuestions = action.payload; 
      })
      .addCase(getSecurityQuestions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default securityQuestionsSlice.reducer;
