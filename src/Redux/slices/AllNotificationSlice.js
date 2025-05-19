import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import notificationApi from "../api/notificationApi";

// Async thunk for fetching data
export const fetchNotificationById = createAsyncThunk(
  "user/fetchNotificationById",
  async ({user_id,user_category}, { rejectWithValue }) => {
    console.log("user",user_id);
    console.log("user_category",user_category);
    
    try {
      const response = await notificationApi.notification({user_id,user_category});
      console.log(response);
      
      if (response.status === 200 && response.data) {
        console.log("fetchNotificationById response:", response.data);
        console.log("fetchNotificationById response:", response.data.transaction_history);
        
        return response.data; // Ensure response contains valid data
      }
      throw new Error("Invalid response from server");
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const notificationByIdSlice = createSlice({
  name: "notificationById",
  initialState: {
    notification: [], // Ensure it's an array
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotificationById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notification = action.payload; 
      })
      .addCase(fetchNotificationById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default notificationByIdSlice.reducer;
