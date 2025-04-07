import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import pointsReducer from "./slices/pointsSlice"; 
import customerPointsReducer from "./slices/customerPointsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    points: pointsReducer,       // Add this if you're using it
    customerPoints: customerPointsReducer,  // Add this reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;