import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // Ensure correct path

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable checks for non-serializable values
    }),
});

export default store;
