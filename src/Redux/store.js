import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import pointsReducer from "./slices/pointsSlice"; 
import customerPointsReducer from "./slices/customerPointsSlice";
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    points: pointsReducer,       // Add this if you're using it
    customerPoints: customerPointsReducer,  // Add this reducer
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;